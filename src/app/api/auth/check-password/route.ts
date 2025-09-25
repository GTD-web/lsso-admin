import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'https://lsso-git-dev-lumir-tech7s-projects.vercel.app';

export async function POST(request: NextRequest) {
  try {
    const authorization = request.headers.get('authorization');
    const body = await request.json();
    
    if (!authorization) {
      return NextResponse.json(
        { message: '인증 토큰이 없습니다.' },
        { status: 401 }
      );
    }

    console.log('🔒 비밀번호 확인 프록시 요청');
    
    const response = await fetch(`${BACKEND_URL}/api/auth/check-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authorization,
      },
      body: JSON.stringify(body),
    });

    console.log('📡 비밀번호 확인 응답 상태:', response.status);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { message: errorData.message || '비밀번호 확인 실패' },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('✅ 비밀번호 확인 성공');
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('❌ 비밀번호 확인 프록시 에러:', error);
    return NextResponse.json(
      { message: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
