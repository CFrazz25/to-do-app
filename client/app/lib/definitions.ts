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
