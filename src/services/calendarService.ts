export interface DayActivity {
  date: string; // YYYY-MM-DD
  dayOfWeek: number; // 0=Mon, 1=Tue, ..., 6=Sun
  dayOfMonth: number;
  monthIndex: number; // 0-11
  year: number;
  tasksCreated: number;
  tasksCompleted: number;
  focusTimeMinutes: number;
  streakStatus: 'completed' | 'missed' | 'pending' | 'future';
  intensity: 0 | 1 | 2 | 3; // 0: No activity, 1: Light, 2: Medium, 3: High
  isToday: boolean;
  isInTargetYear: boolean;
}

export const getLocalDateString = (d: Date = new Date()): string => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const parseLocalDate = (dateStr: string): Date => {
  if (!dateStr) return new Date();
  const parts = dateStr.split('-');
  if (parts.length < 3) return new Date();
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);
  return new Date(year, month, day);
};

export const getYearActivityData = (completedDates: string[] = [], targetYear?: number): DayActivity[] => {
  const now = new Date();
  const todayStr = getLocalDateString(now);
  const yearToDisplay = targetYear || now.getFullYear();

  // Find the Monday on or before Jan 1 of yearToDisplay
  const jan1 = new Date(yearToDisplay, 0, 1);
  const jan1JsDay = jan1.getDay(); // 0 (Sun), 1 (Mon), ..., 6 (Sat)
  const mondayOffset = (jan1JsDay + 6) % 7;
  const startDate = new Date(yearToDisplay, 0, 1 - mondayOffset);

  const yearData: DayActivity[] = [];

  // Determine number of weeks needed (52 or 53 weeks)
  const endDateOf52Weeks = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + (52 * 7 - 1));
  const totalWeeks = (endDateOf52Weeks.getFullYear() === yearToDisplay && endDateOf52Weeks.getMonth() === 11 && endDateOf52Weeks.getDate() >= 31) ? 52 : 53;
  const totalDays = totalWeeks * 7;

  for (let i = 0; i < totalDays; i++) {
    const d = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + i);
    const dateStr = getLocalDateString(d);

    const isCompleted = completedDates.includes(dateStr);
    const isToday = dateStr === todayStr;
    const isFuture = d > now && !isToday;
    const isInTargetYear = d.getFullYear() === yearToDisplay;

    // Hash for deterministic variety among completed days only
    const hash = dateStr.split('-').reduce((acc, part) => acc + parseInt(part, 10), 0);
    const created = isCompleted ? (hash % 4) + 1 : 0;
    const completed = isCompleted ? created : 0;
    const focusTime = isCompleted ? ((hash % 5) + 1) * 25 : 0;

    let intensity: 0 | 1 | 2 | 3 = 0;
    if (isCompleted) {
      if (completed >= 3 || focusTime >= 90) intensity = 3;
      else if (completed >= 2 || focusTime >= 50) intensity = 2;
      else intensity = 1;
    }

    let streakStatus: 'completed' | 'missed' | 'pending' | 'future' = 'missed';
    if (isFuture) streakStatus = 'future';
    else if (isCompleted) streakStatus = 'completed';
    else if (isToday) streakStatus = 'pending';

    const jsDay = d.getDay();
    const dayOfWeek = (jsDay + 6) % 7; // Mon=0 .. Sun=6

    yearData.push({
      date: dateStr,
      dayOfWeek,
      dayOfMonth: d.getDate(),
      monthIndex: d.getMonth(),
      year: d.getFullYear(),
      tasksCreated: created,
      tasksCompleted: completed,
      focusTimeMinutes: focusTime,
      streakStatus,
      intensity,
      isToday,
      isInTargetYear
    });
  }

  return yearData;
};

export const getWeekDaysStatus = (completedDates: string[] = []) => {
  const now = new Date();
  const todayStr = getLocalDateString(now);
  const jsDay = now.getDay(); // 0 (Sun), 1 (Mon), ..., 6 (Sat)
  // Convert to Monday-based index: Mon=0, Tue=1, Wed=2, Thu=3, Fri=4, Sat=5, Sun=6
  const currentMondayBased = (jsDay + 6) % 7;
  
  const days: { dayName: string; dateStr: string; status: 'completed' | 'current' | 'future' | 'missed'; isToday: boolean }[] = [];
  const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  // Get Monday of the current week (midnight local time)
  const monday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - currentMondayBased);

  for (let i = 0; i < 7; i++) {
    const d = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + i);
    const dateStr = getLocalDateString(d);

    const isToday = dateStr === todayStr;
    const isCompleted = completedDates.includes(dateStr);

    let status: 'completed' | 'current' | 'future' | 'missed' = 'missed';
    if (isToday) {
      status = 'current'; // Glowing orange/yellow active day
    } else if (i < currentMondayBased) {
      // Past days in the current week
      status = isCompleted ? 'completed' : 'missed';
    } else {
      // Future days in the current week
      status = 'future';
    }

    days.push({
      dayName: dayLabels[i],
      dateStr,
      status,
      isToday
    });
  }

  return days;
};
