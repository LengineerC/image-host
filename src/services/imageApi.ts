import apiClient from './apiClient';
import { ApiResponse, UploadResponseData, GetImagesResponseData, DeleteImageResponse } from '../types/api';

export const imageApi = {
  upload: async (files: File[]): Promise<UploadResponseData[]> => {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });

    const response = await apiClient.post<ApiResponse<UploadResponseData[]>>('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data.data ?? [];
  },

  getImages: async (): Promise<GetImagesResponseData[]> => {
    const response = await apiClient.get<ApiResponse<GetImagesResponseData[]>>('/images');
    return response.data.data ?? [];
  },

  deleteImages: async (paths: string[]): Promise<{ deleted: DeleteImageResponse[] }> => {
    const response = await apiClient.delete<ApiResponse<{ deleted: DeleteImageResponse[] }>>('/images', {
      data: { paths },
    });
    return response.data.data ?? { deleted: [] };
  },
};
