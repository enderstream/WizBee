import React, { useEffect, useState } from 'react'
import { useMachineRegister } from '@/hooks/useMachineRegister'
import { selectMachineId, useUserStore } from '@/stores/userStore'

const MachineRegisterModal: React.FC = () => {
  const {
    serialNumber,
    isRegistering,
    isSubmitting,
    error,
    success,
    closeModal,
    handleSerialNumberChange,
    handleSubmit,
  } = useMachineRegister()

  const machineId = useUserStore(selectMachineId)
  // 현재 화면에 표시할 기기 ID를 위한 로컬 상태
  const [displayMachineId, setDisplayMachineId] = useState(machineId)

  // 등록 성공 시 표시 기기 ID 업데이트
  useEffect(() => {
    if (success && serialNumber) {
      setDisplayMachineId(serialNumber)
    }
  }, [success, serialNumber])

  // machineId가 변경될 때 displayMachineId 초기화
  useEffect(() => {
    setDisplayMachineId(machineId)
  }, [machineId])

  if (!isRegistering) return null

  return (
    <div className="fixed inset-0 backdrop-blur-[2px] bg-black/20 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl w-[90%] max-w-md shadow-xl overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold">
            현재 등록된 기기: {displayMachineId === "000" ? "등록된 기기가 없습니다" : `${displayMachineId}번 기기`}
          </h3>
          <button
            className="text-2xl text-gray-500 active:text-gray-800 transition-colors"
            onClick={closeModal}
            disabled={isSubmitting}
            aria-label="닫기"
          >
            &times;
          </button>
        </div>

        <div className="p-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="tel"
                id="serialNumber"
                value={serialNumber}
                onChange={handleSerialNumberChange}
                placeholder="2자리 숫자를 입력해주세요"
                pattern="[0-9]*"
                inputMode="numeric"
                maxLength={2}
                disabled={isSubmitting || success}
                className="w-full p-3 border border-gray-300 rounded-md text-base focus:outline-none focus:border-blue-500"
              />
            </div>

            {error && <div className="text-red-500 text-sm">{error}</div>}

            {success && (
              <div className="text-green-500 text-sm">
                기기 등록이 완료되었습니다. 확인 후 창을 닫아주세요.
              </div>
            )}

            <div className="flex justify-end space-x-3 mt-5">
              <button
                type="button"
                className="px-4 py-2 bg-gray-100 active:bg-gray-200 rounded-md font-medium transition-colors"
                onClick={closeModal}
                disabled={isSubmitting}
              >
                취소
              </button>
              <button
                type="submit"
                className={`px-4 py-2 rounded-md font-medium text-white ${isSubmitting || success || !serialNumber.trim()
                  ? 'bg-blue-300 cursor-not-allowed'
                  : 'bg-blue-500 active:bg-blue-600 transition-colors'
                  }`}
                disabled={isSubmitting || success || !serialNumber.trim()}
              >
                {isSubmitting ? '등록 중...' : '등록하기'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default MachineRegisterModal