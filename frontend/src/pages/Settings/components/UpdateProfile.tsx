// UpdateProfile.tsx
import React, { useState } from 'react'

interface UpdateProfileProps {
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  setStatusMessage: (message: string) => void;
}

const UpdateProfile: React.FC<UpdateProfileProps> = ({ isLoading, setIsLoading, setStatusMessage }) => {
  const [showModal, setShowModal] = useState(false)
  const [name, setName] = useState('')
  const [birthDate, setBirthDate] = useState('')

  // 모달 열기
  const handleOpenModal = () => {
    // 여기서 현재 유저 정보를 가져와서 상태를 설정할 수 있음
    // 예: API 호출 또는 스토어에서 로드
    setName('현재 사용자 이름') // 실제 구현에서는 현재 값을 가져오세요
    setBirthDate('2000-01-01') // 실제 구현에서는 현재 값을 가져오세요
    setShowModal(true)
  }

  // 정보 저장 처리
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      setIsLoading(true)
      // 여기에 정보 저장 로직 구현
      // 예: API 호출로 서버에 업데이트
      console.log('저장 중...', { name, birthDate })
      
      // 성공 시 모달 닫기
      setShowModal(false)
      
      // 상태 메시지 설정
      setStatusMessage('정보가 성공적으로 수정되었습니다.')
    } catch (error) {
      console.error('프로필 업데이트 오류:', error)
      // 오류 메시지 설정
      setStatusMessage('정보 수정 중 오류가 발생했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {/* 내 정보 수정 버튼 */}
      <button
        className="w-full py-4 px-4 bg-blue-100 hover:bg-blue-200 active:bg-blue-300 text-blue-800 rounded-xl font-medium transition-colors touch-manipulation disabled:opacity-70 disabled:cursor-not-allowed"
        onClick={handleOpenModal}
        disabled={isLoading}
      >
        내 정보 수정
      </button>

      {/* 내 정보 수정 모달 */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl">
            <div className="p-6">
              <h3 className="text-xl font-bold mb-6 text-center">내 정보 수정</h3>
              <form onSubmit={handleSaveProfile}>
                <div className="mb-6">
                  <label className="block text-gray-700 font-medium mb-2">
                    닉네임
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="닉네임을 입력해주세요"
                    disabled={isLoading}
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-gray-700 font-medium mb-2">
                    생년월일
                  </label>
                  <input
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
                    disabled={isLoading}
                  />
                </div>

                <div className="flex gap-3 mt-8">
                  <button
                    type="button"
                    className="flex-1 py-4 px-4 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-gray-800 rounded-xl font-medium transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                    onClick={() => setShowModal(false)}
                    disabled={isLoading}
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-4 px-4 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white rounded-xl font-medium transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                    disabled={isLoading}
                  >
                    {isLoading ? '저장 중...' : '저장'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default UpdateProfile