import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useUserStore, selectName, selectProfileImageUrl } from '@/store/userStore'
import { useMachineRegister } from '@/hooks/useMachineRegister'
import { ROUTES } from '@/routes/routes'
import MachineRegisterModal from '@/components/MachineRegisterModal'
import '@/styles/Home.css'
import 

const Home: React.FC = () => {
  const navigate = useNavigate()
  const name = useUserStore(selectName)
  const profileImageUrl = useUserStore(selectProfileImageUrl)
  const { openModal } = useMachineRegister()

  // 촬영 페이지로 이동
  const handleStartTimeLapse = () => {
    console.log('타임랩스 세션 시작')
    // navigate(ROUTES.RECORD)

  }

  return (
    <div className="home-page">
      <div className="home-header">
        <div className="home-avatar">
          {profileImageUrl ? (
            <img 
              // src={profileImageUrl}
              alt="프로필 이미지"
              className="profileImage"
              onError={(e) => {
                // 이미지 로드 실패 시 기본 이미지로 대체
                e.currentTarget.src = '@/assets/react.svg';
                console.log('프로필 이미지 로드 실패, 기본 이미지로 대체');
              }}
            />
          ) : (
            <img 
              src="@/assets/react.svg"
              alt="기본 프로필"
              className="profileImage"
            />
          )}
        </div>
        <div className="home-greeting">
          <h2>{name || '사용자'}님!</h2>
          <p>오늘도 열공해봐요</p>
        </div>
        <div className="machine-registration">
          <button onClick={openModal}>
            기기등록
          </button>
        </div>
      </div>

      <div className="timelapse-container">
        <h3>타임랩스</h3>
        <button className="start-button" onClick={handleStartTimeLapse}>
          start
        </button>
      </div>

      {/* 기기 등록 모달 */}
      <MachineRegisterModal />
    </div>
  )
}

export default Home