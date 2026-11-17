import * as React from "react";

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
import {
  Kanban,
  KanbanColumn,
  KanbanCard,
  KanbanHeader,
  KanbanAddColumn,
  KiraKanban,
  useKanban,
  type KanbanColumnData,
} from "@/components/ui/kanban";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const releaseBoard: KanbanColumnData[] = [
  {
    id: "ready",
    title: "Ready",
    cards: [
      {
        id: "search",
        title: "Ship saved searches",
        description: "Preserve the review team's filters.",
        priority: "medium",
        tags: ["Search"],
        assignee: { id: "an", name: "An Tran" },
      },
      {
        id: "migration",
        title: "Validate migration rollback",
        priority: "critical",
        blockedReason: "Waiting for the staging database restore.",
        assignee: { id: "maya", name: "Maya Patel" },
        comments: 3,
      },
    ],
  },
  {
    id: "review",
    title: "In review",
    limit: 1,
    cards: [
      {
        id: "access",
        title: "Review workspace permissions",
        description: "Check the guest-to-member handoff.",
        priority: "high",
        checklist: { completed: 2, total: 4 },
        dueDate: "30 Oct",
        attachments: 2,
      },
    ],
  },
  { id: "done", title: "Released", cards: [] },
];

const boardSource = `import type { KanbanColumnData } from "@/components/ui/kanban";\nconst releaseBoard: KanbanColumnData[] = ${JSON.stringify(releaseBoard, null, 2)};`;

function BasicDemo() {
  return (
    <Kanban
      defaultColumns={releaseBoard}
      columnSize="sm"
      aria-label="Release work"
    />
  );
}

const basicCode = `import { Kanban } from "@/components/ui/kanban";\n${boardSource}\n\nexport function BasicDemo() {\n  return <Kanban defaultColumns={releaseBoard} columnSize="sm" aria-label="Release work" />;\n}`;

function MovementDemo() {
  const [columns, setColumns] = React.useState(releaseBoard);
  const [lastMove, setLastMove] = React.useState("No move yet.");

  return (
    <div className="space-y-3">
      <output className="text-sm text-muted-foreground">{lastMove}</output>
      <Kanban
        columns={columns}
        onColumnsChange={setColumns}
        columnSize="sm"
        enableKeyboard={false}
        onCardMove={({ card, targetColumn }) =>
          setLastMove(card.title + " moved to " + targetColumn.title)
        }
      />
      <p className="text-xs text-muted-foreground">
        Keyboard dragging is disabled here. Move card still works with keyboard,
        click and tap.
      </p>
    </div>
  );
}

const movementCode = `import * as React from "react";\nimport { Kanban } from "@/components/ui/kanban";\n${boardSource}\n\nexport function MovementDemo() {\n  const [columns, setColumns] = React.useState(releaseBoard);\n  const [lastMove, setLastMove] = React.useState("No move yet.");\n  return <><p role="status">{lastMove}</p><Kanban columns={columns} onColumnsChange={setColumns} columnSize="sm" enableKeyboard={false} onCardMove={({ card, targetColumn }) => setLastMove(card.title + " moved to " + targetColumn.title)} /></>;\n}`;

function CapacityDemo() {
  const [enforce, setEnforce] = React.useState(true);
  const [columns, setColumns] = React.useState(releaseBoard);

  return (
    <div className="space-y-3">
      <Button
        type="button"
        variant="outline"
        aria-pressed={enforce}
        onClick={() => setEnforce(!enforce)}
      >
        Enforce capacity: {enforce ? "on" : "off"}
      </Button>
      <Kanban
        columns={columns}
        onColumnsChange={setColumns}
        wipMode={enforce ? "enforce" : "warn"}
        columnSize="sm"
      />
      <p className="text-sm text-muted-foreground">
        Try moving saved searches into the full review queue. Turn enforcement
        off to see the over-capacity warning.
      </p>
    </div>
  );
}

