import React from 'react'
import { Link } from 'react-router-dom'
import { ROUTES } from '@/routes/routes'
import WizBeeLogo from '@/assets/logos/WizBee.svg?react'

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 py-12">
      <div className="max-w-md w-full text-center">
        {/* Error Status */}
        <h1 className="text-blue-500 text-9xl font-extrabold mb-4 animate-pulse">404</h1>

        {/* Error Message */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">페이지를 찾을 수 없습니다</h2>
          <p className="text-gray-600 text-lg">요청하신 페이지가 존재하지 않거나 이동되었습니다.</p>
        </div>

        {/* WizBee Logo */}
        <div className="w-48 h-48 mx-auto mb-8 fill-blue-500">
          <WizBeeLogo className="w-full h-full" />
        </div>

        {/* Action Button */}
        <Link
          to={ROUTES.WELCOME}
          className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-md"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7m-7-7v14"></path>
          </svg>
          홈으로 돌아가기
        </Link>
      </div>

      {/* Additional element for visual appeal */}
      <div className="mt-12 text-center">
        <p className="text-gray-500 text-sm">문제가 지속되면 관리자에게 문의하세요</p>
      </div>
    </div>
  )
}

export default NotFound