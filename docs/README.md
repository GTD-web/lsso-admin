# 관리자 인증 시스템 문서화

이 폴더는 관리자 인증 시스템에 대한 기술 문서를 포함하고 있습니다. 각 파일은 기능의 다른 측면을 다루고 있으며, 개발자와 이해관계자가 시스템을 이해하는 데 도움이 됩니다.

## 문서 목록

1. [기능 개요 및 구조](admin-login-flow.md) - 관리자 로그인 시스템의 전반적인 구조와 주요 기능
2. [다이어그램 및 흐름도](admin-auth-diagrams.md) - 인증 시스템의 시각적 표현
3. [API 및 Hooks 참조](admin-auth-api-reference.md) - 개발자를 위한 API 함수 및 React Hook 참조

## 시작하기

관리자 인증 시스템은 다음 주요 파일로 구성되어 있습니다:

- **`src/app/page.tsx`**: 관리자 로그인 페이지
- **`src/app/api/auth.ts`**: 인증 API 함수
- **`src/app/hooks/useAuth.ts`**: 인증 상태 관리 React Hook
- **`src/app/components/ProtectedRoute.tsx`**: 인증된 사용자만 접근 가능한 라우트 컴포넌트
- **`src/app/dashboard/page.tsx`**: 보호된 대시보드 페이지

### 개발 환경

테스트를 위해 다음 관리자 계정을 사용할 수 있습니다:

- **이메일**: admin@example.com
- **비밀번호**: admin123

## 기술 스택

이 인증 시스템은 다음 기술로 구현되었습니다:

- Next.js 15 (App Router)
- React 19
- TypeScript
- JWT 인증
- localStorage (개발용, 프로덕션에서는 쿠키 권장)

## 사용 방법

### 기본 인증 설정

```tsx
// _app.tsx 또는 레이아웃 컴포넌트에서
import { useAuth } from "./hooks/useAuth";

function MyApp({ Component, pageProps }) {
  // useAuth 훅이 마운트 시 인증 상태를 초기화합니다
  useAuth();

  return <Component {...pageProps} />;
}
```

### 보호된 라우트 생성

```tsx
// 페이지 또는 컴포넌트에서
import ProtectedRoute from "../components/ProtectedRoute";

function AdminDashboard() {
  return (
    <ProtectedRoute requiredRole="admin">
      <div>관리자만 볼 수 있는 콘텐츠</div>
    </ProtectedRoute>
  );
}
```

### 인증 상태 확인 및 로그인/로그아웃

```tsx
import { useAuth } from "../hooks/useAuth";

function Header() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header>
      {isAuthenticated ? (
        <>
          <span>안녕하세요, {user?.name}님</span>
          <button onClick={logout}>로그아웃</button>
        </>
      ) : (
        <a href="/login">로그인</a>
      )}
    </header>
  );
}
```

## 확장 및 커스터마이징

인증 시스템은 쉽게 확장할 수 있도록 설계되었습니다:

- 다른 역할 추가: `User` 인터페이스의 `role` 필드에 새 역할 추가
- 다중 인증(MFA) 구현: `adminLogin` 함수 확장
- 소셜 로그인 추가: 새 인증 API 함수 추가

## 문서 업데이트

이 문서는 시스템이 변경될 때마다 업데이트되어야 합니다. 특히 다음 변경 사항이 있을 때 주의해야 합니다:

- API 응답 형식 변경
- 인증 흐름 변경
- 인증 관련 컴포넌트 추가 또는 변경
