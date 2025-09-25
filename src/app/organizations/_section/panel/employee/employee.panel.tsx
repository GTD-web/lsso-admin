"use client";

/**
 * 직원 관리 패널
 */

import { useEffect } from "react";
import { useOrganization } from "../../../_context/organization-provider";
import { organizationsRepository } from "@/api/v2";
import { Button } from "@/components/ui/button";
import { PlusIcon, PencilIcon } from "@heroicons/react/24/outline";
import { formatDate } from "@/lib/utils";

export const EmployeePanel = () => {
  const {
    employees,
    setEmployees,
    isLoading,
    setIsLoading,
    error,
    setError,
    setIsModalOpen,
    setEditingItem,
  } = useOrganization();

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await organizationsRepository.getEmployees();
      setEmployees(response.employees || []);
    } catch (err) {
      console.error("직원 목록 조회 실패:", err);
      setError("직원 목록을 불러오는데 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleEdit = (employee: any) => {
    setEditingItem(employee);
    setIsModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="p-6 text-center">
        <div className="text-gray-500">직원 목록을 불러오는 중...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">직원 관리</h2>
          <p className="text-sm text-gray-500 mt-1">직원 정보를 관리합니다.</p>
        </div>

        <Button onClick={handleCreate}>
          <PlusIcon className="h-4 w-4 mr-2" />
          직원 추가
        </Button>
      </div>

      {/* 에러 메시지 */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}

      {/* 직원 테이블 */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        {employees.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    직원 정보
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    연락처
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    입사일
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    상태
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    작업
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {employees.map((employee) => (
                  <tr key={employee.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {employee.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {employee.employeeNumber}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm text-gray-900">
                          {employee.email}
                        </div>
                        {employee.phoneNumber && (
                          <div className="text-sm text-gray-500">
                            {employee.phoneNumber}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(employee.hireDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`
                        inline-flex px-2 py-1 text-xs font-semibold rounded-full
                        ${
                          employee.status === "재직중"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }
                      `}
                      >
                        {employee.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(employee)}
                      >
                        <PencilIcon className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-gray-500">
            등록된 직원이 없습니다.
          </div>
        )}
      </div>

      {/* 모달은 추후 구현 */}
      {/* <EmployeeModal onSuccess={loadEmployees} /> */}
    </div>
  );
};
