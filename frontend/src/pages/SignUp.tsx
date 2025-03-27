import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { selectUser, useUserStore } from '@/store/userStore'
import { ROUTES } from '@/routes/routes'
import '@/styles/SignUp.css'
import { userAPI } from '@/api/userAPI'

const SignUp: React.FC = () => {
  const navigate = useNavigate()
  const updateUser = useUserStore((state) => state.updateUser)
  const user = useUserStore(selectUser)
  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState({
    nickname: user.nickname || '',
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // 생년월일 유효성 검사
      const year = parseInt(formData.year)
      const month = parseInt(formData.month)
      const day = parseInt(formData.day)

      if (
        isNaN(year) ||
        year < 1900 ||
        year > 2100 ||
        isNaN(month) ||
        month < 1 ||
        month > 12 ||
        isNaN(day) ||
        day < 1 ||
        day > 31
      ) {
        alert('올바른 생년월일을 입력해주세요.')
        setIsLoading(false)
        return
      }
      
      const birthday = `${formData.year}-${formData.month.padStart(2, '0')}-${formData.day.padStart(2, '0')}`

      // 추가 정보 입력 API 호출
      await userAPI.signUp(formData.nickname, birthday)

      // 스토어 업데이트
      updateUser({
        nickname: formData.nickname,
        birthday: birthday,
        hasCompletedSignup: true,
      })

      // 홈으로 이동
      navigate(ROUTES.HOME)
    } catch (error) {
      console.error('회원가입 오류:', error)
      alert('회원가입 중 오류가 발생했습니다')
    } finally {
      setIsLoading(false)
    }
  }


  return (
    <div className="signup-page">
      <h1 className="signup-title">SIGN UP</h1>

      {user.email && (
        <div className="email-display">
          <p>이메일: {user.email}</p>
        </div>
      )}

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

        <button type="submit" className="signup-button" disabled={isLoading}>
          {isLoading ? '처리 중...' : '가입 완료!'}
        </button>
      </form>
    </div>
  )
}

export default SignUp
