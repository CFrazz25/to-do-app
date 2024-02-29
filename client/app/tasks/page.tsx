import { promises as fs } from "fs"
import path from "path"
import { Metadata } from "next"
import Image from "next/image"
import { z } from "zod"

import { columns } from "@/app/components/ui/columns"
import { DataTable } from "@/app/components/ui/data-table"
import { UserNav } from "@/app/components/ui/user-nav"
import { taskSchema } from "@/app/lib/definitions"



export const metadata: Metadata = {
  title: "Tasks",
  description: "A task and issue tracker build using Tanstack Table.",
}

// Simulate a database read for tasks.
// export async function getTasks({
//   searchParams,
// }: {
//   searchParams?: {
//     query?: string;
//     page?: string;
//   };
// }) {
//   const data = await fs.readFile(
//     path.join(process.cwd(), "app/examples/tasks/data/tasks.json")
//   )

//   const tasks = JSON.parse(data.toString())

//   return z.array(taskSchema).parse(tasks)
// }

export default async function TaskPage({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {
  // const tasks = await getTasks()


  return (
    <>
      <div className="md:hidden">
        <Image
          src="/examples/tasks-light.png"
          width={1280}
          height={998}
          alt="Playground"
          className="block dark:hidden"
        />
        <Image
          src="/examples/tasks-dark.png"
          width={1280}
          height={998}
          alt="Playground"
          className="hidden dark:block"
        />
      </div>
      <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Welcome back!</h2>
            <p className="text-muted-foreground">
              Here&apos;s a list of your tasks for this month!
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <UserNav />
          </div>
        </div>
        <DataTable />
      </div>
    </>
  )
}