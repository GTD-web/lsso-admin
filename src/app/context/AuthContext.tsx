"use client";

import React, { createContext, useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import { User, adminLogin, verifyToken, refreshAuthToken } from "../api/auth";

// 로컬 스토리지 키
const TOKEN_KEY = "auth_token";
const REFRESH_TOKEN_KEY = "refresh_token";
const USER_KEY = "user_data";

// 인증 컨텍스트 타입
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  error: string | null;
}

// 기본값으로 컨텍스트 생성
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => false,
  logout: () => {},
  error: null,
});

// 컨텍스트 훅
export const useAuth = () => useContext(AuthContext);

// 인증 상태 제공자 컴포넌트
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // 페이지 로드 시 로컬 스토리지에서 인증 정보 불러오기
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedToken = localStorage.getItem(TOKEN_KEY);
        const storedUser = localStorage.getItem(USER_KEY);
        console.log("🔍 저장된 데이터 확인:", {
          storedToken,
          storedUser,
        });
        if (storedToken && storedUser) {
          // 토큰 검증
          const { success, data } = await verifyToken(storedToken);
          console.log("🔍 토큰 검증 결과:", {
            success,
            data,
          });
          if (success && data) {
            setUser(data.user);
            setIsAuthenticated(true);
            // 새 토큰으로 갱신
            localStorage.setItem(TOKEN_KEY, data.accessToken);
          } else {
            // 토큰이 만료되었다면 리프레시 토큰으로 갱신 시도
            const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
            if (refreshToken) {
              const refreshResult = await refreshAuthToken(refreshToken);
              if (refreshResult.success && refreshResult.data) {
                // 토큰 갱신 성공 시 새로운 토큰과 사용자 정보 저장
                localStorage.setItem(TOKEN_KEY, refreshResult.data.accessToken);
                localStorage.setItem(
                  REFRESH_TOKEN_KEY,
                  refreshResult.data.refreshToken
                );
                localStorage.setItem(
                  USER_KEY,
                  JSON.stringify(refreshResult.data.user)
                );

                setUser(refreshResult.data.user);
                setIsAuthenticated(true);
              } else {
                clearAuthData();
              }
            } else {
              clearAuthData();
            }
          }
        }
      } catch (err) {
        console.error("인증 검증 오류:", err);
        clearAuthData();
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // 로그인 함수
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const {
        success,
        data,
        error: loginError,
      } = await adminLogin(email, password);
      console.log("🔍 로그인 결과:", {
        success,
        data,
        loginError,
      });
      if (success && data) {
        // 로그인 성공 시 로컬 스토리지에 정보 저장
        localStorage.setItem(TOKEN_KEY, data.accessToken);
        localStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);
        localStorage.setItem(USER_KEY, JSON.stringify(data.user));

        setUser(data.user);
        setIsAuthenticated(true);
        return true;
      } else {
        setError(loginError ? loginError.message : "로그인에 실패했습니다.");
        return false;
      }
    } catch (err) {
      console.error("로그인 오류:", err);
      setError("로그인 중 오류가 발생했습니다.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // 로그아웃 함수
  const logout = () => {
    clearAuthData();
    router.push("/");
  };

  // 인증 데이터 초기화
  const clearAuthData = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        logout,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
