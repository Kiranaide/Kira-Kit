import type { ComponentProps as ReactComponentProps } from "react";
import * as React from "react";
import {
  IconCalendar,
  IconChartBar,
  IconFile,
  IconFolder,
  IconHome,
  IconInbox,
  IconPlus,
  IconSettings,
  IconUsers,
} from "@tabler/icons-react";
import {
  KiraSidebar,
  Sidebar,
  SidebarBadge,
  SidebarContent,
  SidebarDivider,
  SidebarEmpty,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarItem,
  SidebarItemGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarProvider,
  SidebarSearch,
  SidebarSkeleton,
  SidebarTrigger,
  SidebarUser,
  ThemeToggle,
  useSidebar,
  type SidebarProviderProps,
  type SidebarSection,
  type SidebarVariant,
  type CollapsibleMode,
  type SidebarSide,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  APIReference,
  Changelog,
  ComponentPage,
  DemoTabs,
  DemoWrapper,
  FeatureGrid,
  KeyboardShortcuts,
  PageHeader,
  UsageBlock,
} from "@/components/docs";

const controlClass =
  "min-h-9 rounded-lg border border-input bg-background px-3 py-1.5 text-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50";

function PreviewToolbar() {
  const resolveValue1 = () => {
    if (collapsible === "none") {
      return "Fixed navigation" as const;
    }

    if (collapsed) {
      return "Compact navigation" as const;
    }

    return "Expanded navigation" as const;
  };

  const { collapsed, collapsible } = useSidebar();

  return (
    <div className="flex min-h-12 items-center gap-2 border-b px-3 py-2">
      <SidebarTrigger showOnDesktop />
      <span className="text-xs text-muted-foreground">{resolveValue1()}</span>
    </div>
  );
}

function SidebarPreview({
  children,
  detail,
  ...props
}: SidebarProviderProps & { detail?: React.ReactNode }) {
  return (
    <SidebarProvider
      persistState={false}
      mobile={false}
      width="min(16rem, 100cqw)"
      {...props}
      className="@container min-w-0 overflow-hidden rounded-xl border border-border"
    >
      <PreviewToolbar />
      <div
        className={
          props.side === "right"
            ? "flex h-[32rem] flex-row-reverse"
            : "flex h-[32rem]"
        }
      >
        {children}
        <div className="hidden min-w-0 flex-1 space-y-3 bg-background p-6 md:block">
          <p className="text-sm font-medium">Workspace preview</p>
          <div className="text-sm leading-6 text-muted-foreground">
            {detail ??
              "Use the navigation to choose a view. Collapse it to keep more room for your work."}
          </div>
        </div>
      </div>
      <div className="border-t bg-background p-3 text-sm leading-6 text-muted-foreground md:hidden">
        {detail ??
          "Use the navigation to choose a view. Collapse it to keep more room for your work."}
      </div>
    </SidebarProvider>
  );
}

const previewCode = `import * as React from "react";
import { SidebarProvider, SidebarTrigger, useSidebar, type SidebarProviderProps } from "@/components/ui/sidebar";

function PreviewToolbar() {
  const { collapsed, collapsible } = useSidebar();
  return <div className="flex min-h-12 items-center gap-2 border-b px-3 py-2">
    <SidebarTrigger showOnDesktop />
    <span className="text-xs text-muted-foreground">{collapsible === "none" ? "Fixed navigation" : collapsed ? "Compact navigation" : "Expanded navigation"}</span>
  </div>;
}

function SidebarPreview({ children, detail, ...props }: SidebarProviderProps & { detail?: React.ReactNode }) {
  return <SidebarProvider persistState={false} mobile={false} width="min(16rem, 100cqw)" {...props} className="@container min-w-0 overflow-hidden rounded-xl border border-border">
    <PreviewToolbar />
    <div className={props.side === "right" ? "flex h-[32rem] flex-row-reverse" : "flex h-[32rem]"}>
      {children}
      <div className="hidden min-w-0 flex-1 space-y-3 bg-background p-6 md:block">
        <p className="text-sm font-medium">Workspace preview</p>
        <div className="text-sm leading-6 text-muted-foreground">{detail ?? "Use the navigation to choose a view. Collapse it to keep more room for your work."}</div>
      </div>
    </div>
    <div className="border-t bg-background p-3 text-sm leading-6 text-muted-foreground md:hidden">
      {detail ?? "Use the navigation to choose a view. Collapse it to keep more room for your work."}
    </div>
  </SidebarProvider>;
}
`;

function BasicDemo() {
  const [view, setView] = React.useState("Inbox");

  return (
    <SidebarPreview detail={`Selected view: ${view}`}>
      <Sidebar aria-label="Product navigation">
        <SidebarHeader title="Product" />
        <SidebarContent>
          <SidebarGroup label="Your work">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  icon={<IconInbox />}
                  badge={0}
                  isActive={view === "Inbox"}
                  aria-current={view === "Inbox" ? "page" : undefined}
                  onClick={() => setView("Inbox")}
                >
                  Inbox
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  icon={<IconHome />}
                  isActive={view === "My issues"}
                  aria-current={view === "My issues" ? "page" : undefined}
                  onClick={() => setView("My issues")}
                >
                  My issues
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  icon={<IconCalendar />}
                  isActive={view === "Current cycle"}
                  aria-current={view === "Current cycle" ? "page" : undefined}
                  onClick={() => setView("Current cycle")}
                >
                  Current cycle
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarUser name="Alex Morgan" email="Product team" />
        </SidebarFooter>
      </Sidebar>
    </SidebarPreview>
  );
}

const basicCode =
  previewCode +
  `
import { IconCalendar, IconHome, IconInbox } from "@tabler/icons-react";
import { Sidebar, SidebarHeader, SidebarContent, SidebarGroup, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarFooter, SidebarUser } from "@/components/ui/sidebar";
export function BasicDemo() {
  const [view, setView] = React.useState("Inbox");
  return <SidebarPreview detail={\`Selected view: \${view}\`}>
    <Sidebar aria-label="Product navigation">
      <SidebarHeader title="Product" />
      <SidebarContent><SidebarGroup label="Your work"><SidebarMenu>
        <SidebarMenuItem><SidebarMenuButton icon={<IconInbox />} badge={0} isActive={view === "Inbox"} aria-current={view === "Inbox" ? "page" : undefined} onClick={() => setView("Inbox")}>Inbox</SidebarMenuButton></SidebarMenuItem>
        <SidebarMenuItem><SidebarMenuButton icon={<IconHome />} isActive={view === "My issues"} aria-current={view === "My issues" ? "page" : undefined} onClick={() => setView("My issues")}>My issues</SidebarMenuButton></SidebarMenuItem>
        <SidebarMenuItem><SidebarMenuButton icon={<IconCalendar />} isActive={view === "Current cycle"} aria-current={view === "Current cycle" ? "page" : undefined} onClick={() => setView("Current cycle")}>Current cycle</SidebarMenuButton></SidebarMenuItem>
      </SidebarMenu></SidebarGroup></SidebarContent>
      <SidebarFooter><SidebarUser name="Alex Morgan" email="Product team" /></SidebarFooter>
    </Sidebar>
  </SidebarPreview>;
}`;

function ModesDemo() {
  const [mode, setMode] = React.useState<CollapsibleMode>("icon");
  const [variant, setVariant] = React.useState<SidebarVariant>("default");
  const [side, setSide] = React.useState<SidebarSide>("left");
  const [peek, setPeek] = React.useState(false);

  return (
    <div className="space-y-4">
      <ModesControlsSection
        mode={mode}
        setMode={setMode}
        variant={variant}
        setVariant={setVariant}
        side={side}
        setSide={setSide}
        peek={peek}
        setPeek={setPeek}
      />
      <ModesControlsSection2
        mode={mode}
        side={side}
        peek={peek}
        variant={variant}
      />
    </div>
  );
}

const modesCode =
  previewCode +
  `
import { IconHome, IconFile } from "@tabler/icons-react";
import { Sidebar, SidebarHeader, SidebarContent, SidebarItem } from "@/components/ui/sidebar";
export function ModesDemo() {
  return <SidebarPreview collapsible="icon" side="right" hoverExpand>
    <Sidebar variant="floating">
      <SidebarHeader title="Navigation" />
      <SidebarContent>
        <SidebarItem to="/components/sidebar" icon={<IconHome />}>Sidebar documentation</SidebarItem>
        <SidebarItem to="/components/command" icon={<IconFile />}>Command documentation</SidebarItem>
      </SidebarContent>
    </Sidebar>
  </SidebarPreview>;
}
// Requires the TanStack Router used by SidebarItem.
// Change collapsible to "offcanvas" or "none", and variant to "default" or "inset".
`;

