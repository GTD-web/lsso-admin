"use client";

/**
 * 부서 관리 패널
 */

import { useEffect, useState } from "react";
import { useOrganization } from "../../../_context/organization-provider";
import {
  organizationsRepository,
  type Department,
  type DepartmentTreeNode,
} from "@/api/v2";
import { Button } from "@/components/ui/button";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ChevronRightIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import { DepartmentModal } from "./modules/department-modal";

export const DepartmentPanel = () => {
  const {
    departments,
    setDepartments,
    isLoading,
    setIsLoading,
    error,
    setError,
    isModalOpen,
    setIsModalOpen,
    editingItem,
    setEditingItem,
  } = useOrganization();

  const [departmentTree, setDepartmentTree] = useState<DepartmentTreeNode[]>(
    []
  );
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadDepartments();
  }, []);

  useEffect(() => {
    if (departments.length > 0) {
      console.log("부서 데이터:", departments);
      const tree = buildDepartmentTree(departments);
      console.log("부서 트리:", tree);
      setDepartmentTree(tree);
      // 처음 로드할 때 루트 노드들은 자동으로 펼치기
      const rootNodeIds = tree.map((node) => node.id);
      setExpandedNodes(new Set(rootNodeIds));
    }
  }, [departments]);

  const loadDepartments = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await organizationsRepository.getDepartments();
      setDepartments(response.departments || []);
    } catch (err) {
      console.error("부서 목록 조회 실패:", err);
      setError("부서 목록을 불러오는데 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const buildDepartmentTree = (depts: Department[]): DepartmentTreeNode[] => {
    console.log("buildDepartmentTree 시작, 부서 수:", depts.length);

    // 재귀적으로 부서 트리를 구성하는 함수
    const convertToTreeNode = (dept: Department): DepartmentTreeNode => {
      const children: DepartmentTreeNode[] = [];

      // childDepartments가 있으면 재귀적으로 변환
      if (dept.childDepartments && dept.childDepartments.length > 0) {
        dept.childDepartments.forEach((childDept) => {
          children.push(convertToTreeNode(childDept));
        });
      }

      console.log(
        `부서 ${dept.departmentName}: childDepartments=${
          dept.childDepartments?.length || 0
        }, children=${children.length}`
      );

      return { ...dept, children };
    };

    // 루트 부서들 찾기 (parentDepartmentId가 없는 부서들)
    const rootDepartments = depts.filter((dept) => !dept.parentDepartmentId);
    console.log("루트 부서 수:", rootDepartments.length);

    // 루트 부서들을 트리 노드로 변환
    const rootNodes = rootDepartments.map((dept) => {
      console.log(`루트 부서: ${dept.departmentName}`);
      return convertToTreeNode(dept);
    });

    // childDepartments가 없는 경우를 위한 fallback - parentDepartmentId 기반 트리 구성
    if (
      rootNodes.length === 0 ||
      rootNodes.every((node) => !node.children || node.children.length === 0)
    ) {
      console.log(
        "childDepartments가 없어서 parentDepartmentId 기반으로 트리 구성"
      );

      const departmentMap = new Map<string, DepartmentTreeNode>();
      const fallbackRootNodes: DepartmentTreeNode[] = [];

      // 모든 부서를 맵에 저장
      depts.forEach((dept) => {
        departmentMap.set(dept.id, { ...dept, children: [] });
      });

      // 트리 구조 구성
      depts.forEach((dept) => {
        const node = departmentMap.get(dept.id)!;

        if (
          dept.parentDepartmentId &&
          departmentMap.has(dept.parentDepartmentId)
        ) {
          const parent = departmentMap.get(dept.parentDepartmentId)!;
          parent.children = parent.children || [];
          parent.children.push(node);
        } else {
          fallbackRootNodes.push(node);
        }
      });

      return fallbackRootNodes;
    }

    // 정렬
    const sortNodes = (nodes: DepartmentTreeNode[]) => {
      nodes.sort((a, b) => a.order - b.order);
      nodes.forEach((node) => {
        if (node.children && node.children.length > 0) {
          sortNodes(node.children);
        }
      });
    };

    sortNodes(rootNodes);
    console.log("최종 루트 노드 수:", rootNodes.length);
    return rootNodes;
  };

  const handleCreate = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleEdit = (department: Department) => {
    setEditingItem(department);
    setIsModalOpen(true);
  };

  const handleDelete = async (department: Department) => {
    if (!confirm(`"${department.departmentName}" 부서를 삭제하시겠습니까?`)) {
      return;
    }

    try {
      await organizationsRepository.deleteDepartment(department.id);
      await loadDepartments();
    } catch (err) {
      console.error("부서 삭제 실패:", err);
      setError("부서 삭제에 실패했습니다.");
    }
  };

  const toggleExpanded = (nodeId: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedNodes(newExpanded);
  };

  const renderDepartmentNode = (
    node: DepartmentTreeNode,
    level: number = 0
  ) => {
    const indent = level * 24;
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = expandedNodes.has(node.id);

    // 디버깅용 로그
    console.log(`Node ${node.departmentName}:`, {
      hasChildren,
      childrenCount: node.children?.length || 0,
    });

    return (
      <div key={node.id}>
        <div
          className="flex items-center justify-between p-3 hover:bg-gray-50 border-b border-gray-100"
          style={{ paddingLeft: `${16 + indent}px` }}
        >
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              {/* 펼침/접기 버튼 - 항상 표시 */}
              <button
                onClick={() => toggleExpanded(node.id)}
                className={`p-1 rounded transition-colors ${
                  hasChildren
                    ? "hover:bg-gray-200 cursor-pointer"
                    : "cursor-default opacity-30"
                }`}
                disabled={!hasChildren}
              >
                {hasChildren ? (
                  isExpanded ? (
                    <ChevronDownIcon className="h-4 w-4 text-gray-600" />
                  ) : (
                    <ChevronRightIcon className="h-4 w-4 text-gray-600" />
                  )
                ) : (
                  <div className="h-4 w-4 border border-gray-300 rounded-sm bg-gray-50" />
                )}
              </button>

              <span className="font-medium text-gray-900">
                {node.departmentName}
              </span>
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                {node.departmentCode}
              </span>
              <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
                {node.type}
              </span>
              {hasChildren && (
                <span className="text-xs text-gray-400">
                  ({node.children?.length}개 하위부서)
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" onClick={() => handleEdit(node)}>
              <PencilIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDelete(node)}
            >
              <TrashIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* 하위 부서들 - 펼쳐진 경우에만 표시 */}
        {hasChildren && isExpanded && (
          <div>
            {node.children!.map((child) =>
              renderDepartmentNode(child, level + 1)
            )}
          </div>
        )}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="p-6 text-center">
        <div className="text-gray-500">부서 목록을 불러오는 중...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">부서 관리</h2>
          <p className="text-sm text-gray-500 mt-1">
            부서 계층구조를 관리합니다.
          </p>
        </div>

        <Button onClick={handleCreate}>
          <PlusIcon className="h-4 w-4 mr-2" />
          부서 추가
        </Button>
      </div>

      {/* 에러 메시지 */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}

      {/* 부서 트리 */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        {departmentTree.length > 0 ? (
          <div>{departmentTree.map((node) => renderDepartmentNode(node))}</div>
        ) : (
          <div className="p-8 text-center text-gray-500">
            등록된 부서가 없습니다.
          </div>
        )}
      </div>

      {/* 모달 */}
      <DepartmentModal onSuccess={loadDepartments} />
    </div>
  );
};
