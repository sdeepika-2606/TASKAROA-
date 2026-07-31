export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress: number; // 0 - 100
  rewardCoins: number;
}

export const getAchievements = (streak: number, completedCount: number, focusMinutes: number): Achievement[] => {
  return [
    {
      id: 'first_spark',
      title: 'First Spark',
      description: 'Start your productivity journey by completing 1 task.',
      icon: '🔥',
      unlocked: completedCount >= 1,
      progress: Math.min(100, (completedCount / 1) * 100),
      rewardCoins: 50
    },
    {
      id: 'seven_days',
      title: '7-Day Pioneer',
      description: 'Maintain a 7-day focus streak without missing a day.',
      icon: '🌱',
      unlocked: streak >= 7,
      progress: Math.min(100, (streak / 7) * 100),
      rewardCoins: 150
    },
    {
      id: 'focus_master',
      title: 'Focus Master',
      description: 'Log over 300 minutes of deep work sessions.',
      icon: '⏱️',
      unlocked: focusMinutes >= 300,
      progress: Math.min(100, (focusMinutes / 300) * 100),
      rewardCoins: 200
    },
    {
      id: 'task_machine',
      title: 'Task Machine',
      description: 'Complete 25 tasks in total.',
      icon: '✅',
      unlocked: completedCount >= 25,
      progress: Math.min(100, (completedCount / 25) * 100),
      rewardCoins: 300
    },
    {
      id: 'forest_guardian',
      title: 'Forest Guardian',
      description: 'Maintain a 30-day streak and grow your core grove.',
      icon: '🌳',
      unlocked: streak >= 30,
      progress: Math.min(100, (streak / 30) * 100),
      rewardCoins: 500
    }
  ];
};
