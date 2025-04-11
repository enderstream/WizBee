# -*- coding: utf-8 -*-
import os
# OpenCV가 Wayland 대신 XCB(X11) 백엔드를 사용하도록 환경 변수 설정
os.environ['QT_QPA_PLATFORM'] = 'xcb'
import cv2
import time
import numpy as np
import datetime
import json
import mediapipe as mp
from ultralytics import YOLO
import math
from pygame import mixer
from PIL import ImageFont, ImageDraw, Image
import traceback # 오류 상세 출력을 위해 추가

# ===== 경로 관련 설정 =====
BASE_PATH = os.path.dirname(os.path.abspath(__file__))
MODEL_DETECT_NAME = 'yolov11n.pt' # 필요시 yolov8s.pt 또는 다른 모델 사용
MODEL_DETECT_PATH = os.path.join(BASE_PATH, MODEL_DETECT_NAME)

DATA_SAVE_PATH = os.path.join(BASE_PATH, "json")
TURTLE_NECK_IMAGES_PATH = os.path.join(BASE_PATH, "turtle_neck_images")
ALERT_SOUND_PATH = os.path.join(BASE_PATH, "alert.mp3")

# ===== 카메라 설정 =====
CAMERA_ID = 0 # 전역 변수 CAMERA_ID
CAMERA_WIDTH = 640
CAMERA_HEIGHT = 480
CAMERA_FPS = 10

# ===== 거북목 감지 설정 =====
MIN_DETECTION_CONFIDENCE = 0.5
MIN_TRACKING_CONFIDENCE = 0.5
CALIBRATION_FRAMES = 10
CALIBRATION_REQUIRED = True

BASE_FORWARD_HEAD_BASELINE_ANGLE = 10
ANGLE_THRESHOLD_DELTA = 5
NORMAL_DURATION = 1 # 거북목 재감지까지 필요한 정상 자세 유지 시간 (1초)
SAVE_TURTLE_NECK_IMAGES = True # True: 거북목 감지 시 이미지 저장 (활성화 상태)

# ===== 핸드폰 감지 설정 =====
HAND_PHONE_DISTANCE_THRESHOLD = 0.2 # 손-핸드폰 거리 임계값 (조절 필요 시 변경)
PHONE_CLASS_NAMES = ['cell phone', 'mobile phone', 'phone', 'smartphone', 'cellphone']
CONFIDENCE_THRESHOLD = 0.3
STATUS_CHANGE_THRESHOLD = 1.0
PHONE_USAGE_GAP_THRESHOLD = 2.0
DETECTION_INTERVAL = 3

# ===== 화면 표시 설정 =====
FONT = cv2.FONT_HERSHEY_SIMPLEX
FONT_SIZE = 0.7
WARNING_COLOR = (0, 0, 255)
GOOD_COLOR = (0, 255, 0)
INFO_COLOR = (255, 255, 255)
DURATION_COLOR = (0, 165, 255)
CALIBRATION_COLOR = (255, 255, 0)
LANDMARK_RADIUS = 5
LANDMARK_THICKNESS = -1

# ===== 상태 관련 상수 =====
STATUS_STUDYING = "공부 중"
STATUS_ABSENT = "자리비움"
STATUS_USING_PHONE = "핸드폰 사용 중"
STATUS_TURTLE_NECK = "거북목 감지!"


# <<<--- !!! 중요 !!! ensure_dir 함수 정의가 main 함수보다 앞에 있어야 합니다 --->>>
# ===== 디렉토리 생성 =====
def ensure_dir(directory):
    if not os.path.exists(directory):
        os.makedirs(directory)
        print(f"디렉토리 생성: {directory}")


# ===== 유틸리티 함수 =====
def format_time(seconds):
    hours, remainder = divmod(seconds, 3600)
    minutes, seconds = divmod(remainder, 60)
    return f"{int(hours):02d}:{int(minutes):02d}:{int(seconds):02d}"

def calculate_distance(point1, point2):
    return np.sqrt((point1[0] - point2[0])**2 + (point1[1] - point2[1])**2)

