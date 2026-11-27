import type { ComponentProps as ReactComponentProps } from "react";
import { useState } from "react";
import { IconFile, IconFolder, IconUser } from "@tabler/icons-react";
import {
  Spotlight,
  KiraSpotlight,
  SpotlightTrigger,
  SpotlightGroup,
  SpotlightItem,
  SpotlightSearch,
  SpotlightRecent,
  SpotlightSuggestions,
  SpotlightResults,
  type SpotlightItemType,
} from "@/components/ui/spotlight";
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

const resources: SpotlightItemType[] = [
  {
    id: "roadmap",
    label: "Q4 product roadmap",
    description: "Projects · Product team",
    icon: <IconFolder />,
    scope: "projects",
    keywords: ["planning", "launch"],
  },
  {
    id: "guide",
    label: "Customer onboarding guide",
    description: "Documents · Updated today",
    icon: <IconFile />,
    scope: "documents",
    keywords: ["help", "support"],
  },
  {
    id: "maya",
    label: "Maya Chen",
    description: "People · Workspace owner",
    icon: <IconUser />,
    scope: "people",
    keywords: ["admin", "owner"],
  },
  {
    id: "archive",
    label: "Archived financial report",
    description: "Documents · Restricted",
    icon: <IconFile />,
    scope: "documents",
    disabled: true,
    disabledReason: "Ask Finance for access.",
  },
];

const scopes = [
  { id: "projects", label: "Projects" },
  { id: "documents", label: "Documents" },
  { id: "people", label: "People" },
];

function BasicDemo() {
  const [destination, setDestination] = useState("Nothing opened yet.");

  return (
    <div className="space-y-4">
      <Spotlight
        items={resources}
        trigger={<SpotlightTrigger />}
        onSelect={(item) => setDestination("Opened " + item.label)}
      />
      <output className="block text-sm text-muted-foreground">
        {destination}
      </output>
    </div>
  );
}

const basicCode =
  'import { useState } from "react";\nimport { Spotlight, SpotlightTrigger, type SpotlightItemType } from "@/components/ui/spotlight";\nimport { IconFile, IconFolder, IconUser } from "@tabler/icons-react";\n\nconst resources: SpotlightItemType[] = [\n  { id: "roadmap", label: "Q4 product roadmap", description: "Projects · Product team", icon: <IconFolder />, scope: "projects", keywords: ["planning", "launch"] },\n  { id: "guide", label: "Customer onboarding guide", description: "Documents · Updated today", icon: <IconFile />, scope: "documents", keywords: ["help", "support"] },\n  { id: "maya", label: "Maya Chen", description: "People · Workspace owner", icon: <IconUser />, scope: "people", keywords: ["admin", "owner"] },\n  { id: "archive", label: "Archived financial report", description: "Documents · Restricted", icon: <IconFile />, scope: "documents", disabled: true, disabledReason: "Ask Finance for access." },\n];\n\nexport function BasicDemo() {\n  const [destination, setDestination] = useState("Nothing opened yet.");\n  return <div className="space-y-4">\n    <Spotlight items={resources} trigger={<SpotlightTrigger />} onSelect={item => setDestination("Opened " + item.label)} />\n    <output className="block text-sm text-muted-foreground">{destination}</output>\n  </div>;\n}';

function GroupsDemo() {
  return (
    <Spotlight
      groups={[
        {
          id: "projects",
          label: "Projects",
          items: resources.filter((item) => item.scope === "projects"),
        },
      ]}
      items={resources.filter((item) => item.scope !== "projects")}
      trigger={<SpotlightTrigger>Search grouped resources</SpotlightTrigger>}
    />
  );
}

const groupsCode =
  'import { Spotlight, SpotlightTrigger, type SpotlightItemType } from "@/components/ui/spotlight";\nimport { IconFile, IconFolder, IconUser } from "@tabler/icons-react";\n\nconst resources: SpotlightItemType[] = [\n  { id: "roadmap", label: "Q4 product roadmap", description: "Projects · Product team", icon: <IconFolder />, scope: "projects", keywords: ["planning", "launch"] },\n  { id: "guide", label: "Customer onboarding guide", description: "Documents · Updated today", icon: <IconFile />, scope: "documents", keywords: ["help", "support"] },\n  { id: "maya", label: "Maya Chen", description: "People · Workspace owner", icon: <IconUser />, scope: "people", keywords: ["admin", "owner"] },\n  { id: "archive", label: "Archived financial report", description: "Documents · Restricted", icon: <IconFile />, scope: "documents", disabled: true, disabledReason: "Ask Finance for access." },\n];\n\nexport function GroupsDemo() {\n  return <Spotlight groups={[{ id: "projects", label: "Projects", items: resources.filter(item => item.scope === "projects") }]} items={resources.filter(item => item.scope !== "projects")} trigger={<SpotlightTrigger>Search grouped resources</SpotlightTrigger>} />;\n}';

