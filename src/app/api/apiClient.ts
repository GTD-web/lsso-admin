import { ApiResponse } from "./types";

// API 기본 URL
const API_BASE_URL =
  (process.env.NEXT_PUBLIC_API_URL || "http://localhost:3030") + "/api";
console.log("API_BASE_URL", API_BASE_URL);
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
  body?: Record<string, unknown> | unknown[] | null;
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

    // 백엔드 응답을 프론트엔드의 ApiResponse 형식으로 변환
    // 백엔드가 ApiResponseDto를 사용하므로 그대로 사용
    if (responseData && typeof responseData === "object") {
      // responseData가 이미 ApiResponseDto 형식인 경우 (success, data, error 속성 포함)
      if ("success" in responseData) {
        // 이미 올바른 형식을 가지고 있음
        console.log(
          "[API Format] 백엔드 응답이 이미 ApiResponseDto 형식입니다."
        );
        return responseData as ApiResponse<T>;
      }

      // 백엔드가 ApiResponseDto를 사용하지 않고 직접 데이터를 반환한 경우
      console.log(
        "[API Format] 백엔드 응답을 ApiResponse 형식으로 변환합니다."
      );
      return {
        success: true,
        data: responseData as T,
      };
    }

    // 응답이 예상 형식이 아닌 경우 (배열이거나 null 등)
    console.log("[API Format] 예상치 못한 응답 형식입니다. 그대로 반환합니다.");
    return {
      success: true,
      data: responseData as T,
    };
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
  body: Record<string, unknown> | unknown[] | null,
  options: Omit<ApiRequestOptions, "method"> = {}
): Promise<ApiResponse<T>> {
  return apiRequest<T>(endpoint, { ...options, method: "POST", body });
}

/**
 * PUT 요청 전용 함수
 */
export async function apiPut<T>(
  endpoint: string,
  body: Record<string, unknown> | unknown[] | null,
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
  body: Record<string, unknown> | unknown[] | null,
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
    const response = await apiCall();
    return response;
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
