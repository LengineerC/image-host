import axios from 'axios';

export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data?: T;
}

export interface UploadResponseData {
  filename: string;
  originName: string;
  mimeType: string;
  size: number;
  path: string;
  url: string;
  uploadTime: number;
}

export interface GetImagesResponseData{
  filename: string;
  path: string;
  size: number;
  uploadTime: number;
  url: string;
}

// 创建 axios 实例
const api = axios.create({
    baseURL: 'http://127.0.0.1:7500/api',
    timeout: 10000,
});

api.interceptors.request.use(
    (config) => {
        // const token = localStorage.getItem('auth_token');
        const token = '000000';
        if (token) {
            // 按需修改 Header 字段名和格式
            config.headers.token = `${token}`; 
        }
        return config;
    },
    (error) => Promise.reject(error)
);


export const imageApi = {
    upload: async(files:File[]): Promise<UploadResponseData[]> => {
        const formData = new FormData();
        files.forEach(file=> {
            formData.append('files', file);
        });

        const response = await api.post<ApiResponse<UploadResponseData[]>>('/upload',formData,{
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        
        return response.data.data ?? [];
    },

    getImages: async(): Promise<GetImagesResponseData[]>=> {
        const response = await api.get<ApiResponse<GetImagesResponseData[]>>('/images');
        return response.data.data ?? [];
    },

    deleteImages: async (paths: string[]): Promise<{ deleted: Array<{ path: string; success: boolean; error?: string }> }> => {
        const response = await api.delete<ApiResponse<{ deleted: Array<{ path: string; success: boolean; error?: string }> }>>('/images', {
        data: { paths },
        });
        return response.data.data ?? { deleted: [] };
    },
}

