import { useState, useCallback } from "react";
import {
  TokenCreateRequest,
  getAllTokens,
  getTokensBySystem,
  getTokensByUser,
  getTokenById,
  createToken,
  updateTokenStatus,
  renewToken,
  deleteToken,
} from "../api/tokens";

// 토큰 관리를 위한 커스텀 훅
export function useTokens() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // 모든 토큰 조회
  const fetchAllTokens = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getAllTokens();
      if (response.success && response.data) {
        return response.data;
      } else {
        setError(
          response.error?.message || "토큰 목록을 불러오는데 실패했습니다."
        );
        return [];
      }
    } catch (err) {
      console.error("Error fetching tokens:", err);
      setError("토큰 목록을 불러오는데 실패했습니다.");
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 시스템별 토큰 조회
  const fetchTokensBySystem = useCallback(async (systemId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getTokensBySystem(systemId);
      if (response.success && response.data) {
        return response.data;
      } else {
        setError(
          response.error?.message ||
            "시스템의 토큰 목록을 불러오는데 실패했습니다."
        );
        return [];
      }
    } catch (err) {
      console.error("Error fetching tokens by system:", err);
      setError("시스템의 토큰 목록을 불러오는데 실패했습니다.");
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 사용자별 토큰 조회
  const fetchTokensByUser = useCallback(async (userId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getTokensByUser(userId);
      if (response.success && response.data) {
        return response.data;
      } else {
        setError(
          response.error?.message ||
            "사용자의 토큰 목록을 불러오는데 실패했습니다."
        );
        return [];
      }
    } catch (err) {
      console.error("Error fetching tokens by user:", err);
      setError("사용자의 토큰 목록을 불러오는데 실패했습니다.");
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 토큰 상세 조회
  const fetchTokenById = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getTokenById(id);
      if (response.success && response.data) {
        return response.data;
      } else {
        setError(
          response.error?.message || "토큰 정보를 불러오는데 실패했습니다."
        );
        return null;
      }
    } catch (err) {
      console.error("Error fetching token:", err);
      setError("토큰 정보를 불러오는데 실패했습니다.");
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 토큰 생성
  const addToken = useCallback(async (tokenData: TokenCreateRequest) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await createToken(tokenData);
      if (response.success && response.data) {
        return response.data;
      } else {
        setError(response.error?.message || "토큰 생성에 실패했습니다.");
        return null;
      }
    } catch (err) {
      console.error("Error creating token:", err);
      setError("토큰 생성에 실패했습니다.");
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 토큰 활성화/비활성화
  const toggleTokenStatus = useCallback(
    async (id: string, isActive: boolean) => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await updateTokenStatus(id, isActive);
        if (response.success && response.data) {
          return response.data;
        } else {
          setError(response.error?.message || "토큰 상태 변경에 실패했습니다.");
          return null;
        }
      } catch (err) {
        console.error("Error updating token status:", err);
        setError("토큰 상태 변경에 실패했습니다.");
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // 토큰 갱신
  const refreshToken = useCallback(
    async (id: string, expiresInDays?: number) => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await renewToken(id, expiresInDays);
        if (response.success && response.data) {
          return response.data;
        } else {
          setError(response.error?.message || "토큰 갱신에 실패했습니다.");
          return null;
        }
      } catch (err) {
        console.error("Error renewing token:", err);
        setError("토큰 갱신에 실패했습니다.");
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // 토큰 삭제
  const removeToken = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await deleteToken(id);
      if (response.success && response.data) {
        return true;
      } else {
        setError(response.error?.message || "토큰 삭제에 실패했습니다.");
        return false;
      }
    } catch (err) {
      console.error("Error deleting token:", err);
      setError("토큰 삭제에 실패했습니다.");
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 토큰 만료 여부 확인
  const isTokenExpired = useCallback((expiresAt: string): boolean => {
    return new Date(expiresAt) < new Date();
  }, []);

  // 날짜 포맷팅
  const formatDate = useCallback(
    (dateString: string | null | undefined): string => {
      if (!dateString) return "-";
      return new Date(dateString).toLocaleString("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    },
    []
  );

  return {
    isLoading,
    error,
    setError,
    fetchAllTokens,
    fetchTokensBySystem,
    fetchTokensByUser,
    fetchTokenById,
    addToken,
    toggleTokenStatus,
    refreshToken,
    removeToken,
    isTokenExpired,
    formatDate,
  };
}
