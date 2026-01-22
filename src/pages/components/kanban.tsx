import * as React from "react"
import {
  Kanban,
  KanbanColumn,
  KanbanCard,
  KanbanAddColumn,
  type KanbanColumnData,
  type KanbanCardData,
} from "@/components/ui/kanban"
import { Badge } from "@/components/ui/badge"
import { IconFlag } from "@tabler/icons-react"
import {
  ComponentPage,
  PageHeader,
  FeatureGrid,
  DemoTabs,
  DemoWrapper,
  KeyboardShortcuts,
  UsageBlock,
  APIReference,
} from "@/components/docs"

const initialColumns: KanbanColumnData[] = [
  {
    id: "todo",
    title: "To Do",
    color: "#6366f1",
    limit: 5,
    cards: [
      {
        id: "1",
        title: "Setup project structure",
        description: "Initialize the monorepo with proper folder structure",
        priority: "high",
        assignee: { id: "1", name: "John Doe" },
        dueDate: "2 days",
        tags: ["setup", "infrastructure"],
        comments: 3,
        attachments: 1,
      },
      {
        id: "2",
        title: "Design system documentation",
        description: "Write comprehensive docs for all components",
        priority: "medium",
        assignee: { id: "2", name: "Alice Smith" },
        dueDate: "5 days",
        tags: ["docs"],
      },
      {
        id: "3",
        title: "API integration",
        priority: "low",
        assignee: { id: "3", name: "Mike King" },
        dueDate: "1 week",
      },
    ],
  },
  {
    id: "in-progress",
    title: "In Progress",
    color: "#f59e0b",
    limit: 3,
    cards: [
      {
        id: "4",
        title: "Component library implementation",
        description: "Build core UI components with accessibility",
        priority: "high",
        assignee: { id: "1", name: "John Doe" },
        dueDate: "1 day",
        tags: ["components", "a11y"],
        comments: 8,
      },
      {
        id: "5",
        title: "Testing setup",
        priority: "medium",
        assignee: { id: "2", name: "Alice Smith" },
        dueDate: "3 days",
      },
    ],
  },
  {
    id: "review",
    title: "In Review",
    color: "#8b5cf6",
    cards: [
      {
        id: "6",
        title: "Authentication flow",
        description: "OAuth2 integration with multiple providers",
        priority: "high",
        assignee: { id: "3", name: "Mike King" },
        comments: 5,
        attachments: 2,
      },
    ],
  },
  {
    id: "done",
    title: "Done",
    color: "#22c55e",
    cards: [
      {
        id: "7",
        title: "Project initialization",
        priority: "high",
        assignee: { id: "3", name: "Mike King" },
      },
      {
        id: "8",
        title: "Design review",
        priority: "medium",
        assignee: { id: "1", name: "John Doe" },
      },
    ],
  },
]

function DataDrivenDemo() {
  const [columns, setColumns] = React.useState<KanbanColumnData[]>(initialColumns)

  const handleAddCard = (columnId: string) => {
    const newCard: KanbanCardData = {
      id: "card-" + Date.now(),
      title: "New Card",
      description: "Click to edit",
    }
    setColumns((prev) =>
      prev.map((col) =>
        col.id === columnId ? { ...col, cards: [...col.cards, newCard] } : col
      )
    )
  }

  return (
    <Kanban
      columns={columns}
      onColumnsChange={setColumns}
      columnSize="default"
      onCardAdd={handleAddCard}
      announcements={{
        onDragStart: (card) => "Grabbed " + card.title + ". Use arrow keys to move.",
        onDragOver: (card, column) => card.title + " over " + column.title,
        onDrop: (card, column) => "Dropped " + card.title + " in " + column.title,
        onCancel: () => "Drag cancelled",
      }}
    />
  )
}

const dataDrivenCode = [
  'import * as React from "react"',
  'import {',
  '  Kanban,',
  '  type KanbanColumnData,',
  '} from "@/components/ui/kanban"',
  '',
  'export function DataDrivenKanban() {',
  '  const [columns, setColumns] = React.useState<KanbanColumnData[]>([',
  '    {',
  '      id: "todo",',
  '      title: "To Do",',
  '      color: "#6366f1",',
  '      limit: 5,',
  '      cards: [',
  '        {',
  '          id: "1",',
  '          title: "Setup project structure",',
  '          priority: "high",',
  '        },',
  '      ],',
  '    },',
  '  ])',
  '',
  '  return (',
  '    <Kanban',
  '      columns={columns}',
  '      onColumnsChange={setColumns}',
  '      columnSize="default"',
  '    />',
  '  )',
  '}',
].join('\n')

const priorityColors = {
  low: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  medium: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  high: "bg-orange-500/10 text-orange-600 border-orange-500/20",
  critical: "bg-red-500/10 text-red-600 border-red-500/20",
}

