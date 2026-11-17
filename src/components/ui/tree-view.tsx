import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import {
  IconCheck,
  IconChevronRight,
  IconFile,
  IconFolder,
  IconFolderOpen,
  IconMinus,
} from "@tabler/icons-react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "cn";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

export interface TreeNode {
  id: string;
  name: string;
  icon?: React.ReactNode;
  children?: TreeNode[];
  isFile?: boolean;
  disabled?: boolean;
  disabledReason?: string;
}

const treeViewVariants = cva("min-w-0 text-sm", {
  variants: {
    size: {
      default: "[&_[data-slot=tree-view-row]]:min-h-9",
      sm: "[&_[data-slot=tree-view-row]]:min-h-8",
    },
  },
  defaultVariants: { size: "default" },
});

interface TreeViewProps extends VariantProps<typeof treeViewVariants> {
  data: TreeNode[];
  defaultExpandedNodes?: string[];
  expandedNodes?: string[];
  onExpandedNodesChange?: (ids: string[]) => void;
  defaultSelectedNodes?: string[];
  selectedNodes?: string[];
  onSelectionChange?: (ids: string[]) => void;
  onSelect?: (node: TreeNode) => void;
  selectionMode?: "single" | "multiple";
  showLines?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  loading?: boolean;
  emptyMessage?: string;
  /** Matches node names and reveals their ancestors without changing saved expansion. */
  filter?: string;
  "aria-label"?: string;
  "aria-describedby"?: string;
  className?: string;
}

// React calls ref cleanup before removing a focused row. Preserve its ancestry
// so externally controlled collapse can restore focus after the DOM commit.
function preserveTreeFocus(element: HTMLDivElement | null) {
  if (!element) return;

  return () => {
    if (element.ownerDocument.activeElement !== element) return;

    const tree = element.closest('[role="tree"]');
    const ancestors: HTMLElement[] = [];

    let parent =
      element.parentElement?.closest<HTMLElement>('[role="treeitem"]');

    while (parent) {
      ancestors.push(parent);
      parent = parent.parentElement?.closest<HTMLElement>('[role="treeitem"]');
    }

    queueMicrotask(() => {
      if (element.isConnected || !tree?.isConnected) return;

      if (element.ownerDocument.activeElement !== element.ownerDocument.body)
        return;

      const target =
        ancestors.find(
          (item) => item.isConnected && item.getClientRects().length > 0,
        ) ?? tree.querySelector<HTMLElement>('[role="treeitem"][tabindex="0"]');

      target?.focus();
    });
  };
}

function useTreeViewSettings({
  data,
  defaultExpandedNodes: defaultExpandedNodesInput,
  expandedNodes: controlledExpanded,
  onExpandedNodesChange,
  defaultSelectedNodes: defaultSelectedNodesInput,
  selectedNodes: controlledSelected,
  onSelectionChange,
  onSelect,
  selectionMode: selectionModeInput,
  showLines: showLinesInput,
  disabled: disabledInput,
  readOnly: readOnlyInput,
  loading: loadingInput,
  emptyMessage: emptyMessageInput,
  filter: filterInput,
  size,
  className,
  "aria-label": ariaLabelInput,
  "aria-describedby": describedBy,
}: TreeViewProps) {
  const {
    defaultExpandedNodes,
    defaultSelectedNodes,
    selectionMode,
    showLines,
    disabled,
    readOnly,
  } = useTreeViewOptions({
    defaultExpandedNodes: defaultExpandedNodesInput,
    defaultSelectedNodes: defaultSelectedNodesInput,
    selectionMode: selectionModeInput,
    showLines: showLinesInput,
    disabled: disabledInput,
    readOnly: readOnlyInput,
  });

  const { loading, emptyMessage, filter, ariaLabel } = useTreeViewOptions2({
    loading: loadingInput,
    emptyMessage: emptyMessageInput,
    filter: filterInput,
    ariaLabel: ariaLabelInput,
  });

  return {
    data,
    controlledExpanded,
    onExpandedNodesChange,
    controlledSelected,
    onSelectionChange,
    onSelect,
    size,
    className,
    describedBy,
    defaultExpandedNodes,
    defaultSelectedNodes,
    selectionMode,
    showLines,
    disabled,
    readOnly,
    loading,
    emptyMessage,
    filter,
    ariaLabel,
  };
}

