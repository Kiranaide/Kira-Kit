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

/* -------------------------------------------------------------------------- */
/*                              Demo components                               */
/* -------------------------------------------------------------------------- */

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
      aria-label="Workspace commands"
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

function StatesDemo() {
  const menus: KiraMenubarMenuData[] = [
    {
      id: "workspace",
      label: "Workspace",
      searchable: true,
      items: [
        {
          type: "action",
          id: "long",
          label:
            "Export the complete November release notes and review history",
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

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm font-medium">Long labels and permissions</p>
        <KiraMenubar menus={menus} commandSearch />
      </div>
      <div className="space-y-2">
        <p className="text-sm font-medium">Read-only workspace</p>
        <KiraMenubar
          menus={menus}
          rootProps={{ disabled: true, "aria-label": "Read-only commands" }}
        />
      </div>
      <div className="space-y-2">
        <p className="text-sm font-medium">No available commands</p>
        <KiraMenubar menus={[]} />
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                              Demo code snippets                            */
/* -------------------------------------------------------------------------- */

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
    </Menubar>
  );
}`;

const variantsCode = `import { Menubar, MenubarMenu, MenubarTrigger, MenubarContent, MenubarItem } from "@/components/ui/menubar";

// variant: "default" | "outline" | "soft"; density: "comfortable" | "compact"
<Menubar variant="soft" density="compact" aria-label="Commands">
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
    id: "workspace", label: "Workspace", searchable: true,
    items: [
      { type: "action", id: "new", label: "New document" },
      { type: "action", id: "copy", label: "Copy link" },
      { type: "action", id: "archive", label: "Archive project" },
    ],
  },
];

// commandSearch adds a Commands trigger (Ctrl/Cmd K while the menubar has focus)
// that searches actions across every enabled menu.
<KiraMenubar commandSearch menus={menus} aria-label="Workspace commands" />`;

const kiraCode = `import { useState } from "react";
import { KiraMenubar, type KiraMenubarMenuData } from "@/components/ui/menubar";

export function DocumentMenubar() {
  const [notice, setNotice] = useState("No command run yet.");
  const menus: KiraMenubarMenuData[] = [
    {
      id: "file", label: "File", items: [
        { type: "action", id: "new", label: "New document", icon: <IconPlus />,
          onSelect: () => setNotice("New document ready.") },
        { type: "action", id: "save", label: "Save draft", icon: <IconDeviceFloppy />,
          onSelect: async () => { /* await persistence */ setNotice("Draft saved."); } },
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

const statesCode = `import { KiraMenubar, type KiraMenubarMenuData } from "@/components/ui/menubar";

const menus: KiraMenubarMenuData[] = [
  {
    id: "workspace", label: "Workspace", searchable: true,
    items: [
      { type: "action", id: "long",
        label: "Export the complete November release notes and review history",
        onSelect: () => {} },
      { type: "action", id: "restricted", label: "Transfer ownership",
        disabled: true,
        disabledReason: "Only the current owner can transfer this workspace.",
        onSelect: () => {} },
    ],
  },
];

export function MenubarStates() {
  return (
    <div className="space-y-6">
      <KiraMenubar menus={menus} commandSearch />
      <KiraMenubar menus={menus} rootProps={{ disabled: true }} />
      <KiraMenubar menus={[]} />
    </div>
  );
}`;

const usageCode = `import { KiraMenubar, type KiraMenubarMenuData } from "@/components/ui/menubar";

export function DocumentMenus() {
  const menus: KiraMenubarMenuData[] = [{
    id: "file", label: "File", items: [{
      type: "action", id: "save", label: "Save draft",
      onSelect: () => window.localStorage.setItem("draft", "A new draft"),
    }],
  }];
  return <KiraMenubar menus={menus} commandSearch rootProps={{ variant: "soft", density: "comfortable", "aria-label": "Document commands" }} />;
}`;

/* -------------------------------------------------------------------------- */
/*                                   Page                                     */
/* -------------------------------------------------------------------------- */

const primitiveApi = [
  {
    title: "MenubarMenu",
    props: [
      {
        prop: "open / defaultOpen / onOpenChange",
        type: "MenubarMenuProps",
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
        description:
          "Popup placement. Portal, positioner, collision handling and balanced padding are included.",
      },
      {
        prop: "keepMounted / showBackdrop / portalProps / positionerProps",
        type: "MenubarContentProps",
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
        description: "Run an action; closing on activation defaults to true.",
      },
      {
        prop: "icon / shortcut / loading / disabledReason / variant",
        type: "MenubarItemProps",
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
        description: "A viewport for shared-popup content transitions.",
      },
    ],
  },
];

const features = [
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
];

const demoTabs = [
  {
    value: "basic",
    label: "Basic",
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
    value: "search",
    label: "Search",
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
    value: "kira",
    label: "Kira",
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
    value: "states",
    label: "States",
    demo: (
      <DemoWrapper
        title="Stress Cases"
        description="Long labels, permission-gated rows, a read-only workspace and an empty command set."
        code={statesCode}
      >
        <StatesDemo />
      </DemoWrapper>
    ),
  },
];

const keyboardShortcuts = [
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
];

const apiSections = [
  {
    title: "KiraMenubar",
    props: [
      {
        prop: "menus",
        type: "readonly KiraMenubarMenuData[]",
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
        description:
          "Root appearance, density, accessibility name and primitive options.",
      },
      {
        prop: "onActionError",
        type: "(error: unknown, item: MenuActionItem) => void",
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
        description: "Native Base UI coordination and interaction options.",
      },
    ],
  },
  ...primitiveApi,
  {
    title: "Variants and handles",
    props: [
      {
        prop: "menubarVariants / menubarTriggerVariants / menubarContentVariants / menubarItemVariants",
        type: "cva",
        description:
          "Exported styling recipes; content and item recipes share the dropdown implementation.",
      },
      {
        prop: "createDropdownMenuHandle",
        type: "<Payload>() => Menu.Handle<Payload>",
        description:
          "Connect detached triggers to one popup; re-exported from dropdown-menu.",
      },
    ],
  },
];

export default function MenubarPage() {
  return (
    <ComponentPage>
      <PageHeader
        title="Menubar"
        description="A command surface for document editors and workspaces. Familiar menus, useful preferences, and one place to find the action you need."
        version="v2.1.1"
      />

      <FeatureGrid features={features} />

      <DemoTabs tabs={demoTabs} defaultValue="basic" />

      <KeyboardShortcuts shortcuts={keyboardShortcuts} />

      <UsageBlock code={usageCode} />

      <APIReference sections={apiSections} />

      <Changelog entries={menubarPageChangelogEntries} />
    </ComponentPage>
  );
}

// Static demo metadata stays co-located and follows its source constants.
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

const menubarPageChangelogEntries = [
  {
    version: "v2.1.1",
    date: "8 November 2026",
    changes: [
      {
        type: "changed",
        title: "One demo per feature",
        description:
          "Replaced the workspace-scene demos with focused per-feature tabs (basic, variants, items, preferences, submenu, search, Kira, states) matching the dropdown-menu demo structure. Demo components and their snippets live in the page file; page padding no longer overrides ComponentPage. No API changes.",
      },
    ],
  },
  {
    version: "v2.1.0",
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
          "Replaced placeholder menu rows with a working draft, independent preferences, an export submenu, shared command search and a dedicated states tab. Examples use their live source.",
      },
    ],
  },
  {
    version: "v2.0.1",
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
    version: "v2.0.0",
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
