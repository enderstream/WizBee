import React from 'react'
import { useSettingsState } from '@/hooks/useSettingsState'
import { useProfileUpdate } from '@/hooks/useProfileUpdate'
import { useAccountManagement } from '@/hooks/useAccountManagement'
import StatusMessage from './components/StatusMessage'
import SettingsButtons from './components/SettingsButtons'
import ProfileModal from './components/ProfileModal'
import ConfirmationModal from './components/ConfirmationModal'
import '@/styles/Settings.css'

const Settings: React.FC = () => {
  // Settings state management
  const { 
    showProfileModal, 
    showLogoutModal, 
    showDeleteModal, 
    statusMessage,
  } = useSettingsState()
  

  return (
    <div className="settings-page">
      {/* Status message component */}
      {statusMessage && <StatusMessage />}

      {/* Settings buttons component */}
      <SettingsButtons />

      {/* Profile edit modal */}
      {showProfileModal && <ProfileModal />}

      {/* Logout confirmation modal */}
      {showLogoutModal && (
        <ConfirmationModal
          title="로그아웃"
          message="정말로 로그아웃 하시겠습니까?"
          isDelete={false}
        />
      )}

      {/* Account deletion confirmation modal */}
      {showDeleteModal && (
        <ConfirmationModal
          title="회원 탈퇴"
          message="정말로 탈퇴하시겠습니까?"
          warningMessage="이 작업은 되돌릴 수 없습니다."
          isDelete={true}
        />
      )}
    </div>
  )
}

export default Settings