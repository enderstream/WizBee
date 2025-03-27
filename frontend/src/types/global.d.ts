import { Html5Qrcode } from 'html5-qrcode'

// 전역 Window 인터페이스 확장
declare global {
    interface Window {
        qrScanner: Html5Qrcode | null
    }
}