"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User } from "../api/auth";
interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: string; // Optional: For role-based access control
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
}

export default function ProtectedRoute({
  children,
  requiredRole,
  isAuthenticated,
  isLoading,
  user,
}: ProtectedRouteProps) {
  const router = useRouter();

  useEffect(() => {
    console.log("🛡️ ProtectedRoute 상태 체크:", {
      isLoading,
      isAuthenticated,
      requiredRole,
      user,
      userRole: user?.role,
    });
    // If authentication check is complete and user is not authenticated, redirect to login
    if (!isLoading && !isAuthenticated) {
      router.push("/");
      return;
    }

    // If role-based access control is required
    if (
      !isLoading &&
      isAuthenticated &&
      requiredRole &&
      user?.role !== requiredRole
    ) {
      // User is authenticated but doesn't have the required role
      router.push("/unauthorized");
    }
  }, [isLoading, isAuthenticated, router, requiredRole, user]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">로딩 중...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, render nothing (will redirect in useEffect)
  if (!isAuthenticated) {
    return null;
  }

  // If role is required but user doesn't have it, render nothing (will redirect in useEffect)
  if (requiredRole && user?.role !== requiredRole) {
    return null;
  }

  // User is authenticated and has the required role (if specified)
  return <>{children}</>;
}
