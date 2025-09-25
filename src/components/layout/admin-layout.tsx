"use client";

/**
 * 관리자 메인 레이아웃 컴포넌트
 */

import { useAuth } from "@/app/_context/auth-provider";
import { Sidebar } from "./sidebar";
import { Header } from "./header";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-lg text-gray-500">로딩 중...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // AuthProvider에서 리다이렉트 처리
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* 사이드바 */}
      <Sidebar />

      {/* 메인 콘텐츠 영역 */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* 헤더 */}
        <Header />

        {/* 콘텐츠 */}
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
};
