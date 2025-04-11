#include "./mongoose/mongoose.h"
#include <stdlib.h>
#include <stdio.h>
#include <unistd.h>
#include <signal.h>
#include <time.h>
#include <sys/types.h>
#include <string.h>
#include <curl/curl.h>
#include <sys/stat.h> 
#include <sys/wait.h> 
#include <dirent.h>   
#include <errno.h>
#include <unistd.h>




// 전역 상태 변수
static int streaming_active = 0;
static int timelapse_active = 0;
static int ai_active = 0;
static pid_t streaming_pid = 0;
static pid_t timelapse_pid = 0;
static pid_t ai_pid = 0;
static char study_json_file[256] = "/home/test/data/study.json";
static char pose_json_file[256] = "/home/test/data/pose.json";
static char current_timelapse_dir[256] = {0};
static char current_ai_images_dir[256] = {0};
static char current_json_file[256] = {0};
static char rpi4_ip_address[64] = "192.168.137.1"; // 라즈베리파이4 로컬 IP 주소
static char s3_bucket_name[64] = "desktests3";
static char current_timelapse_id[64] = {0}; // 타임랩스 식별자 저장 변수
// 함수 프로토타입 추가
static int create_study_json(const char* rpi4_json, const char* drowsy_json, const char* output_json);
static int create_pose_json(const char* rpi4_json, const char* shoulder_tilt_json, const char* url_json, const char* output_json);
static int send_json_to_backend(const char* json_file, const char* api_url);

static char last_ngrok_url[256] = {0}; // 마지막으로 가져온 ngrok URL

#define MG_HTTP_OK 200
#define MG_HTTP_INTERNAL_SERVER_ERROR 500

static const char* web_backend_url = "https://j12b102.p.ssafy.io/api";

#define EMPTY_JSON_PATH "/tmp/empty_placeholder.json"

// 프로세스 종료 함수
static void kill_process(pid_t pid) {
  if (pid > 0) {
    kill(pid, SIGTERM);
    usleep(300000); // 300ms 대기
    if (kill(pid, 0) == 0) { // 프로세스가 아직 살아있음
      kill(pid, SIGKILL); // 강제 종료
    }
  }
}

// ngrok URL을 가져오기 위한 응답 데이터 구조체
struct MemoryStruct {
    char *memory;
    size_t size;
};

// libcurl 콜백 함수: 응답 데이터를 메모리에 저장
static size_t WriteMemoryCallback(void *contents, size_t size, size_t nmemb, void *userp) {
    size_t realsize = size * nmemb;
    struct MemoryStruct *mem = (struct MemoryStruct *)userp;

    char *ptr = realloc(mem->memory, mem->size + realsize + 1);
    if (!ptr) {
        printf("메모리 할당 실패\n");
        return 0;
    }

    mem->memory = ptr;
    memcpy(&(mem->memory[mem->size]), contents, realsize);
    mem->size += realsize;
    mem->memory[mem->size] = 0;

    return realsize;
}

// ngrok URL 가져오기 함수
static char* get_ngrok_url() {
    CURL *curl;
    CURLcode res;
    struct MemoryStruct chunk;

    chunk.memory = malloc(1); // 초기 메모리 할당
    if (!chunk.memory) {
        printf("메모리 할당 실패\n");
        return NULL;
    }
    chunk.size = 0;

    curl_global_init(CURL_GLOBAL_ALL);
    curl = curl_easy_init();

    if (curl) {
        // ngrok API URL 설정
        curl_easy_setopt(curl, CURLOPT_URL, "http://127.0.0.1:4040/api/tunnels");
        curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, WriteMemoryCallback);
        curl_easy_setopt(curl, CURLOPT_WRITEDATA, (void *)&chunk);

        // ngrok API 호출
        printf("ngrok API 호출 중...\n");
        res = curl_easy_perform(curl);
        if (res != CURLE_OK) {
            printf("ngrok URL 가져오기 실패: %s\n", curl_easy_strerror(res));
            free(chunk.memory);
            curl_easy_cleanup(curl);
            return NULL;
        }

        printf("ngrok API 호출 성공\n");

        // 응답 데이터 출력
        printf("ngrok API 응답 데이터: %s\n", chunk.memory);

        curl_easy_cleanup(curl);

        // JSON에서 public_url 추출
        char *url_start = strstr(chunk.memory, "\"public_url\":\"");
        if (url_start) {
            url_start += strlen("\"public_url\":\"");
            char *url_end = strchr(url_start, '"');
            if (url_end) {
                *url_end = '\0'; // 문자열 종료
                char *ngrok_url = strdup(url_start); // URL 복사
                free(chunk.memory);
                printf("ngrok URL 추출 성공: %s\n", ngrok_url);
                return ngrok_url;
            } else {
                printf("ngrok URL 추출 실패: public_url의 끝을 찾을 수 없습니다.\n");
            }
        } else {
            printf("ngrok URL 추출 실패: 응답 데이터에 public_url이 없습니다.\n");
        }

        free(chunk.memory);
    } else {
        printf("CURL 초기화 실패\n");
    }

    return NULL; // 실패 시 NULL 반환
}



