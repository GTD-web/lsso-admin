"use client";

/**
 * 직원 관리 페이지
 * FCM 토큰, 시스템 역할, 인증 토큰을 관리합니다.
 */

import { useState } from "react";
import { AdminLayout } from "@/components/layout/admin-layout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  UserGroupIcon,
  DevicePhoneMobileIcon,
  ShieldCheckIcon,
  KeyIcon,
} from "@heroicons/react/24/outline";
import { EmployeeFcmTokenTab } from "./_components/employee-fcm-token-tab";
import { EmployeeSystemRoleTab } from "./_components/employee-system-role-tab";
import { EmployeeTokenTab } from "./_components/employee-token-tab";

type TabType = "fcm-tokens" | "system-roles" | "auth-tokens";

const tabs = [
  {
    id: "fcm-tokens" as TabType,
    name: "FCM 토큰",
    icon: DevicePhoneMobileIcon,
    description: "직원의 FCM 토큰 관계 관리",
  },
  {
    id: "system-roles" as TabType,
    name: "시스템 역할",
    icon: ShieldCheckIcon,
    description: "직원의 시스템 역할 할당 관리",
  },
  {
    id: "auth-tokens" as TabType,
    name: "인증 토큰",
    icon: KeyIcon,
    description: "직원의 인증 토큰 관계 관리",
  },
];

export default function EmployeesPage() {
  const [activeTab, setActiveTab] = useState<TabType>("fcm-tokens");

  const renderTabContent = () => {
    switch (activeTab) {
      case "fcm-tokens":
        return <EmployeeFcmTokenTab />;
      case "system-roles":
        return <EmployeeSystemRoleTab />;
      case "auth-tokens":
        return <EmployeeTokenTab />;
      default:
        return null;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* 헤더 */}
        <div className="flex items-center gap-3">
          <UserGroupIcon className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">직원 관리</h1>
            <p className="text-sm text-gray-600">
              직원의 FCM 토큰, 시스템 역할, 인증 토큰을 관리합니다.
            </p>
          </div>
        </div>

        {/* 탭 네비게이션 */}
        <Card>
          <CardHeader className="pb-0">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;

                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm ${
                        isActive
                          ? "border-blue-500 text-blue-600"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      {tab.name}
                    </button>
                  );
                })}
              </nav>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            {/* 탭 설명 */}
            <div className="px-6 py-4 bg-gray-50 border-b">
              <p className="text-sm text-gray-600">
                {tabs.find((tab) => tab.id === activeTab)?.description}
              </p>
            </div>

            {/* 탭 컨텐츠 */}
            <div className="p-6">{renderTabContent()}</div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
