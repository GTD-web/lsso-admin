/**
 * 조직 관리 레포지토리 구현체
 */

import { BaseModule } from "../../base/base.module";
import { IOrganizationsRepository } from "./organizations.repository.interface";
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

export class OrganizationsRepository
  extends BaseModule
  implements IOrganizationsRepository
{
  constructor() {
    super("OrganizationsRepository");
  }

  // =============== 부서 관리 ===============

  async getDepartments(): Promise<DepartmentsResponseDto> {
    return this.makeRequest<DepartmentsResponseDto>(
      "/admin/organizations/departments"
    );
  }

  async getDepartmentById(id: string): Promise<Department> {
    return this.makeRequest<Department>(
      `/admin/organizations/departments/${id}`
    );
  }

  async createDepartment(data: CreateDepartmentDto): Promise<Department> {
    return this.makeRequest<Department>("/admin/organizations/departments", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateDepartment(
    id: string,
    data: UpdateDepartmentDto
  ): Promise<Department> {
    return this.makeRequest<Department>(
      `/admin/organizations/departments/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(data),
      }
    );
  }

  async deleteDepartment(id: string): Promise<void> {
    await this.makeRequest<void>(`/admin/organizations/departments/${id}`, {
      method: "DELETE",
    });
  }

  // =============== 직원 관리 ===============

  async getEmployees(): Promise<EmployeesResponseDto> {
    return this.makeRequest<EmployeesResponseDto>(
      "/admin/organizations/employees"
    );
  }

  async getEmployeeById(id: string): Promise<Employee> {
    return this.makeRequest<Employee>(`/admin/organizations/employees/${id}`);
  }

  async createEmployee(data: CreateEmployeeDto): Promise<Employee> {
    return this.makeRequest<Employee>("/admin/organizations/employees", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateEmployee(id: string, data: UpdateEmployeeDto): Promise<Employee> {
    return this.makeRequest<Employee>(`/admin/organizations/employees/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  // =============== 직책 관리 ===============

  async getPositions(): Promise<Position[]> {
    return this.makeRequest<Position[]>("/admin/organizations/positions");
  }

  async createPosition(data: CreatePositionDto): Promise<Position> {
    return this.makeRequest<Position>("/admin/organizations/positions", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updatePosition(id: string, data: UpdatePositionDto): Promise<Position> {
    return this.makeRequest<Position>(`/admin/organizations/positions/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deletePosition(id: string): Promise<void> {
    await this.makeRequest<void>(`/admin/organizations/positions/${id}`, {
      method: "DELETE",
    });
  }

  // =============== 직급 관리 ===============

  async getRanks(): Promise<Rank[]> {
    return this.makeRequest<Rank[]>("/admin/organizations/ranks");
  }

  async createRank(data: CreateRankDto): Promise<Rank> {
    return this.makeRequest<Rank>("/admin/organizations/ranks", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateRank(id: string, data: UpdateRankDto): Promise<Rank> {
    return this.makeRequest<Rank>(`/admin/organizations/ranks/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteRank(id: string): Promise<void> {
    await this.makeRequest<void>(`/admin/organizations/ranks/${id}`, {
      method: "DELETE",
    });
  }

  // =============== 직원 배치 관리 ===============

  async createEmployeeAssignment(
    data: CreateEmployeeAssignmentDto
  ): Promise<EmployeeAssignment> {
    return this.makeRequest<EmployeeAssignment>(
      "/admin/organizations/employee-assignments",
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    );
  }

  async updateEmployeeAssignment(
    id: string,
    data: UpdateEmployeeAssignmentDto
  ): Promise<EmployeeAssignment> {
    return this.makeRequest<EmployeeAssignment>(
      `/admin/organizations/employee-assignments/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(data),
      }
    );
  }

  async deleteEmployeeAssignment(id: string): Promise<void> {
    await this.makeRequest<void>(
      `/admin/organizations/employee-assignments/${id}`,
      {
        method: "DELETE",
      }
    );
  }

  async getEmployeeAssignments(
    employeeId: string
  ): Promise<EmployeeAssignment[]> {
    return this.makeRequest<EmployeeAssignment[]>(
      `/admin/organizations/employees/${employeeId}/assignments`
    );
  }

  async getAllEmployeeAssignments(): Promise<EmployeeAssignment[]> {
    try {
      // 모든 직원 조회
      const employeesResponse = await this.getEmployees();

      if (
        !employeesResponse.employees ||
        employeesResponse.employees.length === 0
      ) {
        return [];
      }

      // 모든 직원의 배치 정보를 병렬로 조회
      const allAssignments: EmployeeAssignment[] = [];
      const chunkSize = 5;

      for (let i = 0; i < employeesResponse.employees.length; i += chunkSize) {
        const chunk = employeesResponse.employees.slice(i, i + chunkSize);
        const promises = chunk.map(async (employee) => {
          try {
            return await this.getEmployeeAssignments(employee.id);
          } catch (error) {
            console.warn(
              `직원 ${employee.name}(${employee.id})의 배치 정보 조회 실패:`,
              error
            );
            return [];
          }
        });

        const results = await Promise.all(promises);
        results.forEach((assignments) => {
          allAssignments.push(...assignments);
        });

        // 요청 간 지연시간
        if (i + chunkSize < employeesResponse.employees.length) {
          await new Promise((resolve) => setTimeout(resolve, 100));
        }
      }

      return allAssignments;
    } catch (error) {
      console.error("전체 직원 배치 현황 조회 에러:", error);
      throw error;
    }
  }

  // =============== 직급 이력 관리 ===============

  async promoteEmployee(
    employeeId: string,
    data: RankPromotionDto
  ): Promise<RankHistory> {
    return this.makeRequest<RankHistory>(
      `/admin/organizations/employees/${employeeId}/rank-promotion`,
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    );
  }

  async getEmployeeRankHistory(employeeId: string): Promise<RankHistory[]> {
    return this.makeRequest<RankHistory[]>(
      `/admin/organizations/employees/${employeeId}/rank-history`
    );
  }
}
