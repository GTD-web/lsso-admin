/**
 * 시스템 관리 레포지토리 구현체
 */

import { BaseModule } from "../../base/base.module";
import { ISystemsRepository } from "./systems.repository.interface";
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

export class SystemsRepository
  extends BaseModule
  implements ISystemsRepository
{
  constructor() {
    super("SystemsRepository");
  }

  // =============== 시스템 관리 ===============

  async getSystems(params?: SystemSearchParams): Promise<System[]> {
    const queryParams = new URLSearchParams();

    if (params?.search) {
      queryParams.append("search", params.search);
    }

    const queryString = queryParams.toString();
    const endpoint = `/admin/systems${queryString ? `?${queryString}` : ""}`;

    return this.makeRequest<System[]>(endpoint);
  }

  async searchSystems(query: string): Promise<System[]> {
    const queryParams = new URLSearchParams({ query });
    return this.makeRequest<System[]>(
      `/admin/systems/search?${queryParams.toString()}`
    );
  }

  async getSystemById(id: string): Promise<System> {
    return this.makeRequest<System>(`/admin/systems/${id}`);
  }

  async createSystem(data: CreateSystemDto): Promise<SystemCreateResponse> {
    return this.makeRequest<SystemCreateResponse>("/api/admin/systems", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateSystem(id: string, data: UpdateSystemDto): Promise<System> {
    return this.makeRequest<System>(`/admin/systems/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  async deleteSystem(id: string): Promise<void> {
    await this.makeRequest<void>(`/admin/systems/${id}`, {
      method: "DELETE",
    });
  }

  async regenerateApiKeys(id: string): Promise<SystemRegenerateResponse> {
    return this.makeRequest<SystemRegenerateResponse>(
      `/admin/systems/${id}/regenerate-keys`,
      {
        method: "POST",
      }
    );
  }

  // =============== 시스템 역할 관리 ===============

  async getSystemRoles(params?: SystemRoleSearchParams): Promise<SystemRole[]> {
    const queryParams = new URLSearchParams();

    if (params?.systemId) {
      queryParams.append("systemId", params.systemId);
    }

    const queryString = queryParams.toString();
    const endpoint = `/admin/system-roles${
      queryString ? `?${queryString}` : ""
    }`;

    return this.makeRequest<SystemRole[]>(endpoint);
  }

  async getSystemRoleById(id: string): Promise<SystemRole> {
    return this.makeRequest<SystemRole>(`/admin/system-roles/${id}`);
  }

  async createSystemRole(data: CreateSystemRoleDto): Promise<SystemRole> {
    return this.makeRequest<SystemRole>("/api/admin/system-roles", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateSystemRole(
    id: string,
    data: UpdateSystemRoleDto
  ): Promise<SystemRole> {
    return this.makeRequest<SystemRole>(`/admin/system-roles/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  async deleteSystemRole(id: string): Promise<void> {
    await this.makeRequest<void>(`/admin/system-roles/${id}`, {
      method: "DELETE",
    });
  }
}
