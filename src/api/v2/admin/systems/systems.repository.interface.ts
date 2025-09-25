/**
 * 시스템 관리 레포지토리 인터페이스
 */

import type {
  System,
  SystemRole,
  SystemCreateResponse,
  SystemRegenerateResponse,
} from "./entity/systems.entity";
import type {
  CreateSystemDto,
  UpdateSystemDto,
  CreateSystemRoleDto,
  UpdateSystemRoleDto,
  SystemSearchParams,
  SystemRoleSearchParams,
} from "./dto/systems.dto";

/**
 * 시스템 관리 레포지토리 메인 인터페이스
 */
export interface ISystemsRepository {
  // =============== 시스템 관리 ===============

  /**
   * 시스템 목록 조회
   */
  getSystems(params?: SystemSearchParams): Promise<System[]>;

  /**
   * 시스템 검색
   */
  searchSystems(query: string): Promise<System[]>;

  /**
   * 시스템 상세 조회
   */
  getSystemById(id: string): Promise<System>;

  /**
   * 시스템 생성
   */
  createSystem(data: CreateSystemDto): Promise<SystemCreateResponse>;

  /**
   * 시스템 수정
   */
  updateSystem(id: string, data: UpdateSystemDto): Promise<System>;

  /**
   * 시스템 삭제
   */
  deleteSystem(id: string): Promise<void>;

  /**
   * API 키 재생성
   */
  regenerateApiKeys(id: string): Promise<SystemRegenerateResponse>;

  // =============== 시스템 역할 관리 ===============

  /**
   * 시스템 역할 목록 조회
   */
  getSystemRoles(params?: SystemRoleSearchParams): Promise<SystemRole[]>;

  /**
   * 시스템 역할 상세 조회
   */
  getSystemRoleById(id: string): Promise<SystemRole>;

  /**
   * 시스템 역할 생성
   */
  createSystemRole(data: CreateSystemRoleDto): Promise<SystemRole>;

  /**
   * 시스템 역할 수정
   */
  updateSystemRole(id: string, data: UpdateSystemRoleDto): Promise<SystemRole>;

  /**
   * 시스템 역할 삭제
   */
  deleteSystemRole(id: string): Promise<void>;
}
