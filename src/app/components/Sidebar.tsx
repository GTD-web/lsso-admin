"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  RiDashboardLine,
  RiUser3Line,
  RiCodeLine,
  RiKey2Line,
  RiFileList3Line,
  // RiSettings5Line,
} from "react-icons/ri";
import { IconType } from "react-icons";

interface SidebarItemProps {
  href: string;
  icon: IconType;
  label: string;
  active: boolean;
  collapsed: boolean;
}

function SidebarItem({
  href,
  icon: Icon,
  label,
  active,
  collapsed,
}: SidebarItemProps) {
  return (
    <Link href={href} className="block">
      <div
        className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
          active
            ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200"
            : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
        }`}
      >
        <Icon className={`${collapsed ? "w-6 h-6 mx-auto" : "w-5 h-5 mr-3"}`} />
        <span
          className={`text-sm font-medium whitespace-nowrap overflow-hidden transition-all duration-300 ${
            collapsed ? "w-0 opacity-0" : "w-auto opacity-100"
          }`}
        >
          {label}
        </span>
      </div>
    </Link>
  );
}

type RouteKey = "dashboard" | "users" | "systems" | "tokens" | "logs"; // | "settings";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  collapsed: boolean;
}

export function Sidebar({ isOpen, onClose, collapsed }: SidebarProps) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const isActiveRoute = (path: string) => {
    // Special case for dashboard
    if (path === "/dashboard") {
      return pathname === "/dashboard";
    }

    // For other routes, check if the first segments match
    // This handles cases like /users/[id] matching with /users
    const pathSegments = path.split("/").filter(Boolean);
    const pathnameSegments = pathname.split("/").filter(Boolean);

    // Check if the path's segments are at the beginning of the pathname's segments
    if (pathSegments.length === 0) return false;

    for (let i = 0; i < pathSegments.length; i++) {
      // If we run out of pathname segments or they don't match, return false
      if (
        i >= pathnameSegments.length ||
        pathSegments[i] !== pathnameSegments[i]
      ) {
        return false;
      }
    }

    return true;
  };

  const navItems: Record<
    RouteKey,
    { path: string; label: string; icon: IconType }
  > = {
    dashboard: { path: "/dashboard", label: "대시보드", icon: RiDashboardLine },
    users: { path: "/users", label: "사용자 관리", icon: RiUser3Line },
    systems: { path: "/systems", label: "시스템 관리", icon: RiCodeLine },
    tokens: { path: "/tokens", label: "토큰 관리", icon: RiKey2Line },
    logs: { path: "/logs", label: "로그 관리", icon: RiFileList3Line },
    // settings: { path: "/settings", label: "설정", icon: RiSettings5Line },
  };

  // Base sidebar classes
  const sidebarClasses = `
    ${isOpen ? "translate-x-0" : "-translate-x-full"}
    lg:static lg:translate-x-0 
    ${collapsed ? "lg:w-20" : "lg:w-64"} 
    transition-all duration-300 ease-in-out
    bg-white border-r border-gray-200
    dark:bg-gray-800 dark:border-gray-700
    flex flex-col
    fixed inset-y-0 left-0 z-40 
    top-16 pt-0
    overflow-hidden
  `;

  return (
    <>
      {/* Sidebar backdrop overlay (mobile only) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden top-16"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={sidebarClasses}>
        <nav className="flex-1 pt-4 pb-4 overflow-y-auto">
          <ul className="space-y-1 px-3">
            <div
              className={`flex items-center h-16 px-4 py-3 rounded-lg transition-colors `}
            ></div>
            {Object.entries(navItems).map(([key, item]) => (
              <li key={key}>
                <SidebarItem
                  href={item.path}
                  icon={item.icon}
                  label={item.label}
                  active={isActiveRoute(item.path)}
                  collapsed={collapsed}
                />
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div
            className={`text-xs text-gray-500 dark:text-gray-400 ${
              collapsed ? "text-center" : ""
            }`}
          >
            {!collapsed && <span>버전 1.0.0</span>}
          </div>
        </div>
      </aside>
    </>
  );
}
