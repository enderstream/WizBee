import React from 'react'
import Carousel from '@/pages/Welcome/components/Carousel'
import GoogleLoginButton from '@/pages/Welcome/components/GoogleLoginButton'

const Welcome: React.FC = () => {
  return (
    <div className="welcome-page">
      <Carousel />
      <GoogleLoginButton />
    </div>
  )
}

export default Welcome
