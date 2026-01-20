import type { ColumnDef, AccessorFn } from "@tanstack/react-table";

// ============================================
// COLUMN DEFINITION HELPERS
// ============================================
// Type-safe helpers for creating column definitions

type ColumnType = "text" | "number" | "date" | "boolean" | "status" | "currency" | "actions";

interface BaseColumnOptions<TData, TValue> {
  /** Column header text */
  header?: string;
  /** Custom cell renderer */
  cell?: ColumnDef<TData, TValue>["cell"];
  /** Enable sorting (default: true) */
  enableSorting?: boolean;
  /** Enable filtering (default: true) */
  enableFiltering?: boolean;
  /** Enable column hiding (default: true) */
  enableHiding?: boolean;
  /** Enable resizing (default: false) */
  enableResizing?: boolean;
  /** Enable pinning (default: false) */
  enablePinning?: boolean;
  /** Column size */
  size?: number;
  /** Min column size */
  minSize?: number;
  /** Max column size */
  maxSize?: number;
  /** Additional meta data */
  meta?: Record<string, unknown>;
}

interface TextColumnOptions<TData, TValue> extends BaseColumnOptions<TData, TValue> {
  /** Filter variant */
  filterVariant?: "text" | "select";
}

interface NumberColumnOptions<TData, TValue> extends BaseColumnOptions<TData, TValue> {
  /** Filter variant */
  filterVariant?: "number" | "range";
}

interface DateColumnOptions<TData, TValue> extends BaseColumnOptions<TData, TValue> {
  /** Date format options */
  format?: Intl.DateTimeFormatOptions;
  /** Show relative time */
  showRelative?: boolean;
}

interface StatusColumnOptions<TData, TValue> extends BaseColumnOptions<TData, TValue> {
  /** Map of status values to variants */
  statusMap?: Record<string, "default" | "success" | "warning" | "error" | "info">;
  /** Show as dot instead of badge */
  dot?: boolean;
}

interface CurrencyColumnOptions<TData, TValue> extends BaseColumnOptions<TData, TValue> {
  /** Currency code */
  currency?: string;
  /** Locale */
  locale?: string;
  /** Color code positive/negative */
  colorCode?: boolean;
}

// ============================================
// CREATE COLUMN HELPER
// ============================================

/**
 * Creates a typed column definition helper for a specific data type.
 * This provides better type inference when defining columns.
 * 
 * @example
 * ```tsx
 * type User = { id: string; name: string; email: string };
 * const columnHelper = createColumnHelper<User>();
 * 
 * const columns = [
 *   columnHelper.accessor("name", { header: "Name" }),
 *   columnHelper.accessor("email", { header: "Email" }),
 * ];
 * ```
 */