// MJPG-Streamer 시작 함수
static int start_streaming() {
    if (streaming_active) return 1; // 이미 실행 중

    // 이전 프로세스 정리
    if (streaming_pid > 0) {
        kill_process(streaming_pid);
        streaming_pid = 0;
    }

    pid_t pid = fork();
    if (pid == 0) { // 자식 프로세스
        // 작업 디렉토리 변경
        chdir("/home/test/mjpg-streamer/mjpg-streamer-experimental");

        // 출력 리다이렉션
        freopen("/tmp/mjpg-streamer.log", "w", stdout);
        freopen("/tmp/mjpg-streamer.err", "w", stderr);

        // 환경 변수 설정
        setenv("LD_LIBRARY_PATH", ".", 1);

        // MJPG-Streamer 실행
        execl("./mjpg_streamer", "mjpg_streamer",
             "-i", "./input_uvc.so -d /dev/video0 -r 640x480 -f 10",
             "-o", "./output_http.so -p 8080", NULL);

        exit(1); // 실행 실패 시
    } else if (pid < 0) {
        perror("스트리밍 시작 실패");
        return 0;
    }

    streaming_pid = pid;
    streaming_active = 1;
    printf("스트리밍 시작됨 (PID: %d)\n", streaming_pid);

    // 프로세스 상태 확인
    usleep(500000); // 500ms 대기
    if (kill(streaming_pid, 0) != 0) {
        printf("스트리밍 프로세스가 시작됐지만 종료됨\n");
        streaming_active = 0;
        streaming_pid = 0;
        return 0;
    }

    // ngrok URL 가져오기
    char *ngrok_url = get_ngrok_url();
    if (!ngrok_url) {
        printf("ngrok URL을 가져오지 못했습니다.\n");
        return 0;
    }

    printf("ngrok URL 추출 성공: %s\n", ngrok_url);

    // 전역 변수에 저장
    snprintf(last_ngrok_url, sizeof(last_ngrok_url), "%s", ngrok_url);

    free(ngrok_url); // 메모리 해제

    return 1; // 스트리밍 시작 성공
}


// 스트리밍 종료 함수
static void stop_streaming() {
  if (streaming_pid > 0) {
    kill_process(streaming_pid);
    streaming_pid = 0;
  }
  streaming_active = 0;
  printf("스트리밍 종료됨\n");
}

// 라즈베리파이5의 AI 시작 함수
static int start_ai() {
  if (ai_active) return 1; // 이미 실행 중
  
  // 이전 프로세스 정리
  if (ai_pid > 0) {
    kill_process(ai_pid);
    ai_pid = 0;
  }
  
  // AI 출력 디렉토리 생성
  time_t now = time(NULL);
  struct tm *t = localtime(&now);
  snprintf(current_ai_images_dir, sizeof(current_ai_images_dir), 
          "/home/test/ai_data");
  
  char mkdir_cmd[512];
  snprintf(mkdir_cmd, sizeof(mkdir_cmd), "mkdir -p %s", current_ai_images_dir);
  system(mkdir_cmd);
  
  // AI 프로세스 시작
  pid_t pid = fork();
  if (pid == 0) { // 자식 프로세스
    // 작업 디렉토리 변경
    chdir("/home/test/ai_env");
    
    // 출력 리다이렉션
    freopen("/tmp/ai.log", "w", stdout);
    freopen("/tmp/ai.err", "w", stderr);
    
    // AI 스크립트 실행
    execl("/home/test/ai_env/bin/python3", "python3", "/home/test/ai_env/test.py", 
         "--output_dir", current_ai_images_dir, NULL);
    
    chdir("/home/test/ai_env");
    
    exit(1); // 실행 실패 시
  } 
  else if (pid < 0) {
    perror("AI 시작 실패");
    return 0;
  }
  
  ai_pid = pid;
  ai_active = 1;
  printf("AI 시작됨 (PID: %d)\n", ai_pid);
  
  // 프로세스 상태 확인
  usleep(500000); // 500ms 대기
  if (kill(ai_pid, 0) != 0) {
    printf("AI 프로세스가 시작됐지만 종료됨\n");
    ai_active = 0;
    ai_pid = 0;
    return 0;
  }
  
  return 1;
}

// AI 종료 함수
static void stop_ai() {
  if (ai_pid > 0) {
    kill_process(ai_pid);
    ai_pid = 0;
  }
  ai_active = 0;
  printf("AI 종료됨\n");
}

// 라즈베리파이4에 시작 신호 보내기
static int send_start_signal_to_rpi4() {
  char command[512];
  snprintf(command, sizeof(command), 
          "curl -X POST http://%s:8000/api/start -H \"Content-Type: application/json\" -d '{}'",
          rpi4_ip_address);
  
  printf("라즈베리파이4에 시작 신호 전송 중...\n");
  int result = system(command);
  printf("신호 전송 %s\n", result == 0 ? "성공" : "실패");
  
  return (result == 0);
}

