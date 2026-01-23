"use client"

import * as React from "react"
import {
  IconPlus,
  IconGripVertical,
  IconDotsVertical,
  IconChevronDown,
  IconChevronUp,
  IconArrowRight,
  IconCheck,
  IconX,
} from "@tabler/icons-react"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragOverlay,
  type DragStartEvent,
  type DragOverEvent,
  type DragEndEvent,
  type UniqueIdentifier,
  useDroppable,
} from "@dnd-kit/core"
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"





interface KanbanCardData {
  id: string
  title: string
  description?: string
  priority?: "low" | "medium" | "high" | "critical"
  assignee?: { id: string; name: string; avatar?: string }
  tags?: string[]
  dueDate?: string
  attachments?: number
  comments?: number
  checklist?: { completed: number; total: number }
  cover?: string
}

interface KanbanColumnData {
  id: string
  title: string
  cards: KanbanCardData[]
  color?: string
  limit?: number
  collapsed?: boolean
}

interface KanbanContextValue {

  columns: KanbanColumnData[]
  setColumns: React.Dispatch<React.SetStateAction<KanbanColumnData[]>>
  activeId: UniqueIdentifier | null
  activeCard: KanbanCardData | null
  variant: "default" | "compact" | "minimal"
  columnSize: "sm" | "default" | "lg" | "auto"

  focusedCardId: string | null
  setFocusedCardId: (id: string | null) => void
  isGrabbed: boolean
  setIsGrabbed: (grabbed: boolean) => void

  showMoveDialog: boolean
  setShowMoveDialog: (show: boolean) => void
  moveDialogCard: KanbanCardData | null
  setMoveDialogCard: (card: KanbanCardData | null) => void
  moveDialogSourceColumn: string | null
  setMoveDialogSourceColumn: (columnId: string | null) => void

  announce: (message: string) => void
  addCard: (columnId: string, card: KanbanCardData) => void
  removeCard: (columnId: string, cardId: string) => void
  moveCard: (cardId: string, sourceColumnId: string, targetColumnId: string, targetIndex?: number) => void
  addColumn: (column: KanbanColumnData) => void
  removeColumn: (columnId: string) => void

  onColumnsChange?: (columns: KanbanColumnData[]) => void
  onCardClick?: (card: KanbanCardData, columnId: string) => void
  onCardAdd?: (columnId: string) => void
}

const KanbanContext = React.createContext<KanbanContextValue | undefined>(undefined)

function useKanban() {
  const context = React.useContext(KanbanContext)
  if (!context) {
    throw new Error("useKanban must be used within a Kanban component")
  }
  return context
}





const kanbanVariants = cva("flex gap-4 overflow-x-auto pb-4", {
  variants: {
    variant: {
      default: "gap-4",
      compact: "gap-2",
      minimal: "gap-3",
    },
  },
  defaultVariants: {
    variant: "default",
  },
})

const kanbanColumnVariants = cva(
  "flex-shrink-0 rounded-lg bg-muted/50 p-3 flex flex-col max-h-[calc(100vh-200px)]",
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

const kanbanCardVariants = cva(
  "rounded-md border bg-card p-3 shadow-sm transition-all cursor-grab active:cursor-grabbing",
  {
    variants: {
      priority: {
        low: "border-l-2 border-l-blue-500",
        medium: "border-l-2 border-l-yellow-500",
        high: "border-l-2 border-l-orange-500",
        critical: "border-l-2 border-l-red-500",
      },
    },
  }
)





function useReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = React.useState(false)

  React.useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    setPrefersReducedMotion(mediaQuery.matches)

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches)
    }

    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [])

  return prefersReducedMotion
}





interface AnnouncerProps {
  message: string
}

function Announcer({ message }: AnnouncerProps) {
  return (
    <div
      role="status"
      aria-live="assertive"
      aria-atomic="true"
      className="sr-only"
    >
      {message}
    </div>
  )
}





interface MoveDialogProps {
  card: KanbanCardData
  sourceColumnId: string
  columns: KanbanColumnData[]
  onMove: (targetColumnId: string, targetIndex?: number) => void
  onClose: () => void
}

