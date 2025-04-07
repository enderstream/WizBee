import React from 'react'
import { useSettings } from '@/hooks/useSettings'
import UserInfoIcon from '@/assets/icons/UserInfo.svg?react'
import ArrowRightIcon from '@/assets/icons/ArrowRight.svg?react'

const UpdateProfile: React.FC = () => {
  const {
    isLoading,
    showProfileModal,
    name,
    birthDate,
    setName,
    setBirthDate,
    handleOpenProfileModal,
    handleSaveProfile,
    setShowProfileModal,
  } = useSettings()

  return (
    <>
      <button
        className="flex items-center justify-between py-4 px-4 cursor-pointer w-full text-left disabled:opacity-70 disabled:cursor-not-allowed active:bg-gray-50"
        onClick={handleOpenProfileModal}
        disabled={isLoading}
      >
        <div className="flex items-center">
          <UserInfoIcon width={24} height={24} className="mr-3" />
          <span>내 정보 수정</span>
        </div>
        <ArrowRightIcon width={24} height={24} />
      </button>

      {/* 내 정보 수정 모달 */}
      {showProfileModal && (
        <div className="fixed inset-0 backdrop-blur-[2px] bg-black/20 flex items-center justify-center z-50 px-4">
          <div className="bg-white w-full max-w-md rounded-xl shadow-xl overflow-hidden">
            {/* 모달 헤더 */}
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold">내 정보 수정</h3>
              <button
                className="text-2xl text-gray-500 active:text-gray-800 transition-colors"
                onClick={() => setShowProfileModal(false)}
                disabled={isLoading}
                aria-label="닫기"
              >
                &times;
              </button>
            </div>

            <div className="p-5">
              <form onSubmit={handleSaveProfile}>
                <div className="mb-6">
                  <label className="block text-gray-700 font-medium mb-2">
                    닉네임
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
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
                    value={
                      birthDate ? birthDate.toISOString().substring(0, 10) : ''
                    }
                    onChange={(e) =>
                      setBirthDate(
                        e.target.value ? new Date(e.target.value) : null,
                      )
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 text-center"
                    disabled={isLoading}
                  />
                </div>

                <div className="flex justify-end space-x-3 mt-5">
                  <button
                    type="button"
                    className="px-4 py-2 bg-gray-100 active:bg-gray-200 rounded-md font-medium transition-colors"
                    onClick={() => setShowProfileModal(false)}
                    disabled={isLoading}
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    className={`px-4 py-2 rounded-md font-medium text-white ${isLoading
                      ? 'bg-blue-300 cursor-not-allowed'
                      : 'bg-blue-500 active:bg-blue-600 transition-colors'
                      }`}
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
