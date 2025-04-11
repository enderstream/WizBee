#include "mongoose.h"
#include <stdlib.h>
#include <stdio.h>
#include <unistd.h>
#include <signal.h>
#include <time.h>
#include <string.h>
#include <sys/types.h>
#include <sys/stat.h>
#include <curl/curl.h>
#include <dirent.h>

// 전역 변수 정의
static int ai_active = 0;
static pid_t ai_pid = 0;
static char current_json_file[256] = {0};
static char study_data_latest[256] = "/home/test/ai_env/json/study_data_latest.json";
static char drowsy_json_file[256] = "/home/test/ai_env/summary_drowsy.json";
static char merged_json_file[256] = "/home/test/ai_env/merged_result.json";
static char image_dir[256] = "/home/test/ai_env/turtle_neck_images"; // AI가 이미지를 저장하는 디렉토리
static char rpi5_ip_address[64] = "192.168.137.126"; // 라즈베리파이5 로컬 IP 주소
static char s3_bucket_name[64] = "desktests3"; // S3 버킷 이름

// curl 응답을 처리하기 위한 구조체
struct MemoryStruct {
  char *memory;
  size_t size;
};

// curl 콜백 함수: 메모리에 응답 데이터 저장
static size_t WriteMemoryCallback(void *contents, size_t size, size_t nmemb, void *userp) {
  size_t realsize = size * nmemb;
  struct MemoryStruct *mem = (struct MemoryStruct *)userp;
  
  char *ptr = realloc(mem->memory, mem->size + realsize + 1);
  if(!ptr) {
    printf("메모리 할당 실패\n");
    return 0;
  }
  
  mem->memory = ptr;
  memcpy(&(mem->memory[mem->size]), contents, realsize);
  mem->size += realsize;
  mem->memory[mem->size] = 0;
  
  return realsize;
}

// AI 코드 시작 함수
static int start_ai() {
    if (ai_active) return 1; // 이미 실행 중

    // 이전 AI 프로세스 종료
    if (ai_pid > 0) {
        kill(ai_pid, SIGTERM);
        usleep(300000); // 300ms 대기
        if (kill(ai_pid, 0) == 0) { // 프로세스가 아직 실행 중
            kill(ai_pid, SIGKILL); // 강제 종료
        }
        ai_pid = 0;
    }

    // AI 프로세스 시작
    pid_t pid = fork();
    if (pid == 0) { // 자식 프로세스
        // 출력 리다이렉션
        freopen("/tmp/ai.log", "w", stdout);
        freopen("/tmp/ai.err", "w", stderr);

        // AI 코드 실행
        execl("/home/test/ai_env/bin/python3", "python3", "/home/test/ai_env/debug.py", NULL);

        exit(1); // 실행 실패 시
    } else if (pid < 0) {
        perror("AI 시작 실패");
        return 0;
    }

    ai_pid = pid;
    ai_active = 1;
    printf("AI 시작됨 (PID: %d)\n", ai_pid);

    return 1;
}


// AI 종료 함수
static int stop_ai() {
  if (!ai_active) return 1; // 이미 종료됨
  
  if (ai_pid > 0) {
    kill(ai_pid, SIGTERM);
    usleep(500000); // 500ms 대기
    if (kill(ai_pid, 0) == 0) { // 프로세스가 아직 실행 중
      kill(ai_pid, SIGKILL); // 강제 종료
    }
    ai_pid = 0;
  }
  ai_active = 0;
  printf("AI 종료됨\n");
  
  return 1;
}

// S3에 AI 이미지 업로드 함수
static int upload_ai_images_to_s3() {
    char s3_cmd[512];
    char image_urls_json[10240] = "{\"images\":["; // JSON 시작
    int first = 1; // 첫 번째 이미지 여부 플래그

    // 디렉토리 내 이미지 파일 찾기
    DIR *dir;
    struct dirent *ent;
    if ((dir = opendir(image_dir)) != NULL) {
        while ((ent = readdir(dir)) != NULL) {
            // .jpg 확장자 파일만 처리
            if (strstr(ent->d_name, ".jpg") != NULL) {
                char local_file[512];
                snprintf(local_file, sizeof(local_file), "%s/%s", image_dir, ent->d_name);
                
                
                // S3 URL 생성 및 JSON에 추가
                char s3_url[512];
                snprintf(s3_url, sizeof(s3_url),
                         "https://%s.s3.amazonaws.com/ai-images/%s",
                         s3_bucket_name, ent->d_name);

								printf("S3 업로드 명령어: %s\n", s3_cmd);
								
                // S3 업로드 명령어 생성
                snprintf(s3_cmd, sizeof(s3_cmd), 
					         "aws s3 cp \"%s\" \"s3://%s/ai-images/%s\" --quiet",
					         local_file, s3_bucket_name, ent->d_name);
					         


                printf("이미지 S3 업로드 중: %s\n", local_file);
                int result = system(s3_cmd);
                if (result != 0) {
                    printf("이미지 업로드 실패: %s\n", local_file);
                    closedir(dir);
                    return 0; // 실패 시 반환
                }


                if (!first) {
                    strcat(image_urls_json, ",");
                }
                strcat(image_urls_json, "{\"url\":\"");
                strcat(image_urls_json, s3_url);
                strcat(image_urls_json, "\"}");
                first = 0; // 첫 번째 이미지는 처리 완료
            }
        }
        closedir(dir);
    } else {
        perror("이미지 디렉토리를 열 수 없습니다");
        return 0;
    }

    strcat(image_urls_json, "]}"); // JSON 종료

    // JSON 파일 저장
    FILE *fp = fopen("/tmp/s3_image_urls.json", "w");
    if (fp == NULL) {
        perror("JSON 파일 생성 실패");
        return 0;
    }
    fprintf(fp, "%s", image_urls_json);
    fclose(fp);

    printf("S3 이미지 URL JSON 파일 생성 완료: /tmp/s3_image_urls.json\n");
    return 1; // 성공 시 반환
}

