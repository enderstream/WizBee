import { apiClient } from "@/api/apiClient"

const baseURL = import.meta.env.VITE_API_URL

export const userAPI = {
    // 구글 로그인 리다이렉션
    login: () => {
        window.location.href = `${baseURL}/oauth2/authorization/google`
    },

    // 로그아웃
    logout: async () => {
        try {
            return await apiClient.post(`/api/v1/auth/logout`)
        } catch (error) {
            alert("로그아웃 중 오류 발생")
            throw error
        }
    },

    // 회원 가입
    signUp: async (name: string, birthday: string) => {
        try {
            const response = await apiClient.put(`/api/v1/auth/signup`, { name, birthday })
            return response.data
        } catch (error) {
            alert("회원가입 중 오류 발생")
            throw error
        }
    },

    // 회원 정보 조회
    userInfo: async () => {
        try {
            const response = await apiClient.get("/api/v1/auth/searchUser")
            return response.data
        } catch (error) {
            alert("유저 정보 조회 실패")
            throw error
        }
    },

    // 회원 정보 수정
    updateUser: async (name: string, birthday: string, userId: number) => {
        try {
            const response = await apiClient.put(`/api/v1/auth/${userId}`, { name, birthday })
            return response.data
        } catch (error) {
            alert("유저 정보 업데이트 실패")
            throw error
        }
    },

    // 회원 탈퇴
    deleteUser: async (userId: number) => {
        try {
            const response = await apiClient.put(`/api/v1/auth/withdraw/${userId}`)
            return response.data
        } catch (error) {
            alert("회원탈퇴 실패")
            throw error
        }
    },

    // 토큰 재발급 -> 이게 여기있어도 되나? 따로 파일을 만들어야하나?? -> 수동 토큰 재발급용
    refreshToken: async () => {
        try {
            // const response = 
            await apiClient.post("/api/v1/auth/reissue")
        } catch (error) {
            alert("토큰 재발급 실패")
            throw error
        }
    }
}
