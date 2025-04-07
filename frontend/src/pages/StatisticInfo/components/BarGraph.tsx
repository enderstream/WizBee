import React from "react"

const BarGraph: React.FC = () => {
  const categories = ["거북목", "어깨 불균형", "앞드림"]
  const values = [85, 45, 70] // 백분율 값

  return (
    <div className="flex flex-col px-4 pb-4">
      {/* 스타일링된 헤더 */}
      <header className="pt-2 pb-3 mb-2 border-b border-blue-200">
        <div className="flex items-center">
          <div className="w-1 h-6 bg-blue-500 rounded-full mr-3"></div>
          <h1 className="text-xl font-bold text-gray-800">
            오늘의 자세
          </h1>
          <div className="ml-auto">
            <button className="bg-blue-400 text-white px-4 py-1 rounded-full text-sm">
              자세 보러가기
            </button>
          </div>
        </div>
      </header>

      <div className="w-full">
        {categories.map((category, index) => (
          <div key={index} className="mb-3">
            <div className="flex justify-between mb-1">
              <span className="text-md text-blue-400">{category}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className="bg-red-300 h-3 rounded-full"
                style={{ width: `${values[index]}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default BarGraph