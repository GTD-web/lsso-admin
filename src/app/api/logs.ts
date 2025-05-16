import { apiGet, apiPost } from "./apiClient";
import { ApiResponse } from "./types";

export type Log = {
  id: string;
  requestTimestamp: string;
  method: string;
  url: string;
  query?: Record<string, unknown>;
  headers?: Record<string, string>;
  body?: Record<string, unknown>;
  statusCode: number;
  responseTime: number;
  response?: Record<string, unknown>;
  error?: string;
  ip: string;
  host: string;
  userAgent?: string;
  system?: string;
};

export type LogsResponse = {
  logs: Log[];
  total: number;
  page: number;
  limit: number;
};

export type LogFilterParams = {
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
  search?: string;
  method?: string;
  url?: string;
  statusCode?: number;
  host?: string;
  ip?: string;
  errorsOnly?: boolean;
  sortBy?: string;
  sortDirection?: "ASC" | "DESC";
  system?: string;
};

// 로그 목록 조회
export async function getLogs(
  page = 1,
  limit = 10
): Promise<ApiResponse<LogsResponse>> {
  try {
    const token = getAuthToken();
    return await apiGet<LogsResponse>(
      `/admin/logs?page=${page}&limit=${limit}`,
      {
        token: token || undefined,
      }
    );
  } catch (error) {
    console.error("Error fetching logs:", error);
    return {
      success: false,
      error: {
        message: "서버 연결 중 오류가 발생했습니다.",
        code: "LOGS_FETCH_ERROR",
      },
    };
  }
}

// 로그 상세 조회
export async function getLogById(id: string): Promise<ApiResponse<Log>> {
  try {
    const token = getAuthToken();
    return await apiGet<Log>(`/admin/logs/${id}`, {
      token: token || undefined,
    });
  } catch (error) {
    console.error(`Error fetching log with ID ${id}:`, error);
    return {
      success: false,
      error: {
        message: "서버 연결 중 오류가 발생했습니다.",
        code: "LOG_FETCH_ERROR",
      },
    };
  }
}

// 로그 필터링
export async function filterLogs(
  filterParams: LogFilterParams
): Promise<ApiResponse<LogsResponse>> {
  try {
    const token = getAuthToken();
    return await apiPost<LogsResponse>("/admin/logs/filter", filterParams, {
      token: token || undefined,
    });
  } catch (error) {
    console.error("Error filtering logs:", error);
    return {
      success: false,
      error: {
        message: "서버 연결 중 오류가 발생했습니다.",
        code: "LOGS_FILTER_ERROR",
      },
    };
  }
}

// 로컬 스토리지에서 인증 토큰 가져오기
function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("authToken");
}
