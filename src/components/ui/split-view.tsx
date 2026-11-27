"use client";

import * as React from "react";
import {
  omitComponentProps,
  resolveComponentDefaults,
  withOccurrenceKeys,
} from "@/lib/component-utils";
import { IconChevronDown, IconChevronUp } from "@tabler/icons-react";
import { cva } from "class-variance-authority";
import { useDefaultLayout } from "react-resizable-panels";

import { Button } from "@/components/ui/button";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
  usePanelRef,
} from "@/components/ui/resizable";
import {
  createValidatedLayoutStorage,
  unsavedLayoutStorage,
} from "@/lib/layout-storage";
import { cn } from "cn";
import { Skeleton } from "@/components/ui/skeleton";

type Orientation = "horizontal" | "vertical";

const splitViewVariants = cva(
  "flex size-full min-h-0 min-w-0 flex-col overflow-hidden",
  {
    variants: { variant: { default: "", bordered: "rounded-lg border" } },
    defaultVariants: { variant: "default" },
  },
);

interface SplitViewProps extends Omit<
  React.ComponentProps<typeof ResizablePanelGroup>,
  "orientation" | "children" | "className"
> {
  orientation?: Orientation;
  variant?: "default" | "bordered";
  defaultSize?: number;
  minSize?: number;
  maxSize?: number;
  mainMinSize?: number;
  collapsible?: boolean;
  collapsedSize?: number;
  defaultCollapsed?: boolean;
  sidebarContent: React.ReactNode;
  mainContent: React.ReactNode;
  showToggle?: boolean;
  showResizeControls?: boolean;
  sidebarLabel?: string;
  mainLabel?: string;
  onCollapsedChange?: (collapsed: boolean) => void;
  onSidebarSizeChange?: (percentage: number) => void;
  /** Presentation only; both pane contents remain mounted. */
  pane?: "split" | "sidebar" | "main";
  disabledReason?: string;
  className?: string;
}

interface SplitViewRef {
  toggleSidebar: () => void;
  expandSidebar: () => void;
  collapseSidebar: () => void;
  resizeSidebar: (percentage: number) => void;
  getSidebarSize: () => number | undefined;
}

function percentage(value: number, fallback: number) {
  return Number.isFinite(value) ? Math.max(0, Math.min(100, value)) : fallback;
}

const splitLayoutStorage = createValidatedLayoutStorage({ expectedPanels: 2 });

const SplitView = React.forwardRef<SplitViewRef, SplitViewProps>(
  function SplitView(input0, input1) {
    const state0 = useSplitViewSetup(input0, input1);
    const state1 = useSplitViewState2(state0);
    const state2 = useSplitViewActions(state1);

    return renderSplitView(state2);
  },
);

interface SplitViewPreset {
  label: string;
  size: number;
}

interface KiraSplitViewProps extends Omit<SplitViewProps, "pane"> {
  responsive?: boolean;
  activePane?: "sidebar" | "main";
  defaultActivePane?: "sidebar" | "main";
  onActivePaneChange?: (pane: "sidebar" | "main") => void;
  presets?: SplitViewPreset[];
  loading?: boolean;
  empty?: boolean;
  error?: string;
  onRetry?: () => void;
}

function KiraSplitView(
  input0: KiraSplitViewProps & { ref?: React.Ref<SplitViewRef> },
) {
  const state0 = useKiraSplitViewSetup(input0);
  const state1 = useKiraSplitViewActions(state0);

  return renderKiraSplitView(state1);
}

export { SplitView, KiraSplitView, splitViewVariants };

export type {
  SplitViewProps,
  SplitViewRef,
  SplitViewPreset,
  KiraSplitViewProps,
};

type resolvesplitviewtsxChoice1Args = {
  sidebarHidden: boolean;
  sidebarContentRef: React.RefObject<HTMLDivElement | null>;
  mainHidden: boolean;
  mainContentRef: React.RefObject<HTMLDivElement | null>;
};

function resolvesplitviewtsxChoice1({
  sidebarHidden,
  sidebarContentRef,
  mainHidden,
  mainContentRef,
}: resolvesplitviewtsxChoice1Args) {
  if (sidebarHidden) {
    return sidebarContentRef.current;
  }

  if (mainHidden) {
    return mainContentRef.current;
  }

  return null;
}

type resolvebuildDetailChoice2Args = {
  loading: renderKiraSplitViewDetailPart5Args["loading"];
  error: renderKiraSplitViewDetailPart5Args["error"];
};

