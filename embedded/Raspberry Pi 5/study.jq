# study_filter.jq 파일 내용

# 입력 배열: .[0]=rpi4_data, .[1]=drowsy_data
(.[0] // {})                                          # 첫 번째 파일 읽기 (오류 시 빈 객체)
* {rassId: "01", date: (now | strftime("%Y-%m-%d"))} # rassId, 현재 날짜 추가
* (.[1] // {})                                          # 두 번째 파일 읽기 (오류 시 빈 객체)
| .sleepCount = (.sleepCnt // .sleepCount // null)      # sleepCount 필드 생성/업데이트
| del(.sleepCnt?)                                       # sleepCnt 필드 삭제 (있으면)
| del(.poseUrl?)                                        # poseUrl 필드 삭제 (있으면)