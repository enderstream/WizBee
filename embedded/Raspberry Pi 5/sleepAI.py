import sys
import signal
import cv2
import numpy as np
import mediapipe as mp
import torch
import torch.nn as nn
import time
import json
from datetime import datetime
from PIL import Image
from torchvision import transforms
import os
import math

# YOLOv5 경로 등록
sys.path.append("/home/test/ai_env/yolov5")  # Linux 스타일 절대경로
from models.common import DetectMultiBackend
from utils.general import non_max_suppression
from utils.augmentations import letterbox


# Eye CNN 모델 정의
class EyeCNN(nn.Module):
    def __init__(self):
        super(EyeCNN, self).__init__()
        self.net = nn.Sequential(
            nn.Conv2d(1, 32, 3, 1, 1),
            nn.ReLU(),
            nn.MaxPool2d(2, 2),
            nn.Conv2d(32, 64, 3, 1, 1),
            nn.ReLU(),
            nn.MaxPool2d(2, 2),
            nn.Flatten(),
            nn.Linear(64 * 16 * 16, 128),
            nn.ReLU(),
            nn.Linear(128, 2),
        )

    def forward(self, x):
        return self.net(x)


# ============================
# 좌표 보정 함수 (YOLOv5용)
# ============================
def scale_coords(img1_shape, coords, img0_shape):
    gain = min(img1_shape[0] / img0_shape[0], img1_shape[1] / img0_shape[1])
    pad = (img1_shape[1] - img0_shape[1] * gain) / 2, (
        img1_shape[0] - img0_shape[0] * gain
    ) / 2
    coords[:, [0, 2]] -= pad[0]
    coords[:, [1, 3]] -= pad[1]
    coords[:, :4] /= gain
    coords[:, :4] = coords[:, :4].clamp(min=0)
    return coords


# 이미지 저장 함수
def save_image(image, prefix):
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"{prefix}_{timestamp}.jpg"
    filepath = os.path.join("/home/test/ai_data", filename)
    try:
        cv2.imwrite(filepath, image)
        print(f"[CAPTURE] 저장 완료: {filepath}")
    except Exception as e:
        print(f"[ERROR] 저장 실패: {filepath} - {e}")


# 어깨 각도 계산 함수수
def get_shoulder_angle(p1, p2):  # p1, p2는 (x, y)
    dx = p2[0] - p1[0]
    dy = p2[1] - p1[1]
    angle = math.degrees(math.atan2(dy, dx))  # 수평선 기준 기울기 각도
    return abs(angle)

# 종료 작업 함수 (JSON 저장 및 프로그램 종료)
def save_and_exit():
    """JSON 파일 저장 및 프로그램 종료"""
    print("[INFO] 프로그램 종료 중... 데이터를 저장합니다.")

    # drowsy_events의 끝 시간 설정
    for e in drowsy_events:
        if e["end"] is None:
            e["end"] = datetime.fromtimestamp(time.time()).isoformat()

    # 졸음 탐지 요약 데이터 저장
    sleep_cnt = 0
    sleep_time = 0
    for e in drowsy_events:
        try:
            start = datetime.fromisoformat(e["start"])
            end = datetime.fromisoformat(e["end"])
            duration = (end - start).total_seconds()
            if duration >= 10:
                sleep_cnt += 1
                sleep_time += duration
        except Exception as ex:
            print(f"[ERROR] 데이터 처리 중 오류 발생: {ex}")
            continue

    summary = {"sleepCnt": sleep_cnt, "sleepTime": int(sleep_time)}
    with open("/home/test/ai_env/summary_drowsy.json", "w") as f:
        json.dump(summary, f, indent=2)

    # 엎드림 및 어깨 틀어짐 횟수 저장
    with open("/home/test/ai_env/summary_shoulder_tilt.json", "w") as f:
        json.dump({"downCnt": down_cnt, "shoulderCnt": shoulder_cnt}, f, indent=2)

    print("[INFO] 데이터 저장 완료. 프로그램을 종료합니다.")
    
    # 리소스 정리 및 종료
    cap.release()
    cv2.destroyAllWindows()
    sys.exit(0)

