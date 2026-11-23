"use client";

import * as React from "react";
import {
  isFunctionProp,
  omitComponentProps,
  resolveComponentDefaults,
  withOccurrenceKeys,
} from "@/lib/component-utils";
import { mergeProps } from "@base-ui/react/merge-props";
import { Collapsible as CollapsiblePrimitive } from "@base-ui/react/collapsible";
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  defaultDropAnimationSideEffects,
  closestCenter,
  pointerWithin,
  useDroppable,
  useSensor,
  useSensors,
  type CollisionDetection,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  IconChevronDown,
  IconCalendarDue,
  IconChecklist,
  IconMessageCircle,
  IconPaperclip,
  IconPlus,
} from "@tabler/icons-react";
import { cva, type VariantProps } from "class-variance-authority";

import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { KiraSelect } from "@/components/ui/select";
import { cn } from "cn";

interface KanbanCardData {
  id: string;
  title: string;
  description?: string;
  priority?: "low" | "medium" | "high" | "critical";
  assignee?: { id: string; name: string; avatar?: string };
  tags?: string[];
  dueDate?: string;
  attachments?: number;
  comments?: number;
  checklist?: { completed: number; total: number };
  cover?: string;
  blockedReason?: string;
}

interface KanbanColumnData {
  id: string;
  title: string;
  cards: KanbanCardData[];
  color?: string;
  limit?: number;
  collapsed?: boolean;
}

interface KanbanMoveDetails {
  card: KanbanCardData;
  sourceColumn: KanbanColumnData;
  targetColumn: KanbanColumnData;
  targetIndex: number;
}

const kanbanVariants = cva(
  "flex min-w-0 max-w-full items-start overflow-x-auto pb-4",
  {
    variants: {
      variant: { default: "gap-4", compact: "gap-2", minimal: "gap-3" },
    },
    defaultVariants: { variant: "default" },
  },
);

const kanbanColumnVariants = cva(
  "flex min-h-0 shrink-0 flex-col rounded-xl border border-border/50 bg-muted/35 p-2.5",
  {
    variants: {
      size: { sm: "w-64", default: "w-80", lg: "w-96", auto: "w-80 grow" },
    },
    defaultVariants: { size: "default" },
  },
);

const kanbanCardVariants = cva(
  "relative min-w-0 rounded-lg border bg-card p-3 text-card-foreground shadow-sm",
  {
    variants: {
      priority: {
        low: "border-s-2 border-s-border",
        medium: "border-s-2 border-s-primary/50",
        high: "border-s-2 border-s-primary",
        critical: "border-s-2 border-s-destructive",
      },
    },
  },
);

interface KanbanProps
  extends React.ComponentProps<"div">, VariantProps<typeof kanbanVariants> {
  /** Controlled board. Use defaultColumns for local state. IDs must be unique. */
  columns?: KanbanColumnData[];
  defaultColumns?: KanbanColumnData[];
  onColumnsChange?: (columns: KanbanColumnData[]) => void;
  columnSize?: "sm" | "default" | "lg" | "auto";
  enableKeyboard?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  disabledReason?: string;
  wipMode?: "warn" | "enforce";
  /** Return a visible reason to reject a move. */
  canMove?: (details: KanbanMoveDetails) => string | undefined;
  onCardMove?: (details: KanbanMoveDetails) => void;
  cardFilter?: (card: KanbanCardData) => boolean;
  onCardClick?: (card: KanbanCardData, columnId: string) => void;
  onCardAdd?: (columnId: string) => void;
  announcements?: {
    onDragStart?: (card: KanbanCardData) => string;
    onDragOver?: (card: KanbanCardData, column: KanbanColumnData) => string;
    onDrop?: (card: KanbanCardData, column: KanbanColumnData) => string;
    onCancel?: () => string;
  };
}

interface KanbanContextValue {
  columns: KanbanColumnData[];
  setColumns: React.Dispatch<React.SetStateAction<KanbanColumnData[]>>;
  variant: "default" | "compact" | "minimal";
  columnSize: "sm" | "default" | "lg" | "auto";
  disabled: boolean;
  readOnly: boolean;
  enableKeyboard: boolean;
  keyboardDragging: boolean;
  cardFilter?: KanbanProps["cardFilter"];
  getMoveReason: (details: KanbanMoveDetails) => string | undefined;
  announce: (message: string) => void;
  addCard: (columnId: string, card: KanbanCardData) => void;
  removeCard: (columnId: string, cardId: string) => void;
  moveCard: (
    cardId: string,
    sourceColumnId: string,
    targetColumnId: string,
    targetIndex?: number,
  ) => boolean;
  addColumn: (column: KanbanColumnData) => void;
  removeColumn: (columnId: string) => void;
  openMove: (cardId: string, trigger: HTMLElement) => void;
  onCardClick?: KanbanProps["onCardClick"];
  onCardAdd?: KanbanProps["onCardAdd"];
}

const KanbanContext = React.createContext<KanbanContextValue | null>(null);

function useKanban() {
  const context = React.useContext(KanbanContext);

  if (!context) throw new Error("useKanban must be used within Kanban");

  return context;
}

function findCard(columns: KanbanColumnData[], id: string) {
  for (const column of columns) {
    const index = column.cards.findIndex((card) => card.id === id);

    if (index !== -1) return { card: column.cards[index], column, index };
  }

  return null;
}

function validColumns(columns: KanbanColumnData[]) {
  const columnIds = new Set<string>();
  const cardIds = new Set<string>();

  for (const column of columns) {
    if (!column.id || columnIds.has(column.id)) return false;
    columnIds.add(column.id);

    for (const card of column.cards) {
      if (!card.id || cardIds.has(card.id)) return false;
      cardIds.add(card.id);
    }
  }

  return true;
}

const boardCollision: CollisionDetection = (args) => {
  const candidates = args;
  const hits = pointerWithin(candidates);
  const cards = hits.filter((hit) => String(hit.id).startsWith("kanban-card:"));

  return resolveboardCollisionChoice1({ cards, hits, candidates });
};

function Kanban(input0: KanbanProps) {
  const state0 = useKanbanSetup(input0);
  const state1 = useKanbanState2(state0);
  const state2 = useKanbanState3(state1);
  const state3 = useKanbanActions(state2);

  return renderKanban(state3);
}

function KanbanMoveForm({
  card,
  source,
  columns,
  onMove,
  onClose,
}: {
  card: KanbanCardData;
  source: KanbanColumnData;
  columns: KanbanColumnData[];
  onMove: KanbanContextValue["moveCard"];
  onClose: () => void;
}) {
  const { getMoveReason } = useKanban();
  const [targetId, setTargetId] = React.useState(source.id);

  const [position, setPosition] = React.useState(
    String(source.cards.findIndex((item) => item.id === card.id)),
  );

  const columnId = React.useId();
  const positionId = React.useId();
  const target = columns.find((column) => column.id === targetId);
  const count = target?.cards.filter((item) => item.id !== card.id).length ?? 0;

  const reason = target
    ? getMoveReason({
        card,
        sourceColumn: source,
        targetColumn: target,
        targetIndex: Math.min(Number(position), count),
      })
    : "Choose an available destination.";

  const reasonId = React.useId();

  return renderKanbanMoveFormView({
    onMove,
    card,
    source,
    targetId,
    position,
    count,
    onClose,
    columnId,
    setTargetId,
    setPosition,
    columns,
    positionId,
    reason,
    reasonId,
    target,
  });
}

interface KanbanColumnProps extends Omit<React.ComponentProps<"div">, "title"> {
  id: string;
  title: string;
  data?: KanbanColumnData;
  color?: string;
  limit?: number;
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
}

