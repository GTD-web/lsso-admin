"use client";

import { useState, useEffect } from "react";
import { Card, Button, TextField, Alert } from "../components/LumirMock";
import { getAllUsers, searchUsers, User } from "../api/users";
import Link from "next/link";

// 날짜를 한국어 형식으로 포맷하는 함수
function formatDate(dateString?: string): string {
  if (!dateString) return "-";
  try {
    return new Date(dateString).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return dateString;
  }
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<keyof User>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // 유저 목록 조회
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log("fetchUsers");
        const response = await getAllUsers();
        console.log("response", response);
        if (response.success && response.data) {
          setUsers(response.data);
          setFilteredUsers(response.data);
        } else {
          setError(
            response.error?.message || "사용자 목록을 불러오는데 실패했습니다."
          );
        }
      } catch (err) {
        console.error("Error fetching users:", err);
        setError("사용자 목록을 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // 검색 처리
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setFilteredUsers(users);
      return;
    }

    setLoading(true);
    try {
      const response = await searchUsers(searchQuery);
      if (response.success && response.data) {
        setFilteredUsers(response.data);
      } else {
        setError(response.error?.message || "검색에 실패했습니다.");
      }
    } catch (err) {
      console.error("Error searching users:", err);
      setError("검색에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 정렬 처리
  const handleSort = (field: keyof User) => {
    if (field === sortField) {
      // 같은 필드를 다시 클릭하면 방향 전환
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // 새로운 필드는 오름차순으로 시작
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // 정렬된 사용자 목록
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];

    if (aValue === undefined || bValue === undefined) {
      return 0;
    }

    if (typeof aValue === "string" && typeof bValue === "string") {
      // 날짜 필드의 경우 Date로 변환하여 비교
      if (
        sortField === "dateOfBirth" ||
        sortField === "hireDate" ||
        sortField === "createdAt" ||
        sortField === "updatedAt"
      ) {
        return sortDirection === "asc"
          ? new Date(aValue).getTime() - new Date(bValue).getTime()
          : new Date(bValue).getTime() - new Date(aValue).getTime();
      }

      // 일반 문자열 비교
      return sortDirection === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    return 0;
  });

  // 테이블 헤더 셀 컴포넌트
  const TableHeaderCell = ({
    field,
    label,
  }: {
    field: keyof User;
    label: string;
  }) => (
    <th
      className={`px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-50`}
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center space-x-1">
        <span>{label}</span>
        {sortField === field && (
          <span>{sortDirection === "asc" ? " ↑" : " ↓"}</span>
        )}
      </div>
    </th>
  );
  console.log("user", users);
  return (
    <div className="flex-1 p-8 bg-slate-50 dark:bg-slate-900 overflow-auto">
      <div className="max-w-7xl mx-auto">
        {/* 검색 및 필터 영역 */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          {/* 필터 영역 - 왼쪽 */}
          <div className="flex items-center gap-4">
            {/* 필터 드롭다운 등이 필요한 경우 여기에 추가 */}
          </div>

          {/* 검색 영역 - 오른쪽 */}
          <div className="flex">
            <TextField
              placeholder="이름, 이메일, 사번, 부서 등 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="min-w-[200px] md:min-w-[260px]"
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <Button onClick={handleSearch} className="ml-2">
              검색
            </Button>
          </div>
        </div>

        {/* 에러 메시지 */}
        {error && (
          <Alert variant="error" className="mb-6">
            {error}
          </Alert>
        )}

        {/* 유저 테이블 */}
        <Card className="overflow-hidden">
          <div className="relative overflow-x-auto">
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                <p className="ml-3 text-gray-600">데이터를 불러오는 중...</p>
              </div>
            ) : sortedUsers.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-gray-500">사용자 정보가 없습니다.</p>
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <TableHeaderCell field="employeeNumber" label="사번" />
                    <TableHeaderCell field="name" label="이름" />
                    <TableHeaderCell field="email" label="이메일" />
                    <TableHeaderCell field="department" label="부서" />
                    <TableHeaderCell field="position" label="직위" />
                    <TableHeaderCell field="rank" label="직급" />
                    <TableHeaderCell field="hireDate" label="입사일" />
                    <TableHeaderCell field="status" label="상태" />
                    <th className="px-4 py-3 text-right">관리</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sortedUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.employeeNumber}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {user.name}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.email}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.department || "-"}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.position || "-"}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.rank || "-"}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(user.hireDate)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span
                          className={`inline-flex px-2 py-1 text-xs rounded-full ${
                            user.status === "재직중"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {user.status || "미설정"}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-right text-sm">
                        <Link href={`/users/${user.id}`}>
                          <Button size="sm" variant="outline">
                            상세보기
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </Card>

        {/* 페이지네이션 영역 (실제 구현에서는 서버 데이터에 맞게 조정 필요) */}
        <div className="flex justify-center mt-6">
          <div className="flex space-x-1">
            {[1].map((page) => (
              <Button
                key={page}
                variant={page === 1 ? "primary" : "outline"}
                size="sm"
              >
                {page}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
