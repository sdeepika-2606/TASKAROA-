import React from 'react';
import { X, Trophy, Lock, Flame, Calendar, Award } from 'lucide-react';
import { useData } from '../context/DataContext';
import { getLocalDateString, getWeekDaysStatus } from '../services/calendarService';

interface StreakModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function StreakModal({ isOpen, onClose }: StreakModalProps) {
  const { streak, streakRecord, streakStartDate, completedDates, streakTarget, setStreakTarget } = useData();

  if (!isOpen) return null;

  const currentWeekDays = getWeekDaysStatus(completedDates);

  const milestones = [
    { days: 7, title: '7-Day Spark', unlocked: streak >= 7, icon: '🔥' },
    { days: 30, title: 'Monthly Legend', unlocked: streak >= 30, icon: '🏆' },
    { days: 60, title: '60-Day Titan', unlocked: streak >= 60, icon: '💎' },
    { days: 90, title: '90-Day Master', unlocked: streak >= 90, icon: '⚡' },
    { days: 180, title: 'Half-Year Hero', unlocked: streak >= 180, icon: '🌟' },
    { days: 365, title: '365-Day Immortal', unlocked: streak >= 365, icon: '👑' },
  ];

  const currentGoal = streakTarget || 30;
  const progressPercent = Math.min(100, Math.round((streak / currentGoal) * 100));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative border border-gray-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Background glowing gradient radial behind flame */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-64 h-64 bg-gradient-to-b from-amber-200/50 via-orange-100/30 to-transparent rounded-full blur-2xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Top Glossy Flame & Streak Title */}
        <div className="flex flex-col items-center text-center mt-2 relative z-10">
          {/* Glossy 3D Fire Emoji / Gradient Flame Icon */}
          <div className="relative mb-3">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-red-500 via-orange-400 to-amber-300 flex items-center justify-center shadow-lg shadow-orange-500/30 animate-pulse">
              <span className="text-4xl filter drop-shadow-md select-none">🔥</span>
            </div>
            <div className="absolute inset-0 rounded-full bg-orange-400/20 blur-md -z-10" />
          </div>

          <h2 className="text-3xl font-black text-gray-900 tracking-tight">
            {streak} Days Streak!
          </h2>
          <p className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 mt-1">
            You're on fire! Keep your streak active today 🔥
          </p>
        </div>

        {/* Weekly Row (Mon-Sun) */}
        <div className="mt-6 p-4 rounded-2xl bg-gradient-to-r from-orange-50/50 via-amber-50/30 to-emerald-50/40 border border-orange-100/60">
          <div className="flex justify-between items-center text-center">
            {currentWeekDays.map((item, idx) => (
              <div key={idx} className="flex flex-col items-center gap-1.5">
                <span className="text-[11px] font-extrabold uppercase text-gray-500">{item.dayName.slice(0, 2)}</span>
                <div 
                  className={`w-9 h-9 rounded-full flex flex-col items-center justify-center text-xs font-black transition-all ${
                    item.status === 'completed'
                      ? 'bg-[#0F7A5C] text-white shadow-xs'
                      : item.status === 'current'
                      ? 'bg-gradient-to-tr from-amber-500 to-orange-500 text-white shadow-md shadow-orange-500/30 ring-2 ring-orange-300 animate-pulse'
                      : 'border-2 border-dashed border-gray-300 bg-white text-gray-400'
                  }`}
                  title={`${item.dayName} (${item.dateStr})`}
                >
                  {item.status === 'completed' ? (
                    <span className="text-xs">✓</span>
                  ) : item.status === 'current' ? (
                    <span className="text-xs">🔥</span>
                  ) : (
                    <span className="text-[10px]">{item.dateStr.slice(-2)}</span>
                  )}
                </div>
                <span className="text-[9px] font-medium text-gray-400">{item.dateStr.slice(-2)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Streak Challenge Section */}
        <div className="mt-5 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-gray-700">
            <span className="flex items-center gap-1.5 text-gray-900">
              <Trophy className="w-4 h-4 text-amber-500" />
              Streak Challenge
            </span>
            <span className="text-orange-600 font-extrabold">Day {streak} of {currentGoal}</span>
          </div>

          <div className="relative w-full h-3.5 bg-gray-100 rounded-full overflow-hidden border border-gray-200">
            <div 
              className="h-full bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 rounded-full transition-all duration-500 relative"
              style={{ width: `${progressPercent}%` }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-4 h-4 bg-white rounded-full border-2 border-orange-500 shadow-md flex items-center justify-center text-[8px]">
                🔥
              </div>
            </div>
          </div>
          <div className="flex justify-between text-[10px] text-gray-400 font-semibold px-0.5">
            <span>Start: Day 1</span>
            <span>Target: Day {currentGoal}</span>
          </div>

          {/* Quick Target Picker inside Modal */}
          <div className="pt-2 flex flex-wrap gap-1.5 justify-center">
            {[7, 30, 60, 90, 180, 365].map((tgt) => (
              <button
                key={tgt}
                type="button"
                onClick={() => setStreakTarget && setStreakTarget(tgt)}
                className={`px-2.5 py-1 rounded-xl text-[10px] font-black transition-all cursor-pointer border ${
                  streakTarget === tgt
                    ? 'bg-[#0F7A5C] text-white border-[#0F7A5C] shadow-xs'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-600 border-gray-200'
                }`}
              >
                {tgt} Days Challenge
              </button>
            ))}
          </div>
        </div>

        {/* Stats Cards (Started & Record) */}
        <div className="grid grid-cols-2 gap-3 mt-5">
          <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-100/70 text-[#0F7A5C] flex items-center justify-center shrink-0">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Streak Started</p>
              <p className="text-xs font-black text-gray-800">{streakStartDate}</p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-orange-100/70 text-orange-600 flex items-center justify-center shrink-0">
              <Flame className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Streak Record</p>
              <p className="text-xs font-black text-gray-800">{streakRecord} Days</p>
            </div>
          </div>
        </div>

        {/* Streak Milestones */}
        <div className="mt-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-[#0F7A5C]" />
              Streak Milestones
            </span>
            <span className="text-[10px] font-bold text-emerald-600">
              {milestones.filter(m => m.unlocked).length}/{milestones.length} Unlocked
            </span>
          </div>

          <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-none">
            {milestones.map((m, i) => (
              <div 
                key={i}
                className={`min-w-[100px] p-2.5 rounded-2xl border flex flex-col items-center text-center shrink-0 transition-all ${
                  m.unlocked 
                    ? 'bg-emerald-50/60 border-emerald-200 text-gray-900' 
                    : 'bg-gray-50/80 border-gray-200 text-gray-400 opacity-60'
                }`}
              >
                <div className="text-xl mb-1">{m.unlocked ? m.icon : <Lock className="w-4 h-4 text-gray-400 my-1" />}</div>
                <p className="text-[11px] font-black">{m.title}</p>
                <p className="text-[9px] font-bold text-gray-400">{m.days} Days</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
