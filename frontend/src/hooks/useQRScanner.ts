import { useState, useRef, useCallback } from 'react'
// import { Html5Qrcode } from 'html5-qrcode'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@/routes/routes'
import { create } from 'zustand'
import { useUserStore } from '@/store/userStore'
// import { ScannerConfig } from '@/types/Register'

// QRScanner 상태 관리를 위한 Zustand 스토어
interface QRScannerState {
  isRegistering: boolean
  registrationStatus: 'idle' | 'success' | 'error'
  scanResult: string
  error: string
  permissionGranted: boolean

  setScanResult: (result: string) => void
  setError: (error: string) => void
  setPermissionGranted: (granted: boolean) => void
  setRegistrationStatus: (status: 'idle' | 'success' | 'error') => void
  setIsRegistering: (isRegistering: boolean) => void
  resetState: () => void
  registerDevice: (qrData: string) => void
}

// 초기 상태
const initialState = {
  isRegistering: false,
  registrationStatus: 'idle' as const,
  scanResult: '',
  error: '',
  permissionGranted: false
}

// 스캐너 기능을 위한 전역 Zustand 스토어
export const useQRScannerStore = create<QRScannerState>((set, get) => ({
  ...initialState,

  setScanResult: (result) => set({ scanResult: result }),
  setError: (error) => set({ error }),
  setPermissionGranted: (granted) => set({ permissionGranted: granted }),
  setRegistrationStatus: (status) => set({ registrationStatus: status }),
  setIsRegistering: (isRegistering) => set({ isRegistering }),

  resetState: () => set({
    ...initialState,
    permissionGranted: get().permissionGranted // 권한은 유지
  }),

  registerDevice: async (qrData) => {
    try {
      set({ isRegistering: true })

      // userStore에서 userId 가져오기
      const userId = useUserStore.getState().user.userId

      if (!userId) {
        throw new Error('사용자 정보를 찾을 수 없습니다.')
      }

      console.log('기기 등록 시작:', qrData, '사용자 ID:', userId)

      // TODO: 실제 API 호출 구현
      // await machineAPI.registerDevice(userId, qrData)

      // 등록 성공 시뮬레이션 (실제 구현에서는 API 응답 사용)
      await new Promise(resolve => setTimeout(resolve, 1500))

      set({
        isRegistering: false,
        registrationStatus: 'success'
      })

      // 성공 시 사용자 정보 업데이트 (필요한 경우)
      // const userUpdate = { hasRegisteredDevice: true }
      // useUserStore.getState().updateUser(userUpdate)

    } catch (error) {
      console.error('기기 등록 실패:', error)
      set({
        isRegistering: false,
        registrationStatus: 'error',
        error: error instanceof Error ? error.message : '기기 등록에 실패했습니다.'
      })
    }
  }
}))

// 컴포넌트 로직을 관리하는 훅
export const useQRScanner = () => {
  const navigate = useNavigate()
  const [scanning, setScanning] = useState<boolean>(false)
  const qrReaderRef = useRef<HTMLDivElement | null>(null)
  const lastErrorLog = useRef<number>(0)

  // QRScannerStore에서 상태와 액션 가져오기
  const {
    setScanResult,
    setError,
    setPermissionGranted,
    resetState,
    registerDevice,
    ...state
  } = useQRScannerStore()

  // 카메라 권한 요청
  const requestCameraPermission = useCallback(async (): Promise<void> => {
    try {
      const stream: MediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      })
      // 권한만 확인하고 스트림은 즉시 중지
      stream.getTracks().forEach((track: MediaStreamTrack): void => track.stop())
      setPermissionGranted(true)
      // 권한 획득 후 스캐닝 시작
      setScanning(true)
    } catch (error) {
      console.error('Camera permission error:', error)
      setError('카메라 권한을 허용해주세요.')
    }
  }, [setPermissionGranted, setError])

  // 스캐너 중지
  const stopScanner = useCallback((): void => {
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
  }, [])

  // QR 스캔 성공 시 호출
  const onScanSuccess = useCallback((decodedText: string): void => {
    // 스캔 후 스캐너 중지
    stopScanner()
    setScanResult(decodedText)

    // QR 코드 처리 로깅
    console.log('%c[QR 스캔 성공]', 'background: #4CAF50; color: white; padding: 2px 6px; border-radius: 2px; font-weight: bold;')
    console.log('인식된 QR 코드:', decodedText)

    // QR 정보로 기기 등록 시작
    registerDevice(decodedText)
  }, [stopScanner, setScanResult, registerDevice])

  // QR 스캔 실패 시 호출 (과도한 로깅 방지)
  const onScanFailure = useCallback((): void => {
    const now = Date.now()
    if (now - lastErrorLog.current > 1000) {
      lastErrorLog.current = now
      // 디버깅용 로그 (필요 시 활성화)
      // console.warn('QR scan error:', errorMessage)
    }
  }, [])

  // 뒤로 가기
  const handleBack = useCallback((): void => {
    if (scanning) {
      stopScanner()
    }
    navigate(ROUTES.HOME)
  }, [scanning, stopScanner, navigate])

  // 스캔 시작
  const startScanner = useCallback((): void => {
    resetState() // 상태 초기화
    setScanning(true)
  }, [resetState])

  // 에러 메시지 초기화
  const clearError = useCallback((): void => {
    setError('')
  }, [setError])

  return {
    ...state,
    scanning,
    qrReaderRef,
    requestCameraPermission,
    stopScanner,
    startScanner,
    handleBack,
    clearError,
    onScanSuccess,
    onScanFailure
  }
}