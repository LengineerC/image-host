import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { message } from 'antd'; // 1. 引入 message
import { HttpError } from './types';

// 定义一个固定的 Key，用于防止重复弹窗
const AUTH_ERROR_KEY = 'auth_error_key';
const NETWORK_ERROR_KEY = 'network_error_key';

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
        message.error('请求发送失败，请检查网络设置');
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

    if (error.response) {
      const { status, data } = error.response;
      const errorMsg = (data as { message?: string })?.message;

      switch (status) {
        case 400:
          message.error(`请求参数错误: ${errorMsg || '请检查输入内容'}`);
          break;

        case 401:
          // 使用 key 属性，多个并发 401 只会显示一个提示
          message.warning({
            content: 'Token无效或已过期，请检查Token设置',
            key: AUTH_ERROR_KEY, 
          });
          break;

        case 403:
          message.error('您没有权限执行此操作');
          break;

        case 404:
          message.error('请求的资源不存在');
          break;

        case 500:
          message.error('服务器内部错误，请稍后重试');
          break;

        default:
          message.error(`请求失败: ${errorMsg || '未知错误'}`);
      }
    } else if (error.request) {
      const isNetworkError = error.message.includes('Network Error') ||
                             error.message.includes('timeout') ||
                             !error.response;

      if (isNetworkError) {
        message.error({
          content: '网络连接异常，请检查您的网络设置',
          key: NETWORK_ERROR_KEY,
        });
      }
    } else {
      message.error(`请求失败: ${error.message}`);
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

  // ... 剩下的 GET/POST/PUT/DELETE 方法保持不变
  public get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.get<T>(url, config).then(response => response.data);
  }

  public post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.post<T>(url, data, config).then(response => response.data);
  }

  public delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.delete<T>(url, config).then(response => response.data);
  }
}

const request = new Request();
export default request;