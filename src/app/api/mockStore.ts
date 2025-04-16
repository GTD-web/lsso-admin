import { User } from "./users";
import { System } from "./systems";
import { Token } from "./tokens";

// 초기 데이터 설정
const initialUsers: User[] = [
  {
    id: "1",
    employeeNumber: "24001",
    name: "홍길동",
    email: "hong@example.com",
    phoneNumber: "010-1234-5678",
    dateOfBirth: "1990-01-15",
    gender: "MALE",
    hireDate: "2024-01-10",
    status: "재직중",
    department: "개발팀",
    position: "선임개발자",
    rank: "과장",
    createdAt: "2024-01-10T00:00:00Z",
    updatedAt: "2024-01-10T00:00:00Z",
  },
  {
    id: "2",
    employeeNumber: "24002",
    name: "김영희",
    email: "kim@example.com",
    phoneNumber: "010-2345-6789",
    dateOfBirth: "1992-05-20",
    gender: "FEMALE",
    hireDate: "2024-01-15",
    status: "재직중",
    department: "디자인팀",
    position: "UX 디자이너",
    rank: "대리",
    createdAt: "2024-01-15T00:00:00Z",
    updatedAt: "2024-01-15T00:00:00Z",
  },
  {
    id: "3",
    employeeNumber: "24003",
    name: "이철수",
    email: "lee.chulsoo@example.com",
    phoneNumber: "010-3456-7890",
    dateOfBirth: "1985-11-08",
    gender: "MALE",
    hireDate: "2024-01-20",
    status: "재직중",
    department: "마케팅팀",
    position: "마케팅 매니저",
    rank: "차장",
    createdAt: "2024-01-20T00:00:00Z",
    updatedAt: "2024-01-20T00:00:00Z",
  },
  {
    id: "4",
    employeeNumber: "24004",
    name: "박지연",
    email: "park.jiyeon@example.com",
    phoneNumber: "010-4567-8901",
    dateOfBirth: "1995-03-25",
    gender: "FEMALE",
    hireDate: "2024-02-01",
    status: "재직중",
    department: "인사팀",
    position: "HR 전문가",
    rank: "사원",
    createdAt: "2024-02-01T00:00:00Z",
    updatedAt: "2024-02-01T00:00:00Z",
  },
  {
    id: "5",
    employeeNumber: "24005",
    name: "최민준",
    email: "choi.minjun@example.com",
    phoneNumber: "010-5678-9012",
    dateOfBirth: "1988-07-12",
    gender: "MALE",
    hireDate: "2024-02-05",
    status: "재직중",
    department: "영업팀",
    position: "영업 담당자",
    rank: "과장",
    createdAt: "2024-02-05T00:00:00Z",
    updatedAt: "2024-02-05T00:00:00Z",
  },
];

const initialSystems: System[] = [
  {
    id: "1",
    name: "HR 시스템",
    description: "인사 관리 시스템",
    clientId: "hr-system-client",
    clientSecret: "hr-system-secret-123",
    allowedOrigin: ["https://hr.example.com"],
    healthCheckUrl: "https://hr.example.com/health",
    isActive: true,
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2023-01-01T00:00:00Z",
  },
  {
    id: "2",
    name: "회계 시스템",
    description: "재무 및 회계 관리 시스템",
    clientId: "accounting-client",
    clientSecret: "accounting-secret-456",
    allowedOrigin: ["https://accounting.example.com"],
    healthCheckUrl: "https://accounting.example.com/health",
    isActive: true,
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2023-01-01T00:00:00Z",
  },
  {
    id: "3",
    name: "CRM 시스템",
    description: "고객 관계 관리 시스템",
    clientId: "crm-client",
    clientSecret: "crm-secret-789",
    allowedOrigin: ["https://crm.example.com", "https://crm-admin.example.com"],
    healthCheckUrl: "https://crm.example.com/health",
    isActive: false,
    createdAt: "2023-02-15T00:00:00Z",
    updatedAt: "2023-03-10T00:00:00Z",
  },
];