const capacityCode = `import * as React from "react";\nimport { Kanban } from "@/components/ui/kanban";\nimport { Button } from "@/components/ui/button";\n${boardSource}\n\nexport function CapacityDemo() {\n  const [enforce, setEnforce] = React.useState(true);\n  const [columns, setColumns] = React.useState(releaseBoard);\n  return <><Button type="button" variant="outline" aria-pressed={enforce} onClick={() => setEnforce(!enforce)}>Enforce capacity: {enforce ? "on" : "off"}</Button><Kanban columns={columns} onColumnsChange={setColumns} wipMode={enforce ? "enforce" : "warn"} columnSize="sm" /></>;\n}`;

function BlockedDemo() {
  const [columns, setColumns] = React.useState(releaseBoard);

  return (
    <div className="space-y-3">
      <Button
        type="button"
        variant="outline"
        onClick={() =>
          setColumns(
            columns.map((column) => ({
              ...column,
              cards: column.cards.map((card) =>
                card.id === "migration"
                  ? { ...card, blockedReason: undefined }
                  : card,
              ),
            })),
          )
        }
      >
        Resolve staging dependency
      </Button>
      <Kanban
        columns={columns}
        onColumnsChange={setColumns}
        columnSize="sm"
        canMove={({ card, targetColumn }) =>
          card.blockedReason && targetColumn.id === "done"
            ? "Resolve the dependency before releasing this work."
            : undefined
        }
      />
    </div>
  );
}

const blockedCode = `import * as React from "react";\nimport { Kanban } from "@/components/ui/kanban";\nimport { Button } from "@/components/ui/button";\n${boardSource}\n\nexport function BlockedDemo() {\n  const [columns, setColumns] = React.useState(releaseBoard);\n  return <><Button type="button" variant="outline" onClick={() => setColumns(columns.map((column) => ({ ...column, cards: column.cards.map((card) => card.id === "migration" ? { ...card, blockedReason: undefined } : card) })))}>Resolve staging dependency</Button><Kanban columns={columns} onColumnsChange={setColumns} columnSize="sm" canMove={({ card, targetColumn }) => card.blockedReason && targetColumn.id === "done" ? "Resolve the dependency before releasing this work." : undefined} /></>;\n}`;

function FiltersDemo() {
  return (
    <KiraKanban
      title="Find the next handoff"
      defaultColumns={releaseBoard}
      columnSize="sm"
      wipMode="enforce"
    />
  );
}

const filtersCode = `import { KiraKanban } from "@/components/ui/kanban";\n${boardSource}\n\nexport function FiltersDemo() {\n  return <KiraKanban title="Find the next handoff" defaultColumns={releaseBoard} columnSize="sm" wipMode="enforce" />;\n}`;

function BoardActions() {
  const { addColumn, columns } = useKanban();

  return (
    <KanbanAddColumn
      onClick={() =>
        addColumn({
          id: "column-" + columns.length,
          title: "Follow-up",
          cards: [],
        })
      }
    />
  );
}

function CompositionDemo() {
  const [columns, setColumns] = React.useState(releaseBoard);

  return (
    <div>
      <KanbanHeader>
        <h3 className="font-semibold">Release review</h3>
        <Button type="button" variant="outline" onClick={() => setColumns([])}>
          Clear board
        </Button>
      </KanbanHeader>
      <Kanban columns={columns} onColumnsChange={setColumns} columnSize="sm">
        {columns.map((column) => (
          <KanbanColumn key={column.id} id={column.id} title={column.title}>
            {column.cards.map((card) => (
              <KanbanCard
                key={card.id}
                id={card.id}
                columnId={column.id}
                data={card}
              >
                <span className="font-medium">{card.title}</span>
              </KanbanCard>
            ))}
          </KanbanColumn>
        ))}
        <BoardActions />
      </Kanban>
    </div>
  );
}

