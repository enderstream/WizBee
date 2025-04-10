import React, { useState } from 'react'
import GoogleLoginButton from '@/pages/Welcome/components/GoogleLoginButton'
import tutorialVideo from '@/assets/videos/tutorial.mp4'

const Welcome: React.FC = () => {
  // 비디오 모달의 열림/닫힘 상태를 관리하는 state
  const [isVideoModalOpen, setIsVideoModalOpen] = useState<boolean>(false)

  // 비디오 모달 열기
  const openVideoModal = () => {
    setIsVideoModalOpen(true)
  }

  // 비디오 모달 닫기
  const closeVideoModal = () => {
    setIsVideoModalOpen(false)
  }

  return (
    <div className="bg-white flex flex-col items-center justify-center text-center h-screen">
      {/* Logo text */}
      <div className="text-blue-500 text-6xl font-bold mb-4">WizBee</div>

      {/* Subtitle */}
      <div className="text-blue-500 text-xl mb-8">
        내가 집중했던 순간을 담아보세요!
      </div>

      {/* Introduction button */}
      <div className="relative mb-12 w-60 sm:w-80">
        <button
          className="bg-blue-500 bg-opacity-20 text-white rounded-full px-6 py-3 flex items-center justify-center w-full active:bg-blue-600 active:bg-opacity-40 transition-colors duration-150 shadow-md"
          onClick={openVideoModal}
        >
          <span className="mx-auto">WizBee를 소개합니다!</span>
        </button>
        <svg
          className="w-5 h-5 absolute right-4 top-1/2 transform -translate-y-1/2"
          fill="none"
          stroke="white"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 5l7 7-7 7"
          />
        </svg>
      </div>

      {/* Login section */}
      <GoogleLoginButton />

      {/* Video Modal */}
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
              <video
                src={tutorialVideo}
                controls
                autoPlay
                className="w-full h-full rounded"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Welcome
