import React from 'react'
import HelpIcon from '@/assets/icons/Help.svg?react'
import ArrowRightIcon from '@/assets/icons/ArrowRight.svg?react'

const Help: React.FC = () => {
  return (
    <div className="flex items-center justify-between py-4 px-4 cursor-pointer hover:bg-gray-50">
      <div className="flex items-center">
        <HelpIcon width={24} height={24} className="mr-3" />
        <span>도움말</span>
      </div>
      <ArrowRightIcon width={24} height={24} />
    </div>
  )
}

export default Help