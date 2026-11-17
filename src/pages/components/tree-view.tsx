import type { ComponentProps as ReactComponentProps } from "react";
import * as React from "react";
import { IconHierarchy, IconCheckbox, IconSearch } from "@tabler/icons-react";
import {
  TreeView,
  KiraTreeView,
  type TreeNode,
} from "@/components/ui/tree-view";
import { Button } from "@/components/ui/button";
import {
  ComponentPage,
  PageHeader,
  FeatureGrid,
  DemoTabs,
  DemoWrapper,
  KeyboardShortcuts,
  UsageBlock,
  APIReference,
  Changelog,
} from "@/components/docs";

const documents: TreeNode[] = [
  {
    id: "product",
    name: "Product",
    children: [
      {
        id: "research",
        name: "Research",
        children: [
          { id: "interviews", name: "Customer interviews.md", isFile: true },
          { id: "findings", name: "Research findings.pdf", isFile: true },
        ],
      },
      { id: "roadmap", name: "October roadmap.md", isFile: true },
      {
        id: "archive",
        name: "Archived strategy.pdf",
        isFile: true,
        disabled: true,
        disabledReason: "Restricted — ask the document owner for access.",
      },
    ],
  },
  {
    id: "design",
    name: "Design",
    children: [
      { id: "tokens", name: "Design tokens.json", isFile: true },
      { id: "guidelines", name: "Accessibility guidelines.md", isFile: true },
    ],
  },
];

function BasicDemo() {
  const [last, setLast] = React.useState("Choose a document");

  return (
    <div className="max-w-lg space-y-4">
      <TreeView
        data={documents}
        aria-label="Project documents"
        defaultExpandedNodes={["product"]}
        onSelect={(node) => setLast(node.name)}
      />
      <output className="block break-words text-sm text-muted-foreground">
        {last}
      </output>
    </div>
  );
}

const basicCode = `import { useState } from "react"
import { TreeView, type TreeNode } from "@/components/ui/tree-view"
const documents: TreeNode[] = [{ id: "product", name: "Product", children: [
  { id: "roadmap", name: "October roadmap.md", isFile: true }
] }]
export function Documents() {
  const [last, setLast] = useState("Choose a document")
  return <><TreeView data={documents} aria-label="Project documents"
    defaultExpandedNodes={["product"]} onSelect={node => setLast(node.name)} />
    <p role="status">{last}</p></>
}`;

function SelectionDemo() {
  const [ids, setIds] = React.useState<string[]>(["interviews"]);
  const [manifest, setManifest] = React.useState<string[]>([]);

  const flatten = (nodes: TreeNode[]): TreeNode[] =>
    nodes.flatMap((node) => [node, ...flatten(node.children ?? [])]);

  const files = flatten(documents).filter(
    (node) => node.isFile && ids.includes(node.id),
  );

  return (
    <div className="max-w-lg space-y-4">
      <TreeView
        data={documents}
        selectionMode="multiple"
        selectedNodes={ids}
        onSelectionChange={setIds}
        defaultExpandedNodes={["product", "research"]}
        aria-label="Documents for export"
      />
      <output className="block text-sm text-muted-foreground tabular-nums">
        {ids.length} items selected for export. Restricted documents are
        excluded.
      </output>
      <div className="border-t pt-4 space-y-3">
        <p className="text-sm font-medium">Export manifest</p>
        <ul className="space-y-1 text-sm text-muted-foreground">
          {files.map((file) => (
            <li key={file.id}>{file.name}</li>
          ))}
        </ul>
        {!files.length && (
          <p className="text-sm text-muted-foreground">
            Choose documents using the selection boxes.
          </p>
        )}
        <Button
          className="focus-visible:ring-primary"
          variant="outline"
          disabled={!files.length}
          onClick={() => setManifest(files.map((file) => file.name))}
        >
          Prepare manifest
        </Button>
        <output className="block text-sm text-muted-foreground">
          {manifest.length
            ? `Manifest ready with ${manifest.length} documents. Local example; no files are uploaded.`
            : "Review the selected documents before preparing the manifest."}
        </output>
      </div>
    </div>
  );
}