function useTreeViewModel(input: TreeViewProps) {
  const settings = useTreeViewSettings(input);

  const {
    data,
    controlledExpanded,
    onExpandedNodesChange,
    controlledSelected,
    onSelectionChange,
    onSelect,
    defaultExpandedNodes,
    defaultSelectedNodes,
    selectionMode,
    disabled,
    readOnly,
    filter,
  } = settings;

  const reduced = useReducedMotion();
  const readOnlyDescriptionId = React.useId();

  const [localExpanded, setLocalExpanded] =
    React.useState(defaultExpandedNodes);

  const [localSelected, setLocalSelected] =
    React.useState(defaultSelectedNodes);

  const [active, setActive] = React.useState<string | null>(null);
  const [keyboardDisclosure, setKeyboardDisclosure] = React.useState(false);
  const rootRef = React.useRef<HTMLDivElement>(null);
  const typeahead = React.useRef({ text: "", time: 0 });
  const expanded = new Set(controlledExpanded ?? localExpanded);
  const selected = new Set(controlledSelected ?? localSelected);
  const query = filter.trim().toLocaleLowerCase();

  const catalog = createTreeViewCatalog(data, query, expanded, selected);
  const { visible } = catalog;

  const focusId = visible.some((item) => item.node.id === active)
    ? active
    : (visible.find((item) => selected.has(item.node.id))?.node.id ??
      visible[0]?.node.id);

  const focus = (id?: string) => {
    if (!id) return;
    setActive(id);

    const element = Array.from(
      rootRef.current?.querySelectorAll<HTMLElement>('[role="treeitem"]') ?? [],
    ).find((item) => item.dataset.nodeId === id);

    element?.focus();
  };

  const changeExpansion = (id: string, open: boolean) => {
    if (disabled || query) return;
    const next = new Set(expanded);

    if (open) next.add(id);
    else next.delete(id);

    if (controlledExpanded === undefined) setLocalExpanded([...next]);
    onExpandedNodesChange?.([...next]);
  };

  const select = (node: TreeNode) => {
    if (disabled || node.disabled || readOnly) return;
    const ids = treeViewSelection(data, node, selected, selectionMode, catalog);

    if (controlledSelected === undefined) setLocalSelected(ids);
    onSelectionChange?.(ids);
    onSelect?.(node);
  };

  return {
    ...settings,
    ...catalog,
    query,
    expanded,
    selected,
    reduced,
    readOnlyDescriptionId,
    rootRef,
    typeahead,
    keyboardDisclosure,
    setKeyboardDisclosure,
    setActive,
    focusId,
    focus,
    changeExpansion,
    select,
  };
}

type TreeViewModel = ReturnType<typeof useTreeViewModel>;

function TreeView(input: TreeViewProps) {
  const model = useTreeViewModel(input);
  const { size, className, readOnly, readOnlyDescriptionId } = model;

  return (
    <div
      data-slot="tree-view"
      className={cn(treeViewVariants({ size }), className)}
    >
      {readOnly && (
        <span
          id={readOnlyDescriptionId}
          data-slot="tree-view-readonly-description"
          className="sr-only"
        >
          Read only. Browse folders; selection cannot be changed.
        </span>
      )}
      <TreeViewContents model={model} />
    </div>
  );
}

interface KiraTreeViewProps extends Omit<TreeViewProps, "filter"> {
  title?: string;
  searchLabel?: string;
}

