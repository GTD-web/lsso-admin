import { NextRequest, NextResponse } from "next/server";
import {
  fetchBackend,
  getAuthorizationHeader,
  createErrorResponse,
  API_CONFIG,
} from "../../../../../config";

/**
 * 직원의 모든 시스템 역할 해제
 * DELETE /api/admin/employee-system-roles/employee/{employeeId}/all
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ employeeId: string }> }
) {
  try {
    const authorization = getAuthorizationHeader(request);
    if (!authorization) {
      return createErrorResponse(API_CONFIG.ERROR_MESSAGES.UNAUTHORIZED, 401);
    }

    const { employeeId } = await params;
    console.log("📋 직원의 모든 시스템 역할 해제", { employeeId });

    const response = await fetchBackend(
      `/api/admin/employee-system-roles/employee/${employeeId}/all`,
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
        errorData.message || "직원의 모든 시스템 역할 해제 실패",
        response.status
      );
    }

    const data = await response.json();
    console.log("✅ 직원의 모든 시스템 역할 해제 성공");

    return NextResponse.json(data);
  } catch (error) {
    console.error("❌ 직원의 모든 시스템 역할 해제 에러:", error);
    return createErrorResponse(API_CONFIG.ERROR_MESSAGES.SERVER_ERROR, 500);
  }
}
