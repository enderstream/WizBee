import React, { useState } from 'react'
import { userAPI } from '@/api/userAPI'
import '@/styles/Welcome.css'

const GoogleLoginButton: React.FC = () => {
  const [isLoading] = useState<boolean>(false)

  // 구글 로그인 리다이렉트
  const handleGoogleLogin = (): void => {
    userAPI.login()
  }

  return (
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
  )
}

export default GoogleLoginButton
