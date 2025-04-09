import React from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import BottomNavBar from '@/components/BottomNavBar'
import { ROUTES } from '@/routes/routes'

const RootLayout: React.FC = () => {
  const location = useLocation()

  // 특정 라우트에서는 BottomNavBar를 숨기는 로직
  const hideNavBarRoutes = [ROUTES.WELCOME, ROUTES.SIGNUP, ROUTES.RECORD]

  // 정확한 경로 매칭 대신 경로가 포함되는지 확인
  const shouldShowNavBar = !hideNavBarRoutes.some(
    (route) =>
      location.pathname === route || location.pathname.startsWith(`${route}/`),
  )

  return (
    <div className="app">
      {/* 페이지 콘텐츠 */}
      <Outlet />

      {/* 인증된 사용자와 특정 페이지에서만 하단 네비게이션 바 표시 */}
      {shouldShowNavBar && <BottomNavBar />}
    </div>
  )
}

export default RootLayout
