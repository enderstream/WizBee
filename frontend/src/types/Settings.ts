export interface ConfirmationModalProps {
    title: string
    message: string
    warningMessage?: string
    isDelete: boolean
}

// ProfileForm은 외부 컴포넌트이므로 여전히 props가 필요합니다.
export interface ProfileFormProps {
    nickname: string
    birthDate: Date | null
    setNickname: (nickname: string) => void
    setBirthDate: (date: Date | null) => void
    isLoading: boolean
}