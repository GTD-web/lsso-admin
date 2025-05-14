"use client";

import React, { useState, useEffect } from "react";
import { Card, Button, Alert } from "../../components/LumirMock";
import { getSystemById, System } from "../../api/systems";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

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

            {/* 토큰 관리 섹션 제거 */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">시스템 관리</h2>
              <div className="flex space-x-2 mt-4">
                <Button
                  onClick={() => router.push(`/systems/edit/${system.id}`)}
                  variant="outline"
                >
                  시스템 정보 수정
                </Button>
                <Button
                  onClick={() => router.push("/tokens")}
                  variant="outline"
                >
                  토큰 관리 페이지로 이동
                </Button>
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
      </div>
    </div>
  );
}
