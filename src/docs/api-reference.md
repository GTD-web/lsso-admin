# LSSO API 참조 문서

이 문서는 LSSO(로그인 SSO) 시스템의 API 명세를 정의합니다. 이 문서를 바탕으로 NestJS 서버 구현 시 참고하시기 바랍니다.

## 목차

- [공통 응답 형식](#공통-응답-형식)
- [인증 API](#인증-api)
- [사용자 API](#사용자-api)
- [시스템 API](#시스템-api)
- [토큰 API](#토큰-api)
- [로그 API](#로그-api)

## 공통 응답 형식

모든 API 응답은 다음과 같은 형식을 따릅니다:

```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}
```

- `success`: API 요청 성공 여부
- `data`: 요청이 성공한 경우 반환되는 데이터
- `error`: 요청이 실패한 경우 반환되는 오류 정보
  - `code`: 오류 코드
  - `message`: 오류 메시지

## 인증 API

### 관리자 로그인

관리자 계정으로 로그인하여 액세스 토큰과 리프레시 토큰을 발급받습니다.

**URL**: `/api/admin/auth/login`

**Method**: `POST`

**Request Body**:

```typescript
{
  email: string;
  password: string;
}
```

**Response**:

```typescript
{
  success: boolean;
  data?: {
    user: {
      id: string;
      email: string;
      name: string;
      role: string;
    };
    token: string;  // JWT 액세스 토큰
    refreshToken: string;  // 리프레시 토큰
  };
  error?: {
    code: string;
    message: string;
  };
}
```

**Example Request**:

```json
{
  "email": "admin@example.com",
  "password": "admin123"
}
```

**Example Response (성공)**:

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

**Example Response (실패)**:

```json
{
  "success": false,
  "error": {
    "code": "AUTH_INVALID_CREDENTIALS",
    "message": "이메일 또는 비밀번호가 올바르지 않습니다."
  }
}
```

### 토큰 검증

JWT 액세스 토큰의 유효성을 검증합니다.

**URL**: `/api/admin/auth/verify`

**Method**: `POST`

**Request Body**:

```typescript
{
  token: string; // JWT 액세스 토큰
}
```

**Response**:

```typescript
{
  success: boolean;
  data?: {
    user: {
      id: string;
      email: string;
      name: string;
      role: string;
    };
    token: string;  // JWT 액세스 토큰 (갱신된 경우)
    refreshToken: string;  // 리프레시 토큰
  };
  error?: {
    code: string;
    message: string;
  };
}
```

**Example Response (성공)**:

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

### 토큰 갱신

리프레시 토큰을 사용하여 만료된 액세스 토큰을 갱신합니다.

**URL**: `/api/admin/auth/refresh`

**Method**: `POST`

**Request Body**:

```typescript
{
  refreshToken: string; // 리프레시 토큰
}
```

**Response**:

```typescript
{
  success: boolean;
  data?: {
    user: {
      id: string;
      email: string;
      name: string;
      role: string;
    };
    token: string;  // 새로운 JWT 액세스 토큰
    refreshToken: string;  // 리프레시 토큰 (변경될 수 있음)
  };
  error?: {
    code: string;
    message: string;
  };
}
```

### 관리자 로그아웃

현재 세션을 로그아웃 처리합니다.

**URL**: `/api/admin/auth/logout`

**Method**: `POST`

**Headers**:

```
Authorization: Bearer {token}
```

**Response**:

```typescript
{
  success: boolean;
  error?: {
    code: string;
    message: string;
  };
}
```

**Example Response**:

```json
{
  "success": true
}
```

## 사용자 API

### 사용자 목록 조회

등록된 모든 사용자 목록을 조회합니다.

**URL**: `/api/admin/users`

**Method**: `GET`

**Headers**:

```
Authorization: Bearer {token}
```

**Response**:

```typescript
{
  success: boolean;
  data?: User[];
  error?: {
    code: string;
    message: string;
  };
}
```

**User 타입**:

```typescript
interface User {
  id: string;
  employeeNumber: string;
  name: string;
  email: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  gender?: string;
  hireDate?: string;
  status?: string;
  department?: string;
  position?: string;
  rank?: string;
  createdAt: string;
  updatedAt: string;
}
```

### 사용자 상세 조회

특정 ID의 사용자 정보를 조회합니다.

**URL**: `/api/admin/users/:id`

**Method**: `GET`

**Path Parameters**:

- `id`: 사용자 ID

**Headers**:

```
Authorization: Bearer {token}
```

**Response**:

```typescript
{
  success: boolean;
  data?: User;
  error?: {
    code: string;
    message: string;
  };
}
```

**Example Response (성공)**:

```json
{
  "success": true,
  "data": {
    "id": "1",
    "employeeNumber": "24001",
    "name": "홍길동",
    "email": "hong@example.com",
    "phoneNumber": "010-1234-5678",
    "dateOfBirth": "1990-01-15",
    "gender": "MALE",
    "hireDate": "2024-01-10",
    "status": "재직중",
    "department": "개발팀",
    "position": "선임개발자",
    "rank": "과장",
    "createdAt": "2024-01-10T00:00:00Z",
    "updatedAt": "2024-01-10T00:00:00Z"
  }
}
```

**Example Response (실패)**:

```json
{
  "success": false,
  "error": {
    "code": "USER_NOT_FOUND",
    "message": "해당 ID의 사용자를 찾을 수 없습니다."
  }
}
```

### 사용자 검색

검색 조건에 맞는 사용자 목록을 조회합니다.

**URL**: `/api/admin/users/search`

**Method**: `GET`

**Query Parameters**:

- `query`: 검색어 (이름, 이메일, 직원번호, 부서, 직책 등)

**Headers**:

```
Authorization: Bearer {token}
```

**Response**:

```typescript
{
  success: boolean;
  data?: User[];
  error?: {
    code: string;
    message: string;
  };
}
```

## 시스템 API

### 시스템 목록 조회

등록된 모든 시스템 목록을 조회합니다.

**URL**: `/api/admin/systems`

**Method**: `GET`

**Headers**:

```
Authorization: Bearer {token}
```

**Response**:

```typescript
{
  success: boolean;
  data?: System[];
  error?: {
    code: string;
    message: string;
  };
}
```

**System 타입**:

```typescript
interface System {
  id: string;
  name: string;
  description?: string;
  clientId: string;
  clientSecret: string;
  allowedOrigin: string[];
  healthCheckUrl?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
```

### 시스템 검색

검색 조건에 맞는 시스템 목록을 조회합니다.

**URL**: `/api/admin/systems/search`

**Method**: `GET`

**Query Parameters**:

- `query`: 검색어 (시스템 이름, 설명, 클라이언트 ID, 허용된 도메인 등)

**Headers**:

```
Authorization: Bearer {token}
```

**Response**:

```typescript
{
  success: boolean;
  data?: System[];
  error?: {
    code: string;
    message: string;
  };
}
```

### 시스템 생성

새로운 시스템을 등록합니다.

**URL**: `/api/admin/systems`

**Method**: `POST`

**Headers**:

```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body**:

```typescript
{
  name: string;
  description?: string;
  clientId: string;
  clientSecret: string;
  allowedOrigin: string[];
  healthCheckUrl?: string;
  isActive: boolean;
}
```

**Response**:

```typescript
{
  success: boolean;
  data?: System;
  error?: {
    code: string;
    message: string;
  };
}
```

**Example Request**:

```json
{
  "name": "HR 시스템",
  "description": "인사 관리 시스템",
  "clientId": "hr-system-client",
  "clientSecret": "hr-system-secret-123",
  "allowedOrigin": ["https://hr.example.com"],
  "healthCheckUrl": "https://hr.example.com/health",
  "isActive": true
}
```

### 시스템 상세 조회

특정 ID의 시스템 정보를 조회합니다.

**URL**: `/api/admin/systems/:id`

**Method**: `GET`

**Path Parameters**:

- `id`: 시스템 ID

**Headers**:

```
Authorization: Bearer {token}
```

**Response**:

```typescript
{
  success: boolean;
  data?: System;
  error?: {
    code: string;
    message: string;
  };
}
```

### 시스템 수정

특정 ID의 시스템 정보를 수정합니다.

**URL**: `/api/admin/systems/:id`

**Method**: `PUT`

**Path Parameters**:

- `id`: 시스템 ID

**Headers**:

```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body**:

```typescript
{
  name?: string;
  description?: string;
  clientId?: string;
  clientSecret?: string;
  allowedOrigin?: string[];
  healthCheckUrl?: string;
  isActive?: boolean;
}
```

**Response**:

```typescript
{
  success: boolean;
  data?: System;
  error?: {
    code: string;
    message: string;
  };
}
```

### 시스템 삭제

특정 ID의 시스템을 삭제합니다.

**URL**: `/api/admin/systems/:id`

**Method**: `DELETE`

**Path Parameters**:

- `id`: 시스템 ID

**Headers**:

```
Authorization: Bearer {token}
```

**Response**:

```typescript
{
  success: boolean;
  data?: boolean;
  error?: {
    code: string;
    message: string;
  };
}
```

## 토큰 API

### 토큰 목록 조회

등록된 모든 토큰 목록을 조회합니다.

**URL**: `/api/admin/tokens`

**Method**: `GET`

**Headers**:

```
Authorization: Bearer {token}
```

**Response**:

```typescript
{
  success: boolean;
  data?: Token[];
  error?: {
    code: string;
    message: string;
  };
}
```

**Token 타입**:

```typescript
interface Token {
  id: string;
  userId: string;
  systemId: string;
  accessToken: string;
  secret: string;
  tokenExpiresAt: string;
  lastAccess?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  // 추가 정보
  userName?: string;
  userEmail?: string;
  systemName?: string;
}
```

### 시스템별 토큰 조회

특정 시스템에 연결된 모든 토큰 목록을 조회합니다.

**URL**: `/api/admin/tokens/system/:systemId`

**Method**: `GET`

**Path Parameters**:

- `systemId`: 시스템 ID

**Headers**:

```
Authorization: Bearer {token}
```

**Response**:

```typescript
{
  success: boolean;
  data?: Token[];
  error?: {
    code: string;
    message: string;
  };
}
```

### 사용자별 토큰 조회

특정 사용자에게 발급된 모든 토큰 목록을 조회합니다.

**URL**: `/api/admin/tokens/user/:userId`

**Method**: `GET`

**Path Parameters**:

- `userId`: 사용자 ID

**Headers**:

```
Authorization: Bearer {token}
```

**Response**:

```typescript
{
  success: boolean;
  data?: Token[];
  error?: {
    code: string;
    message: string;
  };
}
```

### 토큰 상세 조회

특정 ID의 토큰 정보를 조회합니다.

**URL**: `/api/admin/tokens/:id`

**Method**: `GET`

**Path Parameters**:

- `id`: 토큰 ID

**Headers**:

```
Authorization: Bearer {token}
```

**Response**:

```typescript
{
  success: boolean;
  data?: Token;
  error?: {
    code: string;
    message: string;
  };
}
```

### 토큰 생성

새로운 토큰을 생성합니다.

**URL**: `/api/admin/tokens`

**Method**: `POST`

**Headers**:

```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body**:

```typescript
{
  userId: string;
  systemId: string;
  expiresInDays?: number; // 기본값 30일
}
```

**Response**:

```typescript
{
  success: boolean;
  data?: Token;
  error?: {
    code: string;
    message: string;
  };
}
```

**Example Request**:

```json
{
  "userId": "1",
  "systemId": "1",
  "expiresInDays": 90
}
```

### 토큰 상태 변경

특정 ID의 토큰 활성화 상태를 변경합니다.

**URL**: `/api/admin/tokens/:id/status`

**Method**: `PUT`

**Path Parameters**:

- `id`: 토큰 ID

**Headers**:

```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body**:

```typescript
{
  isActive: boolean;
}
```

**Response**:

```typescript
{
  success: boolean;
  data?: Token;
  error?: {
    code: string;
    message: string;
  };
}
```

### 토큰 갱신

특정 ID의 토큰을 갱신합니다.

**URL**: `/api/admin/tokens/:id/renew`

**Method**: `PUT`

**Path Parameters**:

- `id`: 토큰 ID

**Headers**:

```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body**:

```typescript
{
  expiresInDays?: number; // 기본값 30일
}
```

**Response**:

```typescript
{
  success: boolean;
  data?: Token;
  error?: {
    code: string;
    message: string;
  };
}
```

### 토큰 삭제

특정 ID의 토큰을 삭제합니다.

**URL**: `/api/admin/tokens/:id`

**Method**: `DELETE`

**Path Parameters**:

- `id`: 토큰 ID

**Headers**:

```
Authorization: Bearer {token}
```

**Response**:

```typescript
{
  success: boolean;
  data?: boolean;
  error?: {
    code: string;
    message: string;
  };
}
```

## 로그 API

### 로그 목록 조회

시스템 액세스 로그 목록을 조회합니다.

**URL**: `/api/admin/logs`

**Method**: `GET`

**Headers**:

```
Authorization: Bearer {token}
```

**Response**:

```typescript
{
  success: boolean;
  data?: Log[];
  error?: {
    code: string;
    message: string;
  };
}
```

**Log 타입**:

```typescript
interface Log {
  id: string;
  host: string;
  method: string;
  url: string;
  params: Record<string, unknown>;
  query: Record<string, unknown>;
  body: Record<string, unknown>;
  ip: string;
  userAgent: string;
  requestTimestamp: string;
  responseTimestamp?: string;
  responseTime?: number;
  statusCode?: number;
  response?: Record<string, unknown>;
  error?: Record<string, unknown>;
  isError: boolean;
}
```

### 로그 검색

검색 조건에 맞는 로그 목록을 조회합니다.

**URL**: `/api/admin/logs/search`

**Method**: `GET`

**Query Parameters**:

- `query`: 검색어 (URL, 메소드, 호스트, IP, 상태 코드 등)

**Headers**:

```
Authorization: Bearer {token}
```

**Response**:

```typescript
{
  success: boolean;
  data?: Log[];
  error?: {
    code: string;
    message: string;
  };
}
```

### 기간별 로그 조회

지정된 기간 내의 로그 목록을 조회합니다.

**URL**: `/api/admin/logs/timerange`

**Method**: `GET`

**Query Parameters**:

- `startDate`: 시작 날짜 (ISO 8601 형식)
- `endDate`: 종료 날짜 (ISO 8601 형식)

**Headers**:

```
Authorization: Bearer {token}
```

**Response**:

```typescript
{
  success: boolean;
  data?: Log[];
  error?: {
    code: string;
    message: string;
  };
}
```

**Example Request**:

```
GET /api/admin/logs/timerange?startDate=2024-01-01T00:00:00Z&endDate=2024-01-31T23:59:59Z
```
