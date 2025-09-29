/**
 * 로그 관리 레포지토리 구현체
 */

import { BaseModule } from "../../base/base.module";
import { ILogsRepository } from "./logs.repository.interface";
import type { Log, LogsResponse } from "./entity/logs.entity";
import type { LogListParams, LogFilterDto } from "./dto/logs.dto";

export class LogsRepository extends BaseModule implements ILogsRepository {
  constructor() {
    super("LogsRepository");
  }

  async getLogs(params?: LogListParams): Promise<LogsResponse> {
    const queryParams = new URLSearchParams();

    if (params?.page) {
      queryParams.append("page", params.page.toString());
    }
    if (params?.limit) {
      queryParams.append("limit", params.limit.toString());
    }

    const queryString = queryParams.toString();
    const endpoint = `/admin/logs${queryString ? `?${queryString}` : ""}`;

    return this.makeRequest<LogsResponse>(endpoint);
  }

  async getLogById(id: string): Promise<Log> {
    return this.makeRequest<Log>(`/admin/logs/${id}`);
  }

  async filterLogs(filterDto: LogFilterDto): Promise<LogsResponse> {
    return this.makeRequest<LogsResponse>("/admin/logs/filter", {
      method: "POST",
      body: JSON.stringify(filterDto),
    });
  }
}
