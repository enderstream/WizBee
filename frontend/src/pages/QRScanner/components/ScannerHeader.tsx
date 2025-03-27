import React from 'react'
import { ScannerHeaderProps } from '@/types/QRScanner'

const ScannerHeader: React.FC<ScannerHeaderProps> = ({ onBack }) => {
  return (
    <div className="scanner-header">
      <button className="back-button" onClick={onBack}>
        ← 뒤로
      </button>
      <h2>QR 코드 스캔</h2>
    </div>
  )
}

export default ScannerHeader
