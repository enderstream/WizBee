import React, { useState } from 'react'
import { userAPI } from '@/api/userAPI'

const GoogleLoginButton: React.FC = () => {
  const [isLoading] = useState<boolean>(false)

  // 구글 로그인 리다이렉트
  const handleGoogleLogin = (): void => {
    userAPI.login()
  }

  return (
    <button
      className="flex items-center justify-center mt-8 px-5 py-2.5 bg-white text-gray-600 font-bold border border-gray-200 rounded-full shadow-sm hover:bg-gray-50 hover:shadow-md transition-all duration-300"
      onClick={handleGoogleLogin}
      disabled={isLoading}
    >
      <img
        src="https://developers.google.com/identity/images/g-logo.png"
        alt="Google logo"
        className="w-5 h-5 mr-2.5"
      />
      {isLoading ? '로그인 중...' : 'Google로 시작하기'}
    </button>
  )
}

export default GoogleLoginButton