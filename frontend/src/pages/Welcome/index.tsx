import React from 'react'
import GoogleLoginButton from '@/pages/Welcome/components/GoogleLoginButton'

const Welcome: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center h-screen p-5">
      <GoogleLoginButton />
    </div>
  )
}

export default Welcome