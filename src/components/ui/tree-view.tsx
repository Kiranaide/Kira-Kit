import * as React from "react";
import { cn } from "@/lib/utils";
import {
  IconChevronRight,
  IconFile,
  IconFolder,
  IconFolderOpen,
} from "@tabler/icons-react";

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
  onSelect?: (node: TreeNode) => void;
  className?: string;
}

function TreeView({
  data,
  defaultExpandedNodes = [],
  showLines = true,
  onSelect,
  className,
}: TreeViewProps) {
  const [expandedNodes, setExpandedNodes] = React.useState<Set<string>>(
    new Set(defaultExpandedNodes)
  );
  const [selectedNode, setSelectedNode] = React.useState<string | null>(null);

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

  const handleSelect = React.useCallback(
    (id: string, node: TreeNode) => {
      setSelectedNode(id);
      onSelect?.(node);
    },
    [onSelect]
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
        showLines,
      }}
    >
      <div className={cn("text-sm", className)}>
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
    <ul className="list-none">
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
    showLines,
  } = useTreeView();
  const isExpanded = expandedNodes.has(node.id);
  const hasChildren = node.children && node.children.length > 0;
  const isSelected = selectedNode === node.id;

  const handleClick = () => {
    if (hasChildren && !node.isFile) {
      toggleNode(node.id);
    }
    setSelectedNode(node.id);
  };

  const getIcon = () => {
    if (node.icon) return node.icon;
    if (node.isFile)
      return <IconFile className="h-4 w-4 text-muted-foreground" />;
    return isExpanded ? (
      <IconFolderOpen className="h-4 w-4 text-yellow-500" />
    ) : (
      <IconFolder className="h-4 w-4 text-yellow-500" />
    );
  };

  return (
    <li className="relative">
      {/* Tree lines */}
      {showLines && level > 0 && (
        <>
          {/* Horizontal line to node */}
          <span
            className="absolute border-t border-muted-foreground/30"
            style={{
              left: `${(level - 1) * 20 + 10}px`,
              top: "14px",
              width: "10px",
            }}
          />
          {/* Vertical line connecting siblings */}
          {!isLast && (
            <span
              className="absolute border-l border-muted-foreground/30"
              style={{
                left: `${(level - 1) * 20 + 10}px`,
                top: "14px",
                height: "calc(100% - 14px)",
              }}
            />
          )}
        </>
      )}

      <button
        onClick={handleClick}
        className={cn(
          "flex w-full items-center gap-1.5 rounded-md px-2 py-1 hover:bg-muted text-left transition-colors",
          isSelected && "bg-muted font-medium"
        )}
        style={{ paddingLeft: `${level * 20 + 8}px` }}
      >
        {/* Expand/collapse arrow */}
        {hasChildren ? (
          <IconChevronRight
            className={cn(
              "h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform",
              isExpanded && "rotate-90"
            )}
          />
        ) : (
          <span className="w-3.5" />
        )}

        {/* Icon */}
        <span className="shrink-0">{getIcon()}</span>

        {/* Label */}
        <span className="truncate">{node.name}</span>
      </button>

      {/* Children */}
      {hasChildren && isExpanded && (
        <div className="relative">
          {/* Vertical connecting line for children */}
          {showLines && (
            <span
              className="absolute border-l border-muted-foreground/30"
              style={{
                left: `${level * 20 + 10}px`,
                top: 0,
                height: "100%",
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
