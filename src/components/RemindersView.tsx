import React, { useState, useEffect } from 'react';
import { useProfile } from '../context/ProfileContext';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bell, 
  Clock, 
  Search, 
  Trash2, 
  Check, 
  Plus, 
  Calendar, 
  Sparkles, 
  History, 
  Volume2, 
  Activity
} from 'lucide-react';
import { cn } from '../lib/utils';

interface Reminder {
  id: string;
  title: string;
  category: string;
  categoryIcon: string;
  date: string;
  time: string;
  repeat: string;
  priority: 'Low' | 'Medium' | 'High';
  style: 'Gentle' | 'Normal' | 'Critical';
  color: string;
  notes?: string;
  aiSuggestion?: string;
  countdown?: string;
  completed: boolean;
  streak?: number;
  snoozedCount?: number;
}

interface RemindersViewProps {
  theme: 'light' | 'dark' | 'contrast';
  userName?: string;
  userGender?: 'male' | 'female';
  onNavigate?: (view: string) => void;
}

export default function RemindersView({ theme, userName = "Deepika S", userGender = "female", onNavigate }: RemindersViewProps) {
  const { profile } = useProfile();
  const actualName = profile.name || userName || 'User';

  const [reminders, setReminders] = useState<Reminder[]>(() => {
    const saved = localStorage.getItem('taskaroa_reminders');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: '1',
        title: 'Review AI Final Project Report submission',
        category: 'Study',
        categoryIcon: '📖',
        date: '2026-06-30',
        time: '20:00',
        repeat: 'Never',
        priority: 'High',
        style: 'Critical',
        color: '#2F4156',
        notes: 'Double check visual analytics representation of neural weights.',
        aiSuggestion: 'Start a 40-minute focus session before the deadline.',
        countdown: 'Due in 01h 26m',
        completed: false
      },
      {
        id: '2',
        title: 'Data Structures Heap & Tree Assignment submission',
        category: 'Study',
        categoryIcon: '📂',
        date: '2026-07-01',
        time: '10:00',
        repeat: 'Never',
        priority: 'Medium',
        style: 'Normal',
        color: '#567C8D',
        notes: 'Implement heapify with exact O(N) linear time complexity constraints.',
        aiSuggestion: 'Review class notes tonight before sleeping.',
        countdown: 'Due Tomorrow',
        completed: false
      },
      {
        id: '3',
        title: 'Morning Yoga and Core Strength Routine',
        category: 'Habit',
        categoryIcon: '🧘',
        date: '2026-07-01',
        time: '06:30',
        repeat: 'Daily',
        priority: 'Low',
        style: 'Gentle',
        color: '#C8D9E6',
        streak: 4,
        completed: false
      },
      {
        id: '4',
        title: 'Take Daily Multi-Vitamins and Minerals',
        category: 'Health',
        categoryIcon: '💊',
        date: '2026-06-30',
        time: '21:00',
        repeat: 'Daily',
        priority: 'Low',
        style: 'Gentle',
        color: '#2F4156',
        completed: true
      }
    ];
  });

  const [filterTab, setFilterTab] = useState<'All' | 'Today' | 'Tomorrow' | 'Upcoming' | 'Completed' | 'Overdue'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('All');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'Smart Priority' | 'Time' | 'Newest'>('Smart Priority');

  const [naturalLanguageInput, setNaturalLanguageInput] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Study');
  const [newDate, setNewDate] = useState('2026-06-30');
  const [newTime, setNewTime] = useState('18:00');
  const [newRepeat, setNewRepeat] = useState('Never');
  const [newPriority, setNewPriority] = useState<'Low' | 'Medium' | 'High'>('Medium');
  const [newStyle, setNewStyle] = useState<'Gentle' | 'Normal' | 'Critical'>('Normal');
  const [newColor, setNewColor] = useState('#2F4156');
  const [newNotes, setNewNotes] = useState('');
  const [enableVoice, setEnableVoice] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('taskaroa_reminders', JSON.stringify(reminders));
  }, [reminders]);

  const handleNlpParse = () => {
    if (!naturalLanguageInput.trim()) return;
    
    const lower = naturalLanguageInput.toLowerCase();
    let parsedTitle = naturalLanguageInput;
    let parsedTime = '19:00';
    let parsedCategory = 'Study';
    let parsedPriority: 'Low' | 'Medium' | 'High' = 'Medium';

    if (lower.includes('remind me to')) {
      parsedTitle = naturalLanguageInput.replace(/remind me to/i, '').trim();
    }

    if (lower.includes('study')) {
      parsedCategory = 'Study';
    } else if (lower.includes('workout') || lower.includes('gym')) {
      parsedCategory = 'Fitness';
    } else if (lower.includes('medicine') || lower.includes('health')) {
      parsedCategory = 'Health';
    }

    if (lower.includes('at 7 pm') || lower.includes('7pm')) {
      parsedTime = '19:00';
    } else if (lower.includes('at 9 pm') || lower.includes('9pm')) {
      parsedTime = '21:00';
    } else if (lower.includes('at 10 am') || lower.includes('10am')) {
      parsedTime = '10:00';
    }

    if (lower.includes('urgent') || lower.includes('critical')) {
      parsedPriority = 'High';
    }

    setNewTitle(parsedTitle);
    setNewCategory(parsedCategory);
    setNewTime(parsedTime);
    setNewPriority(parsedPriority);
    setNaturalLanguageInput('');

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } catch (e) {}
  };

  const handleCreateReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const catIconMap: Record<string, string> = {
      'Study': '📖',
      'Work': '💼',
      'Health': '🏃',
      'Fitness': '💪',
      'Personal': '🏡',
      'Finance': '💰',
      'Shopping': '🛒',
      'Birthday': '🎂',
      'Goals': '🎯',
      'Habit': '📈'
    };

    const newRem: Reminder = {
      id: Date.now().toString(),
      title: newTitle,
      category: newCategory,
      categoryIcon: catIconMap[newCategory] || '🔔',
      date: newDate,
      time: newTime,
      repeat: newRepeat,
      priority: newPriority,
      style: newStyle,
      color: newColor,
      notes: newNotes,
      aiSuggestion: newPriority === 'High' ? 'Review notes briefly and prepare.' : 'Review notes briefly.',
      countdown: 'Due Soon',
      completed: false
    };

    setReminders(prev => [newRem, ...prev]);
    setNewTitle('');
    setNewNotes('');

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch (e) {}
  };

  const toggleComplete = (id: string) => {
    setReminders(prev => prev.map(r => r.id === id ? { ...r, completed: !r.completed } : r));
  };

  const deleteReminder = (id: string) => {
    setReminders(prev => prev.filter(r => r.id !== id));
  };

  const snoozeReminder = (id: string) => {
    setReminders(prev => prev.map(r => {
      if (r.id === id) {
        const [h, m] = r.time.split(':').map(Number);
        const newM = (m + 15) % 60;
        const newH = (h + Math.floor((m + 15) / 60)) % 24;
        const formattedTime = `${String(newH).padStart(2, '0')}:${String(newM).padStart(2, '0')}`;
        return {
          ...r,
          time: formattedTime,
          snoozedCount: (r.snoozedCount || 0) + 1,
          countdown: 'Snoozed 15 mins'
        };
      }
      return r;
    }));
  };

  const filteredReminders = reminders.filter(r => {
    if (searchQuery && !r.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (priorityFilter !== 'All' && r.priority !== priorityFilter) return false;
    if (categoryFilter !== 'All' && r.category !== categoryFilter) return false;

    if (filterTab === 'Completed') return r.completed;
    if (filterTab === 'Today') return r.date === '2026-06-30' && !r.completed;
    if (filterTab === 'Tomorrow') return r.date === '2026-07-01' && !r.completed;
    if (filterTab === 'Upcoming') return r.date > '2026-07-01' && !r.completed;
    if (filterTab === 'Overdue') return r.date < '2026-06-30' && !r.completed;

    return true;
  }).sort((a, b) => {
    if (sortBy === 'Time') return a.time.localeCompare(b.time);
    if (sortBy === 'Newest') return b.id.localeCompare(a.id);
    const priorityWeight = { 'High': 3, 'Medium': 2, 'Low': 1 };
    return priorityWeight[b.priority] - priorityWeight[a.priority];
  });

  return (
    <div className="space-y-8 animate-fade-in pb-12 select-none text-left">
      
      {/* Header Block */}
      <div className="rounded-[28px] border border-[#2F4156]/10 bg-gradient-to-br from-[#F5EFEB] to-[#C8D9E6]/20 p-8 shadow-sm relative overflow-hidden flex flex-col justify-between min-h-[160px]">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="space-y-2">
              <h2 className="text-3xl font-extrabold font-display text-[#2F4156] tracking-tight">
                Smart Alerts & Reminders
              </h2>
              <p className="text-gray-500 text-xs font-bold leading-relaxed max-w-xl">
                Personalized reminders and intelligence for <button onClick={() => onNavigate?.('Profile')} className="underline font-extrabold text-[#2F4156] hover:text-[#567C8D] cursor-pointer transition-colors" title="Click to view Profile Settings">{actualName}</button>.
              </p>
            </div>
          </div>

          <button 
            onClick={() => setIsHistoryOpen(!isHistoryOpen)}
            className="flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-gray-50 text-[#2F4156] font-black text-xs rounded-full shadow-sm border border-[#2F4156]/10 uppercase tracking-wider transition-all"
          >
            <History className="w-4 h-4" /> Reminder History
          </button>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT FORM */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white border border-[#2F4156]/10 rounded-[24px] p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-black text-[#2F4156] uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#567C8D]" /> Design Smart Reminder
            </h3>

            <div className="space-y-1.5 p-3 rounded-2xl bg-[#F5EFEB]/30 border border-[#2F4156]/10">
              <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Natural Language Parser</label>
              <div className="flex gap-1.5">
                <input
                  type="text"
                  placeholder='e.g., "Remind me to study AI at 7 PM"'
                  value={naturalLanguageInput}
                  onChange={(e) => setNaturalLanguageInput(e.target.value)}
                  className="flex-1 bg-white border border-gray-200 py-2 px-3 rounded-xl text-xs focus:outline-none text-[#2F4156]"
                />
                <button
                  onClick={handleNlpParse}
                  className="bg-[#2F4156] text-white p-2.5 rounded-xl hover:bg-[#1E293B] transition-all shadow-sm flex items-center justify-center shrink-0"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <form onSubmit={handleCreateReminder} className="space-y-4 pt-1 text-xs">
              <div className="space-y-1">
                <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Reminder Title</label>
                <input
                  type="text"
                  placeholder="e.g. Review final reports"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-white border border-gray-200 py-2.5 px-4 rounded-xl text-xs focus:outline-none text-[#2F4156]"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full bg-white border border-gray-200 py-2.5 px-3 rounded-xl text-xs focus:outline-none text-[#2F4156]"
                >
                  {['Study', 'Work', 'Health', 'Fitness', 'Personal', 'Finance', 'Shopping', 'Birthday', 'Goals', 'Habit'].map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Date</label>
                  <input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full bg-white border border-gray-200 py-2 px-2 rounded-xl text-xs focus:outline-none text-[#2F4156]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Time</label>
                  <input
                    type="time"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full bg-white border border-gray-200 py-2 px-2 rounded-xl text-xs focus:outline-none text-[#2F4156]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Repeat</label>
                  <select
                    value={newRepeat}
                    onChange={(e) => setNewRepeat(e.target.value)}
                    className="w-full bg-white border border-gray-200 py-2 px-2 rounded-xl text-xs focus:outline-none text-[#2F4156]"
                  >
                    <option value="Never">Never</option>
                    <option value="Daily">Daily</option>
                    <option value="Weekly">Weekly</option>
                    <option value="Monthly">Monthly</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Priority</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as any)}
                    className="w-full bg-white border border-gray-200 py-2 px-2 rounded-xl text-xs focus:outline-none text-[#2F4156]"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Notification Delivery</label>
                <select
                  value={newStyle}
                  onChange={(e) => setNewStyle(e.target.value as any)}
                  className="w-full bg-white border border-gray-200 py-2.5 px-3 rounded-xl text-xs focus:outline-none text-[#2F4156]"
                >
                  <option value="Gentle">Gentle</option>
                  <option value="Normal">Normal</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Card Theme Tint</label>
                <div className="flex gap-2">
                  {['#2F4156', '#567C8D', '#C8D9E6', '#888888', '#E2E8F0'].map(col => (
                    <button
                      key={col}
                      type="button"
                      onClick={() => setNewColor(col)}
                      className={cn(
                        "w-6 h-6 rounded-full border-2 transition-transform",
                        newColor === col ? "border-[#2F4156] scale-110" : "border-transparent"
                      )}
                      style={{ backgroundColor: col }}
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Additional Notes</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Bring printed documents..."
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full bg-white border border-gray-200 py-2 px-3 rounded-xl text-xs focus:outline-none text-[#2F4156] resize-none"
                />
              </div>

              <div className="flex justify-between items-center py-1">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                  <Volume2 className="w-3.5 h-3.5" /> Voice Alert
                </span>
                <input
                  type="checkbox"
                  checked={enableVoice}
                  onChange={(e) => setEnableVoice(e.target.checked)}
                  className="accent-[#2F4156] cursor-pointer"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#2F4156] hover:bg-[#1E293B] text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-md flex items-center justify-center gap-2 transition-all mt-4 cursor-pointer"
              >
                <Bell className="w-4 h-4 fill-white" /> Schedule Reminder
              </button>
            </form>
          </div>
        </div>

        {/* FEED */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white border border-[#2F4156]/10 rounded-[24px] p-5 shadow-sm space-y-4">
            
            <div className="flex bg-gray-100 p-1 rounded-xl border border-gray-200 overflow-x-auto scrollbar-none">
              {['All', 'Today', 'Tomorrow', 'Upcoming', 'Completed', 'Overdue'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setFilterTab(tab as any)}
                  className={cn(
                    "px-4 py-2 rounded-lg text-[10px] font-black transition-all uppercase tracking-wider shrink-0",
                    filterTab === tab ? "bg-[#2F4156] text-white" : "text-gray-400 hover:text-[#2F4156]"
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              <div className="sm:col-span-6 relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search scheduled reminders..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white border border-gray-200 py-2 pl-9 pr-4 rounded-xl text-xs focus:outline-none text-[#2F4156]"
                />
              </div>

              <div className="sm:col-span-3">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full bg-white border border-gray-200 py-2 px-2.5 rounded-xl text-xs focus:outline-none text-[#2F4156]"
                >
                  <option value="All">All Categories</option>
                  {['Study', 'Work', 'Health', 'Fitness', 'Personal', 'Finance', 'Shopping', 'Birthday', 'Goals', 'Habit'].map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-3">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="w-full bg-white border border-gray-200 py-2 px-2.5 rounded-xl text-xs focus:outline-none text-[#2F4156]"
                >
                  <option value="Smart Priority">Smart Priority</option>
                  <option value="Time">Time</option>
                  <option value="Newest">Newest</option>
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <AnimatePresence>
              {filteredReminders.map((rem) => {
                return (
                  <motion.div
                    key={rem.id}
                    layout
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    className={cn(
                      "p-5 rounded-2xl border transition-all duration-300 relative overflow-hidden group shadow-sm flex flex-col gap-3",
                      rem.completed 
                        ? "bg-gray-50/50 border-transparent opacity-60" 
                        : "bg-white border-gray-100 hover:border-[#2F4156] hover:scale-101"
                    )}
                  >
                    <div 
                      className="absolute left-0 top-0 bottom-0 w-1.5"
                      style={{ backgroundColor: rem.color }}
                    />

                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div 
                          className="w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0 border shadow-inner"
                          style={{ backgroundColor: `${rem.color}15`, borderColor: `${rem.color}30` }}
                        >
                          {rem.categoryIcon}
                        </div>
                        
                        <div className="space-y-1">
                          <h4 className={cn(
                            "text-sm font-black text-[#2F4156]",
                            rem.completed && "line-through text-gray-400"
                          )}>
                            {rem.title}
                          </h4>
                          
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-[9px] bg-gray-100 text-gray-500 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                              {rem.category}
                            </span>
                            <span className="text-[10px] text-gray-400 font-extrabold flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5 text-[#567C8D]" /> {rem.date} @ {rem.time}
                            </span>
                            {rem.countdown && (
                              <span className="text-[10px] text-[#2F4156] font-black bg-[#F5EFEB] px-2 py-0.5 rounded-full">
                                {rem.countdown}
                              </span>
                            )}
                            {rem.streak && (
                              <span className="text-[10px] text-orange-500 font-black bg-orange-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                                🔥 {rem.streak} Day Streak
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => toggleComplete(rem.id)}
                          className={cn(
                            "p-2 rounded-xl border transition-all cursor-pointer",
                            rem.completed 
                              ? "bg-[#2F4156] border-transparent text-white" 
                              : "border-gray-100 hover:bg-gray-50 text-[#2F4156]"
                          )}
                          title="Complete"
                        >
                          <Check className="w-4 h-4 font-bold" />
                        </button>
                        
                        {!rem.completed && (
                          <button
                            onClick={() => snoozeReminder(rem.id)}
                            className="p-2 border border-gray-100 rounded-xl hover:bg-gray-50 text-amber-500 transition-all cursor-pointer"
                            title="Snooze 15 mins"
                          >
                            <Clock className="w-4 h-4" />
                          </button>
                        )}

                        <button
                          onClick={() => deleteReminder(rem.id)}
                          className="p-2 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-xl transition-all cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {rem.aiSuggestion && !rem.completed && (
                      <div className="mt-1 p-3 bg-[#F5EFEB]/20 border border-[#2F4156]/10 rounded-xl flex items-start gap-2 text-[11px]">
                        <span className="p-0.5 bg-[#F5EFEB] text-[#2F4156] rounded-md shrink-0">✨</span>
                        <div>
                          <span className="font-extrabold text-[#2F4156] block uppercase tracking-wider text-[9px]">AI Suggestion:</span>
                          <p className="text-gray-500 mt-0.5 font-semibold">{rem.aiSuggestion}</p>
                        </div>
                      </div>
                    )}

                    {rem.notes && (
                      <p className="text-[11px] text-gray-400 font-medium italic border-t border-dashed border-gray-100 pt-2 mt-1">
                        Notes: {rem.notes}
                      </p>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {filteredReminders.length === 0 && (
              <div className="bg-white border border-[#2F4156]/10 rounded-[24px] p-12 text-center text-gray-400 space-y-2">
                <Bell className="w-12 h-12 mx-auto text-gray-200" />
                <h4 className="font-black text-[#2F4156]">All Clear</h4>
                <p className="text-xs">No active alerts match your search or current active filters.</p>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* BOTTOM SECTION: ANALYTICS */}
      <div className="border-t border-gray-100 pt-6">
        <h3 className="text-xs font-black text-[#2F4156] uppercase tracking-widest mb-4 flex items-center gap-2">
          <Activity className="w-4.5 h-4.5 text-[#567C8D]" /> Alerts Analytics
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { label: 'Completed Today', val: '8 alerts', change: '+2 from yesterday', color: 'text-emerald-600', valColor: 'text-[#2F4156]', percentage: 80 },
            { label: 'Pending Queue', val: '4 scheduled', change: 'Consistent load', color: 'text-amber-500', valColor: 'text-amber-600', percentage: 40 },
            { label: 'Upcoming Tomorrow', val: '7 alerts', change: 'Moderate workload', color: 'text-blue-500', valColor: 'text-blue-600', percentage: 70 },
            { label: 'Missed / Overdue', val: '1 alert', change: '-1 from last week', color: 'text-red-500', valColor: 'text-red-500', percentage: 10 },
            { label: 'Completion Rate', val: '89%', change: '+12% increase', color: 'text-emerald-500', valColor: 'text-[#2F4156]', percentage: 89 },
          ].map((stat, idx) => (
            <div key={idx} className="bg-white border border-[#2F4156]/10 p-4 rounded-2xl shadow-sm flex flex-col justify-between min-h-[120px] transition-all hover:scale-102">
              <div>
                <span className="block text-[9px] text-gray-400 font-black uppercase tracking-wider leading-none">{stat.label}</span>
                <span className={cn("block text-base font-black mt-1.5", stat.valColor)}>{stat.val}</span>
              </div>
              
              <div className="space-y-1.5 pt-2">
                <div className="w-full bg-gray-100 h-1 rounded-full overflow-hidden">
                  <div className="bg-[#2F4156] h-full" style={{ width: `${stat.percentage}%` }} />
                </div>
                <span className={cn("text-[9px] font-bold block", stat.color)}>{stat.change}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
