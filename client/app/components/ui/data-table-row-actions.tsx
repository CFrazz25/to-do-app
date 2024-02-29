"use client"

import { DotsHorizontalIcon } from "@radix-ui/react-icons"
import { Row } from "@tanstack/react-table"
import { deleteToDo } from "@/app/services/toDoApi"
import { Button } from "@/app/registry/new-york/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/app/registry/new-york/ui/dropdown-menu"

import { labels } from "@/app/lib/data"
import { taskSchema } from "@/app/lib/definitions"
import { useContext, useState } from "react"
import { TableActionsContext } from "@/app/hooks/useToDo"
import { TaskFormModal } from "@/app/components/ui/task-form-modal"

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  // const task = taskSchema.parse(row.original)
  const { handleDelete } = useContext(TableActionsContext);
  const [open, setOpen] = useState(false)
  const handleClose = () => setOpen(false)
  const props = { open, handleClose }

  return (
    <div>
      <TaskFormModal props={props} />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
          >
            <DotsHorizontalIcon className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px] bg-white">
          <DropdownMenuItem className="hover:bg-gray-200 hover:cursor-pointer"
            onClick={() => setOpen(true)}
          >Edit</DropdownMenuItem>
          {/* <DropdownMenuItem>Make a copy</DropdownMenuItem>
        <DropdownMenuItem>Favorite</DropdownMenuItem> */}
          <DropdownMenuSeparator />
          {/* <DropdownMenuSub>
          <DropdownMenuSubTrigger>Labels</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuRadioGroup value={task.label}>
              {labels.map((label) => (
                <DropdownMenuRadioItem key={label.value} value={label.value}>
                  {label.label}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuSubContent>
        </DropdownMenuSub> */}
          <DropdownMenuSeparator />
          <DropdownMenuItem className="hover:bg-gray-200 hover:cursor-pointer"
            onClick={() => handleDelete(row.original.id)}
          // onClick={() => console.log(row)}
          >
            Delete
            <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="hover:bg-gray-200 hover:cursor-pointer">
            Add Sub Task
            <DropdownMenuShortcut>+</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}