// 라즈베리파이4에 종료 신호 보내기
static int send_stop_signal_to_rpi4() {
  char command[512];
  snprintf(command, sizeof(command), 
          "curl -X POST http://%s:8000/api/stop -H \"Content-Type: application/json\" -d '{}'",
          rpi4_ip_address);
  
  printf("라즈베리파이4에 종료 신호 전송 중...\n");
  int result = system(command);
  printf("신호 전송 %s\n", result == 0 ? "성공" : "실패");
  
  return (result == 0);
}

// 타임랩스 시작 함수
static int start_timelapse() {
    if (timelapse_active) return 1; // 이미 실행 중

    // 디렉토리 이름 생성
    time_t now = time(NULL);
    struct tm *t = localtime(&now);
    snprintf(current_timelapse_dir, sizeof(current_timelapse_dir), 
             "/home/test/timelapse/tl_%04d-%02d-%02d_%02d-%02d-%02d",
             t->tm_year + 1900, t->tm_mon + 1, t->tm_mday,
             t->tm_hour, t->tm_min, t->tm_sec);

    // 디렉토리 생성
    char mkdir_cmd[512];
    snprintf(mkdir_cmd, sizeof(mkdir_cmd), "mkdir -p %s", current_timelapse_dir);
    system(mkdir_cmd);

    // 타임랩스 프로세스 시작
    pid_t pid = fork();
    if (pid == 0) { // 자식 프로세스
        // 출력 리다이렉션
        freopen("/tmp/timelapse.log", "w", stdout);
        freopen("/tmp/timelapse.err", "w", stderr);

        // 타임랩스 명령 실행 (1초 간격으로 이미지 캡처)
        char cmd[512];
        snprintf(cmd, sizeof(cmd), 
                 "while true; do "
                 "filename=%s/img_$(date +%%Y%%m%%d_%%H%%M%%S).jpg; "
                 "fswebcam -d /dev/video0 -r 1920x1080 --jpeg 95 $filename; "
                 "sleep 1; "
                 "done",
                 current_timelapse_dir);

        execl("/bin/sh", "sh", "-c", cmd, NULL);
        exit(1); // 실행 실패 시
    } else if (pid < 0) {
        perror("타임랩스 시작 실패");
        return 0;
    }

    timelapse_pid = pid;
    timelapse_active = 1;
    printf("타임랩스 시작됨 (PID: %d, 디렉토리: %s)\n", timelapse_pid, current_timelapse_dir);

    return 1;
}


// 타임랩스 종료 및 영상 생성 함수
static int stop_timelapse() {
    if (timelapse_pid > 0) {
        kill_process(timelapse_pid);
        timelapse_pid = 0;
    }
    timelapse_active = 0;
    printf("타임랩스 종료됨\n");

    // 타임랩스 영상 생성
    char ffmpeg_cmd[512];
    snprintf(ffmpeg_cmd, sizeof(ffmpeg_cmd),
             "cd %s && "
             "ffmpeg -framerate 10 -pattern_type glob -i '*.jpg' "
             "-c:v libx264 -pix_fmt yuv420p timelapse.mp4",
             current_timelapse_dir);

    printf("타임랩스 영상 생성 중...\n");
    int result = system(ffmpeg_cmd);
    if (result != 0) {
        printf("타임랩스 영상 생성 실패\n");
        return 0; // 실패 시 반환
    }

    printf("타임랩스 영상 생성 성공\n");

}



// S3에 타임랩스 업로드 함수
static char* upload_timelapse_to_s3() {
    static char s3_url[512]; // 업로드된 S3 URL 저장
    char s3_cmd[512];
    
    // 고유한 파일 이름 생성 (타임랩스 ID 포함)
		char filename[128];
		snprintf(filename, sizeof(filename), "timelapse_%s.mp4", current_timelapse_id);
		
    // 업로드 명령어 수정
		snprintf(s3_cmd, sizeof(s3_cmd), 
        "aws s3 cp %s/timelapse.mp4 s3://%s/timelapse/%s --quiet",
        current_timelapse_dir, s3_bucket_name, filename);

    printf("타임랩스 영상 S3 업로드 중...\n");
    int result = system(s3_cmd);
    if (result != 0) {
        printf("타임랩스 영상 S3 업로드 실패\n");
        return NULL;
    }

		// 공개 URL 생성
		snprintf(s3_url, sizeof(s3_url), 
        "https://%s.s3.amazonaws.com/timelapse/%s", 
        s3_bucket_name, filename);
    printf("타임랩스 영상 S3 URL: %s\n", s3_url);

    return s3_url; // 성공 시 S3 URL 반환
}

