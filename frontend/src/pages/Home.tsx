import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useUserStore, selectNickname } from '@/store/userStore'
import { ROUTES } from '@/routes/routes'
import '@/styles/Home.css'

const Home: React.FC = () => {
  const navigate = useNavigate()
  const nickname = useUserStore(selectNickname)

  // 촬영 페이지로 이동
  const handleStartTimeLapse = () => {
    console.log('타임랩스 세션 시작')
    navigate(ROUTES.RECORD)
  }

  const handleQRScanner = () => {
    console.log('QR 스캐너 시작')
    navigate(ROUTES.QR_SCANNER)
  }

  return (
    <div className="home-page">
      <div className="home-header">
        <div className="home-avatar"></div>
        <div className="home-greeting">
          <h2>{nickname || '사용자'}님!</h2>
          <p>오늘도 열공해봐요</p>
        </div>
        <div className="qr-code">
          <button className="QR-button" onClick={handleQRScanner}>
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

      {/* <div className="study-records">
        <h3>나의 공부 기록</h3>
        <Calendar month={2} />
      </div> */}
    </div>
  )
}

export default Home