function KiraTreeView({
  title = "Documents",
  searchLabel = "Find documents",
  selectedNodes,
  defaultSelectedNodes = [],
  onSelectionChange,
  className,
  ...props
}: KiraTreeViewProps) {
  const [query, setQuery] = React.useState("");

  const [localSelected, setLocalSelected] =
    React.useState(defaultSelectedNodes);

  const ids = selectedNodes ?? localSelected;
  const inputId = React.useId();
  const inputRef = React.useRef<HTMLInputElement>(null);

  const buildSearch = () => (
    <div data-slot="kira-tree-view-search" className="space-y-2">
      <label htmlFor={inputId} className="text-sm font-medium">
        {searchLabel}
      </label>
      <div className="flex gap-2">
        <Input
          className="border-muted-foreground focus-visible:border-primary focus-visible:ring-primary"
          ref={inputRef}
          id={inputId}
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          disabled={props.disabled || props.loading}
        />
        {query && (
          <Button
            variant="outline"
            className="focus-visible:ring-primary"
            onClick={() => {
              setQuery("");
              inputRef.current?.focus();
            }}
          >
            Clear
          </Button>
        )}
      </div>
    </div>
  );

  const buildTree = () => (
    <TreeView
      {...props}
      aria-label={props["aria-label"] ?? title}
      filter={query}
      selectedNodes={ids}
      onSelectionChange={(next) => {
        setLocalSelected(next);
        onSelectionChange?.(next);
      }}
    />
  );

  return (
    <section
      data-slot="kira-tree-view"
      aria-label={title}
      className={cn("min-w-0 space-y-4", className)}
    >
      <h2 data-slot="kira-tree-view-title" className="font-medium">
        {title}
      </h2>
      {buildSearch()}
      {buildTree()}
      <output
        data-slot="kira-tree-view-status"

        className="block text-sm text-muted-foreground tabular-nums"
      >
        {ids.length} items selected{query ? ` · Filter: ${query}` : ""}
      </output>
    </section>
  );
}

export { TreeView, KiraTreeView, treeViewVariants };

export type { TreeViewProps, KiraTreeViewProps };

function resolveTreeViewOptions({
  defaultExpandedNodes = [],
  defaultSelectedNodes = [],
  selectionMode = "single",
  showLines = true,
  disabled = false,
  readOnly = false,
}: {
  defaultExpandedNodes?: TreeViewProps["defaultExpandedNodes"];
  defaultSelectedNodes?: TreeViewProps["defaultSelectedNodes"];
  selectionMode?: TreeViewProps["selectionMode"];
  showLines?: TreeViewProps["showLines"];
  disabled?: TreeViewProps["disabled"];
  readOnly?: TreeViewProps["readOnly"];
}) {
  return {
    defaultExpandedNodes,
    defaultSelectedNodes,
    selectionMode,
    showLines,
    disabled,
    readOnly,
  };
}

function resolveTreeViewOptions2({
  loading = false,
  emptyMessage = "No items to display.",
  filter = "",
  ariaLabel = "Files",
}: {
  loading?: TreeViewProps["loading"];
  emptyMessage?: TreeViewProps["emptyMessage"];
  filter?: TreeViewProps["filter"];
  ariaLabel?: TreeViewProps["aria-label"];
}) {
  return { loading, emptyMessage, filter, ariaLabel };
}

function TreeViewToggleView({
  disabled,
  query,
  node,
  setKeyboardDisclosure,
  focus,
  open,
  reduced,
}: {
  disabled: boolean;
  query: string;
  node: TreeNode;
  setKeyboardDisclosure: React.Dispatch<React.SetStateAction<boolean>>;
  focus: (id?: string) => void;
  open: boolean;
  reduced: boolean;
}) {
  return (
    <CollapsibleTrigger
      showArrow={false}
      size="xs"
      data-slot="tree-view-toggle"
      tabIndex={-1}
      disabled={disabled || Boolean(query)}
      aria-label={`Toggle ${node.name}`}
      onClick={(event) => {
        event.stopPropagation();
        setKeyboardDisclosure(false);
        focus(node.id);
      }}
      className="flex size-6 min-h-6 w-6 shrink-0 items-center justify-center rounded-sm p-0"
    >
      <IconChevronRight
        aria-hidden="true"
        className={cn(
          "mx-auto block size-4",
          { "rotate-90": open },
          { "transition-transform duration-150": !reduced },
        )}
      />
    </CollapsibleTrigger>
  );
}

function useTreeViewOptions({
  defaultExpandedNodes: defaultExpandedNodesInput,
  defaultSelectedNodes: defaultSelectedNodesInput,
  selectionMode: selectionModeInput,
  showLines: showLinesInput,
  disabled: disabledInput,
  readOnly: readOnlyInput,
}: Parameters<typeof resolveTreeViewOptions>[0]) {
  return React.useMemo(
    () =>
      resolveTreeViewOptions({
        defaultExpandedNodes: defaultExpandedNodesInput,
        defaultSelectedNodes: defaultSelectedNodesInput,
        selectionMode: selectionModeInput,
        showLines: showLinesInput,
        disabled: disabledInput,
        readOnly: readOnlyInput,
      }),
    [
      defaultExpandedNodesInput,
      defaultSelectedNodesInput,
      selectionModeInput,
      showLinesInput,
      disabledInput,
      readOnlyInput,
    ],
  );
}

