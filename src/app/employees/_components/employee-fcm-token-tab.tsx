"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  PlusIcon,
  TrashIcon,
  ChartBarIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import { formatDate } from "@/lib/utils";

interface FcmTokenInfo {
  id: string;
  fcmToken: string;
  deviceType: string;
  deviceInfo?: {
    model?: string;
    osVersion?: string;
    appVersion?: string;
    userAgent?: string;
    platform?: string;
  };
  isActive: boolean;
  relationCreatedAt: string;
  relationUpdatedAt: string;
}

interface EmployeeFcmTokenGroup {
  employeeId: string;
  employeeName: string;
  employeeNumber: string;
  employeeEmail: string;
  fcmTokens: FcmTokenInfo[];
  totalTokens: number;
  activeTokens: number;
  firstRelationCreatedAt: string;
  lastRelationUpdatedAt: string;
}

interface EmployeeFcmTokenResponse {
  employees: EmployeeFcmTokenGroup[];
  totalEmployees: number;
  totalRelations: number;
}

interface FcmTokenStats {
  totalRelations: number;
  activeTokens: number;
  inactiveTokens: number;
  employeeCount: number;
  fcmTokenCount: number;
}

export function EmployeeFcmTokenTab() {
  const [data, setData] = useState<EmployeeFcmTokenResponse | null>(null);
  const [stats, setStats] = useState<FcmTokenStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>("");

  useEffect(() => {
    loadData();
    loadStats();
  }, [selectedEmployeeId]);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const url = selectedEmployeeId
        ? `/api/admin/employee-fcm-tokens?employeeId=${selectedEmployeeId}`
        : `/api/admin/employee-fcm-tokens`;

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      if (!response.ok) {
        throw new Error("FCM 토큰 데이터 조회 실패");
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      console.error("FCM 토큰 데이터 조회 에러:", err);
      setError("FCM 토큰 데이터를 불러오는데 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await fetch("/api/admin/employee-fcm-tokens/stats", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      if (response.ok) {
        const result = await response.json();
        setStats(result);
      }
    } catch (err) {
      console.error("FCM 토큰 통계 조회 에러:", err);
    }
  };

  const handleDeleteRelation = async (relationId: string) => {
    if (!confirm("이 FCM 토큰 관계를 삭제하시겠습니까?")) {
      return;
    }

    try {
      const response = await fetch(
        `/api/admin/employee-fcm-tokens/${relationId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("FCM 토큰 관계 삭제 실패");
      }

      await loadData();
      await loadStats();
    } catch (err) {
      console.error("FCM 토큰 관계 삭제 에러:", err);
      alert("FCM 토큰 관계 삭제에 실패했습니다.");
    }
  };

  const handleDeleteAllEmployeeRelations = async (employeeId: string) => {
    if (!confirm("이 직원의 모든 FCM 토큰 관계를 삭제하시겠습니까?")) {
      return;
    }

    try {
      const response = await fetch(
        `/api/admin/employee-fcm-tokens/employee/${employeeId}/all`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("직원의 모든 FCM 토큰 관계 삭제 실패");
      }

      await loadData();
      await loadStats();
    } catch (err) {
      console.error("직원의 모든 FCM 토큰 관계 삭제 에러:", err);
      alert("직원의 모든 FCM 토큰 관계 삭제에 실패했습니다.");
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
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex items-center">
              <ChartBarIcon className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">전체 관계</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalRelations}
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
                <p className="text-sm font-medium text-gray-600">활성 토큰</p>
                <p className="text-2xl font-bold text-green-600">
                  {stats.activeTokens}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">비활성 토큰</p>
                <p className="text-2xl font-bold text-gray-500">
                  {stats.inactiveTokens}
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
                <p className="text-sm font-medium text-gray-600">직원 수</p>
                <p className="text-2xl font-bold text-purple-600">
                  {stats.employeeCount}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">FCM 토큰 수</p>
                <p className="text-2xl font-bold text-orange-600">
                  {stats.fcmTokenCount}
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
            관계 추가
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
                  FCM 토큰 정보
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
                      <div className="text-sm text-gray-500">
                        {employee.employeeEmail}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-2">
                      {employee.fcmTokens.slice(0, 3).map((token) => (
                        <div
                          key={token.id}
                          className="text-sm p-2 bg-gray-50 rounded"
                        >
                          <div className="flex items-center gap-2">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                token.isActive
                                  ? "bg-green-100 text-green-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {token.deviceType}
                            </span>
                            {token.isActive && (
                              <span className="text-green-500">●</span>
                            )}
                          </div>
                          {token.deviceInfo && (
                            <div className="text-xs text-gray-500 mt-1">
                              {token.deviceInfo.model}{" "}
                              {token.deviceInfo.osVersion}
                            </div>
                          )}
                        </div>
                      ))}
                      {employee.fcmTokens.length > 3 && (
                        <div className="text-xs text-gray-500">
                          +{employee.fcmTokens.length - 3}개 더
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div>
                      <div>전체: {employee.totalTokens}</div>
                      <div className="text-green-600">
                        활성: {employee.activeTokens}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div>
                      <div className="flex items-center gap-1">
                        <ClockIcon className="h-3 w-3" />
                        최초: {formatDate(employee.firstRelationCreatedAt)}
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        <ClockIcon className="h-3 w-3" />
                        최근: {formatDate(employee.lastRelationUpdatedAt)}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        handleDeleteAllEmployeeRelations(employee.employeeId)
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
            <p className="text-gray-500">FCM 토큰 관계가 없습니다.</p>
          </div>
        )}
      </div>

      {/* 요약 정보 */}
      {data && (
        <div className="text-sm text-gray-600 text-center">
          총 {data.totalEmployees}명의 직원, {data.totalRelations}개의 관계
        </div>
      )}
    </div>
  );
}
