import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL =
  process.env.BACKEND_URL ||
  "https://lsso-git-dev-lumir-tech7s-projects.vercel.app";

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

    console.log("🏢 부서 수정 프록시 요청:", { id, body });

    const response = await fetch(
      `${BACKEND_URL}/api/admin/organizations/departments/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: authorization,
        },
        body: JSON.stringify(body),
      }
    );

    console.log("📡 부서 수정 응답 상태:", response.status);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { message: errorData.message || "부서 수정 실패" },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log("✅ 부서 수정 성공");

    return NextResponse.json(data);
  } catch (error) {
    console.error("❌ 부서 수정 프록시 에러:", error);
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

    console.log("🏢 부서 삭제 프록시 요청:", { id });

    const response = await fetch(
      `${BACKEND_URL}/api/admin/organizations/departments/${id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: authorization,
        },
      }
    );

    console.log("📡 부서 삭제 응답 상태:", response.status);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { message: errorData.message || "부서 삭제 실패" },
        { status: response.status }
      );
    }

    // 삭제 성공 시 빈 응답 또는 성공 메시지
    if (response.status === 204) {
      return new NextResponse(null, { status: 204 });
    }

    const data = await response.json().catch(() => ({ success: true }));
    console.log("✅ 부서 삭제 성공");

    return NextResponse.json(data);
  } catch (error) {
    console.error("❌ 부서 삭제 프록시 에러:", error);
    return NextResponse.json(
      { message: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
