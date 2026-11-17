/* oxlint-disable react/only-export-components -- public compound component and variant exports */
"use client";

import * as React from "react";
import { withContentKeys } from "@/components/ui/content-keys";
import { IconClock, IconSearch, IconX } from "@tabler/icons-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandDialog,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandLoading,
} from "@/components/ui/command";
import { EmptySearch, KiraEmpty } from "@/components/ui/empty";
import { Kbd } from "@/components/ui/kbd";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const spotlightContentVariants = cva("w-full sm:max-h-[calc(100dvh-8rem)]", {
  variants: {
    size: {
      sm: "max-w-md",
      default: "max-w-xl",
      lg: "max-w-2xl",
      full: "max-w-4xl",
    },
  },
  defaultVariants: { size: "default" },
});

const spotlightInputVariants = cva("", {
  variants: {
    size: {
      sm: "min-h-10",
      default: "min-h-11",
      lg: "min-h-12",
      full: "min-h-12",
    },
  },
  defaultVariants: { size: "default" },
});

const spotlightGroupVariants = cva("min-w-0");
const spotlightItemVariants = cva("min-w-0");

interface SpotlightItemType<T = unknown> {
  id: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  shortcut?: string[];
  keywords?: string[];
  onSelect?: () => void;
  data?: T;
  disabled?: boolean;
  disabledReason?: string;
  scope?: string;
}

interface SpotlightGroupType<T = unknown> {
  id: string;
  label: string;
  items: SpotlightItemType<T>[];
}

interface SpotlightProps<T = unknown> extends VariantProps<
  typeof spotlightContentVariants
> {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  query?: string;
  defaultQuery?: string;
  onQueryChange?: (query: string) => void;
  groups?: SpotlightGroupType<T>[];
  items?: SpotlightItemType<T>[];
  recentItems?: SpotlightItemType<T>[];
  onClearRecent?: () => void;
  onSearch?: (query: string) => void;
  onSelect?: (item: SpotlightItemType<T>) => void;
  closeOnSelect?: boolean;
  loading?: boolean;
  placeholder?: string;
  title?: string;
  emptyContent?: React.ReactNode;
  filter?: (item: SpotlightItemType<T>, query: string) => boolean;
  disableFilter?: boolean;
  trigger?: React.ReactElement;
  showShortcutHint?: boolean;
  className?: string;
  children?: React.ReactNode;
  header?: React.ReactNode;
  renderPreview?: (item: SpotlightItemType<T>) => React.ReactNode;
}

interface SpotlightContextValue {
  select: (item: SpotlightItemType) => void;
  loading: boolean;
}

const SpotlightContext = React.createContext<SpotlightContextValue | null>(
  null,
);

function matchesItem(item: SpotlightItemType, query: string) {
  const normalized = query.trim().toLocaleLowerCase();

  return [item.label, item.description ?? "", ...(item.keywords ?? [])].some(
    (value) => value.toLocaleLowerCase().includes(normalized),
  );
}

function uniqueItems<T>(items: SpotlightItemType<T>[]) {
  return items.filter(
    (item, index) =>
      items.findIndex((candidate) => candidate.id === item.id) === index,
  );
}

function useSpotlightRootModel<T>(input: SpotlightProps<T>) {
  const settings = spotlightRootOptions(input);

  const {
    open: controlledOpen,
    defaultOpen,
    onOpenChange,
    query: controlledQuery,
    defaultQuery,
    onQueryChange,
    groups,
    items,
    recentItems,
    onSearch,
    onSelect,
    closeOnSelect,
    loading,
    filter,
    disableFilter,
  } = settings;

  const [localOpen, setLocalOpen] = React.useState(defaultOpen);
  const [localQuery, setLocalQuery] = React.useState(defaultQuery);
  const [selectedId, setSelectedId] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);
  const labelRef = React.useRef<HTMLLabelElement>(null);
  const searchInputId = React.useId();
  const open = controlledOpen ?? localOpen;
  const query = controlledQuery ?? localQuery;
  const [previousOpen, setPreviousOpen] = React.useState(open);

  if (previousOpen !== open) {
    setPreviousOpen(open);
    setSelectedId("");

    if (!open) setLocalQuery("");
  }

  const reducedMotion = useReducedMotion();

  const setQuery = (next: string) => {
    if (controlledQuery === undefined) setLocalQuery(next);
    onQueryChange?.(next);
    onSearch?.(next);
  };

  const setOpen = (next: boolean) => {
    if (controlledOpen === undefined) setLocalOpen(next);
    onOpenChange?.(next);

    if (!next) setQuery("");
  };

  const { recent, filtered, sections } = spotlightSections({
    groups,
    items,
    recentItems,
    query,
    disableFilter,
    filter,
  });

  const selected = loading
    ? undefined
    : filtered.find((item) => item.id === selectedId && !item.disabled);

  const select = (item: SpotlightItemType<T>) => {
    if (item.disabled || loading) return;
    item.onSelect?.();
    onSelect?.(item);

    if (closeOnSelect) setOpen(false);
  };

  return {
    ...settings,
    open,
    setOpen,
    query,
    setQuery,
    selectedId,
    setSelectedId,
    inputRef,
    labelRef,
    searchInputId,
    reducedMotion,
    recent,
    filtered,
    sections,
    selected,
    select,
  };
}