// 타임랩스 영상 S3 URL을 백엔드에 전송하는 함수
static int send_timelapse_url_to_backend(const char* timelapseId, const char* timelapse_url) {
    char cmd[512];
    char filename[128]; // filename 변수 선언 및 초기화
		snprintf(filename, sizeof(filename), "timelapse_%s.mp4", current_timelapse_id);

		snprintf(cmd, sizeof(cmd),
		        "curl -X PUT -H \"Content-Type: application/json\" "
		        "-d '{\"timeLapseUrl\":\"%s\"}' https://j12b102.p.ssafy.io/api/v1/timelapse/%s",
		        timelapse_url, timelapseId); // ✅ 파일명 전달

    printf("타임랩스 URL 전송 중: %s\n", cmd);
    int result = system(cmd);
    printf("타임랩스 URL 전송 %s\n", result == 0 ? "성공" : "실패");

    return (result == 0); // 성공 여부 반환
}



// S3에 AI 이미지 업로드 함수 (수정됨: 이미지가 없을 때 빈 JSON 파일 생성 보장)
static int upload_ai_images_to_s3() {
    char s3_cmd[512];
    char image_urls_json[10240] = "{\"images\":["; // JSON 시작
    int first = 1; // 첫 번째 이미지 여부 플래그
    int image_found = 0; // 이미지 발견 여부 플래그

    // 디렉토리 존재 여부 확인
    struct stat st = {0};
    if (stat(current_ai_images_dir, &st) == -1) {
        fprintf(stderr, "경고: AI 이미지 디렉토리를 찾을 수 없습니다: %s\n", current_ai_images_dir);
        // 디렉토리가 없어도 빈 JSON 파일은 생성해야 함
    } else {
        // 디렉토리 내 이미지 파일 찾기
        DIR *dir;
        struct dirent *ent;
        if ((dir = opendir(current_ai_images_dir)) != NULL) {
            while ((ent = readdir(dir)) != NULL) {
                // .jpg 확장자 파일만 처리
                if (strstr(ent->d_name, ".jpg") != NULL) {
                    image_found = 1; // 이미지 발견!
                    char local_file[512];
                    snprintf(local_file, sizeof(local_file), "%s/%s", current_ai_images_dir, ent->d_name);

                    // S3 URL 생성
                    char s3_url[512];
                    snprintf(s3_url, sizeof(s3_url),
                             "https://%s.s3.amazonaws.com/ai-images/%s",
                             s3_bucket_name, ent->d_name);

                    // S3 업로드 명령어 생성 (기존과 동일)
                    snprintf(s3_cmd, sizeof(s3_cmd),
                             "aws s3 cp \"%s\" \"s3://%s/ai-images/%s\" --quiet",
                             local_file, s3_bucket_name, ent->d_name);

                    printf("이미지 S3 업로드 중: %s\n", local_file);
                    int result = system(s3_cmd);
                    if (result != 0) {
                        fprintf(stderr, "이미지 업로드 실패: %s (명령어: %s)\n", local_file, s3_cmd);
                        // 업로드 실패 시 해당 이미지는 JSON에 포함하지 않음 (선택적)
                        // closedir(dir);
                        // return 0; // 또는 전체 실패 처리
                    } else {
                        // 업로드 성공 시 JSON에 추가
                        if (!first) {
                            strcat(image_urls_json, ",");
                        }
                        strcat(image_urls_json, "{\"url\":\"");
                        strcat(image_urls_json, s3_url);
                        strcat(image_urls_json, "\"}");
                        first = 0; // 첫 번째 이미지는 처리 완료
                    }
                }
            }
            closedir(dir);
        } else {
            // 디렉토리를 열 수 없는 경우 (권한 문제 등)
            fprintf(stderr, "오류: AI 이미지 디렉토리를 열 수 없습니다 (%s): %s\n", current_ai_images_dir, strerror(errno));
            // 이 경우에도 빈 JSON 파일 생성 시도
        }
    }

    // JSON 배열 닫기
    strcat(image_urls_json, "]}");

    // --- 중요: /tmp/s3_image_urls.json 파일 생성 ---
    const char* url_json_path = "/tmp/s3_image_urls.json";
    FILE *fp = fopen(url_json_path, "w");
    if (fp == NULL) {
        perror("오류: S3 이미지 URL JSON 파일 생성 실패");
        return 0; // 파일 생성 실패 시 함수 실패 반환
    }

    // 생성된 JSON 문자열(이미지 URL 포함 또는 빈 배열)을 파일에 씀
    fprintf(fp, "%s", image_urls_json);
    fclose(fp);

    // 파일 생성 결과 로그
    if (image_found && !first) { // 이미지가 하나 이상 성공적으로 처리된 경우
         printf("S3 이미지 URL JSON 파일 생성 완료: %s (내용 포함)\n", url_json_path);
    } else { // 이미지가 없거나 모두 실패한 경우
         printf("S3 이미지 URL JSON 파일 생성 완료: %s (내용: {\"poseUrl\":[]})\n", url_json_path);
    }

    return 1; // 파일 생성 성공 시 1 반환
}