const compositionCode = `import * as React from "react";\nimport { Kanban, KanbanColumn, KanbanCard, KanbanHeader, KanbanAddColumn, useKanban } from "@/components/ui/kanban";\nimport { Button } from "@/components/ui/button";\n${boardSource}\n\nfunction BoardActions() {\n  const { addColumn, columns } = useKanban();\n  return <KanbanAddColumn onClick={() => addColumn({ id: "column-" + columns.length, title: "Follow-up", cards: [] })} />;\n}\nexport function CompositionDemo() {\n  const [columns, setColumns] = React.useState(releaseBoard);\n  return <div><KanbanHeader><h3>Release review</h3><Button type="button" variant="outline" onClick={() => setColumns([])}>Clear board</Button></KanbanHeader><Kanban columns={columns} onColumnsChange={setColumns} columnSize="sm">{columns.map((column) => <KanbanColumn key={column.id} id={column.id} title={column.title}>{column.cards.map((card) => <KanbanCard key={card.id} id={card.id} columnId={column.id} data={card}><span>{card.title}</span></KanbanCard>)}</KanbanColumn>)}<BoardActions /></Kanban></div>;\n}`;

function VariantsDemo() {
  const [variant, setVariant] = React.useState<
    "default" | "compact" | "minimal"
  >("default");

  const [size, setSize] = React.useState<"sm" | "default" | "lg" | "auto">(
    "sm",
  );

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {(["default", "compact", "minimal"] as const).map((value) => (
          <Button
            key={value}
            type="button"
            size="sm"
            variant="outline"
            aria-pressed={variant === value}
            onClick={() => setVariant(value)}
          >
            {value}
          </Button>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        {(["sm", "default", "lg", "auto"] as const).map((value) => (
          <Button
            key={value}
            type="button"
            size="sm"
            variant="outline"
            aria-pressed={size === value}
            onClick={() => setSize(value)}
          >
            {value}
          </Button>
        ))}
      </div>
      <Kanban
        defaultColumns={releaseBoard}
        variant={variant}
        columnSize={size}
      />
    </div>
  );
}

const variantsCode = `import * as React from "react";\nimport { Kanban } from "@/components/ui/kanban";\nimport { Button } from "@/components/ui/button";\n${boardSource}\n\nexport function VariantsDemo() {\n  const [variant, setVariant] = React.useState<"default" | "compact" | "minimal">("default");\n  const [size, setSize] = React.useState<"sm" | "default" | "lg" | "auto">("sm");\n  return <><div>{(["default", "compact", "minimal"] as const).map((value) => <Button key={value} aria-pressed={variant === value} onClick={() => setVariant(value)}>{value}</Button>)}</div><div>{(["sm", "default", "lg", "auto"] as const).map((value) => <Button key={value} aria-pressed={size === value} onClick={() => setSize(value)}>{value}</Button>)}</div><Kanban defaultColumns={releaseBoard} variant={variant} columnSize={size} /></>;\n}`;

function KiraDemo() {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string>();

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="outline"
          aria-pressed={loading}
          onClick={() => setLoading(!loading)}
        >
          Refresh fixture
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setLoading(false);
            setError(
              "Work could not be refreshed. Retry to restore the latest board.",
            );
          }}
        >
          Fail refresh
        </Button>
      </div>
      <KiraKanban
        title="October release"
        defaultColumns={releaseBoard}
        columnSize="sm"
        loading={loading}
        error={error}
        onRetry={() => {
          setError(undefined);
          setLoading(false);
        }}
      />
      <p className="text-xs text-muted-foreground">
        Local fixtures; these buttons do not call a server.
      </p>
    </div>
  );
}

const kiraCode = `import * as React from "react";\nimport { KiraKanban } from "@/components/ui/kanban";\nimport { Button } from "@/components/ui/button";\n${boardSource}\n\nexport function KiraDemo() {\n  const [loading, setLoading] = React.useState(false);\n  const [error, setError] = React.useState<string>();\n  return <><Button variant="outline" aria-pressed={loading} onClick={() => setLoading(!loading)}>Refresh fixture</Button><Button variant="outline" onClick={() => { setLoading(false); setError("Work could not be refreshed. Retry to restore the latest board."); }}>Fail refresh</Button><KiraKanban title="October release" defaultColumns={releaseBoard} columnSize="sm" loading={loading} error={error} onRetry={() => { setError(undefined); setLoading(false); }} /></>;\n}`;

