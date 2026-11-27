import type { ComponentProps as ReactComponentProps } from "react";
import * as React from "react";
import {
  IconLayoutGrid,
  IconBook,
  IconDeviceMobile,
  IconFileText,
  IconUsers,
  IconChartBar,
  IconCode,
  IconArrowUpRight,
  IconFolder,
  IconPhoto,
  IconSettings,
} from "@tabler/icons-react";

import {
  KiraNavigationMenu,
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
  NavigationMenuPortal,
  NavigationMenuPositioner,
  NavigationMenuPopup,
  NavigationMenuSection,
  NavigationMenuHeader,
  NavigationMenuFooter,
} from "@/components/ui/navigation-menu";
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

function PanelLink({
  href,
  title,
  children,
  icon,
}: {
  href: string;
  title: string;
  children: string;
  icon: React.ReactNode;
}) {
  return (
    <li>
      <NavigationMenuLink
        href={href}
        className="flex w-full items-start justify-start gap-3 rounded-md p-2.5 text-start"
      >
        <span
          aria-hidden="true"
          className="mt-0.5 size-5 shrink-0 text-muted-foreground [&_svg]:size-5"
        >
          {icon}
        </span>
        <span className="min-w-0">
          <span className="block text-sm leading-5 font-medium">{title}</span>
          <span className="mt-1 block text-xs leading-5 text-muted-foreground">
            {children}
          </span>
        </span>
      </NavigationMenuLink>
    </li>
  );
}

function BasicDemo() {
  return (
    <NavigationMenu aria-label="Site">
      <NavigationMenuList>
        <NavigationMenuItem value="learn">
          <NavigationMenuTrigger>Learn</NavigationMenuTrigger>
          <NavigationMenuContent className="w-64">
            <ul className="space-y-1">
              <PanelLink
                href="#handbook"
                title="The workspace handbook"
                icon={<IconBook />}
              >
                Clear guidance for everyday work.
              </PanelLink>
              <PanelLink
                href="#api"
                title="API documentation"
                icon={<IconCode />}
              >
                Build the connections your team needs.
              </PanelLink>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="#changelog">Changelog</NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
      <NavigationMenuPortal>
        <NavigationMenuPositioner>
          <NavigationMenuPopup />
        </NavigationMenuPositioner>
      </NavigationMenuPortal>
    </NavigationMenu>
  );
}

function ActiveDemo() {
  const [href, setHref] = React.useState("#handbook");

  return (
    <div className="space-y-4">
      <NavigationMenu aria-label="Site with active link">
        <NavigationMenuList>
          <NavigationMenuItem value="learn">
            <NavigationMenuTrigger>Learn</NavigationMenuTrigger>
            <NavigationMenuContent className="w-64">
              <ul className="space-y-1">
                <li>
                  <NavigationMenuLink
                    href="#handbook"
                    active={href === "#handbook"}
                    onClick={() => setHref("#handbook")}
                  >
                    Handbook
                  </NavigationMenuLink>
                </li>
                <li>
                  <NavigationMenuLink
                    href="#api"
                    active={href === "#api"}
                    onClick={() => setHref("#api")}
                  >
                    API documentation
                  </NavigationMenuLink>
                </li>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
        <NavigationMenuPortal>
          <NavigationMenuPositioner>
            <NavigationMenuPopup />
          </NavigationMenuPositioner>
        </NavigationMenuPortal>
      </NavigationMenu>
      <p className="text-sm text-muted-foreground">
        Current destination: {href}
      </p>
    </div>
  );
}

function MegaPanelFeaturedGuide() {
  return (
    <div className="flex flex-col justify-between gap-6 border-t border-border bg-muted/30 p-5 sm:border-s sm:border-t-0">
      <div>
        <IconFileText
          aria-hidden="true"
          className="mb-4 size-6 text-muted-foreground"
        />
        <h4 className="text-base leading-6 font-semibold">
          Make the next launch feel easier.
        </h4>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          A practical checklist for bringing a release together, from the first
          draft to the final review.
        </p>
      </div>
      <NavigationMenuLink
        href="#launch-guide"
        className="justify-start px-0 text-sm font-medium underline underline-offset-4"
      >
        Read the launch guide
        <IconArrowUpRight aria-hidden="true" className="size-4" />
      </NavigationMenuLink>
    </div>
  );
}

