import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import DateSelector from '../components/DateSelector'
import '../styles/Settings.css'

const Settings: React.FC = () => {
  const { user } = useAuth()
  console.log(user)
  // 모달 상태 관리
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  // 개인정보 폼 상태
  const [nickname, setNickname] = useState('')
  const [birthYear, setBirthYear] = useState('')
  const [birthMonth, setBirthMonth] = useState('')
  const [birthDay, setBirthDay] = useState('')

  // 프로필 수정 모달 열기
  const handleOpenProfileModal = () => {
    // 기존 사용자 정보로 폼 초기화 (실제로는 user 객체에서 가져와야 함)
    // setNickname(user?.displayName || "")
    setShowProfileModal(true)
  }

  // 날짜 변경 핸들러
  const handleDateChange = (year: string, month: string, day: string) => {
    setBirthYear(year)
    setBirthMonth(month)
    setBirthDay(day)
  }

  // 로그아웃 처리
  const handleLogout = () => {
    // 로그아웃 로직 구현
    console.log('로그아웃 처리')
    setShowLogoutModal(false)
    // Auth 컨텍스트의 로그아웃 함수 호출 등의 추가 로직
  }

  // 회원 탈퇴 처리
  const handleDeleteAccount = () => {
    // 회원 탈퇴 로직 구현
    console.log('회원 탈퇴 처리')
    setShowDeleteModal(false)
    // Auth 컨텍스트의 회원 탈퇴 함수 호출 등의 추가 로직
  }

  // 프로필 정보 저장
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault()
    // 프로필 정보 저장 로직
    console.log('프로필 정보 저장:', {
      nickname,
      birthYear,
      birthMonth,
      birthDay,
    })
    setShowProfileModal(false)
    // Auth 컨텍스트의 프로필 업데이트 함수 호출 등의 추가 로직
  }

  return (
    <div className="settings-page">
      {/* 버튼 컨테이너 */}
      <div className="settings-buttons">
        <button className="settings-button" onClick={handleOpenProfileModal}>
          내 정보 수정
        </button>

        <button
          className="settings-button"
          onClick={() => setShowLogoutModal(true)}
        >
          로그아웃
        </button>

        <button
          className="settings-button delete-button"
          onClick={() => setShowDeleteModal(true)}
        >
          회원 탈퇴
        </button>
      </div>

      {/* 내 정보 수정 모달 */}
      {showProfileModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>내 정보 수정</h3>
            <form onSubmit={handleSaveProfile}>
              <div className="form-group">
                <label>닉네임</label>
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>생년월일</label>
                <DateSelector
                  initialYear={birthYear}
                  initialMonth={birthMonth}
                  initialDay={birthDay}
                  onDateChange={handleDateChange}
                />
              </div>

              <div className="modal-buttons">
                <button type="submit" className="save-button">
                  저장
                </button>
                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => setShowProfileModal(false)}
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
              <button className="confirm-button" onClick={handleLogout}>
                네
              </button>
              <button
                className="cancel-button"
                onClick={() => setShowLogoutModal(false)}
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
              >
                네
              </button>
              <button
                className="cancel-button"
                onClick={() => setShowDeleteModal(false)}
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
