"use client";

import { useState, useEffect } from "react";
import { Card, Button, Alert, Modal } from "../components/LumirMock";
import { useLogs } from "../hooks/useLogs";
import { Log, LogFilterParams } from "../api/logs";
import { SortDirection } from "../hooks/useLogs";
import AdminLayout from "../components/AdminLayout";

// Debounce hook for inputs
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default function LogsPage() {
  const {
    logs,
    isLoading,
    error,
    filterByParams,
    formatDate,
    formatTime,
    getStatusColor,
    getMethodColor,
  } = useLogs();

  const [filter, setFilter] = useState<LogFilterParams>({
    page: 1,
    limit: 10,
    method: "",
    statusCode: undefined,
    errorsOnly: false,
    sortBy: "requestTimestamp",
    sortDirection: SortDirection.DESC,
    url: "",
    ip: "",
    host: "",
    startDate: undefined,
    endDate: undefined,
  });

  // Use debounced filter for text fields to avoid excessive API calls
  const [textInputs, setTextInputs] = useState({
    url: "",
    ip: "",
    host: "",
  });

  const debouncedTextInputs = useDebounce(textInputs, 500);

  const [selectedLog, setSelectedLog] = useState<Log | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [isFiltering, setIsFiltering] = useState(false);

  // Apply debounced text inputs to filter
  useEffect(() => {
    setFilter((prev) => ({
      ...prev,
      url: debouncedTextInputs.url,
      ip: debouncedTextInputs.ip,
      host: debouncedTextInputs.host,
    }));
  }, [debouncedTextInputs]);

  // 페이지 로드 시 로그 목록 불러오기
  useEffect(() => {
    fetchLogs();
  }, [filter]);

  const fetchLogs = async () => {
    setIsFiltering(true);
    const result = await filterByParams(filter);
    if (result.meta) {
      setTotalPages(result.meta.totalPages);
      setTotalItems(result.meta.total);
    }
    setIsFiltering(false);
  };

  // 필터 변경 처리
  const handleFilterChange = (key: keyof LogFilterParams, value: unknown) => {
    // 필터 변경 시 1페이지로 돌아감
    if (key !== "page") {
      setFilter((prev) => ({
        ...prev,
        [key]: value,
        page: 1,
      }));
    } else {
      setFilter((prev) => ({
        ...prev,
        [key]: typeof value === "number" ? value : 1,
      }));
    }
  };

  // 필터 초기화
  const resetFilters = () => {
    setTextInputs({
      url: "",
      ip: "",
      host: "",
    });
    setFilter({
      page: 1,
      limit: 10,
      method: "",
      statusCode: undefined,
      errorsOnly: false,
      sortBy: "requestTimestamp",
      sortDirection: SortDirection.DESC,
      url: "",
      ip: "",
      host: "",
      startDate: undefined,
      endDate: undefined,
    });
  };

  // 로그 상세 정보 모달 열기
  const handleViewLog = (log: Log) => {
    setSelectedLog(log);
    setIsModalOpen(true);
  };

  // 페이지네이션 컨트롤
  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    handleFilterChange("page", page);
  };

  // 상태 코드 텍스트
  const getStatusText = (statusCode?: number): string => {
    if (!statusCode) return "Unknown";

    if (statusCode >= 200 && statusCode < 300) {
      return "성공";
    } else if (statusCode >= 400 && statusCode < 500) {
      return "클라이언트 오류";
    } else if (statusCode >= 500) {
      return "서버 오류";
    }

    return "기타";
  };

  // JSON 데이터 표시 컴포넌트
  const JsonView = ({
    data,
  }: {
    data: Record<string, unknown> | undefined;
  }) => {
    if (!data || Object.keys(data).length === 0) {
      return <div className="text-gray-500 italic">비어 있음</div>;
    }

    return (
      <pre className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md overflow-auto max-h-60 text-sm whitespace-pre-wrap break-all">
        {JSON.stringify(data, null, 2)}
      </pre>
    );
  };

  // 날짜 값 변환 함수
  const formatDateInput = (date: Date | undefined): string => {
    if (!date) return "";
    return date.toISOString().split("T")[0];
  };

  const handleDateChange = (field: "startDate" | "endDate", value: string) => {
    if (value) {
      handleFilterChange(field, new Date(value));
    } else {
      handleFilterChange(field, undefined);
    }
  };

  // 텍스트 필터 입력 처리
  const handleTextInputChange = (
    key: keyof typeof textInputs,
    value: string
  ) => {
    setTextInputs((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <AdminLayout title="로그 관리">
      <div className="flex-1 p-8 bg-slate-50 dark:bg-slate-900 overflow-auto">
        <div className="max-w-7xl mx-auto">
          {/* 필터 영역 */}
          <Card className="mb-6 p-4">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-medium">
                로그 필터
                {isFiltering && (
                  <span className="ml-2 inline-block w-4 h-4">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
                  </span>
                )}
              </h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-2">
              {/* 날짜 범위 필터 */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  시작일
                </label>
                <input
                  type="date"
                  value={formatDateInput(filter.startDate as Date | undefined)}
                  onChange={(e) =>
                    handleDateChange("startDate", e.target.value)
                  }
                  className="w-full rounded-md border border-gray-300 text-sm px-2 py-1 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  종료일
                </label>
                <input
                  type="date"
                  value={formatDateInput(filter.endDate as Date | undefined)}
                  onChange={(e) => handleDateChange("endDate", e.target.value)}
                  className="w-full rounded-md border border-gray-300 text-sm px-2 py-1 bg-white"
                />
              </div>

              {/* HTTP 메소드 필터 */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  HTTP 메소드
                </label>
                <select
                  value={filter.method || ""}
                  onChange={(e) =>
                    handleFilterChange("method", e.target.value || undefined)
                  }
                  className="w-full rounded-md border border-gray-300 text-sm px-2 py-1 bg-white"
                >
                  <option value="">전체</option>
                  <option value="GET">GET</option>
                  <option value="POST">POST</option>
                  <option value="PUT">PUT</option>
                  <option value="DELETE">DELETE</option>
                </select>
              </div>

              {/* 상태 코드 필터 */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  상태 코드
                </label>
                <select
                  value={filter.statusCode?.toString() || ""}
                  onChange={(e) =>
                    handleFilterChange(
                      "statusCode",
                      e.target.value ? parseInt(e.target.value) : undefined
                    )
                  }
                  className="w-full rounded-md border border-gray-300 text-sm px-2 py-1 bg-white"
                >
                  <option value="">전체</option>
                  <option value="200">200 (OK)</option>
                  <option value="201">201 (Created)</option>
                  <option value="400">400 (Bad Request)</option>
                  <option value="401">401 (Unauthorized)</option>
                  <option value="403">403 (Forbidden)</option>
                  <option value="404">404 (Not Found)</option>
                  <option value="500">500 (Server Error)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-2">
              {/* URL 필터 */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  URL
                </label>
                <input
                  type="text"
                  value={textInputs.url}
                  onChange={(e) => handleTextInputChange("url", e.target.value)}
                  placeholder="URL 검색..."
                  className="w-full rounded-md border border-gray-300 text-sm px-2 py-1 bg-white"
                />
              </div>

              {/* IP 필터 */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  IP 주소
                </label>
                <input
                  type="text"
                  value={textInputs.ip}
                  onChange={(e) => handleTextInputChange("ip", e.target.value)}
                  placeholder="예: 192.168.1.1"
                  className="w-full rounded-md border border-gray-300 text-sm px-2 py-1 bg-white"
                />
              </div>

              {/* Host 필터 */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  호스트
                </label>
                <input
                  type="text"
                  value={textInputs.host}
                  onChange={(e) =>
                    handleTextInputChange("host", e.target.value)
                  }
                  placeholder="예: api.example.com"
                  className="w-full rounded-md border border-gray-300 text-sm px-2 py-1 bg-white"
                />
              </div>

              {/* 정렬 방식 */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  정렬
                </label>
                <div className="flex gap-1">
                  <select
                    value={filter.sortBy || "requestTimestamp"}
                    onChange={(e) =>
                      handleFilterChange("sortBy", e.target.value)
                    }
                    className="w-3/5 rounded-md border border-gray-300 text-sm px-2 py-1 bg-white"
                  >
                    <option value="requestTimestamp">시간</option>
                    <option value="method">메소드</option>
                    <option value="url">URL</option>
                    <option value="statusCode">상태</option>
                    <option value="responseTime">응답시간</option>
                  </select>
                  <select
                    value={filter.sortDirection || SortDirection.DESC}
                    onChange={(e) =>
                      handleFilterChange(
                        "sortDirection",
                        e.target.value as SortDirection
                      )
                    }
                    className="w-2/5 rounded-md border border-gray-300 text-sm px-2 py-1 bg-white"
                  >
                    <option value={SortDirection.DESC}>내림차순</option>
                    <option value={SortDirection.ASC}>오름차순</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div>
                  <input
                    type="checkbox"
                    id="errorsOnly"
                    checked={filter.errorsOnly}
                    onChange={(e) =>
                      handleFilterChange("errorsOnly", e.target.checked)
                    }
                    className="rounded text-blue-600 mr-1"
                  />
                  <label htmlFor="errorsOnly" className="text-xs text-gray-700">
                    오류만 보기
                  </label>
                </div>

                <select
                  value={filter.limit?.toString() || "10"}
                  onChange={(e) =>
                    handleFilterChange("limit", parseInt(e.target.value))
                  }
                  className="rounded-md border border-gray-300 text-xs px-2 py-1 bg-white"
                >
                  <option value="10">10개씩</option>
                  <option value="25">25개씩</option>
                  <option value="50">50개씩</option>
                  <option value="100">100개씩</option>
                </select>
              </div>

              <div>
                <Button size="sm" variant="outline" onClick={resetFilters}>
                  필터 초기화
                </Button>
              </div>
            </div>
          </Card>

          {/* 에러 메시지 */}
          {error && (
            <Alert variant="error" className="mb-6">
              {error}
            </Alert>
          )}

          {/* 로그 테이블 */}
          <Card className="overflow-hidden">
            <div className="relative overflow-x-auto">
              {isLoading ? (
                <div className="flex justify-center items-center py-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                  <p className="ml-3 text-gray-600">데이터를 불러오는 중...</p>
                </div>
              ) : logs.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-gray-500">로그 정보가 없습니다.</p>
                </div>
              ) : (
                <>
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          시간
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          메소드
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          URL
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          상태
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          응답 시간
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          관리
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {logs.map((log) => (
                        <tr
                          key={log.id}
                          className="hover:bg-gray-50 cursor-pointer"
                          onClick={() => handleViewLog(log)}
                        >
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                            <div>{formatDate(log.timestamp)}</div>
                            <div className="text-xs">
                              {formatTime(log.timestamp)}
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span
                              className={`inline-flex px-2 py-1 text-xs rounded-full ${getMethodColor(
                                log.method
                              )}`}
                            >
                              {log.method}
                            </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 max-w-xs truncate">
                            {log.url}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span
                              className={`inline-flex px-2 py-1 text-xs rounded-full ${getStatusColor(
                                log.statusCode
                              )}`}
                            >
                              {log.statusCode || "N/A"}
                            </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                            {log.responseTime ? `${log.responseTime}ms` : "N/A"}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-right text-sm">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewLog(log);
                              }}
                            >
                              상세보기
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* 페이지네이션 */}
                  <div className="px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-700">
                        전체 <span className="font-medium">{totalItems}</span>{" "}
                        항목 중{" "}
                        <span className="font-medium">
                          {(filter.page! - 1) * (filter.limit || 10) + 1}
                        </span>{" "}
                        -{" "}
                        <span className="font-medium">
                          {Math.min(
                            filter.page! * (filter.limit || 10),
                            totalItems
                          )}
                        </span>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={filter.page! <= 1}
                          onClick={() => goToPage(1)}
                        >
                          &#171; 처음
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={filter.page! <= 1}
                          onClick={() => goToPage(filter.page! - 1)}
                        >
                          &lt; 이전
                        </Button>
                        <span className="flex items-center px-3 py-1 border rounded">
                          {filter.page!} / {totalPages}
                        </span>
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={filter.page! >= totalPages}
                          onClick={() => goToPage(filter.page! + 1)}
                        >
                          다음 &gt;
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={filter.page! >= totalPages}
                          onClick={() => goToPage(totalPages)}
                        >
                          마지막 &#187;
                        </Button>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* 로그 상세 정보 모달 */}
      <Modal
        isOpen={isModalOpen}
        title="로그 상세 정보"
        onClose={() => setIsModalOpen(false)}
      >
        {selectedLog && (
          <>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1.5rem",
              }}
              className="overflow-hidden"
            >
              {/* 왼쪽 컬럼 */}
              <div className="overflow-hidden">
                {/* 기본 정보 */}
                <div className="bg-gray-50 p-4 rounded-md mb-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-3 border-b pb-1">
                    기본 정보
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-xs font-medium text-gray-500">
                        요청 시간
                      </h4>
                      <p className="text-sm">
                        {formatDate(selectedLog.timestamp)}{" "}
                        {formatTime(selectedLog.timestamp)}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-xs font-medium text-gray-500">
                        소요 시간
                      </h4>
                      <p className="text-sm">
                        {selectedLog.responseTime
                          ? `${selectedLog.responseTime}ms`
                          : "N/A"}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-xs font-medium text-gray-500">
                        상태 코드
                      </h4>
                      <div className="flex items-center space-x-2">
                        <span
                          className={`inline-flex px-2 py-1 text-xs rounded-full ${getStatusColor(
                            selectedLog.statusCode
                          )}`}
                        >
                          {selectedLog.statusCode || "N/A"}
                        </span>
                        <span className="text-sm">
                          {getStatusText(selectedLog.statusCode)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 요청 정보 */}
                <div className="bg-gray-50 p-4 rounded-md mb-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-3 border-b pb-1">
                    요청 정보
                  </h3>
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <span
                        className={`inline-flex px-2 py-1 text-xs rounded-full ${getMethodColor(
                          selectedLog.method
                        )}`}
                      >
                        {selectedLog.method}
                      </span>
                      <span className="text-sm font-medium break-all">
                        {selectedLog.url}
                      </span>
                    </div>
                    <div className="text-sm mb-2 break-words">
                      <span className="font-medium">Host:</span>{" "}
                      {selectedLog.host}
                    </div>
                    <div className="text-sm mb-2 break-words">
                      <span className="font-medium">IP:</span> {selectedLog.ip}
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">User Agent:</span>{" "}
                      <div className="text-xs mt-1 break-all">
                        {selectedLog.userAgent}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 오른쪽 컬럼 */}
              <div className="overflow-hidden">
                {/* 쿼리 */}
                <div className="bg-gray-50 p-4 rounded-md mb-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-2 border-b pb-1">
                    Query Parameters
                  </h3>
                  <JsonView data={selectedLog.query} />
                </div>

                {/* 요청 바디 */}
                <div className="bg-gray-50 p-4 rounded-md mb-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-2 border-b pb-1">
                    Request Body
                  </h3>
                  <JsonView data={selectedLog.body} />
                </div>

                {/* 응답 또는 오류 */}
                <div className="bg-gray-50 p-4 rounded-md">
                  <h3 className="text-sm font-medium text-gray-700 mb-2 border-b pb-1">
                    {selectedLog.error ? "Error" : "Response"}
                  </h3>
                  <JsonView
                    data={
                      selectedLog.error && typeof selectedLog.error !== "string"
                        ? (selectedLog.error as Record<string, unknown>)
                        : selectedLog.response
                    }
                  />
                </div>
              </div>
            </div>

            {/* 닫기 버튼 */}
            <div className="flex justify-end mt-6">
              <Button onClick={() => setIsModalOpen(false)}>닫기</Button>
            </div>
          </>
        )}
      </Modal>
    </AdminLayout>
  );
}