def put_korean_text(img, text, position, font_size, color):
    font_paths = [
        "malgun.ttf",
        "AppleGothic.ttf",
        "/usr/share/fonts/truetype/nanum/NanumGothic.ttf",
        "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf" # DejaVu 폰트 추가
    ]
    font = None
    for path in font_paths:
        try:
            font = ImageFont.truetype(path, font_size)
            break
        except IOError:
            continue

    # 이미지 유효성 검사 추가
    if img is None or img.size == 0:
        print("오류: put_korean_text에 유효하지 않은 이미지가 전달되었습니다.")
        return np.zeros((100, 100, 3), dtype=np.uint8) # 빈 이미지 반환

    try:
        img_pil = Image.fromarray(img)
        draw = ImageDraw.Draw(img_pil)

        if font:
            draw.text(position, text, font=font, fill=color[::-1])
        else:
            # OpenCV로 영문 텍스트라도 표시
            try:
                # 영문 변환 시도 (간단하게)
                safe_text = text.encode('ascii', 'ignore').decode('ascii')
                if not safe_text: safe_text = "FontError"
            except Exception:
                safe_text = "FontError"
            # 텍스트 위치 조정 (폰트 크기 고려)
            text_y = position[1] + font_size
            cv2.putText(img, safe_text, (position[0], text_y), FONT, font_size/30, color, 1, cv2.LINE_AA)
            return img # OpenCV로 그린 이미지 반환

        return np.array(img_pil)
    except Exception as e:
        print(f"오류: put_korean_text 실행 중 예외 발생: {e}")
        # 오류 발생 시 원본 이미지 또는 빈 이미지 반환
        return img


# ===== 데이터 저장 함수 =====
def save_monitoring_data(monitoring_time_sec, phone_time_sec, phone_count, absent_time_sec, absent_count, turtle_neck_count):
    data = {
        "fullTime": round(monitoring_time_sec),
        "phoneTime": round(phone_time_sec),
        "phoneCount": phone_count,
        "outTime": round(absent_time_sec),
        "outCount": absent_count,
        "poseTurtleCnt": turtle_neck_count
    }
    latest_filename = os.path.join(DATA_SAVE_PATH, "study_data_latest.json")
    try:
        with open(latest_filename, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=4, ensure_ascii=False)
        print(f"모니터링 데이터 저장 완료: {latest_filename}")
    except IOError as e:
        print(f"오류: {latest_filename} 파일 저장 실패 - {e}")
    except Exception as e:
        print(f"데이터 저장 중 예상치 못한 오류 발생: {e}")
    return latest_filename

# ===== 거북목 이미지 저장 함수 =====
def save_turtle_neck_image(image, count):
    timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"turtle_neck_{count}_{timestamp}.jpg"
    filepath = os.path.join(TURTLE_NECK_IMAGES_PATH, filename)
    try:
        if image is not None and image.size > 0:
            cv2.imwrite(filepath, image)
            print(f"거북목 감지 이미지 저장: {filepath}")
        else:
            print(f"오류: 거북목 이미지 저장 실패 - 유효하지 않은 이미지 ({filepath})")
    except Exception as e:
        print(f"오류: 거북목 이미지 저장 실패 ({filepath}) - {e}")
    return filepath

# ===== 알림음 재생 함수 =====
def play_alert_sound():
    alert_file = ALERT_SOUND_PATH
    try:
        if not mixer.get_init():
            # print("DEBUG: Initializing pygame mixer...")
            mixer.init()
            # print("DEBUG: Mixer initialized.")
        if os.path.exists(alert_file):
            # print(f"DEBUG: Playing sound: {alert_file}")
            sound = mixer.Sound(alert_file)
            sound.play()
            # print("DEBUG: Sound played.")
        else:
            # 파일이 없을 때 경고는 한 번만 출력하도록 개선 가능 (예: 플래그 사용)
            if not hasattr(play_alert_sound, "warned"):
                 print(f"경고: 알림음 파일을 찾을 수 없습니다: {alert_file}. 이후 이 메시지는 생략됩니다.")
                 play_alert_sound.warned = True
            # print(f"알림음 파일을 찾을 수 없습니다: {alert_file}") # 매번 출력 원하면 이 줄 사용
    except Exception as e:
        print(f"알림음 재생 중 오류 발생: {str(e)}")

# ===== 모델 초기화 함수 =====
def initialize_models():
    mp_pose = mp.solutions.pose
    pose = mp_pose.Pose(
        min_detection_confidence=MIN_DETECTION_CONFIDENCE,
        min_tracking_confidence=MIN_TRACKING_CONFIDENCE
    )
    mp_drawing = mp.solutions.drawing_utils
    mp_hands = mp.solutions.hands
    hands = mp_hands.Hands(
        static_image_mode=False,
        max_num_hands=2,
        min_detection_confidence=0.5,
        min_tracking_confidence=0.5
    )
    model_detect = None
    try:
        if os.path.exists(MODEL_DETECT_PATH):
            model_detect = YOLO(MODEL_DETECT_PATH)
            print(f"YOLO 모델 불러오기 성공: {MODEL_DETECT_PATH}")
        else:
            print(f"경고: YOLO 모델 파일을 찾을 수 없습니다: {MODEL_DETECT_PATH}")
            print("기본 YOLOv8s 모델을 사용합니다.")
            model_detect = YOLO("yolov8s.pt") # 기본 모델 로드
    except Exception as e:
         print(f"YOLO 모델 로드 중 치명적 오류 발생: {e}")
         raise RuntimeError(f"YOLO 모델 로드 실패: {e}")
    return pose, mp_pose, mp_drawing, hands, mp_hands, model_detect

