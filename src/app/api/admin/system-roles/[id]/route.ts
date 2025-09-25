import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL =
  process.env.BACKEND_URL ||
  "https://lsso-git-dev-lumir-tech7s-projects.vercel.app";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authorization = request.headers.get("authorization");
    const { id } = await params;

    if (!authorization) {
      return NextResponse.json(
        { message: "인증 토큰이 없습니다." },
        { status: 401 }
      );
    }

    console.log("🔐 시스템 역할 상세 조회 프록시 요청:", { id });

    const response = await fetch(
      `${BACKEND_URL}/api/admin/system-roles/${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: authorization,
        },
      }
    );

    console.log("📡 시스템 역할 상세 응답 상태:", response.status);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { message: errorData.message || "시스템 역할 조회 실패" },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log("✅ 시스템 역할 조회 성공");

    return NextResponse.json(data);
  } catch (error) {
    console.error("❌ 시스템 역할 조회 프록시 에러:", error);
    return NextResponse.json(
      { message: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authorization = request.headers.get("authorization");
    const body = await request.json();
    const { id } = await params;

    if (!authorization) {
      return NextResponse.json(
        { message: "인증 토큰이 없습니다." },
        { status: 401 }
      );
    }

    console.log("🔐 시스템 역할 수정 프록시 요청:", { id, body });

    const response = await fetch(
      `${BACKEND_URL}/api/admin/system-roles/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: authorization,
        },
        body: JSON.stringify(body),
      }
    );

    console.log("📡 시스템 역할 수정 응답 상태:", response.status);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { message: errorData.message || "시스템 역할 수정 실패" },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log("✅ 시스템 역할 수정 성공");

    return NextResponse.json(data);
  } catch (error) {
    console.error("❌ 시스템 역할 수정 프록시 에러:", error);
    return NextResponse.json(
      { message: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authorization = request.headers.get("authorization");
    const { id } = await params;

    if (!authorization) {
      return NextResponse.json(
        { message: "인증 토큰이 없습니다." },
        { status: 401 }
      );
    }

    console.log("🔐 시스템 역할 삭제 프록시 요청:", { id });

    const response = await fetch(
      `${BACKEND_URL}/api/admin/system-roles/${id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: authorization,
        },
      }
    );

    console.log("📡 시스템 역할 삭제 응답 상태:", response.status);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { message: errorData.message || "시스템 역할 삭제 실패" },
        { status: response.status }
      );
    }

    if (response.status === 204) {
      return new NextResponse(null, { status: 204 });
    }

    const data = await response.json().catch(() => ({ success: true }));
    console.log("✅ 시스템 역할 삭제 성공");

    return NextResponse.json(data);
  } catch (error) {
    console.error("❌ 시스템 역할 삭제 프록시 에러:", error);
    return NextResponse.json(
      { message: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
