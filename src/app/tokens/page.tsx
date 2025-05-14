"use client";

import { useState, useEffect } from "react";
import {
  Button,
  Card,
  TextField,
  Alert,
  Modal,
  Select,
} from "../components/LumirMock";
import { useTokens } from "../hooks/useTokens";
import { Token, CreateTokenRequest, RenewTokenRequest } from "../api/tokens";
import { getAllUsers } from "../api/users";
import AdminLayout from "../components/AdminLayout";

export default function TokensPage() {
  const {
    isLoading,
    error: hookError,
    fetchAllTokens,
    addToken,
    toggleTokenStatus,
    refreshToken,
    refreshAccessToken,
    removeToken,
    isTokenExpired,
    formatDate,
  } = useTokens();

  const [tokens, setTokens] = useState<Token[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);
  const [usersList, setUsersList] = useState<
    { value: string; label: string }[]
  >([]);
  const [formError, setFormError] = useState<string | null>(null);
  const [formData, setFormData] = useState<{
    userId: string;
    expiresInDays: number;
    refreshExpiresInDays: number;
  }>({
    userId: "",
    expiresInDays: 1,
    refreshExpiresInDays: 30,
  });

  // 사용자 목록 불러오기
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const response = await getAllUsers();
        if (response.success && response.data) {
          const userOptions = response.data.map((user) => ({
            value: user.id,
            label: `${user.name} (${user.email})`,
          }));
          setUsersList(userOptions);

          // 사용자 목록이 있으면 첫 번째 사용자를 기본값으로 설정
          if (userOptions.length > 0 && !formData.userId) {
            setFormData((prev) => ({
              ...prev,
              userId: userOptions[0].value,
            }));
          }
        }
      } catch (error) {
        console.error("사용자 목록을 불러오는데 실패했습니다:", error);
      }
    };

    loadUsers();
  }, []);

  // 토큰 목록 불러오기
  const loadTokens = async () => {
    const tokensData = await fetchAllTokens();
    setTokens(tokensData);
  };

  useEffect(() => {
    loadTokens();
  }, [fetchAllTokens]);

  // 토큰 생성 모달 열기
  const handleCreateToken = () => {
    setSelectedToken(null);

    // 기본 사용자 ID 설정 (사용자 목록의 첫 번째 항목)
    const defaultUserId = usersList.length > 0 ? usersList[0].value : "";

    setFormData({
      userId: defaultUserId,
      expiresInDays: 1,
      refreshExpiresInDays: 30,
    });

    setIsModalOpen(true);
  };

  // 토큰 갱신 모달 열기
  const handleRenewToken = (token: Token) => {
    setSelectedToken(token);
    setFormData({
      userId: token.userId,
      expiresInDays: 1,
      refreshExpiresInDays: 30,
    });
    setIsModalOpen(true);
  };

  // 입력 변경 처리
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "expiresInDays" || name === "refreshExpiresInDays") {
      setFormData((prev) => ({ ...prev, [name]: parseInt(value) }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // 토큰 생성 또는 갱신 처리
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 유효성 검사
    if (!selectedToken && !formData.userId) {
      setFormError("사용자를 선택해주세요.");
      return;
    }

    try {
      if (selectedToken) {
        // 토큰 갱신
        const renewData: RenewTokenRequest = {
          expiresInDays: formData.expiresInDays,
          refreshExpiresInDays: formData.refreshExpiresInDays,
        };

        const updatedToken = await refreshToken(selectedToken.id, renewData);

        if (updatedToken) {
          // 전체 토큰 목록 다시 로드
          await loadTokens();
          setIsModalOpen(false);
          setFormError(null);
        }
      } else {
        // 토큰 생성
        const tokenData: CreateTokenRequest = {
          userId: formData.userId,
          expiresInDays: formData.expiresInDays,
          refreshExpiresInDays: formData.refreshExpiresInDays,
        };

        const newToken = await addToken(tokenData);

        if (newToken) {
          // 전체 토큰 목록 다시 로드
          await loadTokens();
          setIsModalOpen(false);
          setFormError(null);
        }
      }
    } catch (err) {
      console.error("Token operation failed:", err);
      setFormError("토큰 작업 중 오류가 발생했습니다.");
    }
  };

  // 액세스 토큰만 갱신 처리
  const handleRefreshAccessToken = async (tokenId: string) => {
    const updatedToken = await refreshAccessToken(tokenId);

    if (updatedToken) {
      // 전체 토큰 목록 다시 로드
      await loadTokens();
    }
  };

  // 토큰 활성화/비활성화 처리
  const handleToggleStatus = async (
    tokenId: string,
    currentStatus: boolean
  ) => {
    const updatedToken = await toggleTokenStatus(tokenId, !currentStatus);

    if (updatedToken) {
      // 전체 토큰 목록 다시 로드
      await loadTokens();
    }
  };

  // 토큰 삭제 처리
  const handleDeleteToken = async (tokenId: string) => {
    if (!window.confirm("정말로 이 토큰을 삭제하시겠습니까?")) {
      return;
    }

    const success = await removeToken(tokenId);

    if (success) {
      // 전체 토큰 목록 다시 로드
      await loadTokens();
    }
  };

  // 검색 처리
  const handleSearch = () => {
    if (!searchQuery.trim()) {
      fetchAllTokens().then(setTokens);
      return;
    }

    const lowerQuery = searchQuery.toLowerCase();
    const results = tokens.filter(
      (token) =>
        token.userName?.toLowerCase().includes(lowerQuery) ||
        token.userEmail?.toLowerCase().includes(lowerQuery) ||
        token.id.toLowerCase().includes(lowerQuery)
    );

    setTokens(results);
  };

  // 필터링된 토큰 (상태 기준)
  const filteredTokens = tokens.filter((token) => {
    // 상태별 필터링
    if (selectedStatus === "all") {
      // 상태 필터가 '전체'인 경우
    } else if (selectedStatus === "active" && !token.isActive) {
      return false;
    } else if (selectedStatus === "inactive" && token.isActive) {
      return false;
    } else if (
      selectedStatus === "expired" &&
      !isTokenExpired(token.tokenExpiresAt)
    ) {
      return false;
    }

    return true;
  });

  // 토큰 테이블 렌더링 함수
  const renderTokenTable = (tokens: Token[]) => (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse">
        <thead>
          <tr className="bg-gray-50 dark:bg-gray-800">
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              사용자
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              상태
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              토큰 만료일
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              리프레시 만료일
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              마지막 접근
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              생성일
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              관리
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-700 divide-y divide-gray-200 dark:divide-gray-600">
          {tokens.map((token) => (
            <tr key={token.id}>
              <td className="px-4 py-3 text-sm">
                <div className="font-medium text-gray-900 dark:text-white">
                  {token.userName}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {token.userEmail || "이메일 없음"}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  ID: {token.id.substring(0, 8)}...
                </div>
              </td>
              <td className="px-4 py-3 text-sm">
                <div className="flex space-x-1">
                  <span
                    className={`px-2 py-0.5 text-xs rounded-full ${
                      token.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {token.isActive ? "활성" : "비활성"}
                  </span>
                  {isTokenExpired(token.tokenExpiresAt) && (
                    <span className="px-2 py-0.5 text-xs rounded-full bg-red-100 text-red-800">
                      만료
                    </span>
                  )}
                </div>
              </td>
              <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                {formatDate(token.tokenExpiresAt)}
              </td>
              <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                {formatDate(token.refreshTokenExpiresAt)}
              </td>
              <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                {formatDate(token.lastAccess)}
              </td>
              <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                {formatDate(token.createdAt)}
              </td>
              <td className="px-4 py-3 text-sm text-right">
                <div className="flex items-center justify-end space-x-1">
                  <Button
                    size="sm"
                    variant={token.isActive ? "outline" : "primary"}
                    onClick={() => handleToggleStatus(token.id, token.isActive)}
                    disabled={
                      !token.isActive && isTokenExpired(token.tokenExpiresAt)
                    }
                  >
                    {token.isActive ? "비활성화" : "활성화"}
                  </Button>
                  {token.isActive &&
                    !isTokenExpired(token.refreshTokenExpiresAt) && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRefreshAccessToken(token.id)}
                      >
                        액세스 갱신
                      </Button>
                    )}
                  {(isTokenExpired(token.tokenExpiresAt) ||
                    !token.isActive) && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleRenewToken(token)}
                    >
                      토큰 갱신
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-red-600 border-red-600 hover:bg-red-50"
                    onClick={() => handleDeleteToken(token.id)}
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
  );

  return (
    <AdminLayout title="토큰 관리">
      <div className="flex-1 p-8 bg-slate-50 dark:bg-slate-900 overflow-auto">
        <div className="max-w-7xl mx-auto">
          {/* 검색 및 필터 영역 */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            {/* 필터 영역 - 왼쪽으로 이동 */}
            <div className="flex items-center gap-4">
              {/* 상태 필터 */}
              <div className="flex items-center">
                <span className="text-sm text-gray-500 mr-2">상태:</span>
                <Select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-28"
                  options={[
                    { value: "all", label: "전체" },
                    { value: "active", label: "활성" },
                    { value: "inactive", label: "비활성" },
                    { value: "expired", label: "만료됨" },
                  ]}
                />
              </div>
            </div>

            {/* 검색 영역 - 오른쪽으로 이동 */}
            <div className="flex">
              <TextField
                placeholder="검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="min-w-[200px] md:min-w-[260px]"
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <Button onClick={handleSearch} className="ml-2">
                검색
              </Button>
            </div>
          </div>

          {/* 새 토큰 생성 버튼 */}
          <div className="mb-4">
            <Button onClick={handleCreateToken}>새 토큰 생성</Button>
          </div>

          {/* 에러 메시지 */}
          {hookError && (
            <Alert variant="error" className="mb-6">
              {hookError}
            </Alert>
          )}

          {/* 토큰 목록 */}
          <div>
            {isLoading ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                <p className="ml-3 text-gray-600">데이터를 불러오는 중...</p>
              </div>
            ) : filteredTokens.length === 0 ? (
              <Card className="p-6 text-center">
                <p className="text-gray-500">
                  {searchQuery
                    ? "검색 결과가 없습니다."
                    : "등록된 토큰이 없습니다."}
                </p>
                {!searchQuery && (
                  <Button className="mt-4" onClick={handleCreateToken}>
                    토큰 생성하기
                  </Button>
                )}
              </Card>
            ) : (
              // 단일 테이블로 모든 토큰 표시
              <Card className="overflow-hidden">
                {renderTokenTable(filteredTokens)}
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* 토큰 생성/갱신 모달 */}
      <Modal
        isOpen={isModalOpen}
        title={selectedToken ? "토큰 갱신" : "새 토큰 생성"}
        onClose={() => setIsModalOpen(false)}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {formError && (
            <Alert variant="error" className="mb-4">
              {formError}
            </Alert>
          )}

          {!selectedToken ? (
            <>
              <Select
                label="사용자"
                name="userId"
                value={formData.userId}
                onChange={handleInputChange}
                required
                options={usersList}
              />
            </>
          ) : (
            <div className="mb-4">
              <p className="font-medium">사용자: {selectedToken.userName}</p>
              <p className="text-gray-500 text-sm">
                토큰 ID: {selectedToken.id}
              </p>
            </div>
          )}

          <TextField
            label="액세스 토큰 유효 기간 (일)"
            name="expiresInDays"
            type="number"
            min={1}
            max={365}
            value={formData.expiresInDays.toString()}
            onChange={handleInputChange}
            required
          />

          <TextField
            label="리프레시 토큰 유효 기간 (일)"
            name="refreshExpiresInDays"
            type="number"
            min={30}
            max={730}
            value={formData.refreshExpiresInDays.toString()}
            onChange={handleInputChange}
            required
          />

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsModalOpen(false)}
            >
              취소
            </Button>
            <Button type="submit" loading={isLoading}>
              {selectedToken ? "토큰 갱신" : "토큰 생성"}
            </Button>
          </div>
        </form>
      </Modal>
    </AdminLayout>
  );
}
