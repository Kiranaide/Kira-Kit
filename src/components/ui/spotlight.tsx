"use client";

import * as React from "react";
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { cva, type VariantProps } from "class-variance-authority";
import {
  IconSearch,
  IconCommand,
  IconLoader2,
  IconX,
  IconClock,
  IconCornerDownLeft,
} from "@tabler/icons-react";
import gsap from "gsap";
import { cn } from "@/lib/utils";
import { useAnnounce } from "@/hooks/use-announce";

const spotlightOverlayVariants = cva(
  "fixed inset-0 z-50 bg-black/50 backdrop-blur-sm data-[ending-style]:opacity-0 data-[starting-style]:opacity-0",
  {
    variants: {},
    defaultVariants: {},
  }
);

const spotlightContentVariants = cva(
  "fixed left-1/2 top-[20%] z-50 w-full max-w-xl -translate-x-1/2 rounded-xl border bg-popover shadow-2xl data-[ending-style]:scale-95 data-[ending-style]:opacity-0 data-[starting-style]:scale-95 data-[starting-style]:opacity-0",
  {
    variants: {
      size: {
        sm: "max-w-md",
        default: "max-w-xl",
        lg: "max-w-2xl",
        full: "max-w-4xl",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

const spotlightInputVariants = cva(
  "flex h-12 w-full bg-transparent px-4 py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      size: {
        sm: "h-10 text-sm",
        default: "h-12 text-sm",
        lg: "h-14 text-base",
        full: "h-14 text-base",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

const spotlightGroupVariants = cva("px-2 py-2", {
  variants: {},
  defaultVariants: {},
});

const spotlightItemVariants = cva(
  "relative flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm outline-none transition-colors",
  {
    variants: {
      selected: {
        true: "bg-accent text-accent-foreground",
        false: "hover:bg-accent/50",
      },
    },
    defaultVariants: {
      selected: false,
    },
  }
);

interface SpotlightItem<T = unknown> {
  id: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  shortcut?: string[];
  keywords?: string[];
  onSelect?: () => void;
  data?: T;
  disabled?: boolean;
}

interface SpotlightGroup<T = unknown> {
  id: string;
  label: string;
  items: SpotlightItem<T>[];
}

interface SpotlightProps<T = unknown> extends VariantProps<
  typeof spotlightContentVariants
> {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  groups?: SpotlightGroup<T>[];
  items?: SpotlightItem<T>[];
  recentItems?: SpotlightItem<T>[];
  onSearch?: (query: string) => void | Promise<void>;
  onSelect?: (item: SpotlightItem<T>) => void;
  loading?: boolean;
  placeholder?: string;
  emptyContent?: React.ReactNode;
  filter?: (item: SpotlightItem<T>, query: string) => boolean;
  disableFilter?: boolean;
  trigger?: React.ReactNode;
  showShortcutHint?: boolean;
  className?: string;
  children?: React.ReactNode;
}

function useReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = React.useState(false);

  React.useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return prefersReducedMotion;
}

interface SpotlightContextValue {
  query: string;
  setQuery: (query: string) => void;
  selectedIndex: number;
  setSelectedIndex: (index: number) => void;
  flatItems: SpotlightItem[];
  onItemSelect: (item: SpotlightItem) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
  listRef: React.RefObject<HTMLDivElement | null>;
}

const SpotlightContext = React.createContext<SpotlightContextValue | null>(
  null
);

function useSpotlightContext() {
  const context = React.useContext(SpotlightContext);

  if (!context) {
    throw new Error("Spotlight components must be used within Spotlight");
  }

  return context;
}

function SpotlightRoot<T>({
  open,
  onOpenChange,
  groups = [],
  items = [],
  recentItems = [],
  onSearch,
  onSelect,
  loading = false,
  placeholder = "Type a command or search...",
  emptyContent,
  filter,
  disableFilter = false,
  size,
  className,
  children,
}: SpotlightProps<T>) {
  const [query, setQuery] = React.useState("");
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const listRef = React.useRef<HTMLDivElement>(null);
  const contentRef = React.useRef<HTMLDivElement>(null);

  const reducedMotion = useReducedMotion();
  const { announce } = useAnnounce();

  const defaultFilter = React.useCallback(
    (item: SpotlightItem<T>, searchQuery: string): boolean => {
      const q = searchQuery.toLowerCase();

      return (
        item.label.toLowerCase().includes(q) ||
        (item.description?.toLowerCase().includes(q) ?? false) ||
        (item.keywords?.some((k) => k.toLowerCase().includes(q)) ?? false)
      );
    },
    []
  );

  const allItems = React.useMemo((): SpotlightItem<T>[] => {
    const fromGroups = groups.flatMap((g) => g.items);

    return [...fromGroups, ...items];
  }, [groups, items]);

  const filteredItems = React.useMemo((): SpotlightItem<T>[] => {
    if (!query) {
      return recentItems.length > 0 ? recentItems : allItems;
    }

    if (disableFilter) return allItems;
    const filterFn = filter || defaultFilter;

    return allItems.filter((item) => filterFn(item, query));
  }, [query, allItems, recentItems, disableFilter, filter, defaultFilter]);

  const filteredGroups = React.useMemo((): SpotlightGroup<T>[] => {
    if (!query) {
      if (recentItems.length > 0) {
        return [{ id: "recent", label: "Recent", items: recentItems }];
      }

      return groups;
    }

    if (disableFilter) return groups;
    const filterFn = filter || defaultFilter;

    return groups
      .map((g) => ({
        ...g,
        items: g.items.filter((item) => filterFn(item, query)),
      }))
      .filter((g) => g.items.length > 0);
  }, [query, groups, recentItems, disableFilter, filter, defaultFilter]);

  React.useEffect(() => {
    setSelectedIndex(0);
  }, [query, filteredItems.length]);

  React.useEffect(() => {
    if (query && open) {
      const count = filteredItems.length;
      announce(
        count === 0
          ? "No results found"
          : `${count} result${count === 1 ? "" : "s"} found`
      );
    }
  }, [filteredItems.length, query, open, announce]);

  React.useEffect(() => {
    onSearch?.(query);
  }, [query, onSearch]);

  const handleItemSelect = React.useCallback(
    (item: SpotlightItem<T>) => {
      if (item.disabled) return;
      item.onSelect?.();
      onSelect?.(item);
      onOpenChange?.(false);
      setQuery("");
    },
    [onSelect, onOpenChange]
  );

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent) => {
      const itemCount = filteredItems.length;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((prev) => (prev + 1) % itemCount);
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((prev) => (prev - 1 + itemCount) % itemCount);
          break;
        case "Enter":
          e.preventDefault();

          if (filteredItems[selectedIndex]) {
            handleItemSelect(filteredItems[selectedIndex]);
          }

          break;
        case "Escape":
          e.preventDefault();
          onOpenChange?.(false);
          break;
        case "Home":
          e.preventDefault();
          setSelectedIndex(0);
          break;
        case "End":
          e.preventDefault();
          setSelectedIndex(Math.max(0, itemCount - 1));
          break;
      }
    },
    [filteredItems, selectedIndex, handleItemSelect, onOpenChange]
  );

  React.useEffect(() => {
    if (!listRef.current) return;

    const selectedElement = listRef.current.querySelector(
      `[data-spotlight-index="${selectedIndex}"]`
    );

    selectedElement?.scrollIntoView({ block: "nearest" });
  }, [selectedIndex]);

  React.useEffect(() => {
    if (!contentRef.current || reducedMotion) return;

    if (open) {
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, scale: 0.95, y: -10 },
        { opacity: 1, scale: 1, y: 0, duration: 0.2, ease: "power2.out" }
      );
    }
  }, [open, reducedMotion]);

  React.useEffect(() => {
    if (!listRef.current || reducedMotion || !open) return;

    const items = listRef.current.querySelectorAll("[data-spotlight-item]");
    gsap.fromTo(
      items,
      { opacity: 0, x: -10 },
      {
        opacity: 1,
        x: 0,
        duration: 0.15,
        stagger: 0.02,
        ease: "power2.out",
      }
    );
  }, [open, filteredItems.length, reducedMotion]);

  const contextValue = React.useMemo(
    () => ({
      query,
      setQuery,
      selectedIndex,
      setSelectedIndex,
      flatItems: filteredItems as SpotlightItem[],
      onItemSelect: handleItemSelect as (item: SpotlightItem) => void,
      inputRef,
      listRef,
    }),
    [query, selectedIndex, filteredItems, handleItemSelect]
  );

  return (
    <SpotlightContext.Provider value={contextValue}>
      <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
        <DialogPrimitive.Portal>
          <DialogPrimitive.Backdrop
            className={cn(spotlightOverlayVariants())}
          />
          <DialogPrimitive.Popup
            ref={contentRef}
            className={cn(spotlightContentVariants({ size }), className)}
            aria-label="Command palette"
          >
            <div className="flex items-center border-b px-3" role="search">
              {loading ? (
                <IconLoader2
                  className="mr-2 h-4 w-4 shrink-0 animate-spin text-muted-foreground"
                  aria-hidden="true"
                />
              ) : (
                <IconSearch
                  className="mr-2 h-4 w-4 shrink-0 text-muted-foreground"
                  aria-hidden="true"
                />
              )}
              <input
                ref={inputRef}
                type="text"
                role="combobox"
                aria-autocomplete="list"
                aria-expanded={open}
                aria-controls="spotlight-listbox"
                aria-activedescendant={
                  filteredItems[selectedIndex]
                    ? `spotlight-item-${filteredItems[selectedIndex].id}`
                    : undefined
                }
                aria-label="Search commands"
                placeholder={placeholder}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                className={cn(spotlightInputVariants({ size }))}
                autoComplete="off"
                autoCorrect="off"
                spellCheck="false"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="ml-2 rounded-md p-1 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  aria-label="Clear search"
                >
                  <IconX className="h-4 w-4" aria-hidden="true" />
                </button>
              )}
            </div>

            <div
              ref={listRef}
              id="spotlight-listbox"
              role="listbox"
              aria-label="Search results"
              className="max-h-[400px] overflow-y-auto p-2"
            >
              {children ? (
                children
              ) : filteredItems.length === 0 ? (
                <div className="py-8 text-center text-sm text-muted-foreground">
                  {emptyContent || "No results found."}
                </div>
              ) : filteredGroups.length > 0 ? (
                filteredGroups.map((group) => (
                  <SpotlightGroup key={group.id} label={group.label}>
                    {group.items.map((item) => {
                      const flatIndex = filteredItems.findIndex(
                        (i) => i.id === item.id
                      );

                      return (
                        <SpotlightItem
                          key={item.id}
                          item={item as SpotlightItem}
                          index={flatIndex}
                        />
                      );
                    })}
                  </SpotlightGroup>
                ))
              ) : (
                filteredItems.map((item, index) => (
                  <SpotlightItem
                    key={item.id}
                    item={item as SpotlightItem}
                    index={index}
                  />
                ))
              )}
            </div>

            <div className="flex items-center justify-between border-t px-3 py-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <kbd className="rounded border bg-muted px-1.5 py-0.5 font-mono text-[10px]">
                    ↑↓
                  </kbd>
                  navigate
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="rounded border bg-muted px-1.5 py-0.5 font-mono text-[10px]">
                    <IconCornerDownLeft className="h-3 w-3" />
                  </kbd>
                  select
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="rounded border bg-muted px-1.5 py-0.5 font-mono text-[10px]">
                    esc
                  </kbd>
                  close
                </span>
              </div>
              <div className="flex items-center gap-1">
                <IconCommand className="h-3 w-3" />
                <span>K to open</span>
              </div>
            </div>
          </DialogPrimitive.Popup>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
    </SpotlightContext.Provider>
  );
}

