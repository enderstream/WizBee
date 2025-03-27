import axios from 'axios'
import { useUserStore } from '@/store/userStore'

const baseURL = import.meta.env.VITE_API_URL

// axios 인스턴스 생성
const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 요청 인터셉터 추가
apiClient.interceptors.request.use(
  (config) => {
    const token = useUserStore.getState().user.token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 응답 인터셉터 추가
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      useUserStore.getState().resetUser()
      window.location.href = '/'
    }
    return Promise.reject(error)
  }
)

export { apiClient }