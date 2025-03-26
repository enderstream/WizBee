export interface IUser {
    isLogin: boolean,
    email: string
    token: string
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