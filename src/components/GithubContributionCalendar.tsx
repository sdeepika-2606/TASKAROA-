import React, { useState } from 'react';
import { getYearActivityData, DayActivity } from '../services/calendarService';
import { Sparkles, Calendar, Zap, CheckCircle2, Clock, ChevronLeft, ChevronRight } from 'lucide-react';

interface GithubContributionCalendarProps {
  completedDates?: string[];
  className?: string;
}

export default function GithubContributionCalendar({ completedDates = [], className = '' }: GithubContributionCalendarProps) {
  const currentRealYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState<number>(currentRealYear);
  const [hoveredDay, setHoveredDay] = useState<DayActivity | null>(null);

  const yearData = getYearActivityData(completedDates, selectedYear);

  // Group into 52/53 columns x 7 rows (weeks)
  const weeks: DayActivity[][] = [];
  for (let i = 0; i < yearData.length; i += 7) {
    weeks.push(yearData.slice(i, i + 7));
  }

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  // Calculate Month Header Spans corresponding to week column indices for selectedYear
  const monthStarts: { name: string; weekIdx: number }[] = [];
  
  weeks.forEach((week, wIdx) => {
    week.forEach((day) => {
      if (day.year === selectedYear) {
        if (day.dayOfMonth === 1 || (wIdx === 0 && !monthStarts.some(m => m.name === monthNames[day.monthIndex]))) {
          if (!monthStarts.some(m => m.name === monthNames[day.monthIndex])) {
            monthStarts.push({ name: monthNames[day.monthIndex], weekIdx: wIdx });
          }
        }
      }
    });
  });

  const monthHeaders: { name: string; colSpan: number }[] = monthStarts.map((m, idx) => {
    const nextWeekIdx = idx < monthStarts.length - 1 ? monthStarts[idx + 1].weekIdx : weeks.length;
    return {
      name: m.name,
      colSpan: Math.max(1, nextWeekIdx - m.weekIdx)
    };
  });

  return (
    <div className={`bg-white text-gray-900 p-6 rounded-3xl border border-gray-100 shadow-xs space-y-4 ${className}`}>
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
        <div>
          <h3 className="text-sm font-black uppercase tracking-wider text-[#0F7A5C] flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#0F7A5C]" />
            <span>365-Day Productivity Heatmap</span>
          </h3>
          <p className="text-xs text-gray-500 font-medium mt-0.5">GitHub-style activity contributions throughout the year</p>
        </div>

        {/* Year Navigator & Legend */}
        <div className="flex flex-wrap items-center gap-4 self-start sm:self-auto">
          
          {/* Year Scroll / Switcher */}
          <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 px-2.5 py-1 rounded-xl text-xs font-bold text-gray-800">
            <button
              type="button"
              onClick={() => setSelectedYear(prev => prev - 1)}
              className="p-1 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer text-gray-600 hover:text-gray-900"
              title="Previous Year"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="font-black text-xs text-[#0F7A5C] px-1">{selectedYear}</span>
            <button
              type="button"
              onClick={() => setSelectedYear(prev => prev + 1)}
              className="p-1 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer text-gray-600 hover:text-gray-900"
              title="Next Year"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-1.5 text-[10px] text-gray-500 font-bold">
            <span>Less</span>
            <div className="w-3 h-3 rounded-xs bg-gray-100 border border-gray-200" title="No Activity" />
            <div className="w-3 h-3 rounded-xs bg-[#B7E4C7]" title="Light Activity" />
            <div className="w-3 h-3 rounded-xs bg-[#52B788]" title="Medium Activity" />
            <div className="w-3 h-3 rounded-xs bg-[#0F7A5C]" title="High Productivity" />
            <span>More</span>
          </div>

        </div>
      </div>

      {/* Heatmap Grid Wrapper */}
      <div className="overflow-x-auto pb-2 custom-scrollbar">
        <div className="min-w-[760px]">
          
          {/* Month Labels Row */}
          <div className="flex text-[10px] font-bold text-gray-400 mb-2 pl-8">
            {monthHeaders.map((m, idx) => (
              <div key={idx} style={{ flex: m.colSpan }} className="text-left overflow-hidden">
                {m.name}
              </div>
            ))}
          </div>

          <div className="flex gap-1.5 items-start">
            
            {/* Day Labels Column (All 7 Days) */}
            <div className="flex flex-col justify-between text-[9px] font-bold text-gray-400 h-[108px] pr-2 shrink-0 py-0.5 select-none">
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
              <span>Sun</span>
            </div>

            {/* Weeks Columns Grid */}
            <div className="flex gap-1 flex-1 justify-between">
              {weeks.map((week, wIdx) => (
                <div key={wIdx} className="flex flex-col gap-1">
                  {week.map((day, dIdx) => {
                    const isToday = day.isToday;

                    // Determine background color for light theme
                    let bgClass = day.isInTargetYear ? 'bg-gray-100 border-gray-200/50' : 'bg-gray-50/60 border-gray-100';
                    if (day.intensity === 1) bgClass = 'bg-[#B7E4C7] border-[#95D5B2]';
                    if (day.intensity === 2) bgClass = 'bg-[#52B788] border-[#40916C]';
                    if (day.intensity === 3) bgClass = 'bg-[#0F7A5C] border-[#08523D]';

                    return (
                      <div
                        key={dIdx}
                        onMouseEnter={() => setHoveredDay(day)}
                        onMouseLeave={() => setHoveredDay(null)}
                        className={`w-3 h-3 rounded-xs border transition-all cursor-pointer relative ${bgClass} ${
                          isToday ? 'ring-2 ring-amber-400 ring-offset-1 ring-offset-white scale-110 z-10 font-bold shadow-xs' : 'hover:scale-125 hover:z-20'
                        }`}
                        title={`${day.date}: ${day.tasksCompleted} tasks completed`}
                      />
                    );
                  })}
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>

      {/* Dynamic Hover Details Card */}
      <div className="bg-gray-50 border border-gray-200 rounded-2xl p-3 min-h-[52px] flex items-center justify-between">
        {hoveredDay ? (
          <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-semibold text-gray-800">
            <div className="flex items-center gap-2">
              <span className="font-black text-[#0F7A5C] bg-white px-2.5 py-1 rounded-lg border border-gray-200 shadow-2xs">
                📅 {hoveredDay.date} {hoveredDay.isToday ? '(Today)' : ''}
              </span>
              <span className="capitalize px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#EBF7F2] text-[#0F7A5C] border border-[#B7E4C7]">
                {hoveredDay.streakStatus}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-[11px]">
              <span className="flex items-center gap-1 text-gray-600">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#0F7A5C]" />
                Completed: <strong className="text-gray-900">{hoveredDay.tasksCompleted}</strong>
              </span>
              <span className="flex items-center gap-1 text-gray-600">
                <Clock className="w-3.5 h-3.5 text-[#0F7A5C]" />
                Focus: <strong className="text-gray-900">{hoveredDay.focusTimeMinutes} mins</strong>
              </span>
              <span className="flex items-center gap-1 text-gray-600">
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                Active Hours: <strong className="text-gray-900">{(hoveredDay.focusTimeMinutes / 60 + (hoveredDay.tasksCompleted > 0 ? 0.5 : 0)).toFixed(1)} hrs</strong>
              </span>
            </div>
          </div>
        ) : (
          <p className="text-xs text-gray-400 font-medium italic flex items-center gap-1.5 mx-auto">
            <Sparkles className="w-3.5 h-3.5 text-[#0F7A5C]" />
            Hover over any day to inspect detailed task completion and focus activity.
          </p>
        )}
      </div>

    </div>
  );
}