# ===== 자세 감지 함수 =====
def detect_forward_head(landmarks, mp_pose, calibration_data=None):
    try:
        required_landmarks = [
            mp_pose.PoseLandmark.LEFT_EAR, mp_pose.PoseLandmark.LEFT_SHOULDER,
            mp_pose.PoseLandmark.RIGHT_EAR, mp_pose.PoseLandmark.RIGHT_SHOULDER
        ]
        min_visibility = 0.1
        # 랜드마크 유효성 검사 강화
        if landmarks is None or len(landmarks) <= max(lm.value for lm in required_landmarks):
             # print("DEBUG: Not enough landmarks detected.")
             return False, 0, 0

        for lm in required_landmarks:
             lm_obj = landmarks[lm.value]
             if lm_obj is None or not hasattr(lm_obj, 'visibility') or lm_obj.visibility < min_visibility:
                 # print(f"DEBUG: Required landmark {lm.name} not sufficiently visible.")
                 return False, 0, 0

        left_ear = landmarks[mp_pose.PoseLandmark.LEFT_EAR.value]
        left_shoulder = landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value]
        right_ear = landmarks[mp_pose.PoseLandmark.RIGHT_EAR.value]
        right_shoulder = landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER.value]

        def compute_angle(ear, shoulder):
            try:
                # 좌표값 유효성 추가 확인
                if not all(hasattr(p, attr) and isinstance(getattr(p, attr), (int, float)) for p in [ear, shoulder] for attr in ['x', 'y']):
                    # print("DEBUG: Invalid coordinate type in landmark.")
                    return 0
                dx = abs(ear.x - shoulder.x); dy = abs(ear.y - shoulder.y)
                angle_rad = math.atan2(dx, dy if dy > 1e-6 else 1e-6)
                return math.degrees(angle_rad)
            except Exception as angle_e:
                # print(f"DEBUG: Error computing angle: {angle_e}")
                return 0

        left_angle = compute_angle(left_ear, left_shoulder)
        right_angle = compute_angle(right_ear, right_shoulder)

        # 각도가 유효하지 않으면 (0이면) 거북목으로 판단하지 않음
        if left_angle == 0 and right_angle == 0:
             # print("DEBUG: Both angles are invalid (0).")
             return False, 0, 0

        if calibration_data and "forward_head_baseline_angle" in calibration_data:
            baseline = calibration_data["forward_head_baseline_angle"]
        else: baseline = BASE_FORWARD_HEAD_BASELINE_ANGLE

        threshold = baseline + ANGLE_THRESHOLD_DELTA
        # 유효한 각도만 비교에 사용
        is_forward = (left_angle > threshold and left_angle != 0) or \
                     (right_angle > threshold and right_angle != 0)

        return is_forward, left_angle, right_angle
    except IndexError:
        # print("DEBUG: IndexError during forward head detection.")
        return False, 0, 0
    except Exception as e:
        print(f"거북목 감지 중 예외 발생: {e}")
        return False, 0, 0

