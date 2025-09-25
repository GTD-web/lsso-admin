"use client";

/**
 * 조직 관리 페이지
 */

import { AdminLayout } from "@/components/layout/admin-layout";
import { OrganizationProvider } from "./_context/organization-provider";
import { OrganizationTabs } from "./_section/organization-tabs";

export default function OrganizationsPage() {
  return (
    <AdminLayout>
      <OrganizationProvider>
        <div className="space-y-6">
          {/* 페이지 헤더 */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">조직 관리</h1>
            <p className="mt-1 text-sm text-gray-500">
              부서, 직원, 직책, 직급 및 배치 정보를 관리합니다.
            </p>
          </div>

          {/* 조직 관리 탭 */}
          <OrganizationTabs />
        </div>
      </OrganizationProvider>
    </AdminLayout>
  );
}
