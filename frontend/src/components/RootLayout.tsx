import React, { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import BottomNavBar from '@/components/BottomNavBar'
import LoadingScreen from '@/components/LoadingScreen'

const RootLayout: React.FC = () => {
  const [loading, setLoading] = useState(true)
  const location = useLocation()

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  // 로딩 상태 처리
  if (loading) {
    return <LoadingScreen />
  }

  // 특정 라우트에서는 BottomNavBar를 숨기는 로직
  const hideNavBarRoutes = ['/', '/welcome', '/signup', '/qr-scanner', '/time-lapse']
  const shouldShowNavBar = !hideNavBarRoutes.includes(location.pathname)

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