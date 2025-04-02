import React from 'react'
import { useSettingsState } from '@/hooks/useSettingsState'
import { useProfileUpdate } from '@/hooks/useProfileUpdate'

const SettingsButtons: React.FC = () => {
  const { isLoading, setShowLogoutModal, setShowDeleteModal } =
    useSettingsState()
  const { handleOpenProfileModal } = useProfileUpdate()

  return (
    <div className="settings-buttons">
      <button
        className="settings-button"
        onClick={handleOpenProfileModal}
        disabled={isLoading}
      >
        내 정보 수정
      </button>

      <button
        className="settings-button"
        onClick={() => setShowLogoutModal(true)}
        disabled={isLoading}
      >
        로그아웃
      </button>

      <button
        className="settings-button delete-button"
        onClick={() => setShowDeleteModal(true)}
        disabled={isLoading}
      >
        회원 탈퇴
      </button>
    </div>
  )
}

export default SettingsButtons