function MegaDemo() {
  return (
    <NavigationMenu aria-label="Product resources">
      <NavigationMenuList>
        <NavigationMenuItem value="resources">
          <NavigationMenuTrigger>Explore resources</NavigationMenuTrigger>
          <NavigationMenuContent megaMenu className="w-160">
            <NavigationMenuHeader>
              <p className="text-sm font-semibold">
                Resources for your next step
              </p>
              <p className="text-sm text-muted-foreground">
                Learn the essentials, then make the workspace your own.
              </p>
            </NavigationMenuHeader>
            <div className="grid sm:grid-cols-2">
              <div className="p-4">
                <NavigationMenuSection title="Learn and build">
                  <PanelLink
                    href="#handbook"
                    title="The workspace handbook"
                    icon={<IconBook />}
                  >
                    Clear guidance for everyday work.
                  </PanelLink>
                  <PanelLink
                    href="#api"
                    title="API documentation"
                    icon={<IconCode />}
                  >
                    Build the connections your team needs.
                  </PanelLink>
                  <PanelLink
                    href="#team"
                    title="For your team"
                    icon={<IconUsers />}
                  >
                    Set up a space everyone can use.
                  </PanelLink>
                </NavigationMenuSection>
              </div>
              <MegaPanelFeaturedGuide />
            </div>
            <NavigationMenuFooter>
              <span>Made for thoughtful teams.</span>
              <NavigationMenuLink href="#all-resources" className="p-0 text-xs">
                All resources
                <IconArrowUpRight aria-hidden="true" className="size-3" />
              </NavigationMenuLink>
            </NavigationMenuFooter>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
      <NavigationMenuPortal>
        <NavigationMenuPositioner>
          <NavigationMenuPopup />
        </NavigationMenuPositioner>
      </NavigationMenuPortal>
    </NavigationMenu>
  );
}

function NestedMediaSubmenu() {
  return (
    <NavigationMenu orientation="vertical" aria-label="Media folders">
      <NavigationMenuList className="w-full flex-col items-stretch">
        <NavigationMenuItem value="media">
          <NavigationMenuTrigger className="w-full justify-between">
            <span className="flex items-center gap-3">
              <IconPhoto
                aria-hidden="true"
                className="size-4 text-muted-foreground"
              />
              Media library
            </span>
          </NavigationMenuTrigger>
          <NavigationMenuContent className="w-56">
            <ul className="space-y-1">
              <li>
                <NavigationMenuLink
                  href="#images"
                  className="w-full justify-start"
                >
                  Images
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink
                  href="#videos"
                  className="w-full justify-start"
                >
                  Videos
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
      <NavigationMenuPortal>
        <NavigationMenuPositioner side="inline-end" align="start">
          <NavigationMenuPopup />
        </NavigationMenuPositioner>
      </NavigationMenuPortal>
    </NavigationMenu>
  );
}

function NestedDemo() {
  return (
    <NavigationMenu aria-label="Workspace files">
      <NavigationMenuList>
        <NavigationMenuItem value="files">
          <NavigationMenuTrigger>
            <IconFolder aria-hidden="true" className="size-4" />
            Workspace files
          </NavigationMenuTrigger>
          <NavigationMenuContent className="w-64">
            <ul className="space-y-1">
              <PanelLink
                href="#documents"
                title="Documents"
                icon={<IconFileText />}
              >
                Briefs, notes and decisions.
              </PanelLink>
            </ul>
            <NestedMediaSubmenu />
            <ul>
              <li>
                <NavigationMenuLink
                  href="#settings"
                  className="w-full justify-start gap-3"
                >
                  <IconSettings
                    aria-hidden="true"
                    className="size-4 text-muted-foreground"
                  />
                  File settings
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
      <NavigationMenuPortal>
        <NavigationMenuPositioner>
          <NavigationMenuPopup />
        </NavigationMenuPositioner>
      </NavigationMenuPortal>
    </NavigationMenu>
  );
}