function resolvebuildDetailChoice2({
  loading,
  error,
}: resolvebuildDetailChoice2Args) {
  if (loading) {
    return "Refreshing details; your draft stays available.";
  }

  if (error) {
    return error;
  }

  return "Choose an item from the queue to begin a review.";
}

type renderSplitviewtsxSectionPart1Args = {
  disabled: boolean;
  isCollapsed: boolean;
  panelRef: ReturnType<typeof usePanelRef>;
  minimum: number;
  initialSize: number;
  maximum: number;
};

function RenderSplitviewtsxSectionPart1({
  disabled,
  isCollapsed,
  panelRef,
  minimum,
  initialSize,
  maximum,
}: renderSplitviewtsxSectionPart1Args) {
  return (
    <>
      <Button
        data-slot="split-view-narrower"
        type="button"
        variant="ghost"
        size="sm"
        disabled={disabled || isCollapsed}
        onClick={() =>
          panelRef.current?.resize(
            Math.max(
              minimum,
              (panelRef.current?.getSize().asPercentage ?? initialSize) - 5,
            ) + "%",
          )
        }
      >
        Narrower
      </Button>
      <Button
        data-slot="split-view-wider"
        type="button"
        variant="ghost"
        size="sm"
        disabled={disabled || isCollapsed}
        onClick={() =>
          panelRef.current?.resize(
            Math.min(
              maximum,
              (panelRef.current?.getSize().asPercentage ?? initialSize) + 5,
            ) + "%",
          )
        }
      >
        Wider
      </Button>
    </>
  );
}

type renderSplitViewTogglePart2Args = {
  disabled: boolean;
  isCollapsed: boolean;
  sidebarLabel: string;
  contentId: string;
  toggle: () => void;
};

function RenderSplitViewTogglePart2({
  disabled,
  isCollapsed,
  sidebarLabel,
  contentId,
  toggle,
}: renderSplitViewTogglePart2Args) {
  return (
    <Button
      data-slot="split-view-toggle"
      type="button"
      variant="ghost"
      size="sm"
      disabled={disabled}
      aria-label={(isCollapsed ? "Show " : "Hide ") + sidebarLabel}
      aria-expanded={!isCollapsed}
      aria-controls={contentId}
      onClick={toggle}
    >
      {isCollapsed ? (
        <IconChevronDown aria-hidden="true" className="size-4" />
      ) : (
        <IconChevronUp aria-hidden="true" className="size-4" />
      )}
      {isCollapsed ? "Show sidebar" : "Hide sidebar"}
    </Button>
  );
}

type renderSplitViewSidebarPart3Args = {
  sidebarId: string;
  panelRef: ReturnType<typeof usePanelRef>;
  collapsible: boolean;
  collapseSize: number;
  defaultCollapsed: boolean;
  initialSize: number;
  minimum: number;
  maximum: number;
  pane: "main" | "split" | "sidebar";
  sidebarContentRef: React.RefObject<HTMLDivElement | null>;
  rootRef: React.RefObject<HTMLDivElement | null>;
  setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  setLastExpandedSize: React.Dispatch<React.SetStateAction<number>>;
  isCollapsed: boolean;
  onCollapsedChange: ((collapsed: boolean) => void) | undefined;
  onSidebarSizeChange: ((percentage: number) => void) | undefined;
  contentId: string;
  sidebarLabel: string;
  sidebarContent: React.ReactNode;
};

function renderSplitViewSidebarPart3({
  sidebarId,
  panelRef,
  collapsible,
  collapseSize,
  defaultCollapsed,
  initialSize,
  minimum,
  maximum,
  pane,
  sidebarContentRef,
  rootRef,
  setIsCollapsed,
  setLastExpandedSize,
  isCollapsed,
  onCollapsedChange,
  onSidebarSizeChange,
  contentId,
  sidebarLabel,
  sidebarContent,
}: renderSplitViewSidebarPart3Args) {
  return (
    <ResizablePanel
      data-slot="split-view-sidebar"
      id={sidebarId}
      panelRef={panelRef}
      collapsible={collapsible}
      collapsedSize={collapseSize + "%"}
      defaultSize={
        (defaultCollapsed && collapsible ? collapseSize : initialSize) + "%"
      }
      minSize={minimum + "%"}
      maxSize={maximum + "%"}
      onResize={(size) =>
        handleSplitSidebarResize({
          size: size.asPercentage,
          pane,
          collapsible,
          collapseSize,
          sidebarContentRef,
          rootRef,
          setIsCollapsed,
          isCollapsed,
          setLastExpandedSize,
          onCollapsedChange,
          onSidebarSizeChange,
        })
      }
    >
      <div
        ref={sidebarContentRef}
        tabIndex={-1}
        id={contentId}
        data-slot="split-view-sidebar-content"

        // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role -- The named region preserves the component's div root, layout, and public DOM ref contract.
        role="region"
        aria-label={sidebarLabel}
        inert={pane === "main" || (pane === "split" && isCollapsed)}
        aria-hidden={
          pane === "main" || (pane === "split" && isCollapsed) || undefined
        }
        className={cn(
          "h-full min-h-0 min-w-0 overflow-auto",
          pane === "split" && isCollapsed && "invisible",
        )}
      >
        {sidebarContent}
      </div>
    </ResizablePanel>
  );
}

