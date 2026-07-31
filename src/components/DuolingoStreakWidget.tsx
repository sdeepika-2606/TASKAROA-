import React from 'react';
import { motion } from 'motion/react';
import { Flame, Check, ChevronRight } from 'lucide-react';
import { useData } from '../context/DataContext';
import { getStreakData } from '../services/streakService';
import { getWeekDaysStatus } from '../services/calendarService';

interface DuolingoStreakWidgetProps {
  onOpenStreakDetails?: () => void;
  className?: string;
}

export default function DuolingoStreakWidget({ onOpenStreakDetails, className = '' }: DuolingoStreakWidgetProps) {
  const { streak, completedDates } = useData();
  const streakData = getStreakData(completedDates);
  const weekDays = getWeekDaysStatus(completedDates);

  return (
    <motion.div
      whileHover={{ y: -2 }}
      onClick={onOpenStreakDetails}
      className={`bg-white text-gray-900 rounded-3xl p-6 shadow-sm border border-gray-100 relative overflow-hidden cursor-pointer group font-sans ${className}`}
    >
      {/* Top Header Row */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 to-orange-400 flex items-center justify-center text-white shadow-md shadow-orange-500/20">
            <Flame className="w-5 h-5 fill-white" />
          </div>
          <h3 className="text-lg font-black text-gray-900 tracking-tight">
            Focus Streak
          </h3>
        </div>

        <button
          type="button"
          onClick={onOpenStreakDetails}
          className="bg-orange-50 text-orange-600 font-extrabold text-xs px-3.5 py-1.5 rounded-full border border-orange-200/80 hover:bg-orange-100 transition-colors flex items-center gap-1 cursor-pointer"
        >
          <span>View Stats</span>
        </button>
      </div>

      {/* Main Counter & Message */}
      <div className="flex items-baseline gap-2 mb-5">
        <span className="text-4xl font-black text-gray-900 tracking-tight">
          {streak} Days
        </span>
        <span className="text-xs font-bold text-gray-500 flex items-center gap-1">
          Keep it up! 🔥
        </span>
      </div>

      {/* Weekday Row (M T W T F S S) */}
      <div className="grid grid-cols-7 gap-2 max-w-sm">
        {weekDays.map((day, idx) => {
          return (
            <div key={idx} className="flex flex-col items-center gap-1.5">
              <span className="text-[11px] font-black uppercase text-gray-400">
                {day.dayName.charAt(0)}
              </span>

              {day.status === 'completed' ? (
                <div className="w-8 h-8 rounded-full bg-[#0E8F6A] text-white flex items-center justify-center shadow-xs">
                  <Check className="w-4 h-4 stroke-[3]" />
                </div>
              ) : day.status === 'current' ? (
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-orange-400 text-white flex items-center justify-center shadow-md shadow-orange-500/30 ring-4 ring-orange-100 animate-pulse">
                  <Flame className="w-4 h-4 fill-white" />
                </div>
              ) : (
                <div className="w-8 h-8 rounded-full border-2 border-dashed border-gray-200 bg-gray-50" />
              )}
            </div>
          );
        })}
      </div>

    </motion.div>
  );
}
