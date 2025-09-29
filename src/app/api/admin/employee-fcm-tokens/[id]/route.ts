import { NextRequest, NextResponse } from "next/server";
import {
  fetchBackend,
  getAuthorizationHeader,
  createErrorResponse,
  API_CONFIG,
} from "../../../config";

/**
 * 직원 FCM 토큰 관계 상세 조회
 * GET /api/admin/employee-fcm-tokens/{id}
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
    console.log("📋 FCM 토큰 관계 상세 조회", { id });

    const response = await fetchBackend(
      `/api/admin/employee-fcm-tokens/${id}`,
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
        errorData.message || "FCM 토큰 관계 상세 조회 실패",
        response.status
      );
    }

    const data = await response.json();
    console.log("✅ FCM 토큰 관계 상세 조회 성공");

    return NextResponse.json(data);
  } catch (error) {
    console.error("❌ FCM 토큰 관계 상세 조회 에러:", error);
    return createErrorResponse(API_CONFIG.ERROR_MESSAGES.SERVER_ERROR, 500);
  }
}

/**
 * 직원 FCM 토큰 관계 수정
 * PUT /api/admin/employee-fcm-tokens/{id}
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authorization = getAuthorizationHeader(request);
    if (!authorization) {
      return createErrorResponse(API_CONFIG.ERROR_MESSAGES.UNAUTHORIZED, 401);
    }

    const { id } = await params;
    const body = await request.json();
    console.log("📋 FCM 토큰 관계 수정", { id, body });

    const response = await fetchBackend(
      `/api/admin/employee-fcm-tokens/${id}`,
      {
        method: "PUT",
        headers: {
          Authorization: authorization,
        },
        body: JSON.stringify(body),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return createErrorResponse(
        errorData.message || "FCM 토큰 관계 수정 실패",
        response.status
      );
    }

    const data = await response.json();
    console.log("✅ FCM 토큰 관계 수정 성공");

    return NextResponse.json(data);
  } catch (error) {
    console.error("❌ FCM 토큰 관계 수정 에러:", error);
    return createErrorResponse(API_CONFIG.ERROR_MESSAGES.SERVER_ERROR, 500);
  }
}

/**
 * 직원 FCM 토큰 관계 삭제
 * DELETE /api/admin/employee-fcm-tokens/{id}
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
    console.log("📋 FCM 토큰 관계 삭제", { id });

    const response = await fetchBackend(
      `/api/admin/employee-fcm-tokens/${id}`,
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
        errorData.message || "FCM 토큰 관계 삭제 실패",
        response.status
      );
    }

    const data = await response.json();
    console.log("✅ FCM 토큰 관계 삭제 성공");

    return NextResponse.json(data);
  } catch (error) {
    console.error("❌ FCM 토큰 관계 삭제 에러:", error);
    return createErrorResponse(API_CONFIG.ERROR_MESSAGES.SERVER_ERROR, 500);
  }
}