function handleSplitSidebarResize({
  size,
  pane,
  collapsible,
  collapseSize,
  sidebarContentRef,
  rootRef,
  setIsCollapsed,
  isCollapsed,
  setLastExpandedSize,
  onCollapsedChange,
  onSidebarSizeChange,
}: {
  size: number;
  pane: "split" | "main" | "sidebar";
  collapsible: boolean;
  collapseSize: number;
  sidebarContentRef: React.RefObject<HTMLDivElement | null>;
  rootRef: React.RefObject<HTMLDivElement | null>;
  setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  isCollapsed: boolean;
  setLastExpandedSize: React.Dispatch<React.SetStateAction<number>>;
  onCollapsedChange?: (collapsed: boolean) => void;
  onSidebarSizeChange?: (size: number) => void;
}) {
  if (pane !== "split") return;

  const next = shouldCollapseSplitSidebar(size, collapsible, collapseSize);

  if (next) focusSplitViewToggleIfNeeded(sidebarContentRef, rootRef);
  setIsCollapsed(next);

  if (!next) setLastExpandedSize(size);

  if (next !== isCollapsed) onCollapsedChange?.(next);
  onSidebarSizeChange?.(size);
}

function shouldCollapseSplitSidebar(
  size: number,
  collapsible: boolean,
  collapseSize: number,
) {
  return collapsible && size <= collapseSize + 0.01;
}

function focusSplitViewToggleIfNeeded(
  sidebarContentRef: React.RefObject<HTMLDivElement | null>,
  rootRef: React.RefObject<HTMLDivElement | null>,
) {
  if (!sidebarContentRef.current?.contains(document.activeElement)) return;

  const toggle = rootRef.current?.querySelector<HTMLElement>(
    '[data-slot="split-view-toggle"]',
  );

  (toggle ?? rootRef.current)?.focus();
}

type renderKiraSplitViewToolbarPart4Args = {
  singlePane: boolean;
  activePane: "main" | "sidebar";
  sidebarLabel: string;
  selectPane: (pane: "sidebar" | "main") => void;
  mainLabel: string;
  presets: SplitViewPreset[];
  props: Omit<
    KiraSplitViewProps & { ref?: React.Ref<SplitViewRef> },
    | "responsive"
    | "activePane"
    | "defaultActivePane"
    | "onActivePaneChange"
    | "presets"
    | "loading"
    | "empty"
    | "error"
    | "onRetry"
    | "ref"
    | "className"
    | "sidebarLabel"
    | "mainLabel"
    | "mainContent"
    | "onSidebarSizeChange"
  >;
  size: number;
  splitRef: React.RefObject<SplitViewRef | null>;
};

function renderKiraSplitViewToolbarPart4({
  singlePane,
  activePane,
  sidebarLabel,
  selectPane,
  mainLabel,
  presets,
  props,
  size,
  splitRef,
}: renderKiraSplitViewToolbarPart4Args) {
  return (
    <div
      data-slot="kira-split-view-toolbar"
      className="flex shrink-0 flex-wrap items-center gap-2 border-b p-2"
    >
      {singlePane ? (
        <>
          <Button
            type="button"
            size="sm"
            variant={activePane === "sidebar" ? "secondary" : "ghost"}
            aria-label={sidebarLabel}
            aria-pressed={activePane === "sidebar"}
            onClick={() => selectPane("sidebar")}
          >
            {activePane === "main" ? "Back to queue" : "Queue"}
          </Button>
          <Button
            type="button"
            size="sm"
            variant={activePane === "main" ? "secondary" : "ghost"}
            aria-label={mainLabel}
            aria-pressed={activePane === "main"}
            onClick={() => selectPane("main")}
          >
            Details
          </Button>
        </>
      ) : (
        withOccurrenceKeys(
          presets,
          (preset) => `${preset.label}:${preset.size}`,
        ).map(({ item: preset, key }) => (
          <Button
            key={key}
            type="button"
            size="sm"
            variant="ghost"
            disabled={props.disabled}
            aria-pressed={Math.abs(size - preset.size) < 0.5}
            onClick={() => splitRef.current?.resizeSidebar(preset.size)}
          >
            {preset.label}
          </Button>
        ))
      )}
    </div>
  );
}

