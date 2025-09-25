"use client";

/**
 * 시스템 관리 페이지
 */

import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/layout/admin-layout";
import { systemsRepository, type System } from "@/api/v2";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  KeyIcon,
} from "@heroicons/react/24/outline";
import { formatDate } from "@/lib/utils";

export default function SystemsPage() {
  const [systems, setSystems] = useState<System[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSystems();
  }, []);

  const loadSystems = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await systemsRepository.getSystems();
      setSystems(data || []);
    } catch (err) {
      console.error("시스템 목록 조회 실패:", err);
      setError("시스템 목록을 불러오는데 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (system: System) => {
    if (!confirm(`"${system.name}" 시스템을 삭제하시겠습니까?`)) {
      return;
    }

    try {
      await systemsRepository.deleteSystem(system.id);
      await loadSystems();
    } catch (err) {
      console.error("시스템 삭제 실패:", err);
      setError("시스템 삭제에 실패했습니다.");
    }
  };

  const handleRegenerateKeys = async (system: System) => {
    if (!confirm(`"${system.name}" 시스템의 API 키를 재생성하시겠습니까?`)) {
      return;
    }

    try {
      const response = await systemsRepository.regenerateApiKeys(system.id);
      alert(`새로운 클라이언트 시크릿: ${response.originalSecret}`);
      await loadSystems();
    } catch (err) {
      console.error("API 키 재생성 실패:", err);
      setError("API 키 재생성에 실패했습니다.");
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <div className="text-gray-500">시스템 목록을 불러오는 중...</div>
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
            <h1 className="text-2xl font-bold text-gray-900">시스템 관리</h1>
            <p className="mt-1 text-sm text-gray-500">
              연동 시스템 및 API 키를 관리합니다.
            </p>
          </div>

          <Button>
            <PlusIcon className="h-4 w-4 mr-2" />
            시스템 추가
          </Button>
        </div>

        {/* 에러 메시지 */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}

        {/* 시스템 목록 */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {systems.map((system) => (
            <Card key={system.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{system.name}</CardTitle>
                  <span
                    className={`
                    inline-flex px-2 py-1 text-xs font-semibold rounded-full
                    ${
                      system.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }
                  `}
                  >
                    {system.isActive ? "활성" : "비활성"}
                  </span>
                </div>
              </CardHeader>

              <CardContent>
                <div className="space-y-3">
                  <div>
                    <div className="text-xs text-gray-500">도메인</div>
                    <div className="text-sm font-medium">{system.domain}</div>
                  </div>

                  <div>
                    <div className="text-xs text-gray-500">클라이언트 ID</div>
                    <div className="text-sm font-mono bg-gray-100 p-1 rounded text-xs">
                      {system.clientId}
                    </div>
                  </div>

                  <div>
                    <div className="text-xs text-gray-500">생성일</div>
                    <div className="text-sm">
                      {formatDate(system.createdAt)}
                    </div>
                  </div>

                  {system.description && (
                    <div>
                      <div className="text-xs text-gray-500">설명</div>
                      <div className="text-sm">{system.description}</div>
                    </div>
                  )}

                  {/* 작업 버튼들 */}
                  <div className="flex items-center justify-end space-x-2 pt-2 border-t border-gray-100">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRegenerateKeys(system)}
                      title="API 키 재생성"
                    >
                      <KeyIcon className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" title="수정">
                      <PencilIcon className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(system)}
                      title="삭제"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 빈 상태 */}
        {systems.length === 0 && !isLoading && (
          <Card>
            <CardContent className="text-center py-12">
              <div className="text-gray-500 mb-4">
                등록된 시스템이 없습니다.
              </div>
              <Button>
                <PlusIcon className="h-4 w-4 mr-2" />첫 번째 시스템 추가
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
}
