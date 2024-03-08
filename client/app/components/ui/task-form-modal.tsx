import { TaskForm } from "./task-form"

import { Button } from "@/app/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/components/ui/dialog"
import { Task } from "@/app/lib/definitions"
import { Dispatch, SetStateAction } from "react"
interface TaskFormModalProps {
  action: 'create' | 'update' | 'add subtask'
  task?: Task
  open: boolean
  handleClose: () => void
}

export function TaskFormModal({ props }: { props: TaskFormModalProps }) {
  const triggerActionString = (action: string) => {
    if (action === 'create') {
      return 'Create'
    } else if (action === 'update') {
      return 'Edit'
    } else {
      return 'Add subtask'
    }
  }

  const headerActionString = (action: string) => {
    if (action === 'create') {
      return 'Create a new task'
    } else if (action === 'update') {
      return 'Edit task'
    } else {
      return 'Add subtask'
    }
  }

  const descriptionActionString = (action: string) => {
    if (action === 'create') {
      return 'Create a new task here, save changes when you\'re done.'
    } else if (action === 'update') {
      return 'Make changes to your task here, save changes when you\'re done.'
    } else {
      return 'Add a new subtask here, save changes when you\'re done.'
    }
  }

  return (
    <Dialog open={props.open}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          props.handleClose()
        }
      }}
    >
      <DialogTrigger asChild>
        <Button style={{ display: 'none' }}>{triggerActionString(props.action)}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle>{headerActionString(props.action)}</DialogTitle>
          <DialogDescription>
            {descriptionActionString(props.action)}
          </DialogDescription>
        </DialogHeader>
        <TaskForm props={{ action: props.action, task: props.task, handleClose: props.handleClose }} />
      </DialogContent>
    </Dialog>
  )
}
