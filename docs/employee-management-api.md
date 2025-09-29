# Employee Management API 문서

## 개요

직원 관련 중간테이블 관리를 위한 Admin API입니다. 직원과 FCM 토큰, 시스템 역할, 인증 토큰 간의 관계를 관리합니다.

**Base URL**: `/api/admin`

## 인증 방식

- **Bearer Token**: 모든 API에서 `Authorization: Bearer {access_token}` 헤더 필요
- **관리자 권한**: `ADMIN` 역할이 필요합니다.

---

## 1. 직원 FCM 토큰 관리 API

### Base Path: `/admin/employee-fcm-tokens`

#### 1.1 직원별 FCM 토큰 목록 조회 (그룹핑)

**GET** `/admin/employee-fcm-tokens`

직원별로 그룹핑된 FCM 토큰 관계 목록을 조회합니다.

##### Query Parameters
- `employeeId` (선택): 특정 직원의 FCM 토큰만 조회

##### 응답 예시
```json
{
    "employees": [
        {
            "employeeId": "uuid-employee-1",
            "employeeName": "홍길동",
            "employeeNumber": "EMP001",
            "employeeEmail": "hong@company.com",
            "fcmTokens": [
                {
                    "id": "uuid-fcm-token-1",
                    "fcmToken": "fcm_token_value_1",
                    "deviceType": "android",
                    "deviceInfo": {
                        "model": "Galaxy S21",
                        "osVersion": "Android 12"
                    },
                    "isActive": true,
                    "relationCreatedAt": "2024-01-15T09:00:00.000Z",
                    "relationUpdatedAt": "2024-01-20T14:30:00.000Z"
                }
            ],
            "totalTokens": 1,
            "activeTokens": 1,
            "firstRelationCreatedAt": "2024-01-15T09:00:00.000Z",
            "lastRelationUpdatedAt": "2024-01-20T14:30:00.000Z"
        }
    ],
    "totalEmployees": 1,
    "totalRelations": 1
}
```

#### 1.2 FCM 토큰 통계 조회

**GET** `/admin/employee-fcm-tokens/stats`

FCM 토큰 관계에 대한 통계 정보를 조회합니다.

##### 응답 예시
```json
{
    "totalRelations": 150,
    "activeTokens": 120,
    "inactiveTokens": 30,
    "employeeCount": 85,
    "fcmTokenCount": 135
}
```

#### 1.3 직원 FCM 토큰 관계 상세 조회

**GET** `/admin/employee-fcm-tokens/{id}`

특정 직원 FCM 토큰 관계의 상세 정보를 조회합니다.

##### Path Parameters
- `id`: 직원 FCM 토큰 관계 ID

##### 응답 예시
```json
{
    "id": "uuid-relation-1",
    "employeeId": "uuid-employee-1",
    "fcmTokenId": "uuid-fcm-token-1",
    "createdAt": "2024-01-15T09:00:00.000Z",
    "updatedAt": "2024-01-20T14:30:00.000Z",
    "employee": {
        "id": "uuid-employee-1",
        "name": "홍길동",
        "employeeNumber": "EMP001",
        "email": "hong@company.com"
    },
    "fcmToken": {
        "id": "uuid-fcm-token-1",
        "fcmToken": "fcm_token_value_1",
        "deviceType": "android",
        "isActive": true,
        "relationCreatedAt": "2024-01-15T09:00:00.000Z",
        "relationUpdatedAt": "2024-01-20T14:30:00.000Z"
    }
}
```

#### 1.4 직원 FCM 토큰 관계 생성

**POST** `/admin/employee-fcm-tokens`

새로운 직원 FCM 토큰 관계를 생성합니다.

##### 요청 Body
```json
{
    "employeeId": "uuid-employee-1",
    "fcmTokenId": "uuid-fcm-token-1"
}
```

##### 응답
- **201 Created**: 생성 성공 (1.3과 동일한 형식)
- **400 Bad Request**: 잘못된 요청

