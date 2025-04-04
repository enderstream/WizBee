import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// ChartJS 컴포넌트 등록
ChartJS.register(ArcElement, Tooltip, Legend);

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
  };

  const options = {
    responsive: true,
    cutout: "70%",
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context:any) {
            const value = context.raw;
            return value >= 1 
              ? `${value} 시간` 
              : `${Math.round(value * 60)} 분`;
          }
        }
      }
    },
  };

  const totalHours = 9;

  return (
    <div className="flex flex-col items-center my-6 px-4">
      <h2 className="text-2xl text-blue-400 mb-4">오늘의 통계</h2>
      
      <div className="relative w-64 h-64">
        <Doughnut data={data} options={options} />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-4xl text-blue-400 font-medium">{totalHours}시간</span>
        </div>
      </div>
      
      <div className="w-full max-w-md grid grid-cols-2 gap-4 mt-4">
        <div className="flex items-center">
          <div className="w-4 h-4 rounded-full bg-blue-400 mr-2"></div>
          <span className="mr-2 text-blue-400">순공</span>
          <span className="ml-auto text-blue-400">7 시간</span>
        </div>
        
        <div className="flex items-center">
          <div className="w-4 h-4 rounded-full bg-green-400 mr-2"></div>
          <span className="mr-2 text-blue-400">폰</span>
          <span className="ml-auto text-blue-400">25 분</span>
        </div>
        
        <div className="flex items-center">
          <div className="w-4 h-4 rounded-full bg-purple-400 mr-2"></div>
          <span className="mr-2 text-blue-400">졸음</span>
          <span className="ml-auto text-blue-400">35 분</span>
        </div>
        
        <div className="flex items-center">
          <div className="w-4 h-4 rounded-full bg-red-400 mr-2"></div>
          <span className="mr-2 text-blue-400">자리 비움</span>
          <span className="ml-auto text-blue-400">1 시간</span>
        </div>
      </div>
    </div>
  );
};

export default DoughnutChart;