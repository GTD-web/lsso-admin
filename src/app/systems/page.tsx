"use client";

import { useState, useEffect } from "react";
import { Button, Card, TextField, Alert, Modal } from "../components/LumirMock";
import { useSystems } from "../hooks/useSystems";
import { System } from "../api/systems";
import { useRouter } from "next/navigation";
import AdminLayout from "../components/AdminLayout";

export default function SystemsPage() {
  const {
    isLoading,
    error,
    setError,
    fetchAllSystems,
    searchSystemsByQuery,
    addSystem,
    editSystem,
    regenerateKeys,
  } = useSystems();
  const router = useRouter();

  const [systems, setSystems] = useState<System[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddSystem, setShowAddSystem] = useState(false);
  const [editingSystem, setEditingSystem] = useState<System | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    clientId: "",
    clientSecret: "",
    domain: "",
    allowedOrigin: "",
    healthCheckUrl: "",
    isActive: true,
  });
  // 신규 생성된 시스템의 clientId/clientSecret을 보여주는 모달을 위한 상태 추가
  const [showCredentialsModal, setShowCredentialsModal] = useState(false);
  const [newCredentials, setNewCredentials] = useState<{
    clientId: string;
    clientSecret: string;
    systemName: string;
  }>({ clientId: "", clientSecret: "", systemName: "" });

  // 인증 정보 갱신 전 경고 모달을 위한 상태 추가
  const [showRegenerateWarningModal, setShowRegenerateWarningModal] =
    useState(false);
  const [regenerating, setRegenerating] = useState(false);

  // 시스템 목록 불러오기
  useEffect(() => {
    const loadSystems = async () => {
      const systemsData = await fetchAllSystems();
      setSystems(systemsData);
    };

    loadSystems();
  }, [fetchAllSystems]);

  // 검색 처리
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      const allSystems = await fetchAllSystems();
      setSystems(allSystems);
      return;
    }

    const results = await searchSystemsByQuery(searchQuery);
    setSystems(results);
  };

  const handleAddNewClick = () => {
    setEditingSystem(null);
    setFormData({
      name: "",
      description: "",
      clientId: "",
      clientSecret: "",
      domain: "",
      allowedOrigin: "",
      healthCheckUrl: "",
      isActive: true,
    });
    setShowAddSystem(true);
  };

  const handleCancelClick = () => {
    setShowAddSystem(false);
    setEditingSystem(null);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const target = e.target as HTMLInputElement;
      setFormData((prev) => ({ ...prev, [name]: target.checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const allowedOriginArray = formData.allowedOrigin
        .split(",")
        .map((origin) => origin.trim())
        .filter(Boolean);

      const systemData = {
        name: formData.name,
        description: formData.description,
        clientId: formData.clientId,
        clientSecret: formData.clientSecret,
        domain: formData.domain,
        allowedOrigin: allowedOriginArray,
        healthCheckUrl: formData.healthCheckUrl,
        isActive: formData.isActive,
      };

      if (editingSystem) {
        // 시스템 수정
        const updatedSystem = await editSystem(editingSystem.id, systemData);
        if (updatedSystem) {
          setSystems((prev) =>
            prev.map((s) => (s.id === editingSystem.id ? updatedSystem : s))
          );
          setShowAddSystem(false);
          setEditingSystem(null);
        }
      } else {
        // 시스템 생성
        const newSystem = await addSystem(systemData);
        if (newSystem) {
          setSystems((prev) => [...prev, newSystem]);
          setShowAddSystem(false);

          // 신규 생성된 시스템의 인증 정보를 모달로 표시
          setNewCredentials({
            clientId: newSystem.clientId,
            clientSecret: newSystem.clientSecret,
            systemName: newSystem.name,
          });
          setShowCredentialsModal(true);
        }
      }
    } catch (err) {
      console.error("Error saving system:", err);
      setError("시스템을 저장하는데 실패했습니다.");
    }
  };

  // 인증 정보 갱신 처리 함수
  const handleRegenerateKeys = async () => {
    if (!editingSystem) return;

    setRegenerating(true);
    setError(null);

    try {
      const credentials = await regenerateKeys(editingSystem.id);
      if (credentials) {
        setFormData((prev) => ({
          ...prev,
          clientId: credentials.clientId,
          clientSecret: credentials.clientSecret,
        }));

        // 인증 정보 갱신 후 모달로 표시
        setNewCredentials({
          clientId: credentials.clientId,
          clientSecret: credentials.clientSecret,
          systemName: editingSystem.name,
        });
        setShowCredentialsModal(true);
      }
    } catch (err) {
      console.error("Error regenerating keys:", err);
      setError("인증 정보 갱신에 실패했습니다.");
    } finally {
      setRegenerating(false);
      setShowRegenerateWarningModal(false);
    }
  };

  // 날짜 포맷팅
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // 클립보드에 복사하는 함수
  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        alert("클립보드에 복사되었습니다.");
      })
      .catch((err) => {
        console.error("복사 실패:", err);
      });
  };

  return (
    <AdminLayout title="시스템 관리">
      <div className="flex-1 p-4 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto">
          {!showAddSystem && (
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-4">
                {/* 필터 영역은 필요한 경우 여기에 추가 */}
                <Button onClick={handleAddNewClick}>시스템 추가</Button>
              </div>

              <div className="flex">
                <TextField
                  placeholder="시스템 이름, 설명, 도메인 등 검색..."
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
          )}

          {/* 에러 메시지 */}
          {error && (
            <Alert variant="error" className="mb-6">
              {error}
            </Alert>
          )}

          {showAddSystem ? (
            <Card className="p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">
                {editingSystem ? "시스템 수정" : "새 시스템 등록"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <TextField
                  label="시스템 이름"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  fullWidth
                />

                <TextField
                  label="설명"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  fullWidth
                />

                <TextField
                  label="도메인"
                  name="domain"
                  value={formData.domain}
                  onChange={handleInputChange}
                  required
                  placeholder="example.com"
                  fullWidth
                />

                {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <TextField
                    label="클라이언트 ID"
                    name="clientId"
                    value={formData.clientId}
                    onChange={handleInputChange}
                    required
                    fullWidth
                  />
                  <TextField
                    label="클라이언트 시크릿"
                    name="clientSecret"
                    value={formData.clientSecret}
                    onChange={handleInputChange}
                    required={!editingSystem}
                    placeholder={
                      editingSystem ? "변경하지 않으려면 비워두세요" : ""
                    }
                    fullWidth
                  />
                </div> */}

                <div className="flex justify-end space-x-2">
                  {/* <Button
                    type="button"
                    variant="outline"
                    onClick={async () => {
                      const credentials = await regenerateKeys(
                        editingSystem?.id || ""
                      );
                      if (credentials) {
                        setFormData((prev) => ({
                          ...prev,
                          clientId: credentials.clientId,
                          clientSecret: credentials.clientSecret,
                        }));
                      }
                    }}
                  >
                    인증 정보 자동 생성
                  </Button> */}
                  {editingSystem && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowRegenerateWarningModal(true)}
                    >
                      인증 정보 갱신
                    </Button>
                  )}
                </div>

                <TextField
                  label="허용된 도메인 (쉼표로 구분)"
                  name="allowedOrigin"
                  value={formData.allowedOrigin}
                  onChange={handleInputChange}
                  placeholder="https://example.com, https://app.example.com"
                  required
                  fullWidth
                />

                <TextField
                  label="헬스체크 URL"
                  name="healthCheckUrl"
                  value={formData.healthCheckUrl}
                  onChange={handleInputChange}
                  placeholder="https://example.com/health"
                  fullWidth
                />

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isActive"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        isActive: e.target.checked,
                      }))
                    }
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="isActive"
                    className="ml-2 block text-sm text-gray-900"
                  >
                    활성화됨
                  </label>
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancelClick}
                  >
                    취소
                  </Button>
                  <Button type="submit" loading={isLoading}>
                    저장
                  </Button>
                </div>
              </form>
            </Card>
          ) : (
            <div className="space-y-6">
              {isLoading ? (
                <div className="flex justify-center items-center py-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                  <p className="ml-3 text-gray-600">데이터를 불러오는 중...</p>
                </div>
              ) : systems.length === 0 ? (
                <Card className="p-6 text-center">
                  <p className="text-gray-500">
                    {searchQuery
                      ? "검색 결과가 없습니다."
                      : "등록된 시스템이 없습니다."}
                  </p>
                  {!searchQuery && (
                    <Button className="mt-4" onClick={handleAddNewClick}>
                      시스템 추가하기
                    </Button>
                  )}
                </Card>
              ) : (
                systems.map((system) => (
                  <Card key={system.id} className="p-6">
                    <div
                      className="cursor-pointer"
                      onClick={() => router.push(`/systems/${system.id}`)}
                    >
                      <div className="flex items-center">
                        <h2 className="text-xl font-bold">{system.name}</h2>
                        <span
                          className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                            system.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {system.isActive ? "활성" : "비활성"}
                        </span>
                      </div>
                      <p className="text-gray-500 mt-1">
                        {system.description || "설명 없음"}
                      </p>

                      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <h3 className="font-medium text-gray-900">
                            허용된 도메인
                          </h3>
                          <p className="text-gray-600 mt-1">
                            {system.allowedOrigin.join(", ")}
                          </p>
                        </div>
                        {system.healthCheckUrl && (
                          <div>
                            <h3 className="font-medium text-gray-900">
                              헬스체크 URL
                            </h3>
                            <p className="text-gray-600 mt-1">
                              {system.healthCheckUrl}
                            </p>
                          </div>
                        )}
                        <div>
                          <h3 className="font-medium text-gray-900">생성일</h3>
                          <p className="text-gray-600 mt-1">
                            {formatDate(system.createdAt)}
                          </p>
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">
                            마지막 수정일
                          </h3>
                          <p className="text-gray-600 mt-1">
                            {formatDate(system.updatedAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          )}

          {/* 인증 정보 갱신 경고 모달 */}
          <Modal
            isOpen={showRegenerateWarningModal}
            onClose={() => setShowRegenerateWarningModal(false)}
            title="인증 정보 갱신 확인"
            className="max-w-lg"
          >
            <div className="space-y-6">
              <Alert variant="warning" className="mb-4">
                <div className="flex items-center mb-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="font-bold">경고</span>
                </div>
                <p className="mb-2">
                  인증 정보를 갱신하면 기존 인증 정보는 더 이상 사용할 수 없게
                  됩니다.
                </p>
                <p>
                  이미 사용 중인 시스템이라면 새로운 인증 정보로 업데이트해야
                  합니다.
                </p>
              </Alert>

              <p className="text-sm text-gray-600">
                정말로 인증 정보를 갱신하시겠습니까? 이 작업은 취소할 수
                없습니다.
              </p>

              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowRegenerateWarningModal(false)}
                >
                  취소
                </Button>
                <Button
                  className="bg-yellow-600 hover:bg-yellow-700"
                  onClick={handleRegenerateKeys}
                  loading={regenerating}
                >
                  인증 정보 갱신
                </Button>
              </div>
            </div>
          </Modal>

          {/* 시스템 생성 후 인증 정보를 보여주는 모달 */}
          <Modal
            isOpen={showCredentialsModal}
            onClose={() => setShowCredentialsModal(false)}
            title="시스템 인증 정보"
            className="max-w-lg"
          >
            <div className="space-y-6">
              <Alert variant="warning" className="mb-4">
                <div className="flex items-center mb-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="font-bold">중요 공지</span>
                </div>
                <p>
                  클라이언트 시크릿은{" "}
                  <span className="font-bold">최초 1회만 표시</span>됩니다.
                  반드시 안전한 곳에 저장해주세요!
                </p>
              </Alert>

              <div>
                <h3 className="font-medium text-gray-900 mb-1">시스템 이름</h3>
                <p className="text-gray-800">{newCredentials.systemName}</p>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <h3 className="font-medium text-gray-900">클라이언트 ID</h3>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(newCredentials.clientId)}
                  >
                    복사
                  </Button>
                </div>
                <div className="bg-gray-100 p-3 rounded-md break-all font-mono text-sm">
                  {newCredentials.clientId}
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <h3 className="font-medium text-gray-900">
                    클라이언트 시크릿
                  </h3>
                  {newCredentials.clientSecret && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        copyToClipboard(newCredentials.clientSecret)
                      }
                    >
                      복사
                    </Button>
                  )}
                </div>
                {newCredentials.clientSecret ? (
                  <div className="bg-gray-100 p-3 rounded-md break-all font-mono text-sm">
                    {newCredentials.clientSecret}
                  </div>
                ) : (
                  <Alert variant="info" className="text-sm">
                    보안상의 이유로 클라이언트 시크릿은 최초 생성 또는 갱신
                    시에만 표시됩니다.
                  </Alert>
                )}
              </div>

              <div className="border-t pt-4 mt-4">
                <p className="text-sm text-gray-600 mb-4">
                  이 인증 정보는 시스템 인증에 사용됩니다. 보안을 위해 시크릿
                  키는 서버에 해시화되어 저장되며, 다시 확인할 수 없습니다. 만약
                  키를 분실했다면 재생성해야 합니다.
                </p>
                <div className="flex justify-end">
                  <Button onClick={() => setShowCredentialsModal(false)}>
                    확인 및 닫기
                  </Button>
                </div>
              </div>
            </div>
          </Modal>
        </div>
      </div>
    </AdminLayout>
  );
}
