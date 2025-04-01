import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'
import { useUserStore } from '@/store/userStore'

const baseURL = import.meta.env.VITE_API_URL

// 쿠키에서 값을 가져오는 함수
function getCookie(name: string): string | undefined {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift();
  return undefined;
}

// axios 인스턴스 생성
const apiClient: AxiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
    'X-XSRF-TOKEN': getCookie('XSRF-TOKEN') || ''
  },
  withCredentials: true,
})

// 요청 인터셉터 추가
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => { 
    // 매 요청마다 최신 CSRF 토큰 가져오기
    const token = getCookie('XSRF-TOKEN');
    if (token && config.headers) {
      config.headers['X-XSRF-TOKEN'] = token;
    }
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
    if (error.response && error.response.status === 401) {
      useUserStore.getState().resetUser()
      window.location.href = '/'
    }
    return Promise.reject(error)
  }
)

export { apiClient }