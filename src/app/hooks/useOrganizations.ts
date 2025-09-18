import { useState, useCallback } from "react";
import {
  DepartmentCreateRequest,
  EmployeeCreateRequest,
  EmployeeUpdateRequest,
  PositionCreateRequest,
  RankCreateRequest,
  EmployeeAssignmentCreateRequest,
  EmployeeAssignmentUpdateRequest,
  RankPromotionRequest,
  getDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  getPositions,
  createPosition,
  updatePosition,
  deletePosition,
  getRanks,
  createRank,
  updateRank,
  deleteRank,
  createEmployeeAssignment,
  updateEmployeeAssignment,
  deleteEmployeeAssignment,
  getEmployeeAssignments,
  promoteEmployee,
  getEmployeeRankHistory,
} from "../api/organizations";

export function useOrganizations() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // ============ 부서 관리 ============

  // 부서 목록 조회
  const fetchDepartments = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      console.log("🚀 부서 목록 조회 시작");
      const response = await getDepartments();
      console.log("📥 부서 목록 응답:", response);
      console.log("✅ 부서 목록 조회 성공:", response.departments.length, "개");
      return response.departments;
    } catch (err) {
      console.error("💥 부서 목록 조회 예외:", err);
      setError("부서 목록을 불러오는데 실패했습니다.");
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 부서 상세 조회
  const fetchDepartmentById = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      console.log("🚀 부서 상세 조회 시작:", id);
      const response = await getDepartmentById(id);
      console.log("📥 부서 상세 응답:", response);
      console.log("✅ 부서 상세 조회 성공:", response);
      return response;
    } catch (err) {
      console.error("💥 부서 상세 조회 예외:", err);
      setError("부서 정보를 불러오는데 실패했습니다.");
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 부서 생성
  const addDepartment = useCallback(
    async (departmentData: DepartmentCreateRequest) => {
      setIsLoading(true);
      setError(null);
      try {
        console.log("🚀 부서 생성 시작:", departmentData);
        const response = await createDepartment(departmentData);
        console.log("📥 부서 생성 응답:", response);
        console.log("✅ 부서 생성 성공:", response);
        return response;
      } catch (err) {
        console.error("💥 부서 생성 예외:", err);
        setError("부서 생성에 실패했습니다.");
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // 부서 수정
  const editDepartment = useCallback(
    async (id: string, departmentData: DepartmentCreateRequest) => {
      setIsLoading(true);
      setError(null);
      try {
        console.log("🚀 부서 수정 시작:", id, departmentData);
        const response = await updateDepartment(id, departmentData);
        console.log("📥 부서 수정 응답:", response);
        console.log("✅ 부서 수정 성공:", response);
        return response;
      } catch (err) {
        console.error("💥 부서 수정 예외:", err);
        setError("부서 수정에 실패했습니다.");
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // 부서 삭제
  const removeDepartment = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      console.log("🚀 부서 삭제 시작:", id);
      await deleteDepartment(id);
      console.log("✅ 부서 삭제 성공:", id);
      return true;
    } catch (err) {
      console.error("💥 부서 삭제 예외:", err);
      setError("부서 삭제에 실패했습니다.");
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ============ 직원 관리 ============

  // 직원 목록 조회
  const fetchEmployees = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      console.log("🚀 직원 목록 조회 시작");
      const response = await getEmployees();
      console.log("📥 직원 목록 응답:", response);
      console.log("✅ 직원 목록 조회 성공:", response.employees.length, "개");
      return response.employees;
    } catch (err) {
      console.error("💥 직원 목록 조회 예외:", err);
      setError("직원 목록을 불러오는데 실패했습니다.");
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 직원 상세 조회
  const fetchEmployeeById = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      console.log("🚀 직원 상세 조회 시작:", id);
      const response = await getEmployeeById(id);
      console.log("📥 직원 상세 응답:", response);
      console.log("✅ 직원 상세 조회 성공:", response);
      return response;
    } catch (err) {
      console.error("💥 직원 상세 조회 예외:", err);
      setError("직원 정보를 불러오는데 실패했습니다.");
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 직원 생성
  const addEmployee = useCallback(
    async (employeeData: EmployeeCreateRequest) => {
      setIsLoading(true);
      setError(null);
      try {
        console.log("🚀 직원 생성 시작:", employeeData);
        const response = await createEmployee(employeeData);
        console.log("📥 직원 생성 응답:", response);
        console.log("✅ 직원 생성 성공:", response);
        return response;
      } catch (err) {
        console.error("💥 직원 생성 예외:", err);
        setError("직원 생성에 실패했습니다.");
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // 직원 수정
  const editEmployee = useCallback(
    async (id: string, employeeData: EmployeeUpdateRequest) => {
      setIsLoading(true);
      setError(null);
      try {
        console.log("🚀 직원 수정 시작:", id, employeeData);
        const response = await updateEmployee(id, employeeData);
        console.log("📥 직원 수정 응답:", response);
        console.log("✅ 직원 수정 성공:", response);
        return response;
      } catch (err) {
        console.error("💥 직원 수정 예외:", err);
        setError("직원 정보 수정에 실패했습니다.");
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // ============ 직책 관리 ============

  // 직책 목록 조회
  const fetchPositions = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      console.log("🚀 직책 목록 조회 시작");
      const response = await getPositions();
      console.log("📥 직책 목록 응답:", response);
      console.log("✅ 직책 목록 조회 성공:", response.length, "개");
      return response;
    } catch (err) {
      console.error("💥 직책 목록 조회 예외:", err);
      setError("직책 목록을 불러오는데 실패했습니다.");
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 직책 생성
  const addPosition = useCallback(
    async (positionData: PositionCreateRequest) => {
      setIsLoading(true);
      setError(null);
      try {
        console.log("🚀 직책 생성 시작:", positionData);
        const response = await createPosition(positionData);
        console.log("📥 직책 생성 응답:", response);
        console.log("✅ 직책 생성 성공:", response);
        return response;
      } catch (err) {
        console.error("💥 직책 생성 예외:", err);
        setError("직책 생성에 실패했습니다.");
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // 직책 수정
  const editPosition = useCallback(
    async (id: string, positionData: PositionCreateRequest) => {
      setIsLoading(true);
      setError(null);
      try {
        console.log("🚀 직책 수정 시작:", id, positionData);
        const response = await updatePosition(id, positionData);
        console.log("📥 직책 수정 응답:", response);
        console.log("✅ 직책 수정 성공:", response);
        return response;
      } catch (err) {
        console.error("💥 직책 수정 예외:", err);
        setError("직책 수정에 실패했습니다.");
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // 직책 삭제
  const removePosition = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      console.log("🚀 직책 삭제 시작:", id);
      await deletePosition(id);
      console.log("✅ 직책 삭제 성공:", id);
      return true;
    } catch (err) {
      console.error("💥 직책 삭제 예외:", err);
      setError("직책 삭제에 실패했습니다.");
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ============ 직급 관리 ============

  // 직급 목록 조회
  const fetchRanks = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      console.log("🚀 직급 목록 조회 시작");
      const response = await getRanks();
      console.log("📥 직급 목록 응답:", response);
      console.log("✅ 직급 목록 조회 성공:", response.length, "개");
      return response;
    } catch (err) {
      console.error("💥 직급 목록 조회 예외:", err);
      setError("직급 목록을 불러오는데 실패했습니다.");
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 직급 생성
  const addRank = useCallback(async (rankData: RankCreateRequest) => {
    setIsLoading(true);
    setError(null);
    try {
      console.log("🚀 직급 생성 시작:", rankData);
      const response = await createRank(rankData);
      console.log("📥 직급 생성 응답:", response);
      console.log("✅ 직급 생성 성공:", response);
      return response;
    } catch (err) {
      console.error("💥 직급 생성 예외:", err);
      setError("직급 생성에 실패했습니다.");
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 직급 수정
  const editRank = useCallback(
    async (id: string, rankData: RankCreateRequest) => {
      setIsLoading(true);
      setError(null);
      try {
        console.log("🚀 직급 수정 시작:", id, rankData);
        const response = await updateRank(id, rankData);
        console.log("📥 직급 수정 응답:", response);
        console.log("✅ 직급 수정 성공:", response);
        return response;
      } catch (err) {
        console.error("💥 직급 수정 예외:", err);
        setError("직급 수정에 실패했습니다.");
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // 직급 삭제
  const removeRank = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      console.log("🚀 직급 삭제 시작:", id);
      await deleteRank(id);
      console.log("✅ 직급 삭제 성공:", id);
      return true;
    } catch (err) {
      console.error("💥 직급 삭제 예외:", err);
      setError("직급 삭제에 실패했습니다.");
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ============ 직원 배치 관리 ============

  // 직원 배치 생성
  const addEmployeeAssignment = useCallback(
    async (assignmentData: EmployeeAssignmentCreateRequest) => {
      setIsLoading(true);
      setError(null);
      try {
        console.log("🚀 직원 배치 생성 시작:", assignmentData);
        const response = await createEmployeeAssignment(assignmentData);
        console.log("📥 직원 배치 생성 응답:", response);
        console.log("✅ 직원 배치 생성 성공:", response);
        return response;
      } catch (err) {
        console.error("💥 직원 배치 생성 예외:", err);
        setError("직원 배치에 실패했습니다.");
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // 직원 배치 수정
  const editEmployeeAssignment = useCallback(
    async (id: string, assignmentData: EmployeeAssignmentUpdateRequest) => {
      setIsLoading(true);
      setError(null);
      try {
        console.log("🚀 직원 배치 수정 시작:", id, assignmentData);
        const response = await updateEmployeeAssignment(id, assignmentData);
        console.log("📥 직원 배치 수정 응답:", response);
        console.log("✅ 직원 배치 수정 성공:", response);
        return response;
      } catch (err) {
        console.error("💥 직원 배치 수정 예외:", err);
        setError("직원 배치 수정에 실패했습니다.");
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // 직원 배치 삭제
  const removeEmployeeAssignment = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      console.log("🚀 직원 배치 삭제 시작:", id);
      await deleteEmployeeAssignment(id);
      console.log("✅ 직원 배치 삭제 성공:", id);
      return true;
    } catch (err) {
      console.error("💥 직원 배치 삭제 예외:", err);
      setError("직원 배치 해제에 실패했습니다.");
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 직원 배치 현황 조회
  const fetchEmployeeAssignments = useCallback(async (employeeId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      console.log("🚀 직원 배치 현황 조회 시작:", employeeId);
      const response = await getEmployeeAssignments(employeeId);
      console.log("📥 직원 배치 현황 응답:", response);
      console.log("✅ 직원 배치 현황 조회 성공:", response.length, "개");
      return response;
    } catch (err) {
      console.error("💥 직원 배치 현황 조회 예외:", err);
      setError("직원 배치 현황 조회에 실패했습니다.");
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ============ 직급 이력 관리 ============

  // 직원 직급 변경
  const promoteEmployeeRank = useCallback(
    async (employeeId: string, promotionData: RankPromotionRequest) => {
      setIsLoading(true);
      setError(null);
      try {
        console.log("🚀 직원 직급 변경 시작:", employeeId, promotionData);
        const response = await promoteEmployee(employeeId, promotionData);
        console.log("📥 직원 직급 변경 응답:", response);
        console.log("✅ 직원 직급 변경 성공:", response);
        return response;
      } catch (err) {
        console.error("💥 직원 직급 변경 예외:", err);
        setError("직급 변경에 실패했습니다.");
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // 직원 직급 이력 조회
  const fetchEmployeeRankHistory = useCallback(async (employeeId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      console.log("🚀 직원 직급 이력 조회 시작:", employeeId);
      const response = await getEmployeeRankHistory(employeeId);
      console.log("📥 직원 직급 이력 응답:", response);
      console.log("✅ 직원 직급 이력 조회 성공:", response.length, "개");
      return response;
    } catch (err) {
      console.error("💥 직원 직급 이력 조회 예외:", err);
      setError("직급 이력 조회에 실패했습니다.");
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    error,
    setError,
    // 부서 관리
    fetchDepartments,
    fetchDepartmentById,
    addDepartment,
    editDepartment,
    removeDepartment,
    // 직원 관리
    fetchEmployees,
    fetchEmployeeById,
    addEmployee,
    editEmployee,
    // 직책 관리
    fetchPositions,
    addPosition,
    editPosition,
    removePosition,
    // 직급 관리
    fetchRanks,
    addRank,
    editRank,
    removeRank,
    // 직원 배치 관리
    addEmployeeAssignment,
    editEmployeeAssignment,
    removeEmployeeAssignment,
    fetchEmployeeAssignments,
    // 직급 이력 관리
    promoteEmployeeRank,
    fetchEmployeeRankHistory,
  };
}
