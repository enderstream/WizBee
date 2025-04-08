import type React from "react"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
  useUserStore,
  selectName,
  selectUserId,
  selectMachineId,
} from "@/store/userStore"
import { useMachineRegister } from "@/hooks/useMachineRegister"
import { ROUTES } from "@/routes/routes"
import MachineRegisterModal from "@/pages/Home/components/MachineRegisterModal"
import StartRecord from "@/pages/Home/components/StartRecord"
import AverageStudyTime from "@/pages/Home/components/AverageStudyTime"
import Concentration from "./components/Concentration"
import { userAPI } from "@/api/userAPI"
import { machineAPI } from "@/api/machineAPI"
import { statisticAPI } from "@/api/statisticAPI"
import { initializeUserInfo } from "@/types/User"
import WizBeeLogo from "@/assets/logos/WizBee.svg?react"
import RegisterIcon from "@/assets/icons/Register.svg?react"
import { useQuery } from "@tanstack/react-query"
import PoseScore from "./components/PoseScore"

const Home: React.FC = () => {
  const navigate = useNavigate()
  const name = useUserStore(selectName)
  const userId = useUserStore(selectUserId)
  const machineId = useUserStore(selectMachineId)
  const setUser = useUserStore((state) => state.setUser)
  const { openModal } = useMachineRegister()

  // 날짜 포맷팅 유틸 함수
  const getFormattedDate = () => {
    const today = new Date()
    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, '0')
    const day = String(today.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  // 컴포넌트 마운트 시 사용자 정보 가져오기
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await userAPI.userInfo()
        if (response.status === 200) {
          const userInfo = initializeUserInfo(response.data)
          setUser(userInfo)
        }
      } catch (error) {
        console.error("유저 정보 로드 실패:", error)
      }
    }

    fetchUserInfo()
  }, [setUser])

  // 평균 순공 시간
  const { data: averageStudyTimeData } = useQuery({
    queryKey: ['averageStudyTimeData', userId],
    queryFn: () => statisticAPI.averageStudyTime(userId),
    staleTime: 30 * 60 * 1000,
    enabled: !!userId,
  })

  console.log(averageStudyTimeData)

  // 오늘의 집중 점수
  const { data: concentrationData } = useQuery({
    queryKey: ['concentrationData', userId, getFormattedDate()],
    // queryFn: () => statisticAPI.concentration(getFormattedDate(), userId),
    queryFn: () => statisticAPI.concentration("2025-03-31", userId),
    staleTime: 30 * 60 * 1000,
    enabled: !!userId,
  })

  console.log(concentrationData)

  // 오늘의 자세 점수
  const { data: poseScoreData } = useQuery({
    queryKey: ['poseScoreData', userId, getFormattedDate()],
    // queryFn: () => statisticAPI.poseScore(getFormattedDate(), userId),
    queryFn: () => statisticAPI.poseScore("2025-03-31", userId),
    staleTime: 30 * 60 * 1000,
    enabled: !!userId,
  })

  console.log(poseScoreData)

  // 촬영 페이지로 이동
  const handleStartTimeLapse = async () => {
    try {
      console.log("타임랩스 세션 시작")
      navigate(ROUTES.RECORD)
      const response = await machineAPI.requestStream(machineId)
      console.log(`Stream 요청 성공: ${response.status}`, response.data)
    } catch (error) {
      console.error("Stream 요청 실패:", error)
    }
  }


  return (
    <div className="max-w-lg mx-auto px-5 py-6">
      {/* 프로필 섹션 */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden mr-3 flex-shrink-0">
            <WizBeeLogo className="w-full h-full object-cover" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">{name || "사용자"}님!</h2>
            <p className="text-gray-500">오늘도 열공해봐요</p>
          </div>
        </div>

        <button
          onClick={openModal}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-500 active:bg-blue-700 text-white rounded-xl transition-colors touch-manipulation"
        >
          <RegisterIcon width={24} height={24} />
          <span className="text-sm">기기 등록</span>
        </button>
      </div>

      {/* 타임랩스 시작 컴포넌트 */}
      <StartRecord onStartClick={handleStartTimeLapse} />

      {/* 평균 순공시간 */}
      <AverageStudyTime averageStudyTimeData={averageStudyTimeData} />

      {/* 공부 집중도 */}
      <Concentration concentrationData={concentrationData} />

      {/* 오늘의 자세 점수 */}
      <PoseScore poseScoreData={poseScoreData} />


      {/* 기기 등록 모달 */}
      <MachineRegisterModal />
    </div>
  )
}

export default Home