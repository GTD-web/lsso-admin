import { NextRequest, NextResponse } from "next/server";
import {
  fetchBackend,
  getAuthorizationHeader,
  createErrorResponse,
  API_CONFIG,
} from "../../config";

/**
 * 직원별 토큰 관계 목록 조회 (그룹핑)
 * GET /api/admin/employee-tokens?employeeId={employeeId}
 */
export async function GET(request: NextRequest) {
  try {
    const authorization = getAuthorizationHeader(request);
    if (!authorization) {
      return createErrorResponse(API_CONFIG.ERROR_MESSAGES.UNAUTHORIZED, 401);
    }

    const { searchParams } = new URL(request.url);
    const employeeId = searchParams.get("employeeId");

    console.log("📋 직원 토큰 관계 목록 조회", { employeeId });

    let endpoint = "/api/admin/employee-tokens";
    if (employeeId) {
      endpoint += `?employeeId=${employeeId}`;
    }

    const response = await fetchBackend(endpoint, {
      method: "GET",
      headers: {
        Authorization: authorization,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return createErrorResponse(
        errorData.message || "토큰 관계 목록 조회 실패",
        response.status
      );
    }

    const data = await response.json();
    console.log("✅ 토큰 관계 목록 조회 성공");

    return NextResponse.json(data);
  } catch (error) {
    console.error("❌ 토큰 관계 목록 조회 에러:", error);
    return createErrorResponse(API_CONFIG.ERROR_MESSAGES.SERVER_ERROR, 500);
  }
}

/**
 * 직원 토큰 관계 생성
 * POST /api/admin/employee-tokens
 */
export async function POST(request: NextRequest) {
  try {
    const authorization = getAuthorizationHeader(request);
    if (!authorization) {
      return createErrorResponse(API_CONFIG.ERROR_MESSAGES.UNAUTHORIZED, 401);
    }

    const body = await request.json();
    console.log("📋 직원 토큰 관계 생성", body);

    const response = await fetchBackend("/api/admin/employee-tokens", {
      method: "POST",
      headers: {
        Authorization: authorization,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return createErrorResponse(
        errorData.message || "토큰 관계 생성 실패",
        response.status
      );
    }

    const data = await response.json();
    console.log("✅ 토큰 관계 생성 성공");

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("❌ 토큰 관계 생성 에러:", error);
    return createErrorResponse(API_CONFIG.ERROR_MESSAGES.SERVER_ERROR, 500);
  }
}
