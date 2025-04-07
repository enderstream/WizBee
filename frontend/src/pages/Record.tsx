import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUserStore, selectMachineId } from '@/store/userStore'
import { ROUTES } from '@/routes/routes'
import { timeLapseAPI } from '@/api/timeLapseAPI'
// import '@/styles/Record.css'

// const baseURL = import.meta.env.VITE_API_URL

const Record: React.FC = () => {
  const navigate = useNavigate()
  const machineId = useUserStore(selectMachineId)
  const [isRecording, setIsRecording] = useState(false)
  const [timeLapseId, setTimeLapseId] = useState("0") 

  const handleGoToHome = () => {
    navigate(ROUTES.HOME)
  }

  const handleStartRecording = async () => {
    setIsRecording(true)
    // 여기에 실제 녹화 시작 로직을 추가할 수 있습니다
    console.log('타임랩스 촬영 시작')
    const response = await timeLapseAPI.startRecordingTimeLapse(machineId)
    console.log(response.data)
    console.log(response.status)
    setTimeLapseId(response.data.id)
  }

  const handleStopRecording = async () => {
    setIsRecording(false)
    // 여기에 실제 녹화 중지 로직을 추가할 수 있습니다
    console.log('타임랩스 촬영 중지')
    const response = await timeLapseAPI.finishRecordingTimeLapse(
      timeLapseId,
      '나의 타임랩스',
    )
    console.log(response.status)
    console.log(response.data)
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
          {/* 여기에 stream url을 src로 */}
          <h2>---</h2>
        </div>

        <div className="record-controls">
          {!isRecording ? (
            <button className="capture-button" onClick={handleStartRecording}>
              촬영
            </button>
          ) : (
            <button className="stop-button" onClick={handleStopRecording}>
              중지
            </button>
          )}
          <button className="home-button" onClick={handleGoToHome}>
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
