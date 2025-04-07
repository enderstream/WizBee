// DeleteUser.tsx
import React from 'react'
import { useSettings } from '@/hooks/useSettings'

const DeleteUser: React.FC = () => {
  const {
    isLoading,
    showDeleteModal,
    setShowDeleteModal,
    handleDeleteAccount
  } = useSettings()

  return (
    <>
      {/* 회원 탈퇴 버튼 */}
      <button
        className="w-full py-4 px-4 bg-gray-100 hover:bg-red-50 active:bg-red-100 text-red-600 rounded-xl font-medium transition-colors touch-manipulation disabled:opacity-70 disabled:cursor-not-allowed"
        onClick={() => setShowDeleteModal(true)}
        disabled={isLoading}
      >
        회원 탈퇴
      </button>

      {/* 회원 탈퇴 확인 모달 */}
      {showDeleteModal && (
        <div className="fixed inset-0 backdrop-blur-[2px] bg-black/20 flex items-center justify-center z-50 px-4">
          <div className="bg-white w-full max-w-md rounded-xl shadow-xl overflow-hidden">
            {/* 모달 헤더 */}
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold">회원 탈퇴</h3>
              <button
                className="text-2xl text-gray-500 hover:text-gray-800 transition-colors"
                onClick={() => setShowDeleteModal(false)}
                disabled={isLoading}
                aria-label="닫기"
              >
                &times;
              </button>
            </div>

            <div className="p-5">
              <p className="text-center text-gray-700 mb-3">정말로 탈퇴하시겠습니까?</p>
              <p className="text-center text-red-500 text-sm mb-5">이 작업은 되돌릴 수 없습니다.</p>
              
              <div className="flex justify-end space-x-3 mt-5">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md font-medium transition-colors"
                  disabled={isLoading}
                >
                  취소
                </button>
                <button
                  onClick={handleDeleteAccount}
                  className={`px-4 py-2 rounded-md font-medium text-white ${
                    isLoading 
                      ? 'bg-red-300 cursor-not-allowed'
                      : 'bg-red-500 hover:bg-red-600 transition-colors'
                  }`}
                  disabled={isLoading}
                >
                  {isLoading ? '처리 중...' : '탈퇴'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default DeleteUser