const selectionCode = `import { useState } from "react"
import { TreeView, type TreeNode } from "@/components/ui/tree-view"
import { Button } from "@/components/ui/button"
const documents: TreeNode[] = [{ id: "folder", name: "Research", children: [
  { id: "interviews", name: "Customer interviews.md", isFile: true },
  { id: "report", name: "Report.pdf", isFile: true },
  { id: "restricted", name: "Strategy.pdf", isFile: true, disabled: true,
    disabledReason: "Ask the document owner for access." }
] }]
export function ExportPicker() {
  const [ids, setIds] = useState<string[]>(["interviews"])
  const [manifest, setManifest] = useState<string[]>([])
  const flatten = (nodes: TreeNode[]): TreeNode[] => nodes.flatMap(node => [node, ...flatten(node.children ?? [])])
  const files = flatten(documents).filter(node => node.isFile && ids.includes(node.id))
  return <><TreeView data={documents} selectionMode="multiple" selectedNodes={ids}
    onSelectionChange={setIds} defaultExpandedNodes={["folder"]} aria-label="Documents for export" />
    <ul>{files.map(file => <li key={file.id}>{file.name}</li>)}</ul>
    <Button variant="outline" disabled={!files.length} onClick={() => setManifest(files.map(file => file.name))}>Prepare manifest</Button>
    <p role="status">{manifest.length ? 'Manifest ready: ' + manifest.length + ' documents' : 'Choose documents first'}</p></>
}`;

function ControlledDemo() {
  const [expanded, setExpanded] = React.useState<string[]>([]);
  const [selected, setSelected] = React.useState<string[]>([]);

  return (
    <div className="max-w-lg space-y-4">
      <div className="flex flex-wrap gap-2">
        <Button
          className="focus-visible:ring-primary"
          variant="outline"
          onClick={() => setExpanded(["product", "research", "design"])}
        >
          Expand all
        </Button>
        <Button
          className="focus-visible:ring-primary"
          variant="outline"
          onClick={() => {
            setExpanded([]);
            setSelected([]);
          }}
        >
          Reset
        </Button>
      </div>
      <TreeView
        data={documents}
        expandedNodes={expanded}
        onExpandedNodesChange={setExpanded}
        selectedNodes={selected}
        onSelectionChange={setSelected}
        showLines={false}
        aria-label="Controlled documents"
      />
      <output className="block text-sm text-muted-foreground">
        Selected: {selected.join(", ") || "None"}
      </output>
    </div>
  );
}

const controlledCode = `import { useState } from "react"
import { TreeView, type TreeNode } from "@/components/ui/tree-view"
import { Button } from "@/components/ui/button"
const documents: TreeNode[] = [{ id: "product", name: "Product", children: [
  { id: "roadmap", name: "October roadmap.md", isFile: true }
] }]
export function ControlledDocuments() {
  const [expanded, setExpanded] = useState<string[]>([])
  const [selected, setSelected] = useState<string[]>([])
  return <><Button onClick={() => setExpanded(["product"])}>Expand all</Button>
    <Button onClick={() => { setExpanded([]); setSelected([]) }}>Reset</Button>
    <TreeView data={documents} expandedNodes={expanded} onExpandedNodesChange={setExpanded}
      selectedNodes={selected} onSelectionChange={setSelected} showLines={false} />
    <p role="status">Selected: {selected.join(", ") || "None"}</p></>
}`;

const sourceFiles: TreeNode[] = [
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
              { id: "tree", name: "tree-view.tsx", isFile: true },
              { id: "collapse", name: "collapsible.tsx", isFile: true },
              { id: "button", name: "button.tsx", isFile: true },
            ],
          },
          { id: "layout", name: "app-layout.tsx", isFile: true },
        ],
      },
      {
        id: "hooks",
        name: "hooks",
        children: [
          { id: "motion", name: "use-reduced-motion.ts", isFile: true },
        ],
      },
      { id: "main", name: "main.tsx", isFile: true },
    ],
  },
  { id: "readme", name: "README.md", isFile: true },
];

const filePreviews = {
  tree: "export { TreeView, KiraTreeView }\n// Browse files with keyboard navigation",
  collapse:
    "export { Collapsible, CollapsibleContent }\n// Shared disclosure and motion",
  button: "export { Button, buttonVariants }",
  motion:
    "export function useReducedMotion() {\n  // Subscribe to the system preference\n}",
};

