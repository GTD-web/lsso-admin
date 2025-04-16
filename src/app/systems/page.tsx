"use client";

import { useState, useEffect } from "react";
import { Button, Card, TextField, Alert } from "../components/LumirMock";
import { useSystems } from "../hooks/useSystems";
import { System } from "../api/systems";
import { useRouter } from "next/navigation";

export default function SystemsPage() {
  const {
    isLoading,
    error,
    setError,
    fetchAllSystems,
    searchSystemsByQuery,
    addSystem,
    editSystem,
    removeSystem,
    generateCredentials,
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
    allowedOrigin: "",
    healthCheckUrl: "",
    isActive: true,
  });

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
      allowedOrigin: "",
      healthCheckUrl: "",
      isActive: true,
    });
    setShowAddSystem(true);
  };

  const handleEditClick = (system: System) => {
    setEditingSystem(system);
    setFormData({
      name: system.name,
      description: system.description || "",
      clientId: system.clientId,
      clientSecret: "", // 보안상 빈칸으로 시작
      allowedOrigin: system.allowedOrigin.join(", "),
      healthCheckUrl: system.healthCheckUrl || "",
      isActive: system.isActive,
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
        }
      }
    } catch (err) {
      console.error("Error saving system:", err);
      setError("시스템을 저장하는데 실패했습니다.");
    }
  };

  const handleDeleteSystem = async (systemId: string) => {
    if (!window.confirm("정말로 이 시스템을 삭제하시겠습니까?")) {
      return;
    }

    const success = await removeSystem(systemId);
    if (success) {
      setSystems((prev) => prev.filter((s) => s.id !== systemId));
    }
  };

  const handleGenerateCredentials = () => {
    const { clientId, clientSecret } = generateCredentials();

    setFormData((prev) => ({
      ...prev,
      clientId,
      clientSecret,
    }));
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

  return (
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              </div>

              <div className="flex justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleGenerateCredentials}
                >
                  인증 정보 자동 생성
                </Button>
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
                  <div className="flex justify-between">
                    <div
                      className="flex-1 cursor-pointer"
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
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditClick(system)}
                      >
                        수정
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 border-red-600 hover:bg-red-50"
                        onClick={() => handleDeleteSystem(system.id)}
                      >
                        삭제
                      </Button>
                    </div>
                  </div>

                  <div
                    className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm cursor-pointer"
                    onClick={() => router.push(`/systems/${system.id}`)}
                  >
                    <div>
                      <h3 className="font-medium text-gray-900">
                        클라이언트 ID
                      </h3>
                      <p className="text-gray-600 mt-1">{system.clientId}</p>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">
                        클라이언트 시크릿
                      </h3>
                      <p className="text-gray-600 mt-1">
                        ••••••••••••••••
                        <Button
                          size="sm"
                          variant="ghost"
                          className="ml-2 text-xs"
                          onClick={(e) => {
                            e.stopPropagation();
                            alert(`시크릿: ${system.clientSecret}`);
                          }}
                        >
                          보기
                        </Button>
                      </p>
                    </div>
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
                </Card>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
