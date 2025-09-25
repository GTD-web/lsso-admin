/**
 * API v2 메인 인덱스
 * 모든 API 모듈을 통합하여 제공
 */

// =============== 모듈 exports ===============
export * from "./admin/organizations/organizations.module";
export * from "./admin/systems/systems.module";
export * from "./admin/logs/logs.module";
export * from "./admin/auth/auth.module";

// =============== 기본 모듈 exports ===============
export * from "./base/base.module";
export * from "./base/base.repository.interface";

// =============== 편의용 인스턴스 exports ===============
export {
  organizationsModule,
  organizationsRepository,
} from "./admin/organizations/organizations.module";

export {
  systemsModule,
  systemsRepository,
} from "./admin/systems/systems.module";

export { logsModule, logsRepository } from "./admin/logs/logs.module";

export { authModule, authRepository } from "./admin/auth/auth.module";

// =============== 주요 타입 re-exports ===============

// Organizations
export type {
  Department,
  Employee,
  Position,
  Rank,
  EmployeeAssignment,
  RankHistory,
  DepartmentType,
  Gender,
} from "./admin/organizations/entity/organizations.entity";

export type {
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
} from "./admin/organizations/dto/organizations.dto";

// Systems
export type {
  System,
  SystemRole,
  SystemCreateResponse,
  SystemRegenerateResponse,
} from "./admin/systems/entity/systems.entity";

export type {
  CreateSystemDto,
  UpdateSystemDto,
  CreateSystemRoleDto,
  UpdateSystemRoleDto,
  SystemSearchParams,
  SystemRoleSearchParams,
} from "./admin/systems/dto/systems.dto";

// Logs
export type {
  Log,
  LogsResponse,
  SortDirection,
} from "./admin/logs/entity/logs.entity";

export type { LogListParams, LogFilterDto } from "./admin/logs/dto/logs.dto";

// Auth
export type {
  LoginResponse,
  RefreshResponse,
  AdminUser,
  UserProfile,
} from "./admin/auth/entity/auth.entity";

export type {
  LoginDto,
  RefreshTokenDto,
  ChangePasswordDto,
} from "./admin/auth/dto/auth.dto";

// Base
export type {
  IBaseRepository,
  IPaginatedRepository,
  ISearchableRepository,
  PaginatedResponse,
  ApiErrorResponse,
} from "./base/base.repository.interface";
