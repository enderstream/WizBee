import { createBrowserRouter } from 'react-router-dom'
import App from '@/App'
import RootLayout from '@/components/layouts/RootLayout'
import AuthLayout from '@/components/layouts/AuthLayout'
import PublicLayout from '@/components/layouts/PublicLayout'
import PublicIndex from '@/pages/PublicIndex'
import Home from '@/pages/Home'
// import Welcome from '@/pages/Welcome'
import SignUp from '@/pages/SignUp'
import Settings from '@/pages/Settings'
import Record from '@/pages/Record'
import TimeLapseList from '@/pages/TimeLapseList'
import NotFound from '@/pages/NotFound'
import QRScanner from '@/pages/QRScanner'
import OAuthRedirect from '@/pages/OAuthRedirect'

// URL 상수 정의
export const ROUTES = {
  ROOT: '/',
  WELCOME: '/', // index route
  SIGNUP: '/signup',
  HOME: '/home',
  SETTINGS: '/settings',
  RECORD: '/record',
  TIME_LAPSE_LIST: '/time-lapse-list',
  QR_SCANNER: '/qr-scanner',
}

const router = createBrowserRouter([
  {
    path: ROUTES.ROOT,
    element: <App />,
    errorElement: <NotFound />,
    children: [
      {
        element: <RootLayout />,
        children: [
          // 인증 필요한 라우트
          {
            element: <AuthLayout />,
            children: [
              {
                path: 'home',
                element: <Home />,
              },
              {
                path: 'settings',
                element: <Settings />,
              },
              {
                path: 'record',
                element: <Record />,
              },
              {
                path: 'time-lapse-list',
                element: <TimeLapseList />,
              },
              {
                path: 'qr-scanner',
                element: <QRScanner />,
              },
            ],
          },
          // 인증 필요 없는 라우트
          {
            element: <PublicLayout />,
            children: [
              {
                index: true, // 루트 경로('/')
                element: <PublicIndex />,
              },
              {
                path: 'signup',
                element: <SignUp />,
              },
              {
                path: 'oauth-redirect',
                element: <OAuthRedirect />,
              },
              {
                path: 'login/oauth2/code/google',
                // element: <OAuthRedirect />,
              },
            ],
          },
        ],
      },
    ],
  },
])

export default router