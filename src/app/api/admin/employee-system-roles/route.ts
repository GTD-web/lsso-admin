import { NextRequest, NextResponse } from "next/server";
import {
  fetchBackend,
  getAuthorizationHeader,
  createErrorResponse,
  API_CONFIG,
} from "../../config";

/**
 * 직원별 시스템 역할 목록 조회 (그룹핑)
 * GET /api/admin/employee-system-roles?employeeId={employeeId}
 */
export async function GET(request: NextRequest) {
  try {
    const authorization = getAuthorizationHeader(request);
    if (!authorization) {
      return createErrorResponse(API_CONFIG.ERROR_MESSAGES.UNAUTHORIZED, 401);
    }

    const { searchParams } = new URL(request.url);
    const employeeId = searchParams.get("employeeId");

    console.log("📋 직원 시스템 역할 목록 조회", { employeeId });

    let endpoint = "/api/admin/employee-system-roles";
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
        errorData.message || "시스템 역할 목록 조회 실패",
        response.status
      );
    }

    const data = await response.json();
    console.log("✅ 시스템 역할 목록 조회 성공");

    return NextResponse.json(data);
  } catch (error) {
    console.error("❌ 시스템 역할 목록 조회 에러:", error);
    return createErrorResponse(API_CONFIG.ERROR_MESSAGES.SERVER_ERROR, 500);
  }
}

/**
 * 직원에게 시스템 역할 할당
 * POST /api/admin/employee-system-roles
 */
export async function POST(request: NextRequest) {
  try {
    const authorization = getAuthorizationHeader(request);
    if (!authorization) {
      return createErrorResponse(API_CONFIG.ERROR_MESSAGES.UNAUTHORIZED, 401);
    }

    const body = await request.json();
    console.log("📋 직원 시스템 역할 할당", body);

    const response = await fetchBackend("/api/admin/employee-system-roles", {
      method: "POST",
      headers: {
        Authorization: authorization,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return createErrorResponse(
        errorData.message || "시스템 역할 할당 실패",
        response.status
      );
    }

    const data = await response.json();
    console.log("✅ 시스템 역할 할당 성공");

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("❌ 시스템 역할 할당 에러:", error);
    return createErrorResponse(API_CONFIG.ERROR_MESSAGES.SERVER_ERROR, 500);
  }
}
