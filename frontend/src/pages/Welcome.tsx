import React, { useEffect, useState } from 'react'
import { userAPI } from '@/api/userAPI'
import {
  selectHasCompletedSignup,
  selectIsLogin,
  useUserStore,
} from '@/store/userStore'
import axios from 'axios'
import { useNavigation } from '@/hooks/useNavigation'
import Carousel from '@/components/Carousel'
import '@/styles/Welcome.css'

const Welcome: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false)
  const { toSignUp, toHome } = useNavigation()
  const isLogin = useUserStore(selectIsLogin)
  const hasCompletedSignup = useUserStore(selectHasCompletedSignup)
  const setUser = useUserStore((state) => state.setUser)
  const resetUser = useUserStore((state) => state.resetUser)

  // OAuth 콜백 처리
  useEffect(() => {
    const handleOAuthCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search)
      const code = urlParams.get('code')

      if (code) {
        setIsLoading(true)
        try {
          // 백엔드에서 구현한 OAuth 콜백 엔드포인트 호출
          const baseURL = import.meta.env.VITE_API_URL
          const response = await axios.get(
            `${baseURL}/api/v1/oauth2/callback/google`,
            {
              params: { code },
            },
          )

          const { token, email, nickname, hasCompletedSignup } = response.data

          // 유저 상태 업데이트
          setUser({
            isLogin: true,
            email,
            token,
            nickname: nickname || '',
            birthday: '',
            hasCompletedSignup,
          })

          // 회원가입 완료 여부에 따라 리디렉션
          hasCompletedSignup ? toHome() : toSignUp()
        } catch (error) {
          alert('OAuth 콜백 처리 중 오류 발생')
          resetUser() // 에러 시 유저 상태 초기화
        } finally {
          setIsLoading(false)
        }
      }
    }

    handleOAuthCallback()
  }, [toHome, toSignUp, setUser, resetUser])

  // 이미 로그인된 상태라면 적절한 페이지로 리디렉션
  useEffect(() => {
    // URL에 code 파라미터가 없고 이미 로그인된 상태라면
    const urlParams = new URLSearchParams(window.location.search)
    const code = urlParams.get('code')

    if (!code && isLogin) {
      hasCompletedSignup ? toHome() : toSignUp()
    }
  }, [isLogin, hasCompletedSignup, toHome, toSignUp])

  const handleGoogleLogin = () => {
    userAPI.login() // userAPI의 login 함수 호출
  }

  return (
    <div className="welcome-page">
      <h1>공부 통계를 확인해보세요!</h1>

      <Carousel />

      <button
        className="google-login-btn"
        onClick={handleGoogleLogin}
        disabled={isLoading}
      >
        <img
          src="https://developers.google.com/identity/images/g-logo.png"
          alt="Google logo"
          className="google-icon"
        />
        {isLoading ? '로그인 중...' : 'Continue with Google'}
      </button>
    </div>
  )
}

export default Welcome
