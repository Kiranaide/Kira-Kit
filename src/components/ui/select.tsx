"use client";

import * as React from "react";
import { Select as SelectPrimitive } from "@base-ui/react/select";
import { Combobox as ComboboxPrimitive } from "@base-ui/react/combobox";
import { useVirtualizer } from "@tanstack/react-virtual";

import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import {
  IconCheck,
  IconChevronUp,
  IconChevronDown,
  IconX,
  IconSearch,
  IconLoader2,
} from "@tabler/icons-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const Select = SelectPrimitive.Root;

function SelectGroup({ className, ...props }: SelectPrimitive.Group.Props) {
  return (
    <SelectPrimitive.Group
      data-slot="select-group"
      className={cn("scroll-my-1 p-1", className)}
      {...props}
    />
  );
}

function SelectValue({ className, ...props }: SelectPrimitive.Value.Props) {
  return (
    <SelectPrimitive.Value
      data-slot="select-value"
      className={cn("flex flex-1 text-left", className)}
      {...props}
    />
  );
}

function SelectTrigger({
  className,
  size = "default",
  children,
  ...props
}: SelectPrimitive.Trigger.Props & {
  size?: "sm" | "default";
}) {
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      data-size={size}
      className={cn(
        "flex w-full items-center justify-between rounded-lg border border-input bg-transparent px-2 py-1 text-sm transition-colors select-none gap-1.5",
        "dark:bg-input/30 dark:hover:bg-input/50",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "data-placeholder:text-muted-foreground",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 aria-invalid:ring-[3px]",
        "data-[size=default]:h-8 data-[size=sm]:h-7 data-[size=sm]:rounded-[min(var(--radius-md),10px)]",
        "*:data-[slot=select-value]:flex *:data-[slot=select-value]:gap-1.5 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:items-center",
        "[&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon
        data-slot="select-icon"
        render={
          <IconChevronDown className="text-muted-foreground size-4 pointer-events-none transition-transform data-popup-open:rotate-180" />
        }
      />
    </SelectPrimitive.Trigger>
  );
}

function SelectContent({
  className,
  children,
  side = "bottom",
  sideOffset = 4,
  align = "center",
  alignOffset = 0,
  alignItemWithTrigger = true,
  ...props
}: SelectPrimitive.Popup.Props &
  Pick<
    SelectPrimitive.Positioner.Props,
    "align" | "alignOffset" | "side" | "sideOffset" | "alignItemWithTrigger"
  >) {
  const reducedMotion = useReducedMotion();

  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Positioner
        data-slot="select-positioner"
        side={side}
        sideOffset={sideOffset}
        align={align}
        alignOffset={alignOffset}
        alignItemWithTrigger={alignItemWithTrigger}
        className="isolate z-50"
      >
        <SelectPrimitive.Popup
          data-slot="select-content"
          className={cn(
            "bg-popover text-popover-foreground ring-foreground/10 min-w-36 rounded-lg shadow-md ring-1 duration-100 relative isolate z-50 max-h-(--available-height) w-(--anchor-width) origin-(--transform-origin) overflow-x-hidden overflow-y-auto",
            !reducedMotion &&
              "data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 data-closed:zoom-out-95 data-open:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
            className,
          )}
          {...props}
        >
          <SelectScrollUpButton />
          <SelectPrimitive.List data-slot="select-list">
            {children}
          </SelectPrimitive.List>
          <SelectScrollDownButton />
        </SelectPrimitive.Popup>
      </SelectPrimitive.Positioner>
    </SelectPrimitive.Portal>
  );
}

function SelectLabel({
  className,
  ...props
}: SelectPrimitive.GroupLabel.Props) {
  return (
    <SelectPrimitive.GroupLabel
      data-slot="select-label"
      className={cn("text-muted-foreground px-1.5 py-1 text-xs", className)}
      {...props}
    />
  );
}

function SelectItem({
  className,
  children,
  ...props
}: SelectPrimitive.Item.Props) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        "focus:bg-accent focus:text-accent-foreground not-data-[variant=destructive]:focus:**:text-accent-foreground gap-1.5 rounded-md py-1 pr-8 pl-1.5 text-sm [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2 relative flex w-full cursor-default items-center outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
        className,
      )}
      {...props}
    >
      <SelectPrimitive.ItemText
        data-slot="select-item-text"
        className="flex flex-1 gap-2 shrink-0 whitespace-nowrap"
      >
        {children}
      </SelectPrimitive.ItemText>
      <SelectPrimitive.ItemIndicator
        data-slot="select-item-indicator"
        render={
          <span className="pointer-events-none absolute right-2 flex size-4 items-center justify-center" />
        }
      >
        <IconCheck className="pointer-events-none" />
      </SelectPrimitive.ItemIndicator>
    </SelectPrimitive.Item>
  );
}

