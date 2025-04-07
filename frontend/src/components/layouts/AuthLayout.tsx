// AuthLayout.tsx (인증 필요한 라우트용 레이아웃)
import React from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import {
  useUserStore,
  selectIsLogin,
  selectHasCompletedSignup,
} from '@/store/userStore'
import { ROUTES } from '@/routes/routes'

const AuthLayout: React.FC = () => {
  const isLogin = useUserStore(selectIsLogin)
  // const userRole = useUserStore(sele)
  const hasCompletedSignup = useUserStore(selectHasCompletedSignup)
  const location = useLocation()

  // 로그인되지 않은 사용자는 웰컴 페이지로 리다이렉션
  if (!isLogin) {
    return <Navigate to={ROUTES.WELCOME} state={{ from: location }} replace />
  }

  // 로그인은 했으나 회원가입이 완료되지 않았다면 회원가입 페이지로
  if (isLogin && !hasCompletedSignup) {
    return <Navigate to={ROUTES.SIGNUP} state={{ from: location }} replace />
  }

  // 가입 완료된 경우에만 하위 라우트를 렌더링
  return <Outlet />
}

export default AuthLayout
