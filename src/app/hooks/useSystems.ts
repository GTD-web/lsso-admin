import { useState, useCallback } from "react";
import {
  System,
  getAllSystems,
  getSystemById,
  createSystem,
  updateSystem,
  deleteSystem,
  searchSystems,
} from "../api/systems";

export function useSystems() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // 모든 시스템 조회
  const fetchAllSystems = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getAllSystems();
      console.log(response);
      if (response.success && response.data) {
        return response.data;
      } else {
        setError(
          response.error?.message || "시스템 목록을 불러오는데 실패했습니다."
        );
        return [];
      }
    } catch (err) {
      console.error("Error fetching systems:", err);
      setError("시스템 목록을 불러오는데 실패했습니다.");
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 시스템 검색
  const searchSystemsByQuery = useCallback(async (query: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await searchSystems(query);
      if (response.success && response.data) {
        return response.data;
      } else {
        setError(response.error?.message || "시스템 검색에 실패했습니다.");
        return [];
      }
    } catch (err) {
      console.error("Error searching systems:", err);
      setError("시스템 검색에 실패했습니다.");
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 시스템 상세 조회
  const fetchSystemById = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getSystemById(id);
      if (response.success && response.data) {
        return response.data;
      } else {
        setError(
          response.error?.message || "시스템 정보를 불러오는데 실패했습니다."
        );
        return null;
      }
    } catch (err) {
      console.error("Error fetching system:", err);
      setError("시스템 정보를 불러오는데 실패했습니다.");
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 시스템 생성
  const addSystem = useCallback(
    async (systemData: Omit<System, "id" | "createdAt" | "updatedAt">) => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await createSystem(systemData);
        if (response.success && response.data) {
          return response.data;
        } else {
          setError(response.error?.message || "시스템 생성에 실패했습니다.");
          return null;
        }
      } catch (err) {
        console.error("Error creating system:", err);
        setError("시스템 생성에 실패했습니다.");
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // 시스템 수정
  const editSystem = useCallback(
    async (
      id: string,
      systemData: Partial<Omit<System, "id" | "createdAt" | "updatedAt">>
    ) => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await updateSystem(id, systemData);
        if (response.success && response.data) {
          return response.data;
        } else {
          setError(response.error?.message || "시스템 수정에 실패했습니다.");
          return null;
        }
      } catch (err) {
        console.error("Error updating system:", err);
        setError("시스템 수정에 실패했습니다.");
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // 시스템 삭제
  const removeSystem = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await deleteSystem(id);
      if (response.success && response.data) {
        return true;
      } else {
        setError(response.error?.message || "시스템 삭제에 실패했습니다.");
        return false;
      }
    } catch (err) {
      console.error("Error deleting system:", err);
      setError("시스템 삭제에 실패했습니다.");
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 클라이언트 ID/시크릿 자동 생성
  const generateCredentials = useCallback(() => {
    const clientId = `client-${Math.random().toString(36).substr(2, 9)}`;
    const clientSecret = `secret-${Math.random().toString(36).substr(2, 16)}`;
    return { clientId, clientSecret };
  }, []);

  return {
    isLoading,
    error,
    setError,
    fetchAllSystems,
    searchSystemsByQuery,
    fetchSystemById,
    addSystem,
    editSystem,
    removeSystem,
    generateCredentials,
  };
}
