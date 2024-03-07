"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { CalendarIcon } from "@radix-ui/react-icons"
import { format } from "date-fns"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { cn } from "@/app/lib/utils"
import { Button } from "@/app/components/ui/button"
import { Calendar } from "@/app/components/ui/calendar"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/components/ui/form"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/app/components/ui/popover"
// import { toast } from "@/app/components/ui/use-toast"
import { toast } from "sonner"

import { useContext } from "react"
import { TableActionsContext } from "@/app/hooks/useToDo"
import { AlertDialogCancel } from "@radix-ui/react-alert-dialog"
import { Task } from "@/app/lib/definitions"
import { Checkbox } from "./checkbox"

const TaskFormSchema = z.object({
  id: z.string().optional().nullable(),
  task: z.string().min(1, "A task is required."),
  deadlineDate: z.date({
    required_error: "A deadline date is required.", // Ensuring the date is provided
  }),
  isComplete: z.boolean(),
  moreDetails: z.string().optional().nullable(),
  parentToDoId: z.string().optional().nullable(),
})

interface TaskFormProps {
  action: 'create' | 'update' | 'add subtask'
  task?: Task
  handleClose: () => void
}


export function TaskForm({ props }: { props: TaskFormProps }) {
  const { handleEdit, handleCreate } = useContext(TableActionsContext);
  console.log("action", props.action)
  // const form = useForm<z.infer<typeof TaskFormSchema>>({
  //   resolver: zodResolver(TaskFormSchema),
  // })

  const parentToDoId = () => {
    if (props.action === "add subtask" && props.task) {
      return props.task.id
    } else if (props.action === "update" && props.task) {
      return props.task.parentToDoId
    } else {
      return undefined
    }
  }
  const form = useForm<z.infer<typeof TaskFormSchema>>({
    resolver: zodResolver(TaskFormSchema),
    defaultValues: {
      id: props.action === "update" && props.task ? props.task.id : undefined,
      task: props.action === "update" ? props.task.task : "",
      deadlineDate: props.action === "update" && props.task ? new Date(props.task.deadlineDate) : new Date(),
      isComplete: props.action === "update" && props.task ? props.task.isComplete : false,
      moreDetails: props.action === "update" && props.task ? props.task.moreDetails : undefined,
      parentToDoId: parentToDoId(),
    },

  });

  // function onSubmit(data: z.infer<typeof TaskFormSchema>) {
  //   handleEdit(data)
  //   // handleClose()

  //   toast({
  //     title: "You submitted the following values:",
  //     description: (
  //       <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
  //         <code className="text-white">{JSON.stringify(data, null, 2)}</code>
  //       </pre>
  //     ),
  //   })
  // }

  function onSubmit(data: z.infer<typeof TaskFormSchema>) {
    if (props.action === "update") {
      handleEdit(data);
    } else {
      handleCreate(data); // Assuming you have a similar function for creating tasks
    }
    props.handleClose();
    const toastTitle = props.action === "update" ? "Task has been updated" : "Task has been created"
    const toastDescription = props.action === "update" && data.isComplete ? "Congratulations! You've completed a task!" : ""
    toast.success(toastTitle, {
      description: toastDescription,
    })
  }



  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="task"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Task</FormLabel>
              <FormControl>
                <textarea
                  {...field}
                  className="rounded-md border-gray-300"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="deadlineDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Deadline Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    // disabled={(date) =>
                    //   date > new Date() || date < new Date("1900-01-01")
                    // }
                    initialFocus
                    className="bg-white"
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        {props.action === "update" && (
          <FormField
            control={form.control}
            name="isComplete"
            render={({ field: { onChange, value, name, ref } }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Is Complete</FormLabel>
                <FormControl>
                  <input
                    name={name}
                    ref={ref}
                    type="checkbox"
                    className="rounded-md border-gray-300 w-9 h-9 hover:cursor-pointer"
                    checked={value}
                    onChange={(e) => onChange(e.target.checked)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}


        <FormField
          control={form.control}
          name="moreDetails"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>More Details</FormLabel>
              <FormControl>
                <textarea
                  {...field}
                  className="rounded-md border-gray-300"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
        {/* <AlertDialogCancel asChild>
          <Button>Cancel </Button>
        </AlertDialogCancel> */}
      </form>
    </Form>
  )
}