function MoveDialog({ card, sourceColumnId, columns, onMove, onClose }: MoveDialogProps) {
  const [selectedColumn, setSelectedColumn] = React.useState<string | null>(null)
  const [selectedPosition, setSelectedPosition] = React.useState<number>(0)
  const dialogRef = React.useRef<HTMLDivElement>(null)


  React.useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    const focusableElements = dialog.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    firstElement?.focus()

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
        return
      }

      if (e.key === "Tab") {
        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault()
          lastElement?.focus()
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault()
          firstElement?.focus()
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [onClose])

  const targetColumn = columns.find((c) => c.id === selectedColumn)

  return (
    <>
      {}
      <div
        className="fixed inset-0 z-50 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />

      {}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="move-dialog-title"
        className={cn(
          "fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2",
          "rounded-lg border bg-background p-6 shadow-lg",
          "animate-in fade-in-0 zoom-in-95 duration-200"
        )}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 id="move-dialog-title" className="text-lg font-semibold">
            Move Card
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Close dialog"
          >
            <IconX className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-4">
          <p className="text-sm text-muted-foreground mb-2">
            Moving: <strong>{card.title}</strong>
          </p>
        </div>

        {}
        <div className="space-y-3 mb-4">
          <label className="text-sm font-medium">Select destination column:</label>
          <div className="grid gap-2">
            {columns.map((column) => (
              <button
                key={column.id}
                type="button"
                onClick={() => {
                  setSelectedColumn(column.id)
                  setSelectedPosition(column.cards.length)
                }}
                className={cn(
                  "flex items-center justify-between p-3 rounded-md border text-left transition-colors",
                  "hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  selectedColumn === column.id && "border-primary bg-primary/5",
                  column.id === sourceColumnId && "opacity-50"
                )}
                disabled={column.id === sourceColumnId}
              >
                <span className="font-medium">{column.title}</span>
                <span className="text-sm text-muted-foreground">
                  {column.cards.length} cards
                </span>
                {selectedColumn === column.id && (
                  <IconCheck className="h-4 w-4 text-primary" />
                )}
              </button>
            ))}
          </div>
        </div>

        {}
        {selectedColumn && targetColumn && (
          <div className="space-y-3 mb-6">
            <label className="text-sm font-medium">Select position:</label>
            <select
              value={selectedPosition}
              onChange={(e) => setSelectedPosition(Number(e.target.value))}
              className={cn(
                "w-full rounded-md border bg-background px-3 py-2",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              )}
            >
              {Array.from({ length: targetColumn.cards.length + 1 }, (_, i) => (
                <option key={i} value={i}>
                  Position {i + 1}
                  {i === 0 && " (Top)"}
                  {i === targetColumn.cards.length && " (Bottom)"}
                </option>
              ))}
            </select>
          </div>
        )}

        {}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className={cn(
              "px-4 py-2 rounded-md border text-sm font-medium",
              "hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            )}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              if (selectedColumn) {
                onMove(selectedColumn, selectedPosition)
              }
            }}
            disabled={!selectedColumn}
            className={cn(
              "px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium",
              "hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              "disabled:opacity-50 disabled:pointer-events-none"
            )}
          >
            <IconArrowRight className="h-4 w-4 inline mr-2" />
            Move Card
          </button>
        </div>
      </div>
    </>
  )
}





interface KanbanProps extends React.ComponentPropsWithoutRef<"div">, VariantProps<typeof kanbanVariants> {

  columns?: KanbanColumnData[]

  onColumnsChange?: (columns: KanbanColumnData[]) => void

  columnSize?: "sm" | "default" | "lg" | "auto"

  enableKeyboard?: boolean

  onCardClick?: (card: KanbanCardData, columnId: string) => void

  onCardAdd?: (columnId: string) => void

  announcements?: {
    onDragStart?: (card: KanbanCardData) => string
    onDragOver?: (card: KanbanCardData, column: KanbanColumnData) => string
    onDrop?: (card: KanbanCardData, column: KanbanColumnData) => string
    onCancel?: () => string
  }
}

