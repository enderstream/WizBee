// // import React, { useEffect, useState } from 'react'
// // import { userAPI } from '@/api/userAPI'
// // import { useUserStore } from '@/store/userStore'
// // // import axios from 'axios'
// // import Carousel from '@/components/Carousel'
// // import '@/styles/Welcome.css'

// // // const baseURL = import.meta.env.VITE_API_URL

// // const Welcome: React.FC = () => {
// //   const [isLoading, setIsLoading] = useState<boolean>(false)
// //   const setUser = useUserStore((state) => state.setUser)

// //   // 구글 로그인 리다이렉트
// //   const handleGoogleLogin = (): void => {
// //     userAPI.login.googleRedirect()
// //   }

// //   // OAuth 콜백 처리 (수정된 로직)
// //   useEffect(() => {
// //     // 기존의 if 문 내부 로직을 주석 처리하고, 아래와 같이 수정합니다.
// //     if (window.location.pathname === '/signup') {
// //       const fetchUserData = async () => {
// //         try {
// //           setIsLoading(true)
          
// //           // 토큰 기반으로 userAPI를 호출하여 사용자 정보를 가져옵니다.
// //           const userInfoResponse = await userAPI.userInfo()
          
// //           // 테스트용: 인증 토큰을 콘솔에 출력합니다.
// //           console.log("인증 토큰:", userInfoResponse.token)
          
// //           // 사용자 상태 업데이트
// //           setUser({
// //             isLogin: true,
// //             token: userInfoResponse.token,
// //             userId: userInfoResponse.userId,  // 응답에 userId가 있다면 사용
// //             profileImageUrl: userInfoResponse.profileImageUrl,
// //             email: userInfoResponse.email,
// //             nickname: userInfoResponse.nickname || '',
// //             birthday: userInfoResponse.birthday || '',
// //             hasCompletedSignup: userInfoResponse.hasCompletedSignup,
// //           })
// //         } catch (error) {
// //           console.error("사용자 정보 조회 실패:", error)
// //         } finally {
// //           setIsLoading(false)
// //         }
// //       }
// //       fetchUserData()
// //     }
// //   }, [setUser])

// //   // OAuth 콜백 처리
// //   // useEffect(() => {
// //     // 페이지가 /signup인 경우 사용자 정보 가져오기
// //   //   if (window.location.pathname === '/signup') {
// //   //     const fetchUserData = async () => {
// //   //       try {
// //   //         setIsLoading(true)
          
// //   //         // 1. 현재 로그인된 사용자의 ID 조회
// //   //         const authResponse = await axios.get(`${baseURL}/api/v1/auth/searchUser`)
// //   //         const userId = authResponse.data.userId
          
// //   //         console.log("조회된 userId:", userId)
          
// //   //         // 2. 사용자 상세 정보 조회
// //   //         // userAPI.userInfo는 userId 파라미터 없이 호출됩니다.
// //   //         const userInfoResponse = await userAPI.userInfo()
          
// //   //         console.log("사용자 상세 정보:", userInfoResponse)
          
// //   //         // 3. 사용자 상태 업데이트
// //   //         setUser({
// //   //           isLogin: true,
// //   //           token: userInfoResponse.token,
// //   //           userId: userId,
// //   //           profileImageUrl: userInfoResponse.profileImageUrl,
// //   //           email: userInfoResponse.email,
// //   //           nickname: userInfoResponse.nickname || '',
// //   //           birthday: userInfoResponse.birthday || '',
// //   //           hasCompletedSignup: userInfoResponse.hasCompletedSignup,
// //   //         })
          
// //   //       } catch (error) {
// //   //         console.error("사용자 정보 조회 실패:", error)
// //   //       } finally {
// //   //         setIsLoading(false)
// //   //       }
// //   //     }
      
// //   //     fetchUserData()
// //   //   }
// //   // }, [setUser])

// //   return (
// //     <div className="welcome-page">
// //       <h1>공부 통계를 확인해보세요!</h1>
// //       <Carousel />
// //       <button
// //         className="google-login-btn"
// //         onClick={handleGoogleLogin}
// //         disabled={isLoading}
// //       >
// //         <img
// //           src="https://developers.google.com/identity/images/g-logo.png"
// //           alt="Google logo"
// //           className="google-icon"
// //         />
// //         {isLoading ? '로그인 중...' : 'Continue with Google'}
// //       </button>
// //     </div>
// //   )
// // }

// // export default Welcome


// import React, { useState } from 'react'
// import React, { useEffect, useState } from 'react'
// import { userAPI } from '@/api/userAPI'
// import { useUserStore } from '@/store/userStore'
// // import Carousel from '@/components/Carousel'
// import '@/styles/Welcome.css'

// // const baseURL = import.meta.env.VITE_API_URL

// const Welcome: React.FC = () => {
//   // const [isLoading] = useState<boolean>(false)
//   const [isLoading, setIsLoading] = useState<boolean>(false)
//   const setUser = useUserStore((state) => state.setUser)

//   // 구글 로그인 리다이렉트
//   const handleGoogleLogin = (): void => {
//     userAPI.login()
//   }

//   // 컴포넌트가 마운트될 때 항상 토큰을 콘솔에 출력하도록 수정
//   useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         setIsLoading(true)
//         console.log("good!@")
//         // userAPI.userInfo 호출하여 토큰 및 사용자 정보를 가져옵니다.
//         const userInfoResponse = await userAPI.userInfo()
        
//         // 콘솔에 인증 토큰 출력
//         // console.log("인증 토큰:", userInfoResponse.token)
        
//         // 사용자 상태 업데이트 (필요한 경우)
//         setUser({
//           isLogin: true,
//           token: userInfoResponse.token,
//           userId: userInfoResponse.userId, // 응답에 userId가 있다면 사용
//           profileImageUrl: userInfoResponse.profileImageUrl,
//           email: userInfoResponse.email,
//           nickname: userInfoResponse.nickname || '',
//           birthday: userInfoResponse.birthday || '',
//           hasCompletedSignup: userInfoResponse.hasCompletedSignup,
//         })
//       } catch (error) {
//         console.error("사용자 정보 조회 실패:", error)
//       } finally {
//         setIsLoading(false)
//       }
//     }
    
//     // 경로에 상관없이 항상 실행되도록 합니다.
//     fetchUserData()
//   }, )
//   }, [setUser]
// )

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



import React, { useEffect, useState } from 'react'
import { userAPI } from '@/api/userAPI'
import { useUserStore } from '@/store/userStore'
import Carousel from '@/components/Carousel'
import '@/styles/Welcome.css'

const Welcome: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const setUser = useUserStore((state) => state.setUser)

  // 구글 로그인 리다이렉트
  const handleGoogleLogin = (): void => {
    userAPI.login()
  }

  // OAuth 콜백 처리
  useEffect(() => {
    // 페이지가 /signup인 경우 사용자 정보 가져오기
    if (window.location.pathname === '/signup') {
      const fetchUserData = async () => {
        try {
          setIsLoading(true)
          
          // 토큰 기반으로 userAPI를 호출하여 사용자 정보를 가져옵니다.
          const userInfoResponse = await userAPI.userInfo()
          
          // 사용자 상태 업데이트
          setUser({
            isLogin: true,
            token: userInfoResponse.token,
            userId: userInfoResponse.userId,
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