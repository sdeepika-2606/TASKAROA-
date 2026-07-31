import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Trash2, 
  Check, 
  Search, 
  Calendar, 
  AlertTriangle, 
  Clock, 
  Tag, 
  RefreshCw, 
  SlidersHorizontal, 
  LayoutGrid, 
  List, 
  Bell, 
  Paperclip, 
  FileText, 
  Hourglass, 
  Sparkles, 
  CheckCircle2, 
  ChevronDown, 
  MoreVertical,
  Info
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useData } from '../context/DataContext';

interface Task {
  id: string;
  title: string;
  priority: 'High' | 'Medium' | 'Low';
  dueIn: string;
  completed: boolean;
  description?: string;
  dueDate?: string;
  dueTime?: string;
  repeat?: string;
  category?: string;
  reminder?: boolean;
  notes?: string;
  duration?: string;
  aiSuggested?: boolean;
}

export default function TasksView({ theme }: { theme: 'light' | 'dark' | 'contrast' }) {
  const { tasks, addTask, deleteTask, completeTask } = useData();
  // Navigation & Display state
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState<'All' | 'High' | 'Medium' | 'Low' | 'Completed'>('All');
  const [sortBy, setSortBy] = useState<'dueDate' | 'priority' | 'recently' | 'alphabetical'>('recently');
  
  // Create task states
  const [newTitle, setNewTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('2025-05-18');
  const [dueTime, setDueTime] = useState('14:30');
  const [repeat, setRepeat] = useState('None');
  const [category, setCategory] = useState('Study');
  const [priority, setPriority] = useState<'High' | 'Medium' | 'Low'>('Medium');
  const [reminder, setReminder] = useState(false);
  const [duration, setDuration] = useState('45 min');
  const [aiSuggested, setAiSuggested] = useState(false);
  const [notes, setNotes] = useState('');
  const [showAdditional, setShowAdditional] = useState(false);
  const [attachedFile, setAttachedFile] = useState<string | null>(null);

  // Success Notification
  const [toast, setToast] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  // Helper relative deadline converter
  const getRelativeDeadline = (dueDateStr: string) => {
    if (!dueDateStr) return 'No Date';
    const target = new Date(dueDateStr);
    const today = new Date();
    // Zero out time
    today.setHours(0,0,0,0);
    target.setHours(0,0,0,0);
    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays === 2) return 'In 2 Days';
    if (diffDays > 2) return `In ${diffDays} Days`;
    if (diffDays < 0) return 'Overdue';
    return 'Upcoming';
  };

  // Handle Add Task submit
  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    // Convert picker time to AM/PM formatting for beautiful visual display
    let formattedTime = dueTime;
    if (dueTime) {
      const [hours, minutes] = dueTime.split(':');
      const hNum = parseInt(hours);
      const ampm = hNum >= 12 ? 'PM' : 'AM';
      const formattedHours = hNum % 12 || 12;
      formattedTime = `${formattedHours}:${minutes} ${ampm}`;
    }

    const relativeDue = getRelativeDeadline(dueDate);

    addTask({
      title: newTitle,
      priority,
      dueIn: relativeDue,
      completed: false,
      description: description || 'No description provided.',
      dueDate,
      dueTime: formattedTime,
      repeat,
      category,
      reminder,
      notes,
      duration,
      aiSuggested
    });
    
    triggerToast(`Added "${newTitle}" task successfully!`);
    
    // Reset Form
    setNewTitle('');
    setDescription('');
    setNotes('');
    setAttachedFile(null);
    setAiSuggested(false);
  };

  // Toggle tasks
  const toggleTask = (id: string) => {
    completeTask(id);
    const target = tasks.find(t => t.id === id);
    if (target) {
      triggerToast(target.completed ? `Reopened "${target.title}"` : `Completed "${target.title}"! 🎉`);
    }
  };

  // Delete task
  const handleDeleteTask = (id: string) => {
    const target = tasks.find(t => t.id === id);
    deleteTask(id);
    if (target) {
      triggerToast(`Removed task: "${target.title}"`);
    }
  };

  // File attach simulated trigger
  const triggerFileAttach = () => {
    setAttachedFile("ai_project_outline.pdf");
    triggerToast("Attached file: ai_project_outline.pdf");
  };

  // Filter & Sort core computations
  const processedTasks = useMemo(() => {
    let result = [...tasks];

    // Filter by search
    if (searchTerm.trim() !== '') {
      result = result.filter(t => 
        t.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        (t.description && t.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by Priority
    if (filterPriority !== 'All') {
      if (filterPriority === 'Completed') {
        result = result.filter(t => t.completed);
      } else {
        result = result.filter(t => t.priority === filterPriority && !t.completed);
      }
    }

    // Sort operations
    result.sort((a, b) => {
      if (sortBy === 'recently') {
        return b.id.localeCompare(a.id);
      }
      if (sortBy === 'priority') {
        const priorityWeight = { 'High': 3, 'Medium': 2, 'Low': 1 };
        return priorityWeight[b.priority] - priorityWeight[a.priority];
      }
      if (sortBy === 'alphabetical') {
        return a.title.localeCompare(b.title);
      }
      if (sortBy === 'dueDate') {
        const dateA = a.dueDate ? new Date(a.dueDate).getTime() : 0;
        const dateB = b.dueDate ? new Date(b.dueDate).getTime() : 0;
        return dateA - dateB;
      }
      return 0;
    });

    return result;
  }, [tasks, searchTerm, filterPriority, sortBy]);

  // Overall statistics
  const totalCount = tasks.length;
  const completedCount = tasks.filter(t => t.completed).length;
  const pendingCount = tasks.filter(t => !t.completed).length;
  const completionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Circle progress dimensions
  const radius = 32;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (completionRate / 100) * circumference;

  return (
    <div className="space-y-8 animate-fade-in relative pb-16 bg-[#F3EAE0] -m-8 p-8 min-h-screen">
      
      {/* Toast Overlay */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.9 }}
            className="fixed bottom-6 right-6 z-50 bg-[#223148] text-white py-3 px-5 rounded-2xl shadow-2xl border border-[#D2C7B8]/20 flex items-center gap-2.5 font-bold text-xs"
          >
            <div className="w-5 h-5 bg-[#2F486D] text-white rounded-full flex items-center justify-center font-black">✓</div>
            <span>{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Block with detailed title */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-[36px] font-black text-[#223148] tracking-tight leading-none">
            Smart Task Manager
          </h2>
          <p className="text-[#2F486D] text-xs font-bold uppercase tracking-wider mt-1.5">
            Organize, prioritize, and master your daily tasks with intelligent planning.
          </p>
        </div>
      </div>

      {/* Three-Column Workspace Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        
        {/* Left Column: Create Task Form & Floating Stats (Span 4) */}
        <div className="xl:col-span-4 space-y-6">
          
          {/* Create New Task Premium Card */}
          <div className="p-6 rounded-[32px] border border-[#D2C7B8] bg-white shadow-sm transition-all relative overflow-hidden">
            {/* Elegant Background Accent */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#2F486D]/5 rounded-bl-full pointer-events-none" />

            <h3 className="text-lg font-black text-[#223148] mb-5 flex items-center gap-2">
              <span className="p-1.5 bg-[#F3EAE0] rounded-lg text-[#2F486D] block">
                <Plus className="w-4 h-4" />
              </span>
              Create New Task
            </h3>

            <form onSubmit={handleAddTask} className="space-y-4">
              
              {/* Task Title Rounded Input */}
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Task Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Complete AI Project Report"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full py-2.5 px-4 rounded-xl border border-[#D2C7B8] focus:outline-none focus:ring-1 focus:ring-[#2F486D] text-xs font-bold bg-[#F3EAE0]/30 text-[#223148]"
                />
              </div>

              {/* Description Multiline Textarea */}
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Description</label>
                <textarea
                  rows={2}
                  placeholder="Summarize objectives, goals or links..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full py-2 px-4 rounded-xl border border-[#D2C7B8] focus:outline-none focus:ring-1 focus:ring-[#2F486D] text-xs font-bold resize-none bg-[#F3EAE0]/30 text-[#223148]"
                />
              </div>

              {/* Dynamic Due Date & Time Picker */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Due Date</label>
                  <div className="relative">
                    <input
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="w-full py-2 px-3 rounded-xl border border-[#D2C7B8] focus:outline-none text-[11px] font-bold bg-[#F3EAE0]/30 text-[#223148]"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Time</label>
                  <input
                    type="time"
                    value={dueTime}
                    onChange={(e) => setDueTime(e.target.value)}
                    className="w-full py-2 px-3 rounded-xl border border-[#D2C7B8] focus:outline-none text-[11px] font-bold bg-[#F3EAE0]/30 text-[#223148]"
                  />
                </div>
              </div>

              {/* Category & Repeat Dropdowns */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full py-2 px-2 rounded-xl border border-[#D2C7B8] focus:outline-none text-[11px] font-bold cursor-pointer bg-white text-[#223148]"
                  >
                    <option value="Study">Study</option>
                    <option value="Work">Work</option>
                    <option value="Design">Design</option>
                    <option value="Reading">Reading</option>
                    <option value="Planning">Planning</option>
                    <option value="Personal">Personal</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Repeat</label>
                  <select
                    value={repeat}
                    onChange={(e) => setRepeat(e.target.value)}
                    className="w-full py-2 px-2 rounded-xl border border-[#D2C7B8] focus:outline-none text-[11px] font-bold cursor-pointer bg-white text-[#223148]"
                  >
                    <option value="None">None</option>
                    <option value="Daily">Daily</option>
                    <option value="Weekly">Weekly</option>
                    <option value="Monthly">Monthly</option>
                    <option value="Custom">Custom</option>
                  </select>
                </div>
              </div>

              {/* Priority Selector Displayed as rounded custom chips */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Priority Level</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: 'High', style: 'border-[#D2C7B8] text-[#223148] bg-[#F3EAE0]/50' },
                    { label: 'Medium', style: 'border-[#D2C7B8] text-[#223148] bg-[#F3EAE0]/50' },
                    { label: 'Low', style: 'border-[#D2C7B8] text-[#223148] bg-[#F3EAE0]/50' }
                  ].map((chip) => {
                    const isSelected = priority === chip.label;
                    return (
                      <button
                        key={chip.label}
                        type="button"
                        onClick={() => setPriority(chip.label as any)}
                        className={cn(
                          "py-2 text-[10px] font-black uppercase tracking-wider rounded-xl border text-center transition-all cursor-pointer",
                          chip.style,
                          isSelected && 'bg-[#223148] border-[#223148] text-white'
                        )}
                      >
                        {chip.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Collapsible Additional Options for Advanced Task Management */}
              <div>
                <button
                  type="button"
                  onClick={() => setShowAdditional(!showAdditional)}
                  className="text-[10px] font-black text-[#2F486D] uppercase tracking-widest hover:underline flex items-center gap-1 cursor-pointer py-1"
                >
                  <SlidersHorizontal className="w-3 h-3" />
                  {showAdditional ? 'Hide Additional Options' : 'Show Additional Options'}
                </button>

                {showAdditional && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="space-y-3 pt-3 border-t border-[#F3EAE0] mt-2"
                  >
                    {/* Reminder toggle */}
                    <div className="flex items-center justify-between text-xs font-bold text-[#223148]">
                      <span className="flex items-center gap-1.5 text-gray-500 font-extrabold text-[10px] uppercase tracking-wider">
                        <Bell className="w-3.5 h-3.5 text-[#2F486D]" />
                        Reminder Alert
                      </span>
                      <button
                        type="button"
                        onClick={() => setReminder(!reminder)}
                        className={cn(
                          "w-8 h-4 rounded-full transition-colors relative p-0.5 cursor-pointer",
                          reminder ? 'bg-[#223148]' : 'bg-gray-200'
                        )}
                      >
                        <div className={cn("w-3 h-3 bg-white rounded-full transition-transform", reminder ? 'translate-x-4' : '')} />
                      </button>
                    </div>

                    {/* AI Suggested Toggle */}
                    <div className="flex items-center justify-between text-xs font-bold text-[#223148]">
                      <span className="flex items-center gap-1.5 text-gray-500 font-extrabold text-[10px] uppercase tracking-wider">
                        <Sparkles className="w-3.5 h-3.5 text-[#2F486D]" />
                        AI Suggested Deadline
                      </span>
                      <button
                        type="button"
                        onClick={() => setAiSuggested(!aiSuggested)}
                        className={cn(
                          "w-8 h-4 rounded-full transition-colors relative p-0.5 cursor-pointer",
                          aiSuggested ? 'bg-[#2F486D]' : 'bg-gray-200'
                        )}
                      >
                        <div className={cn("w-3 h-3 bg-white rounded-full transition-transform", aiSuggested ? 'translate-x-4' : '')} />
                      </button>
                    </div>

                    {/* Duration input */}
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-gray-400 uppercase tracking-wider block">Estimated Duration</label>
                      <input
                        type="text"
                        placeholder="e.g. 45 min"
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        className="w-full py-1.5 px-3 rounded-lg border border-[#D2C7B8] text-[11px] font-bold focus:outline-none bg-white text-[#223148]"
                      />
                    </div>

                    {/* Notes multiline and files attachment */}
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-gray-400 uppercase tracking-wider block">Add Notes</label>
                      <input
                        type="text"
                        placeholder="e.g. Bring study guides..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="w-full py-1.5 px-3 rounded-lg border border-[#D2C7B8] text-[11px] font-bold focus:outline-none bg-white text-[#223148]"
                      />
                    </div>

                    {/* Attach File Button */}
                    <div className="pt-1">
                      <button
                        type="button"
                        onClick={triggerFileAttach}
                        className="w-full py-2 bg-[#F3EAE0] border border-[#D2C7B8] hover:bg-[#D2C7B8]/30 text-[#223148] text-[10px] font-black uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Paperclip className="w-3.5 h-3.5 text-[#2F486D]" />
                        {attachedFile ? `Attached: ${attachedFile}` : 'Attach File Outline'}
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Submit Add Task button */}
              <button
                type="submit"
                className="w-full py-3.5 bg-[#223148] hover:bg-[#2F486D] text-white font-black uppercase tracking-widest text-[11px] rounded-2xl transition-all shadow-md mt-3 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Add Task
              </button>
            </form>
          </div>

          {/* Bottom Left Floating Statistics Card with progress ring */}
          <div className="bg-white border border-[#D2C7B8] rounded-3xl p-5 shadow-sm flex items-center justify-between gap-4">
            <div className="space-y-1.5">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Task Stats</span>
              <p className="text-xl font-black text-[#223148]">{totalCount} Total Tasks</p>
              <div className="flex items-center gap-2.5 text-[10px] font-extrabold text-[#2F486D]">
                <span className="bg-[#F3EAE0] text-[#223148] px-2 py-0.5 rounded-full">Pending: {pendingCount}</span>
                <span className="bg-[#F3EAE0] text-[#223148] px-2 py-0.5 rounded-full">Completed: {completedCount}</span>
              </div>
            </div>

            {/* Circular progress SVG */}
            <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 80 80">
                <circle
                  cx="40"
                  cy="40"
                  r={radius}
                  className="stroke-[#F3EAE0]"
                  strokeWidth="6"
                  fill="transparent"
                />
                <circle
                  cx="40"
                  cy="40"
                  r={radius}
                  className="stroke-[#2F486D]"
                  strokeWidth="6"
                  fill="transparent"
                  strokeDasharray={circumference}
                  strokeDashoffset={offset}
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute text-xs font-black text-[#223148]">{completionRate}%</span>
            </div>
          </div>

        </div>

        {/* Middle/Main Workspace: Search & Task Cards (Span 5) */}
        <div className="xl:col-span-5 space-y-4">
          
          {/* Main workspace controls */}
          <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
            
            {/* Rounded Search Bar */}
            <div className="relative w-full md:flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search your tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full py-2.5 pl-10 pr-4 rounded-2xl border border-[#D2C7B8] text-xs font-bold focus:outline-none focus:ring-1 focus:ring-[#2F486D] bg-white text-[#223148]"
              />
            </div>

            {/* Layout view toggle & sorters */}
            <div className="flex items-center gap-2 w-full md:w-auto shrink-0">
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="appearance-none bg-white border border-[#D2C7B8] text-[#223148] font-extrabold text-[10px] py-2 pl-3 pr-8 rounded-xl focus:outline-none shadow-sm cursor-pointer"
                >
                  <option value="recently">Recently Added</option>
                  <option value="priority">High Priority</option>
                  <option value="dueDate">Due Date</option>
                  <option value="alphabetical">Alphabetical</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-[#2F486D] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Layout mode buttons */}
              <div className="bg-[#F3EAE0] p-1 rounded-xl flex items-center border border-[#D2C7B8]/40 gap-0.5">
                <button
                  onClick={() => setViewMode('list')}
                  className={cn("p-1.5 rounded-lg transition-colors cursor-pointer", viewMode === 'list' ? 'bg-white text-[#223148] shadow-xs' : 'text-gray-400')}
                >
                  <List className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={cn("p-1.5 rounded-lg transition-colors cursor-pointer", viewMode === 'grid' ? 'bg-white text-[#223148] shadow-xs' : 'text-gray-400')}
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>

          {/* Filter Chips Toolbar */}
          <div className="flex flex-wrap gap-1.5 items-center pb-1">
            {['All', 'High', 'Medium', 'Low', 'Completed'].map((tab) => {
              const active = filterPriority === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setFilterPriority(tab as any)}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer",
                    active
                      ? "bg-[#223148] text-white shadow-xs"
                      : "bg-white border border-[#D2C7B8] text-[#2F486D] hover:bg-[#F3EAE0]"
                  )}
                >
                  {tab === 'All' ? 'All (Active)' : `${tab} Priority`}
                </button>
              );
            })}
          </div>

          {/* Dynamic Task List Workspace */}
          <div className={cn(
            viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-4' : 'space-y-3'
          )}>
            {processedTasks.length === 0 ? (
              <div className="text-center p-12 bg-white rounded-[32px] border border-dashed border-[#D2C7B8] text-gray-400 col-span-2">
                <AlertTriangle className="w-10 h-10 mx-auto mb-3 text-[#2F486D] opacity-60 animate-bounce" />
                <p className="font-extrabold text-sm text-[#223148]">No tasks found matching your filter.</p>
                <p className="text-xs text-gray-400 mt-1">Create a new task above to get started!</p>
              </div>
            ) : (
              <AnimatePresence>
                {processedTasks.map((t) => {
                  const relativeBadge = t.dueIn || getRelativeDeadline(t.dueDate || '');
                  return (
                    <motion.div
                      key={t.id}
                      layout
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      whileHover={{ y: -3, scale: 1.005 }}
                      className={cn(
                        "p-4 rounded-2xl border transition-all relative group flex flex-col justify-between shadow-xs",
                        t.completed 
                          ? 'opacity-60 bg-gray-50/70 border-transparent' 
                          : 'bg-white border-[#D2C7B8] hover:shadow-md hover:border-[#2F486D]'
                      )}
                    >
                      <div>
                        {/* Upper Header Row */}
                        <div className="flex items-start justify-between gap-2.5">
                          <div className="flex items-start gap-3">
                            {/* Circular completion button checkbox */}
                            <button
                              onClick={() => toggleTask(t.id)}
                              className={cn(
                                "w-5 h-5 rounded-full flex items-center justify-center border transition-all mt-0.5 shrink-0 cursor-pointer",
                                t.completed
                                  ? 'bg-[#223148] border-transparent text-white'
                                  : 'border-gray-300 hover:border-[#223148] bg-white'
                              )}
                            >
                              {t.completed && <Check className="w-3.5 h-3.5 font-bold" />}
                            </button>

                            {/* Title & Description */}
                            <div className="space-y-0.5">
                              <p className={cn(
                                "font-black text-[13px] leading-snug tracking-tight",
                                t.completed ? 'line-through text-gray-400' : 'text-[#223148]'
                              )}>
                                {t.title}
                              </p>
                              {t.description && (
                                <p className="text-[11px] text-gray-400 font-medium leading-relaxed">
                                  {t.description}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Delete actions */}
                          <button
                            onClick={() => handleDeleteTask(t.id)}
                            className="text-gray-300 hover:text-red-500 transition-colors p-1 shrink-0 opacity-0 group-hover:opacity-100"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Extra Notes or AI tips */}
                        {t.notes && (
                          <div className="mt-2.5 p-2 bg-[#F3EAE0] border border-[#D2C7B8] rounded-xl flex items-start gap-1.5 text-[10px] text-[#223148] font-bold">
                            <Sparkles className="w-3 h-3 text-[#2F486D] mt-0.5 shrink-0" />
                            <span>{t.notes}</span>
                          </div>
                        )}
                      </div>

                      {/* Lower Badges Row */}
                      <div className="flex flex-wrap gap-1.5 items-center mt-3 pt-2 border-t border-[#F3EAE0]">
                        {/* Category Badge */}
                        {t.category && (
                          <span className="text-[9px] px-2 py-0.5 rounded-md font-black uppercase tracking-wider bg-[#F3EAE0] text-[#223148] border border-[#D2C7B8]/40">
                            {t.category}
                          </span>
                        )}

                        {/* Priority Badge */}
                        <span className={cn(
                          "text-[9px] px-2 py-0.5 rounded-md font-black uppercase tracking-wider",
                          t.priority === 'High' ? 'bg-[#223148] text-white' :
                          t.priority === 'Medium' ? 'bg-[#2F486D] text-white' :
                          'bg-[#D2C7B8] text-[#223148]'
                        )}>
                          {t.priority}
                        </span>

                        {/* Relative Deadline Status Badge */}
                        <span className="text-[9px] px-1.5 py-0.5 rounded-md font-bold tracking-tight text-gray-500 border border-[#D2C7B8]/40 bg-[#F3EAE0]">
                          {relativeBadge}
                        </span>

                        {/* Time & Duration indicators */}
                        <div className="ml-auto flex items-center gap-1.5 text-[9px] text-gray-400 font-bold">
                          <Clock className="w-3 h-3 text-gray-300" />
                          <span>{t.dueTime || 'All Day'}</span>
                          {t.duration && (
                            <span className="opacity-60">({t.duration})</span>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            )}
          </div>

          {/* Sticky glass bottom stats toolbar */}
          <div className="p-3 bg-white/90 backdrop-blur-md border border-[#D2C7B8] rounded-2xl flex items-center justify-between shadow-xs sticky bottom-1 z-20">
            <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-wider text-[#223148]">
              <span>Tasks: <strong>{totalCount}</strong></span>
              <span className="text-gray-300">|</span>
              <span>Done: <strong className="text-[#2F486D]">{completedCount}</strong></span>
              <span className="text-gray-300">|</span>
              <span>Rate: <strong className="text-[#2F486D]">{completionRate}%</strong></span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setFilterPriority('All')}
                className="px-2.5 py-1 bg-[#F3EAE0] text-[#223148] font-black text-[9px] uppercase tracking-wider rounded-lg border border-[#D2C7B8]"
              >
                Reset Filter
              </button>
            </div>
          </div>

        </div>

        {/* Right Column: Premium AI Insights & Timeline Panel (Span 3) */}
        <div className="xl:col-span-3 space-y-6">
          
          {/* Today's Progress summary progress bar circle */}
          <div className="bg-white border border-[#D2C7B8] rounded-3xl p-5 shadow-sm space-y-3.5">
            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Today's Progress</h4>
            <div className="flex items-center gap-4">
              {/* Circular gauge */}
              <div className="relative w-14 h-14 shrink-0 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 80 80">
                  <circle cx="40" cy="40" r="32" className="stroke-[#F3EAE0]" strokeWidth="6" fill="none" />
                  <circle cx="40" cy="40" r="32" className="stroke-[#223148]" strokeWidth="6" fill="none" strokeDasharray="201" strokeDashoffset={201 * (1 - (completionRate / 100))} strokeLinecap="round" />
                </svg>
                <span className="absolute text-xs font-black text-[#223148]">{completionRate}%</span>
              </div>

              <div className="space-y-0.5">
                <p className="text-sm font-black text-[#223148]">Completed Tasks</p>
                <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">
                  {completedCount} of {totalCount} goals reached
                </p>
              </div>
            </div>
          </div>

          {/* Upcoming Deadlines Mini Timeline */}
          <div className="bg-white border border-[#D2C7B8] rounded-3xl p-5 shadow-sm space-y-4">
            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Upcoming Deadlines</h4>
            
            {tasks.filter(t => !t.completed).length === 0 ? (
              <p className="text-xs text-gray-400 font-medium py-6 text-center">No upcoming deadlines</p>
            ) : (
              <div className="relative pl-4 border-l border-[#F3EAE0] space-y-4">
                {tasks
                  .filter(t => !t.completed)
                  .slice(0, 4)
                  .map((item, idx) => (
                    <div key={item.id || idx} className="relative">
                      <div className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full ring-4 ring-white bg-[#223148]" />
                      <div>
                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block leading-none mb-1">
                          {item.dueIn || getRelativeDeadline(item.dueDate || '')}
                        </span>
                        <p className="text-xs font-bold text-[#223148] leading-tight">{item.title}</p>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