# SIGINT 및 SIGTERM 신호 처리 함수 등록 (Ctrl+C 및 kill 명령 처리)
def signal_handler(sig, frame):
    save_and_exit()


signal.signal(signal.SIGINT, signal_handler)   # Ctrl+C 처리
signal.signal(signal.SIGTERM, signal_handler) # kill 명령 처리


# 기본 설정
mp_pose = mp.solutions.pose
pose = mp_pose.Pose()
mp_hands = mp.solutions.hands
hands = mp_hands.Hands(static_image_mode=False, max_num_hands=2)

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# 모델 로딩
model = DetectMultiBackend(weights="/home/test/ai_env/best_yolov5n.pt", device=device)
model.model.eval()

cnn_model = EyeCNN().to(device)
cnn_model_path = "/home/test/ai_env/eye_state_classifier_0408.pth"  # Linux 스타일 절대경로
cnn_model.load_state_dict(torch.load(cnn_model_path, map_location=device))
cnn_model.eval()

transform = transforms.Compose([transforms.Resize((64, 64)), transforms.ToTensor()])

cap = cv2.VideoCapture(2)
prev_hand_landmarks = None
prev_drowsy = False
drowsy_start_time = None
drowsy_events = []
down_cnt = 0  # 엎드림 횟수
shoulder_cnt = 0  # 어깨 틀어짐 횟수
shoulder_tilting = False  # 어깨 틀어짐 상태
shoulder_tilt_start_time = None # 어깨 틀어짐 시작 시간
head_down = False  # 엎드림 상태
head_down_start_time = None  # 엎드림 시작 시간

