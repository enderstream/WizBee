import { apiClient } from "@/api/apiClient"

export const timeLapseAPI = {
    timeLapseList: async (userId: number) => {
        try {
            const response = await apiClient.get(`/api/v1/time-lapse/${userId}`)
            return response.data
        } catch (error) {
            alert("타임랩스 목록을 가져오기 실패")
            throw error
        }
    }
}