function SpotlightRoot<T = unknown>(input: SpotlightProps<T>) {
  const model = useSpotlightRootModel(input);

  const {
    open,
    setOpen,
    selectedId,
    setSelectedId,
    inputRef,
    title,
    trigger,
    size,
    className,
    select,
    loading,
    header,
    selected,
    renderPreview,
  } = model;

  return (
    <CommandDialog
      open={open}
      onOpenChange={setOpen}
      trigger={trigger}
      title={title}
      description="Search your workspace. Use arrow keys to choose a result and Enter to open it."
      className={cn(spotlightContentVariants({ size }), className)}
      contentProps={{ initialFocus: inputRef }}
    >
      <div data-slot="spotlight" className="flex min-h-0 flex-col">
        <SpotlightContext.Provider
          value={{
            select: (item) => {
              // SAFETY: this provider owns the T-typed catalog and its Item children.
              select(item as SpotlightItemType<T>);
            },
            loading,
          }}
        >
          <Command
            label={title}
            shouldFilter={false}
            loop
            vimBindings={false}
            value={selectedId}
            onValueChange={setSelectedId}
            className="max-h-[calc(100dvh-4rem)] rounded-none border-0 sm:max-h-[calc(100dvh-8rem)]"
            onKeyDownCapture={(event) => spotlightCallback(event)}
          >
            <SpotlightSearchField model={model} />
            {header}
            <SpotlightSearchResults model={model} />
            {selected && renderPreview && (
              <div
                data-slot="spotlight-preview"
                className="max-h-40 overflow-auto border-t px-4 py-3 text-sm [overflow-wrap:anywhere]"
              >
                {renderPreview(selected)}
              </div>
            )}
            <SpotlightResultFooter model={model} />
          </Command>
        </SpotlightContext.Provider>
      </div>
    </CommandDialog>
  );
}

interface SpotlightGroupProps extends Omit<
  React.ComponentProps<typeof CommandGroup>,
  "heading"
> {
  label: string;
}

function SpotlightGroup({ label, className, ...props }: SpotlightGroupProps) {
  return (
    <div
      data-slot="spotlight-group"
      className={cn(spotlightGroupVariants(), className)}
    >
      <CommandGroup heading={label} {...props} />
    </div>
  );
}

interface SpotlightItemComponentProps<T = unknown> {
  item: SpotlightItemType<T>;
  /** Retained for source compatibility; cmdk owns indexing. */
  index?: number;
  className?: string;
  onSelect?: () => void;
}

function SpotlightItem<T>({
  item,
  className,
  onSelect,
}: SpotlightItemComponentProps<T>) {
  const context = React.useContext(SpotlightContext);

  return (
    <CommandItem
      value={item.id}
      keywords={[item.label, item.description ?? "", ...(item.keywords ?? [])]}
      disabled={item.disabled || context?.loading}
      onSelect={() => {
        if (!item.disabled && !context?.loading) {
          if (context) context.select(onSelect ? { ...item, onSelect } : item);
          else (onSelect ?? item.onSelect)?.();
        }
      }}
      className={cn(spotlightItemVariants(), className)}
      data-spotlight-item=""
    >
      {item.icon && (
        <span
          data-slot="spotlight-item-icon"
          aria-hidden="true"
          className="shrink-0"
        >
          {item.icon}
        </span>
      )}
      <span
        data-slot="spotlight-item-content"
        className="flex min-w-0 flex-1 flex-col"
      >
        <span
          data-slot="spotlight-item-label"
          className="[overflow-wrap:anywhere]"
        >
          {item.label}
        </span>
        {item.description && (
          <span
            data-slot="spotlight-item-description"
            className="text-xs leading-5 text-muted-foreground [overflow-wrap:anywhere]"
          >
            {item.description}
          </span>
        )}
        {item.disabledReason && (
          <span
            data-slot="spotlight-item-disabled-reason"
            className="text-xs leading-5 text-muted-foreground [overflow-wrap:anywhere]"
          >
            {item.disabledReason}
          </span>
        )}
      </span>
      {item.shortcut?.length ? (
        <span
          data-slot="spotlight-item-shortcut"
          aria-label="Shortcut hint"
          className="hidden shrink-0 items-center gap-1 sm:flex"
        >
          {withContentKeys(item.shortcut, (label) => label).map(
            ({ item: label, key }) => (
              <Kbd key={key}>{label}</Kbd>
            ),
          )}
        </span>
      ) : null}
    </CommandItem>
  );
}

