import request from './request';
import { ApiResponse, UploadResponseData, GetImagesResponseData, DeleteImageResponse, ConfigData } from './types';

export const imageApi = {
  // 上传图片
  upload: async (files: File[]): Promise<UploadResponseData[]> => {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });

    const response = await request.post<ApiResponse<UploadResponseData[]>>('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data ?? [];
  },

  // 获取图片列表
  getImages: async (): Promise<GetImagesResponseData[]> => {
    const response = await request.get<ApiResponse<GetImagesResponseData[]>>('/images');
    return response.data ?? [];
  },

  // 删除图片
  deleteImages: async (paths: string[]): Promise<{ deleted: DeleteImageResponse[] }> => {
    const response = await request.delete<ApiResponse<{ deleted: DeleteImageResponse[] }>>('/images', {
      data: { paths },
    });
    return response.data ?? { deleted: [] };
  },

  // 获取配置
  getConfig: async (): Promise<ConfigData> => {
    const response = await request.get<ApiResponse<ConfigData>>('/config');
    return response.data as ConfigData;
  },
};
