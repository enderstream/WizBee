import React from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'

const ProtectedRoute: React.FC = () => {
  const { user } = useAuth()
  const location = useLocation()

  if (!user) {
    // 로그인되지 않은 사용자는 welcome 페이지로 리디렉션
    return <Navigate to="/" state={{ from: location }} replace />
  }

  // 로그인된 사용자이지만 회원가입을 완료하지 않은 경우 signup 페이지로 리디렉션
  if (user && !user.hasCompletedSignup) {
    return <Navigate to="/signup" state={{ from: location }} replace />
  }

  // 인증된 사용자는 자식 라우트로 진행
  return <Outlet />
}

export default ProtectedRoute
