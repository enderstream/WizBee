// import React, { useEffect, useState } from 'react'
// import { userAPI } from '@/api/userAPI'
// import { useUserStore } from '@/store/userStore'
// import { useNavigate } from 'react-router-dom'
// import { ROUTES } from '@/routes/routes'
// import Carousel from '@/components/Carousel'
// import '@/styles/Welcome.css'

// const Welcome: React.FC = () => {
//   const [isLoading, setIsLoading] = useState<boolean>(false)
//   const navigate = useNavigate()
//   const setUser = useUserStore((state) => state.setUser)
//   const resetUser = useUserStore((state) => state.resetUser)

//   // 구글 로그인 리다이렉트
//   const handleGoogleLogin = (): void => {
//     userAPI.login.googleRedirect()
//   }

//   // OAuth 콜백 처리
//   useEffect(() => {
//     const handleOAuthCallback = async () => {
//       // URL에서 code 파라미터 추출
//       const urlParams = new URLSearchParams(window.location.search)
//       const code = urlParams.get('code')

//       if (!code) return

//       setIsLoading(true)
//       try {
//         // 코드를 백엔드로 전송하여 사용자 정보 획득
//         const userData = await userAPI.login.processCallback(code)

//         // 사용자 상태 업데이트
//         setUser({
//           isLogin: true,
//           token: userData.token,
//           userId: userData.userId,
//           profileImageUrl: userData.profileImageUrl,
//           email: userData.email,
//           nickname: userData.nickname || '',
//           birthday: userData.birthday || '',
//           hasCompletedSignup: userData.hasCompletedSignup,
//         })

//         // 회원가입 완료 여부에 따라 다른 페이지로 리다이렉트
//         if (userData.hasCompletedSignup) {
//           navigate(ROUTES.HOME)
//         } else {
//           navigate(ROUTES.SIGNUP)
//         }
//       } catch (error) {
//         console.error('OAuth 콜백 처리 오류:', error)
//         resetUser()
//         alert('로그인 처리 중 오류가 발생했습니다')
//       } finally {
//         setIsLoading(false)
//       }
//     }

//     handleOAuthCallback()
//   }, [navigate, setUser, resetUser])

//   return (
//     <div className="welcome-page">
//       <h1>공부 통계를 확인해보세요!</h1>
//       <Carousel />
//       <button
//         className="google-login-btn"
//         onClick={handleGoogleLogin}
//         disabled={isLoading}
//       >
//         <img
//           src="https://developers.google.com/identity/images/g-logo.png"
//           alt="Google logo"
//           className="google-icon"
//         />
//         {isLoading ? '로그인 중...' : 'Continue with Google'}
//       </button>
//     </div>
//   )
// }

// export default Welcome

// 테스트 모드
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUserStore } from '@/store/userStore'
import { ROUTES } from '@/routes/routes'
import Carousel from '@/components/Carousel'
import '@/styles/Welcome.css'

const Welcome: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const navigate = useNavigate()
  const setUser = useUserStore((state) => state.setUser)
  
  // 테스트용 - 이미 회원가입 완료 여부 토글
  const [isSignupCompleted, setIsSignupCompleted] = useState(false)

  // 테스트용 구글 로그인 (실제 리다이렉트 없이)
  const handleGoogleLogin = async (): Promise<void> => {
    setIsLoading(true)
    
    try {
      // 실제 API 호출 대신 더미 데이터로 로그인 시뮬레이션
      // userAPI.login.googleRedirect() 대신 직접 처리
      
      // 잠시 로딩 효과를 위한 딜레이
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 더미 사용자 데이터
      const dummyUserData = {
        token: "test_token_12345",
        userId: 1,
        profileImageUrl: "",
        email: "test@example.com",
        nickname: "",
        birthday: "",
        hasCompletedSignup: isSignupCompleted // 토글 상태에 따라 결정
      };
      
      // 사용자 상태 업데이트
      setUser({
        isLogin: true,
        token: dummyUserData.token,
        userId: dummyUserData.userId,
        profileImageUrl: dummyUserData.profileImageUrl,
        email: dummyUserData.email,
        nickname: dummyUserData.nickname,
        birthday: dummyUserData.birthday,
        hasCompletedSignup: dummyUserData.hasCompletedSignup,
      });
      
      // 회원가입 완료 여부에 따라 리다이렉트
      if (dummyUserData.hasCompletedSignup) {
        navigate(ROUTES.HOME);
      } else {
        navigate(ROUTES.SIGNUP);
      }
      
    } catch (error) {
      console.error('테스트 로그인 오류:', error);
      alert('테스트 로그인 중 오류 발생');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="welcome-page">
      <h1>공부 통계를 확인해보세요!</h1>
      <Carousel />
      
      {/* 테스트용 회원가입 완료 상태 토글 */}
      <div style={{ marginBottom: '20px', textAlign: 'center' }}>
        <label>
          <input 
            type="checkbox" 
            checked={isSignupCompleted} 
            onChange={() => setIsSignupCompleted(!isSignupCompleted)}
          />
          {' '}테스트: 회원가입 완료 상태 ({isSignupCompleted ? '홈 화면으로' : '회원가입으로'})
        </label>
      </div>
      
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
      
      <div style={{ marginTop: '20px', textAlign: 'center', color: '#666', fontSize: '0.8rem' }}>
        테스트 모드: 실제 구글 로그인 대신 로컬 테스트
      </div>
    </div>
  )
}

export default Welcome