function KiraDemo() {
  const [href, setHref] = React.useState("#changelog");

  return (
    <div className="space-y-4">
      <KiraNavigationMenu
        label="Explore"
        items={kiraNavigationDemoItems}
        activeHref={href}
        renderLink={(item) => (
          <a href={item.href} onClick={() => setHref(item.href)}>
            {item.label}
          </a>
        )}
      />
      <p className="text-sm text-muted-foreground">
        Current destination: {href}
      </p>
    </div>
  );
}

function MobileDemo() {
  return (
    <div className="space-y-3">
      <p className="text-xs text-muted-foreground">
        Below 768px the trigger opens a named drawer with collapsible groups.
      </p>
      <KiraNavigationMenu
        label="Explore"
        mobileLabel="Open site navigation"
        items={kiraNavigationDemoItems}
        activeHref="#projects"
      />
    </div>
  );
}

function StressDemo() {
  return (
    <div className="max-w-xs space-y-6">
      <div className="space-y-3">
        <p className="text-sm font-medium">Long names and empty sections</p>
        <KiraNavigationMenu
          label="Workspace library"
          mobileMode="inline"
          items={stressDemoKiraNavigationMenuItems}
        />
      </div>
      <div className="space-y-3">
        <p className="text-sm font-medium">No navigation items</p>
        <KiraNavigationMenu
          label="Empty workspace"
          mobileMode="inline"
          items={[]}
        />
      </div>
      <div className="space-y-3">
        <p className="text-sm font-medium">Unavailable destination</p>
        <NavigationMenu aria-label="Unavailable navigation">
          <NavigationMenuList>
            <NavigationMenuItem value="restricted">
              <NavigationMenuTrigger disabled>
                Administration
              </NavigationMenuTrigger>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        <p className="text-xs text-muted-foreground">
          Administration is only available to workspace owners.
        </p>
      </div>
    </div>
  );
}

const basicCode = `import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
  NavigationMenuPortal,
  NavigationMenuPositioner,
  NavigationMenuPopup,
} from "@/components/ui/navigation-menu";

export function SiteNavigation() {
  return (
    <NavigationMenu aria-label="Site">
      <NavigationMenuList>
        <NavigationMenuItem value="learn">
          <NavigationMenuTrigger>Learn</NavigationMenuTrigger>
          <NavigationMenuContent className="w-64">
            <ul className="space-y-1">
              <li>
                <NavigationMenuLink href="#handbook" className="w-full justify-start">
                  The workspace handbook
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink href="#api" className="w-full justify-start">
                  API documentation
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="#changelog">Changelog</NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
      <NavigationMenuPortal>
        <NavigationMenuPositioner>
          <NavigationMenuPopup />
        </NavigationMenuPositioner>
      </NavigationMenuPortal>
    </NavigationMenu>
  );
}`;

const activeCode = `import { useState } from "react";
import { NavigationMenuLink } from "@/components/ui/navigation-menu";

export function ActiveLink() {
  const [href, setHref] = useState("#handbook");
  return (
    <NavigationMenuLink
      href="#handbook"
      active={href === "#handbook"}
      onClick={() => setHref("#handbook")}
    >
      Handbook
    </NavigationMenuLink>
  );
}`;

const megaCode = `import {
  NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuTrigger,
  NavigationMenuContent, NavigationMenuHeader, NavigationMenuSection, NavigationMenuFooter,
  NavigationMenuLink, NavigationMenuPortal, NavigationMenuPositioner, NavigationMenuPopup,
} from "@/components/ui/navigation-menu";

export function MegaPanel() {
  return (
    <NavigationMenu aria-label="Product resources">
      <NavigationMenuList>
        <NavigationMenuItem value="resources">
          <NavigationMenuTrigger>Explore resources</NavigationMenuTrigger>
          <NavigationMenuContent megaMenu className="w-160">
            <NavigationMenuHeader>
              <p className="text-sm font-semibold">Resources for your next step</p>
              <p className="text-sm text-muted-foreground">
                Learn the essentials, then make the workspace your own.
              </p>
            </NavigationMenuHeader>
            <div className="grid sm:grid-cols-2">
              <div className="p-4">
                <NavigationMenuSection title="Learn and build">
                  {/* labelled li-wrapped link cards */}
                </NavigationMenuSection>
              </div>
              <div className="flex flex-col justify-between gap-6 border-t border-border bg-muted/30 p-5 sm:border-s sm:border-t-0">
                {/* featured guide + NavigationMenuLink */}
              </div>
            </div>
            <NavigationMenuFooter>
              <span>Made for thoughtful teams.</span>
            </NavigationMenuFooter>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
      <NavigationMenuPortal>
        <NavigationMenuPositioner>
          <NavigationMenuPopup />
        </NavigationMenuPositioner>
      </NavigationMenuPortal>
    </NavigationMenu>
  );
}`;

