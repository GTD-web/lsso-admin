"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { useAuth as useAuthHook } from "../hooks/useAuth";
import { User } from "../api/auth";
import { ApiResponse } from "../api/types";
import { AdminAuthData } from "../api/auth";

// AuthContext 타입 정의
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (
    email: string,
    password: string
  ) => Promise<ApiResponse<AdminAuthData>>;
  logout: () => Promise<void>;
  error: string | null;
}

// 기본값으로 createContext 생성
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider 컴포넌트
export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useAuthHook();

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

// 커스텀 훅 - 다른 컴포넌트에서 인증 상태에 접근하기 위함
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
