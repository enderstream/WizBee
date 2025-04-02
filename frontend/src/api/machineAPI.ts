import { apiClient } from "@/api/apiClient"

export const machineAPI = {
    // 임베디드 기기 등록
    registerMachine: async (userId: number, machineId: string) => {
        try {
            const response = await apiClient.put(`/api/v1/auth/machine/${userId}`,
                { machineId: machineId },
            )
            return response.data
        } catch (error) {
            alert("기기 등록 실패")
            throw error
        }
    }
} 