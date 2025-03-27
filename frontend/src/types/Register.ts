// QR 스캐너 설정 타입
export interface ScannerConfig {
    fps: number
    qrbox: number | undefined
    aspectRatio: number
    disableFlip: boolean
}