function KanbanColumn({
  id,
  title,
  data,
  color,
  limit,
  collapsed,
  onCollapsedChange,
  children,
  className,
  ref,
  ...props
}: KanbanColumnProps) {
  const context = useKanban();
  const column = resolveKanbanColumn(context.columns, data, id);

  const {
    isCollapsed,
    setLocalCollapsed,
    disclosureMotion,
    setDisclosureMotion,
  } = useKanbanColumnCollapse(column, collapsed);

  const { setNodeRef, isOver } = useDroppable({
    id: "kanban-column:" + id,
    data: { columnId: id },
    disabled: context.disabled || context.readOnly || isCollapsed,
  });

  const reduced = useReducedMotion();
  const bodyId = React.useId();
  const count = column?.cards.length ?? React.Children.count(children);

  const visibleCount = getVisibleKanbanCardCount(
    column,
    context.cardFilter,
    count,
  );

  const maximum = limit ?? column?.limit;

  const overLimit = isKanbanColumnOverLimit({ maximum, count });

  return (
    <KanbanColumnView
      {...{
        props,
        isCollapsed,
        setLocalCollapsed,
        onCollapsedChange,
        collapsed,
        column,
        context,
        id,
        setNodeRef,
        ref,
        overLimit,
        title,
        count,
        isOver,
        className,
        bodyId,
        setDisclosureMotion,
        reduced,
        disclosureMotion,
        color,
        maximum,
        children,
        visibleCount,
      }}
    />
  );
}

function useKanbanColumnCollapse(
  column: KanbanColumnData | undefined,
  collapsed: boolean | undefined,
) {
  const [localCollapsed, setLocalCollapsed] = React.useState(
    column?.collapsed ?? false,
  );

  const [previousDataCollapsed, setPreviousDataCollapsed] = React.useState(
    column?.collapsed,
  );

  const [disclosureMotion, setDisclosureMotion] = React.useState(true);

  if (column?.collapsed !== previousDataCollapsed) {
    setPreviousDataCollapsed(column?.collapsed);
    setLocalCollapsed(column?.collapsed ?? false);
  }

  return {
    isCollapsed: collapsed ?? localCollapsed,
    setLocalCollapsed,
    disclosureMotion,
    setDisclosureMotion,
  };
}

function resolveKanbanColumn(
  columns: KanbanColumnData[],
  data: KanbanColumnData | undefined,
  id: string,
) {
  return data ?? columns.find((item) => item.id === id);
}

function getVisibleKanbanCardCount(
  column: KanbanColumnData | undefined,
  cardFilter: KanbanContextValue["cardFilter"],
  fallback: number,
) {
  return (
    column?.cards.filter((card) => !cardFilter || cardFilter(card)).length ??
    fallback
  );
}

interface KanbanCardProps extends React.ComponentProps<"div"> {
  id: string;
  columnId: string;
  data?: KanbanCardData;
  priority?: KanbanCardData["priority"];
}

function isCardDragTarget(event: React.SyntheticEvent<HTMLDivElement>) {
  const target = event.target instanceof Element ? event.target : null;

  if (!target) return false;

  if (
    target.closest(
      'button, a[href], input, textarea, select, summary, [contenteditable]:not([contenteditable="false"]), [role="button"], [role="link"], [role="textbox"], [role="combobox"], [role="slider"], [role="checkbox"], [role="switch"], [data-kanban-no-drag]',
    )
  )
    return false;
  const focusable = target.closest("[tabindex]");

  return !focusable || focusable === event.currentTarget;
}

// oxlint-disable-next-line eslint/complexity -- Pure compound JSX view: keeping related labels, controls, and conditional styling together makes the markup easier to review than further fragment extraction.
function KanbanCardContent({
  card,
  children,
  titleAction,
  moveAction,
}: {
  card: KanbanCardData;
  children?: React.ReactNode;
  titleAction?: React.ReactNode;
  moveAction?: React.ReactNode;
}) {
  return (
    <>
      {renderKanbanCardHeadingPart3({ children, titleAction, card })}
      {card.cover && (
        <img
          data-slot="kanban-card-cover"
          src={card.cover}
          alt=""
          loading="lazy"
          draggable={false}
          className="mt-3 aspect-video w-full rounded-md object-cover"
        />
      )}
      {card.blockedReason && (
        // kira-kit-ignore spacing-scale: compact card-metadata tier keeps optical metrics
        <p
          data-slot="kanban-card-blocked"
          className="mt-3 rounded-md bg-destructive/10 px-2.5 py-2 text-xs leading-5 text-destructive [overflow-wrap:anywhere]"
        >
          <strong>Blocked: </strong>
          {card.blockedReason}
        </p>
      )}
      {(card.priority || !!card.tags?.length) &&
        renderKanbanCardLabelsPart4({ card })}
      {(card.dueDate ||
        card.checklist ||
        card.comments !== undefined ||
        card.attachments !== undefined) &&
        renderKanbanCardMetadataPart5({ card })}
      {(card.assignee || moveAction) &&
        renderKanbanCardFooterPart6({ card, moveAction })}
    </>
  );
}

function KanbanCard({
  id,
  columnId,
  data,
  priority,
  children,
  className,
  style,
  ref,
  ...props
}: KanbanCardProps) {
  const context = useKanban();

  const card = resolveKanbanCard(context.columns, data, id, priority);

  const reduced = useReducedMotion();
  const visible = !context.cardFilter || context.cardFilter(card);
  const draggable = isKanbanCardDraggable(context, visible);

  const keyboardDraggable = draggable && context.enableKeyboard;

  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: "kanban-card:" + id,
    data: { cardId: id, columnId },
    disabled: !draggable,
    transition:
      reduced || context.keyboardDragging
        ? null
        : { duration: 200, easing: "cubic-bezier(0.23, 1, 0.32, 1)" },
  });

  const dragHandlers: React.HTMLAttributes<HTMLDivElement> = {
    onMouseDown: (event) => {
      if (draggable && isCardDragTarget(event)) listeners?.onMouseDown?.(event);
    },
    onTouchStart: (event) => {
      if (draggable && isCardDragTarget(event))
        listeners?.onTouchStart?.(event);
    },
    onKeyDown: (event) => {
      if (keyboardDraggable && event.target === event.currentTarget)
        listeners?.onKeyDown?.(event);
    },
  };

  return (
    <KanbanCardView
      {...{
        props,
        dragHandlers,
        setNodeRef,
        setActivatorNodeRef,
        ref,
        id,
        keyboardDraggable,
        draggable,
        attributes,
        visible,
        isDragging,
        context,
        card,
        style,
        transform,
        reduced,
        transition,
        priority,
        className,
        columnId,
        children,
      }}
    />
  );
}

function resolveKanbanCard(
  columns: KanbanColumnData[],
  data: KanbanCardData | undefined,
  id: string,
  priority: KanbanCardData["priority"],
) {
  return (
    data ??
    findCard(columns, id)?.card ?? { id, title: "Untitled card", priority }
  );
}

function isKanbanCardDraggable(context: KanbanContextValue, visible: boolean) {
  return (
    !context.disabled && !context.readOnly && !context.cardFilter && visible
  );
}

type KanbanHeaderProps = React.ComponentProps<"div">;

function KanbanHeader({ className, ...props }: KanbanHeaderProps) {
  return (
    <div
      {...props}
      data-slot="kanban-header"
      className={cn(
        "mb-4 flex min-w-0 flex-wrap items-center justify-between gap-2",
        className,
      )}
    />
  );
}

type KanbanAddColumnProps = React.ComponentProps<typeof Button>;

function KanbanAddColumn({
  className,
  children,
  ...props
}: KanbanAddColumnProps) {
  const context = useKanban();

  return (
    <Button
      {...props}
      type="button"
      data-slot="kanban-add-column"
      disabled={context.disabled || context.readOnly || props.disabled}
      variant={props.variant ?? "outline"}
      className={cn(
        kanbanColumnVariants({ size: context.columnSize }),
        "h-auto min-h-24",
        className,
      )}
    >
      {children ?? (
        <>
          <IconPlus aria-hidden="true" className="size-4" />
          Add column
        </>
      )}
    </Button>
  );
}

interface KiraKanbanProps extends Omit<KanbanProps, "children" | "cardFilter"> {
  title?: string;
  searchable?: boolean;
  blockedFilter?: boolean;
  loading?: boolean;
  error?: string;
  onRetry?: () => void;
}