interface SpotlightGroupProps {
  label: string;
  children: React.ReactNode;
  className?: string;
}

function SpotlightGroup({ label, children, className }: SpotlightGroupProps) {
  return (
    <div
      className={cn(spotlightGroupVariants(), className)}
      role="group"
      aria-label={label}
    >
      <div className="mb-2 px-2 text-xs font-medium text-muted-foreground">
        {label}
      </div>
      {children}
    </div>
  );
}

interface SpotlightItemComponentProps {
  item: SpotlightItem;
  index: number;
  className?: string;
}

function SpotlightItem({
  item,
  index,
  className,
}: SpotlightItemComponentProps) {
  const { selectedIndex, setSelectedIndex, onItemSelect } =
    useSpotlightContext();

  const isSelected = selectedIndex === index;

  return (
    <div
      id={`spotlight-item-${item.id}`}
      role="option"
      aria-selected={isSelected}
      aria-disabled={item.disabled}
      data-spotlight-item
      data-spotlight-index={index}
      className={cn(
        spotlightItemVariants({ selected: isSelected }),
        item.disabled && "cursor-not-allowed opacity-50",
        className
      )}
      onClick={() => !item.disabled && onItemSelect(item)}
      onMouseEnter={() => setSelectedIndex(index)}
    >
      {item.icon && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border bg-background">
          {item.icon}
        </div>
      )}
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="truncate font-medium">{item.label}</span>
        {item.description && (
          <span className="truncate text-xs text-muted-foreground">
            {item.description}
          </span>
        )}
      </div>
      {item.shortcut && (
        <div className="ml-auto flex shrink-0 items-center gap-1">
          {item.shortcut.map((key, i) => (
            <kbd
              key={i}
              className="rounded border bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground"
            >
              {key}
            </kbd>
          ))}
        </div>
      )}
    </div>
  );
}