function StatesDemo() {
  const controlId1 = React.useId();

  const [state, setState] = React.useState<
    "readonly" | "disabled" | "loading" | "empty" | "stress"
  >("stress");

  const stress: KanbanColumnData[] = [
    {
      id: "stress",
      title: "Review across engineering, customer success and localization",
      limit: 0,
      cards: [
        {
          id: "long",
          title:
            "ReleaseReadinessForInternationalEnterpriseWorkspacesWithoutWhitespace",
          tags: ["Localization", "Localization"],
          assignee: { id: "long", name: "ณัฐชา 山田 — accessibility review" },
          blockedReason: "Needs an owner before the release window.",
        },
      ],
    },
  ];

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {(["readonly", "disabled", "loading", "empty", "stress"] as const).map(
          (value) => (
            <Button
              key={value}
              type="button"
              size="sm"
              variant="outline"
              aria-pressed={state === value}
              onClick={() => setState(value)}
            >
              {value}
            </Button>
          ),
        )}
      </div>
      <KiraKanban
        key={state}
        columns={state === "empty" || state === "loading" ? [] : stress}
        columnSize="sm"
        readOnly={state === "readonly" || state === "stress"}
        disabled={state === "disabled"}
        disabledReason={
          state === "disabled"
            ? "This release is locked while publishing."
            : undefined
        }
        loading={state === "loading"}
      />
      <label htmlFor={controlId1} className="block space-y-1 text-sm">
        Demo note
        <Input
          id={controlId1}
          placeholder="Check focus and text at narrow widths"
        />
      </label>
    </div>
  );
}

const statesCode =
  'import * as React from "react";\nimport { KiraKanban, type KanbanColumnData } from "@/components/ui/kanban";\nimport { Button } from "@/components/ui/button";\nimport { Input } from "@/components/ui/input";\n\nexport function StatesDemo() {\n  const [state, setState] = React.useState<\n    "readonly" | "disabled" | "loading" | "empty" | "stress"\n  >("stress");\n  const stress: KanbanColumnData[] = [\n    {\n      id: "stress",\n      title: "Review across engineering, customer success and localization",\n      limit: 0,\n      cards: [\n        {\n          id: "long",\n          title:\n            "ReleaseReadinessForInternationalEnterpriseWorkspacesWithoutWhitespace",\n          tags: ["Localization", "Localization"],\n          assignee: { id: "long", name: "ณัฐชา 山田 — accessibility review" },\n          blockedReason: "Needs an owner before the release window.",\n        },\n      ],\n    },\n  ];\n  return (\n    <div className="space-y-3">\n      <div className="flex flex-wrap gap-2">\n        {(["readonly", "disabled", "loading", "empty", "stress"] as const).map(\n          (value) => (\n            <Button\n              key={value}\n              type="button"\n              size="sm"\n              variant="outline"\n              aria-pressed={state === value}\n              onClick={() => setState(value)}\n            >\n              {value}\n            </Button>\n          ),\n        )}\n      </div>\n      <KiraKanban\n        key={state}\n        columns={state === "empty" || state === "loading" ? [] : stress}\n        columnSize="sm"\n        readOnly={state === "readonly" || state === "stress"}\n        disabled={state === "disabled"}\n        disabledReason={\n          state === "disabled"\n            ? "This release is locked while publishing."\n            : undefined\n        }\n        loading={state === "loading"}\n      />\n      <label className="block space-y-1 text-sm">\n        Demo note\n        <Input placeholder="Check focus and text at narrow widths" />\n      </label>\n    </div>\n  );\n}';

