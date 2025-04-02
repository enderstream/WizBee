import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useUserStore, selectName, selectProfileImageUrl } from '@/store/userStore'
import { ROUTES } from '@/routes/routes'
import '@/styles/Home.css'
import QRScannerModal from '@/components/QRScannerModal'

const Home: React.FC = () => {
  const navigate = useNavigate()
  const name = useUserStore(selectName)
  const profileImageUrl = useUserStore(selectProfileImageUrl)
  

  // 촬영 페이지로 이동
  const handleStartTimeLapse = () => {
    console.log('타임랩스 세션 시작')
    navigate(ROUTES.RECORD)
  }

  return (
    <div className="home-page">
      <div className="home-header">
        <div className="home-avatar">
          {profileImageUrl && (
            <img 
              src={profileImageUrl}
              alt="@/assets/react.svg"
              className="profileImage"
            />
          )}
        </div>
        <div className="home-greeting">
          <h2>{name || '사용자'}님!</h2>
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


    </div>
  )
}

export default Home