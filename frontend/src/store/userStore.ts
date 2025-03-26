import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { IUser, UserState } from '@/types/User'

const initialUserState: IUser = {
    isLogin: false,
    token: "",
    userId: 0,
    profileImageUrl: "",
    email: "",
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
export const selectUserId = (state: UserState) => state.user.userId
export const selectProfileImageUrl = (state: UserState) => state.user.profileImageUrl
export const selectEmail = (state: UserState) => state.user.email
export const selectNickname = (state: UserState) => state.user.nickname
export const selectBirthday = (state: UserState) => state.user.birthday
export const selectHasCompletedSignup = (state: UserState) => state.user.hasCompletedSignup