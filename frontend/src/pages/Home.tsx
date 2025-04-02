import React, { useEffect, useId } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUserStore, selectName, selectProfileImageUrl, selectUserId } from '@/store/userStore'
import { useMachineRegister } from '@/hooks/useMachineRegister'
import { ROUTES } from '@/routes/routes'
import MachineRegisterModal from '@/components/MachineRegisterModal'
import '@/styles/Home.css'
import { statisticAPI } from '@/api/statisticAPI'
import { timeLapseAPI } from '@/api/timeLapseAPI'
import { userAPI } from '@/api/userAPI'
import { initializeUserInfo } from '@/types/User'
import reactLogo from '@/assets/react.svg'

const Home: React.FC = () => {
  const navigate = useNavigate()
  const name = useUserStore(selectName)
  const profileImageUrl = useUserStore(selectProfileImageUrl)
  const { openModal } = useMachineRegister()
  const setUser = useUserStore(state => state.setUser)
  const userId = useUserStore(selectUserId)

  // 컴포넌트 마운트 시 사용자 정보 가져오기
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await userAPI.userInfo()
        if (response.status === 200) {
          // 백엔드에서 받아온 유저 정보를 스토어에 저장
          const userInfo = initializeUserInfo(response.data)
          setUser(userInfo)
          console.log('유저 정보 로드 완료:', userInfo)
        }
      } catch (error) {
        console.error('유저 정보 로드 실패:', error)
      }
    }

    fetchUserInfo()
  }, [setUser])

  // 촬영 페이지로 이동
  const handleStartTimeLapse = () => {
    console.log('타임랩스 세션 시작')
    // navigate(ROUTES.RECORD)
    const response = statisticAPI.weeklyFocusedData(userId)
    console.log(response)
  }

  return (
    <div className="home-page">
      <div className="home-header">
        <div className="home-avatar">
          {profileImageUrl ? (
            <img
              src={reactLogo}
              alt="프로필 이미지"
              className="profileImage"
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