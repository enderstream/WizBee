import React, { useEffect, useState, useMemo } from 'react'
import { Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

interface todayDistractionData {
  data: {
    fullTime: number
    outTime: number
    phoneTime: number
    sleepTime: number
    studyTime: number
  }
  status: number
}

interface DoughnutChartProps {
  todayDistraction?: todayDistractionData
}

const DoughnutChart: React.FC<DoughnutChartProps> = ({ todayDistraction }) => {
  // 애니메이션을 위한 상태 추가
  const [animatedWidths, setAnimatedWidths] = useState<{
    [key: string]: number
  }>({})

  // 시간 표시 포맷 함수: 1분 미만이면 초으로, 그 이상이면 분으로 표시
  const formatTime = (
    minutes: number | undefined,
  ): { value: number; unit: string } => {
    if (!minutes) return { value: 0, unit: '초' }

    if (minutes < 60) {
      return { value: minutes, unit: '초' }
    } else {
      return { value: minutes / 60, unit: '분' }
    }
  }

  // 데이터 정의 - 실제 데이터 사용
  const activityData = useMemo(() => {
    const data = todayDistraction?.data

    const studyTime = formatTime(data?.studyTime)
    const phoneTime = formatTime(data?.phoneTime)
    const sleepTime = formatTime(data?.sleepTime)
    const outTime = formatTime(data?.outTime)

    return {
      순공: {
        value: studyTime.value,
        color: '#3b82f6',
        unit: studyTime.unit,
        rawMinutes: data?.studyTime || 0,
      },
      폰: {
        value: phoneTime.value,
        color: '#50C878',
        unit: phoneTime.unit,
        rawMinutes: data?.phoneTime || 0,
      },
      졸음: {
        value: sleepTime.value,
        color: '#a855f7',
        unit: sleepTime.unit,
        rawMinutes: data?.sleepTime || 0,
      },
      '자리 비움': {
        value: outTime.value,
        color: '#ef4444',
        unit: outTime.unit,
        rawMinutes: data?.outTime || 0,
      },
    }
  }, [todayDistraction])

  // 총 시간 계산 (초 -> 분)
  const totalHours = useMemo(() => {
    return todayDistraction?.data?.fullTime
      ? todayDistraction.data.fullTime / 60
      : 0
  }, [todayDistraction])

  // 효율적인 시간(순공) 계산
  const effectiveMinutes = todayDistraction?.data?.studyTime || 0
  const effectiveHours = effectiveMinutes / 60
  const effectivePercentage = todayDistraction?.data?.fullTime
    ? Math.round((effectiveMinutes / todayDistraction.data.fullTime) * 100)
    : 0

  // 차트 데이터 구성 - 모든 데이터는 분 단위로 통일
  const chartData = {
    labels: Object.keys(activityData),
    datasets: [
      {
        data: Object.values(activityData).map((item) => item.rawMinutes / 60), // 초 -> 분으로 통일
        backgroundColor: Object.values(activityData).map((item) => item.color),
        borderColor: ['#ffffff', '#ffffff', '#ffffff', '#ffffff'],
        borderWidth: 2,
        hoverOffset: 4,
      },
    ],
  }

  const options = {
    responsive: true,
    cutout: '70%',
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#333',
        bodyColor: '#333',
        borderColor: '#eee',
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12,
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
        callbacks: {
          label: function (context: any) {
            const hourValue = context.raw // 분 단위
            const label = context.label || ''
            const minutes = Math.round(hourValue * 60)

            if (minutes < 60) {
              return `${label}: ${minutes} 초`
            } else {
              return `${label}: ${hourValue.toFixed(1)} 분`
            }
          },
        },
      },
    },
    animation: { animateRotate: true },
  }

  // 진행 바의 최대값 설정 (분 단위로 통일)
  const totalTime = Object.values(activityData).reduce(
    (sum, item) => sum + item.rawMinutes / 60, // 초 -> 분으로 통일
    0,
  )

  // 컴포넌트가 마운트될 때 애니메이션 시작
  useEffect(() => {
    // 초기 상태를 0으로 설정
    const initialWidths = Object.keys(activityData).reduce(
      (acc, key) => {
        acc[key] = 0
        return acc
      },
      {} as { [key: string]: number },
    )

    setAnimatedWidths(initialWidths)

    // 약간의 지연 후 실제 너비로 애니메이션
    const timer = setTimeout(() => {
      const targetWidths = Object.entries(activityData).reduce(
        (acc, [key, data]) => {
          // 전체 시간이 0인 경우 막대 너비도 0으로 설정
          acc[key] =
            totalTime > 0 ? (data.rawMinutes / 60 / totalTime) * 100 : 0
          return acc
        },
        {} as { [key: string]: number },
      )

      setAnimatedWidths(targetWidths)
    }, 300)

    return () => clearTimeout(timer)
  }, [activityData, totalTime])

  // 시간 형식 포맷팅 (소수점 설정)
  const formatDisplayValue = (value: number, unit: string): string => {
    if (unit === '분') {
      return value.toFixed(1)
    } else {
      return Math.round(value).toString()
    }
  }

  return (
    <div className="flex flex-col px-4">
      <header className="pt-4 pb-3 mb-3 border-b border-blue-200">
        <div className="flex items-center">
          <div className="w-1 h-6 bg-blue-500 rounded-full mr-3"></div>
          <h1 className="text-xl font-bold text-gray-800">오늘의 통계</h1>
          <div className="ml-auto bg-blue-100 text-blue-600 text-xs font-medium rounded-full px-2 py-1">
            총{' '}
            {totalHours < 1
              ? `${Math.round(totalHours * 60)} 초`
              : `${totalHours.toFixed(1)} 분`}
          </div>
        </div>
      </header>

      <div className="flex flex-row items-center">
        <div className="relative w-30 h-30">
          <Doughnut data={chartData} options={options} />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xl text-blue-500 font-semibold">
              {effectiveHours < 1
                ? `${Math.round(effectiveMinutes)} 초`
                : `${effectiveHours.toFixed(1)} 분`}
            </span>
            <span className="text-xs text-gray-500">
              효율 {effectivePercentage}%
            </span>
          </div>
        </div>

        <div className="flex-1 pl-6">
          <div className="grid grid-cols-1 gap-2">
            {Object.entries(activityData).map(([name, data]) => (
              <div key={name} className="flex items-center">
                <div
                  className="w-2.5 h-2.5 rounded-full mr-2"
                  style={{ backgroundColor: data.color }}
                ></div>
                <span className="text-sm font-medium text-gray-700">
                  {name}
                </span>
                <div className="ml-auto flex items-center">
                  <span
                    className="text-sm font-medium"
                    style={{ color: data.color }}
                  >
                    {formatDisplayValue(data.value, data.unit)} {data.unit}
                  </span>
                  <div className="ml-2 w-10 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-1000 ease-out"
                      style={{
                        backgroundColor: data.color,
                        width: `${animatedWidths[name] || 0}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DoughnutChart
