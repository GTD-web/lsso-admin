/**
 * 시스템 관리 모듈
 * 싱글톤 패턴으로 시스템 관리 관련 레포지토리를 제공
 */

import { BaseModule } from "../../base/base.module";
import { SystemsRepository } from "./systems.repository";
import { ISystemsRepository } from "./systems.repository.interface";

export class SystemsModule extends BaseModule {
  private _systemsRepository: ISystemsRepository | null = null;

  constructor() {
    super("SystemsModule");
  }

  /**
   * 시스템 관리 레포지토리 인스턴스 반환
   */
  systemsRepository(): ISystemsRepository {
    if (!this._systemsRepository) {
      this._systemsRepository = new SystemsRepository();
    }
    return this._systemsRepository;
  }
}

// 편의용 export
export const systemsModule = SystemsModule.getInstance();
export const systemsRepository = systemsModule.systemsRepository();

// 타입 export
export type { ISystemsRepository } from "./systems.repository.interface";
export * from "./entity/systems.entity";
export * from "./dto/systems.dto";
