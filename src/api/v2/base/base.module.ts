/**
 * 기본 API 모듈
 * 모든 API 모듈의 기본이 되는 클래스
 */

export abstract class BaseModule {
  private static instances: Map<string, BaseModule> = new Map();

  protected constructor(protected moduleName: string) {}

  static getInstance<T extends BaseModule>(this: new () => T): T {
    const className = this.name;
    if (!BaseModule.instances.has(className)) {
      BaseModule.instances.set(className, new this());
    }
    return BaseModule.instances.get(className) as T;
  }

  protected getBaseUrl(): string {
    return process.env.NEXT_PUBLIC_API_URL || "http://localhost:3030";
  }

  protected getAuthHeaders(): HeadersInit {
    const token = this.getToken();
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  private getToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("accessToken");
  }

  protected async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.getBaseUrl()}/api${endpoint}`;

    const config: RequestInit = {
      ...options,
      headers: {
        ...this.getAuthHeaders(),
        ...options.headers,
      },
    };
    try {
      const response = await fetch(url, config);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `HTTP ${response.status}: ${response.statusText}`
        );
      }

      // 응답이 비어있는 경우 (204 No Content 등)
      const contentType = response.headers.get("content-type");
      if (!contentType?.includes("application/json")) {
        return {} as T;
      }

      return await response.json();
    } catch (error) {
      console.error(`API 요청 실패 [${config.method || "GET"} ${url}]:`, error);
      throw error;
    }
  }
}