interface SpotlightTriggerProps {
  children?: React.ReactNode;
  className?: string;
  showShortcut?: boolean;
  asChild?: boolean;
}

function SpotlightTrigger({
  children,
  className,
  showShortcut = true,
}: SpotlightTriggerProps) {
  return (
    <DialogPrimitive.Trigger
      className={cn(
        "inline-flex items-center gap-2 rounded-lg border bg-background px-3 py-2 text-sm text-muted-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className
      )}
    >
      <IconSearch className="h-4 w-4" aria-hidden="true" />
      {children || <span>Search...</span>}
      {showShortcut && (
        <kbd className="pointer-events-none ml-auto hidden rounded border bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground sm:inline-block">
          <span className="text-xs">⌘</span>K
        </kbd>
      )}
    </DialogPrimitive.Trigger>
  );
}

interface LegacySpotlightSearchProps extends React.ComponentPropsWithoutRef<"div"> {
  onSearch?: (value: string) => void;
  children?: React.ReactNode;
}

const SpotlightSearch = React.forwardRef<
  HTMLDivElement,
  LegacySpotlightSearchProps
>(({ className, onSearch, children, ...props }, ref) => {
  const [query, setQuery] = React.useState("");

  return (
    <div
      ref={ref}
      data-slot="spotlight-search"
      className={cn(
        "max-h-[600px] rounded-lg border bg-popover shadow-lg",
        className
      )}
      {...props}
    >
      <div className="flex items-center border-b px-3" role="search">
        <IconSearch
          className="mr-2 h-4 w-4 shrink-0 text-muted-foreground"
          aria-hidden="true"
        />
        <input
          type="text"
          placeholder="Search..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            onSearch?.(e.target.value);
          }}
          className="flex h-11 w-full bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Search"
        />
      </div>
      <div className="max-h-[500px] overflow-y-auto">{children}</div>
    </div>
  );
});