const initialTokens: Token[] = [
  {
    id: "1",
    userId: "1",
    systemId: "1",
    accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    secret: "s3cr3t-k3y-1",
    tokenExpiresAt: new Date(
      Date.now() + 30 * 24 * 60 * 60 * 1000
    ).toISOString(), // 30일 후
    lastAccess: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2일 전
    isActive: true,
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10일 전
    updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    userName: "홍길동",
    userEmail: "hong@example.com",
    systemName: "HR 시스템",
  },
  {
    id: "2",
    userId: "2",
    systemId: "1",
    accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    secret: "s3cr3t-k3y-2",
    tokenExpiresAt: new Date(
      Date.now() + 15 * 24 * 60 * 60 * 1000
    ).toISOString(), // 15일 후
    lastAccess: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1일 전
    isActive: true,
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), // 15일 전
    updatedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    userName: "김영희",
    userEmail: "kim@example.com",
    systemName: "HR 시스템",
  },
  {
    id: "3",
    userId: "1",
    systemId: "2",
    accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    secret: "s3cr3t-k3y-3",
    tokenExpiresAt: new Date(
      Date.now() - 5 * 24 * 60 * 60 * 1000
    ).toISOString(), // 5일 전 (만료됨)
    lastAccess: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10일 전
    isActive: false,
    createdAt: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(), // 35일 전
    updatedAt: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(),
    userName: "홍길동",
    userEmail: "hong@example.com",
    systemName: "회계 시스템",
  },
];

/**
 * 전역으로 관리되는 Mock Store
 * 실제 API 연동처럼 데이터가 수정되고 상태가 유지됩니다.
 * 브라우저 localStorage를 사용하여 페이지 간 이동에도 데이터가 유지됩니다.
 */
class MockStore {
  private users: User[] = [];
  private systems: System[] = [];
  private tokens: Token[] = [];
  private isInitialized = false;

  constructor() {
    console.log("MockStore constructor called");
    // 브라우저 환경에서만 localStorage 사용
    this.initializeStore();
    console.log("typeof window", typeof window);
    if (typeof window !== "undefined") {
      console.log("Browser environment detected, initializing store");
      this.initializeStore();
    }
  }

  private initializeStore() {
    console.log("initializeStore called, isInitialized:", this.isInitialized);
    if (this.isInitialized) return;

    // localStorage에서 데이터 가져오기 (없으면 초기값 사용)
    const storedUsers =
      typeof window !== "undefined"
        ? localStorage.getItem("mockstore_users")
        : null;
    const storedSystems =
      typeof window !== "undefined"
        ? localStorage.getItem("mockstore_systems")
        : null;
    const storedTokens =
      typeof window !== "undefined"
        ? localStorage.getItem("mockstore_tokens")
        : null;

    console.log("Stored data from localStorage:", {
      hasUsers: !!storedUsers,
      hasSystems: !!storedSystems,
      hasTokens: !!storedTokens,
    });

    // 저장된 데이터 또는 초기값 사용
    try {
      console.log("storedUsers", storedUsers);
      console.log("initialUsers", initialUsers);

      if (storedUsers) {
        this.users = JSON.parse(storedUsers);
      } else {
        this.users = initialUsers;
      }

      if (storedSystems) {
        this.systems = JSON.parse(storedSystems);
      } else {
        this.systems = initialSystems;
      }

      if (storedTokens) {
        this.tokens = JSON.parse(storedTokens);
      } else {
        this.tokens = initialTokens;
      }

      // 각 엔티티 간의 데이터 일관성 유지
      this.validateRelationships();
    } catch (error) {
      console.error("Error loading mock data from localStorage:", error);
      // 오류 발생 시 초기값 사용
      this.users = initialUsers;
      this.systems = initialSystems;
      this.tokens = initialTokens;
    }

    // 디버그를 위한 콘솔 로그
    console.log("MockStore initialized with users:", this.users);
    console.log("MockStore initialized with systems:", this.systems);
    console.log("MockStore initialized with tokens:", this.tokens);

    this.isInitialized = true;
  }