const sections: SidebarSection[] = [
  {
    id: "work",
    label: "Your work",
    items: [
      {
        id: "inbox",
        label: "Inbox",
        icon: <IconInbox />,
        badge: 3,
        keywords: ["notifications", "updates"],
      },
      {
        id: "issues",
        label: "My issues",
        icon: <IconHome />,
        keywords: ["assigned", "tasks"],
      },
      {
        id: "cycle",
        label: "Current cycle",
        icon: <IconCalendar />,
        keywords: ["sprint"],
      },
    ],
  },
  {
    id: "team",
    label: "Product team",
    items: [
      {
        id: "roadmap",
        label: "Roadmap",
        icon: <IconChartBar />,
        keywords: ["planning", "quarter"],
      },
      {
        id: "research",
        label: "Customer research",
        icon: <IconUsers />,
        keywords: ["interviews", "insights"],
      },
      {
        id: "releases",
        label: "Release notes",
        icon: <IconFile />,
        keywords: ["changelog", "shipping"],
      },
    ],
  },
];

const sectionsCode = `
import { IconInbox, IconHome, IconCalendar, IconChartBar, IconUsers, IconFile } from "@tabler/icons-react";
import { KiraSidebar, type SidebarSection } from "@/components/ui/sidebar";
const sections: SidebarSection[] = [
  { id: "work", label: "Your work", items: [
    { id: "inbox", label: "Inbox", icon: <IconInbox />, badge: 3, keywords: ["notifications", "updates"] },
    { id: "issues", label: "My issues", icon: <IconHome />, keywords: ["assigned", "tasks"] },
    { id: "cycle", label: "Current cycle", icon: <IconCalendar />, keywords: ["sprint"] },
  ] },
  { id: "team", label: "Product team", items: [
    { id: "roadmap", label: "Roadmap", icon: <IconChartBar />, keywords: ["planning", "quarter"] },
    { id: "research", label: "Customer research", icon: <IconUsers />, keywords: ["interviews", "insights"] },
    { id: "releases", label: "Release notes", icon: <IconFile />, keywords: ["changelog", "shipping"] },
  ] },
];
`;

function SearchDemo() {
  const [query, setQuery] = React.useState("");

  return (
    <SidebarPreview
      defaultCollapsed
      detail={
        <>
          <p>
            Try “sprint” to find Current cycle, or “interviews” to find Customer
            research.
          </p>
          <p className="mt-3">Query: {query || "No search"}</p>
        </>
      }
    >
      <KiraSidebar
        title="Product"
        sections={sections}
        favorites={false}
        searchValue={query}
        onSearchValueChange={setQuery}
      />
    </SidebarPreview>
  );
}

const searchCode =
  previewCode +
  sectionsCode +
  `
export function SearchDemo() {
  const [query, setQuery] = React.useState("");
  return <SidebarPreview defaultCollapsed detail={\`Query: \${query || "No search"}\`}>
    <KiraSidebar title="Product" sections={sections} favorites={false} searchValue={query} onSearchValueChange={setQuery} />
  </SidebarPreview>;
}`;

function FavoritesDemo() {
  const [pinned, setPinned] = React.useState(["cycle", "roadmap", "research"]);

  return (
    <SidebarPreview
      detail={
        <>
          <p>
            Star a view in its original section. Use Reorder favorites to show
            drag handles and arrow buttons.
          </p>
          <p className="mt-3">
            Current order: {pinned.length ? pinned.join(", ") : "No favorites"}
          </p>
        </>
      }
    >
      <KiraSidebar
        title="Your shortcuts"
        sections={sections}
        searchable={false}
        pinnedIds={pinned}
        onPinnedIdsChange={setPinned}
        defaultActiveId="cycle"
      />
    </SidebarPreview>
  );
}

const favoritesCode =
  previewCode +
  sectionsCode +
  `
export function FavoritesDemo() {
  const [pinned, setPinned] = React.useState(["cycle", "roadmap", "research"]);
  return <SidebarPreview detail={\`Current order: \${pinned.join(", ") || "No favorites"}\`}>
    <KiraSidebar title="Your shortcuts" sections={sections} searchable={false} pinnedIds={pinned} onPinnedIdsChange={setPinned} defaultActiveId="cycle" />
  </SidebarPreview>;
}`;

function MotionDemo() {
  const [motion, setMotion] = React.useState(true);
  const [view, setView] = React.useState("Inbox");

  return (
    <div className="space-y-4">
      <label className="flex min-h-9 items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={motion}
          onChange={(event) => setMotion(event.target.checked)}
        />
        Pointer transitions
      </label>
      <SidebarPreview
        motion={motion}
        hoverExpand
        detail={
          <div className="space-y-4">
            <p className="text-base font-medium text-foreground">{view}</p>
            <p>
              Click the collapse control, then reverse it before it settles. The
              workspace keeps its natural text size. Hover the rail, expand,
              move back into the workspace, then collapse again; the peek must
              not stay open.
            </p>
            <p>
              In the rail, hover to peek. Try a group disclosure or reorder
              favorites. Keyboard actions and reduced motion remain immediate.
            </p>
          </div>
        }
      >
        <KiraSidebar
          title="Product"
          sections={sections}
          defaultActiveId="inbox"
          defaultPinnedIds={["cycle", "roadmap", "research"]}
          onNavigate={(item) => setView(item.label)}
          user={{
            name: "Alex Morgan",
            email: "Product team",
            menuItems: [
              { label: "Profile", onClick: () => setView("Profile") },
              { label: "Preferences", onClick: () => setView("Preferences") },
            ],
          }}
        />
      </SidebarPreview>
    </div>
  );
}

const motionCode =
  previewCode +
  sectionsCode +
  `
export function MotionDemo() {
  return <SidebarPreview motion hoverExpand>
    <KiraSidebar title="Product" sections={sections}
      defaultPinnedIds={["cycle", "roadmap", "research"]} />
  </SidebarPreview>;
}
// Set motion={false} for a completely immediate shell.
// Pointer changes use short, interruption-safe transitions.
// Keyboard changes and prefers-reduced-motion stay immediate.
`;

function GroupsDemo() {
  const [count, setCount] = React.useState(1);
  const [selected, setSelected] = React.useState("No document selected");

  return (
    <SidebarPreview detail={selected}>
      <Sidebar>
        <SidebarHeader title="Team library" />
        <SidebarContent>
          <SidebarGroup
            label="Collections"
            action={
              <button
                type="button"
                aria-label="Add collection"
                className="inline-flex size-8 shrink-0 items-center justify-center rounded-md hover:bg-muted focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
                onClick={() => setCount((previous) => previous + 1)}
              >
                <IconPlus aria-hidden="true" className="size-4" />
              </button>
            }
          >
            {Array.from({ length: count }, (_, index) => (
              <SidebarItemGroup
                key={index}
                label={
                  index === 0 ? "Product guides" : `Collection ${index + 1}`
                }
                icon={<IconFolder />}
                defaultOpen={index === 0}
                badge={2}
              >
                <SidebarMenuItem>
                  <SidebarMenuButton
                    icon={<IconFile />}
                    onClick={() => setSelected("Getting started")}
                  >
                    Getting started
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    icon={<IconFile />}
                    onClick={() => setSelected("Release process")}
                  >
                    Release process
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarItemGroup>
            ))}
          </SidebarGroup>
          <SidebarDivider />
          <SidebarGroup label="Archive" defaultOpen={false}>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  icon={<IconFile />}
                  onClick={() => setSelected("2025 decisions")}
                >
                  2025 decisions
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </SidebarPreview>
  );
}

const groupsCode =
  previewCode +
  `
import { IconFolder, IconFile, IconPlus } from "@tabler/icons-react";
import { Sidebar, SidebarHeader, SidebarContent, SidebarGroup, SidebarItemGroup, SidebarMenuItem, SidebarMenuButton, SidebarDivider, SidebarMenu } from "@/components/ui/sidebar";
export function GroupsDemo() {
  const [count, setCount] = React.useState(1);
  const [selected, setSelected] = React.useState("No document selected");
  return <SidebarPreview detail={selected}><Sidebar><SidebarHeader title="Team library" /><SidebarContent>
    <SidebarGroup label="Collections" action={<button type="button" aria-label="Add collection" onClick={() => setCount((previous) => previous + 1)}><IconPlus aria-hidden="true" /></button>}>
      {Array.from({ length: count }, (_, index) => <SidebarItemGroup key={index} label={index === 0 ? "Product guides" : \`Collection \${index + 1}\`} icon={<IconFolder />} defaultOpen={index === 0} badge={2}>
        <SidebarMenuItem><SidebarMenuButton icon={<IconFile />} onClick={() => setSelected("Getting started")}>Getting started</SidebarMenuButton></SidebarMenuItem>
        <SidebarMenuItem><SidebarMenuButton icon={<IconFile />} onClick={() => setSelected("Release process")}>Release process</SidebarMenuButton></SidebarMenuItem>
      </SidebarItemGroup>)}
    </SidebarGroup>
    <SidebarDivider />
    <SidebarGroup label="Archive" defaultOpen={false}><SidebarMenu><SidebarMenuItem><SidebarMenuButton icon={<IconFile />} onClick={() => setSelected("2025 decisions")}>2025 decisions</SidebarMenuButton></SidebarMenuItem></SidebarMenu></SidebarGroup>
  </SidebarContent></Sidebar></SidebarPreview>;
}`;

