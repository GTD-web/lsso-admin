/**
 * 조직 관리 관련 DTO 정의
 */

import { DepartmentType, Gender } from "../entity/organizations.entity";

// =============== 부서 관련 DTO ===============

/**
 * 부서 생성 DTO
 */
export interface CreateDepartmentDto {
  departmentName: string;
  departmentCode: string;
  type: DepartmentType;
  parentDepartmentId?: string;
  order?: number;
}

/**
 * 부서 수정 DTO
 */
export interface UpdateDepartmentDto {
  departmentName?: string;
  departmentCode?: string;
  type?: DepartmentType;
  parentDepartmentId?: string;
  order?: number;
}

/**
 * 부서 목록 응답 DTO
 */
export interface DepartmentsResponseDto {
  departments: Department[];
}

// =============== 직원 관련 DTO ===============

/**
 * 직원 생성 DTO
 */
export interface CreateEmployeeDto {
  employeeNumber: string;
  name: string;
  email: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  gender?: Gender;
  hireDate: string;
  currentRankId?: string;
}

/**
 * 직원 수정 DTO
 */
export interface UpdateEmployeeDto {
  name?: string;
  email?: string;
  phoneNumber?: string;
  status?: string;
  terminationDate?: string;
}

/**
 * 직원 목록 응답 DTO
 */
export interface EmployeesResponseDto {
  employees: Employee[];
}

// =============== 직책 관련 DTO ===============

/**
 * 직책 생성 DTO
 */
export interface CreatePositionDto {
  positionTitle: string;
  positionCode: string;
  level: number;
  hasManagementAuthority?: boolean;
}

/**
 * 직책 수정 DTO
 */
export interface UpdatePositionDto {
  positionTitle?: string;
  positionCode?: string;
  level?: number;
  hasManagementAuthority?: boolean;
}

// =============== 직급 관련 DTO ===============

/**
 * 직급 생성 DTO
 */
export interface CreateRankDto {
  rankName: string;
  rankCode: string;
  level: number;
}

/**
 * 직급 수정 DTO
 */
export interface UpdateRankDto {
  rankName?: string;
  rankCode?: string;
  level?: number;
}

// =============== 직원 배치 관련 DTO ===============

/**
 * 직원 배치 생성 DTO
 */
export interface CreateEmployeeAssignmentDto {
  employeeId: string;
  departmentId: string;
  positionId: string;
  isManager?: boolean;
}

/**
 * 직원 배치 수정 DTO
 */
export interface UpdateEmployeeAssignmentDto {
  departmentId?: string;
  positionId?: string;
  isManager?: boolean;
}

// =============== 직급 이력 관련 DTO ===============

/**
 * 직급 변경 DTO
 */
export interface RankPromotionDto {
  rankId: string;
}

// =============== 공통 응답 DTO ===============

/**
 * 기본 응답 래퍼
 */
export interface BaseResponseDto<T> {
  data: T;
  message?: string;
}

// Import된 타입들을 다시 export (순환 참조 방지)
import type {
  Department,
  Employee,
  Position,
  Rank,
  EmployeeAssignment,
  RankHistory,
} from "../entity/organizations.entity";
