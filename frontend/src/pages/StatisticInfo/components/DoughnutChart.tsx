import React from "react"
import { Doughnut } from "react-chartjs-2"
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js"

// ChartJS 컴포넌트 등록
ChartJS.register(ArcElement, Tooltip, Legend)

const DoughnutChart: React.FC = () => {
  const data = {
    labels: ["순공", "폰", "졸음", "자리 비움"],
    datasets: [
      {
        data: [7, 0.42, 0.58, 1], // 시간을 소수점으로 변환 (25분 = 0.42시간, 35분 = 0.58시간)
        backgroundColor: ["#80b1ff", "#7ED57E", "#B19CD9", "#F08080"],
        borderColor: ["#80b1ff", "#7ED57E", "#B19CD9", "#F08080"],
        borderWidth: 1,
      },
    ],
  }

  const options = {
    responsive: true,
    cutout: "70%",
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            const value = context.raw
            return value >= 1
              ? `${value} 시간`
              : `${Math.round(value * 60)} 분`
          }
        }
      }
    },
  }

  const totalHours = 9

  return (
    <div className="flex flex-col px-4 py-4">
      {/* 스타일링된 헤더 */}
      <header className="pt-2 pb-3 mb-3 border-b border-blue-200">
        <div className="flex items-center">
          <div className="w-1 h-6 bg-blue-500 rounded-full mr-3"></div>
          <h1 className="text-xl font-bold text-gray-800">
            오늘의 통계
          </h1>
        </div>
      </header>

      <div className="flex flex-row items-center">
        {/* 좌측 도넛 차트 */}
        <div className="relative w-40 h-40">
          <Doughnut data={data} options={options} />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl text-blue-400 font-medium">{totalHours}시간</span>
          </div>
        </div>
        
        {/* 우측 범례 */}
        <div className="flex-1 pl-4">
          <div className="grid grid-cols-1 gap-2">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-blue-400 mr-2"></div>
              <span className="mr-2 text-blue-400 text-sm">순공</span>
              <span className="ml-auto text-blue-400 text-sm">7 시간</span>
            </div>

            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-green-400 mr-2"></div>
              <span className="mr-2 text-blue-400 text-sm">폰</span>
              <span className="ml-auto text-blue-400 text-sm">25 분</span>
            </div>

            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-purple-400 mr-2"></div>
              <span className="mr-2 text-blue-400 text-sm">졸음</span>
              <span className="ml-auto text-blue-400 text-sm">35 분</span>
            </div>

            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-red-400 mr-2"></div>
              <span className="mr-2 text-blue-400 text-sm">자리 비움</span>
              <span className="ml-auto text-blue-400 text-sm">1 시간</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DoughnutChart