export interface ForestProgress {
  level: number;
  levelName: string;
  totalTreesPlanted: number;
  productivityScore: number;
  nextReward: string;
  weeklyCompletionPercent: number;
}

export const getForestProgress = (streak: number, completedDates: string[] = [], tasksCompletedCount: number = 0): ForestProgress => {
  const totalTrees = Math.floor(streak / 2) + Math.floor(tasksCompletedCount / 5);
  const level = Math.floor(streak / 5) + 1;

  const levelNames = [
    'Sprout Seedling',
    'Sapling Ranger',
    'Grove Guardian',
    'Forest Sentinel',
    'Ecosystem Warden',
    'Celestial Overseer'
  ];

  const levelName = levelNames[Math.min(level - 1, levelNames.length - 1)];
  const productivityScore = Math.min(100, Math.round(streak * 3.5 + tasksCompletedCount * 2 + 30));
  const weeklyCompletionPercent = Math.min(100, Math.round((completedDates.length % 7) * 14.28 + 28));

  return {
    level,
    levelName,
    totalTreesPlanted: totalTrees,
    productivityScore,
    nextReward: level % 2 === 0 ? '💎 10 Diamonds + Golden Tree Badge' : '🪙 250 Coins + Rare Forest Deer',
    weeklyCompletionPercent
  };
};
