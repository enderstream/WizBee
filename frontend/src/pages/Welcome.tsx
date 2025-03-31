import React, { useEffect, useState } from 'react'
import { userAPI } from '@/api/userAPI'
import { useUserStore } from '@/store/userStore'
import axios from 'axios'
import Carousel from '@/components/Carousel'
import '@/styles/Welcome.css'

const baseURL = import.meta.env.VITE_API_URL

const Welcome: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const setUser = useUserStore((state) => state.setUser)

  // 구글 로그인 리다이렉트
  const handleGoogleLogin = (): void => {
    userAPI.login.googleRedirect()
  }

  // OAuth 콜백 처리
  useEffect(() => {
    // 페이지가 /signup인 경우 사용자 정보 가져오기
    if (window.location.pathname === '/signup') {
      const fetchUserData = async () => {
        try {
          setIsLoading(true)
          
          // 1. 현재 로그인된 사용자의 ID 조회
          const authResponse = await axios.get(`${baseURL}/api/v1/auth`)
          const userId = authResponse.data.userId
          
          console.log("조회된 userId:", userId)
          
          // 2. 사용자 상세 정보 조회
          // userAPI.userInfo는 userId 파라미터 없이 호출됩니다.
          const userInfoResponse = await userAPI.userInfo()
          
          console.log("사용자 상세 정보:", userInfoResponse)
          
          // 3. 사용자 상태 업데이트
          setUser({
            isLogin: true,
            token: userInfoResponse.token,
            userId: userId,
            profileImageUrl: userInfoResponse.profileImageUrl,
            email: userInfoResponse.email,
            nickname: userInfoResponse.nickname || '',
            birthday: userInfoResponse.birthday || '',
            hasCompletedSignup: userInfoResponse.hasCompletedSignup,
          })
          
        } catch (error) {
          console.error("사용자 정보 조회 실패:", error)
        } finally {
          setIsLoading(false)
        }
      }
      
      fetchUserData()
    }
  }, [setUser])

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
