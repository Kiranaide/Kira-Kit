"use client"

import * as React from "react"
import { IconPlus } from "@tabler/icons-react"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core"
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

interface KanbanColumn {
  id: string
  title: string
  cards: KanbanCard[]
}

interface KanbanCard {
  id: string
  title: string
  description?: string
}

interface KanbanContextValue {
  columns: KanbanColumn[]
  setColumns: (columns: KanbanColumn[]) => void
  activeId: string | null
}

const KanbanContext = React.createContext<KanbanContextValue | undefined>(undefined)

const useKanban = () => {
  const context = React.useContext(KanbanContext)
  if (!context) {
    throw new Error("useKanban must be used within a Kanban component")
  }
  return context!
}

const kanbanVariants = cva("flex gap-4 overflow-x-auto pb-4", {
  variants: {
    variant: {
      default: "gap-4",
      compact: "gap-2",
      minimal: "gap-3 border-0",
    },
  },
  defaultVariants: {
    variant: "default",
  },
})

const kanbanColumnVariants = cva(
  "flex-shrink-0 rounded-lg bg-muted/50 p-3",
  {
    variants: {
      size: {
        sm: "w-64",
        default: "w-80",
        lg: "w-96",
        auto: "min-w-80",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

interface KanbanProps extends React.ComponentPropsWithoutRef<"div">, VariantProps<typeof kanbanVariants> {
  columns: KanbanColumn[]
  onColumnsChange?: (columns: KanbanColumn[]) => void
  columnSize?: "sm" | "default" | "lg" | "auto"
}

interface KanbanColumnProps {
  column: KanbanColumn
  size?: "sm" | "default" | "lg" | "auto"
}

const Kanban = React.forwardRef<HTMLDivElement, KanbanProps>(
  ({ className, columns: initialColumns, onColumnsChange, variant = "default", columnSize = "default", ...props }, ref) => {
    const [columns, setColumns] = React.useState<KanbanColumn[]>(initialColumns)
    const [activeId, setActiveId] = React.useState<string | null>(null)

    const sensors = useSensors(
      useSensor(MouseSensor),
      useSensor(TouchSensor),
      useSensor(KeyboardSensor, {
        coordinateGetter: sortableKeyboardCoordinates,
      })
    )

    const handleDragStart = (event: any) => {
      setActiveId(event.active.id as string)
    }

    const handleDragOver = (event: any) => {
      const { active, over } = event
      if (over && active.id !== over.id) {
        const activeColumnId = active.data.current?.sortable?.containerId as string
        const overColumnId = over.id as string

        setColumns((items) => {
          const activeColumnIndex = items.findIndex((col) => col.id === activeColumnId)
          const overColumnIndex = items.findIndex((col) => col.id === overColumnId)

          if (activeColumnIndex === -1 || overColumnIndex === -1) return items

          const newItems = [...items]
          const activeColumn = newItems[activeColumnIndex]
          const overColumn = newItems[overColumnIndex]

          const activeCard = activeColumn.cards.find((card) => card.id === active.id)
          if (!activeCard) return items

          newItems[activeColumnIndex] = {
            ...activeColumn,
            cards: activeColumn.cards.filter((card) => card.id !== active.id),
          }
          newItems[overColumnIndex] = {
            ...overColumn,
            cards: [...overColumn.cards, activeCard],
          }
          return newItems
        })
      }
    }

    const handleDragEnd = (event: any) => {
      setActiveId(null)
      onColumnsChange?.(columns)
    }

    return (
      <KanbanContext.Provider value={{ columns, setColumns, activeId }}>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div
            ref={ref}
            className={cn(kanbanVariants({ variant, className }))}
            {...props}
          >
            {columns.map((column) => (
              <KanbanColumn key={column.id} column={column} size={columnSize} />
            ))}
          </div>
          <DragOverlay>
            {activeId ? (
              <div className="cursor-grabbing rounded-md border bg-card p-3 shadow-lg">
                <p className="font-medium text-foreground">{columns.find((c) => c.cards.some((card) => card.id === activeId))?.title}</p>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </KanbanContext.Provider>
    )
  }
)
Kanban.displayName = "Kanban"

const KanbanColumn = React.forwardRef<HTMLDivElement, KanbanColumnProps>(({ column, size = "default" }, ref) => {
  const { setNodeRef, isDragging } = useSortable({
    id: column.id,
  })

  return (
    <div
      ref={(node) => setNodeRef(node)}
      className={cn(kanbanColumnVariants({ size }), isDragging && "opacity-50")}
    >
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-semibold text-foreground">{column.title}</h3>
        <span className="text-xs text-muted-foreground">{column.cards.length}</span>
      </div>
      <div className="min-h-[200px] space-y-2">
        {column.cards.map((card) => (
          <KanbanCard key={card.id} card={card} columnId={column.id} />
        ))}
      </div>
      <button
        type="button"
        className="mt-2 flex w-full items-center justify-center gap-2 rounded-md border-2 border-dashed py-2 text-sm text-muted-foreground transition-colors hover:bg-muted"
      >
        <IconPlus className="h-4 w-4" aria-hidden="true" />
        <span>Add card</span>
      </button>
    </div>
  )
})
KanbanColumn.displayName = "KanbanColumn"

interface KanbanCardProps {
  card: KanbanCard
  columnId: string
}

const KanbanCard = React.forwardRef<HTMLDivElement, KanbanCardProps>(({ card, columnId }, ref) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: card.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "cursor-grab rounded-md border bg-card p-3 shadow-sm active:cursor-grabbing",
        isDragging && "opacity-50"
      )}
      {...listeners}
      {...attributes}
    >
      <p className="font-medium text-foreground">{card.title}</p>
      {card.description && (
        <p className="mt-2 text-sm text-muted-foreground">{card.description}</p>
      )}
    </div>
  )
})
KanbanCard.displayName = "KanbanCard"

export {
  Kanban,
  KanbanColumn,
  KanbanCard,
  useKanban,
  kanbanVariants,
  kanbanColumnVariants,
}

export type {
  KanbanColumn as KanbanColumnType,
  KanbanCard as KanbanCardType,
  KanbanProps,
  KanbanContextValue,
}
