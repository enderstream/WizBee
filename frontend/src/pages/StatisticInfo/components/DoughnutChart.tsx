import React, { useEffect, useState } from "react"
import { Doughnut } from "react-chartjs-2"
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js"

// ChartJS 컴포넌트 등록
ChartJS.register(ArcElement, Tooltip, Legend)

const DoughnutChart: React.FC = () => {
  // 애니메이션을 위한 상태 추가
  const [animatedWidths, setAnimatedWidths] = useState<{ [key: string]: number }>({});

  // 데이터 정의 - 키:값 형태로 재사용성 향상
  const activityData = {
    "순공": { value: 7, color: "#4F86F7", unit: "시간" },
    "폰": { value: 25, color: "#70D370", unit: "분" },
    "졸음": { value: 35, color: "#9B7ED9", unit: "분" },
    "자리 비움": { value: 1, color: "#FF7676", unit: "시간" }
  }

  // 총 시간 계산
  const totalHours = 9

  // 효율적인 시간(순공) 계산
  const effectiveHours = activityData["순공"].value
  const effectivePercentage = Math.round((effectiveHours / totalHours) * 100)

  // 차트 데이터 구성
  const chartData = {
    labels: Object.keys(activityData),
    datasets: [
      {
        data: Object.values(activityData).map(item => item.unit === "시간" ? item.value : item.value / 60),
        backgroundColor: Object.values(activityData).map(item => item.color),
        borderColor: ["#ffffff", "#ffffff", "#ffffff", "#ffffff"],
        borderWidth: 2,
        hoverOffset: 4,
      },
    ],
  }

  const options = {
    responsive: true,
    cutout: "70%",
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        titleColor: "#333",
        bodyColor: "#333",
        borderColor: "#eee",
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12,
        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
        callbacks: {
          label: function (context: any) {
            const value = context.raw
            const label = context.label || ""
            return `${label}: ${value >= 1 ? `${value} 시간` : `${Math.round(value * 60)} 분`}`
          }
        }
      }
    },
    animation: { animateRotate: true }
  }

  // 진행 바의 최대값 설정 (시간 단위로 통일)
  const totalTime = Object.values(activityData).reduce(
    (sum, item) => sum + (item.unit === "시간" ? item.value : item.value / 60),
    0
  )

  // 컴포넌트가 마운트될 때 애니메이션 시작
  useEffect(() => {
    // 초기 상태를 0으로 설정
    const initialWidths = Object.keys(activityData).reduce((acc, key) => {
      acc[key] = 0;
      return acc;
    }, {} as { [key: string]: number });

    setAnimatedWidths(initialWidths);

    // 약간의 지연 후 실제 너비로 애니메이션
    const timer = setTimeout(() => {
      const targetWidths = Object.entries(activityData).reduce((acc, [key, data]) => {
        acc[key] = (data.unit === "시간" ? data.value : data.value / 60) / totalTime * 100;
        return acc;
      }, {} as { [key: string]: number });

      setAnimatedWidths(targetWidths);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col px-4">
      <header className="pt-4 pb-3 mb-3 border-b border-blue-200">
        <div className="flex items-center">
          <div className="w-1 h-6 bg-blue-500 rounded-full mr-3"></div>
          <h1 className="text-xl font-bold text-gray-800">
            오늘의 통계
          </h1>
          <div className="ml-auto bg-blue-100 text-blue-600 text-xs font-medium rounded-full px-2 py-1">
            총 {totalHours}시간
          </div>
        </div>
      </header>

      <div className="flex flex-row items-center">
        <div className="relative w-30 h-30">
          <Doughnut data={chartData} options={options} />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xl text-blue-500 font-semibold">{effectiveHours}시간</span>
            <span className="text-xs text-gray-500">효율 {effectivePercentage}%</span>
          </div>
        </div>

        <div className="flex-1 pl-6">
          <div className="grid grid-cols-1 gap-2">
            {Object.entries(activityData).map(([name, data]) => (
              <div key={name} className="flex items-center">
                <div className="w-2.5 h-2.5 rounded-full mr-2" style={{ backgroundColor: data.color }}></div>
                <span className="text-sm font-medium text-gray-700">{name}</span>
                <div className="ml-auto flex items-center">
                  <span className="text-sm font-medium" style={{ color: data.color }}>
                    {data.value} {data.unit}
                  </span>
                  <div className="ml-2 w-10 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-1000 ease-out"
                      style={{
                        backgroundColor: data.color,
                        width: `${animatedWidths[name] || 0}%`
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