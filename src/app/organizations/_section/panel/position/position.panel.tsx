"use client";

/**
 * 직책 관리 패널
 */

import { useEffect } from "react";
import { useOrganization } from "../../../_context/organization-provider";
import { organizationsRepository } from "@/api/v2";
import { Button } from "@/components/ui/button";
import { PlusIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

export const PositionPanel = () => {
  const {
    positions,
    setPositions,
    isLoading,
    setIsLoading,
    error,
    setError,
    setIsModalOpen,
    setEditingItem,
  } = useOrganization();

  useEffect(() => {
    loadPositions();
  }, []);

  const loadPositions = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await organizationsRepository.getPositions();
      setPositions(data || []);
    } catch (err) {
      console.error("직책 목록 조회 실패:", err);
      setError("직책 목록을 불러오는데 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleEdit = (position: any) => {
    setEditingItem(position);
    setIsModalOpen(true);
  };

  const handleDelete = async (position: any) => {
    if (!confirm(`"${position.positionTitle}" 직책을 삭제하시겠습니까?`)) {
      return;
    }

    try {
      await organizationsRepository.deletePosition(position.id);
      await loadPositions();
    } catch (err) {
      console.error("직책 삭제 실패:", err);
      setError("직책 삭제에 실패했습니다.");
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 text-center">
        <div className="text-gray-500">직책 목록을 불러오는 중...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">직책 관리</h2>
          <p className="text-sm text-gray-500 mt-1">
            직책 및 권한을 관리합니다.
          </p>
        </div>

        <Button onClick={handleCreate}>
          <PlusIcon className="h-4 w-4 mr-2" />
          직책 추가
        </Button>
      </div>

      {/* 에러 메시지 */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}

      {/* 직책 테이블 */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        {positions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    직책명
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    직책 코드
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    레벨
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    관리 권한
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    작업
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {positions
                  .sort((a, b) => a.level - b.level)
                  .map((position) => (
                    <tr key={position.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {position.positionTitle}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {position.positionCode}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {position.level}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`
                        inline-flex px-2 py-1 text-xs font-semibold rounded-full
                        ${
                          position.hasManagementAuthority
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }
                      `}
                        >
                          {position.hasManagementAuthority ? "관리자" : "일반"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(position)}
                          >
                            <PencilIcon className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(position)}
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
            등록된 직책이 없습니다.
          </div>
        )}
      </div>

      {/* 모달은 추후 구현 */}
      {/* <PositionModal onSuccess={loadPositions} /> */}
    </div>
  );
};
