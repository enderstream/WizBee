// import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'
// import { useUserStore } from '@/store/userStore'

// const baseURL = import.meta.env.VITE_API_URL

// // axios 인스턴스 생성
// const apiClient: AxiosInstance = axios.create({
//   baseURL,
//   headers: {
//     'Content-Type': 'application/json',
//   },
//   withCredentials: true,
// })

// // 요청 인터셉터 추가
// apiClient.interceptors.request.use(
//   (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
//     // 매 요청마다 최신 CSRF 토큰 가져오기
//     return config
//   },
//   (error: AxiosError): Promise<AxiosError> => {
//     return Promise.reject(error)
//   }
// )

// // 응답 인터셉터 추가
// apiClient.interceptors.response.use(
//   (response: AxiosResponse): AxiosResponse => response,
//   (error: AxiosError): Promise<AxiosError> => {
//     if (error.response && error.response.status === 401) {
//       useUserStore.getState().resetUser()
//       window.location.href = '/'
//     }
//     return Promise.reject(error)
//   }
// )

// export { apiClient }


import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'
import { useUserStore } from '@/store/userStore'

const baseURL = import.meta.env.VITE_API_URL

// 토큰 재발급 중인지 확인하는 플래그
let isRefreshing = false;
// 대기 중인 요청 배열
let failedQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (reason?: any) => void;
  config: any;
}> = [];

// 토큰 재발급 성공 후 대기 중인 요청 처리
const processQueue = (error: AxiosError | null) => {
  failedQueue.forEach(request => {
    if (error) {
      request.reject(error);
    } else {
      request.resolve(apiClient(request.config));
    }
  });
  
  failedQueue = [];
};

// axios 인스턴스 생성
const apiClient: AxiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // 쿠키 자동 전송을 위해 필요
});

// 요청 인터셉터 추가
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    return config;
  },
  (error: AxiosError): Promise<AxiosError> => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터 추가
apiClient.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => response,
  async (error: AxiosError): Promise<any> => {
    const originalConfig = error.config;
    
    // 요청 설정이 없는 경우 또는 재발급 요청인 경우 처리하지 않음
    if (!originalConfig || 
        !originalConfig.url || 
        originalConfig.url === '/api/v1/auth/reissue') {
      return Promise.reject(error);
    }
    
    // 401 오류 처리
    if (error.response?.status === 401) {
      // 이미 재시도한 요청인 경우 처리하지 않음
      if ((originalConfig as any)._retry) {
        return Promise.reject(error);
      }
      
      // 재시도 플래그 설정
      (originalConfig as any)._retry = true;
      
      if (!isRefreshing) {
        isRefreshing = true;
        
        try {
          // 토큰 재발급 요청
          await apiClient.post('/api/v1/auth/reissue');
          
          // 토큰 재발급 성공 - 대기 중인 요청들 처리
          isRefreshing = false;
          processQueue(null);
          
          // 원래 요청 재시도
          return apiClient(originalConfig);
        } catch (refreshError) {
          // 토큰 재발급 실패
          isRefreshing = false;
          processQueue(refreshError as AxiosError);
          
          // 로그아웃 처리
          useUserStore.getState().resetUser();
          window.location.href = '/';
          
          return Promise.reject(refreshError);
        }
      } else {
        // 이미 토큰 재발급 중인 경우, 대기열에 추가
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve,
            reject,
            config: originalConfig,
          });
        });
      }
    }
    
    // 다른 오류는 그대로 전달
    return Promise.reject(error);
  }
);

export { apiClient };