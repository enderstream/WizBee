import React from 'react'
import QRReader from '@/pages/QRScanner/components/QRReader'
import ScanResult from '@/pages/QRScanner/components/ScanResult'
import ScannerButton from '@/pages/QRScanner/components/ScannerButton'
import { ScannerContentProps } from '@/types/QRScanner'

const ScannerContent: React.FC<ScannerContentProps> = ({
  scanning,
  scanResult,
  isRegistering,
  registrationStatus,
  error,
  qrReaderRef,
  onStartScan,
  onGoHome,
}) => {
  if (scanning) {
    return <QRReader qrReaderRef={qrReaderRef} />
  }

  if (scanResult) {
    return (
      <ScanResult
        scanResult={scanResult}
        isRegistering={isRegistering}
        registrationStatus={registrationStatus}
        error={error}
        onStartScan={onStartScan}
        onGoHome={onGoHome}
      />
    )
  }

  return <ScannerButton onStartScan={onStartScan} />
}

export default ScannerContent