#include <sys/wait.h> // WEXITSTATUS 등 사용
#include <unistd.h>   // access 함수 사용
#include <errno.h>    // errno 사용

// study.json 생성 함수 (수정됨: jq 스크립트 파일을 사용)
static int create_study_json(const char* rpi4_json, const char* drowsy_json, const char* output_json) {

    // jq 스크립트 파일 경로 정의
    const char* jq_script_file = "study_filter.jq"; // *** 경로 확인 필요 ***

    // jq 스크립트 파일 존재 확인
    if (access(jq_script_file, F_OK) == -1) {
        fprintf(stderr, "오류: jq 스크립트 파일을 찾을 수 없습니다: %s\n", jq_script_file);
        perror("access 확인 실패 이유");
        return 0;
    }

    // 입력 파일 존재 확인
    if (access(rpi4_json, F_OK) == -1) { fprintf(stderr, "경고(study): 입력 파일 없음 - %s\n", rpi4_json); /* 계속 진행 또는 return 0 */ }
    if (access(drowsy_json, F_OK) == -1) { fprintf(stderr, "경고(study): 입력 파일 없음 - %s\n", drowsy_json); /* 계속 진행 또는 return 0 */ }


    char command[1024]; // 명령어 버퍼

    // jq 명령어 수정: -f 옵션으로 스크립트 파일 지정
    // 입력 파일 순서: rpi4_json, drowsy_json
    snprintf(command, sizeof(command),
             "jq -s -f %s %s %s > %s",
             jq_script_file,       // jq 스크립트 파일 경로 (-f 옵션 사용)
             rpi4_json,            // 입력 파일 1 (스크립트 내 .[0])
             drowsy_json,          // 입력 파일 2 (스크립트 내 .[1])
             output_json);         // 출력 파일

    printf("study.json 생성 명령 (파일 사용): %s\n", command);

    // system() 함수로 jq 명령어 실행 및 결과 확인
    int result = system(command);
    int exit_status = -1;
    if (result == -1) {
        perror("system() 호출 실패 (study.json)");
        return 0;
    } else {
        if (WIFEXITED(result)) { exit_status = WEXITSTATUS(result); }
        else if (WIFSIGNALED(result)) { fprintf(stderr, "jq 프로세스(study)가 시그널 %d 에 의해 종료됨.\n", WTERMSIG(result)); return 0; }
        else { fprintf(stderr, "jq 프로세스(study) 알 수 없는 이유로 종료. system() 반환값: %d\n", result); return 0; }
    }
    if (exit_status != 0) {
        fprintf(stderr, "jq 명령어 실행 실패 (study.json), 종료 코드: %d\n", exit_status);
        return 0;
    }

    printf("study.json 생성 완료 (jq 스크립트 파일 사용)\n");
    return 1;
}

// 임시 빈 JSON 파일 경로 정의
#define EMPTY_JSON_PATH "/tmp/empty_placeholder.json"

