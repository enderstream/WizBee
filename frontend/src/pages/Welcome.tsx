import React, { useState } from 'react'
import { userAPI } from '@/api/userAPI'
import Carousel from '@/components/Carousel'
import '@/styles/Welcome.css'

const Welcome: React.FC = () => {
  const [isLoading] = useState<boolean>(false)
  // 구글 로그인 리다이렉트
  const handleGoogleLogin = (): void => {
    userAPI.login()
  }
  
  return (
    <div className="welcome-page">
      <h1>공부 통계를 확인해보세요!</h1>
      <Carousel />
      <button
        className="google-login-btn"
        onClick={handleGoogleLogin}
        disabled={isLoading}
      >
        <img
          src="https://developers.google.com/identity/images/g-logo.png"
          alt="Google logo"
          className="google-icon"
        />
        {isLoading ? '로그인 중...' : 'Google로 시작하기'}
      </button>
    </div>
  )
}

export default Welcome
