"use client";

import { useState } from "react";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { useAuth } from "../context/AuthContext";
import ProtectedRoute from "./ProtectedRoute";

interface AdminLayoutProps {
  children: React.ReactNode;
  title?: string;
  requiredRole?: string;
}

export default function AdminLayout({
  children,
  title = "대시보드",
  requiredRole = "admin",
}: AdminLayoutProps) {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);
  // const [isSidebarItemViewed, setIsSidebarItemViewed] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSidebarMouseEnter = () => {
    setIsSidebarHovered(true);
  };

  const handleSidebarMouseLeave = () => {
    // 300ms 후에 호버 상태 초기화
    setIsSidebarHovered(false);
    // setTimeout(() => {
    //   setIsSidebarItemViewed(false);
    // }, 300);
  };

  return (
    <ProtectedRoute
      isAuthenticated={isAuthenticated}
      isLoading={isLoading}
      user={user}
      requiredRole={requiredRole}
    >
      <div className="min-h-screen flex flex-col h-screen">
        <Header
          title={title}
          onToggleSidebar={toggleSidebar}
          user={user}
          logout={async () => await logout()}
          isSidebarCollapsed={isSidebarCollapsed && !isSidebarHovered}
          onSidebarCollapsedChange={setIsSidebarCollapsed}
        />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
            collapsed={isSidebarCollapsed && !isSidebarHovered}
            // isSidebarItemViewed={isSidebarItemViewed}
            onMouseEnter={handleSidebarMouseEnter}
            onMouseLeave={handleSidebarMouseLeave}
          />
          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
