import { apiClient } from "@/api/apiClient"

export const statisticAPI = {
    // 오늘의 딴짓 통계 정보 조회
    todayDistractionData: async (userId: number) => {
        try {
            const response = await apiClient.get(`/api/v1/study/chart/today/${userId}`)
            return response.data
        } catch (error) {
            alert("정보 조회 실패")
            throw error
        }
    },

    // 또래 평균 통계 정보 조회
    peerAverage: async (userId: number) => {
        try {
            const response = await apiClient.get(`/api/v1/study/chart/avg/${userId}`)
            return response.data
        } catch (error) {
            alert("정보 조회 실패")
            throw error
        }
    },

    // 주간 순공시간 통계 정보 조회
    weeklyFocusedData: async (userId: number) => {
        try {
            const response = await apiClient.get(`/api/v1/study/chart/week/${userId}`)
            return response.data
        } catch (error) {
            alert("정보 조회 실패")
            throw error
        }
    },

    // 잔디밭 정보 조회
    thisYearBlueSward: async (year: number, userId: number) => {
        try {
            const response = await apiClient.get(`/api/v1/study/${year}/${userId}`)
            return response.data
        } catch (error) {
            alert("정보 조회 실패")
            throw error
        }
    },

    // 유저의 지표화된 통계 정보 조회
    userFormulatedData: async (userId: number) => {
        try {
            const response = await apiClient.get(`/api/v1/study/chart/${userId}`)
            return response.data
        } catch (error) {
            alert("정보 조회 실패")
            throw error
        }
    }
}