function useTreeViewOptions2({
  loading: loadingInput,
  emptyMessage: emptyMessageInput,
  filter: filterInput,
  ariaLabel: ariaLabelInput,
}: Parameters<typeof resolveTreeViewOptions2>[0]) {
  return React.useMemo(
    () =>
      resolveTreeViewOptions2({
        loading: loadingInput,
        emptyMessage: emptyMessageInput,
        filter: filterInput,
        ariaLabel: ariaLabelInput,
      }),
    [loadingInput, emptyMessageInput, filterInput, ariaLabelInput],
  );
}

function treeViewResolveIcon1(node: TreeNode, open: boolean) {
  if (node.isFile) {
    return IconFile;
  }

  if (open) {
    return IconFolderOpen;
  }

  return IconFolder;
}

function treeViewResolveAriachecked2(
  selectionMode: "multiple" | "single",
  mixed: boolean,
  isChecked: boolean,
) {
  if (selectionMode === "multiple") {
    if (mixed) {
      return "mixed" as const;
    }

    return isChecked;
  }

  return undefined;
}

function TreeViewContents({ model }: { model: TreeViewModel }) {
  const {
    loading,
    visible,
    rootRef,
    ariaLabel,
    describedBy,
    readOnly,
    readOnlyDescriptionId,
    selectionMode,
    disabled,
    data,
    query,
    emptyMessage,
  } = model;

  if (loading) {
    return (
      <output
        data-slot="tree-view-loading"

        className="block min-h-24 p-4 text-muted-foreground"
      >
        Loading items…
      </output>
    );
  }

  if (visible.length) {
    return (
      <div
        ref={rootRef}
        role="tree"
        aria-label={ariaLabel}
        aria-describedby={
          [describedBy, readOnly ? readOnlyDescriptionId : undefined]
            .filter(Boolean)
            .join(" ") || undefined
        }
        aria-multiselectable={selectionMode === "multiple" || undefined}
        aria-disabled={disabled || undefined}
        data-readonly={readOnly || undefined}
        data-slot="tree-view-root"
      >
        <TreeViewNodes nodes={data} level={1} model={model} />
      </div>
    );
  }

  return (
    <output
      data-slot="tree-view-empty"

      className="block min-h-24 p-4 text-muted-foreground"
    >
      {query ? "No matching items. Try another search." : emptyMessage}
    </output>
  );
}

function createTreeViewCatalog(
  data: TreeNode[],
  query: string,
  expanded: Set<string>,
  selected: Set<string>,
) {
  const matches = (node: TreeNode): boolean =>
    node.name.toLocaleLowerCase().includes(query) ||
    Boolean(node.children?.some(matches));

  const childrenOf = (node: TreeNode): TreeNode[] =>
    node.isFile ? [] : (node.children ?? []);

  const available = (node: TreeNode): TreeNode[] =>
    node.disabled ? [] : [node, ...childrenOf(node).flatMap(available)];

  const checked = (node: TreeNode): boolean => {
    if (node.disabled) return selected.has(node.id);
    const children = childrenOf(node).filter((child) => !child.disabled);

    return children.length ? children.every(checked) : selected.has(node.id);
  };

  const partial = (node: TreeNode): boolean =>
    childrenOf(node).some(
      (child) => !child.disabled && (checked(child) || partial(child)),
    );

  const visible: { node: TreeNode; parent?: string }[] = [];

  const collect = (nodes: TreeNode[], parent?: string) => {
    for (const node of nodes) {
      if (query && !matches(node)) continue;
      visible.push({ node, parent });

      if (query || expanded.has(node.id)) collect(childrenOf(node), node.id);
    }
  };

  collect(data);

  return { childrenOf, available, matches, checked, partial, visible };
}

