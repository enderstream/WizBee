import React, { useState, useMemo } from 'react'
import DoughnutChart from '@/pages/StatisticInfo/components/DoughnutChart'
import LineGraph from '@/pages/StatisticInfo/components/LineGraph'
import PoseCount from '@/pages/StatisticInfo/components/PoseCount'
import DatePickerComponent from '@/pages/StatisticInfo/components/DatePickerComponent'
import { statisticAPI } from '@/api/statisticAPI'
import { useQuery } from '@tanstack/react-query'
import { selectUserId, useUserStore } from '@/stores/userStore'

const StatisticInfo: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const userId = useUserStore(selectUserId)

  // 날짜를 yyyy-mm-dd 형식의 문자열로 변환
  const formattedDate = useMemo(() => {
    const year = selectedDate.getFullYear()
    const month = String(selectedDate.getMonth() + 1).padStart(2, '0')
    const day = String(selectedDate.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }, [selectedDate])

  // 오늘의 딴짓 통계 정보 조회
  const { data: todayDistraction } = useQuery({
    queryKey: ['todayDistractionData', formattedDate, userId],
    queryFn: () => statisticAPI.todayDistractionData(formattedDate, userId),
    staleTime: 30 * 60 * 1000,
    enabled: !!userId,
  })

  // 주간 순공시간 통계 정보 조회
  const { data: weeklyFocused } = useQuery({
    queryKey: ['weeklyFocusedData', formattedDate, userId],
    queryFn: () => statisticAPI.weeklyFocusedData(formattedDate, userId),
    staleTime: 30 * 60 * 1000,
    enabled: !!userId,
  })

  // 잘못된 자세 통계
  const { data: poseData } = useQuery({
    queryKey: ['poseData', formattedDate, userId],
    queryFn: () => statisticAPI.poseScore(formattedDate, userId),
    staleTime: 30 * 60 * 1000,
    enabled: !!userId,
  })

  // 잘못된 자세 이미지 모음
  const { data: wrongPoseImages } = useQuery({
    queryKey: ['wrongPoseImages', formattedDate, userId],
    queryFn: () => statisticAPI.wrongPoseImages(formattedDate, userId),
    staleTime: 30 * 60 * 1000,
    enabled: !!userId,
  })

  // 날짜 변경 핸들러
  const handleDateChange = (date: Date | null) => {
    if (date) {
      setSelectedDate(date)
    }
  }

  return (
    <div className="w-full max-w-xl mx-auto bg-white">
      <div className="flex flex-col">
        <DoughnutChart todayDistraction={todayDistraction} />
        <LineGraph
          weeklyFocused={weeklyFocused}
          formattedDate={formattedDate}
        />
        <PoseCount poseData={poseData} wrongPoseImages={wrongPoseImages} />
      </div>
      <DatePickerComponent onDateChange={handleDateChange} />
    </div>
  )
}

export default StatisticInfo
