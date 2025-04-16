import { ApiResponse } from "./types";

// API 기본 URL
const API_BASE_URL =
  (process.env.NEXT_PUBLIC_API_URL || "http://localhost:3030") + "/api";

/**
 * API 에러 타입
 */
export class ApiError extends Error {
  code: string;

  constructor(message: string, code: string = "API_ERROR") {
    super(message);
    this.code = code;
    this.name = "ApiError";
  }
}

/**
 * API 요청 옵션 타입
 */
export interface ApiRequestOptions {
  method?: string;
  headers?: Record<string, string>;
  body?: any;
  token?: string;
  skipNestedData?: boolean;
}

/**
 * 공통 API 요청 함수
 * NestJS 서버와 통신하는 모든 API 요청에 사용
 *
 * @param endpoint API 엔드포인트 URL (/ 로 시작)
 * @param options 요청 옵션 (메소드, 헤더, 바디, 토큰 등)
 * @returns 응답 데이터
 */
export async function apiRequest<T>(
  endpoint: string,
  options: ApiRequestOptions = {}
): Promise<ApiResponse<T>> {
  const {
    method = "GET",
    headers = {},
    body,
    token,
    // skipNestedData = false,
  } = options;

  // 기본 헤더 설정
  const requestHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...headers,
  };

  // 인증 토큰이 있는 경우 Authorization 헤더 추가
  if (token) {
    requestHeaders.Authorization = `Bearer ${token}`;
  }

  try {
    const url = `${API_BASE_URL}${endpoint}`;
    console.log(`[API Request] ${method} ${url}`);

    const response = await fetch(url, {
      method,
      headers: requestHeaders,
      body: body ? JSON.stringify(body) : undefined,
    });

    const responseData = await response.json();
    console.log(`[API Response] ${method} ${url}:`);

    // NestJS 응답 구조: { data: { success: true, data: {...} } }
    // 이중 중첩된 data 구조 처리
    // if (
    //   !skipNestedData &&
    //   responseData.data &&
    //   typeof responseData.data === "object" &&
    //   ("success" in responseData.data || "data" in responseData.data)
    // ) {
    //   return responseData.data as ApiResponse<T>;
    // }

    return responseData as ApiResponse<T>;
  } catch (error) {
    console.error(`[API Error] ${endpoint}:`, error);

    // 오류 응답 생성
    const errorMessage =
      error instanceof Error
        ? error.message
        : "알 수 없는 오류가 발생했습니다.";
    throw new ApiError(errorMessage);
  }
}

/**
 * GET 요청 전용 함수
 */
export async function apiGet<T>(
  endpoint: string,
  options: Omit<ApiRequestOptions, "method" | "body"> = {}
): Promise<ApiResponse<T>> {
  return apiRequest<T>(endpoint, { ...options, method: "GET" });
}

/**
 * POST 요청 전용 함수
 */
export async function apiPost<T>(
  endpoint: string,
  body: any,
  options: Omit<ApiRequestOptions, "method"> = {}
): Promise<ApiResponse<T>> {
  return apiRequest<T>(endpoint, { ...options, method: "POST", body });
}

/**
 * PUT 요청 전용 함수
 */
export async function apiPut<T>(
  endpoint: string,
  body: any,
  options: Omit<ApiRequestOptions, "method"> = {}
): Promise<ApiResponse<T>> {
  return apiRequest<T>(endpoint, { ...options, method: "PUT", body });
}

/**
 * DELETE 요청 전용 함수
 */
export async function apiDelete<T>(
  endpoint: string,
  options: Omit<ApiRequestOptions, "method"> = {}
): Promise<ApiResponse<T>> {
  return apiRequest<T>(endpoint, { ...options, method: "DELETE" });
}

/**
 * PATCH 요청 전용 함수
 */
export async function apiPatch<T>(
  endpoint: string,
  body: any,
  options: Omit<ApiRequestOptions, "method"> = {}
): Promise<ApiResponse<T>> {
  return apiRequest<T>(endpoint, { ...options, method: "PATCH", body });
}

/**
 * API 오류 발생 시 안전하게 처리하는 함수
 * 실패하더라도 애플리케이션을 중단하지 않고 기본값을 반환
 */
export async function safeApiRequest<T>(
  apiCall: () => Promise<ApiResponse<T>>,
  defaultData: T
): Promise<ApiResponse<T>> {
  try {
    return await apiCall();
  } catch (error) {
    console.error("[Safe API Error]", error);
    return {
      success: false,
      data: defaultData,
      error: {
        code: error instanceof ApiError ? error.code : "API_ERROR",
        message:
          error instanceof Error
            ? error.message
            : "알 수 없는 오류가 발생했습니다.",
      },
    };
  }
}