function FilterDemo() {
  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        Try roadmap, guide, or maya.
      </p>
      <Spotlight
        items={resources}
        filter={(item, query) => item.id.startsWith(query.trim().toLowerCase())}
        trigger={<SpotlightTrigger>Search by resource ID</SpotlightTrigger>}
      />
    </div>
  );
}

const filterCode =
  'import { Spotlight, SpotlightTrigger, type SpotlightItemType } from "@/components/ui/spotlight";\nimport { IconFile, IconFolder, IconUser } from "@tabler/icons-react";\n\nconst resources: SpotlightItemType[] = [\n  { id: "roadmap", label: "Q4 product roadmap", description: "Projects · Product team", icon: <IconFolder />, scope: "projects", keywords: ["planning", "launch"] },\n  { id: "guide", label: "Customer onboarding guide", description: "Documents · Updated today", icon: <IconFile />, scope: "documents", keywords: ["help", "support"] },\n  { id: "maya", label: "Maya Chen", description: "People · Workspace owner", icon: <IconUser />, scope: "people", keywords: ["admin", "owner"] },\n  { id: "archive", label: "Archived financial report", description: "Documents · Restricted", icon: <IconFile />, scope: "documents", disabled: true, disabledReason: "Ask Finance for access." },\n];\n\nexport function FilterDemo() {\n  return <div className="space-y-3"><p className="text-sm text-muted-foreground">Try roadmap, guide, or maya.</p><Spotlight items={resources} filter={(item, query) => item.id.startsWith(query.trim().toLowerCase())} trigger={<SpotlightTrigger>Search by resource ID</SpotlightTrigger>} /></div>;\n}';

function ScopesDemo() {
  return (
    <KiraSpotlight
      items={resources}
      scopes={scopes}
      trigger={<SpotlightTrigger>Search by team or resource</SpotlightTrigger>}
    />
  );
}

const scopesCode =
  'import { KiraSpotlight, SpotlightTrigger, type SpotlightItemType } from "@/components/ui/spotlight";\nimport { IconFile, IconFolder, IconUser } from "@tabler/icons-react";\n\nconst resources: SpotlightItemType[] = [\n  { id: "roadmap", label: "Q4 product roadmap", description: "Projects · Product team", icon: <IconFolder />, scope: "projects", keywords: ["planning", "launch"] },\n  { id: "guide", label: "Customer onboarding guide", description: "Documents · Updated today", icon: <IconFile />, scope: "documents", keywords: ["help", "support"] },\n  { id: "maya", label: "Maya Chen", description: "People · Workspace owner", icon: <IconUser />, scope: "people", keywords: ["admin", "owner"] },\n  { id: "archive", label: "Archived financial report", description: "Documents · Restricted", icon: <IconFile />, scope: "documents", disabled: true, disabledReason: "Ask Finance for access." },\n];\nconst scopes = [\n  { id: "projects", label: "Projects" },\n  { id: "documents", label: "Documents" },\n  { id: "people", label: "People" },\n];\n\nexport function ScopesDemo() {\n  return <KiraSpotlight items={resources} scopes={scopes} trigger={<SpotlightTrigger>Search by team or resource</SpotlightTrigger>} />;\n}';

function RemoteDemo() {
  return (
    <KiraSpotlight
      scopes={scopes}
      debounceMs={200}
      minQueryLength={2}
      search={(query, { signal, scope }) =>
        new Promise<SpotlightItemType[]>((resolve, reject) => {
          const abort = () => {
            window.clearTimeout(timer);
            reject(new DOMException("Search cancelled", "AbortError"));
          };

          const timer = window.setTimeout(() => {
            signal.removeEventListener("abort", abort);

            if (query.toLowerCase() === "error") {
              reject(
                new Error(
                  "Search service is unavailable. Try again or change your query.",
                ),
              );

              return;
            }

            resolve(
              resources.filter(
                (item) =>
                  (scope === "all" || item.scope === scope) &&
                  [item.label, ...(item.keywords ?? [])].some((value) =>
                    value.toLowerCase().includes(query.toLowerCase()),
                  ),
              ),
            );
          }, 600);

          signal.addEventListener("abort", abort, { once: true });
        })
      }
      trigger={<SpotlightTrigger>Search remote resources</SpotlightTrigger>}
    />
  );
}

const remoteCode =
  'import { KiraSpotlight, SpotlightTrigger, type SpotlightItemType } from "@/components/ui/spotlight";\nimport { IconFile, IconFolder, IconUser } from "@tabler/icons-react";\n\nconst resources: SpotlightItemType[] = [\n  { id: "roadmap", label: "Q4 product roadmap", description: "Projects · Product team", icon: <IconFolder />, scope: "projects", keywords: ["planning", "launch"] },\n  { id: "guide", label: "Customer onboarding guide", description: "Documents · Updated today", icon: <IconFile />, scope: "documents", keywords: ["help", "support"] },\n  { id: "maya", label: "Maya Chen", description: "People · Workspace owner", icon: <IconUser />, scope: "people", keywords: ["admin", "owner"] },\n  { id: "archive", label: "Archived financial report", description: "Documents · Restricted", icon: <IconFile />, scope: "documents", disabled: true, disabledReason: "Ask Finance for access." },\n];\nconst scopes = [\n  { id: "projects", label: "Projects" },\n  { id: "documents", label: "Documents" },\n  { id: "people", label: "People" },\n];\n\nexport function RemoteDemo() {\n  return <KiraSpotlight scopes={scopes} debounceMs={200} minQueryLength={2} search={(query, { signal, scope }) => new Promise<SpotlightItemType[]>((resolve, reject) => {\n    const abort = () => { window.clearTimeout(timer); reject(new DOMException("Search cancelled", "AbortError")); };\n    const timer = window.setTimeout(() => {\n      signal.removeEventListener("abort", abort);\n      if (query.toLowerCase() === "error") { reject(new Error("Search service is unavailable. Try again or change your query.")); return; }\n      resolve(resources.filter(item => (scope === "all" || item.scope === scope) && [item.label, ...(item.keywords ?? [])].some(value => value.toLowerCase().includes(query.toLowerCase()))));\n    }, 600);\n    signal.addEventListener("abort", abort, { once: true });\n  })} trigger={<SpotlightTrigger>Search remote resources</SpotlightTrigger>} />;\n}';

function RecentsDemo() {
  return (
    <KiraSpotlight
      items={resources}
      rememberRecent
      maxRecent={3}
      trigger={<SpotlightTrigger>Search with recents</SpotlightTrigger>}
    />
  );
}

const recentsCode =
  'import { KiraSpotlight, SpotlightTrigger, type SpotlightItemType } from "@/components/ui/spotlight";\nimport { IconFile, IconFolder, IconUser } from "@tabler/icons-react";\n\nconst resources: SpotlightItemType[] = [\n  { id: "roadmap", label: "Q4 product roadmap", description: "Projects · Product team", icon: <IconFolder />, scope: "projects", keywords: ["planning", "launch"] },\n  { id: "guide", label: "Customer onboarding guide", description: "Documents · Updated today", icon: <IconFile />, scope: "documents", keywords: ["help", "support"] },\n  { id: "maya", label: "Maya Chen", description: "People · Workspace owner", icon: <IconUser />, scope: "people", keywords: ["admin", "owner"] },\n  { id: "archive", label: "Archived financial report", description: "Documents · Restricted", icon: <IconFile />, scope: "documents", disabled: true, disabledReason: "Ask Finance for access." },\n];\n\nexport function RecentsDemo() {\n  return <KiraSpotlight items={resources} rememberRecent maxRecent={3} trigger={<SpotlightTrigger>Search with recents</SpotlightTrigger>} />;\n}';

function PreviewDemo() {
  return (
    <KiraSpotlight
      items={resources}
      renderPreview={(item) => (
        <div className="space-y-1">
          <p className="font-medium">{item.label}</p>
          <p className="text-muted-foreground">{item.description}</p>
          <p className="text-xs text-muted-foreground">
            Resource ID: {item.id}. Press Enter to open.
          </p>
        </div>
      )}
      trigger={<SpotlightTrigger>Search with a preview</SpotlightTrigger>}
    />
  );
}

const previewCode =
  'import { KiraSpotlight, SpotlightTrigger, type SpotlightItemType } from "@/components/ui/spotlight";\nimport { IconFile, IconFolder, IconUser } from "@tabler/icons-react";\n\nconst resources: SpotlightItemType[] = [\n  { id: "roadmap", label: "Q4 product roadmap", description: "Projects · Product team", icon: <IconFolder />, scope: "projects", keywords: ["planning", "launch"] },\n  { id: "guide", label: "Customer onboarding guide", description: "Documents · Updated today", icon: <IconFile />, scope: "documents", keywords: ["help", "support"] },\n  { id: "maya", label: "Maya Chen", description: "People · Workspace owner", icon: <IconUser />, scope: "people", keywords: ["admin", "owner"] },\n  { id: "archive", label: "Archived financial report", description: "Documents · Restricted", icon: <IconFile />, scope: "documents", disabled: true, disabledReason: "Ask Finance for access." },\n];\n\nexport function PreviewDemo() {\n  return <KiraSpotlight items={resources} renderPreview={item => <div className="space-y-1"><p className="font-medium">{item.label}</p><p className="text-muted-foreground">{item.description}</p><p className="text-xs text-muted-foreground">Resource ID: {item.id}. Press Enter to open.</p></div>} trigger={<SpotlightTrigger>Search with a preview</SpotlightTrigger>} />;\n}';

function CompositionDemo() {
  const [query, setQuery] = useState("");
  const [selection, setSelection] = useState("Nothing selected.");

  return (
    <div className="space-y-4">
      <Spotlight
        trigger={<SpotlightTrigger>Open composed search</SpotlightTrigger>}
      >
        <SpotlightGroup label="Actions">
          <SpotlightItem
            item={{ id: "create", label: "Create a project" }}
            onSelect={() => setSelection("Created a project.")}
          />
        </SpotlightGroup>
      </Spotlight>
      <SpotlightSearch onSearch={setQuery}>
        <SpotlightItem
          item={{ id: "inline-guide", label: "Onboarding guide" }}
          onSelect={() => setSelection("Opened the guide.")}
        />
      </SpotlightSearch>
      <SpotlightResults>
        <p className="text-sm">Typed: {query || "Nothing yet."}</p>
      </SpotlightResults>
      <SpotlightRecent
        items={["Product roadmap"]}
        onItemClick={(item) => setSelection("Opened " + item)}
      />
      <SpotlightSuggestions
        items={["Create a project", "Import work"]}
        onItemClick={setSelection}
      />
      <output className="block text-sm text-muted-foreground">
        {selection}
      </output>
    </div>
  );
}

const compositionCode =
  'import { useState } from "react";\nimport { Spotlight, SpotlightGroup, SpotlightItem, SpotlightTrigger, SpotlightSearch, SpotlightResults, SpotlightRecent, SpotlightSuggestions } from "@/components/ui/spotlight";\n\nexport function CompositionDemo() {\n  const [query, setQuery] = useState("");\n  const [selection, setSelection] = useState("Nothing selected.");\n  return <div className="space-y-4">\n    <Spotlight trigger={<SpotlightTrigger>Open composed search</SpotlightTrigger>}>\n      <SpotlightGroup label="Actions"><SpotlightItem item={{ id: "create", label: "Create a project" }} onSelect={() => setSelection("Created a project.")} /></SpotlightGroup>\n    </Spotlight>\n    <SpotlightSearch onSearch={setQuery}><SpotlightItem item={{ id: "inline-guide", label: "Onboarding guide" }} onSelect={() => setSelection("Opened the guide.")} /></SpotlightSearch>\n    <SpotlightResults><p className="text-sm">Typed: {query || "Nothing yet."}</p></SpotlightResults>\n    <SpotlightRecent items={["Product roadmap"]} onItemClick={item => setSelection("Opened " + item)} />\n    <SpotlightSuggestions items={["Create a project", "Import work"]} onItemClick={setSelection} />\n    <output className="block text-sm text-muted-foreground">{selection}</output>\n  </div>;\n}';

function KiraDemo() {
  const [destination, setDestination] = useState(
    "Choose a workspace resource.",
  );

  return (
    <div className="space-y-4">
      <KiraSpotlight
        items={resources}
        scopes={scopes}
        enableShortcut
        rememberRecent
        renderPreview={(item) => <p>{item.description}</p>}
        trigger={<SpotlightTrigger showShortcut />}
        onSelect={(item) => setDestination("Opened " + item.label)}
      />
      <output className="block text-sm text-muted-foreground">
        {destination}
      </output>
    </div>
  );
}

const kiraCode =
  'import { useState } from "react";\nimport { KiraSpotlight, SpotlightTrigger, type SpotlightItemType } from "@/components/ui/spotlight";\nimport { IconFile, IconFolder, IconUser } from "@tabler/icons-react";\n\nconst resources: SpotlightItemType[] = [\n  { id: "roadmap", label: "Q4 product roadmap", description: "Projects · Product team", icon: <IconFolder />, scope: "projects", keywords: ["planning", "launch"] },\n  { id: "guide", label: "Customer onboarding guide", description: "Documents · Updated today", icon: <IconFile />, scope: "documents", keywords: ["help", "support"] },\n  { id: "maya", label: "Maya Chen", description: "People · Workspace owner", icon: <IconUser />, scope: "people", keywords: ["admin", "owner"] },\n  { id: "archive", label: "Archived financial report", description: "Documents · Restricted", icon: <IconFile />, scope: "documents", disabled: true, disabledReason: "Ask Finance for access." },\n];\nconst scopes = [\n  { id: "projects", label: "Projects" },\n  { id: "documents", label: "Documents" },\n  { id: "people", label: "People" },\n];\n\nexport function KiraDemo() {\n  const [destination, setDestination] = useState("Choose a workspace resource.");\n  return <div className="space-y-4">\n    <KiraSpotlight items={resources} scopes={scopes} enableShortcut rememberRecent renderPreview={item => <p>{item.description}</p>} trigger={<SpotlightTrigger showShortcut />} onSelect={item => setDestination("Opened " + item.label)} />\n    <output className="block text-sm text-muted-foreground">{destination}</output>\n  </div>;\n}';

function StressDemo() {
  return (
    <div className="flex max-w-xs flex-col gap-3">
      <Spotlight
        loading
        trigger={<SpotlightTrigger>Loading search</SpotlightTrigger>}
      />
      <Spotlight
        items={[]}
        trigger={<SpotlightTrigger>Empty catalog</SpotlightTrigger>}
      />
      <Spotlight
        items={[
          {
            id: "restricted",
            label: "Financial report",
            disabled: true,
            disabledReason: "Ask Finance for access.",
          },
          {
            id: "long",
            label:
              "Release readiness and international customer onboarding — 日本語 العربية ไทย",
            description:
              "A_very_long_unbroken_resource_identifier_012345678901234567890123456789",
          },
        ]}
        trigger={
          <SpotlightTrigger>Stress and disabled results</SpotlightTrigger>
        }
      />
      <SpotlightTrigger disabled>Disabled trigger</SpotlightTrigger>
    </div>
  );
}

const stressCode = `import { Spotlight, SpotlightTrigger } from "@/components/ui/spotlight";

export function StressDemo() {
  return (
    <div className="flex max-w-xs flex-col gap-3">
      <Spotlight
        loading
        trigger={<SpotlightTrigger>Loading search</SpotlightTrigger>}
      />
      <Spotlight
        items={[]}
        trigger={<SpotlightTrigger>Empty catalog</SpotlightTrigger>}
      />
      <Spotlight
        items={[
          {
            id: "restricted",
            label: "Financial report",
            disabled: true,
            disabledReason: "Ask Finance for access.",
          },
          {
            id: "long",
            label:
              "Release readiness and international customer onboarding — 日本語 العربية ไทย",
            description:
              "A_very_long_unbroken_resource_identifier_012345678901234567890123456789",
          },
        ]}
        trigger={
          <SpotlightTrigger>Stress and disabled results</SpotlightTrigger>
        }
      />
      <SpotlightTrigger disabled>Disabled trigger</SpotlightTrigger>
    </div>
  );
}`;

const usageCode =
  'import { useState } from "react";\nimport { Spotlight, SpotlightRoot, KiraSpotlight, SpotlightTrigger, SpotlightGroup, SpotlightItem, SpotlightSearch, SpotlightRecent, SpotlightSuggestions, SpotlightResults } from "@/components/ui/spotlight";\n\nexport function SpotlightUsage() {\n  const [selection, setSelection] = useState("Choose a resource.");\n  const items = [{ id: "guide", label: "Customer onboarding guide" }];\n  return <div>\n    <Spotlight items={items} trigger={<SpotlightTrigger>Search resources</SpotlightTrigger>} onSelect={item => setSelection(item.label)} />\n    <SpotlightRoot trigger={<SpotlightTrigger>Composed search</SpotlightTrigger>}><SpotlightGroup label="Resources"><SpotlightItem item={items[0]} /></SpotlightGroup></SpotlightRoot>\n    <KiraSpotlight items={items} rememberRecent trigger={<SpotlightTrigger>Search with recents</SpotlightTrigger>} />\n    <SpotlightSearch><SpotlightItem item={items[0]} onSelect={() => setSelection(items[0].label)} /></SpotlightSearch>\n    <SpotlightRecent items={["Product roadmap"]} onItemClick={setSelection} />\n    <SpotlightSuggestions items={["Create project"]} onItemClick={setSelection} />\n    <SpotlightResults><output>{selection}</output></SpotlightResults>\n  </div>;\n}';

export default function SpotlightPage() {
  return (
    <ComponentPage>
      <PageHeader
        title="Spotlight"
        description="Find workspace resources, narrow your search, and recover from delayed or unavailable results."
        version="v2.0.1"
      />
      <FeatureGrid
        features={spotlightPageFeatureGridFeatures}
        description="Capabilities built into Kira Kit."
      />
      <DemoTabs defaultValue="basic" tabs={spotlightPageDemoTabsTabs} />
      <KeyboardShortcuts
        shortcuts={spotlightPageShortcuts}
        description="Keyboard navigation and shortcut bindings."
      />
      <UsageBlock
        code={usageCode}
        title="Usage"
        description="All exported Spotlight controls and inline parts. See each feature's focused example for remote search."
        notes={[
          {
            label: "KiraSpotlight",
            body: "Use KiraSpotlight for scoped local/remote search, AbortSignal cancellation, retry recovery, in-memory recents, and opt-in Ctrl+K / ⌘K.",
          },
          {
            label: "Spotlight & inline parts",
            body: "Use Spotlight for static catalogs or compose SpotlightSearch, SpotlightRecent, SpotlightSuggestions, and SpotlightResults inline.",
          },
        ]}
      />
      <APIReference
        sections={spotlightPageAPIReferenceSections}
        description="Props, types, and defaults for each exported part."
      />
      <Changelog entries={spotlightPageChangelogEntries} />
    </ComponentPage>
  );
}

// Static demo metadata stays co-located at the bottom, typed via satisfies.
const spotlightPageFeatureGridFeatures = [
  {
    title: "Scoped search",
    description: "Projects, documents, and people with caller-owned filtering.",
  },
  {
    title: "Remote recovery",
    description: "Debounced search, cancellation, and a clear retry action.",
  },
  {
    title: "Recent resources",
    description:
      "Return to prior destinations with optional in-memory recents.",
  },
  {
    title: "Result previews",
    description: "Review a resource before opening it.",
  },
] satisfies ReactComponentProps<typeof FeatureGrid>["features"];

const spotlightPageDemoTabsTabs = [
  {
    value: "basic",
    label: "Basic",
    group: "Core",
    demo: (
      <DemoWrapper
        title="Workspace search"
        description="Choose a real resource; the selected destination appears below."
        code={basicCode}
      >
        <BasicDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "groups",
    label: "Groups",
    group: "Core",
    demo: (
      <DemoWrapper
        title="Groups and other results"
        description="Grouped items and flat items remain visible and searchable together."
        code={groupsCode}
      >
        <GroupsDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "filter",
    label: "Filtering",
    group: "Core",
    demo: (
      <DemoWrapper
        title="Caller filtering"
        description="Search an exact resource ID. Labels do not affect this custom filter."
        code={filterCode}
      >
        <FilterDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "composition",
    label: "Composition",
    group: "Core",
    demo: (
      <DemoWrapper
        title="Composable and inline controls"
        description="Shared Command owns selection; legacy recent/suggestion parts use native buttons."
        code={compositionCode}
      >
        <CompositionDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "scopes",
    label: "Scopes",
    group: "KiraSpotlight",
    demo: (
      <DemoWrapper
        title="Scoped search"
        description="Change the scope without losing your query. Scope buttons expose their pressed state."
        code={scopesCode}
      >
        <ScopesDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "remote",
    label: "Remote",
    group: "KiraSpotlight",
    demo: (
      <DemoWrapper
        title="Remote search and retry"
        description="Illustrative 600ms search: type error to fail, then Retry search or change the query."
        code={remoteCode}
      >
        <RemoteDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "recents",
    label: "Recents",
    group: "KiraSpotlight",
    demo: (
      <DemoWrapper
        title="Recent resources"
        description="Open a resource, reopen search, and clear the in-memory recents. The full catalog stays available."
        code={recentsCode}
      >
        <RecentsDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "preview",
    label: "Preview",
    group: "KiraSpotlight",
    demo: (
      <DemoWrapper
        title="Result previews"
        description="Arrow through results to see contextual information before opening a destination."
        code={previewCode}
      >
        <PreviewDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "kira",
    label: "Kira",
    group: "KiraSpotlight",
    demo: (
      <DemoWrapper
        title="Kira workspace search"
        description="Ctrl+K or ⌘K opens this search while this tab is mounted. Editable fields keep their shortcuts."
        code={kiraCode}
      >
        <KiraDemo />
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
        description="Loading, empty catalog, disabled trigger/items, and long multilingual results inside a max-w-xs column."
        code={stressCode}
      >
        <StressDemo />
      </DemoWrapper>
    ),
  },
] satisfies ReactComponentProps<typeof DemoTabs>["tabs"];

const spotlightPageShortcuts = [
  {
    keys: "↑ / ↓",
    description:
      "Choose an enabled result; wrapping is inherited from cmdk through Kira Command.",
  },
  {
    keys: "Home / End",
    description:
      "First/last result when the search input is focused; inherited from cmdk.",
  },
  {
    keys: "Enter",
    description:
      "Open the highlighted resource; inherited from cmdk. Composing text does not select.",
  },
  {
    keys: "Tab / Shift+Tab",
    description:
      "Move through dialog controls; focus trapping and restoration are inherited from Base UI Dialog.",
  },
  {
    keys: "Esc",
    description:
      "Close and return focus to the trigger; inherited from Base UI Dialog.",
  },
  {
    keys: "Ctrl / K",
    description:
      "Kira addition: optional global shortcut (⌘K on Mac), inactive in editable fields by default.",
  },
] satisfies ReactComponentProps<typeof KeyboardShortcuts>["shortcuts"];

const spotlightPageAPIReferenceSections = [
  {
    title: "Spotlight / SpotlightRoot",
    props: [
      {
        prop: "open / defaultOpen",
        type: "boolean",
        default: "false",
        description: "Controlled or initial modal state.",
      },
      {
        prop: "onOpenChange",
        type: "(open: boolean) => void",
        default: "—",
        description: "Receives native dismissal and selection changes.",
      },
      {
        prop: "query / defaultQuery / onQueryChange",
        type: "string / string / (query: string) => void",
        default: '""',
        description: "Controlled or local query. Closing clears it.",
      },
      {
        prop: "items / groups / recentItems",
        type: "SpotlightItemType[] / SpotlightGroupType[] / SpotlightItemType[]",
        default: "[]",
        description:
          "Unique resource IDs across groups; recents precede the complete catalog.",
      },
      {
        prop: "onSelect / closeOnSelect",
        type: "(item: SpotlightItemType) => void / boolean",
        default: "— / true",
        description: "Select a resource; optionally keep the popup open.",
      },
      {
        prop: "onSearch",
        type: "(query: string) => void",
        default: "—",
        description:
          "Called on query events, never callback-identity renders. Remote results belong to KiraSpotlight.search.",
      },
      {
        prop: "filter / disableFilter",
        type: "(item: SpotlightItemType, query: string) => boolean / boolean",
        default: "Text match / false",
        description: "Caller filtering or externally filtered results.",
      },
      {
        prop: "loading / emptyContent",
        type: "boolean / ReactNode",
        default: "false / contextual EmptySearch",
        description: "Loading hides selectable stale results.",
      },
      {
        prop: "trigger / children / header / renderPreview",
        type: "ReactElement / ReactNode / ReactNode / (item: SpotlightItemType<T>) => ReactNode",
        default: "—",
        description:
          "Trigger element, composed result content, header, and noninteractive selected-result preview.",
      },
      {
        prop: "size / className",
        type: '"sm" | "default" | "lg" | "full" / string',
        default: '"default"',
        description: "Popup width and classes.",
      },
      {
        prop: "placeholder / title / showShortcutHint",
        type: "string / string / boolean",
        default: "Search your workspace / Search workspace / true",
        description: "Search prompt, dialog name, and navigation hints.",
      },
      {
        prop: "onClearRecent",
        type: "() => void",
        default: "—",
        description: "Shows the Clear recents action.",
      },
    ],
  },
  {
    title: "KiraSpotlight",
    props: [
      {
        prop: "Spotlight props",
        type: "SpotlightProps (except onSearch and header)",
        default: "—",
        description: "All other root options are forwarded.",
      },
      {
        prop: "search",
        type: "(query: string, context: { signal: AbortSignal; scope: string }) => Promise<SpotlightItemType[]>",
        default: "—",
        description:
          "Caller-owned remote search with debounce, cancellation, stale-result guards and retry.",
      },
      {
        prop: "debounceMs / minQueryLength",
        type: "number / number",
        default: "200 / 1",
        description:
          "Delay and nonempty-query threshold. Queries below the threshold use local resources.",
      },
      {
        prop: "scopes / scope / defaultScope / onScopeChange",
        type: "SpotlightScope[] / string / string / (scope: string) => void",
        default: '[] / — / "all" / —',
        description: "Scope buttons. Local resource scope IDs must match.",
      },
      {
        prop: "rememberRecent / maxRecent / onRecentItemsChange",
        type: "boolean / number / (items: SpotlightItemType[]) => void",
        default: "false / 5 / —",
        description:
          "In-memory recents or caller-controlled recentItems; no storage.",
      },
      {
        prop: "enableShortcut / shortcutInEditable",
        type: "boolean / boolean",
        default: "false / false",
        description:
          "Opt-in Ctrl+K or ⌘K; repeated/composing keys and unrelated dialogs are ignored. Mount a single shortcut owner.",
      },
    ],
  },
  {
    title: "SpotlightItem",
    props: [
      {
        prop: "item",
        type: "SpotlightItemType",
        default: "Required",
        description:
          "id, label, description, icon, shortcut hints, keywords, onSelect, data, scope, disabled and visible disabledReason.",
      },
      {
        prop: "onSelect / index / className",
        type: "() => void / number / string",
        default: "—",
        description:
          "Selection override and styling; index is retained but cmdk owns indexing.",
      },
    ],
  },
  {
    title: "SpotlightGroup",
    props: [
      {
        prop: "label / children",
        type: "string / ReactNode",
        default: "Required",
        description: "Command group heading and result rows.",
      },
      {
        prop: "Native props / ref / className",
        type: "CommandGroup props",
        default: "—",
        description:
          "Forwarded to the shared group; className styles the wrapper.",
      },
    ],
  },
  {
    title: "SpotlightTrigger",
    props: [
      {
        prop: "Button props / showShortcut",
        type: "ButtonProps / boolean",
        default: "outline / false",
        description:
          "Pass through the root trigger prop. Shortcut hints do not register a global listener.",
      },
    ],
  },
  {
    title: "SpotlightSearch",
    props: [
      {
        prop: "onSearch / children / native props / ref",
        type: "(query: string) => void / ReactNode / div props / Ref<HTMLDivElement>",
        default: "—",
        description:
          "Inline shared Command input and list. Use SpotlightItem children for selectable rows.",
      },
    ],
  },
  {
    title: "SpotlightRecent / SpotlightSuggestions",
    props: [
      {
        prop: "items / onItemClick / native props / ref",
        type: "string[] / (item: string) => void / div props / Ref<HTMLDivElement>",
        default: "Required / —",
        description:
          "Native recent/suggestion buttons; disabled without a handler.",
      },
    ],
  },
  {
    title: "SpotlightResults",
    props: [
      {
        prop: "children / native props / ref",
        type: "ReactNode / div props / Ref<HTMLDivElement>",
        default: "—",
        description:
          "Presentation wrapper; selectable results use SpotlightItem inside Command.",
      },
    ],
  },
] satisfies ReactComponentProps<typeof APIReference>["sections"];

const spotlightPageChangelogEntries = [
  {
    version: "2.0.1",
    date: "27 November 2026",
    changes: [
      {
        type: "fixed",
        title: "Close button alignment and input focus ring overlap",
        description:
          "Moved the Spotlight close button into a dedicated flex header row alongside the visible title label so initial input focus never overlaps the close button, and honored custom title props in both the label and aria-label.",
      },
      {
        type: "fixed",
        title: "OS-aware shortcut hints",
        description:
          "Resolved SpotlightItem shortcut tokens and footer Enter keycap through Kbd keys grammar so modifier badges adapt to Windows, Linux, and macOS, and exposed aria-keyshortcuts on SpotlightTrigger when showShortcut is enabled.",
      },
    ],
  },
  {
    version: "2.0.0",
    date: "13 November 2026",
    changes: [
      {
        type: "added",
        title: "KiraSpotlight",
        description:
          "Scoped local/remote search, AbortSignal cancellation, retry, previews, deduplicated recents and an opt-in shortcut. Audited against Base UI 1.9.0.",
      },
      {
        type: "fixed",
        title: "Shared keyboard and dialog behavior",
        description:
          "Reuses Kira Command and CommandDialog; removes fixed IDs, modulo navigation, stale selectable results, callback render loops and overlapping GSAP effects.",
      },
      {
        type: "breaking",
        title: "Trigger and presentation contracts",
        description:
          "Use trigger={<SpotlightTrigger />} with a React element; asChild is removed in favor of Button.render. spotlightOverlayVariants is removed because the shared dialog owns the overlay. Root onSearch receives query events; remote search returns items through KiraSpotlight.search.",
      },
      {
        type: "changed",
        title: "Recents and previews",
        description:
          "Recents precede the full catalog. Disabled reasons remain visible. Preview content is descriptive and should contain no interactive controls. Shortcut badges are hints; only enableShortcut registers Ctrl+K or ⌘K.",
      },
    ],
  },
] satisfies ReactComponentProps<typeof Changelog>["entries"];
