# 관리자 인증 시스템 다이어그램

## 컴포넌트 관계도

```mermaid
graph TD
    A[관리자 로그인 페이지] -->|사용| B[useAuth 훅]
    C[대시보드 페이지] -->|사용| B
    B -->|호출| D[auth.ts API 함수]
    C -->|사용| E[ProtectedRoute 컴포넌트]
    E -->|접근 제어| C
    E -->|상태 확인| B
    B -->|저장/복원| F[(localStorage)]
    style A fill:#f9f,stroke:#333,stroke-width:2px
    style C fill:#bbf,stroke:#333,stroke-width:2px
```

## 로그인 시퀀스 다이어그램

```mermaid
sequenceDiagram
    actor User as 사용자
    participant LoginPage as 로그인 페이지
    participant AuthHook as useAuth 훅
    participant API as auth.ts API
    participant Storage as localStorage

    User->>LoginPage: 이메일/비밀번호 입력
    LoginPage->>AuthHook: login(email, password) 호출
    AuthHook->>API: adminLogin(email, password) 호출
    API-->>AuthHook: 인증 응답 반환

    alt 로그인 성공
        AuthHook->>Storage: 토큰 저장
        AuthHook->>LoginPage: 성공 응답 반환
        LoginPage->>User: 대시보드로 리디렉션
    else 로그인 실패
        AuthHook->>LoginPage: 오류 응답 반환
        LoginPage->>User: 오류 메시지 표시
    end
```

## 인증 상태 확인 시퀀스 다이어그램

```mermaid
sequenceDiagram
    participant App as 애플리케이션
    participant AuthHook as useAuth 훅
    participant Storage as localStorage
    participant API as auth.ts API

    App->>AuthHook: 초기화
    AuthHook->>Storage: 토큰 검색

    alt 토큰 존재
        Storage-->>AuthHook: 저장된 토큰
        AuthHook->>API: verifyToken(token) 호출

        alt 토큰 유효
            API-->>AuthHook: 유효한 토큰 응답
            AuthHook->>App: 인증됨 (isAuthenticated=true)
        else 토큰 만료
            API-->>AuthHook: 토큰 만료 응답
            AuthHook->>Storage: refreshToken 검색
            Storage-->>AuthHook: 리프레시 토큰
            AuthHook->>API: refreshAuthToken(refreshToken) 호출

            alt 토큰 갱신 성공
                API-->>AuthHook: 새 토큰 응답
                AuthHook->>Storage: 새 토큰 저장
                AuthHook->>App: 인증됨 (isAuthenticated=true)
            else 토큰 갱신 실패
                AuthHook->>Storage: 토큰 삭제
                AuthHook->>App: 인증되지 않음 (isAuthenticated=false)
            end
        end
    else 토큰 없음
        AuthHook->>App: 인증되지 않음 (isAuthenticated=false)
    end
```

## 보호된 라우트 접근 흐름도

```mermaid
graph TD
    A[사용자가 보호된 라우트 접근] --> B{인증 상태 확인}
    B -->|로딩 중| C[로딩 화면 표시]
    B -->|인증됨| D{역할 확인}
    B -->|인증되지 않음| E[로그인 페이지로 리디렉션]
    D -->|역할 일치| F[보호된 콘텐츠 표시]
    D -->|역할 불일치| G[접근 거부 페이지로 리디렉션]
    style A fill:#f9f,stroke:#333,stroke-width:2px
    style F fill:#bbf,stroke:#333,stroke-width:2px
```

## 로그아웃 시퀀스 다이어그램

```mermaid
sequenceDiagram
    actor User as 사용자
    participant Dashboard as 대시보드
    participant AuthHook as useAuth 훅
    participant API as auth.ts API
    participant Storage as localStorage

    User->>Dashboard: 로그아웃 버튼 클릭
    Dashboard->>AuthHook: logout() 호출
    AuthHook->>API: adminLogout() 호출
    API-->>AuthHook: 로그아웃 성공 응답
    AuthHook->>Storage: 모든 인증 데이터 삭제
    AuthHook->>Dashboard: 로그아웃 완료
    Dashboard->>User: 로그인 페이지로 리디렉션
```

## 데이터 흐름 다이어그램

```mermaid
graph LR
    A[로그인 폼] -->|이메일/비밀번호| B[useAuth 훅]
    B -->|인증 요청| C[auth.ts API]
    C -->|인증 응답| B
    B -->|토큰/사용자 정보| D[(localStorage)]
    B -->|인증 상태| E[ProtectedRoute]
    E -->|인증 확인| F[보호된 컴포넌트]
    style A fill:#f9d,stroke:#333,stroke-width:1px
    style B fill:#ddf,stroke:#333,stroke-width:1px
    style F fill:#cfc,stroke:#333,stroke-width:1px
```

이러한 다이어그램은 시스템의 동작을 시각적으로 표현하여 개발자와 비기술적 이해관계자 모두가 인증 흐름을 쉽게 이해할 수 있도록 도와줍니다.
