import React from 'react'
import BarGraph from '@/pages/StatisticInfo/components/BarGraph'
import DoughnutChart from '@/pages/StatisticInfo/components/DoughnutChart'
import LineGraph from '@/pages/StatisticInfo/components/LineGraph'

const StatisticInfo: React.FC = () => {
  return (
    <div className="w-full max-w-xl mx-auto pb-16 bg-white min-h-screen">
      <div className="flex flex-col">
        <DoughnutChart />
        <LineGraph />
        <BarGraph />
      </div>
    </div>
  )
}

export default StatisticInfo