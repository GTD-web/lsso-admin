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
  accessToken: string;
  refreshToken: string;
}

// 관리자 인증 응답 타입
export interface AdminAuthData {
  admin: User;
  accessToken: string;
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

// 토큰 응답 타입
export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
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
  console.log("Admin login API 호출 시작:", { email });

  try {
    const result = await safeApiRequest<AdminAuthData>(
      () => apiPost<AdminAuthData>("/admin/auth/login", { email, password }),
      {
        admin: {
          id: "",
          email: "",
          name: "",
          role: "",
        },
        accessToken: "",
        refreshToken: "",
      }
    );

    console.log("Admin login API 응답:", result);
    console.log("응답 구조:", JSON.stringify(result, null, 2));

    // 응답에 필요한 데이터가 있는지 확인
    if (result.success && result.data) {
      return result;
    } else {
      console.error("로그인 API 오류 또는 응답 형식 불일치:", result);
      return result;
    }
  } catch (error) {
    console.error("Admin login API 호출 실패:", error);
    throw error;
  }
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
      admin: {
        id: "",
        email: "",
        name: "",
        role: "",
      },
      accessToken: "",
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
): Promise<ApiResponse<TokenResponse>> {
  return safeApiRequest<TokenResponse>(
    () => apiPost<TokenResponse>("/admin/auth/refresh", { refreshToken }),
    {
      accessToken: "",
      refreshToken: "",
      expiresIn: 0,
    }
  );
}

/**
 * Get admin profile information
 * @param token The JWT access token
 * @returns Admin profile data or error
 */
export async function getAdminProfile(
  token: string
): Promise<ApiResponse<User>> {
  return safeApiRequest<User>(
    () => apiPost<User>("/admin/auth/profile", {}, { token }),
    {
      id: "",
      email: "",
      name: "",
      role: "",
    }
  );
}

/**
 * Change admin password
 * @param token The JWT access token
 * @param currentPassword Current password
 * @param newPassword New password
 * @returns Success status
 */
export async function changeAdminPassword(
  token: string,
  currentPassword: string,
  newPassword: string
): Promise<ApiResponse<{ success: boolean }>> {
  return safeApiRequest<{ success: boolean }>(
    () =>
      apiPost<{ success: boolean }>(
        "/admin/auth/password",
        { currentPassword, newPassword },
        { token }
      ),
    { success: false }
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
