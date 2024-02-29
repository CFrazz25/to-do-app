import { ArrowRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { lusitana } from '@/app/components/ui/fonts';
import Image from 'next/image';

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col p-6">
      <div className="flex  items-end rounded-lg bg-blue-500 p-4">
        <Image
          src="/todolistlogo.png"
          alt="logo"
          width={200}
          height={100}
          className='rounded-lg'
        />
        <div className="flex flex-col gap-4 pl-6">
          <h1 className={`${lusitana.className} text-3xl text-white md:text-4xl`}>Frazzle Dazzle To Do List</h1>
          <p className="text-white text-lg md:text-xl">
          </p>
          <Link
            href="/todos"
            className="flex items-center gap-5 rounded-lg bg-white px-6 py-3 text-sm font-medium text-blue-500 transition-colors hover:bg-blue-100 md:text-base"
          >
            <span>Get Started</span> <ArrowRightIcon className="w-5 md:w-6" />
          </Link>
        </div>
      </div>
      <div className="mt-4 flex grow flex-col gap-4 md:flex-row">
        <div className="flex flex-col justify-center gap-6 rounded-lg bg-gray-50 px-6 py-10 md:w-2/5 md:px-20">
          <div>
            <h2 className={`${lusitana.className} text-xl text-gray-600`}>Voted #1 To Do App by the Frazzle Dazzle community.</h2>
          </div>
          <p className={`${lusitana.className} text-xl text-gray-800 md:text-2xl md:leading-normal `}>
            <strong>Welcome to Frazzle Dazzle&apos;s To Do app.</strong> This is the the best place to keep track of your tasks and get things done.
          </p>
          <Link
            href="/todos"
            className="flex items-center gap-5 self-start rounded-lg bg-blue-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-400 md:text-base"
          >
            <span>Check It Out</span> <ArrowRightIcon className="w-5 md:w-6" />
          </Link>
        </div>
        <div className="flex items-center justify-center p-6 md:w-3/5 md:px-28 md:py-12">
          <Image
            src="/todolist.png"
            alt="Picture of the author"
            width={500}
            height={500}
          />
        </div>
      </div>
    </main>
  );
}
