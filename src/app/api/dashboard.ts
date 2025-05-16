import { ApiResponse } from "./types";
import { apiGet } from "./apiClient";
import { Log } from "./logs";

// 시스템 상태 정보 타입
export interface SystemStatus {
  id: string;
  name: string;
  status: "online" | "offline" | "warning";
  lastCheck: string;
  responseTime: number;
  uptime?: number; // 업타임 (초 단위)
  healthCheckUrl?: string;
}

// 로그인 통계 정보 타입
export interface LoginStats {
  total: number;
  success: number;
  failed: number;
  successRate: number;
}

// 토큰 통계 정보 타입
export interface TokenStats {
  total: number;
  active: number;
  inactive: number;
  expiringSoon: number; // 7일 이내 만료 예정인 토큰 수
}

// 보안 알림 타입
export interface SecurityAlert {
  id: string;
  type: "warning" | "error" | "info";
  message: string;
  timestamp: string;
  resolved: boolean;
  relatedLogId?: string;
}

// 대시보드 요약 데이터 타입
export interface DashboardSummary {
  activeUsers: number;
  totalUsers: number;
  tokenStats: TokenStats;
  activeSystems: number;
  totalSystems: number;
  loginStats: LoginStats;
  avgResponseTime: number;
  securityAlerts: SecurityAlert[];
  recentLogs: Log[];
  systemStatus: SystemStatus[];
}

/**
 * 대시보드 요약 데이터를 가져오는 함수
 * @returns 대시보드 요약 데이터
 */
export async function getDashboardSummary(): Promise<
  ApiResponse<DashboardSummary>
> {
  try {
    const token = getAuthToken();
    return await apiGet<DashboardSummary>("/admin/dashboard/summary", {
      token: token || undefined,
    });
  } catch (error) {
    console.error("Error fetching dashboard summary:", error);
    return {
      success: false,
      error: {
        message: "대시보드 데이터를 불러오는데 실패했습니다.",
        code: "DASHBOARD_FETCH_ERROR",
      },
    };
  }
}

/**
 * 시스템 상태 정보를 가져오는 함수
 * @returns 시스템 상태 정보 목록
 */
export async function getSystemsStatus(): Promise<ApiResponse<SystemStatus[]>> {
  try {
    const token = getAuthToken();
    return await apiGet<SystemStatus[]>("/admin/dashboard/systems-status", {
      token: token || undefined,
    });
  } catch (error) {
    console.error("Error fetching systems status:", error);
    return {
      success: false,
      error: {
        message: "시스템 상태 정보를 불러오는데 실패했습니다.",
        code: "SYSTEMS_STATUS_FETCH_ERROR",
      },
    };
  }
}

/**
 * 최근 로그 활동을 가져오는 함수
 * @param limit 가져올 로그 수
 * @returns 최근 로그 목록
 */
export async function getRecentLogs(limit = 5): Promise<ApiResponse<Log[]>> {
  try {
    const token = getAuthToken();
    return await apiGet<Log[]>(`/admin/dashboard/recent-logs?limit=${limit}`, {
      token: token || undefined,
    });
  } catch (error) {
    console.error("Error fetching recent logs:", error);
    return {
      success: false,
      error: {
        message: "최근 로그를 불러오는데 실패했습니다.",
        code: "RECENT_LOGS_FETCH_ERROR",
      },
    };
  }
}

/**
 * 로그인 통계 정보를 가져오는 함수
 * @param days 통계 기간 (일)
 * @returns 로그인 통계 정보
 */
export async function getLoginStats(
  days = 7
): Promise<ApiResponse<LoginStats>> {
  try {
    const token = getAuthToken();
    return await apiGet<LoginStats>(
      `/admin/dashboard/login-stats?days=${days}`,
      {
        token: token || undefined,
      }
    );
  } catch (error) {
    console.error("Error fetching login stats:", error);
    return {
      success: false,
      error: {
        message: "로그인 통계를 불러오는데 실패했습니다.",
        code: "LOGIN_STATS_FETCH_ERROR",
      },
    };
  }
}

/**
 * 보안 알림을 가져오는 함수
 * @returns 보안 알림 목록
 */
export async function getSecurityAlerts(): Promise<
  ApiResponse<SecurityAlert[]>
> {
  try {
    const token = getAuthToken();
    return await apiGet<SecurityAlert[]>("/admin/dashboard/security-alerts", {
      token: token || undefined,
    });
  } catch (error) {
    console.error("Error fetching security alerts:", error);
    return {
      success: false,
      error: {
        message: "보안 알림을 불러오는데 실패했습니다.",
        code: "SECURITY_ALERTS_FETCH_ERROR",
      },
    };
  }
}

/**
 * 토큰 통계 정보를 가져오는 함수
 * @returns 토큰 통계 정보
 */
export async function getTokenStats(): Promise<ApiResponse<TokenStats>> {
  try {
    const token = getAuthToken();
    return await apiGet<TokenStats>("/admin/dashboard/token-stats", {
      token: token || undefined,
    });
  } catch (error) {
    console.error("Error fetching token stats:", error);
    return {
      success: false,
      error: {
        message: "토큰 통계를 불러오는데 실패했습니다.",
        code: "TOKEN_STATS_FETCH_ERROR",
      },
    };
  }
}

// 로컬 스토리지에서 인증 토큰 가져오기
function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("authToken");
}