#### 1.5 직원 FCM 토큰 관계 수정

**PUT** `/admin/employee-fcm-tokens/{id}`

기존 직원 FCM 토큰 관계를 수정합니다.

##### Path Parameters
- `id`: 직원 FCM 토큰 관계 ID

##### 요청 Body
```json
{
    "fcmTokenId": "uuid-new-fcm-token"
}
```

##### 응답
- **200 OK**: 수정 성공 (1.3과 동일한 형식)
- **404 Not Found**: 관계를 찾을 수 없음

#### 1.6 직원 FCM 토큰 관계 삭제

**DELETE** `/admin/employee-fcm-tokens/{id}`

특정 직원 FCM 토큰 관계를 삭제합니다.

##### Path Parameters
- `id`: 직원 FCM 토큰 관계 ID

##### 응답
```json
{
    "message": "직원 FCM 토큰 관계가 성공적으로 삭제되었습니다."
}
```

#### 1.7 직원의 모든 FCM 토큰 관계 삭제

**DELETE** `/admin/employee-fcm-tokens/employee/{employeeId}/all`

특정 직원의 모든 FCM 토큰 관계를 삭제합니다.

##### Path Parameters
- `employeeId`: 직원 ID

##### 응답
```json
{
    "message": "직원의 모든 FCM 토큰 관계가 성공적으로 삭제되었습니다."
}
```

#### 1.8 FCM 토큰 사용일 업데이트

**PUT** `/admin/employee-fcm-tokens/{employeeId}/{fcmTokenId}/usage`

FCM 토큰의 사용일을 현재 시간으로 업데이트합니다.

##### Path Parameters
- `employeeId`: 직원 ID
- `fcmTokenId`: FCM 토큰 ID

##### 응답
- **200 OK**: 업데이트 성공 (1.3과 동일한 형식)
- **404 Not Found**: 관계를 찾을 수 없음

#### 1.9 오래된 FCM 토큰 관계 정리

**DELETE** `/admin/employee-fcm-tokens/cleanup/old-tokens`

지정된 기간보다 오래된 FCM 토큰 관계를 삭제합니다.

##### Query Parameters
- `cutoffDays` (선택): 기준 일수 (기본값: 30일)

##### 응답
```json
{
    "deletedCount": 25
}
```

---

## 2. 직원 시스템 역할 관리 API

### Base Path: `/admin/employee-system-roles`

#### 2.1 직원별 시스템 역할 목록 조회 (그룹핑)

**GET** `/admin/employee-system-roles`

직원별로 그룹핑된 시스템 역할 목록을 조회합니다.

##### Query Parameters
- `employeeId` (선택): 특정 직원의 시스템 역할만 조회

##### 응답 예시
```json
{
    "employees": [
        {
            "employeeId": "uuid-employee-1",
            "employeeName": "홍길동",
            "employeeNumber": "EMP001",
            "systemRoles": [
                {
                    "id": "uuid-system-role-1",
                    "roleName": "관리자",
                    "roleCode": "ADMIN",
                    "systemName": "RMS",
                    "assignedAt": "2024-01-15T09:00:00.000Z",
                    "updatedAt": "2024-01-20T14:30:00.000Z"
                }
            ],
            "totalRoles": 1,
            "firstRoleAssignedAt": "2024-01-15T09:00:00.000Z",
            "lastRoleUpdatedAt": "2024-01-20T14:30:00.000Z"
        }
    ],
    "totalEmployees": 1,
    "totalRelations": 1
}
```

#### 2.2 직원 시스템 역할 상세 조회

**GET** `/admin/employee-system-roles/{id}`

특정 직원 시스템 역할 관계의 상세 정보를 조회합니다.

##### Path Parameters
- `id`: 직원 시스템 역할 관계 ID