function ExplorerDemo() {
  const [file, setFile] = React.useState<TreeNode | null>(null);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div>
        <p className="mb-3 text-sm font-medium">kira-kit / source</p>
        <TreeView
          data={sourceFiles}
          defaultExpandedNodes={["src", "components", "ui"]}
          size="sm"
          aria-label="Source files"
          onSelect={(node) => {
            if (node.isFile) setFile(node);
          }}
        />
      </div>
      <div className="min-w-0 rounded-lg border p-4">
        <h2 className="text-sm font-medium">{file?.name ?? "File preview"}</h2>
        <p className="my-3 text-xs text-muted-foreground">
          Illustrative source preview. Choose a file from the tree.
        </p>
        <pre className="overflow-auto rounded-md bg-muted p-3 text-xs">
          {file
            ? (Object.entries(filePreviews).find(
                ([id]) => id === file.id,
              )?.[1] ??
              `// ${file.name}\n// Preview is not available for this file.`)
            : "No file selected"}
        </pre>
      </div>
    </div>
  );
}

const explorerCode = `import { useState } from "react"
import { TreeView, type TreeNode } from "@/components/ui/tree-view"
const files: TreeNode[] = [{ id: "src", name: "src", children: [
  { id: "tree", name: "tree-view.tsx", isFile: true },
  { id: "collapse", name: "collapsible.tsx", isFile: true }
] }]
export function SourceExplorer() {
  const [file, setFile] = useState<TreeNode | null>(null)
  return <><TreeView data={files} size="sm" defaultExpandedNodes={["src"]}
    onSelect={node => { if (node.isFile) setFile(node) }} />
    <p>{file?.name ?? "Choose a file to preview"}</p></>
}`;

function KiraDemo() {
  return (
    <div className="max-w-lg">
      <KiraTreeView
        data={documents}
        title="Prepare a document export"
        searchLabel="Find documents"
        selectionMode="multiple"
        defaultExpandedNodes={["product"]}
        defaultSelectedNodes={["interviews"]}
      />
    </div>
  );
}

const kiraCode = `import { KiraTreeView, type TreeNode } from "@/components/ui/tree-view"
const documents: TreeNode[] = [{ id: "product", name: "Product", children: [
  { id: "research", name: "Research", children: [
    { id: "interviews", name: "Customer interviews.md", isFile: true }
  ] }
] }]
export function DocumentExport() {
  return <KiraTreeView data={documents} title="Prepare a document export"
    searchLabel="Find documents" selectionMode="multiple"
    defaultExpandedNodes={["product"]} defaultSelectedNodes={["interviews"]} />
}`;

function StatesDemo() {
  return (
    <div className="max-w-lg space-y-6">
      <div>
        <h2 className="mb-2 text-sm font-medium">
          Long names in a narrow container
        </h2>
        <div className="w-full max-w-80">
          <TreeView
            size="sm"
            data={[
              {
                id: "long",
                name: "customer-research-accessibility-and-internationalization-review-october-2026.md",
                isFile: true,
              },
            ]}
          />
        </div>
      </div>
      <div>
        <h2 className="mb-2 text-sm font-medium">Loading</h2>
        <TreeView data={[]} loading />
      </div>
      <div>
        <h2 className="mb-2 text-sm font-medium">Empty</h2>
        <TreeView
          data={[]}
          emptyMessage="No documents yet. Add a document to get started."
        />
      </div>
      <div>
        <h2 className="mb-2 text-sm font-medium">
          Read only — browse the saved selection
        </h2>
        <TreeView
          data={documents}
          readOnly
          defaultSelectedNodes={["roadmap"]}
          defaultExpandedNodes={["product"]}
        />
      </div>
      <div>
        <h2 className="mb-2 text-sm font-medium">
          Unavailable while the export is prepared
        </h2>
        <TreeView data={documents} disabled />
      </div>
    </div>
  );
}

const statesCode = `import { TreeView } from "@/components/ui/tree-view"
export function TreeStates() {
  return <>
    <TreeView size="sm" data={[{ id: "long", name: "customer-research-accessibility-and-internationalization-review-october-2026.md", isFile: true }]} />
    <TreeView data={[]} loading />
    <TreeView data={[]} emptyMessage="No documents yet. Add a document to get started." />
    <TreeView data={[{ id: "saved", name: "Saved document.md", isFile: true }]} readOnly defaultSelectedNodes={["saved"]} />
    <TreeView data={[{ id: "export", name: "Export in progress" }]} disabled />
  </>
}`;

