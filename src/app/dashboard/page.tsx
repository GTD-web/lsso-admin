"use client";

import { useState, useEffect } from "react";
import { Button, Card, Alert } from "../components/LumirMock";
import { getAllUsers } from "../api/users";
import { getAllSystems } from "../api/systems";
import { Log } from "../api/logs";
import {
  getDashboardSummary,
  getSystemsStatus,
  getRecentLogs,
  getLoginStats,
  getSecurityAlerts,
  DashboardSummary,
  SystemStatus,
  LoginStats,
  SecurityAlert,
  TokenStats,
  getTokenStats,
} from "../api/dashboard";
import AdminLayout from "../components/AdminLayout";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<DashboardSummary | null>(
    null
  );
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [systemStatus, setSystemStatus] = useState<SystemStatus[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [recentLogs, setRecentLogs] = useState<Log[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loginStats, setLoginStats] = useState<LoginStats | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [securityAlerts, setSecurityAlerts] = useState<SecurityAlert[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [tokenStats, setTokenStats] = useState<TokenStats | null>(null);
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    console.log("🛡️ Dashboard 상태 체크:", {
      authLoading,
      isAuthenticated,
    });
    if (!authLoading && !isAuthenticated) {
      router.push("/unauthorized");
    }
  }, [authLoading, isAuthenticated, router]);

  // 대시보드 데이터 로드
  useEffect(() => {
    const loadDashboardData = async () => {
      setIsLoading(true);

      try {
        const summaryResponse = await getDashboardSummary();
        if (summaryResponse.success && summaryResponse.data) {
          setDashboardData(summaryResponse.data);
          setSystemStatus(summaryResponse.data.systemStatus || []);
          setRecentLogs(summaryResponse.data.recentLogs || []);
          setSecurityAlerts(summaryResponse.data.securityAlerts || []);
        } else {
          await loadIndividualData();
        }
      } catch (error) {
        console.error("Dashboard data loading error:", error);
        await loadIndividualData();
      } finally {
        setIsLoading(false);
      }
    };

    const loadIndividualData = async () => {
      try {
        const systemStatusResponse = await getSystemsStatus();
        const currentSystemStatus =
          systemStatusResponse.success && systemStatusResponse.data
            ? systemStatusResponse.data
            : [];
        setSystemStatus(currentSystemStatus);

        const recentLogsResponse = await getRecentLogs(3);
        const currentRecentLogs =
          recentLogsResponse.success && recentLogsResponse.data
            ? recentLogsResponse.data
            : [];
        setRecentLogs(currentRecentLogs);

        const loginStatsResponse = await getLoginStats();
        const currentLoginStats =
          loginStatsResponse.success && loginStatsResponse.data
            ? loginStatsResponse.data
            : null;
        setLoginStats(currentLoginStats);

        const securityAlertsResponse = await getSecurityAlerts();
        const currentSecurityAlerts =
          securityAlertsResponse.success && securityAlertsResponse.data
            ? securityAlertsResponse.data
            : [];
        setSecurityAlerts(currentSecurityAlerts);

        const tokenStatsResponse = await getTokenStats();
        const currentTokenStats =
          tokenStatsResponse.success && tokenStatsResponse.data
            ? tokenStatsResponse.data
            : null;
        setTokenStats(currentTokenStats);

        const usersResponse = await getAllUsers();
        const users =
          usersResponse.success && usersResponse.data ? usersResponse.data : [];
        const activeUsers = users.filter((u) => u.status === "재직중").length;

        const systemsResponse = await getAllSystems();
        const systems =
          systemsResponse.success && systemsResponse.data
            ? systemsResponse.data
            : [];
        const activeSystems = systems.filter((s) => s.isActive).length;

        const constructedData: DashboardSummary = {
          activeUsers,
          totalUsers: users.length,
          tokenStats: currentTokenStats || {
            total: 0,
            active: 0,
            inactive: 0,
            expiringSoon: 0,
          },
          activeSystems,
          totalSystems: systems.length,
          loginStats: currentLoginStats || {
            total: 0,
            success: 0,
            failed: 0,
            successRate: 0,
          },
          avgResponseTime: calculateAvgResponseTime(currentRecentLogs),
          securityAlerts: currentSecurityAlerts,
          recentLogs: currentRecentLogs,
          systemStatus: currentSystemStatus,
        };

        setDashboardData(constructedData);
      } catch (error) {
        console.error("Individual data loading error:", error);
      }
    };

    loadDashboardData();
  }, []);

  // 평균 응답 시간 계산 헬퍼 함수
  const calculateAvgResponseTime = (logs: Log[]): number => {
    const validLogs = logs.filter((log) => log.responseTime);
    if (validLogs.length === 0) return 0;

    const total = validLogs.reduce((sum, log) => sum + log.responseTime, 0);
    return Math.round(total / validLogs.length);
  };

  // 날짜 포맷팅
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString("ko-KR", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };
  console.log("🛡️ Dashboard 상태 체크:", {
    isLoading,
    isAuthenticated,
  });
  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex-1 p-4 lg:p-8 bg-slate-50 dark:bg-slate-900 overflow-auto content-scrollable">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
              <p className="ml-3 text-gray-600">데이터를 불러오는 중...</p>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <AdminLayout>
      <div className="flex-1 p-4 lg:p-8 bg-slate-50 dark:bg-slate-900 overflow-auto content-scrollable">
        <div className="max-w-7xl mx-auto">
          {dashboardData ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 mb-6">
                {/* 카드 1: 활성 사용자 */}
                <Card className="p-6">
                  <h3 className="text-lg font-medium">활성 사용자</h3>
                  <span className="text-indigo-600 dark:text-indigo-400 text-xl font-bold">
                    {dashboardData.activeUsers || 0}
                  </span>
                  <p className="text-slate-500 mt-2">
                    전체 사용자의{" "}
                    {dashboardData.totalUsers > 0
                      ? Math.round(
                          ((dashboardData.activeUsers || 0) /
                            dashboardData.totalUsers) *
                            100
                        )
                      : 0}
                    %
                  </p>
                </Card>

                {/* 카드 2: 활성 토큰 */}
                <Card className="p-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">활성 토큰</h3>
                    <span className="text-indigo-600 dark:text-indigo-400 text-xl font-bold">
                      {dashboardData.tokenStats?.active || 0}
                    </span>
                  </div>
                  <p className="text-slate-500 mt-2">
                    만료 예정: {dashboardData.tokenStats?.expiringSoon || 0}
                  </p>
                </Card>

                {/* 카드 3: 연결된 시스템 */}
                <Card className="p-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">연결된 시스템</h3>
                    <span className="text-indigo-600 dark:text-indigo-400 text-xl font-bold">
                      {dashboardData.activeSystems || 0}
                    </span>
                  </div>
                  <p className="text-slate-500 mt-2">
                    {dashboardData.systemStatus?.filter(
                      (s) => s.status === "online"
                    ).length || 0}{" "}
                    시스템 온라인
                  </p>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* 보안 요약 */}
                <Card className="p-6">
                  <h2 className="text-xl font-semibold mb-4">보안 요약</h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">로그인 성공률</span>
                      <div className="flex items-center">
                        <div className="w-32 h-2 bg-gray-200 rounded-full mr-2">
                          <div
                            className="h-full bg-green-500 rounded-full"
                            style={{
                              width: `${
                                dashboardData.loginStats?.successRate || 0
                              }%`,
                            }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">
                          {dashboardData.loginStats?.successRate || 0}%
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">평균 응답 시간</span>
                      <span className="font-medium">
                        {dashboardData.avgResponseTime} ms
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">보안 알림</span>
                      <span className="font-medium">
                        {dashboardData.securityAlerts?.length || 0}건
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">만료 예정 토큰</span>
                      <span className="font-medium">
                        {dashboardData.tokenStats?.expiringSoon || 0}개
                      </span>
                    </div>
                  </div>
                </Card>

                {/* 시스템 상태 모니터링 */}
                <Card className="p-6">
                  <h2 className="text-xl font-semibold mb-4">시스템 상태</h2>
                  <div className="space-y-3">
                    {dashboardData.systemStatus &&
                      dashboardData.systemStatus.map((system, index) => (
                        <div
                          key={system.id || index}
                          className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-700 last:border-0"
                        >
                          <div className="flex items-center">
                            <div
                              className={`w-3 h-3 rounded-full mr-3 ${
                                system.status === "online"
                                  ? "bg-green-500"
                                  : system.status === "warning"
                                  ? "bg-yellow-500"
                                  : "bg-red-500"
                              }`}
                            ></div>
                            <span className="font-medium">{system.name}</span>
                          </div>
                          <div className="text-sm text-right">
                            <div className="text-gray-500">
                              응답 시간: {system.responseTime}ms
                            </div>
                            <div className="text-gray-400 text-xs">
                              마지막 확인: {formatDate(system.lastCheck)}
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                  <div className="mt-4 text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => (window.location.href = "/systems")}
                    >
                      모든 시스템 보기
                    </Button>
                  </div>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                {/* 최근 활동 로그 */}
                <Card className="p-6 lg:col-span-2">
                  <h2 className="text-xl font-semibold mb-4">최근 활동</h2>
                  {dashboardData.recentLogs?.length > 0 ? (
                    <div className="space-y-3">
                      {dashboardData.recentLogs.map((log, index) => {
                        let badgeColor = "bg-green-100 text-green-800";
                        if (log.statusCode >= 400 && log.statusCode < 500) {
                          badgeColor = "bg-yellow-100 text-yellow-800";
                        } else if (log.statusCode >= 500) {
                          badgeColor = "bg-red-100 text-red-800";
                        }
                        return (
                          <div
                            key={log.id || index}
                            className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-700 last:border-0"
                          >
                            <div>
                              <div className="flex items-center">
                                <span
                                  className={`inline-flex px-2 py-1 text-xs rounded-full mr-2 ${badgeColor}`}
                                >
                                  {log.method}
                                </span>
                                <p className="font-medium">{log.url}</p>
                              </div>
                              <p className="text-sm text-slate-500 mt-1">
                                {formatDate(log.requestTimestamp)} •{" "}
                                {log.statusCode || "N/A"}
                                {log.system ? ` • ${log.system}` : ""}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-4">
                      로그 데이터가 없습니다.
                    </p>
                  )}
                  <div className="mt-4 text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => (window.location.href = "/logs")}
                    >
                      모든 로그 보기
                    </Button>
                  </div>
                </Card>

                {/* 중요 알림 */}
                <Card className="p-6 lg:col-span-1">
                  <h2 className="text-xl font-semibold mb-4">중요 알림</h2>
                  {dashboardData.securityAlerts?.length > 0 ? (
                    <div className="space-y-2">
                      {dashboardData.securityAlerts?.map((alert, index) => {
                        return (
                          <Alert
                            key={alert.id || index}
                            variant={
                              alert.type === "warning"
                                ? "warning"
                                : alert.type === "error"
                                ? "error"
                                : "info"
                            }
                            className="mb-2 py-2"
                          >
                            <div className="flex items-center justify-between">
                              <div className="font-medium text-sm">
                                {alert.type === "warning"
                                  ? "주의"
                                  : alert.type === "error"
                                  ? "위험"
                                  : "정보"}
                              </div>
                              <div className="text-xs text-gray-500">
                                {formatDate(alert.timestamp)}
                              </div>
                            </div>
                            <div className="text-sm mt-1">{alert.message}</div>
                          </Alert>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <svg
                        className="mx-auto h-10 w-10 text-green-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <p className="mt-2 text-sm text-green-500">
                        모든 시스템이 정상 작동 중입니다.
                      </p>
                    </div>
                  )}

                  <div className="mt-4 text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => (window.location.href = "/logs")}
                    >
                      로그 분석
                    </Button>
                  </div>
                </Card>
              </div>
            </>
          ) : (
            <p className="text-center text-gray-500 py-10">
              데이터를 불러올 수 없습니다.
            </p>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