function CompositionDemo() {
  const [columns, setColumns] = React.useState<KanbanColumnData[]>(initialColumns)

  const handleAddColumn = () => {
    const newColumn: KanbanColumnData = {
      id: "col-" + Date.now(),
      title: "New Column",
      cards: [],
    }
    setColumns((prev) => [...prev, newColumn])
  }

  return (
    <Kanban columns={columns} onColumnsChange={setColumns}>
      {columns.map((column) => (
        <KanbanColumn
          key={column.id}
          id={column.id}
          title={column.title}
          color={column.color}
          limit={column.limit}
          data={column}
        >
          {column.cards.map((card) => (
            <KanbanCard
              key={card.id}
              id={card.id}
              columnId={column.id}
              data={card}
              priority={card.priority}
            >
              <div className="space-y-2">
                <h4 className="font-medium">{card.title}</h4>
                {card.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {card.description}
                  </p>
                )}
                {card.priority && (
                  <Badge variant="outline" className={priorityColors[card.priority]}>
                    <IconFlag className="mr-1 h-3 w-3" />
                    {card.priority}
                  </Badge>
                )}
              </div>
            </KanbanCard>
          ))}
        </KanbanColumn>
      ))}
      <KanbanAddColumn onClick={handleAddColumn} />
    </Kanban>
  )
}

const compositionCode = [
  'import * as React from "react"',
  'import {',
  '  Kanban,',
  '  KanbanColumn,',
  '  KanbanCard,',
  '  KanbanAddColumn,',
  '  type KanbanColumnData,',
  '} from "@/components/ui/kanban"',
  'import { Badge } from "@/components/ui/badge"',
  'import { IconFlag } from "@tabler/icons-react"',
  '',
  'export function CompositionKanban() {',
  '  const [columns, setColumns] = React.useState<KanbanColumnData[]>([',
  '    {',
  '      id: "todo",',
  '      title: "To Do",',
  '      color: "#6366f1",',
  '      cards: [',
  '        { id: "1", title: "Task 1", priority: "high" },',
  '      ],',
  '    },',
  '  ])',
  '',
  '  return (',
  '    <Kanban columns={columns} onColumnsChange={setColumns}>',
  '      {columns.map((column) => (',
  '        <KanbanColumn',
  '          key={column.id}',
  '          id={column.id}',
  '          title={column.title}',
  '          color={column.color}',
  '          data={column}',
  '        >',
  '          {column.cards.map((card) => (',
  '            <KanbanCard',
  '              key={card.id}',
  '              id={card.id}',
  '              columnId={column.id}',
  '              data={card}',
  '              priority={card.priority}',
  '            >',
  '              <Badge>',
  '                <IconFlag />',
  '                {card.priority}',
  '              </Badge>',
  '            </KanbanCard>',
  '          ))}',
  '        </KanbanColumn>',
  '      ))}',
  '      <KanbanAddColumn />',
  '    </Kanban>',
  '  )',
  '}',
].join('\n')

function PriorityDemo() {
  const priorityColumns = [
    {
      id: "low",
      title: "Low Priority",
      color: "#3b82f6",
      cards: [
        { id: "1", title: "Update documentation", priority: "low" as const },
      ],
    },
    {
      id: "medium",
      title: "Medium Priority",
      color: "#f59e0b",
      cards: [
        { id: "2", title: "Code review", priority: "medium" as const },
      ],
    },
    {
      id: "high",
      title: "High Priority",
      color: "#f97316",
      cards: [
        { id: "3", title: "Fix production bug", priority: "high" as const },
      ],
    },
    {
      id: "critical",
      title: "Critical",
      color: "#ef4444",
      cards: [
        { id: "4", title: "Security vulnerability", priority: "critical" as const },
      ],
    },
  ]

  const [columns, setColumns] = React.useState<KanbanColumnData[]>(priorityColumns)

  return (
    <Kanban
      columns={columns}
      onColumnsChange={setColumns}
      columnSize="sm"
      announcements={{
        onDragStart: (card) => "Grabbed " + card.title,
        onDrop: (card, column) => "Dropped " + card.title + " in " + column.title,
      }}
    />
  )
}

const priorityCode = [
  'import * as React from "react"',
  'import {',
  '  Kanban,',
  '  type KanbanColumnData,',
  '} from "@/components/ui/kanban"',
  '',
  'export function PriorityKanban() {',
  '  const [columns, setColumns] = React.useState<KanbanColumnData[]>([',
  '    { id: "low", title: "Low Priority", color: "#3b82f6", cards: [] },',
  '    { id: "medium", title: "Medium Priority", color: "#f59e0b", cards: [] },',
  '    { id: "high", title: "High Priority", color: "#f97316", cards: [] },',
  '    { id: "critical", title: "Critical", color: "#ef4444", cards: [] },',
  '  ])',
  '',
  '  return <Kanban columns={columns} onColumnsChange={setColumns} columnSize="sm" />',
  '}',
].join('\n')

