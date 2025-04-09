import { createBrowserRouter } from 'react-router-dom'
import App from '@/App'
import RootLayout from '@/components/layouts/RootLayout'
import AuthLayout from '@/components/layouts/AuthLayout'
import PublicLayout from '@/components/layouts/PublicLayout'
import PublicIndex from '@/pages/PublicIndex'
import Home from '@/pages/Home'
import SignUp from '@/pages/SignUp'
import Settings from '@/pages/Settings'
import Record from '@/pages/Record'
import TimeLapseList from '@/pages/TimeLapseList'
import NotFound from '@/pages/NotFound'
import OAuthRedirect from '@/pages/OAuthRedirect'
import StatisticInfo from '@/pages/StatisticInfo'

// URL 상수 정의
export const ROUTES = {
  ROOT: '/',
  WELCOME: '/',
  SIGNUP: '/signup',
  HOME: '/home',
  SETTINGS: '/settings',
  RECORD: '/record',
  TIME_LAPSE_LIST: '/time-lapse-list',
  STATISTIC_INFO: '/statistic-info',
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
                path: ROUTES.STATISTIC_INFO,
                element: <StatisticInfo/>
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
              },
            ],
          },
        ],
      },
    ],
  },
])

export default router
