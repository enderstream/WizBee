import React, { useMemo } from 'react'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TooltipItem,
  ChartData,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
)

interface WeeklyFocusedData {
  data: Array<{
    date: string
    studyTime: number
  }>
  status: number
}

interface LineGraphProps {
  weeklyFocused?: WeeklyFocusedData
  formattedDate: string
}

const LineGraph: React.FC<LineGraphProps> = ({
  weeklyFocused,
  formattedDate,
}) => {
  // 선택된 날짜를 기준으로 지난 7일 계산
  const getLast7Days = useMemo(() => {
    const dates = []
    // formattedDate를 Date 객체로 변환
    const selectedDate = new Date(formattedDate)

    for (let i = 6; i >= 0; i--) {
      const date = new Date(selectedDate)
      date.setDate(date.getDate() - i)
      const formattedDay = `${date.getMonth() + 1}/${date.getDate()}`
      dates.push(formattedDay)
    }
    return dates
  }, [formattedDate])

  const dates = getLast7Days

  // 타입 안전한 차트 데이터 생성
  const chartData: ChartData<'line'> = useMemo(() => {
    // 기본 데이터 구조 생성
    const baseData: ChartData<'line'> = {
      labels: dates,
      datasets: [
        {
          data: [] as (number | null)[], // 명시적으로 타입 정의
          borderColor: '#3B82F6',
          backgroundColor: 'white',
          pointBorderColor: '#3B82F6',
          pointBackgroundColor: 'white',
          pointBorderWidth: 2,
          pointRadius: 4,
          tension: 0.3,
          pointHitRadius: 10,
        },
      ],
    }

    // weeklyFocused가 없거나 상태가 204이면 빈 데이터 반환
    if (!weeklyFocused || weeklyFocused.status === 204) {
      return baseData
    }

    // 상태가 200이면 데이터 매핑
    if (weeklyFocused.status === 200) {
      const dataMap = new Map<string, number>()

      // weeklyFocused의 데이터를 날짜별로 맵에 저장
      weeklyFocused.data.forEach((item) => {
        const date = new Date(item.date)
        const formattedDate = `${date.getMonth() + 1}/${date.getDate()}`
        dataMap.set(formattedDate, item.studyTime / 60)
      })

      // 모든 날짜에 대해 데이터 추출 (없으면 null)
      const values = dates.map((date) => {
        return dataMap.has(date) ? dataMap.get(date) || null : null
      }) as (number | null)[]

      baseData.datasets[0].data = values
    }

    return baseData
  }, [weeklyFocused, dates])

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        displayColors: false,
        callbacks: {
          title: () => {
            return ''
          },
          label: (context: TooltipItem<'line'>) => {
            return `${context.label} : ${context.formattedValue} 시간`
          },
        },
        titleAlign: 'center' as const,
        bodyAlign: 'center' as const,
        padding: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
      },
    },
    scales: {
      x: {
        grid: {
          display: true,
          color: '#E5E5E5',
        },
        ticks: {
          color: '#666666',
          font: { size: 10 },
        },
        offset: false,
        border: { display: true },
      },
      y: {
        display: true,
        grid: {
          color: '#E5E5E5',
          display: true,
        },
        ticks: {
          color: '#666666',
          font: { size: 10 },
          stepSize: 2,
        },
        min: 0,
        max: 10,
        border: { display: true },
      },
    },
    layout: { padding: { bottom: 5 } },
  }

  // 빈 데이터 구조 (타입 명시적 정의)
  const emptyData: ChartData<'line'> = {
    labels: dates,
    datasets: [
      {
        data: [] as (number | null)[],
        borderColor: '#3B82F6',
        backgroundColor: 'white',
        pointBorderColor: '#3B82F6',
        pointBackgroundColor: 'white',
        pointBorderWidth: 2,
        pointRadius: 4,
        tension: 0.3,
        pointHitRadius: 10,
      },
    ],
  }

  return (
    <div className="flex flex-col px-4 pt-2">
      <header className="pt-3 pb-2 mb-1 border-b border-blue-200">
        <div className="flex items-center">
          <div className="w-1 h-6 bg-blue-500 rounded-full mr-3"></div>
          <h1 className="text-xl font-bold text-gray-800">
            주간 순공시간 변화량
          </h1>
        </div>
      </header>

      <div className="w-full max-w-[95%] mx-auto">
        <div className="h-[135px]">
          {/* weeklyFocused 존재 여부에 관계없이 항상 Line 컴포넌트 렌더링 */}
          <Line
            data={weeklyFocused ? chartData : emptyData}
            options={options}
          />
        </div>
      </div>
    </div>
  )
}

export default LineGraph
