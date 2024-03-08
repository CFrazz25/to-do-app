"use client"

import { ColumnDef } from "@tanstack/react-table"

import { PlusIcon, MinusIcon, ZoomInIcon, ZoomOutIcon } from "@radix-ui/react-icons"
import { Task } from "@/app/lib/definitions"
import { DataTableColumnHeader } from "./data-table-column-header"
import { DataTableRowActions } from "./data-table-row-actions"
import { formatDateToLocal, isPastDue } from "@/app/lib/utils"
import PastDueAlertSVG from "../svg/past-due-alert"
import { Button } from "@/app/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  TooltipArrow
} from "@/app/components/ui/tooltip"
import { toast } from "sonner"

import { useContext, useState } from "react"
import { Checkbox } from "./checkbox"
import { TableActionsContext } from "@/app/hooks/useToDo"

function isChildRow(row: any) {
  // Check if the row has a parent or its depth is greater than 0
  return row.depth > 0 || row.parent !== undefined;
}

function TaskCell({ row }: { row: any }) {
  const [view, setView] = useState(false)
  const isComplete = row.getValue("isComplete")
  return (
    <div className="flex space-x-2">
      <span className={`max-w-[300px] ${isComplete ? 'line-through' : ''}  ${view ? 'cursor-zoom-out' : 'truncate cursor-zoom-in'} font-medium ${isChildRow(row) ? 'ml-8' : ''}`}
        onClick={() => setView(!view)}
      >
        {row.getCanExpand() && (
          <button onClick={row.getToggleExpandedHandler()} className="pr-2 rounded-md">
            {row.getIsExpanded() ? <MinusIcon className="font-black" /> : <PlusIcon className="font-black" />}
          </button>
        )}
        {row.getValue("task")}
      </span>
    </div>
  )
}

function MoreDetailsCell({ row }: { row: any }) {
  const [view, setView] = useState(false)
  const isComplete = row.getValue("isComplete")
  return (
    <div className="flex space-x-2">

      <span className={`max-w-[300px] font-medium ${isComplete ? 'line-through' : ''} ${view ? 'cursor-zoom-out' : 'truncate cursor-zoom-in'}`}
        onClick={() => setView(!view)}
      >
        {row.getValue("moreDetails")}
      </span>
    </div>
  )
}

function IsCompleteCell({ row }: { row: any }) {
  const [quickEdit, setQuickEdit] = useState(false)

  const isComplete = row.getValue("isComplete") as boolean
  const [complete, setComplete] = useState(isComplete)
  const { handleEdit } = useContext(TableActionsContext);
  return (
    <div>
      {!quickEdit ? (
        <div className="flex items-center">
          <span>{isComplete ? "✅" : "❌"}</span>
          <Button variant="link" onClick={() => setQuickEdit(!quickEdit)} size="sm" className="text-sky-400 text-xs">
            Quick Edit
          </Button>
        </div>
      ) : (
        <div className="flex items-center">
          <Checkbox checked={complete} onCheckedChange={() => {
            setComplete(!complete)
          }} />
          <span className="text-sky-400 text-xs ml-2 hover:underline hover:cursor-pointer"
            onClick={() => {
              setQuickEdit(!quickEdit)
              handleEdit({ ...row.original, isComplete: complete })

              const toastDescription = complete ? "Congratulations! You've completed a task!" : ""
              toast.success("Task Updated", {
                description: toastDescription,
              })
            }}
          >
            Save
          </span>
          <span className="text-sky-400 text-xs ml-2 hover:underline hover:cursor-pointer"
            onClick={() => {
              setQuickEdit(!quickEdit)
            }}
          >
            Cancel
          </span>
        </div>
      )}
    </div>
  )
}

export const columns: ColumnDef<Task>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllRowsSelected()  // || table.getIsAllPageRowsSelected()
        }
        // can toggle all by page or all at once
        // onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        onCheckedChange={(value) => table.toggleAllRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "task",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Task" />
    ),
    cell: ({ row }) => {
      return <TaskCell row={row} />
    },
  },
  {
    accessorKey: "moreDetails",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="More Details" />
    ),
    cell: ({ row }) => {
      return <MoreDetailsCell row={row} />
    },
  },
  {
    accessorKey: "deadlineDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Deadline Date" />
    ),
    cell: ({ row }) => {
      return (
        <div >
          {
            isPastDue(row.original) ? (
              <TooltipProvider delayDuration={100}>
                <Tooltip >
                  <TooltipTrigger asChild>
                    <div className="flex space-x-2">
                      <span className="max-w-[500px] font-medium">
                        {formatDateToLocal(row.getValue("deadlineDate"))}
                      </span>
                      <PastDueAlertSVG />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="bg-black rounded-md text-white">
                    <TooltipArrow />
                    <p>Past Deadline!!! Complete the task or update the deadline date</p>

                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : (
              <div className="flex space-x-2">
                <span className="max-w-[500px] font-medium">
                  {formatDateToLocal(row.getValue("deadlineDate"))}
                </span>
              </div>
            )}
        </div>
      );
    },
  },
  {
    accessorKey: "isComplete",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Is Complete" />
    ),
    cell: ({ row }) => {
      return <IsCompleteCell row={row} />
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]