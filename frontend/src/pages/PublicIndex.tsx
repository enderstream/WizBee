import React from 'react'
import { Navigate } from 'react-router-dom'
import {
  useUserStore,
  selectIsLogin,
  selectHasCompletedSignup,
} from '@/stores/userStore'
import Welcome from '@/pages/Welcome/index'
import { ROUTES } from '@/routes/routes'

const PublicIndex: React.FC = () => {
  const isLogin = useUserStore(selectIsLogin)
  const hasCompletedSignup = useUserStore(selectHasCompletedSignup)

  // 로그인되어 있고 가입이 완료된 사용자는 홈으로 리다이렉트
  if (isLogin && hasCompletedSignup) {
    return <Navigate to={ROUTES.HOME} replace />
  }

  // 로그인되어 있지만 가입이 완료되지 않은 사용자는 가입 페이지로
  if (isLogin && !hasCompletedSignup) {
    return <Navigate to={ROUTES.SIGNUP} replace />
  }

  // 로그인되지 않은 사용자에게는 Welcome 페이지 표시
  return <Welcome />
}

export default PublicIndex
