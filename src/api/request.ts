import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { HttpError } from './types';

class Request {
  private instance: AxiosInstance;

  constructor() {
    this.instance = axios.create({
      baseURL: 'http://127.0.0.1:7500/api',
      timeout: 10000,
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // 请求拦截器
    this.instance.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('auth_token');
        if (token) {
          config.headers.token = `${token}`;
        }
        return config;
      },
      (error: AxiosError) => {
        console.error('请求配置错误:', error);
        alert('请求发送失败，请检查网络设置');
        return Promise.reject(this.normalizeError(error));
      }
    );

    // 响应拦截器
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      (error: AxiosError) => {
        return this.handleError(error);
      }
    );
  }

  private handleError(error: AxiosError): Promise<HttpError> {
    const httpError = this.normalizeError(error);

    // 根据状态码进行分类处理
    if (error.response) {
      const { status, data } = error.response;
      const message = (data as { message?: string })?.message;
      switch (status) {
        case 400:
          console.error('请求参数错误:', data);
          alert(`请求参数错误: ${message || '请检查输入内容'}`);
          break;

        case 401:
          console.error('未授权访问:', data);
          alert('登录已过期，请重新登录');
          localStorage.removeItem('auth_token');
          window.location.reload();
          break;

        case 403:
          console.error('禁止访问:', data);
          alert('您没有权限执行此操作');
          break;

        case 404:
          console.error('资源不存在:', data);
          alert('请求的资源不存在');
          break;

        case 500:
          console.error('服务器内部错误:', data);
          alert('服务器内部错误，请稍后重试');
          break;

        default:
          console.error(`请求失败 [${status}]:`, data);
          alert(`请求失败: ${message || '未知错误'}`);
      }
    } else if (error.request) {
      // 网络错误
      console.error('网络错误:', error.request);
      const isNetworkError = error.message.includes('Network Error') ||
                             error.message.includes('timeout') ||
                             !error.response;

      if (isNetworkError) {
        alert('网络连接异常，请检查您的网络设置');
      }
    } else {
      // 其他错误
      console.error('请求错误:', error.message);
      alert(`请求失败: ${error.message}`);
    }

    return Promise.reject(httpError);
  }

  private normalizeError(error: AxiosError): HttpError {
    const httpError: HttpError = new Error(error.message) as HttpError;

    if (error.response) {
      httpError.status = error.response.status;
      httpError.code = error.response.status;
      httpError.response = {
        status: error.response.status,
        data: error.response.data,
      };
    }

    return httpError;
  }

  // GET 请求
  public get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.get<T>(url, config).then(response => response.data);
  }

  // POST 请求
  public post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.post<T>(url, data, config).then(response => response.data);
  }

  // PUT 请求
  public put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.put<T>(url, data, config).then(response => response.data);
  }

  // PATCH 请求
  public patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.patch<T>(url, data, config).then(response => response.data);
  }

  // DELETE 请求
  public delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.delete<T>(url, config).then(response => response.data);
  }

  // 获取原始 axios 实例（用于特殊需求）
  public getInstance(): AxiosInstance {
    return this.instance;
  }
}

// 创建并导出单例
const request = new Request();
export default request;
