import React, { useState } from 'react'

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
  return (
    <div>
      {source && <img src={source} alt={'snap'} width="500" height="500"></img>}

      <input
        accept="image/*"
        id="icon-button-file"
        type="file"
        capture="environment"
        // onChange={(e) => handleCapture(e.target)}
      />
    </div>
  )
}

export default QRScanner
