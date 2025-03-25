import React from 'react'
import { useNavigation } from '@/hooks/useNavigation'
import '@/styles/Record.css' // CSS 파일이 필요하다면 만들어야 합니다

const Record: React.FC = () => {
  // const { user } = useAuth()
  const { toHome } = useNavigation()
  return (
    <div className="record-page">
      <div className="record-header">
        <h2>타임랩스 촬영</h2>
      </div>

      <div className="camera-container">
        {/* 카메라 미리보기 또는 관련 컨텐츠 */}
        <div className="camera-preview">
          {/* 여기에 카메라 미리보기 UI를 추가 */}
        </div>

        <div className="record-controls">
          <button className="capture-button">촬영</button>
          <button className="stop-button" onClick={toHome}>
            중지
          </button>
        </div>
      </div>

      <div className="record-info">
        <p>타임랩스 촬영을 시작하려면 촬영 버튼을 누르세요.</p>
        {/* <p>현재 세션: {user?.displayName || '사용자'}</p> */}
      </div>
    </div>
  )
}

export default Record
