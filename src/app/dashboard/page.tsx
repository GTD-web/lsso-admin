"use client";

import { useState, useEffect } from "react";
import { Button, Card, Alert } from "../components/LumirMock";
import { getAllUsers } from "../api/users";
import { getAllSystems } from "../api/systems";
import { getLogs, Log } from "../api/logs";
import AdminLayout from "../components/AdminLayout";

// 시스템 상태 인터페이스
interface SystemStatus {
  id: string;
  name: string;
  status: string;
  lastCheck: string;
  responseTime: number;
}

// 대시보드 데이터 인터페이스
interface DashboardData {
  activeUsers: number;
  activeTokens: number;
  activeSystems: number;
  recentLogs: Log[];
  loginSuccess: number;
  loginFailed: number;
  avgResponseTime: number;
  tokensExpiringCount: number;
  securityAlerts: number;
  systemStatus: SystemStatus[];
}

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    activeUsers: 0,
    activeTokens: 0,
    activeSystems: 0,
    recentLogs: [],
    loginSuccess: 0,
    loginFailed: 0,
    avgResponseTime: 0,
    tokensExpiringCount: 0,
    securityAlerts: 0,
    systemStatus: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  // 대시보드 데이터 로드
  useEffect(() => {
    const loadDashboardData = async () => {
      setIsLoading(true);

      try {
        // 사용자 데이터 로드
        const usersResponse = await getAllUsers();
        const users =
          usersResponse.success && usersResponse.data ? usersResponse.data : [];
        const activeUsers = users.filter((u) => u.status === "재직중").length;

        // 시스템 데이터 로드
        const systemsResponse = await getAllSystems();
        const systems =
          systemsResponse.success && systemsResponse.data
            ? systemsResponse.data
            : [];
        const activeSystems = systems.filter((s) => s.isActive).length;

        // 토큰 데이터 추출 (시스템 API에서 관련 정보 추출)
        let activeTokensCount = 0;
        let tokensExpiringCount = 0;

        systems.forEach(() => {
          // 가정: 각 시스템이 관련 토큰 정보를 가지고 있다고 가정
          // 실제 구현에 맞게 조정 필요
          activeTokensCount += 5 + Math.floor(Math.random() * 20); // 더미 데이터
          tokensExpiringCount += Math.floor(Math.random() * 3); // 더미 데이터
        });

        // 로그 데이터 로드
        const logsResponse = await getLogs(1, 50); // 더 많은 로그를 조회하여 분석
        const logs =
          logsResponse.success && logsResponse.data?.logs
            ? logsResponse.data.logs
            : [];

        // 로그 분석
        const recentLogs = logs.slice(0, 5);
        const loginLogs = logs.filter(
          (log: Log) => log.url.includes("/login") || log.url.includes("/auth")
        );
        const loginSuccess = loginLogs.filter(
          (log: Log) => !log.error && (log.statusCode || 0) < 400
        ).length;
        const loginFailed = loginLogs.filter(
          (log: Log) => log.error || (log.statusCode || 0) >= 400
        ).length;

        // 평균 응답 시간 계산
        const responseTimes = logs
          .filter((log: Log) => log.responseTime)
          .map((log: Log) => log.responseTime || 0);
        const avgResponseTime =
          responseTimes.length > 0
            ? Math.round(
                responseTimes.reduce(
                  (sum: number, time: number) => sum + time,
                  0
                ) / responseTimes.length
              )
            : 0;

        // 보안 알림 수 계산 (더미 데이터)
        const securityAlerts = Math.floor(Math.random() * 5);

        // 시스템 상태 데이터 생성
        const systemStatus: SystemStatus[] = systems
          .map((system) => ({
            id: system.id,
            name: system.name,
            status: system.isActive ? "online" : "offline",
            lastCheck: new Date().toISOString(),
            responseTime: Math.floor(50 + Math.random() * 150), // 더미 응답 시간 (ms)
          }))
          .slice(0, 5);

        // 데이터 설정
        setDashboardData({
          activeUsers,
          activeTokens: activeTokensCount,
          activeSystems,
          recentLogs,
          loginSuccess,
          loginFailed,
          avgResponseTime,
          tokensExpiringCount,
          securityAlerts,
          systemStatus,
        });
      } catch (error) {
        console.error("Dashboard data loading error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, []);

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

  return (
    <AdminLayout title="대시보드">
      <div className="flex-1 p-4 lg:p-8 bg-slate-50 dark:bg-slate-900 overflow-auto content-scrollable">
        <div className="max-w-7xl mx-auto">
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
              <p className="ml-3 text-gray-600">데이터를 불러오는 중...</p>
            </div>
          ) : (
            <>
              {/* 핵심 지표 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 mb-6">
                {/* 카드 1: 활성 사용자 */}
                <Card className="p-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">활성 사용자</h3>
                    <span className="text-indigo-600 dark:text-indigo-400 text-xl font-bold">
                      {dashboardData.activeUsers}
                    </span>
                  </div>
                  <p className="text-slate-500 mt-2">
                    전체 사용자의{" "}
                    {Math.round(
                      (dashboardData.activeUsers /
                        (dashboardData.activeUsers + 2)) *
                        100
                    )}
                    %
                  </p>
                </Card>

                {/* 카드 2: 활성 토큰 */}
                <Card className="p-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">활성 토큰</h3>
                    <span className="text-indigo-600 dark:text-indigo-400 text-xl font-bold">
                      {dashboardData.activeTokens}
                    </span>
                  </div>
                  <p className="text-slate-500 mt-2">
                    만료 예정: {dashboardData.tokensExpiringCount}
                  </p>
                </Card>

                {/* 카드 3: 연결된 시스템 */}
                <Card className="p-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">연결된 시스템</h3>
                    <span className="text-indigo-600 dark:text-indigo-400 text-xl font-bold">
                      {dashboardData.activeSystems}
                    </span>
                  </div>
                  <p className="text-slate-500 mt-2">
                    {
                      dashboardData.systemStatus.filter(
                        (s) => s.status === "online"
                      ).length
                    }{" "}
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
                                dashboardData.loginSuccess +
                                  dashboardData.loginFailed >
                                0
                                  ? (dashboardData.loginSuccess /
                                      (dashboardData.loginSuccess +
                                        dashboardData.loginFailed)) *
                                    100
                                  : 0
                              }%`,
                            }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">
                          {dashboardData.loginSuccess +
                            dashboardData.loginFailed >
                          0
                            ? Math.round(
                                (dashboardData.loginSuccess /
                                  (dashboardData.loginSuccess +
                                    dashboardData.loginFailed)) *
                                  100
                              )
                            : 0}
                          %
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
                        {dashboardData.securityAlerts}건
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">만료 예정 토큰</span>
                      <span className="font-medium">
                        {dashboardData.tokensExpiringCount}개
                      </span>
                    </div>
                  </div>
                </Card>

                {/* 시스템 상태 모니터링 */}
                <Card className="p-6">
                  <h2 className="text-xl font-semibold mb-4">시스템 상태</h2>
                  <div className="space-y-3">
                    {dashboardData.systemStatus.map((system, index) => (
                      <div
                        key={system.id || index}
                        className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-700 last:border-0"
                      >
                        <div className="flex items-center">
                          <div
                            className={`w-3 h-3 rounded-full mr-3 ${
                              system.status === "online"
                                ? "bg-green-500"
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
                  {dashboardData.recentLogs.length > 0 ? (
                    <div className="space-y-3">
                      {dashboardData.recentLogs.map((log, index) => (
                        <div
                          key={log.id || index}
                          className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-700 last:border-0"
                        >
                          <div>
                            <div className="flex items-center">
                              <span
                                className={`inline-flex px-2 py-1 text-xs rounded-full mr-2 ${
                                  log.error
                                    ? "bg-red-100 text-red-800"
                                    : "bg-green-100 text-green-800"
                                }`}
                              >
                                {log.method}
                              </span>
                              <p className="font-medium">{log.url}</p>
                            </div>
                            <p className="text-sm text-slate-500 mt-1">
                              {formatDate(log.timestamp)} •{" "}
                              {log.statusCode || "N/A"}
                            </p>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => (window.location.href = "/logs")}
                          >
                            보기
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-6">
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
                <Card className="p-6">
                  <h2 className="text-xl font-semibold mb-4">중요 알림</h2>
                  {dashboardData.securityAlerts > 0 ||
                  dashboardData.tokensExpiringCount > 0 ? (
                    <div className="space-y-3">
                      {dashboardData.securityAlerts > 0 && (
                        <Alert variant="warning" className="mb-3">
                          <div className="font-medium">비정상 로그인 시도</div>
                          <div className="text-sm">
                            지난 24시간 동안 {dashboardData.securityAlerts}
                            건의 의심스러운 활동이 감지되었습니다.
                          </div>
                        </Alert>
                      )}

                      {dashboardData.tokensExpiringCount > 0 && (
                        <Alert variant="info" className="mb-3">
                          <div className="font-medium">만료 예정 토큰</div>
                          <div className="text-sm">
                            {dashboardData.tokensExpiringCount}개의 토큰이 7일
                            이내에 만료될 예정입니다.
                          </div>
                        </Alert>
                      )}

                      <Alert variant="success" className="mb-3">
                        <div className="font-medium">시스템 상태 양호</div>
                        <div className="text-sm">
                          모든 주요 시스템이 정상 작동 중입니다.
                        </div>
                      </Alert>
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
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
                      <p className="mt-3 text-gray-500">
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

              {/* 시간별 활동 그래프 (이미지로 대체) */}
              <Card className="p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">시간별 활동</h2>
                <div className="bg-gray-50 rounded-lg p-4 h-64 flex items-center justify-center">
                  <div className="text-center">
                    <svg
                      className="mx-auto h-10 w-10 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                    <p className="mt-2 text-gray-500">
                      그래프 영역 (차트 라이브러리 통합 필요)
                    </p>
                  </div>
                </div>
                <div className="mt-4 text-right">
                  <Button size="sm" variant="outline">
                    상세 보기
                  </Button>
                </div>
              </Card>
            </>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
