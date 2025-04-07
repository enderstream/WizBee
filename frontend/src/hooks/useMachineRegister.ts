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
        const newValue = e.target.value
        
        // 숫자만 입력할 수 있도록 필터링
        if (newValue !== '' && !/^\d*$/.test(newValue)) {
            return // 숫자가 아닌 문자는 입력되지 않도록 함
        }
        
        setSerialNumber(newValue)
        
        // 입력값이 있을 때만 유효성 검사 수행 (실시간 피드백)
        if (newValue && !/^\d{2}$/.test(newValue)) {
            setError('시리얼 번호는 2자리 숫자여야 합니다.')
        } else {
            // 변경 시 이전 에러 메시지나 성공 상태 초기화
            setError(null)
            setSuccess(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!serialNumber.trim()) {
            setError('기기 일련번호를 입력해주세요.')
            return
        }

        // 제출 시 최종 유효성 검사
        if (!/^\d{2}$/.test(serialNumber)) {
            setError('시리얼 번호는 2자리 숫자여야 합니다.')
            return
        }

        try {
            setIsSubmitting(true)
            setError(null)
            console.log(userId)
            const response = await machineAPI.registerMachine(userId, serialNumber)
            console.log(response.status)
            console.log(response.data)


            if (response.status == 200) {
                setSuccess(true)
            } else {
                alert(response.data)
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