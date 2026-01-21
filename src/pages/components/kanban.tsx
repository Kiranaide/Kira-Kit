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

export default function KanbanPage() {
  // Data-driven approach
  const [columns, setColumns] = React.useState<KanbanColumnData[]>([
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
  ])

  const priorityColors = {
    low: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    medium: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
    high: "bg-orange-500/10 text-orange-600 border-orange-500/20",
    critical: "bg-red-500/10 text-red-600 border-red-500/20",
  }

  const handleAddCard = (columnId: string) => {
    const newCard: KanbanCardData = {
      id: `card-${Date.now()}`,
      title: "New Card",
      description: "Click to edit",
    }
    setColumns((prev) =>
      prev.map((col) =>
        col.id === columnId ? { ...col, cards: [...col.cards, newCard] } : col
      )
    )
  }

  const handleAddColumn = () => {
    const newColumn: KanbanColumnData = {
      id: `col-${Date.now()}`,
      title: "New Column",
      cards: [],
    }
    setColumns((prev) => [...prev, newColumn])
  }

  return (
    <div className="container mx-auto py-8 space-y-12">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Kanban Board</h1>
        <p className="text-muted-foreground">
          Accessible drag-and-drop task management with keyboard navigation and move dialog
        </p>
      </div>

      {/* Keyboard Instructions */}
      <section className="p-4 bg-muted/30 rounded-lg border space-y-3">
        <h2 className="font-semibold">Keyboard Navigation (Accessibility)</h2>
        <div className="grid gap-2 text-sm md:grid-cols-2">
          <div className="flex items-center gap-2">
            <kbd className="px-2 py-1 bg-background border rounded text-xs">Tab</kbd>
            <span>Navigate between cards</span>
          </div>
          <div className="flex items-center gap-2">
            <kbd className="px-2 py-1 bg-background border rounded text-xs">Space</kbd>
            <span>Grab/drop card</span>
          </div>
          <div className="flex items-center gap-2">
            <kbd className="px-2 py-1 bg-background border rounded text-xs">↑↓</kbd>
            <span>Move card up/down (when grabbed)</span>
          </div>
          <div className="flex items-center gap-2">
            <kbd className="px-2 py-1 bg-background border rounded text-xs">←→</kbd>
            <span>Move card between columns (when grabbed)</span>
          </div>
          <div className="flex items-center gap-2">
            <kbd className="px-2 py-1 bg-background border rounded text-xs">Esc</kbd>
            <span>Cancel drag operation</span>
          </div>
          <div className="flex items-center gap-2">
            <kbd className="px-2 py-1 bg-background border rounded text-xs">M</kbd>
            <span>Open move dialog (alternative method)</span>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          Right-click on any card to open the move dialog for accessible card movement.
        </p>
      </section>

      {/* Data-Driven Board */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Data-Driven Board</h2>
            <p className="text-muted-foreground">
              Pass columns as data prop with onColumnsChange callback
            </p>
          </div>
        </div>

        <Kanban
          columns={columns}
          onColumnsChange={setColumns}
          columnSize="default"
          onCardAdd={handleAddCard}
          announcements={{
            onDragStart: (card) => `Grabbed ${card.title}. Use arrow keys to move.`,
            onDragOver: (card, column) => `${card.title} over ${column.title}`,
            onDrop: (card, column) => `Dropped ${card.title} in ${column.title}`,
            onCancel: () => "Drag cancelled",
          }}
        />
      </section>

      {/* Composition Pattern */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold">Composition Pattern</h2>
          <p className="text-muted-foreground">
            Build the board using KanbanColumn and KanbanCard components
          </p>
        </div>

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
                  {/* Custom card content */}
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
      </section>

      {/* Priority Indicators */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Priority Indicators</h2>
        <p className="text-muted-foreground">
          Visual priority indicators with colored left border
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {(["low", "medium", "high", "critical"] as const).map((priority) => (
            <div
              key={priority}
              className={`p-4 rounded-md border bg-card shadow-sm border-l-2 ${
                priority === "low"
                  ? "border-l-blue-500"
                  : priority === "medium"
                  ? "border-l-yellow-500"
                  : priority === "high"
                  ? "border-l-orange-500"
                  : "border-l-red-500"
              }`}
            >
              <Badge variant="outline" className={priorityColors[priority]}>
                <IconFlag className="mr-1 h-3 w-3" />
                {priority}
              </Badge>
              <p className="mt-2 text-sm text-muted-foreground capitalize">
                {priority} priority card
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Accessibility Features */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Accessibility Features</h2>
        <p className="text-muted-foreground">WCAG 2.5.7 compliant drag-and-drop</p>

        <div className="p-4 border rounded-lg bg-muted/10 space-y-4">
          <ul className="list-disc list-inside space-y-2 text-sm">
            <li>
              <strong>Full keyboard navigation:</strong> Tab, Space, Arrow keys, Escape
            </li>
            <li>
              <strong>Screen reader announcements:</strong> Live region announces all state changes
            </li>
            <li>
              <strong>Move dialog:</strong> Alternative method for users who can't use drag-and-drop
            </li>
            <li>
              <strong>Focus indicators:</strong> Visible focus rings on all interactive elements
            </li>
            <li>
              <strong>ARIA attributes:</strong> Proper roles, grabbed state, and labels
            </li>
            <li>
              <strong>Reduced motion:</strong> Respects prefers-reduced-motion preference
            </li>
            <li>
              <strong>Context menu:</strong> Right-click opens move dialog for accessibility
            </li>
          </ul>
        </div>
      </section>

      {/* API Reference */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Component API</h2>

        <div className="p-4 bg-muted rounded-lg space-y-4">
          <div>
            <h3 className="font-medium mb-2">Data-Driven Usage</h3>
            <pre className="text-sm bg-background p-3 rounded border overflow-x-auto">
{`<Kanban
  columns={columns}
  onColumnsChange={setColumns}
  columnSize="default"
  onCardAdd={(columnId) => { /* add card */ }}
  onCardClick={(card, columnId) => { /* handle click */ }}
/>`}
            </pre>
          </div>

          <div>
            <h3 className="font-medium mb-2">Composition Usage</h3>
            <pre className="text-sm bg-background p-3 rounded border overflow-x-auto">
{`<Kanban columns={columns} onColumnsChange={setColumns}>
  <KanbanColumn id="todo" title="To Do" color="#6366f1">
    <KanbanCard id="1" columnId="todo" priority="high">
      <div>Custom card content</div>
    </KanbanCard>
  </KanbanColumn>
  <KanbanAddColumn onClick={handleAddColumn} />
</Kanban>`}
            </pre>
          </div>

          <div>
            <h3 className="font-medium mb-2">Available Components</h3>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li><code>Kanban</code> - Root container with DnD context</li>
              <li><code>KanbanColumn</code> - Column with header, cards, and add button</li>
              <li><code>KanbanCard</code> - Draggable card with keyboard support</li>
              <li><code>KanbanHeader</code> - Optional toolbar area</li>
              <li><code>KanbanAddColumn</code> - Button to add new columns</li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium mb-2">useKanban Hook</h3>
            <pre className="text-sm bg-background p-3 rounded border overflow-x-auto">
{`const {
  columns,           // Current columns state
  addCard,           // (columnId, card) => void
  removeCard,        // (columnId, cardId) => void
  moveCard,          // (cardId, sourceCol, targetCol, index?) => void
  addColumn,         // (column) => void
  removeColumn,      // (columnId) => void
  announce,          // (message) => void - screen reader
} = useKanban()`}
            </pre>
          </div>
        </div>
      </section>
    </div>
  )
}
