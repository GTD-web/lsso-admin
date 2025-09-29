import { NextRequest, NextResponse } from "next/server";
import {
  fetchBackend,
  getAuthorizationHeader,
  createErrorResponse,
  API_CONFIG,
} from "../../../config";

/**
 * FCM 토큰 통계 조회
 * GET /api/admin/employee-fcm-tokens/stats
 */
export async function GET(request: NextRequest) {
  try {
    const authorization = getAuthorizationHeader(request);
    if (!authorization) {
      return createErrorResponse(API_CONFIG.ERROR_MESSAGES.UNAUTHORIZED, 401);
    }

    console.log("📋 FCM 토큰 통계 조회");

    const response = await fetchBackend(
      "/api/admin/employee-fcm-tokens/stats",
      {
        method: "GET",
        headers: {
          Authorization: authorization,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return createErrorResponse(
        errorData.message || "FCM 토큰 통계 조회 실패",
        response.status
      );
    }

    const data = await response.json();
    console.log("✅ FCM 토큰 통계 조회 성공");

    return NextResponse.json(data);
  } catch (error) {
    console.error("❌ FCM 토큰 통계 조회 에러:", error);
    return createErrorResponse(API_CONFIG.ERROR_MESSAGES.SERVER_ERROR, 500);
  }
}
