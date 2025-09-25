/**
 * 인증 관련 엔티티 정의
 */

/**
 * 로그인 응답 (실제 SSO API 형식)
 */
export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  tokenExpiresAt: string;
  refreshTokenExpiresAt: string;
  clientInfo?: any;
  ipAddress?: string;
  lastAccess?: string;
  userId?: string;
  id: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * 토큰 갱신 응답 (실제 SSO API 형식)
 */
export interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
  tokenExpiresAt: string;
  refreshTokenExpiresAt: string;
  clientInfo?: any;
  ipAddress?: string;
  lastAccess?: string;
  userId?: string;
  id: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * 관리자 사용자 정보 (기존 형식 유지)
 */
export interface AdminUser {
  id: string;
  name: string;
  email: string;
  employeeNumber: string;
  phoneNumber?: string;
  department?: string;
  position?: string;
  rank?: string;
  status: string;
  systemRoles?: Record<string, string[]>;
  lastLoginAt?: string;
}

/**
 * 사용자 프로필 정보
 */
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  employeeNumber: string;
  phoneNumber?: string;
  department?: string;
  position?: string;
  rank?: string;
  status: string;
  systemRoles?: Record<string, string[]>;
  lastLoginAt?: string;
}

/**
 * 토큰 검증 응답
 */
export interface TokenVerifyResponse {
  valid: boolean;
  user_info?: {
    id: string;
    name: string;
    email: string;
    employee_number: string;
  };
  expires_in?: number;
}

/**
 * 비밀번호 변경 응답
 */
export interface PasswordChangeResponse {
  message: string;
}

/**
 * 비밀번호 확인 응답
 */
export interface PasswordCheckResponse {
  isValid: boolean;
}
