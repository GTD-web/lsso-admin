/**
 * 로그 관리 관련 엔티티 정의
 */

/**
 * 로그 엔티티
 */
export interface Log {
  id: string;
  requestTimestamp: string;
  responseTimestamp: string;
  method: string;
  url: string;
  params: Record<string, any>;
  query: Record<string, any>;
  body: Record<string, any>;
  statusCode: number;
  responseTime: number;
  response: Record<string, any>;
  error: string | null;
  ip: string;
  host: string;
  userAgent: string;
  system: string;
  isError: boolean;
}

/**
 * 로그 목록 응답 (페이지네이션 포함)
 */
export interface LogsResponse {
  logs: Log[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * 정렬 방향
 */
export enum SortDirection {
  ASC = "ASC",
  DESC = "DESC",
}
