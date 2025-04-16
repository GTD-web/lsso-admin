# 관리자 로그인 기능 문서

## 개요

관리자 로그인 기능은 대시보드에 접근할 수 있는 관리자 인증 시스템으로, 다음과 같은 특징을 가집니다:

- 안전한 인증 토큰 기반 로그인 시스템
- 자동 토큰 갱신 메커니즘
- 역할 기반 접근 제어(RBAC)
- 보호된 라우트 시스템

## 기능 구조

```
src/
├── app/
│   ├── page.tsx                     # 관리자 로그인 페이지
│   ├── api/
│   │   └── auth.ts                  # 인증 API 함수
│   ├── hooks/
│   │   └── useAuth.ts               # 인증 상태 관리 훅
│   ├── components/
│   │   └── ProtectedRoute.tsx       # 인증된 사용자만 접근 가능한 라우트 컴포넌트
│   └── dashboard/
│       └── page.tsx                 # 보호된 대시보드 페이지
```

## 주요 컴포넌트 설명

### 1. 관리자 로그인 페이지 (`page.tsx`)

메인 페이지에 위치한 관리자 로그인 화면입니다. 다음 기능을 제공합니다:

- 이메일/비밀번호 기반 로그인 폼
- 폼 유효성 검사
- 로딩 상태 표시
- 오류 메시지 표시
- 인증 상태에 따른 자동 리디렉션

### 2. 인증 API (`api/auth.ts`)

인증 관련 API 함수 모음입니다:

- `adminLogin`: 관리자 로그인 인증 처리
- `verifyToken`: 토큰 유효성 검증
- `refreshAuthToken`: 토큰 갱신
- `adminLogout`: 로그아웃 처리

### 3. 인증 상태 관리 (`hooks/useAuth.ts`)

전역 인증 상태를 관리하는 React 훅:

- 사용자 정보 및 인증 상태 관리
- 토큰 저장 및 복원
- 자동 토큰 검증 및 갱신
- 로그인/로그아웃 기능

### 4. 보호된 라우트 (`components/ProtectedRoute.tsx`)

인증된 사용자만 접근 가능한 컴포넌트:

- 미인증 사용자 리디렉션
- 역할 기반 접근 제어
- 로딩 상태 처리

## 인증 흐름

1. **로그인 시도**:

   - 사용자가 이메일과 비밀번호 입력
   - `useAuth` 훅의 `login` 함수 호출
   - `adminLogin` API 호출로 인증 처리
   - 성공 시 토큰 저장 및 사용자 정보 설정

2. **인증 상태 확인**:

   - 앱 초기화 시 `useAuth` 훅이 localStorage에서 토큰 확인
   - 토큰 존재 시 `verifyToken` API로 유효성 검증
   - 토큰 만료 시 `refreshAuthToken`으로 갱신 시도
   - 모든 검증 실패 시 인증 정보 삭제

3. **보호된 라우트 접근**:

   - `ProtectedRoute` 컴포넌트가 인증 상태 확인
   - 인증되지 않은 사용자는 로그인 페이지로 리디렉션
   - 필요한 역할이 없는 사용자는 접근 거부

4. **로그아웃**:
   - 사용자가 로그아웃 버튼 클릭
   - `adminLogout` API 호출
   - 모든 인증 데이터 삭제 및 홈으로 리디렉션

## 예시 코드

### 로그인 처리 예시

```typescript
// 로그인 폼 제출 처리
const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();

  // 유효성 검사
  if (!email.trim() || !password.trim()) {
    setError("이메일과 비밀번호를 입력해주세요.");
    return;
  }

  setLoading(true);
  setError("");

  try {
    // useAuth 훅의 로그인 함수 사용
    const response = await login(email, password);

    if (!response.success) {
      setError(response.error?.message || "로그인에 실패했습니다.");
    }
    // 성공 시 useEffect가 대시보드로 리디렉션
  } catch (error) {
    console.error("Login error:", error);
    setError("서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
  } finally {
    setLoading(false);
  }
};
```

### 보호된 라우트 사용 예시

```tsx
// 대시보드 페이지
export default function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="dashboard-container">
        {/* 대시보드 내용 */}
        <header>
          <h1>대시보드</h1>
          <div>
            <span>{user?.name}</span>
            <button onClick={logout}>로그아웃</button>
          </div>
        </header>
        {/* 나머지 대시보드 UI */}
      </div>
    </ProtectedRoute>
  );
}
```

## API 응답 형식

### 로그인 성공 응답

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "admin-001",
      "email": "admin@example.com",
      "name": "관리자",
      "role": "admin"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "rt_cd5f1342-a472-47d8-a44c-4e09128eb87e"
  }
}
```

### 로그인 실패 응답

```json
{
  "success": false,
  "error": {
    "code": "AUTH_INVALID_CREDENTIALS",
    "message": "이메일 또는 비밀번호가 올바르지 않습니다."
  }
}
```

## 테스트 계정

개발 및 테스트 환경에서 사용할 수 있는 계정:

- **이메일**: admin@example.com
- **비밀번호**: admin123

## 보안 고려사항

현재 구현은 개발 및 테스트용으로 localStorage를 사용하고 있습니다. 실제 프로덕션 환경에서는 다음 사항을 고려해야 합니다:

1. **토큰 저장**:

   - localStorage 대신 HttpOnly 쿠키 사용 고려
   - XSS 공격으로부터 보호

2. **API 보안**:

   - HTTPS 사용 필수
   - CSRF 보호 메커니즘 구현

3. **토큰 관리**:
   - 짧은 만료 시간 설정
   - 안전한 토큰 갱신 메커니즘 구현

## 향후 개선 사항

1. SSR(서버 사이드 렌더링) 인증 구현
2. 계정 잠금 및 패스워드 정책 강화
3. 다중 인증(MFA) 지원
4. 세션 관리 개선
5. 감사 로깅 추가