function AccountDemo() {
  const [view, setView] = React.useState("Account overview");

  return (
    <SidebarPreview
      defaultCollapsed
      detail={<output className="block">{view}</output>}
    >
      <Sidebar>
        <SidebarHeader title="Acme" />
        <SidebarContent>
          <SidebarMenuButton
            icon={<IconHome />}
            onClick={() => setView("Account overview")}
          >
            Overview
          </SidebarMenuButton>
        </SidebarContent>
        <SidebarFooter>
          <ThemeToggle />
          <SidebarUser
            name="Alex Morgan"
            email="alex@acme.example"
            menuItems={[
              {
                label: "Profile",
                icon: <IconUsers />,
                onClick: () => setView("Profile settings selected"),
              },
              {
                label: "Preferences",
                icon: <IconSettings />,
                onClick: () => setView("Preferences selected"),
              },
              {
                label: "Sidebar documentation",
                icon: <IconFile />,
                href: "/components/sidebar",
              },
            ]}
          />
        </SidebarFooter>
      </Sidebar>
    </SidebarPreview>
  );
}

const accountCode =
  previewCode +
  `
import { IconHome, IconUsers, IconSettings, IconFile } from "@tabler/icons-react";
import { Sidebar, SidebarHeader, SidebarContent, SidebarMenuButton, SidebarFooter, SidebarUser, ThemeToggle } from "@/components/ui/sidebar";
// The application wraps this example in ThemeProvider.
export function AccountDemo() {
  const [view, setView] = React.useState("Account overview");
  return <SidebarPreview defaultCollapsed detail={<p role="status">{view}</p>}>
    <Sidebar><SidebarHeader title="Acme" /><SidebarContent><SidebarMenuButton icon={<IconHome />} onClick={() => setView("Account overview")}>Overview</SidebarMenuButton></SidebarContent><SidebarFooter>
      <ThemeToggle />
      <SidebarUser name="Alex Morgan" email="alex@acme.example" menuItems={[
        { label: "Profile", icon: <IconUsers />, onClick: () => setView("Profile settings selected") },
        { label: "Preferences", icon: <IconSettings />, onClick: () => setView("Preferences selected") },
        { label: "Sidebar documentation", icon: <IconFile />, href: "/components/sidebar" },
      ]} />
    </SidebarFooter></Sidebar>
  </SidebarPreview>;
}`;

function ControlledDemo() {
  const [collapsed, setCollapsed] = React.useState(false);
  const [workspace, setWorkspace] = React.useState("Product");

  const [favorites, setFavorites] = React.useState<Record<string, string[]>>({
    Product: ["cycle"],
    Support: ["inbox", "research"],
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 text-sm">
          Workspace
          <select
            className={controlClass}
            value={workspace}
            onChange={(event) => setWorkspace(event.target.value)}
          >
            <option>Product</option>
            <option>Support</option>
          </select>
        </label>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCollapsed((previous) => !previous)}
        >
          {collapsed ? "Expand from parent" : "Collapse from parent"}
        </Button>
      </div>
      <SidebarPreview
        collapsed={collapsed}
        onCollapsedChange={setCollapsed}
        detail={
          <>
            <p>The caller owns collapse and each workspace’s favorites.</p>
            <p className="mt-3">
              {workspace}:{" "}
              {(favorites[workspace] ?? []).join(", ") || "No favorites"}
            </p>
          </>
        }
      >
        <KiraSidebar
          key={workspace}
          title={workspace}
          sections={sections}
          searchable={false}
          pinnedIds={favorites[workspace] ?? []}
          onPinnedIdsChange={(ids) =>
            setFavorites((previous) => ({ ...previous, [workspace]: ids }))
          }
        />
      </SidebarPreview>
    </div>
  );
}

const controlledCode =
  previewCode +
  sectionsCode +
  `
import { Button } from "@/components/ui/button";
export function ControlledDemo() {
  const [collapsed, setCollapsed] = React.useState(false);
  const [workspace, setWorkspace] = React.useState("Product");
  const [favorites, setFavorites] = React.useState<Record<string, string[]>>({ Product: ["cycle"], Support: ["inbox", "research"] });
  return <div className="space-y-4">
    <label>Workspace <select value={workspace} onChange={(event) => setWorkspace(event.target.value)}><option>Product</option><option>Support</option></select></label>
    <Button variant="outline" onClick={() => setCollapsed((previous) => !previous)}>{collapsed ? "Expand from parent" : "Collapse from parent"}</Button>
    <SidebarPreview collapsed={collapsed} onCollapsedChange={setCollapsed}>
      <KiraSidebar key={workspace} title={workspace} sections={sections} searchable={false} pinnedIds={favorites[workspace] ?? []} onPinnedIdsChange={(ids) => setFavorites((previous) => ({ ...previous, [workspace]: ids }))} />
    </SidebarPreview>
  </div>;
}`;

function MobileDemo() {
  const [selected, setSelected] = React.useState("Inbox");

  return (
    <SidebarProvider mobile persistState={false} defaultCollapsed width="19rem">
      <div className="space-y-5 rounded-xl border border-border bg-muted/20 p-5">
        <div className="flex items-center gap-3">
          <SidebarTrigger />
          <p className="text-sm font-medium">Product workspace</p>
        </div>
        <p className="max-w-prose text-sm leading-6 text-muted-foreground">
          Open navigation. Search, choose a destination, or close it with
          Escape, the close button, or a swipe.
        </p>
        <p className="text-sm">
          Selected view: <strong>{selected}</strong>
        </p>
      </div>
      <KiraSidebar
        title="Product"
        sections={sections}
        defaultActiveId="inbox"
        defaultPinnedIds={["cycle"]}
        onNavigate={(item) => setSelected(item.label)}
        user={{ name: "Alex Morgan", email: "Product team" }}
      />
    </SidebarProvider>
  );
}

const mobileCode =
  `import * as React from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
` +
  sectionsCode +
  `
export function MobileDemo() {
  const [selected, setSelected] = React.useState("Inbox");
  return <SidebarProvider mobile persistState={false} defaultCollapsed width="19rem">
    <div className="space-y-5 rounded-xl border border-border bg-muted/20 p-5">
      <div className="flex items-center gap-3"><SidebarTrigger /><p className="text-sm font-medium">Product workspace</p></div>
      <p className="text-sm text-muted-foreground">Open navigation, choose a destination, or close it with Escape.</p>
      <p className="text-sm">Selected view: <strong>{selected}</strong></p>
    </div>
    <KiraSidebar title="Product" sections={sections} defaultActiveId="inbox" defaultPinnedIds={["cycle"]} onNavigate={(item) => setSelected(item.label)} user={{ name: "Alex Morgan", email: "Product team" }} />
  </SidebarProvider>;
}
// Omit mobile in an application to switch at the 768px viewport breakpoint.
`;

function KiraDemo() {
  const [selected, setSelected] = React.useState("Current cycle");

  return (
    <SidebarPreview
      detail={
        <>
          <p className="text-foreground">{selected}</p>
          <p className="mt-3">
            A compact product workspace: find a view, keep it in Favorites, then
            return to it from the rail.
          </p>
        </>
      }
    >
      <KiraSidebar
        title="Product workspace"
        sections={sections}
        defaultActiveId="cycle"
        defaultPinnedIds={["cycle", "research"]}
        onNavigate={(item) => setSelected(item.label)}
        user={{
          name: "Alex Morgan",
          email: "Product team",
          menuItems: [
            {
              label: "Team preferences",
              icon: <IconSettings />,
              onClick: () => setSelected("Team preferences"),
            },
          ],
        }}
      />
    </SidebarPreview>
  );
}

