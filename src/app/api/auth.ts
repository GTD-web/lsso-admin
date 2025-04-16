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
