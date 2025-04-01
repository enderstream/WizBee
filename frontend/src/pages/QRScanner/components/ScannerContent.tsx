import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@/routes/routes'
import { useQRScanner } from '@/hooks/useQRScanner'

const ScannerContent: React.FC = () => {
  const navigate = useNavigate()
  const {
    scanning,
    qrReaderRef,
    scanResult,
    isRegistering,
    registrationStatus,
    error,
    startScanner,
  } = useQRScanner()

  return (
    <div className="scanner-content">
      {scanning ? (
        <div
          id="qr-reader-element"
          ref={qrReaderRef}
          className="qr-reader-container"
        ></div>
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
              <p className="result-text">
                <strong>기기 ID:</strong> {scanResult}
              </p>
              <p className="result-note">
                * 개발자 도구 콘솔(F12)에서도 확인 가능합니다.
              </p>
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
              <button className="retry-button" onClick={startScanner}>
                다시 스캔하기
              </button>
            </div>
          ) : (
            <div className="scan-complete">
              <h3>스캔 완료!</h3>
              <p>QR 코드를 인식했습니다.</p>
              <p className="result-text">
                <strong>인식된 QR 코드:</strong> {scanResult}
              </p>
            </div>
          )}
        </div>
      ) : (
        <button className="scan-button" onClick={startScanner}>
          QR 스캔 시작
        </button>
      )}
    </div>
  )
}

export default ScannerContent
