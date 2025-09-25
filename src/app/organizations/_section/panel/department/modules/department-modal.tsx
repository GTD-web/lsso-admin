"use client";

/**
 * 부서 생성/수정 모달
 */

import { useState, useEffect } from "react";
import { useOrganization } from "../../../../_context/organization-provider";
import {
  organizationsRepository,
  type CreateDepartmentDto,
  type UpdateDepartmentDto,
} from "@/api/v2";
import { DepartmentType } from "@/api/v2/admin/organizations/entity/organizations.entity";
import { Button } from "@/components/ui/button";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface DepartmentModalProps {
  onSuccess: () => void;
}

export const DepartmentModal = ({ onSuccess }: DepartmentModalProps) => {
  const {
    departments,
    isModalOpen,
    setIsModalOpen,
    editingItem,
    setEditingItem,
    setError,
  } = useOrganization();

  const [formData, setFormData] = useState({
    departmentName: "",
    departmentCode: "",
    type: DepartmentType.DEPARTMENT,
    parentDepartmentId: "",
    order: 1,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingItem) {
      setFormData({
        departmentName: editingItem.departmentName || "",
        departmentCode: editingItem.departmentCode || "",
        type: editingItem.type || DepartmentType.DEPARTMENT,
        parentDepartmentId: editingItem.parentDepartmentId || "",
        order: editingItem.order || 1,
      });
    } else {
      setFormData({
        departmentName: "",
        departmentCode: "",
        type: DepartmentType.DEPARTMENT,
        parentDepartmentId: "",
        order: 1,
      });
    }
  }, [editingItem, isModalOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const data = {
        ...formData,
        parentDepartmentId: formData.parentDepartmentId || undefined,
      };

      if (editingItem) {
        await organizationsRepository.updateDepartment(
          editingItem.id,
          data as UpdateDepartmentDto
        );
      } else {
        await organizationsRepository.createDepartment(
          data as CreateDepartmentDto
        );
      }

      handleClose();
      onSuccess();
    } catch (err) {
      console.error("부서 저장 실패:", err);
      setError("부서 저장에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "order" ? parseInt(value) || 1 : value,
    }));
  };

  // 사용 가능한 상위 부서 목록 (자기 자신과 하위 부서 제외)
  const getAvailableParentDepartments = () => {
    if (!editingItem) return departments;

    // 편집 중인 부서와 그 하위 부서들을 제외
    const excludeIds = new Set([editingItem.id]);

    const findChildIds = (parentId: string) => {
      departments.forEach((dept) => {
        if (dept.parentDepartmentId === parentId) {
          excludeIds.add(dept.id);
          findChildIds(dept.id);
        }
      });
    };

    findChildIds(editingItem.id);

    return departments.filter((dept) => !excludeIds.has(dept.id));
  };

  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* 배경 오버레이 */}
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75"
          onClick={handleClose}
        />

        {/* 모달 */}
        <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full">
          {/* 헤더 */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              {editingItem ? "부서 수정" : "부서 추가"}
            </h3>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* 폼 */}
          <form onSubmit={handleSubmit}>
            <div className="p-6 space-y-4">
              {/* 부서명 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  부서명 *
                </label>
                <input
                  type="text"
                  name="departmentName"
                  value={formData.departmentName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="부서명을 입력하세요"
                />
              </div>

              {/* 부서 코드 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  부서 코드 *
                </label>
                <input
                  type="text"
                  name="departmentCode"
                  value={formData.departmentCode}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="부서 코드를 입력하세요"
                />
              </div>

              {/* 부서 유형 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  부서 유형 *
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value={DepartmentType.COMPANY}>회사</option>
                  <option value={DepartmentType.DIVISION}>사업부</option>
                  <option value={DepartmentType.DEPARTMENT}>부서</option>
                  <option value={DepartmentType.TEAM}>팀</option>
                </select>
              </div>

              {/* 상위 부서 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  상위 부서
                </label>
                <select
                  name="parentDepartmentId"
                  value={formData.parentDepartmentId}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">최상위 부서</option>
                  {getAvailableParentDepartments().map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.departmentName} ({dept.departmentCode})
                    </option>
                  ))}
                </select>
              </div>

              {/* 정렬 순서 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  정렬 순서
                </label>
                <input
                  type="number"
                  name="order"
                  value={formData.order}
                  onChange={handleInputChange}
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* 버튼 */}
            <div className="flex justify-end space-x-3 px-6 py-4 border-t border-gray-200">
              <Button type="button" variant="secondary" onClick={handleClose}>
                취소
              </Button>
              <Button type="submit" isLoading={isSubmitting}>
                {editingItem ? "수정" : "추가"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
