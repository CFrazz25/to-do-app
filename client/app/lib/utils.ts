import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Task } from "./definitions";

export const formatDateToLocal = (
  dateStr: string,
  locale: string = 'en-US',
) => {
  const date = new Date(dateStr);
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  };
  const formatter = new Intl.DateTimeFormat(locale, options);
  return formatter.format(date);
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

function normalizeDate(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function isPastDue(task: Task): boolean {
  const today = normalizeDate(new Date());
  const deadlineDate = normalizeDate(new Date(task.deadlineDate));
  return deadlineDate < today && !task.isComplete;
}