  // 데이터를 localStorage에 저장
  private saveToStorage() {
    if (typeof window === "undefined") return;

    try {
      localStorage.setItem("mockstore_users", JSON.stringify(this.users));
      localStorage.setItem("mockstore_systems", JSON.stringify(this.systems));
      localStorage.setItem("mockstore_tokens", JSON.stringify(this.tokens));
      console.log("Data saved to localStorage");
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }
  }

  // User 관련 메소드
  getAllUsers() {
    return [...this.users];
  }

  getUserById(id: string) {
    return this.users.find((user) => user.id === id) || null;
  }

  searchUsers(query: string) {
    const lowerQuery = query.toLowerCase();
    return this.users.filter(
      (user) =>
        user.name.toLowerCase().includes(lowerQuery) ||
        user.email.toLowerCase().includes(lowerQuery) ||
        user.employeeNumber.toLowerCase().includes(lowerQuery) ||
        (user.department &&
          user.department.toLowerCase().includes(lowerQuery)) ||
        (user.position && user.position.toLowerCase().includes(lowerQuery))
    );
  }

  // System 관련 메소드
  getAllSystems() {
    return [...this.systems];
  }

  getSystemById(id: string) {
    return this.systems.find((system) => system.id === id) || null;
  }

  searchSystems(query: string) {
    const normalizedQuery = query.toLowerCase();
    return this.systems.filter(
      (system) =>
        system.name.toLowerCase().includes(normalizedQuery) ||
        system.description?.toLowerCase().includes(normalizedQuery) ||
        system.clientId.toLowerCase().includes(normalizedQuery) ||
        system.allowedOrigin.some((origin) =>
          origin.toLowerCase().includes(normalizedQuery)
        )
    );
  }

