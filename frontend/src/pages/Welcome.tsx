import React, { useState } from 'react'
import Carousel from '@/components/Carousel'
import '@/styles/Welcome.css'
import { userAPI } from '@/api/userAPI'
import { useNavigation } from '@/hooks/useNavigation'

const Welcome: React.FC = () => {
  console.log(useState)
  const { toSignUp } = useNavigation()
  const handleGoogleLogin = () => {
    // userAPI.login()
    console.log('ㄸ딸깎')
    toSignUp()
  }

  return (
    <div className="welcome-page">
      <h1>공부 통계를 확인해보세요!</h1>

      <Carousel />

      <button className="google-login-btn" onClick={handleGoogleLogin}>
        <img
          src="https://developers.google.com/identity/images/g-logo.png"
          alt="Google logo"
          className="google-icon"
        />
        Sign up with Google
      </button>
    </div>
  )
}

export default Welcome
