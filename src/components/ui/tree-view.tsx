import * as React from "react";
import { cn } from "@/lib/utils";
import {
  IconChevronRight,
  IconFile,
  IconFolder,
  IconFolderOpen,
} from "@tabler/icons-react";
import { Checkbox } from "@/components/ui/checkbox";

// ============================================
// TYPES
// ============================================
export interface TreeNode {
  id: string;
  name: string;
  icon?: React.ReactNode;
  children?: TreeNode[];
  isFile?: boolean;
}

interface TreeViewContextValue {
  expandedNodes: Set<string>;
  toggleNode: (id: string) => void;
  selectedNode: string | null;
  setSelectedNode: (id: string | null) => void;
  selectedNodes: Set<string>;
  toggleSelection: (id: string) => void;
  selectionMode: "single" | "multiple";
  showLines?: boolean;
}

const TreeViewContext = React.createContext<TreeViewContextValue | null>(null);

function useTreeView() {
  const context = React.useContext(TreeViewContext);
  if (!context) {
    throw new Error("useTreeView must be used within TreeView");
  }
  return context;
}

// ============================================
// TREE VIEW ROOT
// ============================================
interface TreeViewProps {
  data: TreeNode[];
  defaultExpandedNodes?: string[];
  showLines?: boolean;
  selectionMode?: "single" | "multiple";
  defaultSelectedNodes?: string[];
  onSelect?: (node: TreeNode) => void;
  onSelectionChange?: (selectedNodes: string[]) => void;
  className?: string;
}

