import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
// import { useUserStore, selectName } from '@/store/userStore'
import { ROUTES } from '@/routes/routes'
// import '@/styles/Record.css'

const baseURL = import.meta.env.VITE_API_URL

const Record: React.FC = () => {
  const navigate = useNavigate()
  // const name = useUserStore(selectName)
  const [isRecording, setIsRecording] = useState(false)
  
  // Spring 서버의 스트리밍 엔드포인트 URL
  const streamUrl = `${baseURL}/video/stream`

  const handleGoToHome = () => {
    navigate(ROUTES.HOME)
  }

  const handleStartRecording = () => {
    setIsRecording(true)
    // 여기에 실제 녹화 시작 로직을 추가할 수 있습니다
    console.log('타임랩스 촬영 시작')
  }

  const handleStopRecording = () => {
    setIsRecording(false)
    // 여기에 실제 녹화 중지 로직을 추가할 수 있습니다
    console.log('타임랩스 촬영 중지')
  }

  return (
    <div className="record-page">
      <div className="record-header">
        <h2>타임랩스 촬영</h2>
      </div>

      <div className="camera-container">
        {/* MJPEG 스트리밍 화면 */}
        <h2>---</h2>
        <div className="camera-preview">
          <img 
            src={streamUrl} 
            alt="타임랩스 비디오 스트림" 
            style={{ width: '100%', borderRadius: '8px' }} 
          />
          <h2>---</h2>
        </div>


        <div className="record-controls">
          {!isRecording ? (
            <button 
              className="capture-button" 
              onClick={handleStartRecording}
            >
              촬영
            </button>
          ) : (
            <button 
              className="stop-button" 
              onClick={handleStopRecording}
            >
              중지
            </button>
          )}
          <button 
            className="home-button" 
            onClick={handleGoToHome}
          >
            홈으로
          </button>
        </div>
      </div>

      <div className="record-info">
        {!isRecording ? (
          <p>타임랩스 촬영을 시작하려면 촬영 버튼을 누르세요.</p>
        ) : (
          <p>타임랩스 촬영 중... 중지하려면 중지 버튼을 누르세요.</p>
        )}
      </div>
    </div>
  )
}

export default Record