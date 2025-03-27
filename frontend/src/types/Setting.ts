// Settings 페이지에서 사용하는 인터페이스 정의

// 기본 모달 Props
export interface BaseModalProps {
    onClose: () => void
    isLoading: boolean
}

// 로딩과 상태 메시지 관련 Props
export interface ModalWithLoadingProps extends BaseModalProps {
    setIsLoading: (loading: boolean) => void
    setStatusMessage: (message: string) => void
}

// 상태 메시지 컴포넌트 Props
export interface StatusMessageProps {
    message: string
    onClose: () => void
}

// 설정 버튼 컴포넌트 Props
export interface SettingsButtonsProps {
    onOpenProfileModal: () => void
    onOpenLogoutModal: () => void
    onOpenDeleteModal: () => void
    isLoading: boolean
}

// 프로필 모달 Props
export interface ProfileModalProps extends ModalWithLoadingProps { }

// 로그아웃 모달 Props
export interface LogoutModalProps extends ModalWithLoadingProps { }

// 회원 탈퇴 모달 Props
export interface DeleteAccountModalProps extends ModalWithLoadingProps { }

// DatePicker 커스텀 헤더 Props
export interface DatePickerHeaderProps {
    date: Date
    changeYear: (year: number) => void
    changeMonth: (month: number) => void
    decreaseMonth: () => void
    increaseMonth: () => void
    prevMonthButtonDisabled: boolean
    nextMonthButtonDisabled: boolean
}