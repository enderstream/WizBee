import React, { FC, ReactElement } from 'react'
import '@/styles/QRScanner.css'

import ScannerHeader from '@/pages/QRScanner/components/ScannerHeader'
import PermissionRequest from '@/pages/QRScanner/components/PermissionRequest'
import ScannerContent from '@/pages/QRScanner/components/ScannerContent'
import ScanningGuide from '@/pages/QRScanner/components/ScanningGuide'
import ErrorMessage from '@/pages/QRScanner/components/ErrorMessage'
import { useQRScanner } from '@/hooks/useQRScanner'

const QRScanner: FC = (): ReactElement => {
  const {
    scanning,
    isRegistering,
    registrationStatus,
    scanResult,
    error,
    permissionGranted,
    qrReaderRef,

    requestCameraPermission,
    startScanner,
    handleBack,
    clearError,
    navigateToHome,
  } = useQRScanner()

  return (
    <div className="qr-scanner-container">
      <ScannerHeader onBack={handleBack} />

      {!permissionGranted ? (
        <PermissionRequest onRequestPermission={requestCameraPermission} />
      ) : (
        <div className="scanner-content">
          <ScannerContent
            scanning={scanning}
            scanResult={scanResult}
            isRegistering={isRegistering}
            registrationStatus={registrationStatus}
            error={error}
            qrReaderRef={qrReaderRef}
            onStartScan={startScanner}
            onGoHome={navigateToHome}
          />
        </div>
      )}

      {error && <ErrorMessage error={error} onClear={clearError} />}

      {scanning && <ScanningGuide />}
    </div>
  )
}

export default QRScanner
