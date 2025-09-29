import { NextRequest, NextResponse } from "next/server";
import {
  fetchBackend,
  API_CONFIG,
  getAuthorizationHeader,
  createErrorResponse,
} from "../../../config";

export async function POST(request: NextRequest) {
  try {
    const authorization = getAuthorizationHeader(request);
    const body = await request.json();

    if (!authorization) {
      return createErrorResponse(API_CONFIG.ERROR_MESSAGES.UNAUTHORIZED, 401);
    }

    console.log("📋 로그 필터링 프록시 요청:", body);

    const response = await fetchBackend("/api/admin/logs/filter", {
      method: "POST",
      headers: {
        Authorization: authorization,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return createErrorResponse(
        errorData.message || "로그 필터링 실패",
        response.status
      );
    }

    const data = await response.json();
    console.log("✅ 로그 필터링 성공");

    return NextResponse.json(data);
  } catch (error) {
    console.error("❌ 로그 필터링 프록시 에러:", error);
    return createErrorResponse(API_CONFIG.ERROR_MESSAGES.SERVER_ERROR, 500);
  }
}
