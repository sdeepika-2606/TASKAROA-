import React, { createContext, useContext, useState, useEffect } from 'react';
import { Task, ScheduleItem, Reminder, Goal, Habit, ChatMessage, RewardPopup } from '../types';
import { parseLocalDate, getLocalDateString } from '../services/calendarService';

interface DataContextType {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  schedule: ScheduleItem[];
  setSchedule: React.Dispatch<React.SetStateAction<ScheduleItem[]>>;
  reminders: Reminder[];
  setReminders: React.Dispatch<React.SetStateAction<Reminder[]>>;
  goals: Goal[];
  setGoals: React.Dispatch<React.SetStateAction<Goal[]>>;
  habits: Habit[];
  setHabits: React.Dispatch<React.SetStateAction<Habit[]>>;
  messages: ChatMessage[];
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  
  coins: number;
  diamonds: number;
  streak: number;
  streakRecord: number;
  streakStartDate: string;
  completedDates: string[];
  streakTarget: number;
  rewardPopups: RewardPopup[];
  
  addCoins: (amount: number, text?: string) => void;
  addDiamonds: (amount: number, text?: string) => void;
  addTask: (task: Omit<Task, 'id'>) => void;
  deleteTask: (id: string) => void;
  addReminder: (reminder: Omit<Reminder, 'id' | 'unread'>) => void;
  addScheduleItem: (item: Omit<ScheduleItem, 'id'>) => void;
  completeTask: (id: string) => void;
  setStreakTarget: (target: number) => void;
  recordDailyActivity: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('taskaroa_tasks');
    return saved ? JSON.parse(saved) : [];
  });

  const [schedule, setSchedule] = useState<ScheduleItem[]>(() => {
    const saved = localStorage.getItem('taskaroa_schedule');
    return saved ? JSON.parse(saved) : [
      { id: '1', title: 'Deep Work: UI Design', startTime: '09:00', endTime: '11:00', type: 'task' },
      { id: '2', title: 'Quick Lunch Break', startTime: '12:30', endTime: '13:30', type: 'break' },
    ];
  });

  const [reminders, setReminders] = useState<Reminder[]>(() => {
    const saved = localStorage.getItem('taskaroa_reminders');
    return saved ? JSON.parse(saved) : [
      { id: '1', text: "AI Project Report submission is due in 2 hours", unread: true, time: '10:00 AM', type: 'deadline' },
      { id: '2', text: "Aptitude Test coming up on 24 June", unread: true, time: 'Yesterday', type: 'deadline' },
    ];
  });

  const [goals, setGoals] = useState<Goal[]>(() => {
    const saved = localStorage.getItem('taskaroa_goals');
    return saved ? JSON.parse(saved) : [
      { id: '1', title: 'Deep Work Hours', progress: 12, target: 40, unit: 'hrs', icon: 'zap' },
      { id: '2', title: 'Task Completion', progress: 85, target: 100, unit: '%', icon: 'check-circle' },
    ];
  });

  const [habits, setHabits] = useState<Habit[]>(() => {
    const saved = localStorage.getItem('taskaroa_habits');
    return saved ? JSON.parse(saved) : [
      { id: '1', name: 'Morning Focus', streak: 12, completedToday: true, icon: 'sun' },
      { id: '2', name: 'Read 20 Pages', streak: 5, completedToday: false, icon: 'book' },
    ];
  });

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('taskaroa_messages');
    return saved ? JSON.parse(saved) : [];
  });

  const [coins, setCoins] = useState<number>(() => {
    const saved = localStorage.getItem('taskaroa_coins');
    return saved ? parseInt(saved, 10) : 240;
  });

  const [diamonds, setDiamonds] = useState<number>(() => {
    const saved = localStorage.getItem('taskaroa_diamonds');
    return saved ? parseInt(saved, 10) : 15;
  });

  const getLocalDateString = (d: Date = new Date()): string => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const calculateRealStreak = (dates: string[]): number => {
    if (!dates || dates.length === 0) return 0;
    
    const todayStr = getLocalDateString(new Date());
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = getLocalDateString(yesterday);

    const hasToday = dates.includes(todayStr);
    const hasYesterday = dates.includes(yesterdayStr);

    if (!hasToday && !hasYesterday) return 0;

    let count = 0;
    let curr = parseLocalDate(hasToday ? todayStr : yesterdayStr);

    while (true) {
      const currStr = getLocalDateString(curr);
      if (dates.includes(currStr)) {
        count++;
        curr.setDate(curr.getDate() - 1);
      } else {
        break;
      }
    }
    return count;
  };

  const [completedDates, setCompletedDates] = useState<string[]>(() => {
    const saved = localStorage.getItem('taskaroa_completed_dates');
    return saved ? JSON.parse(saved) : [];
  });

  const [streak, setStreak] = useState<number>(() => calculateRealStreak(completedDates));

  useEffect(() => {
    setStreak(calculateRealStreak(completedDates));
  }, [completedDates]);

  const [streakTarget, setStreakTargetState] = useState<number>(() => {
    const saved = localStorage.getItem('taskaroa_streak_target');
    return saved ? parseInt(saved, 10) : 7;
  });

  const [streakRecord] = useState<number>(18);
  const [streakStartDate] = useState<string>('July 16, 2026');

  const [rewardPopups, setRewardPopups] = useState<RewardPopup[]>([]);

  useEffect(() => {
    localStorage.setItem('taskaroa_tasks', JSON.stringify(tasks));
    localStorage.setItem('taskaroa_schedule', JSON.stringify(schedule));
    localStorage.setItem('taskaroa_reminders', JSON.stringify(reminders));
    localStorage.setItem('taskaroa_goals', JSON.stringify(goals));
    localStorage.setItem('taskaroa_habits', JSON.stringify(habits));
    localStorage.setItem('taskaroa_messages', JSON.stringify(messages));
    localStorage.setItem('taskaroa_coins', coins.toString());
    localStorage.setItem('taskaroa_diamonds', diamonds.toString());
    localStorage.setItem('taskaroa_streak', streak.toString());
    localStorage.setItem('taskaroa_streak_target', streakTarget.toString());
    localStorage.setItem('taskaroa_completed_dates', JSON.stringify(completedDates));
  }, [tasks, schedule, reminders, goals, habits, messages, coins, diamonds, streak, streakTarget, completedDates]);

  const setStreakTarget = (target: number) => {
    setStreakTargetState(target);
    triggerPopup(`🎯 Streak Target updated to ${target} Days Challenge!`);
  };

  const triggerPopup = (text: string) => {
    const id = Date.now();
    setRewardPopups(prev => [...prev, { id, text }]);
    setTimeout(() => {
      setRewardPopups(prev => prev.filter(p => p.id !== id));
    }, 3000);
  };

  const recordDailyActivity = () => {
    const todayStr = getLocalDateString(new Date());
    if (!completedDates.includes(todayStr)) {
      const updatedDates = [...completedDates, todayStr];
      setCompletedDates(updatedDates);
      const newStreak = calculateRealStreak(updatedDates);
      setStreak(newStreak);

      if (newStreak === 1) {
        triggerPopup('🎉 Day 1 Streak Started! Ready for the 7-Day Challenge?');
      } else if (newStreak === 7) {
        triggerPopup('🏆 7-Day Challenge Unlocked! Next up: 30-Day Challenge!');
        setStreakTargetState(30);
      } else if (newStreak === 30) {
        triggerPopup('💎 30-Day Challenge Completed! Next up: 60-Day Challenge!');
        setStreakTargetState(60);
      } else if (newStreak === 60) {
        triggerPopup('⚡ 60-Day Challenge Completed! Next up: 90-Day Challenge!');
        setStreakTargetState(90);
      } else if (newStreak === 90) {
        triggerPopup('🌟 90-Day Challenge Completed! Next up: 180-Day Challenge!');
        setStreakTargetState(180);
      } else if (newStreak === 180) {
        triggerPopup('👑 180-Day Challenge Completed! Next up: 365-Day Challenge!');
        setStreakTargetState(365);
      } else {
        triggerPopup(`🔥 Day ${newStreak} Streak Maintained! Keep it up!`);
      }
    }
  };

  const addCoins = (amount: number, text?: string) => {
    setCoins(prev => prev + amount);
    triggerPopup(text || `+${amount} Coins! 🪙`);
  };

  const addDiamonds = (amount: number, text?: string) => {
    setDiamonds(prev => prev + amount);
    triggerPopup(text || `+${amount} Gems! 💎`);
  };

  const addTask = (task: Omit<Task, 'id'> & { completed?: boolean }) => {
    const newTask: Task = {
      ...task,
      id: Math.random().toString(36).substr(2, 9),
      completed: task.completed ?? false
    };
    setTasks(prev => [newTask, ...prev]);
    recordDailyActivity();
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const addReminder = (reminder: Omit<Reminder, 'id' | 'unread'>) => {
    const newReminder: Reminder = {
      ...reminder,
      id: Math.random().toString(36).substr(2, 9),
      unread: true
    };
    setReminders(prev => [newReminder, ...prev]);
  };

  const addScheduleItem = (item: Omit<ScheduleItem, 'id'>) => {
    const newItem: ScheduleItem = {
      ...item,
      id: Math.random().toString(36).substr(2, 9)
    };
    setSchedule(prev => [...prev, newItem].sort((a, b) => a.startTime.localeCompare(b.startTime)));
  };

  const completeTask = (id: string) => {
    let wasCompleted = false;
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        wasCompleted = !t.completed;
        return { ...t, completed: !t.completed };
      }
      return t;
    }));

    if (wasCompleted) {
      addCoins(10, '+10 Coins! 🪙');
      recordDailyActivity();
    }
  };

  return (
    <DataContext.Provider value={{ 
      tasks, setTasks, 
      schedule, setSchedule, 
      reminders, setReminders, 
      goals, setGoals, 
      habits, setHabits, 
      messages, setMessages,
      coins, diamonds, streak, streakRecord, streakStartDate, completedDates, streakTarget, rewardPopups,
      addCoins, addDiamonds,
      addTask, deleteTask, addReminder, addScheduleItem, completeTask, setStreakTarget, recordDailyActivity
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within DataProvider');
  return context;
};

