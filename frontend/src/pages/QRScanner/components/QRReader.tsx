import React from 'react'
import { QRReaderProps } from '@/types/QRScanner'

const QRReader: React.FC<QRReaderProps> = ({ qrReaderRef }) => {
  return (
    <div
      id="qr-reader-element"
      ref={qrReaderRef}
      className="qr-reader-container"
    ></div>
  )
}

export default QRReader
