/**
 * 인증 관리 모듈
 * 싱글톤 패턴으로 인증 관리 관련 레포지토리를 제공
 */

import { BaseModule } from "../../base/base.module";
import { AuthRepository } from "./auth.repository";
import { IAuthRepository } from "./auth.repository.interface";

export class AuthModule extends BaseModule {
  private _authRepository: IAuthRepository | null = null;

  constructor() {
    super("AuthModule");
  }

  /**
   * 인증 관리 레포지토리 인스턴스 반환
   */
  authRepository(): IAuthRepository {
    if (!this._authRepository) {
      this._authRepository = new AuthRepository();
    }
    return this._authRepository;
  }
}

// 편의용 export
export const authModule = AuthModule.getInstance();
export const authRepository = authModule.authRepository();

// 타입 export
export type { IAuthRepository } from "./auth.repository.interface";
export * from "./entity/auth.entity";
export * from "./dto/auth.dto";
