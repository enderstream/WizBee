import React from 'react'
import { Outlet } from 'react-router-dom'

const PublicLayout: React.FC = () => {
  // 필요한 경우 공통 UI 요소를 추가할 수 있음
  return <Outlet />
}

export default PublicLayout
