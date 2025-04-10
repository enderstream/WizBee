// useSettings.ts
import { create } from 'zustand'
import { userAPI } from '@/api/userAPI'
import { useUserStore } from '@/stores/userStore'

// Settings 상태 및 프로필 업데이트/계정 관리 기능을 통합한 인터페이스
interface SettingsState {
  // 모달 상태
  showProfileModal: boolean
  showLogoutModal: boolean
  showDeleteModal: boolean
  isLoading: boolean
  statusMessage: string

  // 프로필 정보
  name: string
  birthDate: Date | null

  // 모달 상태 관리
  setShowProfileModal: (show: boolean) => void
  setShowLogoutModal: (show: boolean) => void
  setShowDeleteModal: (show: boolean) => void
  setIsLoading: (loading: boolean) => void
  setStatusMessage: (message: string) => void
  resetState: () => void

  // 프로필 업데이트 관련
  setName: (name: string) => void
  setBirthDate: (date: Date | null) => void
  handleOpenProfileModal: () => void
  handleSaveProfile: (e: React.FormEvent) => Promise<void>

  // 계정 관리 관련
  handleLogout: () => Promise<void>
  handleDeleteAccount: () => Promise<void>
}

const initialState = {
  // 모달 상태 초기값
  showProfileModal: false,
  showLogoutModal: false,
  showDeleteModal: false,
  isLoading: false,
  statusMessage: '',

  // 프로필 정보 초기값
  name: '',
  birthDate: null,
}

export const useSettings = create<SettingsState>((set, get) => ({
  // 초기 상태 적용
  ...initialState,

  // 모달 상태 관리 함수
  setShowProfileModal: (show) => set({ showProfileModal: show }),
  setShowLogoutModal: (show) => set({ showLogoutModal: show }),
  setShowDeleteModal: (show) => set({ showDeleteModal: show }),
  setIsLoading: (loading) => set({ isLoading: loading }),
  setStatusMessage: (message) => set({ statusMessage: message }),
  resetState: () => set(initialState),

  // 프로필 정보 업데이트 함수
  setName: (name) => set({ name }),
  setBirthDate: (date) => set({ birthDate: date }),

  // 프로필 모달 열기
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
      birthDate: parseBirthdayToDate(storedBirthday),
      showProfileModal: true
    })
  },

  // 프로필 저장
  handleSaveProfile: async (e: React.FormEvent) => {
    e.preventDefault()

    set({
      isLoading: true,
      statusMessage: '프로필 정보 업데이트 중...'
    })

    try {
      const userId = useUserStore.getState().user.id
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

      set({
        statusMessage: '프로필이 성공적으로 업데이트되었습니다.',
        showProfileModal: false
      })

      setTimeout(() => {
        set({ statusMessage: '' })
      }, 2000)
    } catch (error) {
      console.error('프로필 업데이트 실패:', error)
      set({
        statusMessage: '프로필 업데이트에 실패했습니다. 다시 시도해주세요.'
      })

      setTimeout(() => {
        set({ statusMessage: '' })
      }, 2000)
    } finally {
      set({ isLoading: false })
    }
  },

  // 로그아웃 처리
  handleLogout: async () => {
    set({ isLoading: true })

    try {
      await userAPI.logout()

      // 로컬스토리지 및 세션스토리지 초기화
      localStorage.clear()
      sessionStorage.clear()

      // 로그아웃 성공 후 스토어 초기화
      useUserStore.getState().resetUser()
      set({
        showLogoutModal: false,
        statusMessage: '로그아웃 되었습니다.'
      })

      // 홈 페이지로 리다이렉트
      window.location.href = '/'

      setTimeout(() => {
        set({ statusMessage: '' })
      }, 2000)
    } catch (error) {
      console.error('로그아웃 실패:', error)
      set({ statusMessage: '로그아웃에 실패했습니다.' })

      setTimeout(() => {
        set({ statusMessage: '' })
      }, 2000)
    } finally {
      set({ isLoading: false })
    }
  },

  // 회원 탈퇴 처리
  handleDeleteAccount: async () => {
    set({ isLoading: true })

    try {
      const userId = useUserStore.getState().user.id
      await userAPI.deleteUser(userId)

      // 로컬스토리지 및 세션스토리지 초기화
      localStorage.clear()
      sessionStorage.clear()

      // 회원 탈퇴 성공 후 스토어 초기화
      useUserStore.getState().resetUser()
      set({
        showDeleteModal: false,
        statusMessage: '회원 탈퇴가 완료되었습니다.'
      })

      // 홈 페이지로 리다이렉트
      window.location.href = '/'

      setTimeout(() => {
        set({ statusMessage: '' })
      }, 2000)
    } catch (error) {
      console.error('회원 탈퇴 실패:', error)
      set({ statusMessage: '회원 탈퇴에 실패했습니다.' })

      setTimeout(() => {
        set({ statusMessage: '' })
      }, 2000)
    } finally {
      set({ isLoading: false })
    }
  }
}))