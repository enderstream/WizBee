import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUserStore, selectUser } from '@/stores/userStore'
import { ROUTES } from '@/routes/routes'
import { userAPI } from '@/api/userAPI'
import { SignUpFormData } from '@/types/SignUp'

export const useSignUp = () => {
    const navigate = useNavigate()
    const updateUser = useUserStore((state) => state.updateUser)
    const user = useUserStore(selectUser)
    const [isLoading, setIsLoading] = useState(false)

    const [formData, setFormData] = useState<SignUpFormData>({
        name: user.name || '',
        year: '',
        month: '',
        day: '',
        agreeTerms: false,
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const birthday = `${formData.year}-${formData.month.padStart(2, '0')}-${formData.day.padStart(2, '0')}`

            // 추가 정보 입력 API 호출
            await userAPI.signUp(formData.name, birthday)

            // 스토어 업데이트
            updateUser({
                name: formData.name,
                birthday: birthday,
                hasCompletedSignup: true,
            })

            // 홈으로 이동
            navigate(ROUTES.HOME, { replace: true })
        } catch (error) {
            console.error('회원가입 오류:', error)
            alert('회원가입 중 오류가 발생했습니다')
        } finally {
            setIsLoading(false)
        }
    }

    return { formData, setFormData, isLoading, handleChange, handleSubmit }
}