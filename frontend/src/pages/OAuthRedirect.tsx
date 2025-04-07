import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { userAPI } from '@/api/userAPI'
import { useUserStore } from '@/store/userStore'
import { OAuthCallbackResponse, initializeUserInfo } from '@/types/User'
import { ROUTES } from '@/routes/routes'

const OAuthRedirect: React.FC = () => {
  const navigate = useNavigate()
  const setUser = useUserStore((state) => state.setUser)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const handleOAuth = async (): Promise<void> => {
      try {
        console.log('OAuth 리다이렉트 페이지 진입')

        // HTTP‑only 쿠키가 자동 포함된 요청으로 사용자 정보 획득
        const response = await userAPI.userInfo()
        const userResponse: OAuthCallbackResponse = response.data
        console.log('유저 정보:', userResponse)

        // API 응답을 기반으로 사용자 상태 생성 (nullable 값은 기본값 처리)
        const user = initializeUserInfo(userResponse)

        // 상태 업데이트
        setUser(user)

        // 가입 완료 여부에 따라 최종 리다이렉션 결정
        if (user.hasCompletedSignup) {
          navigate(ROUTES.HOME, { replace: true })
        } else {
          navigate(ROUTES.SIGNUP, { replace: true })
        }
      } catch (error) {
        console.error('유저 정보 조회 실패:', error)
        // 에러 발생 시 웰컴 페이지로 이동
        navigate(ROUTES.ROOT, { replace: true })
      } finally {
        setLoading(false)
      }
    }

    handleOAuth()
  }, [navigate, setUser])

  if (loading) return <div>로그인 처리 중입니다...</div>
  return null
}

export default OAuthRedirect