const kiraCode =
  previewCode +
  sectionsCode +
  `
import { IconSettings } from "@tabler/icons-react";
export function KiraDemo() {
  const [selected, setSelected] = React.useState("Current cycle");
  return <SidebarPreview detail={selected}>
    <KiraSidebar title="Product workspace" sections={sections} defaultActiveId="cycle" defaultPinnedIds={["cycle", "research"]} onNavigate={(item) => setSelected(item.label)} user={{ name: "Alex Morgan", email: "Product team", menuItems: [{ label: "Team preferences", icon: <IconSettings />, onClick: () => setSelected("Team preferences") }] }} />
  </SidebarPreview>;
}`;

function StatesDemo() {
  const [state, setState] = React.useState("ready");

  const stateSections: SidebarSection[] = [
    {
      id: "views",
      label: "Views",
      items: [
        { id: "inbox", label: "Inbox", icon: <IconInbox />, badge: 0 },
        {
          id: "reports",
          label: "Revenue reports",
          icon: <IconChartBar />,
          href: "/components/sidebar?view=reports",
          disabled: true,
          disabledReason: "Ask a workspace owner for report access.",
        },
        {
          id: "archive",
          label: "Archived issues",
          icon: <IconFolder />,
          badge: "Read only",
        },
      ],
    },
  ];

  return (
    <div className="space-y-4">
      <label className="flex flex-wrap items-center gap-2 text-sm">
        Navigation state
        <select
          className={controlClass}
          value={state}
          onChange={(event) => setState(event.target.value)}
        >
          <option value="ready">Ready</option>
          <option value="loading">Loading</option>
          <option value="error">Load error</option>
          <option value="empty">Empty</option>
          <option value="readonly">Managed favorites</option>
        </select>
      </label>
      <SidebarPreview detail="These are local fixtures. Loading uses a synchronized skeleton pulse, paused offscreen and with reduced motion or motion disabled. Try again switches the error fixture to Ready; no server request is made.">
        <KiraSidebar
          title="Operations"
          sections={state === "empty" ? [] : stateSections}
          searchable={false}
          loading={state === "loading"}
          error={
            state === "error"
              ? "We could not load your views. Try again to reload navigation."
              : undefined
          }
          onRetry={() => setState("ready")}
          readOnly={state === "readonly"}
          defaultPinnedIds={["inbox"]}
        />
      </SidebarPreview>
    </div>
  );
}

const statesCode =
  previewCode +
  `
import { IconInbox, IconChartBar, IconFolder } from "@tabler/icons-react";
import { KiraSidebar, type SidebarSection } from "@/components/ui/sidebar";
export function StatesDemo() {
  const [state, setState] = React.useState("ready");
  const stateSections: SidebarSection[] = [{ id: "views", label: "Views", items: [
    { id: "inbox", label: "Inbox", icon: <IconInbox />, badge: 0 },
    { id: "reports", label: "Revenue reports", icon: <IconChartBar />, href: "/components/sidebar?view=reports", disabled: true, disabledReason: "Ask a workspace owner for report access." },
    { id: "archive", label: "Archived issues", icon: <IconFolder />, badge: "Read only" },
  ] }];
  return <div className="space-y-4">
    <label>Navigation state <select value={state} onChange={(event) => setState(event.target.value)}><option value="ready">Ready</option><option value="loading">Loading</option><option value="error">Load error</option><option value="empty">Empty</option><option value="readonly">Managed favorites</option></select></label>
    <SidebarPreview>
      <KiraSidebar title="Operations" sections={state === "empty" ? [] : stateSections} searchable={false} loading={state === "loading"} error={state === "error" ? "We could not load your views. Try again to reload navigation." : undefined} onRetry={() => setState("ready")} readOnly={state === "readonly"} defaultPinnedIds={["inbox"]} />
    </SidebarPreview>
  </div>;
}`;

function StressDemo() {
  const resolveFixture2 = () => {
    if (data === "worst") {
      return stressSections;
    }

    if (data === "empty") {
      return [];
    }

    if (data === "one") {
      return [{ ...sections[0], items: sections[0].items.slice(0, 1) }];
    }

    if (data === "many") {
      return manySections;
    }

    return sections;
  };

  const [data, setData] = React.useState("demo");

  const stressSections: SidebarSection[] = [
    {
      id: "international",
      label: "International operations and customer experience",
      items: [
        {
          id: "long",
          label: "North America enterprise customer onboarding and renewals",
          icon: <IconUsers />,
          badge: "1,284",
        },
        {
          id: "thai",
          label: "โครงการปรับปรุงประสบการณ์ลูกค้า",
          icon: <IconFolder />,
          badge: 0,
        },
        { id: "short", label: "Q", icon: <IconFile />, badge: 1 },
        {
          id: "identifier",
          label: "CustomerExperienceInfrastructureReview",
          icon: <IconChartBar />,
        },
      ],
    },
  ];

  const manySections: SidebarSection[] = [
    {
      id: "projects",
      label: "Project reviews",
      items: Array.from({ length: 40 }, (_, index) => ({
        id: `project-${index}`,
        label: `Customer research project ${index + 1}`,
        icon: <IconFolder />,
      })),
    },
  ];

  const fixture = resolveFixture2();

  return (
    <div className="space-y-4">
      <StressControlsSection data={data} setData={setData} />
      <StressControlsSection2 data={data} fixture={fixture} />
    </div>
  );
}

const stressCode =
  previewCode +
  `
import { IconUsers, IconFolder, IconFile, IconChartBar } from "@tabler/icons-react";
import { KiraSidebar, type SidebarSection } from "@/components/ui/sidebar";
const stressSections: SidebarSection[] = [{ id: "international", label: "International operations and customer experience", items: [
  { id: "long", label: "North America enterprise customer onboarding and renewals", icon: <IconUsers />, badge: "1,284" },
  { id: "thai", label: "โครงการปรับปรุงประสบการณ์ลูกค้า", icon: <IconFolder />, badge: 0 },
  { id: "short", label: "Q", icon: <IconFile />, badge: 1 },
  { id: "identifier", label: "CustomerExperienceInfrastructureReview", icon: <IconChartBar /> },
] }];
export function StressDemo() {
  return <SidebarPreview>
    <KiraSidebar title="Customer experience infrastructure" sections={stressSections} favorites={false} user={{ name: "Aleksandra Wiśniewska-Kowalczyk", email: "alexandra@northwind-industries-holdings.example.com" }} />
  </SidebarPreview>;
}`;

function PartsDemo() {
  const [loading, setLoading] = React.useState(false);
  const [query, setQuery] = React.useState("");

  return (
    <SidebarPreview detail="The search field reports its value; a custom composition owns its own filtering. The empty and loading parts can be used separately.">
      <Sidebar>
        <SidebarHeader title="Custom composition" />
        <SidebarSearch value={query} onChange={setQuery} />
        <SidebarContent>
          <SidebarMenuButton
            icon={<IconSettings />}
            onClick={() => setLoading((previous) => !previous)}
          >
            {loading ? "Show empty state" : "Show loading state"}
          </SidebarMenuButton>
          {loading ? (
            <SidebarSkeleton items={3} />
          ) : (
            <SidebarEmpty
              title={query ? `No results for “${query}”` : "No saved searches"}
            >
              Create a saved search from your project view.
            </SidebarEmpty>
          )}
          <SidebarDivider />
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton icon={<IconFolder />}>
                Reference
              </SidebarMenuButton>
              <SidebarMenuSub>
                <SidebarMenuItem>
                  <SidebarItem to="/components/sidebar" icon={<IconFile />}>
                    Sidebar API
                  </SidebarItem>
                </SidebarMenuItem>
              </SidebarMenuSub>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <div className="flex flex-wrap items-center gap-2 p-2">
            <SidebarBadge variant="success">Synced</SidebarBadge>
            <SidebarBadge variant="warning">Read only</SidebarBadge>
            <SidebarBadge variant="outline">0</SidebarBadge>
          </div>
        </SidebarFooter>
      </Sidebar>
    </SidebarPreview>
  );
}

