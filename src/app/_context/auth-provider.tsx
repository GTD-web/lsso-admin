"use client";

/**
 * 인증 컨텍스트 프로바이더
 */

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { authRepository, type UserProfile, type LoginDto } from "@/api/v2";

interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginDto) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const isAuthenticated = !!user;

  // 페이지 로드 시 인증 상태 확인
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // 경로 변경 시 인증 확인
  useEffect(() => {
    if (!isLoading) {
      handleRouteProtection();
    }
  }, [pathname, isLoading, isAuthenticated]);

  const checkAuthStatus = async () => {
    try {
      // 토큰이 없으면 바로 로딩 완료
      const accessToken =
        typeof window !== "undefined"
          ? localStorage.getItem("accessToken")
          : null;
      console.log("🔍 토큰 확인:", {
        accessToken: accessToken ? "존재" : "없음",
        길이: accessToken ? accessToken.length : 0,
      });

      if (!accessToken) {
        console.log("❌ 토큰 없음 - 로딩 완료");
        setUser(null);
        setIsLoading(false);
        return;
      }

      console.log("✅ 토큰 존재 - 검증 시작");

      const verifyResponse = await authRepository.verifyToken();
      if (verifyResponse.valid && verifyResponse.user_info) {
        const userInfo = verifyResponse.user_info;
        const userProfile = {
          id: userInfo.id,
          name: userInfo.name,
          email: userInfo.email,
          employeeNumber: userInfo.employee_number,
          status: "ACTIVE",
        };
        setUser(userProfile);
      } else {
        // 토큰이 무효한 경우 리프레시 시도
        const refreshed = await refreshToken();
        if (!refreshed) {
          setUser(null);
        }
      }
    } catch (error) {
      console.error("인증 상태 확인 실패:", error);
      // 토큰 검증 실패 시 리프레시 시도
      const refreshed = await refreshToken();
      if (!refreshed) {
        setUser(null);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRouteProtection = () => {
    const publicRoutes = ["/login"];
    const isPublicRoute = publicRoutes.includes(pathname);

    if (!isAuthenticated && !isPublicRoute) {
      router.push("/login");
    } else if (isAuthenticated && pathname === "/login") {
      router.push("/");
    }
  };

  const login = async (credentials: LoginDto) => {
    try {
      console.log("🔐 로그인 시작");
      await authRepository.login(credentials);
      console.log("✅ 로그인 성공, 토큰 검증 시작");

      // 로그인 성공 후 토큰 검증 API로 사용자 정보 가져오기
      const verifyResponse = await authRepository.verifyToken();
      console.log("✅ 토큰 검증 완료:", verifyResponse);

      if (verifyResponse.valid && verifyResponse.user_info) {
        const userInfo = verifyResponse.user_info;
        const userProfile = {
          id: userInfo.id,
          name: userInfo.name,
          email: userInfo.email,
          employeeNumber: userInfo.employee_number,
          status: "ACTIVE",
        };
        setUser(userProfile);
        console.log("✅ 사용자 정보 설정 완료, 리다이렉트 시작");
        router.push("/");
      } else {
        throw new Error("사용자 정보를 가져올 수 없습니다.");
      }
    } catch (error) {
      console.error("❌ 로그인 실패:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authRepository.logout();
    } catch (error) {
      console.error("로그아웃 실패:", error);
    } finally {
      setUser(null);
      router.push("/login");
    }
  };

  const refreshToken = async (): Promise<boolean> => {
    try {
      if (typeof window === "undefined") return false;

      const refreshTokenValue = localStorage.getItem("refreshToken");
      if (!refreshTokenValue) return false;

      const response = await authRepository.refreshToken({
        grant_type: "refresh_token",
        refresh_token: refreshTokenValue,
      });

      // 토큰 갱신 성공 후 사용자 정보 가져오기
      const verifyResponse = await authRepository.verifyToken();
      if (verifyResponse.valid && verifyResponse.user_info) {
        const userInfo = verifyResponse.user_info;
        const userProfile = {
          id: userInfo.id,
          name: userInfo.name,
          email: userInfo.email,
          employeeNumber: userInfo.employee_number,
          status: "ACTIVE",
        };
        setUser(userProfile);
      }
      return true;
    } catch (error) {
      console.error("토큰 갱신 실패:", error);
      setUser(null);
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        login,
        logout,
        refreshToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
