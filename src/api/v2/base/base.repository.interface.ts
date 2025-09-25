/**
 * 기본 레포지토리 인터페이스
 * 모든 레포지토리가 구현해야 하는 기본 메서드들을 정의
 */

export interface IBaseRepository<T, CreateDto, UpdateDto> {
  /**
   * 전체 목록 조회
   */
  findAll(): Promise<T[]>;

  /**
   * ID로 단일 항목 조회
   */
  findById(id: string): Promise<T>;

  /**
   * 새로운 항목 생성
   */
  create(data: CreateDto): Promise<T>;

  /**
   * 기존 항목 수정
   */
  update(id: string, data: UpdateDto): Promise<T>;

  /**
   * 항목 삭제
   */
  delete(id: string): Promise<void>;
}

/**
 * 페이지네이션을 지원하는 레포지토리 인터페이스
 */
export interface IPaginatedRepository<T> {
  /**
   * 페이지네이션된 목록 조회
   */
  findPaginated(page: number, limit: number): Promise<PaginatedResponse<T>>;
}

/**
 * 검색을 지원하는 레포지토리 인터페이스
 */
export interface ISearchableRepository<T> {
  /**
   * 검색어로 항목 검색
   */
  search(query: string): Promise<T[]>;
}

/**
 * 페이지네이션 응답 타입
 */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * API 에러 응답 타입
 */
export interface ApiErrorResponse {
  statusCode: number;
  message: string;
  error: string;
}