function TreeView({
  data,
  defaultExpandedNodes = [],
  showLines = true,
  selectionMode = "single",
  defaultSelectedNodes = [],
  onSelect,
  onSelectionChange,
  className,
}: TreeViewProps) {
  const [expandedNodes, setExpandedNodes] = React.useState<Set<string>>(
    new Set(defaultExpandedNodes)
  );
  const [selectedNode, setSelectedNode] = React.useState<string | null>(
    selectionMode === "single" && defaultSelectedNodes.length > 0
      ? defaultSelectedNodes[0]
      : null
  );
  const [selectedNodes, setSelectedNodes] = React.useState<Set<string>>(
    new Set(selectionMode === "multiple" ? defaultSelectedNodes : [])
  );

  const toggleNode = React.useCallback((id: string) => {
    setExpandedNodes((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  // Helper function to get all child node IDs recursively
  const getAllChildIds = (node: TreeNode): string[] => {
    const ids: string[] = [];
    if (node.children) {
      for (const child of node.children) {
        ids.push(child.id);
        ids.push(...getAllChildIds(child));
      }
    }
    return ids;
  };

  // Helper function to find a node by ID
  const findNodeById = (nodes: TreeNode[], id: string): TreeNode | null => {
    for (const node of nodes) {
      if (node.id === id) return node;
      if (node.children) {
        const found = findNodeById(node.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  const toggleSelection = React.useCallback(
    (id: string) => {
      setSelectedNodes((prev) => {
        const next = new Set(prev);
        const node = findNodeById(data, id);

        if (!node) return next;

        const isSelected = next.has(id);
        const childIds = getAllChildIds(node);

        if (isSelected) {
          // Deselect parent and all children
          next.delete(id);
          childIds.forEach((childId) => next.delete(childId));
        } else {
          // Select parent and all children
          next.add(id);
          childIds.forEach((childId) => next.add(childId));
        }

        return next;
      });
    },
    [data, getAllChildIds, findNodeById]
  );

  React.useEffect(() => {
    if (selectionMode === "multiple") {
      onSelectionChange?.(Array.from(selectedNodes));
    }
  }, [selectedNodes, selectionMode, onSelectionChange]);

  const handleSelect = React.useCallback(
    (id: string, node: TreeNode) => {
      if (selectionMode === "multiple") {
        toggleSelection(id);
      } else {
        setSelectedNode(id);
      }
      onSelect?.(node);
    },
    [onSelect, selectionMode, toggleSelection]
  );

  return (
    <TreeViewContext.Provider
      value={{
        expandedNodes,
        toggleNode,
        selectedNode,
        setSelectedNode: (id) => {
          if (id) {
            const findNode = (nodes: TreeNode[]): TreeNode | null => {
              for (const node of nodes) {
                if (node.id === id) return node;
                if (node.children) {
                  const found = findNode(node.children);
                  if (found) return found;
                }
              }
              return null;
            };
            const node = findNode(data);
            if (node) handleSelect(id, node);
          }
        },
        selectedNodes,
        toggleSelection,
        selectionMode,
        onSelect,
        showLines,
      }}
    >
      <div role="tree" className={cn("text-sm", className)}>
        <TreeNodeList nodes={data} level={0} />
      </div>
    </TreeViewContext.Provider>
  );
}

// ============================================
// TREE NODE LIST
// ============================================
interface TreeNodeListProps {
  nodes: TreeNode[];
  level: number;
}

function TreeNodeList({ nodes, level }: TreeNodeListProps) {
  return (
    <ul role="group" className="list-none">
      {nodes.map((node, index) => (
        <TreeNodeItem
          key={node.id}
          node={node}
          level={level}
          isLast={index === nodes.length - 1}
        />
      ))}
    </ul>
  );
}

// ============================================
// TREE NODE ITEM
// ============================================
interface TreeNodeItemProps {
  node: TreeNode;
  level: number;
  isLast: boolean;
}

function TreeNodeItem({ node, level, isLast }: TreeNodeItemProps) {
  const {
    expandedNodes,
    toggleNode,
    selectedNode,
    setSelectedNode,
    selectedNodes,
    toggleSelection,
    selectionMode,
    onSelect,
    showLines,
  } = useTreeView();
  const isExpanded = expandedNodes.has(node.id);
  const hasChildren = node.children && node.children.length > 0;
  const isSelected =
    selectionMode === "multiple"
      ? selectedNodes.has(node.id)
      : selectedNode === node.id;

  const handleClick = () => {
    if (hasChildren && !node.isFile) {
      toggleNode(node.id);
    }
    setSelectedNode(node.id);
  };

  const getIcon = () => {
    if (node.icon) return node.icon;
    if (node.isFile)
      return (
        <IconFile
          className="h-4 w-4 text-muted-foreground"
          aria-hidden="true"
        />
      );
    return isExpanded ? (
      <IconFolderOpen className="h-4 w-4 text-yellow-500" aria-hidden="true" />
    ) : (
      <IconFolder className="h-4 w-4 text-yellow-500" aria-hidden="true" />
    );
  };

  return (
    <li
      role="treeitem"
      aria-expanded={hasChildren ? isExpanded : undefined}
      aria-selected={isSelected}
      className="relative"
    >
      {/* Tree lines */}
      {showLines && level > 0 && (
        <>
          {/* Horizontal line to node */}
          <span
            aria-hidden="true"
            className="absolute border-t border-border z-0"
            style={{
              left: `${(level - 1) * 24 + 12}px`,
              top: "16px",
              width: "12px",
            }}
          />
          {/* Vertical line connecting siblings - only if not last */}
          {!isLast && (
            <span
              aria-hidden="true"
              className="absolute border-l border-border z-0"
              style={{
                left: `${(level - 1) * 24 + 12}px`,
                top: "16px",
                bottom: 0,
              }}
            />
          )}
        </>
      )}

      <div
        className={cn(
          "flex w-full items-center gap-1.5 rounded-md px-2 py-1.5 hover:bg-muted/50 text-left transition-colors relative",
          isSelected && selectionMode === "single" && "bg-muted/50 font-medium",
          isSelected && selectionMode === "multiple" && "font-medium"
        )}
        style={{ paddingLeft: `${level * 24 + 8}px` }}
      >
        {/* Selection indicator for multi-select - left border accent */}
        {selectionMode === "multiple" && isSelected && (
          <span
            aria-hidden="true"
            className="absolute left-0 top-0 bottom-0 w-0.5 bg-primary rounded-r"
          />
        )}

        {/* Checkbox for multi-select */}
        {selectionMode === "multiple" && (
          <Checkbox
            checked={isSelected}
            onCheckedChange={() => {
              toggleSelection(node.id);
              onSelect?.(node);
            }}
            onClick={(e) => e.stopPropagation()}
            className="shrink-0"
            aria-label={`Select ${node.name}`}
          />
        )}

        <button
          onClick={() => {
            handleClick();
            if (selectionMode === "single") {
              onSelect?.(node);
            }
          }}
          className="flex items-center gap-1.5 flex-1 min-w-0"
          aria-label={node.name}
        >
          {/* Expand/collapse arrow */}
          {hasChildren ? (
            <IconChevronRight
              aria-hidden="true"
              className={cn(
                "h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform",
                isExpanded && "rotate-90"
              )}
            />
          ) : (
            <span className="w-3.5" aria-hidden="true" />
          )}

          {/* Icon */}
          <span className="shrink-0">{getIcon()}</span>

          {/* Label */}
          <span className="truncate">{node.name}</span>
        </button>
      </div>

      {/* Children */}
      {hasChildren && isExpanded && (
        <div className="relative">
          {/* Vertical connecting line for children */}
          {showLines && node.children && node.children.length > 0 && (
            <span
              aria-hidden="true"
              className="absolute border-l border-border z-0"
              style={{
                left: `${level * 24 + 12}px`,
                top: 0,
                bottom: "8px",
              }}
            />
          )}
          <TreeNodeList nodes={node.children!} level={level + 1} />
        </div>
      )}
    </li>
  );
}

export { TreeView };
export type { TreeViewProps };
