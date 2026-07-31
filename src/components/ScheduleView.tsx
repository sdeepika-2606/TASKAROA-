import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  Plus, 
  Check, 
  Trash2, 
  AlertCircle, 
  Compass, 
  Zap, 
  Brain, 
  Sparkles, 
  ArrowRight,
  Bookmark,
  CheckCircle2,
  FileText,
  User,
  Coffee,
  RotateCcw
} from 'lucide-react';

interface TimeBlock {
  id: string;
  title: string;
  category: 'Study' | 'Work' | 'Personal' | 'Fitness' | 'Reading' | 'Exams' | 'Break';
  date: string;
  startTime: string;
  endTime: string;
  repeat: string;
  priority: 'High' | 'Medium' | 'Low';
  color: string;
  reminder: string;
  notes: string;
  completed: boolean;
}

interface ScheduleViewProps {
  theme: 'light' | 'dark' | 'contrast';
}

export default function ScheduleView({ theme }: ScheduleViewProps) {
  // Today's date is June 22, 2026 for consistency with Taskaroa calendar theme
  const [currentDate, setCurrentDate] = useState<Date>(new Date(2026, 5, 22)); // June 22, 2026
  
  // View Toggle (Timeline, List, Calendar)
  const [viewMode, setViewMode] = useState<'Timeline' | 'List' | 'Calendar'>('Timeline');
  
  // Active/selected block ID for highlighting (default to '2' - AI Project Work)
  const [activeBlockId, setActiveBlockId] = useState<string>('2');

  // Initial rich schedule dataset
  const [blocks, setBlocks] = useState<TimeBlock[]>([
    {
      id: '1',
      title: 'Solve 5 Leetcode Problems',
      category: 'Study',
      date: '2026-06-22',
      startTime: '08:00',
      endTime: '10:00',
      repeat: 'Daily',
      priority: 'High',
      color: '#3B82F6', // Blue
      reminder: '10 minutes before',
      notes: 'Focus on graphs and dynamic programming questions.',
      completed: true
    },
    {
      id: '2',
      title: 'AI Project Work Block',
      category: 'Work',
      date: '2026-06-22',
      startTime: '10:30',
      endTime: '12:30',
      repeat: 'None',
      priority: 'High',
      color: '#F472B6', // Pink
      reminder: '15 minutes before',
      notes: 'Flesh out the new horizontal desktop dashboard UI structures.',
      completed: false
    },
    {
      id: '3',
      title: 'Placement Assessment Prep',
      category: 'Exams',
      date: '2026-06-22',
      startTime: '14:00',
      endTime: '15:30',
      repeat: 'Weekly',
      priority: 'High',
      color: '#2F4156', // Dark Green
      reminder: '5 minutes before',
      notes: 'Mock aptitude tests on logical reasoning and verbal ability.',
      completed: false
    },
    {
      id: '4',
      title: 'Review Completed AI Code',
      category: 'Personal',
      date: '2026-06-22',
      startTime: '16:00',
      endTime: '17:00',
      repeat: 'None',
      priority: 'Medium',
      color: '#567C8D', // Mint
      reminder: 'At time of event',
      notes: 'Double check the compilation and linter output logs in AI Studio.',
      completed: true
    },
    {
      id: '5',
      title: 'Evening Jog & Aerobics',
      category: 'Fitness',
      date: '2026-06-22',
      startTime: '18:00',
      endTime: '19:00',
      repeat: 'Alternate Days',
      priority: 'Low',
      color: '#8B5CF6', // Purple
      reminder: '30 minutes before',
      notes: 'Outdoor trail run in the green park with music.',
      completed: false
    }
  ]);

  // Form State
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState<'Study' | 'Work' | 'Personal' | 'Fitness' | 'Reading' | 'Exams' | 'Break'>('Study');
  const [formDate, setFormDate] = useState('2026-06-22');
  const [formStartTime, setFormStartTime] = useState('11:00');
  const [formEndTime, setFormEndTime] = useState('12:30');
  const [formRepeat, setFormRepeat] = useState('None');
  const [formPriority, setFormPriority] = useState<'High' | 'Medium' | 'Low'>('Medium');
  const [formColor, setFormColor] = useState('#3B82F6');
  const [formReminder, setFormReminder] = useState('10 minutes before');
  const [formNotes, setFormNotes] = useState('');

  // Circular Color options
  const colorOptions = [
    { value: '#3B82F6', label: 'Study Blue' },
    { value: '#F472B6', label: 'Work Pink' },
    { value: '#2F4156', label: 'Exams Dark Green' },
    { value: '#567C8D', label: 'Personal Mint' },
    { value: '#F97316', label: 'Reading Orange' },
    { value: '#8B5CF6', label: 'Fitness Purple' },
    { value: '#FBBF24', label: 'Break Yellow' },
  ];

  // Action status notification message
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'info' } | null>(null);

  const triggerNotification = (message: string, type: 'success' | 'info' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  // Helper: Format Date string
  const formatDateString = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const handlePrevDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() - 1);
    setCurrentDate(newDate);
  };

  const handleNextDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + 1);
    setCurrentDate(newDate);
  };

  const handleToday = () => {
    setCurrentDate(new Date(2026, 5, 22));
  };

  // Duration Calculator in hours
  const calculateDuration = (start: string, end: string): number => {
    const [startH, startM] = start.split(':').map(Number);
    const [endH, endM] = end.split(':').map(Number);
    const diffMins = (endH * 60 + endM) - (startH * 60 + startM);
    return Math.max(0, diffMins / 60);
  };

  // KPI Calculations
  const kpiData = useMemo(() => {
    const dailyBlocks = blocks.filter(b => b.date === '2026-06-22');
    const totalBlocks = dailyBlocks.length;
    const completedBlocks = dailyBlocks.filter(b => b.completed).length;
    
    let totalFocusMins = 0;
    dailyBlocks.forEach(b => {
      const dur = calculateDuration(b.startTime, b.endTime);
      totalFocusMins += dur;
    });

    const completionRate = totalBlocks > 0 ? Math.round((completedBlocks / totalBlocks) * 100) : 0;
    const upcomingBlocks = dailyBlocks.filter(b => !b.completed).length;

    return {
      completionRate,
      focusTime: `${totalFocusMins.toFixed(1)}h`,
      completedCount: `${completedBlocks}/${totalBlocks}`,
      upcomingCount: upcomingBlocks
    };
  }, [blocks]);

  // Form submission
  const handleScheduleBlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    const newBlock: TimeBlock = {
      id: Date.now().toString(),
      title: formTitle,
      category: formCategory,
      date: formDate,
      startTime: formStartTime,
      endTime: formEndTime,
      repeat: formRepeat,
      priority: formPriority,
      color: formColor,
      reminder: formReminder,
      notes: formNotes,
      completed: false
    };

    setBlocks(prev => [...prev, newBlock].sort((a, b) => a.startTime.localeCompare(b.startTime)));
    triggerNotification(`"${formTitle}" successfully scheduled!`, 'success');
    
    // Reset basic form fields
    setFormTitle('');
    setFormNotes('');
  };

  const toggleBlockCompleted = (id: string) => {
    setBlocks(prev => prev.map(b => {
      if (b.id === id) {
        const nextState = !b.completed;
        triggerNotification(nextState ? `Task completed! Great job! 🌱` : `Task set to pending.`, 'success');
        return { ...b, completed: nextState };
      }
      return b;
    }));
  };

  const deleteBlock = (id: string) => {
    const blockToDelete = blocks.find(b => b.id === id);
    setBlocks(prev => prev.filter(b => b.id !== id));
    if (blockToDelete) {
      triggerNotification(`Removed block: "${blockToDelete.title}"`, 'info');
    }
  };

  // Sorted list of timeline blocks for display
  const dailyTimelineBlocks = useMemo(() => {
    const formattedTarget = currentDate.toISOString().split('T')[0];
    // Filter to blocks on current date or fallback to all for demonstration
    const list = blocks.filter(b => b.date === '2026-06-22');
    return [...list].sort((a, b) => a.startTime.localeCompare(b.startTime));
  }, [blocks, currentDate]);

  // Category Breakdown hours
  const categoryStats = useMemo(() => {
    const initialStats: Record<string, { hours: number; color: string }> = {
      Study: { hours: 0, color: '#3B82F6' },
      Work: { hours: 0, color: '#F472B6' },
      Exams: { hours: 0, color: '#2F4156' },
      Personal: { hours: 0, color: '#567C8D' },
      Break: { hours: 0, color: '#FBBF24' },
      Fitness: { hours: 0, color: '#8B5CF6' },
      Reading: { hours: 0, color: '#F97316' },
    };

    let grandTotalHours = 0;
    blocks.forEach(b => {
      const dur = calculateDuration(b.startTime, b.endTime);
      if (initialStats[b.category]) {
        initialStats[b.category].hours += dur;
        grandTotalHours += dur;
      }
    });

    const parsedBreakdown = Object.entries(initialStats).map(([name, val]) => {
      const percentage = grandTotalHours > 0 ? Math.round((val.hours / grandTotalHours) * 100) : 0;
      return {
        name,
        hours: val.hours,
        percentage,
        color: val.color
      };
    }).filter(item => item.hours > 0 || ['Study', 'Work', 'Exams', 'Personal', 'Break'].includes(item.name));

    return {
      breakdown: parsedBreakdown,
      totalHours: grandTotalHours
    };
  }, [blocks]);

  // SVG Donut Chart variables
  const donutChartData = useMemo(() => {
    let currentAngle = 0;
    const radius = 50;
    const strokeWidth = 14;
    const circumference = 2 * Math.PI * radius;

    return categoryStats.breakdown.map((item) => {
      const pct = item.percentage;
      const strokeLength = (pct / 100) * circumference;
      const strokeOffset = circumference - strokeLength + currentAngle;
      currentAngle -= strokeLength;

      return {
        ...item,
        circumference,
        strokeLength,
        strokeOffset,
        radius,
        strokeWidth
      };
    });
  }, [categoryStats]);

  // Quick Action Handler Simulation
  const handleQuickAction = (action: string) => {
    if (action === 'optimize') {
      triggerNotification("AI Schedule Optimizer: Grouping similar focus blocks together & creating perfect transitions!", 'success');
      // Simulate optimizing by sorting high priority blocks first, group breaks
    } else if (action === 'breaks') {
      // Auto insert break
      const hasBreak = blocks.some(b => b.category === 'Break' && b.startTime === '12:30');
      if (hasBreak) {
        triggerNotification("Your afternoon break is already perfectly scheduled at 12:30 PM!", 'info');
      } else {
        const breakBlock: TimeBlock = {
          id: 'break-auto',
          title: 'Forest Meditation & Water Break ☕',
          category: 'Break',
          date: '2026-06-22',
          startTime: '12:30',
          endTime: '13:00',
          repeat: 'Daily',
          priority: 'Low',
          color: '#FBBF24',
          reminder: 'None',
          notes: 'AI auto-scheduled healthy refresh window.',
          completed: false
        };
        setBlocks(prev => [...prev, breakBlock].sort((a, b) => a.startTime.localeCompare(b.startTime)));
        triggerNotification("Scheduled a restorative Nature Break at 12:30 PM!", 'success');
      }
    } else if (action === 'focus') {
      triggerNotification("Redirecting you to Focus Mode... Prepare for a deep session! 🧠🌲", 'success');
    }
  };

  // Helper to determine active background and colors for different task category pills
  const getCategoryTheme = (category: string, isActive: boolean) => {
    if (isActive) {
      return {
        bg: 'bg-[#2F4156] text-white border-transparent',
        badge: 'bg-white/20 text-white'
      };
    }
    switch (category) {
      case 'Study':
        return { bg: 'bg-[#EFF6FF] text-[#2563EB] border-[#DBEAFE]', badge: 'bg-[#3B82F6]/10 text-[#2563EB]' };
      case 'Work':
        return { bg: 'bg-[#FFF2F8] text-[#DB2777] border-[#FCE7F3]', badge: 'bg-[#F472B6]/10 text-[#DB2777]' };
      case 'Exams':
        return { bg: 'bg-[#C8D9E6/30] text-[#2F4156] border-[#567C8D]/20', badge: 'bg-[#2F4156]/10 text-[#2F4156]' };
      case 'Personal':
        return { bg: 'bg-[#F0FDF4] text-[#0D9488] border-[#CCFBF1]', badge: 'bg-[#567C8D]/10 text-[#0D9488]' };
      case 'Reading':
        return { bg: 'bg-[#FFF7ED] text-[#EA580C] border-[#FFEDD5]', badge: 'bg-[#F97316]/10 text-[#EA580C]' };
      case 'Fitness':
        return { bg: 'bg-[#F5F3FF] text-[#7C3AED] border-[#EDE9FE]', badge: 'bg-[#8B5CF6]/10 text-[#7C3AED]' };
      case 'Break':
        return { bg: 'bg-[#FEF3C7] text-[#D97706] border-[#FEF3C7]', badge: 'bg-[#FBBF24]/15 text-[#D97706]' };
      default:
        return { bg: 'bg-[#F3F4F6] text-[#374151] border-[#E5E7EB]', badge: 'bg-[#374151]/10 text-[#374151]' };
    }
  };

  return (
    <div className="space-y-6 max-w-[1720px] mx-auto pb-12 font-sans select-none animate-fade-in text-gray-800">
      
      {/* Title Header with Nature Gradient accent line */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-gradient-to-r from-white to-[#C8D9E6/15 p-6 rounded-2xl border border-[#2F4156]/10 shadow-sm">
        <div>
          <span className="text-xs font-bold text-[#567C8D] uppercase tracking-wider flex items-center gap-1.5 mb-1">
            <Sparkles className="w-4.5 h-4.5 text-[#567C8D]" /> AI-Powered Timeboxing
          </span>
          <h2 className="text-3xl font-extrabold font-display text-[#2F4156] tracking-tight">
            Hourly Timeblock Scheduler
          </h2>
          <p className="text-gray-500 text-sm mt-0.5">
            Optimize your calendar flow, block distractions, and visualize your daily productivity.
          </p>
        </div>
      </div>

      {/* Floating Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className={`fixed top-24 right-8 z-50 p-4 rounded-xl shadow-lg border flex items-center gap-3 max-w-md ${
              notification.type === 'success' 
                ? 'bg-[#C8D9E6/30] border-[#567C8D] text-[#2F4156]' 
                : 'bg-blue-50 border-blue-200 text-blue-800'
            }`}
          >
            <CheckCircle2 className="w-5 h-5 text-[#567C8D]" />
            <div className="text-sm font-semibold">{notification.message}</div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Three Column 16:9 Grid Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        
        {/* ===================================================
            LEFT COLUMN: Book a Time Block Form (xl:col-span-3)
            =================================================== */}
        <div id="scheduler-form-card" className="xl:col-span-3 bg-white rounded-[24px] border border-[#2F4156]/10 shadow-sm p-5 space-y-4">
          <div className="flex items-center gap-2 pb-1 border-b border-[#C8D9E6/30]">
            <div className="p-1.5 bg-[#C8D9E6/30] rounded-lg">
              <Calendar className="w-5 h-5 text-[#2F4156]" />
            </div>
            <h3 className="text-base font-bold text-[#2F4156] font-display">Book a Time Block</h3>
          </div>

          <form onSubmit={handleScheduleBlock} className="space-y-4 text-xs">
            
            {/* Task Title */}
            <div>
              <label className="block text-gray-500 font-semibold mb-1">Task Title</label>
              <input
                type="text"
                value={formTitle}
                onChange={e => setFormTitle(e.target.value)}
                placeholder="e.g., Placement Prep Mock Exam"
                className="w-full py-2 px-3 border border-gray-200 focus:border-[#567C8D] focus:ring-1 focus:ring-[#567C8D] rounded-xl outline-none transition-all placeholder:text-gray-300 font-medium"
                required
              />
            </div>

            {/* Category Dropdown & Date Picker Row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-gray-500 font-semibold mb-1">Category</label>
                <select
                  value={formCategory}
                  onChange={e => {
                    const cat = e.target.value as any;
                    setFormCategory(cat);
                    // Match default colors
                    if (cat === 'Study') setFormColor('#3B82F6');
                    else if (cat === 'Work') setFormColor('#F472B6');
                    else if (cat === 'Exams') setFormColor('#2F4156');
                    else if (cat === 'Personal') setFormColor('#567C8D');
                    else if (cat === 'Reading') setFormColor('#F97316');
                    else if (cat === 'Fitness') setFormColor('#8B5CF6');
                    else if (cat === 'Break') setFormColor('#FBBF24');
                  }}
                  className="w-full py-2 px-2.5 border border-gray-200 focus:border-[#567C8D] rounded-xl outline-none font-medium bg-white"
                >
                  <option value="Study">Study 📚</option>
                  <option value="Work">Work 💻</option>
                  <option value="Exams">Exams 📝</option>
                  <option value="Personal">Personal 🌱</option>
                  <option value="Reading">Reading 📖</option>
                  <option value="Fitness">Fitness 🏃‍♂️</option>
                  <option value="Break">Break ☕</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-500 font-semibold mb-1">Date</label>
                <input
                  type="date"
                  value={formDate}
                  onChange={e => setFormDate(e.target.value)}
                  className="w-full py-2 px-2 border border-gray-200 focus:border-[#567C8D] rounded-xl outline-none font-medium"
                  required
                />
              </div>
            </div>

            {/* Start and End Times */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-gray-500 font-semibold mb-1 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-gray-400" /> Start Time
                </label>
                <input
                  type="time"
                  value={formStartTime}
                  onChange={e => setFormStartTime(e.target.value)}
                  className="w-full py-2 px-2 border border-gray-200 focus:border-[#567C8D] rounded-xl outline-none font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-500 font-semibold mb-1 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-gray-400" /> End Time
                </label>
                <input
                  type="time"
                  value={formEndTime}
                  onChange={e => setFormEndTime(e.target.value)}
                  className="w-full py-2 px-2 border border-gray-200 focus:border-[#567C8D] rounded-xl outline-none font-medium"
                  required
                />
              </div>
            </div>

            {/* Repeat Dropdown (Optional) */}
            <div>
              <label className="block text-gray-500 font-semibold mb-1">Repeat Frequency (Optional)</label>
              <select
                value={formRepeat}
                onChange={e => setFormRepeat(e.target.value)}
                className="w-full py-2 px-3 border border-gray-200 focus:border-[#567C8D] rounded-xl outline-none font-medium bg-white"
              >
                <option value="None">Does not repeat</option>
                <option value="Daily">Daily</option>
                <option value="Weekly">Weekly on Mondays</option>
                <option value="Alternate Days">Alternate Days</option>
              </select>
            </div>

            {/* Priority Selection Chips */}
            <div>
              <label className="block text-gray-500 font-semibold mb-1.5">Priority Level</label>
              <div className="grid grid-cols-3 gap-2">
                {(['High', 'Medium', 'Low'] as const).map(p => {
                  const isSelected = formPriority === p;
                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setFormPriority(p)}
                      className={`py-1.5 px-2.5 rounded-lg border font-bold text-center transition-all ${
                        isSelected 
                          ? p === 'High' ? 'bg-red-50 text-red-600 border-red-200'
                            : p === 'Medium' ? 'bg-amber-50 text-amber-600 border-amber-200'
                            : 'bg-blue-50 text-blue-600 border-blue-200'
                          : 'bg-gray-50 text-gray-400 border-gray-100 hover:bg-gray-100'
                      }`}
                    >
                      {p}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Color Picker with Circular Color Options */}
            <div>
              <label className="block text-gray-500 font-semibold mb-1.5">Block Theme Color</label>
              <div className="flex items-center gap-2 flex-wrap">
                {colorOptions.map(c => {
                  const isSelected = formColor === c.value;
                  return (
                    <button
                      key={c.value}
                      type="button"
                      onClick={() => setFormColor(c.value)}
                      style={{ backgroundColor: c.value }}
                      title={c.label}
                      className={`w-5.5 h-5.5 rounded-full transition-all relative ${
                        isSelected ? 'scale-120 ring-2 ring-[#2F4156] ring-offset-2' : 'hover:scale-110 opacity-80'
                      }`}
                    >
                      {isSelected && (
                        <Check className="w-3 h-3 text-white absolute inset-0 m-auto stroke-[3px]" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Reminder Dropdown */}
            <div>
              <label className="block text-gray-500 font-semibold mb-1">Set Smart Alert</label>
              <select
                value={formReminder}
                onChange={e => setFormReminder(e.target.value)}
                className="w-full py-2 px-3 border border-gray-200 focus:border-[#567C8D] rounded-xl outline-none font-medium bg-white"
              >
                <option value="None">No reminder</option>
                <option value="At time of event">At time of event</option>
                <option value="5 minutes before">5 minutes before</option>
                <option value="10 minutes before">10 minutes before</option>
                <option value="15 minutes before">15 minutes before</option>
                <option value="30 minutes before">30 minutes before</option>
              </select>
            </div>

            {/* Notes Textarea */}
            <div>
              <label className="block text-gray-500 font-semibold mb-1">Task Details & Notes</label>
              <textarea
                value={formNotes}
                onChange={e => setFormNotes(e.target.value)}
                placeholder="Additional instructions, links, or micro-goals..."
                rows={2}
                className="w-full py-2 px-3 border border-gray-200 focus:border-[#567C8D] focus:ring-1 focus:ring-[#567C8D] rounded-xl outline-none transition-all placeholder:text-gray-300 font-medium resize-none"
              />
            </div>

            {/* Gradient Submit Button */}
            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-[#2F4156] to-[#567C8D] hover:from-[#116b51] hover:to-[#35b579] text-white font-bold rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 text-sm cursor-pointer mt-2"
            >
              <Plus className="w-4.5 h-4.5 stroke-[2.5px]" /> Schedule Block
            </button>
          </form>
        </div>


        {/* ===================================================
            CENTER PANEL: Daily Timeline (xl:col-span-5)
            =================================================== */}
        <div className="xl:col-span-5 space-y-6">
          
          {/* Calendar Day Header controls */}
          <div className="bg-white rounded-[24px] border border-[#2F4156]/10 shadow-sm p-4 flex flex-col sm:flex-row justify-between items-center gap-3">
            <div className="flex items-center gap-2">
              <button 
                onClick={handlePrevDay}
                className="p-1.5 hover:bg-[#C8D9E6/30] rounded-lg text-gray-600 hover:text-[#2F4156] transition-colors"
                title="Previous Day"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              <span className="font-bold text-sm text-[#2F4156] w-48 text-center font-display">
                {formatDateString(currentDate)}
              </span>

              <button 
                onClick={handleNextDay}
                className="p-1.5 hover:bg-[#C8D9E6/30] rounded-lg text-gray-600 hover:text-[#2F4156] transition-colors"
                title="Next Day"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button 
                onClick={handleToday}
                className="py-1.5 px-3 border border-gray-200 hover:border-[#567C8D] text-xs font-bold rounded-lg text-[#2F4156] bg-[#C8D9E6/10 hover:bg-[#C8D9E6/30] transition-all"
              >
                Today
              </button>

              {/* Segmented View Toggles */}
              <div className="flex bg-gray-100 p-1 rounded-lg">
                {(['Timeline', 'List', 'Calendar'] as const).map(m => (
                  <button
                    key={m}
                    onClick={() => setViewMode(m)}
                    className={`py-1 px-2.5 text-[10px] font-bold rounded-md transition-all ${
                      viewMode === m 
                        ? 'bg-white text-[#2F4156] shadow-xs' 
                        : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* KPI Stat Rows */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {/* KPI 1: Daily Progress */}
            <div className="bg-white p-3 rounded-2xl border border-[#2F4156]/10 shadow-sm flex items-center gap-2.5 relative overflow-hidden">
              <div className="relative flex items-center justify-center w-11 h-11 shrink-0">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="22" cy="22" r="18" className="stroke-gray-100" strokeWidth="3" fill="transparent" />
                  <circle 
                    cx="22" 
                    cy="22" 
                    r="18" 
                    className="stroke-[#567C8D] transition-all duration-500" 
                    strokeWidth="3.5" 
                    fill="transparent" 
                    strokeDasharray={2 * Math.PI * 18}
                    strokeDashoffset={2 * Math.PI * 18 * (1 - kpiData.completionRate / 100)}
                    strokeLinecap="round"
                  />
                </svg>
                <span className="absolute text-[10px] font-black text-[#2F4156]">{kpiData.completionRate}%</span>
              </div>
              <div className="text-left">
                <span className="text-[10px] text-gray-400 font-bold uppercase block tracking-wider leading-none">Daily Progress</span>
                <span className="text-xs font-black text-[#2F4156] mt-0.5 block">Completed</span>
              </div>
            </div>

            {/* KPI 2: Focus Time */}
            <div className="bg-white p-3 rounded-2xl border border-[#2F4156]/10 shadow-sm flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center shrink-0">
                <Clock className="w-4.5 h-4.5 text-orange-500" />
              </div>
              <div className="text-left">
                <span className="text-[10px] text-gray-400 font-bold uppercase block tracking-wider leading-none">Focus Time</span>
                <span className="text-sm font-black text-[#2F4156] mt-0.5 block">{kpiData.focusTime}</span>
              </div>
            </div>

            {/* KPI 3: Completed Blocks */}
            <div className="bg-white p-3 rounded-2xl border border-[#2F4156]/10 shadow-sm flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-4.5 h-4.5 text-[#567C8D]" />
              </div>
              <div className="text-left">
                <span className="text-[10px] text-gray-400 font-bold uppercase block tracking-wider leading-none">Completed</span>
                <span className="text-sm font-black text-[#2F4156] mt-0.5 block">{kpiData.completedCount}</span>
              </div>
            </div>

            {/* KPI 4: Upcoming Blocks */}
            <div className="bg-white p-3 rounded-2xl border border-[#2F4156]/10 shadow-sm flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                <Bookmark className="w-4.5 h-4.5 text-blue-500" />
              </div>
              <div className="text-left">
                <span className="text-[10px] text-gray-400 font-bold uppercase block tracking-wider leading-none">Upcoming</span>
                <span className="text-sm font-black text-[#2F4156] mt-0.5 block">{kpiData.upcomingCount} Left</span>
              </div>
            </div>
          </div>

          {/* Main Schedule Timeline Block Area */}
          <div className="bg-white rounded-[24px] border border-[#2F4156]/10 shadow-sm p-5 relative">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-100">
              <span className="text-xs font-bold text-[#2F4156] uppercase tracking-wider">Hourly Stream</span>
              <span className="text-[11px] text-gray-400 font-bold bg-gray-50 px-2 py-0.5 rounded-md">8 AM — 8 PM</span>
            </div>

            {dailyTimelineBlocks.length === 0 ? (
              <div className="py-12 text-center">
                <Coffee className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-400 italic">No time blocks scheduled for this day.</p>
                <p className="text-xs text-gray-300 mt-1">Book a session in the left form to get growing!</p>
              </div>
            ) : (
              /* VERTICAL HOURLY TIMELINE */
              <div className="relative pl-8 space-y-6">
                
                {/* Connecting thin vertical line */}
                <div className="absolute left-3.5 top-2.5 bottom-2.5 w-0.5 bg-gradient-to-b from-[#567C8D] to-[#D8F3DC] z-0" />

                {dailyTimelineBlocks.map((block) => {
                  const isCurrentActive = activeBlockId === block.id;
                  const catStyle = getCategoryTheme(block.category, isCurrentActive);
                  const durationHrs = calculateDuration(block.startTime, block.endTime);

                  return (
                    <div 
                      key={block.id} 
                      className={`relative z-10 group transition-all duration-200 cursor-pointer ${
                        isCurrentActive ? 'scale-102' : 'hover:scale-101'
                      }`}
                      onClick={() => setActiveBlockId(block.id)}
                    >
                      {/* Timeline colorful dot */}
                      <div 
                        style={{ backgroundColor: block.color }}
                        className={`absolute -left-7 top-4 w-3.5 h-3.5 rounded-full border-3 border-white shadow-sm transition-transform duration-300 ${
                          isCurrentActive ? 'scale-130 ring-2 ring-[#2F4156]' : 'group-hover:scale-110'
                        }`} 
                      />

                      {/* Rounded Time Block Container */}
                      <div className={`p-4 rounded-xl border transition-all ${
                        isCurrentActive 
                          ? 'bg-[#2F4156] text-white border-transparent shadow-md shadow-[#2F4156]/20' 
                          : block.completed
                            ? 'bg-gray-50/50 border-gray-200 opacity-60'
                            : 'bg-white border-gray-100 shadow-xs hover:border-[#567C8D]/30'
                      }`}>
                        
                        {/* Title, Pill, & Time Header */}
                        <div className="flex justify-between items-start gap-4">
                          <div className="space-y-1">
                            {/* Time Slot & Duration badge */}
                            <div className="flex items-center gap-1.5">
                              <Clock className={`w-3 h-3 ${isCurrentActive ? 'text-white/80' : 'text-[#567C8D]'}`} />
                              <span className={`text-[11px] font-bold ${isCurrentActive ? 'text-white/80' : 'text-gray-400'}`}>
                                {block.startTime} - {block.endTime}
                              </span>
                              <span className={`text-[10px] px-1.5 py-0.2 rounded-md font-extrabold tracking-wider ${
                                isCurrentActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
                              }`}>
                                {durationHrs}h
                              </span>
                              {isCurrentActive && (
                                <span className="text-[10px] font-black bg-white text-[#2F4156] px-1.5 py-0.2 rounded-md tracking-wider flex items-center gap-0.5 uppercase shadow-xs animate-pulse">
                                  ● Active Focus
                                </span>
                              )}
                            </div>

                            <h4 className={`text-sm font-bold tracking-tight ${
                              isCurrentActive ? 'text-white' : block.completed ? 'line-through text-gray-400' : 'text-gray-800'
                            }`}>
                              {block.title}
                            </h4>
                          </div>

                          {/* Action Items: check, delete */}
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleBlockCompleted(block.id);
                              }}
                              className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all border ${
                                block.completed
                                  ? 'bg-[#567C8D] text-white border-transparent'
                                  : isCurrentActive
                                    ? 'border-white/30 hover:bg-white/15 text-white'
                                    : 'border-gray-200 hover:border-[#567C8D] hover:bg-[#C8D9E6/30] text-gray-400 hover:text-[#2F4156]'
                              }`}
                              title={block.completed ? "Mark incomplete" : "Mark as completed"}
                            >
                              <Check className="w-4 h-4 stroke-[2.5px]" />
                            </button>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteBlock(block.id);
                              }}
                              className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
                                isCurrentActive 
                                  ? 'hover:bg-red-900/40 text-white/70 hover:text-white' 
                                  : 'hover:bg-red-50 text-gray-400 hover:text-red-500'
                              }`}
                              title="Delete block"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Category badge & Description Footer */}
                        <div className="flex items-center justify-between mt-3.5 pt-2.5 border-t border-dashed border-gray-100/50">
                          {/* Category Badge */}
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${catStyle.bg}`}>
                            {block.category}
                          </span>

                          {/* Small Priority Icon Indicator */}
                          <span className={`text-[10px] font-bold flex items-center gap-1 ${
                            isCurrentActive
                              ? 'text-white/80'
                              : block.priority === 'High' 
                                ? 'text-red-500' 
                                : block.priority === 'Medium' 
                                  ? 'text-amber-500' 
                                  : 'text-blue-500'
                          }`}>
                            <span className="w-1.5 h-1.5 rounded-full bg-current" />
                            {block.priority} Priority
                          </span>
                        </div>

                        {/* Notes snippet if exists */}
                        {block.notes && (
                          <p className={`text-[11px] mt-2 italic max-w-lg leading-relaxed ${
                            isCurrentActive ? 'text-white/70' : 'text-gray-400'
                          }`}>
                            * {block.notes}
                          </p>
                        )}

                      </div>
                    </div>
                  );
                })}

              </div>
            )}

            {/* Bottom wide add timeblock prompt simulation */}
            <div className="mt-5 pt-3 border-t border-gray-100 text-center">
              <button 
                onClick={() => {
                  const el = document.getElementById('scheduler-form-card');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                  triggerNotification("Fill out the Form details to insert your next high-focus nature block!", 'info');
                }}
                className="w-full py-2.5 bg-gray-50 border border-dashed border-gray-300 hover:border-[#567C8D] hover:bg-[#C8D9E6/10 text-gray-500 hover:text-[#2F4156] font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 text-xs cursor-pointer"
              >
                <Plus className="w-4.5 h-4.5" /> + Add New Time Block
              </button>
            </div>
          </div>
        </div>


        {/* ===================================================
            RIGHT COLUMN: Sidebar Stats & Actions (xl:col-span-4)
            =================================================== */}
        <div className="xl:col-span-4 space-y-6">
          
          {/* Card 1: Category Breakdown with SVG Donut Chart */}
          <div className="bg-white rounded-[24px] border border-[#2F4156]/10 shadow-sm p-5 space-y-4">
            <h3 className="text-sm font-bold text-[#2F4156] uppercase tracking-wider">Category Breakdown</h3>
            
            <div className="flex flex-col sm:flex-row items-center justify-around gap-4 pt-1">
              
              {/* Dynamic SVG Donut Chart */}
              <div className="relative w-36 h-36 flex items-center justify-center">
                <svg width="100%" height="100%" viewBox="0 0 140 140" className="transform -rotate-90">
                  <circle cx="70" cy="70" r="50" fill="transparent" stroke="#F1F5F9" strokeWidth="14" />
                  {donutChartData.map((slice, index) => {
                    if (slice.percentage === 0) return null;
                    return (
                      <circle
                        key={index}
                        cx="70"
                        cy="70"
                        r={slice.radius}
                        fill="transparent"
                        stroke={slice.color}
                        strokeWidth={slice.strokeWidth}
                        strokeDasharray={`${slice.strokeLength} ${slice.circumference - slice.strokeLength}`}
                        strokeDashoffset={slice.strokeOffset}
                        strokeLinecap="round"
                        className="transition-all duration-500 hover:stroke-[16px] cursor-pointer"
                        style={{ transformOrigin: 'center' }}
                      />
                    );
                  })}
                </svg>
                
                {/* Center total readout */}
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-xl font-black text-[#2F4156] leading-none">{categoryStats.totalHours.toFixed(1)}h</span>
                  <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider mt-1">Total Blocked</span>
                </div>
              </div>

              {/* Legend with Color Dots, values, percentages */}
              <div className="space-y-2 text-xs shrink-0 max-w-[180px]">
                {categoryStats.breakdown.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span style={{ backgroundColor: item.color }} className="w-3 h-3 rounded-md shrink-0" />
                    <div className="flex-1 min-w-[70px] text-left">
                      <span className="font-bold text-[#2F4156] block truncate leading-none mb-0.5">{item.name}</span>
                      <span className="text-[10px] text-gray-400 font-semibold">{item.hours.toFixed(1)}h allocation</span>
                    </div>
                    <span className="font-black text-gray-600 bg-gray-50 px-1.5 py-0.5 rounded-md text-[10px] shrink-0 text-right">
                      {item.percentage}%
                    </span>
                  </div>
                ))}
              </div>

            </div>
          </div>

          {/* Card 2: Upcoming Blocks list */}
          <div className="bg-white rounded-[24px] border border-[#2F4156]/10 shadow-sm p-5 space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-gray-100">
              <h3 className="text-sm font-bold text-[#2F4156] uppercase tracking-wider">Upcoming Blocks</h3>
              <button 
                onClick={() => triggerNotification("Viewing all future day lists! Currently demonstrating June 22.", 'info')}
                className="text-[11px] font-bold text-[#567C8D] hover:text-[#2F4156] transition-colors"
              >
                View All
              </button>
            </div>

            <div className="space-y-3">
              {blocks.filter(b => !b.completed).slice(0, 3).map((u, i) => {
                const duration = calculateDuration(u.startTime, u.endTime);
                return (
                  <div 
                    key={u.id}
                    className="p-3 rounded-xl hover:bg-[#C8D9E6/10 border border-transparent hover:border-[#567C8D]/20 transition-all flex justify-between items-center"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-gray-400" />
                        <span className="text-[10px] font-bold text-gray-400">{u.startTime} - {u.endTime}</span>
                        <span className="text-[9px] px-1.5 bg-[#C8D9E6/30] text-[#2F4156] font-black rounded-md">{u.category}</span>
                      </div>
                      <p className="text-xs font-bold text-gray-700">{u.title}</p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-[10px] text-gray-400 font-extrabold block">{duration} Hours</span>
                      <span className="text-[9px] text-red-500 font-black uppercase tracking-wider block bg-red-50 px-1.5 py-0.2 rounded-md mt-0.5">{u.priority}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
