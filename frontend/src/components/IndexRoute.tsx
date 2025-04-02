// IndexRoute.tsx (새로 생성)
import React from 'react'
import { Navigate } from 'react-router-dom'
import {
  useUserStore,
  selectIsLogin,
  selectHasCompletedSignup,
} from '@/store/userStore'
import Welcome from '@/pages/Welcome'
import { ROUTES } from '@/routes/routes'

const IndexRoute: React.FC = () => {
  const isLogin = useUserStore(selectIsLogin)
  const hasCompletedSignup = useUserStore(selectHasCompletedSignup)

  // 로그인 상태와 가입 완료 상태에 따라 리다이렉트
  if (isLogin && hasCompletedSignup) {
    return <Navigate to={ROUTES.HOME} replace />
  } else if (isLogin && !hasCompletedSignup) {
    return <Navigate to={ROUTES.SIGNUP} replace />
  }

  // 로그인하지 않은 사용자에게는 Welcome 페이지 표시
  return <Welcome />
}

export default IndexRoute
