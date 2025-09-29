import { NextRequest, NextResponse } from "next/server";
import {
  fetchBackend,
  getAuthorizationHeader,
  createErrorResponse,
  API_CONFIG,
} from "../../../../config";

/**
 * 오래된 FCM 토큰 관계 정리
 * DELETE /api/admin/employee-fcm-tokens/cleanup/old-tokens?cutoffDays=30
 */
export async function DELETE(request: NextRequest) {
  try {
    const authorization = getAuthorizationHeader(request);
    if (!authorization) {
      return createErrorResponse(API_CONFIG.ERROR_MESSAGES.UNAUTHORIZED, 401);
    }

    const { searchParams } = new URL(request.url);
    const cutoffDays = searchParams.get("cutoffDays");

    console.log("📋 오래된 FCM 토큰 관계 정리", { cutoffDays });

    let endpoint = "/api/admin/employee-fcm-tokens/cleanup/old-tokens";
    if (cutoffDays) {
      endpoint += `?cutoffDays=${cutoffDays}`;
    }

    const response = await fetchBackend(endpoint, {
      method: "DELETE",
      headers: {
        Authorization: authorization,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return createErrorResponse(
        errorData.message || "오래된 FCM 토큰 관계 정리 실패",
        response.status
      );
    }

    const data = await response.json();
    console.log("✅ 오래된 FCM 토큰 관계 정리 성공");

    return NextResponse.json(data);
  } catch (error) {
    console.error("❌ 오래된 FCM 토큰 관계 정리 에러:", error);
    return createErrorResponse(API_CONFIG.ERROR_MESSAGES.SERVER_ERROR, 500);
  }
}