const nestedCode = `import {
  NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuTrigger,
  NavigationMenuContent, NavigationMenuLink, NavigationMenuPortal,
  NavigationMenuPositioner, NavigationMenuPopup,
} from "@/components/ui/navigation-menu";

export function NestedFiles() {
  return (
    <NavigationMenu aria-label="Workspace files">
      <NavigationMenuList>
        <NavigationMenuItem value="files">
          <NavigationMenuTrigger>Workspace files</NavigationMenuTrigger>
          <NavigationMenuContent className="w-64">
            <ul className="space-y-1">
              <li>
                <NavigationMenuLink href="#documents" className="w-full justify-start">
                  Documents
                </NavigationMenuLink>
              </li>
            </ul>
            <NavigationMenu orientation="vertical" aria-label="Media folders">
              <NavigationMenuList className="w-full flex-col items-stretch">
                <NavigationMenuItem value="media">
                  <NavigationMenuTrigger className="w-full justify-between">
                    Media library
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="w-56">
                    <ul className="space-y-1">
                      <li>
                        <NavigationMenuLink href="#images" className="w-full justify-start">
                          Images
                        </NavigationMenuLink>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
              <NavigationMenuPortal>
                <NavigationMenuPositioner side="inline-end" align="start">
                  <NavigationMenuPopup />
                </NavigationMenuPositioner>
              </NavigationMenuPortal>
            </NavigationMenu>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
      <NavigationMenuPortal>
        <NavigationMenuPositioner>
          <NavigationMenuPopup />
        </NavigationMenuPositioner>
      </NavigationMenuPortal>
    </NavigationMenu>
  );
}`;

const kiraCode = `import { useState } from "react";
import { KiraNavigationMenu, type NavigationItemData } from "@/components/ui/navigation-menu";

const items: NavigationItemData[] = [
  {
    type: "group",
    id: "product",
    label: "Product",
    description: "A shared place for your team's work.",
    items: [
      {
        type: "group",
        id: "work",
        label: "Work together",
        items: [
          {
            type: "link",
            id: "projects",
            label: "Projects",
            href: "#projects",
            description: "Turn the plan into a clear next step.",
          },
          {
            type: "link",
            id: "documents",
            label: "Documents",
            href: "#documents",
            description: "Give ideas and decisions a home.",
          },
        ],
      },
    ],
  },
  { type: "link", id: "changelog", label: "Changelog", href: "#changelog" },
];

export function SiteNavigation() {
  const [href, setHref] = useState("#changelog");
  return (
    <KiraNavigationMenu
      label="Explore"
      items={items}
      activeHref={href}
      renderLink={(item) => (
        <a href={item.href} onClick={() => setHref(item.href)}>{item.label}</a>
      )}
    />
  );
}`;

const mobileCode = `import { KiraNavigationMenu } from "@/components/ui/navigation-menu";

<KiraNavigationMenu
  label="Explore"
  mobileLabel="Open site navigation"
  items={items}
  activeHref="#projects"
/>`;

const stressCode = `import {
  KiraNavigationMenu,
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

export function NavigationStressCases() {
  return (
    <div className="max-w-xs space-y-6">
      <KiraNavigationMenu
        label="Workspace library"
        mobileMode="inline"
        items={[
          {
            type: "group",
            id: "library",
            label: "Library",
            description: "Content stays readable when names and descriptions grow.",
            items: [
              {
                type: "link",
                id: "guide",
                label: "Deployment and workspace administration for distributed product teams",
                href: "#administration",
                description: "A complete guide to permissions and release reviews.",
              },
              { type: "group", id: "archived", label: "Archived collections", items: [] },
            ],
          },
        ]}
      />
      <KiraNavigationMenu label="Empty workspace" mobileMode="inline" items={[]} />
      <NavigationMenu aria-label="Unavailable navigation">
        <NavigationMenuList>
          <NavigationMenuItem value="restricted">
            <NavigationMenuTrigger disabled>Administration</NavigationMenuTrigger>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}`;

