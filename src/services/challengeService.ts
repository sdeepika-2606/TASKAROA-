export interface ChallengeOption {
  days: number;
  label: string;
  badge: string;
  rewardCoins: number;
  rewardDiamonds: number;
}

export const CHALLENGE_OPTIONS: ChallengeOption[] = [
  { days: 7, label: '7-Day Focus Starter', badge: '🌱 Bronze Tree', rewardCoins: 100, rewardDiamonds: 5 },
  { days: 14, label: '14-Day Consistency Rush', badge: '🌿 Silver Bush', rewardCoins: 250, rewardDiamonds: 10 },
  { days: 30, label: '30-Day Forest Guardian', badge: '🌳 Golden Oak', rewardCoins: 600, rewardDiamonds: 25 },
  { days: 60, label: '60-Day Deep Focus Pioneer', badge: '🌲 Emerald Pine', rewardCoins: 1200, rewardDiamonds: 50 },
  { days: 90, label: '90-Day Unstoppable Titan', badge: '🌴 Diamond Palm', rewardCoins: 2000, rewardDiamonds: 100 },
  { days: 180, label: '180-Day Ecosystem Master', badge: '🪵 Sequoia Ancient', rewardCoins: 4500, rewardDiamonds: 250 },
  { days: 365, label: '365-Day Legendary Forest', badge: '👑 Celestial Grove', rewardCoins: 10000, rewardDiamonds: 500 }
];

export const getChallengeDetails = (targetDays: number): ChallengeOption => {
  return (
    CHALLENGE_OPTIONS.find(c => c.days === targetDays) || {
      days: targetDays,
      label: `${targetDays}-Day Challenge`,
      badge: '🌲 Focus Tree',
      rewardCoins: targetDays * 15,
      rewardDiamonds: Math.floor(targetDays / 3)
    }
  );
};
