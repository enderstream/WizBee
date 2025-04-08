import React from 'react'

interface AverageStudyTimeProps {
  averageTime?: string // 평균 순공시간
  progressPercentage?: number // 진행률 퍼센티지
}

const AverageStudyTime: React.FC<AverageStudyTimeProps> = ({
  averageTime = '5시간 32분',
  progressPercentage = 70,
}) => {
  return (
    <div className="bg-gradient-to-r from-blue-100 to-blue-200 rounded-2xl p-6 mb-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-gray-700 mb-1">평균 순공시간</h3>
          <p className="text-2xl font-bold text-gray-800">{averageTime}</p>
        </div>
        <div className="bg-white p-3 rounded-full shadow-md">
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
            className="text-blue-500"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
        </div>
      </div>
      <div className="mt-4 bg-white bg-opacity-50 h-2 rounded-full overflow-hidden">
        <div 
          className="bg-blue-500 h-full rounded-full" 
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
    </div>
  )
}

export default AverageStudyTime