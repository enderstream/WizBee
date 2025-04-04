import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  useUserStore,
  selectName,
  selectProfileImageUrl,
  // selectUserId,
  // selectMachineId,
} from '@/store/userStore'
import { useMachineRegister } from '@/hooks/useMachineRegister'
import { ROUTES } from '@/routes/routes'
import MachineRegisterModal from '@/pages/Home/components/MachineRegisterModal'
import '@/styles/Home.css'
// import { statisticAPI } from '@/api/statisticAPI'
// import { timeLapseAPI } from '@/api/timeLapseAPI'
import { userAPI } from '@/api/userAPI'
import { initializeUserInfo } from '@/types/User'
import reactLogo from '@/assets/react.svg'
// import { stringify } from 'querystring'

const Home: React.FC = () => {
  const navigate = useNavigate()
  const name = useUserStore(selectName)
  const profileImageUrl = useUserStore(selectProfileImageUrl)
  const { openModal } = useMachineRegister()
  const setUser = useUserStore((state) => state.setUser)
  // const userId = useUserStore(selectUserId)
  // const machineId = useUserStore(selectMachineId)

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
  const handleStartTimeLapse = async () => {
    console.log('타임랩스 세션 시작')

    navigate(ROUTES.RECORD)

    // 오늘 불러오기
    // const today = new Date()
    // const formattedDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  }

  return (
    <div className="home-page">


  <div className="text-red-500">
    이 텍스트는 빨간색이어야 합니다.
  </div>


      <div className="home-header">
        <div className="home-avatar">
          {profileImageUrl ? (
            <img
              src={reactLogo} // 이자리 우리 로고로 하자 그냥;;
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
          <button onClick={openModal}>기기등록</button>
        </div>
      </div>

      <div className="timelapse-container">
        <h3>타임랩스</h3>
        <button className="start-button" onClick={handleStartTimeLapse}>
          start
        </button>
      </div>

      <div className="timelapse-container">
        <h3>평균 순공시간 </h3>
        <br />
        <h3>5시간 32분</h3>
      </div>

      <div className="timelapse-container indicator-container">
        <div className="timelapse-container">
          <h3>오늘의 공부 집중도</h3>
        </div>
        <div className="timelapse-container">
          <h3>오늘의 자세 점수</h3>
        </div>
      </div>

      {/* 기기 등록 모달 */}
      <MachineRegisterModal />
    </div>
  )
}

export default Home
