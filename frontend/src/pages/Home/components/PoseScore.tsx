import React from 'react'
import MedalIcon from '@/assets/icons/Medal.svg?react'

interface PoseScoreData {
  data: string
  status: number
}

interface PoseScoreProps {
  poseScoreData?: PoseScoreData // 자세 점수
}

const PoseScore: React.FC<PoseScoreProps> = ({
  // poseScoreData
}) => {
  // 임시 하드코딩 점수 (나중에 poseScoreData 사용 예정)
  const score = 85;
  
  // 점수에 따른 피드백 제공
  const getFeedback = (score: number) => {
    if (score >= 90) return { emoji: '🏆', message: '최고의 자세!!!' };
    if (score >= 75) return { emoji: '🥇', message: '훌륭한 자세!!' };
    if (score >= 60) return { emoji: '👍', message: '좋은 자세입니다' };
    if (score >= 40) return { emoji: '🧘', message: '자세를 조금만 더...' };
    return { emoji: '🪑', message: '자세 교정이 필요해요' };
  };
  
  const feedback = getFeedback(score);
  
  return (
    <div className="mb-6 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl p-3 shadow-sm relative overflow-hidden h-[88px]">
      <div className="flex items-center h-full">
        {/* 아이콘 영역 */}
        <div className="pr-3 border-r border-green-300/60 flex items-center h-full">
          <MedalIcon className="w-16 h-16" />
        </div>
        
        {/* 텍스트 영역 */}
        <div className="pl-3 flex-1 flex flex-col justify-center">
          <h1 className="text-center font-bold text-green-800 text-base">오늘의 자세 점수</h1>
          
          <div className="flex justify-center items-center mt-1">
            {/* 점수 영역 */}
            <div className="flex items-baseline pr-2">
              <span className="text-2xl font-bold text-green-900">{score}</span>
              <span className="text-xl font-bold text-green-700 ml-1">점</span>
            </div>
            
            {/* 구분선 */}
            <div className="h-6 border-r border-green-300/60 mx-1"></div>
            
            {/* 이모지와 멘트 영역 */}
            <div className="flex items-center pl-2">
              <span className="text-xl mr-1">{feedback.emoji}</span>
              <span className="text-sm text-green-700 font-medium">{feedback.message}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PoseScore