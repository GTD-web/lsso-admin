"use client";

import { ApiResponse } from "./types";
import { apiPost } from "./apiClient";

// 사용자 정보 타입
export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

// SSO 로그인 응답 타입 (문서에 맞춤)
export interface LoginResponse {
  tokenType: string;
  accessToken: string;
  expiresAt: string;
  refreshToken: string;
  refreshTokenExpiresAt: string;
  id: string;
  name: string;
  email: string;
  employeeNumber: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  gender?: string;
  hireDate?: string;
  status: string;
  department?: string;
  position?: string;
  rank?: string;
  systemRoles?: Record<string, string[]>;
}

// SSO 토큰 검증 응답 타입 (문서에 맞춤)
export interface TokenVerifyResponse {
  valid: boolean;
  user_info: {
    id: string;
    name: string;
    email: string;
    employee_number: string;
  };
  expires_in: number;
}

// 관리자 인증 데이터 (AuthContext용)
export interface AdminAuthData {
  user: User;
  accessToken: string;
  refreshToken: string; // SSO에서 refresh token 지원
}

/**
 * SSO 로그인 (관리자용)
 * @param email - 사용자 이메일
 * @param password - 사용자 비밀번호
 * @returns 인증 응답 (토큰 및 사용자 데이터)
 */
export async function adminLogin(
  email: string,
  password: string
): Promise<ApiResponse<AdminAuthData>> {
  console.log("SSO 로그인 API 호출 시작:", { email });

  try {
    // SSO 로그인 API 직접 호출
    const response = await apiPost<LoginResponse>("/auth/login", {
      grant_type: "password",
      email,
      password,
    });

    console.log("SSO 로그인 원본 응답:", response);

    if (response.success && response.data) {
      // SSO 응답을 AdminAuthData 형태로 변환
      const adminAuthData: AdminAuthData = {
        user: {
          id: response.data.id,
          email: response.data.email,
          name: response.data.name,
          role: "admin", // 기본 역할 설정
        },
        accessToken: response.data.accessToken,
        refreshToken: response.data.refreshToken,
      };

      console.log("변환된 인증 데이터:", adminAuthData);

      return {
        success: true,
        data: adminAuthData,
      };
    } else {
      console.log("SSO 로그인 실패:", response.error);
      return {
        success: false,
        data: {
          user: { id: "", email: "", name: "", role: "" },
          accessToken: "",
          refreshToken: "",
        },
        error: response.error || {
          code: "LOGIN_ERROR",
          message: "로그인에 실패했습니다.",
        },
      };
    }
  } catch (error) {
    console.error("SSO 로그인 API 호출 실패:", error);
    return {
      success: false,
      data: {
        user: { id: "", email: "", name: "", role: "" },
        accessToken: "",
        refreshToken: "",
      },
      error: {
        code: "LOGIN_ERROR",
        message:
          error instanceof Error ? error.message : "로그인에 실패했습니다.",
      },
    };
  }
}

/**
 * SSO 토큰 검증
 * @param token JWT access token
 * @returns Verification response with user data or error
 */
export async function verifyToken(
  token: string
): Promise<ApiResponse<AdminAuthData>> {
  console.log("🔍 토큰 검증 API 호출:", { token: token ? "존재" : "없음" });

  try {
    // SSO 토큰 검증 API 직접 호출
    const response = await apiPost<TokenVerifyResponse>(
      "/auth/verify",
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    console.log("🔍 토큰 검증 원본 응답:", response);

    if (response.success && response.data && response.data.valid) {
      // SSO 응답을 AdminAuthData 형태로 변환
      const adminAuthData: AdminAuthData = {
        user: {
          id: response.data.user_info.id,
          email: response.data.user_info.email,
          name: response.data.user_info.name,
          role: "admin", // 기본 역할 설정
        },
        accessToken: token, // 기존 토큰 유지
        refreshToken: "", // 토큰 검증에서는 refresh token 없음
      };

      console.log("변환된 토큰 검증 데이터:", adminAuthData);

      return {
        success: true,
        data: adminAuthData,
      };
    } else {
      console.log("🔍 토큰 검증 실패:", response.error);
      return {
        success: false,
        data: {
          user: { id: "", email: "", name: "", role: "" },
          accessToken: "",
          refreshToken: "",
        },
        error: response.error || {
          code: "TOKEN_VERIFY_ERROR",
          message: "토큰이 유효하지 않습니다.",
        },
      };
    }
  } catch (error) {
    console.error("🔍 토큰 검증 실패:", error);
    return {
      success: false,
      data: {
        user: { id: "", email: "", name: "", role: "" },
        accessToken: "",
        refreshToken: "",
      },
      error: {
        code: "TOKEN_VERIFY_ERROR",
        message: "토큰 검증에 실패했습니다.",
      },
    };
  }
}

/**
 * SSO 토큰 갱신
 * @param refreshToken The refresh token
 * @returns New tokens
 */
export async function refreshAuthToken(
  refreshToken: string
): Promise<ApiResponse<AdminAuthData>> {
  console.log("🔄 토큰 갱신 API 호출", {
    refreshToken: refreshToken ? "존재" : "없음",
  });

  try {
    // SSO 로그인 API를 refresh_token grant type으로 호출
    const response = await apiPost<LoginResponse>("/auth/login", {
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    });

    console.log("🔄 토큰 갱신 원본 응답:", response);

    if (response.success && response.data) {
      // SSO 응답을 AdminAuthData 형태로 변환
      const adminAuthData: AdminAuthData = {
        user: {
          id: response.data.id,
          email: response.data.email,
          name: response.data.name,
          role: "admin", // 기본 역할 설정
        },
        accessToken: response.data.accessToken,
        refreshToken: response.data.refreshToken,
      };

      console.log("변환된 토큰 갱신 데이터:", adminAuthData);

      return {
        success: true,
        data: adminAuthData,
      };
    } else {
      console.log("🔄 토큰 갱신 실패:", response.error);
      return {
        success: false,
        data: {
          user: { id: "", email: "", name: "", role: "" },
          accessToken: "",
          refreshToken: "",
        },
        error: response.error || {
          code: "TOKEN_REFRESH_ERROR",
          message: "토큰 갱신에 실패했습니다.",
        },
      };
    }
  } catch (error) {
    console.error("🔄 토큰 갱신 실패:", error);
    return {
      success: false,
      data: {
        user: { id: "", email: "", name: "", role: "" },
        accessToken: "",
        refreshToken: "",
      },
      error: {
        code: "TOKEN_REFRESH_ERROR",
        message: "토큰 갱신에 실패했습니다.",
      },
    };
  }
}