// pose.json 생성 함수 (수정됨: 입력 파일 유효성 검사 강화)
static int create_pose_json(const char* rpi4_json, const char* shoulder_tilt_json, const char* url_json_input_path, const char* output_json) {

    const char* jq_script_file = "pose_filter.jq";
    const char* final_url_input_path = url_json_input_path; // 최종적으로 jq에 전달될 경로
    int use_placeholder = 0; // 빈 JSON 대체 파일 사용 여부 플래그

    // 1. jq 스크립트 파일 존재 확인
    if (access(jq_script_file, F_OK) == -1) {
        fprintf(stderr, "오류: jq 스크립트 파일을 찾을 수 없습니다: %s\n", jq_script_file);
        perror("access 확인 실패 이유");
        return 0;
    }

    // 2. 입력 JSON 파일들 존재 확인 (디버깅용)
    if (access(rpi4_json, F_OK) == -1) fprintf(stderr, "경고: 입력 파일 없음 - %s\n", rpi4_json);
    if (access(shoulder_tilt_json, F_OK) == -1) fprintf(stderr, "경고: 입력 파일 없음 - %s\n", shoulder_tilt_json);

    // 3. URL 입력 파일 유효성 검사 (존재 및 0바이트 여부)
    struct stat url_stat;
    if (stat(url_json_input_path, &url_stat) == -1 || url_stat.st_size == 0) {
        // 파일이 없거나 크기가 0이면
        if (stat(url_json_input_path, &url_stat) == -1) {
             fprintf(stderr, "경고: URL 입력 파일 없음 - %s. 빈 JSON({})을 사용합니다.\n", url_json_input_path);
        } else {
             fprintf(stderr, "경고: URL 입력 파일이 비어있습니다(0 바이트) - %s. 빈 JSON({})을 사용합니다.\n", url_json_input_path);
        }

        // 임시 빈 JSON 파일 생성 시도
        FILE *empty_fp = fopen(EMPTY_JSON_PATH, "w");
        if (empty_fp) {
            fprintf(empty_fp, "{}"); // 빈 JSON 객체 내용
            fclose(empty_fp);
            final_url_input_path = EMPTY_JSON_PATH; // jq 입력 경로를 임시 파일로 변경
            use_placeholder = 1;
        } else {
            perror("경고: 임시 빈 JSON 파일을 생성할 수 없습니다.");
            // 임시 파일 생성 실패 시, 이전처럼 없는 파일 경로를 그대로 전달 (jq try-catch에 의존)
            // 또는 여기서 아예 실패 처리할 수도 있음
            // return 0;
        }
    }

    char command[1024]; // 명령어 버퍼

    // jq 명령어 생성: 최종 URL 입력 경로 사용
    snprintf(command, sizeof(command),
             "jq -s -f %s %s %s %s > %s",
             jq_script_file,
             rpi4_json,
             shoulder_tilt_json,
             final_url_input_path, // 파일이 없거나 비면 EMPTY_JSON_PATH 가 됨
             output_json);

    printf("pose.json 생성 명령 (입력 검증됨): %s\n", command);

    // system() 함수로 jq 명령어 실행
    int result = system(command);
    int exit_status = -1;

    // system() 반환값 처리
    if (result == -1) {
        perror("system() 호출 실패");
        // 임시 파일 사용했으면 삭제 시도
        if (use_placeholder) remove(EMPTY_JSON_PATH);
        return 0;
    } else {
         // ... (이전 답변과 동일한 WIFEXITED, WIFSIGNALED 처리) ...
        if (WIFEXITED(result)) { exit_status = WEXITSTATUS(result); }
        else if (WIFSIGNALED(result)) { fprintf(stderr, "jq 프로세스가 시그널 %d 에 의해 종료됨.\n", WTERMSIG(result)); if (use_placeholder) remove(EMPTY_JSON_PATH); return 0; }
        else { fprintf(stderr, "jq 프로세스 알 수 없는 이유로 종료. system() 반환값: %d\n", result); if (use_placeholder) remove(EMPTY_JSON_PATH); return 0; }
    }

    // 임시 파일 사용했으면 삭제
    if (use_placeholder) {
        remove(EMPTY_JSON_PATH);
    }

    // jq 명령어 실행 결과 확인 (정상 종료 코드 0)
    if (exit_status != 0) {
        fprintf(stderr, "jq 명령어 실행 실패, 종료 코드: %d\n", exit_status);
        return 0; // 실패 반환
    }

    printf("pose.json 생성 완료 (jq 스크립트 파일 사용, 입력 검증됨)\n");
    return 1; // 성공 반환
}

// 웹 백엔드로 JSON 데이터 전송 함수 (수정됨)
static int send_json_to_backend(const char* json_file, const char* api_url) {
  char cmd[1024]; // URL 및 파일 경로 길이를 고려하여 버퍼 크기 증가

  // *** 버그 수정: web_backend_url 대신 api_url 사용 ***
  // URL에 특수문자가 포함될 수 있으므로 URL을 따옴표로 감싸주는 것이 안전함.
  snprintf(cmd, sizeof(cmd),
           "curl -L -X POST -H \"Content-Type: application/json\" -d @\"%s\" \"%s\"", // 파일 경로와 URL을 따옴표로 감쌈, -L 옵션 추가
           json_file, api_url); // <-- api_url 사용하도록 수정!

  printf("JSON 데이터 백엔드로 전송 중 (대상: %s)...\n", api_url); // 로그에 대상 URL 추가
  printf("실행 명령어: %s\n", cmd); // 실제 실행되는 명령어 확인

  int result = system(cmd);

  // system() 함수의 반환값만으로는 실제 HTTP 성공 여부 판단 어려움
  if (result == 0) {
    printf("curl 명령어 실행 완료 (HTTP 성공 여부는 별도 확인 필요). 전송 성공으로 간주.\n");
    return 1; // 일단 curl 실행 성공 시 1 반환
  } else {
    int exit_status = -1;
    if (WIFEXITED(result)) {
        exit_status = WEXITSTATUS(result);
    }
    fprintf(stderr, "curl 명령어 실행 실패, system() 반환 코드: %d, curl 종료 코드: %d\n", result, exit_status);
    printf("전송 실패\n");
    return 0;
  }
}