export function createColumnHelper<TData>() {
  return {
    /**
     * Create an accessor column with a string key
     */
    accessor<TKey extends keyof TData & string>(
      accessorKey: TKey,
      options: BaseColumnOptions<TData, TData[TKey]> = {}
    ): ColumnDef<TData, TData[TKey]> {
      return {
        accessorKey,
        header: options.header ?? formatHeader(accessorKey),
        cell: options.cell,
        enableSorting: options.enableSorting ?? true,
        enableColumnFilter: options.enableFiltering ?? true,
        enableHiding: options.enableHiding ?? true,
        enableResizing: options.enableResizing ?? false,
        enablePinning: options.enablePinning ?? false,
        size: options.size,
        minSize: options.minSize,
        maxSize: options.maxSize,
        meta: options.meta,
      };
    },

    /**
     * Create an accessor column with a custom accessor function
     */
    accessorFn<TValue>(
      accessorFn: AccessorFn<TData, TValue>,
      id: string,
      options: BaseColumnOptions<TData, TValue> = {}
    ): ColumnDef<TData, TValue> {
      return {
        id,
        accessorFn,
        header: options.header ?? formatHeader(id),
        cell: options.cell,
        enableSorting: options.enableSorting ?? true,
        enableColumnFilter: options.enableFiltering ?? true,
        enableHiding: options.enableHiding ?? true,
        enableResizing: options.enableResizing ?? false,
        enablePinning: options.enablePinning ?? false,
        size: options.size,
        minSize: options.minSize,
        maxSize: options.maxSize,
        meta: options.meta,
      };
    },

    /**
     * Create a display column (no data accessor)
     */
    display(
      id: string,
      options: Omit<ColumnDef<TData, unknown>, "accessorKey" | "accessorFn" | "id">
    ): ColumnDef<TData, unknown> {
      return {
        id,
        ...options,
        enableSorting: false,
        enableColumnFilter: false,
      };
    },

    /**
     * Create a text column with appropriate defaults
     */
    text<TKey extends keyof TData & string>(
      accessorKey: TKey,
      options: TextColumnOptions<TData, TData[TKey]> = {}
    ): ColumnDef<TData, TData[TKey]> {
      return {
        accessorKey,
        header: options.header ?? formatHeader(accessorKey),
        cell: options.cell,
        enableSorting: options.enableSorting ?? true,
        enableColumnFilter: options.enableFiltering ?? true,
        enableHiding: options.enableHiding ?? true,
        enableResizing: options.enableResizing ?? false,
        meta: {
          filterVariant: options.filterVariant ?? "text",
          ...options.meta,
        },
      };
    },

    /**
     * Create a number column with appropriate defaults
     */
    number<TKey extends keyof TData & string>(
      accessorKey: TKey,
      options: NumberColumnOptions<TData, TData[TKey]> = {}
    ): ColumnDef<TData, TData[TKey]> {
      return {
        accessorKey,
        header: options.header ?? formatHeader(accessorKey),
        cell: options.cell ?? (({ getValue }) => {
          const value = getValue();
          return typeof value === "number" ? value.toLocaleString() : value;
        }),
        enableSorting: options.enableSorting ?? true,
        enableColumnFilter: options.enableFiltering ?? true,
        enableHiding: options.enableHiding ?? true,
        meta: {
          filterVariant: options.filterVariant ?? "number",
          ...options.meta,
        },
      };
    },

    /**
     * Create a date column with formatting
     */
    date<TKey extends keyof TData & string>(
      accessorKey: TKey,
      options: DateColumnOptions<TData, TData[TKey]> = {}
    ): ColumnDef<TData, TData[TKey]> {
      const format = options.format ?? { dateStyle: "medium" };
      
      return {
        accessorKey,
        header: options.header ?? formatHeader(accessorKey),
        cell: options.cell ?? (({ getValue }) => {
          const value = getValue();
          if (!value) return "—";
          const date = value instanceof Date ? value : new Date(value as string | number);
          if (isNaN(date.getTime())) return "—";
          return new Intl.DateTimeFormat("en", format).format(date);
        }),
        enableSorting: options.enableSorting ?? true,
        enableColumnFilter: options.enableFiltering ?? true,
        enableHiding: options.enableHiding ?? true,
        meta: {
          filterVariant: "date",
          format,
          showRelative: options.showRelative,
          ...options.meta,
        },
      };
    },

    /**
     * Create a boolean column
     */
    boolean<TKey extends keyof TData & string>(
      accessorKey: TKey,
      options: BaseColumnOptions<TData, TData[TKey]> = {}
    ): ColumnDef<TData, TData[TKey]> {
      return {
        accessorKey,
        header: options.header ?? formatHeader(accessorKey),
        cell: options.cell ?? (({ getValue }) => {
          const value = getValue();
          return value ? "Yes" : "No";
        }),
        enableSorting: options.enableSorting ?? true,
        enableColumnFilter: options.enableFiltering ?? true,
        enableHiding: options.enableHiding ?? true,
        meta: {
          filterVariant: "boolean",
          ...options.meta,
        },
      };
    },
  };
}

// ============================================
// PRESET CONFIGURATIONS
// ============================================

export interface DataTablePreset {
  enableSorting?: boolean;
  enableFiltering?: boolean;
  enablePagination?: boolean;
  enableRowSelection?: boolean;
  enableColumnOrdering?: boolean;
  enableColumnPinning?: boolean;
  enableColumnResizing?: boolean;
  enableExpanding?: boolean;
  enableGrouping?: boolean;
  enableVirtualization?: boolean;
  initialPageSize?: number;
}

