import React from 'react'
import { useQRScanner } from '@/hooks/useQRScanner'

const ErrorMessage: React.FC = () => {
  const { error, clearError } = useQRScanner()

  return (
    <div className="error-message">
      <p>{error}</p>
      <button onClick={clearError}>확인</button>
    </div>
  )
}

export default ErrorMessage
