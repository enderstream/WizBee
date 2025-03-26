import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { IUser, UserState } from '@/types/User'

const initialUserState: IUser = {
    isLogin: false,
    email: "",
    token: "",
    nickname: "",
    birthday: "",
    hasCompletedSignup: false,
}

export const useUserStore = create<UserState>()(
    persist(
        (set) => ({
            user: initialUserState,
            setUser: (user) => set({ user }),
            updateUser: (userUpdate) => set((state) => ({ user: { ...state.user, ...userUpdate } })),
            resetUser: () => set({ user: initialUserState }),
        })
        , {
            name: 'userPersist',
        }
    )
)

// 편의를 위한 선택자 함수들
export const selectUser = (state: UserState) => state.user
export const selectIsLogin = (state: UserState) => state.user.isLogin
export const selectToken = (state: UserState) => state.user.token
export const selectEmail = (state: UserState) => state.user.email
export const selectNickname = (state: UserState) => state.user.nickname
export const selectHasCompletedSignup = (state: UserState) => state.user.hasCompletedSignup