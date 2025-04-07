import React from 'react'
import UpdateProfile from '@/pages/Settings/components/UpdateProfile'
import LogOut from '@/pages/Settings/components/LogOut'
import DeleteUser from '@/pages/Settings/components/DeleteUser'
import { useSettings } from '@/hooks/useSettings'
import PrivacyPolicy from '@/pages/Settings/components/PrivacyPolicy'
import Help from '@/pages/Settings/components/Help'
import AppVersion from '@/pages/Settings/components/AppVersion'

const Settings: React.FC = () => {
  const { statusMessage, setStatusMessage } = useSettings()

  return (
    <div className="flex flex-col w-full max-w-md mx-auto px-4 pb-4 h-full relative">
      {/* Status message */}
      {statusMessage && (
        <div className="fixed inset-0 backdrop-blur-[2px] bg-black/20 flex items-center justify-center z-50 px-4">
          <div className="bg-white w-full max-w-md rounded-xl shadow-xl overflow-hidden">
            {/* 모달 헤더 */}
            <div className="flex justify-between items-center p-4 border-b border-blue-500">
              <h3 className="text-lg font-semibold">알림</h3>
              <button
                className="text-2xl text-gray-500 hover:text-gray-800 transition-colors"
                onClick={() => setStatusMessage('')}
                aria-label="닫기"
              >
                &times;
              </button>
            </div>

            <div className="p-5">
              <p className="text-center text-gray-700 mb-5">{statusMessage}</p>

              <div className="flex justify-center">
                <button
                  onClick={() => setStatusMessage('')}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md font-medium transition-colors"
                >
                  확인
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 설정 헤더 */}
      <header className="pt-4 pb-3 mb-3 border-b border-blue-200">
        <div className="flex items-center">
          <div className="w-1 h-6 bg-blue-500 rounded-full mr-3"></div>
          <h1 className="text-xl font-bold text-gray-800">
            설정
          </h1>
        </div>
      </header>

      {/* 계정 섹션 */}
      <div className="mb-6">
        <div className="bg-white rounded-md overflow-hidden divide-y divide-gray-200">
          {/* 내 정보 수정 */}
          <UpdateProfile />
          
          {/* 로그아웃 */}
          <LogOut />
          
          {/* 회원 탈퇴 */}
          <DeleteUser />
        </div>
      </div>

      {/* 정보 및 지원 섹션 */}
      <div className="mb-6">
        <header className="pt-4 pb-3 mb-3 border-b border-blue-200">
          <div className="flex items-center">
            <div className="w-1 h-6 bg-blue-500 rounded-full mr-3"></div>
            <h1 className="text-xl font-bold text-gray-800">
              정보 및 지원
            </h1>
          </div>
        </header>
        
        <div className="bg-white rounded-md overflow-hidden divide-y divide-gray-200">
          {/* 개인정보 처리 방침 */}
          <PrivacyPolicy />
          
          {/* 도움말 */}
          <Help />
          
          {/* 앱 정보 */}
          <AppVersion />
        </div>
      </div>
    </div>
  )
}

export default Settings