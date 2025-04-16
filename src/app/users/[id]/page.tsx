"use client";

import React, { useState, useEffect } from "react";
import { Card, Button, Alert, Select, Modal } from "../../components/LumirMock";
import { getUserById, User } from "../../api/users";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import {
  Token,
  CreateTokenRequest,
  getTokensByUser,
  createToken,
} from "../../api/tokens";
import { System, getAllSystems } from "../../api/systems";

// 성별 포맷팅 함수
function formatGender(gender?: string) {
  if (!gender) return "-";
  return gender === "MALE" ? "남성" : gender === "FEMALE" ? "여성" : gender;
}

// 날짜 포맷팅 함수
function formatDate(dateString?: string) {
  if (!dateString) return "-";
  try {
    return new Date(dateString).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return dateString;
  }
}

export default function UserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userTokens, setUserTokens] = useState<Token[]>([]);
  const [systems, setSystems] = useState<System[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newTokenData, setNewTokenData] = useState<{
    systemId: string;
    expiresInDays: number;
  }>({
    systemId: "",
    expiresInDays: 30,
  });
  const [tokenLoading, setTokenLoading] = useState(false);

  const userId = params.id as string;

  useEffect(() => {
    const fetchUserDetail = async () => {
      if (!userId) {
        setError("사용자 ID가 유효하지 않습니다.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await getUserById(userId);
        if (response.success && response.data) {
          setUser(response.data);
        } else {
          setError(
            response.error?.message || "사용자 정보를 불러오는데 실패했습니다."
          );
        }
      } catch (err) {
        console.error("Error fetching user details:", err);
        setError("사용자 정보를 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetail();
  }, [userId]);

  // 시스템 목록 로드
  useEffect(() => {
    const loadSystems = async () => {
      try {
        const response = await getAllSystems();
        if (response.success && response.data) {
          setSystems(response.data);
        }
      } catch (err) {
        console.error("Error loading systems:", err);
      }
    };

    loadSystems();
  }, []);

  // 사용자의 토큰 목록 로드
  useEffect(() => {
    const loadUserTokens = async () => {
      if (!userId) return;

      try {
        const response = await getTokensByUser(userId);
        if (response.success && response.data) {
          setUserTokens(response.data);
        }
      } catch (err) {
        console.error("Error loading user tokens:", err);
      }
    };

    loadUserTokens();
  }, [userId]);

  // 토큰 생성 모달 열기
  const handleOpenCreateModal = () => {
    setNewTokenData({
      systemId: "",
      expiresInDays: 30,
    });
    setIsCreateModalOpen(true);
  };

  // 토큰 생성 처리
  const handleCreateToken = async () => {
    if (!userId || !newTokenData.systemId) {
      return;
    }

    setTokenLoading(true);

    try {
      const tokenRequest: CreateTokenRequest = {
        userId,
        systemId: newTokenData.systemId,
        expiresInDays: newTokenData.expiresInDays,
      };

      const response = await createToken(tokenRequest);

      if (response.success && response.data) {
        // 토큰을 생성한 후 토큰 목록을 다시 가져옴
        const updatedTokensResponse = await getTokensByUser(userId);
        if (updatedTokensResponse.success && updatedTokensResponse.data) {
          setUserTokens(updatedTokensResponse.data);
        }
        setIsCreateModalOpen(false);
      } else {
        setError(response.error?.message || "토큰 생성에 실패했습니다.");
      }
    } catch (err) {
      console.error("Error creating token:", err);
      setError("토큰 생성 중 오류가 발생했습니다.");
    } finally {
      setTokenLoading(false);
    }
  };

  // 토큰 상태 표시 함수
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

  // 날짜 포맷팅 함수
  const formatTokenDate = (dateString: string | null | undefined) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // 입력 변경 핸들러
  const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === "expiresInDays") {
      setNewTokenData((prev) => ({ ...prev, [name]: parseInt(value) }));
    } else {
      setNewTokenData((prev) => ({ ...prev, [name]: value }));
    }
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
                href="/users"
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
                사용자 목록으로 돌아가기
              </Link>
              <h1 className="text-3xl font-bold">사용자 상세 정보</h1>
            </div>
          </div>

          {/* 에러 메시지 */}
          {error && (
            <Alert variant="error" className="mb-6">
              {error}
            </Alert>
          )}

          {/* 유저 정보 */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
              <p className="ml-3 text-gray-600">데이터를 불러오는 중...</p>
            </div>
          ) : user ? (
            <div className="space-y-6">
              {/* 기본 정보 */}
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">기본 정보</h2>
                <div className="space-y-1">
                  <InfoField label="이름" value={user.name} />
                  <InfoField label="사번" value={user.employeeNumber} />
                  <InfoField label="이메일" value={user.email} />
                  <InfoField label="전화번호" value={user.phoneNumber || "-"} />
                  <InfoField label="성별" value={formatGender(user.gender)} />
                  <InfoField
                    label="생년월일"
                    value={formatDate(user.dateOfBirth)}
                  />
                </div>
              </Card>

              {/* 직장 정보 */}
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">직장 정보</h2>
                <div className="space-y-1">
                  <InfoField label="부서" value={user.department || "-"} />
                  <InfoField label="직위" value={user.position || "-"} />
                  <InfoField label="직급" value={user.rank || "-"} />
                  <InfoField label="입사일" value={formatDate(user.hireDate)} />
                  <InfoField
                    label="재직 상태"
                    value={
                      <span
                        className={`inline-flex px-2 py-1 text-xs rounded-full ${
                          user.status === "재직중"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {user.status || "미설정"}
                      </span>
                    }
                  />
                </div>
              </Card>

              {/* 계정 정보 */}
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">계정 정보</h2>
                <div className="space-y-1">
                  <InfoField label="사용자 ID" value={user.id} />
                  <InfoField
                    label="생성일"
                    value={formatDate(user.createdAt)}
                  />
                  <InfoField
                    label="마지막 수정일"
                    value={formatDate(user.updatedAt)}
                  />
                </div>
              </Card>

              {/* 토큰 정보 */}
              <Card className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">토큰 관리</h2>
                  <Button onClick={handleOpenCreateModal}>새 토큰 발급</Button>
                </div>

                {userTokens.length === 0 ? (
                  <div className="text-center py-6">
                    <p className="text-gray-500">발급된 토큰이 없습니다.</p>
                    <Button onClick={handleOpenCreateModal} className="mt-3">
                      토큰 발급하기
                    </Button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead>
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            시스템
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
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            마지막 접근
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {userTokens.map((token) => (
                          <tr key={token.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm">
                              {token.systemName}
                            </td>
                            <td className="px-4 py-3 text-sm">
                              {getTokenStatusLabel(token)}
                            </td>
                            <td className="px-4 py-3 text-sm">
                              {formatTokenDate(token.createdAt)}
                            </td>
                            <td className="px-4 py-3 text-sm">
                              {formatTokenDate(token.tokenExpiresAt)}
                            </td>
                            <td className="px-4 py-3 text-sm">
                              {formatTokenDate(token.lastAccess)}
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
              <p className="text-gray-500">사용자 정보를 찾을 수 없습니다.</p>
              <Button onClick={() => router.push("/users")} className="mt-4">
                사용자 목록으로 돌아가기
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* 토큰 생성 모달 */}
      <Modal
        isOpen={isCreateModalOpen}
        title="새 토큰 발급"
        onClose={() => setIsCreateModalOpen(false)}
      >
        <div className="space-y-4">
          <Select
            label="시스템 선택"
            name="systemId"
            value={newTokenData.systemId}
            onChange={handleInputChange}
            required
            options={[
              { value: "", label: "시스템 선택" },
              ...systems.map((system) => ({
                value: system.id,
                label: system.name,
              })),
            ]}
          />

          <Select
            label="유효 기간"
            name="expiresInDays"
            value={newTokenData.expiresInDays.toString()}
            onChange={handleInputChange}
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
              onClick={() => setIsCreateModalOpen(false)}
            >
              취소
            </Button>
            <Button
              onClick={handleCreateToken}
              disabled={!newTokenData.systemId || tokenLoading}
              loading={tokenLoading}
            >
              토큰 발급
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
