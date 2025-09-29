import { NextRequest, NextResponse } from "next/server";
import {
  fetchBackend,
  API_CONFIG,
  getAuthorizationHeader,
  createErrorResponse,
} from "../../../config";

export async function GET(request: NextRequest) {
  try {
    const authorization = getAuthorizationHeader(request);
    const { searchParams } = new URL(request.url);

    if (!authorization) {
      return createErrorResponse(API_CONFIG.ERROR_MESSAGES.UNAUTHORIZED, 401);
    }

    console.log("📊 직급 목록 조회 프록시 요청");

    // 쿼리 파라미터 전달
    const queryString = searchParams.toString();
    const endpoint = `/api/admin/organizations/ranks${
      queryString ? `?${queryString}` : ""
    }`;

    const response = await fetchBackend(endpoint, {
      method: "GET",
      headers: {
        Authorization: authorization,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return createErrorResponse(
        errorData.message || "직급 목록 조회 실패",
        response.status
      );
    }

    const data = await response.json();
    console.log("✅ 직급 목록 조회 성공");

    return NextResponse.json(data);
  } catch (error) {
    console.error("❌ 직급 목록 프록시 에러:", error);
    return createErrorResponse(API_CONFIG.ERROR_MESSAGES.SERVER_ERROR, 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const authorization = getAuthorizationHeader(request);
    const body = await request.json();

    if (!authorization) {
      return createErrorResponse(API_CONFIG.ERROR_MESSAGES.UNAUTHORIZED, 401);
    }

    console.log("📊 직급 생성 프록시 요청:", body);

    const response = await fetchBackend("/api/admin/organizations/ranks", {
      method: "POST",
      headers: {
        Authorization: authorization,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return createErrorResponse(
        errorData.message || "직급 생성 실패",
        response.status
      );
    }

    const data = await response.json();
    console.log("✅ 직급 생성 성공");

    return NextResponse.json(data);
  } catch (error) {
    console.error("❌ 직급 생성 프록시 에러:", error);
    return createErrorResponse(API_CONFIG.ERROR_MESSAGES.SERVER_ERROR, 500);
  }
}
