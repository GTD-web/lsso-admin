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

    console.log("🔄 API 키 재생성 프록시 요청:", body);

    const response = await fetchBackend("/api/admin/systems/regenerate", {
      method: "POST",
      headers: {
        Authorization: authorization,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return createErrorResponse(
        errorData.message || "API 키 재생성 실패",
        response.status
      );
    }

    const data = await response.json();
    console.log("✅ API 키 재생성 성공");

    return NextResponse.json(data);
  } catch (error) {
    console.error("❌ API 키 재생성 프록시 에러:", error);
    return createErrorResponse(API_CONFIG.ERROR_MESSAGES.SERVER_ERROR, 500);
  }
}
