/**
 * 로그 관리 모듈
 * 싱글톤 패턴으로 로그 관리 관련 레포지토리를 제공
 */

import { BaseModule } from "../../base/base.module";
import { LogsRepository } from "./logs.repository";
import { ILogsRepository } from "./logs.repository.interface";

export class LogsModule extends BaseModule {
  private _logsRepository: ILogsRepository | null = null;

  constructor() {
    super("LogsModule");
  }

  /**
   * 로그 관리 레포지토리 인스턴스 반환
   */
  logsRepository(): ILogsRepository {
    if (!this._logsRepository) {
      this._logsRepository = new LogsRepository();
    }
    return this._logsRepository;
  }
}

// 편의용 export
export const logsModule = LogsModule.getInstance();
export const logsRepository = logsModule.logsRepository();

// 타입 export
export type { ILogsRepository } from "./logs.repository.interface";
export * from "./entity/logs.entity";
export * from "./dto/logs.dto";
