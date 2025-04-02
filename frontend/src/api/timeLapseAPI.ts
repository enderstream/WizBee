import { apiClient } from "@/api/apiClient"

export const timeLapseAPI = {
    // 타임랩스 영상 목록 조회
    timeLapseList: async (userId: number) => {
        try {
            const response = await apiClient.get(`/api/v1/timelapse/${userId}`)
            return { data: response.data, status: response.status }
        } catch (error) {
            alert("타임랩스 목록 가져오기 실패")
            throw error
        }
    },

    // 타임랩스 촬영 시작 -> 얘 API 좀 고쳐야할 같은데?? 유저 아이디 있는게 낫지 않나? -> 없어도 되는걸로!
    startRecordingTimeLapse: async (machineId: number) => {
        try {
            const response = await apiClient.post(`/api/v1/timelapse/${machineId}`)
            return { data: response.data, status: response.status }
        } catch (error) {
            alert("타임랩스 촬영 시작 실패")
            throw error
        }
    },

    // 타임랩스 촬영 종료
    finishRecordingTimeLapse: async (timelapseId: number, title: string) => {
        try {
            const response = await apiClient.put(`/api/v1/timelapse/finish/${timelapseId}`, { title })
            return { data: response.data, status: response.status }
        } catch (error) {
            alert("타임랩스 촬영 종료 실패")
            throw error
        }
    },
}