// src/types/ProfileForm.ts
export interface ProfileFormProps {
    nickname: string;
    birthDate: Date | null;
    setNickname: (value: string) => void;
    setBirthDate: (date: Date | null) => void;
    isLoading?: boolean;
}