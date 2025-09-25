import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'https://lsso-git-dev-lumir-tech7s-projects.vercel.app';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log('🔄 토큰 갱신 프록시 요청');
    
    // refresh는 실제로는 /auth/login 엔드포인트를 사용
    const response = await fetch(`${BACKEND_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    console.log('📡 토큰 갱신 응답 상태:', response.status);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { message: errorData.message || '토큰 갱신 실패' },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('✅ 토큰 갱신 성공');
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('❌ 토큰 갱신 프록시 에러:', error);
    return NextResponse.json(
      { message: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
