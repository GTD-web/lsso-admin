"use client";

/**
 * 로그 관리 페이지
 */

import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/layout/admin-layout";
import { logsRepository, type Log, type LogFilterDto } from "@/api/v2";
import { SortDirection } from "@/api/v2/admin/logs/entity/logs.entity";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { MagnifyingGlassIcon, FunnelIcon } from "@heroicons/react/24/outline";
import { formatDate, formatRelativeTime } from "@/lib/utils";

export default function LogsPage() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // 필터 상태
  const [filters, setFilters] = useState<LogFilterDto>({
    page: 1,
    limit: 20,
    sortBy: "requestTimestamp",
    sortDirection: SortDirection.DESC,
  });

  useEffect(() => {
    loadLogs();
  }, [page]);

  const loadLogs = async (filterData?: LogFilterDto) => {
    setIsLoading(true);
    setError(null);

    try {
      const params = filterData || { page, limit };
      const response = await logsRepository.getLogs(params);

      setLogs(response.logs || []);
      setTotal(response.total || 0);
      setPage(response.page || 1);
    } catch (err) {
      console.error("로그 목록 조회 실패:", err);
      setError("로그 목록을 불러오는데 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilter = async () => {
    const filterData = { ...filters, page: 1 };
    setFilters(filterData);

    try {
      setIsLoading(true);
      const response = await logsRepository.filterLogs(filterData);
      setLogs(response.logs || []);
      setTotal(response.total || 0);
      setPage(1);
    } catch (err) {
      console.error("로그 필터링 실패:", err);
      setError("로그 필터링에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (key: keyof LogFilterDto, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const getStatusColor = (statusCode: number) => {
    if (statusCode >= 200 && statusCode < 300)
      return "text-green-600 bg-green-100";
    if (statusCode >= 300 && statusCode < 400)
      return "text-blue-600 bg-blue-100";
    if (statusCode >= 400 && statusCode < 500)
      return "text-orange-600 bg-orange-100";
    if (statusCode >= 500) return "text-red-600 bg-red-100";
    return "text-gray-600 bg-gray-100";
  };

  const getMethodColor = (method: string) => {
    switch (method.toUpperCase()) {
      case "GET":
        return "text-blue-700 bg-blue-100";
      case "POST":
        return "text-green-700 bg-green-100";
      case "PUT":
        return "text-orange-700 bg-orange-100";
      case "PATCH":
        return "text-yellow-700 bg-yellow-100";
      case "DELETE":
        return "text-red-700 bg-red-100";
      default:
        return "text-gray-700 bg-gray-100";
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* 페이지 헤더 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">로그 관리</h1>
            <p className="mt-1 text-sm text-gray-500">
              시스템 로그를 조회하고 분석합니다. (총 {total.toLocaleString()}개)
            </p>
          </div>

          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
          >
            <FunnelIcon className="h-4 w-4 mr-2" />
            필터
          </Button>
        </div>

        {/* 필터 패널 */}
        {showFilters && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">로그 필터</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    시작일
                  </label>
                  <input
                    type="datetime-local"
                    value={filters.startDate || ""}
                    onChange={(e) =>
                      handleFilterChange("startDate", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    종료일
                  </label>
                  <input
                    type="datetime-local"
                    value={filters.endDate || ""}
                    onChange={(e) =>
                      handleFilterChange("endDate", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    HTTP 메서드
                  </label>
                  <select
                    value={filters.method || ""}
                    onChange={(e) =>
                      handleFilterChange("method", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">전체</option>
                    <option value="GET">GET</option>
                    <option value="POST">POST</option>
                    <option value="PUT">PUT</option>
                    <option value="PATCH">PATCH</option>
                    <option value="DELETE">DELETE</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    상태 코드
                  </label>
                  <input
                    type="number"
                    placeholder="예: 200, 404, 500"
                    value={filters.statusCode || ""}
                    onChange={(e) =>
                      handleFilterChange(
                        "statusCode",
                        e.target.value ? parseInt(e.target.value) : undefined
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    IP 주소
                  </label>
                  <input
                    type="text"
                    placeholder="예: 192.168.1.1"
                    value={filters.ip || ""}
                    onChange={(e) => handleFilterChange("ip", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    시스템
                  </label>
                  <input
                    type="text"
                    placeholder="시스템명"
                    value={filters.system || ""}
                    onChange={(e) =>
                      handleFilterChange("system", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="flex items-center">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.errorsOnly || false}
                      onChange={(e) =>
                        handleFilterChange("errorsOnly", e.target.checked)
                      }
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">에러만 표시</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-4">
                <Button
                  variant="outline"
                  onClick={() => setFilters({ page: 1, limit: 20 })}
                >
                  초기화
                </Button>
                <Button onClick={handleFilter}>
                  <MagnifyingGlassIcon className="h-4 w-4 mr-2" />
                  검색
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 에러 메시지 */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}

        {/* 로그 테이블 */}
        <Card>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="text-center py-12 text-gray-500">
                로그를 불러오는 중...
              </div>
            ) : logs.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        시간
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        메서드/URL
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        상태
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        응답시간
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        IP/시스템
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {logs.map((log) => (
                      <tr
                        key={log.id}
                        className={`hover:bg-gray-50 ${
                          log.isError ? "bg-red-50" : ""
                        }`}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {formatRelativeTime(log.requestTimestamp)}
                          </div>
                          <div className="text-xs text-gray-500">
                            {formatDate(log.requestTimestamp, "time")}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded ${getMethodColor(
                                log.method
                              )}`}
                            >
                              {log.method}
                            </span>
                            <div className="text-sm text-gray-900 truncate max-w-xs">
                              {log.url}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded ${getStatusColor(
                              log.statusCode
                            )}`}
                          >
                            {log.statusCode}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <span
                            className={
                              log.responseTime > 1000
                                ? "text-red-600 font-medium"
                                : ""
                            }
                          >
                            {log.responseTime}ms
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{log.ip}</div>
                          {log.system && (
                            <div className="text-xs text-gray-500">
                              {log.system}
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                조건에 맞는 로그가 없습니다.
              </div>
            )}
          </CardContent>
        </Card>

        {/* 페이지네이션 */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              {(page - 1) * limit + 1}-{Math.min(page * limit, total)} / {total}
              개 표시
            </div>

            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
              >
                이전
              </Button>

              <span className="px-3 py-1 text-sm text-gray-700">
                {page} / {totalPages}
              </span>

              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => setPage(page + 1)}
              >
                다음
              </Button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
