import { z } from "zod";

export type ToDo = {
  id: string;
  task: string;
  deadlineDate: Date;
  isComplete: boolean;
  moreDetails: string;
  parentToDoId: string | null;
  children: ToDo[] | null; // subtasks
  createdAt: Date;
  updatedAt: Date;
  editMode: boolean;
};

export type ToDoStats = {
  totalTodos: number;
  completedTodos: number;
  totalPastDue: number;
};

export type ToDoSearchParams = {
  query?: string;
  page?: string;
  limit?: string;
  sort?: string;
  order?: string;
  isComplete?: string;
};

export const taskSchema = z.object({
  id: z.string(),
  task: z.string(),
  moreDetails: z.string(),
  deadlineDate: z.string(),
  isComplete: z.boolean(),
  parentToDoId: z.string().nullable(),
  children: z.array(z.lazy(() => taskSchema)).nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export type Task = z.infer<typeof taskSchema>
