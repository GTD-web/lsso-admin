"use client";

import React, { useState, useEffect } from "react";
import { Card, Button, Alert, Modal, Select } from "../../components/LumirMock";
import { getSystemById, System } from "../../api/systems";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import {
  Token,
  getTokensBySystem,
  updateTokenStatus,
  renewToken,
  deleteToken,
} from "../../api/tokens";
import { User, getAllUsers } from "../../api/users";

// 날짜를 한국어 형식으로 포맷하는 함수
function formatDate(dateString: string | undefined): string {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function SystemDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [system, setSystem] = useState<System | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [systemTokens, setSystemTokens] = useState<Token[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isRenewModalOpen, setIsRenewModalOpen] = useState(false);
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);
  const [expiresInDays, setExpiresInDays] = useState(30);
  const [actionLoading, setActionLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const systemId = params.id as string;

  // 시스템 정보 로드
  useEffect(() => {
    const fetchSystemDetail = async () => {
      if (!systemId) {
        setError("시스템 ID가 유효하지 않습니다.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await getSystemById(systemId);
        if (response.success && response.data) {
          setSystem(response.data);
        } else {
          setError(
            response.error?.message || "시스템 정보를 불러오는데 실패했습니다."
          );
        }
      } catch (err) {
        console.error("Error fetching system details:", err);
        setError("시스템 정보를 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchSystemDetail();
  }, [systemId]);

  // 사용자 목록 로드
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const response = await getAllUsers();
        if (response.success && response.data) {
          setUsers(response.data);
        }
      } catch (err) {
        console.error("Error loading users:", err);
      }
    };

    loadUsers();
  }, []);

  // 시스템의 토큰 목록 로드
  const loadSystemTokens = async () => {
    if (!systemId) return;

    try {
      const response = await getTokensBySystem(systemId);
      if (response.success && response.data) {
        setSystemTokens(response.data);
      }
    } catch (err) {
      console.error("Error loading system tokens:", err);
    }
  };

  // 토큰 목록 초기 로드
  useEffect(() => {
    loadSystemTokens();
  }, [systemId]);

  // 토큰 상태 변경 처리
  const handleToggleTokenStatus = async (
    tokenId: string,
    currentStatus: boolean
  ) => {
    setActionLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await updateTokenStatus(tokenId, !currentStatus);

      if (response.success && response.data) {
        setSystemTokens((prevTokens) =>
          prevTokens.map((token) =>
            token.id === tokenId ? (response.data as Token) : token
          )
        );
        setSuccessMessage(
          `토큰 상태가 ${!currentStatus ? "활성화" : "비활성화"}되었습니다.`
        );

        // 5초 후 성공 메시지 숨김
        setTimeout(() => setSuccessMessage(null), 5000);
      } else {
        setError(response.error?.message || "토큰 상태 변경에 실패했습니다.");
      }
    } catch (err) {
      console.error("Error updating token status:", err);
      setError("토큰 상태 변경 중 오류가 발생했습니다.");
    } finally {
      setActionLoading(false);
    }
  };

  // 토큰 갱신 모달 열기
  const handleOpenRenewModal = (token: Token) => {
    setSelectedToken(token);
    setExpiresInDays(30);
    setIsRenewModalOpen(true);
  };

  // 토큰 갱신 처리
  const handleRenewToken = async () => {
    if (!selectedToken) return;

    setActionLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await renewToken(selectedToken.id, expiresInDays);

      if (response.success && response.data) {
        setSystemTokens((prevTokens) =>
          prevTokens.map((token) =>
            token.id === selectedToken.id ? (response.data as Token) : token
          )
        );
        setIsRenewModalOpen(false);
        setSuccessMessage("토큰이 성공적으로 갱신되었습니다.");

        // 5초 후 성공 메시지 숨김
        setTimeout(() => setSuccessMessage(null), 5000);
      } else {
        setError(response.error?.message || "토큰 갱신에 실패했습니다.");
      }
    } catch (err) {
      console.error("Error renewing token:", err);
      setError("토큰 갱신 중 오류가 발생했습니다.");
    } finally {
      setActionLoading(false);
    }
  };

  // 토큰 삭제 처리
  const handleDeleteToken = async (tokenId: string) => {
    if (!window.confirm("정말로 이 토큰을 삭제하시겠습니까?")) {
      return;
    }

    setActionLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await deleteToken(tokenId);

      if (response.success) {
        setSystemTokens((prevTokens) =>
          prevTokens.filter((token) => token.id !== tokenId)
        );
        setSuccessMessage("토큰이 성공적으로 삭제되었습니다.");

        // 5초 후 성공 메시지 숨김
        setTimeout(() => setSuccessMessage(null), 5000);
      } else {
        setError(response.error?.message || "토큰 삭제에 실패했습니다.");
      }
    } catch (err) {
      console.error("Error deleting token:", err);
      setError("토큰 삭제 중 오류가 발생했습니다.");
    } finally {
      setActionLoading(false);
    }
  };

  // 토큰 상태 표시
  const getTokenStatusLabel = (token: Token) => {
    const isExpired = new Date(token.tokenExpiresAt) < new Date();

    if (isExpired) {
      return (
        <span className="px-2 py-0.5 text-xs rounded-full bg-red-100 text-red-800">
          만료됨
        </span>
      );
    }

    return token.isActive ? (
      <span className="px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-800">
        활성
      </span>
    ) : (
      <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-800">
        비활성
      </span>
    );
  };

  // 사용자 정보 표시
  const getUserInfo = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    return user ? `${user.name} (${user.email})` : "알 수 없음";
  };

  // 정보 필드 컴포넌트
  const InfoField = ({
    label,
    value,
  }: {
    label: string;
    value: string | React.ReactNode;
  }) => (
    <div className="grid grid-cols-1 md:grid-cols-3 py-3 border-b border-gray-100 last:border-0">
      <div className="text-sm font-medium text-gray-500">{label}</div>
      <div className="text-sm text-gray-900 md:col-span-2 mt-1 md:mt-0">
        {value}
      </div>
    </div>
  );

  return (
    <>
      <div className="flex-1 p-8 bg-slate-50 dark:bg-slate-900 overflow-auto">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div>
              <Link
                href="/systems"
                className="flex items-center text-sm text-indigo-600 hover:text-indigo-800 mb-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-1"
                >
                  <path d="m15 18-6-6 6-6" />
                </svg>
                시스템 목록으로 돌아가기
              </Link>
              <h1 className="text-3xl font-bold">시스템 상세 정보</h1>
            </div>
          </div>

          {/* 에러 메시지 */}
          {error && (
            <Alert variant="error" className="mb-6">
              {error}
            </Alert>
          )}

          {/* 성공 메시지 */}
          {successMessage && (
            <Alert variant="success" className="mb-6">
              {successMessage}
            </Alert>
          )}

          {/* 시스템 정보 */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
              <p className="ml-3 text-gray-600">데이터를 불러오는 중...</p>
            </div>
          ) : system ? (
            <div className="space-y-6">
              {/* 기본 정보 */}
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">기본 정보</h2>
                <div className="space-y-1">
                  <InfoField label="시스템 이름" value={system.name} />
                  <InfoField label="설명" value={system.description || "-"} />
                  <InfoField
                    label="상태"
                    value={
                      <span
                        className={`inline-flex px-2 py-1 text-xs rounded-full ${
                          system.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {system.isActive ? "활성" : "비활성"}
                      </span>
                    }
                  />
                  <InfoField label="Client ID" value={system.clientId} />
                  <InfoField
                    label="허용된 출처"
                    value={
                      system.allowedOrigin.length > 0
                        ? system.allowedOrigin.join(", ")
                        : "-"
                    }
                  />
                  <InfoField
                    label="헬스체크 URL"
                    value={system.healthCheckUrl || "-"}
                  />
                  <InfoField
                    label="생성일"
                    value={formatDate(system.createdAt)}
                  />
                  <InfoField
                    label="마지막 수정일"
                    value={formatDate(system.updatedAt)}
                  />
                </div>
              </Card>

              {/* 토큰 관리 */}
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">사용자 접근 관리</h2>

                {systemTokens.length === 0 ? (
                  <div className="text-center py-6">
                    <p className="text-gray-500">
                      이 시스템에 대한 토큰이 없습니다.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead>
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            사용자
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            상태
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            생성일
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            만료일
                          </th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            관리
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {systemTokens.map((token) => (
                          <tr key={token.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm">
                              {getUserInfo(token.userId)}
                            </td>
                            <td className="px-4 py-3 text-sm">
                              {getTokenStatusLabel(token)}
                            </td>
                            <td className="px-4 py-3 text-sm">
                              {formatDate(token.createdAt)}
                            </td>
                            <td className="px-4 py-3 text-sm">
                              {formatDate(token.tokenExpiresAt)}
                            </td>
                            <td className="px-4 py-3 text-sm text-right">
                              <div className="flex items-center justify-end space-x-1">
                                <Button
                                  size="sm"
                                  variant={
                                    token.isActive ? "outline" : "primary"
                                  }
                                  onClick={() =>
                                    handleToggleTokenStatus(
                                      token.id,
                                      token.isActive
                                    )
                                  }
                                  disabled={
                                    actionLoading ||
                                    (!token.isActive &&
                                      new Date(token.tokenExpiresAt) <
                                        new Date())
                                  }
                                >
                                  {token.isActive ? "비활성화" : "활성화"}
                                </Button>

                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleOpenRenewModal(token)}
                                  disabled={actionLoading}
                                >
                                  갱신
                                </Button>

                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-red-600 border-red-600 hover:bg-red-50"
                                  onClick={() => handleDeleteToken(token.id)}
                                  disabled={actionLoading}
                                >
                                  삭제
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </Card>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">시스템 정보를 찾을 수 없습니다.</p>
              <Button onClick={() => router.push("/systems")} className="mt-4">
                시스템 목록으로 돌아가기
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* 토큰 갱신 모달 */}
      <Modal
        isOpen={isRenewModalOpen}
        title="토큰 갱신"
        onClose={() => setIsRenewModalOpen(false)}
      >
        <div className="space-y-4">
          {selectedToken && (
            <div className="mb-4">
              <p className="font-medium">{getUserInfo(selectedToken.userId)}</p>
              <p className="text-gray-500 text-sm">
                토큰 ID: {selectedToken.id}
              </p>
            </div>
          )}

          <Select
            label="새 유효 기간"
            name="expiresInDays"
            value={expiresInDays.toString()}
            onChange={(e) => setExpiresInDays(parseInt(e.target.value))}
            options={[
              { value: "30", label: "30일" },
              { value: "60", label: "60일" },
              { value: "90", label: "90일" },
              { value: "180", label: "6개월" },
              { value: "365", label: "1년" },
            ]}
          />

          <div className="flex justify-end space-x-2 mt-6">
            <Button
              variant="outline"
              onClick={() => setIsRenewModalOpen(false)}
              disabled={actionLoading}
            >
              취소
            </Button>
            <Button
              onClick={handleRenewToken}
              disabled={actionLoading}
              loading={actionLoading}
            >
              토큰 갱신
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
