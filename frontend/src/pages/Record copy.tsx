import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useUserStore, selectMachineId } from '@/store/userStore'
import { ROUTES } from '@/routes/routes'
import { timeLapseAPI } from '@/api/timeLapseAPI'

const Record: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const machineId = useUserStore(selectMachineId)
  const [isRecording, setIsRecording] = useState(false)
  const [timeLapseId, setTimeLapseId] = useState("0") 
  const streamingURL = location.state?.streamingUrl

  const handleGoToHome = () => {
    navigate(ROUTES.HOME)
  }

  const handleStartRecording = async () => {
    setIsRecording(true)
    // 여기에 실제 녹화 시작 로직을 추가할 수 있습니다
    console.log('타임랩스 촬영 시작')
    const response = await timeLapseAPI.startRecordingTimeLapse(machineId)
    setTimeLapseId(response.data.id)
    console.log(response.data.id)
  }

  const handleStopRecording = async () => {
    setIsRecording(false)
    // 여기에 실제 녹화 중지 로직을 추가할 수 있습니다
    console.log('타임랩스 촬영 중지')
    console.log(timeLapseId)
    
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
        <div className="camera-preview">
          {streamingURL ? (
            <img 
              src={streamingURL}
              alt="카메라 스트림"
              style={{ width: '100%', height: 'auto', maxHeight: '400px' }}
            />
          ) : (
            <div className="no-stream">
              <p>스트림을 불러올 수 없습니다</p>
            </div>
          )}
        </div>

        <div className="record-controls">
          {!isRecording ? (
            <button className="capture-button" onClick={handleStartRecording}>
              촬영 시작
            </button>
          ) : (
            <button className="stop-button" onClick={handleStopRecording}>
              촬영 종료
            </button>
          )}
          <button className="home-button" onClick={handleGoToHome}>
            돌아가기
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