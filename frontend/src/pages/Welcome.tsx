import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Carousel from '../components/Carousel'
import { useAuth } from '../contexts/AuthContext'
import '@/styles/Welcome.css'

const Welcome: React.FC = () => {
  const { user, googleLogin } = useAuth()
  const navigate = useNavigate()
  console.log(user)
  console.log(useState)
  const handleGoogleLogin = () => {
    googleLogin()
    navigate('/signup')
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
