// types/User.ts
export interface IUser {
    id: number,
    name: string,
    email: string,
    birthday: string,
    role: string,
    machine: string,
    imageUrl: string,
    isLogin: boolean,
    hasCompletedSignup: boolean,
}

export interface UserState {
    user: IUser
    setUser: (user: IUser) => void
    updateUser: (userUpdate: Partial<IUser>) => void
    resetUser: () => void
}

export interface OAuthCallbackResponse {
    id: number
    name: string
    email: string
    birthday: string | null
    role: string
    machine: string | null
    imageUrl: string
}

// 초기 사용자 상태 정의
export const initialUserState: IUser = {
    id: 0,
    name: "미확인 사용자",
    email: "",
    birthday: "",
    role: "",
    machine: "000",
    imageUrl: "",
    isLogin: false,
    hasCompletedSignup: false,
}

// 백엔드로부터 유저 정보를 초기화하는 함수
export const initializeUserInfo = (response: OAuthCallbackResponse): IUser => {
    return {
        id: response.id,
        name: response.name,
        email: response.email,
        birthday: response.birthday || initialUserState.birthday,
        role: response.role,
        machine: response.machine || initialUserState.machine,
        imageUrl: response.imageUrl,
        isLogin: true,
        hasCompletedSignup: (Boolean(response.birthday) || response.role === 'USER') && response.role !== 'WITHDRAW_USER'
    }
}