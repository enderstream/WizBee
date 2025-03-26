import React from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useUserStore, selectIsLogin, selectHasCompletedSignup } from '@/store/userStore'

const ProtectedRoute: React.FC = () => {
  const isLogin = useUserStore(selectIsLogin)
  const hasCompletedSignup = useUserStore(selectHasCompletedSignup)
  const location = useLocation()

  // 로그인되지 않은 사용자는 welcome 페이지로 리디렉션
  if (!isLogin) {
    return <Navigate to="/" state={{ from: location }} replace />
  }

  // 로그인은 했는데 회원가입을 덜 했다면 회원가입 페이지로
  if (isLogin && !hasCompletedSignup) {
    return <Navigate to="/signup" state={{ from: location }} replace />
  }

  // 가입까지 완료했으면 Outlet으로
  return <Outlet />
}

export default ProtectedRoute