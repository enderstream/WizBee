import React from 'react'
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
} from 'chart.js'

// ChartJS 컴포넌트 등록
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
)

const LineGraph: React.FC = () => {
  // 오늘부터 지난 7일간의 날짜 생성
  const getLast7Days = () => {
    const dates = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const formattedDate = `${date.getMonth() + 1}/${date.getDate()}`
      dates.push(formattedDate)
    }
    return dates
  }

  const dates = getLast7Days()
  const values = [5.5, 7.2, 4.8, 8.1, 3.5, 6.2, 2.4] // 순공 시간 (시간 단위)

  const data = {
    labels: dates,
    datasets: [
      {
        data: values,
        borderColor: '#3B82F6',
        backgroundColor: 'white',
        pointBorderColor: '#3B82F6',
        pointBackgroundColor: 'white',
        pointBorderWidth: 2,
        pointRadius: 4,
        tension: 0.3,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { callbacks: { label: function (context: any) { return `${context.raw} 시간` } } },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          color: '#3B82F6',
          font: { size: 10 }
        },
      },
      y: {
        display: false,
        grid: { color: '#f0f0f0' },
        min: 0,
      },
    },
    annotation: {
      annotations: {
        line1: {
          type: 'line',
          yMin: 5,
          yMax: 5,
          borderColor: '#FFCCCB',
          borderWidth: 1.5,
        },
      },
    },
  }

  return (
    <div className="flex flex-col px-4 pt-2">
      {/* 스타일링된 헤더 */}
      <header className="pt-4 pb-3 mb-2 border-b border-blue-200">
        <div className="flex items-center">
          <div className="w-1 h-6 bg-blue-500 rounded-full mr-3"></div>
          <h1 className="text-xl font-bold text-gray-800">
            주간 순공시간 변화량
          </h1>
        </div>
      </header>

      {/* 그래프 높이 줄임 (h-36 -> h-24) */}
      <div className="w-full h-24 mb-5">
        <Line data={data} options={options} />
      </div>
    </div>
  )
}

export default LineGraph