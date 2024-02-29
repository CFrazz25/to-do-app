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

interface TaskFormModalProps {
  open: boolean
  handleClose: () => void
}


export function TaskFormModal({ props }: { props: TaskFormModalProps }) {
  const { open, handleClose } = props

  return (
    <div>
      {open && (
        <AlertDialog>
          <AlertDialogTrigger>Openasdf</AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                <TaskForm handleClose={handleClose} />
              </AlertDialogDescription>
            </AlertDialogHeader>
            {/* <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction>Continue</AlertDialogAction>
          </AlertDialogFooter> */}
          </AlertDialogContent>
        </AlertDialog>
      )
      }
    </div>)
}
