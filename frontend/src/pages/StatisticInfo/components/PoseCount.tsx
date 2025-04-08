import React from 'react'

interface poseDataList {
  data: {
    pose_date: string
    sumDownCnt: number
    sumShoulderCnt: number
    sumTurtleCnt: number
    userId: number
  }
  status: number
}

interface wrongPoseImageSet {
  data: { poseImageUrls: Array<String> }
  status: number
}

interface PoseDataProps {
  poseData?: poseDataList
  wrongPoseImages?: wrongPoseImageSet
}

const PoseCount: React.FC<PoseDataProps> = ({
  poseData,
  // wrongPoseImages,
}) => {

  // 각 자세의 횟수 데이터
  const poseCountData = [
    {
      name: '거북목',
      count: poseData?.data?.sumTurtleCnt,
      bgColor: 'bg-green-100',
      textColor: 'text-green-600',
    },
    {
      name: '어깨 불균형',
      count: poseData?.data?.sumShoulderCnt,
      bgColor: 'bg-red-100',
      textColor: 'text-red-600',
    },
    {
      name: '엎드림',
      count: poseData?.data?.sumDownCnt,
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-600',
    },
  ]

  return (
    <div className="flex flex-col px-4 pb-4">
      {/* 스타일링된 헤더 */}
      <header className="pt-2 pb-3 mb-3 border-b border-blue-200">
        <div className="flex items-center">
          <div className="w-1 h-6 bg-blue-500 rounded-full mr-3"></div>
          <h1 className="text-xl font-bold text-gray-800">오늘의 자세</h1>
          <div className="ml-auto">
            <button className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm">
              자세 보러가기
            </button>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-3 gap-3 w-full">
        {poseCountData.map((pose, index) => (
          <div
            key={index}
            className={`${pose.bgColor} rounded-lg p-3 flex flex-col items-center shadow-sm`}
          >
            <div className={`text-sm font-medium ${pose.textColor} mb-1`}>
              {pose.name}
            </div>
            <div className={`text-xl font-bold ${pose.textColor}`}>
              {pose.count}회
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default PoseCount
