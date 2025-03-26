import React from 'react'
import { Outlet } from 'react-router-dom' // React Router의 중첩 라우팅을 위한 컴포넌트
import { AuthProvider } from './contexts/AuthContext' // 인증 상태 관리를 위한 컨텍스트 프로바이더
import './App.css'

// App 컴포넌트 정의 (함수형 컴포넌트 타입 명시)
const App: React.FC = () => {
  return (
    <AuthProvider> {/* 전체 앱에 인증 상태를 제공하는 컨텍스트 프로바이더 */}
      <Outlet /> {/* 현재 활성화된 라우트의 컴포넌트가 이 위치에 렌더링됨 */}
    </AuthProvider>
  )
}

export default App // 컴포넌트 내보내기