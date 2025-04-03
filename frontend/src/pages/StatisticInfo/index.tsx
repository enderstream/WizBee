import React from 'react';
import BarGraph from './components/BarGraph';
import DoughnutChart from './components/DoughnutChart';
import LineGraph from './components/LineGraph';

const StatisticInfo: React.FC = () => {
  return (
    <div className="w-full max-w-xl mx-auto pb-16 bg-white min-h-screen">
      <div className="pb-4 bg-white">
        {/* <img 
          src="/assets/images/wizbee-logo.png" 
          alt="WizBee" 
          className="w-32 mx-auto"
        /> */}
      </div>
      
      <div className="flex flex-col">
        <DoughnutChart />
        <LineGraph />
        <BarGraph />
      </div>
    </div>
  );
};

export default StatisticInfo;