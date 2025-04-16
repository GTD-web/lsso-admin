"use server";

import { ApiResponse } from "./types";
import { apiPost, safeApiRequest } from "./apiClient";

// 사용자 정보 타입
export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

// 인증 토큰 타입
export interface AuthTokens {
  token: string;
  refreshToken: string;
}

// 관리자 인증 응답 타입
export interface AdminAuthData {
  user: User;
  token: string;
  refreshToken: string;
}

// 로그인 요청 타입
export interface LoginRequest {
  email: string;
  password: string;
}

// 토큰 검증 요청 타입
export interface TokenVerifyRequest {
  token: string;
}

// 토큰 갱신 요청 타입
export interface TokenRefreshRequest {
  refreshToken: string;
}

// 로그아웃 요청 타입
export interface LogoutRequest {
  refreshToken: string;
}

/**
 * Admin login authentication service
 * @param email - Admin email address
 * @param password - Admin password
 * @returns Authentication response with tokens and user data or error
 */
export async function adminLogin(
  email: string,
  password: string
): Promise<ApiResponse<AdminAuthData>> {
  return safeApiRequest<AdminAuthData>(
    () => apiPost<AdminAuthData>("/admin/auth/login", { email, password }),
    {
      user: {
        id: "",
        email: "",
        name: "",
        role: "",
      },
      token: "",
      refreshToken: "",
    }
  );
}

/**
 * Verify the authentication token
 * @param token JWT token to verify
 * @returns Verification response with user data or error
 */
export async function verifyToken(
  token: string
): Promise<ApiResponse<AdminAuthData>> {
  return safeApiRequest<AdminAuthData>(
    () => apiPost<AdminAuthData>("/admin/auth/verify", { token }),
    {
      user: {
        id: "",
        email: "",
        name: "",
        role: "",
      },
      token: "",
      refreshToken: "",
    }
  );
}

/**
 * Refresh the authentication token
 * @param refreshToken The refresh token
 * @returns New set of tokens or error
 */
export async function refreshAuthToken(
  refreshToken: string
): Promise<ApiResponse<AdminAuthData>> {
  return safeApiRequest<AdminAuthData>(
    () => apiPost<AdminAuthData>("/admin/auth/refresh", { refreshToken }),
    {
      user: {
        id: "",
        email: "",
        name: "",
        role: "",
      },
      token: "",
      refreshToken: "",
    }
  );
}

/**
 * Admin logout function
 * @param token - JWT access token
 * @param refreshToken - Refresh token to invalidate
 * @returns Success status
 */
export async function adminLogout(
  token: string,
  refreshToken: string
): Promise<ApiResponse<{ success: boolean }>> {
  return safeApiRequest<{ success: boolean }>(
    () =>
      apiPost<{ success: boolean }>(
        "/admin/auth/logout",
        { refreshToken },
        { token }
      ),
    { success: false }
  );
}

// Add fallback mock implementations for development/testing
export const mockAdminLogin = async (
  email: string,
  password: string
): Promise<ApiResponse<AdminAuthData>> => {
  // For development, we'll simulate a network request
  await new Promise((resolve) => setTimeout(resolve, 800));

  // Mock valid credentials for testing
  const validCredentials = {
    email: "admin@example.com",
    password: "admin123",
  };

  // Check credentials and return appropriate response
  if (
    email === validCredentials.email &&
    password === validCredentials.password
  ) {
    return {
      success: true,
      data: {
        user: {
          id: "admin-001",
          email: "admin@example.com",
          name: "관리자",
          role: "admin",
        },
        token:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbi0wMDEiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE2MzQ1Njc4OTAsImV4cCI6MTYzNDU3MTQ5MH0.gFz42MFb8XTFTMaLFq-4a1R1JW5VE2Ofz9zOWTnPpU4",
        refreshToken: "rt_cd5f1342-a472-47d8-a44c-4e09128eb87e",
      },
    };
  } else {
    // Invalid credentials response
    return {
      success: false,
      error: {
        code: "AUTH_INVALID_CREDENTIALS",
        message: "이메일 또는 비밀번호가 올바르지 않습니다.",
      },
    };
  }
};
