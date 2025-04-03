import React, { useEffect, useId } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUserStore, selectName, selectProfileImageUrl, selectUserId, selectMachineId } from '@/store/userStore'
import { useMachineRegister } from '@/hooks/useMachineRegister'
import { ROUTES } from '@/routes/routes'
import MachineRegisterModal from '@/components/MachineRegisterModal'
import '@/styles/Home.css'
import { statisticAPI } from '@/api/statisticAPI'
import { timeLapseAPI } from '@/api/timeLapseAPI'
import { userAPI } from '@/api/userAPI'
import { initializeUserInfo } from '@/types/User'
import reactLogo from '@/assets/react.svg'
import { stringify } from 'querystring'

const Home: React.FC = () => {
  const navigate = useNavigate()
  const name = useUserStore(selectName)
  const profileImageUrl = useUserStore(selectProfileImageUrl)
  const { openModal } = useMachineRegister()
  const setUser = useUserStore(state => state.setUser)
  const userId = useUserStore(selectUserId)
  const machineId = useUserStore(selectMachineId)

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
    // navigate(ROUTES.RECORD)

    // api 테스트 중

    // 오늘의 딴짓 통계 정보 조회 : CORS 에러
    // const response = await statisticAPI.todayDistractionData(userId)   
    // console.log(response.status)
    // console.log(response.data)

    // 주간 순공시간 통계 정보 조회 : CORS 에러
    // const response = await statisticAPI.weeklyFocusedData(userId)   
    // console.log(response.status)
    // console.log(response.data)

    // 로그인 한 유저의 지표화된 통계 정보 조회 : 통과
    // const response = await statisticAPI.userFormulatedData(userId)
    // console.log(response.status)
    // console.log(response.data)

    // 메인페이지 : 평균 공부 시간 정보 조회 : CORS 에러
    // const response = await statisticAPI.mainPageAvgStudy(userId)
    // console.log(response.status)
    // console.log(response.data)

    // 메인페이지: 집중력 통계정보 출력 : 통과
    // const response = await statisticAPI.mainPageContentration("2025-03-31", userId)
    // console.log(response.status)
    // console.log(response.data)

    // 타임랩스 페이지: 타임랩스 리스트 출력 : 통과
    // const response = await timeLapseAPI.timeLapseList(userId)
    // console.log(response.status)
    // console.log(response.data)


    // 999 : machineId, 1: userId, 명세서에는 machineId???
    // 그리고 명세서를 따라간 프론트는 axios에러
    // 혹시나 싶어서 userId로 해봤더니 프론트도 잘 됨???
    // 타임랩스 촬영 시작
    // console.log(machineId)
    // console.log(userId)
    // const response = await timeLapseAPI.startRecordingTimeLapse("1")
    // console.log(response.status)
    // console.log(response.data)

    // 타임랩스 촬영 종료 : 통과
    // const response = await timeLapseAPI.finishRecordingTimeLapse(16, "asdf")
    // console.log(response.status)
    // console.log(response.data)
    
    // 자세 통계 : 필드명 잘못 설정한듯???
    const response = await statisticAPI.poseData("2025-04-09", 2)
    console.log(response.status)
    console.log(response.data)
    
    // 잘못된 자세 이미지 모음 : 통과
    // const response = await statisticAPI.wrongPoseImages("2025-04-09", 2)
    // console.log(response.status)
    // console.log(response.data)
    

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