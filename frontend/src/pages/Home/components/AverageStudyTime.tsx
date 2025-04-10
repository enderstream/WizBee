import React from 'react'
import ClockIcon from '@/assets/icons/Clock.svg?react'

interface AverageStudyTimeData {
  data: {
    userAvg: number
    userYearAvg: number
  }
  status: number
}

interface AverageStudyTimeProps {
  averageStudyTimeData?: AverageStudyTimeData
}

const AverageStudyTime: React.FC<AverageStudyTimeProps> = ({
  averageStudyTimeData,
}) => {
  // 데이터가 없거나 status가 204인 경우
  const isNoData = !averageStudyTimeData || averageStudyTimeData.status === 204

  // 시간 계산 함수
  const formatHours = (minutes: number) => {
    return (minutes / 60).toFixed(1)
  }

  // 데이터가 있는 경우만 계산
  const myHours = !isNoData ? formatHours(averageStudyTimeData.data.userAvg) : '0'
  const peerHours = !isNoData ? formatHours(averageStudyTimeData.data.userYearAvg) : '0'

  return (
    <div className="bg-gradient-to-r from-blue-100 to-blue-200 rounded-2xl p-3 mb-6 shadow-sm">
      <div className="flex">
        {/* 아이콘 영역 */}
        <div className="pr-4 border-r border-blue-300/50 flex items-center">
          <ClockIcon className="w-16 h-16" />
        </div>

        {/* 텍스트 영역 */}
        <div className="flex-1 pl-4">
          {/* 제목 */}
          <h1 className="text-center font-bold text-blue-800 text-lg mb-2">
            평균 순공 시간
          </h1>

          {isNoData ? (
            // 데이터가 없는 경우 서비스 이용 권유 메시지
            <div className="flex justify-center items-center">
              <p className="text-blue-700 font-medium text-center">
                순공 시간을 측정해봐요!
              </p>
            </div>
          ) : (
            // 데이터가 있는 경우 비교 정보 표시
            <>
              {/* 가로 구분선 */}
              <div className="border-b border-blue-300/50 mb-2"></div>

              {/* 데이터 영역 */}
              <div className="flex text-center">
                {/* 내 시간 */}
                <div className="flex-1 pr-2">
                  <h3 className="text-blue-700 font-medium mb-1">나</h3>
                  <p className="text-blue-900 font-bold text-xl">{myHours} 시간</p>
                </div>

                {/* 세로 구분선 */}
                <div className="border-r border-blue-300/50"></div>

                {/* 또래 평균 */}
                <div className="flex-1 pl-2">
                  <h3 className="text-blue-700 font-medium mb-1">또래</h3>
                  <p className="text-blue-900 font-bold text-xl">
                    {peerHours} 시간
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default AverageStudyTime