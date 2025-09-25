/**
 * 인증 관련 DTO 정의
 */

/**
 * 로그인 요청 DTO (Password Grant)
 */
export interface LoginDto {
  grant_type: "password";
  email: string;
  password: string;
}

/**
 * 토큰 갱신 요청 DTO (Refresh Token Grant)
 */
export interface RefreshTokenDto {
  grant_type: "refresh_token";
  refresh_token: string;
}

/**
 * 비밀번호 확인 DTO
 */
export interface CheckPasswordDto {
  currentPassword: string;
  email?: string;
}

/**
 * 비밀번호 변경 DTO
 */
export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
}

// Import된 타입들을 다시 export (순환 참조 방지)
import type {
  LoginResponse,
  RefreshResponse,
  AdminUser,
  UserProfile,
} from "../entity/auth.entity";
