import { getLocalDateString, parseLocalDate } from './calendarService';

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string; // YYYY-MM-DD
  isTodaySecured: boolean;
  loginHistory: string[];
}

export const getStreakData = (completedDatesInput?: string[]): StreakData => {
  const completedDates: string[] = completedDatesInput || JSON.parse(localStorage.getItem('taskaroa_completed_dates') || '[]');
  const todayStr = getLocalDateString(new Date());
  
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = getLocalDateString(yesterday);

  // Check if today is completed
  const isTodaySecured = completedDates.includes(todayStr);

  // Determine last active date
  let lastActiveDate = todayStr;
  if (completedDates.length > 0) {
    const sortedDates = [...completedDates].sort((a, b) => a.localeCompare(b));
    lastActiveDate = sortedDates[sortedDates.length - 1];
  }

  // Calculate current consecutive streak:
  // Compare last active date with current date (todayStr).
  let currentStreak = 0;
  if (completedDates.length > 0) {
    const lastActive = parseLocalDate(lastActiveDate);
    const today = parseLocalDate(todayStr);

    // Difference in calendar days
    const diffTime = today.getTime() - lastActive.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 3600 * 24));

    // If last activity was today (0 days ago) or yesterday (1 day ago), streak is active
    if (diffDays <= 1) {
      let checkDate = parseLocalDate(isTodaySecured ? todayStr : yesterdayStr);
      while (true) {
        const dStr = getLocalDateString(checkDate);
        if (completedDates.includes(dStr)) {
          currentStreak++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else {
          break;
        }
      }
    } else {
      // Last activity was more than 1 day ago -> streak broken
      currentStreak = 0;
    }
  }

  // Calculate & persist longest streak
  let longestStreak = parseInt(localStorage.getItem('taskaroa_longest_streak') || '0', 10);
  if (currentStreak > longestStreak) {
    longestStreak = currentStreak;
    localStorage.setItem('taskaroa_longest_streak', longestStreak.toString());
  }

  return {
    currentStreak,
    longestStreak: Math.max(longestStreak, currentStreak),
    lastActiveDate,
    isTodaySecured,
    loginHistory: completedDates
  };
};

export const checkStreakMissed = (completedDates: string[]): boolean => {
  if (completedDates.length === 0) return false;
  const todayStr = getLocalDateString(new Date());
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = getLocalDateString(yesterday);

  const hasToday = completedDates.includes(todayStr);
  const hasYesterday = completedDates.includes(yesterdayStr);

  return !hasToday && !hasYesterday;
};
