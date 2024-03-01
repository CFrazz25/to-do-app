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

// interface DataTableProps<TData, TValue> {
//   columns: ColumnDef<TData, TValue>[]
//   data: TData[]
// }

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
  const onAction = async (action: actions, task?: Task) => {
    try {
      switch (action) {
        case "create":
          await addToDo(task);
          break;
        case "update":
          await updateToDo(task);
          break;
        case "delete":
          await deleteToDo(task.id);
          break;
        case "add sub task":
          await addToDo(task);
        default:
          break;
      }

      refreshToDos();
    } catch (error) {
      console.error(error);
    }

  }

  const handleDelete = async (id: string) => {
    await deleteToDo(id);
    await refreshToDos();
  }

  const handleEdit = async (task: Task) => {
    await updateToDo(task);
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
  })

  return (
    <TableActionsContext.Provider value={{ handleDelete, handleEdit }}>
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
                    className="hover:bg-gray-100 transition-colors duration-200 cursor-pointer"
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