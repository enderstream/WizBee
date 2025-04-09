import { apiClient } from '@/api/apiClient'

export const machineAPI = {
  // 임베디드 기기 등록
  registerMachine: async (userId: number, machineId: string) => {
    try {
      const response = await apiClient.put(`/api/v1/auth/machine/${userId}?machineId=${machineId}`)
      return { data: response.data, status: response.status }
    } catch (error) {
      alert('기기 등록 실패')
      throw error
    }
  },

  // 라즈베리파이에 스트리밍 요청
  requestStream: async (machineId: string) => {
    try {
      const response = await apiClient.get(`/api/v1/timelapse/stream/${machineId}`)
      return { data: response.data, status: response.status }
    } catch (error) {
      alert('스트리밍 url 획득 실패')
      throw error
    }
  }
}