const Kanban = React.forwardRef<HTMLDivElement, KanbanProps>(
  (
    {
      className,
      columns: initialColumns = [],
      onColumnsChange,
      variant = "default",
      columnSize = "default",
      enableKeyboard = true,
      onCardClick,
      onCardAdd,
      announcements,
      children,
      ...props
    },
    ref
  ) => {
    const [columns, setColumns] = React.useState<KanbanColumnData[]>(initialColumns)
    const [activeId, setActiveId] = React.useState<UniqueIdentifier | null>(null)
    const [activeCard, setActiveCard] = React.useState<KanbanCardData | null>(null)
    const [announcement, setAnnouncement] = React.useState("")


    const [focusedCardId, setFocusedCardId] = React.useState<string | null>(null)
    const [isGrabbed, setIsGrabbed] = React.useState(false)


    const [showMoveDialog, setShowMoveDialog] = React.useState(false)
    const [moveDialogCard, setMoveDialogCard] = React.useState<KanbanCardData | null>(null)
    const [moveDialogSourceColumn, setMoveDialogSourceColumn] = React.useState<string | null>(null)

    const reducedMotion = useReducedMotion()


    React.useEffect(() => {
      if (initialColumns.length > 0) {
        setColumns(initialColumns)
      }
    }, [initialColumns])

    const sensors = useSensors(
      useSensor(MouseSensor, {
        activationConstraint: {
          distance: 5,
        },
      }),
      useSensor(TouchSensor, {
        activationConstraint: {
          delay: 200,
          tolerance: 5,
        },
      }),
      useSensor(KeyboardSensor, {
        coordinateGetter: sortableKeyboardCoordinates,
      })
    )

    const announce = React.useCallback((message: string) => {
      setAnnouncement(message)
    }, [])

    const findCardAndColumn = (cardId: UniqueIdentifier) => {
      for (const column of columns) {
        const card = column.cards.find((c) => c.id === cardId)
        if (card) return { card, column }
      }
      return null
    }


    const addCard = React.useCallback((columnId: string, card: KanbanCardData) => {
      setColumns((prev) => {
        const newColumns = prev.map((col) => {
          if (col.id === columnId) {
            return { ...col, cards: [...col.cards, card] }
          }
          return col
        })
        onColumnsChange?.(newColumns)
        return newColumns
      })
    }, [onColumnsChange])

    const removeCard = React.useCallback((columnId: string, cardId: string) => {
      setColumns((prev) => {
        const newColumns = prev.map((col) => {
          if (col.id === columnId) {
            return { ...col, cards: col.cards.filter((c) => c.id !== cardId) }
          }
          return col
        })
        onColumnsChange?.(newColumns)
        return newColumns
      })
    }, [onColumnsChange])

    const moveCardFn = React.useCallback((
      cardId: string,
      sourceColumnId: string,
      targetColumnId: string,
      targetIndex?: number
    ) => {
      setColumns((prev) => {
        const sourceCol = prev.find((c) => c.id === sourceColumnId)
        const card = sourceCol?.cards.find((c) => c.id === cardId)
        if (!card) return prev

        const newColumns = prev.map((col) => ({
          ...col,
          cards: col.cards.filter((c) => c.id !== cardId),
        }))

        const targetIdx = newColumns.findIndex((c) => c.id === targetColumnId)
        if (targetIdx !== -1) {
          const insertIdx = targetIndex ?? newColumns[targetIdx].cards.length
          newColumns[targetIdx] = {
            ...newColumns[targetIdx],
            cards: [
              ...newColumns[targetIdx].cards.slice(0, insertIdx),
              card,
              ...newColumns[targetIdx].cards.slice(insertIdx),
            ],
          }
        }

        onColumnsChange?.(newColumns)
        return newColumns
      })
    }, [onColumnsChange])

    const addColumn = React.useCallback((column: KanbanColumnData) => {
      setColumns((prev) => {
        const newColumns = [...prev, column]
        onColumnsChange?.(newColumns)
        return newColumns
      })
    }, [onColumnsChange])

    const removeColumn = React.useCallback((columnId: string) => {
      setColumns((prev) => {
        const newColumns = prev.filter((c) => c.id !== columnId)
        onColumnsChange?.(newColumns)
        return newColumns
      })
    }, [onColumnsChange])

    const handleDragStart = (event: DragStartEvent) => {
      const result = findCardAndColumn(event.active.id)
      if (result) {
        setActiveId(event.active.id)
        setActiveCard(result.card)
        const message = announcements?.onDragStart?.(result.card) ||
          `Grabbed ${result.card.title}. Use arrow keys to move, Space to drop, Escape to cancel.`
        announce(message)
      }
    }

    const handleDragOver = (event: DragOverEvent) => {
      const { active, over } = event
      if (!over || active.id === over.id) return

      const activeResult = findCardAndColumn(active.id)
      if (!activeResult) return


      const overColumn = columns.find((c) => c.id === over.id)
      if (overColumn) {
        const message = announcements?.onDragOver?.(activeResult.card, overColumn) ||
          `Over ${overColumn.title} column`
        announce(message)
      }
    }

    const handleDragEnd = (event: DragEndEvent) => {
      const { active, over } = event

      setActiveId(null)
      setActiveCard(null)

      if (!over) {
        announce(announcements?.onCancel?.() || "Drop cancelled")
        return
      }

      const activeResult = findCardAndColumn(active.id)
      if (!activeResult) return


      let targetColumn = columns.find((c) => c.id === over.id)
      let targetIndex: number | undefined

      if (!targetColumn) {

        const overResult = findCardAndColumn(over.id)
        if (overResult) {
          targetColumn = overResult.column
          targetIndex = overResult.column.cards.findIndex((c) => c.id === over.id)
        }
      }

      if (!targetColumn) {
        announce(announcements?.onCancel?.() || "Drop cancelled")
        return
      }


      moveCardFn(String(active.id), activeResult.column.id, targetColumn.id, targetIndex)

      const message = announcements?.onDrop?.(activeResult.card, targetColumn) ||
        `Dropped ${activeResult.card.title} in ${targetColumn.title}`
      announce(message)
    }

    const handleDragCancel = () => {
      setActiveId(null)
      setActiveCard(null)
      announce(announcements?.onCancel?.() || "Drag cancelled")
    }


    const handleMoveFromDialog = (targetColumnId: string, targetIndex?: number) => {
      if (!moveDialogCard || !moveDialogSourceColumn) return

      moveCardFn(moveDialogCard.id, moveDialogSourceColumn, targetColumnId, targetIndex)

      const targetColumn = columns.find((c) => c.id === targetColumnId)
      announce(`Moved ${moveDialogCard.title} to ${targetColumn?.title || "column"}`)

      setShowMoveDialog(false)
      setMoveDialogCard(null)
      setMoveDialogSourceColumn(null)
    }


    const allCardIds = React.useMemo(
      () => columns.flatMap((col) => col.cards.map((c) => c.id)),
      [columns]
    )


    const hasChildren = React.Children.count(children) > 0

    return (
      <KanbanContext.Provider
        value={{
          columns,
          setColumns,
          activeId,
          activeCard,
          variant: variant || "default",
          columnSize: columnSize || "default",
          focusedCardId,
          setFocusedCardId,
          isGrabbed,
          setIsGrabbed,
          showMoveDialog,
          setShowMoveDialog,
          moveDialogCard,
          setMoveDialogCard,
          moveDialogSourceColumn,
          setMoveDialogSourceColumn,
          announce,
          addCard,
          removeCard,
          moveCard: moveCardFn,
          addColumn,
          removeColumn,
          onColumnsChange,
          onCardClick,
          onCardAdd,
        }}
      >
        {}
        <Announcer message={announcement} />

        {}
        <div className="sr-only">
          Kanban board. Use Tab to navigate between cards.
          Press Space or Enter to grab a card, arrow keys to move, Space to drop, Escape to cancel.
          Press M to open the move dialog for accessible card movement.
        </div>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
          onDragCancel={handleDragCancel}
        >
          <div
            ref={ref}
            data-slot="kanban"
            role="region"
            aria-label="Kanban board"
            className={cn(kanbanVariants({ variant, className }))}
            {...props}
          >
            {hasChildren ? (

              <SortableContext items={allCardIds} strategy={verticalListSortingStrategy}>
                {children}
              </SortableContext>
            ) : (

              <SortableContext items={allCardIds} strategy={verticalListSortingStrategy}>
                {columns.map((column) => (
                  <KanbanColumn key={column.id} id={column.id} title={column.title} data={column}>
                    {column.cards.map((card) => (
                      <KanbanCard key={card.id} id={card.id} columnId={column.id} data={card} />
                    ))}
                  </KanbanColumn>
                ))}
              </SortableContext>
            )}
          </div>

          <DragOverlay dropAnimation={reducedMotion ? null : undefined}>
            {activeCard ? (
              <div
                className={cn(
                  kanbanCardVariants({ priority: activeCard.priority }),
                  "cursor-grabbing shadow-lg ring-2 ring-primary"
                )}
              >
                <p className="font-medium text-foreground">{activeCard.title}</p>
                {activeCard.description && (
                  <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                    {activeCard.description}
                  </p>
                )}
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>

        {}
        {showMoveDialog && moveDialogCard && moveDialogSourceColumn && (
          <MoveDialog
            card={moveDialogCard}
            sourceColumnId={moveDialogSourceColumn}
            columns={columns}
            onMove={handleMoveFromDialog}
            onClose={() => {
              setShowMoveDialog(false)
              setMoveDialogCard(null)
              setMoveDialogSourceColumn(null)
            }}
          />
        )}
      </KanbanContext.Provider>
    )
  }
)
Kanban.displayName = "Kanban"





interface KanbanColumnProps extends React.ComponentPropsWithoutRef<"div"> {

  id: string

  title: string

  data?: KanbanColumnData

  color?: string

  limit?: number

  collapsed?: boolean
}

const KanbanColumn = React.forwardRef<HTMLDivElement, KanbanColumnProps>(
  ({ id, title, data, color, limit, collapsed: initialCollapsed = false, className, children, ...props }, ref) => {
    const { columnSize, onCardAdd } = useKanban()
    const { setNodeRef, isOver } = useDroppable({ id })
    const [isCollapsed, setIsCollapsed] = React.useState(data?.collapsed ?? initialCollapsed)

    const columnColor = data?.color ?? color
    const columnLimit = data?.limit ?? limit
    const cardCount = data?.cards.length ?? React.Children.count(children)
    const isOverLimit = columnLimit ? cardCount > columnLimit : false

    return (
      <div
        ref={(node) => {
          setNodeRef(node)
          if (typeof ref === "function") ref(node)
          else if (ref) ref.current = node
        }}
        data-slot="kanban-column"
        data-column-id={id}
        role="group"
        aria-label={`${title} column, ${cardCount} cards`}
        className={cn(
          kanbanColumnVariants({ size: columnSize }),
          isOverLimit && "ring-2 ring-destructive/50",
          isOver && "ring-2 ring-primary/50",
          className
        )}
        {...props}
      >
        {}
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1 rounded hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-expanded={!isCollapsed}
              aria-label={isCollapsed ? "Expand column" : "Collapse column"}
            >
              {isCollapsed ? (
                <IconChevronDown className="h-4 w-4" />
              ) : (
                <IconChevronUp className="h-4 w-4" />
              )}
            </button>
            <h3 className="font-semibold text-foreground">{title}</h3>
            {columnColor && (
              <div
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: columnColor }}
                aria-hidden="true"
              />
            )}
          </div>
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "text-xs px-1.5 py-0.5 rounded",
                isOverLimit
                  ? "bg-destructive/10 text-destructive"
                  : "text-muted-foreground"
              )}
            >
              {cardCount}
              {columnLimit && `/${columnLimit}`}
            </span>
            <button
              type="button"
              className="p-1 rounded hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="Column options"
            >
              <IconDotsVertical className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
        </div>

        {}
        {!isCollapsed && (
          <div className="flex-1 min-h-[100px] space-y-2 overflow-y-auto">
            <SortableContext
              items={data?.cards.map((c) => c.id) ?? []}
              strategy={verticalListSortingStrategy}
            >
              {children}
            </SortableContext>

            {}
            {cardCount === 0 && (
              <div
                className="h-20 border-2 border-dashed border-muted-foreground/20 rounded-md flex items-center justify-center"
                aria-hidden="true"
              >
                <span className="text-sm text-muted-foreground">Drop cards here</span>
              </div>
            )}
          </div>
        )}

        {}
        {!isCollapsed && (
          <button
            type="button"
            onClick={() => onCardAdd?.(id)}
            className={cn(
              "mt-2 flex w-full items-center justify-center gap-2 rounded-md",
              "border-2 border-dashed py-2 text-sm text-muted-foreground",
              "transition-colors hover:bg-muted hover:border-muted-foreground/50",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            )}
            aria-label={`Add card to ${title}`}
          >
            <IconPlus className="h-4 w-4" aria-hidden="true" />
            <span>Add card</span>
          </button>
        )}
      </div>
    )
  }
)
KanbanColumn.displayName = "KanbanColumn"





