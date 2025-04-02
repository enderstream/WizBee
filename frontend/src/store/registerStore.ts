import { create } from 'zustand'
import { RegisterState, RegisterActions, RegistrationStatusType } from '@/types/MachineRegister'
import { machineAPI } from '@/api/machineAPI'
import { useUserStore, selectUserId } from '@/store/userStore'

// RegisterState와 RegisterActions를 결합한 스토어 타입
type RegisterStore = RegisterState & RegisterActions

const useRegisterStore = create<RegisterStore>()((set) => ({
    // 초기 상태
    isRegistering: false,
    registrationStatus: 'idle' as RegistrationStatusType,
    scanResult: '',
    error: '',
    permissionGranted: false,

    // 액션
    setIsRegistering: (isRegistering: boolean) => set({ isRegistering }),
    setRegistrationStatus: (registrationStatus: RegistrationStatusType) => set({ registrationStatus }),
    setScanResult: (scanResult: string) => set({ scanResult }),
    setError: (error: string) => set({ error }),
    setPermissionGranted: (permissionGranted: boolean) => set({ permissionGranted }),

    resetState: () => set({
        isRegistering: false,
        registrationStatus: 'idle',
        scanResult: '',
        error: ''
    }),

    // 기기 등록 비즈니스 로직
    registerDevice: async (machineId: string) => {
        set({ isRegistering: true })
        try {
            console.log('%c[QR 코드 처리 중]', 'background: #2196F3 color: white padding: 2px 6px border-radius: 2px font-weight: bold')
            console.table({
                '데이터': machineId,
                '스캔 시간': new Date().toLocaleTimeString(),
                '데이터 길이': machineId.length,
                '데이터 형식': machineId.startsWith('http') ? 'URL' : machineId.match(/^[0-9]+$/) ? '숫자' : '텍스트'
            })

            // 현재 로그인한 사용자의 userId 가져오기
            const userId = selectUserId(useUserStore.getState())

            // userId가 유효한지 확인
            if (!userId) {
                throw new Error('로그인이 필요합니다.')
            }

            // 실제 API 호출로 기기 등록 (QR 정보 전달)
            // machineId는 machineAPI로 전달되지만, 현재 테스트 구현에서는 사용되지 않음
            const result = await machineAPI.registerMachine(userId, machineId)
            console.log('기기 등록 결과:', result)

            set({ registrationStatus: 'success' })
        } catch (error) {
            console.error('기기 등록 오류:', error)

            // 오류 메시지 개선
            let errorMessage = '기기 등록 중 오류가 발생했습니다.'

            if (error instanceof Error) {
                // axios 오류 처리 개선
                const axiosError = error as any
                if (axiosError.response) {
                    // 서버 응답이 있는 경우 상태 코드에 따른 메시지
                    switch (axiosError.response.status) {
                        case 401:
                            errorMessage = '인증이 만료되었습니다. 다시 로그인해주세요.'
                            break
                        case 403:
                            errorMessage = '권한이 없습니다. 로그인 상태를 확인해주세요.'
                            break
                        case 404:
                            errorMessage = '등록 서비스를 찾을 수 없습니다.'
                            break
                        case 500:
                            errorMessage = '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
                            break
                        default:
                            // 서버에서 보낸 오류 메시지가 있으면 사용
                            errorMessage = axiosError.response.data.message || errorMessage
                    }
                } else if (axiosError.request) {
                    // 요청은 보냈지만 응답을 받지 못한 경우
                    errorMessage = '서버에 연결할 수 없습니다. 인터넷 연결을 확인해주세요.'
                } else {
                    // 요청 설정 중 문제 발생
                    errorMessage = error.message || errorMessage
                }
            }

            set({
                registrationStatus: 'error',
                error: errorMessage
            })
        } finally {
            set({ isRegistering: false })
        }
    }
}))

export default useRegisterStore