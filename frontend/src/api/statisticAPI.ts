import { apiClient } from "@/api/apiClient"

export const statisticAPI = {
    // 오늘의 딴짓 통계 정보 조회
    todayDistractionData: async (userId: number) => {
        try {
            const response = await apiClient.get(`/api/v1/study/chart/today/${userId}`)
            return { data: response.data, status: response.status }
        } catch (error) {
            alert("정보 조회 실패")
            throw error
        }
    },

    // 주간 순공시간 통계 정보 조회
    weeklyFocusedData: async (userId: number) => {
        try {
            const response = await apiClient.get(`/api/v1/study/chart/week/${userId}`)
            return { data: response.data, status: response.status }
        } catch (error) {
            alert("정보 조회 실패")
            throw error
        }
    },

    // 유저의 지표화된 통계 정보 조회
    userFormulatedData: async (userId: number) => {
        try {
            const response = await apiClient.get(`/api/v1/study/chart/${userId}`)
            return { data: response.data, status: response.status }
        } catch (error) {
            alert("정보 조회 실패")
            throw error
        }
    },

    // 메인페이지 : 평균 공부 시간 정보 조회
    mainPageAvgStudy: async (userId: number) => {
        try {
            const response = await apiClient.get(`/api/v1/chart/mainpage/${userId}`)
            return { data: response.data, status: response.status }
        } catch (error) {
            alert("")
            throw error
        }
    },

    // 메인페이지: 집중력 통계정보 출력
    mainPageContentration: async (date: number, userId: number) => {
        try {
            const response = await apiClient.get(`/api/v1/study/chart/mainpage/${date}/${userId}`)
            return { data: response.data, status: response.status }
        } catch (error) {
            alert("")
            throw error
        }
    },

    // 자세 통계
    poseData: async (date: string, userId: number) => {
        try {
            const response = await apiClient.get(`/api/v1/pose/score/${date}/${userId}`)
            return { data: response.data, status: response.status }
        } catch (error) {
            alert("")
            throw error
        }
    },

    // 잘못된 자세 이미지 모음
    wrongPoseImages: async (date: string, userId: number) => {
        try {
            const response = await apiClient.get(`/api/v1/pose/image/${date}/${userId}`)
            return { data: response.data, status: response.status }
        } catch (error) {
            alert("")
            throw error
        }
    },
}