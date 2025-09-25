"use client";

/**
 * 시스템 역할 관리 페이지
 */

import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/layout/admin-layout";
import { systemsRepository, type SystemRole, type System } from "@/api/v2";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PlusIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { formatDate } from "@/lib/utils";

export default function SystemRolesPage() {
  const [systemRoles, setSystemRoles] = useState<SystemRole[]>([]);
  const [systems, setSystems] = useState<System[]>([]);
  const [selectedSystemId, setSelectedSystemId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSystems();
    loadSystemRoles();
  }, []);

  useEffect(() => {
    loadSystemRoles();
  }, [selectedSystemId]);

  const loadSystems = async () => {
    try {
      const data = await systemsRepository.getSystems();
      setSystems(data || []);
    } catch (err) {
      console.error("시스템 목록 조회 실패:", err);
    }
  };

  const loadSystemRoles = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const params = selectedSystemId
        ? { systemId: selectedSystemId }
        : undefined;
      const data = await systemsRepository.getSystemRoles(params);
      setSystemRoles(data || []);
    } catch (err) {
      console.error("시스템 역할 목록 조회 실패:", err);
      setError("시스템 역할 목록을 불러오는데 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (systemRole: SystemRole) => {
    if (!confirm(`"${systemRole.roleName}" 역할을 삭제하시겠습니까?`)) {
      return;
    }

    try {
      await systemsRepository.deleteSystemRole(systemRole.id);
      await loadSystemRoles();
    } catch (err) {
      console.error("시스템 역할 삭제 실패:", err);
      setError("시스템 역할 삭제에 실패했습니다.");
    }
  };

  const getSystemName = (systemId: string) => {
    const system = systems.find((s) => s.id === systemId);
    return system ? system.name : "알 수 없음";
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <div className="text-gray-500">시스템 역할 목록을 불러오는 중...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* 페이지 헤더 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              시스템 역할 관리
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              시스템별 역할 및 권한을 관리합니다.
            </p>
          </div>

          <Button>
            <PlusIcon className="h-4 w-4 mr-2" />
            역할 추가
          </Button>
        </div>

        {/* 필터 */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium text-gray-700">
                시스템 필터:
              </label>
              <select
                value={selectedSystemId}
                onChange={(e) => setSelectedSystemId(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">전체 시스템</option>
                {systems.map((system) => (
                  <option key={system.id} value={system.id}>
                    {system.name}
                  </option>
                ))}
              </select>
            </div>
          </CardContent>
        </Card>

        {/* 에러 메시지 */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}

        {/* 시스템 역할 테이블 */}
        <Card>
          <CardContent className="p-0">
            {systemRoles.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        역할명
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        역할 코드
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        시스템
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        권한
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        상태
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        생성일
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        작업
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {systemRoles
                      .sort((a, b) => a.sortOrder - b.sortOrder)
                      .map((role) => (
                        <tr key={role.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {role.roleName}
                              </div>
                              {role.description && (
                                <div className="text-sm text-gray-500">
                                  {role.description}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-mono bg-gray-100 px-2 py-1 rounded text-xs">
                              {role.roleCode}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {getSystemName(role.systemId)}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-wrap gap-1">
                              {role.permissions
                                .slice(0, 3)
                                .map((permission, index) => (
                                  <span
                                    key={index}
                                    className="inline-flex px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded"
                                  >
                                    {permission}
                                  </span>
                                ))}
                              {role.permissions.length > 3 && (
                                <span className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                                  +{role.permissions.length - 3}개
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`
                            inline-flex px-2 py-1 text-xs font-semibold rounded-full
                            ${
                              role.isActive
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }
                          `}
                            >
                              {role.isActive ? "활성" : "비활성"}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatDate(role.createdAt)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex items-center justify-end space-x-2">
                              <Button variant="ghost" size="sm" title="수정">
                                <PencilIcon className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete(role)}
                                title="삭제"
                              >
                                <TrashIcon className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                {selectedSystemId
                  ? "해당 시스템에 등록된 역할이 없습니다."
                  : "등록된 시스템 역할이 없습니다."}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
