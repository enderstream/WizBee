import React from 'react'
import { ScanningGuideProps } from '@/types/QRScanner'

const ScanningGuide: React.FC<ScanningGuideProps> = () => {
  return (
    <div className="scanning-guide">
      <p>QR 코드가 카메라 중앙에 오도록 위치시켜 주세요</p>
    </div>
  )
}

export default ScanningGuide
