import React, { useRef, useState, TouchEvent } from 'react'
import ReactPlayer from 'react-player/lazy'
import { TimeLapseVideo } from '@/types/TimeLapse'
import DeleteIcon from '@/assets/icons/Delete.svg?react'
import EditIcon from '@/assets/icons/Edit.svg?react'
import PlayIcon from '@/assets/icons/Play.svg?react'
import { timeLapseAPI } from '@/api/timeLapseAPI'
import EditTitleModal from '@/pages/TimeLapseList/components/EditTitleModal'

interface VideoProps {
  video: TimeLapseVideo
  isPlaying: boolean
  onVideoUpdate?: (id: string, newTitle: string) => void
  onVideoDelete?: (id: string) => void
}

const Video: React.FC<VideoProps> = ({
  video,
  onVideoUpdate,
  onVideoDelete,
}) => {
  const videoInfoRef = useRef<HTMLDivElement>(null)
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const [isSliding, setIsSliding] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)

  // 슬라이드 관련 함수들
  const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    setTouchStart(e.targetTouches[0].clientX)
    setTouchEnd(null)
  }

  const handleTouchMove = (e: TouchEvent<HTMLDivElement>) => {
    setTouchEnd(e.targetTouches[0].clientX)

    if (touchStart && touchEnd && videoInfoRef.current) {
      const distance = touchStart - touchEnd

      // 왼쪽으로 스와이프 (최대 140px, 액션 버튼 너비와 동일)
      if (distance > 0 && distance <= 140) {
        videoInfoRef.current.style.transform = `translateX(-${distance}px)`
        setIsSliding(true)
      }
    }
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return

    const distance = touchStart - touchEnd

    if (videoInfoRef.current) {
      // 왼쪽으로 70px 이상 스와이프하면 완전히 열림
      if (distance > 70) {
        videoInfoRef.current.style.transform = 'translateX(-140px)'
        setIsSliding(true)
      } else {
        // 그렇지 않으면 원래 위치로 복귀
        videoInfoRef.current.style.transform = 'translateX(0)'
        setIsSliding(false)
      }
    }

    setTouchStart(null)
    setTouchEnd(null)
  }

  // 슬라이드 상태 초기화
  const resetSlide = () => {
    if (videoInfoRef.current) {
      videoInfoRef.current.style.transform = 'translateX(0)'
      setIsSliding(false)
    }
  }

  const handleEditClick = () => {
    setShowEditModal(true)
    resetSlide()
  }

  const handleDeleteClick = async () => {
    try {
      await timeLapseAPI.deleteTimeLapse(video.timelapseId)
      alert('타임랩스 삭제에 성공했습니다.')

      // 부모 컴포넌트에 삭제 알림
      if (onVideoDelete) {
        onVideoDelete(video.timelapseId)
      }
    } catch (error) {
      console.error('타임랩스 삭제 오류:', error)
      alert('타임랩스 삭제 중 오류가 발생했습니다.')
    }
    resetSlide()
  }

  const handlePlayButtonClick = (e: React.MouseEvent) => {
    // 이벤트 전파 중지 (부모 요소의 onClick이 발생하지 않도록)
    e.stopPropagation()

    // 슬라이드 중일 때는 비디오 재생 방지
    if (isSliding) {
      resetSlide()
      return
    }

    // 모달 열기
    setIsVideoModalOpen(true)
  }

  const handleVideoItemClick = () => {
    // 슬라이드 중일 때는 슬라이드 초기화만 수행
    if (isSliding) {
      resetSlide()
    }
  }

  const closeVideoModal = () => {
    setIsVideoModalOpen(false)
  }

  // 타이틀 업데이트 핸들러
  const handleTitleUpdate = (id: string, newTitle: string) => {
    // 부모 컴포넌트에 업데이트 알림
    if (onVideoUpdate) {
      onVideoUpdate(id, newTitle)
    }
  }

  return (
    <>
      <div className="mb-4 rounded-lg border border-slate-200 shadow-sm overflow-hidden bg-white relative">
        {/* 영상 정보 표시 (클릭 가능한 영역) */}
        <div
          ref={videoInfoRef}
          className="p-4 cursor-pointer border-l-4 border-l-blue-500 flex justify-between items-center relative transform translate-x-0 transition-transform duration-300 bg-white touch-pan-x"
          onClick={handleVideoItemClick}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="flex items-center flex-1">
            <div
              className="flex items-center text-blue-500 font-medium mr-4 border-r border-r-slate-200 pr-4 cursor-pointer"
              onClick={handlePlayButtonClick}
            >
              <PlayIcon className="mr-1 w-7 h-7" />
            </div>
            <div className="pl-2 cursor-default">
              <h3 className="text-base font-semibold text-slate-700 mb-1">
                {video.timelapseTitle}
              </h3>
              <p className="text-sm text-slate-500">{video.timelapseDate}</p>
            </div>
          </div>

          {/* 슬라이드 시 나타나는 작업 버튼들 */}
          <div className="absolute top-0 right-[-140px] h-full flex items-stretch">
            <button
              className="flex items-center justify-center w-[70px] text-white border-none cursor-pointer bg-blue-500"
              onClick={(e) => {
                e.stopPropagation()
                handleEditClick()
              }}
            >
              <EditIcon className="w-5 h-5" />
            </button>
            <button
              className="flex items-center justify-center w-[70px] text-white border-none cursor-pointer bg-red-500"
              onClick={(e) => {
                e.stopPropagation()
                handleDeleteClick()
              }}
            >
              <DeleteIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* 비디오 모달 */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg w-full max-w-3xl mx-4">
            <div className="flex justify-end items-center mb-4">
              <button
                onClick={closeVideoModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="relative w-full">
              <ReactPlayer
                url={video.timelapseUrl}
                controls
                playing={true}
                width="100%"
                height="auto"
                className="w-full h-full rounded"
                onEnded={closeVideoModal}
              />
            </div>
            <div className="mt-4">
              <h3 className="text-base font-semibold text-slate-700 mb-1">
                {video.timelapseTitle}
              </h3>
              <p className="text-sm text-slate-500">{video.timelapseDate}</p>
            </div>
          </div>
        </div>
      )}

      {/* 제목 수정 모달 */}
      {showEditModal && (
        <EditTitleModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          video={video}
          onTitleUpdate={handleTitleUpdate}
        />
      )}
    </>
  )
}

export default Video