# pose_filter.jq (최종 수정: 변수 사용으로 컨텍스트 문제 해결)
# 입력: .[0]=rpi4, .[1]=shoulder, .[2]=s3

# 1. 필요한 값들을 원본 배열 '.'에서 추출하여 변수에 저장
(.[0].poseUrl // []) as $rpiUrls      # RPi4 URL 리스트
| (.[2].images | map(.url // null) | map(select(. != null)) // []) as $s3Urls # S3 URL 리스트
| (.[0] // {}) as $rpiData          # RPi4 기본 데이터 객체
| (.[1] // {}) as $shoulderData     # Shoulder 데이터 객체

# 2. 저장된 변수들을 사용하여 최종 객체 생성
| $rpiData * $shoulderData * {poseDate: (now | strftime("%Y-%m-%d"))} # 기본 데이터 병합 및 날짜 추가
| . + { poseUrl: ($rpiUrls + $s3Urls) }                             # 계산된 URL 리스트 추가