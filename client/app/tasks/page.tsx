import { Metadata } from "next"
import Image from "next/image"
import { DataTable } from "@/app/components/ui/data-table"
import Link from "next/link";

export const metadata: Metadata = {
  title: "Tasks",
  description: "Task management tool for your daily tasks.",
}

export default async function TaskPage({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {
  return (
    <>
      <div className="md:hidden">
        <Image
          src="/frazzledazzletodolistlogov2.png"
          width={500}
          height={500}
          alt="logo"
          className="hidden dark:block"
        />
        <h1 className="text-4xl font-bold tracking-tight mt-8">Mobile version coming soon!</h1>
      </div>
      <div className="hidden flex-1 flex-col space-y-2  md:flex">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Welcome back!</h2>
            <p className="text-muted-foreground">
              Here&apos;s a list of your tasks!
            </p>

          </div>
          <Link href="/">
            <Image
              src="/frazzledazzletodolistlogov2.png"
              width={120}
              height={120}
              alt="Playground"
              className="float-right"
            />
          </Link>

        </div>
        <DataTable />
      </div>
    </>
  )
}