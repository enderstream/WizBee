export interface IUser {
    isLogin: boolean,
    token: string,
    userId: number,
    profileImageUrl: string,
    email: string
    nickname: string,
    birthday: string,
    hasCompletedSignup: boolean,
}

export interface UserState {
    user: IUser
    setUser: (user: IUser) => void
    updateUser: (userUpdate: Partial<IUser>) => void
    resetUser: () => void
}