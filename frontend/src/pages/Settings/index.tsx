import React, { useState } from 'react'
import StatusMessage from '@/pages/Settings/components/StatusMessage'
import SettingsButtons from '@/pages/Settings/components/SettingsButtons'
import ProfileModal from '@/pages/Settings/components/ProfileModal'
import LogoutModal from '@/pages/Settings/components/LogoutModal'
import DeleteAccountModal from '@/pages/Settings/components/DeleteAccountModal'
import '@/styles/Settings.css'

const Settings: React.FC = () => {
  // 모달 상태 관리
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [statusMessage, setStatusMessage] = useState('')

  // 프로필 수정 모달 열기
  const handleOpenProfileModal = () => {
    setShowProfileModal(true)
  }

  return (
    <div className="settings-page">
      {/* 상태 메시지 */}
      {statusMessage && (
        <StatusMessage
          message={statusMessage}
          onClose={() => setStatusMessage('')}
        />
      )}

      {/* 버튼 컨테이너 */}
      <SettingsButtons
        onOpenProfileModal={handleOpenProfileModal}
        onOpenLogoutModal={() => setShowLogoutModal(true)}
        onOpenDeleteModal={() => setShowDeleteModal(true)}
        isLoading={isLoading}
      />

      {/* 내 정보 수정 모달 */}
      {showProfileModal && (
        <ProfileModal
          onClose={() => setShowProfileModal(false)}
          setIsLoading={setIsLoading}
          isLoading={isLoading}
          setStatusMessage={setStatusMessage}
        />
      )}

      {/* 로그아웃 확인 모달 */}
      {showLogoutModal && (
        <LogoutModal
          onClose={() => setShowLogoutModal(false)}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          setStatusMessage={setStatusMessage}
        />
      )}

      {/* 회원 탈퇴 확인 모달 */}
      {showDeleteModal && (
        <DeleteAccountModal
          onClose={() => setShowDeleteModal(false)}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          setStatusMessage={setStatusMessage}
        />
      )}
    </div>
  )
}

export default Settings
