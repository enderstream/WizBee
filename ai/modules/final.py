import sys
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

# YOLOv5 경로 등록
sys.path.append(r"C:\\Users\\SSAFY\\Desktop\\PJT\\yolov5")
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
            nn.Linear(128, 2)
        )

    def forward(self, x):
        return self.net(x)
    
# ============================
# 좌표 보정 함수 (YOLOv5용)
# ============================
def scale_coords(img1_shape, coords, img0_shape):
    gain = min(img1_shape[0] / img0_shape[0], img1_shape[1] / img0_shape[1])
    pad = (img1_shape[1] - img0_shape[1] * gain) / 2, (img1_shape[0] - img0_shape[0] * gain) / 2
    coords[:, [0, 2]] -= pad[0]
    coords[:, [1, 3]] -= pad[1]
    coords[:, :4] /= gain
    coords[:, :4] = coords[:, :4].clamp(min=0)
    return coords

# 기본 설정
mp_pose = mp.solutions.pose
pose = mp_pose.Pose()
mp_hands = mp.solutions.hands
hands = mp_hands.Hands(static_image_mode=False, max_num_hands=2)

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# 모델 로딩
model = DetectMultiBackend(weights=r"C:\\Users\\SSAFY\\Desktop\\PJT\\best_yolov5n.pt", device=device)
model.model.eval()

cnn_model = EyeCNN().to(device)
cnn_model_path = r"C:\\Users\\SSAFY\\Desktop\\PJT\\eye_cnn\\eye_state_classifier.pth"
cnn_model.load_state_dict(torch.load(cnn_model_path, map_location=device))
cnn_model.eval()

transform = transforms.Compose([
    transforms.Resize((64, 64)),
    transforms.ToTensor()
])

cap = cv2.VideoCapture(0)
prev_hand_landmarks = None
prev_drowsy = False
drowsy_start_time = None
drowsy_events = []

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
        pred[:, :4] = scale_coords(img_tensor.shape[2:], pred[:, :4], frame.shape).round()
        for *xyxy, conf, cls in pred:
            x1, y1, x2, y2 = map(int, xyxy)
            eye_crop = frame[y1:y2, x1:x2]
            if eye_crop.size == 0:
                continue
            eye_img = Image.fromarray(cv2.cvtColor(eye_crop, cv2.COLOR_BGR2GRAY))
            eye_tensor = transform(eye_img).unsqueeze(0).to(device)
            output = cnn_model(eye_tensor)
            pred_label = torch.argmax(output, dim=1).item()
            is_closed = (pred_label == 1)

            # 중심 좌표 기준 왼쪽/오른쪽 눈 분리
            eye_center_x = (x1 + x2) / 2
            if eye_center_x < w / 2:
                left_eye_closed = is_closed
            else:
                right_eye_closed = is_closed

            eye_detected = True
            label = "Sleepy" if is_closed else "Awake"
            color = (0, 0, 255) if is_closed else (0, 255, 0)
            cv2.rectangle(frame, (x1, y1), (x2, y2), color, 2)
            cv2.putText(frame, label, (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.6, color, 2)

    # 눈 감김 판단
    if left_eye_closed is not None and right_eye_closed is not None:
        eye_closed = left_eye_closed and right_eye_closed  # 둘 다 감겨야 졸음
    elif left_eye_closed is not None:
        eye_closed = left_eye_closed  # 한쪽만 감지되면 그쪽 기준
    elif right_eye_closed is not None:
        eye_closed = right_eye_closed
    else:
        eye_closed = False
        
    # 엎드림 감지
    drowsy_pose = False
    if pose_results.pose_landmarks:
        lm = pose_results.pose_landmarks.landmark
        def gp(idx): return np.array([lm[idx].x * w, lm[idx].y * h])
        nose = gp(mp_pose.PoseLandmark.NOSE)
        l_shoulder = gp(mp_pose.PoseLandmark.LEFT_SHOULDER)
        r_shoulder = gp(mp_pose.PoseLandmark.RIGHT_SHOULDER)
        shoulder_center = (l_shoulder + r_shoulder) / 2
        head_down = nose[1] - shoulder_center[1] > -30
        drowsy_pose = head_down
        cv2.putText(frame, f"Nose-Shoulder Y: {nose[1] - shoulder_center[1]:.1f}", (10, 100), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 0), 1)

    # 손 움직임 감지
    hands_moving = False
    if hands_results.multi_hand_landmarks:
        current_landmarks = []
        for hand in hands_results.multi_hand_landmarks:
            for lm in hand.landmark:
                current_landmarks.append(np.array([lm.x * w, lm.y * h]))
        if prev_hand_landmarks:
            diffs = [np.linalg.norm(c - p) for c, p in zip(current_landmarks, prev_hand_landmarks)]
            hands_moving = any(d > 3 for d in diffs)
        prev_hand_landmarks = current_landmarks

    # 최종 졸음 판단
    drowsy = eye_closed if eye_detected else drowsy_pose and not hands_moving

    # 졸음 시간 측정
    now = time.time()
    if drowsy:
        if not prev_drowsy:
            drowsy_start_time = now
        elif now - drowsy_start_time >= 10 and not any(e['end'] is None for e in drowsy_events):
            drowsy_events.append({"start": datetime.fromtimestamp(drowsy_start_time).isoformat(), "end": None})
    else:
        if prev_drowsy and drowsy_start_time and any(e['end'] is None for e in drowsy_events):
            drowsy_events[-1]["end"] = datetime.fromtimestamp(now).isoformat()

    prev_drowsy = drowsy

    # 상태 시각화
    cv2.putText(frame, f"Eye Detected: {eye_detected}", (10, 20), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 255), 1)
    cv2.putText(frame, f"Eye Closed: {eye_closed}", (10, 40), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 255), 1)
    cv2.putText(frame, f"Hands Moving: {hands_moving}", (10, 60), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 1)
    status = "DROWSY" if drowsy else "AWAKE"
    color = (0, 0, 255) if drowsy else (0, 255, 0)
    cv2.putText(frame, f"Status: {status}", (10, h - 20), cv2.FONT_HERSHEY_SIMPLEX, 0.7, color, 2)

    cv2.imshow("Drowsiness Detection", frame)
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# 종료 후 저장
for e in drowsy_events:
    if e['end'] is None:
        e['end'] = datetime.fromtimestamp(time.time()).isoformat()

with open("drowsy_log.json", "w") as f:
    json.dump(drowsy_events, f, indent=2)
    
# q10초 이상 지속된 졸음 이벤트만 집계
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
    except:
        continue

summary = {
    "sleep_cnt": sleep_cnt,
    "sleep_time": int(sleep_time)
}

with open("summary_drowsy.json", "w") as f:
    json.dump(summary, f, indent=2)


cap.release()
cv2.destroyAllWindows()
