import React from 'react'
import { SettingsButtonsProps } from '@/types/Setting'

const SettingsButtons: React.FC<SettingsButtonsProps> = ({
  onOpenProfileModal,
  onOpenLogoutModal,
  onOpenDeleteModal,
  isLoading,
}) => {
  return (
    <div className="settings-buttons">
      <button
        className="settings-button"
        onClick={onOpenProfileModal}
        disabled={isLoading}
      >
        내 정보 수정
      </button>

      <button
        className="settings-button"
        onClick={onOpenLogoutModal}
        disabled={isLoading}
      >
        로그아웃
      </button>

      <button
        className="settings-button delete-button"
        onClick={onOpenDeleteModal}
        disabled={isLoading}
      >
        회원 탈퇴
      </button>
    </div>
  )
}

export default SettingsButtons
