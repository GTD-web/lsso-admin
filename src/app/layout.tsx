"use client";

import "./globals.css";
import { Inter } from "next/font/google";
import { Sidebar } from "./components/Sidebar";
import { Header } from "./components/Header";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { AuthProvider, useAuth } from "./providers/AuthProvider";
// Import the index.css directly from the node_modules path
import "@lumir-company/prototype-ui-sdk/dist/index.css";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginPage from "./login/page";

const inter = Inter({ subsets: ["latin"] });

// 실제 레이아웃 컴포넌트 (AuthProvider 내부에서 useAuth 사용)
function LayoutContent({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const pathname = usePathname();
  const { user, logout, isAuthenticated, isLoading } = useAuth();
  // 로그인 페이지에서는 사이드바와 헤더를 표시하지 않음
  const isLoginPage = pathname === "/";

  // 사이드바 토글 함수
  const handleToggleSidebar = () => {
    setIsSidebarCollapsed(true);
    setIsSidebarOpen(!isSidebarOpen);
  };

  // 창 크기 변경 시 사이드바 상태 관리
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        // lg 브레이크포인트
        setIsSidebarOpen(false); // 대형 화면에서는 사이드바가 항상 표시됨
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 페이지 변경 시 모바일에서 사이드바 닫기
  useEffect(() => {
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  }, [pathname]);

  // 현재 페이지의 제목 결정
  const getPageTitle = () => {
    if (pathname === "/dashboard") return "대시보드";
    if (pathname === "/users" || pathname.startsWith("/users/"))
      return "사용자 관리";
    if (pathname === "/systems" || pathname.startsWith("/systems/"))
      return "시스템 관리";
    if (pathname === "/tokens") return "토큰 관리";
    if (pathname === "/logs") return "로그 관리";
    if (pathname === "/settings") return "설정";
    return "SSO 관리자";
  };

  return (
    <html lang="ko">
      <body className={inter.className}>
        {isLoginPage ? (
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <LoginPage />
          </div>
        ) : (
          <div className="flex flex-col h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
            {/* 헤더 - fixed at top */}
            <div className="fixed top-0 left-0 right-0 z-50">
              <Header
                title={getPageTitle()}
                onToggleSidebar={handleToggleSidebar}
                user={user}
                logout={logout}
                isSidebarCollapsed={isSidebarCollapsed}
                onSidebarCollapsedChange={setIsSidebarCollapsed}
              />
            </div>

            {/* Main container - below header */}
            <div className="flex flex-1 mt-16 overflow-hidden">
              {/* 사이드바 */}
              <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                collapsed={isSidebarCollapsed}
              />

              {/* 메인 콘텐츠 */}
              <main
                className={`flex-1 overflow-auto p-4 transition-all duration-300 ease-in-out ${
                  isSidebarCollapsed ? "lg:ml-20" : "lg:ml-64"
                }`}
              >
                <ProtectedRoute
                  requiredRole="admin"
                  isAuthenticated={isAuthenticated}
                  isLoading={isLoading}
                  user={user}
                >
                  <div className="flex">{children}</div>
                </ProtectedRoute>
              </main>
            </div>
          </div>
        )}
      </body>
    </html>
  );
}

// 루트 레이아웃 - AuthProvider 추가
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <LayoutContent>{children}</LayoutContent>
    </AuthProvider>
  );
}