// HTTP 요청 처리 함수
static void fn(struct mg_connection *c, int ev, void *ev_data) {
	if (ev == MG_EV_HTTP_MSG) {
	  struct mg_http_message *hm = (struct mg_http_message *) ev_data;
    
		// API 1: 스트리밍 시작 (새로운 요청 형식: /api/v1/stream)
		if (mg_match(hm->uri, mg_str("/api/v1/stream"), NULL)) {
	    int result = start_streaming();
	    if (result) {
        // start_streaming() 함수에서 동적으로 가져온 ngrok URL 사용
        extern char last_ngrok_url[256]; // start_streaming()에서 설정된 ngrok URL
        mg_http_reply(c, 200, "Content-Type: application/json\r\n",
                      "{\"status\":\"success\",\"message\":\"스트리밍 시작 성공\",\"streaming_url\":\"%s?action=stream\"}\n",
                      last_ngrok_url);
	    } else {
        mg_http_reply(c, 500, "Content-Type: application/json\r\n",
                      "{\"status\":\"error\",\"message\":\"스트리밍 시작 실패\"}\n");
	    }
		}
    
    // API 2: 프로세스 시작 (타임랩스 ID를 URL에서 추출)
    else if (hm->uri.len >= 24 && memcmp(hm->uri.buf, "/api/v1/start-timelapse/", 24) == 0) {
      char timelapseId[64] = {0};
      int id_len = hm->uri.len - 24;
      if (id_len < (int) sizeof(timelapseId)) {
        memcpy(timelapseId, hm->uri.buf + 24, id_len);
        timelapseId[id_len] = '\0';
        strcpy(current_timelapse_id, timelapseId);
      }
      
      if (streaming_active) {
        stop_streaming();
      }
      
      int timelapse_result = start_timelapse();
      int ai_result = start_ai();
      int rpi4_result = send_start_signal_to_rpi4();
      
      mg_http_reply(c, 200, "Content-Type: application/json\r\n", 
        "{\"status\":\"%s\",\"message\":\"%s\",\"timelapse\":%d,\"ai\":%d,\"rpi4_signal\":%d,\"timelapseId\":\"%s\"}\n", 
        (timelapse_result && ai_result && rpi4_result) ? "success" : "partial_error", 
        (timelapse_result && ai_result && rpi4_result) ? "프로세스가 시작되었습니다" : "일부 프로세스 시작 실패",
        timelapse_active, ai_active, rpi4_result, timelapseId);
    }
    
		// API 3: 프로세스 종료 및 데이터 처리 (타임랩스 ID를 URL에서 추출)
else if (hm->uri.len >= 25 && memcmp(hm->uri.buf, "/api/v1/finish-timelapse/", 25) == 0) {
    char timelapseId[64] = {0}; // 타임랩스 ID를 저장할 변수
    int id_len = hm->uri.len - 25; // "/api/v1/finish-timelapse/" 이후의 길이 계산

    if (id_len < (int) sizeof(timelapseId)) {
        memcpy(timelapseId, hm->uri.buf + 25, id_len); // 타임랩스 ID 추출
        timelapseId[id_len] = '\0'; // 문자열 끝에 NULL 추가
        printf("Received timelapseId: %s\n", timelapseId); // 디버깅용 출력
    } else {
        mg_http_reply(c, 400, "Content-Type: application/json\r\n",
                      "{\"status\":\"error\",\"message\":\"Invalid timelapse ID\"}\n");
        return;
    }
    
    // AI process shutdown
	if (ai_active) {
		stop_ai(); // AI stop
	}
    
    // 라즈베리파이 4로 종료 신호 전송
    int rpi4_result = send_stop_signal_to_rpi4();
    if (!rpi4_result) {
        printf("라즈베리파이 4로 종료 신호 전송 실패\n");
        mg_http_reply(c, 500, "Content-Type: application/json\r\n",
                      "{\"status\":\"error\",\"message\":\"Failed to send stop signal to Raspberry Pi 4\"}\n");
        return;
    }

    printf("라즈베리파이 4로 종료 신호 전송 성공\n");
    
    
    mg_http_reply(c, 201, "Content-Type: application/json\r\n",
                  "{\"status\":\"success\",\"message\":\"Request received successfully\",\"timelapseId\":\"%s\"}\n",
                  timelapseId);
	
	
	
	
    // 타임랩스 종료 및 영상 생성
    if (timelapse_pid > 0) {
        kill_process(timelapse_pid);
        timelapse_pid = 0;
    }
    timelapse_active = 0;
    printf("타임랩스 종료됨\n");

    char ffmpeg_cmd[512];
    snprintf(ffmpeg_cmd, sizeof(ffmpeg_cmd),
             "cd %s && "
             "ffmpeg -framerate 10 -pattern_type glob -i '*.jpg' "
             "-c:v libx264 -pix_fmt yuv420p timelapse.mp4",
             current_timelapse_dir);

    printf("타임랩스 영상 생성 중...\n");
    int timelapse_result = system(ffmpeg_cmd);
    if (timelapse_result != 0) {
        printf("타임랩스 영상 생성 실패\n");
        mg_http_reply(c, 500, "Content-Type: application/json\r\n",
                      "{\"status\":\"error\",\"message\":\"Failed to create timelapse video\"}\n");
        return;
    }

    printf("타임랩스 영상 생성 성공\n");

    // S3 업로드 및 데이터 전송
    char* s3_url = upload_timelapse_to_s3();
    if (!s3_url) {
        mg_http_reply(c, 500, "Content-Type: application/json\r\n",
                      "{\"status\":\"error\",\"message\":\"Failed to upload timelapse to S3\"}\n");
        return;
    }

    int url_send_result = send_timelapse_url_to_backend(timelapseId, s3_url);
    if (!url_send_result) {
        mg_http_reply(c, 500, "Content-Type: application/json\r\n",
                      "{\"status\":\"error\",\"message\":\"Failed to send timelapse URL to backend\"}\n");
        return;
    }

    int upload_result = upload_ai_images_to_s3();
    if (!upload_result) {
        printf("이미지 업로드 실패\n");
        return;
    }
    
    printf("Background processing completed\n");
}



    
    // API 4: 라즈베리파이4에서 JSON 파일 수신
    else if (mg_match(hm->uri, mg_str("/api/receive-json"), NULL)) {
      FILE *fp = fopen("/tmp/rpi4_data.json", "wb");
      if (fp != NULL) {
        fwrite(hm->body.buf, 1, hm->body.len, fp);
        fclose(fp);
        
        mg_http_reply(c, 200, "Content-Type: application/json\r\n", 
          "{\"status\":\"success\",\"message\":\"라즈베리파이4의 JSON 데이터를 수신했습니다\"}\n");
      } else {
        mg_http_reply(c, 500, "Content-Type: application/json\r\n", 
          "{\"status\":\"error\",\"message\":\"JSON 데이터 저장 실패\"}\n");
      }
      
      // study.json 및 pose.json 생성
	    int study_result = create_study_json("/tmp/rpi4_data.json", "/home/test/ai_env/summary_drowsy.json", study_json_file);
	    int pose_result = create_pose_json("/tmp/rpi4_data.json", "/home/test/ai_env/summary_shoulder_tilt.json", "/tmp/s3_image_urls.json", pose_json_file);

	    if (!study_result || !pose_result) {
        printf("JSON 파일 생성 실패\n");
        return; // 실패 시 반환
	    }

	    printf("JSON 파일 생성 성공\n");
	    
	    //별표
	    int study_send_result = send_json_to_backend(study_json_file, "https://j12b102.p.ssafy.io/api/v1/study/save");
	    int pose_send_result = send_json_to_backend(pose_json_file, "https://j12b102.p.ssafy.io/api/v1/pose/score/01");
	    
	    
	    return; // 성공 시 반환
      
      
      

    }
    
    // API 5: 상태 확인
    else if (mg_match(hm->uri, mg_str("/api/status"), NULL)) {
      mg_http_reply(c, 200, "Content-Type: application/json\r\n", 
        "{\"streaming\":%d,\"timelapse\":%d,\"ai\":%d,\"timelapse_dir\":\"%s\",\"ai_dir\":\"%s\"}\n", 
        streaming_active, timelapse_active, ai_active,
        timelapse_active ? current_timelapse_dir : "",
        ai_active ? current_ai_images_dir : "");
    }
    
    // 기타 경로는 404 응답
    else {
      mg_http_reply(c, 404, "Content-Type: application/json\r\n", 
        "{\"status\":\"error\",\"message\":\"요청한 API를 찾을 수 없습니다\"}\n");
    }
  }
}

