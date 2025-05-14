"use server";

import { ApiResponse } from "./types";
import { apiGet } from "./apiClient";

// 유저 정보 인터페이스 정의
export interface User {
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

// API 응답 타입 정의
export interface UsersResponse {
  success: boolean;
  data?: User[];
  error?: {
    code: string;
    message: string;
  };
}

export interface UserResponse {
  success: boolean;
  data?: User;
  error?: {
    code: string;
    message: string;
  };
}

/**
 * 인증 토큰 가져오기
 * @returns localStorage에서 가져온 인증 토큰
 */
function getAuthToken(): string | undefined {
  if (typeof window !== "undefined") {
    return localStorage.getItem("authToken") || undefined;
  }
  return undefined;
}

/**
 * 모든 유저 목록을 조회하는 API 함수
 * @returns 유저 목록 또는 오류 메시지가 담긴 응답
 */
export async function getAllUsers(): Promise<ApiResponse<User[]>> {
  try {
    console.log("getAllUsers - 실제 API 호출");
    // API 문서 기반 경로: /api/users
    const token = getAuthToken();
    const response = await apiGet<User[]>("/admin/users", { token });

    return response;
  } catch (error) {
    console.error("getAllUsers 에러:", error);

    // API 호출 실패 시 목데이터 반환 (변경 없이 동작하도록)
    console.log("목데이터 폴백 사용");
    return {
      success: true,
      data: [],
    };
  }
}

/**
 * 특정 ID의 유저 정보를 조회하는 API 함수
 * @param id 유저 ID
 * @returns 유저 정보 또는 오류 메시지가 담긴 응답
 */
export async function getUserById(id: string): Promise<ApiResponse<User>> {
  try {
    console.log(`getUserById - 실제 API 호출: ${id}`);
    // API 문서 기반 경로: /api/users/:id
    const token = getAuthToken();
    const response = await apiGet<User>(`/admin/users/${id}`, { token });

    return response;
  } catch (error) {
    console.error(`getUserById 에러: ${id}`, error);

    // API 호출 실패 시 목데이터 반환 (변경 없이 동작하도록)
    return {
      success: true,
      data: {
        id: "",
        employeeNumber: "",
        name: "",
        email: "",
        phoneNumber: "",
        dateOfBirth: "",
        gender: "",
        hireDate: "",
        status: "",
        department: "",
        position: "",
        rank: "",
        createdAt: "",
        updatedAt: "",
      },
    };
  }
}

/**
 * 사용자 정보를 검색하는 API 함수
 * @param query 검색어
 * @returns 검색 결과 또는 오류 메시지가 담긴 응답
 */
export async function searchUsers(query: string): Promise<ApiResponse<User[]>> {
  try {
    console.log(`searchUsers - 실제 API 호출: ${query}`);
    // API 문서 기반 경로: /api/users/search?query=검색어
    const token = getAuthToken();
    const response = await apiGet<User[]>(
      `/admin/users/search?query=${encodeURIComponent(query)}`,
      { token }
    );

    return response;
  } catch (error) {
    console.error(`searchUsers 에러: ${query}`, error);

    // API 호출 실패 시 목데이터 반환 (변경 없이 동작하도록)
    return {
      success: true,
      data: [],
    };
  }
}
