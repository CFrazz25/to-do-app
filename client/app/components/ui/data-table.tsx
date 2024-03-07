"use client"

import * as React from "react"
import {
  ColumnDef,
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
import { useCallback } from "react"

// interface DataTableProps<TData, TValue> {
//   columns: ColumnDef<TData, TValue>[]
//   data: TData[]
// }

type actions = "update" | "delete" | "create" | "add sub task"

// function isPastDue(todo: ToDo): boolean {
//   const today = normalizeDate(new Date());
//   const deadlineDate = normalizeDate(new Date(todo.deadlineDate));
//   return deadlineDate < today && !todo.isComplete;
// }



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
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [sorting, setSorting] = React.useState<SortingState>([])

  const [open, setOpen] = React.useState(false);
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

  const matchFilterCriteria = (row, columnFilters) => {
    return columnFilters.every(({ id, value }) => {
      const cellValue = row.values[id];
      if (Array.isArray(cellValue)) {
        return cellValue.some((v) => v.toLowerCase().includes(value.toLowerCase()));
      }
      return cellValue.toLowerCase().includes(value.toLowerCase());
    });
  };

  const customFilterRows = (rows, columnFilters) => {
    const filteredRows = [];

    rows.forEach(row => {
      // Assume `matchFilterCriteria` is a function that checks if a row matches the filter criteria based on `columnFilters`
      if (matchFilterCriteria(row, columnFilters)) {
        filteredRows.push(row);
        // Automatically include its subRows if any
        if (row.children && row.children.length > 0) {
          filteredRows.push(...row.children);
        }
      } else if (row.children && row.children.some(child => matchFilterCriteria(child, columnFilters))) {
        // If any child matches the filter criteria, include the parent and all its children
        filteredRows.push(row);
        filteredRows.push(...row.children);
      }
    });

    return filteredRows;
  };


  // const table = useReactTable({
  //   data: todos,
  //   // filterFns: globalFilter,
  //   columns,
  //   state: {
  //     sorting,
  //     columnVisibility,
  //     rowSelection,
  //     columnFilters,
  //     expanded
  //   },
  //   enableRowSelection: true,
  //   onRowSelectionChange: setRowSelection,
  //   onSortingChange: setSorting,
  //   onColumnFiltersChange: setColumnFilters,
  //   onColumnVisibilityChange: setColumnVisibility,
  //   getCoreRowModel: getCoreRowModel(),
  //   getFilteredRowModel: getFilteredRowModel(),
  //   getPaginationRowModel: getPaginationRowModel(),
  //   getSortedRowModel: getSortedRowModel(),
  //   getFacetedRowModel: getFacetedRowModel(),
  //   getFacetedUniqueValues: getFacetedUniqueValues(),
  //   getExpandedRowModel: getExpandedRowModel(),
  //   onExpandedChange: setExpanded,
  //   getSubRows: (row: any) => row.children,
  // })

  const table = useReactTable({
    data: todos,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      expanded
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
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
  })

  return (
    <TableActionsContext.Provider value={{ handleDelete, handleEdit, handleCreate, error }}>
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