SpotlightSearch.displayName = "SpotlightSearch";

interface LegacySpotlightRecentProps {
  items: string[];
  onItemClick?: (item: string) => void;
}

const SpotlightRecent = React.forwardRef<
  HTMLDivElement,
  LegacySpotlightRecentProps
>(({ items, onItemClick }, ref) => {
  if (items.length === 0) return null;

  return (
    <div ref={ref} className="px-2 py-4">
      <div className="mb-2 px-2 text-xs font-medium text-muted-foreground">
        Recent searches
      </div>
      {items.map((item) => (
        <div
          key={item}
          className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground"
          onClick={() => onItemClick?.(item)}
        >
          <IconClock className="mr-2 h-4 w-4" aria-hidden="true" />
          <span>{item}</span>
        </div>
      ))}
    </div>
  );
});

SpotlightRecent.displayName = "SpotlightRecent";

interface LegacySpotlightSuggestionsProps {
  items: string[];
  onItemClick?: (item: string) => void;
}

const SpotlightSuggestions = React.forwardRef<
  HTMLDivElement,
  LegacySpotlightSuggestionsProps
>(({ items, onItemClick }, ref) => {
  if (items.length === 0) return null;

  return (
    <div ref={ref} className="px-2 py-2">
      <div className="mb-2 px-2 text-xs font-medium text-muted-foreground">
        Suggestions
      </div>
      {items.map((item) => (
        <div
          key={item}
          className="cursor-pointer rounded-md px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground"
          onClick={() => onItemClick?.(item)}
        >
          <span>{item}</span>
        </div>
      ))}
    </div>
  );
});

SpotlightSuggestions.displayName = "SpotlightSuggestions";

interface LegacySpotlightResultsProps {
  children?: React.ReactNode;
}

const SpotlightResults = React.forwardRef<
  HTMLDivElement,
  LegacySpotlightResultsProps
>(({ children }, ref) => {
  return (
    <div ref={ref} className="px-2 py-2">
      {children}
    </div>
  );
});

SpotlightResults.displayName = "SpotlightResults";

const Spotlight = Object.assign(SpotlightRoot, {
  Trigger: SpotlightTrigger,
  Group: SpotlightGroup,
  Item: SpotlightItem,
});

export {
  Spotlight,
  SpotlightRoot,
  SpotlightTrigger,
  SpotlightGroup,
  SpotlightItem,
  SpotlightSearch,
  SpotlightRecent,
  SpotlightSuggestions,
  SpotlightResults,
  spotlightOverlayVariants,
  spotlightContentVariants,
  spotlightInputVariants,
  spotlightGroupVariants,
  spotlightItemVariants,
};

export type {
  SpotlightProps,
  SpotlightItem as SpotlightItemType,
  SpotlightGroup as SpotlightGroupType,
  SpotlightGroupProps,
  SpotlightTriggerProps,
  LegacySpotlightSearchProps as SpotlightSearchProps,
  LegacySpotlightRecentProps as SpotlightRecentProps,
  LegacySpotlightSuggestionsProps as SpotlightSuggestionsProps,
  LegacySpotlightResultsProps as SpotlightResultsProps,
};
