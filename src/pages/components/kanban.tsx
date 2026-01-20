import * as React from "react"
import { Kanban, KanbanColumn, KanbanCard, type KanbanColumn as KanbanColumnType } from "@/components/ui/kanban"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar } from "@/components/ui/avatar"
import { AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { IconPlus, IconClock, IconFlag, IconDotsVertical } from "@tabler/icons-react"

export default function KanbanPage() {
  const [columns, setColumns] = React.useState<KanbanColumnType[]>([
    {
      id: "todo",
      title: "Todo",
      cards: [
        { id: "1", title: "Setup project structure", priority: "high", assignee: "JD", dueDate: "2 days" },
        { id: "2", title: "Design system documentation", priority: "medium", assignee: "AS", dueDate: "5 days" },
        { id: "3", title: "API integration", priority: "low", assignee: "MK", dueDate: "1 week" },
      ],
    },
    {
      id: "in-progress",
      title: "In Progress",
      cards: [
        { id: "4", title: "Component library implementation", priority: "high", assignee: "JD", dueDate: "1 day" },
        { id: "5", title: "Testing setup", priority: "medium", assignee: "AS", dueDate: "3 days" },
      ],
    },
    {
      id: "done",
      title: "Done",
      cards: [
        { id: "6", title: "Project initialization", priority: "high", assignee: "MK", dueDate: "-" },
        { id: "7", title: "Design review", priority: "medium", assignee: "JD", dueDate: "-" },
      ],
    },
  ])

  const [newCardTitle, setNewCardTitle] = React.useState("")
  const [showAddCard, setShowAddCard] = React.useState<string | null>(null)

  const addCard = (columnId: string) => {
    if (!newCardTitle.trim()) return

    setColumns((prev) =>
      prev.map((col) =>
        col.id === columnId
          ? {
              ...col,
              cards: [...col.cards, { id: Date.now().toString(), title: newCardTitle, priority: "medium", assignee: "JD", dueDate: "-" }],
            }
          : col
      )
    )
    setNewCardTitle("")
    setShowAddCard(null)
  }

  const priorityColors = {
    high: "bg-red-500/10 text-red-500 hover:bg-red-500/20",
    medium: "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20",
    low: "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20",
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Kanban Board</h1>
        <p className="text-muted-foreground">Drag and drop task management component</p>
      </div>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Basic Kanban</h2>
        <p className="text-muted-foreground">A simple drag-and-drop board with 3 columns</p>

        <Kanban columns={columns} onColumnsChange={setColumns} columnSize="default">
          {columns.map((column) => (
            <KanbanColumn key={column.id} id={column.id} title={column.title}>
              {column.cards.map((card) => (
                <KanbanCard key={card.id} id={card.id}>
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <h4 className="font-medium">{card.title}</h4>
                      <Button variant="ghost" size="icon-sm" className="h-6 w-6">
                        <IconDotsVertical className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={priorityColors[card.priority as keyof typeof priorityColors]}>
                        <IconFlag className="mr-1 h-3 w-3" />
                        {card.priority}
                      </Badge>
                      <Badge variant="outline" className="gap-1">
                        <IconClock className="h-3 w-3" />
                        {card.dueDate}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs">{card.assignee}</AvatarFallback>
                      </Avatar>
                    </div>
                  </div>
                </KanbanCard>
              ))}
              <Button
                variant="ghost"
                className="w-full justify-start gap-2 text-muted-foreground"
                onClick={() => setShowAddCard(column.id)}
              >
                <IconPlus className="h-4 w-4" />
                Add card
              </Button>
              {showAddCard === column.id && (
                <div className="space-y-2 p-2 border rounded-lg bg-background">
                  <Input
                    placeholder="Card title..."
                    value={newCardTitle}
                    onChange={(e) => setNewCardTitle(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addCard(column.id)}
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => addCard(column.id)}>
                      Add
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setShowAddCard(null)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </KanbanColumn>
          ))}
        </Kanban>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Column Sizes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <h3 className="font-medium text-sm">Small (64)</h3>
            <div className="text-xs text-muted-foreground">Narrow columns for compact boards</div>
          </div>
          <div className="space-y-2">
            <h3 className="font-medium text-sm">Default (80)</h3>
            <div className="text-xs text-muted-foreground">Standard width for most use cases</div>
          </div>
          <div className="space-y-2">
            <h3 className="font-medium text-sm">Large (96)</h3>
            <div className="text-xs text-muted-foreground">Wide columns for rich content</div>
          </div>
          <div className="space-y-2">
            <h3 className="font-medium text-sm">Auto</h3>
            <div className="text-xs text-muted-foreground">Flexible width based on content</div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Variants</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border rounded-lg space-y-2">
            <h3 className="font-medium">Default</h3>
            <p className="text-sm text-muted-foreground">Standard kanban with borders and shadows</p>
          </div>
          <div className="p-4 border rounded-lg space-y-2 bg-muted/30">
            <h3 className="font-medium">Compact</h3>
            <p className="text-sm text-muted-foreground">Smaller cards and reduced spacing</p>
          </div>
          <div className="p-4 rounded-lg space-y-2 bg-background">
            <h3 className="font-medium">Minimal</h3>
            <p className="text-sm text-muted-foreground">Clean look with minimal styling</p>
          </div>
        </div>
      </section>
    </div>
  )
}