function AccessibilityDemo() {
  const [columns, setColumns] = React.useState<KanbanColumnData[]>(initialColumns)

  return (
    <div className="space-y-4">
      <div className="rounded-lg bg-muted/50 p-4 text-sm text-muted-foreground">
        <p className="font-medium mb-2">Try keyboard navigation:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Press <kbd className="px-1.5 py-0.5 bg-background border rounded text-xs font-mono">Tab</kbd> to navigate between cards</li>
          <li>Press <kbd className="px-1.5 py-0.5 bg-background border rounded text-xs font-mono">Space</kbd> to grab/drop a card</li>
          <li>Use <kbd className="px-1.5 py-0.5 bg-background border rounded text-xs font-mono">Arrow keys</kbd> to move cards</li>
          <li>Press <kbd className="px-1.5 py-0.5 bg-background border rounded text-xs font-mono">Esc</kbd> to cancel</li>
          <li>Press <kbd className="px-1.5 py-0.5 bg-background border rounded text-xs font-mono">M</kbd> or right-click to open move dialog</li>
        </ul>
      </div>
      <Kanban
        columns={columns}
        onColumnsChange={setColumns}
        columnSize="default"
        announcements={{
          onDragStart: (card) => "Grabbed " + card.title + ". Use arrow keys to move.",
          onDragOver: (card, column) => card.title + " over " + column.title,
          onDrop: (card, column) => "Dropped " + card.title + " in " + column.title,
          onCancel: () => "Drag cancelled",
        }}
      />
    </div>
  )
}

const accessibilityCode = [
  'import * as React from "react"',
  'import { Kanban } from "@/components/ui/kanban"',
  '',
  'export function AccessibleKanban() {',
  '  const [columns, setColumns] = React.useState([',
  '    { id: "todo", title: "To Do", cards: [{ id: "1", title: "Task" }] },',
  '  ])',
  '',
  '  return <Kanban columns={columns} onColumnsChange={setColumns} />',
  '}',
].join('\n')