const tabs = [
  {
    value: "basic",
    label: "Basic",
    title: "Release work",
    code: basicCode,
    component: <BasicDemo />,
  },
  {
    value: "movement",
    label: "Move",
    title: "Move without dragging",
    code: movementCode,
    component: <MovementDemo />,
  },
  {
    value: "capacity",
    label: "Capacity",
    title: "Review queue capacity",
    code: capacityCode,
    component: <CapacityDemo />,
  },
  {
    value: "blocked",
    label: "Dependencies",
    title: "Blocked handoffs",
    code: blockedCode,
    component: <BlockedDemo />,
  },
  {
    value: "filters",
    label: "Filters",
    title: "Find work without changing counts",
    code: filtersCode,
    component: <FiltersDemo />,
  },
  {
    value: "composition",
    label: "Parts",
    title: "Compose and clear a board",
    code: compositionCode,
    component: <CompositionDemo />,
  },
  {
    value: "variants",
    label: "Variants",
    title: "Spacing and widths",
    code: variantsCode,
    component: <VariantsDemo />,
  },
  {
    value: "kira",
    label: "Kira",
    title: "Retained board refresh",
    code: kiraCode,
    component: <KiraDemo />,
  },
  {
    value: "states",
    label: "States",
    title: "States and stress fixtures",
    code: statesCode,
    component: <StatesDemo />,
  },
];

const commonProps = [
  {
    prop: "columns / defaultColumns",
    type: "KanbanColumnData[]",
    default: "[]",
    description:
      "Controlled current board / uncontrolled initial board. Column IDs and globally unique card IDs must be non-empty.",
  },
  {
    prop: "onColumnsChange",
    type: "(columns: KanbanColumnData[]) => void",
    description:
      "Once per local mutation, outside React state updaters; controlled callers must adopt the new value.",
  },
  {
    prop: "variant",
    type: '"default" | "compact" | "minimal"',
    default: "default",
    description: "Board spacing; uses exported kanbanVariants.",
  },
  {
    prop: "columnSize",
    type: '"sm" | "default" | "lg" | "auto"',
    default: "default",
    description: "Column width; auto grows from the default width.",
  },
  {
    prop: "disabled / readOnly / disabledReason",
    type: "boolean / boolean / string",
    default: "false / false",
    description:
      "Disable edits with a visible reason, or hide editing controls for reading. Disclosure remains available.",
  },
  {
    prop: "enableKeyboard",
    type: "boolean",
    default: "true",
    description:
      "Enable dnd-kit KeyboardSensor; native Move controls remain accessible either way.",
  },
  {
    prop: "wipMode",
    type: '"warn" | "enforce"',
    default: "warn",
    description:
      "Capacity warning, or reject incoming cards at the target limit. Same-column reorder is allowed.",
  },
  {
    prop: "canMove / onCardMove",
    type: "(details: KanbanMoveDetails) => string | undefined / (details: KanbanMoveDetails) => void",
    description: "Pure rejection reason / notification after an accepted move.",
  },
  {
    prop: "cardFilter",
    type: "(card: KanbanCardData) => boolean",
    description:
      "Hide unmatched cards while retaining their DOM and full counts. Disables drag; Move uses full-board positions.",
  },
  {
    prop: "onCardClick / onCardAdd",
    type: "(card: KanbanCardData, columnId: string) => void / (columnId: string) => void",
    description:
      "Native title action / optional add control. Caller owns creation.",
  },
  {
    prop: "announcements",
    type: "{ onDragStart?: (card: KanbanCardData) => string; onDragOver?: (card: KanbanCardData, column: KanbanColumnData) => string; onDrop?: (card: KanbanCardData, column: KanbanColumnData) => string; onCancel?: () => string }",
    description: "Customize contextual drag status messages.",
  },
  {
    prop: "native div props / ref / children",
    type: 'React.ComponentProps<"div">',
    description:
      "Native board attributes/ref. Children compose parts but still require the columns model.",
  },
];

