import { useState, useEffect, createContext } from 'react';
import * as apiService from '@/app/services/toDoApi';
import { Task, ToDo, ToDoSearchParams, ToDoStats } from '@/app/lib/definitions';

export type actions = "update" | "delete" | "create" | "add sub task"

export const TableActionsContext = createContext({
  handleDelete: async (id: string) => { },
  handleEdit: (task: Task) => { },
  handleCreate: (task: Task) => { },
  error: null
});

function useToDo(searchParams: ToDoSearchParams) {
  const [todos, setTodos] = useState<ToDo[]>([]);
  const [stats, setStats] = useState<ToDoStats>({} as ToDoStats);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchToDos = async (searchParams: ToDoSearchParams) => {
    setLoading(true);
    try {

      const fetchedToDos = await apiService.fetchToDos(searchParams);
      setTodos(fetchedToDos.todos || []);
      setStats(fetchedToDos.todoStats || {} as ToDoStats);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addToDo = async (todo: ToDo) => {
    try {
      const newToDo = await apiService.createToDo(todo);
      setTodos((prevTodos) => [...prevTodos, newToDo]);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const updateToDo = async (todo: ToDo) => {
    try {
      const updatedToDo = await apiService.updateToDo(todo);
      setTodos((prevTodos) =>
        prevTodos.map((t) => (t.id === todo.id ? updatedToDo : t))
      );
    } catch (err: any) {
      setError(err.message);
    }
  };

  const deleteToDo = async (id: string) => {
    try {
      await apiService.deleteToDo(id);
      // setTodos((prevTodos) => prevTodos.filter((t) => t.id !== id));
      // might want to refresh the data rather than resetting here
      // just in case of errors. it does however save a network request
    } catch (err: any) {
      setError(err.message);
      throw new Error(err.message);
    }
  };

  const refreshToDos = async () => {
    await fetchToDos(searchParams);
  }

  useEffect(() => {
    fetchToDos(searchParams);

  }, [searchParams]);

  return { refreshToDos, todos, loading, error, addToDo, updateToDo, deleteToDo, fetchToDos, stats };
}

export default useToDo;