// 디렉토리에서 이미지 파일들 찾기
static int find_image_files(char** image_files, int max_files) {
  DIR *dir;
  struct dirent *ent;
  int count = 0;
  
  if ((dir = opendir(image_dir)) != NULL) {
    // 디렉토리 내 모든 파일 검사
    while ((ent = readdir(dir)) != NULL && count < max_files) {
      // jpg, jpeg, png 파일만 선택
      const char* name = ent->d_name;
      int len = strlen(name);
      
      if (len > 4 && (
          (name[len-4] == '.' && (
            strcasecmp(&name[len-3], "jpg") == 0 ||
            strcasecmp(&name[len-3], "png") == 0)) ||
           (len > 5 && name[len-5] == '.' && 
            strcasecmp(&name[len-4], "jpeg") == 0))) {
        
        // 전체 경로 생성
        char* full_path = (char*)malloc(strlen(image_dir) + strlen(name) + 2);
        if (full_path) {
          sprintf(full_path, "%s/%s", image_dir, name);
          image_files[count++] = full_path;
          printf("이미지 파일 발견: %s\n", full_path);
        }
      }
    }
    closedir(dir);
  } else {
    perror("이미지 디렉토리를 열 수 없습니다");
    return 0;
  }
  
  printf("총 %d개의 이미지 파일을 발견했습니다.\n", count);
  return count;
}

// 이미지 URL을 JSON 형식으로 생성
static char* create_image_url_json(char** image_urls, int count) {
  static char json_buffer[10240]; // 충분히 큰 버퍼
  
  // JSON 시작
  strcpy(json_buffer, "{\n  \"images\": [\n");
  
  // 각 이미지 URL 추가
  for (int i = 0; i < count; i++) {
    char entry[512];
    snprintf(entry, sizeof(entry), "    {\n      \"url\": \"%s\"\n    }%s\n", 
             image_urls[i], (i < count - 1) ? "," : "");
    strcat(json_buffer, entry);
  }
  
  // JSON 종료
  strcat(json_buffer, "  ]\n}");
  
  return json_buffer;
}

// JSON 파일 병합 함수
static int merge_json_files(const char* ai_result_json, const char* output_json) {
    char command[512];
    snprintf(command, sizeof(command), 
             "jq -s '.[0] * .[1]' %s /tmp/s3_image_urls.json > %s",
             ai_result_json, output_json);

    printf("JSON 병합 명령: %s\n", command);
    
    int result = system(command);
    
    if (result != 0) {
        printf("JSON 병합 실패\n");
        return 0;
    }

    printf("JSON 병합 성공: %s\n", output_json);
    return 1;
}

