"use client";

import * as React from "react";
import {
  type ColumnDef,
  type PaginationState,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ChevronLeft, ChevronRight, Download, Search, X } from "lucide-react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchKey?: string;
  isLoading?: boolean;
  toolbar?: React.ReactNode;
  tableLabel?: string;
  exportFilename?: string;
}

function csvCell(value: unknown): string {
  let text = value == null ? "" : String(value);
  // Keep spreadsheet apps from evaluating user-controlled cells as formulas.
  if (/^[\s\u0000-\u001f]*[=+\-@]/.test(text) || /^[\t\r\n]/.test(text)) {
    text = `'${text}`;
  }
  return `"${text.replace(/"/g, '""')}"`;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchKey = "records",
  isLoading = false,
  toolbar,
  tableLabel = "Records",
  exportFilename = "data.csv",
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const table = useReactTable({
    data,
    columns,
    state: { sorting, globalFilter, pagination },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    getColumnCanGlobalFilter: (column) => Boolean(column.accessorFn),
    globalFilterFn: (row, columnId, filterValue: string) =>
      String(row.getValue(columnId) ?? "")
        .toLocaleLowerCase()
        .includes(filterValue.trim().toLocaleLowerCase()),
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const pageCount = Math.max(1, table.getPageCount());
  const filteredCount = table.getFilteredRowModel().rows.length;
  const rows = table.getRowModel().rows;
  const columnCount = Math.max(1, table.getVisibleLeafColumns().length);

  React.useEffect(() => {
    setPagination((current) =>
      current.pageIndex >= pageCount
        ? { ...current, pageIndex: pageCount - 1 }
        : current,
    );
  }, [pageCount]);

  const updateSearch = (value: string) => {
    setGlobalFilter(value);
    table.setPageIndex(0);
  };

  const exportToCsv = () => {
    const exportColumns = table
      .getVisibleLeafColumns()
      .filter((column) => column.accessorFn);
    const headers = exportColumns.map((column) =>
      csvCell(
        typeof column.columnDef.header === "string"
          ? column.columnDef.header
          : column.id,
      ),
    );
    const exportRows = table
      .getPrePaginationRowModel()
      .rows.map((row) =>
        exportColumns
          .map((column) => csvCell(row.getValue(column.id)))
          .join(","),
      );
    const blob = new Blob(
      ["\uFEFF", [headers.join(","), ...exportRows].join("\r\n")],
      {
        type: "text/csv;charset=utf-8;",
      },
    );
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = exportFilename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return (
    <div className="data-table space-y-4">
      <div className="data-table-toolbar flex flex-wrap items-center justify-between gap-3">
        <div className="data-table-search relative w-full sm:max-w-xs">
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            type="search"
            aria-label={`Search ${searchKey}`}
            placeholder={`Search ${searchKey}…`}
            value={globalFilter}
            onChange={(event) => updateSearch(event.target.value)}
            className="pl-9 pr-10"
          />
          {globalFilter && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Clear search"
              onClick={() => updateSearch("")}
              className="absolute right-0 top-0 h-full w-10"
            >
              <X aria-hidden="true" className="h-4 w-4" />
            </Button>
          )}
        </div>
        {toolbar}
        <Button
          type="button"
          variant="outline"
          onClick={exportToCsv}
          disabled={isLoading || filteredCount === 0}
          aria-label={`Export ${filteredCount} filtered records as CSV`}
          className="data-table-export"
        >
          <Download aria-hidden="true" className="mr-2 h-4 w-4" /> Export CSV
        </Button>
      </div>
      <div className="data-table-surface rounded-md border">
        <Table aria-label={tableLabel} aria-busy={isLoading}>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} scope="col">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={columnCount}
                  className="data-table-empty h-56 text-center"
                >
                  <div role="status" className="text-sm text-muted-foreground">
                    Loading records…
                  </div>
                </TableCell>
              </TableRow>
            ) : rows.length > 0 ? (
              rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columnCount}
                  className="data-table-empty h-56 text-center"
                >
                  <div role="status">
                    <p className="font-medium">
                      {globalFilter
                        ? "No matching records"
                        : "No records to show"}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {globalFilter
                        ? "Try another medicine, supplier, or stock number."
                        : "Choose another stock filter or add an inventory item."}
                    </p>
                    {globalFilter && (
                      <Button variant="link" onClick={() => updateSearch("")}>
                        Clear search
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="data-table-footer flex flex-wrap items-center justify-between gap-3">
        <p aria-live="polite" className="text-xs text-muted-foreground">
          {isLoading
            ? "Loading inventory…"
            : filteredCount === 0
              ? "0 records"
              : `Showing ${pagination.pageIndex * pagination.pageSize + 1}–${Math.min((pagination.pageIndex + 1) * pagination.pageSize, filteredCount)} of ${filteredCount} records`}
        </p>
        <nav aria-label="Table pagination" className="flex items-center gap-2">
          <span className="mr-2 text-xs text-muted-foreground">
            Page {Math.min(pagination.pageIndex + 1, pageCount)} of {pageCount}
          </span>
          <Button
            type="button"
            onClick={() => table.previousPage()}
            disabled={isLoading || !table.getCanPreviousPage()}
            size="icon"
            variant="outline"
            aria-label="Previous page"
            className="h-9 w-9"
          >
            <ChevronLeft aria-hidden="true" className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            onClick={() => table.nextPage()}
            disabled={isLoading || !table.getCanNextPage()}
            size="icon"
            variant="outline"
            aria-label="Next page"
            className="h-9 w-9"
          >
            <ChevronRight aria-hidden="true" className="h-4 w-4" />
          </Button>
        </nav>
      </div>
    </div>
  );
}