function treeViewSelection(
  data: TreeNode[],
  node: TreeNode,
  selected: Set<string>,
  selectionMode: "single" | "multiple",
  { checked, available, childrenOf }: ReturnType<typeof createTreeViewCatalog>,
) {
  let ids: string[];

  if (selectionMode === "single") ids = [node.id];
  else {
    const next = new Set(selected);
    const remove = checked(node);

    for (const item of available(node)) {
      if (remove) next.delete(item.id);
      else next.add(item.id);
    }

    // Reconcile enabled descendants, including nodes in collapsed branches.
    data.forEach((item) => reconcileTreeSelection(item, next, childrenOf));
    ids = [...next];
  }

  return ids;
}

function reconcileTreeSelection(
  item: TreeNode,
  next: Set<string>,
  childrenOf: (node: TreeNode) => TreeNode[],
): boolean {
  if (item.disabled) {
    childrenOf(item).forEach((child) =>
      reconcileTreeSelection(child, next, childrenOf),
    );

    return true;
  }

  const children = childrenOf(item).filter((child) => !child.disabled);

  if (!children.length) return next.has(item.id);

  const results = childrenOf(item).map((child) =>
    reconcileTreeSelection(child, next, childrenOf),
  );

  const all = results.every(Boolean);

  if (all) next.add(item.id);
  else next.delete(item.id);

  return all;
}

function treeViewKeydown(
  event: React.KeyboardEvent<HTMLDivElement>,
  node: TreeNode,
  model: TreeViewModel,
) {
  const {
    visible,
    childrenOf,
    query,
    expanded,
    changeExpansion,
    setKeyboardDisclosure,
    select,
  } = model;

  event.stopPropagation();
  const index = visible.findIndex((item) => item.node.id === node.id);
  const branch = childrenOf(node).length > 0;
  const open = Boolean(query) || expanded.has(node.id);

  if (treeViewArrowKey(event, node, model, index, branch, open)) return;

  switch (event.key) {
    case "Enter":
      event.preventDefault();
      setKeyboardDisclosure(true);

      if (branch) changeExpansion(node.id, !open);
      else select(node);
      break;
    case " ":
      event.preventDefault();
      select(node);
      break;
    default:
      treeViewTypeahead(event, model, index);
  }
}

function treeViewArrowKey(
  event: React.KeyboardEvent<HTMLDivElement>,
  node: TreeNode,
  model: TreeViewModel,
  index: number,
  branch: boolean,
  open: boolean,
) {
  const { visible, focus } = model;

  const positions = new Map([
    ["ArrowDown", visible[index + 1]?.node.id],
    ["ArrowUp", visible[index - 1]?.node.id],
    ["Home", visible[0]?.node.id],
    ["End", visible.at(-1)?.node.id],
  ]);

  if (positions.has(event.key)) {
    event.preventDefault();
    focus(positions.get(event.key));

    return true;
  }

  return treeViewBranchKey(event, node, model, index, branch, open);
}

function treeViewBranchKey(
  event: React.KeyboardEvent<HTMLDivElement>,
  node: TreeNode,
  model: TreeViewModel,
  index: number,
  branch: boolean,
  open: boolean,
) {
  const { visible, focus, changeExpansion, query } = model;

  if (event.key === "ArrowRight") {
    event.preventDefault();

    treeViewOpenBranch(node, branch, open, model, index);

    return true;
  }

  if (event.key !== "ArrowLeft") return false;
  event.preventDefault();

  if (branch && open && !query) changeExpansion(node.id, false);
  else focus(visible[index]?.parent);

  return true;
}

function treeViewTypeahead(
  event: React.KeyboardEvent<HTMLDivElement>,
  { visible, typeahead, focus }: TreeViewModel,
  index: number,
) {
  if (event.key.length !== 1 || event.ctrlKey || event.metaKey || event.altKey)
    return;
  const now = event.timeStamp;

  const text =
    (now - typeahead.current.time < 700 ? typeahead.current.text : "") +
    event.key.toLocaleLowerCase();

  typeahead.current = { text, time: now };

  const prefix = [...text].every((char) => char === text[0]) ? text[0] : text;

  const ordered = [...visible.slice(index + 1), ...visible.slice(0, index + 1)];

  focus(
    ordered.find((item) =>
      item.node.name.toLocaleLowerCase().startsWith(prefix),
    )?.node.id,
  );
}

function TreeViewNodes({
  nodes,
  level,
  model,
}: {
  nodes: TreeNode[];
  level: number;
  model: TreeViewModel;
}) {
  const filtered = nodes.filter((node) => !model.query || model.matches(node));

  return filtered.map((node, index) => (
    <TreeViewNode
      key={node.id}
      node={node}
      index={index}
      count={filtered.length}
      level={level}
      model={model}
    />
  ));
}

