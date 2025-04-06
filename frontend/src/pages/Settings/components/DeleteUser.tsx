// DeleteUser.tsx
import React, { useState } from 'react'

interface DeleteUserProps {
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  setStatusMessage: (message: string) => void;
}

const DeleteUser: React.FC<DeleteUserProps> = ({ isLoading, setIsLoading, setStatusMessage }) => {
  const [showModal, setShowModal] = useState(false)

  // 회원 탈퇴 처리
  const handleDeleteAccount = async () => {
    try {
      setIsLoading(true)
      // 여기에 회원 탈퇴 로직 구현
      // 예: API 호출, 로컬 스토리지 삭제 등
      console.log('회원 탈퇴 처리 중...')

      // 테스트용 지연
      await new Promise(resolve => setTimeout(resolve, 1000))

      // 탈퇴 성공 후 리다이렉트 (필요시)
      // window.location.href = '/login'

      setStatusMessage('회원 탈퇴가 완료되었습니다.')
    } catch (error) {
      console.error('회원 탈퇴 오류:', error)
      setStatusMessage('회원 탈퇴 중 오류가 발생했습니다.')
    } finally {
      setIsLoading(false)
      setShowModal(false)
    }
  }

  return (
    <>
      {/* 회원 탈퇴 버튼 */}
      <button
        className="w-full py-4 px-4 bg-gray-100 hover:bg-red-50 active:bg-red-100 text-red-600 rounded-xl font-medium transition-colors touch-manipulation disabled:opacity-70 disabled:cursor-not-allowed"
        onClick={() => setShowModal(true)}
        disabled={isLoading}
      >
        회원 탈퇴
      </button>

      {/* 회원 탈퇴 확인 모달 */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl">
            <div className="p-6 text-center">
              <h3 className="text-xl font-bold mb-4">회원 탈퇴</h3>
              <p className="text-gray-700 text-lg mb-3">정말로 탈퇴하시겠습니까?</p>
              <p className="text-red-500 text-sm mb-4">이 작업은 되돌릴 수 없습니다.</p>

              <div className="flex gap-3 mt-8">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-4 px-4 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-gray-800 rounded-xl font-medium transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                  disabled={isLoading}
                >
                  취소
                </button>
                <button
                  onClick={handleDeleteAccount}
                  className="flex-1 py-4 px-4 bg-red-500 hover:bg-red-600 active:bg-red-700 text-white rounded-xl font-medium transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
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