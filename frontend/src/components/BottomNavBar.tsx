import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ROUTES } from '@/routes/routes'
import AccountIcon from '@/assets/icons/Account.svg?react'
import GraphIcon from '@/assets/icons/Graph.svg?react'
import HomeIcon from '@/assets/icons/Home.svg?react'
import TimeLapseIcon from '@/assets/icons/TimeLapse.svg?react'
import '@/styles/BottomNavBar.css'

interface NavItemProps {
  to: string
  label: string
  icon: React.ReactElement
  isActive: boolean
  isLast?: boolean
}

const NavItem: React.FC<NavItemProps> = ({ to, label, icon, isActive, isLast = false }) => (
  <Link
    to={to}
    className="flex flex-col items-center justify-center relative nav-link focus:outline-none"
  >
    <div className={`w-6 h-6 mb-1 ${isActive ? 'text-blue-500' : 'text-gray-500'}`}>
      {icon}
    </div>
    <span className={`text-xs ${isActive ? 'text-blue-500' : 'text-gray-500'}`}>{label}</span>
    {!isLast && <div className="absolute right-0 top-2 h-10 w-px bg-gray-200" />}
  </Link>
)

const BottomNavBar: React.FC = () => {
  const location = useLocation()

  // 현재 경로에 따라 활성화된 아이콘 표시
  const isActive = (path: string) => {
    return location.pathname === path
  }

  // 네비게이션 항목 정의
  const navItems = [
    {
      to: ROUTES.HOME,
      label: '홈',
      icon: <HomeIcon className="w-full h-full" />,
      isActive: isActive(ROUTES.HOME)
    },
    {
      to: ROUTES.TIME_LAPSE_LIST,
      label: '타임랩스',
      icon: <TimeLapseIcon className="w-full h-full" />,
      isActive: isActive(ROUTES.TIME_LAPSE_LIST)
    },
    {
      to: ROUTES.STATISTIC_INFO,
      label: '통계 지표',
      icon: <GraphIcon className="w-full h-full" />,
      isActive: isActive(ROUTES.STATISTIC_INFO)
    },
    {
      to: ROUTES.SETTINGS,
      label: '설정',
      icon: <AccountIcon className="w-full h-full" />,
      isActive: isActive(ROUTES.SETTINGS)
    }
  ]

  // 활성화된 인덱스 계산
  const activeIndex = navItems.findIndex(item => item.isActive);

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white shadow-md z-50 border-t border-gray-200">
      {/* 메인 네비게이션 영역 */}
      <div className="grid grid-cols-4 h-14 relative">
        {/* 애니메이션이 있는 인디케이터 바 */}
        <div
          className="absolute bottom-0 h-1 bg-blue-500 transition-all duration-150 ease-in-out"
          style={{
            width: '25%',
            left: `${activeIndex * 25}%`,
            transform: 'translateZ(0)' // 하드웨어 가속 활성화
          }}
        />

        {navItems.map((item, index) => (
          <NavItem
            key={item.to}
            to={item.to}
            label={item.label}
            icon={item.icon}
            isActive={item.isActive}
            isLast={index === navItems.length - 1}
          />
        ))}
      </div>

      {/* iOS의 safe area 대응 */}
      <div className="h-safe-area w-full bg-white"></div>
    </div>
  )
}

export default BottomNavBar