// src/types/ProfileForm.ts
export interface ProfileFormProps {
    name: string;
    birthDate: Date | null;
    setName: (value: string) => void;
    setBirthDate: (date: Date | null) => void;
    isLoading?: boolean;
}