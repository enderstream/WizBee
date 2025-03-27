import React from 'react'
import { ScanResultProps } from '@/types/QRScanner'

const ScanResult: React.FC<ScanResultProps> = ({
  scanResult,
  isRegistering,
  registrationStatus,
  error,
  onStartScan,
  onGoHome,
}) => {
  if (isRegistering) {
    return (
      <div className="scan-result">
        <div className="registration-loading">
          <h3>기기 등록 중...</h3>
          <p>QR 코드 정보를 처리하고 있습니다.</p>
        </div>
      </div>
    )
  }

  if (registrationStatus === 'success') {
    return (
      <div className="scan-result">
        <div className="registration-success">
          <h3>등록 완료!</h3>
          <p>기기가 성공적으로 등록되었습니다.</p>
          <p className="result-text">
            <strong>기기 ID:</strong> {scanResult}
          </p>
          <p className="result-note">
            * 개발자 도구 콘솔(F12)에서도 확인 가능합니다.
          </p>
          <button className="home-button" onClick={onGoHome}>
            홈으로 이동
          </button>
        </div>
      </div>
    )
  }

  if (registrationStatus === 'error') {
    return (
      <div className="scan-result">
        <div className="registration-error">
          <h3>등록 실패</h3>
          <p>{error || '기기 등록에 실패했습니다.'}</p>
          <button className="retry-button" onClick={onStartScan}>
            다시 스캔하기
          </button>
        </div>
      </div>
    )
  }

  // 기본 스캔 완료 상태
  return (
    <div className="scan-result">
      <div className="scan-complete">
        <h3>스캔 완료!</h3>
        <p>QR 코드를 인식했습니다.</p>
        <p className="result-text">
          <strong>인식된 QR 코드:</strong> {scanResult}
        </p>
      </div>
    </div>
  )
}

export default ScanResult
