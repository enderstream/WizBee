// src/pages/SignUp/index.tsx
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { selectUser, useUserStore } from '@/store/userStore'
import { ROUTES } from '@/routes/routes'
import { userAPI } from '@/api/userAPI'
import SignUpForm from '@/pages/SignUp/components/SignUpForm'
import '@/styles/SignUp.css'

const SignUp: React.FC = () => {
  const navigate = useNavigate()
  const updateUser = useUserStore((state) => state.updateUser)
  const user = useUserStore(selectUser)
  const [isLoading, setIsLoading] = useState(false)

  // 상태 관리 - DatePicker 사용을 위해 변경
  const [name, setName] = useState(user.name || '')
  const [birthDate, setBirthDate] = useState<Date | null>(null)

  // Date 객체를 YYYY-MM-DD 형식으로 변환
  const formatDateToString = (date: Date | null) => {
    if (!date) return ''

    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')

    return `${year}-${month}-${day}`
  }

  // 약관 동의 체크박스 핸들러

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // 생년월일 유효성 검사
      if (!birthDate) {
        alert('생년월일을 선택해주세요.')
        setIsLoading(false)
        return
      }

      const birthday = formatDateToString(birthDate)

      // 추가 정보 입력 API 호출
      await userAPI.signUp(name, birthday)

      // 스토어 업데이트
      updateUser({
        name,
        birthday,
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
      <SignUpForm
        name={name}
        birthDate={birthDate}
        setName={setName}
        setBirthDate={setBirthDate}
        handleSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </div>
  )
}

export default SignUp
