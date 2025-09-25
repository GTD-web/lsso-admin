import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL =
  process.env.BACKEND_URL ||
  "https://lsso-git-dev-lumir-tech7s-projects.vercel.app";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    console.log("🔐 로그인 프록시 요청:", {
      grant_type: body.grant_type,
      email: body.email,
      password: body.password,
    });

    const response = await fetch(`${BACKEND_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    console.log("📡 백엔드 응답 상태:", response, response.status);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { message: errorData.message || "로그인 실패" },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log("✅ 로그인 성공");

    return NextResponse.json(data);
  } catch (error) {
    console.error("❌ 로그인 프록시 에러:", error);
    return NextResponse.json(
      { message: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
