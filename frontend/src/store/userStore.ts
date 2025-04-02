import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { UserState, initialUserState } from '@/types/User'

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: initialUserState,
      setUser: (user) => set({ user }),
      updateUser: (userUpdate) => set((state) => ({
        user: { ...state.user, ...userUpdate }
      })),
      resetUser: () => set({ user: initialUserState }),
    }),
    {
      name: 'userPersist',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
)

// 편의를 위한 선택자 함수들
export const selectUser = (state: UserState) => state.user
export const selectIsLogin = (state: UserState) => state.user.isLogin
export const selectUserId = (state: UserState) => state.user.id
export const selectProfileImageUrl = (state: UserState) => state.user.imageUrl
export const selectEmail = (state: UserState) => state.user.email
export const selectName = (state: UserState) => state.user.name
export const selectBirthday = (state: UserState) => state.user.birthday
export const selectHasCompletedSignup = (state: UserState) => state.user.hasCompletedSignup
export const selectUserRole = (state: UserState) => state.user.role