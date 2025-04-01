export interface IUser {
    isLogin: boolean,
    token: string,
    userId: number,
    profileImageUrl: string,
    email: string
    name: string,
    birthday: string,
    hasCompletedSignup: boolean,
}

export interface UserState {
    user: IUser
    setUser: (user: IUser) => void
    updateUser: (userUpdate: Partial<IUser>) => void
    resetUser: () => void
    hydrated: boolean
    setHydrated: (val: boolean) => void
}

export interface OAuthCallbackResponse {
    token: string
    userId: number
    profileImageUrl: string
    email: string
    name: string | null
    birthday: string | null
    hasCompletedSignup: boolean
}

export const mapApiUserResponseToUser = (response: any): IUser => {
    return {
      isLogin: true,
      token: response.token || '',
      userId: response.id || 0,
      profileImageUrl: response.imageUrl || '',
      email: response.email || '',
      name: response.name || '',
      birthday: response.birthday || '',
      hasCompletedSignup: !!response.birthday || response.role === 'USER',
    }
  }