const usageCode = `import { KiraNavigationMenu, type NavigationItemData } from "@/components/ui/navigation-menu";

const items: NavigationItemData[] = [
  {
    type: "group",
    id: "product",
    label: "Product",
    description: "A shared place for your team's work.",
    items: [
      {
        type: "group",
        id: "work",
        label: "Work together",
        items: [
          { type: "link", id: "projects", label: "Projects", href: "/projects", description: "Turn plans into a clear next step." },
          { type: "link", id: "documents", label: "Documents", href: "/documents", description: "Give ideas a home." },
        ],
      },
    ],
  },
  { type: "link", id: "updates", label: "Changelog", href: "/changelog" },
];

export function SiteNavigation() {
  return <KiraNavigationMenu items={items} label="Explore" activeHref="/changelog" />;
}`;

export default function NavigationMenuPage() {
  return (
    <ComponentPage>
      <PageHeader
        title="Navigation Menu"
        description="Clear destinations, readable sections, and room for useful context. A website navigation system that moves naturally from desktop panels to a mobile drawer."
        version="v2.1.1"
      />

      <FeatureGrid
        features={navigationMenuPageFeatures}
        description="Responsive disclosure navigation built on Base UI NavigationMenu."
      />

      <DemoTabs tabs={navigationMenuPageDemoTabs} defaultValue="basic" />

      <KeyboardShortcuts
        shortcuts={navigationMenuPageShortcuts}
        description="Keyboard navigation across horizontal triggers, panels, and the mobile drawer."
      />

      <UsageBlock
        code={usageCode}
        title="Usage"
        description="Drive desktop panels and a mobile drawer from one tree, or compose NavigationMenu primitives."
        notes={[
          {
            label: "KiraNavigationMenu",
            body: "Preferred entry point for site headers — switches automatically between desktop mega panels and a mobile Drawer below 768px.",
          },
          {
            label: "NavigationMenu primitives",
            body: "Compose NavigationMenu, NavigationMenuTrigger, NavigationMenuContent, and NavigationMenuPopup for custom mega-menu layouts.",
          },
        ]}
      />

      <APIReference
        sections={navigationMenuPageAPISections}
        title="API reference"
        description="Props, types, and defaults for KiraNavigationMenu and all NavigationMenu primitives."
      />

      <Changelog
        entries={navigationMenuPageChangelogEntries}
        title="Changelog"
        description="Version history for Navigation Menu."
      />
    </ComponentPage>
  );
}

const kiraNavigationDemoItems = [
  {
    type: "group",
    id: "product",
    label: "Product",
    description: "A shared place for your team's work.",
    items: [
      {
        type: "group",
        id: "work",
        label: "Work together",
        items: [
          {
            type: "link",
            id: "projects",
            label: "Projects",
            href: "#projects",
            description: "Turn the plan into a clear next step.",
            icon: <IconLayoutGrid />,
          },
          {
            type: "link",
            id: "documents",
            label: "Documents",
            href: "#documents",
            description: "Give ideas and decisions a home.",
            icon: <IconFileText />,
          },
        ],
      },
      {
        type: "group",
        id: "manage",
        label: "Keep things moving",
        items: [
          {
            type: "link",
            id: "people",
            label: "People",
            href: "#people",
            description: "Bring everyone into the conversation.",
            icon: <IconUsers />,
          },
          {
            type: "link",
            id: "insights",
            label: "Insights",
            href: "#insights",
            description: "See where the work is heading.",
            icon: <IconChartBar />,
          },
        ],
      },
    ],
  },
  { type: "link", id: "changelog", label: "Changelog", href: "#changelog" },
] satisfies ReactComponentProps<typeof KiraNavigationMenu>["items"];