##### 응답 예시
```json
{
    "id": "uuid-relation-1",
    "employeeId": "uuid-employee-1",
    "systemRoleId": "uuid-system-role-1",
    "createdAt": "2024-01-15T09:00:00.000Z",
    "updatedAt": "2024-01-20T14:30:00.000Z",
    "employee": {
        "id": "uuid-employee-1",
        "name": "홍길동",
        "employeeNumber": "EMP001"
    },
    "systemRole": {
        "id": "uuid-system-role-1",
        "roleName": "관리자",
        "roleCode": "ADMIN",
        "system": {
            "id": "uuid-system-1",
            "name": "RMS"
        }
    }
}
```

#### 2.3 직원에게 시스템 역할 할당

**POST** `/admin/employee-system-roles`

직원에게 시스템 역할을 할당합니다.

##### 요청 Body
```json
{
    "employeeId": "uuid-employee-1",
    "systemRoleId": "uuid-system-role-1"
}
```

##### 응답
- **201 Created**: 할당 성공 (2.2와 동일한 형식)
- **400 Bad Request**: 이미 할당된 역할이거나 잘못된 요청

#### 2.4 직원 시스템 역할 해제

**DELETE** `/admin/employee-system-roles/{id}`

특정 직원의 시스템 역할을 해제합니다.

##### Path Parameters
- `id`: 직원 시스템 역할 관계 ID

##### 응답
```json
{
    "message": "직원 시스템 역할이 성공적으로 해제되었습니다."
}
```

#### 2.5 직원의 모든 시스템 역할 해제

**DELETE** `/admin/employee-system-roles/employee/{employeeId}/all`

특정 직원의 모든 시스템 역할을 해제합니다.

##### Path Parameters
- `employeeId`: 직원 ID

##### 응답
```json
{
    "message": "직원의 모든 시스템 역할이 성공적으로 해제되었습니다."
}
```

---

## 3. 직원 토큰 관리 API

### Base Path: `/admin/employee-tokens`

#### 3.1 직원별 토큰 관계 목록 조회 (그룹핑)

**GET** `/admin/employee-tokens`

직원별로 그룹핑된 인증 토큰 관계 목록을 조회합니다.

##### Query Parameters
- `employeeId` (선택): 특정 직원의 토큰만 조회

##### 응답 예시
```json
{
    "employees": [
        {
            "employeeId": "uuid-employee-1",
            "employeeName": "홍길동",
            "employeeNumber": "EMP001",
            "employeeEmail": "hong@company.com",
            "tokens": [
                {
                    "id": "uuid-token-1",
                    "accessTokenMasked": "eyJhbGci...V5cCI6Ik",
                    "tokenExpiresAt": "2024-02-15T09:00:00.000Z",
                    "clientInfo": "Mozilla/5.0...",
                    "isActive": true,
                    "tokenCreatedAt": "2024-01-15T09:00:00.000Z",
                    "lastAccess": "2024-01-21T11:45:00.000Z"
                }
            ],
            "totalTokens": 1,
            "activeTokens": 1,
            "firstTokenCreatedAt": "2024-01-15T09:00:00.000Z",
            "lastTokenActivity": "2024-01-21T11:45:00.000Z"
        }
    ],
    "totalEmployees": 1,
    "totalRelations": 1
}
```

#### 3.2 직원 토큰 관계 상세 조회

**GET** `/admin/employee-tokens/{id}`

특정 직원 토큰 관계의 상세 정보를 조회합니다.

##### Path Parameters
- `id`: 직원 토큰 관계 ID

##### 응답 예시
```json
{
    "id": "uuid-relation-1",
    "employeeId": "uuid-employee-1",
    "tokenId": "uuid-token-1",
    "employee": {
        "id": "uuid-employee-1",
        "name": "홍길동",
        "employeeNumber": "EMP001",
        "email": "hong@company.com"
    },
    "token": {
        "id": "uuid-token-1",
        "accessToken": "eyJhbGci...", 
        "tokenExpiresAt": "2024-02-15T09:00:00.000Z",
        "clientInfo": "Mozilla/5.0...",
        "isActive": true
    }
}
```

#### 3.3 직원 토큰 관계 생성

**POST** `/admin/employee-tokens`

새로운 직원 토큰 관계를 생성합니다.

##### 요청 Body
```json
{
    "employeeId": "uuid-employee-1",
    "tokenId": "uuid-token-1"
}
```

##### 응답
- **201 Created**: 생성 성공 (3.2와 동일한 형식)
- **400 Bad Request**: 잘못된 요청

#### 3.4 직원 토큰 관계 수정

**PUT** `/admin/employee-tokens/{id}`

기존 직원 토큰 관계를 수정합니다.

##### Path Parameters
- `id`: 직원 토큰 관계 ID

##### 요청 Body
```json
{
    "tokenId": "uuid-new-token"
}
```

##### 응답
- **200 OK**: 수정 성공 (3.2와 동일한 형식)
- **404 Not Found**: 관계를 찾을 수 없음

#### 3.5 직원 토큰 관계 삭제

**DELETE** `/admin/employee-tokens/{id}`

특정 직원 토큰 관계를 삭제합니다.

##### Path Parameters
- `id`: 직원 토큰 관계 ID

##### 응답
```json
{
    "message": "직원 토큰 관계가 성공적으로 삭제되었습니다."
}
```

#### 3.6 토큰들과 관련된 모든 관계 삭제

**DELETE** `/admin/employee-tokens/tokens/bulk`

여러 토큰과 관련된 모든 직원 관계를 일괄 삭제합니다.

##### 요청 Body
```json
{
    "tokenIds": [
        "uuid-token-1",
        "uuid-token-2",
        "uuid-token-3"
    ]
}
```

##### 응답
```json
{
    "deletedCount": 3
}
```

---

## 공통 에러 응답

모든 API는 표준 HTTP 상태 코드를 사용하며, 에러 발생 시 다음과 같은 형식으로 응답합니다:

```json
{
    "statusCode": 400,
    "message": "에러 메시지",
    "error": "Bad Request"
}
```

### 주요 에러 코드

- **400 Bad Request**: 잘못된 요청 형식
- **401 Unauthorized**: 인증 실패
- **403 Forbidden**: 권한 부족
- **404 Not Found**: 리소스를 찾을 수 없음
- **409 Conflict**: 중복 데이터 (이미 할당된 역할 등)
- **500 Internal Server Error**: 서버 내부 오류

## 보안 고려사항

1. **HTTPS 사용**: 모든 API 호출은 HTTPS를 통해 수행되어야 합니다.
2. **토큰 마스킹**: 인증 토큰 정보는 보안을 위해 마스킹되어 제공됩니다.
3. **관리자 권한**: 모든 API는 관리자 권한이 필요합니다.
4. **Rate Limiting**: API 호출에 대한 속도 제한이 적용될 수 있습니다.

## 사용 예시

### JavaScript (fetch)
```javascript
// 직원별 FCM 토큰 목록 조회
const response = await fetch('/api/admin/employee-fcm-tokens', {
    method: 'GET',
    headers: {
        'Authorization': 'Bearer YOUR_ACCESS_TOKEN',
        'Content-Type': 'application/json',
    },
});
const data = await response.json();

// 직원에게 시스템 역할 할당
const assignRole = await fetch('/api/admin/employee-system-roles', {
    method: 'POST',
    headers: {
        'Authorization': 'Bearer YOUR_ACCESS_TOKEN',
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        employeeId: 'uuid-employee-1',
        systemRoleId: 'uuid-system-role-1'
    }),
});
```

### cURL
```bash
# 직원별 시스템 역할 조회
curl -X GET /api/admin/employee-system-roles \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json"

# 직원 토큰 관계 생성
curl -X POST /api/admin/employee-tokens \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "employeeId": "uuid-employee-1",
    "tokenId": "uuid-token-1"
  }'
```

---

**문서 버전**: 1.0  
**최종 업데이트**: 2024년  
**담당자**: Employee Management API 개발팀
