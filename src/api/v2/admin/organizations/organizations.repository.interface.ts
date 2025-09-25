/**
 * 조직 관리 레포지토리 인터페이스
 */

import { IBaseRepository } from "../../base/base.repository.interface";
import type {
  Department,
  Employee,
  Position,
  Rank,
  EmployeeAssignment,
  RankHistory,
} from "./entity/organizations.entity";
import type {
  CreateDepartmentDto,
  UpdateDepartmentDto,
  CreateEmployeeDto,
  UpdateEmployeeDto,
  CreatePositionDto,
  UpdatePositionDto,
  CreateRankDto,
  UpdateRankDto,
  CreateEmployeeAssignmentDto,
  UpdateEmployeeAssignmentDto,
  RankPromotionDto,
  DepartmentsResponseDto,
  EmployeesResponseDto,
} from "./dto/organizations.dto";

/**
 * 조직 관리 레포지토리 메인 인터페이스
 */
export interface IOrganizationsRepository {
  // =============== 부서 관리 ===============
  /**
   * 부서 목록 조회 (계층구조)
   */
  getDepartments(): Promise<DepartmentsResponseDto>;

  /**
   * 부서 상세 조회
   */
  getDepartmentById(id: string): Promise<Department>;

  /**
   * 부서 생성
   */
  createDepartment(data: CreateDepartmentDto): Promise<Department>;

  /**
   * 부서 수정
   */
  updateDepartment(id: string, data: UpdateDepartmentDto): Promise<Department>;

  /**
   * 부서 삭제
   */
  deleteDepartment(id: string): Promise<void>;

  // =============== 직원 관리 ===============
  /**
   * 직원 목록 조회
   */
  getEmployees(): Promise<EmployeesResponseDto>;

  /**
   * 직원 상세 조회
   */
  getEmployeeById(id: string): Promise<Employee>;

  /**
   * 직원 생성
   */
  createEmployee(data: CreateEmployeeDto): Promise<Employee>;

  /**
   * 직원 수정
   */
  updateEmployee(id: string, data: UpdateEmployeeDto): Promise<Employee>;

  // =============== 직책 관리 ===============
  /**
   * 직책 목록 조회
   */
  getPositions(): Promise<Position[]>;

  /**
   * 직책 생성
   */
  createPosition(data: CreatePositionDto): Promise<Position>;

  /**
   * 직책 수정
   */
  updatePosition(id: string, data: UpdatePositionDto): Promise<Position>;

  /**
   * 직책 삭제
   */
  deletePosition(id: string): Promise<void>;

  // =============== 직급 관리 ===============
  /**
   * 직급 목록 조회
   */
  getRanks(): Promise<Rank[]>;

  /**
   * 직급 생성
   */
  createRank(data: CreateRankDto): Promise<Rank>;

  /**
   * 직급 수정
   */
  updateRank(id: string, data: UpdateRankDto): Promise<Rank>;

  /**
   * 직급 삭제
   */
  deleteRank(id: string): Promise<void>;

  // =============== 직원 배치 관리 ===============
  /**
   * 직원 배치 생성
   */
  createEmployeeAssignment(
    data: CreateEmployeeAssignmentDto
  ): Promise<EmployeeAssignment>;

  /**
   * 직원 배치 수정
   */
  updateEmployeeAssignment(
    id: string,
    data: UpdateEmployeeAssignmentDto
  ): Promise<EmployeeAssignment>;

  /**
   * 직원 배치 삭제
   */
  deleteEmployeeAssignment(id: string): Promise<void>;

  /**
   * 직원 배치 현황 조회
   */
  getEmployeeAssignments(employeeId: string): Promise<EmployeeAssignment[]>;

  /**
   * 전체 직원 배치 현황 조회
   */
  getAllEmployeeAssignments(): Promise<EmployeeAssignment[]>;

  // =============== 직급 이력 관리 ===============
  /**
   * 직원 직급 변경
   */
  promoteEmployee(
    employeeId: string,
    data: RankPromotionDto
  ): Promise<RankHistory>;

  /**
   * 직원 직급 이력 조회
   */
  getEmployeeRankHistory(employeeId: string): Promise<RankHistory[]>;
}
