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

    console.log("🔐 시스템 역할 상세 조회 프록시 요청:", { id });

    const response = await fetchBackend(`/api/admin/system-roles/${id}`, {
      method: "GET",
      headers: {
        Authorization: authorization,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return createErrorResponse(
        errorData.message || "시스템 역할 조회 실패",
        response.status
      );
    }

    const data = await response.json();
    console.log("✅ 시스템 역할 조회 성공");

    return NextResponse.json(data);
  } catch (error) {
    console.error("❌ 시스템 역할 조회 프록시 에러:", error);
    return createErrorResponse(API_CONFIG.ERROR_MESSAGES.SERVER_ERROR, 500);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authorization = getAuthorizationHeader(request);
    const body = await request.json();
    const { id } = await params;

    if (!authorization) {
      return createErrorResponse(API_CONFIG.ERROR_MESSAGES.UNAUTHORIZED, 401);
    }

    console.log("🔐 시스템 역할 수정 프록시 요청:", { id, body });

    const response = await fetchBackend(`/api/admin/system-roles/${id}`, {
      method: "PUT",
      headers: {
        Authorization: authorization,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return createErrorResponse(
        errorData.message || "시스템 역할 수정 실패",
        response.status
      );
    }

    const data = await response.json();
    console.log("✅ 시스템 역할 수정 성공");

    return NextResponse.json(data);
  } catch (error) {
    console.error("❌ 시스템 역할 수정 프록시 에러:", error);
    return createErrorResponse(API_CONFIG.ERROR_MESSAGES.SERVER_ERROR, 500);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authorization = getAuthorizationHeader(request);
    const { id } = await params;

    if (!authorization) {
      return createErrorResponse(API_CONFIG.ERROR_MESSAGES.UNAUTHORIZED, 401);
    }

    console.log("🔐 시스템 역할 삭제 프록시 요청:", { id });

    const response = await fetchBackend(`/api/admin/system-roles/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: authorization,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return createErrorResponse(
        errorData.message || "시스템 역할 삭제 실패",
        response.status
      );
    }

    // 삭제 성공 시 빈 응답 또는 성공 메시지
    if (response.status === 204) {
      return new NextResponse(null, { status: 204 });
    }

    const data = await response.json().catch(() => ({ success: true }));
    console.log("✅ 시스템 역할 삭제 성공");

    return NextResponse.json(data);
  } catch (error) {
    console.error("❌ 시스템 역할 삭제 프록시 에러:", error);
    return createErrorResponse(API_CONFIG.ERROR_MESSAGES.SERVER_ERROR, 500);
  }
}
