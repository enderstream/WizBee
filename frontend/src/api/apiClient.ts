import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'
import { useUserStore } from '@/stores/userStore'

const baseURL = import.meta.env.VITE_API_URL

// axios 인스턴스 생성
const apiClient: AxiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // 쿠키 자동 전송을 위해 필요
})

// 요청 인터셉터 추가
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    return config
  },
  (error: AxiosError): Promise<AxiosError> => {
    return Promise.reject(error)
  }
)

// 응답 인터셉터 추가
apiClient.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => response,
  (error: AxiosError): Promise<AxiosError> => {
    // 401 오류 발생 시 로그아웃 처리
    if (error.response && error.response.status === 401) {
      useUserStore.getState().resetUser()
      window.location.href = '/'
    }
    return Promise.reject(error)
  }
)

export { apiClient }