import React, { useEffect, useState } from 'react'
import PoseImageModal from './PoseImageModal'

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
  data: { poseImageUrls: Array<{ poseImageUrl: string }> }
  status: number
}

interface PoseDataProps {
  poseData?: poseDataList
  wrongPoseImages?: wrongPoseImageSet
}

const PoseCount: React.FC<PoseDataProps> = ({ poseData, wrongPoseImages }) => {
  // 이미지 URL을 저장할 상태
  const [imageUrls, setImageUrls] = useState<string[]>([])
  // 데이터 로딩 상태
  const [isLoading, setIsLoading] = useState(true)
  // 모달 표시 상태
  const [showModal, setShowModal] = useState(false)

  // 각 자세의 횟수 데이터
  const poseCountData = [
    {
      name: '거북목',
      count: poseData?.data?.sumTurtleCnt || 0,
      bgColor: 'bg-green-100',
      textColor: 'text-green-600',
    },
    {
      name: '어깨 불균형',
      count: poseData?.data?.sumShoulderCnt || 0,
      bgColor: 'bg-red-100',
      textColor: 'text-red-600',
    },
    {
      name: '엎드림',
      count: poseData?.data?.sumDownCnt || 0,
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-600',
    },
  ]

  // 이미지 데이터를 처리하는 useEffect
  useEffect(() => {
    // 응답이 없는 경우 로딩 상태 유지
    if (!wrongPoseImages) {
      setIsLoading(true)
      return
    }

    try {
      // 상태 코드가 204인 경우 (No Content)
      if (wrongPoseImages.status === 204) {
        setImageUrls([])
        setIsLoading(false)
        return
      }

      // 데이터가 비어있는 경우 확인
      if (
        !wrongPoseImages.data ||
        !wrongPoseImages.data.poseImageUrls ||
        wrongPoseImages.data.poseImageUrls.length === 0
      ) {
        setImageUrls([])
        setIsLoading(false)
        return
      }

      // 데이터가 있을 때 처리
      const urls = wrongPoseImages.data.poseImageUrls.map(
        (item) => item.poseImageUrl,
      )

      // 상태 업데이트
      setImageUrls(urls)
      setIsLoading(false)
    } catch (error) {
      console.error('이미지 URL 처리 중 오류 발생:', error)
      setIsLoading(false)
    }
  }, [wrongPoseImages])

  // 모달 열기 함수
  const openModal = () => {
    setShowModal(true)
  }

  // 모달 닫기 함수
  const closeModal = () => {
    setShowModal(false)
  }

  return (
    <div className="flex flex-col px-4 pb-4">
      {/* 스타일링된 헤더 */}
      <header className="pt-2 pb-3 mb-3 border-b border-blue-200">
        <div className="flex items-center">
          <div className="w-1 h-6 bg-blue-500 rounded-full mr-3"></div>
          <h1 className="text-xl font-bold text-gray-800">오늘의 자세</h1>
          <div className="ml-auto">
            <button
              className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm"
              onClick={openModal}
            >
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

      {/* 이미지 모달 */}
      {showModal && (
        <PoseImageModal
          isOpen={showModal}
          onClose={closeModal}
          imageUrls={imageUrls}
          isLoading={isLoading}
        />
      )}
    </div>
  )
}

export default PoseCount
