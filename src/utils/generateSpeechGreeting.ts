import { Task, Reminder, ScheduleItem } from '../types';

export function generateSpeechGreeting(
  userName: string,
  tasks: Task[] = [],
  reminders: Reminder[] = [],
  schedule: ScheduleItem[] = []
): string {
  const nickname = userName ? userName.trim().split(' ')[0] : 'there';
  const now = new Date();
  const hour = now.getHours();

  let timeGreeting = 'Good Morning';
  if (hour >= 12 && hour < 17) {
    timeGreeting = 'Good Afternoon';
  } else if (hour >= 17 && hour < 21) {
    timeGreeting = 'Good Evening';
  } else if (hour >= 21 || hour < 5) {
    timeGreeting = 'Good Night';
  }

  const pendingTasks = tasks.filter((t) => !t.completed);
  const highPriorityTasks = pendingTasks.filter((t) => t.priority === 'High');

  let text = `${timeGreeting}, ${nickname}! Welcome to Taskaroa. `;

  if (pendingTasks.length === 0) {
    text += `You have completed all your tasks for today. Outstanding effort staying organized! `;
  } else if (pendingTasks.length === 1) {
    text += `You have 1 active task waiting for you. `;
  } else {
    text += `You have ${pendingTasks.length} active tasks scheduled. `;
  }

  if (highPriorityTasks.length > 0) {
    text += `Your highest priority item is "${highPriorityTasks[0].title}". `;
  } else if (pendingTasks.length > 0) {
    text += `Up next is "${pendingTasks[0].title}". `;
  }

  if (reminders && reminders.length > 0) {
    text += `Quick reminder: ${reminders[0].text}. `;
  }

  text += `Let's make today productive!`;

  return text;
}