const partsCode =
  previewCode +
  `
import { IconSettings, IconFolder, IconFile } from "@tabler/icons-react";
import { Sidebar, SidebarHeader, SidebarSearch, SidebarContent, SidebarMenuButton, SidebarSkeleton, SidebarEmpty, SidebarDivider, SidebarMenu, SidebarMenuItem, SidebarMenuSub, SidebarItem, SidebarFooter, SidebarBadge } from "@/components/ui/sidebar";
export function PartsDemo() {
  const [loading, setLoading] = React.useState(false);
  const [query, setQuery] = React.useState("");
  return <SidebarPreview><Sidebar><SidebarHeader title="Custom composition" /><SidebarSearch value={query} onChange={setQuery} /><SidebarContent>
    <SidebarMenuButton icon={<IconSettings />} onClick={() => setLoading((previous) => !previous)}>{loading ? "Show empty state" : "Show loading state"}</SidebarMenuButton>
    {loading ? <SidebarSkeleton items={3} /> : <SidebarEmpty title={query ? \`No results for “\${query}”\` : "No saved searches"}>Create a saved search from your project view.</SidebarEmpty>}
    <SidebarDivider />
    <SidebarMenu><SidebarMenuItem><SidebarMenuButton icon={<IconFolder />}>Reference</SidebarMenuButton><SidebarMenuSub><SidebarMenuItem><SidebarItem to="/components/sidebar" icon={<IconFile />}>Sidebar API</SidebarItem></SidebarMenuItem></SidebarMenuSub></SidebarMenuItem></SidebarMenu>
  </SidebarContent><SidebarFooter><div className="flex flex-wrap gap-2 p-2"><SidebarBadge variant="success">Synced</SidebarBadge><SidebarBadge variant="warning">Read only</SidebarBadge><SidebarBadge variant="outline">0</SidebarBadge></div></SidebarFooter></Sidebar></SidebarPreview>;
}`;

