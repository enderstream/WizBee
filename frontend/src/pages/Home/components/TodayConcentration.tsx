import React from 'react'

interface TodayConcentrationProps {
  concentrationPercentage?: number // 집중도 퍼센티지
}

const TodayConcentration: React.FC<TodayConcentrationProps> = ({
  concentrationPercentage = 85,
}) => {
  return (
    <div className="bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl p-5 shadow-sm relative overflow-hidden">
      <h3 className="text-gray-700 text-sm mb-2">오늘의 공부 집중도</h3>
      <div className="flex items-center justify-between">
        <div className="relative w-16 h-16">
          <svg className="w-full h-full" viewBox="0 0 36 36">
            <path
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="#E0E0E0"
              strokeWidth="3"
              strokeDasharray="100, 100"
            />
            <path
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="#9333EA"
              strokeWidth="3"
              strokeDasharray={`${concentrationPercentage}, 100`}
            />
            <text x="18" y="20.5" textAnchor="middle" fontSize="10" fill="#333" fontWeight="bold">
              {concentrationPercentage}%
            </text>
          </svg>
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
          className="text-purple-500"
        >
          <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44l-2-4A2.5 2.5 0 0 1 5 14.5h14a2.5 2.5 0 0 1 2 4l-2 4A2.5 2.5 0 0 1 14 19.5v-15a2.5 2.5 0 0 1 2.5-2.5h-7z"></path>
        </svg>
      </div>
    </div>
  )
}

export default TodayConcentration