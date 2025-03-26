import React, { useState } from 'react'
import { useNavigation } from '@/hooks/useNavigation'
import '@/styles/SignUp.css'

const SignUp: React.FC = () => {
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
