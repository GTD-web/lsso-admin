/**
 * 로그 관리 레포지토리 인터페이스
 */

import type { Log, LogsResponse } from "./entity/logs.entity";
import type { LogListParams, LogFilterDto } from "./dto/logs.dto";

/**
 * 로그 관리 레포지토리 메인 인터페이스
 */
export interface ILogsRepository {
  /**
   * 로그 목록 조회 (페이지네이션)
   */
  getLogs(params?: LogListParams): Promise<LogsResponse>;

  /**
   * 로그 상세 조회
   */
  getLogById(id: string): Promise<Log>;

  /**
   * 로그 필터링
   */
  filterLogs(filterDto: LogFilterDto): Promise<LogsResponse>;
}