function KiraKanban(input: KiraKanbanProps) {
  const {
    title,
    searchable,
    blockedFilter,
    loading,
    error,
    onRetry,
    ...props
  } = resolveComponentDefaults(input, KIRA_KANBAN_DEFAULTS_1);

  const [query, setQuery] = React.useState("");
  const [onlyBlocked, setOnlyBlocked] = React.useState(false);
  const searchId = React.useId();
  const loadingId = React.useId();
  const needle = searchable ? query.trim().toLocaleLowerCase() : "";
  const filterBlocked = blockedFilter && onlyBlocked;
  const filtered = !!needle || filterBlocked;

  const matches = (card: KanbanCardData) =>
    (!filterBlocked || !!card.blockedReason) &&
    (!needle ||
      [
        card.title,
        card.description,
        card.blockedReason,
        card.assignee?.name,
        ...(card.tags ?? []),
      ]
        .join(" ")
        .toLocaleLowerCase()
        .includes(needle));

  const buildToolbar = () =>
    renderBuildToolbarSectionPart8({
      title,
      searchable,
      searchId,
      query,
      setQuery,
      blockedFilter,
      onlyBlocked,
      setOnlyBlocked,
      filtered,
    });

  const buildBoard = () => (
    <Kanban
      {...props}
      disabled={props.disabled || loading}
      disabledReason={
        loading
          ? "Refreshing work; your board stays visible."
          : props.disabledReason
      }
      cardFilter={filtered ? matches : undefined}
      aria-describedby={[props["aria-describedby"], loadingId]
        .filter(Boolean)
        .join(" ")}
    />
  );

  return renderKiraKanbanPart9({
    loading,
    buildToolbar,
    loadingId,
    error,
    filtered,
    onRetry,
    props,
    buildBoard,
  });
}

export {
  Kanban,
  KanbanColumn,
  KanbanCard,
  KanbanHeader,
  KanbanAddColumn,
  KiraKanban,
  useKanban,
  kanbanVariants,
  kanbanColumnVariants,
  kanbanCardVariants,
};

export type {
  KanbanCardData,
  KanbanColumnData,
  KanbanMoveDetails,
  KanbanProps,
  KanbanColumnProps,
  KanbanCardProps,
  KanbanHeaderProps,
  KanbanAddColumnProps,
  KiraKanbanProps,
  KanbanContextValue,
};

type resolveboardCollisionChoice1Args = {
  cards: ReturnType<CollisionDetection>;
  hits: ReturnType<typeof pointerWithin>;
  candidates: Parameters<CollisionDetection>[0];
};

function resolveboardCollisionChoice1({
  cards,
  hits,
  candidates,
}: resolveboardCollisionChoice1Args) {
  if (cards.length) {
    return cards;
  }

  if (hits.length) {
    return hits;
  }

  return closestCenter(candidates);
}

type resolvekanbantsxChoice2Args = {
  column: KanbanColumnData;
  targetId: string;
  cards: KanbanCardData[];
  sourceId: string;
  cardId: string;
};

function resolvekanbantsxChoice2({
  column,
  targetId,
  cards,
  sourceId,
  cardId,
}: resolvekanbantsxChoice2Args) {
  if (column.id === targetId) {
    return { ...column, cards };
  }

  if (column.id === sourceId) {
    return {
      ...column,
      cards: column.cards.filter((card) => card.id !== cardId),
    };
  }

  return column;
}

type resolveKiraKanbanChoice3Args = {
  loading: renderKiraKanbanPart9Args["loading"];
  error: renderKiraKanbanPart9Args["error"];
  filtered: renderKiraKanbanPart9Args["filtered"];
};

function resolveKiraKanbanChoice3({
  loading,
  error,
  filtered,
}: resolveKiraKanbanChoice3Args) {
  if (loading) {
    return "Loading work…";
  }

  if (error) {
    return error;
  }

  if (filtered) {
    return "Filtered view. Use Move card to change a card's column or position; capacity counts include all work.";
  }

  return "Drag a card or use Move card to organize work.";
}

function useKanbanSetup(componentProps: KanbanProps) {
  const props = omitComponentProps(
    componentProps,
    USE_KANBAN_SETUP_COMPOSITION_KEYS_1,
  );

  const {
    defaultColumns,
    variant,
    columnSize,
    enableKeyboard,
    disabled,
    readOnly,
    wipMode,
  } = resolveComponentDefaults(componentProps, USE_KANBAN_SETUP_DEFAULTS_2);

  const [localColumns, setLocalColumns] = React.useState(defaultColumns);

  const columns = componentProps.columns ?? localColumns;

  const columnsRef = React.useRef(columns);

  const controlledRef = React.useRef(componentProps.columns);

  React.useLayoutEffect(() => {
    columnsRef.current = columns;
    controlledRef.current = componentProps.columns;
  });

  const [activeCardId, setActiveCardId] = React.useState<string | null>(null);

  const [keyboardDragging, setKeyboardDragging] = React.useState(false);

  const reduced = useReducedMotion();

  const [message, setMessage] = React.useState({ text: "", sequence: 0 });

  const [move, setMove] = React.useState<{
    cardId: string;
    trigger: HTMLElement;
  } | null>(null);

  const [moveOpen, setMoveOpen] = React.useState(false);

  const boardRef = React.useRef<HTMLDivElement>(null);

  const reasonId = React.useId();

  const keyboard = useSensor(KeyboardSensor, {
    coordinateGetter: sortableKeyboardCoordinates,
  });

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 200, tolerance: 6 },
    }),
    enableKeyboard ? keyboard : undefined,
  );

  if (!validColumns(columns))
    throw new Error(
      "Kanban requires non-empty, unique column IDs and globally unique card IDs",
    );

  return {
    ...componentProps,
    controlledColumns: componentProps.columns,
    props,
    variant,
    columnSize,
    enableKeyboard,
    disabled,
    readOnly,
    wipMode,
    setLocalColumns,
    columns,
    columnsRef,
    controlledRef,
    activeCardId,
    setActiveCardId,
    keyboardDragging,
    setKeyboardDragging,
    reduced,
    message,
    setMessage,
    move,
    setMove,
    moveOpen,
    setMoveOpen,
    boardRef,
    reasonId,
    sensors,
  };
}

function useKanbanState2(state: ReturnType<typeof useKanbanSetup>) {
  const { columnsRef, controlledRef } = state;

  const { setMessage, canMove, setLocalColumns, onColumnsChange, onCardMove } =
    state;

  const announce = (text: string) =>
    setMessage((previous) => ({ text, sequence: previous.sequence + 1 }));

  const getMoveReason = (details: KanbanMoveDetails) => {
    const limit = details.targetColumn.limit;

    if (
      state.wipMode === "enforce" &&
      details.sourceColumn.id !== details.targetColumn.id &&
      limit !== undefined &&
      Number.isFinite(limit) &&
      details.targetColumn.cards.length >= Math.max(0, Math.floor(limit))
    )
      return (
        details.targetColumn.title + " is at capacity. Move a card out first."
      );

    return canMove?.(details);
  };

  const setColumns: KanbanContextValue["setColumns"] = (update) => {
    if (state.disabled || state.readOnly) return;
    const current = columnsRef.current;
    const next = isFunctionProp(update) ? update(current) : update;

    if (next === current) return;

    if (!validColumns(next)) {
      announce("The board update contains duplicate or missing IDs.");

      return;
    }

    columnsRef.current = next;

    if (state.controlledColumns === undefined) setLocalColumns(next);
    else
      queueMicrotask(() => {
        if (controlledRef.current !== undefined)
          columnsRef.current = controlledRef.current;
      });
    onColumnsChange?.(next);
  };

  const moveCard = createKanbanMoveHandler({
    state,
    columnsRef,
    announce,
    getMoveReason,
    setColumns,
    onCardMove,
  });

  return { ...state, announce, getMoveReason, setColumns, moveCard };
}