/**
 * Preset for CRUD tables with selection and row actions
 */
export const crudTablePreset: DataTablePreset = {
  enableSorting: true,
  enableFiltering: true,
  enablePagination: true,
  enableRowSelection: true,
  enableColumnOrdering: false,
  enableColumnPinning: true,
  enableColumnResizing: false,
  enableExpanding: false,
  enableGrouping: false,
  enableVirtualization: false,
  initialPageSize: 10,
};

/**
 * Preset for readonly/display tables
 */
export const readonlyTablePreset: DataTablePreset = {
  enableSorting: true,
  enableFiltering: true,
  enablePagination: true,
  enableRowSelection: false,
  enableColumnOrdering: false,
  enableColumnPinning: false,
  enableColumnResizing: false,
  enableExpanding: false,
  enableGrouping: false,
  enableVirtualization: false,
  initialPageSize: 10,
};

/**
 * Preset for large datasets with virtualization
 */
export const virtualTablePreset: DataTablePreset = {
  enableSorting: true,
  enableFiltering: true,
  enablePagination: false, // Virtualization replaces pagination
  enableRowSelection: false,
  enableColumnOrdering: false,
  enableColumnPinning: true,
  enableColumnResizing: true,
  enableExpanding: false,
  enableGrouping: false,
  enableVirtualization: true,
  initialPageSize: 50,
};

/**
 * Preset for expandable/hierarchical data
 */
export const expandableTablePreset: DataTablePreset = {
  enableSorting: true,
  enableFiltering: true,
  enablePagination: true,
  enableRowSelection: false,
  enableColumnOrdering: false,
  enableColumnPinning: false,
  enableColumnResizing: false,
  enableExpanding: true,
  enableGrouping: false,
  enableVirtualization: false,
  initialPageSize: 10,
};

/**
 * Preset for grouped/aggregated data
 */
export const groupedTablePreset: DataTablePreset = {
  enableSorting: true,
  enableFiltering: true,
  enablePagination: true,
  enableRowSelection: false,
  enableColumnOrdering: false,
  enableColumnPinning: false,
  enableColumnResizing: false,
  enableExpanding: true,
  enableGrouping: true,
  enableVirtualization: false,
  initialPageSize: 20,
};

/**
 * Create a custom preset by extending a base preset
 */
export function createTablePreset(
  base: DataTablePreset,
  overrides: Partial<DataTablePreset>
): DataTablePreset {
  return { ...base, ...overrides };
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Format a camelCase or snake_case key as a header title
 */
function formatHeader(key: string): string {
  return key
    .replace(/([A-Z])/g, " $1") // camelCase -> camel Case
    .replace(/_/g, " ") // snake_case -> snake case
    .replace(/^\w/, (c) => c.toUpperCase()) // Capitalize first letter
    .trim();
}

/**
 * Export data to CSV format
 */
export function exportToCSV<TData extends Record<string, unknown>>(
  data: TData[],
  columns: string[],
  filename: string = "export.csv"
): void {
  if (data.length === 0) return;

  const headers = columns.map(formatHeader);
  const rows = data.map((row) =>
    columns.map((col) => {
      const value = row[col];
      if (value === null || value === undefined) return "";
      if (typeof value === "string" && value.includes(",")) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return String(value);
    })
  );

  const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join(
    "\n"
  );

  downloadFile(csvContent, filename, "text/csv");
}

/**
 * Export data to JSON format
 */
export function exportToJSON<TData>(
  data: TData[],
  filename: string = "export.json"
): void {
  const jsonContent = JSON.stringify(data, null, 2);
  downloadFile(jsonContent, filename, "application/json");
}

/**
 * Download a file
 */
function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export type {
  BaseColumnOptions,
  TextColumnOptions,
  NumberColumnOptions,
  DateColumnOptions,
  StatusColumnOptions,
  CurrencyColumnOptions,
  ColumnType,
};
