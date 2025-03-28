import sys
import cv2
import numpy as np
import time
import json
import mediapipe as mp
import torch

# YOLOv5 경로 등록
sys.path.append(r"C:\Users\SSAFY\Desktop\PJT\yolov5")
from models.common import DetectMultiBackend
from utils.general import non_max_suppression

# Mediapipe 초기화
mp_face_mesh = mp.solutions.face_mesh
face_mesh = mp_face_mesh.FaceMesh(static_image_mode=False, max_num_faces=1, refine_landmarks=True)

# 눈동자(iris) 중심점 인덱스
LEFT_IRIS_CENTER_IDX = 468
RIGHT_IRIS_CENTER_IDX = 473

# 이미지 크기 맞추기
def letterbox(im, new_shape=(640, 640), color=(114, 114, 114), stride=32):
    shape = im.shape[:2]
    r = min(new_shape[0] / shape[0], new_shape[1] / shape[1])
    new_unpad = int(round(shape[1] * r)), int(round(shape[0] * r))
    dw, dh = new_shape[1] - new_unpad[0], new_shape[0] - new_unpad[1]
    dw /= 2
    dh /= 2
    im = cv2.resize(im, new_unpad, interpolation=cv2.INTER_LINEAR)
    top, bottom = int(round(dh)), int(round(dh))
    left, right = int(round(dw)), int(round(dw))
    return cv2.copyMakeBorder(im, top, bottom, left, right, cv2.BORDER_CONSTANT, value=color)

# 좌표 보정
def scale_coords(img1_shape, coords, img0_shape):
    gain = min(img1_shape[0] / img0_shape[0], img1_shape[1] / img0_shape[1])
    pad = (img1_shape[1] - img0_shape[1] * gain) / 2, (img1_shape[0] - img0_shape[0] * gain) / 2
    coords[:, [0, 2]] -= pad[0]
    coords[:, [1, 3]] -= pad[1]
    coords[:, :4] /= gain
    coords[:, :4] = coords[:, :4].clamp(min=0)
    return coords

# 모델 불러오기
device = torch.device('cpu')
model = DetectMultiBackend(weights=r"C:\Users\SSAFY\Desktop\PJT\best_windows.pt", device=device)
model.model.eval()

cap = cv2.VideoCapture(0)

while True:
    ret, frame = cap.read()
    if not ret:
        break

    rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    results = face_mesh.process(rgb)

    eye_closed = False
    eye_detected = False
    iris_value = 0
    iris_pos = None

    # 눈동자 중심점 기준 시각화 및 픽셀값 추출
    if results.multi_face_landmarks:
        face_landmarks = results.multi_face_landmarks[0]
        h, w = frame.shape[:2]

        for idx in [LEFT_IRIS_CENTER_IDX, RIGHT_IRIS_CENTER_IDX]:
            x = int(face_landmarks.landmark[idx].x * w)
            y = int(face_landmarks.landmark[idx].y * h)
            if 0 <= y < h and 0 <= x < w:
                iris_value = frame[y, x][0]  # 파란 채널 기준
                iris_pos = (x, y)
                cv2.circle(frame, (x, y), 4, (0, 255, 255), -1)
                eye_closed = iris_value > 60
                eye_detected = True
                cv2.putText(frame, f"Iris: {iris_value}", (x + 5, y), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 255), 1)

    # YOLO 전처리
    img = letterbox(frame)
    img = img[:, :, ::-1].transpose(2, 0, 1)
    img = np.ascontiguousarray(img)
    img_tensor = torch.from_numpy(img).float().unsqueeze(0) / 255.0

    # 추론
    with torch.no_grad():
        pred = model(img_tensor)[0]
        pred = non_max_suppression(pred, 0.5, 0.45)[0]

    if pred is not None and len(pred):
        pred[:, :4] = scale_coords(img_tensor.shape[2:], pred[:, :4], frame.shape).round()
        for *xyxy, conf, cls in pred:
            x1, y1, x2, y2 = map(int, xyxy)
            cv2.rectangle(frame, (x1, y1), (x2, y2), (255, 0, 255), 2)

    # 좌측 상단에 상태 표시
    if eye_detected:
        eye_status = "CLOSED" if eye_closed else "OPEN"
        color = (0, 0, 255) if eye_closed else (0, 255, 0)
        cv2.putText(frame, f"Eye Status: {eye_status} (Iris: {iris_value})", (20, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.7, color, 2)
    else:
        cv2.putText(frame, "Eye Status: NOT DETECTED", (20, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (128, 128, 128), 2)

    cv2.imshow("YOLO + Iris Detection", frame)
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
face_mesh.close()