import React from 'react'
import AppVersionIcon from '@/assets/icons/AppVersion.svg?react'

const AppVersion: React.FC = () => {
  return (
    <div className="flex items-center justify-between py-4 px-4 cursor-pointer hover:bg-gray-50">
      <div className="flex items-center">

        <AppVersionIcon width={24} height={24} className="mr-3" />
        <span>앱 정보</span>
      </div>
      <div className="text-gray-400 text-sm">버전 1.0.0</div>
    </div>
  )
}

export default AppVersion