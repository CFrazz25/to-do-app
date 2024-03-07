"use client"

import { ColumnDef } from "@tanstack/react-table"

import { Badge } from "@/app/components/ui/badge"
// import { Checkbox } from "@/app/components/ui/checkbox"
import { PlusIcon, MinusIcon, ZoomInIcon, ZoomOutIcon } from "@radix-ui/react-icons"
import { labels, priorities, statuses } from "@/app/lib/data"
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

import { styled } from '@stitches/react';
import { useContext, useState } from "react"
import { set } from "date-fns"
import { Checkbox } from "./checkbox"
import { TableActionsContext } from "@/app/hooks/useToDo"

function isChildRow(row: any) {
  // Check if the row has a parent or its depth is greater than 0
  return row.depth > 0 || row.parent !== undefined;
}

export const columns: ColumnDef<Task>[] = [
  // {
  //   id: "select",
  //   header: ({ table }) => (
  //     <Checkbox
  //       checked={
  //         table.getIsAllPageRowsSelected() ||
  //         (table.getIsSomePageRowsSelected() && "indeterminate")
  //       }
  //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
  //       aria-label="Select all"
  //       className="translate-y-[2px]"
  //     />
  //   ),
  //   cell: ({ row }) => (
  //     <Checkbox
  //       checked={row.getIsSelected()}
  //       onCheckedChange={(value) => row.toggleSelected(!!value)}
  //       aria-label="Select row"
  //       className="translate-y-[2px]"
  //     />
  //   ),
  //   enableSorting: false,
  //   enableHiding: false,
  // },


  // {
  //   accessorKey: "id",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Task" />
  //   ),
  //   cell: ({ row }) => <div className="w-[80px]">{row.getValue("id")}</div>,
  //   enableSorting: false,
  //   enableHiding: false,
  // },

  {
    accessorKey: "task",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Task" />
    ),
    cell: ({ row }) => {
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
    },
  },
  {
    accessorKey: "moreDetails",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="More Details" />
    ),
    cell: ({ row }) => {
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
    filterFn: 'equals',
    cell: ({ row }) => {
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

      //     return (
      //       <div className="flex items-center">
      //         {priority.icon && (
      //           <priority.icon className="mr-2 h-4 w-4 text-muted-foreground" />
      //         )}
      //         <span>{priority.label}</span>
      //       </div>
    },

  },
  // {
  //   id: 'children', // Custom ID for the children column
  //   accessorKey: 'children', // Value accessor
  //   header: () => null, // No header
  //   cell: ({ row }) => (
  //     // Render a button or any element to toggle expand/collapse
  //     <span >
  //       {row.getIsExpanded() ? '👇' : '👉'}
  //     </span>
  //   ),
  // },


  // {
  //   accessorKey: "status",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Status" />
  //   ),
  //   cell: ({ row }) => {
  //     const status = statuses.find(
  //       (status) => status.value === row.getValue("status")
  //     )

  //     if (!status) {
  //       return null
  //     }

  //     return (
  //       <div className="flex w-[100px] items-center">
  //         {status.icon && (
  //           <status.icon className="mr-2 h-4 w-4 text-muted-foreground" />
  //         )}
  //         <span>{status.label}</span>
  //       </div>
  //     )
  //   },
  //   filterFn: (row, id, value) => {
  //     return value.includes(row.getValue(id))
  //   },
  // },


  // {
  //   accessorKey: "priority",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Priority" />
  //   ),
  //   cell: ({ row }) => {
  //     const priority = priorities.find(
  //       (priority) => priority.value === row.getValue("priority")
  //     )

  //     if (!priority) {
  //       return null
  //     }

  //     return (
  //       <div className="flex items-center">
  //         {priority.icon && (
  //           <priority.icon className="mr-2 h-4 w-4 text-muted-foreground" />
  //         )}
  //         <span>{priority.label}</span>
  //       </div>
  //     )
  //   },
  //   filterFn: (row, id, value) => {
  //     return value.includes(row.getValue(id))
  //   },
  // },


  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]