import { NextRequest, NextResponse } from "next/server";
import {
  fetchBackend,
  getAuthorizationHeader,
  createErrorResponse,
  API_CONFIG,
} from "../../../../config";

/**
 * 토큰들과 관련된 모든 관계 삭제
 * DELETE /api/admin/employee-tokens/tokens/bulk
 */
export async function DELETE(request: NextRequest) {
  try {
    const authorization = getAuthorizationHeader(request);
    if (!authorization) {
      return createErrorResponse(API_CONFIG.ERROR_MESSAGES.UNAUTHORIZED, 401);
    }

    const body = await request.json();
    console.log("📋 토큰 관련 관계 일괄 삭제", body);

    const response = await fetchBackend(
      "/api/admin/employee-tokens/tokens/bulk",
      {
        method: "DELETE",
        headers: {
          Authorization: authorization,
        },
        body: JSON.stringify(body),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return createErrorResponse(
        errorData.message || "토큰 관련 관계 일괄 삭제 실패",
        response.status
      );
    }

    const data = await response.json();
    console.log("✅ 토큰 관련 관계 일괄 삭제 성공");

    return NextResponse.json(data);
  } catch (error) {
    console.error("❌ 토큰 관련 관계 일괄 삭제 에러:", error);
    return createErrorResponse(API_CONFIG.ERROR_MESSAGES.SERVER_ERROR, 500);
  }
}
