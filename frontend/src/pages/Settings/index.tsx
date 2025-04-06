// Settings.tsx
import React, { useState } from 'react'
import UpdateProfile from '@/pages/Settings/components/UpdateProfile'
import LogOut from '@/pages/Settings/components/LogOut'
import DeleteUser from '@/pages/Settings/components/DeleteUser'

const Settings: React.FC = () => {
  const [statusMessage, setStatusMessage] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)

  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto p-5 h-full relative">
      {/* Status message */}
      {statusMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-white rounded-xl shadow-lg p-4 min-w-[300px] max-w-[90%] text-center animate-fade-in">
          <div className="mb-3">
            <p className="text-base font-medium mb-4">{statusMessage}</p>
            <button 
              onClick={() => setStatusMessage('')}
              className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg px-5 py-2 text-sm font-medium transition-colors"
            >
              확인
            </button>
          </div>
        </div>
      )}

      <h2 className="text-xl font-bold mb-8 text-center">설정</h2>
      
      <div className="flex flex-col w-full gap-4">
        {/* 내 정보 수정 섹션 */}
        <UpdateProfile 
          isLoading={isLoading} 
          setIsLoading={setIsLoading} 
          setStatusMessage={setStatusMessage} 
        />
        
        {/* 로그아웃 섹션 */}
        <LogOut 
          isLoading={isLoading} 
          setIsLoading={setIsLoading} 
          setStatusMessage={setStatusMessage} 
        />
        
        {/* 회원 탈퇴 섹션 */}
        <DeleteUser 
          isLoading={isLoading} 
          setIsLoading={setIsLoading} 
          setStatusMessage={setStatusMessage} 
        />
      </div>
    </div>
  )
}

export default Settings