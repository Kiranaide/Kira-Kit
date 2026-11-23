"use client";

import * as React from "react";
import { Select as SelectPrimitive } from "@base-ui/react/select";
import { Combobox as ComboboxPrimitive } from "@base-ui/react/combobox";
import { useVirtualizer } from "@tanstack/react-virtual";

import { cn } from "cn";
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
import { isStringProp, resolveComponentDefaults } from "@/lib/component-utils";

const Select = SelectPrimitive.Root;

type SelectSize = "xs" | "sm" | "default" | "lg" | "xl";

const COMBOBOX_SIZE_CLASSES: Record<SelectSize, string> = {
  xs: "min-h-7 px-2",
  sm: "min-h-8 px-3",
  default: "min-h-9 px-4",
  lg: "min-h-10 px-5",
  xl: "min-h-11 px-5",
};

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
  size?: SelectSize;
}) {
  return (
    // kira-kit-ignore spacing-scale: value-to-icon optical gap inside the trigger
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      data-size={size}
      className={cn(
        "flex w-full items-center justify-between rounded-lg border border-input bg-transparent py-1 text-sm transition-colors select-none gap-2",
        "dark:bg-input/30 dark:hover:bg-input/50",
        "focus-visible:border-ring focus-visible:ring-ring focus-visible:ring-[3px]",
        "data-placeholder:text-muted-foreground",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 aria-invalid:ring-[3px]",
        "data-[size=xs]:h-7 data-[size=xs]:px-2 data-[size=sm]:h-8 data-[size=sm]:px-3 data-[size=default]:h-9 data-[size=default]:px-4 data-[size=lg]:h-10 data-[size=lg]:px-5 data-[size=xl]:h-11 data-[size=xl]:px-5",
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

function SelectContent(
  input: SelectPrimitive.Popup.Props &
    Pick<
      SelectPrimitive.Positioner.Props,
      "align" | "alignOffset" | "side" | "sideOffset" | "alignItemWithTrigger"
    >,
) {
  const {
    className,
    children,
    side,
    sideOffset,
    align,
    alignOffset,
    alignItemWithTrigger,
    ...props
  } = resolveComponentDefaults(input, SELECT_CONTENT_DEFAULTS_1);

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
            "bg-popover text-popover-foreground ring-foreground/10 min-w-36 rounded-lg p-1 shadow-md ring-1 duration-100 relative isolate z-50 max-h-(--available-height) w-(--anchor-width) origin-(--transform-origin) overflow-x-hidden overflow-y-auto",
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
      className={cn("text-muted-foreground px-2 py-1.5 text-xs", className)}
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
        "focus:bg-accent focus:text-accent-foreground not-data-[variant=destructive]:focus:**:text-accent-foreground gap-2 rounded-md px-2 py-1.5 pr-8 min-h-8 text-sm [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2 relative flex w-full cursor-default items-center outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
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
  const first = options[0];

  return first !== undefined && !("value" in first) && "options" in first;
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

function isStringValue<T>(value: T): value is T & string {
  return isStringProp(value);
}

/**
 * Accepts the `string[]` shorthand (`["Data1", "Data2"]`) alongside option
 * objects and groups; strings become `{ value: label, label }`.
 */
function normalizeOptions<T extends SelectOption>(
  options: T[] | GroupedSelectOption<T>[] | readonly string[],
): T[] | GroupedSelectOption<T>[] {
  const flat: T[] = [];
  const groups: GroupedSelectOption<T>[] = [];

  for (const option of options) {
    if (isStringValue(option)) {
      flat.push(stringToOption<T>(option));
    } else if ("value" in option) {
      flat.push(option);
    } else {
      groups.push(option);
    }
  }

  return groups.length ? groups : flat;
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
  id?: string;
  readOnly?: boolean;
  disabled?: boolean;
  size?: SelectSize;
  className?: string;
  maxDisplayedTags?: number;
  showSearchIcon?: boolean;
  fuzzyMatching?: boolean;
  filterFn?: (option: T, query: string) => boolean;
  virtualized?: boolean;
  required?: boolean;
  "data-slot"?: string;
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

function ComboboxField<T extends SelectOption = SelectOption>(
  input0: ComboboxFieldProps<T>,
) {
  let state0 = useComboboxFieldSetup<T>(input0);
  const state1 = useComboboxFieldState2<T>(state0);
  const state2 = useComboboxFieldState3<T>(state1);
  const state3 = useComboboxFieldState4<T>(state2);
  const state4 = useComboboxFieldState5<T>(state3);
  const state5 = useComboboxFieldState6<T>(state4);
  const state6 = useComboboxFieldState7<T>(state5);
  const state7 = useComboboxFieldState8<T>(state6);
  const state8 = useComboboxFieldActions<T>(state7);

  return renderComboboxField<T>(state8);
}

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
  id?: string;
  readOnly?: boolean;
  disabled?: boolean;
  size?: SelectSize;
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
  "data-slot"?: string;
  "aria-label"?: string;
  "aria-describedby"?: string;
}

function KiraSelect<T extends SelectOption = SelectOption>(
  input0: KiraSelectProps<T>,
) {
  const state0 = useSelectSetup<T>(input0);
  const state1 = useSelectActions<T>(state0);

  return renderSelect<T>(state1);
}

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

function useComboboxFieldSetup<T extends SelectOption = SelectOption>(
  componentProps: ComboboxFieldProps<T>,
) {
  const resolvedProps = resolveComponentDefaults(
    componentProps,
    USE_COMBOBOX_FIELD_SETUP_DEFAULTS_3,
  );

  const { async } = resolvedProps;

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
  const [prevOptions, setPrevOptions] = React.useState(componentProps.options);

  if (!async && componentProps.options !== prevOptions) {
    setPrevOptions(componentProps.options);
  }

  const data = React.useMemo(() => {
    const toItem = (option: T): SelectOption => ({
      value: option.value,
      label: option.label,
      disabled: option.disabled,
    });

    if (async) {
      // Async results replace the (initially empty) options prop.
      return asyncOptions.map(toItem);
    }

    if (isGroupedOptions(componentProps.options)) {
      return componentProps.options.map((g) => ({
        label: g.label,
        items: g.options.map(toItem),
      }));
    }

    return componentProps.options.map(toItem);
  }, [async, asyncOptions, componentProps.options]);

  return {
    ...componentProps,
    ...resolvedProps,
    dataSlot: componentProps["data-slot"],
    ariaLabel: componentProps["aria-label"],
    ariaLabelledby: componentProps["aria-labelledby"],
    ariaDescribedby: componentProps["aria-describedby"],
    ariaInvalid: componentProps["aria-invalid"],
    reducedMotion,
    filterUtils,
    inputValue,
    setInputValue,
    asyncOptions,
    setAsyncOptions,
    isLoading,
    setIsLoading,
    isOpen,
    setIsOpen,
    popupEl,
    setPopupEl,
    cacheRef,
    data,
  };
}

function useComboboxFieldState2<T extends SelectOption = SelectOption>(
  state: ReturnType<typeof useComboboxFieldSetup<T>>,
) {
  const collection = React.useMemo(
    () =>
      ComboboxPrimitive.createItems<SelectOption, string>(state.data, {
        getValue: (o) => o.value,
        getLabel: (o) => o.label,
      }),
    [state.data],
  );

  const flat = React.useMemo(
    () => flattenOptions(state.options),
    [state.options],
  );

  const flatOptionsList = React.useMemo(() => {
    if (state.async) {
      return state.asyncOptions;
    }

    return flat;
  }, [state.async, state.asyncOptions, flat]);

  // oxlint-disable-next-line complexity -- normalize string | string[] contract to a list
  const selectedOptions = React.useMemo(() => {
    if (state.value === undefined || state.value === null) {
      // SAFETY: T[] is the empty option list shape; nothing is cast.
      return [] as T[];
    }

    const values: string[] = [];

    if (Array.isArray(state.value)) {
      values.push(...state.value);
    } else {
      values.push(state.value);
    }

    return values.flatMap((v) => {
      const found = flatOptionsList.find((o) => o.value === v);

      if (found) {
        return [found];
      }

      return [];
    });
  }, [state.value, flatOptionsList]);

  const debouncedQuery = useDebounce(state.inputValue, state.debounceMs);

  return {
    ...state,
    collection,
    flat,
    flatOptionsList,
    selectedOptions,
    debouncedQuery,
  };
}

function useComboboxFieldState3<T extends SelectOption = SelectOption>(
  state: ReturnType<typeof useComboboxFieldState2<T>>,
) {
  const { cacheRef } = state;

  const { setAsyncOptions, setIsLoading, onSearch } = state;

  React.useEffect(() => {
    if (!state.async || !onSearch) return;

    if (!state.debouncedQuery && !state.isOpen) {
      return;
    }

    if (state.cacheOptions && cacheRef.current.has(state.debouncedQuery)) {
      const cached = cacheRef.current.get(state.debouncedQuery);
      setAsyncOptions(cached || []);

      return;
    }

    let cancelled = false;
    setIsLoading(true);

    onSearch(state.debouncedQuery)
      .then((results) => {
        if (!cancelled) {
          // SAFETY: onSearch's Promise resolves to T[] per the KiraSelectProps
          // contract; the generic parameter erases it inside the hook.
          setAsyncOptions(results as T[]);

          if (state.cacheOptions) {
            // SAFETY: results is T[] per the onSearch contract (same as above).
            cacheRef.current.set(state.debouncedQuery, results as T[]);
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
  }, [
    state.debouncedQuery,
    state.isOpen,
    state.async,
    onSearch,
    state.cacheOptions,
    setAsyncOptions,
    cacheRef,
    setIsLoading,
  ]);

  return { ...state };
}

function toComboboxValueString(item: ComboboxEmitted): string {
  if (isStringEmitted(item)) return item;

  if (item !== null && isStringValue(item.value)) return item.value;

  return String(item);
}

function normalizeComboboxEventValue(next: RawComboboxEventValue): string[] {
  let rawList: ComboboxEmitted[] = [];

  if (Array.isArray(next)) {
    rawList = next;
  } else if (next !== null && next !== undefined) {
    rawList = [next];
  }

  return rawList.map(toComboboxValueString);
}

function useComboboxFieldState4<T extends SelectOption = SelectOption>(
  state: ReturnType<typeof useComboboxFieldState3<T>>,
) {
  const { onCreateOption, setInputValue, setIsOpen, onOpenChange, onChange } =
    state;

  const handleValueChange = React.useCallback(
    (
      next: RawComboboxEventValue,
      eventDetails: { cancel: () => void; reason?: string },
    ) => {
      // Base UI clears the selection on Escape while closed (a search-combobox
      // habit); a select keeps its value unless cleared explicitly.
      if (eventDetails.reason === "escape-key") {
        eventDetails.cancel();

        return;
      }

      // Base UI's onValueChange delivers: derived string(s) from the
      // createItems() collection, or the create pseudo-item's { value, label }
      // object, or null (clear). Normalize to a flat list of strings.
      const nextList = normalizeComboboxEventValue(next);

      const isCreatePick = isComboboxCreatePick(
        state.creatable,
        state.inputValue,
        state.flat,
        nextList,
      );

      if (isCreatePick) {
        onCreateOption?.(nextList[0]);
        setInputValue("");
        setIsOpen(false);
        onOpenChange?.(false);
        eventDetails.cancel();

        return;
      }

      emitComboboxValueChange(state.multiple, state.flat, nextList, onChange);

      if (state.multiple) {
        setInputValue("");
      }
    },
    [
      state.multiple,
      state.flat,
      state.creatable,
      state.inputValue,
      onCreateOption,
      onChange,
      onOpenChange,
      setInputValue,
      setIsOpen,
    ],
  );

  return { ...state, handleValueChange };
}

function isComboboxCreatePick<T extends SelectOption>(
  creatable: boolean,
  inputValue: string,
  options: T[],
  values: string[],
) {
  const [candidate] = values;
  const query = inputValue.trim();

  return (
    creatable &&
    values.length === 1 &&
    candidate === query &&
    query !== "" &&
    !options.some((option) => option.value === candidate)
  );
}

function emitComboboxValueChange<T extends SelectOption>(
  multiple: boolean,
  options: T[],
  values: string[],
  onChange: ReturnType<typeof useComboboxFieldState3<T>>["onChange"],
) {
  if (multiple) {
    onChange?.(
      values,
      options.filter((option) => values.includes(option.value)),
    );

    return;
  }

  const value = values[0] ?? "";
  onChange?.(value, options.find((option) => option.value === value) ?? null);
}

function useComboboxFieldState5<T extends SelectOption = SelectOption>(
  state: ReturnType<typeof useComboboxFieldState4<T>>,
) {
  const { setInputValue, onSearchChange, setIsOpen, onOpenChange } = state;

  const handleInputValueChange = React.useCallback(
    (next: string) => {
      setInputValue(next);
      onSearchChange?.(next);
    },
    [onSearchChange, setInputValue],
  );

  const handleOpenChange = React.useCallback(
    (open: boolean) => {
      setIsOpen(open);
      onOpenChange?.(open);
    },
    [onOpenChange, setIsOpen],
  );

  // Opening starts a fresh query so the full list shows; the closed trigger
  // displays the selected label instead (see displayInputValue).
  const [prevIsOpen, setPrevIsOpen] = React.useState(false);

  if (prevIsOpen !== state.isOpen) {
    setPrevIsOpen(state.isOpen);

    if (state.isOpen && state.inputValue) {
      setInputValue("");
    }
  }

  const trimmedQuery = state.inputValue.trim();

  const showCreateOption =
    state.creatable &&
    trimmedQuery !== "" &&
    !state.flatOptionsList.some(
      (opt) => opt.label.toLowerCase() === trimmedQuery.toLowerCase(),
    );

  const subsequenceFilter = React.useMemo(
    () => (item: T, query: string) => subsequenceMatch(item.label, query),
    [],
  );

  const resolveFilter = () => {
    if (state.async) {
      // Base UI disables internal filtering with `null` (not `false`): async
      // results arrive pre-filtered by the consumer's onSearch.
      return null;
    }

    if (state.filterFn) {
      return state.filterFn;
    }

    if (state.fuzzyMatching) {
      return subsequenceFilter;
    }

    return state.filterUtils.contains;
  };

  return {
    ...state,
    handleInputValueChange,
    handleOpenChange,
    trimmedQuery,
    showCreateOption,
    resolveFilter,
  };
}

function useComboboxFieldState6<T extends SelectOption = SelectOption>(
  state: ReturnType<typeof useComboboxFieldState5<T>>,
) {
  const { resolveFilter } = state;

  const filterFn_ = resolveFilter();

  useGSAP(
    () => {
      if (!state.isOpen || !state.popupEl || state.isLoading) return;

      if (state.reducedMotion) return;

      // Base UI syncs item indices right after open; target the post-sync DOM.
      let mm: gsap.MatchMedia | undefined;

      const raf = requestAnimationFrame(() => {
        mm = gsap.matchMedia();
        mm.add("(prefers-reduced-motion: no-preference)", () => {
          const items = state.popupEl?.querySelectorAll(
            "[data-slot=select-field-option], [data-slot=select-field-create]",
          );

          if (!items || items.length === 0) {
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
    { dependencies: [state.isOpen, state.popupEl], revertOnUpdate: true },
  );

  const triggerClasses = cn(
    "flex items-center gap-2 py-1 rounded-lg border bg-transparent cursor-text w-full transition-colors",
    state.multiple ? "flex-wrap" : "flex-nowrap",
    COMBOBOX_SIZE_CLASSES[state.size || "default"],
    state.variant === "default" &&
      "border-input dark:bg-input/30 dark:hover:bg-input/50",
    state.variant === "ghost" && "border-transparent hover:bg-muted",
    state.variant === "outline" &&
      "border-input bg-transparent hover:bg-muted/50",
    "focus-within:border-ring focus-within:ring-ring focus-within:ring-[3px]",
    state.ariaInvalid &&
      "border-destructive ring-destructive/20 focus-within:border-destructive focus-within:ring-destructive/30",
    state.disabled && "opacity-50 pointer-events-none cursor-not-allowed",
    state.className,
  );

  return { ...state, filterFn_, triggerClasses };
}

function useComboboxFieldState7<T extends SelectOption = SelectOption>(
  state: ReturnType<typeof useComboboxFieldState6<T>>,
) {
  // TanStack Virtual exposes mutable methods; React Compiler must not memoize their results.
  "use no memo";

  const popupClasses = cn(
    "z-50 max-h-60 overflow-auto rounded-lg border border-border bg-popover p-1 shadow-md min-w-36 w-(--anchor-width)",
    !state.reducedMotion &&
      "data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 data-closed:zoom-out-95 data-open:zoom-in-95",
  );

  const itemClasses = cn(
    "flex w-full items-center gap-2 rounded-md px-2 py-1.5 min-h-8 text-sm outline-none cursor-pointer",
    "data-highlighted:bg-accent data-highlighted:text-accent-foreground",
    "data-selected:font-medium",
    "data-disabled:opacity-50 data-disabled:pointer-events-none data-disabled:cursor-not-allowed",
  );

  // oxlint-disable-next-line react/incompatible-library -- TanStack Virtual exposes mutable getters; this caller uses the documented use no memo compiler opt-out to preserve live measurements.
  const virtualItems = useVirtualizer({
    count: state.flatOptionsList.length,
    getScrollElement: () => state.popupEl,
    estimateSize: () => 32,
    overscan: 8,
    getItemKey: (i) => state.flatOptionsList[i].value,
    enabled: state.virtualized,
  });

  const displayedTags = state.selectedOptions.slice(0, state.maxDisplayedTags);
  const remainingCount = state.selectedOptions.length - state.maxDisplayedTags;

  const renderOption = (option: SelectOption) => (
    <ComboboxPrimitive.Item
      key={option.value}
      data-slot="select-field-option"
      value={option.value}
      disabled={option.disabled}
      className={itemClasses}
    >
      {state.multiple && (
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
      {!state.multiple && (
        <ComboboxPrimitive.ItemIndicator>
          <IconCheck className="h-4 w-4 text-primary shrink-0" />
        </ComboboxPrimitive.ItemIndicator>
      )}
    </ComboboxPrimitive.Item>
  );

  return {
    ...state,
    popupClasses,
    itemClasses,
    virtualItems,
    displayedTags,
    remainingCount,
    renderOption,
  };
}

function useComboboxFieldState8<T extends SelectOption = SelectOption>(
  state: ReturnType<typeof useComboboxFieldState7<T>>,
) {
  const { renderOption } = state;

  const useGroupedRendering =
    isGroupedOptions(state.options) && !state.virtualized && !state.async;

  // Renders the Base UI-derived (filtered) items inside the popup. Lives in a
  // child component because useFilteredItems is a context hook.
  function FilteredItemsList({ grouped }: { grouped: boolean }) {
    // SAFETY: filteredItems holds source items (T) — with a createItems()
    // collection the root filters source items via the collection's getLabel.
    const filtered = ComboboxPrimitive.useFilteredItems<
      SelectOption | ComboboxFilteredGroup<SelectOption>
    >();

    if (grouped) {
      // A grouped collection emits group entries; narrow that union before rendering.

      return (
        <>
          {filtered.map((group) => {
            if (!("items" in group)) return null;

            return (
              <ComboboxPrimitive.Group key={group.label}>
                <ComboboxPrimitive.GroupLabel
                  data-slot="select-field-group-label"
                  className="text-muted-foreground px-2 py-1.5 text-xs"
                >
                  {group.label}
                </ComboboxPrimitive.GroupLabel>
                {group.items.map(renderOption)}
              </ComboboxPrimitive.Group>
            );
          })}
        </>
      );
    }

    return (
      <>
        {filtered.map((option) =>
          "items" in option ? null : renderOption(option),
        )}
      </>
    );
  }

  const inputPlaceholder = (() => {
    if (state.multiple && state.selectedOptions.length > 0) {
      return "";
    }

    return state.placeholder;
  })();

  const closedLabel = state.multiple
    ? ""
    : (state.selectedOptions[0]?.label ?? "");

  const displayInputValue = state.isOpen ? state.inputValue : closedLabel;

  return {
    ...state,
    useGroupedRendering,
    FilteredItemsList,
    inputPlaceholder,
    displayInputValue,
  };
}

function useComboboxFieldActions<T extends SelectOption = SelectOption>(
  state: ReturnType<typeof useComboboxFieldState8<T>>,
) {
  const { renderOption } = state;

  const statusText = (() => {
    if (state.isLoading) {
      return state.loadingMessage || "Loading...";
    }

    return "";
  })();

  const emptyText = (() => {
    if (state.emptyMessage) {
      return state.emptyMessage;
    }

    if (state.trimmedQuery) {
      return "No results found";
    }

    if (state.async) {
      return state.searchingMessage || "Type to search...";
    }

    return "No options";
  })();

  const createOptionValue = {
    value: state.trimmedQuery,
    label: state.trimmedQuery,
  };

  const renderVirtualizedItems = () => (
    <div
      style={{
        height: state.virtualItems.getTotalSize(),
        position: "relative",
        width: "100%",
      }}
    >
      {state.virtualItems.getVirtualItems().map((vItem) => (
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
          {renderOption(state.flatOptionsList[vItem.index])}
        </div>
      ))}
    </div>
  );

  return {
    ...state,
    statusText,
    emptyText,
    createOptionValue,
    renderVirtualizedItems,
  };
}

// oxlint-disable-next-line eslint/max-lines-per-function, eslint/complexity -- Pure compound JSX view: keeping related labels, controls, and conditional styling together makes the markup easier to review than further fragment extraction.
function renderComboboxField<T extends SelectOption = SelectOption>(
  state: ReturnType<typeof useComboboxFieldActions<T>>,
) {
  const { handleOpenChange } = state;

  return (
    <ComboboxPrimitive.Root
      id={state.id}
      readOnly={state.readOnly}
      multiple={state.multiple}
      items={state.collection}
      /* SAFETY: createItems() makes the primitive's Value the derived string, matching the KiraSelect contract. */
      value={state.value as never}
      /* SAFETY: same string contract as `value` above. */
      defaultValue={state.defaultValue as never}
      /* SAFETY: handler receives derived string values; runtime shape is guarded in the handler body. */
      onValueChange={state.handleValueChange as never}
      inputValue={state.displayInputValue}
      onInputValueChange={state.handleInputValueChange}
      /* SAFETY: filter receives source items (T) per the collection contract; `false` disables internal filtering for async. */
      filter={state.filterFn_ as never}
      virtualized={state.virtualized}
      disabled={state.disabled}
      required={state.required}
      name={state.name}
      onOpenChange={(open) => handleOpenChange(open)}
    >
      <ComboboxPrimitive.InputGroup
        data-slot={state.dataSlot ?? "select-field-trigger"}
        className={state.triggerClasses}
        aria-label={state.ariaLabel}
        aria-labelledby={state.ariaLabelledby}
        aria-describedby={state.ariaDescribedby}
        aria-invalid={state.ariaInvalid}
      >
        {state.leftIcon && (
          <span className="shrink-0 text-muted-foreground">
            {state.leftIcon}
          </span>
        )}
        {state.showSearchIcon && state.searchable && !state.leftIcon && (
          <IconSearch
            className="h-4 w-4 text-muted-foreground shrink-0"
            data-slot="select-field-search-icon"
          />
        )}
        {state.multiple && renderSelectFieldChipsPart2({ state })}
        {state.remainingCount > 0 && (
          <span className="text-xs text-muted-foreground shrink-0">
            +{state.remainingCount} more
          </span>
        )}
        <ComboboxPrimitive.Input
          data-slot="select-field-input"
          placeholder={state.inputPlaceholder}
          onFocus={(event) => {
            // Closed triggers show the selected label; select it so the first
            // keystroke replaces it instead of appending to it.
            if (!state.isOpen) {
              event.currentTarget.select();
            }
          }}
          className={cn(
            "flex-1 bg-transparent text-sm placeholder:text-muted-foreground outline-none",
            state.multiple ? "min-w-20" : "min-w-0",
          )}
        />
        {state.isLoading && (
          <IconLoader2
            className="h-4 w-4 animate-spin text-muted-foreground shrink-0"
            data-slot="select-field-loading-icon"
          />
        )}
        {!state.isLoading &&
          !state.multiple &&
          state.selectedOptions.length > 0 && (
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
        {!state.isLoading &&
          state.multiple &&
          state.selectedOptions.length > 0 && (
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
        {!state.isLoading && !state.hideChevron && (
          <ComboboxPrimitive.Icon
            render={
              <IconChevronDown
                className={cn(
                  "h-4 w-4 text-muted-foreground shrink-0 transition-transform",
                  state.isOpen && "rotate-180",
                )}
                data-slot="select-field-chevron"
              />
            }
          />
        )}
      </ComboboxPrimitive.InputGroup>
      {renderRenderComboboxFieldSectionPart3({ state })}
    </ComboboxPrimitive.Root>
  );
}

interface ComboboxEmittedValue {
  value: string;
  label?: string;
}

interface ComboboxFilteredGroup<T> {
  label: string;
  items: T[];
}

type ComboboxEmitted = string | ComboboxEmittedValue | null;

type RawComboboxEventValue = ComboboxEmitted | ComboboxEmitted[];

type renderSelectFieldChipsPart2Args<T extends SelectOption = SelectOption> = {
  state: ReturnType<typeof useComboboxFieldActions<T>>;
};

function renderSelectFieldChipsPart2<T extends SelectOption = SelectOption>({
  state,
}: renderSelectFieldChipsPart2Args<T>) {
  return (
    <ComboboxPrimitive.Chips
      data-slot="select-field-chips"
      className="contents"
    >
      {state.displayedTags.map((opt) => (
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
  );
}

type renderRenderComboboxFieldSectionPart3Args<
  T extends SelectOption = SelectOption,
> = { state: ReturnType<typeof useComboboxFieldActions<T>> };

function renderRenderComboboxFieldSectionPart3<
  T extends SelectOption = SelectOption,
>({ state }: renderRenderComboboxFieldSectionPart3Args<T>) {
  const { renderVirtualizedItems } = state;

  return (
    <ComboboxPrimitive.Portal>
      <ComboboxPrimitive.Positioner
        data-slot="select-field-positioner"
        sideOffset={4}
        className="z-50"
      >
        <ComboboxPrimitive.Popup
          ref={state.setPopupEl}
          data-slot="select-field-list"
          className={state.popupClasses}
        >
          <ComboboxPrimitive.Status
            data-slot="select-field-status"
            className="sr-only"
          >
            {state.statusText}
          </ComboboxPrimitive.Status>
          {state.isLoading && (
            <div data-slot="select-field-skeleton" className="space-y-1 p-1">
              {["first", "second", "third"].map((slot) => (
                <div
                  key={slot}
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
            {!state.isLoading && state.emptyText}
          </ComboboxPrimitive.Empty>
          {state.showCreateOption && (
            <ComboboxPrimitive.Item
              data-slot="select-field-create"
              value={state.createOptionValue}
              className={cn(state.itemClasses, "text-primary")}
            >
              <span className="flex-1 text-left">
                {state.createLabel} "{state.trimmedQuery}"
              </span>
            </ComboboxPrimitive.Item>
          )}
          <ComboboxPrimitive.List data-slot="select-field-options">
            {state.virtualized && renderVirtualizedItems()}
            {!state.virtualized && (
              <state.FilteredItemsList grouped={state.useGroupedRendering} />
            )}
          </ComboboxPrimitive.List>
        </ComboboxPrimitive.Popup>
      </ComboboxPrimitive.Positioner>
    </ComboboxPrimitive.Portal>
  );
}

// SAFETY: Immutable fallback tokens preserve the component's public default values.
const SELECT_CONTENT_DEFAULTS_1 = {
  side: "bottom",
  sideOffset: 4,
  align: "start",
  alignOffset: 0,
  alignItemWithTrigger: false,
} as const;

// SAFETY: Immutable fallback tokens preserve the component's public default values.
const KIRA_SELECT_DEFAULTS_2 = {
  multiple: false,
  searchable: false,
  async: false,
  creatable: false,
  createLabel: "Create",
  placeholder: "Select...",
  readOnly: false,
  disabled: false,
  size: "default",
  variant: "default",
  hideChevron: false,
  maxDisplayedTags: 3,
  virtualized: false,
} as const;

// SAFETY: Immutable fallback tokens preserve the component's public default values.
const USE_COMBOBOX_FIELD_SETUP_DEFAULTS_3 = {
  multiple: false,
  searchable: true,
  creatable: false,
  async: false,
  debounceMs: 300,
  cacheOptions: true,
  createLabel: "Create",
  placeholder: "Select...",
  readOnly: false,
  disabled: false,
  size: "default",
  maxDisplayedTags: 3,
  showSearchIcon: true,
  fuzzyMatching: true,
  virtualized: false,
  variant: "default",
  hideChevron: false,
} as const;

function useSelectSetup<T extends SelectOption = SelectOption>(
  input: KiraSelectProps<T>,
) {
  const { options } = input;

  const resolvedProps = resolveComponentDefaults(input, KIRA_SELECT_DEFAULTS_2);

  const {
    value,
    defaultValue,
    "data-slot": dataSlot,
    "aria-label": ariaLabel,
    "aria-describedby": ariaDescribedby,
  } = resolvedProps;

  // Uncontrolled fallback for the simple Base UI path.
  const [internalValue, setInternalValue] = React.useState<
    string | string[] | undefined
  >(defaultValue);

  const isControlled = value !== undefined;

  let currentValue: string | string[] | undefined = internalValue;

  if (isControlled) {
    currentValue = value;
  }

  return {
    ...resolvedProps,
    options,
    dataSlot,
    ariaLabel,
    ariaDescribedby,
    setInternalValue,
    isControlled,
    currentValue,
  };
}

function useSelectActions<T extends SelectOption = SelectOption>(
  state: ReturnType<typeof useSelectSetup<T>>,
) {
  const normalizedOptions = React.useMemo(
    () => normalizeOptions(state.options),
    [state.options],
  );

  return { ...state, normalizedOptions };
}

function renderSelect<T extends SelectOption = SelectOption>({
  defaultValue,
  onChange,
  multiple,
  searchable,
  async,
  onSearch,
  creatable,
  onCreateOption,
  createLabel,
  placeholder,
  id,
  readOnly,
  disabled,
  size,
  variant,
  leftIcon,
  hideChevron,
  maxDisplayedTags,
  virtualized,
  emptyMessage,
  loadingMessage,
  searchingMessage,
  invalid,
  required,
  name,
  className,
  dataSlot,
  ariaLabel,
  ariaDescribedby,
  setInternalValue,
  isControlled,
  currentValue,
  normalizedOptions,
}: ReturnType<typeof useSelectActions<T>>) {
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
      id={id}
      readOnly={readOnly}
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
      data-slot={dataSlot}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedby}
      className={className}
    />
  );
}

const isStringEmitted = (item: ComboboxEmitted): item is string =>
  // SAFETY: discriminating the union by its string member; the object
  // member always has `value: string`, so a bare string can only be the
  // string branch.
  isStringValue(item);
