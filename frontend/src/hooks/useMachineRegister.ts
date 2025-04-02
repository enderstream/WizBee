import { useState } from 'react'
import {
    useMachineStore,
    selectSerialNumber,
    selectIsRegistering
} from '@/store/machineStore'
import { machineAPI } from '@/api/machineAPI'

import { selectUserId, useUserStore } from '@/store/userStore'

export const useMachineRegister = () => {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

    const userId = useUserStore(selectUserId)

    const serialNumber = useMachineStore(selectSerialNumber)
    const isRegistering = useMachineStore(selectIsRegistering)
    const setIsRegistering = useMachineStore((state) => state.setIsRegistering)
    const setSerialNumber = useMachineStore((state) => state.setSerialNumber)
    const resetMachineState = useMachineStore((state) => state.resetMachineState)

    const openModal = () => {
        setIsRegistering(true)
        setError(null)
        setSuccess(false)
    }

    const closeModal = () => {
        setIsRegistering(false)
        resetMachineState()
        setError(null)
        setSuccess(false)
    }

    const handleSerialNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSerialNumber(e.target.value)
        // 변경 시 이전 에러 메시지나 성공 상태 초기화
        setError(null)
        setSuccess(false)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!serialNumber.trim()) {
            setError('기기 일련번호를 입력해주세요.')
            return
        }

        try {
            setIsSubmitting(true)
            setError(null)

            const response = await machineAPI.registerMachine(userId, serialNumber)

            if (response.success) {
                setSuccess(true)
                // 성공 후 3초 뒤 모달 닫기
                setTimeout(() => {
                    closeModal()
                }, 3000)
            } else {
                setError(response.message || '기기 등록에 실패했습니다.')
            }
        } catch (err) {
            setError('서버와의 통신 중 오류가 발생했습니다.')
        } finally {
            setIsSubmitting(false)
        }
    }

    return {
        serialNumber,
        isRegistering,
        isSubmitting,
        error,
        success,
        openModal,
        closeModal,
        handleSerialNumberChange,
        handleSubmit
    }
}