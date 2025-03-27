import { userAPI } from '@/api/userAPI'

function QRScanner() {
  const apiTest = () => {
    console.log(userAPI.userInfo(1))
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