type TreeViewNodeProps = {
  node: TreeNode;
  index: number;
  count: number;
  level: number;
  model: TreeViewModel;
};

function TreeViewNode({ node, index, count, level, model }: TreeViewNodeProps) {
  const {
    selectionMode,
    focusId,
    keyboardDisclosure,
    changeExpansion,
    showLines,
  } = model;

  const {
    children,
    branch,
    open,
    isChecked,
    mixed,
    unavailable,
    Icon,
    ariaChecked,
  } = treeViewNodeState(node, model);

  return (
    <Collapsible
      key={node.id}
      ref={preserveTreeFocus}
      motion={!keyboardDisclosure}
      open={open}
      onOpenChange={(value) => changeExpansion(node.id, value)}
      role="treeitem"
      data-slot="tree-view-item"
      data-node-id={node.id}
      aria-label={
        node.disabledReason ? `${node.name}. ${node.disabledReason}` : node.name
      }
      aria-level={level}
      aria-posinset={index + 1}
      aria-setsize={count}
      aria-expanded={branch ? open : undefined}
      aria-selected={selectionMode === "single" ? isChecked : undefined}
      aria-checked={ariaChecked}
      aria-disabled={unavailable || undefined}
      tabIndex={node.id === focusId ? 0 : -1}
      {...treeViewNodeEvents(node, model, branch, open)}
      className="outline-none [&:focus-visible>[data-slot=tree-view-row]]:ring-2 [&:focus-visible>[data-slot=tree-view-row]]:ring-primary [&:focus-visible>[data-slot=tree-view-row]]:ring-inset"
    >
      <TreeViewRow
        node={node}
        level={level}
        model={model}
        branch={branch}
        open={open}
        isChecked={isChecked}
        mixed={mixed}
        unavailable={unavailable}
        Icon={Icon}
      />
      {branch && (
        <CollapsibleContent
          size="none"
          data-slot="tree-view-group"
          // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role -- This generic ARIA group preserves the custom composite layout without fieldset defaults or form semantics.
          role="group"
          className="relative"
        >
          {showLines && (
            <span
              data-slot="tree-view-guide"
              aria-hidden="true"
              className="pointer-events-none absolute top-0 bottom-4 border-s border-border/60"
              style={{ insetInlineStart: `${(level - 1) * 20 + 16}px` }}
            />
          )}
          <TreeViewNodes nodes={children} level={level + 1} model={model} />
        </CollapsibleContent>
      )}
    </Collapsible>
  );
}

// oxlint-disable-next-line eslint/max-lines-per-function -- Pure tree-row slot presentation; selection and keyboard behavior live in the model and child controls.
function TreeViewRow({
  node,
  level,
  model,
  branch,
  open,
  isChecked,
  mixed,
  unavailable,
  Icon,
}: {
  node: TreeNode;
  level: number;
  model: TreeViewModel;
  branch: boolean;
  open: boolean;
  isChecked: boolean;
  mixed: boolean;
  unavailable: boolean | undefined;
  Icon: typeof IconFile;
}) {
  const {
    selectionMode,
    reduced,
    disabled,
    query,
    setKeyboardDisclosure,
    focus,
    readOnly,
    select,
  } = model;

  return (
    <div
      data-slot="tree-view-row"
      className={cn(
        "relative mb-0.5 grid min-w-0 cursor-default items-center gap-x-1 rounded-sm pe-1 py-0.5 hover:bg-muted/40",
        selectionMode === "multiple"
          ? "grid-cols-[1.5rem_1.5rem_1.5rem_minmax(0,1fr)]"
          : "grid-cols-[1.5rem_1.5rem_minmax(0,1fr)]",
        { "font-medium": isChecked },
        { "bg-muted/50": isChecked && selectionMode === "single" },
        { "text-muted-foreground": unavailable },
        { "transition-colors duration-150": !reduced },
      )}
      style={{
        paddingInlineStart: `${(level - 1) * 20 + 4}px`,
      }}
    >
      {branch ? (
        <TreeViewToggleView
          disabled={disabled}
          query={query}
          node={node}
          setKeyboardDisclosure={setKeyboardDisclosure}
          focus={focus}
          open={open}
          reduced={reduced}
        />
      ) : (
        <span
          data-slot="tree-view-spacer"
          aria-hidden="true"
          className="size-6 shrink-0"
        />
      )}
      {selectionMode === "multiple" && (
        <TreeViewCheck
          node={node}
          unavailable={unavailable}
          readOnly={readOnly}
          focus={focus}
          select={select}
          mixed={mixed}
          isChecked={isChecked}
        />
      )}
      <span
        data-slot="tree-view-icon"
        aria-hidden="true"
        className="flex size-6 items-center justify-center text-muted-foreground [&>svg]:size-4"
      >
        {node.icon ?? <Icon className="size-4" />}
      </span>
      <span data-slot="tree-view-label" className="min-w-0 wrap-break-word">
        {node.name}
        {node.disabledReason && (
          <span className="block text-xs font-normal text-muted-foreground">
            {node.disabledReason}
          </span>
        )}
      </span>
    </div>
  );
}

