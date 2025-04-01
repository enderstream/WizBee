import { create } from 'zustand'
import { userAPI } from '@/api/userAPI'
import { useUserStore } from '@/store/userStore'
import { useSettingsState } from '@/hooks/useSettingsState'

interface AccountManagementState {
    handleLogout: () => Promise<void>
    handleDeleteAccount: () => Promise<void>
}

export const useAccountManagement = create<AccountManagementState>(() => ({
    handleLogout: async () => {
        useSettingsState.setState({ isLoading: true })

        try {
            const userId = useUserStore.getState().user.userId
            await userAPI.logout(userId)

            // 로그아웃 성공 후 스토어 초기화
            useUserStore.getState().resetUser()
            useSettingsState.setState({
                showLogoutModal: false,
                statusMessage: '로그아웃 되었습니다.'
            })

            setTimeout(() => {
                useSettingsState.setState({ statusMessage: '' })
            }, 2000)
        } catch (error) {
            console.error('로그아웃 실패:', error)
            useSettingsState.setState({ statusMessage: '로그아웃에 실패했습니다.' })

            setTimeout(() => {
                useSettingsState.setState({ statusMessage: '' })
            }, 2000)
        } finally {
            useSettingsState.setState({ isLoading: false })
        }
    },

    handleDeleteAccount: async () => {
        useSettingsState.setState({ isLoading: true })

        try {
            const userId = useUserStore.getState().user.userId
            await userAPI.deleteUser(userId)

            // 회원 탈퇴 성공 후 스토어 초기화
            useUserStore.getState().resetUser()
            useSettingsState.setState({
                showDeleteModal: false,
                statusMessage: '회원 탈퇴가 완료되었습니다.'
            })

            setTimeout(() => {
                useSettingsState.setState({ statusMessage: '' })
            }, 2000)
        } catch (error) {
            console.error('회원 탈퇴 실패:', error)
            useSettingsState.setState({ statusMessage: '회원 탈퇴에 실패했습니다.' })

            setTimeout(() => {
                useSettingsState.setState({ statusMessage: '' })
            }, 2000)
        } finally {
            useSettingsState.setState({ isLoading: false })
        }
    }
}))