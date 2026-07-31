import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useData } from '../context/DataContext';
import { useProfile } from '../context/ProfileContext';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Trash2, 
  Check, 
  Sparkles, 
  Filter, 
  CheckSquare, 
  Clock, 
  Coffee, 
  Loader2,
  CalendarDays,
  X
} from 'lucide-react';

interface CalendarViewProps {
  theme: 'light' | 'dark' | 'contrast';
  userName?: string;
  userGender?: 'male' | 'female';
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// Helper to format Date to YYYY-MM-DD
function formatDateToYYYYMMDD(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export default function CalendarView({ theme, userName = "Deepika S" }: CalendarViewProps) {
  const { tasks, addTask, completeTask, deleteTask } = useData();
  const { profile } = useProfile();
  
  // Real User Name State
  const [realUserName, setRealUserName] = useState<string>(profile.name || userName || 'User');

  // Fetch real user name from backend API endpoint
  useEffect(() => {
    let isMounted = true;
    fetch('/api/user/profile')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (isMounted && data && data.full_name) {
          setRealUserName(data.full_name);
        }
      })
      .catch(() => {
        if (isMounted && profile.name) {
          setRealUserName(profile.name);
        }
      });
    return () => { isMounted = false; };
  }, [profile.name]);

  // Main Calendar State
  const [selectedDate, setSelectedDate] = useState<Date>(() => new Date(2026, 5, 22)); // June 22, 2026
  const [viewSegment, setViewSegment] = useState<'Month' | 'Week' | 'Day'>('Month');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');

  // Year & Month Jump Picker Dropdown
  const [showPicker, setShowPicker] = useState(false);
  const [pickerYear, setPickerYear] = useState<number>(selectedDate.getFullYear());
  const [pickerMonth, setPickerMonth] = useState<number>(selectedDate.getMonth());

  // API Backend Events Loading State
  const [isLoadingEvents, setIsLoadingEvents] = useState(false);
  const [apiEvents, setApiEvents] = useState<any[]>([]);

  // Toast Notification
  const [notif, setNotif] = useState<string | null>(null);
  const triggerNotif = (msg: string) => {
    setNotif(msg);
    setTimeout(() => setNotif(null), 3000);
  };