interface SpotlightTriggerProps extends React.ComponentProps<typeof Button> {
  showShortcut?: boolean;
}

function SpotlightTrigger({
  children = "Search workspace",
  showShortcut = false,
  variant = "outline",
  ...props
}: SpotlightTriggerProps) {
  return (
    <Button data-slot="spotlight-trigger" variant={variant} {...props}>
      <IconSearch aria-hidden="true" />
      {children}
      {showShortcut && <Kbd keys="mod+k" />}
    </Button>
  );
}

function spotlightResultStatus(
  loading: boolean,
  customResults: boolean,
  count: number,
) {
  if (loading) return "Searching…";

  if (customResults) return "Search results";

  return `${count} result${count === 1 ? "" : "s"}`;
}

interface SpotlightSearchProps extends Omit<
  React.ComponentPropsWithRef<"div">,
  "onChange"
> {
  onSearch?: (query: string) => void;
}

function SpotlightSearch({
  ref,
  className,
  onSearch,
  children,
  ...props
}: SpotlightSearchProps) {
  return (
    <div
      {...props}
      ref={ref}
      data-slot="spotlight-search"
      className={className}
    >
      <Command label="Search resources">
        <CommandInput
          aria-label="Search resources"
          placeholder="Search resources…"
          onValueChange={onSearch}
        />
        <CommandList>{children}</CommandList>
      </Command>
    </div>
  );
}

interface SpotlightRecentProps extends React.ComponentPropsWithRef<"div"> {
  items: string[];
  onItemClick?: (item: string) => void;
}

function SpotlightRecent({
  ref,
  items,
  onItemClick,
  className,
  ...props
}: SpotlightRecentProps) {
  return (
    <div
      {...props}
      ref={ref}
      data-slot="spotlight-recent"
      className={cn("p-2", className)}
    >
      <p className="px-2 py-2 text-xs text-muted-foreground">Recent searches</p>
      {withContentKeys(items, (label) => label).map(({ item, key }) => (
        <Button
          key={key}
          variant="ghost"
          disabled={!onItemClick}
          className="w-full justify-start whitespace-normal [overflow-wrap:anywhere]"
          onClick={() => onItemClick?.(item)}
        >
          <IconClock aria-hidden="true" />
          {item}
        </Button>
      ))}
    </div>
  );
}

type SpotlightSuggestionsProps = SpotlightRecentProps;

function SpotlightSuggestions({
  ref,
  items,
  onItemClick,
  className,
  ...props
}: SpotlightSuggestionsProps) {
  return (
    <div
      {...props}
      ref={ref}
      data-slot="spotlight-suggestions"
      className={cn("flex flex-wrap gap-2 p-2", className)}
    >
      {withContentKeys(items, (label) => label).map(({ item, key }) => (
        <Button
          key={key}
          variant="outline"
          size="sm"
          disabled={!onItemClick}
          onClick={() => onItemClick?.(item)}
        >
          {item}
        </Button>
      ))}
    </div>
  );
}

type SpotlightResultsProps = React.ComponentPropsWithRef<"div">;

function SpotlightResults({ ref, className, ...props }: SpotlightResultsProps) {
  return (
    <div
      {...props}
      ref={ref}
      data-slot="spotlight-results"
      className={cn("p-2", className)}
    />
  );
}

const Spotlight = Object.assign(SpotlightRoot, {
  Trigger: SpotlightTrigger,
  Group: SpotlightGroup,
  Item: SpotlightItem,
});

interface SpotlightScope {
  id: string;
  label: string;
  disabled?: boolean;
  disabledReason?: string;
}

interface SpotlightSearchContext {
  signal: AbortSignal;
  scope: string;
}

interface KiraSpotlightProps<T = unknown> extends Omit<
  SpotlightProps<T>,
  "onSearch" | "header"
