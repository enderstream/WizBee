import React from 'react'
import Carousel from '@/pages/Welcome/components/Carousel'
import GoogleLoginButton from '@/pages/Welcome/components/GoogleLoginButton'

const Welcome: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center h-screen p-5">
      <Carousel />
      <GoogleLoginButton />
    </div>
  )
}

export default Welcome