function createKanbanMoveHandler({
  state,
  columnsRef,
  announce,
  getMoveReason,
  setColumns,
  onCardMove,
}: {
  state: ReturnType<typeof useKanbanSetup>;
  columnsRef: ReturnType<typeof useKanbanSetup>["columnsRef"];
  announce: (text: string) => void;
  getMoveReason: (details: KanbanMoveDetails) => string | undefined;
  setColumns: KanbanContextValue["setColumns"];
  onCardMove: ReturnType<typeof useKanbanSetup>["onCardMove"];
}): KanbanContextValue["moveCard"] {
  return (cardId, sourceId, targetId, targetIndex) => {
    if (state.disabled || state.readOnly) return false;

    const move = resolveKanbanMove(
      columnsRef.current,
      cardId,
      sourceId,
      targetId,
      targetIndex,
    );

    if (!move) return false;
    const { details, remaining, index, current } = move;
    const reason = getMoveReason(details);

    if (reason) {
      announce(reason);

      return false;
    }

    if (sourceId === targetId && move.source.index === index) return true;

    const cards = insertKanbanCard(remaining, index, move.source.card);
    setColumns(
      current.map((column) =>
        resolvekanbantsxChoice2({
          column,
          targetId,
          cards,
          sourceId,
          cardId,
        }),
      ),
    );
    onCardMove?.(details);
    announce(
      getKanbanMoveAnnouncement(state, move.source.card, move.target, index),
    );

    return true;
  };
}

function resolveKanbanMove(
  current: KanbanColumnData[],
  cardId: string,
  sourceId: string,
  targetId: string,
  targetIndex: number | undefined,
) {
  const source = findCard(current, cardId);
  const target = current.find((column) => column.id === targetId);

  if (!source || source.column.id !== sourceId || !target) return null;
  const remaining = target.cards.filter((card) => card.id !== cardId);

  const index = Math.max(
    0,
    Math.min(
      remaining.length,
      targetIndex !== undefined && Number.isFinite(targetIndex)
        ? Math.trunc(targetIndex)
        : remaining.length,
    ),
  );

  const details = {
    card: source.card,
    sourceColumn: source.column,
    targetColumn: target,
    targetIndex: index,
  };

  return { current, source, target, remaining, index, details };
}

function insertKanbanCard(
  cards: KanbanCardData[],
  index: number,
  card: KanbanCardData,
) {
  return [...cards.slice(0, index), card, ...cards.slice(index)];
}

function getKanbanMoveAnnouncement(
  state: ReturnType<typeof useKanbanSetup>,
  card: KanbanCardData,
  target: KanbanColumnData,
  index: number,
) {
  return (
    state.announcements?.onDrop?.(card, target) ??
    `Moved ${card.title || "Untitled card"} to ${target.title}, position ${index + 1}.`
  );
}

function useKanbanState3(state: ReturnType<typeof useKanbanState2>) {
  const { columnsRef } = state;

  const {
    setActiveCardId,
    moveCard,
    announce,
    setColumns,
    setMove,
    setMoveOpen,
  } = state;

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    setActiveCardId(null);

    if (!over || active.id === over.id || state.disabled || state.readOnly)
      return;
    const destination = resolveKanbanDrop(state.columns, active, over);

    if (destination) moveCard(...destination);
  };

  const context: KanbanContextValue = {
    columns: state.columns,
    setColumns: setColumns,
    variant: state.variant ?? "default",
    columnSize: state.columnSize,
    disabled: state.disabled,
    readOnly: state.readOnly,
    enableKeyboard: state.enableKeyboard,
    keyboardDragging: state.keyboardDragging,
    announce: announce,
    cardFilter: state.cardFilter,
    getMoveReason: state.getMoveReason,
    addCard: (id, card) => {
      const target = columnsRef.current.find((column) => column.id === id);

      if (!target) return;

      if (
        state.wipMode === "enforce" &&
        target.limit !== undefined &&
        Number.isFinite(target.limit) &&
        target.cards.length >= Math.max(0, Math.floor(target.limit))
      ) {
        announce(target.title + " is at capacity. Move a card out first.");

        return;
      }

      setColumns((current) =>
        current.map((column) =>
          column.id === id
            ? { ...column, cards: [...column.cards, card] }
            : column,
        ),
      );
    },
    removeCard: (id, cardId) =>
      setColumns((current) =>
        current.map((column) =>
          column.id === id
            ? {
                ...column,
                cards: column.cards.filter((card) => card.id !== cardId),
              }
            : column,
        ),
      ),
    moveCard: moveCard,
    addColumn: (column) => setColumns((current) => [...current, column]),
    removeColumn: (id) =>
      setColumns((current) => current.filter((column) => column.id !== id)),
    openMove: (cardId, trigger) => {
      if (!state.disabled && !state.readOnly) {
        setMove({ cardId, trigger });
        setMoveOpen(true);
      }
    },
    onCardClick: state.onCardClick,
    onCardAdd: state.onCardAdd,
  };

  return { ...state, handleDragEnd, context };
}

function resolveKanbanDrop(
  columns: KanbanColumnData[],
  active: DragEndEvent["active"],
  over: NonNullable<DragEndEvent["over"]>,
): Parameters<KanbanContextValue["moveCard"]> | null {
  const cardId: string | undefined = active.data.current?.cardId;
  const targetId: string | undefined = over.data.current?.columnId;

  if (!cardId || !targetId) return null;
  const source = findCard(columns, cardId);

  if (!source) return null;
  const targetCardId: string | undefined = over.data.current?.cardId;
  const target = columns.find((column) => column.id === targetId);

  const index = targetCardId
    ? target?.cards.findIndex((card) => card.id === targetCardId)
    : undefined;

  return [cardId, source.column.id, targetId, index];
}

function useKanbanActions(state: ReturnType<typeof useKanbanState3>) {
  const active = state.activeCardId
    ? findCard(state.columns, state.activeCardId)
    : null;

  const moving = state.move ? findCard(state.columns, state.move.cardId) : null;

  return { ...state, active, moving };
}

