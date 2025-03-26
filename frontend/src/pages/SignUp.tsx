// import React, { useState } from 'react'
// import { useNavigation } from '@/hooks/useNavigation'
// import { useAuth } from '@/contexts/AuthContext'
// import '@/styles/SignUp.css'
// import { useNavigate } from 'react-router-dom'
// import axios from 'axios'
// import { useSetRecoilState } from 'recoil' // Recoil import 추가
// import { userState } from '@/store/userState' // userState import 추가

// const SignUp: React.FC = () => {
//   const { updateUser } = useAuth()
//   const { toHome } = useNavigation()
//   const navigate = useNavigate()
//   const setUserState = useSetRecoilState(userState) // Recoil 상태 설정 훅 추가

//   const [formData, setFormData] = useState({
//     nickname: '',
//     year: '',
//     month: '',
//     day: '',
//     agreeTerms: false,
//   })
  
//   const [error, setError] = useState('')
//   const [isLoading, setIsLoading] = useState(false)

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value, type, checked } = e.target
//     setFormData((prev) => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : value,
//     }))
//   }

//   const validateForm = () => {
//     if (!formData.nickname) {
//       setError('닉네임을 입력해주세요.')
//       return false
//     }
    
//     if (!formData.year || !formData.month || !formData.day) {
//       setError('생년월일을 입력해주세요.')
//       return false
//     }
    
//     // 생년월일 유효성 검사
//     const year = parseInt(formData.year)
//     const month = parseInt(formData.month)
//     const day = parseInt(formData.day)
    
//     if (isNaN(year) || isNaN(month) || isNaN(day)) {
//       setError('생년월일은 숫자만 입력해주세요.')
//       return false
//     }
    
//     if (year < 1900 || year > new Date().getFullYear()) {
//       setError('올바른 연도를 입력해주세요.')
//       return false
//     }
    
//     if (month < 1 || month > 12) {
//       setError('올바른 월을 입력해주세요(1-12).')
//       return false
//     }
    
//     if (day < 1 || day > 31) {
//       setError('올바른 일을 입력해주세요(1-31).')
//       return false
//     }
    
//     if (!formData.agreeTerms) {
//       setError('개인정보 처리방침에 동의해주세요.')
//       return false
//     }
    
//     return true
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setError('')
    
//     // 폼 유효성 검사
//     if (!validateForm()) {
//       return
//     }
    
//     setIsLoading(true)
    
//     try {
//       // 백엔드 API에 회원가입 데이터 전송
//       const birthday = `${formData.year}-${formData.month.padStart(2, '0')}-${formData.day.padStart(2, '0')}`
      
//       // CORS 문제 해결 전까지 API 호출 주석 처리 (원래 코드 유지)
//       // const response = await axios.post('/api/v1/users/signup', {
//       //   nickname: formData.nickname,
//       //   birthday: birthday,
//       //   agreeTerms: formData.agreeTerms
//       // })
      
//       // 개발 중이므로 API 호출 없이 사용자 상태 업데이트
//       // 1. AuthContext의 updateUser 함수 사용 (주석 처리 유지)
//       // updateUser({
//       //   name: formData.nickname,
//       //   hasCompletedSignup: true,
//       // })
      
//       // 2. Recoil 상태 업데이트 - isLogin을 true로 설정 (새로 추가)
//       setUserState(prevState => ({
//         ...prevState,
//         isLogin: true,
//         nickname: formData.nickname,
//         email: prevState.email || "default@example.com", // 기본값 제공
//         token: "mock-token-for-testing" // 테스트용 토큰
//       }))
//       console.log('회원가입 성공! (테스트 모드)')
      
//       // 홈페이지로 이동
//       // toHome()
//       navigate('/home')
//     } catch (error) {
//       console.error('회원가입 실패:', error)
//       setError('회원가입에 실패했습니다. 다시 시도해주세요.')
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   return (
//     <div className="signup-page">
//       <h1 className="signup-title">SIGN UP</h1>

//       {error && <div className="error-message">{error}</div>}

//       <form onSubmit={handleSubmit}>
//         <div className="form-group">
//           <label htmlFor="nickname">닉네임</label>
//           <div className="input-container">
//             <i className="user-icon"></i>
//             <input
//               type="text"
//               id="nickname"
//               name="nickname"
//               value={formData.nickname}
//               onChange={handleChange}
//               required
//             />
//           </div>
//         </div>

//         <div className="form-group">
//           <label>생년월일</label>
//           <div className="birthdate-container">
//             <input
//               type="text"
//               name="year"
//               placeholder="년"
//               value={formData.year}
//               onChange={handleChange}
//               required
//             />
//             <input
//               type="text"
//               name="month"
//               placeholder="월"
//               value={formData.month}
//               onChange={handleChange}
//               required
//             />
//             <input
//               type="text"
//               name="day"
//               placeholder="일"
//               value={formData.day}
//               onChange={handleChange}
//               required
//             />
//           </div>
//         </div>

//         <div className="form-group checkbox-group">
//           <input
//             type="checkbox"
//             id="agreeTerms"
//             name="agreeTerms"
//             checked={formData.agreeTerms}
//             onChange={handleChange}
//             required
//           />
//           <label htmlFor="agreeTerms">개인정보동의</label>
//         </div>

//         <button type="submit" className="signup-button" disabled={isLoading}>
//           {isLoading ? '처리 중...' : '가입 완료!'}
//         </button>
//       </form>
//     </div>
//   )
// }

// export default SignUp



import React, { useState } from 'react'
import { useNavigation } from '@/hooks/useNavigation'
import { useAuth } from '../contexts/AuthContext'
import '@/styles/SignUp.css'

const SignUp: React.FC = () => {
  const { updateUser } = useAuth()
  const { toHome } = useNavigation()

  const [formData, setFormData] = useState({
    nickname: '',
    email: '',
    year: '',
    month: '',
    day: '',
    agreeTerms: false,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Update user data
    updateUser({
      name: formData.nickname,
      hasCompletedSignup: true,
    })

    // Navigate to home page
    toHome()
  }

  return (
    <div className="signup-page">
      <h1 className="signup-title">SIGN UP</h1>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="nickname">닉네임</label>
          <div className="input-container">
            <i className="user-icon"></i>
            <input
              type="text"
              id="nickname"
              name="nickname"
              value={formData.nickname}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label>생년월일</label>
          <div className="birthdate-container">
            <input
              type="text"
              name="year"
              placeholder="년"
              value={formData.year}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="month"
              placeholder="월"
              value={formData.month}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="day"
              placeholder="일"
              value={formData.day}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-group checkbox-group">
          <input
            type="checkbox"
            id="agreeTerms"
            name="agreeTerms"
            checked={formData.agreeTerms}
            onChange={handleChange}
            required
          />
          <label htmlFor="agreeTerms">개인정보동의</label>
        </div>

        <button type="submit" className="signup-button">
          가입 완료!
        </button>
      </form>
    </div>
  )
}

export default SignUp
