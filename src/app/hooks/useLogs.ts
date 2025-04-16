"use client";

import { useState } from "react";
import { Log, getLogs, filterLogs, LogFilterParams } from "../api/logs";
import { formatKoreanDate } from "../api/utils";

export enum SortDirection {
  ASC = "ASC",
  DESC = "DESC",
}

interface LogsResult {
  logs: Log[];
  meta?: {
    total: number;
    page: number;
    totalPages: number;
  };
}

interface UseLogsReturn {
  logs: Log[];
  isLoading: boolean;
  error: string | null;
  fetchAllLogs: () => Promise<Log[]>;
  searchLogsByQuery: (query: string) => Promise<Log[]>;
  filterByParams: (params: LogFilterParams) => Promise<LogsResult>;
  filterByDateRange: (startDate: Date, endDate: Date) => Promise<Log[]>;
  formatDate: (dateString?: string) => string;
  formatTime: (dateString?: string) => string;
  getStatusColor: (statusCode?: number) => string;
  getMethodColor: (method: string) => string;
}

export function useLogs(): UseLogsReturn {
  const [logs, setLogs] = useState<Log[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // 모든 로그 조회
  const fetchAllLogs = async (): Promise<Log[]> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getLogs();
      if (response.success && response.data) {
        setLogs(response.data.logs);
        return response.data.logs;
      } else {
        setError(
          response.error?.message || "로그 목록을 불러오는데 실패했습니다."
        );
        return [];
      }
    } catch (err) {
      console.error("Error fetching logs:", err);
      setError("로그 목록을 불러오는데 실패했습니다.");
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // 로그 검색
  const searchLogsByQuery = async (query: string): Promise<Log[]> => {
    if (!query.trim()) {
      return await fetchAllLogs();
    }

    setIsLoading(true);
    setError(null);
    try {
      const filterParams: LogFilterParams = { search: query };
      const response = await filterLogs(filterParams);

      if (response.success && response.data) {
        setLogs(response.data.logs);
        return response.data.logs;
      } else {
        setError(response.error?.message || "로그 검색에 실패했습니다.");
        return [];
      }
    } catch (err) {
      console.error("Error searching logs:", err);
      setError("로그 검색에 실패했습니다.");
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // 파라미터로 필터링
  const filterByParams = async (
    params: LogFilterParams
  ): Promise<LogsResult> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await filterLogs(params);

      if (response.success && response.data) {
        setLogs(response.data.logs);
        return {
          logs: response.data.logs,
          meta: {
            total: response.data.total,
            page: response.data.page,
            totalPages: Math.ceil(response.data.total / response.data.limit),
          },
        };
      } else {
        setError(response.error?.message || "로그 필터링에 실패했습니다.");
        return { logs: [] };
      }
    } catch (err) {
      console.error("Error filtering logs:", err);
      setError("로그 필터링에 실패했습니다.");
      return { logs: [] };
    } finally {
      setIsLoading(false);
    }
  };

  // 날짜 범위로 필터링
  const filterByDateRange = async (
    startDate: Date,
    endDate: Date
  ): Promise<Log[]> => {
    setIsLoading(true);
    setError(null);
    try {
      const filterParams: LogFilterParams = {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      };

      const response = await filterLogs(filterParams);

      if (response.success && response.data) {
        setLogs(response.data.logs);
        return response.data.logs;
      } else {
        setError(response.error?.message || "로그 필터링에 실패했습니다.");
        return [];
      }
    } catch (err) {
      console.error("Error filtering logs:", err);
      setError("로그 필터링에 실패했습니다.");
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // 날짜 포맷팅 (2023년 1월 1일 형식)
  const formatDate = (dateString?: string): string => {
    if (!dateString) return "-";
    return formatKoreanDate(dateString);
  };

  // 시간 포맷팅 (오후 2:30:45 형식)
  const formatTime = (dateString?: string): string => {
    if (!dateString) return "-";
    try {
      return new Date(dateString).toLocaleTimeString("ko-KR", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      });
    } catch {
      return "-";
    }
  };

  // 상태 코드별 색상 반환
  const getStatusColor = (statusCode?: number): string => {
    if (!statusCode) return "bg-gray-100 text-gray-800";

    if (statusCode >= 200 && statusCode < 300) {
      return "bg-green-100 text-green-800"; // 성공
    } else if (statusCode >= 400 && statusCode < 500) {
      return "bg-yellow-100 text-yellow-800"; // 클라이언트 오류
    } else if (statusCode >= 500) {
      return "bg-red-100 text-red-800"; // 서버 오류
    }

    return "bg-gray-100 text-gray-800"; // 기타
  };

  // HTTP 메소드별 색상 반환
  const getMethodColor = (method: string): string => {
    switch (method.toUpperCase()) {
      case "GET":
        return "bg-blue-100 text-blue-800";
      case "POST":
        return "bg-green-100 text-green-800";
      case "PUT":
        return "bg-yellow-100 text-yellow-800";
      case "DELETE":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return {
    logs,
    isLoading,
    error,
    fetchAllLogs,
    searchLogsByQuery,
    filterByParams,
    filterByDateRange,
    formatDate,
    formatTime,
    getStatusColor,
    getMethodColor,
  };
}
