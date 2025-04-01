import { useEffect, FC, ReactElement } from 'react'
import { Html5Qrcode } from 'html5-qrcode'
import { useQRScanner } from '@/hooks/useQRScanner'
import ScannerHeader from '@/pages/QRScanner/components/ScannerHeader'
import PermissionRequest from '@/pages/QRScanner/components/PermissionRequest'
import ScannerContent from '@/pages/QRScanner/components/ScannerContent'
import ErrorMessage from '@/pages/QRScanner/components/ErrorMessage'
import ScanningGuide from '@/pages/QRScanner/components/ScanningGuide'
import '@/styles/QRScanner.css'

const QRScanner: FC = (): ReactElement => {
  const {
    permissionGranted,
    scanning,
    error,
    qrReaderRef,
    clearError,
    stopScanner,
    onScanSuccess,
    onScanFailure,
  } = useQRScanner()

  // QR 스캐너 초기화 효과
  useEffect((): (() => void) => {
    // 스캐닝 중이고 DOM 요소가 존재할 때만 초기화
    if (scanning && qrReaderRef.current) {
      // 요소에 ID 할당
      const qrReaderId: string = 'qr-reader-element'
      qrReaderRef.current.id = qrReaderId

      const html5QrCode: Html5Qrcode = new Html5Qrcode(qrReaderId)

      // 스캐너 설정
      const config = {
        fps: 10,
        qrbox: undefined,
        aspectRatio: 1.0,
        disableFlip: false,
      }

      // 스캐너 시작
      html5QrCode
        .start(
          { facingMode: 'environment' },
          config,
          onScanSuccess,
          onScanFailure,
        )
        .catch((err: Error) => {
          console.error('Scanner start error:', err)
          clearError()
          stopScanner()
        })

      // 나중에 정리를 위해 인스턴스 저장
      window.qrScanner = html5QrCode
    }

    // 컴포넌트 언마운트 시 정리
    return () => {
      if (window.qrScanner) {
        window.qrScanner
          .stop()
          .catch((err: Error): void => {
            console.error('Scanner stop error:', err)
          })
          .finally((): void => {
            window.qrScanner = null
          })
      }
    }
  }, [
    scanning,
    qrReaderRef,
    onScanSuccess,
    onScanFailure,
    clearError,
    stopScanner,
  ])

  return (
    <div className="qr-scanner-container">
      <ScannerHeader />

      {!permissionGranted ? <PermissionRequest /> : <ScannerContent />}

      {error && <ErrorMessage />}

      {scanning && <ScanningGuide />}
    </div>
  )
}

export default QRScanner