const prop = (
  name: string,
  type: string,
  value: string,
  description: string,
) => ({ prop: name, type, default: value, description });

const treeProps = [
  prop(
    "data",
    "TreeNode[]",
    "required",
    "Nodes with globally unique IDs. Treat arrays as immutable.",
  ),
  prop(
    "expandedNodes / defaultExpandedNodes",
    "string[]",
    "[]",
    "Controlled expansion or initial expansion.",
  ),
  prop(
    "onExpandedNodesChange",
    "(ids: string[]) => void",
    "—",
    "Called once for a disclosure action; filtering leaves saved expansion unchanged.",
  ),
  prop(
    "selectedNodes / defaultSelectedNodes",
    "string[]",
    "[]",
    "Controlled selection or initial selection; single mode expects at most one ID.",
  ),
  prop(
    "onSelectionChange",
    "(ids: string[]) => void",
    "—",
    "User selection callback in both modes. Includes selected branch IDs.",
  ),
  prop(
    "onSelect",
    "(node: TreeNode) => void",
    "—",
    "Once per enabled user activation; never on mount or arrow navigation.",
  ),
  prop(
    "selectionMode",
    '"single" | "multiple"',
    '"single"',
    "Multiple mode cascades enabled descendants and derives mixed branches.",
  ),
  prop(
    "size",
    '"default" | "sm"',
    '"default"',
    "36px or 32px minimum rows; one 20px indentation step per level.",
  ),
  prop("showLines", "boolean", "true", "Show nested guide borders."),
  prop(
    "filter",
    "string",
    '""',
    "Case-insensitive name search retaining ancestors; searches loaded data only.",
  ),
  prop(
    "disabled / readOnly",
    "boolean",
    "false",
    "Disabled blocks changes. Read only permits browsing and expansion, prevents selection.",
  ),
  prop(
    "loading",
    "boolean",
    "false",
    "Reserve a loading region and announce its text.",
  ),
  prop(
    "emptyMessage",
    "string",
    '"No items to display."',
    "Empty dataset guidance; filtering uses a separate no-match message.",
  ),
  prop(
    "aria-label / aria-describedby",
    "string",
    '"Files" / undefined',
    "Accessible tree name and optional description ID.",
  ),
  prop("className", "string", "—", "Classes on the outer wrapper."),
];

export default function TreeViewPage() {
  return (
    <ComponentPage>
      <PageHeader
        title="Tree View"
        description="Browse nested documents, select complete branches, and find files in context."
        version="2.0.1"
      />
      <FeatureGrid features={treeViewPageFeatureGridFeatures} />
      <DemoTabs defaultValue="basic" tabs={treeViewPageDemoTabsTabs} />
      <KeyboardShortcuts shortcuts={treeViewPageKeyboardShortcutsShortcuts} />
      <UsageBlock code={kiraCode} />
      <UsageBlock title="Primitive usage" code={basicCode} />
      <APIReference sections={treeViewPageAPIReferenceSections} />
      <Changelog entries={treeViewPageChangelogEntries} />
    </ComponentPage>
  );
}

// Static demo metadata stays co-located and follows its source constants.
const treeViewPageFeatureGridFeatures = [
  {
    title: "Keyboard navigation",
    description: "One tab stop with arrows, Home/End and typeahead.",
    icon: <IconHierarchy className="size-5 text-muted-foreground" />,
  },
  {
    title: "Branch selection",
    description: "Mixed states and disabled-document exclusions.",
    icon: <IconCheckbox className="size-5 text-muted-foreground" />,
  },
  {
    title: "Find in context",
    description: "Search nested names while retaining their ancestors.",
    icon: <IconSearch className="size-5 text-muted-foreground" />,
  },
] satisfies ReactComponentProps<typeof FeatureGrid>["features"];

