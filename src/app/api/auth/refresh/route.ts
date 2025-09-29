import { NextRequest, NextResponse } from "next/server";
import { fetchBackend, API_CONFIG, createErrorResponse } from "../../config";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    console.log("🔄 토큰 갱신 프록시 요청");

    // refresh는 실제로는 /auth/login 엔드포인트를 사용
    const response = await fetchBackend("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return createErrorResponse(
        errorData.message || "토큰 갱신 실패",
        response.status
      );
    }

    const data = await response.json();
    console.log("✅ 토큰 갱신 성공");

    return NextResponse.json(data);
  } catch (error) {
    console.error("❌ 토큰 갱신 프록시 에러:", error);
    return createErrorResponse(API_CONFIG.ERROR_MESSAGES.SERVER_ERROR, 500);
  }
}
