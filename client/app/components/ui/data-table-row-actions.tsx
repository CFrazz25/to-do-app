"use client"

import { DotsHorizontalIcon } from "@radix-ui/react-icons"
import { Row } from "@tanstack/react-table"
import { deleteToDo } from "@/app/services/toDoApi"
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

import { labels } from "@/app/lib/data"
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
  // const task = taskSchema.parse(row.original)
  const { handleDelete, error } = useContext(TableActionsContext);
  const [open, setOpen] = useState(false)
  const [action, setAction] = useState<"create" | "update" | "add subtask" | null>(null)
  const handleClose = () => setOpen(false)


  return (
    <div>
      {/* <TaskFormModal props={props} /> */}
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


          {/* <div className="hover:bg-gray-200 hover:cursor-pointer flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent">
            <TaskFormModal props={{ action: "update" }} />
          </div> */}


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

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/app/components/ui/alert-dialog"
import { toast } from "sonner"
// import { Button } from "@/app/components/ui/button"

export function AlertDialogDemo() {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline">Show Dialog</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
