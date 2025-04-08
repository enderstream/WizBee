import React from 'react'

interface PosePointProps {
  poseScore?: number // 자세 점수
  starRating?: number // 별점 (5점 만점)
}

const PosePoint: React.FC<PosePointProps> = ({
  poseScore = 92,
  starRating = 4.5,
}) => {
  return (
    <div className="bg-gradient-to-br from-green-100 to-green-200 rounded-2xl p-5 shadow-sm relative overflow-hidden">
      <h3 className="text-gray-700 text-sm mb-2">오늘의 자세 점수</h3>
      <div className="flex items-center justify-between">
        <div className="flex items-end">
          <span className="text-3xl font-bold text-gray-800">{poseScore}</span>
          <span className="text-lg text-gray-600 ml-1">점</span>
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-green-600"
        >
          <circle cx="12" cy="8" r="6"></circle>
          <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"></path>
        </svg>
      </div>
      <div className="mt-2 flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <div
            key={star}
            className={`h-1.5 flex-1 rounded-full ${star <= starRating ? 'bg-green-500' : 'bg-gray-300'}`}
          ></div>
        ))}
      </div>
    </div>
  )
}

export default PosePoint
