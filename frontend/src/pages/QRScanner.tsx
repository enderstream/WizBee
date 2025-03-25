import React, { useState } from 'react'
import { userAPI } from '@/api/userAPI'

function QRScanner() {
  const [source, setSource] = useState('')
  // const handleCapture = (target) => {
  //   if (target.files) {
  //     if (target.files.length !== 0) {
  //       const file = target.files[0]
  //       const newUrl = URL.createObjectURL(file)
  //       setSource(newUrl)
  //     }
  //   }
  // }

  const apiTest = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    console.log(userAPI.userInfo(1))
    // userAPI.login()
  }

  return (
    <div>
      {source && <img src={source} alt={'snap'} width="500" height="500"></img>}
      <button type="button" onClick={apiTest}>
        딸깍
      </button>
      {/* <input
        accept="image/*"
        id="icon-button-file"
        type="file"
        capture="environment"
        // onChange={(e) => handleCapture(e.target)}
      /> */}
    </div>
  )
}

export default QRScanner
