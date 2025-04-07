import React from 'react'
import { useSettings } from '@/hooks/useSettings'
import LogOutIcon from '@/assets/icons/LogOut.svg?react'
import ArrowRightIcon from '@/assets/icons/ArrowRight.svg?react'

const LogOut: React.FC = () => {
  const { isLoading, showLogoutModal, setShowLogoutModal, handleLogout } =
    useSettings()

  return (
    <>
      {/* 로그아웃 버튼 */}
      <button
        className="w-full flex items-center justify-between py-4 px-4 cursor-pointer text-left hover:bg-gray-50 disabled:opacity-70 disabled:cursor-not-allowed"
        onClick={() => setShowLogoutModal(true)}
        disabled={isLoading}
      >
        <div className="flex items-center">
          <LogOutIcon width={24} height={24} className="mr-3" />
          <span>로그아웃</span>
        </div>
        <ArrowRightIcon width={24} height={24} />
      </button>

      {/* 로그아웃 확인 모달 */}
      {showLogoutModal && (
        <div className="fixed inset-0 backdrop-blur-[2px] bg-black/20 flex items-center justify-center z-50 px-4">
          <div className="bg-white w-full max-w-md rounded-xl shadow-xl overflow-hidden">
            {/* 모달 헤더 */}
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold">로그아웃</h3>
              <button
                className="text-2xl text-gray-500 hover:text-gray-800 transition-colors"
                onClick={() => setShowLogoutModal(false)}
                disabled={isLoading}
                aria-label="닫기"
              >
                &times;
              </button>
            </div>

            <div className="p-5">
              <p className="text-center text-gray-700 mb-5">
                정말로 로그아웃 하시겠습니까?
              </p>

              <div className="flex justify-end space-x-3 mt-5">
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md font-medium transition-colors"
                  disabled={isLoading}
                >
                  취소
                </button>
                <button
                  onClick={handleLogout}
                  className={`px-4 py-2 rounded-md font-medium text-white ${
                    isLoading
                      ? 'bg-blue-300 cursor-not-allowed'
                      : 'bg-blue-500 hover:bg-blue-600 transition-colors'
                  }`}
                  disabled={isLoading}
                >
                  {isLoading ? '처리 중...' : '로그아웃'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default LogOut
