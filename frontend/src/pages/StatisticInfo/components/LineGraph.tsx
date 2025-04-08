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
  TooltipItem,
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

const LineGraph: React.FC = () => {
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
  const values = [5.5, 7.2, 4.8, 8.1, 3.5, 6.2, 2.4]
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
        pointHitRadius: 10,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        displayColors: false,
        callbacks: {
          title: function () {
            return ''
          },
          label: function (context: TooltipItem<'line'>) {
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
          <Line data={data} options={options} />
        </div>
      </div>
    </div>
  )
}

export default LineGraph