const stressDemoKiraNavigationMenuItems = [
  {
    type: "group",
    id: "library",
    label: "Library",
    description: "Content stays readable when names and descriptions grow.",
    items: [
      {
        type: "link",
        id: "guide",
        label:
          "Deployment and workspace administration for distributed product teams",
        href: "#administration",
        description:
          "A complete guide to permissions, release reviews, and keeping the workspace organized.",
        icon: <IconBook />,
      },
      {
        type: "group",
        id: "archived",
        label: "Archived collections",
        items: [],
      },
    ],
  },
] satisfies ReactComponentProps<typeof KiraNavigationMenu>["items"];

const navigationMenuPageFeatures = [
  {
    title: "A coherent site header",
    description:
      "Direct links and grouped destinations share one restrained navigation surface.",
    icon: <IconLayoutGrid className="size-4" />,
  },
  {
    title: "Panels with hierarchy",
    description:
      "Sections, descriptions, mega panels and nested menus when a simple list is not enough.",
    icon: <IconBook className="size-4" />,
  },
  {
    title: "The same tree on mobile",
    description:
      "A named drawer turns groups into disclosures and keeps every destination reachable.",
    icon: <IconDeviceMobile className="size-4" />,
  },
] satisfies ReactComponentProps<typeof FeatureGrid>["features"];

