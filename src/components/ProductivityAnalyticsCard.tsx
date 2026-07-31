import React, { useState } from 'react';
import { useProfile } from '../context/ProfileContext';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart2, 
  TrendingUp, 
  Sparkles, 
  ChevronDown, 
  Award,
  Zap,
  Info,
  ChevronRight,
  Layers,
  Heart,
  Clock,
  CheckCircle2,
  Hourglass,
  Calendar
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { cn } from '../lib/utils';

interface ProductivityAnalyticsCardProps {
  theme?: 'light' | 'dark' | 'contrast';
  userName?: string;
}

export default function ProductivityAnalyticsCard({ theme = 'light', userName = "Deepika S" }: ProductivityAnalyticsCardProps) {
  const { profile } = useProfile();
  const actualName = profile.name || userName || 'User';
  const [timeRange, setTimeRange] = useState<'This Week' | 'Last Week' | 'This Month'>('This Week');
  const [activeTab, setActiveTab] = useState<'focus' | 'tasks'>('focus');

  const dataMap = {
    'This Week': {
      score: 85,
      performance: '+6% from last week',
      chartData: [
        { day: 'Mon', focusTime: 4.5, tasksCompleted: 5 },
        { day: 'Tue', focusTime: 6.0, tasksCompleted: 7 },
        { day: 'Wed', focusTime: 3.5, tasksCompleted: 4 },
        { day: 'Thu', focusTime: 7.0, tasksCompleted: 8 },
        { day: 'Fri', focusTime: 5.5, tasksCompleted: 6 },
        { day: 'Sat', focusTime: 8.0, tasksCompleted: 10 },
        { day: 'Sun', focusTime: 9.5, tasksCompleted: 12 },
      ],
      insight: `Excellent momentum, ${actualName}! Your productivity peaked on Sunday with a massive 9.5-hour deep work session. You successfully completed 42 tasks this week, which is 6% higher than last week.`,
      stats: { milestonesCompleted: 14, focusHours: 44, activeDays: 7, rank: 'Productivity Champion' },
      motivation: {
        title: "Compounding Growth",
        quote: "Daily small habits compound silently into magnificent outcomes. Your focus is establishing a powerful rhythm for long-term success.",
        author: "Taskaroa Guide"
      }
    },
    'Last Week': {
      score: 79,
      performance: '+4% from previous week',
      chartData: [
        { day: 'Mon', focusTime: 5.0, tasksCompleted: 6 },
        { day: 'Tue', focusTime: 4.5, tasksCompleted: 5 },
        { day: 'Wed', focusTime: 5.2, tasksCompleted: 6 },
        { day: 'Thu', focusTime: 3.0, tasksCompleted: 3 },
        { day: 'Fri', focusTime: 6.0, tasksCompleted: 8 },
        { day: 'Sat', focusTime: 7.5, tasksCompleted: 9 },
        { day: 'Sun', focusTime: 6.8, tasksCompleted: 7 },
      ],
      insight: "A highly consistent week! You maintained an average focus score of 79%, with high-quality work blocks on Friday and Saturday. Keep up the steady pace.",
      stats: { milestonesCompleted: 11, focusHours: 38, activeDays: 6, rank: 'Focus Specialist' },
      motivation: {
        title: "Resilient Progress",
        quote: "Do not judge each day by the harvest you reap but by the seeds of discipline that you plant.",
        author: "Robert Louis Stevenson"
      }
    },
    'This Month': {
      score: 88,
      performance: '+12% from last month',
      chartData: [
        { day: 'W1', focusTime: 32.5, tasksCompleted: 38 },
        { day: 'W2', focusTime: 40.0, tasksCompleted: 45 },
        { day: 'W3', focusTime: 38.0, tasksCompleted: 42 },
        { day: 'W4', focusTime: 44.0, tasksCompleted: 52 },
      ],
      insight: "Outstanding performance this month! You logged over 154 total focus hours and completed 177 tasks. Your focus density is in the top 3% of all users.",
      stats: { milestonesCompleted: 52, focusHours: 154, activeDays: 27, rank: 'Efficiency Archon' },
      motivation: {
        title: "Unstoppable Rhythm",
        quote: "The momentum of consistency is unstoppable. Your monthly performance reflects a powerful, deliberate commitment to your objectives.",
        author: "Taskaroa Insights"
      }
    }
  };

  const currentData = dataMap[timeRange];
  const radius = 80;
  const strokeWidth = 14;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (currentData.score / 100) * circumference;

  return (
    <div 
      id="premium-saas-analytics-card" 
      className={cn(
        "bg-white border border-[#2F4156]/15 rounded-[24px] shadow-sm p-8 max-w-7xl mx-auto flex flex-col gap-8 transition-all duration-300 relative overflow-hidden text-left",
        theme === 'dark' && "bg-[#1E293B] border-slate-700 text-white shadow-none",
        theme === 'contrast' && "bg-black border-4 border-white text-white"
      )}
    >
      {/* Decorative Brand Background Glows */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#C8D9E6]/30 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-96 h-96 bg-[#F5EFEB]/25 rounded-full blur-3xl pointer-events-none" />

      {/* TOP HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-gray-100 z-10">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-tr from-[#2F4156] to-[#567C8D] rounded-2xl text-white shadow-md">
            <BarChart2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-2xl font-extrabold text-[#2F4156] font-display flex items-center gap-2">
              Productivity Overview
              <span className="text-xs bg-[#F5EFEB] text-[#2F4156] font-black px-2.5 py-1 rounded-full uppercase tracking-wider border border-[#2F4156]/10">
                AI Synced
              </span>
            </h3>
            <p className="text-gray-400 text-xs font-medium mt-0.5">
              Intelligent metrics detailing your focus, milestones, and cognitive resonance.
            </p>
          </div>
        </div>

        {/* Dropdown Selector */}
        <div className="relative self-start sm:self-auto group shrink-0">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="appearance-none bg-white border border-gray-200 text-[#2F4156] font-black text-xs py-2.5 pl-5 pr-11 rounded-full focus:outline-none focus:ring-2 focus:ring-[#2F4156]/40 shadow-sm hover:bg-gray-50 transition-all cursor-pointer"
          >
            <option value="This Week">This Week</option>
            <option value="Last Week">Last Week</option>
            <option value="This Month">This Month</option>
          </select>
          <ChevronDown className="w-4 h-4 text-[#567C8D] absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none transition-transform" />
        </div>
      </div>

      {/* CENTER SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center z-10 py-2">
        
        {/* Progress Ring */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center relative min-h-[260px]">
          
          <div className="relative w-[220px] h-[220px] flex items-center justify-center">
            
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
              <defs>
                <linearGradient id="premiumRingGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#2F4156" />
                  <stop offset="50%" stopColor="#567C8D" />
                  <stop offset="100%" stopColor="#C8D9E6" />
                </linearGradient>
              </defs>
              
              <circle
                cx="100"
                cy="100"
                r={radius}
                className="stroke-[#F5EFEB] dark:stroke-slate-700"
                strokeWidth={strokeWidth}
                fill="transparent"
              />
              
              <circle
                cx="100"
                cy="100"
                r={radius}
                stroke="url(#premiumRingGrad)"
                strokeWidth={strokeWidth}
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1)' }}
              />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
              <span className="text-5xl font-black text-[#2F4156] font-display tracking-tight">
                {currentData.score}%
              </span>
              <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.15em] mt-1.5">
                PRODUCTIVITY SCORE
              </span>
              <div className="flex items-center gap-1.5 mt-2 bg-[#F5EFEB] px-3 py-1 rounded-full border border-[#2F4156]/10">
                <TrendingUp className="w-3.5 h-3.5 text-[#2F4156]" />
                <span className="text-[10px] font-extrabold text-[#2F4156] whitespace-nowrap">
                  {currentData.performance}
                </span>
              </div>
            </div>

          </div>

          <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider text-center mt-4">
            Continuous deep-work tracking synced with Taskaroa engine
          </p>
        </div>

        {/* Right-hand 4 Icon-Badges Grid & Motivation Card */}
        <div className="lg:col-span-7 flex flex-col gap-5 justify-center">
          
          {/* 4 Icon-Badges Row/Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            
            {/* 1. Focus Time Badge */}
            <div className="bg-[#F5EFEB]/70 border border-[#2F4156]/15 rounded-2xl p-3.5 flex flex-col justify-between shadow-xs hover:bg-[#F5EFEB] transition-all">
              <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 rounded-xl bg-white border border-[#2F4156]/20 flex items-center justify-center text-[#2F4156]">
                  <Clock className="w-4 h-4 stroke-[2.5]" />
                </div>
                <span className="text-[9px] font-black uppercase tracking-wider text-[#567C8D]">Sync</span>
              </div>
              <div>
                <span className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider">Focus Time</span>
                <span className="text-base font-black text-[#2F4156] tracking-tight">{currentData.stats.focusHours}h</span>
              </div>
            </div>

            {/* 2. Pending Badge */}
            <div className="bg-[#F5EFEB]/70 border border-[#2F4156]/15 rounded-2xl p-3.5 flex flex-col justify-between shadow-xs hover:bg-[#F5EFEB] transition-all">
              <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 rounded-xl bg-white border border-[#2F4156]/20 flex items-center justify-center text-[#2F4156]">
                  <Hourglass className="w-4 h-4 stroke-[2.5]" />
                </div>
                <span className="text-[9px] font-black uppercase tracking-wider text-[#567C8D]">Queue</span>
              </div>
              <div>
                <span className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider">Pending</span>
                <span className="text-base font-black text-[#2F4156] tracking-tight">4 Tasks</span>
              </div>
            </div>

            {/* 3. Completed Badge */}
            <div className="bg-[#F5EFEB]/70 border border-[#2F4156]/15 rounded-2xl p-3.5 flex flex-col justify-between shadow-xs hover:bg-[#F5EFEB] transition-all">
              <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 rounded-xl bg-white border border-[#2F4156]/20 flex items-center justify-center text-[#2F4156]">
                  <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                </div>
                <span className="text-[9px] font-black uppercase tracking-wider text-[#567C8D]">Done</span>
              </div>
              <div>
                <span className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider">Completed</span>
                <span className="text-base font-black text-[#2F4156] tracking-tight">{currentData.stats.milestonesCompleted} Items</span>
              </div>
            </div>

            {/* 4. Score Badge */}
            <div className="bg-[#F5EFEB]/70 border border-[#2F4156]/15 rounded-2xl p-3.5 flex flex-col justify-between shadow-xs hover:bg-[#F5EFEB] transition-all">
              <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 rounded-xl bg-white border border-[#2F4156]/20 flex items-center justify-center text-[#2F4156]">
                  <TrendingUp className="w-4 h-4 stroke-[2.5]" />
                </div>
                <span className="text-[9px] font-black uppercase tracking-wider text-[#567C8D]">Index</span>
              </div>
              <div>
                <span className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider">Score</span>
                <span className="text-base font-black text-[#2F4156] tracking-tight">{currentData.score}%</span>
              </div>
            </div>

          </div>

          {/* Motivation Card */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            key={timeRange}
            className="relative bg-gradient-to-b from-white to-[#F5EFEB]/20 border border-gray-100 rounded-3xl p-5 shadow-sm overflow-hidden flex flex-col justify-between group"
          >
            {/* Elegant abstract flowing background wave curves */}
            <div className="absolute right-0 bottom-0 w-36 h-28 pointer-events-none z-0 opacity-15">
              <svg viewBox="0 0 120 90" className="w-full h-full object-cover select-none" xmlns="http://www.w3.org/2000/svg">
                <path d="M 0,80 Q 40,50 80,75 T 120,60 L 120,90 L 0,90 Z" fill="#567C8D" />
                <path d="M -10,85 Q 50,65 130,75 L 130,90 L -10,90 Z" fill="#2F4156" />
              </svg>
            </div>

            <div className="relative z-10 space-y-2">
              <div className="flex items-center gap-2 text-[#2F4156]">
                <Layers className="w-4 h-4 text-[#567C8D]" />
                <span className="text-[11px] font-black uppercase tracking-[0.2em]">{currentData.motivation.title}</span>
              </div>
              
              <blockquote className="text-xs font-medium text-[#2F4156]/90 italic leading-relaxed">
                "{currentData.motivation.quote}"
              </blockquote>
            </div>

            <div className="relative z-10 pt-3 border-t border-gray-100 flex items-center justify-between mt-3">
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">— {currentData.motivation.author}</span>
              <div className="flex items-center gap-1.5 text-[11px] font-black text-[#2F4156]">
                <span>Insight Powered</span>
                <div className="w-1.5 h-1.5 bg-[#567C8D] rounded-full animate-ping" />
              </div>
            </div>
          </motion.div>

        </div>

      </div>

      {/* BOTTOM SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6 border-t border-gray-100 z-10">
        
        {/* Graphs Area */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-4.5 h-4.5 text-[#567C8D]" />
              <h4 className="text-xs font-black text-[#2F4156]/80 uppercase tracking-wider">Productivity Analytics Chart</h4>
            </div>

            <div className="flex gap-1.5 bg-gray-100 p-1 rounded-full border border-gray-200">
              <button 
                onClick={() => setActiveTab('focus')}
                className={cn(
                  "px-3 py-1 rounded-full text-[10px] font-black transition-all cursor-pointer",
                  activeTab === 'focus' ? "bg-[#2F4156] text-white" : "text-gray-500 hover:text-[#2F4156]"
                )}
              >
                Focus Time
              </button>
              <button 
                onClick={() => setActiveTab('tasks')}
                className={cn(
                  "px-3 py-1 rounded-full text-[10px] font-black transition-all cursor-pointer",
                  activeTab === 'tasks' ? "bg-[#2F4156] text-white" : "text-gray-500 hover:text-[#2F4156]"
                )}
              >
                Completed Tasks
              </button>
            </div>
          </div>

          <div className="h-[210px] w-full bg-white rounded-2xl border border-gray-100 p-4">
            <ResponsiveContainer width="100%" height="100%">
              {activeTab === 'focus' ? (
                <AreaChart data={currentData.chartData} margin={{ left: -24, right: 10, top: 10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="chartFocusGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#567C8D" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#567C8D" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="day" 
                    stroke="#8E9E98" 
                    fontSize={10} 
                    tickLine={false} 
                    axisLine={false} 
                    dy={6}
                  />
                  <YAxis 
                    stroke="#8E9E98" 
                    fontSize={10} 
                    tickLine={false} 
                    axisLine={false} 
                  />
                  <Tooltip
                    contentStyle={{ 
                      background: 'rgba(255, 255, 255, 0.96)', 
                      borderRadius: '16px', 
                      border: '1px solid #E2E8F0', 
                      fontSize: '11px', 
                    }}
                    labelStyle={{ color: '#2F4156', fontWeight: 'bold' }}
                    formatter={(value) => [`${value} hrs`, 'Focus Duration']}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="focusTime" 
                    stroke="#2F4156" 
                    strokeWidth={2.5} 
                    fillOpacity={1} 
                    fill="url(#chartFocusGrad)" 
                  />
                </AreaChart>
              ) : (
                <BarChart data={currentData.chartData} margin={{ left: -24, right: 10, top: 10, bottom: 0 }}>
                  <XAxis 
                    dataKey="day" 
                    stroke="#8E9E98" 
                    fontSize={10} 
                    tickLine={false} 
                    axisLine={false} 
                    dy={6}
                  />
                  <YAxis 
                    stroke="#8E9E98" 
                    fontSize={10} 
                    tickLine={false} 
                    axisLine={false} 
                  />
                  <Tooltip
                    contentStyle={{ 
                      background: 'rgba(255, 255, 255, 0.96)', 
                      borderRadius: '16px', 
                      border: '1px solid #E2E8F0', 
                      fontSize: '11px'
                    }}
                    labelStyle={{ color: '#2F4156', fontWeight: 'bold' }}
                    formatter={(value) => [`${value} tasks`, 'Completed']}
                  />
                  <Bar dataKey="tasksCompleted" fill="#567C8D" radius={[4, 4, 0, 0]}>
                    {currentData.chartData.map((entry, idx) => (
                      <Cell 
                        key={`cell-${idx}`} 
                        fill={idx === currentData.chartData.length - 1 ? '#2F4156' : '#567C8D'} 
                        className="hover:opacity-85 transition-opacity cursor-pointer"
                      />
                    ))}
                  </Bar>
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
          <div className="flex justify-between items-center text-[10px] text-gray-400 font-bold px-1 uppercase">
            <span>Hover chart nodes to inspect discrete work periods</span>
            <span>All logs updated in real-time</span>
          </div>
        </div>

        {/* AI Insight and Milestone Statistics Panel */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          <div className="bg-[#F5EFEB]/30 border border-[#2F4156]/10 rounded-2xl p-5 shadow-sm relative overflow-hidden">
            <div className="absolute top-4 right-4 text-[#567C8D] animate-pulse">
              <Sparkles className="w-5 h-5" />
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-[#F5EFEB] rounded-xl text-[#2F4156] shrink-0 mt-0.5">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="space-y-2">
                <h5 className="text-[11px] font-black text-[#2F4156] uppercase tracking-[0.15em]">AI Productivity Co-Pilot</h5>
                <p className="text-xs text-gray-600 font-medium leading-relaxed">
                  {currentData.insight}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-white to-[#F5EFEB]/20 border border-gray-100 rounded-2xl p-5 shadow-sm flex flex-col justify-between min-h-[145px]">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-[#2F4156]">
                  <Layers className="w-5 h-5 text-[#567C8D]" />
                  <h5 className="text-[11px] font-black uppercase tracking-[0.15em]">Milestones & Efficiency</h5>
                </div>
                <p className="text-xs text-gray-500 font-bold">
                  Your productivity checkpoints completed during {timeRange}
                </p>
              </div>
              <span className="text-[10px] font-black bg-[#2F4156] text-white px-3 py-1 rounded-full uppercase tracking-wider">
                {currentData.stats.rank}
              </span>
            </div>

            <div className="flex items-center gap-4 mt-4 bg-white/60 backdrop-blur-sm border border-gray-100 p-3 rounded-xl">
              <div className="flex -space-x-1">
                {[...Array(Math.min(currentData.stats.milestonesCompleted, 8))].map((_, idx) => (
                  <div key={idx} className="w-7 h-7 rounded-full bg-[#C8D9E6] flex items-center justify-center text-[#2F4156] font-bold border border-white text-xs shadow-sm">
                    ✨
                  </div>
                ))}
                {currentData.stats.milestonesCompleted > 8 && (
                  <div className="w-7 h-7 rounded-full bg-[#2F4156] text-white flex items-center justify-center font-black border border-white text-[9px] shadow-sm">
                    +{currentData.stats.milestonesCompleted - 8}
                  </div>
                )}
              </div>
              
              <div className="flex-1 flex justify-between items-center text-xs font-bold text-[#2F4156]">
                <div>
                  <span className="block text-[#2F4156] font-black text-sm leading-none">
                    {currentData.stats.milestonesCompleted} Items
                  </span>
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wide">
                    Milestones Hit
                  </span>
                </div>
                
                <div className="text-right">
                  <span className="block text-[#2F4156] font-black text-sm leading-none">
                    {currentData.stats.focusHours}h
                  </span>
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wide">
                    Focus logged
                  </span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
