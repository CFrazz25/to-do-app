"use client"

import * as React from "react"
import {
  ColumnFiltersState,
  ExpandedState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table"
import { columns } from "@/app/components/ui/columns"
import { DataTablePagination } from "@/app/components/ui/data-table-pagination"
import { DataTableToolbar } from "@/app/components/ui/data-table-toolbar"
import { Task, ToDoSearchParams } from "@/app/lib/definitions"
import useToDo, { TableActionsContext } from "@/app/hooks/useToDo"
import { isPastDue } from "@/app/lib/utils"

type actions = "update" | "delete" | "create" | "add sub task"

export function DataTable({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = React.useState<string>("")
  const [sorting, setSorting] = React.useState<SortingState>([])
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;

  const toDoSearchParams: ToDoSearchParams = {
    query,
    page: currentPage.toString(),
  };
  const [params, setParams] = React.useState(toDoSearchParams);
  const { todos, loading, error, updateToDo, refreshToDos, addToDo, deleteToDo, stats } = useToDo(params);
  const [expanded, setExpanded] = React.useState<ExpandedState>({});

  const handleDelete = async (id: string) => {
    await deleteToDo(id);
    await refreshToDos();
  }

  const handleEdit = async (task: Task) => {
    await updateToDo(task);
    await refreshToDos();
  }

  const handleCreate = async (task: Task) => {
    await addToDo(task);
    await refreshToDos();
  }

  const table = useReactTable({
    data: todos,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      expanded,
      globalFilter
    },

    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getExpandedRowModel: getExpandedRowModel(),
    onExpandedChange: setExpanded,
    getSubRows: (row: any) => row.children,
    filterFromLeafRows: true,
    globalFilterFn: (row) => {
      return row.original.task.includes(globalFilter) || row.original.moreDetails?.includes(globalFilter);
    },
  })

  return (
    <TableActionsContext.Provider value={{ handleDelete, handleEdit, handleCreate, error }}>
      <div className="text-sm">
        {stats && (
          <p>
            {stats.totalTodos} tasks, {stats.completedTodos} completed, {stats.totalPastDue} past due
          </p>
        )}
      </div>
      <div className="space-y-4">
        <DataTableToolbar table={table} />
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id} colSpan={header.colSpan}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className={`border-gray-300 hover:bg-gray-100 transition-colors duration-200 ${isPastDue(row.original) ? 'bg-red-100' : ''}`}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <DataTablePagination table={table} />
      </div>
    </TableActionsContext.Provider>
  )
}

