"use client"

import { DotsHorizontalIcon } from "@radix-ui/react-icons"
import { Row } from "@tanstack/react-table"
import { toast } from "sonner"
import { Button } from "@/app/components/ui/button"
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
} from "@/app/components/ui/dropdown-menu"

import { taskSchema } from "@/app/lib/definitions"
import { Task } from "@/app/lib/definitions"
import { useContext, useState } from "react"
import { TableActionsContext } from "@/app/hooks/useToDo"
import { TaskFormModal } from "@/app/components/ui/task-form-modal"

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const { handleDelete, error } = useContext(TableActionsContext);
  const [open, setOpen] = useState(false)
  const [action, setAction] = useState<"create" | "update" | "add subtask" | null>(null)
  const handleClose = () => setOpen(false)

  return (
    <div>
      <TaskFormModal props={{ action, open, handleClose, task: row.original as Task }} />
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
            onSelect={() => {
              setOpen(true)
              setAction("update")
              console.log("row", row)
            }}
          >
            Edit

          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuSeparator />
          <DropdownMenuItem className="hover:bg-gray-200 hover:cursor-pointer"
            onClick={async () => {
              try {
                const task = taskSchema.parse(row.original)
                await handleDelete(task.id)
                toast.success("Task Deleted")
              } catch (error) {
                toast.error("Error Deleting Task", { description: error.message, duration: 5000 })
              }
            }}
          >
            Delete
            <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="hover:bg-gray-200 hover:cursor-pointer"
            onSelect={() => {
              setOpen(true)
              setAction("add subtask")
            }}
          >
            Add Sub Task
            <DropdownMenuShortcut>+</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

