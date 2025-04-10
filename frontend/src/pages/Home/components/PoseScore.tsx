import React from 'react'
import MedalIcon from '@/assets/icons/Medal.svg?react'

interface PoseScoreData {
  data: {
    sumDownCnt: number
    sumShoulderCnt: number
    sumTurtleCnt: number
  }
  status: number
}

interface PoseScoreProps {
  poseScoreData?: PoseScoreData // 자세 점수 데이터
}

/**
 * 자세 점수를 계산하는 함수
 *
 * - 각 지표별 가중치
 *    - 엎드린 자세: 2 (기본), 기준치 초과 시 추가 3
 *    - 어깨 불균형: 3 (기본), 기준치 초과 시 추가 5
 *    - 거북목: 5 (기본), 기준치 초과 시 추가 7
 *
 * - 기준치
 *    - 엎드린 자세: 2회 이하
 *    - 어깨 불균형: 3회 이하
 *    - 거북목: 5회 이하
 *
 * - 총 penalty P 계산:
 *    P = (2 * sumDown) + (3 * sumShoulder) + (5 * sumTurtle)
 *        + 3 * max(0, sumDown - 2)
 *        + 5 * max(0, sumShoulder - 3)
 *        + 7 * max(0, sumTurtle - 5)
 *
 * - 최대 허용 penalty M (임상적 기준에 따라 설정; 기본값 60)
 *
 * - 패널티 비율 R 계산:
 *    R = min(P, M) / M
 *
 * - 최종 점수 Score (Quadratic, concave down):
 *    Score = 100 * (1 - R^2)
 */
const calculateImprovedScore = (
  sumDown: number,
  sumShoulder: number,
  sumTurtle: number,
  M: number = 60,
): number => {
  const base = 2 * sumDown + 3 * sumShoulder + 5 * sumTurtle
  const extra =
    3 * Math.max(0, sumDown - 2) +
    5 * Math.max(0, sumShoulder - 3) +
    7 * Math.max(0, sumTurtle - 5)
  const totalPenalty = base + extra
  const penaltyRatio = Math.min(totalPenalty, M) / M
  const score = 100 * (1 - Math.pow(penaltyRatio, 2))
  return score
}

const PoseScore: React.FC<PoseScoreProps> = ({ poseScoreData }) => {
  // 데이터가 없거나 status가 204인 경우
  const isNoData = !poseScoreData || poseScoreData.status === 204

  // 점수 계산 (데이터가 있는 경우만)
  const score = !isNoData
    ? calculateImprovedScore(
        poseScoreData.data.sumDownCnt,
        poseScoreData.data.sumShoulderCnt,
        poseScoreData.data.sumTurtleCnt,
      )
    : 0

  // 점수에 따른 피드백 제공
  const getFeedback = (score: number) => {
    if (score >= 90) return { emoji: '🏆', message: '아주 건강해요!!!' }
    if (score >= 75) return { emoji: '🥇', message: '양호한 자세!!' }
    if (score >= 60) return { emoji: '👍', message: '조금만 신경써봐요!' }
    return { emoji: '🪑', message: '자세를 교정해봐요' }
  }

  const feedback = getFeedback(score)

  return (
    <div className="mb-6 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl p-3 shadow-sm relative overflow-hidden h-[88px]">
      <div className="flex items-center h-full">
        {/* 아이콘 영역 */}
        <div className="pr-3 border-r border-green-300/60 flex items-center h-full">
          <MedalIcon className="w-16 h-16" />
        </div>

        {/* 텍스트 영역 */}
        <div className="pl-3 flex-1 flex flex-col justify-center">
          <h1 className="text-center font-bold text-green-800 text-base">
            오늘의 자세 점수
          </h1>

          {isNoData ? (
            // 데이터가 없는 경우 서비스 이용 권유 메시지
            <div className="flex justify-center items-center mt-1">
              <p className="text-green-700 font-medium text-center">
                자세 점수를 측정해봐요!
              </p>
            </div>
          ) : (
            // 데이터가 있는 경우 점수와 피드백 표시
            <div className="flex justify-center items-center mt-1">
              {/* 점수 영역 */}
              <div className="flex items-baseline pr-2">
                <span className="text-2xl font-bold text-green-900">
                  {score.toFixed(0)}
                </span>
                <span className="text-xl font-bold text-green-700 ml-1">점</span>
              </div>

              {/* 구분선 */}
              <div className="h-6 border-r border-green-300/60 mx-1"></div>

              {/* 이모지와 멘트 영역 */}
              <div className="flex items-center pl-2">
                <span className="text-xl mr-1">{feedback.emoji}</span>
                <span className="text-sm text-green-700 font-medium">
                  {feedback.message}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default PoseScore