const api: React.ComponentProps<typeof APIReference>["sections"] = [
  { title: "Kanban", props: commonProps },
  {
    title: "KiraKanban",
    props: [
      {
        prop: "inherited",
        type: 'Omit<KanbanProps, "children" | "cardFilter">',
        description: "All board props; Kira owns filtering and composition.",
      },
      {
        prop: "title / searchable / blockedFilter",
        type: "string / boolean / boolean",
        default: "Work board / true / true",
        description:
          "Toolbar title, labelled text search and blocked-only toggle.",
      },
      {
        prop: "loading / error / onRetry",
        type: "boolean / string / () => void",
        default: "false",
        description:
          "Retained board with edit lock, visible error and caller-owned recovery. Initial loading uses static skeletons.",
      },
    ],
  },
  {
    title: "KanbanColumn",
    props: [
      {
        prop: "id / title / data",
        type: "string / string / KanbanColumnData",
        description:
          "Column identity/title; data defaults to the current context column.",
      },
      {
        prop: "color / limit",
        type: "string / number",
        description:
          "Optional CSS color and non-negative capacity; explicit props override data.",
      },
      {
        prop: "collapsed / onCollapsedChange",
        type: "boolean / (collapsed: boolean) => void",
        description:
          "Controlled disclosure; data.collapsed updates through the board, otherwise local state.",
      },
      {
        prop: "native props / ref / children",
        type: 'Omit<React.ComponentProps<"div">, "title">',
        description:
          "Root attributes/ref and optional card renderers. Uses kanbanColumnVariants.",
      },
    ],
  },
  {
    title: "KanbanCard",
    props: [
      {
        prop: "id / columnId / data / priority",
        type: 'string / string / KanbanCardData / "low" | "medium" | "high" | "critical"',
        description:
          "Identity and parent column; context resolves absent data. Data priority overrides the prop.",
      },
      {
        prop: "native props / ref / children",
        type: 'React.ComponentProps<"div">',
        description:
          "List item attributes/ref; children replace title/description while metadata and Move remain. Sortable transform/transition are reserved. Uses kanbanCardVariants.",
      },
    ],
  },
  {
    title: "KanbanHeader",
    props: [
      {
        prop: "native props / ref / children",
        type: 'React.ComponentProps<"div">',
        description: "Wrapping toolbar; place outside the scrollable board.",
      },
    ],
  },
  {
    title: "KanbanAddColumn",
    props: [
      {
        prop: "button props / ref / children",
        type: "React.ComponentProps<typeof Button>",
        description:
          "Native Button composing column width, context availability and caller onClick. Defaults to Add column.",
      },
    ],
  },
  {
    title: "useKanban / KanbanContextValue",
    props: [
      {
        prop: "columns / setColumns",
        type: "KanbanColumnData[] / React.Dispatch<React.SetStateAction<KanbanColumnData[]>>",
        description:
          "Current model and guarded mutations; caller updater must be pure.",
      },
      {
        prop: "addCard / removeCard / moveCard",
        type: "(columnId: string, card: KanbanCardData) => void / (columnId: string, cardId: string) => void / (cardId: string, sourceColumnId: string, targetColumnId: string, targetIndex?: number) => boolean",
        description:
          "Card mutations; move returns acceptance; invalid destinations preserve the board.",
      },
      {
        prop: "addColumn / removeColumn",
        type: "(column: KanbanColumnData) => void / (columnId: string) => void",
        description:
          "Guarded column mutations; removing a column removes its cards.",
      },
      {
        prop: "openMove / announce / getMoveReason",
        type: "(cardId: string, trigger: HTMLElement) => void / (message: string) => void / (details: KanbanMoveDetails) => string | undefined",
        description: "Shared modal/status/policy integration.",
      },
      {
        prop: "configuration / callbacks",
        type: "variant, columnSize, disabled, readOnly, enableKeyboard, cardFilter, onCardClick, onCardAdd",
        description: "Same resolved values and callback types as KanbanProps.",
      },
    ],
  },
  {
    title: "KanbanCardData",
    props: [
      {
        prop: "id / title / description",
        type: "string / string / string",
        description: "Required identity/title; optional full description.",
      },
      {
        prop: "priority / assignee / tags / dueDate",
        type: '"low" | "medium" | "high" | "critical" / { id: string; name: string; avatar?: string } / string[] / string',
        description:
          "Optional visible priority, full owner name, tags and caller-formatted deadline.",
      },
      {
        prop: "attachments / comments / checklist / cover / blockedReason",
        type: "number / number / { completed: number; total: number } / string / string",
        description:
          "Visible counts/checklist, decorative cover URL and actionable dependency reason.",
      },
    ],
  },
  {
    title: "KanbanColumnData / KanbanMoveDetails",
    props: [
      {
        prop: "column fields",
        type: "{ id: string; title: string; cards: KanbanCardData[]; color?: string; limit?: number; collapsed?: boolean }",
        description: "Full model; zero limit is supported.",
      },
      {
        prop: "move details",
        type: "{ card: KanbanCardData; sourceColumn: KanbanColumnData; targetColumn: KanbanColumnData; targetIndex: number }",
        description:
          "Zero-based destination index after source removal; model objects before mutation.",
      },
    ],
  },
];

