import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'https://lsso-git-dev-lumir-tech7s-projects.vercel.app';

export async function GET(request: NextRequest) {
  try {
    const authorization = request.headers.get('authorization');
    const { searchParams } = new URL(request.url);
    
    if (!authorization) {
      return NextResponse.json(
        { message: '인증 토큰이 없습니다.' },
        { status: 401 }
      );
    }

    console.log('📋 로그 필터 조회 프록시 요청');
    
    // 쿼리 파라미터 전달
    const queryString = searchParams.toString();
    const url = `${BACKEND_URL}/api/admin/logs/filter${queryString ? `?${queryString}` : ''}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authorization,
      },
    });

    console.log('📡 로그 필터 응답 상태:', response.status);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { message: errorData.message || '로그 조회 실패' },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('✅ 로그 조회 성공');
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('❌ 로그 조회 프록시 에러:', error);
    return NextResponse.json(
      { message: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
