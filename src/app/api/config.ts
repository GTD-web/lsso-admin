/**
 * API 공통 설정 파일
 * 모든 API Route에서 사용하는 백엔드 URL 및 공통 설정을 관리합니다.
 */

export const API_CONFIG = {
  /**
   * 백엔드 서버 URL
   * 환경변수 NEXT_PUBLIC_API_URL 우선, 없으면 기본값 사용
   */
  BACKEND_URL:
    process.env.NEXT_PUBLIC_API_URL ||
    "https://lsso-git-dev-lumir-tech7s-projects.vercel.app",

  /**
   * API 기본 헤더
   */
  DEFAULT_HEADERS: {
    "Content-Type": "application/json",
  },

  /**
   * 공통 에러 메시지
   */
  ERROR_MESSAGES: {
    UNAUTHORIZED: "인증 토큰이 없습니다.",
    SERVER_ERROR: "서버 오류가 발생했습니다.",
  },
} as const;

/**
 * 백엔드 API 요청을 위한 헬퍼 함수
 * @param endpoint - API 엔드포인트 (예: "/api/auth/login")
 * @param options - fetch 옵션
 * @returns fetch Promise
 */
export async function fetchBackend(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  const url = `${API_CONFIG.BACKEND_URL}${endpoint}`;

  console.log(`🌐 API 요청: ${options.method || "GET"} ${url}`);

  const response = await fetch(url, {
    ...options,
    headers: {
      ...API_CONFIG.DEFAULT_HEADERS,
      ...options.headers,
    },
  });

  console.log(`📡 응답 상태: ${response.status}`);

  return response;
}

/**
 * Authorization 헤더 검증 헬퍼
 * @param request - NextRequest 객체
 * @returns authorization 헤더 문자열 또는 null
 */
export function getAuthorizationHeader(request: Request): string | null {
  return request.headers.get("authorization");
}

/**
 * 공통 에러 응답 생성 헬퍼
 * @param message - 에러 메시지
 * @param status - HTTP 상태 코드
 */
export function createErrorResponse(message: string, status: number) {
  return Response.json({ message }, { status });
}
