import type { ComponentProps as ReactComponentProps } from "react";
import * as React from "react";
import {
  IconSearch,
  IconFileText,
  IconSettings,
  IconCopy,
  IconDeviceFloppy,
  IconPlus,
  IconArrowBackUp,
} from "@tabler/icons-react";

import {
  KiraMenubar,
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarGroup,
  MenubarLabel,
  MenubarItem,
  MenubarCheckboxItem,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarSub,
  MenubarSubTrigger,
  MenubarSubContent,
  type KiraMenubarMenuData,
} from "@/components/ui/menubar";
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

function BasicDemo() {
  return (
    <Menubar aria-label="File actions">
      <MenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent>
          <MenubarGroup>
            <MenubarLabel>File</MenubarLabel>
            <MenubarItem>New document</MenubarItem>
            <MenubarItem>Open…</MenubarItem>
            <MenubarItem>Close</MenubarItem>
          </MenubarGroup>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Edit</MenubarTrigger>
        <MenubarContent>
          <MenubarGroup>
            <MenubarLabel>Edit</MenubarLabel>
            <MenubarItem>Undo</MenubarItem>
            <MenubarItem>Redo</MenubarItem>
          </MenubarGroup>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}

function VariantsDemo() {
  return (
    <div className="flex flex-wrap items-start gap-6">
      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground">default</p>
        <Menubar aria-label="Default menubar">
          <MenubarMenu>
            <MenubarTrigger>File</MenubarTrigger>
            <MenubarContent>
              <MenubarItem>New</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      </div>
      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground">outline</p>
        <Menubar variant="outline" aria-label="Outline menubar">
          <MenubarMenu>
            <MenubarTrigger>File</MenubarTrigger>
            <MenubarContent>
              <MenubarItem>New</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      </div>
      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground">
          soft · compact
        </p>
        <Menubar
          variant="soft"
          density="compact"
          aria-label="Soft compact menubar"
        >
          <MenubarMenu>
            <MenubarTrigger>File</MenubarTrigger>
            <MenubarContent>
              <MenubarItem>New</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      </div>
    </div>
  );
}

function ItemsDemo() {
  return (
    <Menubar aria-label="Document items">
      <MenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent>
          <MenubarItem icon={<IconPlus />} shortcut="Ctrl+N">
            New document
          </MenubarItem>
          <MenubarItem icon={<IconDeviceFloppy />} shortcut="Ctrl+S">
            Save draft
          </MenubarItem>
          <MenubarItem
            disabled
            disabledReason="Only workspace owners can publish documents."
          >
            Publish
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem variant="destructive">Delete document</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}

function PreferencesDemo() {
  const [details, setDetails] = React.useState(true);
  const [density, setDensity] = React.useState("comfortable");

  return (
    <div className="space-y-4">
      <Menubar aria-label="View preferences">
        <MenubarMenu>
          <MenubarTrigger>View</MenubarTrigger>
          <MenubarContent>
            <MenubarCheckboxItem checked={details} onCheckedChange={setDetails}>
              Document details
            </MenubarCheckboxItem>
            <MenubarSeparator />
            <MenubarRadioGroup
              value={density}
              onValueChange={setDensity}
              aria-label="Menu density"
            >
              <MenubarRadioItem value="comfortable">
                Comfortable
              </MenubarRadioItem>
              <MenubarRadioItem value="compact">Compact</MenubarRadioItem>
            </MenubarRadioGroup>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
      <p className="text-sm text-muted-foreground">
        details: {String(details)} · density: {density}
      </p>
    </div>
  );
}

function SubmenuDemo() {
  const [notice, setNotice] = React.useState("Nothing exported yet.");

  return (
    <div className="space-y-4">
      <Menubar aria-label="Export commands">
        <MenubarMenu>
          <MenubarTrigger>File</MenubarTrigger>
          <MenubarContent>
            <MenubarSub>
              <MenubarSubTrigger>Export</MenubarSubTrigger>
              <MenubarSubContent>
                <MenubarItem
                  onClick={() => setNotice("Markdown export selected.")}
                >
                  Markdown
                </MenubarItem>
                <MenubarItem
                  onClick={() => setNotice("Plain text export selected.")}
                >
                  Plain text
                </MenubarItem>
              </MenubarSubContent>
            </MenubarSub>
            <MenubarItem
              disabled
              disabledReason="Save a draft before printing."
            >
              Print document
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
      <output className="block text-sm text-muted-foreground">{notice}</output>
    </div>
  );
}

function SearchDemo() {
  return (
    <KiraMenubar
      commandSearch
      rootProps={{ "aria-label": "Workspace commands" }}
      menus={searchDemoKiraMenubarMenus}
    />
  );
}

function KiraDemo() {
  const [notice, setNotice] = React.useState("No command run yet.");

  const menus: KiraMenubarMenuData[] = [
    {
      id: "file",
      label: "File",
      items: [
        {
          type: "action",
          id: "new",
          label: "New document",
          icon: <IconPlus />,
          onSelect: () => setNotice("New document ready."),
        },
        {
          type: "action",
          id: "save",
          label: "Save draft",
          icon: <IconDeviceFloppy />,
          onSelect: async () => {
            await new Promise((resolve) => {
              setTimeout(resolve, 1500);
            });
            setNotice("Draft saved.");
          },
          successMessage: "Draft saved on this device.",
        },
      ],
    },
    {
      id: "edit",
      label: "Edit",
      items: [
        {
          type: "action",
          id: "copy",
          label: "Copy as text",
          icon: <IconCopy />,
          onSelect: () => setNotice("Document copied."),
        },
        {
          type: "action",
          id: "undo",
          label: "Undo new document",
          icon: <IconArrowBackUp />,
          onSelect: () => setNotice("Previous document restored."),
        },
      ],
    },
  ];

  return (
    <div className="space-y-4">
      <KiraMenubar
        menus={menus}
        rootProps={{ "aria-label": "Document commands" }}
        onActionError={() => setNotice("The action could not finish.")}
      />
      <output className="block text-sm text-muted-foreground">{notice}</output>
    </div>
  );
}

function StressDemo() {
  return (
    <div className="max-w-xs space-y-6">
      <div className="space-y-2">
        <p className="text-sm font-medium">Long labels and permissions</p>
        <KiraMenubar
          menus={stressDemoKiraMenubarMenus}
          commandSearch
          rootProps={{ "aria-label": "Workspace stress commands" }}
        />
      </div>
      <div className="space-y-2">
        <p className="text-sm font-medium">Read-only workspace</p>
        <KiraMenubar
          menus={stressDemoKiraMenubarMenus}
          rootProps={{ disabled: true, "aria-label": "Read-only commands" }}
        />
      </div>
      <div className="space-y-2">
        <p className="text-sm font-medium">No available commands</p>
        <KiraMenubar
          menus={[]}
          rootProps={{ "aria-label": "Empty commands" }}
        />
      </div>
    </div>
  );
}

const basicCode = `import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarGroup,
  MenubarLabel,
  MenubarItem,
} from "@/components/ui/menubar";

export function BasicMenubar() {
  return (
    <Menubar aria-label="File actions">
      <MenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent>
          <MenubarGroup>
            <MenubarLabel>File</MenubarLabel>
            <MenubarItem>New document</MenubarItem>
            <MenubarItem>Open…</MenubarItem>
            <MenubarItem>Close</MenubarItem>
          </MenubarGroup>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Edit</MenubarTrigger>
        <MenubarContent>
          <MenubarGroup>
            <MenubarLabel>Edit</MenubarLabel>
            <MenubarItem>Undo</MenubarItem>
            <MenubarItem>Redo</MenubarItem>
          </MenubarGroup>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}`;

const variantsCode = `import { Menubar, MenubarMenu, MenubarTrigger, MenubarContent, MenubarItem } from "@/components/ui/menubar";

// variant: "default" | "outline" | "soft"; density: "comfortable" | "compact"
<Menubar variant="soft" density="compact" aria-label="Soft compact menubar">
  <MenubarMenu>
    <MenubarTrigger>File</MenubarTrigger>
    <MenubarContent>
      <MenubarItem>New</MenubarItem>
    </MenubarContent>
  </MenubarMenu>
</Menubar>`;

const itemsCode = `import { Menubar, MenubarMenu, MenubarTrigger, MenubarContent, MenubarItem, MenubarSeparator } from "@/components/ui/menubar";

<Menubar aria-label="Document items">
  <MenubarMenu>
    <MenubarTrigger>File</MenubarTrigger>
    <MenubarContent>
      <MenubarItem icon={<IconPlus />} shortcut="Ctrl+N">
        New document
      </MenubarItem>
      <MenubarItem icon={<IconDeviceFloppy />} shortcut="Ctrl+S">
        Save draft
      </MenubarItem>
      <MenubarItem disabled disabledReason="Only workspace owners can publish documents.">
        Publish
      </MenubarItem>
      <MenubarSeparator />
      <MenubarItem variant="destructive">Delete document</MenubarItem>
    </MenubarContent>
  </MenubarMenu>
</Menubar>`;

const preferencesCode = `import { useState } from "react";
import {
  Menubar, MenubarMenu, MenubarTrigger, MenubarContent,
  MenubarCheckboxItem, MenubarRadioGroup, MenubarRadioItem, MenubarSeparator,
} from "@/components/ui/menubar";

export function ViewMenu() {
  const [details, setDetails] = useState(true);
  const [density, setDensity] = useState("comfortable");
  return (
    <Menubar aria-label="View preferences">
      <MenubarMenu>
        <MenubarTrigger>View</MenubarTrigger>
        <MenubarContent>
          <MenubarCheckboxItem checked={details} onCheckedChange={setDetails}>
            Document details
          </MenubarCheckboxItem>
          <MenubarSeparator />
          <MenubarRadioGroup value={density} onValueChange={setDensity} aria-label="Menu density">
            <MenubarRadioItem value="comfortable">Comfortable</MenubarRadioItem>
            <MenubarRadioItem value="compact">Compact</MenubarRadioItem>
          </MenubarRadioGroup>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}`;

const submenuCode = `import {
  Menubar, MenubarMenu, MenubarTrigger, MenubarContent,
  MenubarSub, MenubarSubTrigger, MenubarSubContent, MenubarItem,
} from "@/components/ui/menubar";

<Menubar aria-label="Export commands">
  <MenubarMenu>
    <MenubarTrigger>File</MenubarTrigger>
    <MenubarContent>
      <MenubarSub>
        <MenubarSubTrigger>Export</MenubarSubTrigger>
        <MenubarSubContent>
          <MenubarItem>Markdown</MenubarItem>
          <MenubarItem>Plain text</MenubarItem>
        </MenubarSubContent>
      </MenubarSub>
      <MenubarItem disabled disabledReason="Save a draft before printing.">
        Print document
      </MenubarItem>
    </MenubarContent>
  </MenubarMenu>
</Menubar>`;

const searchCode = `import { KiraMenubar, type KiraMenubarMenuData } from "@/components/ui/menubar";

const menus: KiraMenubarMenuData[] = [
  {
    id: "workspace",
    label: "Workspace",
    searchable: true,
    items: [
      { type: "action", id: "new", label: "New document", onSelect: () => {} },
      { type: "action", id: "copy", label: "Copy link", onSelect: () => {} },
      { type: "action", id: "archive", label: "Archive project", onSelect: () => {} },
    ],
  },
];

<KiraMenubar
  commandSearch
  rootProps={{ "aria-label": "Workspace commands" }}
  menus={menus}
/>`;

const kiraCode = `import { useState } from "react";
import { KiraMenubar, type KiraMenubarMenuData } from "@/components/ui/menubar";

export function DocumentMenubar() {
  const [notice, setNotice] = useState("No command run yet.");
  const menus: KiraMenubarMenuData[] = [
    {
      id: "file",
      label: "File",
      items: [
        {
          type: "action",
          id: "new",
          label: "New document",
          icon: <IconPlus />,
          onSelect: () => setNotice("New document ready."),
        },
        {
          type: "action",
          id: "save",
          label: "Save draft",
          icon: <IconDeviceFloppy />,
          onSelect: async () => {
            setNotice("Draft saved.");
          },
          successMessage: "Draft saved on this device.",
        },
      ],
    },
  ];
  return (
    <KiraMenubar
      menus={menus}
      rootProps={{ "aria-label": "Document commands" }}
      onActionError={() => setNotice("The action could not finish.")}
    />
  );
}`;

const stressCode = `import { KiraMenubar, type KiraMenubarMenuData } from "@/components/ui/menubar";

const menus: KiraMenubarMenuData[] = [
  {
    id: "workspace",
    label: "Workspace",
    searchable: true,
    items: [
      {
        type: "action",
        id: "long",
        label: "Export the complete November release notes and review history",
        onSelect: () => {},
      },
      {
        type: "action",
        id: "restricted",
        label: "Transfer ownership",
        disabled: true,
        disabledReason: "Only the current owner can transfer this workspace.",
        onSelect: () => {},
      },
    ],
  },
];

export function MenubarStressCases() {
  return (
    <div className="max-w-xs space-y-6">
      <KiraMenubar menus={menus} commandSearch />
      <KiraMenubar menus={menus} rootProps={{ disabled: true }} />
      <KiraMenubar menus={[]} />
    </div>
  );
}`;

const usageCode = `import { KiraMenubar, type KiraMenubarMenuData } from "@/components/ui/menubar";

export function DocumentMenus() {
  const menus: KiraMenubarMenuData[] = [
    {
      id: "file",
      label: "File",
      items: [
        {
          type: "action",
          id: "save",
          label: "Save draft",
          onSelect: () => window.localStorage.setItem("draft", "A new draft"),
        },
      ],
    },
  ];

  return (
    <KiraMenubar
      menus={menus}
      commandSearch
      rootProps={{
        variant: "soft",
        density: "comfortable",
        "aria-label": "Document commands",
      }}
    />
  );
}`;

export default function MenubarPage() {
  return (
    <ComponentPage>
      <PageHeader
        title="Menubar"
        description="A command surface for document editors and workspaces. Familiar menus, useful preferences, and one place to find the action you need."
        version="v2.1.1"
      />

      <FeatureGrid
        features={menubarPageFeatures}
        description="Command-surface capabilities built on Base UI Menubar and Menu."
      />

      <DemoTabs tabs={menubarPageDemoTabs} defaultValue="basic" />

      <KeyboardShortcuts
        shortcuts={menubarPageShortcuts}
        description="Keyboard navigation and command-search bindings."
      />

      <UsageBlock
        code={usageCode}
        title="Usage"
        description="Use KiraMenubar for typed command trees or compose Menubar primitives directly."
        notes={[
          {
            label: "KiraMenubar",
            body: "Preferred entry point for workspace menubars with async actions, command search (Ctrl/Cmd K), and shared error recovery.",
          },
          {
            label: "Menubar primitives",
            body: "Compose Menubar, MenubarMenu, MenubarTrigger, and MenubarContent when you need custom layout or custom popup parts.",
          },
        ]}
      />

      <APIReference
        sections={menubarPageAPISections}
        title="API reference"
        description="Props, types, and defaults for KiraMenubar and all Menubar primitives."
      />

      <Changelog
        entries={menubarPageChangelogEntries}
        title="Changelog"
        description="Version history for Menubar."
      />
    </ComponentPage>
  );
}

const searchDemoKiraMenubarMenus = [
  {
    id: "workspace",
    label: "Workspace",
    searchable: true,
    items: [
      {
        type: "action",
        id: "new",
        label: "New document",
        onSelect: () => {},
      },
      {
        type: "action",
        id: "copy",
        label: "Copy link",
        onSelect: () => {},
      },
      {
        type: "action",
        id: "archive",
        label: "Archive project",
        onSelect: () => {},
      },
    ],
  },
] satisfies ReactComponentProps<typeof KiraMenubar>["menus"];

const stressDemoKiraMenubarMenus = [
  {
    id: "workspace",
    label: "Workspace",
    searchable: true,
    items: [
      {
        type: "action",
        id: "long",
        label: "Export the complete November release notes and review history",
        onSelect: () => {},
      },
      {
        type: "action",
        id: "restricted",
        label: "Transfer ownership",
        disabled: true,
        disabledReason: "Only the current owner can transfer this workspace.",
        onSelect: () => {},
      },
    ],
  },
] satisfies ReactComponentProps<typeof KiraMenubar>["menus"];

const menubarPageFeatures = [
  {
    title: "Search across menus",
    description:
      "Find actions from every enabled menu, including nested exports, without learning the menu hierarchy.",
    icon: <IconSearch className="size-4" />,
  },
  {
    title: "Every row state",
    description:
      "Icons, shortcuts, submenus, checkbox and radio preferences, pending actions, and readable disabled reasons.",
    icon: <IconFileText className="size-4" />,
  },
  {
    title: "Composable",
    description:
      "Use the KiraMenubar data API or compose individual parts; preferences and empty states remain readable.",
    icon: <IconSettings className="size-4" />,
  },
] satisfies ReactComponentProps<typeof FeatureGrid>["features"];

const menubarPageDemoTabs = [
  {
    value: "basic",
    label: "Basic",
    group: "Core",
    demo: (
      <DemoWrapper
        title="Basic Menubar"
        description="Labelled groups of items across sibling menus."
        code={basicCode}
      >
        <BasicDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "variants",
    label: "Variants",
    group: "Core",
    demo: (
      <DemoWrapper
        title="Variants & Density"
        description="default, outline and soft surfaces; compact density shrinks trigger height."
        code={variantsCode}
      >
        <VariantsDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "items",
    label: "Items",
    group: "Core",
    demo: (
      <DemoWrapper
        title="Item Features"
        description="Icons, shortcut hints, disabled reasons and destructive rows."
        code={itemsCode}
      >
        <ItemsDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "preferences",
    label: "Preferences",
    group: "Core",
    demo: (
      <DemoWrapper
        title="Checkbox & Radio Items"
        description="Preference rows stay open on change; the live state prints below."
        code={preferencesCode}
      >
        <PreferencesDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "submenu",
    label: "Submenu",
    group: "Core",
    demo: (
      <DemoWrapper
        title="Submenus"
        description="A nested menu placed on the logical end side; Escape closes the inner menu first."
        code={submenuCode}
      >
        <SubmenuDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "kira",
    label: "KiraMenubar",
    group: "KiraMenubar",
    demo: (
      <DemoWrapper
        title="KiraMenubar"
        description="Data-driven menus with the shared async lifecycle: pending row, success message, error retry."
        code={kiraCode}
      >
        <KiraDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "search",
    label: "Search",
    group: "KiraMenubar",
    demo: (
      <DemoWrapper
        title="Command Search"
        description="A searchable menu plus the Commands trigger; Ctrl/Cmd K toggles it while the menubar has focus."
        code={searchCode}
      >
        <SearchDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "stress",
    label: "Stress Cases",
    group: "Behavior",
    demo: (
      <DemoWrapper
        title="Stress Cases"
        description="Long labels, permission-gated rows, a read-only workspace, and an empty command set inside a max-w-xs container."
        code={stressCode}
      >
        <StressDemo />
      </DemoWrapper>
    ),
  },
] satisfies ReactComponentProps<typeof DemoTabs>["tabs"];

const menubarPageShortcuts = [
  {
    keys: "Left / Right",
    description: "Move between menus; inherited from Base UI.",
  },
  {
    keys: "Up / Down",
    description: "Navigate commands; inherited from Base UI.",
  },
  {
    keys: "Home / End",
    description: "Move to the first or last command; inherited from Base UI.",
  },
  {
    keys: "Enter / Space",
    description: "Open a menu or invoke a command; inherited from Base UI.",
  },
  {
    keys: "Escape",
    description:
      "Close the current menu and restore focus; inherited from Base UI.",
  },
  {
    keys: "Ctrl / Cmd K",
    description:
      "Kira addition: toggle command search while focus is inside the menubar. Requires commandSearch.",
  },
  {
    keys: "Type / Enter",
    description:
      "Filter actions and run the highlighted result in command search; inherited from Base UI filtering.",
  },
] satisfies ReactComponentProps<typeof KeyboardShortcuts>["shortcuts"];

const menubarPrimitiveAPISections = [
  {
    title: "MenubarMenu",
    props: [
      {
        prop: "open / defaultOpen / onOpenChange",
        type: "MenubarMenuProps",
        default: "-",
        description:
          "Control one top-level menu. Keyboard coordination belongs to the parent Menubar.",
      },
    ],
  },
  {
    title: "MenubarPortal",
    props: [
      {
        prop: "keepMounted / container",
        type: "MenubarPortalProps",
        default: "-",
        description:
          "Retain a popup after closing or choose its portal container. Content normally creates its own portal.",
      },
    ],
  },
  {
    title: "MenubarTrigger",
    props: [
      {
        prop: "disabled / render / className",
        type: "MenubarTriggerProps",
        default: "-",
        description:
          "A named top-level button, with native disabled state and optional render composition.",
      },
    ],
  },
  {
    title: "MenubarContent",
    props: [
      {
        prop: "side / align / sideOffset / alignOffset",
        type: "MenubarContentProps",
        default: "-",
        description:
          "Popup placement. Portal, positioner, collision handling and balanced padding are included.",
      },
      {
        prop: "keepMounted / showBackdrop / portalProps / positionerProps",
        type: "MenubarContentProps",
        default: "-",
        description: "Mounting, overlay and advanced primitive configuration.",
      },
    ],
  },
  {
    title: "MenubarGroup",
    props: [
      {
        prop: "children",
        type: "React.ReactNode",
        default: "-",
        description: "Group related rows and their MenubarLabel.",
      },
    ],
  },
  {
    title: "MenubarLabel",
    props: [
      {
        prop: "inset / children",
        type: "boolean / React.ReactNode",
        default: "false",
        description:
          "A group heading. Place inside MenubarGroup; inset aligns with indicator rows.",
      },
    ],
  },
  {
    title: "MenubarItem",
    props: [
      {
        prop: "onClick / closeOnClick",
        type: "MenubarItemProps",
        default: "closeOnClick: true",
        description: "Run an action; closing on activation defaults to true.",
      },
      {
        prop: "icon / shortcut / loading / disabledReason / variant",
        type: "MenubarItemProps",
        default: "-",
        description:
          "Leading icon, trailing hint, pending state, readable permission explanation and default/destructive appearance.",
      },
    ],
  },
  {
    title: "MenubarLinkItem",
    props: [
      {
        prop: "href / target / rel / icon / shortcut",
        type: "MenubarLinkItemProps",
        default: "-",
        description:
          "A native anchor row preserving modifier-click and new-window behavior.",
      },
    ],
  },
  {
    title: "MenubarCheckboxItem",
    props: [
      {
        prop: "checked / defaultChecked / onCheckedChange",
        type: "MenubarCheckboxItemProps",
        default: "-",
        description:
          "An independent preference; closeOnClick defaults to false. Supports disabledReason.",
      },
    ],
  },
  {
    title: "MenubarRadioGroup",
    props: [
      {
        prop: "value / defaultValue / onValueChange",
        type: "MenubarRadioGroupProps",
        default: "-",
        description: "Own the selected value of an exclusive preference group.",
      },
    ],
  },
  {
    title: "MenubarRadioItem",
    props: [
      {
        prop: "value / disabled / disabledReason / closeOnClick",
        type: "MenubarRadioItemProps",
        default: "closeOnClick: false",
        description:
          "One radio option; preference changes keep the popup open by default.",
      },
    ],
  },
  {
    title: "MenubarSeparator",
    props: [
      {
        prop: "className",
        type: "MenubarSeparatorProps['className']",
        default: "-",
        description: "A visual and semantic separator between command groups.",
      },
    ],
  },
  {
    title: "MenubarShortcut",
    props: [
      {
        prop: "children",
        type: "React.ReactNode",
        default: "-",
        description:
          "A trailing keyboard hint. Displaying a hint does not register a key binding.",
      },
    ],
  },
  {
    title: "MenubarSub",
    props: [
      {
        prop: "open / defaultOpen / onOpenChange",
        type: "MenubarSubProps",
        default: "-",
        description: "The primitive root for a nested menu.",
      },
    ],
  },
  {
    title: "MenubarSubTrigger",
    props: [
      {
        prop: "icon / disabled / disabledReason / inset",
        type: "MenubarSubTriggerProps",
        default: "-",
        description:
          "A nested-menu row with its direction indicator and permission explanation.",
      },
    ],
  },
  {
    title: "MenubarSubContent",
    props: [
      {
        prop: "align / sideOffset / alignOffset / keepMounted",
        type: "MenubarSubContentProps",
        default: "-",
        description: "A portalled nested popup placed on the logical end side.",
      },
    ],
  },
  {
    title: "MenubarBackdrop",
    props: [
      {
        prop: "className / style",
        type: "MenubarBackdropProps",
        default: "-",
        description:
          "Optional overlay; showBackdrop on Content provides the common composition.",
      },
    ],
  },
  {
    title: "MenubarArrow",
    props: [
      {
        prop: "className / style",
        type: "MenubarArrowProps",
        default: "-",
        description: "An optional arrow positioned by the popup primitive.",
      },
    ],
  },
  {
    title: "MenubarFilterProvider",
    props: [
      {
        prop: "value / onValueChange / autoHighlight / filter",
        type: "MenubarFilterProviderProps",
        default: "-",
        description:
          "Base UI preview filtering. Wrap the menu root, then place Input and List in its Content.",
      },
    ],
  },
  {
    title: "MenubarInput",
    props: [
      {
        prop: "aria-label / placeholder",
        type: "string",
        default: "-",
        description:
          "The named search field of a menu wrapped in FilterProvider.",
      },
    ],
  },
  {
    title: "MenubarList",
    props: [
      {
        prop: "children",
        type: "React.ReactNode",
        default: "-",
        description: "Place searchable rows and groups here, after the input.",
      },
    ],
  },
  {
    title: "MenubarClear",
    props: [
      {
        prop: "aria-label / children",
        type: "MenubarClearProps",
        default: "-",
        description:
          "Pointer clear control for a nonempty query; keyboard users can select and delete the input text.",
      },
    ],
  },
  {
    title: "MenubarEmpty",
    props: [
      {
        prop: "children",
        type: "React.ReactNode",
        default: "-",
        description: "The zero-match message of a filtered menu.",
      },
    ],
  },
  {
    title: "MenubarViewport",
    props: [
      {
        prop: "children / className",
        type: "MenubarViewportProps",
        default: "-",
        description: "A viewport for shared-popup content transitions.",
      },
    ],
  },
] satisfies ReactComponentProps<typeof APIReference>["sections"];

const menubarPageAPISections = [
  {
    title: "KiraMenubar",
    props: [
      {
        prop: "menus",
        type: "readonly KiraMenubarMenuData[]",
        default: "-",
        description:
          "Menus with IDs, labels, optional icons/disabled/searchable state, and MenuItemData rows.",
      },
      {
        prop: "commandSearch",
        type: "boolean",
        default: "false",
        description:
          "Search actions and links across enabled menus. Nested action groups are included; preference toggles stay in their own menus. Search IDs are namespaced by menu.",
      },
      {
        prop: "rootProps",
        type: "MenubarProps",
        default: "-",
        description:
          "Root appearance, density, accessibility name and primitive options.",
      },
      {
        prop: "onActionError",
        type: "(error: unknown, item: MenuActionItem) => void",
        default: "-",
        description:
          "Receive a failed command; the popup keeps the shared retry action.",
      },
    ],
  },
  {
    title: "Menubar",
    props: [
      {
        prop: "variant",
        type: "'default' | 'outline' | 'soft'",
        default: "'default'",
        description:
          "Bordered surface, a flat outline, or a quiet inset menu strip.",
      },
      {
        prop: "density",
        type: "'comfortable' | 'compact'",
        default: "'comfortable'",
        description:
          "Changes the trigger height and spacing without changing keyboard semantics.",
      },
      {
        prop: "orientation / loopFocus / disabled / modal",
        type: "MenubarPrimitive.Props",
        default: "-",
        description: "Native Base UI coordination and interaction options.",
      },
    ],
  },
  ...menubarPrimitiveAPISections,
  {
    title: "Variants and handles",
    props: [
      {
        prop: "menubarVariants / menubarTriggerVariants / menubarContentVariants / menubarItemVariants",
        type: "cva",
        default: "-",
        description:
          "Exported styling recipes; content and item recipes share the dropdown implementation.",
      },
      {
        prop: "createDropdownMenuHandle",
        type: "<Payload>() => Menu.Handle<Payload>",
        default: "-",
        description:
          "Connect detached triggers to one popup; re-exported from dropdown-menu.",
      },
    ],
  },
] satisfies ReactComponentProps<typeof APIReference>["sections"];

const menubarPageChangelogEntries = [
  {
    version: "2.1.1",
    date: "8 November 2026",
    changes: [
      {
        type: "changed",
        title: "One demo per feature",
        description:
          "Replaced the workspace-scene demos with focused per-feature tabs (basic, variants, items, preferences, submenu, search, Kira, stress cases) matching the dropdown-menu demo structure. Demo components and their snippets live in the page file; page padding no longer overrides ComponentPage. No API changes.",
      },
    ],
  },
  {
    version: "2.1.0",
    date: "7 November 2026",
    changes: [
      {
        type: "added",
        title: "Command search and appearance controls",
        description:
          "Search actions across enabled menus, scoped Ctrl/Cmd K, soft/outline surfaces and comfortable/compact density. Built on Base UI Menu filtering, audited on 1.9.0. No removed APIs.",
      },
      {
        type: "changed",
        title: "A workspace you can use",
        description:
          "Replaced placeholder menu rows with a working draft, independent preferences, an export submenu, shared command search and a dedicated stress cases tab. Examples use their live source.",
      },
    ],
  },
  {
    version: "2.0.1",
    date: "7 November 2026",
    changes: [
      {
        type: "fixed",
        title: "Menu ownership and async actions",
        description:
          "Restored one menu root per data menu, inherited modality, async close/cancel/retry and state callback classes.",
      },
    ],
  },
  {
    version: "2.0.0",
    date: "6 November 2026",
    changes: [
      {
        type: "breaking",
        title: "Base UI Menubar foundation",
        description:
          "Rebuilt on the dedicated Base UI Menubar; KiraMenubar replaced MenubarWithContent.",
      },
    ],
  },
] satisfies ReactComponentProps<typeof Changelog>["entries"];