function SelectSeparator({
  className,
  ...props
}: SelectPrimitive.Separator.Props) {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className={cn("bg-border -mx-1 my-1 h-px pointer-events-none", className)}
      {...props}
    />
  );
}

function SelectScrollUpButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpArrow>) {
  return (
    <SelectPrimitive.ScrollUpArrow
      data-slot="select-scroll-up-button"
      className={cn(
        "bg-popover z-10 flex cursor-default items-center justify-center py-1 [&_svg:not([class*='size-'])]:size-4 top-0 w-full",
        className,
      )}
      {...props}
    >
      <IconChevronUp />
    </SelectPrimitive.ScrollUpArrow>
  );
}

function SelectScrollDownButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownArrow>) {
  return (
    <SelectPrimitive.ScrollDownArrow
      data-slot="select-scroll-down-button"
      className={cn(
        "bg-popover z-10 flex cursor-default items-center justify-center py-1 [&_svg:not([class*='size-'])]:size-4 bottom-0 w-full",
        className,
      )}
      {...props}
    >
      <IconChevronDown />
    </SelectPrimitive.ScrollDownArrow>
  );
}

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface GroupedSelectOption<T extends SelectOption = SelectOption> {
  label: string;
  options: T[];
}

function isGroupedOptions<T extends SelectOption>(
  options: T[] | GroupedSelectOption<T>[],
): options is GroupedSelectOption<T>[] {
  // SAFETY: entries can be the string[] shorthand; `in` throws on primitives.
  // toString parsing establishes the object contract for the `in` check below.
  const first = options[0] as unknown;

  return (
    options.length > 0 &&
    Object.prototype.toString.call(first) === "[object Object]" &&
    Object.hasOwn(first, "options")
  );
}

function flattenOptions<T extends SelectOption>(
  options: T[] | GroupedSelectOption<T>[],
): T[] {
  if (isGroupedOptions(options)) {
    return options.flatMap((group) => group.options);
  }

  return options;
}

/**
 * Maps the `string[]` shorthand entry to a full option object.
 */
function stringToOption<T extends SelectOption>(label: string): T {
  // SAFETY: T extends SelectOption, and { value: label, label } satisfies
  // that shape for the string-shorthand path.
  return { value: label, label } as T;
}

const isStringValue = (
  v: string | ComboboxEmittedValue["value"],
): v is string =>
  // SAFETY: the emitted value contract is `string | {value: string}`; this
  // predicate IS the parse for the string branch of that union.
  Object.prototype.toString.call(v) === "[object String]";

/**
 * Accepts the `string[]` shorthand (`["Data1", "Data2"]`) alongside option
 * objects and groups; strings become `{ value: label, label }`.
 */
function normalizeOptions<T extends SelectOption>(
  options: (T | string)[] | GroupedSelectOption<T>[] | readonly string[],
): T[] | GroupedSelectOption<T>[] {
  // SAFETY: option objects and groups flow through unmodified; only the
  // string[] shorthand is rewritten below.
  if (options.length === 0 || isGroupedOptions(options as T[])) {
    // SAFETY: groups and option objects pass through as-is.
    return options as T[] | GroupedSelectOption<T>[];
  }

  const first: unknown = options[0];

  if (isStringValue(first)) {
    // SAFETY: the first entry is a string and the input is a flat array, so
    // every entry is a string; each becomes { value: label, label }.
    const labels = options as readonly string[];

    return labels.map(stringToOption);
  }

  // SAFETY: option objects carry their own `value` and flow through unmodified.
  return options as T[];
}

