"use client";

import * as React from "react";
import { IconGripVertical } from "@tabler/icons-react";
import { cva, type VariantProps } from "class-variance-authority";
import {
  Group,
  Panel,
  Separator,
  useDefaultLayout,
  usePanelRef,
  useGroupRef,
  type GroupProps,
  type PanelProps,
  type SeparatorProps,
  type GroupImperativeHandle,
  type PanelImperativeHandle,
  type Layout,
  type LayoutChangedMeta,
  type LayoutStorage,
  type PanelSize,
} from "react-resizable-panels";

import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { Button } from "@/components/ui/button";
import { createValidatedLayoutStorage } from "@/lib/layout-storage";
import { cn } from "cn";

type Orientation = "horizontal" | "vertical";

type ResizablePanelRef = PanelImperativeHandle;

type ResizablePanelGroupRef = GroupImperativeHandle;

type ResizablePanelProps = PanelProps;

interface ResizablePanelGroupProps extends GroupProps {
  /** Save the layout between mounts. Use stable, unique panel IDs. */
  autoSaveId?: string;
}

interface ResizableContextValue {
  orientation: Orientation;
  disabled: boolean;
}

const ResizableContext = React.createContext<ResizableContextValue>({
  orientation: "horizontal",
  disabled: false,
});

const layoutStorage = createValidatedLayoutStorage();

function ResizableGroup({
  className,
  orientation = "horizontal",
  disabled = false,
  resizeTargetMinimumSize = { coarse: 44, fine: 24 },
  ...props
}: GroupProps) {
  return (
    <ResizableContext.Provider value={{ orientation, disabled }}>
      <Group
        data-slot="resizable-panel-group"
        data-orientation={orientation}
        orientation={orientation}
        disabled={disabled}
        resizeTargetMinimumSize={resizeTargetMinimumSize}
        className={cn("flex size-full min-h-0 min-w-0", className)}
        {...props}
      />
    </ResizableContext.Provider>
  );
}

function PersistedResizableGroup({
  autoSaveId,
  defaultLayout,
  onLayoutChanged,
  ...props
}: GroupProps & { autoSaveId: string }) {
  const saved = useDefaultLayout({
    id: autoSaveId,
    storage: layoutStorage,
  });

  const savedLayout = saved.defaultLayout;

  const matchesDefaults =
    !defaultLayout ||
    (savedLayout &&
      Object.keys(defaultLayout).length === Object.keys(savedLayout).length &&
      Object.keys(defaultLayout).every((id) =>
        Number.isFinite(savedLayout[id]),
      ));

  return (
    <ResizableGroup
      {...props}
      defaultLayout={
        (matchesDefaults ? savedLayout : undefined) ?? defaultLayout
      }
      onLayoutChanged={(layout, meta) => {
        saved.onLayoutChanged(layout, meta);
        onLayoutChanged?.(layout, meta);
      }}
    />
  );
}

function ResizablePanelGroup({
  autoSaveId,
  ...props
}: ResizablePanelGroupProps) {
  return autoSaveId ? (
    <PersistedResizableGroup
      key={autoSaveId + ":" + (props.orientation ?? "horizontal")}
      autoSaveId={
        "kira:" + autoSaveId + ":" + (props.orientation ?? "horizontal")
      }
      {...props}
    />
  ) : (
    <ResizableGroup {...props} />
  );
}

function ResizablePanel({ className, ...props }: ResizablePanelProps) {
  return (
    <Panel
      data-slot="resizable-panel"
      className={cn("min-h-0 min-w-0", className)}
      {...props}
    />
  );
}

