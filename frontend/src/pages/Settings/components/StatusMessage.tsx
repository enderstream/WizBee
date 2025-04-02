import React from 'react'
import { useSettingsState } from '@/hooks/useSettingsState'

const StatusMessage: React.FC = () => {
  const { statusMessage, setStatusMessage } = useSettingsState()

  return (
    <div className="status-message-container">
      <div className="status-message">
        <p>{statusMessage}</p>
        <button onClick={() => setStatusMessage('')}>확인</button>
      </div>
    </div>
  )
}

export default StatusMessage
