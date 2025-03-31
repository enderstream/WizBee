import { apiClient } from "@/api/apiClient"
// import { OAuthCallbackResponse } from "@/types/User"
// import axios, {AxiosError} from "axios"

const baseURL = import.meta.env.VITE_API_URL

export const userAPI = {
    // 로그인
    login: {
        // 구글 로그인 리다이렉션
        googleRedirect: () => {
            window.location.href = `${baseURL}/oauth2/authorization/google`
        },
        // processCallback: async (code: string): Promise<OAuthCallbackResponse> => {
        //     try {
        //         console.log("processCallback 호출됨 - 코드:", code);
        //         // OAuth 코드를 토큰으로 교환하는 엔드포인트 
        //         const response = await axios.get<OAuthCallbackResponse>(
        //             `${baseURL}/api/v1/auth/oauth/code/google`,
        //             { params: { code } }
        //         )
        //         console.log("API 응답 데이터:", response.data);
        //         return response.data
        //     } catch (error: any) {
        //         const axiosError = error as AxiosError;
        //         console.error("OAuth 콜백 처리 자세한 오류:", axiosError);
        //         console.error("응답 데이터:", axiosError.response?.data);
        //         console.error("상태 코드:", axiosError.response?.status);
        //         alert(`OAuth 콜백 처리 오류: ${axiosError}`);
        //         throw error;
        //     }
        // }

        
    },

    // 로그아웃
    logout: async (userId: number) => {
        try {
            return await apiClient.post(`/api/v1/auth/logout/${userId}`)
        } catch (error) {
            alert("로그아웃 중 오류 발생")
            throw error
        }
    },

    // 회원 가입
    signUp: async (name: string, birthday: string) => {
        try {
            const response = await apiClient.post(`/api/v1/auth/signup`, { name, birthday })
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
    }

}
