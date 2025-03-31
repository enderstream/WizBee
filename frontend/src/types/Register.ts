// QR 스캐너 설정 타입
export interface ScannerConfig {
    fps: number
    qrbox: number | undefined
    aspectRatio: number
    disableFlip: boolean
}

// 등록 상태 타입
export type RegistrationStatusType = 'idle' | 'pending' | 'success' | 'error';

// 상태 인터페이스
export interface RegisterState {
    isRegistering: boolean;
    registrationStatus: RegistrationStatusType;
    scanResult: string;
    error: string;
    permissionGranted: boolean;
}

// 액션 인터페이스
export interface RegisterActions {
    setIsRegistering: (isRegistering: boolean) => void;
    setRegistrationStatus: (registrationStatus: RegistrationStatusType) => void;
    setScanResult: (scanResult: string) => void;
    setError: (error: string) => void;
    setPermissionGranted: (permissionGranted: boolean) => void;
    resetState: () => void;
    registerDevice: (machineId: string) => Promise<void>;
}