type renderKiraSplitViewDetailPart5Args = {
  loading: boolean;
  error: (KiraSplitViewProps & { ref?: React.Ref<SplitViewRef> })["error"];
  empty: boolean;
  onRetry: (KiraSplitViewProps & { ref?: React.Ref<SplitViewRef> })["onRetry"];
  mainContent: (KiraSplitViewProps & {
    ref?: React.Ref<SplitViewRef>;
  })["mainContent"];
};

function renderKiraSplitViewDetailPart5({
  loading,
  error,
  empty,
  onRetry,
  mainContent,
}: renderKiraSplitViewDetailPart5Args) {
  return (
    <div
      data-slot="kira-split-view-detail"
      aria-busy={loading}
      className="flex min-h-full min-w-0 flex-col"
    >
      {(loading || error || empty) && (
        <div
          data-slot="kira-split-view-feedback"
          className="shrink-0 space-y-2 border-b p-3"
        >
          // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role -- This
          existing live region preserves its block layout and div ref contract;
          output introduces form-associated semantics. //
          oxlint-disable-next-line jsx-a11y/prefer-tag-over-role -- This
          existing live region preserves its block layout and div ref contract;
          output introduces form-associated semantics. //
          oxlint-disable-next-line jsx-a11y/prefer-tag-over-role -- This
          existing live region preserves its block layout and div ref contract;
          output introduces form-associated semantics. //
          oxlint-disable-next-line jsx-a11y/prefer-tag-over-role -- This
          existing live region preserves its block layout and div ref contract;
          output introduces form-associated semantics.
          <output className="text-sm text-muted-foreground" aria-live="polite">
            {resolvebuildDetailChoice2({ loading, error })}
          </output>
          {error && onRetry && (
            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={loading}
              onClick={onRetry}
            >
              Retry details
            </Button>
          )}
          {loading && empty && (
            <Skeleton animated={false} className="h-20 w-full" />
          )}
        </div>
      )}
      <div
        data-slot="kira-split-view-detail-content"
        className="min-h-0 min-w-0 flex-1"
      >
        {mainContent}
      </div>
    </div>
  );
}

type renderKiraSplitViewPart6Args = {
  wrapperRef: React.RefObject<HTMLDivElement | null>;
  singlePane: boolean;
  className: (KiraSplitViewProps & {
    ref?: React.Ref<SplitViewRef>;
  })["className"];
  buildControls: () => React.JSX.Element;
  props: Omit<
    KiraSplitViewProps & { ref?: React.Ref<SplitViewRef> },
    | "responsive"
    | "activePane"
    | "defaultActivePane"
    | "onActivePaneChange"
    | "presets"
    | "loading"
    | "empty"
    | "error"
    | "onRetry"
    | "ref"
    | "className"
    | "sidebarLabel"
    | "mainLabel"
    | "mainContent"
    | "onSidebarSizeChange"
  >;
  splitRef: React.RefObject<SplitViewRef | null>;
  sidebarLabel: string;
  mainLabel: string;
  activePane: "main" | "sidebar";
  buildDetail: () => React.JSX.Element;
  setSize: React.Dispatch<React.SetStateAction<number>>;
  onSidebarSizeChange: (KiraSplitViewProps & {
    ref?: React.Ref<SplitViewRef>;
  })["onSidebarSizeChange"];
};

function RenderKiraSplitViewPart6({
  wrapperRef,
  singlePane,
  className,
  buildControls,
  props,
  splitRef,
  sidebarLabel,
  mainLabel,
  activePane,
  buildDetail,
  setSize,
  onSidebarSizeChange,
}: renderKiraSplitViewPart6Args) {
  return (
    <div
      ref={wrapperRef}
      data-slot="kira-split-view"
      data-compact={singlePane || undefined}
      className={cn(
        "flex size-full min-h-0 min-w-0 flex-col overflow-hidden",
        className,
      )}
    >
      {buildControls()}
      <SplitView
        {...props}
        ref={splitRef}
        className="min-h-0 flex-1"
        sidebarLabel={sidebarLabel}
        mainLabel={mainLabel}
        pane={singlePane ? activePane : "split"}
        mainContent={buildDetail()}
        onSidebarSizeChange={(value) => {
          setSize(value);
          onSidebarSizeChange?.(value);
        }}
      />
    </div>
  );
}

