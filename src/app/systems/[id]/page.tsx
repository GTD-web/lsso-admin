"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  Button,
  Alert,
  Modal,
  TextField,
} from "../../components/LumirMock";
import {
  getSystemById,
  System,
  regenerateSystemKeys,
  deleteSystem,
  updateSystem,
} from "../../api/systems";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import AdminLayout from "../../components/AdminLayout";

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
  // 인증 정보 갱신 관련 상태
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showCredentialsModal, setShowCredentialsModal] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [newCredentials, setNewCredentials] = useState<{
    clientId: string;
    clientSecret: string;
  }>({ clientId: "", clientSecret: "" });
  // 시스템 삭제 관련 상태
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  // 인라인 편집 관련 상태
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState<string>("");
  const [saving, setSaving] = useState(false);
  // 시스템 상태 변경 관련 상태
  const [showStatusConfirmModal, setShowStatusConfirmModal] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

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

  // 인증 정보 갱신 처리
  const handleRegenerateKeys = async () => {
    if (!system) return;
    setRegenerating(true);
    setError(null);

    try {
      const response = await regenerateSystemKeys(system.id);
      if (response.success && response.data) {
        setNewCredentials({
          clientId: response.data.clientId,
          clientSecret: response.data.clientSecret,
        });
        // 시스템 정보 업데이트
        setSystem({
          ...system,
          clientId: response.data.clientId,
        });
        setShowCredentialsModal(true);
      } else {
        setError(response.error?.message || "인증 정보 갱신에 실패했습니다.");
      }
    } catch (err) {
      console.error("Error regenerating keys:", err);
      setError("인증 정보 갱신에 실패했습니다.");
    } finally {
      setRegenerating(false);
      setShowConfirmModal(false);
    }
  };

  // 시스템 삭제 처리
  const handleDeleteSystem = async () => {
    if (!system) return;
    setDeleting(true);
    setError(null);

    try {
      const response = await deleteSystem(system.id);
      if (response.success) {
        router.push("/systems");
      } else {
        setError(response.error?.message || "시스템 삭제에 실패했습니다.");
      }
    } catch (err) {
      console.error("Error deleting system:", err);
      setError("시스템 삭제에 실패했습니다.");
    } finally {
      setDeleting(false);
      setShowDeleteConfirmModal(false);
    }
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

  // 필드 수정 처리
  const handleFieldEdit = async () => {
    if (!system || !editingField || saving) return;

    setSaving(true);
    setError(null);

    try {
      const updateData: Record<string, string | string[]> = {};

      // 특별한 처리가 필요한 필드
      if (editingField === "allowedOrigin") {
        const origins = editingValue
          .split(",")
          .map((o) => o.trim())
          .filter(Boolean);
        updateData.allowedOrigin = origins;
      } else {
        updateData[editingField] = editingValue;
      }

      const response = await updateSystem(system.id, updateData);

      if (response.success && response.data) {
        setSystem(response.data);
      } else {
        setError(response.error?.message || "시스템 정보 수정에 실패했습니다.");
      }
    } catch (err) {
      console.error("Error updating system field:", err);
      setError("시스템 정보 수정에 실패했습니다.");
    } finally {
      setSaving(false);
      setEditingField(null);
    }
  };

  const startEditing = (field: string, initialValue: string) => {
    setEditingField(field);
    setEditingValue(initialValue);
  };

  // 시스템 상태 변경 처리
  const handleToggleStatus = async () => {
    if (!system) return;

    setUpdatingStatus(true);
    setError(null);

    try {
      const newStatus = !system.isActive;
      const response = await updateSystem(system.id, { isActive: newStatus });

      if (response.success && response.data) {
        setSystem({
          ...system,
          isActive: newStatus,
        });
      } else {
        setError(response.error?.message || "시스템 상태 변경에 실패했습니다.");
      }
    } catch (err) {
      console.error("Error updating system status:", err);
      setError("시스템 상태 변경에 실패했습니다.");
    } finally {
      setUpdatingStatus(false);
      setShowStatusConfirmModal(false);
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

  // 편집 가능한 정보 필드 컴포넌트
  const EditableInfoField = ({
    label,
    field,
    value,
    editable = true,
  }: {
    label: string;
    field: string;
    value: string;
    editable?: boolean;
  }) => (
    <div className="grid grid-cols-1 md:grid-cols-3 py-3 border-b border-gray-100 last:border-0">
      <div className="text-sm font-medium text-gray-500">{label}</div>
      <div className="text-sm text-gray-900 md:col-span-2 mt-1 md:mt-0">
        {editingField === field ? (
          <TextField
            value={editingValue}
            onChange={(e) => setEditingValue(e.target.value)}
            onBlur={handleFieldEdit}
            onKeyDown={(e) => e.key === "Enter" && handleFieldEdit()}
            autoFocus
            className="w-full"
          />
        ) : (
          <div
            className={`${
              editable
                ? "group cursor-pointer hover:bg-gray-50 hover:border-dashed hover:border hover:border-gray-300 p-2 rounded transition-all"
                : ""
            }`}
            onClick={() => editable && startEditing(field, value)}
          >
            <div className="flex items-center">
              <span className="flex-grow">{value || "-"}</span>
              {editable && (
                <span className="ml-2 text-indigo-500 opacity-0 group-hover:opacity-100 text-xs">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                    />
                  </svg>
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <AdminLayout title="시스템 상세정보">
      <div className="p-8 bg-slate-50 dark:bg-slate-900">
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
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-semibold">기본 정보</h2>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setShowConfirmModal(true)}
                      className="text-yellow-600 border-yellow-600 hover:bg-yellow-50"
                    >
                      인증 정보 갱신
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setShowStatusConfirmModal(true)}
                      className={
                        system?.isActive
                          ? "text-red-600 border-red-600 hover:bg-red-50"
                          : "text-green-600 border-green-600 hover:bg-green-50"
                      }
                    >
                      {system?.isActive ? "비활성화" : "활성화"}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-600 border-red-600 hover:bg-red-50"
                      onClick={() => setShowDeleteConfirmModal(true)}
                    >
                      삭제
                    </Button>
                  </div>
                </div>
                <div className="space-y-1">
                  <EditableInfoField
                    label="시스템 이름"
                    field="name"
                    value={system.name}
                  />
                  <EditableInfoField
                    label="설명"
                    field="description"
                    value={system.description || ""}
                  />
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
                  <EditableInfoField
                    label="허용된 출처"
                    field="allowedOrigin"
                    value={
                      system.allowedOrigin.length > 0
                        ? system.allowedOrigin.join(", ")
                        : ""
                    }
                  />
                  <EditableInfoField
                    label="헬스체크 URL"
                    field="healthCheckUrl"
                    value={system.healthCheckUrl || ""}
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
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">시스템 정보를 찾을 수 없습니다.</p>
              <Button onClick={() => router.push("/systems")} className="mt-4">
                시스템 목록으로 돌아가기
              </Button>
            </div>
          )}

          {/* 인증 정보 갱신 확인 모달 */}
          <Modal
            isOpen={showConfirmModal}
            onClose={() => setShowConfirmModal(false)}
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
                  className="bg-indigo-600 hover:bg-indigo-700 text-white"
                  onClick={() => setShowConfirmModal(false)}
                >
                  취소
                </Button>
                <Button
                  variant="outline"
                  className="text-yellow-600 border-yellow-600 hover:bg-yellow-50"
                  onClick={handleRegenerateKeys}
                  loading={regenerating}
                >
                  인증 정보 갱신
                </Button>
              </div>
            </div>
          </Modal>

          {/* 시스템 삭제 확인 모달 */}
          <Modal
            isOpen={showDeleteConfirmModal}
            onClose={() => setShowDeleteConfirmModal(false)}
            title="시스템 삭제 확인"
            className="max-w-lg"
          >
            <div className="space-y-6">
              <Alert variant="error" className="mb-4">
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
                  시스템을 삭제하면 관련된 모든 데이터가 영구적으로 제거됩니다.
                </p>
                <p>
                  이 시스템에 연결된 모든 애플리케이션이 더 이상 작동하지 않게
                  됩니다.
                </p>
              </Alert>

              <p className="text-sm text-gray-600">
                시스템 &quot;{system?.name}&quot;을(를) 정말로 삭제하시겠습니까?
                이 작업은 취소할 수 없습니다.
              </p>

              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  className="bg-indigo-600 hover:bg-indigo-700 text-white"
                  onClick={() => setShowDeleteConfirmModal(false)}
                >
                  취소
                </Button>
                <Button
                  variant="outline"
                  className="text-red-600 border-red-600 hover:bg-red-50"
                  onClick={handleDeleteSystem}
                  loading={deleting}
                >
                  삭제
                </Button>
              </div>
            </div>
          </Modal>

          {/* 새 인증 정보 모달 */}
          <Modal
            isOpen={showCredentialsModal}
            onClose={() => setShowCredentialsModal(false)}
            title="새 인증 정보"
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
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(newCredentials.clientSecret)}
                  >
                    복사
                  </Button>
                </div>
                <div className="bg-gray-100 p-3 rounded-md break-all font-mono text-sm">
                  {newCredentials.clientSecret}
                </div>
              </div>

              <div className="border-t pt-4 mt-4">
                <p className="text-sm text-gray-600 mb-4">
                  이 인증 정보는 시스템 인증에 사용됩니다. 보안을 위해 시크릿
                  키는 서버에 해시화되어 저장되며, 다시 확인할 수 없습니다. 만약
                  키를 분실했다면 다시 재생성해야 합니다.
                </p>
                <div className="flex justify-end">
                  <Button onClick={() => setShowCredentialsModal(false)}>
                    확인 및 닫기
                  </Button>
                </div>
              </div>
            </div>
          </Modal>

          {/* 시스템 상태 변경 확인 모달 */}
          <Modal
            isOpen={showStatusConfirmModal}
            onClose={() => setShowStatusConfirmModal(false)}
            title={`시스템 ${system?.isActive ? "비활성화" : "활성화"} 확인`}
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
                {system?.isActive ? (
                  <p>
                    시스템을 비활성화하면 모든 인증 프로세스가 중단됩니다. 이
                    시스템을 사용하는 모든 애플리케이션에서 로그인이
                    불가능해집니다.
                  </p>
                ) : (
                  <p>
                    시스템을 활성화하면 인증 프로세스가 다시 작동합니다. 이
                    시스템을 사용하는 애플리케이션에서 로그인이 가능해집니다.
                  </p>
                )}
              </Alert>

              <p className="text-sm text-gray-600">
                정말로 시스템 &quot;{system?.name}&quot;을(를){" "}
                {system?.isActive ? "비활성화" : "활성화"}하시겠습니까?
              </p>

              <div className="flex justify-end space-x-2 pt-4">
                {system?.isActive ? (
                  <>
                    <Button
                      className="bg-indigo-600 hover:bg-indigo-700 text-white"
                      onClick={() => setShowStatusConfirmModal(false)}
                    >
                      취소
                    </Button>
                    <Button
                      variant="outline"
                      className="text-red-600 border-red-600 hover:bg-red-50"
                      onClick={handleToggleStatus}
                      loading={updatingStatus}
                    >
                      비활성화
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => setShowStatusConfirmModal(false)}
                    >
                      취소
                    </Button>
                    <Button
                      className="bg-green-600 hover:bg-green-700 text-white"
                      onClick={handleToggleStatus}
                      loading={updatingStatus}
                    >
                      활성화
                    </Button>
                  </>
                )}
              </div>
            </div>
          </Modal>
        </div>
      </div>
    </AdminLayout>
  );
}
