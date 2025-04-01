import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios'
import { useUserStore } from '@/store/userStore'

const baseURL = import.meta.env.VITE_API_URL

// axios 인스턴스 생성
const apiClient: AxiosInstance = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json', },
  withCredentials: true, // 쿠키 기반 인증에 필수
})

// 응답 인터셉터 추가
apiClient.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => response,
  (error: AxiosError): Promise<AxiosError> => {
    if (error.response && error.response.status === 401) {
      useUserStore.getState().resetUser()
      window.location.href = '/'
    }
    return Promise.reject(error)
  }
)

export { apiClient }