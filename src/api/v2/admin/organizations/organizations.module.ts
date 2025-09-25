/**
 * 조직 관리 모듈
 * 싱글톤 패턴으로 조직 관리 관련 레포지토리를 제공
 */

import { BaseModule } from "../../base/base.module";
import { OrganizationsRepository } from "./organizations.repository";
import { IOrganizationsRepository } from "./organizations.repository.interface";

export class OrganizationsModule extends BaseModule {
  private _organizationsRepository: IOrganizationsRepository | null = null;

  constructor() {
    super("OrganizationsModule");
  }

  /**
   * 조직 관리 레포지토리 인스턴스 반환
   */
  organizationsRepository(): IOrganizationsRepository {
    if (!this._organizationsRepository) {
      this._organizationsRepository = new OrganizationsRepository();
    }
    return this._organizationsRepository;
  }
}

// 편의용 export
export const organizationsModule = OrganizationsModule.getInstance();
export const organizationsRepository =
  organizationsModule.organizationsRepository();

// 타입 export
export type { IOrganizationsRepository } from "./organizations.repository.interface";
export * from "./entity/organizations.entity";
export * from "./dto/organizations.dto";