// oxlint-disable-next-line eslint/max-lines-per-function, eslint/complexity -- Pure compound JSX view: keeping related labels, controls, and conditional styling together makes the markup easier to review than further fragment extraction.
function renderKanban(state: ReturnType<typeof useKanbanActions>) {
  const { boardRef } = state;

  const { setKeyboardDragging, setActiveCardId, announce, ref, setMoveOpen } =
    state;

  return (
    <KanbanContext.Provider value={state.context}>
      <DndContext
        sensors={state.sensors}
        collisionDetection={boardCollision}
        accessibility={{
          announcements: {
            onDragStart: () => "",
            onDragOver: () => "",
            onDragEnd: () => "",
            onDragCancel: () => "",
          },
        }}
        onDragStart={({ active: drag, activatorEvent }) => {
          const id: string | undefined = drag.data.current?.cardId;
          const found = id ? findCard(state.columns, id) : null;

          if (found) {
            setKeyboardDragging(activatorEvent instanceof KeyboardEvent);
            setActiveCardId(found.card.id);
            announce(
              state.announcements?.onDragStart?.(found.card) ??
                "Picked up " +
                  found.card.title +
                  ". Use arrows to move, Space to drop, Escape to cancel.",
            );
          }
        }}
        onDragOver={({ over }) => {
          const column = state.columns.find(
            (item) => item.id === over?.data.current?.columnId,
          );

          if (state.active && column && state.announcements?.onDragOver)
            announce(state.announcements.onDragOver(state.active.card, column));
        }}
        onDragEnd={state.handleDragEnd}
        onDragCancel={() => {
          setActiveCardId(null);
          announce(
            state.announcements?.onCancel?.() ??
              "Move cancelled; board unchanged.",
          );
        }}
      >
        <div
          {...state.props}
          ref={(node) => {
            boardRef.current = node;

            if (isFunctionProp(ref)) return ref(node);

            if (ref) ref.current = node;
          }}
          tabIndex={state.props.tabIndex ?? -1}
          data-slot="kanban"
          role={state.props.role ?? "region"}
          aria-label={state.props["aria-label"] ?? "Kanban board"}
          aria-describedby={
            [
              state.props["aria-describedby"],
              state.disabledReason ? state.reasonId : "",
            ]
              .filter(Boolean)
              .join(" ") || undefined
          }
          data-disabled={state.disabled || undefined}
          data-readonly={state.readOnly || undefined}
          className={cn(
            kanbanVariants({ variant: state.variant }),
            state.disabled && "opacity-50",
            state.className,
          )}
        >
          {state.children ??
            state.columns.map((column) => (
              <KanbanColumn
                key={column.id}
                id={column.id}
                title={column.title}
                data={column}
              />
            ))}
          {!state.children && state.columns.length === 0 && (
            <p
              data-slot="kanban-empty"
              className="p-4 text-sm text-muted-foreground"
            >
              No columns yet. Add a column to start planning.
            </p>
          )}
        </div>
        <DragOverlay
          transition={
            state.reduced || state.keyboardDragging ? "none" : undefined
          }
          dropAnimation={
            state.reduced || state.keyboardDragging
              ? null
              : {
                  duration: 200,
                  easing: "cubic-bezier(0.23, 1, 0.32, 1)",
                  sideEffects: defaultDropAnimationSideEffects({
                    styles: { active: { opacity: "0" } },
                  }),
                }
          }
        >
          {state.active && !state.disabled && !state.readOnly && (
            <div
              data-slot="kanban-drag-overlay"
              className={cn(
                kanbanCardVariants({ priority: state.active.card.priority }),
                "pointer-events-none w-full shadow-lg ring-1 ring-primary/20",
              )}
              aria-hidden="true"
            >
              <KanbanCardContent
                card={state.active.card}
                moveAction={
                  <span className="inline-flex h-8 shrink-0 items-center px-2 text-xs font-medium text-muted-foreground">
                    Move card
                  </span>
                }
              />
            </div>
          )}
        </DragOverlay>
      </DndContext>
      {state.disabledReason && (
        <p
          id={state.reasonId}
          data-slot="kanban-disabled-reason"
          className="text-sm text-muted-foreground"
        >
          {state.disabledReason}
        </p>
      )}
      <div
        data-slot="kanban-status"

        // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role -- This existing live region preserves its block layout and div ref contract; output introduces form-associated semantics.
        role="status"
        aria-atomic="true"
        className="sr-only"
      >
        <span key={state.message.sequence}>{state.message.text}</span>
      </div>
      <Dialog
        open={
          state.moveOpen && !!state.moving && !state.disabled && !state.readOnly
        }
        onOpenChange={setMoveOpen}
      >
        <DialogContent
          data-slot="kanban-move-dialog"
          finalFocus={() => {
            if (
              state.move?.trigger.isConnected &&
              !state.move.trigger.closest("[hidden]")
            )
              return state.move.trigger;

            const button = state.move
              ? boardRef.current?.querySelector<HTMLButtonElement>(
                  '[data-card-id="' +
                    globalThis.CSS.escape(state.move.cardId) +
                    '"] [data-slot="kanban-card-move"]',
                )
              : null;

            return button && !button.closest("[hidden]")
              ? button
              : boardRef.current;
          }}
        >
          {state.moving && (
            <KanbanMoveForm
              key={state.moving.card.id}
              card={state.moving.card}
              source={state.moving.column}
              columns={state.columns}
              onMove={state.moveCard}
              onClose={() => setMoveOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </KanbanContext.Provider>
  );
}

type renderKanbanColumnHeaderPart1Args = {
  isCollapsed: boolean;
  title: KanbanColumnProps["title"];
  bodyId: string;
  setDisclosureMotion: React.Dispatch<React.SetStateAction<boolean>>;
  reduced: ReturnType<typeof useReducedMotion>;
  disclosureMotion: boolean;
  color: KanbanColumnProps["color"];
  column: KanbanColumnData | undefined;
  overLimit: boolean;
  count: number;
  maximum: number | undefined;
};

// oxlint-disable-next-line eslint/complexity -- Pure compound JSX view: keeping related labels, controls, and conditional styling together makes the markup easier to review than further fragment extraction.
function renderKanbanColumnHeaderPart1({
  isCollapsed,
  title,
  bodyId,
  setDisclosureMotion,
  reduced,
  disclosureMotion,
  color,
  column,
  overLimit,
  count,
  maximum,
}: renderKanbanColumnHeaderPart1Args) {
  return (
    <div
      data-slot="kanban-column-header"
      className="mb-2 flex min-w-0 items-center gap-2"
    >
      <CollapsiblePrimitive.Trigger
        data-slot="kanban-column-toggle"
        render={<Button type="button" variant="ghost" size="icon-sm" />}
        aria-label={(isCollapsed ? "Expand " : "Collapse ") + title}
        aria-controls={bodyId}
        onClick={(event) => setDisclosureMotion(event.detail > 0)}
        className="text-muted-foreground motion-reduce:transition-none"
      >
        <IconChevronDown
          aria-hidden="true"
          className={cn(
            "size-4",
            !isCollapsed && "rotate-180",
            !reduced &&
              disclosureMotion &&
              "transition-transform duration-150 ease-out",
          )}
        />
      </CollapsiblePrimitive.Trigger>
      <h3
        data-slot="kanban-column-title"
        className="min-w-0 flex-1 self-center break-words text-sm font-semibold"
      >
        {title || "Untitled column"}
      </h3>
      {(color ?? column?.color) && (
        <span
          data-slot="kanban-column-color"
          aria-hidden="true"
          className="size-2 shrink-0 rounded-full"
          style={{ backgroundColor: color ?? column?.color }}
        />
      )}
      <span
        data-slot="kanban-column-count"
        className={cn(
          "shrink-0 rounded-md bg-background/70 px-2 py-1 text-xs tabular-nums",
          overLimit ? "text-destructive" : "text-muted-foreground",
        )}
      >
        {count}
        {maximum !== undefined && " / " + maximum}
      </span>
    </div>
  );
}

type renderKanbanColumnBodyPart2Args = {
  bodyId: string;
  reduced: ReturnType<typeof useReducedMotion>;
  disclosureMotion: boolean;
  column: KanbanColumnData | undefined;
  title: KanbanColumnProps["title"];
  children: KanbanColumnProps["children"];
  id: KanbanColumnProps["id"];
  visibleCount: number;
  count: number;
  context: ReturnType<typeof useKanban>;
};

// oxlint-disable-next-line eslint/complexity -- Pure compound JSX view: keeping related labels, controls, and conditional styling together makes the markup easier to review than further fragment extraction.
function renderKanbanColumnBodyPart2({
  bodyId,
  reduced,
  disclosureMotion,
  column,
  title,
  children,
  id,
  visibleCount,
  count,
  context,
}: renderKanbanColumnBodyPart2Args) {
  return (
    <CollapsiblePrimitive.Panel
      id={bodyId}
      data-slot="kanban-column-body"
      keepMounted
      className={cn(
        "overflow-hidden",
        !reduced &&
          disclosureMotion &&
          // kira-kit-ignore layout-transitions: Base UI collapsible panel height var is the standard expand/collapse animation
          "h-(--collapsible-panel-height) transition-[height,opacity] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] data-starting-style:h-0 data-starting-style:opacity-0 data-ending-style:h-0 data-ending-style:opacity-0",
      )}
    >
      <div data-slot="kanban-column-content" className="min-h-24 space-y-2">
        <SortableContext
          items={column?.cards.map((card) => "kanban-card:" + card.id) ?? []}
          strategy={verticalListSortingStrategy}
        >
          <div
            data-slot="kanban-column-list"

            // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role -- This list uses div roots for virtualization, positioning, or compound layout; ARIA preserves list semantics without changing item DOM contracts.
            role="list"
            aria-label={title + " cards"}
            className="max-h-128 space-y-2 overflow-y-auto p-1"
          >
            {children ??
              column?.cards.map((card) => (
                <KanbanCard
                  key={card.id}
                  id={card.id}
                  columnId={id}
                  data={card}
                />
              ))}
          </div>
        </SortableContext>
        {visibleCount === 0 && (
          <p
            data-slot="kanban-column-empty"
            className="rounded-md border border-dashed p-4 text-center text-sm text-muted-foreground"
          >
            {count ? "No matching cards in " : "No cards in "}
            {title}.
          </p>
        )}
        {context.onCardAdd && !context.readOnly && (
          <Button
            data-slot="kanban-column-add"
            type="button"
            variant="ghost"
            className="w-full"
            disabled={context.disabled}
            onClick={() => context.onCardAdd?.(id)}
          >
            <IconPlus aria-hidden="true" className="size-4" />
            Add card
          </Button>
        )}
      </div>
    </CollapsiblePrimitive.Panel>
  );
}

type renderKanbanCardHeadingPart3Args = {
  children: {
    card: KanbanCardData;
    children?: React.ReactNode;
    titleAction?: React.ReactNode;
    moveAction?: React.ReactNode;
  }["children"];
  titleAction: {
    card: KanbanCardData;
    children?: React.ReactNode;
    titleAction?: React.ReactNode;
    moveAction?: React.ReactNode;
  }["titleAction"];
  card: {
    card: KanbanCardData;
    children?: React.ReactNode;
    titleAction?: React.ReactNode;
    moveAction?: React.ReactNode;
  }["card"];
};

function renderKanbanCardHeadingPart3({
  children,
  titleAction,
  card,
}: renderKanbanCardHeadingPart3Args) {
  return (
    <div
      data-slot="kanban-card-heading"
      className="flex min-w-0 items-start gap-2"
    >
      <div
        data-slot="kanban-card-content"
        className="min-w-0 flex-1 [overflow-wrap:anywhere]"
      >
        {children ?? (
          <>
            {titleAction ?? (
              <p
                data-slot="kanban-card-title"
                className="text-sm font-medium leading-5"
              >
                {card.title || "Untitled card"}
              </p>
            )}
            {card.description && (
              <p
                data-slot="kanban-card-description"
                className="mt-1 text-xs leading-5 text-muted-foreground"
              >
                {card.description}
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}

type renderKanbanCardLabelsPart4Args = {
  card: {
    card: KanbanCardData;
    children?: React.ReactNode;
    titleAction?: React.ReactNode;
    moveAction?: React.ReactNode;
  }["card"];
};

function renderKanbanCardLabelsPart4({
  card,
}: renderKanbanCardLabelsPart4Args) {
  return (
    // kira-kit-ignore spacing-scale: compact card-metadata tier keeps optical metrics
    <div
      data-slot="kanban-card-labels"
      className="mt-3 flex min-w-0 flex-wrap items-center gap-1.5 text-xs"
    >
      {card.priority && (
        // kira-kit-ignore spacing-scale: compact card-metadata tier keeps optical metrics
        <span
          data-slot="kanban-card-priority"
          className={cn(
            "rounded-md px-1.5 py-0.5 capitalize",
            card.priority === "critical"
              ? "bg-destructive/10 text-destructive"
              : "bg-muted text-muted-foreground",
          )}
        >
          {card.priority} priority
        </span>
      )}
      {withOccurrenceKeys(card.tags ?? [], (tag) => tag).map(
        ({ item: tag, key }) => (
          // kira-kit-ignore spacing-scale: compact card-metadata tier keeps optical metrics
          <span
            data-slot="kanban-card-tag"
            key={key}
            className="max-w-full rounded-md border px-1.5 py-0.5 text-muted-foreground [overflow-wrap:anywhere]"
          >
            {tag}
          </span>
        ),
      )}
    </div>
  );
}

type renderKanbanCardMetadataPart5Args = {
  card: {
    card: KanbanCardData;
    children?: React.ReactNode;
    titleAction?: React.ReactNode;
    moveAction?: React.ReactNode;
  }["card"];
};

function renderKanbanCardMetadataPart5({
  card,
}: renderKanbanCardMetadataPart5Args) {
  return (
    // kira-kit-ignore spacing-scale: compact card-metadata tier keeps optical metrics
    <div
      data-slot="kanban-card-metadata"
      className="mt-3 flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-muted-foreground"
    >
      {card.dueDate && (
        <span
          data-slot="kanban-card-due"
          className="inline-flex min-w-0 items-center gap-1 [overflow-wrap:anywhere]"
        >
          {/* kira-kit-ignore spacing-scale: 14px icon optically matches sm/compact controls; documented half-step exception */}
          <IconCalendarDue aria-hidden="true" className="size-3.5 shrink-0" />
          <span>
            <span className="sr-only">Due </span>
            {card.dueDate}
          </span>
        </span>
      )}
      {card.checklist && (
        <span
          data-slot="kanban-card-checklist"
          className="inline-flex items-center gap-1 tabular-nums"
        >
          {/* kira-kit-ignore spacing-scale: 14px icon optically matches sm/compact controls; documented half-step exception */}
          <IconChecklist aria-hidden="true" className="size-3.5" />
          {card.checklist.completed}/{card.checklist.total}
          <span className="sr-only"> tasks completed</span>
        </span>
      )}
      {card.comments !== undefined && (
        <span
          data-slot="kanban-card-comments"
          className="inline-flex items-center gap-1 tabular-nums"
        >
          {/* kira-kit-ignore spacing-scale: 14px icon optically matches sm/compact controls; documented half-step exception */}
          <IconMessageCircle aria-hidden="true" className="size-3.5" />
          {card.comments}
          <span className="sr-only"> comments</span>
        </span>
      )}
      {card.attachments !== undefined && (
        <span
          data-slot="kanban-card-attachments"
          className="inline-flex items-center gap-1 tabular-nums"
        >
          {/* kira-kit-ignore spacing-scale: 14px icon optically matches sm/compact controls; documented half-step exception */}
          <IconPaperclip aria-hidden="true" className="size-3.5" />
          {card.attachments}
          <span className="sr-only"> attachments</span>
        </span>
      )}
    </div>
  );
}

type renderKanbanCardFooterPart6Args = {
  card: {
    card: KanbanCardData;
    children?: React.ReactNode;
    titleAction?: React.ReactNode;
    moveAction?: React.ReactNode;
  }["card"];
  moveAction: {
    card: KanbanCardData;
    children?: React.ReactNode;
    titleAction?: React.ReactNode;
    moveAction?: React.ReactNode;
  }["moveAction"];
};

function renderKanbanCardFooterPart6({
  card,
  moveAction,
}: renderKanbanCardFooterPart6Args) {
  return (
    <div
      data-slot="kanban-card-footer"
      className="mt-3 flex min-w-0 flex-wrap items-center justify-between gap-2 border-t pt-2"
    >
      {card.assignee && (
        // kira-kit-ignore spacing-scale: compact card-metadata tier keeps optical metrics
        <span
          data-slot="kanban-card-assignee"
          className="flex min-w-0 flex-1 items-center gap-1.5 text-xs text-muted-foreground"
        >
          <Avatar size="xs">
            <AvatarImage src={card.assignee.avatar} alt="" />
            <AvatarFallback>{card.assignee.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <span className="min-w-0 [overflow-wrap:anywhere]">
            {card.assignee.name}
          </span>
        </span>
      )}
      {moveAction}
    </div>
  );
}

type renderKanbanCardSectionPart7Args = {
  card: KanbanCardData;
  context: ReturnType<typeof useKanban>;
  columnId: KanbanCardProps["columnId"];
  id: KanbanCardProps["id"];
  children: KanbanCardProps["children"];
};

function renderKanbanCardSectionPart7({
  card,
  context,
  columnId,
  id,
  children,
}: renderKanbanCardSectionPart7Args) {
  return (
    <KanbanCardContent
      card={card}
      titleAction={
        context.onCardClick && (
          <Button
            data-slot="kanban-card-open"
            type="button"
            variant="ghost"
            disabled={context.disabled}
            className="h-auto w-full justify-start rounded-sm p-0 text-start text-sm font-medium leading-5 whitespace-normal motion-reduce:transition-none"
            onClick={() => context.onCardClick?.(card, columnId)}
          >
            {card.title || "Untitled card"}
          </Button>
        )
      }
      moveAction={
        !context.readOnly && (
          <Button
            data-slot="kanban-card-move"
            type="button"
            variant="ghost"
            size="sm"
            className="ms-auto px-2 text-muted-foreground motion-reduce:transition-none"
            disabled={context.disabled}
            onClick={(event) => context.openMove(id, event.currentTarget)}
          >
            Move card
          </Button>
        )
      }
    >
      {children}
    </KanbanCardContent>
  );
}

type renderBuildToolbarSectionPart8Args = {
  title: string;
  searchable: boolean;
  searchId: string;
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
  blockedFilter: boolean;
  onlyBlocked: boolean;
  setOnlyBlocked: React.Dispatch<React.SetStateAction<boolean>>;
  filtered: boolean;
};

function renderBuildToolbarSectionPart8({
  title,
  searchable,
  searchId,
  query,
  setQuery,
  blockedFilter,
  onlyBlocked,
  setOnlyBlocked,
  filtered,
}: renderBuildToolbarSectionPart8Args) {
  return (
    <KanbanHeader>
      <h3 className="text-base font-semibold">{title}</h3>
      <div className="flex min-w-0 flex-wrap items-end gap-2">
        {searchable && (
          <div data-slot="kira-kanban-search" className="min-w-0 space-y-1">
            <label htmlFor={searchId} className="text-xs text-muted-foreground">
              Find work
            </label>
            <Input
              id={searchId}
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Title, owner or tag"
            />
          </div>
        )}
        {blockedFilter && (
          <Button
            data-slot="kira-kanban-blocked-filter"
            type="button"
            size="sm"
            variant={onlyBlocked ? "secondary" : "outline"}
            aria-pressed={onlyBlocked}
            onClick={() => setOnlyBlocked(!onlyBlocked)}
          >
            Blocked work
          </Button>
        )}
        {filtered && (
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={() => {
              setQuery("");
              setOnlyBlocked(false);
            }}
          >
            Clear filters
          </Button>
        )}
      </div>
    </KanbanHeader>
  );
}

type renderKiraKanbanPart9Args = {
  loading: boolean;
  buildToolbar: () => React.JSX.Element;
  loadingId: string;
  error: KiraKanbanProps["error"];
  filtered: boolean;
  onRetry: KiraKanbanProps["onRetry"];
  props: Omit<
    KiraKanbanProps,
    "title" | "searchable" | "blockedFilter" | "loading" | "error" | "onRetry"
  >;
  buildBoard: () => React.JSX.Element;
};

function renderKiraKanbanPart9({
  loading,
  buildToolbar,
  loadingId,
  error,
  filtered,
  onRetry,
  props,
  buildBoard,
}: renderKiraKanbanPart9Args) {
  return (
    <div
      data-slot="kira-kanban"
      aria-busy={loading}
      className="min-w-0 space-y-3"
    >
      {buildToolbar()}
      <p
        id={loadingId}
        data-slot="kira-kanban-feedback"

        // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role -- This existing live region preserves its block layout and div ref contract; output introduces form-associated semantics.
        role="status"
        className="text-sm text-muted-foreground"
      >
        {resolveKiraKanbanChoice3({ loading, error, filtered })}
      </p>
      {error && onRetry && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={loading}
          onClick={onRetry}
        >
          Retry loading
        </Button>
      )}
      {loading && !(props.columns ?? props.defaultColumns)?.length && (
        <div
          data-slot="kira-kanban-loading"
          className="flex gap-4 overflow-hidden"
          aria-hidden="true"
        >
          {[0, 1, 2].map((key) => (
            <Skeleton
              key={key}
              animated={false}
              className="h-48 w-64 shrink-0"
            />
          ))}
        </div>
      )}
      {buildBoard()}
    </div>
  );
}

// SAFETY: Immutable fallback tokens preserve the component's public default values.
const KIRA_KANBAN_DEFAULTS_1 = {
  title: "Work board",
  searchable: true,
  blockedFilter: true,
  loading: false,
} as const;

// SAFETY: Immutable fallback tokens preserve the component's public default values.
const USE_KANBAN_SETUP_DEFAULTS_2 = {
  defaultColumns: [],
  variant: "default",
  columnSize: "default",
  enableKeyboard: true,
  disabled: false,
  readOnly: false,
  wipMode: "warn",
} as const;

// SAFETY: This immutable list names the composition props removed from the native root.
const USE_KANBAN_SETUP_COMPOSITION_KEYS_1 = [
  "columns",
  "defaultColumns",
  "onColumnsChange",
  "variant",
  "columnSize",
  "enableKeyboard",
  "disabled",
  "readOnly",
  "disabledReason",
  "onCardClick",
  "onCardAdd",
  "wipMode",
  "canMove",
  "onCardMove",
  "cardFilter",
  "announcements",
  "children",
  "className",
  "ref",
] as const;

type isKanbanColumnOverLimitArgs = {
  maximum: number | undefined;
  count: number;
};

function isKanbanColumnOverLimit({
  maximum,
  count,
}: isKanbanColumnOverLimitArgs) {
  return (
    maximum !== undefined &&
    Number.isFinite(maximum) &&
    count > Math.max(0, Math.floor(maximum))
  );
}

type renderKanbanColumnViewArgs = {
  props: Omit<
    KanbanColumnProps,
    | "id"
    | "title"
    | "data"
    | "color"
    | "limit"
    | "collapsed"
    | "onCollapsedChange"
    | "children"
    | "className"
    | "ref"
  >;
  isCollapsed: boolean;
  setLocalCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  onCollapsedChange: KanbanColumnProps["onCollapsedChange"];
  collapsed: KanbanColumnProps["collapsed"];
  column: KanbanColumnData | undefined;
  context: KanbanContextValue;
  id: KanbanColumnProps["id"];
  setNodeRef: (element: HTMLElement | null) => void;
  ref: KanbanColumnProps["ref"];
  overLimit: boolean;
  title: KanbanColumnProps["title"];
  count: number;
  isOver: boolean;
  className: KanbanColumnProps["className"];
  bodyId: string;
  setDisclosureMotion: React.Dispatch<React.SetStateAction<boolean>>;
  reduced: boolean;
  disclosureMotion: boolean;
  color: KanbanColumnProps["color"];
  maximum: number | undefined;
  children: KanbanColumnProps["children"];
  visibleCount: number;
};

// oxlint-disable-next-line eslint/max-lines-per-function -- Pure compound JSX view: keeping related labels, controls, and conditional styling together makes the markup easier to review than further fragment extraction.
function KanbanColumnView({
  props,
  isCollapsed,
  setLocalCollapsed,
  onCollapsedChange,
  collapsed,
  column,
  context,
  id,
  setNodeRef,
  ref,
  overLimit,
  title,
  count,
  isOver,
  className,
  bodyId,
  setDisclosureMotion,
  reduced,
  disclosureMotion,
  color,
  maximum,
  children,
  visibleCount,
}: renderKanbanColumnViewArgs) {
  return (
    <CollapsiblePrimitive.Root
      {...props}
      open={!isCollapsed}
      onOpenChange={(open) => {
        const next = !open;
        setLocalCollapsed(next);
        onCollapsedChange?.(next);

        if (collapsed === undefined && column?.collapsed !== undefined)
          context.setColumns((current) =>
            current.map((item) =>
              item.id === id ? { ...item, collapsed: next } : item,
            ),
          );
      }}
      ref={(node) => {
        setNodeRef(node);

        if (isFunctionProp(ref)) return ref(node);

        if (ref) ref.current = node;
      }}
      data-slot="kanban-column"
      data-column-id={id}
      data-over-limit={overLimit || undefined}
      role={props.role ?? "group"}
      aria-label={props["aria-label"] ?? title + ", " + count + " cards"}
      className={cn(
        kanbanColumnVariants({ size: context.columnSize }),
        isOver && "ring-2 ring-primary",
        className,
      )}
    >
      {renderKanbanColumnHeaderPart1({
        isCollapsed,
        title,
        bodyId,
        setDisclosureMotion,
        reduced,
        disclosureMotion,
        color,
        column,
        overLimit,
        count,
        maximum,
      })}
      {overLimit && (
        <p
          data-slot="kanban-column-limit"
          className="mb-2 text-xs text-destructive"
        >
          Over capacity by {count - Math.max(0, Math.floor(maximum!))}. Move
          work out before adding more.
        </p>
      )}
      {renderKanbanColumnBodyPart2({
        bodyId,
        reduced,
        disclosureMotion,
        column,
        title,
        children,
        id,
        visibleCount,
        count,
        context,
      })}
    </CollapsiblePrimitive.Root>
  );
}

type renderKanbanCardViewArgs = {
  props: Omit<
    KanbanCardProps,
    | "id"
    | "columnId"
    | "data"
    | "priority"
    | "children"
    | "className"
    | "style"
    | "ref"
  >;
  dragHandlers: React.HTMLAttributes<HTMLDivElement>;
  setNodeRef: (node: HTMLElement | null) => void;
  setActivatorNodeRef: (element: HTMLElement | null) => void;
  ref: KanbanCardProps["ref"];
  id: KanbanCardProps["id"];
  keyboardDraggable: boolean;
  draggable: boolean;
  attributes: ReturnType<typeof useSortable>["attributes"];
  visible: boolean;
  isDragging: boolean;
  context: KanbanContextValue;
  card: KanbanCardData;
  style: KanbanCardProps["style"];
  transform: ReturnType<typeof useSortable>["transform"];
  reduced: boolean;
  transition: string | undefined;
  priority: KanbanCardProps["priority"];
  className: KanbanCardProps["className"];
  columnId: KanbanCardProps["columnId"];
  children: KanbanCardProps["children"];
};

// oxlint-disable-next-line eslint/complexity -- Pure compound JSX view: keeping related labels, controls, and conditional styling together makes the markup easier to review than further fragment extraction.
function KanbanCardView({
  props,
  dragHandlers,
  setNodeRef,
  setActivatorNodeRef,
  ref,
  id,
  keyboardDraggable,
  draggable,
  attributes,
  visible,
  isDragging,
  context,
  card,
  style,
  transform,
  reduced,
  transition,
  priority,
  className,
  columnId,
  children,
}: renderKanbanCardViewArgs) {
  return (
    <div
      {...mergeProps(props, dragHandlers)}
      ref={(node) => {
        setNodeRef(node);
        setActivatorNodeRef(node);

        if (isFunctionProp(ref)) return ref(node);

        if (ref) ref.current = node;
      }}
      data-slot="kanban-card"
      data-card-id={id}

      // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role -- This positioned or sortable div retains its public ref and layout while participating in an ARIA list.
      role="listitem"
      tabIndex={props.tabIndex ?? (keyboardDraggable ? 0 : undefined)}
      aria-roledescription={draggable ? "draggable card" : undefined}
      aria-describedby={
        [
          props["aria-describedby"],
          keyboardDraggable ? attributes["aria-describedby"] : undefined,
        ]
          .filter(Boolean)
          .join(" ") || undefined
      }
      hidden={!visible}
      data-dragging={isDragging || undefined}
      data-interactive={(!context.disabled && !context.readOnly) || undefined}
      data-blocked={!!card.blockedReason || undefined}
      style={{
        ...style,
        transform: CSS.Transform.toString(transform),
        // Sortable's inline transform transition must not suppress hover feedback.
        transition: reduced
          ? "none"
          : [
              !context.keyboardDragging && transition,
              "translate 150ms ease",
              "opacity 150ms ease",
            ]
              .filter(Boolean)
              .join(", "),
      }}
      className={cn(
        kanbanCardVariants({ priority: card.priority ?? priority }),
        "group/kanban-card outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 motion-safe:[@media(hover:hover)_and_(pointer:fine)]:data-interactive:hover:-translate-y-0.5 data-dragging:translate-y-0",
        draggable &&
          "touch-auto cursor-grab select-none active:cursor-grabbing",
        isDragging && "opacity-35",
        className,
      )}
    >
      <span
        data-slot="kanban-card-elevation"
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 shadow-md transition-opacity duration-150 [@media(hover:hover)_and_(pointer:fine)]:group-data-interactive/kanban-card:group-hover/kanban-card:opacity-100 group-data-dragging/kanban-card:opacity-0 motion-reduce:transition-none"
      />
      {renderKanbanCardSectionPart7({ card, context, columnId, id, children })}
    </div>
  );
}

type renderKanbanMoveFormViewArgs = {
  onMove: {
    card: KanbanCardData;
    source: KanbanColumnData;
    columns: KanbanColumnData[];
    onMove: KanbanContextValue["moveCard"];
    onClose: () => void;
  }["onMove"];
  card: {
    card: KanbanCardData;
    source: KanbanColumnData;
    columns: KanbanColumnData[];
    onMove: KanbanContextValue["moveCard"];
    onClose: () => void;
  }["card"];
  source: {
    card: KanbanCardData;
    source: KanbanColumnData;
    columns: KanbanColumnData[];
    onMove: KanbanContextValue["moveCard"];
    onClose: () => void;
  }["source"];
  targetId: string;
  position: string;
  count: number;
  onClose: {
    card: KanbanCardData;
    source: KanbanColumnData;
    columns: KanbanColumnData[];
    onMove: KanbanContextValue["moveCard"];
    onClose: () => void;
  }["onClose"];
  columnId: string;
  setTargetId: React.Dispatch<React.SetStateAction<string>>;
  setPosition: React.Dispatch<React.SetStateAction<string>>;
  columns: {
    card: KanbanCardData;
    source: KanbanColumnData;
    columns: KanbanColumnData[];
    onMove: KanbanContextValue["moveCard"];
    onClose: () => void;
  }["columns"];
  positionId: string;
  reason: string | undefined;
  reasonId: string;
  target: KanbanColumnData | undefined;
};

// oxlint-disable-next-line eslint/max-lines-per-function -- Pure compound JSX view: keeping related labels, controls, and conditional styling together makes the markup easier to review than further fragment extraction.
function renderKanbanMoveFormView({
  onMove,
  card,
  source,
  targetId,
  position,
  count,
  onClose,
  columnId,
  setTargetId,
  setPosition,
  columns,
  positionId,
  reason,
  reasonId,
  target,
}: renderKanbanMoveFormViewArgs) {
  return (
    <form
      data-slot="kanban-move-form"
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault();

        if (
          onMove(
            card.id,
            source.id,
            targetId,
            Math.min(Number(position), count),
          )
        )
          onClose();
      }}
    >
      <DialogHeader>
        <DialogTitle>Move card</DialogTitle>
        <DialogDescription>{card.title || "Untitled card"}</DialogDescription>
      </DialogHeader>
      <div data-slot="kanban-move-destination" className="space-y-2">
        <label htmlFor={columnId} className="text-sm font-medium">
          Destination column
        </label>
        <KiraSelect
          id={columnId}
          value={targetId}
          onChange={(value) => {
            setTargetId(String(value));
            setPosition("0");
          }}
          options={columns.map((column) => ({
            value: column.id,
            label: column.title,
          }))}
        />
      </div>
      <div data-slot="kanban-move-position" className="space-y-2">
        <label htmlFor={positionId} className="text-sm font-medium">
          Position
        </label>
        <KiraSelect
          id={positionId}
          value={String(Math.min(Number(position), count))}
          onChange={(value) => setPosition(String(value))}
          options={Array.from({ length: count + 1 }, (_, index) => ({
            value: String(index),
            label: "Position " + (index + 1),
          }))}
        />
      </div>
      {reason && (
        <p
          id={reasonId}
          data-slot="kanban-move-reason"
          className="text-sm text-destructive"
        >
          {reason}
        </p>
      )}
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={!target || !!reason}
          aria-describedby={reason ? reasonId : undefined}
        >
          Move card
        </Button>
      </DialogFooter>
    </form>
  );
}
