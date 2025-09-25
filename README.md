# LSSO Admin Panel v2

LSSO 시스템 관리자 패널 - 완전히 재설계된 v2

## 🎯 개요

LSSO Admin Panel v2는 프로젝트 가이드라인에 따라 전면 재작업된 관리자 인터페이스입니다.
조직 관리, 시스템 관리, 로그 분석 등의 기능을 모던한 UI/UX로 제공합니다.

## 🏗️ 아키텍처

### API 통신 구조 (v2)

```
api/v2/
├── base/                     # 기본 모듈 (BaseModule, 인터페이스)
└── admin/                    # 관리자 API 모듈
    ├── organizations/        # 조직 관리
    ├── systems/             # 시스템 관리
    ├── logs/                # 로그 관리
    └── auth/                # 인증 관리
```

각 모듈은 다음 구조를 따릅니다:

- `module.ts` - 싱글톤 모듈 클래스
- `repository.ts` - API 통신 구현체
- `repository.interface.ts` - 레포지토리 인터페이스
- `entity/` - 도메인 엔티티 타입
- `dto/` - 요청/응답 DTO 타입

### 페이지 구조

```
app/
├── page.tsx                  # 대시보드
├── login/                    # 로그인 페이지
├── organizations/            # 조직 관리 페이지
│   ├── _context/            # 컨텍스트 (상태 관리)
│   └── _section/            # 섹션 컴포넌트
│       └── panel/           # 패널 컴포넌트
├── systems/                 # 시스템 관리 페이지
├── system-roles/           # 시스템 역할 관리 페이지
└── logs/                   # 로그 관리 페이지
```

## 🚀 주요 기능

### 1. 조직 관리

- **부서 관리**: 계층구조 부서 관리 (생성, 수정, 삭제)
- **직원 관리**: 직원 정보 관리
- **직책 관리**: 직책 및 권한 관리
- **직급 관리**: 직급 체계 관리
- **직원 배치**: 부서/직책 배치 관리

### 2. 시스템 관리

- **시스템 등록**: 연동 시스템 등록 및 관리
- **API 키 관리**: 클라이언트 ID/시크릿 관리
- **시스템 상태**: 활성/비활성 상태 관리

### 3. 시스템 역할 관리

- **역할 정의**: 시스템별 역할 생성 및 관리
- **권한 설정**: 역할별 상세 권한 설정
- **역할 필터링**: 시스템별 역할 조회

### 4. 로그 관리

- **로그 조회**: 실시간 시스템 로그 조회
- **고급 필터링**: 다양한 조건으로 로그 검색
- **성능 분석**: 응답 시간 및 에러 분석

## 🛠️ 기술 스택

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Headless UI, Heroicons
- **State Management**: React Context API
- **API Client**: Custom v2 Repository Pattern

## 📋 요구사항

- Node.js 18+
- npm 또는 yarn
- LSSO Backend API 서버

## 🔧 설치 및 실행

### 개발 환경

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

### 프로덕션 빌드

```bash
# 빌드
npm run build

# 프로덕션 서버 실행
npm start
```

## 🌐 환경 설정

### API 서버 설정

- **개발**: `http://localhost:3030`
- **프로덕션**: `https://lsso.vercel.app`

환경에 따라 자동으로 API 서버 주소가 설정됩니다.

## 📚 API 문서

전체 API 문서는 [`docs/admin-api-reference.md`](./docs/admin-api-reference.md)를 참조하세요.

주요 API 엔드포인트:

- `/admin/organizations/*` - 조직 관리
- `/admin/systems/*` - 시스템 관리
- `/admin/system-roles/*` - 시스템 역할 관리
- `/admin/logs/*` - 로그 관리
- `/admin/auth/*` - 인증 관리

## 🔐 인증

JWT 토큰 기반 인증을 사용합니다:

- Access Token: API 요청 인증
- Refresh Token: 토큰 갱신
- 자동 토큰 갱신 지원

## 📱 주요 화면

### 대시보드

- 시스템 개요 및 빠른 액세스
- 최근 업데이트 정보

### 조직 관리

- 5개 탭으로 구성된 통합 관리 인터페이스
- 계층구조 부서 트리
- 직원 배치 매트릭스

### 시스템 관리

- 카드 기반 시스템 목록
- API 키 원클릭 재생성
- 시스템 상태 모니터링

### 로그 관리

- 실시간 로그 스트리밍
- 강력한 필터링 옵션
- 성능 지표 시각화

## 🎨 UI/UX 특징

- **모던 디자인**: Tailwind CSS 기반 깔끔한 디자인
- **반응형**: 모바일부터 데스크톱까지 완벽 지원
- **접근성**: WCAG 2.1 가이드라인 준수
- **다크모드**: 준비 중 (추후 지원 예정)

## 🔄 버전 정보

### v2.0 (2024년 12월)

- 전면 재설계 및 재구현
- v2 API 아키텍처 적용
- 모듈화된 컴포넌트 구조
- 향상된 사용자 경험

### 주요 개선사항

- **성능**: 최적화된 API 호출 패턴
- **확장성**: 모듈화된 아키텍처
- **유지보수성**: 명확한 책임 분리
- **개발 경험**: TypeScript 완전 지원

## 🤝 기여 가이드

프로젝트 가이드라인을 준수해주세요:

- API 모듈은 v2 구조 따르기
- 컴포넌트는 kebab-case 네이밍
- 페이지는 가이드라인 구조 따르기
- TypeScript 타입 안전성 보장

## 📞 지원

문제 발생 시:

1. [API 문서](./docs/admin-api-reference.md) 확인
2. 개발팀 문의
3. 로그 확인 및 디버깅

---

**LSSO Admin Panel v2** - Modern Admin Interface for LSSO System
