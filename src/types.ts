export type Priority = 'High' | 'Medium' | 'Low';

export interface Task {
  id: string;
  title: string;
  priority: Priority;
  dueIn: string;
  dueDate?: string;
  dueTime?: string;
  completed?: boolean;
  category?: string;
  description?: string;
  notes?: string;
  duration?: string;
  repeat?: string;
  reminder?: string | boolean;
  aiSuggested?: boolean;
  estimatedTime?: number; // in minutes
}

export interface ScheduleItem {
  id: string;
  taskId?: string;
  title: string;
  startTime: string;
  endTime: string;
  type: 'task' | 'break' | 'event';
}

export interface Reminder {
  id: string;
  text: string;
  time: string;
  unread: boolean;
  type: 'deadline' | 'habit' | 'ai';
}

export interface Goal {
  id: string;
  title: string;
  progress: number;
  target: number;
  unit: string;
  icon: string;
}

export interface Habit {
  id: string;
  name: string;
  streak: number;
  completedToday: boolean;
  icon: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  attachments?: string[];
  actions?: any[];
}

export interface RewardPopup {
  id: number;
  text: string;
}