const apiSections: React.ComponentProps<typeof APIReference>["sections"] = [
  {
    title: "SidebarProvider",
    props: [
      {
        prop: "children, className, style, div props",
        type: "React.ComponentProps<'div'> (except ref)",
        description:
          "Provider wrapper. Give its sidebar layout a bounded height; native handlers are composed.",
      },
      {
        prop: "collapsible",
        type: '"icon" | "offcanvas" | "none"',
        default: '"icon"',
        description:
          "Desktop collapse behavior. Fixed mode ignores collapse requests.",
      },
      {
        prop: "side",
        type: '"left" | "right"',
        default: '"left"',
        description:
          "Border, peek and drawer side. Place the sidebar on that side in your flex layout.",
      },
      {
        prop: "collapsed / defaultCollapsed / onCollapsedChange",
        type: "boolean / boolean / (collapsed: boolean) => void",
        default: "uncontrolled / false",
        description:
          "Controlled or initial desktop collapse. A controlled caller owns persistence.",
      },
      {
        prop: "openMobile / onOpenMobileChange",
        type: "boolean / (open: boolean) => void",
        default: "uncontrolled, false",
        description:
          "Control the mobile drawer independently from desktop collapse.",
      },
      {
        prop: "persistState / storageKey",
        type: "boolean / string",
        default: 'true / "kira-sidebar-collapsed"',
        description:
          "Persist uncontrolled collapse changes. Use a key per workspace. Unavailable storage falls back to in-memory state.",
      },
      {
        prop: "width / collapsedWidth",
        type: "string / string",
        default: '"16rem" / "4rem"',
        description:
          "CSS lengths. The demo uses container units so embedded navigation fits narrow panels.",
      },
      {
        prop: "hoverExpand",
        type: "boolean",
        default: "false",
        description:
          "Peek over content on mouse hover or keyboard focus in icon mode.",
      },
      {
        prop: "motion",
        type: "boolean",
        default: "true",
        description:
          "Short pointer transitions for layout, disclosures and surfaces. Keyboard interactions and reduced motion are always immediate; false disables sidebar-owned motion.",
      },
      {
        prop: "mobile",
        type: "boolean | undefined",
        default: "viewport < 768px",
        description:
          "Override responsive mode for an embedded preview. Omit in a normal application.",
      },
      {
        prop: "keyboardShortcut / shortcutScope",
        type: 'string | false / "provider" | "global"',
        default: '"b" / "provider"',
        description:
          "Cmd/Ctrl plus the chosen key toggles. Cmd/Ctrl+K focuses available search. Editable targets, repeats, composing input and handled events are ignored. Use at most one global provider.",
      },
    ],
  },
  {
    title: "Sidebar",
    props: [
      {
        prop: "variant",
        type: '"default" | "floating" | "inset"',
        default: '"default"',
        description: "Desktop surface; mobile uses the shared Drawer surface.",
      },
      {
        prop: "children, className, style, aria-label, nav props",
        type: "React.ComponentProps<'nav'> (except ref and id)",
        description:
          "Navigation element. IDs are provider-owned; the desktop frame reserves width, while navigation fills the parent height.",
      },
    ],
  },
  {
    title: "SidebarTrigger",
    props: [
      {
        prop: "showOnDesktop",
        type: "boolean",
        default: "false",
        description: "Also render on collapsible desktop layouts.",
      },
      {
        prop: "button props",
        type: "React.ComponentProps<'button'>",
        description:
          "Named button with expanded state and provider-owned controls ID. onClick can prevent the built-in toggle.",
      },
    ],
  },
  {
    title: "SidebarHeader",
    props: [
      {
        prop: "title / logo / children",
        type: "string / React.ReactNode / React.ReactNode",
        description: "Wrapping brand name, logo and optional extra content.",
      },
      {
        prop: "showToggle / sticky",
        type: "boolean / boolean",
        default: "true / false",
        description:
          "Desktop collapse button and optional sticky positioning. The mobile drawer supplies its own close button.",
      },
      {
        prop: "div props",
        type: "React.ComponentProps<'div'>",
        description: "Forwarded to the header root.",
      },
    ],
  },
  {
    title: "SidebarContent",
    props: [
      {
        prop: "showScrollTop",
        type: "boolean",
        default: "true",
        description: "Show a named scroll-to-top button after scrolling 100px.",
      },
      {
        prop: "div props",
        type: "React.ComponentProps<'div'> (except ref and id)",
        description:
          "Scroll container with provider-owned ID, min-height zero and overscroll containment.",
      },
    ],
  },
  {
    title: "SidebarSearch",
    props: [
      {
        prop: "value / defaultValue / onChange",
        type: "string / string / (value: string) => void",
        default: 'uncontrolled / ""',
        description:
          "Query state. onChange also fires in uncontrolled mode. Standalone search does not filter siblings automatically.",
      },
      {
        prop: "label / placeholder",
        type: "string / string",
        default: '"Search navigation" / "Find a view…"',
        description:
          "Visible label and hint. Rail search expands and focuses the input.",
      },
      {
        prop: "input props",
        type: "React.ComponentProps<'input'> (except ref, onChange, size, value, defaultValue)",
        description:
          "Forwarded input attributes. Escape clears a nonempty query; focus stays in search.",
      },
    ],
  },
  {
    title: "SidebarGroup",
    props: [
      {
        prop: "label / children",
        type: "string / React.ReactNode",
        description:
          "Group name and contents. ItemGroup children are list items inside SidebarMenuSub.",
      },
      {
        prop: "open / defaultOpen / onOpenChange",
        type: "boolean / boolean / (open: boolean) => void",
        default: "uncontrolled / Group: true, ItemGroup: false",
        description:
          "Base UI disclosure. Closed content leaves the tab order; no artificial height cap.",
      },
      {
        prop: "action (Group only)",
        type: "React.ReactNode",
        description:
          "Sibling action beside the disclosure trigger; never nested inside it.",
      },
      {
        prop: "div props",
        type: "React.ComponentProps<'div'>",
        description: "Forwarded to the group root.",
      },
    ],
  },
  {
    title: "SidebarItemGroup",
    props: [
      {
        prop: "label / children",
        type: "string / React.ReactNode",
        description:
          "Group name and contents. ItemGroup children are list items inside SidebarMenuSub.",
      },
      {
        prop: "open / defaultOpen / onOpenChange",
        type: "boolean / boolean / (open: boolean) => void",
        default: "uncontrolled / Group: true, ItemGroup: false",
        description:
          "Base UI disclosure. Closed content leaves the tab order; no artificial height cap.",
      },
      {
        prop: "icon / badge / badgeVariant (ItemGroup)",
        type: "React.ReactNode / React.ReactNode / SidebarBadgeVariant",
        description:
          "Nested group icon/count. Rail activation requests expansion and opens the group.",
      },
      {
        prop: "div props",
        type: "React.ComponentProps<'div'>",
        description: "Forwarded to the group root.",
      },
    ],
  },
  {
    title: "SidebarItem",
    props: [
      {
        prop: "to",
        type: "string",
        description:
          "TanStack Router destination. Requires the application router; matching is exact.",
      },
      {
        prop: "children / icon / badge / shortcut",
        type: "React.ReactNode / React.ReactNode / React.ReactNode / string",
        description:
          "Accessible label, decorative icon, count (including zero), and display-only key hint.",
      },
      {
        prop: "isActive / disabled / disabledReason",
        type: "boolean / boolean / string",
        description:
          "Optional active override, blocked navigation and visible unavailable reason. Disabled links remain focusable to explain availability.",
      },
      {
        prop: "level / closeMobileOnClick",
        type: "number / boolean",
        default: "0 / true",
        description:
          "Expanded indentation (clamped to 6 levels) and mobile close after ordinary activation.",
      },
      {
        prop: "badgeVariant",
        type: '"default" | "secondary" | "destructive" | "outline" | "success" | "warning"',
        default: '"default"',
        description: "Count appearance.",
      },
      {
        prop: "anchor props",
        type: "React.ComponentProps<'a'> (except href)",
        description:
          "Native anchor attributes; the caller can prevent navigation in onClick.",
      },
    ],
  },
  {
    title: "SidebarMenu",
    props: [
      {
        prop: "ul props",
        type: "React.ComponentProps<'ul'>",
        description: "Native navigation list, not an ARIA application menu.",
      },
    ],
  },
  {
    title: "SidebarMenuItem",
    props: [
      {
        prop: "li props",
        type: "React.ComponentProps<'li'>",
        description:
          "Native list item. Put it inside SidebarMenu or SidebarMenuSub.",
      },
    ],
  },
  {
    title: "SidebarMenuSub",
    props: [
      {
        prop: "ul props",
        type: "React.ComponentProps<'ul'>",
        description:
          "Nested list. Hides in icon mode; nest it within a list item or SidebarItemGroup.",
      },
    ],
  },
  {
    title: "SidebarMenuButton",
    props: [
      {
        prop: "children / icon / badge / badgeVariant",
        type: "React.ReactNode / React.ReactNode / React.ReactNode / SidebarBadgeVariant",
        description:
          "Shared row content and badge styling; rail labels remain accessible.",
      },
      {
        prop: "isActive / disabledReason",
        type: "boolean / string",
        default: "false",
        description:
          "Visual current state and visible unavailable explanation. Set aria-current for navigation or aria-pressed for toggles.",
      },
      {
        prop: "Base UI Button props",
        type: "Button.Props (className is string)",
        description:
          "Includes disabled, focusableWhenDisabled, onClick, ref and render/nativeButton composition. Set nativeButton=false when rendering an anchor.",
      },
    ],
  },
  {
    title: "SidebarDivider",
    props: [
      {
        prop: "hr props",
        type: "React.ComponentProps<'hr'>",
        description: "Semantic separator.",
      },
    ],
  },
  {
    title: "SidebarFooter",
    props: [
      {
        prop: "div props",
        type: "React.ComponentProps<'div'>",
        description:
          "Non-scrolling footer; native attributes and handlers reach this root.",
      },
      {
        prop: "sticky (Footer)",
        type: "boolean",
        default: "false",
        description: "Optional sticky bottom positioning.",
      },
    ],
  },
  {
    title: "SidebarUser",
    props: [
      {
        prop: "name / email / avatar",
        type: "string / string / string | React.ReactNode",
        description:
          "Wrapping identity text and optional image URL or avatar content. Missing/broken images use a neutral avatar fallback.",
      },
      {
        prop: "menuItems",
        type: "Array<{ label: string; icon?: React.ReactNode; onClick?: () => void; href?: string; destructive?: boolean }>",
        description:
          "Native Base UI account menu in both widths. href renders a link; omitted items render a static profile.",
      },
      {
        prop: "div props",
        type: "React.ComponentProps<'div'> (except children)",
        description: "Forwarded to the profile root.",
      },
    ],
  },
  {
    title: "ThemeProvider",
    props: [
      {
        prop: "ThemeProvider.children",
        type: "React.ReactNode",
        description:
          "Application-level light/dark state; validates stored values and handles denied local storage.",
      },
    ],
  },
  {
    title: "useTheme",
    props: [
      {
        prop: "useTheme()",
        type: "{ theme: 'light' | 'dark'; toggleTheme: () => void }",
        description: "Requires ThemeProvider.",
      },
    ],
  },
  {
    title: "ThemeToggle",
    props: [
      {
        prop: "ThemeToggle props",
        type: "SidebarMenuButtonProps (except icon, children, onClick)",
        description:
          "Requires both providers. Named theme switch with a label in the rail.",
      },
    ],
  },
  {
    title: "SidebarBadge",
    props: [
      {
        prop: "Badge.variant / size",
        type: '"default" | "secondary" | "destructive" | "outline" | "success" | "warning" / "default" | "sm" | "dot"',
        default: '"default" / "default"',
        description:
          "Semantic count/status colors; dot hides visible children. Span props forwarded.",
      },
    ],
  },
  {
    title: "SidebarSkeleton",
    props: [
      {
        prop: "Skeleton.items",
        type: "number",
        default: "5",
        description:
          "Static reserved rows, clamped to 1–30. Busy label and div props forwarded.",
      },
    ],
  },
  {
    title: "SidebarEmpty",
    props: [
      {
        prop: "Empty.title / children / action",
        type: "string / React.ReactNode / React.ReactNode",
        default: '"No views yet"',
        description:
          "Contextual message and recovery action. Text stays accessible in icon mode; expand to use actions. Div props forwarded.",
      },
    ],
  },
  {
    title: "KiraSidebar",
    props: [
      {
        prop: "sections",
        type: "readonly SidebarSection[]",
        description:
          "{ id, label, items, defaultOpen? }; items have globally unique id, label, optional icon, href, keywords, badge, badgeVariant, disabled and disabledReason.",
      },
      {
        prop: "title / logo / header / footer / user",
        type: "string / React.ReactNode / React.ReactNode / React.ReactNode / SidebarUserProps",
        default: '"Workspace"',
        description:
          "Composed parts; header/footer overrides replace defaults. Use within SidebarProvider.",
      },
      {
        prop: "activeId / defaultActiveId / onNavigate",
        type: "string / string / (item: SidebarNavItem) => void",
        description:
          "Controlled or local current destination. href stays a real link; the caller owns routing and application content.",
      },
      {
        prop: "searchable / searchLabel / searchValue / onSearchValueChange",
        type: "boolean / string / string / (value: string) => void",
        default: 'true / "Search navigation"',
        description:
          "Search labels, section names and keywords, ignoring case/diacritics. Nonempty search reveals matching groups.",
      },
      {
        prop: "favorites / pinnedIds / defaultPinnedIds / onPinnedIdsChange",
        type: "boolean / readonly string[] / readonly string[] / (ids: string[]) => void",
        default: "true / uncontrolled / []",
        description:
          "Controlled or local ordered favorites. Unknown/duplicate favorite IDs are omitted. Persist server/workspace preferences in the caller.",
      },
      {
        prop: "reorderable / readOnly",
        type: "boolean / boolean",
        default: "true / false",
        description:
          "Reorder mode exposes drag handles and arrow buttons. Read-only freezes personalization while navigation still works.",
      },
      {
        prop: "loading / error / onRetry / emptyMessage",
        type: "boolean / string / () => void / string",
        default:
          'false / undefined / undefined / "Views will appear here when they are available."',
        description:
          "Loading, error and empty content. The caller performs real fetching; the component never simulates requests.",
      },
      {
        prop: "Sidebar props",
        type: "SidebarProps (except children)",
        description:
          "Includes variant, className and navigation ARIA attributes.",
      },
    ],
  },
  {
    title: "useSidebar",
    props: [
      {
        prop: "useSidebar()",
        type: "SidebarContextValue",
        description:
          "Requires SidebarProvider. Exposes collapsed/setCollapsed, isMobile, openMobile/setOpenMobile, toggleSidebar, expanded, side, widths, collapsible, hover state, reducedMotion, provider IDs and focusSearch.",
      },
    ],
  },
  {
    title: "Variant recipes",
    props: [
      {
        prop: "sidebarVariants / sidebarMenuButtonVariants / sidebarActionVariants / badgeVariants",
        type: "cva functions",
        description:
          "Surface (variant/side), row (isActive/compact), icon action, and badge (variant/size) class recipes.",
      },
    ],
  },
];

