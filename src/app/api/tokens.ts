import { ApiResponse } from "./types";
import { apiGet, apiPost, apiPut, apiDelete } from "./apiClient";

// 토큰 타입 정의 (명세서 기반)
export type Token = {
  id: string;
  userId: string;
  systemId: string;
  accessToken: string;
  secret: string;
  tokenExpiresAt: string;
  lastAccess?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  // 추가 정보
  userName?: string;
  userEmail?: string;
  systemName?: string;
};

// 토큰 생성 요청 타입
export type CreateTokenRequest = {
  userId: string;
  systemId: string;
  expiresInDays?: number;
};

// 토큰 상태 변경 요청 타입
export type UpdateTokenStatusRequest = {
  isActive: boolean;
};

// 토큰 갱신 요청 타입
export type RenewTokenRequest = {
  expiresInDays?: number;
};

// 모든 토큰 목록 조회
export async function getAllTokens(): Promise<ApiResponse<Token[]>> {
  try {
    const token = getAuthToken();
    return await apiGet<Token[]>("/admin/tokens", {
      token: token || undefined,
    });
  } catch (error) {
    console.error("Error fetching tokens:", error);
    return {
      success: false,
      error: {
        message: "서버 연결 중 오류가 발생했습니다.",
        code: "TOKEN_SERVER_ERROR",
      },
    };
  }
}

// 시스템별 토큰 조회
export async function getTokensBySystem(
  systemId: string
): Promise<ApiResponse<Token[]>> {
  try {
    const token = getAuthToken();
    return await apiGet<Token[]>(`/admin/tokens/system/${systemId}`, {
      token: token || undefined,
    });
  } catch (error) {
    console.error("Error fetching tokens by system:", error);
    return {
      success: false,
      error: {
        message: "서버 연결 중 오류가 발생했습니다.",
        code: "TOKEN_SERVER_ERROR",
      },
    };
  }
}

// 사용자별 토큰 조회
export async function getTokensByUser(
  userId: string
): Promise<ApiResponse<Token[]>> {
  try {
    const token = getAuthToken();
    return await apiGet<Token[]>(`/admin/tokens/user/${userId}`, {
      token: token || undefined,
    });
  } catch (error) {
    console.error("Error fetching tokens by user:", error);
    return {
      success: false,
      error: {
        message: "서버 연결 중 오류가 발생했습니다.",
        code: "TOKEN_SERVER_ERROR",
      },
    };
  }
}

// 토큰 상세 조회
export async function getTokenById(id: string): Promise<ApiResponse<Token>> {
  try {
    const token = getAuthToken();
    return await apiGet<Token>(`/admin/tokens/${id}`, {
      token: token || undefined,
    });
  } catch (error) {
    console.error("Error fetching token:", error);
    return {
      success: false,
      error: {
        message: "서버 연결 중 오류가 발생했습니다.",
        code: "TOKEN_SERVER_ERROR",
      },
    };
  }
}

// 토큰 생성
export async function createToken(
  tokenData: CreateTokenRequest
): Promise<ApiResponse<Token>> {
  try {
    const token = getAuthToken();
    return await apiPost<Token>("/admin/tokens", tokenData, {
      token: token || undefined,
    });
  } catch (error) {
    console.error("Error creating token:", error);
    return {
      success: false,
      error: {
        message: "서버 연결 중 오류가 발생했습니다.",
        code: "TOKEN_SERVER_ERROR",
      },
    };
  }
}

// 토큰 상태 변경
export async function updateTokenStatus(
  id: string,
  statusData: UpdateTokenStatusRequest
): Promise<ApiResponse<Token>> {
  try {
    const token = getAuthToken();
    return await apiPut<Token>(`/admin/tokens/${id}/status`, statusData, {
      token: token || undefined,
    });
  } catch (error) {
    console.error("Error updating token status:", error);
    return {
      success: false,
      error: {
        message: "서버 연결 중 오류가 발생했습니다.",
        code: "TOKEN_SERVER_ERROR",
      },
    };
  }
}

// 토큰 갱신
export async function renewToken(
  id: string,
  renewData: RenewTokenRequest
): Promise<ApiResponse<Token>> {
  try {
    const token = getAuthToken();
    return await apiPut<Token>(`/admin/tokens/${id}/renew`, renewData, {
      token: token || undefined,
    });
  } catch (error) {
    console.error("Error renewing token:", error);
    return {
      success: false,
      error: {
        message: "서버 연결 중 오류가 발생했습니다.",
        code: "TOKEN_SERVER_ERROR",
      },
    };
  }
}

// 토큰 삭제
export async function deleteToken(id: string): Promise<ApiResponse<boolean>> {
  try {
    const token = getAuthToken();
    return await apiDelete<boolean>(`/admin/tokens/${id}`, {
      token: token || undefined,
    });
  } catch (error) {
    console.error("Error deleting token:", error);
    return {
      success: false,
      error: {
        message: "서버 연결 중 오류가 발생했습니다.",
        code: "TOKEN_SERVER_ERROR",
      },
    };
  }
}

// 로컬 스토리지에서 인증 토큰 가져오기
function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("authToken");
}
