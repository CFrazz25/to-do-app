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
import { Input } from "@/app/components/ui/input"
import { Label } from "@/app/components/ui/label"
import { Task } from "@/app/lib/definitions"
import { Dispatch, SetStateAction } from "react"
import { set } from "date-fns"

interface TaskFormModalProps {
  action: 'create' | 'update' | 'add subtask'
  task?: Task
  open: boolean
  handleClose: () => void
}


export function TaskFormModal({ props }: { props: TaskFormModalProps }) {
  // const { open, handleClose } = props

  // return (
  //   <div>
  //     {open && (
  //       <AlertDialog>
  //         <AlertDialogTrigger>Edit</AlertDialogTrigger>
  //         <AlertDialogContent>
  //           <AlertDialogHeader>
  //             <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
  //             <AlertDialogDescription>
  //               <TaskForm handleClose={handleClose} />
  //             </AlertDialogDescription>
  //           </AlertDialogHeader>
  //           {/* <AlertDialogFooter>
  //           <AlertDialogCancel>Cancel</AlertDialogCancel>
  //           <AlertDialogAction>Continue</AlertDialogAction>
  //         </AlertDialogFooter> */}
  //         </AlertDialogContent>
  //       </AlertDialog>
  //     )
  //     }
  //   </div>)

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
    // <div className="bg-white">
    //   <AlertDialog>
    //     <AlertDialogTrigger>Edit</AlertDialogTrigger>
    //     <AlertDialogContent className="bg-white">
    //       <AlertDialogHeader>
    //         <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
    //         <AlertDialogDescription>
    //           <TaskForm handleClose={handleClose} />
    //         </AlertDialogDescription>
    //       </AlertDialogHeader>
    //       {/* <AlertDialogFooter>
    //     <AlertDialogCancel>Cancel</AlertDialogCancel>
    //     <AlertDialogAction>Continue</AlertDialogAction>
    //   </AlertDialogFooter> */}
    //       <AlertDialogCancel />
    //     </AlertDialogContent>

    //   </AlertDialog>
    // </div >





    <Dialog open={props.open}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          props.handleClose()
        }
      }}
    >
      <DialogTrigger asChild>
        <Button style={{ display: 'none' }}>{triggerActionString(props.action)}</Button>
        {/* <Button variant="outline">Edit</Button> */}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle>{headerActionString(props.action)}</DialogTitle>
          <DialogDescription>
            {descriptionActionString(props.action)}
          </DialogDescription>
        </DialogHeader>
        <TaskForm props={{ action: props.action, task: props.task, handleClose: props.handleClose }} />
        {/* <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              defaultValue="Pedro Duarte"
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Username
            </Label>
            <Input
              id="username"
              defaultValue="@peduarte"
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter> */}
      </DialogContent>
    </Dialog>


  )
}
