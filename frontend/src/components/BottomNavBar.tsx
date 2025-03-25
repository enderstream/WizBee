import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import '@/styles/BottomNavBar.css'

const BottomNavBar: React.FC = () => {
  const { user } = useAuth()
  const location = useLocation()

  // 현재 경로에 따라 활성화된 아이콘 표시
  const isActive = (path: string) => {
    return location.pathname === path ? 'active' : ''
  }

  // 로그인하지 않은 상태면 하단바를 표시하지 않음
  if (!user) {
    return null
  }

  return (
    <div className="bottom-nav-bar">
      <Link to="/home" className={`nav-item ${isActive('/home')}`}>
        <div className="nav-icon home-icon"></div>
        <span>홈</span>
      </Link>

      <Link to="/time-lapse-list" className={`nav-item ${isActive('/time-lapse-list')}`}>
        <div className="nav-icon video-icon"></div>
        <span>타임랩스</span>
      </Link>

      <Link to="/blue-sward" className={`nav-item ${isActive('/blue-sward')}`}>
        <div className="nav-icon calendar-icon"></div>
        <span>잔디밭</span>
      </Link>

      <Link to="/settings" className={`nav-item ${isActive('/settings')}`}>
        <div className="nav-icon settings-icon"></div>
        <span>설정</span>
      </Link>
    </div>
  )
}

export default BottomNavBar
