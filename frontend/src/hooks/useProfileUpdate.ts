import { create } from 'zustand'
import { userAPI } from '@/api/userAPI'
import { useUserStore } from '@/store/userStore'
import { useSettingsState } from '@/hooks/useSettingsState'

interface ProfileUpdateState {
    name: string
    birthDate: Date | null
    setName: (name: string) => void
    setBirthDate: (date: Date | null) => void
    handleOpenProfileModal: () => void
    handleSaveProfile: (e: React.FormEvent) => Promise<void>
}

export const useProfileUpdate = create<ProfileUpdateState>((set, get) => ({
    name: '',
    birthDate: null,

    setName: (name) => set({ name }),
    setBirthDate: (date) => set({ birthDate: date }),

    handleOpenProfileModal: () => {
        // 저장된 사용자 정보로 폼 초기화
        const storedName = useUserStore.getState().user.name
        const storedBirthday = useUserStore.getState().user.birthday

        // 생년월일 문자열을 Date 객체로 변환
        const parseBirthdayToDate = (birthdayStr: string) => {
            if (!birthdayStr || birthdayStr.length < 10) return null
            return new Date(birthdayStr)
        }

        set({
            name: storedName || '',
            birthDate: parseBirthdayToDate(storedBirthday)
        })

        useSettingsState.setState({ showProfileModal: true })
    },

    handleSaveProfile: async (e: React.FormEvent) => {
        e.preventDefault()

        useSettingsState.setState({
            isLoading: true,
            statusMessage: '프로필 정보 업데이트 중...'
        })

        try {
            const userId = useUserStore.getState().user.userId
            const { name, birthDate } = get()

            // Date 객체를 YYYY-MM-DD 형식으로 변환
            const formatDateToString = (date: Date | null) => {
                if (!date) return ''

                const year = date.getFullYear()
                const month = String(date.getMonth() + 1).padStart(2, '0')
                const day = String(date.getDate()).padStart(2, '0')

                return `${year}-${month}-${day}`
            }

            const birthday = formatDateToString(birthDate)

            // API 호출로 서버에 업데이트
            await userAPI.updateUser(name, birthday, userId)

            // 성공 시 Zustand 스토어 업데이트
            useUserStore.getState().updateUser({
                name,
                birthday,
            })

            useSettingsState.setState({
                statusMessage: '프로필이 성공적으로 업데이트되었습니다.',
                showProfileModal: false
            })

            setTimeout(() => {
                useSettingsState.setState({ statusMessage: '' })
            }, 2000)
        } catch (error) {
            console.error('프로필 업데이트 실패:', error)
            useSettingsState.setState({
                statusMessage: '프로필 업데이트에 실패했습니다. 다시 시도해주세요.'
            })

            setTimeout(() => {
                useSettingsState.setState({ statusMessage: '' })
            }, 2000)
        } finally {
            useSettingsState.setState({ isLoading: false })
        }
    }
}))