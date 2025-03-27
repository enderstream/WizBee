import React from 'react'
import { ScannerButtonProps } from '@/types/QRScanner'

const ScannerButton: React.FC<ScannerButtonProps> = ({ onStartScan }) => {
  return (
    <button className="scan-button" onClick={onStartScan}>
      QR 스캔 시작
    </button>
  )
}

export default ScannerButton