> {
  scopes?: SpotlightScope[];
  scope?: string;
  defaultScope?: string;
  onScopeChange?: (scope: string) => void;
  search?: (
    query: string,
    context: SpotlightSearchContext,
  ) => Promise<SpotlightItemType<T>[]>;
  debounceMs?: number;
  minQueryLength?: number;
  rememberRecent?: boolean;
  maxRecent?: number;
  onRecentItemsChange?: (items: SpotlightItemType<T>[]) => void;
  enableShortcut?: boolean;
  shortcutInEditable?: boolean;
}

function kiraSpotlightParts<T>(input: KiraSpotlightProps<T>) {
  const {
    open: controlledOpen,
    defaultOpen,
    onOpenChange,
    query: controlledQuery,
    defaultQuery,
    onQueryChange,
    scopes,
    scope: controlledScope,
    defaultScope,
    onScopeChange,
    search,
    debounceMs,
    minQueryLength,
    recentItems: controlledRecent,
    rememberRecent,
    maxRecent,
    onRecentItemsChange,
    enableShortcut,
    shortcutInEditable,
    items,
    groups,
    loading: externalLoading,
    onSelect,
    emptyContent,
    onClearRecent,
    ...props
  } = kiraSpotlightOptions(input);

  return {
    session: {
      controlledOpen,
      defaultOpen,
      onOpenChange,
      controlledQuery,
      defaultQuery,
      onQueryChange,
      controlledScope,
      defaultScope,
    },
    remote: { search, debounceMs, minQueryLength },
    recents: {
      controlledRecent,
      rememberRecent,
      maxRecent,
      onRecentItemsChange,
      onSelect,
      onClearRecent,
    },
    view: {
      props,
      scopes,
      controlledScope,
      onScopeChange,
      rememberRecent,
      onRecentItemsChange,
      onClearRecent,
      emptyContent,
      minQueryLength,
    },
    enableShortcut,
    shortcutInEditable,
    items,
    groups,
    externalLoading,
  };
}

function useKiraSpotlightModel<T>(input: KiraSpotlightProps<T>) {
  const parts = kiraSpotlightParts(input);
  const session = useKiraSpotlightSession(parts.session);
  const { open, scope, setOpen, setQuery } = session;
  const remote = useSpotlightRemoteSearch({ ...parts.remote, ...session });
  const { hasSearch, activeSearch, snapshot, key } = remote;
  const { enableShortcut, shortcutInEditable } = parts;
  React.useEffect(
    () =>
      spotlightUseEffect(
        enableShortcut,
        shortcutInEditable,
        open,
        setQuery,
        setOpen,
      ),
    [enableShortcut, shortcutInEditable, open, setOpen, setQuery],
  );

  const { localRecent, select, clearRecent } = useSpotlightRecents(
    parts.recents,
  );

  const recentItems =
    parts.recents.controlledRecent ??
    (parts.recents.rememberRecent ? localRecent : []);

  const catalog = spotlightScopedItems(
    scope,
    parts.items,
    parts.groups,
    recentItems,
  );

  const loading =
    parts.externalLoading || (activeSearch && snapshot.key !== key);

  const remoteItems = snapshot.key === key ? snapshot.items : [];

  return {
    ...parts.view,
    ...session,
    ...remote,
    ...catalog,
    loading,
    remoteItems,
    select,
    clearRecent,
    hasSearch,
  };
}

function KiraSpotlight<T = unknown>(input: KiraSpotlightProps<T>) {
  const model = useKiraSpotlightModel(input);

  const {
    props,
    open,
    setOpen,
    query,
    setQuery,
    activeSearch,
    remoteItems,
    localItems,
    localGroups,
    recent,
    rememberRecent,
    onRecentItemsChange,
    onClearRecent,
    clearRecent,
    hasSearch,
    loading,
    select,
    scopes,
    scope,
    controlledScope,
    setLocalScope,
    onScopeChange,
  } = model;

  return (
    <SpotlightRoot
      {...props}
      open={open}
      onOpenChange={setOpen}
      query={query}
      onQueryChange={setQuery}
      items={activeSearch ? remoteItems : localItems}
      groups={activeSearch ? [] : localGroups}
      recentItems={recent}
      onClearRecent={
        rememberRecent || onRecentItemsChange || onClearRecent
          ? clearRecent
          : undefined
      }
      disableFilter={(hasSearch && activeSearch) || props.disableFilter}
      loading={loading}
      onSelect={select}
      emptyContent={<SpotlightRemoteEmpty model={model} />}
      header={
        scopes.length ? (
          <SpotlightScopesView
            scopes={scopes}
            scope={scope}
            controlledScope={controlledScope}
            setLocalScope={setLocalScope}
            onScopeChange={onScopeChange}
          />
        ) : null
      }
    />
  );
}