# 메인 루프 시작
try:
    while True:
        ret, frame = cap.read()
        if not ret:
            break

        h, w = frame.shape[:2]
        rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        pose_results = pose.process(rgb)
        hands_results = hands.process(rgb)

        # YOLOv5 전처리
        img_yolo, ratio, pad = letterbox(frame, new_shape=(640, 640), auto=False)
        img_yolo = img_yolo[:, :, ::-1].transpose(2, 0, 1)
        img_yolo = np.ascontiguousarray(img_yolo)
        img_tensor = torch.from_numpy(img_yolo).float().unsqueeze(0) / 255.0
        img_tensor = img_tensor.to(device)

        with torch.no_grad():
            pred = model(img_tensor)[0]
            pred = non_max_suppression(pred, 0.5, 0.45)[0]

        left_eye_closed = None
        right_eye_closed = None
        eye_detected = False

        if pred is not None and len(pred):
            pred[:, :4] = scale_coords(
                img_tensor.shape[2:], pred[:, :4], frame.shape
            ).round()
            for *xyxy, conf, cls in pred:
                x1, y1, x2, y2 = map(int, xyxy)
                eye_crop = frame[y1:y2, x1:x2]
                if eye_crop.size == 0:
                    continue
                eye_img = Image.fromarray(cv2.cvtColor(eye_crop, cv2.COLOR_BGR2GRAY))
                eye_tensor = transform(eye_img).unsqueeze(0).to(device)
                output = cnn_model(eye_tensor)
                pred_label = torch.argmax(output, dim=1).item()
                is_closed = pred_label == 1

                eye_center_x = (x1 + x2) / 2
                if eye_center_x < w / 2:
                    left_eye_closed = is_closed
                else:
                    right_eye_closed = is_closed

                eye_detected = True
                label = "Sleepy" if is_closed else "Awake"
                color = (0, 0, 255) if is_closed else (0, 255, 0)
                cv2.rectangle(frame, (x1, y1), (x2, y2), color, 2)
                cv2.putText(
                    frame, label, (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.6, color, 2
                )

        if left_eye_closed is not None and right_eye_closed is not None:
            eye_closed = left_eye_closed and right_eye_closed
        elif left_eye_closed is not None:
            eye_closed = left_eye_closed
        elif right_eye_closed is not None:
            eye_closed = right_eye_closed
        else:
            eye_closed = False

        drowsy_pose = False
        if pose_results.pose_landmarks:
            lm = pose_results.pose_landmarks.landmark

            def gp(idx):
                return np.array([lm[idx].x * w, lm[idx].y * h])

            nose = gp(mp_pose.PoseLandmark.NOSE)
            l_shoulder = gp(mp_pose.PoseLandmark.LEFT_SHOULDER)
            r_shoulder = gp(mp_pose.PoseLandmark.RIGHT_SHOULDER)
            shoulder_center = (l_shoulder + r_shoulder) / 2
            
            # 엎드림 판단
            current_head_down = nose[1] - shoulder_center[1] > 100
            if current_head_down:
                if not head_down:
                    if head_down_start_time is None:
                        head_down_start_time = time.time()
                    elif time.time() - head_down_start_time > 8:
                        down_cnt += 1
                        print(f"[INFO] Head down detected. Down count: {down_cnt}")
                        save_image(frame, "down")
                        head_down = True
                        shoulder_tilt_start_time = None
            else:
                head_down = False
                head_down_start_time = None

            drowsy_pose = head_down

            # 어깨 기울기 판단 (엎드림 아닐 때만)
            if not head_down:
                angle = get_shoulder_angle(l_shoulder, r_shoulder)
                if angle <174 and not shoulder_tilting:  # 기울어짐 감지
                    if shoulder_tilt_start_time is None:
                        shoulder_tilt_start_time = time.time()
                    elif time.time() - shoulder_tilt_start_time > 10:
                        shoulder_cnt += 1
                        shoulder_tilting = True
                        print(f"[INFO] Shoulder tilt detected. Shoulder count: {shoulder_cnt}")
                        save_image(frame, "tilt")
                elif angle >= 175:  # 정상 범위 내 들어오면 다시 감지 가능
                    shoulder_tilting = False
                    shoulder_tilt_start_time = None

            cv2.putText(
                frame,
                f"Nose-Shoulder Y: {nose[1] - shoulder_center[1]:.1f}",
                (10, 100),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.5,
                (255, 255, 0),
                1,
            )

        hands_moving = False
        if hands_results.multi_hand_landmarks:
            current_landmarks = []
            for hand in hands_results.multi_hand_landmarks:
                for lm in hand.landmark:
                    current_landmarks.append(np.array([lm.x * w, lm.y * h]))
            if prev_hand_landmarks:
                diffs = [
                    np.linalg.norm(c - p)
                    for c, p in zip(current_landmarks, prev_hand_landmarks)
                ]
                hands_moving = any(d > 3 for d in diffs)
            prev_hand_landmarks = current_landmarks

        drowsy = eye_closed if eye_detected else drowsy_pose and not hands_moving

        now = time.time()
        if drowsy:
            if not prev_drowsy:
                drowsy_start_time = now
            elif now - drowsy_start_time >= 10 and not any(
                e["end"] is None for e in drowsy_events
            ):
                drowsy_events.append(
                    {
                        "start": datetime.fromtimestamp(drowsy_start_time).isoformat(),
                        "end": None,
                    }
                )
        else:
            if (
                prev_drowsy
                and drowsy_start_time
                and any(e["end"] is None for e in drowsy_events)
            ):
                drowsy_events[-1]["end"] = datetime.fromtimestamp(now).isoformat()

        prev_drowsy = drowsy
        
        cv2.line(frame, tuple(l_shoulder.astype(int)), tuple(r_shoulder.astype(int)), (255, 0, 255), 2)

        cv2.imshow("Drowsiness Detection", frame)
        if cv2.waitKey(1) & 0xFF == ord("q"):
            break

except KeyboardInterrupt:
    save_and_exit()

finally:
    cap.release()
    cv2.destroyAllWindows()
