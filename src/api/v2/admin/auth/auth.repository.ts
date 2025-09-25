/**
 * 인증 관리 레포지토리 구현체
 */

import { BaseModule } from "../../base/base.module";
import { IAuthRepository } from "./auth.repository.interface";
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

export class AuthRepository extends BaseModule implements IAuthRepository {
  constructor() {
    super("AuthRepository");
  }

  async login(loginDto: LoginDto): Promise<LoginResponse> {
    const response = await this.makeRequest<LoginResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(loginDto),
    });
    console.log("🔐 로그인 성공, 토큰 저장 시작");
    // 토큰을 localStorage에 저장
    if (typeof window !== "undefined") {
      console.log("💾 토큰 저장 중:", {
        accessToken: response.accessToken ? "존재" : "없음",
        refreshToken: response.refreshToken ? "존재" : "없음",
        tokenExpiresAt: response.tokenExpiresAt,
        refreshTokenExpiresAt: response.refreshTokenExpiresAt,
      });

      localStorage.setItem("accessToken", response.accessToken);
      localStorage.setItem("refreshToken", response.refreshToken);
      localStorage.setItem("tokenExpiresAt", response.tokenExpiresAt);
      localStorage.setItem(
        "refreshTokenExpiresAt",
        response.refreshTokenExpiresAt
      );

      console.log("✅ 토큰 저장 완료:", {
        저장된_accessToken: localStorage.getItem("accessToken")
          ? "존재"
          : "없음",
        저장된_refreshToken: localStorage.getItem("refreshToken")
          ? "존재"
          : "없음",
      });
    }

    return response;
  }

  async logout(): Promise<void> {
    // SSO API에는 별도 로그아웃 엔드포인트가 없으므로 로컬에서만 토큰 제거
    if (typeof window !== "undefined") {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("tokenExpiresAt");
      localStorage.removeItem("refreshTokenExpiresAt");
    }
  }

  async refreshToken(
    refreshTokenDto: RefreshTokenDto
  ): Promise<RefreshResponse> {
    const response = await this.makeRequest<RefreshResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(refreshTokenDto),
    });

    // 새 토큰을 localStorage에 저장
    if (typeof window !== "undefined") {
      localStorage.setItem("accessToken", response.accessToken);
      localStorage.setItem("refreshToken", response.refreshToken);
      localStorage.setItem("tokenExpiresAt", response.tokenExpiresAt);
      localStorage.setItem(
        "refreshTokenExpiresAt",
        response.refreshTokenExpiresAt
      );
    }

    return response;
  }

  async getProfile(): Promise<UserProfile> {
    // 토큰 검증 API를 통해 사용자 정보 획득
    const verifyResponse = await this.verifyToken();
    if (!verifyResponse.valid || !verifyResponse.user_info) {
      throw new Error("Invalid token or user info not available");
    }

    const userInfo = verifyResponse.user_info;
    return {
      id: userInfo.id,
      name: userInfo.name,
      email: userInfo.email,
      employeeNumber: userInfo.employee_number,
      status: "ACTIVE", // 토큰이 유효하면 활성 상태로 간주
    };
  }

  async changePassword(
    changePasswordDto: ChangePasswordDto
  ): Promise<PasswordChangeResponse> {
    return this.makeRequest<PasswordChangeResponse>(
      "/api/auth/change-password",
      {
        method: "POST",
        body: JSON.stringify({ newPassword: changePasswordDto.newPassword }),
      }
    );
  }

  async verifyToken(): Promise<TokenVerifyResponse> {
    return this.makeRequest<TokenVerifyResponse>("/auth/verify", {
      method: "POST",
    });
  }

  /**
   * 비밀번호 확인
   */
  async checkPassword(
    checkPasswordDto: CheckPasswordDto
  ): Promise<PasswordCheckResponse> {
    return this.makeRequest<PasswordCheckResponse>("/auth/check-password", {
      method: "POST",
      body: JSON.stringify(checkPasswordDto),
    });
  }

  /**
   * 자동 토큰 갱신 (만료 시)
   */
  async autoRefreshToken(): Promise<boolean> {
    if (typeof window === "undefined") return false;

    const refreshToken = localStorage.getItem("refreshToken");
    const refreshTokenExpiresAt = localStorage.getItem("refreshTokenExpiresAt");

    if (!refreshToken) return false;

    // 리프레시 토큰 만료 확인
    if (
      refreshTokenExpiresAt &&
      new Date() >= new Date(refreshTokenExpiresAt)
    ) {
      await this.logout();
      return false;
    }

    try {
      await this.refreshToken({
        grant_type: "refresh_token",
        refresh_token: refreshToken,
      });
      return true;
    } catch {
      // 리프레시 토큰도 만료된 경우 로그아웃 처리
      await this.logout();
      return false;
    }
  }

  /**
   * 간단한 토큰 유효성 확인 (boolean 반환)
   */
  async isTokenValid(): Promise<boolean> {
    try {
      const response = await this.verifyToken();
      return response.valid;
    } catch {
      return false;
    }
  }
}
