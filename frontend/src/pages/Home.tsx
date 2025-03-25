import React from 'react'
import Calendar from '@/components/Calendar'
import { useNavigation } from '@/hooks/useNavigation'
import '@/styles/Home.css'

const Home: React.FC = () => {
  const { toRecord, toQRScanner } = useNavigation()

  const handleStartTimeLapse = () => {
    // 촬영 페이지로 이동
    console.log('Starting time-lapse session')
    toRecord()
  }

  const registerQR = () => {
    console.log(`QR start`)
    toQRScanner()
  }

  return (
    <div className="home-page">
      <div className="home-header">
        <div className="home-avatar"></div>
        <div className="home-greeting">
          <h2>권동환님!</h2>
          <p>오늘도 열공해봐요</p>
        </div>
        <div className="qr-code">
          <button className="QR-button" onClick={registerQR}>
            QR
          </button>
        </div>
      </div>

      <div className="timelapse-container">
        <h3>타임랩스</h3>
        <button className="start-button" onClick={handleStartTimeLapse}>
          start
        </button>
      </div>

      <div className="study-records">
        <h3>나의 공부 기록</h3>
        <Calendar month={2} />
      </div>
    </div>
  )
}

export default Home