const usageCode = `import * as React from "react";
import { IconInbox, IconCalendar, IconFolder, IconFile } from "@tabler/icons-react";
import {
  ThemeProvider, useTheme, SidebarProvider, useSidebar, SidebarTrigger,
  KiraSidebar, Sidebar, SidebarHeader, SidebarSearch, SidebarContent,
  SidebarGroup, SidebarItemGroup, SidebarMenu, SidebarMenuItem,
  SidebarMenuButton, SidebarMenuSub, SidebarItem, SidebarDivider,
  SidebarFooter, SidebarUser, ThemeToggle, SidebarBadge,
  SidebarSkeleton, SidebarEmpty,
} from "@/components/ui/sidebar";

export function WorkspaceLayout() {
  const [view, setView] = React.useState("inbox");
  return <ThemeProvider><SidebarProvider storageKey="acme-product-navigation" shortcutScope="global" className="flex h-dvh flex-col">
    <header className="flex items-center gap-2 border-b p-3"><SidebarTrigger showOnDesktop />Product workspace</header>
    <div className="flex min-h-0 flex-1">
      <KiraSidebar title="Product" activeId={view} onNavigate={(item) => setView(item.id)} defaultPinnedIds={["cycle"]} sections={[
        { id: "work", label: "Your work", items: [
          { id: "inbox", label: "Inbox", icon: <IconInbox />, badge: 3 },
          { id: "cycle", label: "Current cycle", icon: <IconCalendar />, keywords: ["sprint"] },
        ] },
      ]} />
      <main className="min-w-0 flex-1 overflow-auto p-6">Current view: {view}</main>
    </div>
  </SidebarProvider></ThemeProvider>;
}

// Alternative: compose the parts inside the same providers and TanStack Router.
// Loading is caller-owned; this example's button toggles a local fixture.
export function CustomNavigation() {
  const [loading, setLoading] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const { expanded } = useSidebar();
  const { theme } = useTheme();
  return <Sidebar aria-label="Library navigation">
    <SidebarHeader title="Library" />
    <SidebarSearch value={query} onChange={setQuery} />
    <SidebarContent aria-busy={loading || undefined}>
      <SidebarMenuButton icon={<IconCalendar />} onClick={() => setLoading((previous) => !previous)}>
        {loading ? "Show loaded views" : "Preview loading"}
      </SidebarMenuButton>
      {loading ? <SidebarSkeleton items={3} /> : query ? <SidebarEmpty title="No saved searches" action={<SidebarMenuButton onClick={() => setQuery("")}>Clear search</SidebarMenuButton>}>Create a saved search from your project view.</SidebarEmpty> : <>
        <SidebarGroup label="Reference"><SidebarMenu>
          <SidebarMenuItem><SidebarItem to="/components/sidebar" icon={<IconInbox />}>Sidebar API</SidebarItem></SidebarMenuItem>
          <SidebarMenuItem><SidebarMenuButton icon={<IconFolder />}>Reference</SidebarMenuButton>
            <SidebarMenuSub><SidebarMenuItem><SidebarItem to="/components/collapsible" icon={<IconFile />}>Disclosure API</SidebarItem></SidebarMenuItem></SidebarMenuSub>
          </SidebarMenuItem>
        </SidebarMenu></SidebarGroup>
        <SidebarItemGroup label="Guides" icon={<IconFolder />} defaultOpen>
          <SidebarMenuItem><SidebarItem to="/components/command" icon={<IconFile />}>Command API</SidebarItem></SidebarMenuItem>
        </SidebarItemGroup>
      </>}
      <SidebarDivider />
      <ThemeToggle />
    </SidebarContent>
    <SidebarFooter>
      {expanded && <SidebarBadge variant="outline">{theme}</SidebarBadge>}
      <SidebarUser name="Alex Morgan" email="Product team" />
    </SidebarFooter>
  </Sidebar>;
}
`;

export default function SidebarPage() {
  return (
    <ComponentPage>
      <PageHeader
        title="Sidebar"
        version="3.1.2"
        description="Navigation that stays close to your work. Search views, keep personal favorites, and move between a compact rail and a mobile drawer."
      />
      <FeatureGrid features={sidebarPageFeatureGridFeatures} />
      <DemoTabs defaultValue="basic" lazyMount tabs={sidebarPageDemoTabsTabs} />
      <KeyboardShortcuts shortcuts={sidebarPageKeyboardShortcutsShortcuts} />
      <UsageBlock
        code={usageCode}
        description="A responsive application shell. Each feature tab includes a standalone composition example."
      />
      <APIReference sections={apiSections} />
      <Changelog entries={sidebarPageChangelogEntries} />
    </ComponentPage>
  );
}

// Static demo metadata stays co-located and follows its source constants.
const sidebarPageFeatureGridFeatures = [
  {
    title: "Personal shortcuts",
    description:
      "Pin useful views and reorder them with drag handles or visible arrow buttons.",
  },
  {
    title: "Find your place",
    description:
      "Search labels and keywords, with clear current-page and unavailable states.",
  },
  {
    title: "A smaller footprint",
    description:
      "Icon, offcanvas and fixed layouts, with optional hover or focus peek.",
  },
  {
    title: "Mobile navigation",
    description:
      "A labeled Base UI drawer with close controls, focus management and scrolling.",
  },
] satisfies ReactComponentProps<typeof FeatureGrid>["features"];

