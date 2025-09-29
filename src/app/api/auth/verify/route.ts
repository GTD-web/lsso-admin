import { NextRequest, NextResponse } from "next/server";
import {
  fetchBackend,
  API_CONFIG,
  getAuthorizationHeader,
  createErrorResponse,
} from "../../config";

export async function POST(request: NextRequest) {
  try {
    const authorization = getAuthorizationHeader(request);

    if (!authorization) {
      return createErrorResponse(API_CONFIG.ERROR_MESSAGES.UNAUTHORIZED, 401);
    }

    console.log("🔍 토큰 검증 프록시 요청");

    const response = await fetchBackend("/api/auth/verify", {
      method: "POST",
      headers: {
        Authorization: authorization,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return createErrorResponse(
        errorData.message || "토큰 검증 실패",
        response.status
      );
    }

    const data = await response.json();
    console.log("✅ 토큰 검증 성공");

    return NextResponse.json(data);
  } catch (error) {
    console.error("❌ 토큰 검증 프록시 에러:", error);
    return createErrorResponse(API_CONFIG.ERROR_MESSAGES.SERVER_ERROR, 500);
  }
}
