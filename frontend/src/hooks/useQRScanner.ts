import { useState, useEffect, useRef } from 'react'
import { Html5Qrcode } from 'html5-qrcode'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@/routes/routes'
import useRegisterStore from '@/store/registerStore'
import { ScannerConfig } from '@/types/Register'

export const useQRScanner = () => {
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
  
  // QR 스캐너 초기화 및 정리
  useEffect((): (() => void) => {
    if (!scanning || !qrReaderRef.current) return cleanupScanner

    const qrReaderId: string = 'qr-reader-element'
    qrReaderRef.current.id = qrReaderId
    
    const html5QrCode: Html5Qrcode = new Html5Qrcode(qrReaderId)
    
    // 스캐너 설정 최적화
    const config: ScannerConfig = { 
      fps: 10, 
      qrbox: undefined, 
      aspectRatio: 1.0,
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

    return cleanupScanner
  }, [scanning])

  // 스캐너 정리 함수
  const cleanupScanner = () => {
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

  // 카메라 권한 요청
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

  // 스캐너 중지
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

  // QR 코드 스캔 성공 핸들러
  const onScanSuccess = (decodedText: string): void => {
    stopScanner()
    setScanResult(decodedText)
    
    console.log('%c[QR 스캔 성공]', 'background: #4CAF50; color: white; padding: 2px 6px; border-radius: 2px; font-weight: bold;')
    console.log('인식된 QR 코드:', decodedText)
    
    registerDevice(decodedText)
  }

  // QR 코드 스캔 실패 핸들러
  const onScanFailure = (): void => {
    const now = Date.now()
    if (now - lastErrorLog.current > 1000) {
      lastErrorLog.current = now
      // 디버깅 목적으로만 사용하고 배포 환경에서는 제거할 수 있음
      // console.warn('QR scan error:', errorMessage)
    }
  }

  // 뒤로가기 핸들러
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

  // 에러 메시지 초기화
  const clearError = (): void => {
    setError('')
  }

  // 홈으로 이동
  const navigateToHome = (): void => {
    navigate(ROUTES.HOME)
  }

  return {
    // 상태
    scanning,
    isRegistering,
    registrationStatus,
    scanResult,
    error,
    permissionGranted,
    qrReaderRef,
    
    // 액션
    requestCameraPermission,
    startScanner,
    handleBack,
    clearError,
    navigateToHome
  }
}