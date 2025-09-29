import { NextRequest, NextResponse } from "next/server";
import { fetchBackend, API_CONFIG, createErrorResponse } from "../../config";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    console.log("🔐 로그인 프록시 요청:", {
      grant_type: body.grant_type,
      email: body.email,
      password: body.password ? "***" : "없음",
    });

    const response = await fetchBackend("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return createErrorResponse(
        errorData.message || "로그인 실패",
        response.status
      );
    }

    const data = await response.json();
    console.log("✅ 로그인 성공");

    return NextResponse.json(data);
  } catch (error) {
    console.error("❌ 로그인 프록시 에러:", error);
    return createErrorResponse(API_CONFIG.ERROR_MESSAGES.SERVER_ERROR, 500);
  }
}
