# 루미르 UI SDK 데모 프로젝트

이 프로젝트는 Next.js와 Tailwind CSS를 기반으로 모던 웹 애플리케이션을 구현한 데모입니다.

## 주요 특징

- 💎 Next.js 15 + React 19 + TypeScript
- 🎨 컴포넌트 시스템
- 🌙 완벽한 다크 모드 지원
- 📱 반응형 디자인
- ♿ 접근성 최적화
- 🔐 토큰 기반 인증 시스템 ([문서 보기](./docs/README.md))

## 시작하기

### 필수 요구사항

- Node.js 18 이상
- npm 또는 yarn

### 설치

```bash
# 패키지 설치
npm install
# 또는
yarn install
```

### 개발 서버 실행

```bash
npm run dev
# 또는
yarn dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)으로 접속하여 결과를 확인할 수 있습니다.

## 테스트 계정 정보

관리자 대시보드에 접근하기 위한 테스트 계정:

- **이메일**: admin@example.com
- **비밀번호**: admin123

## 프로젝트 구조

```
src/
├── app/               # Next.js App Router
│   ├── api/           # API 함수
│   │   └── auth.ts    # 인증 API 함수
│   ├── auth/          # 인증 관련 페이지
│   │   └── login/     # 로그인 페이지
│   ├── components/    # 공통 컴포넌트
│   │   ├── LumirMock.tsx  # UI 컴포넌트
│   │   ├── ProtectedRoute.tsx  # 보호된 라우트 컴포넌트
│   │   └── Sidebar.tsx  # 사이드바 컴포넌트
│   ├── dashboard/     # 대시보드 페이지
│   ├── hooks/         # 커스텀 훅
│   │   └── useAuth.ts # 인증 상태 관리 훅
│   ├── globals.css    # 전역 스타일
│   ├── layout.tsx     # 루트 레이아웃
│   ├── page.tsx       # 홈페이지 (관리자 로그인)
│   └── providers.tsx  # 테마 제공자
├── docs/              # 프로젝트 문서
├── ...
```

## 기능별 문서

- [인증 시스템 문서](./docs/README.md) - 관리자 로그인 및 인증 시스템에 대한 상세 문서
  - [기능 개요 및 구조](./docs/admin-login-flow.md)
  - [다이어그램 및 흐름도](./docs/admin-auth-diagrams.md)
  - [API 및 Hooks 참조](./docs/admin-auth-api-reference.md)

## 구현 정보

이 프로젝트는 내부적으로 UI 컴포넌트 목업을 구현하여 사용합니다.

### 목업 컴포넌트

`src/app/components/LumirMock.tsx`에서 다음 컴포넌트들을 제공합니다:

- Button - 다양한 스타일의 버튼 컴포넌트
- Card - 콘텐츠를 담는 카드 컴포넌트
- TextField - 입력 필드 컴포넌트
- Alert - 알림 메시지 컴포넌트
- SidebarItem - 사이드바 내비게이션 아이템

### 스타일링

프로젝트는 Tailwind CSS를 사용하여 스타일링합니다. 목업 컴포넌트들도 Tailwind 클래스를 활용하여 구현되었습니다.

## 라이센스

MIT
