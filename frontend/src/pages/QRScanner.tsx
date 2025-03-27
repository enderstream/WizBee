import { useState, useEffect, useRef, FC, ReactElement } from 'react'
import { Html5Qrcode } from 'html5-qrcode'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@/routes/routes'
import useRegisterStore from '@/store/registerStore'
import { ScannerConfig } from '@/types/Register'
import '@/styles/QRScanner.css'

// global.d.ts에서 Window 인터페이스가 확장됨

const QRScanner: FC = (): ReactElement => {
  const navigate = useNavigate()
  
  // Zustand 스토어에서 상태와 액션 가져오기
  const { 
    isRegistering, 
    registrationStatus, 
    scanResult, 
    error, 
    permissionGranted,
    setScanResult,
    setError,
    setPermissionGranted,
    resetState,
    registerDevice
  } = useRegisterStore()
  
  // 로컬 상태 (스캐닝 활성화 여부만 로컬 상태로 유지)
  const [scanning, setScanning] = useState<boolean>(false)
  const qrReaderRef = useRef<HTMLDivElement | null>(null)
  
  // 과도한 오류 로깅을 방지하기 위한 디바운스 변수
  const lastErrorLog = useRef<number>(0)
  
  // QR 스캐너 초기화 효과
  useEffect((): (() => void) => {
    // 이미 scanning 상태이고, DOM 요소가 존재하는 경우에만 스캐너 초기화
    if (scanning && qrReaderRef.current) {
      // ID를 사용하는 대신 직접 HTML 요소를 사용하거나 ID가 확실히 있는지 확인
      const qrReaderId: string = 'qr-reader-element'
      qrReaderRef.current.id = qrReaderId
      
      const html5QrCode: Html5Qrcode = new Html5Qrcode(qrReaderId)
      
      // 스캐너 설정 최적화
      const config: ScannerConfig = { 
        fps: 10, 
        // 동적 QR 박스 크기: undefined로 설정하면 전체 뷰파인더 영역을 사용합니다
        qrbox: undefined, 
        aspectRatio: 1.0,
        // QR 코드 인식 속도 향상을 위한 설정
        disableFlip: false
      }
      
      html5QrCode.start(
        { facingMode: 'environment' }, 
        config,
        onScanSuccess,
        onScanFailure
      )
      .catch((err: Error) => {
        console.error('Scanner start error:', err)
        setError('QR 스캐너를 시작할 수 없습니다.')
        setScanning(false)
      })

      // Store scanner instance to window for cleanup
      window.qrScanner = html5QrCode
    }

    // 컴포넌트 언마운트 시 정리
    return () => {
      // 스캐너 정리
      if (window.qrScanner) {
        window.qrScanner.stop()
          .then((): void => {
            console.log('Scanner stopped')
          })
          .catch((err: Error): void => {
            console.error('Scanner stop error:', err)
          })
          .finally((): void => {
            window.qrScanner = null
          })
      }
    }
  }, [scanning]) // scanning 상태가 변경될 때마다 효과 실행

  const requestCameraPermission = async (): Promise<void> => {
    try {
      const stream: MediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      })
      // Stop the stream immediately, we just wanted the permission
      stream.getTracks().forEach((track: MediaStreamTrack): void => track.stop())
      setPermissionGranted(true)
      // 권한 획득 후 스캐닝 시작
      setScanning(true)
    } catch (error) {
      console.error('Camera permission error:', error)
      setError('카메라 권한을 허용해주세요.')
    }
  }

  const stopScanner = (): void => {
    if (window.qrScanner) {
      window.qrScanner.stop()
        .then((): void => {
          console.log('Scanner stopped')
        })
        .catch((err: Error): void => {
          console.error('Scanner stop error:', err)
        })
        .finally((): void => {
          window.qrScanner = null
          setScanning(false)
        })
    } else {
      setScanning(false)
    }
  }

  const onScanSuccess = (decodedText: string): void => {
    // Stop scanning after successful scan
    stopScanner()
    setScanResult(decodedText)
    
    // Process the QR code data
    console.log('%c[QR 스캔 성공]', 'background: #4CAF50; color: white; padding: 2px 6px; border-radius: 2px; font-weight: bold;')
    console.log('인식된 QR 코드:', decodedText)
    
    // QR 코드에서 인식된 정보를 이용해 기기 등록 진행
    // 현재 구현에서 machineAPI.registerMachine은 userId만 사용하고
    // QR 코드 정보는 로깅 목적으로만 사용합니다.
    registerDevice(decodedText)
  }

  // const onScanFailure = (errorMessage: string): void => {
  const onScanFailure = (): void => {
    // 1초에 한 번만 오류 로깅 (과도한 콘솔 출력 방지)
    const now = Date.now()
    if (now - lastErrorLog.current > 1000) {
      lastErrorLog.current = now
      // 디버깅 목적으로만 사용하고 배포 환경에서는 제거할 수 있음
      // console.warn('QR scan error:', errorMessage)
    }
  }

  const handleBack = (): void => {
    if (scanning) {
      stopScanner()
    }
    navigate(ROUTES.HOME)
  }

  // 스캔 시작 핸들러
  const startScanner = (): void => {
    resetState() // Zustand 스토어 상태 초기화
    setScanning(true)
  }

  const clearError = (): void => {
    setError('')
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
            <div id="qr-reader-element" ref={qrReaderRef} className="qr-reader-container"></div>
          ) : scanResult ? (
            <div className="scan-result">
              {isRegistering ? (
                <div className="registration-loading">
                  <h3>기기 등록 중...</h3>
                  <p>QR 코드 정보를 처리하고 있습니다.</p>
                </div>
              ) : registrationStatus === 'success' ? (
                <div className="registration-success">
                  <h3>등록 완료!</h3>
                  <p>기기가 성공적으로 등록되었습니다.</p>
                  <p className="result-text"><strong>기기 ID:</strong> {scanResult}</p>
                  <p className="result-note">* 개발자 도구 콘솔(F12)에서도 확인 가능합니다.</p>
                  <button 
                    className="home-button" 
                    onClick={() => navigate(ROUTES.HOME)}
                  >
                    홈으로 이동
                  </button>
                </div>
              ) : registrationStatus === 'error' ? (
                <div className="registration-error">
                  <h3>등록 실패</h3>
                  <p>{error || '기기 등록에 실패했습니다.'}</p>
                  <button 
                    className="retry-button" 
                    onClick={startScanner}
                  >
                    다시 스캔하기
                  </button>
                </div>
              ) : (
                <div className="scan-complete">
                  <h3>스캔 완료!</h3>
                  <p>QR 코드를 인식했습니다.</p>
                  <p className="result-text"><strong>인식된 QR 코드:</strong> {scanResult}</p>
                </div>
              )}
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
          <button onClick={clearError}>확인</button>
        </div>
      )}
      
      {scanning && (
        <div className="scanning-guide">
          <p>QR 코드가 카메라 중앙에 오도록 위치시켜 주세요</p>
        </div>
      )}
    </div>
  )
}

export default QRScanner