const resizableHandleVariants = cva(
  "relative z-10 flex shrink-0 items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset data-[separator=disabled]:cursor-default data-[separator=disabled]:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-border data-[separator=hover]:bg-primary/50 data-[separator=active]:bg-primary/70",
        subtle:
          "bg-transparent data-[separator=hover]:bg-muted data-[separator=active]:bg-muted-foreground/30",
        prominent:
          "bg-muted data-[separator=hover]:bg-primary/30 data-[separator=active]:bg-primary/50",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

interface ResizableHandleProps
  extends SeparatorProps, VariantProps<typeof resizableHandleVariants> {
  withHandle?: boolean;
}

function ResizableHandle({
  withHandle = true,
  className,
  variant,
  children,
  disabled,
  "aria-label": ariaLabel,
  ...props
}: ResizableHandleProps) {
  const context = React.useContext(ResizableContext);
  const reduced = useReducedMotion();
  const vertical = context.orientation === "vertical";

  return (
    // kira-kit-ignore spacing-scale: 6px resize handle/grip is an optical hit-area metric
    <Separator
      data-slot="resizable-handle"
      aria-label={
        ariaLabel ??
        (vertical ? "Resize panels vertically" : "Resize panels horizontally")
      }
      disabled={context.disabled || disabled}
      className={cn(
        resizableHandleVariants({ variant }),
        vertical ? "h-1.5 w-full" : "h-full w-1.5",
        { "transition-colors duration-150": !reduced },
        className,
      )}
      {...props}
    >
      {children ??
        (withHandle && (
          <span
            data-slot="resizable-handle-grip"
            aria-hidden="true"
            className={cn(
              "pointer-events-none flex items-center justify-center rounded-sm border bg-background text-muted-foreground",
              vertical ? "h-3 w-4" : "h-4 w-3",
            )}
          >
            {/* kira-kit-ignore spacing-scale: 6px resize handle/grip is an optical hit-area metric */}
            <IconGripVertical
              data-slot="resizable-handle-icon"
              className={cn("size-2.5", { "rotate-90": vertical })}
            />
          </span>
        ))}
    </Separator>
  );
}

interface CollapsiblePanelProps extends ResizablePanelProps {
  id: string;
}

function CollapsiblePanel({
  collapsible: collapsibleInput,
  collapsedSize: collapsedSizeInput,
  defaultSize: defaultSizeInput,
  minSize: minSizeInput,
  ...props
}: CollapsiblePanelProps) {
  const { collapsible, collapsedSize, defaultSize, minSize } =
    useCollapsiblePanelOptions({
      collapsible: collapsibleInput,
      collapsedSize: collapsedSizeInput,
      defaultSize: defaultSizeInput,
      minSize: minSizeInput,
    });

  return (
    <ResizablePanel
      collapsible={collapsible}
      collapsedSize={collapsedSize}
      defaultSize={defaultSize}
      minSize={minSize}
      {...props}
    />
  );
}

interface ResizablePanelDefinition extends Omit<
  PanelProps,
  "id" | "children" | "panelRef" | "content"
> {
  id: string;
  label: string;
  content: React.ReactNode;
  disabledReason?: string;
}

interface KiraResizableProps extends Omit<
  ResizablePanelGroupProps,
  "children"
> {
  panels: ResizablePanelDefinition[];
  controls?: boolean;
  disabledReason?: string;
  handleProps?: Omit<ResizableHandleProps, "children">;
  groupClassName?: string;
}

interface KiraPanelProps {
  panel: ResizablePanelDefinition;
  domId: string;
  collapsed: boolean;
  register: (id: string, api: PanelImperativeHandle | null) => void;
  onCollapsedChange: (id: string, collapsed: boolean) => void;
}

function KiraPanel({
  panel,
  domId,
  collapsed,
  register,
  onCollapsedChange,
}: KiraPanelProps) {
  const { id, label, content, onResize, disabledReason, ...props } = panel;
  const apiRef = usePanelRef();
  const contentRef = React.useRef<HTMLDivElement>(null);

  const attach = React.useCallback(
    (api: PanelImperativeHandle | null) => {
      apiRef.current = api;
      register(id, api);
    },
    [apiRef, id, register],
  );

  return (
    <ResizablePanel
      {...props}
      id={domId}
      aria-label={label}
      panelRef={attach}
      onResize={(size, _panelId, previous) => {
        const nextCollapsed = apiRef.current?.isCollapsed() ?? false;

        if (
          nextCollapsed &&
          contentRef.current?.contains(document.activeElement)
        ) {
          contentRef.current
            .closest('[data-slot="kira-resizable"]')
            ?.querySelector<HTMLElement>(
              '[data-slot="resizable-controls"] button:not(:disabled)',
            )
            ?.focus();
        }

        onCollapsedChange(id, nextCollapsed);
        onResize?.(size, id, previous);
      }}
    >
      <div
        ref={contentRef}
        data-slot="resizable-panel-content"
        className="h-full min-h-0 min-w-0"
        inert={collapsed || undefined}
        aria-hidden={collapsed || undefined}
      >
        {content}
        {props.disabled && (
          <p
            data-slot="resizable-panel-disabled-reason"
            className="p-3 text-xs text-muted-foreground"
          >
            {disabledReason ?? "This panel's size is locked."}
          </p>
        )}
      </div>
    </ResizablePanel>
  );
}

function KiraResizableLayout(arg0: KiraResizableProps) {
  const model = useKiraResizableLayoutModel(arg0);

  return <KiraResizableLayoutView {...model} />;
}

const transientLayoutStorage: LayoutStorage = {
  getItem: () => null,
  setItem: () => {},
};

function KiraResizable(props: KiraResizableProps) {
  return (
    <KiraResizableLayout
      key={JSON.stringify([
        props.autoSaveId ?? null,
        props.orientation ?? "horizontal",
      ])}
      {...props}
    />
  );
}

export {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
  CollapsiblePanel,
  KiraResizable,
  resizableHandleVariants,
  usePanelRef,
  useGroupRef,
};

export type {
  ResizablePanelGroupProps,
  ResizablePanelProps,
  ResizableHandleProps,
  CollapsiblePanelProps,
  ResizablePanelRef,
  ResizablePanelGroupRef,
  KiraResizableProps,
  ResizablePanelDefinition,
  Layout,
  PanelSize,
};

function resolveCollapsiblePanelOptions({
  collapsible = true,
  collapsedSize = "0%",
  defaultSize = "20%",
  minSize = "10%",
}: {
  collapsible?: CollapsiblePanelProps["collapsible"];
  collapsedSize?: CollapsiblePanelProps["collapsedSize"];
  defaultSize?: CollapsiblePanelProps["defaultSize"];
  minSize?: CollapsiblePanelProps["minSize"];
}) {
  return { collapsible, collapsedSize, defaultSize, minSize };
}

function useKiraResizableLayoutModel({
  panels,
  controls = true,
  disabled = false,
  disabledReason = "Layout is locked.",
  handleProps,
  className,
  groupClassName,
  groupRef,
  defaultLayout,
  onLayoutChange,
  onLayoutChanged,
  autoSaveId,
  ...props
}: KiraResizableProps) {
  const instanceId = React.useId();
  const api = useGroupRef();
  const panelApis = React.useRef(new Map<string, PanelImperativeHandle>());
  const [collapsed, setCollapsed] = React.useState<Record<string, boolean>>({});

  const register = React.useCallback(
    (id: string, handle: PanelImperativeHandle | null) => {
      if (handle) panelApis.current.set(id, handle);
      else panelApis.current.delete(id);
    },
    [],
  );

  const onCollapsedChange = React.useCallback((id: string, value: boolean) => {
    setCollapsed((current) =>
      current[id] === value ? current : { ...current, [id]: value },
    );
  }, []);

  const { toNativeLayout, fromNativeLayout, restoreLayout } =
    useResizableLayoutBridge(panels, instanceId, api, groupRef, defaultLayout);

  const saved = useDefaultLayout({
    id:
      "kira-workspace:" +
      (autoSaveId ?? instanceId) +
      ":" +
      (props.orientation ?? "horizontal"),
    storage: autoSaveId ? layoutStorage : transientLayoutStorage,
  });

  const savedLayout = saved.defaultLayout;

  const matchingSavedLayout =
    savedLayout &&
    Object.keys(savedLayout).length === panels.length &&
    panels.every((panel) => Number.isFinite(savedLayout[panel.id]))
      ? savedLayout
      : undefined;

  // oxlint-disable-next-line react/refs -- This JSX factory only closes panel refs for click handlers; it never reads their current values during render.
  const { buildControls, buildPanels } = createResizableContent({
    controls,
    panels,
    disabled,
    instanceId,
    collapsed,
    panelApis,
    restoreLayout,
    defaultLayout,
    disabledReason,
    handleProps,
    register,
    onCollapsedChange,
  });

  return {
    className,
    buildControls,
    panels,
    props,
    groupClassName,
    disabled,
    api,
    matchingSavedLayout,
    defaultLayout,
    toNativeLayout,
    onLayoutChange,
    fromNativeLayout,
    saved,
    onLayoutChanged,
    buildPanels,
  };
}

function useResizableLayoutBridge(
  panels: KiraResizableProps["panels"],
  instanceId: string,
  api: React.RefObject<GroupImperativeHandle | null>,
  groupRef: KiraResizableProps["groupRef"],
  defaultLayout: KiraResizableProps["defaultLayout"],
) {
  // Native panel IDs are globally unique; public and stored IDs remain stable.
  const toNativeLayout = (layout: Layout): Layout =>
    Object.fromEntries(
      panels.map((panel) => [instanceId + panel.id, layout[panel.id]]),
    );

  const fromNativeLayout = (layout: Layout): Layout =>
    Object.fromEntries(
      panels.map((panel) => [panel.id, layout[instanceId + panel.id]]),
    );

  React.useImperativeHandle(groupRef, () => ({
    getLayout: () => fromNativeLayout(api.current?.getLayout() ?? {}),
    setLayout: (layout) =>
      fromNativeLayout(api.current?.setLayout(toNativeLayout(layout)) ?? {}),
  }));

  const restoreLayout = () => {
    const balanced = Object.fromEntries(
      panels.map((panel) => [panel.id, 100 / panels.length]),
    );

    api.current?.setLayout(toNativeLayout(defaultLayout ?? balanced));
  };

  return { toNativeLayout, fromNativeLayout, restoreLayout };
}

function KiraResizableLayoutView({
  className,
  buildControls,
  panels,
  props,
  groupClassName,
  disabled,
  api,
  matchingSavedLayout,
  defaultLayout,
  toNativeLayout,
  onLayoutChange,
  fromNativeLayout,
  saved,
  onLayoutChanged,
  buildPanels,
}: ReturnType<typeof useKiraResizableLayoutModel>) {
  return (
    <div
      data-slot="kira-resizable"
      className={cn(
        "flex size-full min-h-0 min-w-0 flex-col overflow-hidden rounded-lg border",
        className,
      )}
    >
      {buildControls()}
      <div data-slot="resizable-layout" className="min-h-0 flex-1">
        {panels.length ? (
          <ResizablePanelGroup
            {...props}
            className={groupClassName}
            disabled={disabled}
            groupRef={api}
            defaultLayout={
              matchingSavedLayout || defaultLayout
                ? toNativeLayout(matchingSavedLayout ?? defaultLayout ?? {})
                : undefined
            }
            onLayoutChange={(layout) =>
              onLayoutChange?.(fromNativeLayout(layout))
            }
            onLayoutChanged={(layout, meta) =>
              resizableCallback(
                layout,
                meta,
                fromNativeLayout,
                saved,
                onLayoutChanged,
              )
            }
          >
            {buildPanels()}
          </ResizablePanelGroup>
        ) : (
          <p
            data-slot="resizable-empty"
            className="p-4 text-sm text-muted-foreground"
          >
            No panels to display.
          </p>
        )}
      </div>
    </div>
  );
}

function useCollapsiblePanelOptions({
  collapsible: collapsibleInput,
  collapsedSize: collapsedSizeInput,
  defaultSize: defaultSizeInput,
  minSize: minSizeInput,
}: Parameters<typeof resolveCollapsiblePanelOptions>[0]) {
  return React.useMemo(
    () =>
      resolveCollapsiblePanelOptions({
        collapsible: collapsibleInput,
        collapsedSize: collapsedSizeInput,
        defaultSize: defaultSizeInput,
        minSize: minSizeInput,
      }),
    [collapsibleInput, collapsedSizeInput, defaultSizeInput, minSizeInput],
  );
}

function resizableCallback(
  layout: Layout,
  meta: LayoutChangedMeta<Layout>,
  fromNativeLayout: (layout: Layout) => Layout,
  saved: {
    defaultLayout: Layout | undefined;
    onLayoutChange: (layout: Layout) => void | undefined;
    onLayoutChanged: (layout: Layout, meta: LayoutChangedMeta) => void;
  },
  onLayoutChanged:
    ((layout: Layout, meta: LayoutChangedMeta) => void) | undefined,
) {
  const publicLayout = fromNativeLayout(layout);

  const publicMeta = {
    ...meta,
    requestedLayout: meta.requestedLayout
      ? fromNativeLayout(meta.requestedLayout)
      : undefined,
  };

  saved.onLayoutChanged(publicLayout, publicMeta);
  onLayoutChanged?.(publicLayout, publicMeta);
}

function ResizableLayoutControls({
  controls,
  panels,
  disabled,
  instanceId,
  collapsed,
  panelApis,
  restoreLayout,
  defaultLayout,
  disabledReason,
}: CreateResizableContentParams) {
  return (
    controls && (
      <div
        data-slot="resizable-controls"
        className="flex shrink-0 flex-wrap items-center gap-2 border-b p-2"
      >
        {panels
          .filter((panel) => panel.collapsible)
          .map((panel) => (
            <Button
              key={panel.id}
              data-slot="resizable-panel-toggle"
              variant="ghost"
              size="sm"
              className="h-auto min-h-8 max-w-full"
              disabled={disabled || panel.disabled}
              aria-controls={instanceId + panel.id}
              aria-expanded={!collapsed[panel.id]}
              onClick={() => {
                const handle = panelApis.current.get(panel.id);

                if (handle?.isCollapsed()) handle.expand();
                else handle?.collapse();
              }}
            >
              <span className="min-w-0 whitespace-normal break-words">
                {collapsed[panel.id] ? "Show " : "Hide "}
                {panel.label}
              </span>
            </Button>
          ))}
        <Button
          variant="outline"
          size="sm"
          disabled={disabled || panels.length < 2}
          onClick={restoreLayout}
        >
          {defaultLayout ? "Restore layout" : "Balance panels"}
        </Button>
        {disabled && (
          <span
            data-slot="resizable-disabled-reason"
            className="text-xs text-muted-foreground"
          >
            {disabledReason}
          </span>
        )}
      </div>
    )
  );
}

function createResizableContent(options: CreateResizableContentParams) {
  const {
    panels,
    handleProps,
    instanceId,
    collapsed,
    register,
    onCollapsedChange,
  } = options;

  const buildControls = () => <ResizableLayoutControls {...options} />;

  const buildPanels = () =>
    panels.map((panel, index) => (
      <React.Fragment key={panel.id}>
        {index > 0 && (
          <ResizableHandle
            aria-label={
              "Resize " + panels[index - 1].label + " and " + panel.label
            }
            {...handleProps}
          />
        )}
        <KiraPanel
          panel={panel}
          domId={instanceId + panel.id}
          collapsed={!!collapsed[panel.id]}
          register={register}
          onCollapsedChange={onCollapsedChange}
        />
      </React.Fragment>
    ));

  return { buildControls, buildPanels } satisfies {
    buildControls: typeof buildControls;
    buildPanels: typeof buildPanels;
  };
}

type CreateResizableContentParams = {
  controls: boolean;
  panels: KiraResizableProps["panels"];
  disabled: boolean;
  instanceId: string;
  collapsed: Record<string, boolean>;
  panelApis: React.RefObject<Map<string, PanelImperativeHandle>>;
  restoreLayout: () => void;
  defaultLayout: KiraResizableProps["defaultLayout"];
  disabledReason: string;
  handleProps: KiraResizableProps["handleProps"];
  register: (id: string, handle: PanelImperativeHandle | null) => void;
  onCollapsedChange: (id: string, value: boolean) => void;
};
