"use client";

/**
 * 조직 관리 컨텍스트 프로바이더
 */

import { createContext, useContext, useState } from "react";
import type {
  Department,
  Employee,
  Position,
  Rank,
  EmployeeAssignment,
} from "@/api/v2";

export type TabType =
  | "departments"
  | "employees"
  | "positions"
  | "ranks"
  | "assignments";

interface OrganizationContextType {
  // 현재 활성 탭
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;

  // 데이터 상태
  departments: Department[];
  setDepartments: (departments: Department[]) => void;

  employees: Employee[];
  setEmployees: (employees: Employee[]) => void;

  positions: Position[];
  setPositions: (positions: Position[]) => void;

  ranks: Rank[];
  setRanks: (ranks: Rank[]) => void;

  assignments: EmployeeAssignment[];
  setAssignments: (assignments: EmployeeAssignment[]) => void;

  // 로딩 상태
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;

  // 에러 상태
  error: string | null;
  setError: (error: string | null) => void;

  // 모달 상태
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;

  editingItem: any;
  setEditingItem: (item: any) => void;
}

const OrganizationContext = createContext<OrganizationContextType | undefined>(
  undefined
);

export const useOrganization = () => {
  const context = useContext(OrganizationContext);
  if (context === undefined) {
    throw new Error(
      "useOrganization must be used within an OrganizationProvider"
    );
  }
  return context;
};

interface OrganizationProviderProps {
  children: React.ReactNode;
}

export const OrganizationProvider = ({
  children,
}: OrganizationProviderProps) => {
  const [activeTab, setActiveTab] = useState<TabType>("departments");

  // 데이터 상태
  const [departments, setDepartments] = useState<Department[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [ranks, setRanks] = useState<Rank[]>([]);
  const [assignments, setAssignments] = useState<EmployeeAssignment[]>([]);

  // UI 상태
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  return (
    <OrganizationContext.Provider
      value={{
        // 탭 상태
        activeTab,
        setActiveTab,

        // 데이터 상태
        departments,
        setDepartments,
        employees,
        setEmployees,
        positions,
        setPositions,
        ranks,
        setRanks,
        assignments,
        setAssignments,

        // 로딩 상태
        isLoading,
        setIsLoading,

        // 에러 상태
        error,
        setError,

        // 모달 상태
        isModalOpen,
        setIsModalOpen,
        editingItem,
        setEditingItem,
      }}
    >
      {children}
    </OrganizationContext.Provider>
  );
};