export default function KanbanPage() {
  return (
    <ComponentPage>
      <PageHeader
        title="Kanban Board"
        description="Accessible drag-and-drop task management with keyboard navigation, screen reader support, and move dialog for accessibility."
        version="v2.0"
      />

      <FeatureGrid
        features={[
          {
            title: "Keyboard Accessible",
            description: "Full WCAG 2.5.7 compliant keyboard navigation with Space, arrows, Escape, and move dialog support.",
          },
          {
            title: "Drag & Drop",
            description: "Smooth drag-and-drop using @dnd-kit with reduced motion support and visual feedback.",
          },
          {
            title: "Flexible Patterns",
            description: "Use data-driven approach with columns prop or composition pattern with KanbanColumn and KanbanCard.",
          },
        ]}
      />

      <DemoTabs
        tabs={[
          {
            value: "data-driven",
            label: "Data-Driven",
            demo: (
              <DemoWrapper
                title="Data-Driven Kanban Board"
                description="Pass columns as data prop with onColumnsChange callback for controlled state management."
                code={dataDrivenCode}
              >
                <DataDrivenDemo />
              </DemoWrapper>
            ),
          },
          {
            value: "composition",
            label: "Composition",
            demo: (
              <DemoWrapper
                title="Composition Pattern"
                description="Build the board using KanbanColumn and KanbanCard components for full control over rendering."
                code={compositionCode}
              >
                <CompositionDemo />
              </DemoWrapper>
            ),
          },
          {
            value: "priority",
            label: "Priority",
            demo: (
              <DemoWrapper
                title="Priority Indicators"
                description="Visual priority indicators with colored left borders: low (blue), medium (yellow), high (orange), critical (red)."
                code={priorityCode}
              >
                <PriorityDemo />
              </DemoWrapper>
            ),
          },
          {
            value: "accessibility",
            label: "Accessibility",
            demo: (
              <DemoWrapper
                title="Keyboard Navigation & Screen Reader"
                description="Full keyboard support with Space to grab/drop, arrow keys to move, Escape to cancel, and M to open move dialog. Live region announcements for screen readers."
                code={accessibilityCode}
              >
                <AccessibilityDemo />
              </DemoWrapper>
            ),
          },
        ]}
      />

      <KeyboardShortcuts
        shortcuts={[
          { keys: "Tab", description: "Navigate between cards" },
          { keys: "Space / Enter", description: "Grab/drop card" },
          { keys: "↑ / ↓", description: "Move card up/down (when grabbed)" },
          { keys: "← / →", description: "Move card between columns (when grabbed)" },
          { keys: "Esc", description: "Cancel drag operation" },
          { keys: "M", description: "Open move dialog (alternative method)" },
        ]}
        description="Full keyboard support for accessibility"
      />

      <UsageBlock
        code={[
          'import * as React from "react"',
          'import {',
          '  Kanban,',
          '  type KanbanColumnData,',
          '} from "@/components/ui/kanban"',
          '',
          'export function MyKanban() {',
          '  const [columns, setColumns] = React.useState<KanbanColumnData[]>([',
          '    {',
          '      id: "todo",',
          '      title: "To Do",',
          '      cards: [{ id: "1", title: "Task 1" }],',
          '    },',
          '  ])',
          '',
          '  return (',
          '    <Kanban',
          '      columns={columns}',
          '      onColumnsChange={setColumns}',
          '    />',
          '  )',
          '}',
        ].join('\n')}
        description="Basic implementation with controlled columns state and card addition"
      />

      <APIReference
        sections={[
          {
            title: "Kanban",
            props: [
              {
                prop: "columns",
                type: "KanbanColumnData[]",
                default: "[]",
                description: "Initial columns data (for controlled usage)",
              },
              {
                prop: "onColumnsChange",
                type: "(columns) => void",
                default: "-",
                description: "Callback when columns change",
              },
              {
                prop: "columnSize",
                type: '"sm" | "default" | "lg" | "auto"',
                default: "default",
                description: "Column width size",
              },
              {
                prop: "enableKeyboard",
                type: "boolean",
                default: "true",
                description: "Enable keyboard navigation",
              },
              {
                prop: "onCardClick",
                type: "(card, columnId) => void",
                default: "-",
                description: "Callback when a card is clicked",
              },
              {
                prop: "onCardAdd",
                type: "(columnId) => void",
                default: "-",
                description: "Callback when add card is clicked",
              },
              {
                prop: "announcements",
                type: "object",
                default: "-",
                description: "Custom announcements for screen readers (onDragStart, onDragOver, onDrop, onCancel)",
              },
            ],
          },
          {
            title: "KanbanColumn",
            props: [
              {
                prop: "id",
                type: "string",
                default: "-",
                description: "Column ID",
              },
              {
                prop: "title",
                type: "string",
                default: "-",
                description: "Column title displayed in header",
              },
              {
                prop: "data",
                type: "KanbanColumnData",
                default: "-",
                description: "Column data object (for internal use)",
              },
              {
                prop: "color",
                type: "string",
                default: "-",
                description: "Column color (hex code)",
              },
              {
                prop: "limit",
                type: "number",
                default: "-",
                description: "WIP limit for cards in this column",
              },
              {
                prop: "collapsed",
                type: "boolean",
                default: "false",
                description: "Start column in collapsed state",
              },
            ],
          },
          {
            title: "KanbanCard",
            props: [
              {
                prop: "id",
                type: "string",
                default: "-",
                description: "Card ID",
              },
              {
                prop: "columnId",
                type: "string",
                default: "-",
                description: "Parent column ID (required for move operations)",
              },
              {
                prop: "data",
                type: "KanbanCardData",
                default: "-",
                description: "Card data object (for internal use)",
              },
              {
                prop: "priority",
                type: '"low" | "medium" | "high" | "critical"',
                default: "-",
                description: "Priority level for colored left border indicator",
              },
            ],
          },
          {
            title: "KanbanAddColumn",
            props: [
              {
                prop: "onClick",
                type: "() => void",
                default: "-",
                description: "Callback when add column button is clicked",
              },
            ],
          },
          {
            title: "useKanban Hook",
            props: [
              {
                prop: "columns",
                type: "KanbanColumnData[]",
                default: "[]",
                description: "Current columns state",
              },
              {
                prop: "addCard",
                type: "(columnId, card) => void",
                default: "-",
                description: "Add card to column",
              },
              {
                prop: "removeCard",
                type: "(columnId, cardId) => void",
                default: "-",
                description: "Remove card from column",
              },
              {
                prop: "moveCard",
                type: "(cardId, sourceCol, targetCol, index?) => void",
                default: "-",
                description: "Move card between columns",
              },
              {
                prop: "addColumn",
                type: "(column) => void",
                default: "-",
                description: "Add new column",
              },
              {
                prop: "removeColumn",
                type: "(columnId) => void",
                default: "-",
                description: "Remove column",
              },
              {
                prop: "announce",
                type: "(message) => void",
                default: "-",
                description: "Announce message to screen reader",
              },
              {
                prop: "setFocusedCardId",
                type: "(id: string | null) => void",
                default: "-",
                description: "Set focused card for keyboard navigation",
              },
              {
                prop: "setShowMoveDialog",
                type: "(show: boolean) => void",
                default: "-",
                description: "Show/hide move dialog",
              },
            ],
          },
        ]}
        description="Key props and configuration options"
      />
    </ComponentPage>
  )
}
