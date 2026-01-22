import { TreeView, type TreeNode } from "@/components/ui/tree-view";
import {
  IconPhoto,
  IconFileCode,
  IconFileText,
  IconSettings,
  IconHierarchy,
  IconCheckbox,
  IconList,
} from "@tabler/icons-react";
import {
  ComponentPage,
  PageHeader,
  FeatureGrid,
  DemoTabs,
  DemoWrapper,
  KeyboardShortcuts,
  UsageBlock,
  APIReference,
} from "@/components/docs";

const fileTreeData: TreeNode[] = [
  {
    id: "src",
    name: "src",
    children: [
      {
        id: "components",
        name: "components",
        children: [
          {
            id: "ui",
            name: "ui",
            children: [
              {
                id: "button.tsx",
                name: "button.tsx",
                isFile: true,
                icon: <IconFileCode className="h-4 w-4 text-blue-500" />,
              },
              {
                id: "input.tsx",
                name: "input.tsx",
                isFile: true,
                icon: <IconFileCode className="h-4 w-4 text-blue-500" />,
              },
              {
                id: "card.tsx",
                name: "card.tsx",
                isFile: true,
                icon: <IconFileCode className="h-4 w-4 text-blue-500" />,
              },
            ],
          },
          {
            id: "app-layout.tsx",
            name: "app-layout.tsx",
            isFile: true,
            icon: <IconFileCode className="h-4 w-4 text-blue-500" />,
          },
        ],
      },
      {
        id: "pages",
        name: "pages",
        children: [
          {
            id: "index.tsx",
            name: "index.tsx",
            isFile: true,
            icon: <IconFileCode className="h-4 w-4 text-blue-500" />,
          },
          {
            id: "about.tsx",
            name: "about.tsx",
            isFile: true,
            icon: <IconFileCode className="h-4 w-4 text-blue-500" />,
          },
        ],
      },
      {
        id: "main.tsx",
        name: "main.tsx",
        isFile: true,
        icon: <IconFileCode className="h-4 w-4 text-blue-500" />,
      },
      {
        id: "router.tsx",
        name: "router.tsx",
        isFile: true,
        icon: <IconFileCode className="h-4 w-4 text-blue-500" />,
      },
    ],
  },
  {
    id: "public",
    name: "public",
    children: [
      {
        id: "favicon.ico",
        name: "favicon.ico",
        isFile: true,
        icon: <IconPhoto className="h-4 w-4 text-purple-500" />,
      },
      {
        id: "logo.svg",
        name: "logo.svg",
        isFile: true,
        icon: <IconPhoto className="h-4 w-4 text-purple-500" />,
      },
    ],
  },
  {
    id: "package.json",
    name: "package.json",
    isFile: true,
    icon: <IconSettings className="h-4 w-4 text-green-500" />,
  },
  {
    id: "tsconfig.json",
    name: "tsconfig.json",
    isFile: true,
    icon: <IconSettings className="h-4 w-4 text-green-500" />,
  },
  {
    id: "README.md",
    name: "README.md",
    isFile: true,
    icon: <IconFileText className="h-4 w-4 text-gray-500" />,
  },
];

const simpleTreeData: TreeNode[] = [
  {
    id: "documents",
    name: "Documents",
    children: [
      { id: "resume.pdf", name: "resume.pdf", isFile: true },
      { id: "cover-letter.docx", name: "cover-letter.docx", isFile: true },
      {
        id: "projects",
        name: "Projects",
        children: [
          { id: "project1.md", name: "project1.md", isFile: true },
          { id: "project2.md", name: "project2.md", isFile: true },
        ],
      },
    ],
  },
  {
    id: "images",
    name: "Images",
    children: [
      { id: "photo1.jpg", name: "photo1.jpg", isFile: true },
      { id: "photo2.png", name: "photo2.png", isFile: true },
    ],
  },
];

const features = [
  {
    title: "Hierarchical Display",
    description: "Organize nested data with expand/collapse functionality and connecting lines for visual hierarchy.",
    icon: <IconHierarchy className="h-5 w-5 text-muted-foreground" />,
  },
  {
    title: "Multi-Selection",
    description: "Support for single or multiple selection modes with checkbox controls and parent-child selection cascading.",
    icon: <IconCheckbox className="h-5 w-5 text-muted-foreground" />,
  },
  {
    title: "Customizable",
    description: "Custom icons per node, optional connecting lines, and built-in folder/file icons with full styling control.",
    icon: <IconList className="h-5 w-5 text-muted-foreground" />,
  },
];

