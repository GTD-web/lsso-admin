/**
 * 시스템 관리 관련 엔티티 정의
 */

/**
 * 시스템 엔티티
 */
export interface System {
  id: string;
  clientId: string;
  clientSecret: string; // 조회시에는 마스킹됨 (***)
  name: string;
  description?: string;
  domain: string;
  allowedOrigin: string[];
  healthCheckUrl?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * 시스템 역할 엔티티
 */
export interface SystemRole {
  id: string;
  systemId: string;
  roleName: string;
  roleCode: string;
  description?: string;
  permissions: string[];
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  // 조인된 데이터
  system?: System;
}

/**
 * 시스템 생성 응답 (원본 시크릿 포함)
 */
export interface SystemCreateResponse {
  system: System;
  originalSecret: string; // 생성시에만 반환되는 원본 시크릿
}

/**
 * API 키 재생성 응답 (원본 시크릿 포함)
 */
export interface SystemRegenerateResponse {
  system: System;
  originalSecret: string; // 재생성된 원본 시크릿
}
