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

    console.log('🔄 시스템 재생성 프록시 요청:', body);
    
    const response = await fetch(`${BACKEND_URL}/api/admin/systems/regenerate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authorization,
      },
      body: JSON.stringify(body),
    });

    console.log('📡 시스템 재생성 응답 상태:', response.status);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { message: errorData.message || '시스템 재생성 실패' },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('✅ 시스템 재생성 성공');
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('❌ 시스템 재생성 프록시 에러:', error);
    return NextResponse.json(
      { message: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