  createSystem(systemData: Omit<System, "id" | "createdAt" | "updatedAt">) {
    const newSystem: System = {
      id: Math.random().toString(36).substr(2, 9),
      ...systemData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.systems.push(newSystem);
    this.saveToStorage();
    return newSystem;
  }

  updateSystem(
    id: string,
    systemData: Partial<Omit<System, "id" | "createdAt" | "updatedAt">>
  ) {
    const systemIndex = this.systems.findIndex((s) => s.id === id);
    if (systemIndex === -1) return null;

    const updatedSystem = {
      ...this.systems[systemIndex],
      ...systemData,
      updatedAt: new Date().toISOString(),
    };

    this.systems[systemIndex] = updatedSystem;
    this.saveToStorage();
    return updatedSystem;
  }

  deleteSystem(id: string) {
    const systemIndex = this.systems.findIndex((s) => s.id === id);
    if (systemIndex === -1) return false;

    this.systems.splice(systemIndex, 1);
    // 이 시스템과 관련된 토큰도 모두 삭제
    this.tokens = this.tokens.filter((token) => token.systemId !== id);
    this.saveToStorage();
    return true;
  }

  // Token 관련 메소드
  getAllTokens() {
    console.log("getAllTokens:", this.tokens);
    return [...this.tokens];
  }

  getTokensBySystem(systemId: string) {
    return this.tokens.filter((token) => token.systemId === systemId);
  }

  getTokensByUser(userId: string) {
    return this.tokens.filter((token) => token.userId === userId);
  }

  getTokenById(id: string) {
    return this.tokens.find((token) => token.id === id) || null;
  }

  createToken(tokenData: {
    userId: string;
    systemId: string;
    expiresInDays?: number;
  }) {
    const expiresInDays = tokenData.expiresInDays || 30;
    const expiresAt = new Date(
      Date.now() + expiresInDays * 24 * 60 * 60 * 1000
    ).toISOString();

    // 사용자와 시스템 정보 가져오기
    const user = this.getUserById(tokenData.userId);
    const system = this.getSystemById(tokenData.systemId);

    if (!user || !system) return null;

    const newToken: Token = {
      id: Math.random().toString(36).substr(2, 9),
      userId: tokenData.userId,
      systemId: tokenData.systemId,
      accessToken: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...${Math.random()
        .toString(36)
        .substring(2, 15)}`,
      secret: `s3cr3t-${Math.random().toString(36).substring(2, 10)}`,
      tokenExpiresAt: expiresAt,
      lastAccess: null,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userName: user.name,
      userEmail: user.email,
      systemName: system.name,
    };

    // 토큰을 배열에 추가
    this.tokens.push(newToken);
    this.saveToStorage();
    console.log("Token created:", newToken);
    console.log("Current tokens:", this.tokens);

    return newToken;
  }

  updateTokenStatus(id: string, isActive: boolean) {
    const tokenIndex = this.tokens.findIndex((t) => t.id === id);
    if (tokenIndex === -1) return null;

    const updatedToken = {
      ...this.tokens[tokenIndex],
      isActive,
      updatedAt: new Date().toISOString(),
    };

    this.tokens[tokenIndex] = updatedToken;
    this.saveToStorage();
    return updatedToken;
  }

  renewToken(id: string, expiresInDays: number = 30) {
    const tokenIndex = this.tokens.findIndex((t) => t.id === id);
    if (tokenIndex === -1) return null;

    const expiresAt = new Date(
      Date.now() + expiresInDays * 24 * 60 * 60 * 1000
    ).toISOString();

    const updatedToken = {
      ...this.tokens[tokenIndex],
      tokenExpiresAt: expiresAt,
      accessToken: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...${Math.random()
        .toString(36)
        .substring(2, 15)}`,
      secret: `s3cr3t-${Math.random().toString(36).substring(2, 10)}`,
      updatedAt: new Date().toISOString(),
      isActive: true,
    };

    this.tokens[tokenIndex] = updatedToken;
    this.saveToStorage();
    return updatedToken;
  }

  deleteToken(id: string) {
    const tokenIndex = this.tokens.findIndex((t) => t.id === id);
    if (tokenIndex === -1) return false;

    this.tokens.splice(tokenIndex, 1);
    this.saveToStorage();
    return true;
  }

  // 테스트용: 모든 데이터 초기화
  resetStore(isInitial: boolean = false) {
    if (typeof window === "undefined") return;
    localStorage.removeItem("mockstore_users");
    localStorage.removeItem("mockstore_systems");
    localStorage.removeItem("mockstore_tokens");
    this.isInitialized = false;
    this.initializeStore();

    if (isInitial) {
      console.log("Force resetting to initial data");
      this.users = initialUsers;
      this.systems = initialSystems;
      this.tokens = initialTokens;
      this.saveToStorage();
    }
  }

  // 데이터 일관성 검증 및 복구
  private validateRelationships() {
    // 유효하지 않은 토큰 정리 (존재하지 않는 사용자나 시스템을 참조하는 토큰)
    this.tokens = this.tokens.filter((token) => {
      const userExists = this.users.some((user) => user.id === token.userId);
      const systemExists = this.systems.some(
        (system) => system.id === token.systemId
      );
      return userExists && systemExists;
    });
  }
}

// 싱글톤 인스턴스 생성 및 export
export const mockStore = new MockStore();

// // 클라이언트 사이드에서 초기화 실행
// if (typeof window !== "undefined") {
//   // 브라우저 환경에서만 실행되는 코드
//   // React가 hydration을 완료한 후 실행되도록 setTimeout 사용
//   setTimeout(() => {
//     // 이미 초기화된 store가 비어있다면 초기 데이터로 리셋
//     const users = mockStore.getAllUsers();
//     console.log("Checking if store needs reset, users count:", users.length);

//     if (users.length === 0) {
//       console.log("Store is empty, resetting to initial data");
//       mockStore.resetStore(true);
//     }
//   }, 0);
// }

export function getInitialMockData() {
  // 다른 파일에서 초기 데이터를 참조할 필요가 있을 때 사용
  return {
    users: initialUsers,
    systems: initialSystems,
    tokens: initialTokens,
  };
}
