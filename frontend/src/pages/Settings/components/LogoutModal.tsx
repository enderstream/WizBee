import React from 'react'
import { userAPI } from '@/api/userAPI'
import { useUserStore, selectUserId } from '@/store/userStore'
import { LogoutModalProps } from '@/types/Setting'

const LogoutModal: React.FC<LogoutModalProps> = ({
  onClose,
  isLoading,
  setIsLoading,
  setStatusMessage,
}) => {
  // Zustand 스토어에서 userId 가져오기
  const userId = useUserStore(selectUserId)
  // 로그아웃 처리
  const handleLogout = async () => {
    setIsLoading(true)
    try {
      await userAPI.logout(userId)
      // 로그아웃 성공 후 스토어 초기화
      useUserStore.getState().resetUser()
      onClose()

      // 상태 메시지 표시
      setStatusMessage('로그아웃 되었습니다.')
      setTimeout(() => {
        setStatusMessage('')
        // 로그아웃 후 홈페이지로 리다이렉트 (선택 사항)
        // window.location.href = '/'
      }, 2000)
    } catch (error) {
      console.error('로그아웃 실패:', error)
      setStatusMessage('로그아웃에 실패했습니다.')
      setTimeout(() => {
        setStatusMessage('')
      }, 2000)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content confirmation-modal">
        <p>정말로 로그아웃 하시겠습니까?</p>
        <div className="modal-buttons">
          <button
            className="confirm-button"
            onClick={handleLogout}
            disabled={isLoading}
          >
            {isLoading ? '처리 중...' : '네'}
          </button>
          <button
            className="cancel-button"
            onClick={onClose}
            disabled={isLoading}
          >
            아니오
          </button>
        </div>
      </div>
    </div>
  )
}

export default LogoutModal