static int process_images_and_send_json() {
    printf("이미지 처리 및 JSON 전송 시작...\n");

    // 1. S3에 이미지를 업로드하고 URL 수집
    int upload_result = upload_ai_images_to_s3();
    if (!upload_result) {
        printf("이미지 업로드 실패\n");
        return 0;
    }

    // 2. shoulder_tilt.json과 URL JSON 병합
    int merge_result = 0;
    if (access(study_data_latest, F_OK) != -1) {
        merge_result = merge_json_files(study_data_latest, merged_json_file);
    } else {
        printf("study_data_latest.json 파일이 없습니다: %s\n", study_data_latest);
        return 0;
    }

    if (!merge_result) {
        printf("JSON 병합 실패\n");
        return 0;
    }

    printf("JSON 병합 성공: %s\n", merged_json_file);

    // 3. 병합된 JSON 파일을 라즈베리파이5로 전송
    FILE *fp = fopen(merged_json_file, "rb");
    if (!fp) {
        printf("JSON 파일을 열 수 없습니다: %s\n", merged_json_file);
        return 0;
    }

    // 파일 크기 확인
    fseek(fp, 0, SEEK_END);
    long fileSize = ftell(fp);
    fseek(fp, 0, SEEK_SET);

    // 파일 내용 읽기
    char *buffer = (char *)malloc(fileSize + 1);
    if (!buffer) {
        fclose(fp);
        printf("메모리 할당 실패\n");
        return 0;
    }

    size_t read_size = fread(buffer, 1, fileSize, fp);
    buffer[read_size] = '\0';
    fclose(fp);

    // CURL 초기화
    CURL *curl;
    CURLcode res;
    curl_global_init(CURL_GLOBAL_ALL);
    curl = curl_easy_init();

    int success = 0;
    if (curl) {
        // 로컬 네트워크에서는 HTTP 사용
        char url[512];
        snprintf(url, sizeof(url), "http://%s:8000/api/receive-json", rpi5_ip_address);

        struct curl_slist *headers = NULL;
        headers = curl_slist_append(headers, "Content-Type: application/json");

        curl_easy_setopt(curl, CURLOPT_URL, url);
        curl_easy_setopt(curl, CURLOPT_POSTFIELDS, buffer);
        curl_easy_setopt(curl, CURLOPT_POSTFIELDSIZE, read_size);
        curl_easy_setopt(curl, CURLOPT_HTTPHEADER, headers);

        // 응답 수집 설정
        struct MemoryStruct chunk;
        chunk.memory = malloc(1);
        chunk.size = 0;

        curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, WriteMemoryCallback);
        curl_easy_setopt(curl, CURLOPT_WRITEDATA, (void *)&chunk);

        // 요청 실행
        res = curl_easy_perform(curl);
        if (res != CURLE_OK) {
            printf("JSON 전송 실패: %s\n", curl_easy_strerror(res));
        } else {
            long http_code = 0;
            curl_easy_getinfo(curl, CURLINFO_RESPONSE_CODE, &http_code);
            if (http_code == 200) {
                printf("JSON 파일 전송 성공: %s\n", merged_json_file);
                printf("응답: %s\n", chunk.memory);
                success = 1;
            } else {
                printf("JSON 전송 실패, HTTP 코드: %ld\n", http_code);
                printf("응답: %s\n", chunk.memory);
            }
        }

        // 메모리 해제
        free(chunk.memory);
        curl_slist_free_all(headers);
        curl_easy_cleanup(curl);
    }

    curl_global_cleanup();
    free(buffer);

    return success;
}


// HTTP 요청 처리 함수
static void fn(struct mg_connection *c, int ev, void *ev_data) {
  if (ev == MG_EV_HTTP_MSG) {
    struct mg_http_message *hm = (struct mg_http_message *) ev_data;
    
    // API 1: AI 시작
    if (mg_match(hm->uri, mg_str("/api/start"), NULL)) {
      int result = start_ai();
      mg_http_reply(c, 200, "Content-Type: application/json\r\n", 
        "{\"status\":\"%s\",\"message\":\"%s\",\"ai_active\":%d}\n", 
        result ? "success" : "error", 
        result ? "AI 프로세스가 시작되었습니다" : "AI 시작 실패",
        ai_active);
    }
    
    // API 2: AI 종료 및 JSON 처리
    else if (mg_match(hm->uri, mg_str("/api/stop"), NULL)) {
      int stop_result = stop_ai();
      
      // 잠시 대기 (AI가 결과 파일을 완전히 저장할 시간)
      sleep(2);
      
      // 이미지 S3 업로드 및 JSON 병합 처리
      int process_result = process_images_and_send_json();
      
      mg_http_reply(c, 200, "Content-Type: application/json\r\n", 
        "{\"status\":\"%s\",\"message\":\"%s\",\"ai_stopped\":%d,\"data_processed\":%d}\n", 
        (stop_result && process_result) ? "success" : "partial_error", 
        (stop_result && process_result) ? "AI 종료 및 데이터 처리 완료" : "일부 작업 실패",
        stop_result, process_result);
    }
    
    // API 3: 상태 확인
    else if (mg_match(hm->uri, mg_str("/api/status"), NULL)) {
      mg_http_reply(c, 200, "Content-Type: application/json\r\n", 
        "{\"ai_active\":%d,\"current_json\":\"%s\"}\n", 
        ai_active, ai_active ? current_json_file : "");
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
  exit(0);
}

int main() {
  // 종료 시그널 핸들러 등록
  signal(SIGINT, (void (*)(int))cleanup);
  signal(SIGTERM, (void (*)(int))cleanup);
  
  struct mg_mgr mgr;
  mg_mgr_init(&mgr);
  
  // HTTP 리스닝 설정
  struct mg_connection *c = mg_http_listen(&mgr, "http://0.0.0.0:8000", fn, NULL);
  if (c == NULL) {
    printf("HTTP 서버 시작 실패. 포트 권한 문제일 수 있습니다.\n");
    printf("'sudo'로 실행하세요.\n");
    return 1;
  }
  
  printf("HTTP 서버가 8000 포트에서 시작되었습니다.\n");
  printf("API 엔드포인트:\n");
  printf("1. /api/start - AI 프로세스 시작\n");
  printf("2. /api/stop - AI 종료, 이미지 S3 업로드, JSON 병합 및 전송\n");
  printf("3. /api/status - 현재 상태 확인\n");
  
  // 이벤트 루프
  for (;;) {
    mg_mgr_poll(&mgr, 1000);
  }
  
  // 정리
  cleanup();
  mg_mgr_free(&mgr);
  return 0;
}