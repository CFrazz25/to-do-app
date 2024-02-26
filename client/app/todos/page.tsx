"use client";

import Link from 'next/link';
import Image from 'next/image';

import Search from '@/app/ui/search';
import Table from '@/app/ui/todos/table';
import { ToDosTableSkeleton } from '@/app/ui/skeletons';
import { Suspense, useState } from 'react';
import ActionModal from '@/app/ui/todos/action-modal';
import { Button } from 'rsuite';
import useToDo from '@/app/hooks/useToDo';
import { ToDo, ToDoSearchParams } from '@/app/lib/definitions';

export default function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {
  const [open, setOpen] = useState(false);
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;

  const toDoSearchParams: ToDoSearchParams = {
    query,
    page: currentPage.toString(),
  };
  const [params, setParams] = useState(toDoSearchParams);


  const { todos, loading, error, updateToDo, refreshToDos, addToDo, deleteToDo, stats } = useToDo(params);
  const onDelete = async (id: string) => {
    await deleteToDo(id);
    await refreshToDos();
  }

  const onUpdateTask = async (todo: ToDo) => {
    await updateToDo(todo);
    await refreshToDos();
  }

  const onAddTask = async (todo: ToDo, subTaskParentId?: string) => {
    if (subTaskParentId) {
      todo.parentToDoId = subTaskParentId;
    }
    await addToDo(todo);
    await refreshToDos();
  }

  return (

    <div className="w-full p-8">
      <div className="flex w-full items-center justify-between rounded-lg bg-blue-500 p-4">
        <Link
          href="/"
          className="flex items-center gap-5 rounded-lg bg-white px-6 py-3 text-sm font-medium text-blue-500 transition-colors hover:bg-blue-100 md:text-base"
        >
          <span>To Do List</span>
        </Link>
        <Image
          src="/todolistlogo.png"
          alt="logo"
          width={75}
          height={75}
          className='rounded-lg'

        />
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8 w-3/4 pb-4">
        <Search placeholder="Search tasks..." setParams={setParams} />
        <Button appearance="primary"
          onClick={() => setOpen(true)}
        >
          Add Task
        </Button>

        {!loading && stats && (
          <div className='flex flex-col'>
            <div className='text-md'>{`Total Tasks: ${stats.totalTodos || 0}`}</div>
            <div className='text-md'>{`Completed Tasks: ${stats.completedTodos || 0}`}</div>
            <div className='text-md'>{`Past Deadline: ${stats.totalPastDue || 0}`}</div>
          </div>
        )}
      </div>
      <Suspense key={query + currentPage} fallback={<ToDosTableSkeleton />}>
        <Table todos={todos} onDelete={onDelete} onUpdateTask={onUpdateTask} onAddTask={onAddTask} loading={loading} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        {/* <Pagination totalPages={totalPages} /> */}
      </div>
      <ActionModal action='create' open={open} setOpen={setOpen} onAddTask={onAddTask} />
    </div>
  );
}