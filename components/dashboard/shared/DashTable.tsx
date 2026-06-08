"use client";

import { type ReactNode } from "react";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { cn } from "@/lib/cn";

export type Column<T> = {
  key: string;
  header: string;
  render?: (row: T) => ReactNode;
  sortable?: boolean;
  className?: string;
};

export type DashTableProps<T> = {
  columns: Column<T>[];
  rows: T[];
  getId: (row: T) => string;
  loading?: boolean;

  // Pagination
  page?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;

  // Sorting
  sort?: string;
  order?: "asc" | "desc";
  onSortChange?: (key: string) => void;

  // Selection + bulk actions
  selectable?: boolean;
  selectedIds?: string[];
  onSelectionChange?: (ids: string[]) => void;
  bulkActions?: ReactNode;

  onRowClick?: (row: T) => void;
  emptyTitle?: string;
  emptyDescription?: string;
};

export function DashTable<T>({
  columns,
  rows,
  getId,
  loading,
  page = 1,
  totalPages = 1,
  onPageChange,
  sort,
  order,
  onSortChange,
  selectable,
  selectedIds = [],
  onSelectionChange,
  bulkActions,
  onRowClick,
  emptyTitle = "Nothing here yet",
  emptyDescription,
}: DashTableProps<T>) {
  const allSelected = rows.length > 0 && selectedIds.length === rows.length;

  function toggleAll() {
    if (!onSelectionChange) return;
    onSelectionChange(allSelected ? [] : rows.map(getId));
  }

  function toggleOne(id: string) {
    if (!onSelectionChange) return;
    onSelectionChange(
      selectedIds.includes(id)
        ? selectedIds.filter((x) => x !== id)
        : [...selectedIds, id],
    );
  }

  return (
    <div className="space-y-3">
      {selectable && selectedIds.length > 0 && (
        <div className="flex items-center gap-3 rounded-lg bg-gold/10 px-4 py-2 text-sm">
          <span className="font-medium">{selectedIds.length} selected</span>
          <div className="flex flex-wrap gap-2">{bulkActions}</div>
        </div>
      )}

      <div className="overflow-x-auto rounded-xl border border-black/5 bg-white dark:border-white/10 dark:bg-white/5">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-black/5 text-xs uppercase tracking-wide text-charcoal/50 dark:border-white/10 dark:text-cream/50">
            <tr>
              {selectable && (
                <th className="w-10 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleAll}
                    aria-label="Select all"
                  />
                </th>
              )}
              {columns.map((col) => (
                <th key={col.key} className={cn("px-4 py-3 font-medium", col.className)}>
                  {col.sortable && onSortChange ? (
                    <button
                      onClick={() => onSortChange(col.key)}
                      className="inline-flex items-center gap-1 hover:text-gold"
                    >
                      {col.header}
                      {sort === col.key && (
                        <span>{order === "asc" ? "▲" : "▼"}</span>
                      )}
                    </button>
                  ) : (
                    col.header
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5 dark:divide-white/10">
            {loading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    {selectable && <td className="px-4 py-3" />}
                    {columns.map((col) => (
                      <td key={col.key} className="px-4 py-3">
                        <Skeleton className="h-4 w-full" />
                      </td>
                    ))}
                  </tr>
                ))
              : rows.map((row) => {
                  const id = getId(row);
                  return (
                    <tr
                      key={id}
                      onClick={() => onRowClick?.(row)}
                      className={cn(
                        "transition",
                        onRowClick && "cursor-pointer hover:bg-black/[0.02] dark:hover:bg-white/[0.03]",
                      )}
                    >
                      {selectable && (
                        <td
                          className="px-4 py-3"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <input
                            type="checkbox"
                            checked={selectedIds.includes(id)}
                            onChange={() => toggleOne(id)}
                            aria-label="Select row"
                          />
                        </td>
                      )}
                      {columns.map((col) => (
                        <td key={col.key} className={cn("px-4 py-3", col.className)}>
                          {col.render
                            ? col.render(row)
                            : String((row as Record<string, unknown>)[col.key] ?? "")}
                        </td>
                      ))}
                    </tr>
                  );
                })}
          </tbody>
        </table>

        {!loading && rows.length === 0 && (
          <div className="p-6">
            <EmptyState title={emptyTitle} description={emptyDescription} />
          </div>
        )}
      </div>

      {totalPages > 1 && onPageChange && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-charcoal/60 dark:text-cream/60">
            Page {page} of {totalPages}
          </span>
          <div className="flex gap-2">
            <button
              disabled={page <= 1}
              onClick={() => onPageChange(page - 1)}
              className="rounded-lg border border-black/10 px-3 py-1.5 disabled:opacity-50 dark:border-white/10"
            >
              Previous
            </button>
            <button
              disabled={page >= totalPages}
              onClick={() => onPageChange(page + 1)}
              className="rounded-lg border border-black/10 px-3 py-1.5 disabled:opacity-50 dark:border-white/10"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
