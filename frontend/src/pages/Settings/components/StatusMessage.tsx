import React from 'react'
import { StatusMessageProps } from '@/types/Setting'

const StatusMessage: React.FC<StatusMessageProps> = ({ message, onClose }) => {
  return (
    <div className="status-message-container">
      <div className="status-message">
        <p>{message}</p>
        <button onClick={onClose}>확인</button>
      </div>
    </div>
  )
}

export default StatusMessage
