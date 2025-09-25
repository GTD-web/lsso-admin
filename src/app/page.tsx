"use client";

/**
 * 메인 대시보드 페이지
 */

import { AdminLayout } from "@/components/layout/admin-layout";
import {
  BuildingOfficeIcon,
  ComputerDesktopIcon,
  UserGroupIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";

const quickActions = [
  {
    name: "조직 관리",
    description: "부서, 직원, 직책, 직급 및 배치 관리",
    href: "/organizations",
    icon: BuildingOfficeIcon,
    color: "bg-blue-500",
  },
  {
    name: "시스템 관리",
    description: "연동 시스템 및 API 키 관리",
    href: "/systems",
    icon: ComputerDesktopIcon,
    color: "bg-green-500",
  },
  {
    name: "시스템 역할",
    description: "시스템별 역할 및 권한 관리",
    href: "/system-roles",
    icon: UserGroupIcon,
    color: "bg-purple-500",
  },
  {
    name: "로그 관리",
    description: "시스템 로그 조회 및 분석",
    href: "/logs",
    icon: DocumentTextIcon,
    color: "bg-orange-500",
  },
];

export default function HomePage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* 페이지 헤더 */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">대시보드</h1>
          <p className="mt-1 text-sm text-gray-500">
            LSSO 시스템 관리 기능에 빠르게 접근할 수 있습니다.
          </p>
        </div>

        {/* 빠른 액션 카드들 */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action) => (
            <Link
              key={action.name}
              href={action.href}
              className="group relative overflow-hidden rounded-lg bg-white p-6 shadow-sm ring-1 ring-gray-200 transition-all hover:shadow-md hover:ring-gray-300"
            >
              <div className="flex items-center space-x-3">
                <div className={`flex-shrink-0 rounded-lg p-3 ${action.color}`}>
                  <action.icon className="h-6 w-6 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-medium text-gray-900 group-hover:text-blue-600">
                    {action.name}
                  </h3>
                  <p className="mt-1 text-xs text-gray-500">
                    {action.description}
                  </p>
                </div>
              </div>

              {/* 호버 효과 */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-blue-50 opacity-0 transition-opacity group-hover:opacity-100" />
            </Link>
          ))}
        </div>

        {/* 시스템 정보 */}
        <div className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-gray-200">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            시스템 정보
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="border-l-4 border-blue-500 pl-4">
              <div className="text-sm text-gray-500">API 버전</div>
              <div className="text-lg font-semibold text-gray-900">v2.0</div>
            </div>
            <div className="border-l-4 border-green-500 pl-4">
              <div className="text-sm text-gray-500">서비스 상태</div>
              <div className="text-lg font-semibold text-green-600">정상</div>
            </div>
            <div className="border-l-4 border-purple-500 pl-4">
              <div className="text-sm text-gray-500">관리 영역</div>
              <div className="text-lg font-semibold text-gray-900">
                4개 모듈
              </div>
            </div>
          </div>
        </div>

        {/* 최근 업데이트 */}
        <div className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-gray-200">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            최근 업데이트
          </h2>
          <ul className="space-y-3">
            <li className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <div className="text-sm text-gray-900">
                  API v2 구조로 전면 재구성
                </div>
                <div className="text-xs text-gray-500">2024년 12월</div>
              </div>
            </li>
            <li className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div>
                <div className="text-sm text-gray-900">
                  모듈별 독립적인 레포지토리 패턴 적용
                </div>
                <div className="text-xs text-gray-500">2024년 12월</div>
              </div>
            </li>
            <li className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
              <div>
                <div className="text-sm text-gray-900">통합 API 문서 제공</div>
                <div className="text-xs text-gray-500">2024년 12월</div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </AdminLayout>
  );
}
