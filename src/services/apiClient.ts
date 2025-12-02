import axios, { AxiosInstance,AxiosResponse,AxiosError } from 'axios';

export const createApiClient = (): AxiosInstance => {
  const api = axios.create({
    baseURL: 'http://127.0.0.1:7500/api',
    timeout: 10000,
  });

  // 请求拦截器
  api.interceptors.request.use(
      (config) => {
          const token = localStorage.getItem('auth_token'); // '000000'
          if (token) {
              config.headers.token = `${token}`; 
          }
          return config;
      },
      (error: AxiosError) => {
          alert('请求发送失败，请稍后重试');
          return Promise.reject(error);
      }
  );
  
  // 响应拦截器
  api.interceptors.response.use(
      (response: AxiosResponse) => {
          return response;
      },
      (error) => {
          // const {response} = error;
          if (JSON.stringify(error).includes('Network Error')){
              alert('网络连接异常，请检查您的网络设置');
          }
          // 根据响应的错误状态码，做不同的处理，此处只是作为示例，请根据实际业务处理
          // if (response) {
          //     if (response === 400) {
                  
          //     } else if (response === 401) {
                  
          //     } else {
                  
          //     }
          // }
          
          return Promise.reject(error);
      }
  );

  return api;
};

// 导出默认的 api 实例
const api = createApiClient();
export default api;
