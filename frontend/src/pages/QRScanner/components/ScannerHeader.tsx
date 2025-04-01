import React from 'react'
import { useQRScanner } from '@/hooks/useQRScanner'

const ScannerHeader: React.FC = () => {
  const { handleBack } = useQRScanner()

  return (
    <div className="scanner-header">
      <button className="back-button" onClick={handleBack}>
        ← 뒤로
      </button>
      <h2>QR 코드 스캔</h2>
    </div>
  )
}

export default ScannerHeader
