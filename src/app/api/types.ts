// API 오류 타입
export type ApiError = {
  message: string;
  code?: string;
};

// API 응답 타입 정의
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}
