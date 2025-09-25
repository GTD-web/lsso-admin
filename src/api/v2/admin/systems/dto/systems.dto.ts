/**
 * 시스템 관리 관련 DTO 정의
 */

// =============== 시스템 관련 DTO ===============

/**
 * 시스템 생성 DTO
 */
export interface CreateSystemDto {
  name: string;
  description?: string;
  domain: string;
  allowedOrigin: string[];
  healthCheckUrl?: string;
  isActive?: boolean;
}

/**
 * 시스템 수정 DTO
 */
export interface UpdateSystemDto {
  name?: string;
  description?: string;
  domain?: string;
  allowedOrigin?: string[];
  healthCheckUrl?: string;
  isActive?: boolean;
}

// =============== 시스템 역할 관련 DTO ===============

/**
 * 시스템 역할 생성 DTO
 */
export interface CreateSystemRoleDto {
  systemId: string;
  roleName: string;
  roleCode: string;
  description?: string;
  permissions: string[];
  sortOrder?: number;
  isActive?: boolean;
}

/**
 * 시스템 역할 수정 DTO
 */
export interface UpdateSystemRoleDto {
  roleName?: string;
  roleCode?: string;
  description?: string;
  permissions?: string[];
  sortOrder?: number;
  isActive?: boolean;
}

// =============== 검색 관련 DTO ===============

/**
 * 시스템 검색 파라미터
 */
export interface SystemSearchParams {
  search?: string; // 검색어 (이름, 설명, 도메인)
  query?: string; // 직접 검색어
}

/**
 * 시스템 역할 검색 파라미터
 */
export interface SystemRoleSearchParams {
  systemId?: string; // 특정 시스템의 역할만 조회
}

// Import된 타입들을 다시 export (순환 참조 방지)
import type {
  System,
  SystemRole,
  SystemCreateResponse,
  SystemRegenerateResponse,
} from "../entity/systems.entity";
