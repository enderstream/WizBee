import { useState, useEffect } from 'react'
import { Html5Qrcode } from 'html5-qrcode'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@/routes/routes'
import { userAPI } from '@/api/userAPI'
import './QRScanner.css'

function QRScanner() {
  const navigate = useNavigate()
  const [scanning, setScanning] = useState(false)
  const [permissionGranted, setPermissionGranted] = useState(false)
  const [scanResult, setScanResult] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    // Clean up when component unmounts
    return () => {
      if (scanning) {
        stopScanner()
      }
    }
  }, [scanning])

  const requestCameraPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      // Stop the stream immediately, we just wanted the permission
      stream.getTracks().forEach(track => track.stop())
      setPermissionGranted(true)
      startScanner()
    } catch (error) {
      console.error('Camera permission error:', error)
      setError('카메라 권한을 허용해주세요.')
    }
  }

  const startScanner = () => {
    setScanning(true)
    const html5QrCode = new Html5Qrcode('qr-reader')
    
    const config = { 
      fps: 10, 
      qrbox: { width: 250, height: 250 },
      aspectRatio: 1.0
    }
    
    html5QrCode.start(
      { facingMode: 'environment' }, 
      config,
      onScanSuccess,
      onScanFailure
    )
    .catch(err => {
      console.error('Scanner start error:', err)
      setError('QR 스캐너를 시작할 수 없습니다.')
      setScanning(false)
    })

    // Store scanner instance to window for cleanup
    window.qrScanner = html5QrCode
  }

  const stopScanner = () => {
    if (window.qrScanner) {
      window.qrScanner.stop()
        .then(() => {
          console.log('Scanner stopped')
        })
        .catch(err => {
          console.error('Scanner stop error:', err)
        })
        .finally(() => {
          window.qrScanner = null
          setScanning(false)
        })
    }
  }

  const onScanSuccess = (decodedText) => {
    // Stop scanning after successful scan
    stopScanner()
    setScanResult(decodedText)
    
    // Process the QR code data
    console.log('QR Code detected:', decodedText)
    
    // Here you would typically send the QR data to your backend or process it
    processQRCode(decodedText)
  }

  const onScanFailure = (error) => {
    // Handle scan failures (usually just ignore)
    console.warn('QR scan error:', error)
  }

  const processQRCode = async (qrData) => {
    try {
      // Example: Send QR data to your API
      // const response = await userAPI.registerDevice(qrData)
      
      // For now, just show the result and redirect after a delay
      setTimeout(() => {
        navigate(ROUTES.HOME)
      }, 3000)
    } catch (err) {
      console.error('Error processing QR code:', err)
      setError('QR 코드 처리 중 오류가 발생했습니다.')
    }
  }

  const handleBack = () => {
    if (scanning) {
      stopScanner()
    }
    navigate(ROUTES.HOME)
  }

  return (
    <div className="qr-scanner-container">
      <div className="scanner-header">
        <button className="back-button" onClick={handleBack}>
          ← 뒤로
        </button>
        <h2>QR 코드 스캔</h2>
      </div>

      {!permissionGranted ? (
        <div className="permission-request">
          <p>QR 코드를 스캔하려면 카메라 접근 권한이 필요합니다.</p>
          <button 
            className="permission-button" 
            onClick={requestCameraPermission}
          >
            카메라 권한 허용
          </button>
        </div>
      ) : (
        <div className="scanner-content">
          {scanning ? (
            <div id="qr-reader" className="qr-reader-container"></div>
          ) : scanResult ? (
            <div className="scan-result">
              <h3>스캔 완료!</h3>
              <p>QR 코드 정보가 처리되었습니다.</p>
              <p className="result-text">{scanResult}</p>
              <p>잠시 후 메인 화면으로 이동합니다...</p>
            </div>
          ) : (
            <button 
              className="scan-button" 
              onClick={startScanner}
            >
              QR 스캔 시작
            </button>
          )}
        </div>
      )}

      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={() => setError('')}>확인</button>
        </div>
      )}
    </div>
  )
}

export default QRScanner