// 종료 처리 함수
static void cleanup() {
  printf("프로그램 종료 중...\n");
  if (ai_active) {
    stop_ai();
  }
  if (timelapse_active) {
    stop_timelapse();
  }
  if (streaming_active) {
    stop_streaming();
  }
  exit(0);
}

int main() {
  // 종료 시그널 핸들러 등록
  signal(SIGINT, (void (*)(int))cleanup);
  signal(SIGTERM, (void (*)(int))cleanup);
  
  struct mg_mgr mgr;
  mg_mgr_init(&mgr);
  
  // HTTP 서버 설정 (로컬 네트워크에서는 HTTP 사용)
  struct mg_connection *c = mg_http_listen(&mgr, "http://0.0.0.0:8000", fn, NULL);
  if (c == NULL) {
    printf("HTTP 서버 시작 실패. 포트 권한 문제일 수 있습니다.\n");
    printf("'sudo'로 실행하세요.\n");
    return 1;
  }
  
  printf("HTTP 서버가 80 포트에서 시작되었습니다.\n");
  printf("API 엔드포인트:\n");
  printf("1. /api/v1/stream - 스트리밍 시작\n");
  printf("2. /api/v1/start-timelapse/{timelapseId} - 타임랩스, AI 및 RPi4 시작\n");
  printf("3. /api/v1/finish-timelapse/{timelapseId} - 프로세스 종료 및 데이터 처리\n");
  printf("4. /api/receive-json - RPi4에서 JSON 데이터 수신\n");
  printf("5. /api/status - 현재 상태 확인\n");
  
  // 이벤트 루프
  for (;;) {
    mg_mgr_poll(&mgr, 1000);
  }
  
  cleanup();
  mg_mgr_free(&mgr);
  return 0;
}