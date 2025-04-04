import React from 'react'
import '@/styles/MachineRegisterModal.css'
import { useMachineRegister } from '@/hooks/useMachineRegister'
import { selectMachineId, useUserStore } from '@/store/userStore'

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

  if (!isRegistering) return null

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h3>현재 등록된 기기: {machineId === "000" ? "등록된 기기가 없습니다":`${machineId}번 기기`}</h3>
          <button
            className="close-button"
            onClick={closeModal}
            disabled={isSubmitting}
          >
            &times;
          </button>
        </div>

        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="serialNumber">기기 일련번호</label>
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
              />
            </div>

            {error && <div className="error-message">{error}</div>}

            {success && (
              <div className="success-message">
                기기 등록이 완료되었습니다. 확인 후 창을 닫아주세요.
              </div>
            )}

            <div className="button-group">
              <button
                type="button"
                className="cancel-button"
                onClick={closeModal}
                disabled={isSubmitting}
              >
                취소
              </button>
              <button
                type="submit"
                className="submit-button"
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