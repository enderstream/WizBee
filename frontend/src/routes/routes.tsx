import { createBrowserRouter } from 'react-router-dom'
import App from '@/App'
import RootLayout from '@/components/RootLayout'
import ProtectedRoute from '@/components/ProtectedRoute'
import Home from '@/pages/Home'
import Welcome from '@/pages/Welcome'
import SignUp from '@/pages/SignUp'
import Settings from '@/pages/Settings'
import Record from '@/pages/Record'
import TimeLapseList from '@/pages/TimeLapseList'
import NotFound from '@/pages/NotFound'
import QRScanner from '@/pages/QRScanner'

// URL 상수 정의
export const ROUTES = {
  ROOT: '/',
  WELCOME: '/', // index route
  SIGNUP: '/signup',
  HOME: '/home',
  SETTINGS: '/settings',
  RECORD: '/record',
  TIME_LAPSE_LIST: '/time-lapse-list',
  BLUE_SWARD: '/blue-sward',
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
          {
            index: true,
            element: <Welcome />, // 비로그인 상태의 초기 페이지
          },
          {
            path: 'signup',
            element: <SignUp />,
          },

          // 보호된 경로 (Protected routes)
          {
            element: <ProtectedRoute />,
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
        ],
      },
    ],
  },
])

export default router
