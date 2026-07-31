import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '../lib/utils';

interface StreakCalendarProps {
  streak: number;
  completedDates?: string[];
  streakTarget?: number;
  onSetStreakTarget?: (target: number) => void;
  className?: string;
}

export default function StreakCalendar({
  completedDates = [],
  className
}: StreakCalendarProps) {
  const realNow = new Date();
  const [viewYear, setViewYear] = useState(realNow.getFullYear());
  const [viewMonth, setViewMonth] = useState(realNow.getMonth()); // 0 - 11

  // Handle month navigation
  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(prev => prev - 1);
    } else {
      setViewMonth(prev => prev - 1);
    }
  };

  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(prev => prev + 1);
    } else {
      setViewMonth(prev => prev + 1);
    }
  };

  const monthDate = new Date(viewYear, viewMonth, 1);
  const monthNameUpper = monthDate.toLocaleString('default', { month: 'long', year: 'numeric' }).toUpperCase();

  // Calculate calendar grid
  const firstDayWeekday = new Date(viewYear, viewMonth, 1).getDay(); // 0 (Sun) - 6 (Sat)
  const daysInCurrentMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();

  // Generate leading days
  const leadingDays = [];
  for (let i = firstDayWeekday - 1; i >= 0; i--) {
    leadingDays.push({
      dayNum: daysInPrevMonth - i,
      isCurrentMonth: false,
      year: viewMonth === 0 ? viewYear - 1 : viewYear,
      month: viewMonth === 0 ? 11 : viewMonth - 1,
    });
  }

  // Current month days
  const currentMonthDays = [];
  for (let d = 1; d <= daysInCurrentMonth; d++) {
    currentMonthDays.push({
      dayNum: d,
      isCurrentMonth: true,
      year: viewYear,
      month: viewMonth,
    });
  }

  // Trailing days
  const totalSoFar = leadingDays.length + currentMonthDays.length;
  const trailingCount = (7 - (totalSoFar % 7)) % 7;
  const trailingDays = [];
  for (let t = 1; t <= trailingCount; t++) {
    trailingDays.push({
      dayNum: t,
      isCurrentMonth: false,
      year: viewMonth === 11 ? viewYear + 1 : viewYear,
      month: viewMonth === 11 ? 0 : viewMonth + 1,
    });
  }

  const allCalendarDays = [...leadingDays, ...currentMonthDays, ...trailingDays];

  // Group into weeks of 7
  const weeks: Array<typeof allCalendarDays> = [];
  for (let i = 0; i < allCalendarDays.length; i += 7) {
    weeks.push(allCalendarDays.slice(i, i + 7));
  }

  // Helpers
  const formatDateStr = (y: number, m: number, d: number) => {
    const mm = String(m + 1).padStart(2, '0');
    const dd = String(d).padStart(2, '0');
    return `${y}-${mm}-${dd}`;
  };

  const isTodayDate = (y: number, m: number, d: number) => {
    return (
      d === realNow.getDate() &&
      m === realNow.getMonth() &&
      y === realNow.getFullYear()
    );
  };

  // Check if date is in completedDates (real-time user activity)
  const isStreakDay = (dateStr: string) => {
    return completedDates.includes(dateStr);
  };

  return (
    <div className={cn("w-full bg-white text-gray-900 rounded-3xl p-6 border border-gray-100 shadow-xs font-sans space-y-4", className)}>
      
      {/* Heading & Month Navigation Row */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-3">
        <h4 className="text-xs font-black uppercase tracking-wider text-[#0F7A5C] flex items-center gap-2">
          <CalendarIcon className="w-4 h-4 text-[#0F7A5C]" />
          <span>Calendar</span>
        </h4>

        {/* Month chevrons with current month/year */}
        <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-800">
          <button
            type="button"
            onClick={prevMonth}
            className="p-1 hover:bg-gray-200 text-gray-600 hover:text-gray-900 rounded-lg transition-colors cursor-pointer"
            title="Previous Month"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="font-black tracking-wider px-1 text-xs text-[#0F7A5C]">
            {monthNameUpper}
          </span>
          <button
            type="button"
            onClick={nextMonth}
            className="p-1 hover:bg-gray-200 text-gray-600 hover:text-gray-900 rounded-lg transition-colors cursor-pointer"
            title="Next Month"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Day-of-week header row */}
      <div className="grid grid-cols-7 text-center text-[11px] font-black uppercase text-gray-400 tracking-wider px-1">
        <span>S</span>
        <span>M</span>
        <span>T</span>
        <span>W</span>
        <span>T</span>
        <span>F</span>
        <span>S</span>
      </div>

      {/* Weeks as full-width light rounded 'pill' rows */}
      <div className="space-y-2">
        {weeks.map((week, wIdx) => (
          <div 
            key={wIdx}
            className="bg-gray-50 rounded-2xl p-1.5 border border-gray-200/60 flex justify-between items-center"
          >
            {week.map((item, dIdx) => {
              const dateStr = formatDateStr(item.year, item.month, item.dayNum);
              const isToday = isTodayDate(item.year, item.month, item.dayNum);
              const isStreak = isStreakDay(dateStr);

              if (!item.isCurrentMonth) {
                return (
                  <div 
                    key={dIdx}
                    className="w-8 h-8 sm:w-9 sm:h-9 text-gray-300 text-xs font-medium flex items-center justify-center select-none"
                  >
                    {item.dayNum}
                  </div>
                );
              }

              if (isToday) {
                if (isStreak) {
                  return (
                    <div 
                      key={dIdx}
                      className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#0F7A5C] text-white font-black text-xs flex items-center justify-center relative shadow-md ring-2 ring-emerald-400 cursor-pointer"
                      title="Today - Active Streak!"
                    >
                      <span>{item.dayNum}</span>
                    </div>
                  );
                }
                return (
                  <div 
                    key={dIdx}
                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-blue-600 text-white font-black text-xs flex items-center justify-center relative shadow-md shadow-blue-500/30 ring-2 ring-blue-300 cursor-pointer"
                    title="Today's Date"
                  >
                    <span>{item.dayNum}</span>
                  </div>
                );
              }

              if (isStreak) {
                return (
                  <div 
                    key={dIdx}
                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#0F7A5C] text-white font-black text-xs flex items-center justify-center shadow-xs cursor-pointer"
                    title={`Streak Active on ${dateStr}`}
                  >
                    <span>{item.dayNum}</span>
                  </div>
                );
              }

              return (
                <div 
                  key={dIdx}
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full text-gray-700 font-bold text-xs flex items-center justify-center hover:bg-gray-200 transition-colors cursor-pointer"
                >
                  <span>{item.dayNum}</span>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Calendar Legend */}
      <div className="pt-2 flex flex-wrap items-center justify-between text-[10px] font-bold text-gray-500 border-t border-gray-100 gap-2">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-[#0F7A5C]" />
          <span>Streak Day</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-blue-600" />
          <span>Today</span>
        </div>
      </div>

    </div>
  );
}
