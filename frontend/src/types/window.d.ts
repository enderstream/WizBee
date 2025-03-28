import { Html5Qrcode } from 'html5-qrcode'

// Window 인터페이스 확장
declare global {
    interface Window {
        qrScanner: Html5Qrcode | null
    }
}

// 이 파일이 모듈로 인식되도록 export 추가
export { }