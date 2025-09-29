"use client";

/**
 * 사이드바 네비게이션 컴포넌트
 */

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BuildingOfficeIcon,
  ComputerDesktopIcon,
  UserGroupIcon,
  DocumentTextIcon,
  HomeIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";

const navigation = [
  {
    name: "대시보드",
    href: "/",
    icon: HomeIcon,
  },
  {
    name: "조직 관리",
    href: "/organizations",
    icon: BuildingOfficeIcon,
  },
  {
    name: "직원 관리",
    href: "/employees",
    icon: UsersIcon,
  },
  {
    name: "시스템 관리",
    href: "/systems",
    icon: ComputerDesktopIcon,
  },
  {
    name: "시스템 역할",
    href: "/system-roles",
    icon: UserGroupIcon,
  },
  {
    name: "로그 관리",
    href: "/logs",
    icon: DocumentTextIcon,
  },
];

export const Sidebar = () => {
  const pathname = usePathname();

  return (
    <div className="flex w-64 flex-col bg-white shadow-lg">
      {/* 로고 영역 */}
      <div className="flex h-16 items-center justify-center border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-900">LSSO Admin</h1>
      </div>

      {/* 네비게이션 메뉴 */}
      <nav className="flex-1 space-y-1 p-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`
                group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors
                ${
                  isActive
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                }
              `}
            >
              <item.icon
                className={`
                  mr-3 h-5 w-5 flex-shrink-0 transition-colors
                  ${
                    isActive
                      ? "text-blue-500"
                      : "text-gray-400 group-hover:text-gray-500"
                  }
                `}
              />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* 하단 정보 */}
      <div className="border-t border-gray-200 p-4">
        <div className="text-xs text-gray-500">
          <div>LSSO 관리자 패널</div>
          <div>v2.0</div>
        </div>
      </div>
    </div>
  );
};
