import { NextRequest, NextResponse } from "next/server";
import {
  fetchBackend,
  getAuthorizationHeader,
  createErrorResponse,
  API_CONFIG,
} from "../../../../../config";

/**
 * FCM 토큰 사용일 업데이트
 * PUT /api/admin/employee-fcm-tokens/usage/{employeeId}/{fcmTokenId}
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ employeeId: string; fcmTokenId: string }> }
) {
  try {
    const authorization = getAuthorizationHeader(request);
    if (!authorization) {
      return createErrorResponse(API_CONFIG.ERROR_MESSAGES.UNAUTHORIZED, 401);
    }

    const { employeeId, fcmTokenId } = await params;
    console.log("📋 FCM 토큰 사용일 업데이트", { employeeId, fcmTokenId });

    const response = await fetchBackend(
      `/api/admin/employee-fcm-tokens/${employeeId}/${fcmTokenId}/usage`,
      {
        method: "PUT",
        headers: {
          Authorization: authorization,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return createErrorResponse(
        errorData.message || "FCM 토큰 사용일 업데이트 실패",
        response.status
      );
    }

    const data = await response.json();
    console.log("✅ FCM 토큰 사용일 업데이트 성공");

    return NextResponse.json(data);
  } catch (error) {
    console.error("❌ FCM 토큰 사용일 업데이트 에러:", error);
    return createErrorResponse(API_CONFIG.ERROR_MESSAGES.SERVER_ERROR, 500);
  }
}