// SAFETY: Immutable fallback tokens preserve the component's public default values.
const SPLIT_VIEW_TSX_DEFAULTS_1 = {
  orientation: "horizontal",
  variant: "default",
  defaultSize: 25,
  minSize: 10,
  maxSize: 75,
  mainMinSize: 10,
  collapsible: true,
  collapsedSize: 0,
  defaultCollapsed: false,
  showToggle: true,
  showResizeControls: true,
  sidebarLabel: "Sidebar",
  mainLabel: "Main content",
  pane: "split",
  disabled: false,
} as const;

function useSplitViewSetup(
  input: SplitViewProps,
  ref: React.ForwardedRef<SplitViewRef>,
) {
  const resolvedProps = resolveComponentDefaults(
    input,
    SPLIT_VIEW_TSX_DEFAULTS_1,
  );

  const { collapsible, defaultCollapsed } = resolvedProps;

  const props = omitComponentProps(resolvedProps, [
    "orientation",
    "variant",
    "defaultSize",
    "minSize",
    "maxSize",
    "mainMinSize",
    "collapsible",
    "collapsedSize",
    "defaultCollapsed",
    "sidebarContent",
    "mainContent",
    "showToggle",
    "showResizeControls",
    "sidebarLabel",
    "mainLabel",
    "onCollapsedChange",
    "onSidebarSizeChange",
    "pane",
    "disabled",
    "disabledReason",
    "autoSaveId",
    "className",
  ] as const);

  const instanceId = React.useId();

  const rootRef = React.useRef<HTMLDivElement>(null);

  const sidebarContentRef = React.useRef<HTMLDivElement>(null);

  const mainContentRef = React.useRef<HTMLDivElement>(null);

  const focusedPaneRef = React.useRef<HTMLElement | null>(null);

  const reasonId = instanceId + ":reason";

  const panelRef = usePanelRef();

  const [isCollapsed, setIsCollapsed] = React.useState(
    defaultCollapsed && collapsible,
  );

  return {
    ...resolvedProps,
    props,
    ref,
    instanceId,
    rootRef,
    sidebarContentRef,
    mainContentRef,
    focusedPaneRef,
    reasonId,
    panelRef,
    isCollapsed,
    setIsCollapsed,
  };
}

function useSplitViewState2(state: ReturnType<typeof useSplitViewSetup>) {
  const {
    autoSaveId,
    orientation,
    defaultSize,
    minSize,
    maxSize,
    mainMinSize,
    collapsible,
    collapsedSize,
    pane,
    disabled,
    instanceId,
    sidebarContentRef,
    mainContentRef,
    focusedPaneRef,
    panelRef,
    isCollapsed,
  } = state;

  const { mainMinimum, maximum, minimum, collapseSize, initialSize } =
    calculateSplitViewSizes({
      mainMinSize,
      maxSize,
      minSize,
      collapsedSize,
      defaultSize,
    });

  const [lastExpandedSize, setLastExpandedSize] = React.useState(initialSize);

  const { sidebarId, mainId, contentId } = getSplitViewContentIds(
    autoSaveId,
    instanceId,
  );

  const { saved, savedLayout, validSavedLayout } = useSplitViewStoredLayout({
    autoSaveId,
    instanceId,
    orientation,
    sidebarId,
    mainId,
  });

  const toggle = () =>
    toggleSplitViewSidebar({
      disabled,
      collapsible,
      pane,
      panelRef,
      lastExpandedSize,
    });

  useSplitViewFocusManagement({
    pane,
    isCollapsed,
    focusedPaneRef,
    sidebarContentRef,
    mainContentRef,
  });

  return {
    ...state,
    mainMinimum,
    maximum,
    minimum,
    collapseSize,
    initialSize,
    lastExpandedSize,
    setLastExpandedSize,
    sidebarId,
    mainId,
    contentId,
    saved,
    savedLayout,
    validSavedLayout,
    toggle,
  };
}

function getSplitViewContentIds(
  autoSaveId: string | undefined,
  instanceId: string,
) {
  return {
    sidebarId: (autoSaveId ?? instanceId) + ":sidebar",
    mainId: (autoSaveId ?? instanceId) + ":main",
    contentId: instanceId + ":sidebar-content",
  };
}

