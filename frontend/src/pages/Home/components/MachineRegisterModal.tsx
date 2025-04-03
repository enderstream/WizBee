import React from 'react'
import '@/styles/MachineRegisterModal.css'
import { useMachineRegister } from '@/hooks/useMachineRegister'

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

  if (!isRegistering) return null

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h3>기기 등록</h3>
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
                type="text"
                id="serialNumber"
                value={serialNumber}
                onChange={handleSerialNumberChange}
                placeholder="기기 일련번호를 입력해주세요"
                disabled={isSubmitting || success}
              />
            </div>

            {error && <div className="error-message">{error}</div>}

            {success && (
              <div className="success-message">
                기기 등록이 완료되었습니다. 잠시 후 창이 닫힙니다.
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
