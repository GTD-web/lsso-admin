# LSSO Admin API Reference

LSSO 관리자 통합 API 문서입니다. 조직 관리, 시스템 관리, 로그 관리 기능을 제공합니다.

## 개요

-   **Domain URL**: `https://lsso.vercel.app` (로컬은 3030포트)
-   **Base URL**: `/admin`
-   **인증**: JWT Bearer Token 필요
-   **권한**: 관리자 권한 필요

## 인증

모든 API 요청에는 Authorization 헤더에 Bearer 토큰이 필요합니다.

```
Authorization: Bearer <JWT_TOKEN>
```

---

## 조직 관리 API

### 1. 부서 관리

#### 1.1 부서 목록 조회

**GET** `/admin/organizations/departments`

전체 부서 목록을 계층구조로 조회합니다.

**응답:**

```json
{
  "departments": [
    {
      "id": "dept-uuid",
      "departmentName": "개발팀",
      "departmentCode": "DEV_TEAM",
      "type": "DEPARTMENT",
      "parentDepartmentId": "parent-uuid",
      "order": 1,
      "childDepartments": [...],
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

#### 1.2 부서 상세 조회

**GET** `/admin/organizations/departments/{id}`

**경로 파라미터:**

-   `id` - 부서 ID

#### 1.3 부서 생성

**POST** `/admin/organizations/departments`

**요청 본문:**

```json
{
    "departmentName": "개발팀",
    "departmentCode": "DEV_TEAM",
    "type": "DEPARTMENT",
    "parentDepartmentId": "parent-uuid",
    "order": 1
}
```

**필수 필드:**

-   `departmentName`: 부서명
-   `departmentCode`: 부서 코드 (고유값)
-   `type`: 부서 유형 (COMPANY, DIVISION, DEPARTMENT, TEAM)

#### 1.4 부서 수정

**PUT** `/admin/organizations/departments/{id}`

#### 1.5 부서 삭제

**DELETE** `/admin/organizations/departments/{id}`

> **주의**: 하위 부서나 배치된 직원이 있으면 삭제 불가

### 2. 직원 관리

#### 2.1 직원 목록 조회

**GET** `/admin/organizations/employees`

**응답:**

```json
{
    "employees": [
        {
            "id": "emp-uuid",
            "employeeNumber": "EMP001",
            "name": "홍길동",
            "email": "hong@company.com",
            "phoneNumber": "010-1234-5678",
            "dateOfBirth": "1990-01-01",
            "gender": "MALE",
            "hireDate": "2023-01-01",
            "status": "재직중",
            "currentRankId": "rank-uuid",
            "terminationDate": null,
            "isInitialPasswordSet": false,
            "createdAt": "2024-01-01T00:00:00Z",
            "updatedAt": "2024-01-01T00:00:00Z"
        }
    ]
}
```

#### 2.2 직원 상세 조회

**GET** `/admin/organizations/employees/{id}`

#### 2.3 직원 생성

**POST** `/admin/organizations/employees`

**요청 본문:**

```json
{
    "employeeNumber": "EMP001",
    "name": "홍길동",
    "email": "hong@company.com",
    "phoneNumber": "010-1234-5678",
    "dateOfBirth": "1990-01-01",
    "gender": "MALE",
    "hireDate": "2023-01-01",
    "currentRankId": "rank-uuid"
}
```

**필수 필드:**

-   `employeeNumber`: 사번 (고유값)
-   `name`: 이름
-   `email`: 이메일 (고유값)
-   `hireDate`: 입사일

#### 2.4 직원 수정

**PUT** `/admin/organizations/employees/{id}`

### 3. 직책 관리

#### 3.1 직책 목록 조회

**GET** `/admin/organizations/positions`

**응답:**

```json
[
    {
        "id": "pos-uuid",
        "positionTitle": "부서장",
        "positionCode": "DEPT_HEAD",
        "level": 1,
        "hasManagementAuthority": true
    }
]
```

#### 3.2 직책 생성

**POST** `/admin/organizations/positions`

**요청 본문:**

```json
{
    "positionTitle": "부서장",
    "positionCode": "DEPT_HEAD",
    "level": 1,
    "hasManagementAuthority": true
}
```

#### 3.3 직책 수정

**PUT** `/admin/organizations/positions/{id}`

#### 3.4 직책 삭제

**DELETE** `/admin/organizations/positions/{id}`

### 4. 직급 관리

#### 4.1 직급 목록 조회

**GET** `/admin/organizations/ranks`

**응답:**

```json
[
    {
        "id": "rank-uuid",
        "rankName": "과장",
        "rankCode": "MANAGER",
        "level": 3
    }
]
```

#### 4.2 직급 생성

**POST** `/admin/organizations/ranks`

#### 4.3 직급 수정

**PUT** `/admin/organizations/ranks/{id}`

#### 4.4 직급 삭제

**DELETE** `/admin/organizations/ranks/{id}`

### 5. 직원 배치 관리

#### 5.1 직원 부서/직책 배치

**POST** `/admin/organizations/employee-assignments`

**요청 본문:**

```json
{
    "employeeId": "emp-uuid",
    "departmentId": "dept-uuid",
    "positionId": "pos-uuid",
    "isManager": false
}
```

#### 5.2 직원 부서/직책 변경

**PUT** `/admin/organizations/employee-assignments/{id}`

#### 5.3 직원 부서/직책 해제

**DELETE** `/admin/organizations/employee-assignments/{id}`

#### 5.4 직원 배치 현황 조회

**GET** `/admin/organizations/employees/{id}/assignments`

### 6. 직급 이력 관리

#### 6.1 직원 직급 변경

**POST** `/admin/organizations/employees/{id}/rank-promotion`

**요청 본문:**

```json
{
    "rankId": "new-rank-uuid"
}
```

#### 6.2 직원 직급 이력 조회

**GET** `/admin/organizations/employees/{id}/rank-history`

---

## 시스템 관리 API

### 1. 시스템 관리

#### 1.1 시스템 목록 조회

**GET** `/admin/systems`

시스템 목록을 조회합니다. 선택적으로 검색어를 사용할 수 있습니다.

**쿼리 파라미터:**

-   `search` (선택) - 검색어 (이름, 설명, 도메인)

**응답:**

```json
[
    {
        "id": "uuid",
        "clientId": "string",
        "clientSecret": "***",
        "name": "string",
        "description": "string",
        "domain": "string",
        "allowedOrigin": ["string"],
        "healthCheckUrl": "string",
        "isActive": true,
        "createdAt": "2024-01-01T00:00:00Z",
        "updatedAt": "2024-01-01T00:00:00Z"
    }
]
```

#### 1.2 시스템 검색

**GET** `/admin/systems/search`

**쿼리 파라미터:**

-   `query` (필수) - 검색어

#### 1.3 시스템 상세 조회

**GET** `/admin/systems/{id}`

#### 1.4 시스템 생성

**POST** `/admin/systems`

**요청 본문:**

```json
{
    "name": "string",
    "description": "string",
    "domain": "string",
    "allowedOrigin": ["string"],
    "healthCheckUrl": "string",
    "isActive": true
}
```

> **참고**: 클라이언트 ID/시크릿이 자동으로 생성됩니다.

#### 1.5 시스템 수정

**PATCH** `/admin/systems/{id}`

#### 1.6 시스템 삭제

**DELETE** `/admin/systems/{id}`

#### 1.7 API 키 재생성

**POST** `/admin/systems/{id}/regenerate-keys`

클라이언트 시크릿을 새로 생성합니다.

---

### 2. 시스템 역할 관리

#### 2.1 시스템 역할 목록 조회

**GET** `/admin/system-roles`

**쿼리 파라미터:**

-   `systemId` (선택) - 특정 시스템의 역할만 조회

**응답:**

```json
[
    {
        "id": "uuid",
        "systemId": "uuid",
        "roleName": "string",
        "roleCode": "string",
        "description": "string",
        "permissions": ["string"],
        "sortOrder": 0,
        "isActive": true,
        "createdAt": "2024-01-01T00:00:00Z",
        "updatedAt": "2024-01-01T00:00:00Z"
    }
]
```

#### 2.2 시스템 역할 상세 조회

**GET** `/admin/system-roles/{id}`

#### 2.3 시스템 역할 생성

**POST** `/admin/system-roles`

**요청 본문:**

```json
{
    "systemId": "uuid",
    "roleName": "string",
    "roleCode": "string",
    "description": "string",
    "permissions": ["string"],
    "sortOrder": 0,
    "isActive": true
}
```

#### 2.4 시스템 역할 수정

**PATCH** `/admin/system-roles/{id}`

#### 2.5 시스템 역할 삭제

**DELETE** `/admin/system-roles/{id}`

---

## 로그 관리 API

#### 1.1 로그 목록 조회

**GET** `/admin/logs`

로그 목록을 페이지네이션으로 조회합니다.

**쿼리 파라미터:**

-   `page` (선택, 기본값: 1) - 페이지 번호
-   `limit` (선택, 기본값: 10) - 페이지당 항목 수

**응답:**

```json
{
    "logs": [
        {
            "id": "uuid",
            "requestTimestamp": "2024-01-01T00:00:00Z",
            "responseTimestamp": "2024-01-01T00:00:00Z",
            "method": "GET",
            "url": "/api/example",
            "params": {},
            "query": {},
            "body": {},
            "statusCode": 200,
            "responseTime": 100,
            "response": {},
            "error": null,
            "ip": "127.0.0.1",
            "host": "localhost",
            "userAgent": "string",
            "system": "string",
            "isError": false
        }
    ],
    "total": 100,
    "page": 1,
    "limit": 10,
    "totalPages": 10
}
```

#### 1.2 로그 상세 조회

**GET** `/admin/logs/{id}`

#### 1.3 로그 필터링

**POST** `/admin/logs/filter`

다양한 조건으로 로그를 필터링합니다.

**요청 본문:**

```json
{
    "page": 1,
    "limit": 10,
    "startDate": "2024-01-01T00:00:00Z",
    "endDate": "2024-01-31T23:59:59Z",
    "method": "GET",
    "url": "/api/example",
    "statusCode": 200,
    "host": "localhost",
    "ip": "127.0.0.1",
    "system": "example-system",
    "errorsOnly": false,
    "sortBy": "requestTimestamp",
    "sortDirection": "DESC"
}
```

---

## 응답 코드

### 성공 응답

-   `200 OK` - 조회, 수정 성공
-   `201 Created` - 생성 성공

### 오류 응답

-   `400 Bad Request` - 잘못된 요청 데이터
-   `401 Unauthorized` - 인증 토큰 누락 또는 만료
-   `403 Forbidden` - 권한 부족
-   `404 Not Found` - 리소스를 찾을 수 없음
-   `409 Conflict` - 중복된 데이터 (코드, 사번, 이메일 등)
-   `500 Internal Server Error` - 서버 내부 오류

### 오류 응답 형식

```json
{
    "statusCode": 400,
    "message": "이미 존재하는 부서 코드입니다.",
    "error": "Bad Request"
}
```

---

## 비즈니스 규칙

### 삭제 제한 사항

1. **부서 삭제**: 하위 부서가 있거나 배치된 직원이 있으면 삭제 불가
2. **직책 삭제**: 해당 직책에 배치된 직원이 있으면 삭제 불가
3. **직급 삭제**: 해당 직급을 가진 직원이나 이력이 있으면 삭제 불가

### 중복 검증

1. **부서 코드**: 전체 부서에서 고유해야 함
2. **직원 사번**: 전체 직원에서 고유해야 함
3. **직원 이메일**: 전체 직원에서 고유해야 함
4. **직책 코드**: 전체 직책에서 고유해야 함
5. **직급 코드**: 전체 직급에서 고유해야 함
6. **시스템 이름**: 전체 시스템에서 고유해야 함
7. **시스템 역할 코드**: 같은 시스템 내에서 고유해야 함

### 배치 규칙

1. 한 직원은 같은 부서에서 하나의 직책만 가질 수 있음
2. 직원 배치 시 해당 직원, 부서, 직책이 모두 존재해야 함

### 직급 변경 규칙

1. 직급 변경 시 직원의 현재 직급이 업데이트됨
2. 모든 직급 변경은 이력으로 기록됨

### 시스템 관리 규칙

1. **시스템 생성/API 키 재생성**: 클라이언트 시크릿은 생성/재생성 시에만 원본이 반환됩니다. 이후 조회 시에는 마스킹된 값(`***`)이 반환됩니다.
2. **시스템 역할**: 같은 시스템 내에서 역할 코드는 유니크해야 합니다.

### 로그 관리 규칙

1. **로그 필터링**: 모든 필터 조건은 선택적이며, 제공된 조건들은 AND 연산으로 처리됩니다.
2. **페이지네이션**: 모든 목록 조회 API는 페이지네이션을 지원합니다.

---

## 사용 예시

### 새로운 직원 채용 및 배치 프로세스

1. 직원 생성: `POST /admin/organizations/employees`
2. 부서/직책 배치: `POST /admin/organizations/employee-assignments`
3. 직급 이력 생성: `POST /admin/organizations/employees/{id}/rank-promotion`

### 조직 구조 조회

1. 부서 계층구조: `GET /admin/organizations/departments`
2. 직원 목록: `GET /admin/organizations/employees`
3. 직책/직급 목록: `GET /admin/organizations/positions`, `GET /admin/organizations/ranks`

### 시스템 관리 프로세스

1. 시스템 생성: `POST /admin/systems`
2. 시스템 역할 생성: `POST /admin/system-roles`
3. API 키 재생성: `POST /admin/systems/{id}/regenerate-keys`

### 로그 분석

1. 전체 로그 조회: `GET /admin/logs?page=1&limit=50`
2. 에러 로그 필터링: `POST /admin/logs/filter` (errorsOnly: true)
3. 특정 기간 로그: `POST /admin/logs/filter` (startDate, endDate 설정)

---

## API 통계

-   **총 엔드포인트**: 35개
-   **조직 관리**: 20개
-   **시스템 관리**: 7개
-   **시스템 역할 관리**: 5개
-   **로그 관리**: 3개

---

**문서 버전**: 2.0  
**최종 업데이트**: 2024년 12월  
**작성자**: LSSO 개발팀
