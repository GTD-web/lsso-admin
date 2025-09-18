"use client";

// 조직 관리 API용 직접 HTTP 클라이언트 (백엔드가 직접 데이터를 반환)
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3030" + "/api";

/**
 * 조직 관리 API용 HTTP 요청 함수 (백엔드 직접 응답 처리)
 */
async function orgApiRequest<T>(
  endpoint: string,
  options: {
    method?: string;
    body?: unknown;
    token?: string;
  } = {}
): Promise<T> {
  const { method = "GET", body, token } = options;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const fullUrl = `${API_BASE_URL}${endpoint}`;
  console.log(`🌐 조직 API ${method} 요청:`, fullUrl);
  if (body) console.log("📤 요청 바디:", body);

  try {
    const response = await fetch(fullUrl, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    console.log(`📡 조직 API 응답 상태:`, response.status, response.statusText);

    if (!response.ok) {
      // 인증 실패 처리
      if (response.status === 401) {
        console.error("🚫 인증 실패: 토큰이 유효하지 않거나 만료되었습니다.");
        // 토큰 제거 및 로그인 페이지로 리다이렉트 필요
        if (typeof window !== "undefined") {
          localStorage.removeItem("auth_token");
          localStorage.removeItem("refresh_token");
          localStorage.removeItem("user_data");
        }
      }

      // 응답 본문을 읽어서 에러 메시지 확인
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      try {
        const errorBody = await response.text();
        console.log("📄 에러 응답 본문:", errorBody);
        const errorJson = JSON.parse(errorBody);
        if (errorJson.message) {
          errorMessage = errorJson.message;
        }
      } catch (parseError) {
        console.log("⚠️ 에러 응답 파싱 실패:", parseError);
      }

      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log("📥 조직 API 응답 데이터:", data);

    // 백엔드 응답을 그대로 반환
    return data as T;
  } catch (error) {
    console.error("💥 조직 API 에러:", error);
    throw error;
  }
}

/**
 * 인증 토큰 가져오기
 */
function getAuthToken(): string | undefined {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("auth_token");
    console.log(
      "🔑 조직 API 토큰 확인:",
      token ? "토큰 존재" : "토큰 없음",
      token?.substring(0, 20) + "..."
    );
    return token || undefined;
  }
  return undefined;
}

// 부서 인터페이스
export interface Department {
  id: string;
  departmentName: string;
  departmentCode: string;
  type: "COMPANY" | "DIVISION" | "DEPARTMENT" | "TEAM";
  parentDepartmentId?: string;
  order?: number;
  childDepartments?: Department[];
  createdAt: string;
  updatedAt: string;
}

// 직원 인터페이스
export interface Employee {
  id: string;
  employeeNumber: string;
  name: string;
  email: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  gender?: "MALE" | "FEMALE" | "OTHER";
  hireDate: string;
  status: string;
  currentRankId?: string;
  terminationDate?: string;
  isInitialPasswordSet: boolean;
  createdAt: string;
  updatedAt: string;
}

// 직책 인터페이스
export interface Position {
  id: string;
  positionTitle: string;
  positionCode: string;
  level: number;
  hasManagementAuthority: boolean;
  createdAt: string;
  updatedAt: string;
}

// 직급 인터페이스
export interface Rank {
  id: string;
  rankName: string;
  rankCode: string;
  level: number;
  createdAt: string;
  updatedAt: string;
}

// 직원 배치 인터페이스
export interface EmployeeAssignment {
  id: string;
  employeeId: string;
  departmentId: string;
  positionId: string;
  isManager: boolean;
  createdAt: string;
  updatedAt: string;
}

// 직급 이력 인터페이스
export interface RankHistory {
  id: string;
  employeeId: string;
  rankId: string;
  createdAt: string;
  updatedAt: string;
}

// 부서 생성/수정 DTO
export interface DepartmentCreateRequest {
  departmentName: string;
  departmentCode: string;
  type: "COMPANY" | "DIVISION" | "DEPARTMENT" | "TEAM";
  parentDepartmentId?: string;
  order?: number;
}

// 직원 생성/수정 DTO
export interface EmployeeCreateRequest {
  employeeNumber: string;
  name: string;
  email: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  gender?: "MALE" | "FEMALE" | "OTHER";
  hireDate: string;
  currentRankId?: string;
}

export interface EmployeeUpdateRequest {
  name?: string;
  email?: string;
  phoneNumber?: string;
  status?: string;
  terminationDate?: string;
}

// 직책 생성/수정 DTO
export interface PositionCreateRequest {
  positionTitle: string;
  positionCode: string;
  level: number;
  hasManagementAuthority?: boolean;
}

// 직급 생성/수정 DTO
export interface RankCreateRequest {
  rankName: string;
  rankCode: string;
  level: number;
}

// 직원 배치 생성/수정 DTO
export interface EmployeeAssignmentCreateRequest {
  employeeId: string;
  departmentId: string;
  positionId: string;
  isManager?: boolean;
}

export interface EmployeeAssignmentUpdateRequest {
  departmentId?: string;
  positionId?: string;
  isManager?: boolean;
}

// 직급 변경 DTO
export interface RankPromotionRequest {
  rankId: string;
}

// ============ 부서 관리 API ============

/**
 * 부서 목록 조회
 */
export async function getDepartments(): Promise<{ departments: Department[] }> {
  try {
    console.log("getDepartments - 실제 API 호출");
    const token = getAuthToken();
    return await orgApiRequest<{ departments: Department[] }>(
      "/admin/organizations/departments",
      { token }
    );
  } catch (error) {
    console.error("getDepartments 에러:", error);
    // API 호출 실패 시 빈 배열 반환
    return { departments: [] };
  }
}

/**
 * 부서 상세 조회
 */
export async function getDepartmentById(id: string): Promise<Department> {
  const token = getAuthToken();
  return await orgApiRequest<Department>(
    `/admin/organizations/departments/${id}`,
    { token }
  );
}

/**
 * 부서 생성
 */
export async function createDepartment(
  data: DepartmentCreateRequest
): Promise<Department> {
  console.log("createDepartment - 실제 API 호출", data);
  const token = getAuthToken();
  return await orgApiRequest<Department>("/admin/organizations/departments", {
    method: "POST",
    body: data,
    token,
  });
}

/**
 * 부서 수정
 */
export async function updateDepartment(
  id: string,
  data: DepartmentCreateRequest
): Promise<Department> {
  const token = getAuthToken();
  return await orgApiRequest<Department>(
    `/admin/organizations/departments/${id}`,
    { method: "PUT", body: data, token }
  );
}

/**
 * 부서 삭제
 */
export async function deleteDepartment(id: string): Promise<void> {
  const token = getAuthToken();
  return await orgApiRequest<void>(`/admin/organizations/departments/${id}`, {
    method: "DELETE",
    token,
  });
}

// ============ 직원 관리 API ============

/**
 * 직원 목록 조회
 */
export async function getEmployees(): Promise<{ employees: Employee[] }> {
  try {
    console.log("getEmployees - 실제 API 호출");
    const token = getAuthToken();
    return await orgApiRequest<{ employees: Employee[] }>(
      "/admin/organizations/employees",
      { token }
    );
  } catch (error) {
    console.error("getEmployees 에러:", error);
    // API 호출 실패 시 빈 배열 반환
    return { employees: [] };
  }
}

/**
 * 직원 상세 조회
 */
export async function getEmployeeById(id: string): Promise<Employee> {
  const token = getAuthToken();
  return await orgApiRequest<Employee>(`/admin/organizations/employees/${id}`, {
    token,
  });
}

/**
 * 직원 생성
 */
export async function createEmployee(
  data: EmployeeCreateRequest
): Promise<Employee> {
  console.log("createEmployee - 실제 API 호출", data);
  const token = getAuthToken();
  return await orgApiRequest<Employee>("/admin/organizations/employees", {
    method: "POST",
    body: data,
    token,
  });
}

/**
 * 직원 수정
 */
export async function updateEmployee(
  id: string,
  data: EmployeeUpdateRequest
): Promise<Employee> {
  const token = getAuthToken();
  return await orgApiRequest<Employee>(`/admin/organizations/employees/${id}`, {
    method: "PUT",
    body: data,
    token,
  });
}

// ============ 직책 관리 API ============

/**
 * 직책 목록 조회
 */
export async function getPositions(): Promise<Position[]> {
  try {
    console.log("getPositions - 실제 API 호출");
    const token = getAuthToken();
    return await orgApiRequest<Position[]>("/admin/organizations/positions", {
      token,
    });
  } catch (error) {
    console.error("getPositions 에러:", error);
    // API 호출 실패 시 빈 배열 반환
    return [];
  }
}

/**
 * 직책 생성
 */
export async function createPosition(
  data: PositionCreateRequest
): Promise<Position> {
  console.log("createPosition - 실제 API 호출", data);
  const token = getAuthToken();
  return await orgApiRequest<Position>("/admin/organizations/positions", {
    method: "POST",
    body: data,
    token,
  });
}

/**
 * 직책 수정
 */
export async function updatePosition(
  id: string,
  data: PositionCreateRequest
): Promise<Position> {
  const token = getAuthToken();
  return await orgApiRequest<Position>(`/admin/organizations/positions/${id}`, {
    method: "PUT",
    body: data,
    token,
  });
}

/**
 * 직책 삭제
 */
export async function deletePosition(id: string): Promise<void> {
  const token = getAuthToken();
  return await orgApiRequest<void>(`/admin/organizations/positions/${id}`, {
    method: "DELETE",
    token,
  });
}

// ============ 직급 관리 API ============

/**
 * 직급 목록 조회
 */
export async function getRanks(): Promise<Rank[]> {
  try {
    console.log("getRanks - 실제 API 호출");
    const token = getAuthToken();
    return await orgApiRequest<Rank[]>("/admin/organizations/ranks", {
      token,
    });
  } catch (error) {
    console.error("getRanks 에러:", error);
    // API 호출 실패 시 빈 배열 반환
    return [];
  }
}

/**
 * 직급 생성
 */
export async function createRank(data: RankCreateRequest): Promise<Rank> {
  console.log("createRank - 실제 API 호출", data);
  const token = getAuthToken();
  return await orgApiRequest<Rank>("/admin/organizations/ranks", {
    method: "POST",
    body: data,
    token,
  });
}

/**
 * 직급 수정
 */
export async function updateRank(
  id: string,
  data: RankCreateRequest
): Promise<Rank> {
  const token = getAuthToken();
  return await orgApiRequest<Rank>(`/admin/organizations/ranks/${id}`, {
    method: "PUT",
    body: data,
    token,
  });
}

/**
 * 직급 삭제
 */
export async function deleteRank(id: string): Promise<void> {
  const token = getAuthToken();
  return await orgApiRequest<void>(`/admin/organizations/ranks/${id}`, {
    method: "DELETE",
    token,
  });
}

// ============ 직원 배치 관리 API ============

/**
 * 직원 배치 생성
 */
export async function createEmployeeAssignment(
  data: EmployeeAssignmentCreateRequest
): Promise<EmployeeAssignment> {
  const token = getAuthToken();
  return await orgApiRequest<EmployeeAssignment>(
    "/admin/organizations/employee-assignments",
    { method: "POST", body: data, token }
  );
}

/**
 * 직원 배치 수정
 */
export async function updateEmployeeAssignment(
  id: string,
  data: EmployeeAssignmentUpdateRequest
): Promise<EmployeeAssignment> {
  const token = getAuthToken();
  return await orgApiRequest<EmployeeAssignment>(
    `/admin/organizations/employee-assignments/${id}`,
    { method: "PUT", body: data, token }
  );
}

/**
 * 직원 배치 삭제
 */
export async function deleteEmployeeAssignment(id: string): Promise<void> {
  const token = getAuthToken();
  return await orgApiRequest<void>(
    `/admin/organizations/employee-assignments/${id}`,
    { method: "DELETE", token }
  );
}

/**
 * 직원 배치 현황 조회
 */
export async function getEmployeeAssignments(
  employeeId: string
): Promise<EmployeeAssignment[]> {
  const token = getAuthToken();
  return await orgApiRequest<EmployeeAssignment[]>(
    `/admin/organizations/employees/${employeeId}/assignments`,
    { token }
  );
}

// ============ 직급 이력 관리 API ============

/**
 * 직원 직급 변경
 */
export async function promoteEmployee(
  employeeId: string,
  data: RankPromotionRequest
): Promise<RankHistory> {
  const token = getAuthToken();
  return await orgApiRequest<RankHistory>(
    `/admin/organizations/employees/${employeeId}/rank-promotion`,
    { method: "POST", body: data, token }
  );
}

/**
 * 직원 직급 이력 조회
 */
export async function getEmployeeRankHistory(
  employeeId: string
): Promise<RankHistory[]> {
  const token = getAuthToken();
  return await orgApiRequest<RankHistory[]>(
    `/admin/organizations/employees/${employeeId}/rank-history`,
    { token }
  );
}
