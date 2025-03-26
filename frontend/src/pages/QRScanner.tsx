import React, { useState } from 'react'
import { userAPI } from '@/api/userAPI'

function QRScanner() {
  const apiTest = () => {
    console.log(userAPI.userInfo(2))
    // userAPI.login()
  }

  return (
    <div>
      <button type="button" onClick={apiTest}>
        딸깍
      </button>
    </div>
  )
}

export default QRScanner
