import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Bell, 
  ChevronRight, 
  Plus, 
  MoreVertical, 
  CheckCircle2, 
  CheckSquare,
  Clock, 
  Flame, 
  Send,
  MessageSquare,
  LayoutDashboard,
  Target,
  Calendar,
  BarChart2,
  Activity,
  Sliders,
  Settings,
  Sparkles,
  Award,
  Check,
  TrendingUp,
  Wind,
  Trees,
  Shield,
  Menu,
  X,
  BookOpen,
  Book
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip 
} from 'recharts';

import Sidebar from './Sidebar';
import WelcomeTourModal from './WelcomeTourModal';
import StreakModal from './StreakModal';
import ProfileSettingsPage from './ProfileSettingsPage';
import { cn } from '../lib/utils';
import { useProfile } from '../context/ProfileContext';
import { useData } from '../context/DataContext';
import VoiceAssistant from './VoiceAssistant';
import { getRandomQuote } from '../data/quotes';
import { speakWelcomeGreeting, speakText } from '../services/speechService';
import { BannerForestIllustration, WidescreenLightScenicForest, DarkScenicForestBackground } from './ForestDeerIllustration';

// Sub-views
import TasksView from './TasksView';
import AIAssistantView from './AIAssistantView';
import CalendarView from './CalendarView';
import FocusModeView from './FocusModeView';
import GoalsView from './GoalsView';
import HabitsView from './HabitsView';
import ScheduleView from './ScheduleView';
import AnalyticsView from './AnalyticsView';
import RemindersView from './RemindersView';
import JournalView from './JournalView';
import NotesView from './NotesView';

