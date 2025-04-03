import React from "react";

const BarGraph: React.FC = () => {
  const categories = ["거북목", "어깨 불균형", "앞드림"];
  const values = [85, 45, 70]; // 백분율 값
  
  return (
    <div className="flex flex-col items-center my-6 px-4">
      <h2 className="text-2xl text-blue-400 mb-4">오늘의 자세</h2>
      
      <div className="w-full max-w-md">
        <div className="mb-2 flex justify-end">
          <button className="bg-blue-400 text-white px-4 py-1 rounded-full text-sm">
            자세 보러가기
          </button>
        </div>
        
        {categories.map((category, index) => (
          <div key={index} className="mb-4">
            <div className="flex justify-between mb-1">
              <span className="text-lg text-blue-400">{category}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
              <div
                className="bg-red-300 h-4 rounded-full"
                style={{ width: `${values[index]}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BarGraph;