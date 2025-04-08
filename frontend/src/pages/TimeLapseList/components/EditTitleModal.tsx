import React, { useState, useRef, useEffect } from 'react'
import { TimeLapseVideo } from '@/types/TimeLapse'
import { timeLapseAPI } from '@/api/timeLapseAPI'

interface EditTitleModalProps {
  isOpen: boolean
  onClose: () => void
  video: TimeLapseVideo
  onTitleUpdate: (id: string, newTitle: string) => void
}

const EditTitleModal: React.FC<EditTitleModalProps> = ({
  isOpen,
  onClose,
  video,
  onTitleUpdate,
}) => {
  const [newTitle, setNewTitle] = useState('')
  const modalRef = useRef<HTMLDivElement>(null)

  // 모달이 열릴 때 현재 제목을 입력창에 설정
  useEffect(() => {
    if (isOpen) {
      setNewTitle(video.timelapseTitle)
    }
  }, [isOpen, video.timelapseTitle])

  // 모달 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose])

  // 제목 수정 처리
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!newTitle.trim()) {
      alert('제목을 입력해주세요.')
      return
    }

    try {
      const response = await timeLapseAPI.editTimeLapseTitle(
        video.timelapseId,
        newTitle,
      )

      if (response.status === 200) {
        // 부모 컴포넌트에 타이틀 업데이트 알림
        onTitleUpdate(video.timelapseId, newTitle)
        onClose()
      } else {
        alert('제목 수정에 실패했습니다.')
      }
    } catch (error) {
      console.error('제목 수정 오류:', error)
      alert('제목 수정 중 오류가 발생했습니다.')
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 backdrop-blur-[2px] bg-black/20 flex items-center justify-center z-50 p-4">
      <div
        ref={modalRef}
        className="bg-white w-full max-w-md rounded-xl shadow-xl overflow-hidden"
      >
        {/* 모달 헤더 */}
        <div className="flex justify-between items-center px-4 py-3 border-b border-gray-200">
          <h3 className="text-lg font-semibold">타임랩스 제목 수정</h3>
          <button
            className="text-2xl text-gray-500 active:text-gray-800 transition-colors"
            onClick={onClose}
            aria-label="닫기"
          >
            &times;
          </button>
        </div>

        {/* 모달 내용 */}
        <form onSubmit={handleSubmit}>
          <div className="p-5">
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder={video.timelapseTitle}
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
              autoFocus
            />

            <div className="flex justify-end mt-5">
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-100 active:bg-gray-200 rounded-md font-medium transition-colors"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 active:bg-blue-600 text-white rounded-md font-medium transition-colors"
                >
                  수정하기
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditTitleModal
