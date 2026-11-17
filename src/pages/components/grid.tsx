import * as React from "react";
import {
  IconLayoutGrid,
  IconArrowsHorizontal,
  IconListDetails,
} from "@tabler/icons-react";
import { Grid, GridItem, KiraGrid } from "@/components/ui/grid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

const projects = [
  { id: "access", name: "Access rules", owner: "Maya Chen" },
  { id: "history", name: "Audit history", owner: "Jon Bell" },
  { id: "exports", name: "Export workflow", owner: "Amira Patel" },
];

function ProjectCard({ project }: { project: (typeof projects)[number] }) {
  return (
    <article className="flex h-48 min-w-0 flex-col gap-3 rounded-lg border p-4">
      <h3 className="font-medium">{project.name}</h3>
      <p className="text-sm text-muted-foreground">Release-planning fixture</p>
      <p className="mt-auto text-sm">
        <span className="text-muted-foreground">Owner: </span>
        {project.owner}
      </p>
    </article>
  );
}

function BasicDemo() {
  return (
    <Grid as="ul" cols={{ base: 1, sm: 2, lg: 3 }} gap={4}>
      {projects.map((project) => (
        <GridItem as="li" key={project.id}>
          <ProjectCard project={project} />
        </GridItem>
      ))}
    </Grid>
  );
}

const basicDemoCode = `import { Grid, GridItem } from "@/components/ui/grid";

const projects = [
  { id: "access", name: "Access rules", owner: "Maya Chen" },
  { id: "history", name: "Audit history", owner: "Jon Bell" },
  { id: "exports", name: "Export workflow", owner: "Amira Patel" },
];

function ProjectCard({ project }: { project: typeof projects[number] }) {
  return <article className="flex h-48 min-w-0 flex-col gap-3 rounded-lg border p-4">
    <h3 className="font-medium">{project.name}</h3>
    <p className="text-sm text-muted-foreground">Release-planning fixture</p>
    <p className="mt-auto text-sm"><span className="text-muted-foreground">Owner: </span>{project.owner}</p>
  </article>;
}

export function BasicDemo() {
  return <Grid as="ul" cols={{ base: 1, sm: 2, lg: 3 }} gap={4}>
    {projects.map((project) => <GridItem as="li" key={project.id}><ProjectCard project={project} /></GridItem>)}
  </Grid>;
}`;

function ResponsiveDemo() {
  return (
    <Grid
      cols={{ base: 1, sm: 2, lg: 3 }}
      rows={{ base: "none", lg: 2 }}
      gapX={{ base: 2, md: 8 }}
      gapY={{ base: 4, md: 2 }}
      align={{ base: "stretch", md: "start" }}
    >
      {[
        "Access review",
        "Audit summary",
        "Export settings",
        "Rollout plan",
        "Owner notes",
        "Documentation",
      ].map((name) => (
        <GridItem
          key={name}
          className="rounded-lg border bg-muted/30 p-4 text-sm"
        >
          {name}
        </GridItem>
      ))}
    </Grid>
  );
}

const responsiveDemoCode = `import { Grid, GridItem } from "@/components/ui/grid";

export function ResponsiveDemo() {
  return <Grid cols={{ base: 1, sm: 2, lg: 3 }} rows={{ base: "none", lg: 2 }}
    gapX={{ base: 2, md: 8 }} gapY={{ base: 4, md: 2 }} align={{ base: "stretch", md: "start" }}>
    {["Access review", "Audit summary", "Export settings", "Rollout plan", "Owner notes", "Documentation"].map((name) =>
      <GridItem key={name} className="rounded-lg border bg-muted/30 p-4 text-sm">{name}</GridItem>)}
  </Grid>;
}`;

function IntrinsicDemo() {
  const [wide, setWide] = React.useState(false);
  const [fill, setFill] = React.useState(false);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          aria-pressed={!wide}
          onClick={() => setWide(false)}
        >
          Compact panel
        </Button>
        <Button
          variant="outline"
          size="sm"
          aria-pressed={wide}
          onClick={() => setWide(true)}
        >
          Wide panel
        </Button>
        <Button
          variant="outline"
          size="sm"
          aria-pressed={fill}
          onClick={() => setFill((value) => !value)}
        >
          Keep empty tracks
        </Button>
      </div>
      <div className="max-w-full" style={{ width: wide ? 760 : 320 }}>
        <Grid
          cols={fill ? "auto-fill" : "auto-fit"}
          minItemWidth="14rem"
          gap={4}
        >
          {projects.slice(0, 2).map((project) => (
            <GridItem key={project.id}>
              <ProjectCard project={project} />
            </GridItem>
          ))}
        </Grid>
      </div>
      <p className="text-sm text-muted-foreground">
        {fill
          ? "Auto-fill keeps room for an empty track when it fits."
          : "Auto-fit expands the occupied tracks."}{" "}
        The minimum is clamped to the panel width.
      </p>
    </div>
  );
}

const intrinsicDemoCode = `import * as React from "react";
import { Grid, GridItem } from "@/components/ui/grid";
import { Button } from "@/components/ui/button";

const projects = [
  { id: "access", name: "Access rules", owner: "Maya Chen" },
  { id: "history", name: "Audit history", owner: "Jon Bell" },
  { id: "exports", name: "Export workflow", owner: "Amira Patel" },
];

function ProjectCard({ project }: { project: typeof projects[number] }) {
  return <article className="flex h-48 min-w-0 flex-col gap-3 rounded-lg border p-4">
    <h3 className="font-medium">{project.name}</h3>
    <p className="text-sm text-muted-foreground">Release-planning fixture</p>
    <p className="mt-auto text-sm"><span className="text-muted-foreground">Owner: </span>{project.owner}</p>
  </article>;
}

export function IntrinsicDemo() {
  const [wide, setWide] = React.useState(false);
  const [fill, setFill] = React.useState(false);
  return <div className="space-y-4">
    <div className="flex flex-wrap gap-2">
      <Button variant="outline" size="sm" aria-pressed={!wide} onClick={() => setWide(false)}>Compact panel</Button>
      <Button variant="outline" size="sm" aria-pressed={wide} onClick={() => setWide(true)}>Wide panel</Button>
      <Button variant="outline" size="sm" aria-pressed={fill} onClick={() => setFill((value) => !value)}>Keep empty tracks</Button>
    </div>
    <div className="max-w-full" style={{ width: wide ? 760 : 320 }}>
      <Grid cols={fill ? "auto-fill" : "auto-fit"} minItemWidth="14rem" gap={4}>
        {projects.slice(0, 2).map((project) => <GridItem key={project.id}><ProjectCard project={project} /></GridItem>)}
      </Grid>
    </div>
    <p className="text-sm text-muted-foreground">{fill ? "Auto-fill keeps room for an empty track when it fits." : "Auto-fit expands the occupied tracks."} The minimum is clamped to the panel width.</p>
  </div>;
}`;

function PlacementDemo() {
  const [selected, setSelected] = React.useState("None");

  return (
    <div className="space-y-4">
      <Grid cols={{ base: 1, md: 6 }} gap={4}>
        <GridItem
          colSpan={{ base: 1, md: 3 }}
          colStart={{ base: "auto", md: 2 }}
          rowSpan={2}
          className="rounded-lg border bg-muted/30 p-4"
        >
          <h3 className="mb-3 font-medium">Release overview</h3>
          <Button variant="outline" onClick={() => setSelected("Overview")}>
            Review overview
          </Button>
        </GridItem>
        <GridItem
          colSpan={{ base: 1, md: 2 }}
          justifySelf={{ base: "stretch", md: "start" }}
          className="rounded-lg border p-4"
        >
          <Button variant="outline" onClick={() => setSelected("Owners")}>
            Review owners
          </Button>
        </GridItem>
        <GridItem
          colSpan={{ base: 1, md: 2 }}
          className="rounded-lg border p-4"
        >
          <Button variant="outline" onClick={() => setSelected("Notes")}>
            Review notes
          </Button>
        </GridItem>
        <GridItem
          colSpan="full"
          className="rounded-lg border p-4 text-sm text-muted-foreground"
        >
          DOM order stays overview, owners, notes, then this summary.
        </GridItem>
      </Grid>
      <output className="block text-sm text-muted-foreground">
        Last action: {selected}
      </output>
    </div>
  );
}

const placementDemoCode = `import * as React from "react";
import { Grid, GridItem } from "@/components/ui/grid";
import { Button } from "@/components/ui/button";

export function PlacementDemo() {
  const [selected, setSelected] = React.useState("None");
  return <div className="space-y-4">
    <Grid cols={{ base: 1, md: 6 }} gap={4}>
      <GridItem colSpan={{ base: 1, md: 3 }} colStart={{ base: "auto", md: 2 }} rowSpan={2}
        className="rounded-lg border bg-muted/30 p-4">
        <h3 className="mb-3 font-medium">Release overview</h3>
        <Button variant="outline" onClick={() => setSelected("Overview")}>Review overview</Button>
      </GridItem>
      <GridItem colSpan={{ base: 1, md: 2 }} justifySelf={{ base: "stretch", md: "start" }} className="rounded-lg border p-4">
        <Button variant="outline" onClick={() => setSelected("Owners")}>Review owners</Button>
      </GridItem>
      <GridItem colSpan={{ base: 1, md: 2 }} className="rounded-lg border p-4">
        <Button variant="outline" onClick={() => setSelected("Notes")}>Review notes</Button>
      </GridItem>
      <GridItem colSpan="full" className="rounded-lg border p-4 text-sm text-muted-foreground">DOM order stays overview, owners, notes, then this summary.</GridItem>
    </Grid>
    <p role="status" className="text-sm text-muted-foreground">Last action: {selected}</p>
  </div>;
}`;

function SubgridDemo() {
  const [selected, setSelected] = React.useState("");

  const plans = [
    { name: "Starter", description: "For a small team.", price: "$12" },
    {
      name: "Team",
      description:
        "Shared access rules, activity history, and release workflows for teams working across projects.",
      price: "$29",
    },
    {
      name: "Enterprise",
      description: "Managed access and organization controls.",
      price: "Contact us",
    },
  ];

  return (
    <div className="space-y-4">
      <Grid cols="auto-fit" minItemWidth="14rem" gap={4}>
        {plans.map((plan) => (
          <GridItem
            key={plan.name}
            rowSpan={4}
            className="grid grid-rows-subgrid gap-4 rounded-lg border p-4"
          >
            <h3 className="font-semibold">{plan.name}</h3>
            <p className="text-sm text-muted-foreground">{plan.description}</p>
            <p className="font-semibold tabular-nums">{plan.price}</p>
            <Button
              variant="outline"
              aria-pressed={selected === plan.name}
              onClick={() => setSelected(plan.name)}
            >
              {selected === plan.name ? "Selected" : "Select"} {plan.name}
            </Button>
          </GridItem>
        ))}
      </Grid>
      <p className="text-sm text-muted-foreground">
        Illustrative plans.{" "}
        {selected ? `Local selection: ${selected}.` : "No plan selected."}
      </p>
    </div>
  );
}

const subgridDemoCode = `import * as React from "react";
import { Grid, GridItem } from "@/components/ui/grid";
import { Button } from "@/components/ui/button";

export function SubgridDemo() {
  const [selected, setSelected] = React.useState("");
  const plans = [
    { name: "Starter", description: "For a small team.", price: "$12" },
    { name: "Team", description: "Shared access rules, activity history, and release workflows for teams working across projects.", price: "$29" },
    { name: "Enterprise", description: "Managed access and organization controls.", price: "Contact us" },
  ];
  return <div className="space-y-4">
    <Grid cols="auto-fit" minItemWidth="14rem" gap={4}>
      {plans.map((plan) => <GridItem key={plan.name} rowSpan={4} className="grid grid-rows-subgrid gap-4 rounded-lg border p-4">
        <h3 className="font-semibold">{plan.name}</h3>
        <p className="text-sm text-muted-foreground">{plan.description}</p>
        <p className="font-semibold tabular-nums">{plan.price}</p>
        <Button variant="outline" aria-pressed={selected === plan.name} onClick={() => setSelected(plan.name)}>{selected === plan.name ? "Selected" : "Select"} {plan.name}</Button>
      </GridItem>)}
    </Grid>
    <p className="text-sm text-muted-foreground">Illustrative plans. {selected ? \`Local selection: \${selected}.\` : "No plan selected."}</p>
  </div>;
}`;

function SemanticsDemo() {
  const id = React.useId();
  const ref = React.useRef<HTMLFormElement>(null);
  const [saved, setSaved] = React.useState("");

  return (
    <div className="space-y-4">
      <Grid
        as="form"
        ref={ref}
        cols={{ base: 1, md: 2 }}
        gap={4}
        onSubmit={(event) => {
          event.preventDefault();
          setSaved(
            String(new FormData(event.currentTarget).get("project") ?? ""),
          );
        }}
      >
        <GridItem className="space-y-2">
          <label htmlFor={id} className="text-sm font-medium">
            Project
          </label>
          <Input id={id} name="project" defaultValue="Access rules" required />
        </GridItem>
        <GridItem className="space-y-2">
          <label htmlFor={`${id}-owner`} className="text-sm font-medium">
            Owner
          </label>
          <Input id={`${id}-owner`} name="owner" defaultValue="Maya Chen" />
        </GridItem>
        <GridItem colSpan="full">
          <Button
            variant="outline"
            type="button"
            onClick={() => ref.current?.requestSubmit()}
          >
            Save local assignment
          </Button>
        </GridItem>
      </Grid>
      <output className="block text-sm text-muted-foreground">
        {saved ? `Saved assignment: ${saved}.` : "No local assignment saved."}
      </output>
    </div>
  );
}

const semanticsDemoCode = `import * as React from "react";
import { Grid, GridItem } from "@/components/ui/grid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function SemanticsDemo() {
  const id = React.useId();
  const ref = React.useRef<HTMLFormElement>(null);
  const [saved, setSaved] = React.useState("");
  return <div className="space-y-4">
    <Grid as="form" ref={ref} cols={{ base: 1, md: 2 }} gap={4} onSubmit={(event) => {
      event.preventDefault();
      setSaved(String(new FormData(event.currentTarget).get("project") ?? ""));
    }}>
      <GridItem className="space-y-2"><label htmlFor={id} className="text-sm font-medium">Project</label><Input id={id} name="project" defaultValue="Access rules" required /></GridItem>
      <GridItem className="space-y-2"><label htmlFor={\`\${id}-owner\`} className="text-sm font-medium">Owner</label><Input id={\`\${id}-owner\`} name="owner" defaultValue="Maya Chen" /></GridItem>
      <GridItem colSpan="full"><Button variant="outline" type="button" onClick={() => ref.current?.requestSubmit()}>Save local assignment</Button></GridItem>
    </Grid>
    <p role="status" className="text-sm text-muted-foreground">{saved ? \`Saved assignment: \${saved}.\` : "No local assignment saved."}</p>
  </div>;
}`;

function KiraDemo() {
  const id = React.useId();
  const [query, setQuery] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [selected, setSelected] = React.useState("");

  const visible = projects.filter((project) =>
    project.name.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end gap-3">
        <div className="min-w-0 flex-1 space-y-2">
          <label htmlFor={id} className="text-sm font-medium">
            Find a project
          </label>
          <Input
            id={id}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
        <Button variant="outline" onClick={() => setLoading((value) => !value)}>
          {loading ? "Finish local refresh" : "Refresh fixture"}
        </Button>
      </div>
      <KiraGrid
        as="ul"
        items={visible}
        getKey={(project) => project.id}
        loading={loading}
        loadingLabel="Refreshing the local project fixture…"
        minItemWidth="14rem"
        emptyContent={
          <div className="space-y-3">
            <p>No projects match this search.</p>
            <Button variant="outline" size="sm" onClick={() => setQuery("")}>
              Clear search
            </Button>
          </div>
        }
        renderItem={(project) => (
          <article className="flex h-48 flex-col gap-3 rounded-lg border p-4">
            <h3 className="font-medium">{project.name}</h3>
            <p className="text-sm text-muted-foreground">
              Owner: {project.owner}
            </p>
            <Button
              variant="outline"
              className="mt-auto"
              aria-pressed={selected === project.id}
              onClick={() => setSelected(project.id)}
            >
              Inspect {project.name}
            </Button>
          </article>
        )}
      />
      <p className="text-sm text-muted-foreground">
        Selected project:{" "}
        {projects.find((project) => project.id === selected)?.name ?? "None"}.
      </p>
    </div>
  );
}

const kiraDemoCode = `import * as React from "react";
import { KiraGrid } from "@/components/ui/grid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const projects = [
  { id: "access", name: "Access rules", owner: "Maya Chen" },
  { id: "history", name: "Audit history", owner: "Jon Bell" },
  { id: "exports", name: "Export workflow", owner: "Amira Patel" },
];

export function KiraDemo() {
  const id = React.useId();
  const [query, setQuery] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [selected, setSelected] = React.useState("");
  const visible = projects.filter((project) => project.name.toLowerCase().includes(query.toLowerCase()));
  return <div className="space-y-4">
    <div className="flex flex-wrap items-end gap-3">
      <div className="min-w-0 flex-1 space-y-2"><label htmlFor={id} className="text-sm font-medium">Find a project</label><Input id={id} value={query} onChange={(event) => setQuery(event.target.value)} /></div>
      <Button variant="outline" onClick={() => setLoading((value) => !value)}>{loading ? "Finish local refresh" : "Refresh fixture"}</Button>
    </div>
    <KiraGrid as="ul" items={visible} getKey={(project) => project.id} loading={loading}
      loadingLabel="Refreshing the local project fixture…" minItemWidth="14rem"
      emptyContent={<div className="space-y-3"><p>No projects match this search.</p><Button variant="outline" size="sm" onClick={() => setQuery("")}>Clear search</Button></div>}
      renderItem={(project) => <article className="flex h-48 flex-col gap-3 rounded-lg border p-4">
        <h3 className="font-medium">{project.name}</h3><p className="text-sm text-muted-foreground">Owner: {project.owner}</p>
        <Button variant="outline" className="mt-auto" aria-pressed={selected === project.id} onClick={() => setSelected(project.id)}>Inspect {project.name}</Button>
      </article>} />
    <p className="text-sm text-muted-foreground">Selected project: {projects.find((project) => project.id === selected)?.name ?? "None"}.</p>
  </div>;
}`;

function StatesDemo() {
  const [state, setState] = React.useState<
    "ready" | "loading" | "empty" | "error"
  >("ready");

  const items =
    state === "ready"
      ? [
          {
            id: "long",
            name: "release-permissions-audit-history-and-migration-notes",
            owner: "owner-with-a-very-long-address@example.test",
          },
        ]
      : [];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {(["ready", "loading", "empty", "error"] as const).map((value) => (
          <Button
            key={value}
            variant="outline"
            size="sm"
            aria-pressed={state === value}
            onClick={() => setState(value)}
          >
            {value}
          </Button>
        ))}
      </div>
      <KiraGrid
        items={items}
        getKey={(item) => item.id}
        minItemWidth="14rem"
        loading={state === "loading"}
        loadingCount={3}
        error={
          state === "error"
            ? "Projects could not be loaded. Try the local fixture again."
            : undefined
        }
        onRetry={() => setState("ready")}
        emptyContent={
          <div className="space-y-3">
            <p>No projects yet.</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setState("ready")}
            >
              Create local project
            </Button>
          </div>
        }
        renderItem={(item) => (
          <article className="h-48 space-y-3 rounded-lg border p-4">
            <h3 className="font-medium">{item.name}</h3>
            <p className="text-sm text-muted-foreground">{item.owner}</p>
            <p className="text-sm text-muted-foreground">
              Read-only snapshot. Editing requires owner access.
            </p>
          </article>
        )}
      />
    </div>
  );
}

const statesDemoCode = `import * as React from "react";
import { KiraGrid } from "@/components/ui/grid";
import { Button } from "@/components/ui/button";

export function StatesDemo() {
  const [state, setState] = React.useState<"ready" | "loading" | "empty" | "error">("ready");
  const items = state === "ready" ? [{ id: "long", name: "release-permissions-audit-history-and-migration-notes", owner: "owner-with-a-very-long-address@example.test" }] : [];
  return <div className="space-y-4">
    <div className="flex flex-wrap gap-2">{(["ready", "loading", "empty", "error"] as const).map((value) =>
      <Button key={value} variant="outline" size="sm" aria-pressed={state === value} onClick={() => setState(value)}>{value}</Button>)}</div>
    <KiraGrid items={items} getKey={(item) => item.id} minItemWidth="14rem"
      loading={state === "loading"} loadingCount={3}
      error={state === "error" ? "Projects could not be loaded. Try the local fixture again." : undefined}
      onRetry={() => setState("ready")}
      emptyContent={<div className="space-y-3"><p>No projects yet.</p><Button variant="outline" size="sm" onClick={() => setState("ready")}>Create local project</Button></div>}
      renderItem={(item) => <article className="h-48 space-y-3 rounded-lg border p-4">
        <h3 className="font-medium">{item.name}</h3><p className="text-sm text-muted-foreground">{item.owner}</p>
        <p className="text-sm text-muted-foreground">Read-only snapshot. Editing requires owner access.</p>
      </article>} />
  </div>;
}`;

const gridDemos = [
  {
    value: "basic",
    label: "Basic",
    title: "A semantic project list",
    description: "Responsive columns, stable keys, and native list items.",
    Demo: BasicDemo,
    code: basicDemoCode,
  },
  {
    value: "responsive",
    label: "Responsive",
    title: "Columns, rows, and separate gaps",
    description: "All breakpoint candidates ship in the component source.",
    Demo: ResponsiveDemo,
    code: responsiveDemoCode,
  },
  {
    value: "intrinsic",
    label: "Intrinsic",
    title: "Fit the panel, not the page",
    description:
      "Switch panel width and compare auto-fit with auto-fill. Both fit narrow containers.",
    Demo: IntrinsicDemo,
    code: intrinsicDemoCode,
  },
  {
    value: "placement",
    label: "Placement",
    title: "Responsive item placement",
    description:
      "Spans, starting lines, and self alignment are responsive. Keyboard order follows the DOM.",
    Demo: PlacementDemo,
    code: placementDemoCode,
  },
  {
    value: "subgrid",
    label: "Subgrid",
    title: "Align unequal plan content",
    description:
      "Four shared row tracks align descriptions, prices, and actions without fixed text heights.",
    Demo: SubgridDemo,
    code: subgridDemoCode,
  },
  {
    value: "semantics",
    label: "Semantics",
    title: "A native form and ref",
    description:
      "The as prop provides form-specific props, event types, and an HTMLFormElement ref.",
    Demo: SemanticsDemo,
    code: semanticsDemoCode,
  },
  {
    value: "kira",
    label: "Kira",
    title: "A deferred project collection",
    description:
      "Filtering, empty feedback, and a manual refresh fixture. Existing items remain mounted during refresh.",
    Demo: KiraDemo,
    code: kiraDemoCode,
  },
  {
    value: "states",
    label: "States",
    title: "Loading, empty, recovery, and long values",
    description:
      "Buttons drive local states. Every placeholder occupies the same 12rem card height.",
    Demo: StatesDemo,
    code: statesDemoCode,
  },
];

const gridApi = [
  {
    title: "Grid",
    props: [
      {
        prop: "as",
        type: '"div" | "section" | "main" | "article" | "aside" | "ul" | "ol" | "form"',
        default: '"div"',
        description: "Native tag; its props and ref type follow as.",
      },
      {
        prop: "render",
        type: "React.ReactElement | ((props, state) => React.ReactElement)",
        default: "-",
        description:
          "Base UI render composition. The rendered element receives the resolved props.",
      },
      {
        prop: "cols",
        type: 'ResponsiveValue<1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | "none" | "subgrid" | "auto-fit" | "auto-fill">',
        default: "-",
        description: "Fixed, inherited, or intrinsic column tracks.",
      },
      {
        prop: "minItemWidth",
        type: "string | number",
        default: "16rem",
        description:
          "CSS length or positive pixel count for intrinsic columns. The minimum is clamped to 100%.",
      },
      {
        prop: "rows",
        type: 'ResponsiveValue<1 | 2 | 3 | 4 | 5 | 6 | "none" | "subgrid">',
        default: "-",
        description: "Explicit or inherited row tracks.",
      },
      {
        prop: "gap",
        type: "ResponsiveValue<0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16 | 20 | 24>",
        default: "-",
        description: "Existing spacing scale.",
      },
      {
        prop: "gapX / gapY",
        type: "ResponsiveValue<0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12>",
        default: "-",
        description: "Separate responsive horizontal and vertical gaps.",
      },
      {
        prop: "flow",
        type: '"row" | "column" | "dense" | "row-dense" | "column-dense"',
        default: "-",
        description:
          "CSS auto placement. Dense packing can change visual order; DOM focus order stays unchanged.",
      },
      {
        prop: "align",
        type: 'ResponsiveValue<"start" | "end" | "center" | "stretch" | "baseline">',
        default: "-",
        description: "Align items on the block axis.",
      },
      {
        prop: "justify / place",
        type: 'ResponsiveValue<"start" | "end" | "center" | "stretch">',
        default: "-",
        description: "Inline-axis or combined item alignment.",
      },
      {
        prop: "inline",
        type: "boolean",
        default: "false",
        description: "Use inline-grid.",
      },
      {
        prop: "ref / native props",
        type: "React.ComponentPropsWithRef<T>",
        default: "-",
        description:
          "Native selected-tag props, form events, ARIA attributes and style. Responsive values accept base, sm, md, lg, xl and 2xl.",
      },
    ],
  },
  {
    title: "GridItem",
    props: [
      {
        prop: "as",
        type: "GridElement | 'li'",
        default: '"div"',
        description: "Native item tag. Use li directly inside ul/ol.",
      },
      {
        prop: "render / ref",
        type: "useRender.RenderProp / React.ComponentPropsWithRef<T>['ref']",
        default: "-",
        description: "Native Base UI composition and selected-tag ref.",
      },
      {
        prop: "colSpan",
        type: 'ResponsiveValue<1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | "full">',
        default: "-",
        description: "Responsive column span.",
      },
      {
        prop: "rowSpan",
        type: 'ResponsiveValue<1 | 2 | 3 | 4 | 5 | 6 | "full">',
        default: "-",
        description:
          "Responsive row span. Combine with subgrid for shared rows.",
      },
      {
        prop: "colStart / colEnd",
        type: 'ResponsiveValue<1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | "auto">',
        default: "-",
        description: "Responsive column lines.",
      },
      {
        prop: "rowStart / rowEnd",
        type: 'ResponsiveValue<1 | 2 | 3 | 4 | 5 | 6 | 7 | "auto">',
        default: "-",
        description: "Responsive row lines.",
      },
      {
        prop: "alignSelf / justifySelf",
        type: 'ResponsiveValue<"start" | "end" | "center" | "stretch" | "auto">',
        default: "-",
        description: "Responsive item alignment.",
      },
      {
        prop: "className / native props",
        type: "string / React.ComponentPropsWithRef<T>",
        default: "-",
        description: "Shrinkable item sizing and native props.",
      },
    ],
  },
  {
    title: "KiraGrid",
    props: [
      {
        prop: "items",
        type: "readonly Item[]",
        default: "-",
        description:
          "Caller-owned collection. Existing items stay mounted during a refresh.",
      },
      {
        prop: "getKey",
        type: "(item: Item) => React.Key",
        default: "-",
        description: "Stable, unique key for each item.",
      },
      {
        prop: "renderItem",
        type: "(item: Item, index: number) => React.ReactNode",
        default: "-",
        description:
          "Cell content. Native ul/ol roots receive li wrappers. For render callbacks or custom components that return a list, set matching as.",
      },
      {
        prop: "loading / loadingLabel",
        type: "boolean / string",
        default: 'false / "Loading items…"',
        description: "Caller-controlled busy state and one contextual status.",
      },
      {
        prop: "loadingCount",
        type: "number",
        default: "6",
        description:
          "Initial placeholder count, truncated and clamped to 1–100. Non-finite values use 6.",
      },
      {
        prop: "loadingContent",
        type: "React.ReactNode",
        default: "-",
        description:
          "Custom cell skeleton. Match its dimensions to loaded cells.",
      },
      {
        prop: "emptyContent",
        type: "React.ReactNode",
        default: '"No items yet."',
        description: "Empty feedback and optional caller-owned action.",
      },
      {
        prop: "error / onRetry",
        type: "React.ReactNode / (() => void)",
        default: "-",
        description:
          "Recovery feedback. Existing items can remain below an error.",
      },
      {
        prop: "Grid props",
        type: "Omit<GridProps<T>, 'children'>",
        default: 'cols="auto-fit", gap=4',
        description: "Native grid configuration.",
      },
    ],
  },
  {
    title: "gridVariants",
    props: [
      {
        prop: "inline",
        type: "boolean",
        default: "false",
        description:
          "Grid or inline-grid display plus shrinkable direct children.",
      },
      {
        prop: "className",
        type: "string",
        default: "-",
        description: "Additional classes.",
      },
    ],
  },
  {
    title: "gridItemVariants",
    props: [
      {
        prop: "className",
        type: "string",
        default: "-",
        description: "Shared min-width and word-wrapping item classes.",
      },
    ],
  },
] satisfies React.ComponentProps<typeof APIReference>["sections"];

// oxlint-disable-next-line max-lines-per-function -- Static documentation keeps related examples and API tables together for comparison.
export default function GridPage() {
  return (
    <ComponentPage>
      <PageHeader
        title="Grid"
        description="Native CSS Grid layouts that fit pages and embedded panels. Typed composition, intrinsic tracks, subgrid, and deferred collections."
        version="2.0.1"
      />
      <FeatureGrid features={gridPageFeatureGridFeatures} />
      <DemoTabs
        defaultValue="basic"
        tabs={gridDemos.map(
          ({ value, label, title, description, Demo, code }) => ({
            value,
            label,
            demo: (
              <DemoWrapper title={title} description={description} code={code}>
                <Demo />
              </DemoWrapper>
            ),
          }),
        )}
      />
      <KeyboardShortcuts
        shortcuts={[
          {
            keys: "Tab / Shift + Tab",
            description:
              "Follow the DOM order through native child controls. CSS placement does not reorder keyboard focus.",
          },
          {
            keys: "Enter / Space",
            description:
              "Activate child buttons with native semantics. Grid adds no roving focus or arrow-key interception.",
          },
          {
            keys: "Enter in the form",
            description:
              "Submit the native form. The form-ref example uses requestSubmit() and browser validation.",
          },
        ]}
      />
      <UsageBlock
        code={`import * as React from "react";
import { Grid, GridItem, KiraGrid, gridVariants, gridItemVariants } from "@/components/ui/grid";

const projects = [{ id: "access", name: "Access rules" }, { id: "history", name: "Audit history" }];

export function ResponsiveList() {
  return <Grid as="ul" cols={{ base: 1, md: 3 }} gap={4}>
    <GridItem as="li" colSpan={{ base: 1, md: 2 }}>Featured release</GridItem>
    <GridItem as="li">Owner notes</GridItem>
  </Grid>;
}

export function IntrinsicList() {
  return <Grid cols="auto-fit" minItemWidth="14rem" gap={4}>
    {projects.map((project) => <GridItem key={project.id}>{project.name}</GridItem>)}
  </Grid>;
}

export function DeferredList() {
  return <KiraGrid as="ul" items={projects} getKey={(project) => project.id}
    renderItem={(project) => <article>{project.name}</article>}
    emptyContent="No projects yet." />;
}

export function RenderAdapter() {
  const ref = React.useRef<HTMLElement>(null);
  return <Grid as="section" ref={ref} render={<section aria-label="Release summary" />} cols={2}>
    <GridItem>Access rules</GridItem><GridItem>Audit history</GridItem>
  </Grid>;
}

export function VariantClasses() {
  return <div className={gridVariants({ inline: true })}><div className={gridItemVariants()}>Inline grid content</div></div>;
}`}
      />
      <APIReference sections={gridApi} />
      <Changelog
        entries={[
          {
            version: "2.0.1",
            date: "14 November 2026",
            changes: [
              {
                type: "fixed",
                title: "Native list render adapters",
                description:
                  "KiraGrid now uses li wrappers when render supplies a native ul or ol, including loading, empty and error states. Render callbacks and custom components that return lists require matching as. Compatibility audited on Base UI 1.9.0.",
              },
            ],
          },
          {
            version: "2.0.0",
            date: "13 November 2026",
            changes: [
              {
                type: "fixed",
                title: "Responsive classes and honest types",
                description:
                  "Repaired 17 dictionary errors. Literal breakpoint candidates travel with the registry source; positions and alignment are responsive. Compatibility audited on Base UI 1.9.0; Grid has no native Base UI layout primitive.",
              },
              {
                type: "added",
                title: "Intrinsic columns and KiraGrid",
                description:
                  "Auto-fit/auto-fill with a clamped minimum, typed native tags and refs, semantic items, retained refreshes and collection recovery. Research cutoff October 31, 2026.",
              },
              {
                type: "breaking",
                title: "Responsive layouts now take effect",
                description:
                  "Consumers that relied on missing responsive CSS will see corrected layouts. Native props and ref types follow as; invalid tag-specific attributes are rejected. Items now shrink and wrap long values.",
              },
              {
                type: "fixed",
                title: "Focused demos and API",
                description:
                  "Added Basic, Kira, States, keyboard, subgrid and native-form examples. Removed the inaccurate masonry claim and undefined snippet references.",
              },
            ],
          },
        ]}
      />
    </ComponentPage>
  );
}

const gridPageFeatureGridFeatures = [
  {
    title: "Local width",
    description: "Auto-fit and auto-fill adapt to their available panel width.",
    icon: <IconArrowsHorizontal className="size-4" />,
  },
  {
    title: "Shared tracks",
    description:
      "Subgrid aligns unequal copy and actions without fixed text heights.",
    icon: <IconLayoutGrid className="size-4" />,
  },
  {
    title: "Deferred collections",
    description:
      "Stable keyed items, retained refreshes, skeleton cells, empty states and recovery.",
    icon: <IconListDetails className="size-4" />,
  },
] satisfies React.ComponentProps<typeof FeatureGrid>["features"];
