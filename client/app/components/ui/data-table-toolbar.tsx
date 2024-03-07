"use client"

import { Cross2Icon, PlusIcon } from "@radix-ui/react-icons"
import { Table } from "@tanstack/react-table"

import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { DataTableViewOptions } from "@/app/components/ui/data-table-view-options"

import { priorities, statuses } from "@/app/lib/data"
import { DataTableFacetedFilter } from "@/app/components/ui/data-table-faceted-filter"
import { TaskFormModal } from "./task-form-modal"
import { useState } from "react"
import { de } from "date-fns/locale"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
}

function handleFullTextSearch<TData>(table: Table<TData>, query: string) {
  // table.setGlobalFilter(query)
  // table.getColumn("task")?.setFilterValue(query)
  // table.getColumn("moreDetails")?.setFilterValue(query)
  table.getColumn("children")?.setFilterValue(query)


}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0
  const [open, setOpen] = useState(false)
  const handleClose = () => setOpen(false)
  // table.setGlobalFilter("make")
  // console.log(table.getAllColumns(), table.getFilteredRowModel())
  // console.log(table.getColumn("task")?.getFilterValue())
  // console.log("complete", table.getColumn("isComplete")?.getFilterValue())
  // if (table) {
  //   console.log("table", table)

  // }
  return (

    <div className="flex items-center justify-between">
      <TaskFormModal props={{ action: "create", open, handleClose }} />
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter tasks..."
          // value={(table.getColumn("children")?.getFilterValue() as string) ?? ""}
          // onChange={(event) =>
          //   table.getColumn("children")?.setFilterValue(event.target.value)
          // }
          value={table.getState().globalFilter ?? ""}
          onChange={(event) => table.setGlobalFilter(event.target.value)}
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {/* {table.getColumn("status") && (
          <DataTableFacetedFilter
            column={table.getColumn("status")}
            title="Status"
            options={statuses}
          />
        )} */}
        {table.getColumn("isComplete") && (
          <DataTableFacetedFilter
            column={table.getColumn("isComplete")}
            title="Completed"
            options={[{ value: "true", label: "Yes" }, { value: "false", label: "No" }]}

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