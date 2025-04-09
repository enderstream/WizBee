import { apiClient } from "@/api/apiClient"

export const statisticAPI = {
    // 메인 페이지 : 평균 공부 시간 정보 조회
    averageStudyTime: async (userId: number) => {
        try {
            const response = await apiClient.get(`/api/v1/study/chart/mainpage/${userId}`)
            return { data: response.data, status: response.status }
        } catch (error) {
            alert("평균 공부 시간 정보 조회 실패")
            throw error
        }
    },

    // 메인페이지: 집중력 통계정보 출력
    concentration: async (date: string, userId: number) => {
        try {
            const response = await apiClient.get(`/api/v1/study/chart/mainpage/${date}/${userId}`)
            return { data: response.data, status: response.status }
        } catch (error) {
            alert("집중력 통계 정보 조회 실패")
            throw error
        }
    },

    // 메인 페이지: 자세 점수
    poseScore: async (date: string, userId: number) => {
        try {
            const response = await apiClient.get(`/api/v1/pose/score/${date}/${userId}`)
            return { data: response.data, status: response.status }
        } catch (error) {
            alert("자세 점수 조회 실패")
            throw error
        }
    },

    // 통계 페이지: 오늘의 딴짓 통계 정보 조회
    todayDistractionData: async (date: string, userId: number) => {
        try {
            const response = await apiClient.get(`/api/v1/study/chart/today/${userId}?date=${date}`)
            return { data: response.data, status: response.status }
        } catch (error) {
            alert("오늘의 딴짓 통계 정보 조회 실패")
            throw error
        }
    },

    // 통계 페이지: 주간 순공시간 통계 정보 조회 
    weeklyFocusedData: async (date: string, userId: number) => {
        try {
            const response = await apiClient.get(`/api/v1/study/chart/week/${userId}?date=${date}`)
            return { data: response.data, status: response.status }
        } catch (error) {
            alert("주간 순공시간 통계 정보 조회 실패")
            throw error
        }
    },

    // 통계 페이지: 유저의 자세별 통계 정보 조회
    userFormulatedData: async (userId: number) => {
        try {
            const response = await apiClient.get(`/api/v1/study/chart/${userId}`)
            return { data: response.data, status: response.status }
        } catch (error) {
            alert("자세별 통계 정보 조회 실패")
            throw error
        }
    },

    // 통계 페이지: 잘못된 자세 이미지 모음
    wrongPoseImages: async (date: string, userId: number) => {
        try {
            const response = await apiClient.get(`/api/v1/pose/image/${date}/${userId}`)
            return { data: response.data, status: response.status }
        } catch (error) {
            alert("잘못된 자세 이미지 목록 조회 실패")
            throw error
        }
    },
}