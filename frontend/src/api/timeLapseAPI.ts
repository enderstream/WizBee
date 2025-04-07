import { apiClient } from "@/api/apiClient"

export const timeLapseAPI = {
    // 타임랩스 영상 목록 조회
    timeLapseList: async (userId: number) => {
        try {
            const response = await apiClient.get(`/api/v1/timelapse/${userId}`)
            return { data: response.data, status: response.status }
        } catch (error) {
            alert("타임랩스 목록 조회 실패")
            throw error
        }
    },

    // 타임랩스 촬영 시작 
    startRecordingTimeLapse: async (machineId: string) => {
        try {
            const response = await apiClient.post(`/api/v1/timelapse/${machineId}`)
            return { data: response.data, status: response.status }
        } catch (error) {
            alert("타임랩스 촬영 시작 실패")
            throw error
        }
    },

    // 타임랩스 촬영 종료
    finishRecordingTimeLapse: async (timelapseId: string, title: string) => {
        try {
            const response = await apiClient.put(`/api/v1/timelapse/finish/${timelapseId}`, { title })
            return { data: response.data, status: response.status }
        } catch (error) {
            alert("타임랩스 촬영 종료 실패")
            throw error
        }
    },

    // 타임랩스 제목 수정
    editTimeLapseTitle: async(timelapseId: string, title: string) => {
        try {
            const response = await apiClient.put(`/api/v1/timelapse/update-title/${timelapseId}`, { title })
            return { data: response.data, status: response.status }
        } catch (error) {
            alert("타임랩스 제목 수정 실패")
            throw error
        }
    },

    // 타임랩스 삭제
    deleteTimeLapse: async(timelapseId: string) => {
        try {
            const response = await apiClient.delete(`/api/v1/timelapse/${timelapseId}`)
            return { data: response.data, status: response.status }
        } catch (error) {
            alert("타임랩스 삭제 실패")
            throw error
        }
    }
}