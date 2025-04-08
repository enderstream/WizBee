import type React from "react"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
  useUserStore,
  selectName,
  // selectProfileImageUrl,
  // selectUserId,
  selectMachineId,
} from "@/store/userStore"
import { useMachineRegister } from "@/hooks/useMachineRegister"
import { ROUTES } from "@/routes/routes"
import MachineRegisterModal from "@/pages/Home/components/MachineRegisterModal"
import StartRecord from "@/pages/Home/components/StartRecord"
import AverageStudyTime from "@/pages/Home/components/AverageStudyTime"
import TodayConcentration from "@/pages/Home/components/TodayConcentration"
import PosePoint from "@/pages/Home/components/PosePoint"
// import { statisticAPI } from '@/api/statisticAPI'
// import { timeLapseAPI } from '@/api/timeLapseAPI'
import { userAPI } from "@/api/userAPI"
import { machineAPI } from "@/api/machineAPI"
import { initializeUserInfo } from "@/types/User"
import WizBeeLogo from "@/assets/logos/WizBee.svg?react"
import RegisterIcon from "@/assets/icons/Register.svg?react"

const Home: React.FC = () => {
  const navigate = useNavigate()
  const name = useUserStore(selectName)
  // const profileImageUrl = useUserStore(selectProfileImageUrl)
  const { openModal } = useMachineRegister()
  const setUser = useUserStore((state) => state.setUser)
  const machineId = useUserStore(selectMachineId)
  // const userId = useUserStore(selectUserId)

  // 컴포넌트 마운트 시 사용자 정보 가져오기
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await userAPI.userInfo()
        if (response.status === 200) {
          // 백엔드에서 받아온 유저 정보를 스토어에 저장
          const userInfo = initializeUserInfo(response.data)
          setUser(userInfo)
          console.log("유저 정보 로드 완료:", userInfo)
        }
      } catch (error) {
        console.error("유저 정보 로드 실패:", error)
      }
    }

    fetchUserInfo()
  }, [setUser])

  // 촬영 페이지로 이동
  const handleStartTimeLapse = async () => {
    console.log("타임랩스 세션 시작")
    navigate(ROUTES.RECORD)
    const response = await machineAPI.requestStream(machineId)
    console.log(response.status)
    console.log(response.data)
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
      <AverageStudyTime averageTime="5시간 32분" progressPercentage={70} />

      {/* 공부 지표 */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <TodayConcentration concentrationPercentage={85} />
        <PosePoint poseScore={92} starRating={4.5} />
      </div>

      {/* 기기 등록 모달 */}
      <MachineRegisterModal />
    </div>
  )
}

export default Home