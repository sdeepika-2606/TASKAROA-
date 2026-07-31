import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import { useProfile } from '../context/ProfileContext';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell,
  BarChart,
  Bar
} from 'recharts';
import { 
  Clock, 
  CheckSquare, 
  Target, 
  Flame, 
  ArrowUpRight, 
  ChevronDown, 
  Download, 
  Award, 
  BookOpen, 
  Laptop, 
  ClipboardList, 
  PenTool, 
  Brain,
  Sparkles,
  TrendingUp,
  Layers
} from 'lucide-react';
import { cn } from '../lib/utils';

interface AnalyticsViewProps {
  theme: 'light' | 'dark' | 'contrast';
  userName?: string;
  userGender?: 'male' | 'female';
}

export default function AnalyticsView({ theme, userName = "Deepika S", userGender = "female" }: AnalyticsViewProps) {
  const { profile } = useProfile();
  const actualName = profile.name || userName || 'User';

  const [selectedRange, setSelectedRange] = useState<'Current Week' | 'Last Week' | 'Last Month'>('Current Week');
  const [isDownloading, setIsDownloading] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const showToast = (message: string) => {
    setSuccessToast(message);
    setTimeout(() => {
      setSuccessToast(null);
    }, 3000);
  };

  const kpiSparkline1 = [{ val: 10 }, { val: 12 }, { val: 11 }, { val: 14 }, { val: 13 }, { val: 16 }, { val: 18 }];
  const kpiSparkline2 = [{ val: 22 }, { val: 26 }, { val: 24 }, { val: 30 }, { val: 28 }, { val: 34 }, { val: 38 }];
  const kpiSparkline3 = [{ val: 78 }, { val: 80 }, { val: 82 }, { val: 80 }, { val: 84 }, { val: 83 }, { val: 86 }];
  const kpiSparkline4 = [{ val: 8 }, { val: 10 }, { val: 9 }, { val: 12 }, { val: 11 }, { val: 14 }, { val: 16 }];

  const weeklyFocusData = [
    { day: 'Mon', hours: 3.2 },
    { day: 'Tue', hours: 4.1 },
    { day: 'Wed', hours: 2.8 },
    { day: 'Thu', hours: 4.5 },
    { day: 'Fri', hours: 3.8 },
    { day: 'Sat', hours: 5.0 },
    { day: 'Sun', hours: 6.2 },
  ];

  const taskCompletionData = [
    { name: 'Completed', value: 38 },
    { name: 'In Progress', value: 5 },
    { name: 'Overdue', value: 2 },
  ];
  const completionColors = ['#2F4156', '#567C8D', '#C8D9E6'];

  const focusDistributionData = [
    { name: 'Deep Focus', value: 45 },
    { name: 'Study', value: 30 },
    { name: 'Review', value: 15 },
    { name: 'Break Time', value: 10 },
  ];
  const distributionColors = ['#2F4156', '#567C8D', '#C8D9E6', '#F5EFEB'];

  const dailyFocusBreakdown = [
    { day: 'Mon', hours: 3.2 },
    { day: 'Tue', hours: 4.1 },
    { day: 'Wed', hours: 2.8 },
    { day: 'Thu', hours: 4.5 },
    { day: 'Fri', hours: 3.8 },
    { day: 'Sat', hours: 5.0 },
    { day: 'Sun', hours: 6.2 },
  ];

  const productivityCategories = [
    { name: 'Study / Learning', pct: 85, color: 'bg-[#2F4156]', icon: BookOpen, val: '20.4 hrs' },
    { name: 'Work / Projects', pct: 70, color: 'bg-[#567C8D]', icon: Laptop, val: '16.8 hrs' },
    { name: 'Reading / Review', pct: 60, color: 'bg-[#C8D9E6]', icon: ClipboardList, val: '14.4 hrs' },
    { name: 'Planning', pct: 45, color: 'bg-slate-300', icon: PenTool, val: '10.8 hrs' },
  ];

  const handleDownloadPDF = () => {
    setIsDownloading(true);
    try {
      const doc = new jsPDF();
      const primaryColor = '#2F4156';
      
      const formatName = (str: string) => {
        if (!str) return '';
        return str.split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
      };
      const formattedName = formatName(actualName);

      // PDF Watermark Background (Abstract Geometry)
      const drawWatermark = () => {
        const watermarkColor = [200, 217, 230]; // Secondary Sky Blue
        doc.setDrawColor(watermarkColor[0], watermarkColor[1], watermarkColor[2]);
        doc.setFillColor(watermarkColor[0], watermarkColor[1], watermarkColor[2]);
        
        const cx = 105;
        const cy = 140;
        
        doc.setLineWidth(3);
        doc.circle(cx, cy, 35, 'S');
        
        doc.setLineWidth(1.2);
        doc.line(cx, cy - 35, cx, cy - 31);
        doc.line(cx, cy + 35, cx, cy + 31);
        
        doc.setLineWidth(2.2);
        doc.line(cx, cy, cx, cy - 20);
        doc.line(cx, cy, cx + 15, cy + 10);
      };

      drawWatermark();
      
      // Header
      doc.setFillColor(47, 65, 86); // Navy
      doc.rect(0, 0, 210, 40, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(22);
      doc.text('TASKAROA PRODUCTIVITY BOARD', 15, 18);
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.text('WEEKLY PERFORMANCE & FOCUS ANALYTICS REPORT', 15, 28);
      
      doc.setTextColor(100, 116, 139);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text('Report Details:', 15, 52);
      
      doc.setFont('helvetica', 'normal');
      doc.text(`User Name: ${formattedName}`, 15, 60);
      doc.text('Period: Current Week (Mon - Sun)', 15, 66);
      doc.text(`Date Generated: ${new Date().toLocaleDateString()}`, 15, 72);
      
      doc.text(`Productivity Score: 92/100`, 110, 60);
      doc.text('Level status: Level 12 Focus Master', 110, 66);
      doc.text('Badge Awarded: Elite Productivity Badge', 110, 72);
      
      doc.setDrawColor(229, 231, 235);
      doc.setLineWidth(0.5);
      doc.line(15, 78, 195, 78);
      
      // Executive analysis
      doc.setTextColor(47, 65, 86);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.text('1. Executive Analysis & Insights', 15, 88);
      
      doc.setTextColor(55, 65, 81);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      const summaryText = `Dear ${formattedName}, your overall productivity quotient of 92% places you in the top 5% of active users this week. Your discipline across focus routines is compounding quietly, expanding your task completion efficiency. Analysis of your daily patterns suggests your engagement coefficient has improved by +10 points compared to last week's metrics.`;
      const splitSummary = doc.splitTextToSize(summaryText, 180);
      doc.text(splitSummary, 15, 96);
      
      // Table
      doc.setFillColor(245, 239, 235); // Beige background
      doc.rect(15, 128, 180, 8, 'F');
      doc.setTextColor(47, 65, 86);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.text('METRIC CATEGORY', 20, 133);
      doc.text('WEEKLY TOTAL / VALUE', 95, 133);
      doc.text('BENCHMARK vs LAST WEEK', 150, 133);
      
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(55, 65, 81);
      doc.text('Total Deep Focus Time', 20, 143);
      doc.text('24 hours 36 minutes', 95, 143);
      doc.text('+12% (Increased)', 150, 143);
      
      doc.text('Successful Tasks Completed', 20, 151);
      doc.text('38 Objectives', 95, 151);
      doc.text('+15% (Increased)', 150, 151);
      
      doc.text('Task Completion Ratio', 20, 159);
      doc.text('86% Total', 95, 159);
      doc.text('+5% Ratio Gain', 150, 159);
      
      doc.text('Focus Sessions Triggered', 20, 167);
      doc.text('16 Completed Blocks', 95, 167);
      doc.text('+14% Growth Rate', 150, 167);
      
      doc.setDrawColor(229, 231, 235);
      doc.line(15, 172, 195, 172);
      
      doc.save(`Taskaroa_Weekly_Report_${formattedName.replace(/\s+/g, '_')}.pdf`);
      showToast('Successfully downloaded your personalized Weekly Activity Report PDF!');
    } catch (error) {
      console.error('Failed to generate PDF', error);
      showToast('Error generating PDF.');
    }
    setIsDownloading(false);
  };

  const scoreValue = 92;
  const radius = 55;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (scoreValue / 100) * circumference;

  return (
    <div className="space-y-8 animate-fade-in relative text-left select-none">
      
      {/* Toast Alert */}
      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#2F4156] text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-[#C8D9E6]/20 animate-bounce">
          <div className="w-5 h-5 bg-[#567C8D] rounded-full flex items-center justify-center text-xs font-black text-white">✓</div>
          <p className="text-xs font-bold">{successToast}</p>
        </div>
      )}

      {/* Header and Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-[36px] font-black text-[#2F4156] tracking-tight leading-none mb-1">
            Executive Analytics
          </h2>
          <p className="text-[#567C8D] text-sm font-bold">
            Review focus time, task completion, and productivity insights for <span className="underline font-extrabold text-[#2F4156]">{actualName}</span>.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative group">
            <select 
              value={selectedRange}
              onChange={(e) => {
                setSelectedRange(e.target.value as any);
                showToast(`Switched view to ${e.target.value}`);
              }}
              className="appearance-none bg-white border border-gray-200 text-[#2F4156] font-extrabold text-xs py-2.5 pl-4 pr-10 rounded-full focus:outline-none focus:ring-1 focus:ring-[#2F4156] shadow-sm cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <option value="Current Week">Current Week</option>
              <option value="Last Week">Last Week</option>
              <option value="Last Month">Last Month</option>
            </select>
            <ChevronDown className="w-4 h-4 text-[#567C8D] absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <button 
            onClick={handleDownloadPDF}
            disabled={isDownloading}
            className="bg-[#2F4156] hover:bg-[#1E293B] text-white transition-colors shadow-sm px-5 py-2.5 rounded-full text-xs font-extrabold flex items-center gap-2 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            {isDownloading ? 'Downloading...' : 'Download PDF'}
          </button>
        </div>
      </div>

      {/* Main Grid Area */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        
        {/* Full Span Content */}
        <div className="xl:col-span-12 space-y-8">
          
          {/* KPI Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* KPI 1 */}
            <div className="bg-white border border-gray-150 rounded-3xl p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between h-[155px]">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none block mb-1">Focus Time</span>
                  <span className="text-2xl font-black text-[#2F4156]">24h 36m</span>
                </div>
                <div className="p-2.5 bg-[#C8D9E6]/20 rounded-2xl text-[#2F4156]">
                  <Clock className="w-5 h-5" />
                </div>
              </div>

              <div className="flex items-center justify-between gap-2 pt-4">
                <div className="flex items-center gap-1 text-[#567C8D] font-extrabold text-xs">
                  <ArrowUpRight className="w-4 h-4 shrink-0" />
                  <span>+12% <span className="text-[10px] text-gray-400 font-bold ml-0.5">vs last week</span></span>
                </div>
                <div className="w-[80px] h-[35px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={kpiSparkline1}>
                      <Area type="monotone" dataKey="val" stroke="#2F4156" strokeWidth={2} fill="#C8D9E6" fillOpacity={0.4} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* KPI 2 */}
            <div className="bg-white border border-gray-150 rounded-3xl p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between h-[155px]">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none block mb-1">Tasks Completed</span>
                  <span className="text-2xl font-black text-[#2F4156]">38</span>
                </div>
                <div className="p-2.5 bg-[#C8D9E6]/20 rounded-2xl text-[#567C8D]">
                  <CheckSquare className="w-5 h-5" />
                </div>
              </div>

              <div className="flex items-center justify-between gap-2 pt-4">
                <div className="flex items-center gap-1 text-[#567C8D] font-extrabold text-xs">
                  <ArrowUpRight className="w-4 h-4 shrink-0" />
                  <span>+15% <span className="text-[10px] text-gray-400 font-bold ml-0.5">yield</span></span>
                </div>
                <div className="w-[80px] h-[35px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={kpiSparkline2}>
                      <Area type="monotone" dataKey="val" stroke="#567C8D" strokeWidth={2} fill="#C8D9E6" fillOpacity={0.4} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* KPI 3 */}
            <div className="bg-white border border-gray-150 rounded-3xl p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between h-[155px]">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none block mb-1">Completion Rate</span>
                  <span className="text-2xl font-black text-[#2F4156]">86%</span>
                </div>
                <div className="p-2.5 bg-[#C8D9E6]/20 rounded-2xl text-[#2F4156]">
                  <Target className="w-5 h-5" />
                </div>
              </div>

              <div className="flex items-center justify-between gap-2 pt-4">
                <div className="flex items-center gap-1 text-[#567C8D] font-extrabold text-xs">
                  <ArrowUpRight className="w-4 h-4 shrink-0" />
                  <span>+5% <span className="text-[10px] text-gray-400 font-bold ml-0.5">ratio</span></span>
                </div>
                <div className="w-[80px] h-[35px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={kpiSparkline3}>
                      <Area type="monotone" dataKey="val" stroke="#2F4156" strokeWidth={2} fill="#C8D9E6" fillOpacity={0.4} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* KPI 4 */}
            <div className="bg-white border border-gray-150 rounded-3xl p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between h-[155px]">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none block mb-1">Focus Sessions</span>
                  <span className="text-2xl font-black text-[#2F4156]">16</span>
                </div>
                <div className="p-2.5 bg-[#C8D9E6]/20 rounded-2xl text-amber-500">
                  <Flame className="w-5 h-5 fill-amber-500" />
                </div>
              </div>

              <div className="flex items-center justify-between gap-2 pt-4">
                <div className="flex items-center gap-1 text-[#567C8D] font-extrabold text-xs">
                  <ArrowUpRight className="w-4 h-4 shrink-0" />
                  <span>+14% <span className="text-[10px] text-gray-400 font-bold ml-0.5">growth</span></span>
                </div>
                <div className="w-[80px] h-[35px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={kpiSparkline4}>
                      <Area type="monotone" dataKey="val" stroke="#C8D9E6" strokeWidth={2} fill="#F5EFEB" fillOpacity={0.4} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

          </div>

          {/* Three Column Charts row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Card 1 */}
            <div className="bg-white border border-gray-150 rounded-3xl p-5 shadow-sm flex flex-col justify-between h-[340px]">
              <div>
                <h3 className="text-xs font-black text-[#2F4156] uppercase tracking-wider mb-1">Weekly Focus Time</h3>
                <p className="text-[11px] font-bold text-gray-400 mb-4 uppercase">Smooth trend of deep work blocks</p>
                
                <div className="h-[180px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={weeklyFocusData} margin={{ left: -15, right: 10, top: 10, bottom: 0 }}>
                      <defs>
                        <linearGradient id="focusFill" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#567C8D" stopOpacity={0.35}/>
                          <stop offset="95%" stopColor="#567C8D" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="day" stroke="#9CA3AF" fontSize={10} tickLine={false} axisLine={false} />
                      <YAxis stroke="#9CA3AF" fontSize={10} tickLine={false} axisLine={false} />
                      <Tooltip 
                        contentStyle={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #C8D9E6', fontSize: '11px', fontWeight: 'bold' }}
                        labelStyle={{ color: '#2F4156' }}
                      />
                      <Area type="monotone" dataKey="hours" stroke="#2F4156" strokeWidth={2.5} fillOpacity={1} fill="url(#focusFill)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center gap-2 text-xs font-bold text-[#2F4156]">
                <Layers className="w-4 h-4 text-[#567C8D] shrink-0" />
                <span>You were most focused on <strong className="text-[#2F4156]">Sunday</strong>.</span>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white border border-gray-150 rounded-3xl p-5 shadow-sm flex flex-col justify-between h-[340px]">
              <div>
                <h3 className="text-xs font-black text-[#2F4156] uppercase tracking-wider mb-1">Task Completion</h3>
                <p className="text-[11px] font-bold text-gray-400 mb-2 uppercase">Status of active objectives</p>
                
                <div className="h-[175px] relative flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={taskCompletionData}
                        cx="50%"
                        cy="50%"
                        innerRadius={52}
                        outerRadius={70}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {taskCompletionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={completionColors[index % completionColors.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ borderRadius: '12px', fontSize: '11px', fontWeight: 'bold' }} />
                    </PieChart>
                  </ResponsiveContainer>
                  
                  <div className="absolute text-center">
                    <p className="text-xl font-black text-[#2F4156] leading-none">38</p>
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-0.5">Tasks</p>
                  </div>
                </div>

                <div className="flex justify-center gap-2 mt-2">
                  {taskCompletionData.map((entry, i) => (
                    <div key={entry.name} className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: completionColors[i] }} />
                      <span className="text-[9px] font-bold text-gray-500">{entry.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center gap-2 text-xs font-bold text-[#2F4156]">
                <Award className="w-4 h-4 text-[#567C8D]" />
                <span>Great job! You completed <strong className="text-[#2F4156]">84%</strong> of tasks.</span>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white border border-gray-150 rounded-3xl p-5 shadow-sm flex flex-col justify-between h-[340px]">
              <div>
                <h3 className="text-xs font-black text-[#2F4156] uppercase tracking-wider mb-1">Time Distribution</h3>
                <p className="text-[11px] font-bold text-gray-400 mb-2 uppercase">Core categories allocation</p>
                
                <div className="h-[175px] relative flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={focusDistributionData}
                        cx="50%"
                        cy="50%"
                        innerRadius={52}
                        outerRadius={70}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {focusDistributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={distributionColors[index % distributionColors.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ borderRadius: '12px', fontSize: '11px', fontWeight: 'bold' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="grid grid-cols-2 gap-x-2 gap-y-1 mt-2 px-1">
                  {focusDistributionData.map((entry, i) => (
                    <div key={entry.name} className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: distributionColors[i] }} />
                      <span className="text-[9px] font-black text-gray-500 uppercase">{entry.name} {entry.value}%</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center gap-2 text-xs font-bold text-[#2F4156]">
                <Brain className="w-4 h-4 text-[#567C8D]" />
                <span><strong className="text-[#2F4156]">Deep Focus</strong> dominates productivity.</span>
              </div>
            </div>

          </div>

          {/* Bottom Breakdown Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            <div className="bg-white border border-gray-150 rounded-3xl p-5 shadow-sm flex flex-col justify-between h-[320px]">
              <div>
                <h3 className="text-xs font-black text-[#2F4156] uppercase tracking-wider mb-1">Daily Focus Breakdown</h3>
                <p className="text-[11px] font-bold text-gray-400 mb-4 uppercase">Hours logged per weekday</p>
                
                <div className="h-[180px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dailyFocusBreakdown} margin={{ left: -20, right: 5, top: 10, bottom: 0 }}>
                      <XAxis dataKey="day" stroke="#9CA3AF" fontSize={10} tickLine={false} axisLine={false} />
                      <YAxis stroke="#9CA3AF" fontSize={10} tickLine={false} axisLine={false} />
                      <Tooltip 
                        contentStyle={{ background: '#FFFFFF', borderRadius: '12px', border: '1px solid #C8D9E6', fontSize: '11px' }}
                        cursor={{ fill: '#F5EFEB' }}
                      />
                      <Bar dataKey="hours" fill="#2F4156" radius={[6, 6, 0, 0]}>
                        {dailyFocusBreakdown.map((entry, idx) => (
                          <Cell 
                            key={`cell-${idx}`} 
                            fill={idx % 2 === 0 ? '#2F4156' : '#567C8D'} 
                            className="hover:opacity-80 transition-opacity cursor-pointer"
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <p className="text-[10px] text-gray-400 font-bold text-center uppercase tracking-wider">Hover bars for detailed timestamps</p>
            </div>

            <div className="bg-white border border-gray-150 rounded-3xl p-5 shadow-sm flex flex-col justify-between h-[320px]">
              <div>
                <h3 className="text-xs font-black text-[#2F4156] uppercase tracking-wider mb-1">Productivity Score</h3>
                <p className="text-[11px] font-bold text-gray-400 mb-4 uppercase">Real-time engagement coefficient</p>
                
                <div className="flex items-center justify-center h-[160px] relative">
                  <svg className="w-36 h-36 transform -rotate-90">
                    <circle
                      cx="72"
                      cy="72"
                      r={radius}
                      stroke="#E5E7EB"
                      strokeWidth={strokeWidth}
                      fill="transparent"
                    />
                    <circle
                      cx="72"
                      cy="72"
                      r={radius}
                      stroke="url(#gaugeGrad)"
                      strokeWidth={strokeWidth}
                      fill="transparent"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                    />
                    <defs>
                      <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#2F4156" />
                        <stop offset="100%" stopColor="#567C8D" />
                      </linearGradient>
                    </defs>
                  </svg>
                  
                  <div className="absolute text-center">
                    <span className="text-[44px] font-black text-[#2F4156] leading-none">{scoreValue}</span>
                    <span className="text-[10px] font-black text-[#567C8D] tracking-wider block uppercase mt-0.5">Excellent</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center gap-1.5 text-xs font-extrabold text-[#2F4156] bg-[#F5EFEB]/30 py-2 px-3 rounded-2xl">
                <TrendingUp className="w-4 h-4" />
                <span>+10 points vs last week</span>
              </div>
            </div>

            <div className="bg-white border border-gray-150 rounded-3xl p-5 shadow-sm flex flex-col justify-between h-[320px]">
              <div>
                <h3 className="text-xs font-black text-[#2F4156] uppercase tracking-wider mb-1">Top Categories</h3>
                <p className="text-[11px] font-bold text-gray-400 mb-4 uppercase">Task distribution efficiency</p>
                
                <div className="space-y-3.5">
                  {productivityCategories.map((cat, i) => (
                    <div key={i} className="space-y-1">
                      <div className="flex items-center justify-between text-xs font-bold text-[#2F4156]">
                        <div className="flex items-center gap-2">
                          <cat.icon className="w-3.5 h-3.5 text-[#567C8D] shrink-0" />
                          <span>{cat.name}</span>
                        </div>
                        <span className="text-gray-400 text-[10px]">{cat.pct}% ({cat.val})</span>
                      </div>
                      
                      <div className="h-2 bg-[#F5EFEB] rounded-full overflow-hidden">
                        <div 
                          className={cn("h-full rounded-full transition-all duration-700", cat.color)} 
                          style={{ width: `${cat.pct}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider text-center mt-2">Aggregated automatically using tags</p>
            </div>

          </div>

          {/* Insight Banner */}
          <div className="bg-gradient-to-r from-[#2F4156] to-[#567C8D] rounded-3xl p-6 relative overflow-hidden flex flex-col md:flex-row md:items-center md:justify-between gap-6 shadow-lg border border-white/10">
            <div className="flex items-start gap-4 relative z-10">
              <div className="p-3 bg-white/10 rounded-2xl text-white mt-1 shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-white text-md font-extrabold tracking-tight mb-1">Weekly Insight</h4>
                <p className="text-slate-100 text-xs font-bold max-w-xl leading-relaxed">
                  You are building an exceptionally strong productivity habit. Increasing deep focus sessions by one per day could improve your completion rate even further.
                </p>
              </div>
            </div>

            <div className="relative z-10 shrink-0">
              <button 
                onClick={() => showToast('Analyzing historic metrics for detailed report...')}
                className="bg-white hover:bg-gray-50 text-[#2F4156] px-5 py-2.5 rounded-xl text-xs font-extrabold transition-all shadow-md cursor-pointer"
              >
                View Detailed Report
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
