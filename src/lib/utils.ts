import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface Task {
  id: string;
  title: string;
  priority: 'High' | 'Medium' | 'Low';
  dueIn: string;
  completed: boolean;
}

export interface Stat {
  label: string;
  value: string;
  change?: string;
  icon?: string;
}

export interface Quote {
  text: string;
  author: string;
}
