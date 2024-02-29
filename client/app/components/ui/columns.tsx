"use client"

import { ColumnDef } from "@tanstack/react-table"

import { Badge } from "@/app/registry/new-york/ui/badge"
import { Checkbox } from "@/app/registry/new-york/ui/checkbox"

import { labels, priorities, statuses } from "@/app/lib/data"
import { Task } from "@/app/lib/definitions"
import { DataTableColumnHeader } from "./data-table-column-header"
import { DataTableRowActions } from "./data-table-row-actions"
import { formatDateToLocal } from "@/app/lib/utils"

function isChildRow(row) {
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
      const label = labels.find((label) => label.value === row.original.label)

      return (
        <div className="flex space-x-2">
          {label && <Badge variant="outline">{label.label}</Badge>}
          {/* <span className="max-w-[500px] truncate font-medium"> */}
          <span className={`max-w-[300px] truncate font-medium ${isChildRow(row) ? 'ml-8' : ''}`}>
            {row.getCanExpand() && (
              <button onClick={row.getToggleExpandedHandler()} className="pr-2 rounded-md">
                {/* {row.getIsExpanded() ? "-" : "+"} */}
                {row.getIsExpanded() ? '👇' : '👉'}

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
      const label = labels.find((label) => label.value === row.original.label)

      return (
        <div className="flex space-x-2">
          {label && <Badge variant="outline">{label.label}</Badge>}
          <span className="max-w-[300px] truncate font-medium">
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
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {formatDateToLocal(row.getValue("deadlineDate"))}
          </span>
        </div>
      )
    },
  },

  {
    accessorKey: "isComplete",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Is Complete" />
    ),
    cell: ({ row }) => {
      // const label = labels.find((label) => label.value === row.original.label)
      const isComplete = row.getValue("isComplete")
      return (
        <div className="flex items-center">
          {/* {label && <Badge variant="outline">{label.label}</Badge>} */}
          <span>{isComplete ? "✅" : "❌"}</span>
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