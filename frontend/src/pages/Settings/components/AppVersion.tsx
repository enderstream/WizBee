import React from 'react'

const AppVersion: React.FC = () => {
  return (
    <div className="flex items-center justify-between py-4 px-4 cursor-pointer hover:bg-gray-50">
      <div className="flex items-center">
        <svg className="w-5 h-5 text-gray-500 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>앱 정보</span>
      </div>
      <div className="text-gray-400 text-sm">버전 1.0.0</div>
    </div>
  )
}

export default AppVersion