# ===== 자세 보정 함수 =====
def collect_calibration_data(landmarks, mp_pose, current_data=None):
    if current_data is None: current_data = {"frame_count": 0, "forward_head_angles": []}
    try:
        required_landmarks = [
            mp_pose.PoseLandmark.LEFT_EAR, mp_pose.PoseLandmark.LEFT_SHOULDER,
            mp_pose.PoseLandmark.RIGHT_EAR, mp_pose.PoseLandmark.RIGHT_SHOULDER ]
        min_visibility = 0.1
        if landmarks is None or len(landmarks) <= max(lm.value for lm in required_landmarks): return current_data
        for lm in required_landmarks:
             lm_obj = landmarks[lm.value]
             if lm_obj is None or not hasattr(lm_obj, 'visibility') or lm_obj.visibility < min_visibility: return current_data

        current_data["frame_count"] += 1
        left_ear = landmarks[mp_pose.PoseLandmark.LEFT_EAR.value]
        left_shoulder = landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value]
        right_ear = landmarks[mp_pose.PoseLandmark.RIGHT_EAR.value]
        right_shoulder = landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER.value]

        def compute_angle(ear, shoulder):
             try:
                if not all(hasattr(p, attr) and isinstance(getattr(p, attr), (int, float)) for p in [ear, shoulder] for attr in ['x', 'y']): return 0
                dx = abs(ear.x - shoulder.x); dy = abs(ear.y - shoulder.y)
                angle_rad = math.atan2(dx, dy if dy > 1e-6 else 1e-6)
                return math.degrees(angle_rad)
             except Exception: return 0

        left_angle = compute_angle(left_ear, left_shoulder)
        right_angle = compute_angle(right_ear, right_shoulder)
        if left_angle > 0 and right_angle > 0: # 유효한 각도만 사용
            avg_angle = (left_angle + right_angle) / 2.0
            current_data["forward_head_angles"].append(avg_angle)

        if current_data["frame_count"] >= CALIBRATION_FRAMES:
            angles = sorted(current_data["forward_head_angles"])
            if not angles:
                 print("경고: 보정 중 유효한 목 각도를 측정하지 못했습니다. 기본값을 사용합니다.")
                 return {"forward_head_baseline_angle": BASE_FORWARD_HEAD_BASELINE_ANGLE}
            valid_angles = angles # 기본값: 모든 유효 각도 사용
            if len(angles) >= 10: # 샘플 수가 충분할 때만 상하위 제외 (예: 10개 이상)
                cut_idx = max(1, int(len(angles) * 0.1))
                trimmed_angles = angles[cut_idx:-cut_idx]
                if trimmed_angles: # 제외 후 남는게 있으면 사용
                    valid_angles = trimmed_angles
            avg_calib_angle = sum(valid_angles) / len(valid_angles) if valid_angles else BASE_FORWARD_HEAD_BASELINE_ANGLE
            print(f"보정 완료: 총 시도 프레임 {current_data['frame_count']}개, 유효 각도 샘플 {len(angles)}개, 평균 계산 샘플 {len(valid_angles)}개")
            return {"forward_head_baseline_angle": avg_calib_angle}
        return current_data
    except IndexError: return current_data
    except Exception as e:
        print(f"보정 데이터 수집 중 예외 발생: {e}")
        return current_data

