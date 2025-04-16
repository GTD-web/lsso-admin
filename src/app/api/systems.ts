import { ApiResponse } from "./types";
import { apiGet, apiPost, apiPatch, apiDelete } from "./apiClient";

// 시스템 타입 정의 (명세서 기반)
export type System = {
  id: string;
  name: string;
  description?: string;
  clientId: string;
  clientSecret: string;
  allowedOrigin: string[];
  healthCheckUrl?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

// 모든 시스템 조회
export async function getAllSystems(): Promise<ApiResponse<System[]>> {
  try {
    const token = getAuthToken();
    return await apiGet<System[]>("/admin/systems", {
      token: token || undefined,
    });
  } catch (error) {
    console.error("Error fetching systems:", error);
    return {
      success: false,
      error: {
        message: "서버 연결 중 오류가 발생했습니다.",
        code: "SYSTEM_SERVER_ERROR",
      },
    };
  }
}

// 검색 기능
export async function searchSystems(
  query: string
): Promise<ApiResponse<System[]>> {
  try {
    const token = getAuthToken();
    return await apiGet<System[]>(
      `/admin/systems/search?query=${encodeURIComponent(query)}`,
      {
        token: token || undefined,
      }
    );
  } catch (error) {
    console.error("Error searching systems:", error);
    return {
      success: false,
      error: {
        message: "서버 연결 중 오류가 발생했습니다.",
        code: "SYSTEM_SERVER_ERROR",
      },
    };
  }
}

// 시스템 생성
export async function createSystem(
  systemData: Omit<System, "id" | "createdAt" | "updatedAt">
): Promise<ApiResponse<System>> {
  try {
    const token = getAuthToken();
    return await apiPost<System>("/admin/systems", systemData, {
      token: token || undefined,
    });
  } catch (error) {
    console.error("Error creating system:", error);
    return {
      success: false,
      error: {
        message: "서버 연결 중 오류가 발생했습니다.",
        code: "SYSTEM_SERVER_ERROR",
      },
    };
  }
}

// 시스템 상세 조회
export async function getSystemById(id: string): Promise<ApiResponse<System>> {
  try {
    const token = getAuthToken();
    return await apiGet<System>(`/admin/systems/${id}`, {
      token: token || undefined,
    });
  } catch (error) {
    console.error("Error fetching system:", error);
    return {
      success: false,
      error: {
        message: "서버 연결 중 오류가 발생했습니다.",
        code: "SYSTEM_SERVER_ERROR",
      },
    };
  }
}

// 시스템 수정
export async function updateSystem(
  id: string,
  systemData: Partial<Omit<System, "id" | "createdAt" | "updatedAt">>
): Promise<ApiResponse<System>> {
  try {
    const token = getAuthToken();
    return await apiPatch<System>(`/admin/systems/${id}`, systemData, {
      token: token || undefined,
    });
  } catch (error) {
    console.error("Error updating system:", error);
    return {
      success: false,
      error: {
        message: "서버 연결 중 오류가 발생했습니다.",
        code: "SYSTEM_SERVER_ERROR",
      },
    };
  }
}

// 시스템 삭제
export async function deleteSystem(id: string): Promise<ApiResponse<boolean>> {
  try {
    const token = getAuthToken();
    return await apiDelete<boolean>(`/admin/systems/${id}`, {
      token: token || undefined,
    });
  } catch (error) {
    console.error("Error deleting system:", error);
    return {
      success: false,
      error: {
        message: "서버 연결 중 오류가 발생했습니다.",
        code: "SYSTEM_SERVER_ERROR",
      },
    };
  }
}

// 로컬 스토리지에서 인증 토큰 가져오기
function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("authToken");
}
