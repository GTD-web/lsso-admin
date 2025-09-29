import { NextRequest, NextResponse } from "next/server";
import {
  fetchBackend,
  getAuthorizationHeader,
  createErrorResponse,
  API_CONFIG,
} from "../../../config";

/**
 * 직원 시스템 역할 상세 조회
 * GET /api/admin/employee-system-roles/{id}
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authorization = getAuthorizationHeader(request);
    if (!authorization) {
      return createErrorResponse(API_CONFIG.ERROR_MESSAGES.UNAUTHORIZED, 401);
    }

    const { id } = await params;
    console.log("📋 시스템 역할 상세 조회", { id });

    const response = await fetchBackend(
      `/api/admin/employee-system-roles/${id}`,
      {
        method: "GET",
        headers: {
          Authorization: authorization,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return createErrorResponse(
        errorData.message || "시스템 역할 상세 조회 실패",
        response.status
      );
    }

    const data = await response.json();
    console.log("✅ 시스템 역할 상세 조회 성공");

    return NextResponse.json(data);
  } catch (error) {
    console.error("❌ 시스템 역할 상세 조회 에러:", error);
    return createErrorResponse(API_CONFIG.ERROR_MESSAGES.SERVER_ERROR, 500);
  }
}

/**
 * 직원 시스템 역할 해제
 * DELETE /api/admin/employee-system-roles/{id}
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authorization = getAuthorizationHeader(request);
    if (!authorization) {
      return createErrorResponse(API_CONFIG.ERROR_MESSAGES.UNAUTHORIZED, 401);
    }

    const { id } = await params;
    console.log("📋 시스템 역할 해제", { id });

    const response = await fetchBackend(
      `/api/admin/employee-system-roles/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: authorization,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return createErrorResponse(
        errorData.message || "시스템 역할 해제 실패",
        response.status
      );
    }

    const data = await response.json();
    console.log("✅ 시스템 역할 해제 성공");

    return NextResponse.json(data);
  } catch (error) {
    console.error("❌ 시스템 역할 해제 에러:", error);
    return createErrorResponse(API_CONFIG.ERROR_MESSAGES.SERVER_ERROR, 500);
  }
}
