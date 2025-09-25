"use client";

/**
 * 헤더 컴포넌트
 */

import { useState } from "react";
import { useAuth } from "@/app/_context/auth-provider";
import {
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";

export const Header = () => {
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    setIsDropdownOpen(false);
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex h-16 items-center justify-between px-6">
        {/* 왼쪽 영역 */}
        <div className="flex items-center">
          <h2 className="text-lg font-semibold text-gray-900">관리자 패널</h2>
        </div>

        {/* 오른쪽 영역 - 사용자 메뉴 */}
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center space-x-2 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <UserCircleIcon className="h-6 w-6" />
            <span>{user?.name || "사용자"}</span>
            <ChevronDownIcon className="h-4 w-4" />
          </button>

          {/* 드롭다운 메뉴 */}
          {isDropdownOpen && (
            <>
              {/* 배경 클릭 영역 */}
              <div
                className="fixed inset-0 z-10"
                onClick={() => setIsDropdownOpen(false)}
              />

              {/* 드롭다운 내용 */}
              <div className="absolute right-0 z-20 mt-2 w-48 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5">
                <div className="px-4 py-2 text-sm text-gray-500 border-b border-gray-200">
                  <div className="font-medium">{user?.name}</div>
                  <div className="text-xs">{user?.email}</div>
                  <div className="text-xs text-blue-600">{user?.employeeNumber}</div>
                </div>

                <button
                  onClick={handleLogout}
                  className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <ArrowRightOnRectangleIcon className="mr-3 h-4 w-4" />
                  로그아웃
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
