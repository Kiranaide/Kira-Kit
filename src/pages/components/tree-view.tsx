import { TreeView, type TreeNode } from "@/components/ui/tree-view";
import {
  IconPhoto,
  IconFileCode,
  IconFileText,
  IconSettings,
} from "@tabler/icons-react";

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

export function TreeViewPage() {
  const handleSelect = (node: TreeNode) => {
    console.log("Selected:", node);
  };

  return (
    <div className="p-8 max-w-4xl space-y-12">
      <header>
        <h1 className="text-3xl font-bold mb-2">Tree View</h1>
        <p className="text-muted-foreground">
          A hierarchical tree structure with connecting lines and
          expand/collapse arrows.
        </p>
      </header>

      {/* Basic Tree */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Basic Tree
        </h2>
        <div className="max-w-sm rounded-lg border p-4">
          <TreeView data={simpleTreeData} onSelect={handleSelect} />
        </div>
      </section>

      {/* File Explorer */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          File Explorer
        </h2>
        <div className="max-w-md rounded-lg border p-4">
          <TreeView
            data={fileTreeData}
            defaultExpandedNodes={["src", "components", "ui"]}
            onSelect={handleSelect}
          />
        </div>
      </section>

      {/* Without Lines */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Without Lines
        </h2>
        <div className="max-w-sm rounded-lg border p-4">
          <TreeView
            data={simpleTreeData}
            showLines={false}
            onSelect={handleSelect}
          />
        </div>
      </section>

      {/* Usage */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Usage
        </h2>
        <div className="bg-muted/50 rounded-lg p-4 overflow-x-auto">
          <pre className="text-sm text-foreground">
            {`import { TreeView, type TreeNode } from "@/components/ui/tree-view"

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

<TreeView
  data={data}
  defaultExpandedNodes={["folder1"]}
  showLines={true}
  onSelect={(node) => console.log(node)}
/>`}
          </pre>
        </div>
      </section>
    </div>
  );
}
