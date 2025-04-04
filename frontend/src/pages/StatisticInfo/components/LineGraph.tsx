import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// ChartJS 컴포넌트 등록
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const LineGraph: React.FC = () => {
  const dates = ["3월 22일", "3월 23일", "3월 24일", "3월 25일", "3월 26일", "3월 27일", "3월 28일"];
  const values = [5.5, 7.2, 4.8, 8.1, 3.5, 6.2, 2.4]; // 순공 시간 (시간 단위)
  
  const data = {
    labels: dates,
    datasets: [
      {
        data: values,
        borderColor: "#80b1ff",
        backgroundColor: "white",
        pointBorderColor: "#80b1ff",
        pointBackgroundColor: "white",
        pointBorderWidth: 2,
        pointRadius: 4,
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context:any) {
            return `${context.raw} 시간`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#80b1ff",
          font: {
            size: 10,
          }
        }
      },
      y: {
        display: false,
        grid: {
          color: "#f0f0f0",
        },
        min: 0,
      },
    },
    annotation: {
      annotations: {
        line1: {
          type: "line",
          yMin: 5,
          yMax: 5,
          borderColor: "#FFCCCB",
          borderWidth: 1.5,
        },
      },
    },
  };

  return (
    <div className="flex flex-col items-center my-6 px-4">
      <h2 className="text-2xl text-blue-400 mb-4">일주일 순공시간 변화량</h2>
      
      <div className="w-full max-w-md h-48">
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default LineGraph;