interface ComboboxFieldProps<T extends SelectOption = SelectOption> {
  options: T[] | GroupedSelectOption<T>[];
  value?: string | string[];
  defaultValue?: string | string[];
  onChange?: (
    value: string | string[],
    selectedOptions: T | T[] | null,
  ) => void;
  multiple?: boolean;
  searchable?: boolean;
  creatable?: boolean;
  async?: boolean;
  onSearch?: (query: string) => Promise<T[]>;
  debounceMs?: number;
  cacheOptions?: boolean;
  onCreateOption?: (inputValue: string) => void;
  createLabel?: string;
  placeholder?: string;
  disabled?: boolean;
  size?: "sm" | "default";
  className?: string;
  maxDisplayedTags?: number;
  showSearchIcon?: boolean;
  fuzzyMatching?: boolean;
  filterFn?: (option: T, query: string) => boolean;
  virtualized?: boolean;
  required?: boolean;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
  "aria-invalid"?: boolean;
  name?: string;
  onOpenChange?: (open: boolean) => void;
  onSearchChange?: (query: string) => void;
  onClearAll?: () => void;
  variant?: "default" | "ghost" | "outline";
  leftIcon?: React.ReactNode;
  hideChevron?: boolean;
  emptyMessage?: string | React.ReactNode;
  loadingMessage?: string | React.ReactNode;
  searchingMessage?: string | React.ReactNode;
}

function subsequenceMatch(label: string, query: string): boolean {
  let li = 0;
  const l = label.toLowerCase();
  const q = query.toLowerCase();

  for (let qi = 0; qi < q.length; qi++) {
    li = l.indexOf(q[qi], li);

    if (li === -1) {
      return false;
    }

    li++;
  }

  return true;
}

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = React.useState<T>(value);

  React.useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
/* oxlint-disable complexity -- megacomponent dispatching one API over five modes (basic/multi/async/creatable/searchable); branching is the feature, not accidental complexity */

