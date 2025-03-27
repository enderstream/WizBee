export interface ScannerHeaderProps {
    onBack: () => void
}

export interface PermissionRequestProps {
    onRequestPermission: () => Promise<void>
}

export interface ScannerButtonProps {
    onStartScan: () => void
}

export interface ScanningGuideProps { }

export interface ErrorMessageProps {
    error: string
    onClear: () => void
}

export interface ScanResultProps {
    scanResult: string
    isRegistering: boolean
    registrationStatus: string
    error: string
    onStartScan: () => void
    onGoHome: () => void
}

export interface QRReaderProps {
    qrReaderRef: React.RefObject<HTMLDivElement | null>
}

export interface ScannerContentProps {
    scanning: boolean
    scanResult: string
    isRegistering: boolean
    registrationStatus: string
    error: string
    qrReaderRef: React.RefObject<HTMLDivElement | null>
    onStartScan: () => void
    onGoHome: () => void
}