const sidebarPageDemoTabsTabs = [
  {
    value: "basic",
    label: "Basic",
    demo: (
      <DemoWrapper
        title="Your everyday views"
        description="Composable navigation, a visible current view and zero-count badges."
        code={basicCode}
      >
        <BasicDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "modes",
    label: "Modes",
    demo: (
      <DemoWrapper
        title="Fit the workspace"
        description="Compare collapse modes, surfaces, sides and temporary expansion."
        code={modesCode}
      >
        <ModesDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "search",
    label: "Search",
    demo: (
      <DemoWrapper
        title="Find a view from the rail"
        description="Start with the search icon. Labels and keywords filter the navigation."
        code={searchCode}
      >
        <SearchDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "favorites",
    label: "Favorites",
    demo: (
      <DemoWrapper
        title="A personal order"
        description="Star your frequent views. Reorder favorites with a drag or the arrow buttons."
        code={favoritesCode}
      >
        <FavoritesDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "motion",
    label: "Motion",
    demo: (
      <DemoWrapper
        title="Continuity, without the wait"
        description="Pointer transitions, immediate keyboard access and a natural-size workspace. Reverse a transition while it is moving."
        code={motionCode}
      >
        <MotionDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "groups",
    label: "Groups",
    demo: (
      <DemoWrapper
        title="A growing team library"
        description="Add collections, open nested documents, and keep closed content out of the tab order."
        code={groupsCode}
      >
        <GroupsDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "account",
    label: "Account",
    demo: (
      <DemoWrapper
        title="Account actions in either width"
        description="Open the profile menu from the rail, use the keyboard, or switch theme."
        code={accountCode}
      >
        <AccountDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "controlled",
    label: "Controlled",
    demo: (
      <DemoWrapper
        title="Preferences belong to a workspace"
        description="Parent-owned collapse and separate favorite lists for Product and Support."
        code={controlledCode}
      >
        <ControlledDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "mobile",
    label: "Mobile",
    demo: (
      <DemoWrapper
        title="Navigation on a smaller screen"
        description="This fixture forces the mobile drawer at every viewport size."
        code={mobileCode}
      >
        <MobileDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "kira",
    label: "Kira",
    demo: (
      <DemoWrapper
        title="A product workspace"
        description="The data-driven composition, with search, favorites and account actions."
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
        title="Ready, waiting, unavailable"
        description="Local loading/error fixtures, empty navigation and managed favorites."
        code={statesCode}
      >
        <StatesDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "stress",
    label: "Stress",
    demo: (
      <DemoWrapper
        title="When names get longer"
        description="Switch between ordinary data, long multilingual labels, zero, one and many views."
        code={stressCode}
      >
        <StressDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "parts",
    label: "Parts",
    demo: (
      <DemoWrapper
        title="Build your own composition"
        description="Search, empty state, animated loading skeleton, nested lists and status badges."
        code={partsCode}
      >
        <PartsDemo />
      </DemoWrapper>
    ),
  },
] satisfies ReactComponentProps<typeof DemoTabs>["tabs"];

const sidebarPageKeyboardShortcutsShortcuts = [
  {
    keys: "Tab / Shift+Tab",
    description:
      "Move through native links, buttons, search, favorite toggles and reorder controls. Ordinary navigation is not an ARIA menu.",
  },
  {
    keys: "Enter / Space",
    description:
      "Activate buttons and group disclosures; disclosure state is inherited from Base UI. Enter follows a link; Space scrolls on a native link.",
  },
  {
    keys: "Cmd/Ctrl+B",
    description:
      "Kira toggles the focused provider. Inputs, rich-text editors, repeated and already-handled events are ignored; global scope is opt-in.",
  },
  {
    keys: "Cmd/Ctrl+K",
    description:
      "Kira expands and focuses the provider's search, when an enabled search field is available. Focus must be outside an editable input.",
  },
  {
    keys: "Escape",
    description:
      "Kira clears nonempty search or dismisses a peek. Menu and drawer dismissal/focus return are inherited from Base UI.",
  },
  {
    keys: "↑ / ↓ / Home / End",
    description:
      "Within the account menu only: item navigation is inherited from Base UI. Regular sidebar links keep native Tab navigation.",
  },
  {
    keys: "Reorder favorites → Move up / Move down",
    description:
      "Kira's visible buttons perform the same reorder as dragging; activate with Enter or Space.",
  },
] satisfies ReactComponentProps<typeof KeyboardShortcuts>["shortcuts"];

const sidebarPageChangelogEntries = [
  {
    version: "3.2.0",
    date: "2026-11-18",
    changes: [
      {
        type: "changed",
        title: "MenuButton horizontal padding px-2.5 → px-3",
        description:
          "Nav rows move to the sanctioned px-3 step (nav tier, slightly roomier than menu items). min-h-9 and the coarse-pointer min-h-11 touch target are unchanged.",
      },
    ],
  },
  {
    version: "3.1.2",
    date: "2026-11-18",
    changes: [
      {
        type: "fixed",
        title: "Crash when toggling the sidebar with a mouse",
        description:
          "Expanding or collapsing the sidebar, a group, or a nested group no longer throws. The FLIP animation waits until cleanup to read the initialized GSAP context.",
      },
    ],
  },
  {
    version: "3.1.1",
    date: "2026-11-11",
    changes: [
      {
        type: "added",
        title: "Synchronized loading skeleton",
        description:
          "SidebarSkeleton reuses shared Skeleton bones with one opacity pulse across the rows. Loading motion pauses offscreen and in hidden tabs, stops when loading unmounts, and respects reduced motion and SidebarProvider.motion=false independently of pointer intent. Busy status remains accessible in the icon rail.",
      },
    ],
  },
  {
    version: "3.1.0",
    date: "2026-11-11",
    changes: [
      {
        type: "changed",
        title: "A coherent sidebar motion system",
        description:
          "Pointer layout changes use transform-only displacement with no text scaling. Rail surfaces reveal with clip-path, disclosure panels and chevrons share timing, and account/drawer surfaces use origin-aware curves. Favorites reorder spatially, without entrance waves.",
      },
      {
        type: "fixed",
        title: "Rapid collapse and hover interruption",
        description:
          "Peek resets when collapse changes, pending hover exits are canceled, and interrupted layout transforms are replaced in the same React commit before paint. Disabling motion cancels both GSAP and CSS transitions.",
      },
      {
        type: "added",
        title: "Motion control and live comparison",
        description:
          "SidebarProvider.motion defaults to true. The Motion tab compares enabled and immediate modes; keyboard navigation and reduced-motion preferences always bypass sidebar-owned animation. No navigation-result, loading or decorative loops were added.",
      },
    ],
  },
  {
    version: "3.0.0",
    date: "2026-11-11",
    changes: [
      {
        type: "added",
        title: "KiraSidebar and personal favorites",
        description:
          "Data-driven views, label/keyword search, pin toggles, drag and button reorder, controlled workspace preferences, loading/error/empty states and read-only personalization. Research cutoff: October 31, 2026; audited against Base UI 1.9.0.",
      },
      {
        type: "fixed",
        title: "Native disclosure, account and mobile behavior",
        description:
          "Base UI Collapsible and DropdownMenu replace custom state machines. Mobile navigation is fully expanded and labeled, with a visible close button. Collapsed search focuses a real input; zero badges, disabled links and storage failures are handled.",
      },
      {
        type: "breaking",
        title: "Scoped shortcuts and layout contract",
        description:
          "Shortcuts now default to the focused provider; opt into shortcutScope=global for an application-wide owner. Sidebar fills its containing layout instead of forcing 100vh. Give the layout a bounded height. Sidebar.side was a no-op and is removed; set SidebarProvider.side.",
      },
      {
        type: "breaking",
        title: "Semantic and visual cleanup",
        description:
          "Menu/MenuItem/MenuSub are native lists, without misleading menu/menuitem roles. Closed groups unmount content. Counts use semantic tokens, labels wrap, and current-page styling is quieter. Existing component exports and badgeVariants remain.",
      },
      {
        type: "changed",
        title: "Motion and honest examples",
        description:
          "The original v3.0.0 pass kept desktop changes immediate. v3.1.0 adds pointer-only continuity with an explicit motion control. Shared mobile motion respects reduced motion; search results and skeletons remain static. Focused demos replace nonfunctional actions and unsupported keyboard/persistence claims.",
      },
    ],
  },
] satisfies ReactComponentProps<typeof Changelog>["entries"];

function ModesControlsSection({
  mode,
  setMode,
  variant,
  setVariant,
  side,
  setSide,
  peek,
  setPeek,
}: {
  mode: CollapsibleMode;
  setMode: React.Dispatch<React.SetStateAction<CollapsibleMode>>;
  variant: SidebarVariant;
  setVariant: React.Dispatch<React.SetStateAction<SidebarVariant>>;
  side: SidebarSide;
  setSide: React.Dispatch<React.SetStateAction<SidebarSide>>;
  peek: boolean;
  setPeek: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <div className="flex flex-wrap items-end gap-3">
      <label className="grid gap-1.5 text-sm">
        Collapse mode
        <select
          className={controlClass}
          value={mode}
          onChange={(event) => {
            const value = event.target.value;

            if (value === "icon" || value === "offcanvas" || value === "none")
              setMode(value);
          }}
        >
          <option value="icon">Icon rail</option>
          <option value="offcanvas">Offcanvas</option>
          <option value="none">Fixed</option>
        </select>
      </label>
      <label className="grid gap-1.5 text-sm">
        Surface
        <select
          className={controlClass}
          value={variant}
          onChange={(event) => {
            const value = event.target.value;

            if (
              value === "default" ||
              value === "floating" ||
              value === "inset"
            )
              setVariant(value);
          }}
        >
          <option value="default">Default</option>
          <option value="floating">Floating</option>
          <option value="inset">Inset</option>
        </select>
      </label>
      <label className="grid gap-1.5 text-sm">
        Side
        <select
          className={controlClass}
          value={side}
          onChange={(event) =>
            setSide(event.target.value === "right" ? "right" : "left")
          }
        >
          <option value="left">Left</option>
          <option value="right">Right</option>
        </select>
      </label>
      <PeekControl peek={peek} setPeek={setPeek} />
    </div>
  );
}

function ModesControlsSection2({
  mode,
  side,
  peek,
  variant,
}: {
  mode: CollapsibleMode;
  side: SidebarSide;
  peek: boolean;
  variant: SidebarVariant;
}) {
  return (
    <SidebarPreview
      key={`${mode}-${side}`}
      collapsible={mode}
      side={side}
      hoverExpand={peek}
      detail="The toolbar trigger stays available when offcanvas navigation is hidden. Peek expands over the content without resizing it."
    >
      <Sidebar variant={variant}>
        <SidebarHeader title="Navigation" />
        <SidebarContent>
          <SidebarItem to="/components/sidebar" icon={<IconHome />}>
            Sidebar documentation
          </SidebarItem>
          <SidebarItem to="/components/command" icon={<IconFile />}>
            Command documentation
          </SidebarItem>
        </SidebarContent>
      </Sidebar>
    </SidebarPreview>
  );
}

function StressControlsSection({
  data,
  setData,
}: {
  data: string;
  setData: React.Dispatch<React.SetStateAction<string>>;
}) {
  return (
    <fieldset
      className="flex flex-wrap gap-2"

      aria-label="Stress data"
    >
      {[
        ["demo", "Demo data"],
        ["worst", "Worst case"],
        ["empty", "Empty"],
        ["one", "One view"],
        ["many", "40 views"],
      ].map(([value, label]) => (
        <Button
          key={value}
          variant={data === value ? "secondary" : "outline"}
          size="sm"
          aria-pressed={data === value}
          onClick={() => setData(value)}
        >
          {label}
        </Button>
      ))}
    </fieldset>
  );
}

function StressControlsSection2({
  data,
  fixture,
}: {
  data: string;
  fixture: SidebarSection[];
}) {
  return (
    <SidebarPreview detail="Long labels wrap. Zero counts stay visible. The footer remains reachable while the view list scrolls.">
      <KiraSidebar
        key={data}
        title={
          data === "worst" ? "Customer experience infrastructure" : "Product"
        }
        sections={fixture}
        favorites={false}
        user={{
          name:
            data === "worst"
              ? "Aleksandra Wiśniewska-Kowalczyk"
              : "Alex Morgan",
          email:
            data === "worst"
              ? "alexandra@northwind-industries-holdings.example.com"
              : "Product team",
        }}
      />
    </SidebarPreview>
  );
}

function PeekControl({ peek, setPeek }: PeekControlProps) {
  return (
    <>
      <label className="flex min-h-9 items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={peek}
          onChange={(event) => setPeek(event.target.checked)}
        />
        Peek on hover or focus
      </label>
    </>
  );
}

interface PeekControlProps {
  peek: boolean;
  setPeek: React.Dispatch<React.SetStateAction<boolean>>;
}
