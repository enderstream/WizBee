// LogOut.tsx
import React, { useState } from 'react'

interface LogOutProps {
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  setStatusMessage: (message: string) => void;
}

const LogOut: React.FC<LogOutProps> = ({ isLoading, setIsLoading, setStatusMessage }) => {
  const [showModal, setShowModal] = useState(false)

  // 로그아웃 처리
  const handleLogout = async () => {
    try {
      setIsLoading(true)
      // 여기에 로그아웃 로직 구현
      // 예: API 호출, 로컬 스토리지 삭제 등
      console.log('로그아웃 처리 중...')
      
      // 로그아웃 성공 후 리다이렉트 (필요시)
      // window.location.href = '/login'
      
      // 테스트용 지연
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setStatusMessage('로그아웃 되었습니다.')
    } catch (error) {
      console.error('로그아웃 오류:', error)
      setStatusMessage('로그아웃 중 오류가 발생했습니다.')
    } finally {
      setIsLoading(false)
      setShowModal(false)
    }
  }

  return (
    <>
      {/* 로그아웃 버튼 */}
      <button
        className="w-full py-4 px-4 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-gray-800 rounded-xl font-medium transition-colors touch-manipulation disabled:opacity-70 disabled:cursor-not-allowed"
        onClick={() => setShowModal(true)}
        disabled={isLoading}
      >
        로그아웃
      </button>

      {/* 로그아웃 확인 모달 */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl">
            <div className="p-6 text-center">
              <h3 className="text-xl font-bold mb-4">로그아웃</h3>
              <p className="text-gray-700 text-lg mb-3">정말로 로그아웃 하시겠습니까?</p>
              
              <div className="flex gap-3 mt-8">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-4 px-4 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-gray-800 rounded-xl font-medium transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                  disabled={isLoading}
                >
                  취소
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 py-4 px-4 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white rounded-xl font-medium transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
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