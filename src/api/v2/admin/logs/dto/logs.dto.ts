/**
 * 로그 관리 관련 DTO 정의
 */

import { SortDirection } from "../entity/logs.entity";

/**
 * 로그 목록 조회 파라미터
 */
export interface LogListParams {
  page?: number;
  limit?: number;
}

/**
 * 로그 필터링 DTO
 */
export interface LogFilterDto {
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
  method?: string;
  url?: string;
  statusCode?: number;
  host?: string;
  ip?: string;
  system?: string;
  errorsOnly?: boolean;
  sortBy?: string;
  sortDirection?: SortDirection;
}

// Import된 타입들을 다시 export (순환 참조 방지)
import type { Log, LogsResponse } from "../entity/logs.entity";