function useSplitViewFocusManagement({
  pane,
  isCollapsed,
  focusedPaneRef,
  sidebarContentRef,
  mainContentRef,
}: {
  pane: "split" | "main" | "sidebar";
  isCollapsed: boolean;
  focusedPaneRef: React.RefObject<HTMLElement | null>;
  sidebarContentRef: React.RefObject<HTMLDivElement | null>;
  mainContentRef: React.RefObject<HTMLDivElement | null>;
}) {
  React.useLayoutEffect(() => {
    const focused = focusedPaneRef.current;
    const sidebarHidden = pane === "main" || (pane === "split" && isCollapsed);

    const hiddenPane = resolvesplitviewtsxChoice1({
      sidebarHidden,
      sidebarContentRef,
      mainHidden: pane === "sidebar",
      mainContentRef,
    });

    if (!focused || !hiddenPane?.contains(focused)) return;

    // Browsers can reset activeElement to body when the focused pane becomes inert.
    if (
      document.activeElement !== focused &&
      document.activeElement !== document.body
    )
      return;

    const destination = sidebarHidden
      ? mainContentRef.current
      : sidebarContentRef.current;

    destination?.focus({ preventScroll: true });
  }, [pane, isCollapsed, focusedPaneRef, sidebarContentRef, mainContentRef]);
}

function toggleSplitViewSidebar({
  disabled,
  collapsible,
  pane,
  panelRef,
  lastExpandedSize,
}: {
  disabled: boolean;
  collapsible: boolean;
  pane: "split" | "main" | "sidebar";
  panelRef: ReturnType<typeof usePanelRef>;
  lastExpandedSize: number;
}) {
  if (disabled || !collapsible || pane !== "split") return;

  if (panelRef.current?.isCollapsed())
    panelRef.current.resize(lastExpandedSize + "%");
  else panelRef.current?.collapse();
}

function useSplitViewStoredLayout({
  autoSaveId,
  instanceId,
  orientation,
  sidebarId,
  mainId,
}: {
  autoSaveId?: string;
  instanceId: string;
  orientation: string;
  sidebarId: string;
  mainId: string;
}) {
  const saved = useDefaultLayout({
    id: `kira:split-view:${autoSaveId ?? instanceId}:${orientation}`,
    storage: autoSaveId ? splitLayoutStorage : unsavedLayoutStorage,
  });

  const savedLayout = saved.defaultLayout;

  const validSavedLayout = isValidSplitViewLayout(
    savedLayout,
    sidebarId,
    mainId,
  );

  return { saved, savedLayout, validSavedLayout };
}

function calculateSplitViewSizes({
  mainMinSize,
  maxSize,
  minSize,
  collapsedSize,
  defaultSize,
}: {
  mainMinSize: number;
  maxSize: number;
  minSize: number;
  collapsedSize: number;
  defaultSize: number;
}) {
  const mainMinimum = Math.min(90, percentage(mainMinSize, 10));

  const maximum = Math.max(
    1,
    Math.min(percentage(maxSize, 75), 100 - mainMinimum),
  );

  const minimum = Math.max(1, Math.min(percentage(minSize, 10), maximum));
  const collapseSize = Math.min(percentage(collapsedSize, 0), minimum - 0.1);

  const initialSize = Math.max(
    minimum,
    Math.min(maximum, percentage(defaultSize, 25)),
  );

  return { mainMinimum, maximum, minimum, collapseSize, initialSize };
}

function isValidSplitViewLayout(
  layout: Record<string, number> | undefined,
  sidebarId: string,
  mainId: string,
) {
  return (
    layout &&
    Object.keys(layout).length === 2 &&
    Number.isFinite(layout[sidebarId]) &&
    Number.isFinite(layout[mainId])
  );
}

function useSplitViewActions(state: ReturnType<typeof useSplitViewState2>) {
  const {
    ref,
    collapsible,
    pane,
    disabled,
    panelRef,
    maximum,
    minimum,
    initialSize,
    lastExpandedSize,
    toggle,
  } = state;

  React.useImperativeHandle(ref, () => ({
    toggleSidebar: toggle,
    expandSidebar: () => {
      if (!disabled && collapsible && pane === "split")
        panelRef.current?.resize(lastExpandedSize + "%");
    },
    collapseSidebar: () => {
      if (!disabled && collapsible && pane === "split")
        panelRef.current?.collapse();
    },
    resizeSidebar: (value) => {
      if (!disabled && pane === "split")
        panelRef.current?.resize(
          Math.max(minimum, Math.min(maximum, percentage(value, initialSize))) +
            "%",
        );
    },
    getSidebarSize: () => panelRef.current?.getSize().asPercentage,
  }));

  return { ...state };
}

