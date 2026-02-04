import * as React from "react";
import { cn } from "@/lib/utils";

type AriaSort = "ascending" | "descending" | "none" | "other";

interface TableProps extends React.HTMLAttributes<HTMLTableElement> {
  striped?: boolean;
  bordered?: boolean;
  isGrid?: boolean;
  ariaColCount?: number;
  ariaRowCount?: number;
}

function Table({
  className,
  striped = false,
  bordered = false,
  isGrid = false,
  ariaColCount,
  ariaRowCount,
  ...props
}: TableProps) {
  return (
    <div className="relative w-full overflow-auto">
      <table
        data-slot="table"
        data-striped={striped}
        data-bordered={bordered}
        role={isGrid ? "grid" : undefined}
        aria-colcount={ariaColCount}
        aria-rowcount={ariaRowCount}
        className={cn(
          "w-full caption-bottom text-sm",
          striped && "[&_tbody_tr:nth-child(even)]:bg-muted/50",
          bordered &&
            "border-collapse [&_td]:border [&_th]:border [&_td]:border-border [&_th]:border-border",
          className
        )}
        {...props}
      />
    </div>
  );
}

function TableHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead
      data-slot="table-header"
      className={cn("[&_tr]:border-b", className)}
      {...props}
    />
  );
}

function TableBody({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <tbody
      data-slot="table-body"
      className={cn("[&_tr:last-child]:border-0", className)}
      {...props}
    />
  );
}

function TableFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn(
        "border-t bg-muted/50 font-medium [&>tr]:last:border-b-0",
        className
      )}
      {...props}
    />
  );
}

interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  isSelected?: boolean;
  isGridRow?: boolean;
}

function TableRow({
  className,
  isSelected,
  isGridRow = false,
  ...props
}: TableRowProps) {
  return (
    <tr
      data-slot="table-row"
      data-state={isSelected ? "selected" : undefined}
      role={isGridRow ? "row" : undefined}
      aria-selected={isSelected}
      className={cn(
        "border-b border-border transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
        className
      )}
      {...props}
    />
  );
}

interface TableHeadProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  scope?: "col" | "row" | "colgroup" | "rowgroup";
  ariaSort?: AriaSort;
  isGridCell?: boolean;
}

function TableHead({
  className,
  scope = "col",
  ariaSort,
  isGridCell = false,
  ...props
}: TableHeadProps) {
  return (
    <th
      data-slot="table-head"
      scope={scope}
      role={isGridCell ? "columnheader" : undefined}
      aria-sort={ariaSort}
      className={cn(
        "h-10 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0",
        className
      )}
      {...props}
    />
  );
}

interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  isGridCell?: boolean;
}

function TableCell({
  className,
  isGridCell = false,
  ...props
}: TableCellProps) {
  return (
    <td
      data-slot="table-cell"
      role={isGridCell ? "gridcell" : undefined}
      className={cn(
        "p-4 align-middle [&:has([role=checkbox])]:pr-0",
        className
      )}
      {...props}
    />
  );
}

function TableCaption({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableCaptionElement>) {
  return (
    <caption
      data-slot="table-caption"
      className={cn("py-4 text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
};

export type {
  TableProps,
  TableRowProps,
  TableHeadProps,
  TableCellProps,
  AriaSort,
};
