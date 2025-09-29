"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  PlusIcon,
  TrashIcon,
  ShieldCheckIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import { formatDate } from "@/lib/utils";

interface SystemRoleInfo {
  id: string;
  roleName: string;
  roleCode: string;
  systemName: string;
  assignedAt: string;
  updatedAt: string;
}

interface EmployeeSystemRoleGroup {
  employeeId: string;
  employeeName: string;
  employeeNumber: string;
  systemRoles: SystemRoleInfo[];
  totalRoles: number;
  firstRoleAssignedAt: string;
  lastRoleUpdatedAt: string;
}

interface EmployeeSystemRoleResponse {
  employees: EmployeeSystemRoleGroup[];
  totalEmployees: number;
  totalRelations: number;
}

export function EmployeeSystemRoleTab() {
  const [data, setData] = useState<EmployeeSystemRoleResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>("");

  useEffect(() => {
    loadData();
  }, [selectedEmployeeId]);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const url = selectedEmployeeId
        ? `/api/admin/employee-system-roles?employeeId=${selectedEmployeeId}`
        : `/api/admin/employee-system-roles`;

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      if (!response.ok) {
        throw new Error("시스템 역할 데이터 조회 실패");
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      console.error("시스템 역할 데이터 조회 에러:", err);
      setError("시스템 역할 데이터를 불러오는데 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAllEmployeeRoles = async (employeeId: string) => {
    if (!confirm("이 직원의 모든 시스템 역할을 해제하시겠습니까?")) {
      return;
    }

    try {
      const response = await fetch(
        `/api/admin/employee-system-roles/employee/${employeeId}/all`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("직원의 모든 시스템 역할 해제 실패");
      }

      await loadData();
    } catch (err) {
      console.error("직원의 모든 시스템 역할 해제 에러:", err);
      alert("직원의 모든 시스템 역할 해제에 실패했습니다.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">{error}</p>
        <Button onClick={loadData} className="mt-4">
          다시 시도
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 통계 카드 */}
      {data && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex items-center">
              <ShieldCheckIcon className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">전체 관계</p>
                <p className="text-2xl font-bold text-gray-900">
                  {data.totalRelations}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">직원 수</p>
                <p className="text-2xl font-bold text-green-600">
                  {data.totalEmployees}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  평균 역할 수
                </p>
                <p className="text-2xl font-bold text-purple-600">
                  {data.totalEmployees > 0
                    ? Math.round(
                        (data.totalRelations / data.totalEmployees) * 100
                      ) / 100
                    : 0}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 액션 바 */}
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <Button>
            <PlusIcon className="h-4 w-4 mr-2" />
            역할 할당
          </Button>
        </div>
        <div className="flex gap-2">
          <select
            value={selectedEmployeeId}
            onChange={(e) => setSelectedEmployeeId(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="">전체 직원</option>
            {data?.employees.map((emp) => (
              <option key={emp.employeeId} value={emp.employeeId}>
                {emp.employeeName} ({emp.employeeNumber})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 데이터 테이블 */}
      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  직원 정보
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  시스템 역할
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  통계
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  날짜 정보
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  작업
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data?.employees.map((employee) => (
                <tr key={employee.employeeId}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {employee.employeeName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {employee.employeeNumber}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-2">
                      {employee.systemRoles.slice(0, 4).map((role) => (
                        <div
                          key={role.id}
                          className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mr-2 mb-1"
                        >
                          <ShieldCheckIcon className="h-3 w-3 mr-1" />
                          {role.systemName}: {role.roleName}
                        </div>
                      ))}
                      {employee.systemRoles.length > 4 && (
                        <div className="text-xs text-gray-500">
                          +{employee.systemRoles.length - 4}개 더
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div>
                      <div>전체 역할: {employee.totalRoles}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div>
                      <div className="flex items-center gap-1">
                        <ClockIcon className="h-3 w-3" />
                        최초 할당: {formatDate(employee.firstRoleAssignedAt)}
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        <ClockIcon className="h-3 w-3" />
                        최근 수정: {formatDate(employee.lastRoleUpdatedAt)}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        handleDeleteAllEmployeeRoles(employee.employeeId)
                      }
                      className="text-red-600 hover:text-red-900"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {data?.employees.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">시스템 역할 할당이 없습니다.</p>
          </div>
        )}
      </div>

      {/* 요약 정보 */}
      {data && (
        <div className="text-sm text-gray-600 text-center">
          총 {data.totalEmployees}명의 직원, {data.totalRelations}개의 역할 할당
        </div>
      )}
    </div>
  );
}