export default function Dashboard() {
  // Navigation State
  const [activeView, setActiveView] = useState('Dashboard');

  // Interactive Tasks Shared State for Stats Sync
  const { tasks, completeTask, reminders, habits, goals, schedule, addTask, coins, diamonds, streak, rewardPopups } = useData();

  // Streak Modal State
  const [isStreakModalOpen, setIsStreakModalOpen] = useState(false);

  // Dynamic Quote State
  const [quote, setQuote] = useState({
    text: "Success is the sum of small efforts, repeated day in and day out.",
    author: "Robert Collier"
  });

  const { profile, setProfile } = useProfile();

  // Notifications Popover State
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: '1', text: "AI Project Report submission is due in 2 hours", unread: true },
    { id: '2', text: "Aptitude Test coming up on 24 June", unread: true },
    { id: '3', text: "Your daily focus streak is at 7 days! Keep it up 🔥", unread: true }
  ]);

  // Welcome Tour State
  const [isWelcomeTourOpen, setIsWelcomeTourOpen] = useState(false);

  // Daily Briefing and High Priority Reminder States
  const [showDailyBriefing, setShowDailyBriefing] = useState<boolean>(true);
  const [showHighPriorityReminder, setShowHighPriorityReminder] = useState<boolean>(true);
  const [focusTaskTitle, setFocusTaskTitle] = useState<string>('Complete the Landing Page UI');
  const [autoStartFocusTimer, setAutoStartFocusTimer] = useState<boolean>(false);

  // Daily Motivation Quote welcome modal state
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  // Check if it's the first time
  useEffect(() => {
    const isFirstTime = localStorage.getItem('taskaroa_first_time');
    if (isFirstTime === null && !profile.neverShowTour) {
      setIsWelcomeTourOpen(true);
    }
  }, [profile.neverShowTour]);

  // Handle Shared Conversation URL Routing
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('chat')) {
      setActiveView('AI Assistant');
    }
  }, []);

  // Derive High Priority & Recommended Task early for speech
  const highPriorityTasks = tasks.filter(t => !t.completed && t.priority === 'High');
  const topTask = highPriorityTasks[0] || tasks.find(t => !t.completed) || { title: "Complete the Landing Page UI" };

  // Spoken Daily Task Briefing
  useEffect(() => {
    if (activeView === 'Dashboard' && showDailyBriefing && !isWelcomeTourOpen) {
      const nameFirst = profile.name ? profile.name.split(' ')[0] : 'Deepika';
      const hpCount = highPriorityTasks.length > 0 ? highPriorityTasks.length : 2;
      const tTitle = topTask.title || 'Complete the Landing Page UI';
      const briefingSpeech = `Good morning ${nameFirst}. Today you have ${hpCount} High Priority Tasks, 1 Reminder, and 1 Focus Session. I recommend starting with "${tTitle}". Shall I start Focus Mode?`;
      
      const timer = setTimeout(() => {
        speakText(briefingSpeech, profile.voiceSettings);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [activeView, showDailyBriefing, isWelcomeTourOpen]);

  const closeMotivation = (dontShowAgain: boolean) => {
    setIsQuoteModalOpen(false);
    if (dontShowAgain) {
      localStorage.setItem('taskaroa_motivation_date', new Date().toDateString());
    }
  };

  // Dashboard Task Filter State
  const [dashboardTaskFilter, setDashboardTaskFilter] = useState<'All' | 'High' | 'Medium' | 'Low'>('All');

  // AI mini assistant state (for the Dashboard page widget)
  const [aiMessage, setAiMessage] = useState('');
  const [aiResponse, setAiResponse] = useState("Welcome back! Let’s complete today’s tasks 💪");
  const [isTyping, setIsTyping] = useState(false);

  // Re-fetch different quote whenever returning to main page
  useEffect(() => {
    if (activeView === 'Dashboard') {
      fetch('/api/quote')
        .then(res => res.json())
        .then(data => {
          if (data && data.text) {
            setQuote(data);
          } else {
            setQuote(prev => getRandomQuote(prev.text));
          }
        })
        .catch(() => {
          setQuote(prev => getRandomQuote(prev.text));
        });
    }
  }, [activeView]);

  // Toggle tasks completed on main page list
  const toggleTaskCompleted = (id: string) => {
    completeTask(id);
  };

  const handleMiniChatSubmit = async () => {
    if (!aiMessage.trim()) return;
    setIsTyping(true);
    const msg = aiMessage;
    setAiMessage('');
    try {
      const res = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg })
      });
      const data = await res.json();
      setAiResponse(data.response);
    } catch (err) {
      setAiResponse("Sorry, I am offline. Enable GEMINI_API_KEY in Settings to power AI Assistant!");
    } finally {
      setIsTyping(false);
    }
  };

  // Derive dynamic stats from tasks
  const totalCount = tasks.length;
  const completedCount = tasks.filter(t => t.completed).length;
  const pendingCount = tasks.filter(t => !t.completed).length;

  const productivityPieData = [
    { name: 'Focus Time', value: 60, color: '#1A3C34' },
    { name: 'Completed', value: completedCount * 10, color: '#40916C' },
    { name: 'Pending', value: pendingCount * 10, color: '#B7E4C7' },
  ];

  const femaleAvatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(profile.name || 'User')}&hair=longButNotTooLong&eyes=happy`;
  const maleAvatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(profile.name || 'User')}&hair=shortWaved&eyes=default`;
  const currentAvatar = profile.gender === 'female' ? femaleAvatarUrl : maleAvatarUrl;

  // Custom theme variables mapping (Pure Light Theme)
  const themeMainClass = 'bg-[#FAFAF9] text-[#1C1917]';
  const themeCardClass = 'bg-white border-[#E5E7EB] shadow-xs';
  const themeTextClass = 'text-[#0F7A5C]';

  return (
    <div className={cn("flex min-h-screen transition-colors duration-500 ease-in-out", themeMainClass)}>
      {/* Sidebar Component with State */}
      <Sidebar 
        activeView={activeView}
        setActiveView={setActiveView}
        openStreakModal={() => setIsStreakModalOpen(true)}
        userGender={profile.gender}
        userName={profile.name}
        userRole={profile.role}
      />

      {/* Main Panel */}
      <main className={cn("flex-1 p-8 overflow-y-auto h-screen transition-all duration-300 relative", themeMainClass)}>
        
        {/* Floating Reward Popups */}
        <AnimatePresence>
          {rewardPopups.map((popup) => (
            <motion.div
              key={popup.id}
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: -20, scale: 1.1 }}
              exit={{ opacity: 0, y: -40 }}
              className="fixed top-16 right-10 z-50 px-4 py-2 bg-gradient-to-r from-amber-500 to-emerald-600 text-white font-black text-xs rounded-full shadow-lg border border-amber-200 pointer-events-none"
            >
              {popup.text}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Top Header Row - Matching Image Precisely */}
        <div className="flex items-center justify-between gap-4 mb-8">
          {/* Left: Hamburger menu icon */}
          <button 
            onClick={() => {
              const sidebar = document.getElementById('sidebar');
              if (sidebar) sidebar.classList.toggle('hidden');
            }}
            className="p-2.5 rounded-full bg-white border border-[#D8F3DC] shadow-sm hover:bg-[#F0F7F4] transition-colors shrink-0 cursor-pointer"
          >
            <Menu className="w-5 h-5 text-[#1A3C34]" />
          </button>
          
          {/* Center: Search bar */}
          <div className="relative flex-1 max-w-[380px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#74C69D] w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search anything..." 
              className="w-full py-2.5 pl-12 pr-4 rounded-full border border-[#D8F3DC] bg-white focus:outline-none focus:ring-2 focus:ring-[#40916C] shadow-sm text-sm text-gray-800"
            />
          </div>

          {/* Right: Actions & Notifications & Profile Avatar */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Notes Button */}
            <button 
              onClick={() => setActiveView('Notes')}
              className={cn(
                "p-2.5 rounded-full bg-white border border-[#D8F3DC] shadow-sm cursor-pointer hover:bg-[#F0F7F4] transition-all",
                activeView === 'Notes' ? "bg-[#EAF7F1] text-[#0F766E] border-[#0F766E]" : "text-[#1A3C34]"
              )}
              title="Open Digital Notebook"
            >
              <Book className="w-5 h-5" />
            </button>

            {/* Notification Bell with badge */}
            <div className="relative p-2.5 rounded-full bg-white border border-[#D8F3DC] shadow-sm cursor-pointer hover:bg-[#F0F7F4]" onClick={() => setIsNotifOpen(!isNotifOpen)}>
              <Bell className="w-5 h-5 text-[#1A3C34]" />
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border border-white"></span>
            </div>

            {/* User profile avatar with name and role */}
            <div 
              onClick={() => setActiveView('Profile Settings')}
              className="flex items-center gap-3 cursor-pointer hover:opacity-85 transition-opacity"
            >
              <div className="text-right hidden sm:block">
                <p className="text-sm font-black leading-none mb-1 text-[#1A3C34]">{profile.name}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-[#1A3C34] text-white flex items-center justify-center text-sm font-black shadow-sm border-2 border-[#D8F3DC] shrink-0">
                {profile.name ? profile.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'DS'}
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Notifications dropdown */}
        <AnimatePresence>
          {isNotifOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute right-8 mt-3 w-80 rounded-2xl p-4 shadow-2xl z-40 border bg-white border-[#D8F3DC] text-[#1A3C34]"
            >
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-100">
                <h4 className="font-bold text-sm">Notifications</h4>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setNotifications(prev => prev.map(n => ({ ...n, unread: false })))}
                    className="text-[10px] font-bold text-emerald-600 hover:underline"
                  >
                    Mark all read
                  </button>
                  <button 
                    onClick={() => setIsNotifOpen(false)}
                    className="text-xs text-gray-500 hover:text-red-500"
                  >
                    Close
                  </button>
                </div>
              </div>
              {/* Notifications list */}
              <div className="space-y-3">
                {notifications.map((n) => (
                  <div 
                    key={n.id} 
                    className={`p-2.5 rounded-xl text-xs flex justify-between items-start gap-2 ${
                      n.unread ? 'bg-emerald-50/50 font-bold' : 'opacity-65'
                    }`}
                  >
                    <p>{n.text}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>


        {/* ========================================================= */}
        {/* VIEW ROUTER FOR SUB-VIEWS */}
        {/* ========================================================= */}
        
        {activeView === 'Dashboard' && (
          <div className="space-y-8 animate-fade-in bg-[#F3EAE0] -m-8 p-8 min-h-screen">
            {/* Welcome Greeting Row */}
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="flex-1 pt-4">
                <h2 className="text-[40px] font-black text-[#223148] tracking-tight mb-2">
                  Plan Smarter.
                  <br />
                  Achieve More.
                </h2>
                <p className="text-[#2F486D] text-lg font-bold">
                  Your AI-powered productivity companion for planning, scheduling, and tracking tasks. Stay organized, stay consistent, and achieve more with less stress.
                </p>
              </div>
              
              {/* Text-Only Motivational Quote Banner */}
              <motion.div 
                key={quote.text}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="lg:w-[600px] bg-[#223148] rounded-3xl p-8 md:p-9 relative overflow-hidden flex flex-col justify-center shadow-lg shadow-[#223148]/20"
              >
                <div className="relative z-10 space-y-3">
                  <p className="text-white text-lg md:text-xl font-serif italic leading-relaxed">
                    "{quote.text}"
                  </p>
                  <p className="text-[#D2C7B8] text-xs md:text-sm font-serif italic">
                    — {quote.author}
                  </p>
                </div>
                {/* Subtle background decoration */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -mr-20 -mt-20 pointer-events-none" />
              </motion.div>
            </div>

            {/* AI Daily Task Briefing Banner */}
            <AnimatePresence>
              {showDailyBriefing && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-gradient-to-r from-[#223148] via-[#2F486D] to-[#2F486D]/40 text-white rounded-3xl p-6 shadow-xl border border-[#D2C7B8]/30 relative overflow-hidden"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center gap-2 text-[#D2C7B8] font-black text-xs uppercase tracking-wider">
                        <Sparkles className="w-4 h-4 text-[#D2C7B8]" />
                        AI Daily Task Briefing
                      </div>
                      <h3 className="text-xl md:text-2xl font-black text-white">
                        Good morning {profile.name.split(' ')[0] || 'Deepika'} 👋
                      </h3>
                      
                      <div className="flex flex-wrap gap-2.5 pt-1">
                        <span className="bg-[#223148]/80 border border-[#D2C7B8]/30 text-white text-xs font-bold px-3.5 py-1.5 rounded-full flex items-center gap-1.5">
                          🔥 {highPriorityTasks.length > 0 ? highPriorityTasks.length : 2} High Priority Tasks
                        </span>
                        <span className="bg-[#223148]/80 border border-[#D2C7B8]/30 text-white text-xs font-bold px-3.5 py-1.5 rounded-full flex items-center gap-1.5">
                          🔔 1 Reminder
                        </span>
                        <span className="bg-[#223148]/80 border border-[#D2C7B8]/30 text-white text-xs font-bold px-3.5 py-1.5 rounded-full flex items-center gap-1.5">
                          ⏱️ 1 Focus Session
                        </span>
                      </div>

                      <p className="text-sm text-gray-200 font-medium pt-1">
                        I recommend starting with <strong className="text-[#D2C7B8]">"{topTask.title}"</strong>
                      </p>
                      <p className="text-xs text-[#D2C7B8] font-bold">
                        Shall I start Focus Mode?
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          const startMsg = "Awesome. Let's stay focused. I'll help you finish this task. Your tree is now growing. Stay focused until the timer ends.";
                          speakText(startMsg, profile.voiceSettings);
                          setFocusTaskTitle(topTask.title);
                          setAutoStartFocusTimer(true);
                          setActiveView('Focus Mode');
                        }}
                        className="w-full sm:w-auto bg-[#D2C7B8] hover:bg-white text-[#223148] font-black px-6 py-3.5 rounded-2xl shadow-lg transition-all text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Sparkles className="w-4 h-4 fill-current" />
                        Start Focus
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowDailyBriefing(false)}
                        className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white font-bold px-5 py-3.5 rounded-2xl border border-white/20 transition-all text-xs cursor-pointer"
                      >
                        Later
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* High Priority Task Reminder Banner */}
            <AnimatePresence>
              {showHighPriorityReminder && highPriorityTasks.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-[#2F486D]/10 border-2 border-[#2F486D]/40 rounded-3xl p-5 relative overflow-hidden shadow-sm"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-[#2F486D] text-white flex items-center justify-center shrink-0 font-black shadow-md mt-0.5">
                        ⚡
                      </div>
                      <div>
                        <div className="text-xs font-black text-[#223148] uppercase tracking-wider flex items-center gap-1">
                          High Priority Reminder
                        </div>
                        <p className="text-sm font-black text-[#223148] mt-0.5">
                          Attention {profile.name.split(' ')[0] || 'Deepika'}. Your assignment <span className="text-[#2F486D] font-extrabold">"{highPriorityTasks[0].title}"</span> is marked High Priority.
                        </p>
                        <p className="text-xs text-gray-600 font-semibold mt-1">
                          Completing it today will keep your streak alive. Would you like to start now?
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          const startMsg = "Awesome. Let's stay focused. I'll help you finish this task. Your tree is now growing. Stay focused until the timer ends.";
                          speakText(startMsg, profile.voiceSettings);
                          setFocusTaskTitle(highPriorityTasks[0].title);
                          setAutoStartFocusTimer(true);
                          setActiveView('Focus Mode');
                        }}
                        className="bg-[#223148] hover:bg-[#2F486D] text-white font-black px-5 py-2.5 rounded-xl shadow-md transition-all text-xs uppercase tracking-wider cursor-pointer"
                      >
                        Start Now
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowHighPriorityReminder(false)}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold px-4 py-2.5 rounded-xl transition-all text-xs cursor-pointer"
                      >
                        Remind Me Later
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Quick Access Digital Notebook Card */}
            <div 
              onClick={() => setActiveView('Notes')}
              className="bg-white border border-[#D2C7B8] rounded-[24px] p-6 shadow-sm hover:shadow-md hover:scale-[1.01] transition-all duration-300 cursor-pointer flex flex-col md:flex-row items-center justify-between gap-6"
            >
              <div className="flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-[#F3EAE0] text-[#2F486D] flex items-center justify-center">
                  <Book className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-[#223148]">Digital Notebook</h3>
                  <p className="text-xs font-semibold text-gray-500 mt-0.5">
                    Capture and organize your thoughts with interactive Cornell, Mindmapping, Boxing, and Charting templates.
                  </p>
                </div>
              </div>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveView('Notes');
                }}
                className="py-2.5 px-5 bg-[#223148] hover:bg-[#2F486D] text-white text-xs font-extrabold rounded-xl shadow-xs transition-all flex items-center gap-1.5 shrink-0"
              >
                <span>Open Notes</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Stats Counter Bar */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'Total Tasks', value: totalCount, change: '+ 20% from yesterday', icon: CheckSquare, color: 'text-[#223148]', bg: 'bg-[#D2C7B8]/30' },
                { label: 'Completed', value: completedCount, change: '+ 40% from yesterday', icon: Check, color: 'text-[#223148]', bg: 'bg-[#D2C7B8]/30' },
                { label: 'Pending', value: pendingCount, sub: 'Due Today', icon: Clock, color: 'text-[#2F486D]', bg: 'bg-[#D2C7B8]/30' },
                { label: 'Day Streak', value: `${streak} Days`, sub: 'Keep it up! 🔥', icon: Flame, color: 'text-[#223148]', bg: 'bg-[#D2C7B8]/30' },
              ].map((stat, i) => (
                <motion.div 
                  key={i}
                  whileHover={{ y: -5 }}
                  onClick={i === 3 ? () => setActiveView('Profile Settings') : undefined}
                  className={cn("p-6 rounded-3xl border border-[#D2C7B8] hover:shadow-lg transition-all bg-white", i === 3 ? "cursor-pointer" : "")}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className={cn("p-3 rounded-2xl", stat.bg)}>
                      <stat.icon className={cn("w-6 h-6", stat.color)} />
                    </div>
                    <div>
                      <p className="text-3xl font-black text-[#223148]">{stat.value}</p>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{stat.label}</p>
                    </div>
                  </div>
                  <p className="text-xs font-semibold text-[#2F486D]">{stat.change || stat.sub}</p>
                </motion.div>
              ))}
            </div>

            {/* Grid Row 1: Tasks and Score Overview (Equal Height & Spacing) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              
              {/* Column 1: Smart Task Prioritization (Span 6) */}
              <div className="lg:col-span-6 rounded-3xl p-6 border border-[#D2C7B8] bg-white shadow-sm flex flex-col justify-between h-full">
                <div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-[#223148]" />
                      <h3 className="text-md font-extrabold text-[#223148]">Smart Task Prioritization</h3>
                    </div>
                    
                    {/* Switchable filters */}
                    <div className="flex gap-1.5 bg-[#F3EAE0] p-1 rounded-full overflow-x-auto max-w-[200px] sm:max-w-none">
                      {['All', 'High', 'Medium', 'Low'].map(tab => (
                        <button 
                          key={tab}
                          onClick={() => setDashboardTaskFilter(tab as any)}
                          className={`px-3 py-1.5 rounded-full text-[10px] font-black transition-all shrink-0 ${
                            dashboardTaskFilter === tab
                              ? 'bg-[#223148] text-white'
                              : 'text-gray-500 hover:text-gray-900'
                          }`}
                        >
                          {tab === 'All' ? 'All Tasks' : tab}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Tasks list */}
                  <div className="space-y-3.5">
                    {tasks
                      .filter(task => dashboardTaskFilter === 'All' || task.priority === dashboardTaskFilter)
                      .map(task => (
                      <div 
                        key={task.id} 
                        className={`flex items-center justify-between p-3.5 border rounded-2xl hover:translate-x-1 transition-transform duration-300 ${
                          task.completed ? 'opacity-60 bg-gray-50/50' : 'bg-white border-[#F3EAE0]'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <button 
                            onClick={() => toggleTaskCompleted(task.id)}
                            className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${
                              task.completed ? 'bg-[#223148] border-transparent text-white' : 'border-gray-300 hover:border-[#223148]'
                            }`}
                          >
                            {task.completed && <Check className="w-3.5 h-3.5 font-bold" />}
                          </button>
                          <p className={`font-bold text-xs text-[#223148] ${task.completed ? 'line-through text-gray-400' : ''}`}>
                            {task.title}
                          </p>
                        </div>
                        
                        <div className="flex items-center gap-2.5">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${
                            task.priority === 'High' ? 'bg-[#223148] text-white' :
                            task.priority === 'Medium' ? 'bg-[#2F486D] text-white' :
                            'bg-[#D2C7B8] text-[#223148]'
                          }`}>
                            {task.priority}
                          </span>
                          <span className="text-[10px] font-bold text-gray-400 whitespace-nowrap">{task.dueIn}</span>
                        </div>
                      </div>
                    ))}

                    <button 
                      onClick={() => setActiveView('Tasks')}
                      className="mt-4 px-5 py-2.5 bg-[#223148] hover:bg-[#2F486D] text-white font-extrabold text-xs rounded-full transition-all flex items-center justify-center gap-2 w-fit shadow-md cursor-pointer"
                    >
                      <Plus className="w-4 h-4 stroke-[3]" /> Add New Task
                    </button>
                  </div>
                </div>
              </div>

              {/* Column 2: Productivity Overview (Span 6, Equal Height) */}
              <div 
                onClick={() => setActiveView('Analytics')}
                className="lg:col-span-6 rounded-3xl p-6 border border-[#D2C7B8] bg-white shadow-sm flex flex-col justify-between hover:scale-[1.01] hover:shadow-md hover:border-[#2F486D] cursor-pointer transition-all duration-300 group h-full"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <BarChart2 className="w-5 h-5 text-[#2F486D]" />
                      <h3 className="text-sm font-black text-[#223148] uppercase tracking-wider">Productivity Overview</h3>
                    </div>
                    <button className="text-[10px] font-black text-[#2F486D] hover:underline flex items-center gap-0.5">
                      Executive Report <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="flex items-center gap-6 py-2">
                    {/* Circle Score */}
                    <div className="relative w-28 h-28 flex items-center justify-center shrink-0">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                        <circle cx="60" cy="60" r="45" className="stroke-[#F3EAE0]" strokeWidth="8" fill="transparent" />
                        <circle
                          cx="60"
                          cy="60"
                          r="45"
                          className="stroke-[#223148]"
                          strokeWidth="8"
                          fill="transparent"
                          strokeDasharray="282.7"
                          strokeDashoffset={282.7 * (1 - (tasks.length > 0 ? tasks.filter(t => t.completed).length / tasks.length : 0))}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <p className="text-2xl font-black text-[#223148]">{tasks.length > 0 ? Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100) : 0}%</p>
                      </div>
                    </div>

                    {/* Stats List */}
                    <div className="flex-1 grid grid-cols-2 gap-y-3 gap-x-4">
                      {[
                        { name: 'Focus Time', value: '18h 30m', icon: Clock },
                        { name: 'Completed', value: `${tasks.filter(t => t.completed).length} Tasks`, icon: Check },
                        { name: 'Pending', value: `${tasks.filter(t => !t.completed).length} Tasks`, icon: Clock },
                        { name: 'Score', value: '20%', icon: TrendingUp },
                      ].map((item, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <div className="p-1.5 rounded-lg bg-[#F3EAE0] text-[#223148]">
                            <item.icon className="w-3 h-3" />
                          </div>
                          <div>
                            <p className="text-[9px] font-black text-gray-400 uppercase">{item.name}</p>
                            <p className="text-xs font-black text-[#223148]">{item.value}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bottom Message & Mini Metrics */}
                <div className="pt-4 mt-4 border-t border-gray-100 flex flex-col gap-3">
                  <p className="text-[10px] font-bold text-[#2F486D] flex items-center gap-1.5">
                    <span>🚀</span> Great job! You're operating at peak efficiency.
                  </p>
                  <div className="flex gap-2">
                    {['Focus', 'Done', 'Pending', 'Eff'].map(label => (
                      <span key={label} className="text-[9px] font-black uppercase text-gray-500 bg-[#F3EAE0] px-2 py-0.5 rounded-full border border-[#D2C7B8]/40">
                        {label}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

            </div>

            {/* Grid Row 2: Timeline, Deadlines, and Habits (Three Equal-Width Columns, Equal Height) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
              
              {/* Column 1: Today's Schedule */}
              <div className="rounded-3xl p-6 border border-[#D2C7B8] bg-white shadow-sm flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-[#2F486D]" />
                      <h3 className="text-md font-extrabold text-[#223148]">Today's Schedule</h3>
                    </div>
                    <button 
                      onClick={() => setActiveView('Schedule')}
                      className="text-xs font-bold text-[#2F486D] hover:underline"
                    >
                      View Calendar
                    </button>
                  </div>

                  <div className="space-y-6 relative pl-1.5">
                    {/* Absolute vertical timeline line */}
                    <div className="absolute left-[13px] top-3.5 bottom-3.5 w-0.5 bg-[#F3EAE0]" />
                    {[
                      { time: '09:00 AM - 11:00 AM', task: 'AI Project Work', color: 'bg-[#223148]' },
                      { time: '11:15 AM - 12:00 PM', task: 'Data Structures Class', color: 'bg-[#2F486D]' },
                      { time: '02:00 PM - 03:00 PM', task: 'Placement Preparation', color: 'bg-[#223148]' },
                      { time: '04:00 PM - 05:30 PM', task: 'Complete AI Report', color: 'bg-[#2F486D]' },
                      { time: '07:00 PM - 08:00 PM', task: 'Workout', color: 'bg-[#223148]' },
                    ].map((item, i) => (
                      <div key={i} className="flex gap-4 relative items-start z-10">
                        <div className={cn("w-2.5 h-2.5 rounded-full mt-1 ring-4 ring-white shrink-0", item.color)} />
                        <div className="flex-1">
                          <p className="text-[10px] font-bold text-[#2F486D] mb-0.5">{item.time}</p>
                          <p className="text-xs font-black text-[#223148] leading-snug">{item.task}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Column 2: Upcoming Deadlines */}
              <div className="rounded-3xl p-6 border border-[#D2C7B8] bg-white shadow-sm flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-[#2F486D]" />
                      <h3 className="text-md font-extrabold text-[#223148]">Upcoming Deadlines</h3>
                    </div>
                    <button 
                      onClick={() => setActiveView('Calendar')}
                      className="text-xs font-bold text-[#2F486D] hover:underline"
                    >
                      View All
                    </button>
                  </div>

                  <div className="space-y-3.5">
                    {[
                      { label: 'AI Project Report', date: '22 Jun 2026' },
                      { label: 'DSA Assignment', date: '23 Jun 2026' },
                      { label: 'Aptitude Test', date: '24 Jun 2026' },
                      { label: 'Interview Round 1', date: '25 Jun 2026' },
                    ].map((item, i) => (
                      <div 
                        key={i} 
                        onClick={() => setActiveView('Calendar')}
                        className="flex items-center justify-between p-3.5 border border-[#F3EAE0] rounded-2xl hover:bg-[#F3EAE0]/30 transition-colors cursor-pointer group"
                      >
                        <p className="text-xs font-bold text-[#223148]">{item.label}</p>
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] font-black text-[#2F486D]">{item.date}</span>
                          <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#223148] transition-colors" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Column 3: Habits Tracker */}
              <div className="rounded-3xl p-6 border border-[#D2C7B8] bg-white shadow-sm flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <Activity className="w-5 h-5 text-[#2F486D]" />
                      <h3 className="text-md font-extrabold text-[#223148]">Habits Tracker</h3>
                    </div>
                    <select className="bg-white text-gray-500 text-[10px] font-bold border border-[#D2C7B8] py-1 px-2.5 rounded-full focus:outline-none cursor-pointer">
                      <option>This Week</option>
                      <option>This Month</option>
                    </select>
                  </div>

                  <div className="space-y-5">
                    {[
                      { label: 'Wake up early', val: '5/7', progress: 5/7, color: 'bg-[#223148]' },
                      { label: 'Exercise daily', val: '4/7', progress: 4/7, color: 'bg-[#2F486D]' },
                      { label: 'Read books', val: '6/7', progress: 6/7, color: 'bg-[#223148]' },
                      { label: 'No social media (2h)', val: '3/7', progress: 3/7, color: 'bg-[#2F486D]' },
                    ].map((item, i) => (
                      <div key={i} className="space-y-1.5 cursor-pointer group" onClick={() => setActiveView('Habits')}>
                        <div className="flex justify-between text-xs font-bold text-[#223148]">
                          <span className="group-hover:text-[#2F486D] transition-colors">{item.label}</span>
                          <span className="text-gray-400">{item.val}</span>
                        </div>
                        <div className="h-2 bg-[#F3EAE0] rounded-full overflow-hidden">
                          <div 
                            className={cn("h-full rounded-full transition-all duration-500", item.color)} 
                            style={{ width: `${item.progress * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>

            <div className="mt-12 text-center text-xs font-black text-[#223148]/60 uppercase tracking-widest p-4">
              © 2026 Taskaroa. All rights reserved. • Made with ❤️ for {profile.name}
            </div>
          </div>
        )}

        {activeView === 'Tasks' && <TasksView theme={profile.theme} />}
        {activeView === 'AI Assistant' && <AIAssistantView theme={profile.theme} userName={profile.name} />}
        {activeView === 'Journal' && <JournalView theme={profile.theme} userName={profile.name} />}
        {activeView === 'Notes' && <NotesView theme={profile.theme} userName={profile.name} />}
        {activeView === 'Calendar' && <CalendarView theme={profile.theme} />}
        {activeView === 'Schedule' && <ScheduleView theme={profile.theme} />}
        {activeView === 'Goals' && <GoalsView theme={profile.theme} />}
        {activeView === 'Habits' && <HabitsView theme={profile.theme} />}
        {activeView === 'Focus Mode' && (
          <FocusModeView 
            theme={profile.theme} 
            userName={profile.name}
            userGender={profile.gender}
            initialTaskTitle={focusTaskTitle}
            autoStartTimer={autoStartFocusTimer}
          />
        )}
        {activeView === 'Reminders' && <RemindersView theme={profile.theme} onNavigate={setActiveView} />}
        {activeView === 'Analytics' && <AnalyticsView theme={profile.theme} />}
        {activeView === 'Profile Settings' && <ProfileSettingsPage onClose={() => setActiveView('Dashboard')} />}

      </main>

      {/* First-time Welcome Tour Modal */}
      <WelcomeTourModal
        isOpen={isWelcomeTourOpen}
        onClose={() => {
          setIsWelcomeTourOpen(false);
          localStorage.setItem('taskaroa_first_time', 'false');
        }}
        userName={profile.name}
        gender={profile.gender}
        onGenderChange={(g) => setProfile(prev => ({ 
          ...prev, 
          gender: g,
          voiceSettings: { ...prev.voiceSettings, gender: g === 'male' ? 'male' : 'female' }
        }))}
        onNeverShowAgain={() => {
          setProfile(prev => ({ ...prev, neverShowTour: true }));
          localStorage.setItem('taskaroa_first_time', 'false');
        }}
      />

      {/* Streak Modal */}
      <StreakModal 
        isOpen={isStreakModalOpen} 
        onClose={() => setIsStreakModalOpen(false)} 
      />
    </div>
  );
}

