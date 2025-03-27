// src/pages/Settings.tsx
import React, { useState } from 'react'
import { userAPI } from '@/api/userAPI'
import {
  selectUserId,
  useUserStore,
  selectNickname,
  selectBirthday,
} from '@/store/userStore'
import ProfileForm from '@/components/ProfileForm'
import '@/styles/Settings.css'

const Settings: React.FC = () => {
  // Zustand 스토어에서 데이터 가져오기
  const userId = useUserStore(selectUserId)
  const storedNickname = useUserStore(selectNickname)
  const storedBirthday = useUserStore(selectBirthday)
  const updateUser = useUserStore((state) => state.updateUser)

  // 모달 상태 관리
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [statusMessage, setStatusMessage] = useState('')

  // 개인정보 폼 상태
  const [nickname, setNickname] = useState('')
  const [birthDate, setBirthDate] = useState<Date | null>(null)

  // 생년월일 문자열을 Date 객체로 변환
  const parseBirthdayToDate = (birthdayStr: string) => {
    if (!birthdayStr || birthdayStr.length < 10) return null
    return new Date(birthdayStr)
  }

  // Date 객체를 YYYY-MM-DD 형식으로 변환
  const formatDateToString = (date: Date | null) => {
    if (!date) return ''

    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')

    return `${year}-${month}-${day}`
  }

  // 프로필 수정 모달 열기
  const handleOpenProfileModal = () => {
    // 저장된 사용자 정보로 폼 초기화
    setNickname(storedNickname || '')
    setBirthDate(parseBirthdayToDate(storedBirthday))
    setShowProfileModal(true)
  }

  // 로그아웃 처리
  const handleLogout = async () => {
    setIsLoading(true)
    try {
      await userAPI.logout(userId)
      // 로그아웃 성공 후 스토어 초기화
      useUserStore.getState().resetUser()
      setShowLogoutModal(false)

      // 상태 메시지 표시
      setStatusMessage('로그아웃 되었습니다.')
      setTimeout(() => {
        setStatusMessage('')
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

  // 회원 탈퇴 처리
  const handleDeleteAccount = async () => {
    setIsLoading(true)
    try {
      await userAPI.deleteUser(userId)
      // 회원 탈퇴 성공 후 스토어 초기화
      useUserStore.getState().resetUser()
      setShowDeleteModal(false)

      // 상태 메시지 표시
      setStatusMessage('회원 탈퇴가 완료되었습니다.')
      setTimeout(() => {
        setStatusMessage('')
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

  // 프로필 정보 저장
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setStatusMessage('프로필 정보 업데이트 중...')

    try {
      const birthday = formatDateToString(birthDate)

      // API 호출로 서버에 업데이트
      await userAPI.updateUser(nickname, birthday, userId)

      // 성공 시 Zustand 스토어 업데이트
      updateUser({
        nickname,
        birthday,
      })

      setStatusMessage('프로필이 성공적으로 업데이트되었습니다.')
      setShowProfileModal(false)

      setTimeout(() => {
        setStatusMessage('')
      }, 2000)
    } catch (error) {
      console.error('프로필 업데이트 실패:', error)
      setStatusMessage('프로필 업데이트에 실패했습니다. 다시 시도해주세요.')

      setTimeout(() => {
        setStatusMessage('')
      }, 2000)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="settings-page">
      {/* 상태 메시지 */}
      {statusMessage && (
        <div className="status-message-container">
          <div className="status-message">
            <p>{statusMessage}</p>
            <button onClick={() => setStatusMessage('')}>확인</button>
          </div>
        </div>
      )}

      {/* 버튼 컨테이너 */}
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

      {/* 내 정보 수정 모달 - ProfileForm 컴포넌트 사용 */}
      {showProfileModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>내 정보 수정</h3>
            <form onSubmit={handleSaveProfile}>
              <ProfileForm
                nickname={nickname}
                birthDate={birthDate}
                setNickname={setNickname}
                setBirthDate={setBirthDate}
                isLoading={isLoading}
              />

              <div className="modal-buttons">
                <button
                  type="submit"
                  className="save-button"
                  disabled={isLoading}
                >
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
      )}

      {/* 로그아웃 확인 모달 */}
      {showLogoutModal && (
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
                onClick={() => setShowLogoutModal(false)}
                disabled={isLoading}
              >
                아니오
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 회원 탈퇴 확인 모달 */}
      {showDeleteModal && (
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
                onClick={() => setShowDeleteModal(false)}
                disabled={isLoading}
              >
                아니오
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Settings