interface KanbanCardProps extends React.ComponentPropsWithoutRef<"div"> {

  id: string

  columnId: string

  data?: KanbanCardData

  priority?: "low" | "medium" | "high" | "critical"
}

const KanbanCard = React.forwardRef<HTMLDivElement, KanbanCardProps>(
  ({ id, columnId, data, priority, className, children, ...props }, ref) => {
    const {
      focusedCardId,
      setFocusedCardId,
      isGrabbed,
      setIsGrabbed,
      setMoveDialogCard,
      setMoveDialogSourceColumn,
      setShowMoveDialog,
      columns,
      moveCard,
      announce,
      onCardClick,
      onColumnsChange,
    } = useKanban()

    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({ id })

    const cardRef = React.useRef<HTMLDivElement>(null)
    const isFocused = focusedCardId === id
    const cardData = data ?? { id, title: "" }
    const cardPriority = data?.priority ?? priority


    React.useEffect(() => {
      if (isFocused && cardRef.current) {
        cardRef.current.focus()
      }
    }, [isFocused])

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    }

    const handleContextMenu = (e: React.MouseEvent) => {
      e.preventDefault()
      setMoveDialogCard(cardData)
      setMoveDialogSourceColumn(columnId)
      setShowMoveDialog(true)
    }

    const handleClick = () => {
      onCardClick?.(cardData, columnId)
    }


    const handleKeyDown = (e: React.KeyboardEvent) => {
      const column = columns.find((c) => c.id === columnId)
      if (!column) return

      const cardIndex = column.cards.findIndex((c) => c.id === id)

      switch (e.key) {
        case " ":
        case "Enter":
          e.preventDefault()
          if (isGrabbed) {
            setIsGrabbed(false)
            announce(`Dropped ${cardData.title}`)
          } else {
            setIsGrabbed(true)
            announce(`Grabbed ${cardData.title}. Use arrow keys to move, Space to drop, Escape to cancel.`)
          }
          break

        case "Escape":
          if (isGrabbed) {
            e.preventDefault()
            setIsGrabbed(false)
            announce("Drag cancelled")
          }
          break

        case "ArrowUp":
          e.preventDefault()
          if (isGrabbed && cardIndex > 0) {

            const newCards = [...column.cards]
            ;[newCards[cardIndex - 1], newCards[cardIndex]] = [newCards[cardIndex], newCards[cardIndex - 1]]
            const newColumns = columns.map((col) =>
              col.id === columnId ? { ...col, cards: newCards } : col
            )
            onColumnsChange?.(newColumns)
            announce(`Moved to position ${cardIndex}`)
          } else if (!isGrabbed && cardIndex > 0) {
            setFocusedCardId(column.cards[cardIndex - 1].id)
          }
          break

        case "ArrowDown":
          e.preventDefault()
          if (isGrabbed && cardIndex < column.cards.length - 1) {

            const newCards = [...column.cards]
            ;[newCards[cardIndex], newCards[cardIndex + 1]] = [newCards[cardIndex + 1], newCards[cardIndex]]
            const newColumns = columns.map((col) =>
              col.id === columnId ? { ...col, cards: newCards } : col
            )
            onColumnsChange?.(newColumns)
            announce(`Moved to position ${cardIndex + 2}`)
          } else if (!isGrabbed && cardIndex < column.cards.length - 1) {
            setFocusedCardId(column.cards[cardIndex + 1].id)
          }
          break

        case "ArrowLeft":
        case "ArrowRight": {
          e.preventDefault()
          const columnIndex = columns.findIndex((c) => c.id === columnId)
          const direction = e.key === "ArrowLeft" ? -1 : 1
          const targetColumnIndex = columnIndex + direction

          if (targetColumnIndex >= 0 && targetColumnIndex < columns.length) {
            const targetCol = columns[targetColumnIndex]

            if (isGrabbed) {
              moveCard(id, columnId, targetCol.id)
              announce(`Moved to ${targetCol.title}`)
            } else if (targetCol.cards.length > 0) {
              setFocusedCardId(targetCol.cards[0].id)
            }
          }
          break
        }

        case "m":
        case "M":
          e.preventDefault()
          setMoveDialogCard(cardData)
          setMoveDialogSourceColumn(columnId)
          setShowMoveDialog(true)
          break
      }
    }


    const { role: _role, tabIndex: _tabIndex, ...restAttributes } = attributes

    return (
      <div
        ref={(node) => {
          setNodeRef(node)
          if (typeof ref === "function") ref(node)
          else if (ref) ref.current = node
          ;(cardRef as React.MutableRefObject<HTMLDivElement | null>).current = node
        }}
        data-slot="kanban-card"
        data-card-id={id}
        role="listitem"
        aria-grabbed={isGrabbed && isFocused}
        tabIndex={0}
        style={style}
        onClick={handleClick}
        onFocus={() => setFocusedCardId(id)}
        onBlur={() => setFocusedCardId(null)}
        onKeyDown={handleKeyDown}
        onContextMenu={handleContextMenu}
        className={cn(
          kanbanCardVariants({ priority: cardPriority }),
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          isDragging && "opacity-50",
          isGrabbed && isFocused && "ring-2 ring-primary shadow-lg",
          className
        )}
        {...listeners}
        {...restAttributes}
        {...props}
      >
        {children ?? (
          <>
            <div className="flex items-start gap-2">
              <IconGripVertical
                className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5"
                aria-hidden="true"
              />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground">{cardData.title}</p>
                {cardData.description && (
                  <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                    {cardData.description}
                  </p>
                )}
              </div>
            </div>

            {}
            {(cardData.tags || cardData.assignee || cardData.dueDate) && (
              <div className="mt-3 flex items-center gap-2 flex-wrap">
                {cardData.tags?.slice(0, 2).map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-1.5 py-0.5 rounded bg-muted text-muted-foreground"
                  >
                    {tag}
                  </span>
                ))}
                {cardData.dueDate && (
                  <span className="text-xs text-muted-foreground">
                    {cardData.dueDate}
                  </span>
                )}
                {cardData.assignee && (
                  <div
                    className="ml-auto w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium"
                    title={cardData.assignee.name}
                  >
                    {cardData.assignee.avatar ? (
                      <img
                        src={cardData.assignee.avatar}
                        alt={cardData.assignee.name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      cardData.assignee.name.charAt(0).toUpperCase()
                    )}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    )
  }
)
KanbanCard.displayName = "KanbanCard"





interface KanbanHeaderProps extends React.ComponentPropsWithoutRef<"div"> {}

const KanbanHeader = React.forwardRef<HTMLDivElement, KanbanHeaderProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="kanban-header"
      className={cn("mb-4 flex items-center justify-between", className)}
      {...props}
    >
      {children}
    </div>
  )
)
KanbanHeader.displayName = "KanbanHeader"





interface KanbanAddColumnProps extends React.ComponentPropsWithoutRef<"button"> {}

const KanbanAddColumn = React.forwardRef<HTMLButtonElement, KanbanAddColumnProps>(
  ({ className, children, ...props }, ref) => {
    const { columnSize } = useKanban()

    return (
      <button
        ref={ref}
        type="button"
        data-slot="kanban-add-column"
        className={cn(
          kanbanColumnVariants({ size: columnSize }),
          "border-2 border-dashed border-muted-foreground/30 bg-transparent",
          "flex items-center justify-center gap-2 text-muted-foreground",
          "hover:border-muted-foreground/50 hover:bg-muted/30 transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          className
        )}
        {...props}
      >
        {children ?? (
          <>
            <IconPlus className="h-5 w-5" />
            <span>Add Column</span>
          </>
        )}
      </button>
    )
  }
)
KanbanAddColumn.displayName = "KanbanAddColumn"





export {
  Kanban,
  KanbanColumn,
  KanbanCard,
  KanbanHeader,
  KanbanAddColumn,
  useKanban,
  kanbanVariants,
  kanbanColumnVariants,
  kanbanCardVariants,
}

export type {
  KanbanCardData,
  KanbanColumnData,
  KanbanProps,
  KanbanColumnProps,
  KanbanCardProps,
  KanbanHeaderProps,
  KanbanAddColumnProps,
  KanbanContextValue,
}
