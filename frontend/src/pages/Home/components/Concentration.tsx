import React from 'react'
import ConcentrateIcon from '@/assets/icons/Concentrate.svg?react'

interface ConcentrationData {
  data: number
  status: number
}

interface ConcentrationProps {
  concentrationData?: ConcentrationData
}

const Concentration: React.FC<ConcentrationProps> = ({ concentrationData }) => {
  // 집중도 계산 및 포맷팅
  const concentrationPercent = concentrationData
    ? Math.round(concentrationData.data * 100)
    : 0

  // 집중도에 따른 이모지와 멘트
  const getFeedback = (percent: number) => {
    if (percent >= 80) return { emoji: '🎯', message: '최고의 집중력!!!' }
    if (percent >= 60) return { emoji: '👍', message: '좋은 집중력!!' }
    if (percent >= 40) return { emoji: '🔍', message: '힘내서 집중!' }
    return { emoji: '😴', message: '잠시 쉬어요...' }
  }

  const feedback = getFeedback(concentrationPercent)

  return (
    <div className="mb-6 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl p-3 shadow-sm relative overflow-hidden h-[88px]">
      <div className="flex items-center h-full">
        {/* 아이콘 영역 */}
        <div className="pr-3 border-r border-purple-300/60 flex items-center h-full">
          <ConcentrateIcon className="w-16 h-16" />
        </div>

        {/* 텍스트 영역 */}
        <div className="pl-3 flex-1 flex flex-col justify-center">
          <h1 className="text-center font-bold text-purple-800 text-base">
            오늘의 집중 효율
          </h1>

          <div className="flex justify-center items-center mt-1">
            {/* 수치 영역 */}
            <div className="flex items-baseline pr-2">
              <span className="text-2xl font-bold text-purple-900">
                {concentrationPercent}
              </span>
              <span className="text-xl font-bold text-purple-700 ml-1">%</span>
            </div>

            {/* 구분선 */}
            <div className="h-6 border-r border-purple-300/60 mx-1"></div>

            {/* 이모지와 멘트 영역 */}
            <div className="flex items-center pl-2">
              <span className="text-xl mr-1">{feedback.emoji}</span>
              <span className="text-sm text-purple-700 font-medium">
                {feedback.message}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Concentration
