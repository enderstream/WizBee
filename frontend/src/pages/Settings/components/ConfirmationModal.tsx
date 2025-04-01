import React from 'react'
import { useSettingsState } from '@/hooks/useSettingsState'
import { useAccountManagement } from '@/hooks/useAccountManagement'

interface ConfirmationModalProps {
  title: string
  message: string
  warningMessage?: string
  isDelete: boolean
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  message,
  warningMessage,
  isDelete,
}) => {
  const { isLoading, setShowLogoutModal, setShowDeleteModal } =
    useSettingsState()
  const { handleLogout, handleDeleteAccount } = useAccountManagement()

  const onConfirm = () => {
    if (isDelete) {
      handleDeleteAccount()
    } else {
      handleLogout()
    }
  }

  const onCancel = () => {
    if (isDelete) {
      setShowDeleteModal(false)
    } else {
      setShowLogoutModal(false)
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content confirmation-modal">
        <p>{message}</p>
        {warningMessage && <p className="warning">{warningMessage}</p>}
        <div className="modal-buttons">
          <button
            className={`confirm-button ${isDelete ? 'delete-confirm' : ''}`}
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? '처리 중...' : '네'}
          </button>
          <button
            className="cancel-button"
            onClick={onCancel}
            disabled={isLoading}
          >
            아니오
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmationModal
