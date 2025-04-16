# 관리자 인증 API 및 Hooks 참조

## API 함수 (auth.ts)

### `adminLogin(email: string, password: string): Promise<AdminAuthResponse>`

관리자 로그인을 처리하는 함수입니다.

**매개변수:**

- `email` (string): 관리자 이메일
- `password` (string): 관리자 비밀번호

**반환값:**

- `Promise<AdminAuthResponse>`: 인증 결과를 담은 객체

**사용 예시:**

```typescript
try {
  const response = await adminLogin("admin@example.com", "admin123");
  if (response.success) {
    console.log("로그인 성공:", response.data?.user);
  } else {
    console.error("로그인 실패:", response.error?.message);
  }
} catch (error) {
  console.error("로그인 오류:", error);
}
```

### `verifyToken(token: string): Promise<AdminAuthResponse>`

인증 토큰의 유효성을 검증하는 함수입니다.

**매개변수:**

- `token` (string): 검증할 JWT 토큰

**반환값:**

- `Promise<AdminAuthResponse>`: 검증 결과를 담은 객체

**사용 예시:**

```typescript
const token = localStorage.getItem("authToken");
if (token) {
  try {
    const response = await verifyToken(token);
    if (response.success) {
      console.log("유효한 토큰, 사용자:", response.data?.user);
    } else {
      console.log("만료된 토큰");
    }
  } catch (error) {
    console.error("토큰 검증 오류:", error);
  }
}
```

### `refreshAuthToken(refreshToken: string): Promise<AdminAuthResponse>`

리프레시 토큰을 사용하여 만료된 액세스 토큰을 갱신하는 함수입니다.

**매개변수:**

- `refreshToken` (string): 리프레시 토큰

**반환값:**

- `Promise<AdminAuthResponse>`: 갱신 결과를 담은 객체

**사용 예시:**

```typescript
const refreshToken = localStorage.getItem("refreshToken");
if (refreshToken) {
  try {
    const response = await refreshAuthToken(refreshToken);
    if (response.success) {
      localStorage.setItem("authToken", response.data?.token || "");
      console.log("토큰 갱신 성공");
    } else {
      console.log("토큰 갱신 실패");
    }
  } catch (error) {
    console.error("토큰 갱신 오류:", error);
  }
}
```

### `adminLogout(): Promise<{ success: boolean }>`

관리자 로그아웃을 처리하는 함수입니다.

**반환값:**

- `Promise<{ success: boolean }>`: 로그아웃 성공 여부

**사용 예시:**

```typescript
try {
  const result = await adminLogout();
  if (result.success) {
    localStorage.removeItem("authToken");
    localStorage.removeItem("refreshToken");
    console.log("로그아웃 성공");
  }
} catch (error) {
  console.error("로그아웃 오류:", error);
}
```

## 타입 정의

### `User`

사용자 정보를 나타내는 인터페이스입니다.

```typescript
interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}
```

### `AdminAuthResponse`

인증 API 응답의 공통 구조를 정의하는 인터페이스입니다.

```typescript
interface AdminAuthResponse {
  success: boolean;
  data?: {
    user: User;
    token: string;
    refreshToken: string;
  };
  error?: {
    code: string;
    message: string;
  };
}
```

## React Hook (`useAuth.ts`)

### `useAuth(): UseAuthReturn`

애플리케이션 전체에서 인증 상태를 관리하기 위한 커스텀 React 훅입니다.

**반환값:**

```typescript
interface UseAuthReturn {
  user: User | null; // 현재 인증된 사용자 정보
  isAuthenticated: boolean; // 인증 상태
  isLoading: boolean; // 로딩 상태
  login: (email: string, password: string) => Promise<AdminAuthResponse>; // 로그인 함수
  logout: () => Promise<void>; // 로그아웃 함수
  error: string | null; // 오류 메시지
}
```

**기능:**

- 인증 상태 초기화 및 관리
- 토큰 유효성 검증 및 갱신
- 로그인/로그아웃 처리
- 사용자 정보 관리

**사용 예시:**

```tsx
function LoginPage() {
  const { login, isAuthenticated, isLoading, error } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // isAuthenticated가 변경되면 대시보드로 리디렉션
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="error">{error}</div>}
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="이메일"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="비밀번호"
        required
      />
      <button type="submit" disabled={isLoading}>
        {isLoading ? "로그인 중..." : "로그인"}
      </button>
    </form>
  );
}
```

## Protected Route 컴포넌트

### `ProtectedRoute`

인증된 사용자만 접근할 수 있는 라우트를 생성하는 컴포넌트입니다.

**Props:**

```typescript
interface ProtectedRouteProps {
  children: ReactNode; // 보호할 컴포넌트/페이지
  requiredRole?: string; // 필요한 사용자 역할 (선택 사항)
}
```

**기능:**

- 인증되지 않은 사용자를 로그인 페이지로 리디렉션
- 특정 역할이 필요한 경우 권한 확인
- 인증 확인 중 로딩 상태 표시

**사용 예시:**

```tsx
function AdminPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <div>
        <h1>관리자 전용 페이지</h1>
        {/* 관리자만 볼 수 있는 콘텐츠 */}
      </div>
    </ProtectedRoute>
  );
}

function UserPage() {
  return (
    <ProtectedRoute>
      {" "}
      {/* 역할 제한 없이 인증만 필요 */}
      <div>
        <h1>사용자 페이지</h1>
        {/* 모든 인증된 사용자가 볼 수 있는 콘텐츠 */}
      </div>
    </ProtectedRoute>
  );
}
```
