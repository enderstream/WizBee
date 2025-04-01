import React from 'react'
import ProfileForm from '@/components/ProfileForm'
import { useSettingsState } from '@/hooks/useSettingsState'
import { useProfileUpdate } from '@/hooks/useProfileUpdate'

const ProfileModal: React.FC = () => {
  const { isLoading, setShowProfileModal } = useSettingsState()
  const { name, birthDate, setName, setBirthDate, handleSaveProfile } =
    useProfileUpdate()

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>내 정보 수정</h3>
        <form onSubmit={handleSaveProfile}>
          <ProfileForm
            name={name}
            birthDate={birthDate}
            setName={setName}
            setBirthDate={setBirthDate}
            isLoading={isLoading}
          />

          <div className="modal-buttons">
            <button type="submit" className="save-button" disabled={isLoading}>
              {isLoading ? '저장 중...' : '저장'}
            </button>
            <button
              type="button"
              className="cancel-button"
              onClick={() => setShowProfileModal(false)}
              disabled={isLoading}
            >
              취소
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ProfileModal