const treeViewPageDemoTabsTabs = [
  {
    value: "explorer",
    label: "Explorer",
    demo: (
      <DemoWrapper title="Explorer" code={explorerCode}>
        <ExplorerDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "basic",
    label: "Basic",
    demo: (
      <DemoWrapper title="Documents" code={basicCode}>
        <BasicDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "selection",
    label: "Selection",
    demo: (
      <DemoWrapper title="Export" code={selectionCode}>
        <SelectionDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "controlled",
    label: "Controlled",
    demo: (
      <DemoWrapper title="Controlled" code={controlledCode}>
        <ControlledDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "kira",
    label: "Kira",
    demo: (
      <DemoWrapper
        title="Search"
        description="Try “interviews”. Clear search to restore your previous expansion."
        code={kiraCode}
      >
        <KiraDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "states",
    label: "States",
    demo: (
      <DemoWrapper title="States" code={statesCode}>
        <StatesDemo />
      </DemoWrapper>
    ),
  },
] satisfies ReactComponentProps<typeof DemoTabs>["tabs"];

const treeViewPageKeyboardShortcutsShortcuts = [
  {
    keys: "Tab / Shift+Tab",
    description: "Enter or leave the tree using its single tab stop.",
  },
  {
    keys: "↑ / ↓",
    description: "Kira: focus previous or next visible row without selecting.",
  },
  {
    keys: "→ / ←",
    description: "Kira: expand or focus first child; collapse or focus parent.",
  },
  {
    keys: "Home / End",
    description: "Kira: focus the first or last visible row.",
  },
  {
    keys: "Enter / Space",
    description:
      "Kira: Enter opens folders or selects files; Space selects the row or enabled branch.",
  },
  {
    keys: "Type letters",
    description:
      "Kira: find the next visible name. Repeated letters cycle matches.",
  },
] satisfies ReactComponentProps<typeof KeyboardShortcuts>["shortcuts"];

const treeViewPageChangelogEntries = [
  {
    version: "2.0.1",
    date: "10 November 2026",
    changes: [
      {
        type: "fixed",
        title: "Accessibility verification fixes",
        description:
          "Stronger unchecked checkbox boundaries and focus rings; mixed selection exposed on selection buttons; read-only instructions use a supported accessible description; demo headings and manifest button contrast corrected.",
      },
    ],
  },
  {
    version: "2.0.0",
    date: "10 November 2026",
    changes: [
      {
        type: "added",
        title:
          "Controlled state, keyboard navigation, mixed branch selection and KiraTreeView search",
        description:
          "Audited against Base UI 1.9.0 (October 9, 2026). Disclosure uses Base UI Collapsible; tree navigation belongs to Kira.",
      },
      {
        type: "breaking",
        title: "Selection and disclosure are separate actions",
        description:
          "Folder row click and Enter toggle expansion. Space selects; multiple mode also has separate selection boxes. Arrow keys navigate and disclose. onSelect fires once; onSelectionChange fires on user actions in both modes, no longer on mount. Disabled descendants are excluded and parent selection is derived.",
      },
      {
        type: "changed",
        title: "Long labels wrap and folders use semantic colors",
        description:
          "All existing exports remain. New slots, reduced-motion gating and applicable states replace the legacy checkbox tab stops.",
      },
    ],
  },
] satisfies ReactComponentProps<typeof Changelog>["entries"];

const treeViewPageAPIReferenceSections = [
  { title: "TreeView / TreeViewProps", props: treeProps },
  {
    title: "KiraTreeView / KiraTreeViewProps",
    props: [
      ...treeProps.filter((row) => row.prop !== "filter"),
      prop(
        "title",
        "string",
        '"Documents"',
        "Visible heading and default accessible tree name.",
      ),
      prop(
        "searchLabel",
        "string",
        '"Find documents"',
        "Persistent visible search label.",
      ),
    ],
  },
  {
    title: "TreeNode",
    props: [
      prop(
        "id / name",
        "string",
        "required",
        "Globally unique identifier and visible name.",
      ),
      prop(
        "icon",
        "ReactNode",
        "file/folder icon",
        "Decorative icon; hidden from assistive technology.",
      ),
      prop("children", "TreeNode[]", "[]", "Loaded child nodes."),
      prop(
        "isFile",
        "boolean",
        "false",
        "Leaf node; ignores children when true.",
      ),
      prop(
        "disabled",
        "boolean",
        "false",
        "Cannot select this node or cascade into its subtree; remains focusable for explanation.",
      ),
      prop(
        "disabledReason",
        "string",
        "—",
        "Visible explanation, included in the accessible name.",
      ),
    ],
  },
  {
    title: "treeViewVariants",
    props: [
      prop(
        "size",
        '"default" | "sm"',
        '"default"',
        "Exported cva row-density styling shared by TreeView and KiraTreeView.",
      ),
    ],
  },
] satisfies React.ComponentProps<typeof APIReference>["sections"];