const navigationMenuPageDemoTabs = [
  {
    value: "basic",
    label: "Basic",
    group: "Core",
    demo: (
      <DemoWrapper
        title="Basic Navigation"
        description="A trigger with a panel of links beside a direct link item."
        code={basicCode}
      >
        <BasicDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "active",
    label: "Active Link",
    group: "Core",
    demo: (
      <DemoWrapper
        title="Active Destination"
        description="aria-current and a visible underline on the current page; never colour alone."
        code={activeCode}
      >
        <ActiveDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "mega",
    label: "Mega Panel",
    group: "Core",
    demo: (
      <DemoWrapper
        title="Mega Panel"
        description="Header, labelled sections, a featured guide and footer in one panel."
        code={megaCode}
      >
        <MegaDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "nested",
    label: "Nested",
    group: "Core",
    demo: (
      <DemoWrapper
        title="Nested Menus"
        description="A vertical NavigationMenu inside a panel; Escape closes the inner menu first."
        code={nestedCode}
      >
        <NestedDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "kira",
    label: "KiraNavigationMenu",
    group: "KiraNavigationMenu",
    demo: (
      <DemoWrapper
        title="KiraNavigationMenu"
        description="One data tree drives top-level links, group panels and router composition."
        code={kiraCode}
      >
        <KiraDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "mobile",
    label: "Mobile",
    group: "KiraNavigationMenu",
    demo: (
      <DemoWrapper
        title="Responsive Drawer"
        description="Below 768px the trigger opens a named drawer; groups expand in place."
        code={mobileCode}
      >
        <MobileDemo />
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
        description="Long names, an empty collection, an empty tree, and an unavailable destination inside a max-w-xs container."
        code={stressCode}
      >
        <StressDemo />
      </DemoWrapper>
    ),
  },
] satisfies ReactComponentProps<typeof DemoTabs>["tabs"];

const navigationMenuPageShortcuts = [
  {
    keys: "Tab / Shift+Tab",
    description:
      "Move between links and controls; inherited from Base UI. The mobile drawer retains focus while open.",
  },
  {
    keys: "Left / Right",
    description: "Move through horizontal triggers; inherited from Base UI.",
  },
  {
    keys: "Up / Down",
    description: "Enter and move through a panel; inherited from Base UI.",
  },
  {
    keys: "Enter / Space",
    description:
      "Toggle a trigger; Enter follows a link. Inherited from Base UI.",
  },
  {
    keys: "Escape",
    description:
      "Close the innermost panel or mobile drawer and restore focus; inherited from Base UI.",
  },
] satisfies ReactComponentProps<typeof KeyboardShortcuts>["shortcuts"];

const navigationMenuPrimitiveAPISections = [
  {
    title: "NavigationMenuList",
    props: [
      {
        prop: "children / className",
        type: "NavigationMenuListProps",
        default: "-",
        description:
          "The list of top-level items; wraps when the available width is narrow.",
      },
    ],
  },
  {
    title: "NavigationMenuItem",
    props: [
      {
        prop: "value",
        type: "NavigationMenuItemProps['value']",
        default: "-",
        description: "Stable identity for a trigger and its content.",
      },
    ],
  },
  {
    title: "NavigationMenuTrigger",
    props: [
      {
        prop: "disabled / render / className",
        type: "NavigationMenuTriggerProps",
        default: "-",
        description:
          "A disclosure button with a rotating icon and native keyboard behavior.",
      },
    ],
  },
  {
    title: "NavigationMenuIcon",
    props: [
      {
        prop: "children / className",
        type: "NavigationMenuIconProps",
        default: "-",
        description:
          "Override the decorative trigger icon without replacing the button.",
      },
    ],
  },
  {
    title: "NavigationMenuContent",
    props: [
      {
        prop: "megaMenu / keepMounted",
        type: "boolean / boolean",
        default: "false / false",
        description:
          "megaMenu removes default padding. keepMounted retains inactive content. Put surface styling on Popup.",
      },
    ],
  },
  {
    title: "NavigationMenuLink",
    props: [
      {
        prop: "href / render / target / rel",
        type: "NavigationMenuLinkProps",
        default: "-",
        description: "Compose a native anchor or router link.",
      },
      {
        prop: "active / closeOnClick",
        type: "boolean / boolean",
        default: "false / true",
        description:
          "Mark the current page with aria-current and an underline; close its panel when activated.",
      },
    ],
  },
  {
    title: "NavigationMenuPortal",
    props: [
      {
        prop: "keepMounted / container",
        type: "NavigationMenuPortalProps",
        default: "-",
        description:
          "Mount the panel outside the header, optionally keeping it mounted when closed.",
      },
    ],
  },
  {
    title: "NavigationMenuPositioner",
    props: [
      {
        prop: "side / align / sideOffset / alignOffset",
        type: "NavigationMenuPositionerProps",
        default: "bottom / start / 4 / 0",
        description:
          "Position a popup with collision handling. Nested examples use the logical end side.",
      },
    ],
  },
  {
    title: "NavigationMenuPopup",
    props: [
      {
        prop: "children / className",
        type: "NavigationMenuPopupProps",
        default: "-",
        description:
          "The bordered panel shell; measured width and height belong here. Creates a Viewport when children are omitted.",
      },
    ],
  },
  {
    title: "NavigationMenuViewport",
    props: [
      {
        prop: "children / className",
        type: "NavigationMenuViewportProps",
        default: "-",
        description:
          "The clipping viewport inside the Popup. Fill the popup rather than applying its measured outer dimensions again.",
      },
    ],
  },
  {
    title: "NavigationMenuArrow",
    props: [
      {
        prop: "className / style",
        type: "NavigationMenuArrowProps",
        default: "-",
        description:
          "An optional decorative arrow connected to its positioner.",
      },
    ],
  },
  {
    title: "NavigationMenuBackdrop",
    props: [
      {
        prop: "className / style",
        type: "NavigationMenuBackdropProps",
        default: "-",
        description: "An optional dismissible background layer.",
      },
    ],
  },
  {
    title: "NavigationMenuHeader",
    props: [
      {
        prop: "children / className",
        type: "React.HTMLAttributes<HTMLDivElement>",
        default: "-",
        description:
          "A title and description region with a lower divider and consistent panel padding.",
      },
    ],
  },
  {
    title: "NavigationMenuFooter",
    props: [
      {
        prop: "children / className",
        type: "React.HTMLAttributes<HTMLDivElement>",
        default: "-",
        description:
          "A quiet footer for supporting information and links; wraps at narrow widths.",
      },
    ],
  },
  {
    title: "NavigationMenuSection",
    props: [
      {
        prop: "title / children",
        type: "string / React.ReactNode",
        default: "-",
        description:
          "A labelled section that creates its own ul; supply li children.",
      },
    ],
  },
  {
    title: "NavigationMenuViewAll",
    props: [
      {
        prop: "title / description / href / render",
        type: "NavigationMenuViewAllProps",
        default: "-",
        description:
          "A native all-items link with a title, optional supporting copy and a trailing arrow.",
      },
    ],
  },
] satisfies ReactComponentProps<typeof APIReference>["sections"];

const navigationMenuPageAPISections = [
  {
    title: "KiraNavigationMenu",
    props: [
      {
        prop: "items",
        type: "readonly NavigationItemData[]",
        default: "-",
        description:
          "Native links and recursively labelled groups. Groups can include a description and nested sections.",
      },
      {
        prop: "label / mobileLabel",
        type: "string",
        default: "mobileLabel: 'Open navigation'",
        description:
          "Navigation landmark name and accessible mobile trigger name.",
      },
      {
        prop: "activeHref",
        type: "string",
        default: "-",
        description:
          "Current destination. Exact matching sets aria-current and a visible underline.",
      },
      {
        prop: "mobileMode",
        type: "'drawer' | 'inline'",
        default: "'drawer'",
        description:
          "Use a drawer below 768px or retain inline panels at every width.",
      },
      {
        prop: "renderLink",
        type: "(item: NavigationLinkData) => React.ReactElement",
        default: "-",
        description:
          "Compose a router link in both desktop and mobile presentations.",
      },
      {
        prop: "rootProps / className",
        type: "KiraNavigationMenuProps['rootProps'] / string",
        default: "-",
        description: "Primitive options and desktop root styling.",
      },
    ],
  },
  {
    title: "NavigationMenu",
    props: [
      {
        prop: "value / defaultValue",
        type: "NavigationMenuProps<Value>['value']",
        default: "-",
        description: "Current open item value or initial value.",
      },
      {
        prop: "onValueChange",
        type: "NavigationMenuProps<Value>['onValueChange']",
        default: "-",
        description: "Cancellable state changes from the primitive.",
      },
      {
        prop: "delay / closeDelay",
        type: "number",
        default: "50 / 50",
        description: "Pointer open and close delays in milliseconds.",
      },
      {
        prop: "orientation",
        type: "'horizontal' | 'vertical'",
        default: "'horizontal'",
        description: "Trigger navigation axis; use vertical for a nested menu.",
      },
    ],
  },
  ...navigationMenuPrimitiveAPISections,
  {
    title: "Styling recipes",
    props: [
      {
        prop: "navigationMenuTriggerVariants / navigationMenuContentVariants",
        type: "cva",
        default: "-",
        description:
          "Exported trigger and popup surface recipes using the kit's semantic tokens.",
      },
    ],
  },
] satisfies ReactComponentProps<typeof APIReference>["sections"];

const navigationMenuPageChangelogEntries = [
  {
    version: "2.1.1",
    date: "8 November 2026",
    changes: [
      {
        type: "changed",
        title: "One demo per feature",
        description:
          "Replaced the workspace-scene demos with focused per-feature tabs (basic, active link, mega panel, nested, Kira, mobile, stress cases) matching the dropdown-menu demo structure. Demo components and their snippets live in the page file; page padding no longer overrides ComponentPage. No API changes.",
      },
    ],
  },
  {
    version: "2.1.0",
    date: "7 November 2026",
    changes: [
      {
        type: "changed",
        title: "A coherent navigation system",
        description:
          "Rebuilt the demos as a working site header, a resource mega panel, focused nested navigation, responsive drawer and content states. Improved section layout, type rhythm and link alignment. Audited on Base UI 1.9.0; no removed APIs.",
      },
      {
        type: "changed",
        title: "Readable grouped panels",
        description:
          "Data-driven groups use clear panel headers and responsive columns. Icons share one alignment, descriptions have room to breathe, and active destinations retain their underline.",
      },
    ],
  },
  {
    version: "2.0.1",
    date: "7 November 2026",
    changes: [
      {
        type: "fixed",
        title: "Primitive composition and responsive links",
        description:
          "Corrected popup sizing, active and router links, recursive groups, mobile anchors and drawer breakpoint reset.",
      },
    ],
  },
  {
    version: "2.0.0",
    date: "6 November 2026",
    changes: [
      {
        type: "breaking",
        title: "Base UI NavigationMenu foundation",
        description:
          "Replaced the custom popup system with native Base UI parts; removed legacy Dropdown/Sub/ListItem wrappers and the router-specific to prop.",
      },
    ],
  },
] satisfies ReactComponentProps<typeof Changelog>["entries"];
