import React from 'react'
import PrivacyPolicyIcon from '@/assets/icons/PrivacyPolicy.svg?react'
import ArrowRightIcon from '@/assets/icons/ArrowRight.svg?react'

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="flex items-center justify-between py-4 px-4 cursor-pointer active:bg-gray-50">
      <div className="flex items-center">
        <PrivacyPolicyIcon width={24} height={24} className="mr-3" /> 
        <span>개인정보 처리방침</span>
      </div>
      <ArrowRightIcon width={24} height={24} />
    </div>
  )
}

export default PrivacyPolicy