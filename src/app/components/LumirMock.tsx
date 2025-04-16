"use client";

import React, { ReactNode } from "react";

// Mock implementations for SDK components

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  children: ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  children,
  className = "",
  ...props
}: ButtonProps) {
  const baseClass =
    "inline-flex items-center justify-center rounded font-medium transition-colors";
  let variantClass = "";

  if (variant === "primary") {
    variantClass = "bg-indigo-600 text-white hover:bg-indigo-700";
  } else if (variant === "outline") {
    variantClass =
      "border border-indigo-600 text-indigo-600 hover:bg-indigo-50";
  } else if (variant === "ghost") {
    variantClass = "text-indigo-600 hover:bg-indigo-50";
  }

  const sizeClass =
    size === "sm"
      ? "px-2 py-1 text-sm"
      : size === "lg"
      ? "px-6 py-3 text-lg"
      : "px-4 py-2";

  return (
    <button
      className={`${baseClass} ${variantClass} ${sizeClass} ${className}`}
      disabled={loading}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      )}
      {children}
    </button>
  );
}

export interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className = "" }: CardProps) {
  return (
    <div className={`bg-white rounded-lg shadow ${className}`}>{children}</div>
  );
}

export interface TextFieldProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

export function TextField({
  label,
  error,
  fullWidth = false,
  className = "",
  ...props
}: TextFieldProps) {
  return (
    <div className={`${fullWidth ? "w-full" : ""}`}>
      {label && (
        <label className="block mb-1 font-medium text-gray-700">{label}</label>
      )}
      <input
        className={`border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
          error ? "border-red-500" : "border-gray-300"
        } ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}

export interface AlertProps {
  children: ReactNode;
  variant?: "error" | "success" | "warning" | "info";
  className?: string;
}

export function Alert({
  children,
  variant = "info",
  className = "",
}: AlertProps) {
  const variantClass =
    variant === "error"
      ? "bg-red-50 text-red-700 border-red-200"
      : variant === "success"
      ? "bg-green-50 text-green-700 border-green-200"
      : variant === "warning"
      ? "bg-yellow-50 text-yellow-700 border-yellow-200"
      : "bg-blue-50 text-blue-700 border-blue-200";

  return (
    <div className={`p-4 rounded border ${variantClass} ${className}`}>
      {children}
    </div>
  );
}

export interface SidebarItemProps {
  icon?: ReactNode;
  label: string;
  href?: string;
  active?: boolean;
  subItems?: Array<{ label: string; href: string; badge?: string }>;
}

export function SidebarItem({
  icon,
  label,
  href,
  active = false,
  subItems,
}: SidebarItemProps) {
  const [expanded, setExpanded] = React.useState(false);

  return (
    <div>
      <div
        onClick={() => {
          if (subItems) {
            setExpanded(!expanded);
          } else if (href) {
            window.location.href = href;
          }
        }}
        className={`flex items-center p-2 rounded-md cursor-pointer ${
          active ? "bg-indigo-50 text-indigo-700" : "hover:bg-gray-100"
        }`}
      >
        {icon && <span className="mr-2">{icon}</span>}
        <span>{label}</span>
        {subItems && (
          <svg
            className={`ml-auto w-5 h-5 transition-transform ${
              expanded ? "transform rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        )}
      </div>

      {expanded && subItems && (
        <div className="ml-6 mt-1 space-y-1">
          {subItems.map((item, index) => (
            <a
              key={index}
              href={item.href}
              className="flex items-center p-2 text-sm rounded-md hover:bg-gray-100"
            >
              {item.label}
              {item.badge && (
                <span className="ml-auto px-2 py-0.5 text-xs rounded-full bg-indigo-100 text-indigo-700">
                  {item.badge}
                </span>
              )}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

// Modal Component
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  className?: string;
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  className = "",
}: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex justify-center items-center p-4">
      <div
        className={`bg-white rounded-lg shadow-xl max-w-4xl w-full mx-auto ${className}`}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-medium">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

// Select Component
export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "size"> {
  label?: string;
  options: SelectOption[];
  error?: string;
  fullWidth?: boolean;
}

export function Select({
  label,
  options,
  error,
  fullWidth = false,
  className = "",
  ...props
}: SelectProps) {
  return (
    <div className={`${fullWidth ? "w-full" : ""}`}>
      {label && (
        <label className="block mb-1 font-medium text-gray-700">{label}</label>
      )}
      <select
        className={`border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
          error ? "border-red-500" : "border-gray-300"
        } ${className}`}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}

// Tabs 컴포넌트 추가
export function Tabs({ children }: { children: React.ReactNode }) {
  return (
    <div className="border-b border-gray-200 dark:border-gray-700">
      <div className="flex space-x-4">{children}</div>
    </div>
  );
}

// TabItem 컴포넌트 추가
export function TabItem({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      className={`py-3 px-4 border-b-2 text-sm font-medium ${
        active
          ? "border-indigo-500 text-indigo-600 dark:border-indigo-400 dark:text-indigo-300"
          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
      }`}
      onClick={onClick}
    >
      {label}
    </button>
  );
}
