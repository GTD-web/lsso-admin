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

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <ProtectedRoute
      isAuthenticated={isAuthenticated}
      isLoading={isLoading}
      user={user}
      requiredRole={requiredRole}
    >
      <div className="min-h-screen flex flex-col">
        <Header
          title={title}
          onToggleSidebar={toggleSidebar}
          user={user}
          logout={async () => await logout()}
          isSidebarCollapsed={isSidebarCollapsed}
          onSidebarCollapsedChange={setIsSidebarCollapsed}
        />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
            collapsed={isSidebarCollapsed}
          />
          <main className="flex-1 overflow-auto">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
