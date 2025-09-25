/**
 * 조직 관리 관련 엔티티 정의
 */

/**
 * 부서 엔티티
 */
export interface Department {
  id: string;
  departmentName: string;
  departmentCode: string;
  type: DepartmentType;
  parentDepartmentId?: string;
  order: number;
  childDepartments?: Department[];
  createdAt: string;
  updatedAt: string;
}

/**
 * 부서 유형
 */
export enum DepartmentType {
  COMPANY = "COMPANY",
  DIVISION = "DIVISION",
  DEPARTMENT = "DEPARTMENT",
  TEAM = "TEAM",
}

/**
 * 부서 트리 노드 (계층구조 표현용)
 */
export interface DepartmentTreeNode extends Department {
  children?: DepartmentTreeNode[];
}

/**
 * 직원 엔티티
 */
export interface Employee {
  id: string;
  employeeNumber: string;
  name: string;
  email: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  gender?: Gender;
  hireDate: string;
  status: string;
  currentRankId?: string;
  terminationDate?: string;
  isInitialPasswordSet: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * 성별
 */
export enum Gender {
  MALE = "MALE",
  FEMALE = "FEMALE",
  OTHER = "OTHER",
}

/**
 * 직책 엔티티
 */
export interface Position {
  id: string;
  positionTitle: string;
  positionCode: string;
  level: number;
  hasManagementAuthority: boolean;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * 직급 엔티티
 */
export interface Rank {
  id: string;
  rankName: string;
  rankCode: string;
  level: number;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * 직원 배치 엔티티
 */
export interface EmployeeAssignment {
  id: string;
  employeeId: string;
  departmentId: string;
  positionId: string;
  isManager: boolean;
  createdAt: string;
  updatedAt: string;
  // 조인된 데이터 (조회시 포함)
  employee?: Employee;
  department?: Department;
  position?: Position;
}

/**
 * 직급 이력 엔티티
 */
export interface RankHistory {
  id: string;
  employeeId: string;
  rankId: string;
  createdAt: string;
  updatedAt: string;
  // 조인된 데이터
  employee?: Employee;
  rank?: Rank;
}
