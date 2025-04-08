import React, { useState, useMemo, useEffect } from 'react'
import BarGraph from '@/pages/StatisticInfo/components/BarGraph'
import DoughnutChart from '@/pages/StatisticInfo/components/DoughnutChart'
import LineGraph from '@/pages/StatisticInfo/components/LineGraph'
import DatePickerComponent from '@/pages/StatisticInfo/components/DatePickerComponent'
import { statisticAPI } from '@/api/statisticAPI'
import { useQuery } from '@tanstack/react-query'
import { selectUserId, useUserStore } from '@/store/userStore'

const StatisticInfo: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const userId = useUserStore(selectUserId)
  
  // 날짜를 yyyy-mm-dd 형식의 문자열로 변환
  const formattedDate = useMemo(() => {
    const year = selectedDate.getFullYear()
    const month = String(selectedDate.getMonth() + 1).padStart(2, '0')
    const day = String(selectedDate.getDate()).padStart(2, '0')
    console.log(`${year}-${month}-${day}`)
    
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

  // 로그인 한 유저의 지표화된 통계 정보 조회
  const { data: userFormulated } = useQuery({
    queryKey: ['userFormulatedData', userId],
    queryFn: () => statisticAPI.userFormulatedData(userId),
    staleTime: 30 * 60 * 1000,
    enabled: !!userId,
  })

  // 자세 통계
  const { data: poseData } = useQuery({
    queryKey: ['poseData', formattedDate, userId],
    queryFn: () => statisticAPI.poseData(formattedDate, userId),
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

  // 모든 데이터가 로드되면 콘솔에 출력
  useEffect(() => {
    if (todayDistraction && weeklyFocused && userFormulated && poseData && wrongPoseImages) {
      console.log('날짜:', formattedDate)
      console.log('오늘의 딴짓 통계:', todayDistraction)
      console.log('주간 순공시간 통계:', weeklyFocused)
      console.log('유저 지표화 통계:', userFormulated)
      console.log('자세 통계:', poseData)
      console.log('잘못된 자세 이미지:', wrongPoseImages)
    }
  }, [todayDistraction, weeklyFocused, userFormulated, poseData, wrongPoseImages, formattedDate])

  // 날짜 변경 핸들러
  const handleDateChange = (date: Date | null) => {
    if (date) {
      setSelectedDate(date)
    }
  }
  
  return (
    <div className="w-full max-w-xl mx-auto bg-white">
      <div className="flex flex-col">
        <DoughnutChart />
        <LineGraph weeklyFocused={weeklyFocused} formattedDate={formattedDate} />
        <BarGraph />
      </div>
      <DatePickerComponent onDateChange={handleDateChange} />
    </div>
  )
}

export default StatisticInfo