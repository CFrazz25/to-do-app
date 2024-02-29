import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

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