function BasicDemo() {
  const handleSelect = (node: TreeNode) => {
    console.log("Selected:", node);
  };

  return <TreeView data={simpleTreeData} onSelect={handleSelect} />;
}

const basicCode = `import { TreeView, type TreeNode } from "@/components/ui/tree-view"

const data: TreeNode[] = [
  {
    id: "documents",
    name: "Documents",
    children: [
      { id: "resume.pdf", name: "resume.pdf", isFile: true },
      { id: "cover-letter.docx", name: "cover-letter.docx", isFile: true },
      {
        id: "projects",
        name: "Projects",
        children: [
          { id: "project1.md", name: "project1.md", isFile: true },
          { id: "project2.md", name: "project2.md", isFile: true },
        ],
      },
    ],
  },
]

export function BasicTreeViewDemo() {
  return (
    <TreeView data={data} onSelect={(node) => console.log(node)} />
  )
}`;

function FileExplorerDemo() {
  const handleSelect = (node: TreeNode) => {
    console.log("Selected:", node);
  };

  return (
    <TreeView
      data={fileTreeData}
      defaultExpandedNodes={["src", "components", "ui"]}
      onSelect={handleSelect}
    />
  );
}

const fileExplorerCode = `import { TreeView, type TreeNode } from "@/components/ui/tree-view"
import { IconFileCode, IconPhoto, IconSettings, IconFileText } from "@tabler/icons-react"

const data: TreeNode[] = [
  {
    id: "src",
    name: "src",
    children: [
      {
        id: "components",
        name: "components",
        children: [
          {
            id: "button.tsx",
            name: "button.tsx",
            isFile: true,
            icon: <IconFileCode className="h-4 w-4 text-blue-500" />,
          },
        ],
      },
    ],
  },
]

export function FileExplorerDemo() {
  return (
    <TreeView
      data={data}
      defaultExpandedNodes={["src", "components"]}
      onSelect={(node) => console.log(node)}
    />
  )
}`;

function WithoutLinesDemo() {
  const handleSelect = (node: TreeNode) => {
    console.log("Selected:", node);
  };

  return (
    <TreeView
      data={simpleTreeData}
      showLines={false}
      onSelect={handleSelect}
    />
  );
}

const withoutLinesCode = `import { TreeView, type TreeNode } from "@/components/ui/tree-view"

export function WithoutLinesDemo() {
  return (
    <TreeView
      data={data}
      showLines={false}
      onSelect={(node) => console.log(node)}
    />
  )
}`;

function MultiSelectionDemo() {
  const handleSelect = (node: TreeNode) => {
    console.log("Selected:", node);
  };

  return (
    <TreeView
      data={fileTreeData}
      selectionMode="multiple"
      defaultExpandedNodes={["src", "components"]}
      onSelectionChange={(selected) => {
        console.log("Selected nodes:", selected);
      }}
      onSelect={handleSelect}
    />
  );
}

const multiSelectionCode = `import { TreeView, type TreeNode } from "@/components/ui/tree-view"

export function MultiSelectionDemo() {
  return (
    <TreeView
      data={data}
      selectionMode="multiple"
      defaultExpandedNodes={["src"]}
      onSelectionChange={(selectedNodes) => {
        console.log("Selected:", selectedNodes)
      }}
      onSelect={(node) => console.log("Clicked:", node)}
    />
  )
}`;

const usageCode = `import { TreeView, type TreeNode } from "@/components/ui/tree-view"

const data: TreeNode[] = [
  {
    id: "folder1",
    name: "Folder 1",
    children: [
      { id: "file1", name: "file1.txt", isFile: true },
      { id: "file2", name: "file2.txt", isFile: true },
    ],
  },
  { id: "file3", name: "file3.txt", isFile: true },
]

export function MyTree() {
  return (
    <TreeView
      data={data}
      defaultExpandedNodes={["folder1"]}
      showLines={true}
      selectionMode="single"
      onSelect={(node) => console.log(node)}
    />
  )
}`;

