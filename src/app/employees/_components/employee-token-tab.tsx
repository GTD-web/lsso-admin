"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  PlusIcon,
  TrashIcon,
  KeyIcon,
  ClockIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/outline";
import { formatDate } from "@/lib/utils";

interface TokenInfo {
  id: string;
  accessTokenMasked: string;
  tokenExpiresAt: string;
  clientInfo?: string;
  isActive: boolean;
  tokenCreatedAt: string;
  lastAccess?: string;
}

interface EmployeeTokenGroup {
  employeeId: string;
  employeeName: string;
  employeeNumber: string;
  employeeEmail: string;
  tokens: TokenInfo[];
  totalTokens: number;
  activeTokens: number;
  firstTokenCreatedAt: string;
  lastTokenActivity: string;
}

interface EmployeeTokenResponse {
  employees: EmployeeTokenGroup[];
  totalEmployees: number;
  totalRelations: number;
}

export function EmployeeTokenTab() {
  const [data, setData] = useState<EmployeeTokenResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>("");
  const [showTokens, setShowTokens] = useState(false);

  useEffect(() => {
    loadData();
  }, [selectedEmployeeId]);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const url = selectedEmployeeId
        ? `/api/admin/employee-tokens?employeeId=${selectedEmployeeId}`
        : `/api/admin/employee-tokens`;

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      if (!response.ok) {
        throw new Error("토큰 데이터 조회 실패");
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      console.error("토큰 데이터 조회 에러:", err);
      setError("토큰 데이터를 불러오는데 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const isTokenExpired = (expiresAt: string) => {
    return new Date(expiresAt) < new Date();
  };

  const getTokenStatus = (token: TokenInfo) => {
    if (!token.isActive) return "비활성";
    if (isTokenExpired(token.tokenExpiresAt)) return "만료됨";
    return "활성";
  };

  const getTokenStatusColor = (token: TokenInfo) => {
    const status = getTokenStatus(token);
    switch (status) {
      case "활성":
        return "bg-green-100 text-green-800";
      case "만료됨":
        return "bg-red-100 text-red-800";
      case "비활성":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex items-center">
              <KeyIcon className="h-8 w-8 text-blue-600" />
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
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  활성 토큰 비율
                </p>
                <p className="text-2xl font-bold text-blue-600">
                  {data.totalRelations > 0
                    ? Math.round(
                        (data.employees.reduce(
                          (acc, emp) => acc + emp.activeTokens,
                          0
                        ) /
                          data.totalRelations) *
                          100
                      ) + "%"
                    : "0%"}
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
                  평균 토큰 수
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
            관계 추가
          </Button>
          <Button variant="outline" onClick={() => setShowTokens(!showTokens)}>
            {showTokens ? (
              <EyeSlashIcon className="h-4 w-4 mr-2" />
            ) : (
              <EyeIcon className="h-4 w-4 mr-2" />
            )}
            {showTokens ? "토큰 숨기기" : "토큰 보기"}
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
                  토큰 정보
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
                      {employee.tokens.slice(0, 3).map((token) => (
                        <div
                          key={token.id}
                          className="text-sm p-2 bg-gray-50 rounded"
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTokenStatusColor(
                                token
                              )}`}
                            >
                              {getTokenStatus(token)}
                            </span>
                          </div>
                          {showTokens && (
                            <div className="font-mono text-xs text-gray-600 bg-gray-100 p-1 rounded">
                              {token.accessTokenMasked}
                            </div>
                          )}
                          <div className="text-xs text-gray-500 mt-1">
                            만료: {formatDate(token.tokenExpiresAt)}
                          </div>
                          {token.clientInfo && (
                            <div className="text-xs text-gray-400 truncate">
                              {token.clientInfo.slice(0, 50)}...
                            </div>
                          )}
                        </div>
                      ))}
                      {employee.tokens.length > 3 && (
                        <div className="text-xs text-gray-500">
                          +{employee.tokens.length - 3}개 더
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
                        최초: {formatDate(employee.firstTokenCreatedAt)}
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        <ClockIcon className="h-3 w-3" />
                        최근 활동: {formatDate(employee.lastTokenActivity)}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Button
                      variant="ghost"
                      size="sm"
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
            <p className="text-gray-500">토큰 관계가 없습니다.</p>
          </div>
        )}
      </div>

      {/* 요약 정보 */}
      {data && (
        <div className="text-sm text-gray-600 text-center">
          총 {data.totalEmployees}명의 직원, {data.totalRelations}개의 토큰 관계
        </div>
      )}
    </div>
  );
}
