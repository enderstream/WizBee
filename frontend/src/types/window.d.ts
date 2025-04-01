import { Html5Qrcode } from 'html5-qrcode'

// Window 인터페이스 확장
declare global {
    interface Window {
        qrScanner: Html5Qrcode | null
    }
}

export { }