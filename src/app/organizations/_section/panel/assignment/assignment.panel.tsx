"use client";

/**
 * 직원 배치 관리 패널
 */

import { useEffect, useState } from "react";
import { useOrganization } from "../../../_context/organization-provider";
import { organizationsRepository } from "@/api/v2";
import { Button } from "@/components/ui/button";
import { PlusIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { formatDate } from "@/lib/utils";

export const AssignmentPanel = () => {
  const {
    assignments,
    setAssignments,
    employees,
    setEmployees,
    departments,
    setDepartments,
    positions,
    setPositions,
    isLoading,
    setIsLoading,
    error,
    setError,
    setIsModalOpen,
    setEditingItem,
  } = useOrganization();

  const [assignmentsLoaded, setAssignmentsLoaded] = useState(false);
  const [loadingAssignments, setLoadingAssignments] = useState(false);

  useEffect(() => {
    loadReferenceData();
  }, []);

  const loadReferenceData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // 참조 데이터 병렬 로딩
      const [employeesRes, departmentsRes, positionsRes] = await Promise.all([
        organizationsRepository.getEmployees(),
        organizationsRepository.getDepartments(),
        organizationsRepository.getPositions(),
      ]);

      setEmployees(employeesRes.employees || []);
      setDepartments(departmentsRes.departments || []);
      setPositions(positionsRes || []);
    } catch (err) {
      console.error("참조 데이터 로딩 실패:", err);
      setError("참조 데이터를 불러오는데 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadAssignments = async () => {
    setLoadingAssignments(true);
    setError(null);

    try {
      const data = await organizationsRepository.getAllEmployeeAssignments();
      setAssignments(data || []);
      setAssignmentsLoaded(true);
    } catch (err) {
      console.error("배치 데이터 로딩 실패:", err);
      setError("배치 데이터를 불러오는데 실패했습니다.");
    } finally {
      setLoadingAssignments(false);
    }
  };

  const handleCreate = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleEdit = (assignment: any) => {
    setEditingItem(assignment);
    setIsModalOpen(true);
  };

  const handleDelete = async (assignment: any) => {
    const employeeName = getEmployeeName(assignment.employeeId);
    const departmentName = getDepartmentName(assignment.departmentId);

    if (
      !confirm(`${employeeName}님의 ${departmentName} 배치를 해제하시겠습니까?`)
    ) {
      return;
    }

    try {
      await organizationsRepository.deleteEmployeeAssignment(assignment.id);
      await handleLoadAssignments();
    } catch (err) {
      console.error("배치 해제 실패:", err);
      setError("배치 해제에 실패했습니다.");
    }
  };

  const getEmployeeName = (employeeId: string) => {
    const employee = employees.find((emp) => emp.id === employeeId);
    return employee
      ? `${employee.name} (${employee.employeeNumber})`
      : "알 수 없음";
  };

  const getDepartmentName = (departmentId: string) => {
    const department = departments.find((dept) => dept.id === departmentId);
    return department ? department.departmentName : "알 수 없음";
  };

  const getPositionName = (positionId: string) => {
    const position = positions.find((pos) => pos.id === positionId);
    return position ? position.positionTitle : "알 수 없음";
  };

  if (isLoading) {
    return (
      <div className="p-6 text-center">
        <div className="text-gray-500">참조 데이터를 불러오는 중...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            직원 배치 관리
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            직원의 부서/직책 배치를 관리합니다.
          </p>
        </div>

        <div className="flex space-x-3">
          {!assignmentsLoaded && (
            <Button
              variant="outline"
              onClick={handleLoadAssignments}
              isLoading={loadingAssignments}
            >
              배치 데이터 로드
            </Button>
          )}

          {assignmentsLoaded && (
            <Button onClick={handleCreate}>
              <PlusIcon className="h-4 w-4 mr-2" />
              배치 추가
            </Button>
          )}
        </div>
      </div>

      {/* 에러 메시지 */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}

      {/* 배치 데이터가 로드되지 않은 경우 */}
      {!assignmentsLoaded ? (
        <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
          <div className="text-gray-500 mb-4">
            배치 데이터를 불러오려면 "배치 데이터 로드" 버튼을 클릭하세요.
          </div>
          <div className="text-sm text-gray-400">
            배치 데이터는 모든 직원의 정보를 조회하므로 시간이 걸릴 수 있습니다.
          </div>
        </div>
      ) : (
        /* 배치 테이블 */
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          {assignments.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      직원
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      부서
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      직책
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      관리자
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      배치일
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      작업
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {assignments.map((assignment) => (
                    <tr key={assignment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {getEmployeeName(assignment.employeeId)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {getDepartmentName(assignment.departmentId)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {getPositionName(assignment.positionId)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`
                          inline-flex px-2 py-1 text-xs font-semibold rounded-full
                          ${
                            assignment.isManager
                              ? "bg-blue-100 text-blue-800"
                              : "bg-gray-100 text-gray-800"
                          }
                        `}
                        >
                          {assignment.isManager ? "관리자" : "일반"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(assignment.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(assignment)}
                          >
                            <PencilIcon className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(assignment)}
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
            <div className="p-8 text-center text-gray-500">
              등록된 배치가 없습니다.
            </div>
          )}
        </div>
      )}

      {/* 모달은 추후 구현 */}
      {/* <AssignmentModal onSuccess={handleLoadAssignments} /> */}
    </div>
  );
};
