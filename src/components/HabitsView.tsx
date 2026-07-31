import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Check, 
  Flame, 
  Award, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight, 
  Trophy, 
  Compass, 
  Gift, 
  TrendingUp,
  Sparkle
} from 'lucide-react';

interface Habit {
  id: string;
  name: string;
  icon: string;
  category: 'Mind' | 'Body' | 'Work' | 'Routine';
  weeklyTracker: boolean[]; // 7 days Mon-Sun
  streak: number;
}

interface HabitsViewProps {
  theme: 'light' | 'dark' | 'contrast';
}

export default function HabitsView({ theme }: HabitsViewProps) {
  // Habit Records state
  const [habits, setHabits] = useState<Habit[]>([
    { id: '1', name: 'Wake up early at 6 AM', icon: '🌅', category: 'Routine', weeklyTracker: [true, true, false, true, false, false, true], streak: 5 },
    { id: '2', name: 'Exercise / Morning Cardio', icon: '🏃‍♂️', category: 'Body', weeklyTracker: [true, false, true, true, false, true, false], streak: 4 },
    { id: '3', name: 'Read books 20 pages', icon: '📖', category: 'Mind', weeklyTracker: [true, true, true, true, true, false, true], streak: 6 },
    { id: '4', name: 'No social media on work block', icon: '💻', category: 'Work', weeklyTracker: [true, false, true, false, true, false, false], streak: 3 },
    { id: '5', name: 'Practice Pomodoro Breathing', icon: '🧘', category: 'Mind', weeklyTracker: [true, true, true, false, true, true, true], streak: 7 },
  ]);

  // Gamification Metrics (Clean, Non-forest)
  const [coins, setCoins] = useState(120);
  const [xp, setXp] = useState(380);
  const [performanceLevel, setPerformanceLevel] = useState(4);
  const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>(['Morning Ritual 🌅', 'Deep Focus 💻', 'Consistency Pro 🧘']);
  const [rewardClaimed, setRewardClaimed] = useState(false);

  // Filter Category Selected
  const [filterCategory, setFilterCategory] = useState<string>('All');

  // New Habit creation State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newHabitName, setNewHabitName] = useState('');
  const [newHabitIcon, setNewHabitIcon] = useState('🎯');
  const [newHabitCategory, setNewHabitCategory] = useState<'Mind' | 'Body' | 'Work' | 'Routine'>('Routine');

  // Time Range selector state
  const [timeRange, setTimeRange] = useState<'This Day' | 'This Week' | 'This Month' | 'This Year'>('This Week');

  // Message notifications
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const weekdays = useMemo(() => {
    if (timeRange === 'This Day') {
      return ['6 AM', '9 AM', '12 PM', '3 PM', '6 PM', '9 PM', 'Night'];
    }
    if (timeRange === 'This Week') {
      return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    }
    if (timeRange === 'This Month') {
      return ['Wk 1', 'Wk 2', 'Wk 3', 'Wk 4', 'Wk 5', 'Wk 6', 'Wk 7'];
    }
    return ['Jan-Feb', 'Mar-Apr', 'May-Jun', 'Jul-Aug', 'Sep-Oct', 'Nov', 'Dec'];
  }, [timeRange]);

  // Calculations for KPI summary cards
  const summary = useMemo(() => {
    const total = habits.length;
    const bestStreak = Math.max(...habits.map(h => h.streak), 0);
    const checkedToday = habits.filter(h => h.weeklyTracker[2]).length;
    const successRate = total > 0 ? Math.round((habits.flatMap(h => h.weeklyTracker).filter(Boolean).length / (total * 7)) * 100) : 0;

    return {
      total,
      bestStreak,
      completedToday: checkedToday,
      successRate
    };
  }, [habits]);

  // Leaderboard ranking
  const leaderboard = useMemo(() => {
    return [...habits].sort((a, b) => b.streak - a.streak).slice(0, 3);
  }, [habits]);

  // Handle checking off habit days
  const handleToggleDay = (habitId: string, dayIdx: number) => {
    setHabits(prev => prev.map(h => {
      if (h.id === habitId) {
        const updated = [...h.weeklyTracker];
        const prevChecked = updated[dayIdx];
        updated[dayIdx] = !updated[dayIdx];

        let currentStreak = 0;
        for (let i = dayIdx; i >= 0; i--) {
          if (updated[i]) currentStreak++;
          else break;
        }

        if (!prevChecked) {
          setXp(x => x + 15);
          setCoins(c => c + 5);
          triggerToast(`Streak extended! Gained +15 XP & +5 Coins! 🪙`);
        } else {
          setXp(x => Math.max(0, x - 15));
          setCoins(c => Math.max(0, c - 5));
        }

        return {
          ...h,
          weeklyTracker: updated,
          streak: currentStreak || h.streak
        };
      }
      return h;
    }));
  };

  // Add Habit Submit
  const handleCreateHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabitName.trim()) return;

    const newH: Habit = {
      id: Date.now().toString(),
      name: newHabitName,
      icon: newHabitIcon,
      category: newHabitCategory,
      weeklyTracker: [false, false, false, false, false, false, false],
      streak: 0
    };

    setHabits(prev => [...prev, newH]);
    setNewHabitName('');
    setShowAddModal(false);
    triggerToast(`Successfully added your new habit: "${newHabitName}"!`);
  };

  // Delete habit
  const handleDeleteHabit = (id: string) => {
    setHabits(prev => prev.filter(h => h.id !== id));
    triggerToast("Habit track removed.");
  };

  // Reward claim
  const handleClaimChest = () => {
    if (rewardClaimed) return;
    setRewardClaimed(true);
    setCoins(c => c + 50);
    setXp(x => x + 100);
    triggerToast("Daily Reward claimed! Gained +50 Coins & +100 XP! ⭐");
  };

  // Determine performance badge from streak value
  const getStreakPerformanceBadge = (streak: number) => {
    if (streak >= 7) return { icon: '👑', label: 'Grandmaster' };
    if (streak >= 5) return { icon: '💎', label: 'Elite' };
    if (streak >= 3) return { icon: '🔥', label: 'Dedicated' };
    if (streak >= 2) return { icon: '✨', label: 'Rising' };
    if (streak >= 1) return { icon: '⭐', label: 'Initiated' };
    return { icon: '🎯', label: 'Planned' };
  };

  // Total completed checkboxes across all habits
  const totalCompletedCheckboxes = useMemo(() => {
    return habits.flatMap(h => h.weeklyTracker).filter(Boolean).length;
  }, [habits]);

  // Filtered habits
  const filteredHabits = useMemo(() => {
    if (filterCategory === 'All') return habits;
    return habits.filter(h => h.category === filterCategory);
  }, [habits, filterCategory]);

  return (
    <div className="space-y-6 max-w-[1720px] mx-auto pb-12 font-sans select-none animate-fade-in text-gray-800">
      
      {/* Alert toast notifications */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-24 right-8 z-50 p-4 rounded-xl bg-[#2F4156] border border-[#C8D9E6]/20 text-white shadow-xl flex items-center gap-3 max-w-sm font-bold text-xs"
          >
            <Sparkles className="w-5 h-5 text-[#C8D9E6] animate-spin" />
            <span>{toastMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header section with premium brand identity */}
      <div className="relative bg-gradient-to-r from-[#F5EFEB] via-white to-[#C8D9E6]/30 p-6 rounded-[24px] border border-[#2F4156]/10 shadow-xs flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <span className="text-xs font-bold text-[#567C8D] uppercase tracking-wider flex items-center gap-1.5 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#567C8D]" /> Consistency Engine
          </span>
          <h2 className="text-3xl font-extrabold font-display text-[#2F4156] tracking-tight">
            Atomic Habits Board
          </h2>
          <p className="text-gray-500 text-sm mt-0.5">
            Build compounding habits, unlock achievement milestones, and drive consistent execution.
          </p>
        </div>
      </div>

      {/* TOP KPI Summary Cards (Clean non-nature styling) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Habits */}
        <div className="bg-white p-4 rounded-2xl border border-[#2F4156]/10 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
          <div className="flex justify-between items-start">
            <div className="w-9 h-9 rounded-xl bg-[#F5EFEB] flex items-center justify-center text-lg">🎯</div>
            <span className="text-[10px] text-[#567C8D] font-bold bg-[#F5EFEB] px-1.5 py-0.5 rounded-md">Active</span>
          </div>
          <div className="mt-3 text-left">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Total Habits</span>
            <strong className="text-2xl font-black text-[#2F4156] block mt-0.5">{summary.total}</strong>
          </div>
        </div>

        {/* Best Streak */}
        <div className="bg-white p-4 rounded-2xl border border-[#2F4156]/10 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
          <div className="flex justify-between items-start">
            <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center text-lg">🔥</div>
            <span className="text-[10px] text-orange-500 font-bold bg-orange-50 px-1.5 py-0.5 rounded-md">Record</span>
          </div>
          <div className="mt-3 text-left">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Best Streak</span>
            <strong className="text-2xl font-black text-[#2F4156] block mt-0.5">{summary.bestStreak} Days</strong>
          </div>
        </div>

        {/* Completed Today */}
        <div className="bg-white p-4 rounded-2xl border border-[#2F4156]/10 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
          <div className="flex justify-between items-start">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center text-lg">✅</div>
            <span className="text-[10px] text-indigo-500 font-bold bg-indigo-50 px-1.5 py-0.5 rounded-md">Today</span>
          </div>
          <div className="mt-3 text-left">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Completed Today</span>
            <strong className="text-2xl font-black text-[#2F4156] block mt-0.5">{summary.completedToday} / {summary.total}</strong>
          </div>
        </div>

        {/* Success Rate */}
        <div className="bg-white p-4 rounded-2xl border border-[#2F4156]/10 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
          <div className="flex justify-between items-start">
            <div className="w-9 h-9 rounded-xl bg-teal-50 flex items-center justify-center text-lg">📈</div>
            <span className="text-[10px] text-teal-600 font-bold bg-teal-50 px-1.5 py-0.5 rounded-md">Success</span>
          </div>
          <div className="mt-3 text-left">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Success Rate</span>
            <strong className="text-2xl font-black text-[#2F4156] block mt-0.5">{summary.successRate}%</strong>
          </div>
        </div>

      </div>

      {/* Habits Main Section */}
      <div className="space-y-6">
        
        <div className="bg-white rounded-[24px] border border-[#2F4156]/10 shadow-sm p-6 space-y-6">
          
          {/* Table Header Controls & Add Habit Button */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-500">Filters:</span>
              <div className="flex flex-wrap gap-1">
                {['All', 'Routine', 'Mind', 'Body', 'Work'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setFilterCategory(cat)}
                    className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all ${
                      filterCategory === cat 
                        ? 'bg-[#F5EFEB] text-[#2F4156] border border-[#2F4156]/20' 
                        : 'bg-gray-50 text-gray-400 hover:text-gray-700'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-xs text-gray-400 font-bold bg-gray-50 hover:bg-gray-100 transition-colors py-1 px-2.5 rounded-xl border border-gray-100 relative">
                <button 
                  onClick={() => {
                    const ranges: ('This Day' | 'This Week' | 'This Month' | 'This Year')[] = ['This Day', 'This Week', 'This Month', 'This Year'];
                    const currentIdx = ranges.indexOf(timeRange);
                    const prevIdx = (currentIdx - 1 + ranges.length) % ranges.length;
                    setTimeRange(ranges[prevIdx]);
                  }}
                  className="p-1 hover:text-gray-600 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value as any)}
                  className="bg-transparent border-none outline-none font-bold text-[#2F4156] cursor-pointer pr-4 appearance-none text-[11px]"
                >
                  <option value="This Day">This Day</option>
                  <option value="This Week">This Week</option>
                  <option value="This Month">This Month</option>
                  <option value="This Year">This Year</option>
                </select>
                <span className="absolute right-7 pointer-events-none text-[9px] text-gray-400">▼</span>
                <button 
                  onClick={() => {
                    const ranges: ('This Day' | 'This Week' | 'This Month' | 'This Year')[] = ['This Day', 'This Week', 'This Month', 'This Year'];
                    const currentIdx = ranges.indexOf(timeRange);
                    const nextIdx = (currentIdx + 1) % ranges.length;
                    setTimeRange(ranges[nextIdx]);
                  }}
                  className="p-1 hover:text-gray-600 transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <button 
                onClick={() => setShowAddModal(true)}
                className="py-2.5 px-5 bg-[#2F4156] hover:bg-[#1E293B] text-white text-xs font-extrabold rounded-xl transition-all shadow-md hover:shadow-lg flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[2.5px]" /> Add Habit
              </button>
            </div>
          </div>

          {/* Main Habits Grid Table */}
          <div className="overflow-x-auto">
            <div className="min-w-[700px] space-y-3 pt-2">
              
              {/* Table Column headers (col-span-5 + 7 * col-span-1 = 12) */}
              <div className="grid grid-cols-12 gap-2 text-center text-[10px] font-black text-gray-400 uppercase tracking-wider pb-1">
                <div className="col-span-5 text-left pl-2">Habit Info</div>
                {weekdays.map(day => (
                  <div key={day} className="col-span-1">{day}</div>
                ))}
              </div>

              {/* Rows */}
              {filteredHabits.length === 0 ? (
                <div className="py-12 text-center text-gray-400 italic">
                  <Compass className="w-10 h-10 mx-auto text-gray-300 mb-2" />
                  No habits match the selected filter.
                </div>
              ) : (
                filteredHabits.map(h => (
                  <div 
                    key={h.id}
                    className="grid grid-cols-12 gap-2 items-center text-center p-3.5 bg-gray-50/40 hover:bg-[#F5EFEB]/20 border border-transparent hover:border-[#2F4156]/20 rounded-2xl transition-all group"
                  >
                    {/* Habit Name / Icon */}
                    <div className="col-span-5 text-left flex items-center justify-between pr-3 pl-2">
                      <div className="flex items-center gap-3">
                        <span className="text-xl bg-white p-2 rounded-xl border border-gray-100 shadow-2xs shrink-0">{h.icon}</span>
                        <div>
                          <span className="text-[9px] font-black uppercase text-gray-400 block tracking-wider">{h.category}</span>
                          <span className="font-extrabold text-xs text-gray-800 leading-tight block mt-0.5">{h.name}</span>
                        </div>
                      </div>

                      <button 
                        onClick={() => handleDeleteHabit(h.id)}
                        className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-500 transition-opacity p-1"
                      >
                        ✕
                      </button>
                    </div>

                    {/* Day Checkboxes (Plain checkmarks, no emojis) */}
                    {h.weeklyTracker.map((checked, dayIdx) => (
                      <div key={dayIdx} className="col-span-1 flex justify-center">
                        <button
                          onClick={() => handleToggleDay(h.id, dayIdx)}
                          className={`w-9 h-9 rounded-xl border transition-all flex items-center justify-center cursor-pointer ${
                            checked 
                              ? 'bg-[#567C8D] border-transparent text-white shadow-xs shadow-[#567C8D]/30 hover:bg-[#2F4156]' 
                              : 'bg-white border-gray-200 hover:border-[#2F4156]/50'
                          }`}
                          title={checked ? 'Completed' : 'Mark as completed'}
                        >
                          {checked ? (
                            <span className="text-xs font-black">✓</span>
                          ) : (
                            <span className="w-1.5 h-1.5 rounded-full bg-gray-200 group-hover:bg-gray-300" />
                          )}
                        </button>
                      </div>
                    ))}

                  </div>
                ))
              )}

            </div>
          </div>

          {/* Motivational bottom block */}
          <div className="p-4 bg-gradient-to-r from-[#F5EFEB]/50 to-[#C8D9E6]/20 border border-[#C8D9E6]/40 rounded-2xl text-left flex items-center gap-3">
            <span className="text-lg font-black">💡</span>
            <p className="text-xs text-[#2F4156] font-medium leading-relaxed">
              <strong>"Compounding actions build exceptional standards."</strong> Complete daily habits consistently to build strong execution rhythms and reliable professional discipline.
            </p>
          </div>

        </div>

      </div>

      {/* CREATIVE NEW HABIT MODAL */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs animate-fade-in">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-[24px] border border-[#2F4156]/10 p-6 max-w-md w-full shadow-2xl relative text-left"
            >
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <h3 className="text-sm font-extrabold text-[#2F4156] font-display uppercase flex items-center gap-1.5">
                  🎯 Add New Habit Tracker
                </h3>
                <button 
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-400 hover:text-gray-600 font-black text-sm"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateHabit} className="space-y-4 pt-3 text-xs">
                <div>
                  <label className="block text-gray-500 font-semibold mb-1">Habit Name</label>
                  <input
                    type="text"
                    value={newHabitName}
                    onChange={e => setNewHabitName(e.target.value)}
                    placeholder="e.g., Code for 1 hour, Drink 3L Water"
                    className="w-full py-2 px-3 border border-gray-200 focus:border-[#2F4156] rounded-xl outline-none font-medium"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-gray-500 font-semibold mb-1">Category</label>
                    <select
                      value={newHabitCategory}
                      onChange={e => setNewHabitCategory(e.target.value as any)}
                      className="w-full py-2 px-2.5 border border-[#2F4156] focus:border-[#2F4156] rounded-xl outline-none font-bold text-gray-500 bg-white"
                    >
                      <option value="Routine">Routine ⏰</option>
                      <option value="Mind">Mind 🧘</option>
                      <option value="Body">Body 🏃‍♂️</option>
                      <option value="Work">Work 💻</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-500 font-semibold mb-1">Icon</label>
                    <select
                      value={newHabitIcon}
                      onChange={e => setNewHabitIcon(e.target.value)}
                      className="w-full py-2 px-2.5 border border-[#2F4156] focus:border-[#2F4156] rounded-xl outline-none font-bold text-gray-500 bg-white"
                    >
                      <option value="🎯">🎯 Target</option>
                      <option value="🌅">🌅 Sunrise</option>
                      <option value="🧘">🧘 Meditating</option>
                      <option value="🏃‍♂️">🏃‍♂️ Running</option>
                      <option value="📖">📖 Book</option>
                      <option value="💻">💻 Laptop</option>
                      <option value="🥤">🥤 Water Cup</option>
                      <option value="🛌">🛌 Sleep Early</option>
                    </select>
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-100 flex justify-end gap-2">
                  <button 
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="py-2 px-4 bg-gray-50 hover:bg-gray-100 text-gray-500 font-bold rounded-xl transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="py-2 px-4 bg-[#2F4156] hover:bg-[#1E293B] text-white font-bold rounded-xl transition-all shadow-md cursor-pointer"
                  >
                    Add Habit Tracker
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
