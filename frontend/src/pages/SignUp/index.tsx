// src/pages/SignUp/index.tsx
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { selectUser, useUserStore } from '@/stores/userStore'
import { ROUTES } from '@/routes/routes'
import { userAPI } from '@/api/userAPI'
import NicknameForm from '@/pages/SignUp/components/NicknameForm'
import BirthdayForm from '@/pages/SignUp/components/BirthdayForm'

const SignUp: React.FC = () => {
  const navigate = useNavigate()
  const updateUser = useUserStore((state) => state.updateUser)
  const user = useUserStore(selectUser)
  const [isLoading, setIsLoading] = useState(false)

  // 상태 관리
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
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-300 p-8">
        <h1 className="text-4xl font-bold text-center text-blue-500 mb-8">SIGN UP</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 닉네임 입력 폼 */}
          <NicknameForm
            name={name}
            setName={setName}
            isLoading={isLoading}
          />

          {/* 생년월일 입력 폼 */}
          <BirthdayForm
            birthDate={birthDate}
            setBirthDate={setBirthDate}
            isLoading={isLoading}
          />

          {/* 가입하기 버튼 */}
          <button
            type="submit"
            className="w-full py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading || !name || !birthDate}
          >
            {isLoading ? "처리 중..." : "가입 완료!"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default SignUp