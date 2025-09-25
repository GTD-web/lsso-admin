/**
 * 인증 관리 레포지토리 인터페이스
 */

import type {
  LoginResponse,
  RefreshResponse,
  UserProfile,
  TokenVerifyResponse,
  PasswordChangeResponse,
  PasswordCheckResponse,
} from "./entity/auth.entity";
import type {
  LoginDto,
  RefreshTokenDto,
  ChangePasswordDto,
  CheckPasswordDto,
} from "./dto/auth.dto";

/**
 * 인증 관리 레포지토리 메인 인터페이스
 */
export interface IAuthRepository {
  /**
   * 로그인 (Password Grant)
   */
  login(loginDto: LoginDto): Promise<LoginResponse>;

  /**
   * 토큰 갱신 (Refresh Token Grant)
   */
  refreshToken(refreshTokenDto: RefreshTokenDto): Promise<RefreshResponse>;

  /**
   * 토큰 검증
   */
  verifyToken(): Promise<TokenVerifyResponse>;

  /**
   * 비밀번호 변경
   */
  changePassword(
    changePasswordDto: ChangePasswordDto
  ): Promise<PasswordChangeResponse>;

  /**
   * 비밀번호 확인
   */
  checkPassword(
    checkPasswordDto: CheckPasswordDto
  ): Promise<PasswordCheckResponse>;

  /**
   * 사용자 프로필 조회 (토큰에서 추출)
   */
  getProfile(): Promise<UserProfile>;

  /**
   * 로그아웃 (로컬 토큰 삭제)
   */
  logout(): Promise<void>;

  /**
   * 자동 토큰 갱신
   */
  autoRefreshToken(): Promise<boolean>;
}
