import { NextRequest, NextResponse } from "next/server";
import {
  fetchBackend,
  API_CONFIG,
  getAuthorizationHeader,
  createErrorResponse,
} from "../../../config";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authorization = getAuthorizationHeader(request);
    const { id } = await params;

    if (!authorization) {
      return createErrorResponse(API_CONFIG.ERROR_MESSAGES.UNAUTHORIZED, 401);
    }

    console.log("📋 로그 상세 조회 프록시 요청:", { id });

    const response = await fetchBackend(`/api/admin/logs/${id}`, {
      method: "GET",
      headers: {
        Authorization: authorization,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return createErrorResponse(
        errorData.message || "로그 상세 조회 실패",
        response.status
      );
    }

    const data = await response.json();
    console.log("✅ 로그 상세 조회 성공");

    return NextResponse.json(data);
  } catch (error) {
    console.error("❌ 로그 상세 조회 프록시 에러:", error);
    return createErrorResponse(API_CONFIG.ERROR_MESSAGES.SERVER_ERROR, 500);
  }
}
