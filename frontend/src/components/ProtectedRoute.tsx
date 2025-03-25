import React from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useRecoilValue } from 'recoil'
import { userState } from '@/store/userState' // 경로를 확인해주세요

const ProtectedRoute: React.FC = () => {
  const user = useRecoilValue(userState)
  const location = useLocation()

  if (!user.isLogin) {
    // 로그인되지 않은 사용자는 welcome 페이지로 리디렉션
    return <Navigate to="/" state={{ from: location }} replace />
  }

  if (user.isLogin && !user.hasCompletedSignup) {
    return <Navigate to="/signup" state={{ from: location }} replace />
  }

  // 인증된 사용자는 자식 라우트로 진행
  return <Outlet />
}

export default ProtectedRoute