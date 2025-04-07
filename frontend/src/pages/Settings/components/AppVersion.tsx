import React from 'react'
import AppVersionIcon from '@/assets/icons/AppVersion.svg?react'

const AppVersion: React.FC = () => {
  return (
    <div className="flex items-center justify-between py-4 px-4 cursor-pointer">
      <div className="flex items-center">

        <AppVersionIcon width={24} height={24} className="mr-3" />
        <span>버전 정보</span>
      </div>
      <div className="text-gray-400 text-sm"> 1.0.0</div>
    </div>
  )
}

export default AppVersion