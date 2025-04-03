import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import '@/styles/BottomNavBar.css'
import { ROUTES } from '@/routes/routes'

const BottomNavBar: React.FC = () => {
  const location = useLocation()

  // 현재 경로에 따라 활성화된 아이콘 표시
  const isActive = (path: string) => {
    return location.pathname === path ? 'active' : ''
  }

  // 로그인하지 않은 상태면 하단바를 표시하지 않음
  return (
    <div className="bottom-nav-bar">
      <Link to={ROUTES.HOME} className={`nav-item ${isActive(ROUTES.HOME)}`}>
        <div className="nav-icon home-icon"></div>
        <span>홈</span>
      </Link>

      <Link
        to={ROUTES.TIME_LAPSE_LIST}
        className={`nav-item ${isActive(ROUTES.TIME_LAPSE_LIST)}`}
      >
        <div className="nav-icon video-icon"></div>
        <span>타임랩스 목록</span>
      </Link>

      <Link
        to={ROUTES.STATISTIC_INFO}
        className={`nav-item ${isActive(ROUTES.STATISTIC_INFO)}`}
      >
        <div className="nav-icon calendar-icon"></div>
        <span>통계 지표</span>
      </Link>

      <Link to={ROUTES.SETTINGS} className={`nav-item ${isActive(ROUTES.SETTINGS)}`}>
        <div className="nav-icon settings-icon"></div>
        <span>설정</span>
      </Link>
    </div>
  )
}

export default BottomNavBar
