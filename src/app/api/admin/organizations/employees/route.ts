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

    console.log('👥 직원 목록 조회 프록시 요청');
    
    // 쿼리 파라미터 전달
    const queryString = searchParams.toString();
    const url = `${BACKEND_URL}/api/admin/organizations/employees${queryString ? `?${queryString}` : ''}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authorization,
      },
    });

    console.log('📡 직원 목록 응답 상태:', response.status);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { message: errorData.message || '직원 목록 조회 실패' },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('✅ 직원 목록 조회 성공');
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('❌ 직원 목록 프록시 에러:', error);
    return NextResponse.json(
      { message: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

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

    console.log('👥 직원 생성 프록시 요청');
    
    const response = await fetch(`${BACKEND_URL}/api/admin/organizations/employees`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authorization,
      },
      body: JSON.stringify(body),
    });

    console.log('📡 직원 생성 응답 상태:', response.status);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { message: errorData.message || '직원 생성 실패' },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('✅ 직원 생성 성공');
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('❌ 직원 생성 프록시 에러:', error);
    return NextResponse.json(
      { message: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
