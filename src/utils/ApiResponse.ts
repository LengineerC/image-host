export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data?: T;
}

export const ok = <T>(
  data?: T,
  message: string = "success",
): ApiResponse<T> => ({
  code: 0,
  message,
  data,
});

export const fail = (message: string, code = 1): ApiResponse => ({
  code,
  message,
});