function ComboboxField<T extends SelectOption = SelectOption>({
  options,
  value,
  defaultValue,
  onChange,
  multiple = false,
  searchable = true,
  creatable = false,
  async = false,
  onSearch,
  debounceMs = 300,
  cacheOptions = true,
  onCreateOption,
  createLabel = "Create",
  placeholder = "Select...",
  disabled = false,
  size = "default",
  className,
  maxDisplayedTags = 3,
  showSearchIcon = true,
  fuzzyMatching = true,
  filterFn,
  virtualized = false,
  required,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledby,
  "aria-describedby": ariaDescribedby,
  "aria-invalid": ariaInvalid,
  name,
  onOpenChange,
  onSearchChange,
  onClearAll: _onClearAll,
  variant = "default",
  leftIcon,
  hideChevron = false,
  emptyMessage,
  loadingMessage,
  searchingMessage,
}: ComboboxFieldProps<T>) {
  const reducedMotion = useReducedMotion();
  const filterUtils = ComboboxPrimitive.useFilter();

  const [inputValue, setInputValue] = React.useState("");
  const [asyncOptions, setAsyncOptions] = React.useState<T[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);

  const [popupEl, setPopupEl] = React.useState<HTMLDivElement | null>(null);
  const cacheRef = React.useRef<Map<string, T[]>>(new Map());

  // Sync options from props during render (not an effect) so a changing
  // `options` prop updates the list without a cascading render.
  const [prevOptions, setPrevOptions] = React.useState(options);

  if (!async && options !== prevOptions) {
    setPrevOptions(options);
  }

  const data = React.useMemo(() => {
    if (async) {
      // Async results replace the (initially empty) options prop.
      return asyncOptions;
    }

    if (isGroupedOptions(options)) {
      return options.map((g) => ({ label: g.label, items: g.options }));
    }

    return options;
  }, [async, asyncOptions, options]);

  const collection = React.useMemo(
    () =>
      ComboboxPrimitive.createItems(data, {
        getValue: (o: T) => o.value,
        getLabel: (o: T) => o.label,
      }),
    [data],
  );

  const flat = React.useMemo(() => flattenOptions(options), [options]);

  const flatOptionsList = React.useMemo(() => {
    if (async) {
      return asyncOptions;
    }

    return flat;
  }, [async, asyncOptions, flat]);

  // oxlint-disable-next-line complexity -- normalize string | string[] contract to a list
  const selectedOptions = React.useMemo(() => {
    if (value === undefined || value === null) {
      // SAFETY: T[] is the empty option list shape; nothing is cast.
      return [] as T[];
    }

    const values: string[] = [];

    if (Array.isArray(value)) {
      values.push(...value);
    } else {
      values.push(value);
    }

    return values.flatMap((v) => {
      const found = flatOptionsList.find((o) => o.value === v);

      if (found) {
        return [found];
      }

      return [];
    });
  }, [value, flatOptionsList]);

  const debouncedQuery = useDebounce(inputValue, debounceMs);

  React.useEffect(() => {
    if (!async || !onSearch) return;

    if (!debouncedQuery && !isOpen) {
      return;
    }

    if (cacheOptions && cacheRef.current.has(debouncedQuery)) {
      const cached = cacheRef.current.get(debouncedQuery);
      setAsyncOptions(cached || []);

      return;
    }

    let cancelled = false;
    setIsLoading(true);

    onSearch(debouncedQuery)
      .then((results) => {
        if (!cancelled) {
          // SAFETY: onSearch's Promise resolves to T[] per the KiraSelectProps
          // contract; the generic parameter erases it inside the hook.
          setAsyncOptions(results as T[]);

          if (cacheOptions) {
            // SAFETY: results is T[] per the onSearch contract (same as above).
            cacheRef.current.set(debouncedQuery, results as T[]);
          }

          setIsLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setAsyncOptions([]);
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [debouncedQuery, isOpen, async, onSearch, cacheOptions]);

  interface ComboboxEmittedValue {
    value: string;
    label?: string;
  }

  interface ComboboxFilteredGroup<T> {
    label: string;
    items: T[];
  }

  type ComboboxEmitted = string | ComboboxEmittedValue | null;

  const isStringEmitted = (item: ComboboxEmitted): item is string =>
    // SAFETY: discriminating the union by its string member; the object
    // member always has `value: string`, so a bare string can only be the
    // string branch.
    isStringValue(item);

  const toValueString = (item: ComboboxEmitted): string => {
    if (isStringEmitted(item)) {
      return item;
    }

    if (item !== null && isStringValue(item.value)) {
      return item.value;
    }

    return String(item);
  };

  type RawComboboxEventValue = ComboboxEmitted | ComboboxEmitted[];

  const handleValueChange = React.useCallback(
    (next: RawComboboxEventValue, eventDetails: { cancel: () => void }) => {
      // Base UI's onValueChange delivers: derived string(s) from the
      // createItems() collection, or the create pseudo-item's { value, label }
      // object, or null (clear). Normalize to a flat list of strings.
      const rawList: ComboboxEmitted[] = (() => {
        if (Array.isArray(next)) {
          return next;
        }

        if (next !== null && next !== undefined) {
          return [next];
        }

        return [];
      })();

      const nextList: string[] = rawList.map(toValueString);

      const trimmed = inputValue.trim();

      const isCreatePick =
        creatable &&
        nextList.length === 1 &&
        nextList[0] === trimmed &&
        trimmed !== "" &&
        !flat.some((o) => o.value === nextList[0]);

      if (isCreatePick) {
        onCreateOption?.(nextList[0]);
        setInputValue("");
        setIsOpen(false);
        onOpenChange?.(false);
        eventDetails.cancel();

        return;
      }

      if (multiple) {
        onChange?.(
          nextList,
          flat.filter((o) => nextList.includes(o.value)),
        );
      } else {
        const v = nextList[0] ?? "";
        onChange?.(v, flat.find((o) => o.value === v) ?? null);
      }
    },
    [
      multiple,
      flat,
      creatable,
      inputValue,
      onCreateOption,
      onChange,
      onOpenChange,
    ],
  );

  const handleInputValueChange = React.useCallback(
    (next: string) => {
      setInputValue(next);
      onSearchChange?.(next);
    },
    [onSearchChange],
  );

  const handleOpenChange = React.useCallback(
    (open: boolean) => {
      setIsOpen(open);
      onOpenChange?.(open);
    },
    [onOpenChange],
  );

  // When closing, clear the query so reopening shows the full list and the
  // selected label doesn't stick in the input (pre-rebuild bug fix).
  const [prevIsOpen, setPrevIsOpen] = React.useState(false);

  if (prevIsOpen !== isOpen) {
    setPrevIsOpen(isOpen);

    if (!isOpen && inputValue) {
      setInputValue("");
    }
  }

  const trimmedQuery = inputValue.trim();

  const showCreateOption =
    creatable &&
    trimmedQuery !== "" &&
    !flatOptionsList.some(
      (opt) => opt.label.toLowerCase() === trimmedQuery.toLowerCase(),
    );

  const subsequenceFilter = React.useMemo(
    () => (item: T, query: string) => subsequenceMatch(item.label, query),
    [],
  );

  const resolveFilter = () => {
    if (async) {
      // Base UI disables internal filtering with `null` (not `false`): async
      // results arrive pre-filtered by the consumer's onSearch.
      return null;
    }

    if (filterFn) {
      return filterFn;
    }

    if (fuzzyMatching) {
      return subsequenceFilter;
    }

    return filterUtils.contains;
  };

  const filterFn_ = resolveFilter();

  // === GSAP stagger (open only, never while typing) ===
  useGSAP(
    () => {
      if (!isOpen || !popupEl || isLoading) return;

      if (reducedMotion) return;

      // Base UI syncs item indices right after open; target the post-sync DOM.
      let mm: gsap.MatchMedia | undefined;

      const raf = requestAnimationFrame(() => {
        mm = gsap.matchMedia();
        mm.add("(prefers-reduced-motion: no-preference)", () => {
          const items = popupEl.querySelectorAll(
            "[data-slot=select-field-option], [data-slot=select-field-create]",
          );

          if (items.length === 0) {
            return;
          }

          gsap.from(items, {
            y: -10,
            opacity: 0,
            duration: 0.2,
            ease: "power2.out",
            stagger: 0.03,
          });
        });
      });

      return () => {
        cancelAnimationFrame(raf);
        mm?.revert();
      };
    },
    { dependencies: [isOpen, popupEl], revertOnUpdate: true },
  );

  const triggerClasses = cn(
    "flex flex-wrap items-center gap-1 min-h-8 px-2 py-1 rounded-lg border bg-transparent cursor-text w-full transition-colors",
    variant === "default" &&
      "border-input dark:bg-input/30 dark:hover:bg-input/50",
    variant === "ghost" && "border-transparent hover:bg-muted",
    variant === "outline" && "border-input bg-transparent hover:bg-muted/50",
    "focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px]",
    ariaInvalid &&
      "border-destructive ring-destructive/20 focus-within:border-destructive focus-within:ring-destructive/30",
    size === "sm" && "min-h-7 rounded-[min(var(--radius-md),10px)]",
    disabled && "opacity-50 pointer-events-none cursor-not-allowed",
    className,
  );

  const popupClasses = cn(
    "z-50 max-h-60 overflow-auto rounded-lg border border-border bg-popover p-1 shadow-md min-w-36 w-(--anchor-width)",
    !reducedMotion &&
      "data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 data-closed:zoom-out-95 data-open:zoom-in-95",
  );

  const itemClasses = cn(
    "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm outline-none cursor-pointer",
    "data-highlighted:bg-accent data-highlighted:text-accent-foreground",
    "data-selected:font-medium",
    "data-disabled:opacity-50 data-disabled:pointer-events-none data-disabled:cursor-not-allowed",
  );

  const virtualItems = useVirtualizer({
    count: flatOptionsList.length,
    getScrollElement: () => popupEl,
    estimateSize: () => 36,
    overscan: 8,
    getItemKey: (i) => flatOptionsList[i].value,
    enabled: virtualized,
  });

  const displayedTags = selectedOptions.slice(0, maxDisplayedTags);
  const remainingCount = selectedOptions.length - maxDisplayedTags;

  const renderOption = (option: T) => (
    <ComboboxPrimitive.Item
      key={option.value}
      data-slot="select-field-option"
      value={option.value}
      disabled={option.disabled}
      className={itemClasses}
    >
      {multiple && (
        <div
          className={cn(
            "h-4 w-4 border rounded flex items-center justify-center shrink-0",
            option.value !== undefined && "border-input",
          )}
        >
          <ComboboxPrimitive.ItemIndicator>
            <IconCheck className="h-3 w-3 text-primary-foreground bg-primary" />
          </ComboboxPrimitive.ItemIndicator>
        </div>
      )}
      <span className="flex-1 text-left truncate">{option.label}</span>
      {!multiple && (
        <ComboboxPrimitive.ItemIndicator>
          <IconCheck className="h-4 w-4 text-primary shrink-0" />
        </ComboboxPrimitive.ItemIndicator>
      )}
    </ComboboxPrimitive.Item>
  );

  const useGroupedRendering =
    isGroupedOptions(options) && !virtualized && !async;

  // Renders the Base UI-derived (filtered) items inside the popup. Lives in a
  // child component because useFilteredItems is a context hook.
  function FilteredItemsList({ grouped }: { grouped: boolean }) {
    // SAFETY: filteredItems holds source items (T) — with a createItems()
    // collection the root filters source items via the collection's getLabel.
    const filtered = ComboboxPrimitive.useFilteredItems<T>();

    if (grouped) {
      // Grouped data: Base UI returns filtered groups ({ label, items });
      // render labels + items from it so filtering respects grouping.
      // SAFETY: grouped input produces Group-shaped entries with our own
      // { label, items } mapping, so every entry carries label + T items.
      const groups = filtered as ComboboxFilteredGroup<T>[];

      return (
        <>
          {groups.map((group) => (
            <ComboboxPrimitive.Group key={group.label}>
              <ComboboxPrimitive.GroupLabel
                data-slot="select-field-group-label"
                className="text-muted-foreground px-1.5 py-1 text-xs"
              >
                {group.label}
              </ComboboxPrimitive.GroupLabel>
              {group.items.map(renderOption)}
            </ComboboxPrimitive.Group>
          ))}
        </>
      );
    }

    return <>{filtered.map(renderOption)}</>;
  }

  const inputPlaceholder = (() => {
    if (multiple && selectedOptions.length > 0) {
      return "";
    }

    return placeholder;
  })();

  const statusText = (() => {
    if (isLoading) {
      return loadingMessage || "Loading...";
    }

    return "";
  })();

  const emptyText = (() => {
    if (emptyMessage) {
      return emptyMessage;
    }

    if (trimmedQuery) {
      return "No results found";
    }

    if (async) {
      return searchingMessage || "Type to search...";
    }

    return "No options";
  })();

  const createOptionValue = { value: trimmedQuery, label: trimmedQuery };

  const renderVirtualizedItems = () => (
    <div
      style={{
        height: virtualItems.getTotalSize(),
        position: "relative",
        width: "100%",
      }}
    >
      {virtualItems.getVirtualItems().map((vItem) => (
        <div
          key={vItem.key}
          data-index={vItem.index}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            transform: `translateY(${vItem.start}px)`,
            width: "100%",
          }}
        >
          {renderOption(flatOptionsList[vItem.index])}
        </div>
      ))}
    </div>
  );

  return (
    <ComboboxPrimitive.Root
      multiple={multiple}
      items={collection}
      /* SAFETY: createItems() makes the primitive's Value the derived string, matching the KiraSelect contract. */
      value={value as never}
      /* SAFETY: same string contract as `value` above. */
      defaultValue={defaultValue as never}
      /* SAFETY: handler receives derived string values; runtime shape is guarded in the handler body. */
      onValueChange={handleValueChange as never}
      inputValue={inputValue}
      onInputValueChange={handleInputValueChange}
      /* SAFETY: filter receives source items (T) per the collection contract; `false` disables internal filtering for async. */
      filter={filterFn_ as never}
      virtualized={virtualized}
      disabled={disabled}
      required={required}
      name={name}
      onOpenChange={(open) => handleOpenChange(open)}
    >
      <ComboboxPrimitive.InputGroup
        data-slot="select-field-trigger"
        className={triggerClasses}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledby}
        aria-describedby={ariaDescribedby}
        aria-invalid={ariaInvalid}
      >
        {leftIcon && (
          <span className="shrink-0 text-muted-foreground">{leftIcon}</span>
        )}
        {showSearchIcon && searchable && !leftIcon && (
          <IconSearch
            className="h-4 w-4 text-muted-foreground shrink-0"
            data-slot="select-field-search-icon"
          />
        )}
        {multiple && (
          <ComboboxPrimitive.Chips
            data-slot="select-field-chips"
            className="contents"
          >
            {displayedTags.map((opt) => (
              <ComboboxPrimitive.Chip
                key={opt.value}
                data-slot="select-field-tag"
                className="inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-md bg-muted shrink-0"
              >
                {opt.label}
                <ComboboxPrimitive.ChipRemove
                  render={
                    <button
                      type="button"
                      aria-label={`Remove ${opt.label}`}
                      className="hover:text-destructive rounded-sm"
                    />
                  }
                >
                  <IconX className="h-3 w-3" />
                </ComboboxPrimitive.ChipRemove>
              </ComboboxPrimitive.Chip>
            ))}
          </ComboboxPrimitive.Chips>
        )}
        {remainingCount > 0 && (
          <span className="text-xs text-muted-foreground shrink-0">
            +{remainingCount} more
          </span>
        )}
        <ComboboxPrimitive.Input
          data-slot="select-field-input"
          placeholder={inputPlaceholder}
          className="flex-1 min-w-20 bg-transparent text-sm placeholder:text-muted-foreground outline-none"
        />
        {isLoading && (
          <IconLoader2
            className="h-4 w-4 animate-spin text-muted-foreground shrink-0"
            data-slot="select-field-loading-icon"
          />
        )}
        {!isLoading && !multiple && selectedOptions.length > 0 && (
          <ComboboxPrimitive.Clear
            render={
              <button
                type="button"
                aria-label="Clear selection"
                className="rounded-sm p-0.5 hover:bg-muted"
                data-slot="select-field-clear"
              />
            }
          >
            <IconX className="h-4 w-4" />
          </ComboboxPrimitive.Clear>
        )}
        {!isLoading && multiple && selectedOptions.length > 0 && (
          <ComboboxPrimitive.Clear
            render={
              <button
                type="button"
                aria-label="Clear all selections"
                className="rounded-sm p-0.5 hover:bg-muted"
                data-slot="select-field-clear"
              />
            }
          >
            <IconX className="h-4 w-4" />
          </ComboboxPrimitive.Clear>
        )}
        {!isLoading && !hideChevron && (
          <ComboboxPrimitive.Icon
            render={
              <IconChevronDown
                className={cn(
                  "h-4 w-4 text-muted-foreground shrink-0 transition-transform",
                  isOpen && "rotate-180",
                )}
                data-slot="select-field-chevron"
              />
            }
          />
        )}
      </ComboboxPrimitive.InputGroup>

      <ComboboxPrimitive.Portal>
        <ComboboxPrimitive.Positioner
          data-slot="select-field-positioner"
          sideOffset={4}
          className="z-50"
        >
          <ComboboxPrimitive.Popup
            ref={setPopupEl}
            data-slot="select-field-list"
            className={popupClasses}
          >
            <ComboboxPrimitive.Status
              data-slot="select-field-status"
              className="sr-only"
            >
              {statusText}
            </ComboboxPrimitive.Status>
            {isLoading && (
              <div data-slot="select-field-skeleton" className="space-y-1 p-1">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-8 rounded-md bg-muted animate-pulse"
                  />
                ))}
              </div>
            )}
            <ComboboxPrimitive.Empty
              data-slot="select-field-empty"
              // Base UI keeps this root div mounted even when the list is
              // non-empty (children null); `empty:hidden` collapses the
              // otherwise-padding gap above the list.
              className="py-4 text-center text-sm text-muted-foreground empty:hidden"
            >
              {!isLoading && emptyText}
            </ComboboxPrimitive.Empty>
            {showCreateOption && (
              <ComboboxPrimitive.Item
                data-slot="select-field-create"
                value={createOptionValue}
                className={cn(itemClasses, "text-primary")}
              >
                <span className="flex-1 text-left">
                  {createLabel} "{trimmedQuery}"
                </span>
              </ComboboxPrimitive.Item>
            )}
            <ComboboxPrimitive.List data-slot="select-field-options">
              {virtualized && renderVirtualizedItems()}
              {!virtualized && (
                <FilteredItemsList grouped={useGroupedRendering} />
              )}
            </ComboboxPrimitive.List>
          </ComboboxPrimitive.Popup>
        </ComboboxPrimitive.Positioner>
      </ComboboxPrimitive.Portal>
    </ComboboxPrimitive.Root>
  );
}

