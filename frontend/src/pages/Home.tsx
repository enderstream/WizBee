import React from 'react'
import { useAuth } from '../contexts/AuthContext'
import Calendar from '../components/Calendar'
import { useNavigate } from 'react-router-dom'
import '@/styles/Home.css'

const Home: React.FC = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  console.log(user)
  
  const handleStartTimelapse = () => {
    // 촬영 페이지로 이동
    console.log('Starting shooting session')
    navigate('/shooting')
  }

  return (
    <div className="home-page">
      <div className="home-header">
        <div className="home-avatar"></div>
        <div className="home-greeting">
          <h2>권동환님!</h2>
          <p>오늘도 열공해봐요</p>
        </div>
        <div className="qr-code"></div>
      </div>

      <div className="timelapse-container">
        <h3>타임랩스</h3>
        <button className="start-button" onClick={handleStartTimelapse}>
          start
        </button>
      </div>

      <div className="study-records">
        <h3>나의 공부 기록</h3>
        <Calendar month={2} />
      </div>

      <div className="navigation-icons">
        <div className="nav-icon home"></div>
        <div className="nav-icon video"></div>
        <div className="nav-icon calendar"></div>
        <div className="nav-icon settings"></div>
      </div>
    </div>
  )
}

export default Home