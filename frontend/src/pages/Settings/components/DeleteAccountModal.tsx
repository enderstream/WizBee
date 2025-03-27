import React from 'react'
import { userAPI } from '@/api/userAPI'
import { useUserStore, selectUserId } from '@/store/userStore'
import { DeleteAccountModalProps } from '@/types/Setting'

const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({
  onClose,
  isLoading,
  setIsLoading,
  setStatusMessage,
}) => {
  // Zustand 스토어에서 userId 가져오기
  const userId = useUserStore(selectUserId)
  // 회원 탈퇴 처리
  const handleDeleteAccount = async () => {
    setIsLoading(true)
    try {
      await userAPI.deleteUser(userId)
      // 회원 탈퇴 성공 후 스토어 초기화
      useUserStore.getState().resetUser()
      onClose()

      // 상태 메시지 표시
      setStatusMessage('회원 탈퇴가 완료되었습니다.')
      setTimeout(() => {
        setStatusMessage('')
        // 회원 탈퇴 후 홈페이지로 리다이렉트 (선택 사항)
        // window.location.href = '/'
      }, 2000)
    } catch (error) {
      console.error('회원 탈퇴 실패:', error)
      setStatusMessage('회원 탈퇴에 실패했습니다.')
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
        <p>정말로 탈퇴하시겠습니까?</p>
        <p className="warning">이 작업은 되돌릴 수 없습니다.</p>
        <div className="modal-buttons">
          <button
            className="confirm-button delete-confirm"
            onClick={handleDeleteAccount}
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

export default DeleteAccountModal
