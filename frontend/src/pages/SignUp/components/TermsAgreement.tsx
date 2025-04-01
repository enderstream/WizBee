// src/pages/SignUp/components/TermsAgreement.tsx
import React from 'react'

interface TermsAgreementProps {
  checked: boolean
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

// 개인정보 동의 컴포넌트
const TermsAgreement: React.FC<TermsAgreementProps> = ({
  checked,
  onChange,
}) => {
  return (
    <div className="form-group checkbox-group">
      <input
        type="checkbox"
        id="agreeTerms"
        name="agreeTerms"
        checked={checked}
        onChange={onChange}
        required
      />
      <label htmlFor="agreeTerms">개인정보동의</label>
    </div>
  )
}

export default TermsAgreement
