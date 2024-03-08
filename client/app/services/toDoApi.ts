import { ToDo, ToDoSearchParams } from '@/app/lib/definitions';
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const fetchToDos = async (searchParams: ToDoSearchParams) => {
  const baseUrl = `${API_URL}/Todo`;
  let url = baseUrl;
  if (searchParams.query) {
    url = `${baseUrl}?fullTextSearch=${searchParams.query}`;
  }

  const response = await fetch(url, { headers: { 'Content-Type': 'application/json' } });
  const { todos, todoStats } = await response.json();
  return { todos, todoStats };
};

export const createToDo = async (todo: Partial<ToDo>) => {
  const response = await fetch(`${API_URL}/Todo`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(todo),
  });
  return response.json();
};

export const updateToDo = async (todo: ToDo) => {
  const response = await fetch(`${API_URL}/Todo/${todo.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(todo),
  });
  return response.json();
};

export const deleteToDo = async (id: string) => {
  try {
    const response = await fetch(`${API_URL}/Todo/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      console.log(response)
      throw new Error(await response.text()); // update error handling
    }
    return
  } catch (err: any) {
    console.error(err.message);
    throw new Error(err.message);

  }
};