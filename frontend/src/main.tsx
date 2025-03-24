import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import router from './routes/routes'
import './index.css'

// DOM에 React 앱 마운트하기
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode> {/* 개발 모드에서 문제를 찾기 위한 엄격 모드 활성화 */}
    <RouterProvider router={router} /> {/* 정의된 라우터 구성을 앱에 제공 */}
  </React.StrictMode>
)