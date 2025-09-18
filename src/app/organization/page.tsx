"use client";

import { useState, useEffect, useCallback } from "react";
import { Button, Card, TextField, Alert } from "../components/LumirMock";
import { useOrganizations } from "../hooks/useOrganizations";
import {
  Department,
  Employee,
  Position,
  Rank,
  DepartmentCreateRequest,
  EmployeeCreateRequest,
  PositionCreateRequest,
  RankCreateRequest,
} from "../api/organizations";
import AdminLayout from "../components/AdminLayout";

// 탭 타입 정의
type TabType = "departments" | "employees" | "positions" | "ranks";

// 부서 타입 옵션
const DEPARTMENT_TYPES = [
  { value: "COMPANY", label: "회사" },
  { value: "DIVISION", label: "사업부" },
  { value: "DEPARTMENT", label: "부서" },
  { value: "TEAM", label: "팀" },
] as const;

// 성별 옵션
const GENDER_OPTIONS = [
  { value: "MALE", label: "남성" },
  { value: "FEMALE", label: "여성" },
  { value: "OTHER", label: "기타" },
] as const;

export default function OrganizationPage() {
  const {
    isLoading,
    error,
    setError,
    fetchDepartments,
    addDepartment,
    editDepartment,
    removeDepartment,
    fetchEmployees,
    addEmployee,
    editEmployee,
    fetchPositions,
    addPosition,
    editPosition,
    removePosition,
    fetchRanks,
    addRank,
    editRank,
    removeRank,
  } = useOrganizations();

  // 탭 상태
  const [activeTab, setActiveTab] = useState<TabType>("departments");

  // 데이터 상태
  const [departments, setDepartments] = useState<Department[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [ranks, setRanks] = useState<Rank[]>([]);

  // 모달 상태
  const [showModal, setShowModal] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [editingItem, setEditingItem] = useState<any>(null);

  // 폼 데이터 상태
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [formData, setFormData] = useState<any>({});

  // 검색 상태
  const [searchQuery, setSearchQuery] = useState("");

  // 부서 트리 상태 관리
  const [expandedDepartments, setExpandedDepartments] = useState<Set<string>>(
    new Set()
  );
  const [parentDepartmentId, setParentDepartmentId] = useState<string | null>(
    null
  );

  // 스크롤 위치 저장
  const [scrollPosition, setScrollPosition] = useState<number>(0);

  // 부서 트리 타입 정의
  type DepartmentTreeNode = Department & { children: DepartmentTreeNode[] };

  // 부서 트리 도우미 함수들
  const buildDepartmentTree = (
    departments: Department[]
  ): DepartmentTreeNode[] => {
    console.log("🏗️ buildDepartmentTree 시작:", departments.length, "개 부서");
    console.log("🏗️ 첫 번째 부서 구조:", departments[0]);

    // 백엔드에서 이미 childDepartments를 포함하여 보내는지 확인
    const hasChildDepartments =
      departments.length > 0 && departments[0].childDepartments !== undefined;

    if (hasChildDepartments) {
      console.log("🏗️ 백엔드에서 이미 트리 구조로 데이터 제공");
      // 백엔드에서 이미 트리 구조로 제공하는 경우
      const convertToTreeNode = (dept: Department): DepartmentTreeNode => ({
        ...dept,
        children: (dept.childDepartments || []).map(convertToTreeNode),
      });

      // 최상위 부서만 필터링 (parentDepartmentId가 없는 부서들)
      const roots = departments
        .filter((dept) => !dept.parentDepartmentId)
        .map(convertToTreeNode);

      console.log("🏗️ 백엔드 트리 구조 변환 완료:", {
        totalDepartments: departments.length,
        rootDepartments: roots.length,
        roots: roots.map((r) => ({
          id: r.id,
          name: r.departmentName,
          children: r.children.length,
        })),
      });

      return roots;
    } else {
      console.log("🏗️ 플랫 구조에서 트리 구조로 변환");
      // 기존 로직: 플랫 구조에서 트리 구조로 변환
      const departmentMap = new Map<string, DepartmentTreeNode>();
      const roots: DepartmentTreeNode[] = [];

      // 모든 부서를 맵에 추가하고 children 배열 초기화
      departments.forEach((dept) => {
        departmentMap.set(dept.id, { ...dept, children: [] });
      });

      // 계층구조 구성
      departments.forEach((dept) => {
        if (dept.parentDepartmentId) {
          const parent = departmentMap.get(dept.parentDepartmentId);
          const child = departmentMap.get(dept.id);
          if (parent && child) {
            parent.children.push(child);
          }
        } else {
          const rootDept = departmentMap.get(dept.id);
          if (rootDept) {
            roots.push(rootDept);
          }
        }
      });

      console.log("🏗️ 플랫 구조 트리 변환 완성:", {
        totalDepartments: departments.length,
        rootDepartments: roots.length,
        roots: roots.map((r) => ({
          id: r.id,
          name: r.departmentName,
          children: r.children.length,
        })),
      });

      return roots;
    }
  };

  const toggleDepartmentExpansion = (departmentId: string) => {
    // 현재 스크롤 위치 저장
    setScrollPosition(window.scrollY);

    const newExpanded = new Set(expandedDepartments);
    if (newExpanded.has(departmentId)) {
      newExpanded.delete(departmentId);
    } else {
      newExpanded.add(departmentId);
    }
    setExpandedDepartments(newExpanded);
  };

  const openAddSubdepartmentModal = (parentId: string) => {
    setParentDepartmentId(parentId);
    setEditingItem(null);
    setFormData({ parentDepartmentId: parentId });
    setShowModal(true);
  };

  // 부서 트리 노드 렌더링 컴포넌트
  const DepartmentTreeNode = ({
    department,
    level = 0,
  }: {
    department: DepartmentTreeNode;
    level?: number;
  }) => {
    const hasChildren = department.children && department.children.length > 0;
    const isExpanded = expandedDepartments.has(department.id);
    const indentStyle = { paddingLeft: `${level * 24 + 24}px` }; // 24px씩 들여쓰기

    return (
      <>
        <tr className="hover:bg-gray-50">
          <td
            className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
            style={indentStyle}
          >
            <div className="flex items-center">
              {hasChildren && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleDepartmentExpansion(department.id);
                  }}
                  className="mr-2 p-1 hover:bg-gray-200 rounded"
                >
                  {isExpanded ? (
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  )}
                </button>
              )}
              {!hasChildren && <div className="w-6 mr-2"></div>}
              <span>{department.departmentName}</span>
            </div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            {department.departmentCode}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            {DEPARTMENT_TYPES.find((t) => t.value === department.type)?.label ||
              department.type}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            {department.order || "-"}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
            <div className="flex space-x-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => openAddSubdepartmentModal(department.id)}
                className="text-blue-600 hover:text-blue-900"
              >
                하위부서
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => openModal(department)}
                className="text-indigo-600 hover:text-indigo-900"
              >
                수정
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleDelete(department.id)}
                className="text-red-600 hover:text-red-900"
              >
                삭제
              </Button>
            </div>
          </td>
        </tr>
        {hasChildren &&
          isExpanded &&
          department.children.map((child) => (
            <DepartmentTreeNode
              key={child.id}
              department={child}
              level={level + 1}
            />
          ))}
      </>
    );
  };

  const loadData = useCallback(async () => {
    try {
      switch (activeTab) {
        case "departments":
          console.log("📊 부서 데이터 로딩 시작");
          const deptData = await fetchDepartments();
          console.log("📊 부서 데이터 로딩 완료:", deptData.length, "개");
          setDepartments(deptData);
          break;
        case "employees":
          const empData = await fetchEmployees();
          setEmployees(empData);
          break;
        case "positions":
          const posData = await fetchPositions();
          setPositions(posData);
          break;
        case "ranks":
          const rankData = await fetchRanks();
          setRanks(rankData);
          break;
      }
    } catch (err) {
      console.error("Error loading data:", err);
    }
  }, [activeTab, fetchDepartments, fetchEmployees, fetchPositions, fetchRanks]);

  // 초기 데이터 로딩
  useEffect(() => {
    loadData();
  }, [loadData]);

  // 부서 트리 상태 변경 시 스크롤 위치 복원
  useEffect(() => {
    if (scrollPosition > 0) {
      // 짧은 지연 후 스크롤 위치 복원 (DOM 업데이트 대기)
      const timer = setTimeout(() => {
        window.scrollTo(0, scrollPosition);
        setScrollPosition(0); // 복원 후 초기화
      }, 10);

      return () => clearTimeout(timer);
    }
  }, [expandedDepartments, scrollPosition]);

  // 최상위 부서 추가 모달 열기
  const openAddTopLevelDepartmentModal = () => {
    setEditingItem(null);
    setFormData({
      departmentName: "",
      departmentCode: "",
      type: "DEPARTMENT",
      parentDepartmentId: null,
      order: 0,
    });
    setParentDepartmentId(null);
    setShowModal(true);
  };

  // 모달 열기
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const openModal = (item?: any) => {
    setEditingItem(item);

    if (item) {
      // 수정 모드
      setFormData({ ...item });
      setParentDepartmentId(null); // 수정 시에는 부모 부서 ID 초기화
    } else {
      // 생성 모드
      switch (activeTab) {
        case "departments":
          setFormData({
            departmentName: "",
            departmentCode: "",
            type: "DEPARTMENT",
            parentDepartmentId: parentDepartmentId || null,
            order: 0,
          });
          break;
        case "employees":
          setFormData({
            employeeNumber: "",
            name: "",
            email: "",
            phoneNumber: "",
            dateOfBirth: "",
            gender: "MALE",
            hireDate: "",
            currentRankId: "",
          });
          break;
        case "positions":
          setFormData({
            positionTitle: "",
            positionCode: "",
            level: 1,
            hasManagementAuthority: false,
          });
          break;
        case "ranks":
          setFormData({
            rankName: "",
            rankCode: "",
            level: 1,
          });
          break;
      }
    }
    setShowModal(true);
  };

  // 모달 닫기
  const closeModal = () => {
    setShowModal(false);
    setEditingItem(null);
    setFormData({});
    setParentDepartmentId(null); // 부모 부서 ID 초기화
  };

  // 폼 입력 처리
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;

    console.log("📝 Input 변경:", { name, value, elementType: type });

    if (type === "checkbox") {
      const target = e.target as HTMLInputElement;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setFormData((prev: any) => ({ ...prev, [name]: target.checked }));
    } else if (type === "number") {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setFormData((prev: any) => ({ ...prev, [name]: parseInt(value) || 0 }));
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setFormData((prev: any) => ({ ...prev, [name]: value }));
    }
  };

  // 폼 제출 처리
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    console.log("🚀 handleSubmit 시작 - activeTab:", activeTab);
    console.log("📝 현재 formData:", formData);
    console.log("✏️ editingItem:", editingItem);

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let result: any = null;

      if (editingItem) {
        // 수정
        switch (activeTab) {
          case "departments":
            console.log("🔄 부서 수정 요청 데이터:", formData);

            // 부서 수정 데이터 정리
            const updateDepartmentData: DepartmentCreateRequest = {
              departmentName: formData.departmentName,
              departmentCode: formData.departmentCode,
              type: formData.type || "DEPARTMENT", // 기본값 설정
              parentDepartmentId: formData.parentDepartmentId || undefined, // null/빈문자열 -> undefined
              order: formData.order || 0,
            };

            console.log("🧹 정리된 부서 수정 데이터:", updateDepartmentData);
            result = await editDepartment(editingItem.id, updateDepartmentData);
            if (result) {
              setDepartments((prev) =>
                prev.map((item) => (item.id === editingItem.id ? result : item))
              );
            }
            break;
          case "employees":
            console.log("🔄 직원 수정 요청 데이터:", formData);

            // 직원 수정 데이터 정리
            const updateEmployeeData = {
              name: formData.name,
              email: formData.email,
              phoneNumber: formData.phoneNumber || undefined, // 빈 문자열 -> undefined
              status: formData.status || undefined, // 빈 문자열 -> undefined
              terminationDate: formData.terminationDate || undefined, // 빈 문자열 -> undefined
            };

            console.log("🧹 정리된 직원 수정 데이터:", updateEmployeeData);
            result = await editEmployee(editingItem.id, updateEmployeeData);
            if (result) {
              setEmployees((prev) =>
                prev.map((item) => (item.id === editingItem.id ? result : item))
              );
            }
            break;
          case "positions":
            console.log("🔄 직책 수정 요청 데이터:", formData);

            // 직책 수정 데이터 정리
            const updatePositionData: PositionCreateRequest = {
              positionTitle: formData.positionTitle,
              positionCode: formData.positionCode,
              level: formData.level || 0,
              hasManagementAuthority: formData.hasManagementAuthority || false,
            };

            console.log("🧹 정리된 직책 수정 데이터:", updatePositionData);
            result = await editPosition(editingItem.id, updatePositionData);
            if (result) {
              setPositions((prev) =>
                prev.map((item) => (item.id === editingItem.id ? result : item))
              );
            }
            break;
          case "ranks":
            console.log("🔄 직급 수정 요청 데이터:", formData);

            // 직급 수정 데이터 정리
            const updateRankData: RankCreateRequest = {
              rankName: formData.rankName,
              rankCode: formData.rankCode,
              level: formData.level || 0,
            };

            console.log("🧹 정리된 직급 수정 데이터:", updateRankData);
            result = await editRank(editingItem.id, updateRankData);
            if (result) {
              setRanks((prev) =>
                prev.map((item) => (item.id === editingItem.id ? result : item))
              );
            }
            break;
        }
      } else {
        // 생성
        switch (activeTab) {
          case "departments":
            console.log("➕ 부서 생성 요청 데이터:", formData);
            console.log("🏷️ parentDepartmentId:", parentDepartmentId);

            // 부서 생성 데이터 정리
            const departmentData: DepartmentCreateRequest = {
              departmentName: formData.departmentName,
              departmentCode: formData.departmentCode,
              type: formData.type || "DEPARTMENT", // 기본값 설정
              parentDepartmentId: formData.parentDepartmentId || undefined, // null/빈문자열 -> undefined
              order: formData.order || 0,
            };

            console.log("🧹 정리된 부서 생성 데이터:", departmentData);
            result = await addDepartment(departmentData);
            if (result) {
              setDepartments((prev) => [...prev, result]);
            }
            break;
          case "employees":
            console.log("➕ 직원 생성 요청 데이터:", formData);

            // 직원 생성 데이터 정리
            const employeeData: EmployeeCreateRequest = {
              employeeNumber: formData.employeeNumber,
              name: formData.name,
              email: formData.email,
              phoneNumber: formData.phoneNumber || undefined, // 빈 문자열 -> undefined
              dateOfBirth: formData.dateOfBirth || undefined, // 빈 문자열 -> undefined
              gender: formData.gender || undefined, // 빈 문자열 -> undefined
              hireDate: formData.hireDate,
              currentRankId: formData.currentRankId || undefined, // 빈 문자열 -> undefined (중요!)
            };

            console.log("🧹 정리된 직원 생성 데이터:", employeeData);
            result = await addEmployee(employeeData);
            if (result) {
              setEmployees((prev) => [...prev, result]);
            }
            break;
          case "positions":
            console.log("➕ 직책 생성 요청 데이터:", formData);

            // 직책 생성 데이터 정리
            const positionData: PositionCreateRequest = {
              positionTitle: formData.positionTitle,
              positionCode: formData.positionCode,
              level: formData.level || 0,
              hasManagementAuthority: formData.hasManagementAuthority || false,
            };

            console.log("🧹 정리된 직책 생성 데이터:", positionData);
            result = await addPosition(positionData);
            if (result) {
              setPositions((prev) => [...prev, result]);
            }
            break;
          case "ranks":
            console.log("➕ 직급 생성 요청 데이터:", formData);

            // 직급 생성 데이터 정리
            const rankData: RankCreateRequest = {
              rankName: formData.rankName,
              rankCode: formData.rankCode,
              level: formData.level || 0,
            };

            console.log("🧹 정리된 직급 생성 데이터:", rankData);
            result = await addRank(rankData);
            if (result) {
              setRanks((prev) => [...prev, result]);
            }
            break;
        }
      }

      if (result) {
        closeModal();
      }
    } catch (err) {
      console.error("Error saving data:", err);
    }
  };

  // 삭제 처리
  const handleDelete = async (id: string) => {
    if (!window.confirm("정말로 삭제하시겠습니까?")) {
      return;
    }

    try {
      let success = false;

      switch (activeTab) {
        case "departments":
          success = await removeDepartment(id);
          if (success) {
            setDepartments((prev) => prev.filter((item) => item.id !== id));
          }
          break;
        case "positions":
          success = await removePosition(id);
          if (success) {
            setPositions((prev) => prev.filter((item) => item.id !== id));
          }
          break;
        case "ranks":
          success = await removeRank(id);
          if (success) {
            setRanks((prev) => prev.filter((item) => item.id !== id));
          }
          break;
      }
    } catch (err) {
      console.error("Error deleting item:", err);
    }
  };

  // 검색 필터링 - 부서는 트리 구조를 위해 별도 처리
  const getFilteredData = () => {
    const query = searchQuery.toLowerCase();

    switch (activeTab) {
      case "departments":
        // 부서는 트리 구조이므로 여기서는 빈 배열 반환 (별도 로직 사용)
        return [];
      case "employees":
        return (employees || []).filter(
          (emp) =>
            emp.name.toLowerCase().includes(query) ||
            emp.employeeNumber.toLowerCase().includes(query) ||
            emp.email.toLowerCase().includes(query)
        );
      case "positions":
        return (positions || []).filter(
          (pos) =>
            pos.positionTitle.toLowerCase().includes(query) ||
            pos.positionCode.toLowerCase().includes(query)
        );
      case "ranks":
        return (ranks || []).filter(
          (rank) =>
            rank.rankName.toLowerCase().includes(query) ||
            rank.rankCode.toLowerCase().includes(query)
        );
      default:
        return [];
    }
  };

  // 부서 트리에서 검색하는 재귀 함수
  const searchInDepartmentTree = (
    departments: DepartmentTreeNode[],
    query: string
  ): DepartmentTreeNode[] => {
    const results: DepartmentTreeNode[] = [];

    for (const dept of departments) {
      const matches =
        dept.departmentName.toLowerCase().includes(query) ||
        dept.departmentCode.toLowerCase().includes(query);

      // 하위 부서에서 검색
      const childMatches = dept.children
        ? searchInDepartmentTree(dept.children, query)
        : [];

      if (matches || childMatches.length > 0) {
        // 현재 부서가 매칭되거나 하위 부서에 매칭이 있으면 포함
        results.push({
          ...dept,
          children:
            childMatches.length > 0
              ? childMatches
              : matches
              ? dept.children
              : [],
        });
      }
    }

    return results;
  };

  // 플랫 구조에서 검색하는 함수
  const searchInFlatDepartments = (
    departments: Department[],
    query: string
  ): DepartmentTreeNode[] => {
    const filtered = departments.filter(
      (dept) =>
        dept.departmentName.toLowerCase().includes(query) ||
        dept.departmentCode.toLowerCase().includes(query)
    );

    return filtered.map((dept) => ({
      ...dept,
      children: [] as DepartmentTreeNode[],
    }));
  };

  // 부서 트리 필터링 (검색어가 있을 때)
  const getFilteredDepartmentTree = (): DepartmentTreeNode[] => {
    console.log("🌳 getFilteredDepartmentTree 호출:", {
      departments: departments.length,
      searchQuery,
    });

    const query = searchQuery.toLowerCase();
    if (!query) {
      const tree = buildDepartmentTree(departments);
      console.log("🌳 트리 구조 생성:", tree.length, "개 루트 부서");
      return tree;
    }

    console.log("🔍 검색 모드:", query);

    // 백엔드에서 이미 트리 구조로 제공하는지 확인
    const hasChildDepartments =
      departments.length > 0 && departments[0].childDepartments !== undefined;

    let searchResults: DepartmentTreeNode[];

    if (hasChildDepartments) {
      // 트리 구조에서 검색
      const tree = buildDepartmentTree(departments);
      searchResults = searchInDepartmentTree(tree, query);
      console.log("🔍 트리 구조 검색 결과:", searchResults.length, "개 매칭");
    } else {
      // 플랫 구조에서 검색
      searchResults = searchInFlatDepartments(departments, query);
      console.log("🔍 플랫 구조 검색 결과:", searchResults.length, "개 매칭");
    }

    return searchResults;
  };

  // 탭 렌더링
  const renderTabs = () => (
    <div className="border-b border-gray-200 mb-6">
      <nav className="-mb-px flex space-x-8">
        {[
          { key: "departments", label: "부서 관리" },
          { key: "employees", label: "직원 관리" },
          { key: "positions", label: "직책 관리" },
          { key: "ranks", label: "직급 관리" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as TabType)}
            className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === tab.key
                ? "border-indigo-500 text-indigo-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );

  // 테이블 헤더 렌더링
  const renderTableHeader = () => {
    switch (activeTab) {
      case "departments":
        return (
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              부서명
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              부서 코드
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              유형
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              순서
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              액션
            </th>
          </tr>
        );
      case "employees":
        return (
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              사번
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              이름
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              이메일
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              입사일
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              상태
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              액션
            </th>
          </tr>
        );
      case "positions":
        return (
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              직책명
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              직책 코드
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              레벨
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              관리 권한
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              액션
            </th>
          </tr>
        );
      case "ranks":
        return (
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              직급명
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              직급 코드
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              레벨
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              액션
            </th>
          </tr>
        );
      default:
        return null;
    }
  };

  // 테이블 행 렌더링 (부서 제외 - 부서는 트리 구조 사용)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderTableRow = (item: any) => {
    switch (activeTab) {
      case "departments":
        // 부서는 트리 구조로 별도 렌더링되므로 여기서는 null 반환
        return null;
      case "employees":
        return (
          <tr key={item.id} className="hover:bg-gray-50">
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {item.employeeNumber}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              {item.name}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {item.email}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {item.hireDate}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              <span
                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  item.status === "재직중"
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {item.status || "미설정"}
              </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <Button
                size="sm"
                variant="outline"
                onClick={() => openModal(item)}
              >
                수정
              </Button>
            </td>
          </tr>
        );
      case "positions":
        return (
          <tr key={item.id} className="hover:bg-gray-50">
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              {item.positionTitle}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {item.positionCode}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {item.level}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              <span
                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  item.hasManagementAuthority
                    ? "bg-blue-100 text-blue-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {item.hasManagementAuthority ? "있음" : "없음"}
              </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <Button
                size="sm"
                variant="outline"
                onClick={() => openModal(item)}
                className="mr-2"
              >
                수정
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleDelete(item.id)}
              >
                삭제
              </Button>
            </td>
          </tr>
        );
      case "ranks":
        return (
          <tr key={item.id} className="hover:bg-gray-50">
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              {item.rankName}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {item.rankCode}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {item.level}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <Button
                size="sm"
                variant="outline"
                onClick={() => openModal(item)}
                className="mr-2"
              >
                수정
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleDelete(item.id)}
              >
                삭제
              </Button>
            </td>
          </tr>
        );
      default:
        return null;
    }
  };

  // 모달 폼 렌더링
  const renderModalForm = () => {
    switch (activeTab) {
      case "departments":
        return (
          <>
            <TextField
              label="부서명"
              name="departmentName"
              value={formData.departmentName || ""}
              onChange={handleInputChange}
              required
              fullWidth
            />
            <TextField
              label="부서 코드"
              name="departmentCode"
              value={formData.departmentCode || ""}
              onChange={handleInputChange}
              required
              fullWidth
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                부서 유형
              </label>
              <select
                name="type"
                value={formData.type || "DEPARTMENT"}
                onChange={handleInputChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                required
              >
                {DEPARTMENT_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                상위 부서
              </label>
              <select
                name="parentDepartmentId"
                value={formData.parentDepartmentId || ""}
                onChange={handleInputChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="">선택 안함</option>
                {(departments || []).map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.departmentName}
                  </option>
                ))}
              </select>
            </div>
            <TextField
              label="순서"
              name="order"
              type="number"
              value={formData.order || 0}
              onChange={handleInputChange}
              fullWidth
            />
          </>
        );
      case "employees":
        return (
          <>
            <TextField
              label="사번"
              name="employeeNumber"
              value={formData.employeeNumber || ""}
              onChange={handleInputChange}
              required
              fullWidth
            />
            <TextField
              label="이름"
              name="name"
              value={formData.name || ""}
              onChange={handleInputChange}
              required
              fullWidth
            />
            <TextField
              label="이메일"
              name="email"
              type="email"
              value={formData.email || ""}
              onChange={handleInputChange}
              required
              fullWidth
            />
            <TextField
              label="전화번호"
              name="phoneNumber"
              value={formData.phoneNumber || ""}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              label="생년월일"
              name="dateOfBirth"
              type="date"
              value={formData.dateOfBirth || ""}
              onChange={handleInputChange}
              fullWidth
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                성별
              </label>
              <select
                name="gender"
                value={formData.gender || "MALE"}
                onChange={handleInputChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
              >
                {GENDER_OPTIONS.map((gender) => (
                  <option key={gender.value} value={gender.value}>
                    {gender.label}
                  </option>
                ))}
              </select>
            </div>
            <TextField
              label="입사일"
              name="hireDate"
              type="date"
              value={formData.hireDate || ""}
              onChange={handleInputChange}
              required
              fullWidth
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                직급
              </label>
              <select
                name="currentRankId"
                value={formData.currentRankId || ""}
                onChange={handleInputChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="">선택 안함</option>
                {(ranks || []).map((rank) => (
                  <option key={rank.id} value={rank.id}>
                    {rank.rankName}
                  </option>
                ))}
              </select>
            </div>
          </>
        );
      case "positions":
        return (
          <>
            <TextField
              label="직책명"
              name="positionTitle"
              value={formData.positionTitle || ""}
              onChange={handleInputChange}
              required
              fullWidth
            />
            <TextField
              label="직책 코드"
              name="positionCode"
              value={formData.positionCode || ""}
              onChange={handleInputChange}
              required
              fullWidth
            />
            <TextField
              label="레벨"
              name="level"
              type="number"
              value={formData.level || 1}
              onChange={handleInputChange}
              required
              fullWidth
            />
            <div className="flex items-center">
              <input
                type="checkbox"
                id="hasManagementAuthority"
                name="hasManagementAuthority"
                checked={formData.hasManagementAuthority || false}
                onChange={handleInputChange}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label
                htmlFor="hasManagementAuthority"
                className="ml-2 block text-sm text-gray-900"
              >
                관리 권한 있음
              </label>
            </div>
          </>
        );
      case "ranks":
        return (
          <>
            <TextField
              label="직급명"
              name="rankName"
              value={formData.rankName || ""}
              onChange={handleInputChange}
              required
              fullWidth
            />
            <TextField
              label="직급 코드"
              name="rankCode"
              value={formData.rankCode || ""}
              onChange={handleInputChange}
              required
              fullWidth
            />
            <TextField
              label="레벨"
              name="level"
              type="number"
              value={formData.level || 1}
              onChange={handleInputChange}
              required
              fullWidth
            />
          </>
        );
      default:
        return null;
    }
  };

  const filteredData = getFilteredData();

  return (
    <AdminLayout title="조직 관리">
      <div className="p-4 lg:p-8 bg-slate-50 dark:bg-slate-900 overflow-auto">
        <div className="max-w-7xl mx-auto">
          {/* 탭 */}
          {renderTabs()}

          {/* 에러 메시지 */}
          {error && (
            <Alert variant="error" className="mb-6">
              {error}
            </Alert>
          )}

          {/* 검색 및 액션 영역 */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <Button
                onClick={() =>
                  activeTab === "departments"
                    ? openAddTopLevelDepartmentModal()
                    : openModal()
                }
              >
                {activeTab === "departments" && "최상위 부서 추가"}
                {activeTab === "employees" && "직원 추가"}
                {activeTab === "positions" && "직책 추가"}
                {activeTab === "ranks" && "직급 추가"}
              </Button>
            </div>

            <div className="flex">
              <TextField
                placeholder="검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="min-w-[200px] md:min-w-[260px]"
              />
            </div>
          </div>

          {/* 테이블 */}
          <Card className="overflow-hidden">
            <div className="relative overflow-x-auto">
              {isLoading ? (
                <div className="flex justify-center items-center py-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                  <p className="ml-3 text-gray-600">데이터를 불러오는 중...</p>
                </div>
              ) : (
                  activeTab === "departments"
                    ? getFilteredDepartmentTree().length === 0
                    : filteredData.length === 0
                ) ? (
                <div className="text-center py-16">
                  <p className="text-gray-500">데이터가 없습니다.</p>
                </div>
              ) : (
                <div style={{ scrollBehavior: "auto" }}>
                  <table
                    className="min-w-full divide-y divide-gray-200"
                    style={{ tableLayout: "fixed" }}
                  >
                    <thead className="bg-gray-50">{renderTableHeader()}</thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {activeTab === "departments"
                        ? // 부서는 트리 구조로 렌더링
                          getFilteredDepartmentTree().map((department) => (
                            <DepartmentTreeNode
                              key={department.id}
                              department={department}
                            />
                          ))
                        : // 다른 탭은 기존 방식으로 렌더링
                          filteredData.map((item) => renderTableRow(item))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </Card>

          {/* 모달 */}
          {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">
                    {editingItem
                      ? "수정"
                      : activeTab === "departments" && parentDepartmentId
                      ? "하위 부서 추가"
                      : activeTab === "departments"
                      ? "최상위 부서 추가"
                      : "추가"}
                  </h2>
                  <button
                    onClick={closeModal}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {renderModalForm()}
                  <div className="flex justify-end space-x-2 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={closeModal}
                    >
                      취소
                    </Button>
                    <Button type="submit" loading={isLoading}>
                      저장
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
