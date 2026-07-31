import React from 'react';
import { 
  LayoutGrid, 
  CheckSquare, 
  Sparkles,
  Clock,
  Calendar, 
  Target, 
  Activity, 
  Zap, 
  Bell, 
  BarChart2,
  Flame,
  BookOpen,
  FileText,
  User
} from 'lucide-react';
import { cn } from '../lib/utils';
import Logo from './Logo';
import { useProfile } from '../context/ProfileContext';
import { useData } from '../context/DataContext';
import { getWeekDaysStatus } from '../services/calendarService';

interface SidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
  openStreakModal?: () => void;
  userGender?: 'male' | 'female' | 'other';
  userName?: string;
  userRole?: string;
}

const navItems = [
  { icon: LayoutGrid, label: 'Dashboard' },
  { icon: CheckSquare, label: 'Tasks' },
  { icon: Sparkles, label: 'AI Assistant' },
  { icon: BookOpen, label: 'Journal' },
  { icon: FileText, label: 'Notes' },
  { icon: Clock, label: 'Schedule' },
  { icon: Calendar, label: 'Calendar' },
  { icon: Target, label: 'Goals' },
  { icon: Activity, label: 'Habits' },
  { icon: Zap, label: 'Focus Mode' },
  { icon: Bell, label: 'Reminders' },
  { icon: BarChart2, label: 'Analytics' },
  { icon: User, label: 'Profile Settings' },
];

export default function Sidebar({ 
  activeView, 
  setActiveView,
  openStreakModal,
}: SidebarProps) {
  const { profile } = useProfile();
  const { streak, completedDates } = useData();

  const userName = profile.name || 'User';
  const userRole = profile.role || 'student';

  const weekDays = getWeekDaysStatus(completedDates);

  return (
    <aside id="sidebar" className="w-[280px] bg-white border-r border-[#E5E7EB] flex flex-col h-screen sticky top-0 overflow-y-auto shrink-0 select-none scrollbar-none z-30 transition-colors duration-300">
      
      {/* Brand Header */}
      <div className="p-6 pb-4">
        <div className="cursor-pointer" onClick={() => setActiveView('Dashboard')}>
          <Logo size="sm" showText={true} className="!items-start" theme="light" />
        </div>
      </div>

      {/* 1. Navigation Menu */}
      <div className="px-4 flex-1">
        <nav className="space-y-1.5">
          {navItems.map((item, index) => {
            const isActive = activeView === item.label;
            return (
              <button
                key={index}
                onClick={() => setActiveView(item.label)}
                id={`sidebar-nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                className={cn(
                  "w-full flex items-center gap-4 px-4 py-2.5 rounded-xl transition-all duration-200 text-[15px] font-medium group cursor-pointer",
                  isActive 
                    ? "text-[#223148] font-bold shadow-sm bg-[#D2C7B8]/40 border border-[#D2C7B8]/60" 
                    : "text-[#4B5563] hover:bg-[#F3EAE0]/50 hover:text-[#223148]"
                )}
              >
                <item.icon className={cn(
                  "w-5 h-5 transition-colors shrink-0",
                  isActive ? "text-[#223148]" : "text-[#4B5563] group-hover:text-[#223148]"
                )} strokeWidth={1.75} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom widgets section */}
      <div className="p-4 mt-auto space-y-6 border-t border-[#E5E7EB]">
        
        {/* 2. Focus Streak Widget */}
        <div 
          onClick={openStreakModal}
          className="bg-white border border-[#D2C7B8] hover:border-[#2F486D] rounded-[20px] p-4 shadow-sm hover:shadow-md transition-all cursor-pointer relative overflow-hidden group"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-[#223148] font-semibold text-[15px]">
              <div className="w-6 h-6 rounded-full bg-[#2F486D] text-white flex items-center justify-center text-xs shadow-xs font-bold">
                🔥
              </div>
              <span className="font-extrabold text-[#223148]">Focus Streak</span>
            </div>
            <span className="text-[10px] font-bold text-[#2F486D] bg-[#D2C7B8]/40 px-2 py-0.5 rounded-full">
              View Stats
            </span>
          </div>
          
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-[30px] font-extrabold text-[#223148] leading-none">{streak} Days</span>
            <span className="text-[12px] font-medium text-[#2F486D]">Keep it up! ✨</span>
          </div>

          {/* Weekly tracker */}
          <div className="flex justify-between items-center mt-3.5 px-0.5">
            {weekDays.map((d, i) => (
              <div key={i} className="flex flex-col items-center gap-1.5">
                <span className="text-[11px] font-bold text-gray-400">{d.dayName.charAt(0)}</span>
                {d.status === 'completed' && (
                  <div className="w-6 h-6 rounded-full bg-[#2F486D] text-white flex items-center justify-center text-[10px] font-black shadow-xs" title={`${d.dayName}: Completed`}>
                    ✓
                  </div>
                )}
                {d.status === 'current' && (
                  <div className="w-6 h-6 rounded-full bg-[#223148] text-white flex items-center justify-center text-[11px] ring-2 ring-[#2F486D]/40 shadow-md font-bold" title={`${d.dayName}: Today`}>
                    🔥
                  </div>
                )}
                {d.status !== 'completed' && d.status !== 'current' && (
                  <div className="w-6 h-6 rounded-full border-2 border-dashed border-[#D2C7B8] bg-[#F3EAE0]/30" title={`${d.dayName}: Upcoming`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}