// === KiraSelect: one prop-driven combobox ===

interface KiraSelectProps<T extends SelectOption = SelectOption> {
  /** Options to display. A `string[]` shorthand maps each entry to `{ value, label }`. */
  options: T[] | GroupedSelectOption<T>[] | readonly string[];
  value?: string | string[];
  defaultValue?: string | string[];
  onChange?: (value: string | string[], option: T | T[] | null) => void;
  multiple?: boolean;
  searchable?: boolean;
  async?: boolean;
  onSearch?: (query: string) => Promise<T[]>;
  creatable?: boolean;
  onCreateOption?: (inputValue: string) => void;
  createLabel?: string;
  placeholder?: string;
  disabled?: boolean;
  size?: "sm" | "default";
  variant?: "default" | "ghost" | "outline";
  leftIcon?: React.ReactNode;
  hideChevron?: boolean;
  maxDisplayedTags?: number;
  /** Windowed rendering for very long lists. Renders a flat window; grouping is ignored. */
  virtualized?: boolean;
  emptyMessage?: string | React.ReactNode;
  loadingMessage?: string | React.ReactNode;
  searchingMessage?: string | React.ReactNode;
  /** Marks the control invalid: sets aria-invalid + destructive ring. */
  invalid?: boolean;
  required?: boolean;
  name?: string;
  className?: string;
  "aria-label"?: string;
}

