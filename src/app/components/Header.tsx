"use client";

import { useState, useEffect } from "react";
import { Button } from "./LumirMock";
import { RiMenuLine } from "react-icons/ri";
import { User } from "../api/auth";

interface HeaderProps {
  title: string;
  onToggleSidebar: () => void;
  user: User | null;
  logout: () => Promise<void>;
  isSidebarCollapsed?: boolean;
  onSidebarCollapsedChange?: (collapsed: boolean) => void;
}

export function Header({
  title,
  onToggleSidebar,
  user,
  logout,
  isSidebarCollapsed = false,
  onSidebarCollapsedChange,
}: HeaderProps) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleToggleCollapse = () => {
    if (onSidebarCollapsedChange) {
      onSidebarCollapsedChange(!isSidebarCollapsed);
    }
  };

  useEffect(() => {
    console.log("header user", user);
  }, [user]);

  return (
    <header className="bg-white border-b border-slate-200 dark:bg-slate-800 dark:border-slate-700 sticky top-0 z-50 w-full shadow-sm">
      <div className="h-16 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-1.5 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none transition-all duration-300 ease-in-out"
            aria-label="모바일 메뉴 토글"
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
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          <button
            onClick={handleToggleCollapse}
            className="hidden lg:block p-1.5 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none"
            aria-label="사이드바 접기/펼치기"
          >
            <RiMenuLine
              className={`${
                isSidebarCollapsed ? "lg:w-10" : "lg:w-52"
              } transition-all duration-300 ease-in-out`}
            />
          </button>

          <div className="flex items-center ml-8">
            <h1 className="text-xl sm:text-2xl font-bold text-blue-600 dark:text-blue-400">
              {"LSSO"}
            </h1>
            <span className="mx-3 text-gray-300 dark:text-gray-600">|</span>
            <h1 className="text-lg sm:text-xl font-medium text-gray-700 dark:text-gray-300">
              {title}
            </h1>
          </div>
        </div>
        <div className="flex items-center">
          <div className="sm:flex items-center mr-3">
            <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-2">
              {user ? (
                <span className="text-blue-600 dark:text-blue-300 font-medium text-sm">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              ) : (
                <div className="animate-pulse h-4 w-4 rounded-full bg-gray-200 dark:bg-gray-700"></div>
              )}
            </div>
            <div className="flex flex-col min-w-[120px]">
              {user ? (
                <>
                  <p className="font-medium text-sm text-gray-800 dark:text-gray-200">
                    {user.name}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {user.email}
                  </p>
                </>
              ) : (
                <>
                  <div className="animate-pulse h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded mb-1"></div>
                  <div className="animate-pulse h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </>
              )}
            </div>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={handleLogout}
            loading={isLoggingOut}
          >
            로그아웃
          </Button>
        </div>
      </div>
    </header>
  );
}
