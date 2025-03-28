import React from 'react'
import { PermissionRequestProps } from '@/types/QRScanner'

const PermissionRequest: React.FC<PermissionRequestProps> = ({
  onRequestPermission,
}) => {
  return (
    <div className="permission-request">
      <p>QR 코드를 스캔하려면 카메라 접근 권한이 필요합니다.</p>
      <button className="permission-button" onClick={onRequestPermission}>
        카메라 권한 허용
      </button>
    </div>
  )
}

export default PermissionRequest
