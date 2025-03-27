import React from 'react'
import { ErrorMessageProps } from '@/types/QRScanner'

const ErrorMessage: React.FC<ErrorMessageProps> = ({ error, onClear }) => {
  return (
    <div className="error-message">
      <p>{error}</p>
      <button onClick={onClear}>확인</button>
    </div>
  )
}

export default ErrorMessage
