"use client";

/**
 * 조직 관리 탭 섹션
 */

import {
  useOrganization,
  type TabType,
} from "../_context/organization-provider";
import { Card } from "@/components/ui/card";
import { DepartmentPanel } from "./panel/department/department.panel";
import { EmployeePanel } from "./panel/employee/employee.panel";
import { PositionPanel } from "./panel/position/position.panel";
import { RankPanel } from "./panel/rank/rank.panel";
import { AssignmentPanel } from "./panel/assignment/assignment.panel";

const tabs = [
  {
    id: "departments" as TabType,
    name: "부서 관리",
    description: "부서 계층구조 관리",
  },
  {
    id: "employees" as TabType,
    name: "직원 관리",
    description: "직원 정보 관리",
  },
  {
    id: "positions" as TabType,
    name: "직책 관리",
    description: "직책 및 권한 관리",
  },
  { id: "ranks" as TabType, name: "직급 관리", description: "직급 체계 관리" },
  {
    id: "assignments" as TabType,
    name: "직원 배치",
    description: "부서/직책 배치 관리",
  },
];

export const OrganizationTabs = () => {
  const { activeTab, setActiveTab } = useOrganization();

  const renderTabContent = () => {
    switch (activeTab) {
      case "departments":
        return <DepartmentPanel />;
      case "employees":
        return <EmployeePanel />;
      case "positions":
        return <PositionPanel />;
      case "ranks":
        return <RankPanel />;
      case "assignments":
        return <AssignmentPanel />;
      default:
        return <div>선택된 탭을 찾을 수 없습니다.</div>;
    }
  };

  return (
    <div className="space-y-6">
      {/* 탭 네비게이션 */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="조직 관리 탭">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap
                ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }
              `}
            >
              <div className="text-left">
                <div className="font-medium">{tab.name}</div>
                <div className="text-xs text-gray-400">{tab.description}</div>
              </div>
            </button>
          ))}
        </nav>
      </div>

      {/* 탭 콘텐츠 */}
      <Card padding="none">{renderTabContent()}</Card>
    </div>
  );
};
