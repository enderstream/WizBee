import { useState, useEffect } from 'react'
import { statisticAPI } from '@/api/statisticAPI'
import { useQuery } from '@tanstack/react-query'
import { selectUserId, useUserStore } from '@/store/userStore'

const BarGraph = () => {
  const categories = ['거북목', '어깨 불균형', '엎드림']
  const values = [85, 45, 70] // 백분율 값
  const [animatedValues, setAnimatedValues] = useState([0, 0, 0])

  const userId = useUserStore(selectUserId)
  const [date, setDate] = useState('현재날짜 또는 기본값')


  
  // const {
  //   data: wrongPoseImages,
  //   isLoading,
  //   error,
  // } = useQuery({
  //   queryKey: ['wrongPoseImages', date, userId],
  //   queryFn: () => statisticAPI.wrongPoseImages(date, userId),
  //   staleTime: 30*60*1000,
  //   enabled: !!userId,
  // })

  // Animation effect with faster speed
  useEffect(() => {
    const animationDuration = 400 // ms - much faster now
    const steps = 10 // fewer steps for quicker animation
    const stepDuration = animationDuration / steps
    let currentStep = 0

    const timer = setInterval(() => {
      currentStep++
      const progress = currentStep / steps

      setAnimatedValues(
        values.map((value) => Math.min(Math.ceil(value * progress), value)),
      )

      if (currentStep >= steps) {
        clearInterval(timer)
      }
    }, stepDuration)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="flex flex-col px-4 pb-4">
      {/* 스타일링된 헤더 */}
      <header className="pt-2 pb-3 mb-2 border-b border-blue-200">
        <div className="flex items-center">
          <div className="w-1 h-6 bg-blue-500 rounded-full mr-3"></div>
          <h1 className="text-xl font-bold text-gray-800">오늘의 자세</h1>
          <div className="ml-auto">
            <button className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm">
              자세 보러가기
            </button>
          </div>
        </div>
      </header>

      <div className="w-full">
        {categories.map((category, index) => (
          <div key={index} className="mb-1">
            <div className="flex items-center">
              {/* Label at the start of the bar */}
              <span className=" font-medium w-24">{category}</span>

              {/* Bar container */}
              <div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-blue-500 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${animatedValues[index]}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default BarGraph
