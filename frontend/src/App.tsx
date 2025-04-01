import React from 'react'
import { Outlet } from 'react-router-dom'
import '@/App.css'
import { useUserStore } from '@/store/userStore'

const App: React.FC = () => {
  const hydrated = useUserStore((state) => state.hydrated)
  if (!hydrated) return <div>앱 초기화 중입니다...</div>
  return <Outlet />
}

export default App
