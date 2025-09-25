import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'https://lsso-git-dev-lumir-tech7s-projects.vercel.app';

export async function POST(request: NextRequest) {
  try {
    const authorization = request.headers.get('authorization');
    
    if (!authorization) {
      return NextResponse.json(
        { message: '인증 토큰이 없습니다.' },
        { status: 401 }
      );
    }

    console.log('🔍 토큰 검증 프록시 요청');
    
    const response = await fetch(`${BACKEND_URL}/api/auth/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authorization,
      },
    });

    console.log('📡 토큰 검증 응답 상태:', response.status);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { message: errorData.message || '토큰 검증 실패' },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('✅ 토큰 검증 성공');
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('❌ 토큰 검증 프록시 에러:', error);
    return NextResponse.json(
      { message: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
