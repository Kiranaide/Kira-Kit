"use client";

import * as React from "react";
import { animate, stagger } from "animejs";
import { cn } from "@/lib/utils";
import { IconX, IconCheck, IconSearch, IconLoader2 } from "@tabler/icons-react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";

// ============================================
// TYPES
// ============================================
export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

// ============================================
// MULTI SELECT COMPONENT
// ============================================
interface MultiSelectProps {
  options: SelectOption[];
  value?: string[];
  onChange?: (value: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  maxDisplayedTags?: number;
}

function MultiSelect({
  options,
  value = [],
  onChange,
  placeholder = "Select...",
  disabled = false,
  className,
  maxDisplayedTags = 3,
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const listRef = React.useRef<HTMLDivElement>(null);

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedOptions = options.filter((opt) => value.includes(opt.value));
  const displayedTags = selectedOptions.slice(0, maxDisplayedTags);
  const remainingCount = selectedOptions.length - maxDisplayedTags;

  const toggleOption = (optionValue: string) => {
    const newValue = value.includes(optionValue)
      ? value.filter((v) => v !== optionValue)
      : [...value, optionValue];
    onChange?.(newValue);
  };

  const removeTag = (optionValue: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange?.(value.filter((v) => v !== optionValue));
  };

  // Animate items when dropdown opens
  React.useEffect(() => {
    if (isOpen && listRef.current) {
      const items = listRef.current.querySelectorAll("[data-option]");
      animate(items, {
        opacity: [0, 1],
        translateY: [-10, 0],
        delay: stagger(30),
        duration: 200,
        ease: "outQuad",
      });
    }
  }, [isOpen, filteredOptions.length]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger
        disabled={disabled}
        className={cn(
          "flex min-h-10 w-full flex-wrap items-center gap-1.5 rounded-lg border border-input bg-transparent px-2 py-1.5 text-sm transition-colors",
          "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
          disabled && "opacity-50 cursor-not-allowed",
          className
        )}
        onKeyDown={handleKeyDown}
      >
        {displayedTags.length > 0 ? (
          <>
            {displayedTags.map((opt) => (
              <span
                key={opt.value}
                className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-0.5 text-xs"
              >
                {opt.label}
                <button
                  type="button"
                  onClick={(e) => removeTag(opt.value, e)}
                  className="rounded-sm hover:bg-muted-foreground/20"
                >
                  <IconX className="h-3 w-3" />
                </button>
              </span>
            ))}
            {remainingCount > 0 && (
              <span className="text-xs text-muted-foreground">
                +{remainingCount} more
              </span>
            )}
          </>
        ) : (
          <span className="text-muted-foreground">{placeholder}</span>
        )}
      </PopoverTrigger>
      <PopoverContent className="w-(--anchor-width) min-w-[200px] p-0">
        <div className="p-2 border-b">
          <div className="relative">
            <IconSearch className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="pl-8 h-8"
              autoFocus
            />
          </div>
        </div>
        <div ref={listRef} className="max-h-60 overflow-y-auto p-1">
          {filteredOptions.length === 0 ? (
            <div className="py-4 text-center text-sm text-muted-foreground">
              No options found
            </div>
          ) : (
            filteredOptions.map((option) => {
              const isSelected = value.includes(option.value);
              return (
                <button
                  key={option.value}
                  data-option
                  type="button"
                  disabled={option.disabled}
                  onClick={() => toggleOption(option.value)}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm outline-none",
                    "hover:bg-muted focus:bg-muted",
                    option.disabled && "opacity-50 cursor-not-allowed"
                  )}
                >
                  <div
                    className={cn(
                      "flex h-4 w-4 items-center justify-center rounded border transition-colors",
                      isSelected
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-input"
                    )}
                  >
                    {isSelected && <IconCheck className="h-3 w-3" />}
                  </div>
                  <span>{option.label}</span>
                </button>
              );
            })
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

// ============================================
// ASYNC SELECT COMPONENT
// ============================================
interface AsyncSelectProps {
  loadOptions: (query: string) => Promise<SelectOption[]>;
  value?: string;
  onChange?: (value: string, option: SelectOption | null) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  debounceMs?: number;
  cacheOptions?: boolean;
}

function AsyncSelect({
  loadOptions,
  value,
  onChange,
  placeholder = "Search...",
  disabled = false,
  className,
  debounceMs = 300,
  cacheOptions = true,
}: AsyncSelectProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [options, setOptions] = React.useState<SelectOption[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [selectedOption, setSelectedOption] =
    React.useState<SelectOption | null>(null);
  const listRef = React.useRef<HTMLDivElement>(null);
  const debounceRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const cacheRef = React.useRef<Map<string, SelectOption[]>>(new Map());

  // Load options with debounce
  const fetchOptions = React.useCallback(
    async (query: string) => {
      if (cacheOptions && cacheRef.current.has(query)) {
        setOptions(cacheRef.current.get(query) || []);
        return;
      }

      setIsLoading(true);
      try {
        const result = await loadOptions(query);
        setOptions(result);
        if (cacheOptions) {
          cacheRef.current.set(query, result);
        }
      } catch (error) {
        console.error("Failed to load options:", error);
        setOptions([]);
      } finally {
        setIsLoading(false);
      }
    },
    [loadOptions, cacheOptions]
  );

  React.useEffect(() => {
    if (!isOpen) return;

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      fetchOptions(searchQuery);
    }, debounceMs);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [searchQuery, isOpen, fetchOptions, debounceMs]);

  // Load initial options when dropdown opens
  React.useEffect(() => {
    if (isOpen && options.length === 0) {
      fetchOptions("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // Animate items when options change
  React.useEffect(() => {
    if (isOpen && listRef.current && !isLoading && options.length > 0) {
      const items = listRef.current.querySelectorAll("[data-option]");
      animate(items, {
        opacity: [0, 1],
        translateX: [-10, 0],
        delay: stagger(25),
        duration: 180,
        ease: "outQuad",
      });
    }
  }, [options, isLoading, isOpen]);

  const handleSelect = (option: SelectOption) => {
    setSelectedOption(option);
    onChange?.(option.value, option);
    setIsOpen(false);
    setSearchQuery("");
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedOption(null);
    onChange?.("", null);
  };

  // Handle keyboard
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger
        disabled={disabled}
        className={cn(
          "flex h-10 w-full items-center justify-between rounded-lg border border-input bg-transparent px-3 text-sm transition-colors",
          "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
          disabled && "opacity-50 cursor-not-allowed",
          className
        )}
        onKeyDown={handleKeyDown}
      >
        <span className={cn(!selectedOption && "text-muted-foreground")}>
          {selectedOption?.label || placeholder}
        </span>
        {selectedOption ? (
          <button
            type="button"
            onClick={handleClear}
            className="rounded-sm p-0.5 hover:bg-muted"
          >
            <IconX className="h-4 w-4" />
          </button>
        ) : (
          <IconSearch className="h-4 w-4 text-muted-foreground" />
        )}
      </PopoverTrigger>
      <PopoverContent className="w-(--anchor-width) min-w-[200px] p-0">
        <div className="p-2 border-b">
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Type to search..."
            className="h-8"
            autoFocus
          />
        </div>
        <div ref={listRef} className="max-h-60 overflow-y-auto p-1">
          {isLoading ? (
            <div className="flex items-center justify-center py-4 gap-2 text-sm text-muted-foreground">
              <IconLoader2 className="h-4 w-4 animate-spin" />
              Loading...
            </div>
          ) : options.length === 0 ? (
            <div className="py-4 text-center text-sm text-muted-foreground">
              {searchQuery ? "No results found" : "Type to search..."}
            </div>
          ) : (
            options.map((option) => {
              const isSelected = value === option.value;
              return (
                <button
                  key={option.value}
                  data-option
                  type="button"
                  disabled={option.disabled}
                  onClick={() => handleSelect(option)}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm outline-none",
                    "hover:bg-muted focus:bg-muted",
                    isSelected && "bg-muted",
                    option.disabled && "opacity-50 cursor-not-allowed"
                  )}
                >
                  <span className="flex-1 text-left">{option.label}</span>
                  {isSelected && <IconCheck className="h-4 w-4 text-primary" />}
                </button>
              );
            })
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

export { MultiSelect, AsyncSelect };
export type { MultiSelectProps, AsyncSelectProps };