/* oxlint-disable complexity -- prop-driven mode router (simple vs rich path); branching mirrors the public API */
function KiraSelect<T extends SelectOption = SelectOption>({
  options,
  value,
  defaultValue,
  onChange,
  multiple = false,
  searchable = false,
  async = false,
  onSearch,
  creatable = false,
  onCreateOption,
  createLabel = "Create",
  placeholder = "Select...",
  disabled = false,
  size = "default",
  variant = "default",
  leftIcon,
  hideChevron = false,
  maxDisplayedTags = 3,
  virtualized = false,
  emptyMessage,
  loadingMessage,
  searchingMessage,
  invalid,
  required,
  name,
  className,
  "aria-label": ariaLabel,
}: KiraSelectProps<T>) {
  // Uncontrolled fallback for the simple Base UI path.
  const [internalValue, setInternalValue] = React.useState<
    string | string[] | undefined
  >(defaultValue);

  const isControlled = value !== undefined;
  let currentValue: string | string[] | undefined = internalValue;

  if (isControlled) {
    currentValue = value;
  }

  const isRich = searchable || async || creatable || multiple;

  const normalizedOptions = React.useMemo(
    () => normalizeOptions(options),
    [options],
  );

  const flat = React.useMemo(
    () => flattenOptions(normalizedOptions),
    [normalizedOptions],
  );

  // --- Rich path: delegate to the Combobox-backed field ---
  if (isRich) {
    return (
      <ComboboxField<T>
        options={normalizedOptions}
        value={currentValue}
        defaultValue={defaultValue}
        onChange={(val, opt) => {
          if (!isControlled) setInternalValue(val);
          onChange?.(val, opt);
        }}
        multiple={multiple}
        searchable={searchable || async || creatable}
        async={async}
        onSearch={onSearch}
        creatable={creatable}
        onCreateOption={onCreateOption}
        createLabel={createLabel}
        placeholder={placeholder}
        disabled={disabled}
        size={size}
        variant={variant}
        leftIcon={leftIcon}
        hideChevron={hideChevron}
        maxDisplayedTags={maxDisplayedTags}
        virtualized={virtualized}
        emptyMessage={emptyMessage}
        loadingMessage={loadingMessage}
        searchingMessage={searchingMessage}
        aria-invalid={invalid}
        required={required}
        name={name}
        aria-label={ariaLabel}
        className={className}
      />
    );
  }

  // --- Simple path: native Base UI Select ---
  const renderItems = (items: T[]) =>
    items.map((opt) => (
      <SelectItem key={opt.value} value={opt.value} disabled={opt.disabled}>
        {opt.label}
      </SelectItem>
    ));

  const renderContent = () => {
    if (isGroupedOptions(normalizedOptions)) {
      return normalizedOptions.map((group) => (
        <SelectGroup key={group.label}>
          <SelectLabel>{group.label}</SelectLabel>
          {renderItems(group.options)}
        </SelectGroup>
      ));
    }

    return renderItems(normalizedOptions);
  };

  // SAFETY: the simple path is single-select only, so the value contract
  // narrows to `string`; empty string is the primitive's no-selection value.
  const selectValue = currentValue as string;

  // SAFETY: values come from flat options' own `value: string` fields; React
  // nodes are the labels the simple path renders.
  const labelMap: Record<string, React.ReactNode> = Object.fromEntries(
    flat.map((o) => [o.value, o.label]),
  );

  const handleSimpleChange = (val: string) => {
    if (!isControlled) {
      setInternalValue(val);
    }

    const opt = flat.find((o) => o.value === val) ?? null;
    onChange?.(val, opt);
  };

  return (
    <Select
      value={selectValue || ""}
      onValueChange={handleSimpleChange}
      items={labelMap}
      disabled={disabled}
      name={name}
      required={required}
    >
      <SelectTrigger
        size={size}
        aria-invalid={invalid}
        aria-label={ariaLabel}
        className={className}
      >
        {leftIcon && (
          <span className="shrink-0 text-muted-foreground">{leftIcon}</span>
        )}
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>{renderContent()}</SelectContent>
    </Select>
  );
}
/* oxlint-enable complexity -- end KiraSelect */

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
  KiraSelect,
};

export type { SelectOption, GroupedSelectOption, KiraSelectProps };