export {
  Spotlight,
  SpotlightRoot,
  KiraSpotlight,
  SpotlightTrigger,
  SpotlightGroup,
  SpotlightItem,
  SpotlightSearch,
  SpotlightRecent,
  SpotlightSuggestions,
  SpotlightResults,
  spotlightContentVariants,
  spotlightInputVariants,
  spotlightGroupVariants,
  spotlightItemVariants,
};

export type {
  SpotlightProps,
  KiraSpotlightProps,
  SpotlightScope,
  SpotlightSearchContext,
  SpotlightItemType,
  SpotlightGroupType,
  SpotlightGroupProps,
  SpotlightItemComponentProps,
  SpotlightTriggerProps,
  SpotlightSearchProps,
  SpotlightRecentProps,
  SpotlightSuggestionsProps,
  SpotlightResultsProps,
};

function SpotlightScopesView({
  scopes,
  scope,
  controlledScope,
  setLocalScope,
  onScopeChange,
}: {
  scopes: SpotlightScope[];
  scope: string;
  controlledScope: string | undefined;
  setLocalScope: React.Dispatch<React.SetStateAction<string>>;
  onScopeChange: ((scope: string) => void) | undefined;
}) {
  return (
    <div
      data-slot="spotlight-scopes"
      aria-label="Search scope"
      // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role -- This generic ARIA group preserves the custom composite layout without fieldset defaults or form semantics.
      role="group"
      className="flex flex-wrap gap-2 border-b px-4 py-3"
    >
      {[
        { id: "all", label: "All results" },
        ...scopes.filter((candidate) => candidate.id !== "all"),
      ].map((candidate) => (
        <div key={candidate.id} className="flex min-w-0 flex-col gap-1">
          <Button
            size="sm"
            variant={scope === candidate.id ? "outline" : "ghost"}
            aria-pressed={scope === candidate.id}
            disabled={candidate.disabled}
            onClick={(event) => {
              if (controlledScope === undefined) setLocalScope(candidate.id);
              onScopeChange?.(candidate.id);
              event.currentTarget
                .closest('[data-slot="spotlight"]')
                ?.querySelector<HTMLInputElement>("input")
                ?.focus();
            }}
          >
            {candidate.label}
          </Button>
          {candidate.disabledReason && (
            <span className="max-w-48 text-xs text-muted-foreground [overflow-wrap:anywhere]">
              {candidate.disabledReason}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

function spotlightCallback(event: React.KeyboardEvent<HTMLDivElement>) {
  if (event.nativeEvent.isComposing || event.nativeEvent.keyCode === 229)
    event.stopPropagation();

  if (
    !(event.target instanceof HTMLInputElement) &&
    ["ArrowUp", "ArrowDown", "Home", "End", "Enter"].includes(event.key)
  )
    event.stopPropagation();
}

function spotlightUseEffect(
  enableShortcut: boolean,
  shortcutInEditable: boolean,
  open: boolean,
  setQuery: (next: string) => void,
  setOpen: (next: boolean) => void,
) {
  if (!enableShortcut) return;

  const handleKeyDown = (event: KeyboardEvent) => {
    if (
      !spotlightShortcutEligible(event) ||
      !spotlightShortcutTarget(event.target, shortcutInEditable)
    )
      return;
    event.preventDefault();

    if (open) setQuery("");
    setOpen(!open);
  };

  document.addEventListener("keydown", handleKeyDown);

  return () => document.removeEventListener("keydown", handleKeyDown);
}

function spotlightRootOptions<T>(input: SpotlightProps<T>) {
  return {
    ...input,
    ...spotlightCatalogOptions(input),
    ...spotlightPresentationOptions(input),
  };
}

function spotlightCatalogOptions<T>({
  defaultOpen = false,
  defaultQuery = "",
  groups = [],
  items = [],
  recentItems = [],
  closeOnSelect = true,
  filter = matchesItem,
  disableFilter = false,
}: SpotlightProps<T>) {
  return {
    defaultOpen,
    defaultQuery,
    groups,
    items,
    recentItems,
    closeOnSelect,
    filter,
    disableFilter,
  };
}

function spotlightPresentationOptions<T>({
  loading = false,
  placeholder = "Search your workspace…",
  title = "Search workspace",
  showShortcutHint = true,
}: SpotlightProps<T>) {
  return { loading, placeholder, title, showShortcutHint };
}

function spotlightSections<T>({
  groups,
  items,
  recentItems,
  query,
  disableFilter,
  filter,
}: Pick<
  ReturnType<typeof spotlightRootOptions<T>>,
  "groups" | "items" | "recentItems" | "disableFilter" | "filter"
> & { query: string }) {
  const catalog = uniqueItems([
    ...groups.flatMap((group) => group.items),
    ...items,
  ]);

  const recent = query.trim()
    ? []
    : uniqueItems(recentItems).map(
        (item) => catalog.find((candidate) => candidate.id === item.id) ?? item,
      );

  const all = uniqueItems([...recent, ...catalog]);
  const filtered = all.filter((item) => disableFilter || filter(item, query));
  const contains = (id: string) => filtered.some((item) => item.id === id);
  const usedIds: string[] = [];
  const sections: SpotlightGroupType<T>[] = [];

  const addSection = (
    id: string,
    label: string,
    candidates: SpotlightItemType<T>[],
  ) => {
    const sectionItems = candidates.filter(
      (item) => contains(item.id) && !usedIds.includes(item.id),
    );

    usedIds.push(...sectionItems.map((item) => item.id));

    if (sectionItems.length) sections.push({ id, label, items: sectionItems });
  };

  addSection("__recent", "Recent", recent);
  groups.forEach((group) => addSection(group.id, group.label, group.items));
  addSection("__items", groups.length ? "Other results" : "Results", items);
  // Recents may contain resources no longer in the full catalog.
  addSection("__remaining", "Results", filtered);

  return { recent, filtered, sections };
}

function SpotlightSearchResults<T>({
  model,
}: {
  model: ReturnType<typeof useSpotlightRootModel<T>>;
}) {
  const {
    loading,
    children,
    filtered,
    sections,
    emptyContent,
    query,
    setQuery,
    inputRef,
  } = model;

  return (
    <>
      <CommandList
        label="Search results"
        className="max-h-80"
        aria-busy={loading}
      >
        {loading ? (
          <CommandLoading>Searching your workspace…</CommandLoading>
        ) : (
          (children ??
          (filtered.length
            ? sections.map((section) => (
                <SpotlightGroup key={section.id} label={section.label}>
                  {section.items.map((item) => (
                    <SpotlightItem key={item.id} item={item} />
                  ))}
                </SpotlightGroup>
              ))
            : null))
        )}
      </CommandList>
      {!loading && children == null && !filtered.length && (
        <div data-slot="spotlight-empty">
          {emptyContent ?? (
            <EmptySearch
              size="sm"
              description={
                query
                  ? "Try another phrase or clear your search."
                  : "Add a resource to make it searchable."
              }
              action={
                query ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setQuery("");
                      inputRef.current?.focus();
                    }}
                  >
                    Clear search
                  </Button>
                ) : undefined
              }
            />
          )}
        </div>
      )}
    </>
  );
}

function SpotlightSearchField<T>({
  model,
}: {
  model: ReturnType<typeof useSpotlightRootModel<T>>;
}) {
  const {
    searchInputId,
    labelRef,
    inputRef,
    query,
    setQuery,
    placeholder,
    size,
  } = model;

  return (
    <div data-slot="spotlight-search">
      <label
        htmlFor={searchInputId}
        ref={labelRef}
        data-slot="spotlight-label"
        className="block px-4 pt-3 text-xs font-medium text-muted-foreground"
      >
        Search workspace
      </label>
      <CommandInput
        id={searchInputId}
        ref={(node) => {
          inputRef.current = node;

          // cmdk owns the input ID; link the visible native label to it.
          if (node && labelRef.current) labelRef.current.htmlFor = node.id;
        }}
        value={query}
        onValueChange={setQuery}
        aria-label="Search workspace"
        placeholder={placeholder}
        className={spotlightInputVariants({ size })}
      />
      {query && (
        <Button
          variant="ghost"
          size="sm"
          className="mx-2 mb-2"
          onClick={() => {
            setQuery("");
            inputRef.current?.focus();
          }}
        >
          <IconX aria-hidden="true" />
          Clear search
        </Button>
      )}
    </div>
  );
}

function SpotlightResultFooter<T>({
  model,
}: {
  model: ReturnType<typeof useSpotlightRootModel<T>>;
}) {
  const {
    loading,
    children,
    filtered,
    query,
    recent,
    onClearRecent,
    showShortcutHint,
    reducedMotion,
  } = model;

  return (
    <div
      data-slot="spotlight-footer"
      className="flex flex-wrap items-center justify-between gap-2 border-t px-4 py-3 text-xs text-muted-foreground"
    >
      <output aria-live="polite" data-slot="spotlight-status">
        {spotlightResultStatus(loading, Boolean(children), filtered.length)}
      </output>
      {!query && recent.length > 0 && onClearRecent && (
        <Button variant="ghost" size="sm" onClick={onClearRecent}>
          Clear recents
        </Button>
      )}
      {showShortcutHint && (
        <span
          data-slot="spotlight-hints"
          className={cn("flex items-center gap-2", {
            "transition-none": reducedMotion,
          })}
        >
          <Kbd>↑ ↓</Kbd> choose <Kbd>Enter</Kbd> open
        </span>
      )}
    </div>
  );
}

function kiraSpotlightOptions<T>(input: KiraSpotlightProps<T>) {
  return {
    ...input,
    ...kiraSpotlightSessionOptions(input),
    ...kiraSpotlightSearchOptions(input),
  };
}

function kiraSpotlightSessionOptions<T>({
  defaultOpen = false,
  defaultQuery = "",
  scopes = [],
  defaultScope = "all",
  rememberRecent = false,
  maxRecent = 5,
  enableShortcut = false,
  shortcutInEditable = false,
}: KiraSpotlightProps<T>) {
  return {
    defaultOpen,
    defaultQuery,
    scopes,
    defaultScope,
    rememberRecent,
    maxRecent,
    enableShortcut,
    shortcutInEditable,
  };
}

function kiraSpotlightSearchOptions<T>({
  debounceMs = 200,
  minQueryLength = 1,
  items = [],
  groups = [],
  loading = false,
}: KiraSpotlightProps<T>) {
  return { debounceMs, minQueryLength, items, groups, loading };
}

function useKiraSpotlightSession({
  controlledOpen,
  defaultOpen,
  onOpenChange,
  controlledQuery,
  defaultQuery,
  onQueryChange,
  controlledScope,
  defaultScope,
}: {
  controlledOpen: boolean | undefined;
  defaultOpen: boolean;
  onOpenChange: KiraSpotlightProps["onOpenChange"];
  controlledQuery: string | undefined;
  defaultQuery: string;
  onQueryChange: KiraSpotlightProps["onQueryChange"];
  controlledScope: string | undefined;
  defaultScope: string;
}) {
  const [localOpen, setLocalOpen] = React.useState(defaultOpen);
  const [localQuery, setLocalQuery] = React.useState(defaultQuery);
  const [localScope, setLocalScope] = React.useState(defaultScope);

  const [retry, setRetry] = React.useState(0);
  const open = controlledOpen ?? localOpen;
  const query = controlledQuery ?? localQuery;
  const scope = controlledScope ?? localScope;
  const [previousOpen, setPreviousOpen] = React.useState(open);

  if (previousOpen !== open) {
    setPreviousOpen(open);

    if (open) {
      setRetry((value) => value + 1);
    } else {
      setLocalQuery("");
    }
  }

  const setOpen = React.useCallback(
    (next: boolean) => {
      if (controlledOpen === undefined) setLocalOpen(next);
      onOpenChange?.(next);
    },
    [controlledOpen, onOpenChange],
  );

  const setQuery = React.useCallback(
    (next: string) => {
      if (controlledQuery === undefined) setLocalQuery(next);
      onQueryChange?.(next);
    },
    [controlledQuery, onQueryChange],
  );

  return {
    open,
    query,
    scope,
    setOpen,
    setQuery,
    setLocalScope,
    retry,
    setRetry,
  };
}

function useSpotlightRemoteSearch<T>({
  search,
  open,
  query,
  scope,
  retry,
  minQueryLength,
  debounceMs,
}: Pick<
  ReturnType<typeof kiraSpotlightOptions<T>>,
  "search" | "minQueryLength" | "debounceMs"
> & { open: boolean; query: string; scope: string; retry: number }) {
  const hasSearch = search !== undefined;

  const activeSearch =
    hasSearch && open && query.trim().length >= Math.max(1, minQueryLength);

  const parameters = JSON.stringify([query, scope, retry, minQueryLength]);

  const [previousParameters, setPreviousParameters] =
    React.useState(parameters);

  const [requestVersion, setRequestVersion] = React.useState(0);

  if (previousParameters !== parameters) {
    setPreviousParameters(parameters);
    setRequestVersion((value) => value + 1);
  }

  const key = JSON.stringify([parameters, requestVersion]);

  const [snapshot, setSnapshot] = React.useState<{
    key: string;
    items: SpotlightItemType<T>[];
    error?: string;
  }>({ key: "", items: [] });

  const searchRef = React.useRef(search);
  React.useEffect(() => {
    searchRef.current = search;
  }, [search]);
  React.useEffect(() => {
    if (!activeSearch) return;
    const controller = new AbortController();

    const timer = window.setTimeout(
      async () => {
        try {
          const result = await searchRef.current?.(query, {
            signal: controller.signal,
            scope,
          });

          if (!controller.signal.aborted)
            setSnapshot({ key, items: uniqueItems(result ?? []) });
        } catch (error) {
          if (!controller.signal.aborted)
            setSnapshot({
              key,
              items: [],
              error:
                error instanceof Error
                  ? error.message
                  : "Search failed. Try again.",
            });
        }
      },
      Math.max(0, debounceMs),
    );

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [activeSearch, key, query, scope, debounceMs]);

  return { hasSearch, activeSearch, snapshot, key };
}

function useSpotlightRecents<T>({
  controlledRecent,
  rememberRecent,
  maxRecent,
  onRecentItemsChange,
  onSelect,
  onClearRecent,
}: Pick<
  ReturnType<typeof kiraSpotlightOptions<T>>,
  | "rememberRecent"
  | "maxRecent"
  | "onRecentItemsChange"
  | "onSelect"
  | "onClearRecent"
> & { controlledRecent: SpotlightItemType<T>[] | undefined }) {
  const [localRecent, setLocalRecent] = React.useState<SpotlightItemType<T>[]>(
    [],
  );

  const select = (item: SpotlightItemType<T>) => {
    if (rememberRecent || controlledRecent !== undefined) {
      const next = uniqueItems([
        item,
        ...(controlledRecent ?? localRecent),
      ]).slice(0, Math.max(0, maxRecent));

      if (controlledRecent === undefined) setLocalRecent(next);
      onRecentItemsChange?.(next);
    }

    onSelect?.(item);
  };

  const clearRecent = () => {
    if (controlledRecent === undefined) setLocalRecent([]);
    onRecentItemsChange?.([]);
    onClearRecent?.();
  };

  return { localRecent, select, clearRecent };
}

function SpotlightRemoteEmpty<T>({
  model,
}: {
  model: ReturnType<typeof useKiraSpotlightModel<T>>;
}) {
  const {
    activeSearch,
    snapshot,
    key,
    emptyContent,
    hasSearch,
    query,
    minQueryLength,
    setRetry,
  } = model;

  return activeSearch && snapshot.key === key && snapshot.error ? (
    <KiraEmpty
      state="error"
      size="sm"
      description={snapshot.error}
      primaryAction={{
        label: "Retry search",
        onClick: () => setRetry((value) => value + 1),
      }}
    />
  ) : (
    (emptyContent ?? (
      <EmptySearch
        size="sm"
        description={
          hasSearch && query.trim().length < Math.max(1, minQueryLength)
            ? `Type at least ${Math.max(1, minQueryLength)} character${minQueryLength === 1 ? "" : "s"} to search.`
            : "Try another phrase, change the scope, or clear your search."
        }
      />
    ))
  );
}

function spotlightShortcutEligible(event: KeyboardEvent) {
  return (
    !event.defaultPrevented &&
    !event.repeat &&
    !event.isComposing &&
    !event.altKey &&
    !event.shiftKey &&
    event.key.toLowerCase() === "k" &&
    (event.ctrlKey || event.metaKey)
  );
}

function spotlightShortcutTarget(
  target: EventTarget | null,
  shortcutInEditable: boolean,
) {
  if (!(target instanceof HTMLElement)) return true;

  const editable =
    target.isContentEditable ||
    Boolean(target.closest("input, textarea, select"));

  if (editable && !shortcutInEditable) return false;
  const dialog = target.closest('[role="dialog"]');

  return !dialog || Boolean(dialog.querySelector('[data-slot="spotlight"]'));
}

function spotlightScopedItems<T>(
  scope: string,
  items: SpotlightItemType<T>[],
  groups: SpotlightGroupType<T>[],
  recentItems: SpotlightItemType<T>[],
) {
  const matchesScope = (item: SpotlightItemType<T>) =>
    scope === "all" || item.scope === scope;

  const localItems = items.filter(matchesScope);

  const localGroups = groups.map((group) => ({
    ...group,
    items: group.items.filter(matchesScope),
  }));

  const recent = recentItems.filter(matchesScope);

  return { localItems, localGroups, recent };
}
