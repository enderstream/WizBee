// 등록 상태를 위한 타입 정의
export type RegistrationStatus = 'idle' | 'success' | 'error'

// 스토어 상태 인터페이스
export interface RegisterState {
    // 상태
    isRegistering: boolean
    registrationStatus: RegistrationStatus
    scanResult: string
    error: string
    permissionGranted: boolean
}

// 스토어 액션 인터페이스
export interface RegisterActions {
    setIsRegistering: (isRegistering: boolean) => void
    setRegistrationStatus: (status: RegistrationStatus) => void
    setScanResult: (result: string) => void
    setError: (error: string) => void
    setPermissionGranted: (granted: boolean) => void
    resetState: () => void

    // 비즈니스 로직
    registerDevice: (deviceId: string) => Promise<void>
}

// 스캐너 설정 타입
export interface ScannerConfig {
    fps: number
    qrbox?: { width: number; height: number } | undefined
    aspectRatio: number
    formatsToSupport?: Array<number>
    disableFlip?: boolean
}