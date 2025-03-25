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
import BlueSward from '@/pages/BlueSward'
import NotFound from '@/pages/NotFound'
import QRScanner from '@/pages/QRScanner'

const router = createBrowserRouter([
  {
    path: '/',
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
            // element: <ProtectedRoute />,
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
                path: 'blue-sward',
                element: <BlueSward />,
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
