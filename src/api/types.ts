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

export interface GetImagesResponseData {
  filename: string;
  path: string;
  size: number;
  uploadTime: number;
  url: string;
}

export interface DeleteImageResponse {
  path: string;
  success: boolean;
  error?: string;
}

export interface ConfigData {
  fileSize: number;
  maxUploadCount: number;
  token: string;
}

export interface HttpError extends Error {
  code?: number;
  status?: number;
  response?: {
    status: number;
    data: any;
  };
}