function TreeViewCheck({
  node,
  unavailable,
  readOnly,
  focus,
  select,
  mixed,
  isChecked,
}: {
  node: TreeNode;
  unavailable: boolean | undefined;
  readOnly: boolean;
  focus: TreeViewModel["focus"];
  select: TreeViewModel["select"];
  mixed: boolean;
  isChecked: boolean;
}) {
  const resolveValue3 = () => {
    if (mixed) {
      return <IconMinus className="size-3" />;
    }

    if (isChecked) {
      return <IconCheck className="size-3" />;
    }

    return null;
  };

  return (
    <button
      type="button"
      tabIndex={-1}
      aria-label={`Select ${node.name}`}
      disabled={unavailable || readOnly}
      onClick={(event) => {
        event.stopPropagation();
        focus(node.id);
        select(node);
      }}
      data-slot="tree-view-check"
      aria-pressed={mixed ? "mixed" : isChecked}
      className={cn(
        "relative flex size-4 items-center justify-center justify-self-center rounded-sm border border-muted-foreground after:absolute after:-inset-1 after:content-['']",
        {
          "border-primary bg-primary text-primary-foreground":
            isChecked || mixed,
        },
      )}
    >
      {resolveValue3()}
    </button>
  );
}

function treeViewNodeState(
  node: TreeNode,
  {
    childrenOf,
    query,
    expanded,
    selectionMode,
    checked,
    selected,
    partial,
    disabled,
  }: TreeViewModel,
) {
  const children = childrenOf(node);
  const branch = children.length > 0;
  const open = branch && (Boolean(query) || expanded.has(node.id));

  const isChecked =
    selectionMode === "multiple" ? checked(node) : selected.has(node.id);

  const mixed = selectionMode === "multiple" && !isChecked && partial(node);
  const unavailable = disabled || node.disabled;

  return {
    children,
    branch,
    open,
    isChecked,
    mixed,
    unavailable,
    Icon: treeViewResolveIcon1(node, open),
    ariaChecked: treeViewResolveAriachecked2(selectionMode, mixed, isChecked),
  };
}

function treeViewOpenBranch(
  node: TreeNode,
  branch: boolean,
  open: boolean,
  { changeExpansion, focus, visible }: TreeViewModel,
  index: number,
) {
  if (branch && !open) changeExpansion(node.id, true);
  else if (branch) focus(visible[index + 1]?.node.id);
}

function treeViewNodeEvents(
  node: TreeNode,
  model: TreeViewModel,
  branch: boolean,
  open: boolean,
) {
  const {
    setActive,
    setKeyboardDisclosure,
    focus,
    changeExpansion,
    selectionMode,
    select,
  } = model;

  return {
    onFocus: (event: React.FocusEvent<HTMLDivElement>) => {
      if (event.target === event.currentTarget) setActive(node.id);
    },
    onKeyDown: (event: React.KeyboardEvent<HTMLDivElement>) => {
      setKeyboardDisclosure(true);
      treeViewKeydown(event, node, model);
    },
    onClick: (event: React.MouseEvent<HTMLDivElement>) => {
      event.stopPropagation();
      setKeyboardDisclosure(false);
      focus(node.id);

      if (branch) changeExpansion(node.id, !open);

      if (!branch || selectionMode === "single") select(node);
    },
  };
}
