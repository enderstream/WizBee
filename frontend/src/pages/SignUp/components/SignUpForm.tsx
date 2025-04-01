// src/pages/SignUp/components/SignUpForm.tsx
import React from 'react'
import ProfileForm from '@/components/ProfileForm'
import TermsAgreement from '@/pages/SignUp/components/TermsAgreement'

interface SignUpFormProps {
  nickname: string
  birthDate: Date | null
  agreeTerms: boolean
  setNickname: (value: string) => void
  setBirthDate: (date: Date | null) => void
  handleTermsChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleSubmit: (e: React.FormEvent) => Promise<void>
  isLoading: boolean
}

// 회원가입 폼 컴포넌트 - ProfileForm과 TermsAgreement를 조합
const SignUpForm: React.FC<SignUpFormProps> = ({
  nickname,
  birthDate,
  agreeTerms,
  setNickname,
  setBirthDate,
  handleTermsChange,
  handleSubmit,
  isLoading,
}) => {
  return (
    <form onSubmit={handleSubmit}>
      <ProfileForm
        nickname={nickname}
        birthDate={birthDate}
        setNickname={setNickname}
        setBirthDate={setBirthDate}
        isLoading={isLoading}
      />

      <TermsAgreement checked={agreeTerms} onChange={handleTermsChange} />

      <button type="submit" className="signup-button" disabled={isLoading}>
        {isLoading ? '처리 중...' : '가입 완료!'}
      </button>
    </form>
  )
}

export default SignUpForm
