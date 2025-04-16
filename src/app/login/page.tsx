"use client";

import { useState, useEffect } from "react";
import { Button, Card, TextField, Alert } from "../components/LumirMock";
import { useRouter } from "next/navigation";
import { ApiResponse } from "../api/types";
import { AdminAuthData } from "../api/auth";

export default function AdminLogin({
  login,
  isAuthenticated,
  isLoading: authLoading,
  error: authError,
}: {
  login: (
    email: string,
    password: string
  ) => Promise<ApiResponse<AdminAuthData>>;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string;
}) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 사용자가 이미 인증된 경우 대시보드로 리다이렉트
  useEffect(() => {
    console.log("로그인 페이지 - 인증 상태 확인:", isAuthenticated);
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  // 로그인 폼 제출 처리
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // 폼 유효성 검사
    if (!email.trim() || !password.trim()) {
      setError("이메일과 비밀번호를 입력해주세요.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // useAuth 훅의 로그인 함수 사용
      const response = await login(email, password);
      console.log("로그인 응답:", response);

      if (!response.success) {
        // 오류 메시지 표시
        setError(response.error?.message || "로그인에 실패했습니다.");
      } else {
        console.log("로그인 성공");
      }
      // 로그인 성공 시 위의 useEffect가 대시보드로 리다이렉트
    } catch (error) {
      console.error("로그인 오류:", error);
      setError("서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  // 초기 인증 확인 중 로딩 상태 표시
  if (authLoading && !isAuthenticated) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            인증 상태 확인 중...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900 p-4">
      <div className="w-full max-w-md mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          LSSO 관리자
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          관리자 계정으로 로그인하세요
        </p>
        <p className="text-xs text-gray-500 mt-1">
          API: localhost:3030/admin/auth
        </p>
      </div>

      <Card className="p-8 w-full max-w-md shadow-lg">
        {(error || authError) && (
          <Alert variant="error" className="mb-6">
            {error || authError}
          </Alert>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <TextField
            label="관리자 이메일"
            type="email"
            placeholder="admin@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            required
          />

          <TextField
            label="비밀번호"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            required
          />

          <Button
            type="submit"
            className="w-full py-2.5"
            loading={loading || authLoading}
          >
            로그인
          </Button>
        </form>

        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-center text-slate-500">
            * 테스트 계정: admin@example.com / admin123
          </p>
        </div>
      </Card>
    </main>
  );
}