// oxlint-disable-next-line eslint/max-lines-per-function, eslint/complexity -- Pure compound JSX view: keeping related labels, controls, and conditional styling together makes the markup easier to review than further fragment extraction.
function renderSplitView({
  sidebarContent,
  mainContent,
  onCollapsedChange,
  onSidebarSizeChange,
  disabledReason,
  className,
  props,
  orientation,
  variant,
  collapsible,
  defaultCollapsed,
  showToggle,
  showResizeControls,
  sidebarLabel,
  mainLabel,
  pane,
  disabled,
  rootRef,
  sidebarContentRef,
  mainContentRef,
  focusedPaneRef,
  reasonId,
  panelRef,
  isCollapsed,
  setIsCollapsed,
  mainMinimum,
  maximum,
  minimum,
  collapseSize,
  initialSize,
  setLastExpandedSize,
  sidebarId,
  mainId,
  contentId,
  saved,
  savedLayout,
  validSavedLayout,
  toggle,
}: ReturnType<typeof useSplitViewActions>) {
  return (
    <div
      ref={rootRef}
      onFocusCapture={(event) => {
        focusedPaneRef.current = event.target;
      }}
      tabIndex={-1}
      data-slot="split-view"
      data-orientation={orientation}
      data-collapsed={isCollapsed || undefined}
      data-disabled={disabled || undefined}
      aria-describedby={disabledReason ? reasonId : undefined}
      className={cn(splitViewVariants({ variant }), className)}
    >
      {(showResizeControls || (showToggle && collapsible)) &&
        pane === "split" && (
          <div
            data-slot="split-view-toolbar"
            className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-b px-3 py-2"
          >
            <span
              data-slot="split-view-label"
              className="min-w-0 wrap-break-word text-sm font-medium"
            >
              {sidebarLabel}
            </span>
            <div
              data-slot="split-view-actions"
              className="flex flex-wrap gap-1"
            >
              {showResizeControls && (
                <RenderSplitviewtsxSectionPart1
                  {...{
                    disabled,
                    isCollapsed,
                    panelRef,
                    minimum,
                    initialSize,
                    maximum,
                  }}
                />
              )}
              {showToggle && collapsible && (
                <RenderSplitViewTogglePart2
                  {...{
                    disabled,
                    isCollapsed,
                    sidebarLabel,
                    contentId,
                    toggle,
                  }}
                />
              )}
            </div>
          </div>
        )}
      {disabledReason && (
        <p
          id={reasonId}
          data-slot="split-view-disabled-reason"
          className="border-b px-3 py-2 text-sm text-muted-foreground"
        >
          {disabledReason}
        </p>
      )}
      <ResizablePanelGroup
        {...props}
        data-slot="split-view-group"
        data-pane={pane}
        orientation={orientation}
        disabled={disabled || pane !== "split"}
        onLayoutChange={(layout) => {
          if (pane === "split") props.onLayoutChange?.(layout);
        }}
        onLayoutChanged={(layout, meta) => {
          if (pane === "split") {
            saved.onLayoutChanged(layout, meta);
            props.onLayoutChanged?.(layout, meta);
          }
        }}
        className={cn(
          "min-h-0 flex-1",
          pane !== "split" &&
            "*:data-panel:basis-full! *:data-panel:grow! *:data-panel:shrink-0! *:data-[slot=split-view-handle]:hidden!",
          pane === "main" && "*:data-[slot=split-view-sidebar]:hidden!",
          pane === "sidebar" && "*:data-[slot=split-view-main]:hidden!",
        )}
        defaultLayout={
          (validSavedLayout ? savedLayout : undefined) ??
          props.defaultLayout ?? {
            [sidebarId]:
              defaultCollapsed && collapsible ? collapseSize : initialSize,
            [mainId]:
              100 -
              (defaultCollapsed && collapsible ? collapseSize : initialSize),
          }
        }
      >
        {renderSplitViewSidebarPart3({
          sidebarId,
          panelRef,
          collapsible,
          collapseSize,
          defaultCollapsed,
          initialSize,
          minimum,
          maximum,
          pane,
          sidebarContentRef,
          rootRef,
          setIsCollapsed,
          setLastExpandedSize,
          isCollapsed,
          onCollapsedChange,
          onSidebarSizeChange,
          contentId,
          sidebarLabel,
          sidebarContent,
        })}
        <ResizableHandle
          data-slot="split-view-handle"
          aria-label={"Resize " + sidebarLabel}
        />
        <ResizablePanel
          data-slot="split-view-main"
          id={mainId}
          minSize={mainMinimum + "%"}
        >
          <div
            ref={mainContentRef}
            tabIndex={-1}
            data-slot="split-view-main-content"

            // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role -- The named region preserves the component's div root, layout, and public DOM ref contract.
            role="region"
            aria-label={mainLabel}
            inert={pane === "sidebar"}
            aria-hidden={pane === "sidebar" || undefined}
            className="h-full min-h-0 min-w-0 overflow-auto"
          >
            {mainContent}
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}

function useKiraSplitViewSetup(
  input: KiraSplitViewProps & { ref?: React.Ref<SplitViewRef> },
) {
  const {
    responsive,
    activePane: controlledPane,
    defaultActivePane,
    onActivePaneChange,
    presets,
    loading,
    empty,
    error,
    onRetry,
    ref,
    className,
    sidebarLabel,
    mainLabel,
    mainContent,
    onSidebarSizeChange,
    ...props
  } = resolveComponentDefaults(input, {
    responsive: true,
    defaultActivePane: "sidebar",
    presets: [
      { label: "Narrow list", size: 25 },
      { label: "Balanced", size: 50 },
      { label: "Wide list", size: 65 },
    ],
    loading: false,
    empty: false,
    sidebarLabel: "Work queue",
    mainLabel: "Review details",
  });

  const [localPane, setLocalPane] = React.useState(defaultActivePane);

  const activePane = controlledPane ?? localPane;

  const [size, setSize] = React.useState(props.defaultSize ?? 25);

  const splitRef = React.useRef<SplitViewRef>(null);

  const wrapperRef = React.useRef<HTMLDivElement>(null);

  const [compact, setCompact] = React.useState(false);

  React.useEffect(() => {
    const element = wrapperRef.current;

    if (!element) return;

    const observer = new ResizeObserver(([entry]) => {
      if (entry && entry.contentRect.width > 0)
        setCompact(entry.contentRect.width < 640);
    });

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return {
    responsive,
    controlledPane,
    onActivePaneChange,
    presets,
    loading,
    empty,
    error,
    onRetry,
    ref,
    className,
    sidebarLabel,
    mainLabel,
    mainContent,
    onSidebarSizeChange,
    props,
    setLocalPane,
    activePane,
    size,
    setSize,
    splitRef,
    wrapperRef,
    compact,
  };
}

function useKiraSplitViewActions(
  state: ReturnType<typeof useKiraSplitViewSetup>,
) {
  const {
    responsive,
    controlledPane,
    onActivePaneChange,
    presets,
    loading,
    empty,
    error,
    onRetry,
    ref,
    sidebarLabel,
    mainLabel,
    mainContent,
    props,
    setLocalPane,
    activePane,
    size,
    splitRef,
    compact,
  } = state;

  React.useImperativeHandle(ref, () => ({
    toggleSidebar: () => splitRef.current?.toggleSidebar(),
    expandSidebar: () => splitRef.current?.expandSidebar(),
    collapseSidebar: () => splitRef.current?.collapseSidebar(),
    resizeSidebar: (value) => splitRef.current?.resizeSidebar(value),
    getSidebarSize: () => splitRef.current?.getSidebarSize(),
  }));

  const selectPane = (pane: "sidebar" | "main") => {
    if (controlledPane === undefined) setLocalPane(pane);
    onActivePaneChange?.(pane);
  };

  const singlePane = responsive && compact;

  const buildControls = () =>
    renderKiraSplitViewToolbarPart4({
      singlePane,
      activePane,
      sidebarLabel,
      selectPane,
      mainLabel,
      presets,
      props,
      size,
      splitRef,
    });

  const buildDetail = () =>
    renderKiraSplitViewDetailPart5({
      loading,
      error,
      empty,
      onRetry,
      mainContent,
    });

  return { ...state, singlePane, buildControls, buildDetail };
}

function renderKiraSplitView({
  className,
  sidebarLabel,
  mainLabel,
  onSidebarSizeChange,
  props,
  activePane,
  setSize,
  splitRef,
  wrapperRef,
  singlePane,
  buildControls,
  buildDetail,
}: ReturnType<typeof useKiraSplitViewActions>) {
  return (
    <RenderKiraSplitViewPart6
      {...{
        wrapperRef,
        singlePane,
        className,
        buildControls,
        props,
        splitRef,
        sidebarLabel,
        mainLabel,
        activePane,
        buildDetail,
        setSize,
        onSidebarSizeChange,
      }}
    />
  );
}