  // Form State for Adding Task
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskCategory, setNewTaskCategory] = useState<'Study' | 'Work' | 'Exams' | 'Personal' | 'Break'>('Study');
  const [newTaskTime, setNewTaskTime] = useState('09:00 AM - 10:00 AM');

  // Google Calendar Modal State
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [googleTitle, setGoogleTitle] = useState('');
  const [googleCategory, setGoogleCategory] = useState<'Study' | 'Work' | 'Exams' | 'Personal' | 'Break'>('Study');
  const [googleDate, setGoogleDate] = useState('');
  const [googleTime, setGoogleTime] = useState('09:00 AM');
  const [googleDescription, setGoogleDescription] = useState('');

  const handleSaveGoogleEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!googleTitle.trim()) return;
    addTask({
      title: googleTitle,
      priority: 'Medium',
      dueIn: 'Scheduled',
      description: googleDescription,
      dueDate: googleDate || selectedDateStr,
      dueTime: googleTime,
      category: googleCategory
    });
    setGoogleTitle('');
    setGoogleDescription('');
    setShowGoogleModal(false);
    triggerNotif(`Successfully added event: "${googleTitle}" 📅`);
  };

  const selectedDateStr = useMemo(() => formatDateToYYYYMMDD(selectedDate), [selectedDate]);

  // Fetch backend calendar events
  useEffect(() => {
    let isMounted = true;
    setIsLoadingEvents(true);
    
    const params = new URLSearchParams({
      view: viewSegment.toLowerCase(),
      date: selectedDateStr,
      user_id: 'user_default'
    });

    fetch(`/api/calendar/events?${params.toString()}`)
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (isMounted) {
          if (data && Array.isArray(data.events)) {
            setApiEvents(data.events);
          }
          setIsLoadingEvents(false);
        }
      })
      .catch(() => {
        if (isMounted) setIsLoadingEvents(false);
      });

    return () => { isMounted = false; };
  }, [viewSegment, selectedDateStr]);

  // Merge tasks from DataContext and API events
  const allMergedTasks = useMemo(() => {
    const map = new Map<string, any>();
    
    tasks.forEach(t => {
      map.set(t.id, t);
    });

    apiEvents.forEach(e => {
      if (!map.has(e.id)) {
        map.set(e.id, {
          id: e.id,
          title: e.title,
          priority: 'Medium',
          dueIn: e.dueDate,
          description: '',
          dueDate: e.dueDate,
          dueTime: e.dueTime || '09:00 AM',
          category: e.category || 'Work',
          completed: e.completed || false
        });
      }
    });

    return Array.from(map.values());
  }, [tasks, apiEvents]);

  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startingOffset = new Date(year, month, 1).getDay();

  // Week range dates (Sunday through Saturday)
  const weekDays = useMemo(() => {
    const currentDayOfWeek = selectedDate.getDay();
    const sunday = new Date(selectedDate);
    sunday.setDate(selectedDate.getDate() - currentDayOfWeek);
    
    const days: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(sunday);
      d.setDate(sunday.getDate() + i);
      days.push(d);
    }
    return days;
  }, [selectedDate]);

  // Calculate stats for each day string "YYYY-MM-DD"
  const dayStatsMap = useMemo(() => {
    const stats: Record<string, { total: number; completed: number }> = {};
    allMergedTasks.forEach(t => {
      if (t.dueDate) {
        if (!stats[t.dueDate]) {
          stats[t.dueDate] = { total: 0, completed: 0 };
        }
        stats[t.dueDate].total += 1;
        if (t.completed) {
          stats[t.dueDate].completed += 1;
        }
      }
    });
    return stats;
  }, [allMergedTasks]);

  // Filter tasks for selected date
  const filteredTasksForSelectedDate = useMemo(() => {
    return allMergedTasks.filter(t => {
      const matchDate = t.dueDate === selectedDateStr;
      const matchCategory = categoryFilter === 'All' || t.category === categoryFilter;
      return matchDate && matchCategory;
    });
  }, [allMergedTasks, selectedDateStr, categoryFilter]);

  const handlePrev = () => {
    const newD = new Date(selectedDate);
    if (viewSegment === 'Month') {
      newD.setMonth(newD.getMonth() - 1);
    } else if (viewSegment === 'Week') {
      newD.setDate(newD.getDate() - 7);
    } else {
      newD.setDate(newD.getDate() - 1);
    }
    setSelectedDate(newD);
  };

  const handleNext = () => {
    const newD = new Date(selectedDate);
    if (viewSegment === 'Month') {
      newD.setMonth(newD.getMonth() + 1);
    } else if (viewSegment === 'Week') {
      newD.setDate(newD.getDate() + 7);
    } else {
      newD.setDate(newD.getDate() + 1);
    }
    setSelectedDate(newD);
  };

  const handleToday = () => {
    setSelectedDate(new Date(2026, 5, 22));
    triggerNotif("Jumped to Today!");
  };

  const handleApplyYearMonthPicker = () => {
    const newD = new Date(pickerYear, pickerMonth, Math.min(selectedDate.getDate(), 28));
    setSelectedDate(newD);
    setShowPicker(false);
    triggerNotif(`Navigated to ${MONTH_NAMES[pickerMonth]} ${pickerYear}`);
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    addTask({
      title: newTaskTitle,
      priority: 'Medium',
      dueIn: `${MONTH_NAMES[month]} ${selectedDate.getDate()}`,
      description: '',
      dueDate: selectedDateStr,
      dueTime: newTaskTime.split(' - ')[0] || '09:00 AM',
      category: newTaskCategory,
    });

    setNewTaskTitle('');
    triggerNotif(`Added task: "${newTaskTitle}"`);
  };

  const handleToggleTask = (id: string) => {
    completeTask(id);
    const t = allMergedTasks.find(item => item.id === id);
    if (t) {
      const nextState = !t.completed;
      triggerNotif(nextState ? "Task completed!" : "Task set to pending.");
    }
  };

  const handleDeleteTask = (id: string) => {
    deleteTask(id);
    triggerNotif("Task removed.");
  };

  // Category Overview Data
  const categoryData = [
    { name: 'Study', value: 40, color: '#2F4156' },
    { name: 'Work', value: 20, color: '#567C8D' },
    { name: 'Exams', value: 20, color: '#C8D9E6' },
    { name: 'Personal', value: 10, color: '#F5EFEB' },
    { name: 'Break', value: 10, color: '#888888' }
  ];

  // Summary Metrics
  const summaryMetrics = useMemo(() => {
    const totalCompleted = allMergedTasks.filter(t => t.completed).length;
    return {
      completed: totalCompleted,
      focusTime: `${(totalCompleted * 1.5).toFixed(1)} hrs`
    };
  }, [allMergedTasks]);

  // Clean Minimalist Status Indicator
  const renderStatusIndicator = (completedCount: number, isSelected: boolean) => {
    if (completedCount === 0) {
      return (
        <div className="flex items-center justify-center">
          <div className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white/40' : 'bg-[#567C8D]/20'}`} />
        </div>
      );
    }
    return (
      <div className="flex items-center justify-center gap-1">
        {Array.from({ length: Math.min(completedCount, 3) }).map((_, i) => (
          <div 
            key={i} 
            className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-[#567C8D]'}`} 
          />
        ))}
      </div>
    );
  };

  const headerDateLabel = useMemo(() => {
    if (viewSegment === 'Month') {
      return `${MONTH_NAMES[month]} ${year}`;
    } else if (viewSegment === 'Week') {
      const start = weekDays[0];
      const end = weekDays[6];
      if (start.getMonth() === end.getMonth()) {
        return `${MONTH_NAMES[start.getMonth()].substring(0, 3)} ${start.getDate()} – ${end.getDate()}, ${start.getFullYear()}`;
      }
      return `${MONTH_NAMES[start.getMonth()].substring(0, 3)} ${start.getDate()} – ${MONTH_NAMES[end.getMonth()].substring(0, 3)} ${end.getDate()}, ${end.getFullYear()}`;
    } else {
      return `${MONTH_NAMES[month]} ${selectedDate.getDate()}, ${year}`;
    }
  }, [viewSegment, month, year, weekDays, selectedDate]);

  return (
    <div className="space-y-6 max-w-[1720px] mx-auto pb-12 font-sans select-none animate-fade-in text-gray-800">
      
      {/* 1. Header Block with Premium Palette */}
      <div className="relative bg-gradient-to-r from-[#F5EFEB] via-white to-[#C8D9E6]/30 p-6 rounded-[24px] border border-[#2F4156]/10 shadow-sm overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1 relative z-10">
          <span className="text-xs font-bold text-[#567C8D] uppercase tracking-widest flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-[#567C8D]" /> PREMIUM DIGITAL CALENDAR
          </span>
          <h2 className="text-3xl font-extrabold font-display text-[#2F4156] tracking-tight">
            Interactive Calendar — Taskaroa
          </h2>
          <p className="text-gray-500 text-sm">
            Schedule tasks, deadlines, and meetings for <span className="font-bold text-[#2F4156]">{realUserName}</span>. Keep track of your structured scheduling.
          </p>
        </div>

        {/* Global Alert Toast */}
        <AnimatePresence>
          {notif && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="bg-[#2F4156] text-white py-2 px-4 rounded-xl shadow-md flex items-center gap-2 text-xs font-bold relative z-20"
            >
              <Sparkles className="w-4 h-4 text-[#C8D9E6]" />
              {notif}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 2. Toolbar Options Row */}
      <div className="bg-white p-4 rounded-[24px] border border-[#2F4156]/10 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4 relative z-30">
        <div className="flex items-center gap-3 relative">
          <button 
            onClick={handlePrev}
            title="Previous"
            className="p-2 hover:bg-[#F5EFEB] rounded-xl text-gray-600 hover:text-[#2F4156] transition-all border border-gray-100 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          <div className="relative">
            <button 
              onClick={() => {
                setPickerYear(year);
                setPickerMonth(month);
                setShowPicker(!showPicker);
              }}
              className="font-bold text-sm text-[#2F4156] font-display hover:bg-[#F5EFEB] px-3 py-1.5 rounded-xl transition-all border border-transparent hover:border-[#2F4156]/20 flex items-center gap-1.5 cursor-pointer"
            >
              <CalendarDays className="w-4 h-4 text-[#567C8D]" />
              {headerDateLabel}
            </button>

            {/* Quick Year/Month Picker Popover */}
            {showPicker && (
              <div className="absolute top-full left-0 mt-2 bg-white rounded-2xl border border-[#2F4156]/20 shadow-xl p-4 w-64 z-50 space-y-3">
                <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                  <span className="text-xs font-extrabold text-[#2F4156]">Jump to Date</span>
                  <button onClick={() => setShowPicker(false)} className="text-gray-400 hover:text-gray-600">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <label className="text-[10px] text-gray-400 font-bold uppercase block mb-1">Year</label>
                    <input 
                      type="number"
                      value={pickerYear}
                      onChange={e => setPickerYear(parseInt(e.target.value, 10) || year)}
                      className="w-full py-1.5 px-2.5 border border-gray-200 rounded-xl outline-none font-bold text-[#2F4156]"
                      min="2000"
                      max="2100"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-gray-400 font-bold uppercase block mb-1">Month</label>
                    <select
                      value={pickerMonth}
                      onChange={e => setPickerMonth(parseInt(e.target.value, 10))}
                      className="w-full py-1.5 px-2.5 border border-gray-200 rounded-xl outline-none font-bold text-[#2F4156] bg-white"
                    >
                      {MONTH_NAMES.map((m, idx) => (
                        <option key={m} value={idx}>{m}</option>
                      ))}
                    </select>
                  </div>

                  <button
                    onClick={handleApplyYearMonthPicker}
                    className="w-full py-2 bg-[#2F4156] text-white font-bold rounded-xl text-xs hover:bg-[#1E293B] transition-all cursor-pointer mt-2"
                  >
                    Apply Navigation
                  </button>
                </div>
              </div>
            )}
          </div>

          <button 
            onClick={handleNext}
            title="Next"
            className="p-2 hover:bg-[#F5EFEB] rounded-xl text-gray-600 hover:text-[#2F4156] transition-all border border-gray-100 cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <button 
            onClick={handleToday}
            className="py-1.5 px-3 bg-[#F5EFEB] hover:bg-[#C8D9E6]/50 text-xs font-bold text-[#2F4156] rounded-xl transition-all cursor-pointer"
          >
            Today
          </button>

          {isLoadingEvents && (
            <span className="flex items-center gap-1 text-[11px] text-[#2F4156] font-medium animate-pulse">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-[#2F4156]" /> Loading...
            </span>
          )}
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          {/* View Segment Switcher (Month / Week / Day) */}
          <div className="flex bg-gray-100 p-1 rounded-xl">
            {(['Month', 'Week', 'Day'] as const).map(segment => (
              <button
                key={segment}
                onClick={() => setViewSegment(segment)}
                className={`py-1.5 px-4 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  viewSegment === segment 
                    ? 'bg-[#2F4156] text-white shadow-xs' 
                    : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                {segment}
              </button>
            ))}
          </div>

          {/* Filter Dropdown */}
          <div className="flex items-center gap-1.5 border border-gray-100 p-1.5 rounded-xl bg-gray-50/50">
            <Filter className="w-3.5 h-3.5 text-[#2F4156]" />
            <select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              className="text-xs font-bold text-[#2F4156] bg-transparent outline-none cursor-pointer"
            >
              <option value="All">All Categories</option>
              <option value="Study">Study 📚</option>
              <option value="Work">Work 💻</option>
              <option value="Exams">Exams 📝</option>
              <option value="Personal">Personal 🌱</option>
              <option value="Break">Break ☕</option>
            </select>
          </div>

          <button
            onClick={() => {
              setGoogleDate(selectedDateStr);
              setShowGoogleModal(true);
            }}
            className="py-2 px-4 bg-[#2F4156] hover:bg-[#1E293B] text-white text-xs font-extrabold rounded-xl transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5px]" /> Add Event
          </button>
        </div>
      </div>

      {/* 3. Main 3-Column Grid Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        
        {/* LEFT & CENTER: Calendar View (xl:col-span-8) */}
        <div className="xl:col-span-8 space-y-6">
          <div className="bg-white rounded-[24px] border border-[#2F4156]/10 shadow-sm p-5 space-y-4 relative overflow-hidden">
            
            {/* MONTH VIEW */}
            {viewSegment === 'Month' && (
              <div>
                {/* Weekday Labels */}
                <div className="grid grid-cols-7 gap-2.5 text-center font-black text-xs text-[#2F4156]/70 border-b border-gray-100 pb-2 mb-2">
                  {WEEKDAYS.map(day => (
                    <div key={day} className="py-1">{day.toUpperCase()}</div>
                  ))}
                </div>

                {/* Days Grid */}
                <div className="grid grid-cols-7 gap-2.5">
                  {/* Preceding Padding */}
                  {Array.from({ length: startingOffset }).map((_, idx) => (
                    <div key={`empty-${idx}`} className="bg-gray-50/20 aspect-square rounded-2xl border border-dashed border-gray-100/50" />
                  ))}

                  {/* Days of Month */}
                  {Array.from({ length: daysInMonth }).map((_, idx) => {
                    const dayNum = idx + 1;
                    const cellDate = new Date(year, month, dayNum);
                    const cellDateStr = formatDateToYYYYMMDD(cellDate);
                    const isSelected = selectedDateStr === cellDateStr;
                    const stats = dayStatsMap[cellDateStr] || { total: 0, completed: 0 };
                    const hasTasks = stats.total > 0;

                    return (
                      <button
                        key={`day-${dayNum}`}
                        onClick={() => setSelectedDate(cellDate)}
                        className={`aspect-square rounded-2xl p-2.5 transition-all relative flex flex-col justify-between overflow-hidden border group cursor-pointer ${
                          isSelected 
                            ? 'bg-[#2F4156] text-white border-transparent shadow-lg shadow-[#2F4156]/20 scale-102 z-10' 
                            : 'bg-white border-gray-100 hover:border-[#C8D9E6] hover:bg-[#F5EFEB]/20 shadow-xs'
                        }`}
                      >
                        <span className={`text-xs font-black self-start ${isSelected ? 'text-white' : 'text-gray-500'}`}>
                          {dayNum}
                        </span>

                        <div className="flex-1 flex items-center justify-center relative mt-1">
                          {hasTasks && (
                            <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-white' : 'bg-[#567C8D]'}`} />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* WEEK VIEW */}
            {viewSegment === 'Week' && (
              <div className="space-y-4">
                <div className="grid grid-cols-7 gap-3">
                  {weekDays.map((d, idx) => {
                    const dStr = formatDateToYYYYMMDD(d);
                    const isSelected = selectedDateStr === dStr;
                    const stats = dayStatsMap[dStr] || { total: 0, completed: 0 };
                    const dayTasks = allMergedTasks.filter(t => t.dueDate === dStr);

                    return (
                      <div
                        key={dStr}
                        onClick={() => setSelectedDate(d)}
                        className={`rounded-2xl p-3 border transition-all cursor-pointer flex flex-col min-h-[320px] ${
                          isSelected 
                            ? 'bg-[#2F4156]/5 border-[#2F4156] shadow-sm' 
                            : 'bg-white border-gray-100 hover:border-[#C8D9E6]'
                        }`}
                      >
                        <div className={`p-2 rounded-xl text-center mb-3 ${isSelected ? 'bg-[#2F4156] text-white' : 'bg-gray-50'}`}>
                          <span className="text-[10px] font-bold block uppercase">{WEEKDAYS[idx]}</span>
                          <span className="text-sm font-black">{MONTH_NAMES[d.getMonth()].substring(0, 3)} {d.getDate()}</span>
                        </div>

                        <div className="flex justify-center my-2">
                          {renderStatusIndicator(stats.completed, isSelected)}
                        </div>

                        <div className="space-y-2 flex-1 overflow-y-auto max-h-[200px] mt-2 custom-scrollbar">
                          {dayTasks.length === 0 ? (
                            <p className="text-[10px] text-gray-300 text-center italic mt-4">No events</p>
                          ) : (
                            dayTasks.map(t => (
                              <div key={t.id} className="bg-white p-2 rounded-xl border border-gray-100 shadow-2xs text-[10px]">
                                <p className={`font-bold truncate ${t.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                                  {t.title}
                                </p>
                                <span className="text-[8px] text-gray-400 block">{t.dueTime || '09:00 AM'}</span>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* DAY VIEW */}
            {viewSegment === 'Day' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between bg-[#F5EFEB] p-4 rounded-2xl border border-[#2F4156]/10">
                  <div>
                    <h3 className="text-lg font-black text-[#2F4156]">{MONTH_NAMES[month]} {selectedDate.getDate()}, {year}</h3>
                    <p className="text-xs text-gray-500">Timeline Schedule & Hourly Agenda</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {renderStatusIndicator(dayStatsMap[selectedDateStr]?.completed || 0, false)}
                    <span className="text-xs font-black text-[#2F4156] bg-white px-3 py-1 rounded-xl shadow-2xs">
                      {dayStatsMap[selectedDateStr]?.completed || 0} Completed
                    </span>
                  </div>
                </div>

                {/* Hourly Timeline */}
                <div className="space-y-2 max-h-[500px] overflow-y-auto custom-scrollbar pr-2">
                  {['08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM', '06:00 PM', '07:00 PM'].map(timeSlot => {
                    const slotTasks = filteredTasksForSelectedDate.filter(t => t.dueTime === timeSlot || t.dueTime?.startsWith(timeSlot.split(':')[0]));
                    return (
                      <div key={timeSlot} className="flex gap-4 items-start p-3 rounded-2xl border border-gray-100 bg-gray-50/30 hover:bg-white hover:border-[#C8D9E6] transition-all">
                        <span className="text-xs font-bold text-gray-400 w-20 shrink-0 pt-1">{timeSlot}</span>
                        <div className="flex-1 space-y-2">
                          {slotTasks.length === 0 ? (
                            <span className="text-xs text-gray-300 italic">Available focus block</span>
                          ) : (
                            slotTasks.map(t => (
                              <div key={t.id} className="bg-white p-3 rounded-xl border border-gray-200 flex justify-between items-center shadow-xs">
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => handleToggleTask(t.id)}
                                    className={`w-4 h-4 rounded-full border flex items-center justify-center ${t.completed ? 'bg-[#567C8D] text-white' : 'border-gray-300'}`}
                                  >
                                    {t.completed && <Check className="w-3 h-3 stroke-[3px]" />}
                                  </button>
                                  <span className={`text-xs font-bold ${t.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>{t.title}</span>
                                </div>
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#F5EFEB] text-[#2F4156]">{t.category}</span>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

          </div>
        </div>

        {/* RIGHT COLUMN: Daily Schedule Panel & Charts (xl:col-span-4) */}
        <div className="xl:col-span-4 space-y-6">
          
          {/* Daily Schedule Card */}
          <div className="bg-white rounded-[24px] border border-[#2F4156]/10 shadow-sm p-5 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-gray-100">
              <div>
                <h3 className="font-extrabold text-[#2F4156] font-display text-sm uppercase">Daily Schedule</h3>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">
                  {MONTH_NAMES[month]} {selectedDate.getDate()}, {year}
                </p>
              </div>
              <span className="text-[10px] font-bold bg-[#F5EFEB] text-[#2F4156] py-0.5 px-2.5 rounded-full border border-[#2F4156]/10">
                {dayStatsMap[selectedDateStr]?.completed || 0} completed
              </span>
            </div>

            {/* Tasks list */}
            <div className="space-y-3 max-h-[220px] overflow-y-auto custom-scrollbar">
              {filteredTasksForSelectedDate.length === 0 ? (
                <div className="text-center py-8">
                  <Coffee className="w-8 h-8 text-gray-300 mx-auto mb-1.5" />
                  <p className="text-xs text-gray-400 italic">No tasks or events scheduled today.</p>
                  <p className="text-[10px] text-gray-300">Add a task below to start tracking!</p>
                </div>
              ) : (
                filteredTasksForSelectedDate.map(task => (
                  <div 
                    key={task.id}
                    className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:border-[#C8D9E6] hover:bg-[#F5EFEB]/10 transition-all text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => handleToggleTask(task.id)}
                        className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all cursor-pointer ${
                          task.completed 
                            ? 'bg-[#567C8D] border-transparent text-white shadow-xs' 
                            : 'border-gray-300 hover:border-[#2F4156]'
                        }`}
                      >
                        {task.completed && <Check className="w-3.5 h-3.5 stroke-[2.5px]" />}
                      </button>

                      <div className="space-y-0.5">
                        <p className={`font-bold ${task.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                          {task.title}
                        </p>
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] text-gray-400 font-semibold">{task.dueTime || 'All Day'}</span>
                          <span className={`text-[8px] font-bold px-1.5 rounded-md ${
                            task.category === 'Study' ? 'bg-[#2F4156]/10 text-[#2F4156]' :
                            task.category === 'Work' ? 'bg-[#567C8D]/10 text-[#567C8D]' :
                            task.category === 'Exams' ? 'bg-[#C8D9E6] text-slate-700' :
                            task.category === 'Personal' ? 'bg-[#F5EFEB] text-amber-900' :
                            'bg-gray-100 text-gray-600'
                          }`}>
                            {task.category || 'Other'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button 
                      onClick={() => handleDeleteTask(task.id)}
                      className="text-gray-300 hover:text-red-500 p-1 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Add Task Quick Trigger Form */}
            <form onSubmit={handleAddTask} className="pt-2 border-t border-gray-100 space-y-2.5">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Insert new task title..."
                  value={newTaskTitle}
                  onChange={e => setNewTaskTitle(e.target.value)}
                  className="flex-1 py-1.5 px-3 border border-gray-100 rounded-xl outline-none text-xs focus:border-[#2F4156] font-medium"
                  required
                />
                
                <select
                  value={newTaskCategory}
                  onChange={e => setNewTaskCategory(e.target.value as any)}
                  className="py-1.5 px-2 border border-gray-100 rounded-xl outline-none text-[10px] font-bold text-gray-500 bg-white"
                >
                  <option value="Study">Study 📚</option>
                  <option value="Work">Work 💻</option>
                  <option value="Exams">Exams 📝</option>
                  <option value="Personal">Personal 🌱</option>
                  <option value="Break">Break ☕</option>
                </select>

                <button
                  type="submit"
                  className="p-1.5 bg-[#2F4156] hover:bg-[#1E293B] text-white rounded-xl transition-all shadow-xs flex items-center justify-center shrink-0 cursor-pointer"
                >
                  <Plus className="w-4.5 h-4.5 stroke-[2.5px]" />
                </button>
              </div>
            </form>
          </div>

          {/* Category Overview Chart */}
          <div className="bg-white rounded-[24px] border border-[#2F4156]/10 shadow-sm p-5 space-y-3">
            <h3 className="font-extrabold text-[#2F4156] font-display text-sm uppercase">Category Overview</h3>
            
            <div className="flex items-center justify-around gap-4 pt-1">
              <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
                <svg width="100%" height="100%" viewBox="0 0 100 100" className="transform -rotate-90">
                  <circle cx="50" cy="50" r="40" fill="transparent" stroke="#F1F5F9" strokeWidth="12" />
                  <circle cx="50" cy="50" r="40" fill="transparent" stroke="#2F4156" strokeWidth="12" strokeDasharray="100 151" strokeDashoffset="0" />
                  <circle cx="50" cy="50" r="40" fill="transparent" stroke="#567C8D" strokeWidth="12" strokeDasharray="50 201" strokeDashoffset="-100" />
                  <circle cx="50" cy="50" r="40" fill="transparent" stroke="#C8D9E6" strokeWidth="12" strokeDasharray="50 201" strokeDashoffset="-150" />
                  <circle cx="50" cy="50" r="40" fill="transparent" stroke="#F5EFEB" strokeWidth="12" strokeDasharray="25 226" strokeDashoffset="-200" />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-xs font-black text-[#2F4156]">100%</span>
                  <span className="text-[7px] text-gray-400 font-bold uppercase">Focus</span>
                </div>
              </div>

              <div className="space-y-1.5 text-xs max-w-[160px]">
                {categoryData.map((c, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span style={{ backgroundColor: c.color }} className="w-2.5 h-2.5 rounded-full shrink-0" />
                    <span className="font-bold text-gray-600 truncate flex-1 leading-none text-[11px]">{c.name}</span>
                    <span className="text-[10px] text-gray-400 font-extrabold shrink-0 bg-gray-50 px-1 py-0.2 rounded-md">{c.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Bottom Notification Bar for Scheduled Items */}
      <div className="bg-gradient-to-r from-[#2F4156] to-[#567C8D] text-white rounded-[24px] shadow-md p-5 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5 text-[#C8D9E6]" />
          </div>
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#C8D9E6]">Active Schedule Notice</span>
            <p className="text-xs font-bold text-white mt-0.5">
              {filteredTasksForSelectedDate.length > 0 
                ? `You have ${filteredTasksForSelectedDate.length} scheduled item(s) for ${MONTH_NAMES[month]} ${selectedDate.getDate()}. Stay focused!`
                : `No active tasks scheduled for today. Use 'Add Event' to plan your agenda.`}
            </p>
          </div>
        </div>
        <button
          onClick={() => {
            setGoogleDate(selectedDateStr);
            setShowGoogleModal(true);
          }}
          className="py-2 px-5 bg-white text-[#2F4156] hover:bg-[#F5EFEB] font-extrabold text-xs rounded-xl transition-all shadow-sm shrink-0 cursor-pointer"
        >
          + Quick Schedule Event
        </button>
      </div>

      {/* Google Calendar-Style Popup Modal */}
      <AnimatePresence>
        {showGoogleModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs animate-fade-in">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-[24px] border border-[#2F4156]/10 p-6 max-w-md w-full shadow-2xl relative text-left"
            >
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <h3 className="text-sm font-extrabold text-[#2F4156] font-display uppercase flex items-center gap-1.5">
                  📅 Google Calendar Event Planner
                </h3>
                <button 
                  onClick={() => setShowGoogleModal(false)}
                  className="text-gray-400 hover:text-gray-600 font-black text-sm"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSaveGoogleEvent} className="space-y-4 pt-3 text-xs">
                <div>
                  <label className="text-[10px] text-gray-400 font-bold uppercase block mb-1">Event Title</label>
                  <input
                    type="text"
                    value={googleTitle}
                    onChange={e => setGoogleTitle(e.target.value)}
                    placeholder="e.g. Advanced System Design Review"
                    className="w-full py-2 px-3 border border-gray-200 rounded-xl outline-none font-bold text-[#2F4156] focus:border-[#2F4156]"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] text-gray-400 font-bold uppercase block mb-1">Category</label>
                    <select
                      value={googleCategory}
                      onChange={e => setGoogleCategory(e.target.value as any)}
                      className="w-full py-2 px-3 border border-gray-200 rounded-xl outline-none font-bold text-[#2F4156] bg-white"
                    >
                      <option value="Study">Study 📚</option>
                      <option value="Work">Work 💻</option>
                      <option value="Exams">Exams 📝</option>
                      <option value="Personal">Personal 🌱</option>
                      <option value="Break">Break ☕</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] text-gray-400 font-bold uppercase block mb-1">Time Slot</label>
                    <input
                      type="text"
                      value={googleTime}
                      onChange={e => setGoogleTime(e.target.value)}
                      placeholder="09:00 AM"
                      className="w-full py-2 px-3 border border-gray-200 rounded-xl outline-none font-bold text-[#2F4156]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-gray-400 font-bold uppercase block mb-1">Date</label>
                  <input
                    type="date"
                    value={googleDate || selectedDateStr}
                    onChange={e => setGoogleDate(e.target.value)}
                    className="w-full py-2 px-3 border border-gray-200 rounded-xl outline-none font-bold text-[#2F4156]"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-gray-400 font-bold uppercase block mb-1">Description (Optional)</label>
                  <textarea
                    value={googleDescription}
                    onChange={e => setGoogleDescription(e.target.value)}
                    placeholder="Add meeting agenda or notes..."
                    rows={2}
                    className="w-full py-2 px-3 border border-gray-200 rounded-xl outline-none font-medium text-gray-700 resize-none"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowGoogleModal(false)}
                    className="py-2 px-4 rounded-xl text-gray-500 hover:bg-gray-100 font-bold transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="py-2 px-5 bg-[#2F4156] hover:bg-[#1E293B] text-white font-extrabold rounded-xl transition-all shadow-md"
                  >
                    Save Event
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