// oxlint-disable-next-line max-lines-per-function -- Static documentation keeps related examples and API tables together for comparison.
export default function KanbanPage() {
  return (
    <ComponentPage>
      <PageHeader
        title="Kanban"
        description="Review work with visible capacity, dependency context and a move action that works without dragging."
        version="v3.0.0"
      />
      <FeatureGrid
        features={[
          {
            title: "Accessible moves",
            description:
              "Whole-card dragging plus a native dialog for column and position.",
          },
          {
            title: "Capacity and dependencies",
            description:
              "Soft warnings, optional limits and caller-owned handoff rules.",
          },
          {
            title: "Focused work",
            description:
              "Search, blocked filtering and retained board refresh.",
          },
        ]}
      />
      <DemoTabs
        defaultValue="basic"
        tabs={tabs.map((tab) => ({
          value: tab.value,
          label: tab.label,
          demo: (
            <DemoWrapper title={tab.title} code={tab.code}>
              {tab.component}
            </DemoWrapper>
          ),
        }))}
      />
      <KeyboardShortcuts
        description="Use these controls to verify each workflow."
        shortcuts={[
          {
            keys: "Tab / Shift+Tab",
            description:
              "Native action buttons; card titles open details only when a callback is supplied.",
          },
          {
            keys: "Space / Enter, arrows, Space, Escape",
            description:
              "Focus a card for dnd-kit pickup, movement, drop or cancellation. Card buttons remain independent.",
          },
          {
            keys: "Enter / Space on Move card",
            description:
              "Open the shared Dialog. Choose destination and position with Select (inherited from Base UI).",
          },
          {
            keys: "Escape in Move dialog",
            description:
              "Dismiss and return focus (inherited from Base UI); no board mutation.",
          },
          {
            keys: "Enter / Space on column disclosure",
            description:
              "Toggle retained column content (inherited from Base UI Collapsible).",
          },
        ]}
      />
      <UsageBlock code={compositionCode} />
      <APIReference sections={api} />
      <Changelog
        entries={[
          {
            version: "3.0.0",
            date: "15 November 2026",
            changes: [
              {
                type: "changed",
                title: "Breaking: board state and interaction contract",
                description:
                  "columns is fully controlled; use defaultColumns for local state. Context drag/focus/dialog setter fields were removed; use openMove and the guarded mutation methods. The entire card is draggable; buttons, links and editable content keep their native actions. Title callbacks use native buttons. KanbanAddColumn uses shared Button props. IDs must be non-empty and unique. Audited against Base UI 1.9.0 and panels 4.16.0; research cutoff October 31.",
              },
              {
                type: "added",
                title: "Workflow controls",
                description:
                  "KiraKanban search, blocked filtering, retained loading/retry, complete metadata, capacity warnings/enforcement and caller move policies.",
              },
              {
                type: "changed",
                title: "Card hierarchy and interaction feedback",
                description:
                  "Compact titles, grouped metadata and owner/action footers. Whole-card dragging replaces the icon handle; focus the card for keyboard dragging. Fine-pointer hover lift and elevation, shared button press feedback and 200ms full-card drop continuity; keyboard dragging and reduced motion remain immediate. Added labels, footer, elevation and column-content slots. Column disclosure animates measured height and opacity over 200ms; reduced motion remains static. Use data-kanban-no-drag to exclude custom interactive content.",
              },
              {
                type: "fixed",
                title: "Core behavior",
                description:
                  "Empty controlled resets, invalid destination card loss, duplicate updater callbacks, conflicting keyboard handlers and custom modal focus trap repaired.",
              },
            ],
          },
        ]}
      />
    </ComponentPage>
  );
}
