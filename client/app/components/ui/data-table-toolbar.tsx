"use client"

import { Cross2Icon, PlusIcon } from "@radix-ui/react-icons"
import { Table } from "@tanstack/react-table"
import { Button } from "@/app/components/ui/button"
import { DataTableViewOptions } from "@/app/components/ui/data-table-view-options"
import { DataTableFacetedFilter } from "@/app/components/ui/data-table-faceted-filter"
import { TaskFormModal } from "./task-form-modal"
import { useState } from "react"
import { DebouncedInput } from "./debounced"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0
  const [open, setOpen] = useState(false)
  const handleClose = () => setOpen(false)
  return (
    <div className="flex items-center justify-between">
      <TaskFormModal props={{ action: "create", open, handleClose }} />
      <div className="flex flex-1 items-center space-x-2">
        <DebouncedInput
          placeholder="Filter tasks & more details..."
          value={table.getState().globalFilter ?? ""}
          onChange={value => table.setGlobalFilter(String(value))}
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {table.getColumn("isComplete") && (
          <DataTableFacetedFilter
            column={table.getColumn("isComplete")}
            title="Completed"
            options={[{ value: true, label: "Yes" }, { value: false, label: "No" }]}
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <Button
        variant="outline"
        size="sm"
        className="ml-auto hidden h-8 lg:flex mr-4 bg-[#252525] text-white"
        onClick={() => setOpen(true)}
      >
        <PlusIcon className="mr-2 h-4 w-4" />
        Create Task
      </Button>
      <DataTableViewOptions table={table} />
    </div>
  )
}