# ===== 화면 표시 함수 =====
def display_info(image, current_status, left_angle, right_angle,
                 turtle_neck_count, is_turtle_counting, turtle_continuous_time,
                 absent_time, phone_time, absent_count, phone_count,
                 monitoring_time, fps, calibration_data, calibration_mode=False, calibration_progress=0):
    if image is None or image.size == 0:
        print("오류: display_info 함수에 유효하지 않은 이미지가 전달되었습니다.")
        return np.zeros((CAMERA_HEIGHT + 150, CAMERA_WIDTH, 3), dtype=np.uint8)
    caption_height = 150
    # 원본 이미지 shape 확인
    if len(image.shape) != 3 or image.shape[2] != 3:
         print(f"오류: display_info 입력 이미지의 shape이 올바르지 않습니다: {image.shape}")
         return np.zeros((CAMERA_HEIGHT + 150, CAMERA_WIDTH, 3), dtype=np.uint8)
    h, w, c = image.shape

    try:
        caption = np.zeros((caption_height, w, c), dtype=np.uint8)
        display_image = image.copy()
        full_image = np.vstack([display_image, caption])
    except ValueError as e:
         print(f"오류: 이미지 스택 실패 - {e}. 입력 이미지 shape: {image.shape}")
         full_image = image.copy()
         h, w, _ = full_image.shape

    try: # 화면 표시는 오류 발생 가능성 높으므로 try-except로 감쌈
        if calibration_mode:
            progress_text = f"자세 보정 중... {calibration_progress}%"
            full_image = put_korean_text(full_image, progress_text, (w//2 - 150, h // 2 - 30), 30, CALIBRATION_COLOR)
            guide_text = "정면을 바라보고 바른 자세를 유지해주세요."
            full_image = put_korean_text(full_image, guide_text, (w//2 - 250, h // 2 + 10), 25, CALIBRATION_COLOR)
            return full_image

        baseline_angle_text = "Baseline: N/A"
        threshold_angle_text = f"Threshold: {BASE_FORWARD_HEAD_BASELINE_ANGLE + ANGLE_THRESHOLD_DELTA:.1f} (Default)"
        text_color = WARNING_COLOR
        if calibration_data and "forward_head_baseline_angle" in calibration_data:
             baseline_angle = calibration_data['forward_head_baseline_angle']
             threshold_angle = baseline_angle + ANGLE_THRESHOLD_DELTA
             baseline_angle_text = f"Baseline: {baseline_angle:.1f}"
             threshold_angle_text = f"Threshold: {threshold_angle:.1f}"
             text_color = INFO_COLOR
        cv2.putText(full_image, baseline_angle_text, (10, h + 30), FONT, 0.6, text_color, 1, cv2.LINE_AA) # 좌표 수정 (캡션 영역)
        cv2.putText(full_image, threshold_angle_text, (10, h + 55), FONT, 0.6, text_color, 1, cv2.LINE_AA) # 좌표 수정 (캡션 영역)

        base_y = h # 캡션 시작 y 좌표 = 원본 이미지 높이
        status_color = GOOD_COLOR
        if current_status == STATUS_ABSENT: status_color = WARNING_COLOR
        elif current_status == STATUS_USING_PHONE: status_color = DURATION_COLOR
        elif current_status == STATUS_TURTLE_NECK: status_color = WARNING_COLOR
        status_bar_y_start = base_y + 5
        status_bar_y_end = status_bar_y_start + 30
        if status_bar_y_end < full_image.shape[0]:
            cv2.rectangle(full_image, (0, status_bar_y_start), (w, status_bar_y_end), status_color, -1)
            full_image = put_korean_text(full_image, current_status, (w//2 - 80, status_bar_y_start + 5), 24, (255, 255, 255))

        row1_y = base_y + 55
        row2_y = base_y + 85
        row3_y = base_y + 115
        col1_x = 10
        col2_x = 280
        col3_x = max(col2_x + 250, w - 250)

        monitoring_str = format_time(monitoring_time)
        full_image = put_korean_text(full_image, f"총 시간: {monitoring_str}", (col3_x, row1_y), 20, INFO_COLOR)

        neck_text = "목 자세: "
        neck_color = GOOD_COLOR
        if current_status == STATUS_TURTLE_NECK: neck_text += "불량"; neck_color = WARNING_COLOR
        elif current_status == STATUS_STUDYING or current_status == STATUS_USING_PHONE: neck_text += "정상"
        else: neck_text += "-"; neck_color = INFO_COLOR
        full_image = put_korean_text(full_image, neck_text, (col1_x, row1_y), 20, neck_color)
        cv2.putText(full_image, f"L:{left_angle:.1f} R:{right_angle:.1f}", (col1_x, row2_y), FONT, 0.6, INFO_COLOR, 1, cv2.LINE_AA)
        full_image = put_korean_text(full_image, f"거북목: {turtle_neck_count}회", (col1_x, row3_y), 20, INFO_COLOR)
        if is_turtle_counting and turtle_continuous_time > 0:
            cv2.putText(full_image, f"({turtle_continuous_time:.1f}s)", (col1_x + 160, row3_y + 5), FONT, 0.5, DURATION_COLOR, 1, cv2.LINE_AA)

        absent_str = format_time(absent_time)
        full_image = put_korean_text(full_image, f"자리비움: {absent_str} ({absent_count}회)", (col2_x, row2_y), 18, INFO_COLOR)
        phone_str = format_time(phone_time)
        full_image = put_korean_text(full_image, f"핸드폰: {phone_str} ({phone_count}회)", (col2_x, row3_y), 18, INFO_COLOR)

        cv2.putText(full_image, f"FPS: {int(fps)}", (col3_x, row3_y + 5), FONT, 0.6, INFO_COLOR, 1, cv2.LINE_AA)

        return full_image

    except Exception as e_disp:
        print(f"오류: display_info 실행 중 예외 발생: {e_disp}")
        # 오류 발생 시에도 최소한의 이미지라도 반환 (예: 원본 이미지)
        return image # 또는 full_image


# ===== 메인 함수 =====
def main():
    # <<<--- !!! 중요 !!! ensure_dir 호출이 main 함수 시작 부분에 위치해야 함 --->>>
    ensure_dir(DATA_SAVE_PATH)
    ensure_dir(TURTLE_NECK_IMAGES_PATH)

    if not os.path.exists(ALERT_SOUND_PATH):
        print(f"경고: 알림음 파일({ALERT_SOUND_PATH})을 찾을 수 없습니다. 알림음 기능이 작동하지 않습니다.")
    else:
        print(f"알림음 파일 확인: {ALERT_SOUND_PATH}")

    # Mixer 초기화는 필요할 때 play_alert_sound 내부에서 처리
    # try: pass
    # except Exception as e: print(f"Pygame Mixer 초기화 중 오류 발생 (무시하고 진행): {str(e)}")

    try:
        pose, mp_pose, mp_drawing, hands, mp_hands, model_detect = initialize_models()
    except RuntimeError as e: print(f"초기화 실패: {e}"); return
    except Exception as e: print(f"모델 초기화 중 예상치 못한 오류 발생: {e}"); return

    current_camera_id = CAMERA_ID
    cap = cv2.VideoCapture(current_camera_id)
    if not cap.isOpened():
        print(f"오류: 카메라 ID {current_camera_id}를 열 수 없습니다.")
        alternative_ids = [-1, 1, 2]
        for cam_id in alternative_ids:
            print(f"대체 카메라 ID {cam_id} 시도...")
            cap = cv2.VideoCapture(cam_id)
            if cap.isOpened():
                print(f"카메라 ID {cam_id} 열기 성공.")
                current_camera_id = cam_id
                break
        if not cap.isOpened():
             print("모든 카메라 ID 시도 실패. 종료합니다.")
             return

    cap.set(cv2.CAP_PROP_FRAME_WIDTH, CAMERA_WIDTH)
    cap.set(cv2.CAP_PROP_FRAME_HEIGHT, CAMERA_HEIGHT)
    cap.set(cv2.CAP_PROP_FPS, CAMERA_FPS)
    print(f"카메라 설정: {int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))}x{int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))} @ {int(cap.get(cv2.CAP_PROP_FPS))} FPS")

    session_start_time = time.time()
    # 상태 변수 초기화
    calibration_mode = CALIBRATION_REQUIRED
    calibration_data = None
    calibration_temp_data = None
    absent_start_time = None
    phone_start_time = None
    total_absent_time_sec = 0.0
    total_phone_time_sec = 0.0
    is_absent = False
    is_using_phone = False
    phone_count = 0
    absent_count = 0
    last_phone_usage_end_time = 0
    phone_usage_active = False
    turtle_neck_count = 0
    is_turtle_counting = False
    turtle_continuous_time = 0.0
    turtle_start_time = 0
    last_turtle_alert_time = 0
    is_currently_forward_head = False
    normal_posture_start_time = time.time()
    last_phone_state_detected = False
    last_absent_state_detected = False
    last_state_change_time_absent = time.time()
    last_state_change_time_phone = time.time()
    frame_count = 0
    prev_time = time.time()
    current_status = STATUS_STUDYING
    last_saved_interval = -1


    window_name = '학습 모니터링'
    try:
        cv2.namedWindow(window_name, cv2.WINDOW_NORMAL)
        # 초기 크기 설정 (선택 사항)
        # cv2.resizeWindow(window_name, CAMERA_WIDTH, CAMERA_HEIGHT + 150)
        print(f"DEBUG: Window '{window_name}' created.")
    except Exception as e_win:
        print(f"오류: OpenCV 창 생성 실패 ({window_name}): {e_win}")
        print("화면 표시 없이 코드를 계속 실행합니다.")
        window_name = None # 창 생성 실패 시 None으로 설정

    try:
        while cap.isOpened():
            success, frame = cap.read()
            if not success:
                time.sleep(0.05)
                continue

            current_time = time.time()
            elapsed_time = current_time - prev_time
            fps = 1.0 / elapsed_time if elapsed_time > 1e-6 else 0
            prev_time = current_time
            monitoring_time_sec = current_time - session_start_time
            frame_count += 1

            if frame is None or frame.size == 0:
                print(f"오류: 비어있는 프레임을 받았습니다 (Frame {frame_count}).")
                continue

            original_frame = frame.copy()
            rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            rgb_frame.flags.writeable = False
            pose_results = pose.process(rgb_frame)
            rgb_frame.flags.writeable = True

            is_forward_head = False
            left_angle, right_angle = 0, 0
            pose_landmarks = None
            if pose_results.pose_landmarks:
                pose_landmarks = pose_results.pose_landmarks.landmark


            # --- 일반 모드: 자세 감지 ---
            if frame_count % DETECTION_INTERVAL != 0:
                pass
            elif pose_landmarks:
                is_forward_head, left_angle, right_angle = detect_forward_head(pose_landmarks, mp_pose, calibration_data)
                is_currently_forward_head = is_forward_head
                if is_forward_head:
                    if not is_turtle_counting:
                        time_since_normal_start = current_time - normal_posture_start_time
                        if time_since_normal_start >= NORMAL_DURATION or turtle_neck_count == 0:
                            is_turtle_counting = True; turtle_start_time = current_time; turtle_neck_count += 1
                            print(f"거북목 감지 시작! (총 {turtle_neck_count}회)")
                            if SAVE_TURTLE_NECK_IMAGES: save_turtle_neck_image(original_frame, turtle_neck_count)
                            if current_time - last_turtle_alert_time > 3.0:
                                play_alert_sound()
                                last_turtle_alert_time = current_time
                    if is_turtle_counting: turtle_continuous_time = current_time - turtle_start_time
                else:
                    if is_turtle_counting:
                        normal_posture_start_time = current_time; is_turtle_counting = False; turtle_continuous_time = 0
            else:
                is_currently_forward_head = False
                if is_turtle_counting:
                     normal_posture_start_time = current_time; is_turtle_counting = False; turtle_continuous_time = 0

            # --- 객체 및 손 감지 ---
            current_person_detected = False
            current_phone_detected = False
            current_hand_near_phone = False
            phone_box = None

            if frame_count % DETECTION_INTERVAL == 0:
                try:
                    detect_results = model_detect(original_frame, conf=CONFIDENCE_THRESHOLD, verbose=False)
                    if detect_results and len(detect_results) > 0:
                         boxes = detect_results[0].boxes
                         for box in boxes:
                             try:
                                 cls = int(box.cls[0]); class_name = model_detect.names[cls]
                                 if class_name == 'person': current_person_detected = True
                                 if class_name in PHONE_CLASS_NAMES:
                                     current_phone_detected = True; phone_box = box.xyxy[0].cpu().numpy()
                             except Exception: continue

                    if current_phone_detected and phone_box is not None:
                        hands_results = hands.process(rgb_frame)
                        if hands_results.multi_hand_landmarks:
                            phone_center_x = (phone_box[0] + phone_box[2]) / 2; phone_center_y = (phone_box[1] + phone_box[3]) / 2
                            phone_center = (phone_center_x, phone_center_y)
                            phone_w = phone_box[2] - phone_box[0]; phone_h = phone_box[3] - phone_box[1]
                            phone_size_norm = max(phone_w, phone_h)
                            min_dist_normalized = float('inf')
                            for hand_landmarks in hands_results.multi_hand_landmarks:
                                key_landmarks_indices = [0, 4, 8, 12, 16, 20]
                                for i in key_landmarks_indices:
                                    if i < len(hand_landmarks.landmark):
                                        landmark = hand_landmarks.landmark[i]
                                        if landmark: # 랜드마크 유효성 확인
                                            landmark_x = landmark.x * CAMERA_WIDTH; landmark_y = landmark.y * CAMERA_HEIGHT
                                            dist = calculate_distance((landmark_x, landmark_y), phone_center)
                                            if phone_size_norm > 1e-6:
                                                normalized_dist = dist / phone_size_norm
                                                min_dist_normalized = min(min_dist_normalized, normalized_dist)
                            if phone_size_norm > 1e-6 and min_dist_normalized < HAND_PHONE_DISTANCE_THRESHOLD:
                                current_hand_near_phone = True

                    # --- 상태 업데이트 로직 ---
                    person_now_present = current_person_detected or (pose_landmarks is not None)
                    person_state_changed = (person_now_present != (not is_absent))
                    if person_state_changed and (current_time - last_state_change_time_absent > STATUS_CHANGE_THRESHOLD):
                        if not person_now_present:
                            if not is_absent: is_absent = True; absent_start_time = current_time; absent_count += 1; print(f"자리비움 시작 (누적 {absent_count}회)")
                        else:
                            if is_absent: is_absent = False; duration = current_time - absent_start_time if absent_start_time else 0; total_absent_time_sec += duration; print(f"자리복귀 감지 - 자리비움 시간: {duration:.1f}초 (총 {format_time(total_absent_time_sec)})"); absent_start_time = None
                        last_state_change_time_absent = current_time

                    phone_interaction_now = current_phone_detected and current_hand_near_phone and (not is_absent)
                    phone_state_changed = (phone_interaction_now != phone_usage_active)
                    if phone_state_changed and (current_time - last_state_change_time_phone > STATUS_CHANGE_THRESHOLD):
                        if phone_interaction_now:
                            if not phone_usage_active and (current_time - last_phone_usage_end_time >= PHONE_USAGE_GAP_THRESHOLD or phone_count == 0):
                                phone_count += 1; print(f"핸드폰 사용 시작 (누적 {phone_count}회)")
                            if not is_using_phone: is_using_phone = True; phone_start_time = current_time
                            phone_usage_active = True
                        else:
                            if phone_usage_active:
                                last_phone_usage_end_time = current_time; phone_usage_active = False
                                if is_using_phone:
                                    duration = 0
                                    if phone_start_time: duration = current_time - phone_start_time
                                    total_phone_time_sec += duration
                                    print(f"핸드폰 사용 종료 - 사용 시간: {duration:.1f}초 (총 {format_time(total_phone_time_sec)})")
                                    is_using_phone = False; phone_start_time = None
                        last_state_change_time_phone = current_time

                except Exception as e: print(f"객체/손 감지 또는 상태 업데이트 중 오류 발생: {e}")

            # --- 실시간 상태 업데이트 및 화면 표시 ---
            current_absent_time = total_absent_time_sec + (current_time - absent_start_time if is_absent and absent_start_time else 0)
            current_phone_time = total_phone_time_sec + (current_time - phone_start_time if is_using_phone and phone_start_time else 0)

            if is_absent: current_status = STATUS_ABSENT
            elif phone_usage_active: current_status = STATUS_USING_PHONE
            elif is_currently_forward_head: current_status = STATUS_TURTLE_NECK
            else: current_status = STATUS_STUDYING

            display_frame = display_info(
                frame, current_status, left_angle, right_angle, turtle_neck_count,
                is_turtle_counting, turtle_continuous_time, current_absent_time,
                current_phone_time, absent_count, phone_count, monitoring_time_sec,
                fps, calibration_data
            )

            # 창이 생성되었을 때만 imshow 호출
            if window_name and display_frame is not None and display_frame.size > 0:
                # print(f"DEBUG: Frame {frame_count}, Status: {current_status}, FPS: {fps:.1f}")
                # print(f"DEBUG: Display Frame - Type: {type(display_frame)}, Shape: {display_frame.shape if isinstance(display_frame, np.ndarray) else 'N/A'}")
                try:
                    cv2.imshow(window_name, display_frame)
                    # print("DEBUG: cv2.imshow call successful.")
                except Exception as e_imshow: print(f"오류 (imshow): {e_imshow}")
            # else: print("DEBUG: display_frame is None or empty or window not available.")

            key = cv2.waitKey(1) & 0xFF
            if key == 27: print("ESC 키 입력됨. 종료합니다."); break
            if key == ord('s'): print("S 키 입력: 현재 데이터 저장."); save_monitoring_data(monitoring_time_sec, current_phone_time, phone_count, current_absent_time, absent_count, turtle_neck_count)
            if key == ord('r') and not calibration_mode: print("R 키 입력: 자세 보정을 시작합니다."); calibration_mode = True; calibration_data = None; calibration_temp_data = None
            # --- 주기적 데이터 저장 ---
            current_interval_check = int(monitoring_time_sec)
            if current_interval_check > 0 and current_interval_check % 300 == 0:
                current_save_interval = current_interval_check // 300
                if current_save_interval > last_saved_interval:
                    print(f"\n주기적 데이터 저장 (모니터링 시간: {format_time(monitoring_time_sec)})")
                    save_monitoring_data(monitoring_time_sec, current_phone_time, phone_count, current_absent_time, absent_count, turtle_neck_count)
                    last_saved_interval = current_save_interval

    except KeyboardInterrupt: print("\nCtrl+C 입력으로 프로그램을 중단합니다.")
    except Exception as e:
        print(f"\n!!! 메인 루프 실행 중 예상치 못한 오류 발생: {e}")
        traceback.print_exc() # 오류 상세 내용 출력

    finally:
        print("\n프로그램 종료 처리 중...")
        current_time = time.time()
        final_absent_time_sec = total_absent_time_sec + (current_time - absent_start_time if is_absent and absent_start_time else 0)
        final_phone_time_sec = total_phone_time_sec + (current_time - phone_start_time if is_using_phone and phone_start_time else 0)
        final_monitoring_time_sec = current_time - session_start_time
        if final_monitoring_time_sec > 1:
            print("최종 데이터 저장 중...")
            saved_file = save_monitoring_data(final_monitoring_time_sec, final_phone_time_sec, phone_count, final_absent_time_sec, absent_count, turtle_neck_count)
            # print(f"데이터 저장 완료: {saved_file}") # 이전 로그에서 확인됨
        else: print("모니터링 시간이 너무 짧아 최종 데이터를 저장하지 않았습니다.")
        print("자원 해제 중...")
        if 'pose' in locals() and pose and hasattr(pose, 'close'): pose.close()
        if 'hands' in locals() and hands and hasattr(hands, 'close'): hands.close()
        if 'cap' in locals() and cap and cap.isOpened(): cap.release()
        # 창이 생성되었을 경우에만 destroy 시도
        if window_name:
            cv2.destroyAllWindows()
        if mixer.get_init(): print("Quitting pygame mixer..."); mixer.quit()
        print("\n프로그램이 완전히 종료되었습니다.")


if __name__ == "__main__":
    main()