export default function TreeViewPage() {
  return (
    <ComponentPage>
      <PageHeader
        title="Tree View"
        description="A hierarchical tree structure with connecting lines, expand/collapse arrows, and multi-selection support for organizing nested data."
        version="v1.0"
      />

      <FeatureGrid features={features} />

      <DemoTabs
        defaultValue="basic"
        tabs={[
          {
            value: "basic",
            label: "Basic",
            demo: (
              <DemoWrapper
                title="Basic Tree"
                description="Simple hierarchical tree with expand/collapse functionality."
                code={basicCode}
              >
                <BasicDemo />
              </DemoWrapper>
            ),
          },
          {
            value: "file-explorer",
            label: "File Explorer",
            demo: (
              <DemoWrapper
                title="File Explorer"
                description="Rich file tree with custom icons and pre-expanded folders."
                code={fileExplorerCode}
              >
                <FileExplorerDemo />
              </DemoWrapper>
            ),
          },
          {
            value: "without-lines",
            label: "Without Lines",
            demo: (
              <DemoWrapper
                title="Without Connecting Lines"
                description="Clean tree view without visual connecting lines."
                code={withoutLinesCode}
              >
                <WithoutLinesDemo />
              </DemoWrapper>
            ),
          },
          {
            value: "multi-selection",
            label: "Multi-Selection",
            demo: (
              <DemoWrapper
                title="Multi-Selection"
                description="Select multiple nodes using checkboxes with parent-child selection cascading."
                code={multiSelectionCode}
              >
                <MultiSelectionDemo />
              </DemoWrapper>
            ),
          },
        ]}
      />

      <KeyboardShortcuts
        shortcuts={[
          { keys: "Enter / Space", description: "Toggle expand/collapse for folders" },
          { keys: "↑ / ↓", description: "Navigate between tree nodes" },
          { keys: "←", description: "Collapse current folder" },
          { keys: "→", description: "Expand current folder" },
          { keys: "Home", description: "Navigate to first node" },
          { keys: "End", description: "Navigate to last node" },
        ]}
      />

      <UsageBlock
        title="Usage"
        description="Basic implementation example with default configuration."
        code={usageCode}
      />

      <APIReference
        sections={[
          {
            title: "TreeView",
            props: [
              {
                prop: "data",
                type: "TreeNode[]",
                default: "-",
                description: "Array of tree nodes to display.",
              },
              {
                prop: "defaultExpandedNodes",
                type: "string[]",
                default: "[]",
                description: "Array of node IDs that should be expanded by default.",
              },
              {
                prop: "showLines",
                type: "boolean",
                default: "true",
                description: "Whether to show connecting lines between nodes.",
              },
              {
                prop: "selectionMode",
                type: '"single" | "multiple"',
                default: '"single"',
                description: "Selection mode for tree nodes.",
              },
              {
                prop: "defaultSelectedNodes",
                type: "string[]",
                default: "[]",
                description: "Array of node IDs that should be selected by default.",
              },
              {
                prop: "onSelect",
                type: "(node: TreeNode) => void",
                default: "-",
                description: "Callback when a node is clicked.",
              },
              {
                prop: "onSelectionChange",
                type: "(selectedNodes: string[]) => void",
                default: "-",
                description: "Callback when selection changes (multiple mode only).",
              },
              {
                prop: "className",
                type: "string",
                default: "-",
                description: "Additional CSS classes for the tree container.",
              },
            ],
          },
          {
            title: "TreeNode",
            props: [
              {
                prop: "id",
                type: "string",
                default: "-",
                description: "Unique identifier for the node.",
              },
              {
                prop: "name",
                type: "string",
                default: "-",
                description: "Display name for the node.",
              },
              {
                prop: "icon",
                type: "ReactNode",
                default: "-",
                description: "Custom icon to display next to the node name.",
              },
              {
                prop: "children",
                type: "TreeNode[]",
                default: "-",
                description: "Array of child nodes (for folders/parents).",
              },
              {
                prop: "isFile",
                type: "boolean",
                default: "false",
                description: "Whether the node represents a file (leaf node).",
              },
            ],
          },
        ]}
      />
    </ComponentPage>
  );
}
