import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Target, 
  Plus, 
  Check, 
  Trash2, 
  Milestone, 
  Award, 
  TrendingUp, 
  Flame, 
  Briefcase, 
  BookOpen, 
  Activity, 
  Sparkles, 
  Calendar, 
  Compass, 
  Clock, 
  ExternalLink
} from 'lucide-react';

interface SubGoal {
  id: string;
  title: string;
  category: 'Practice' | 'Interview' | 'System Design' | 'Projects' | 'Revision' | 'General';
  dueDate: string;
  completed: boolean;
}

interface Goal {
  id: string;
  title: string;
  icon: string;
  category: 'Academic' | 'Career' | 'Personal' | 'Health';
  startDate: string;
  targetDate: string;
  priority: 'High' | 'Medium' | 'Low';
  estimatedCompletion: string;
  subGoals: SubGoal[];
  accentColor: string;
}

interface GoalsViewProps {
  theme: 'light' | 'dark' | 'contrast';
}

export default function GoalsView({ theme }: GoalsViewProps) {
  // Goals State
  const [goals, setGoals] = useState<Goal[]>([
    {
      id: '1',
      title: 'Prepare for Placement Interviews',
      icon: '💼',
      category: 'Career',
      startDate: '2026-05-01',
      targetDate: '2026-09-15',
      priority: 'High',
      estimatedCompletion: '4 Months',
      accentColor: '#2F4156',
      subGoals: [
        { id: '1-1', title: 'Practice 50 Leetcode Problems', category: 'Practice', dueDate: '2026-07-10', completed: true },
        { id: '1-2', title: 'Complete Mock Interview Round 1', category: 'Interview', dueDate: '2026-07-25', completed: true },
        { id: '1-3', title: 'Refine System Design principles', category: 'System Design', dueDate: '2026-08-05', completed: false },
        { id: '1-4', title: 'Build End-to-End AI Projects', category: 'Projects', dueDate: '2026-08-20', completed: true },
        { id: '1-5', title: 'Company Specific Interviews Mock', category: 'Revision', dueDate: '2026-09-01', completed: false }
      ]
    },
    {
      id: '2',
      title: 'Complete Data Structures Mastery',
      icon: '🧠',
      category: 'Academic',
      startDate: '2026-06-01',
      targetDate: '2026-08-30',
      priority: 'High',
      estimatedCompletion: '3 Months',
      accentColor: '#567C8D',
      subGoals: [
        { id: '2-1', title: 'Finish Tree algorithms', category: 'Practice', dueDate: '2026-06-25', completed: true },
        { id: '2-2', title: 'Solve 20 Dynamic Programming questions', category: 'Practice', dueDate: '2026-07-15', completed: false }
      ]
    },
    {
      id: '3',
      title: 'Daily Fitness Journey',
      icon: '🏃‍♂️',
      category: 'Health',
      startDate: '2026-01-01',
      targetDate: '2026-12-31',
      priority: 'Medium',
      estimatedCompletion: 'Ongoing',
      accentColor: '#2F4156',
      subGoals: [
        { id: '3-1', title: 'Reach 10,000 steps daily', category: 'General', dueDate: '2026-12-31', completed: true },
        { id: '3-2', title: 'Cardio sessions 3x weekly', category: 'General', dueDate: '2026-12-31', completed: false }
      ]
    },
    {
      id: '4',
      title: 'Read 24 Books This Year',
      icon: '📖',
      category: 'Personal',
      startDate: '2026-01-01',
      targetDate: '2026-12-31',
      priority: 'Low',
      estimatedCompletion: '12 Months',
      accentColor: '#567C8D',
      subGoals: [
        { id: '4-1', title: 'Finish reading "Atomic Habits"', category: 'Revision', dueDate: '2026-07-10', completed: true },
        { id: '4-2', title: 'Start reading "Deep Work"', category: 'General', dueDate: '2026-08-10', completed: false }
      ]
    }
  ]);

  const [selectedGoalId, setSelectedGoalId] = useState<string>('1');
  const [activeTab, setActiveTab] = useState<'Milestones' | 'Timeline' | 'Analytics' | 'Notes' | 'Attachments'>('Milestones');

  const [showNewGoalModal, setShowNewGoalModal] = useState(false);
  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [newGoalCategory, setNewGoalCategory] = useState<'Academic' | 'Career' | 'Personal' | 'Health'>('Career');
  const [newGoalIcon, setNewGoalIcon] = useState('🎯');
  const [newGoalPriority, setNewGoalPriority] = useState<'High' | 'Medium' | 'Low'>('Medium');
  const [newGoalTargetDate, setNewGoalTargetDate] = useState('2026-12-31');

  const [newMilestoneTitle, setNewMilestoneTitle] = useState('');
  const [newMilestoneCategory, setNewMilestoneCategory] = useState<'Practice' | 'Interview' | 'System Design' | 'Projects' | 'Revision' | 'General'>('Practice');
  const [newMilestoneDueDate, setNewMilestoneDueDate] = useState('2026-08-15');

  const [notif, setNotif] = useState<string | null>(null);
  const triggerNotif = (msg: string) => {
    setNotif(msg);
    setTimeout(() => setNotif(null), 3500);
  };

  const selectedGoal = useMemo(() => {
    return goals.find(g => g.id === selectedGoalId) || goals[0];
  }, [goals, selectedGoalId]);

  const selectedGoalProgress = useMemo(() => {
    if (!selectedGoal || selectedGoal.subGoals.length === 0) return 0;
    const completed = selectedGoal.subGoals.filter(s => s.completed).length;
    return Math.round((completed / selectedGoal.subGoals.length) * 100);
  }, [selectedGoal]);

  const stats = useMemo(() => {
    const totalGoals = goals.length;
    let totalMilestones = 0;
    let completedMilestones = 0;
    
    goals.forEach(g => {
      totalMilestones += g.subGoals.length;
      completedMilestones += g.subGoals.filter(s => s.completed).length;
    });

    const overallProgress = totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0;

    return {
      totalGoals,
      milestonesCompleted: `${completedMilestones}/${totalMilestones}`,
      overallProgress,
      streak: 12
    };
  }, [goals]);

  const categoryCounts = useMemo(() => {
    const counts = { Academic: 0, Career: 0, Personal: 0, Health: 0 };
    goals.forEach(g => {
      if (counts[g.category] !== undefined) {
        counts[g.category]++;
      }
    });
    return counts;
  }, [goals]);

  const milestoneCategoryStats = useMemo(() => {
    const dist = { Practice: 0, Interview: 0, 'System Design': 0, Projects: 0, Revision: 0, General: 0 };
    goals.forEach(g => {
      g.subGoals.forEach(sg => {
        if (dist[sg.category] !== undefined) {
          dist[sg.category]++;
        }
      });
    });

    const total = Object.values(dist).reduce((a, b) => a + b, 0);
    return Object.entries(dist).map(([name, count]) => {
      const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
      let color = '#2F4156';
      if (name === 'Practice') color = '#2F4156';
      else if (name === 'Interview') color = '#567C8D';
      else if (name === 'System Design') color = '#C8D9E6';
      else if (name === 'Projects') color = '#A7F3D0';
      else if (name === 'Revision') color = '#888888';
      else color = '#E2E8F0';

      return { name, count, percentage, color };
    }).filter(item => item.count > 0);
  }, [goals]);

  // Clean Milestone Stage visual (No trees, no seeds)
  const renderGrowthStage = (progress: number) => {
    let label = 'Phase 1: Initiation';
    let detail = 'Complete milestones to advance your core track.';

    if (progress >= 100) {
      label = 'Phase 5: Mastered & Completed';
      detail = 'Outstanding! All goals and sub-tasks are fully completed.';
    } else if (progress >= 80) {
      label = 'Phase 4: High Proficiency';
      detail = 'Almost there! Final stretch of milestones remaining.';
    } else if (progress >= 50) {
      label = 'Phase 3: Steady Execution';
      detail = 'Sustaining great habits and consistent progress.';
    } else if (progress >= 20) {
      label = 'Phase 2: Active Tracking';
      detail = 'First set of milestones unlocked. Keep pushing forward!';
    }

    return (
      <div className="flex items-center gap-3 bg-[#F5EFEB]/40 border border-[#2F4156]/15 p-3.5 rounded-2xl relative overflow-hidden">
        <div className="text-xl shrink-0">🎯</div>
        <div className="text-left">
          <span className="text-[10px] text-[#567C8D] font-bold uppercase block tracking-wider leading-none">Milestone Stage</span>
          <strong className="text-xs font-black text-[#2F4156] mt-1 block">{label}</strong>
          <span className="text-[10px] text-gray-500 leading-none block mt-0.5">{detail}</span>
        </div>
      </div>
    );
  };

  const handleCreateGoalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoalTitle.trim()) return;

    const newG: Goal = {
      id: Date.now().toString(),
      title: newGoalTitle,
      icon: newGoalIcon,
      category: newGoalCategory,
      startDate: '2026-06-30',
      targetDate: newGoalTargetDate,
      priority: newGoalPriority,
      estimatedCompletion: 'Custom Plan',
      accentColor: newGoalCategory === 'Career' ? '#2F4156' : newGoalCategory === 'Academic' ? '#567C8D' : newGoalCategory === 'Health' ? '#2F4156' : '#567C8D',
      subGoals: []
    };

    setGoals(prev => [newG, ...prev]);
    setSelectedGoalId(newG.id);
    setShowNewGoalModal(false);
    setNewGoalTitle('');
    triggerNotif(`Successfully created new goal track: "${newGoalTitle}"!`);
  };

  const handleAddMilestoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMilestoneTitle.trim()) return;

    const newSg: SubGoal = {
      id: Date.now().toString(),
      title: newMilestoneTitle,
      category: newMilestoneCategory,
      dueDate: newMilestoneDueDate,
      completed: false
    };

    setGoals(prev => prev.map(g => {
      if (g.id === selectedGoalId) {
        return {
          ...g,
          subGoals: [...g.subGoals, newSg]
        };
      }
      return g;
    }));

    setNewMilestoneTitle('');
    triggerNotif(`Added milestone: "${newMilestoneTitle}" to track!`);
  };

  const handleToggleMilestone = (milestoneId: string) => {
    setGoals(prev => prev.map(g => {
      if (g.id === selectedGoalId) {
        return {
          ...g,
          subGoals: g.subGoals.map(sg => {
            if (sg.id === milestoneId) {
              const state = !sg.completed;
              triggerNotif(state ? "Milestone checked off! Outstanding progress!" : "Milestone set back to pending.");
              return { ...sg, completed: state };
            }
            return sg;
          })
        };
      }
      return g;
    }));
  };

  const handleDeleteGoal = (id: string) => {
    const title = goals.find(g => g.id === id)?.title;
    setGoals(prev => prev.filter(g => g.id !== id));
    if (selectedGoalId === id) {
      setSelectedGoalId(goals[0]?.id || '');
    }
    triggerNotif(`Removed goal track: "${title}"`);
  };

  return (
    <div className="space-y-6 max-w-[1720px] mx-auto pb-12 font-sans select-none animate-fade-in text-gray-800">
      
      <AnimatePresence>
        {notif && (
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-24 right-8 z-50 p-4 rounded-xl bg-[#2F4156] border border-[#C8D9E6]/20 text-white shadow-xl flex items-center gap-3 max-w-sm font-bold text-xs"
          >
            <Sparkles className="w-5 h-5 text-[#C8D9E6] animate-pulse" />
            <span>{notif}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Block with Premium Palette */}
      <div className="relative bg-gradient-to-r from-[#F5EFEB] via-white to-[#C8D9E6]/30 p-6 rounded-[24px] border border-[#2F4156]/10 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-xs font-bold text-[#567C8D] uppercase tracking-wider flex items-center gap-1.5 mb-1">
            <Target className="w-4.5 h-4.5 text-[#567C8D]" /> Goals & Milestone Tracking
          </span>
          <h2 className="text-3xl font-extrabold font-display text-[#2F4156] tracking-tight">
            Milestone & Goals Hub
          </h2>
          <p className="text-gray-500 text-sm mt-0.5">
            Define long-term achievements, track milestones, and visualize your progress analytically.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => setShowNewGoalModal(true)}
            className="py-2.5 px-4 bg-[#2F4156] hover:bg-[#1E293B] text-white text-xs font-extrabold rounded-xl transition-all shadow-md hover:shadow-lg flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5px]" /> New Goal Track
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        
        {/* LEFT SIDEBAR: Goal Overview & Goal Collections */}
        <div className="xl:col-span-4 space-y-6">
          
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white p-4.5 rounded-2xl border border-[#2F4156]/10 shadow-sm relative overflow-hidden">
              <div className="w-9 h-9 rounded-xl bg-[#F5EFEB] flex items-center justify-center shrink-0 mb-2">
                <Target className="w-4.5 h-4.5 text-[#2F4156]" />
              </div>
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block leading-none">Total Goals</span>
              <strong className="text-2xl font-black text-[#2F4156] mt-1 block">{stats.totalGoals}</strong>
              <div className="flex items-center gap-0.5 text-[9px] text-[#567C8D] font-bold mt-1">
                <TrendingUp className="w-3 h-3" /> Active Tracks
              </div>
            </div>

            <div className="bg-white p-4.5 rounded-2xl border border-[#2F4156]/10 shadow-sm relative overflow-hidden">
              <div className="w-9 h-9 rounded-xl bg-[#C8D9E6]/30 flex items-center justify-center shrink-0 mb-2">
                <Milestone className="w-4.5 h-4.5 text-[#2F4156]" />
              </div>
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block leading-none">Completed</span>
              <strong className="text-2xl font-black text-[#2F4156] mt-1 block">{stats.milestonesCompleted}</strong>
              <div className="flex items-center gap-0.5 text-[9px] text-[#567C8D] font-bold mt-1">
                <Check className="w-3 h-3" /> Atomic Tasks
              </div>
            </div>

            <div className="bg-white p-4.5 rounded-2xl border border-[#2F4156]/10 shadow-sm relative overflow-hidden">
              <div className="w-9 h-9 rounded-xl bg-[#F5EFEB] flex items-center justify-center shrink-0 mb-2">
                <Sparkles className="w-4.5 h-4.5 text-[#2F4156]" />
              </div>
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block leading-none">Overall Progress</span>
              <strong className="text-2xl font-black text-[#2F4156] mt-1 block">{stats.overallProgress}%</strong>
              <div className="flex items-center gap-0.5 text-[9px] text-[#567C8D] font-bold mt-1">
                <Sparkles className="w-3 h-3" /> Growth Rate
              </div>
            </div>

            <div className="bg-white p-4.5 rounded-2xl border border-[#2F4156]/10 shadow-sm relative overflow-hidden">
              <div className="w-9 h-9 rounded-xl bg-[#C8D9E6]/30 flex items-center justify-center shrink-0 mb-2">
                <Flame className="w-4.5 h-4.5 text-[#567C8D]" />
              </div>
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block leading-none">Streak</span>
              <strong className="text-2xl font-black text-[#2F4156] mt-1 block">{stats.streak} Days</strong>
              <div className="flex items-center gap-0.5 text-[9px] text-[#567C8D] font-bold mt-1">
                <Flame className="w-3 h-3 text-[#567C8D]" /> Consistency
              </div>
            </div>
          </div>

          {/* Goal Tracks Listing */}
          <div className="bg-white rounded-[24px] border border-[#2F4156]/10 shadow-sm p-5 space-y-4">
            <div className="flex justify-between items-center pb-1 border-b border-gray-100">
              <h3 className="text-xs font-bold text-[#2F4156] uppercase tracking-wider">Goal Tracks</h3>
              <span className="text-[10px] font-bold text-gray-400">Select to Expand</span>
            </div>

            <div className="space-y-3">
              {goals.map(g => {
                const isSelected = selectedGoalId === g.id;
                const completedCount = g.subGoals.filter(s => s.completed).length;
                const totalCount = g.subGoals.length;
                const progressPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

                return (
                  <div 
                    key={g.id}
                    onClick={() => setSelectedGoalId(g.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer relative group ${
                      isSelected 
                        ? 'bg-[#F5EFEB]/50 border-[#2F4156] shadow-sm' 
                        : 'border-gray-100 hover:border-[#C8D9E6] bg-white'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{g.icon}</span>
                        <h4 className="font-extrabold text-xs text-[#2F4156] group-hover:text-[#1E293B] leading-tight">
                          {g.title}
                        </h4>
                      </div>

                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteGoal(g.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-500 transition-opacity p-1 shrink-0"
                        title="Delete Goal Track"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="space-y-1 pt-1">
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="text-gray-400 font-bold">{completedCount}/{totalCount} Milestones</span>
                        <span className="font-black text-[#2F4156]">{progressPct}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          style={{ width: `${progressPct}%`, backgroundColor: g.accentColor }}
                          className="h-full transition-all duration-500" 
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Goal Categories Cards */}
          <div className="bg-white rounded-[24px] border border-[#2F4156]/10 shadow-sm p-5 space-y-3">
            <h3 className="text-xs font-bold text-[#2F4156] uppercase tracking-wider pb-1 border-b border-gray-100">Goal Categories</h3>
            <div className="grid grid-cols-2 gap-2 text-left">
              <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                <BookOpen className="w-4.5 h-4.5 text-slate-500 mb-1" />
                <span className="text-[10px] text-gray-400 font-bold block">Academic</span>
                <strong className="text-sm text-[#2F4156] font-black">{categoryCounts.Academic} Goals</strong>
              </div>

              <div className="p-3 bg-[#C8D9E6]/20 border border-[#C8D9E6]/40 rounded-xl">
                <Briefcase className="w-4.5 h-4.5 text-[#567C8D] mb-1" />
                <span className="text-[10px] text-gray-400 font-bold block">Career</span>
                <strong className="text-sm text-[#2F4156] font-black">{categoryCounts.Career} Goals</strong>
              </div>

              <div className="p-3 bg-[#F5EFEB]/50 border border-[#F5EFEB] rounded-xl">
                <Award className="w-4.5 h-4.5 text-[#2F4156] mb-1" />
                <span className="text-[10px] text-gray-400 font-bold block">Personal</span>
                <strong className="text-sm text-[#2F4156] font-black">{categoryCounts.Personal} Goals</strong>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                <Activity className="w-4.5 h-4.5 text-slate-500 mb-1" />
                <span className="text-[10px] text-gray-400 font-bold block">Health</span>
                <strong className="text-sm text-[#2F4156] font-black">{categoryCounts.Health} Goals</strong>
              </div>
            </div>
          </div>

        </div>

        {/* CENTER PANEL: Selected Goal Details & Milestone Checklist */}
        <div className="xl:col-span-8 space-y-6">
          
          {selectedGoal ? (
            <div className="relative bg-gradient-to-r from-[#2F4156] to-[#1E293B] text-white rounded-[24px] shadow-lg p-6 overflow-hidden">
              <div className="relative z-10 flex flex-col md:flex-row justify-between gap-6">
                <div className="space-y-4 flex-1 text-left">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl bg-white/20 p-2 rounded-xl backdrop-blur-md">
                      {selectedGoal.icon}
                    </span>
                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-widest bg-[#C8D9E6] text-[#2F4156] px-2.5 py-0.5 rounded-full">
                        {selectedGoal.category} Track
                      </span>
                      <h3 className="text-xl md:text-2xl font-black font-display mt-1 leading-snug text-white">
                        {selectedGoal.title}
                      </h3>
                    </div>
                  </div>

                  {/* Metadata Row */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-1 text-xs">
                    <div>
                      <span className="text-white/60 block">Start Date</span>
                      <span className="font-extrabold flex items-center gap-1 mt-0.5">
                        <Calendar className="w-3.5 h-3.5 text-[#C8D9E6]" /> {selectedGoal.startDate}
                      </span>
                    </div>

                    <div>
                      <span className="text-white/60 block">Target Date</span>
                      <span className="font-extrabold flex items-center gap-1 mt-0.5">
                        <Calendar className="w-3.5 h-3.5 text-[#C8D9E6]" /> {selectedGoal.targetDate}
                      </span>
                    </div>

                    <div>
                      <span className="text-white/60 block">Priority</span>
                      <span className="font-extrabold flex items-center gap-1.5 mt-0.5">
                        <span className="w-2 h-2 rounded-full bg-amber-400" />
                        {selectedGoal.priority} Priority
                      </span>
                    </div>

                    <div>
                      <span className="text-white/60 block">Time Span</span>
                      <span className="font-extrabold flex items-center gap-1 mt-0.5">
                        <Clock className="w-3.5 h-3.5 text-[#C8D9E6]" /> {selectedGoal.estimatedCompletion}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2">
                    {renderGrowthStage(selectedGoalProgress)}
                  </div>
                </div>

                {/* Progress Circle Ring */}
                <div className="shrink-0 flex flex-col items-center justify-center bg-white/10 backdrop-blur-md p-4 rounded-3xl border border-white/20 w-36">
                  <div className="relative w-24 h-24 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="48" cy="48" r="40" className="stroke-white/20" strokeWidth="6" fill="transparent" />
                      <circle 
                        cx="48" 
                        cy="48" 
                        r="40" 
                        className="stroke-[#C8D9E6] transition-all duration-500" 
                        strokeWidth="7" 
                        fill="transparent" 
                        strokeDasharray={2 * Math.PI * 40}
                        strokeDashoffset={2 * Math.PI * 40 * (1 - selectedGoalProgress / 100)}
                        strokeLinecap="round"
                      />
                    </svg>
                    <span className="absolute text-base font-black text-white">{selectedGoalProgress}%</span>
                  </div>
                  <span className="text-[10px] text-[#C8D9E6] uppercase font-bold tracking-wider mt-2">Completed</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center bg-white border rounded-[24px]">
              <Target className="w-12 h-12 mx-auto text-gray-300 mb-2" />
              <p className="text-sm text-gray-400 italic">No Goal Track is currently selected.</p>
              <p className="text-xs text-gray-300">Click a track on the left menu directory to launch details.</p>
            </div>
          )}

          {/* Interactive tabs */}
          <div className="bg-white rounded-[24px] border border-[#2F4156]/10 shadow-sm p-4">
            <div className="flex bg-gray-50 p-1.5 rounded-xl border border-gray-100 overflow-x-auto">
              {(['Milestones', 'Timeline', 'Analytics', 'Notes', 'Attachments'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-2 px-4 text-xs font-bold rounded-lg transition-all shrink-0 ${
                    activeTab === tab 
                      ? 'bg-[#2F4156] text-white shadow-xs' 
                      : 'text-gray-400 hover:text-gray-700'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="pt-4 text-left">
              {activeTab === 'Milestones' && (
                <div className="space-y-4">
                  <div className="space-y-2.5 max-h-[300px] overflow-y-auto custom-scrollbar pr-1">
                    {selectedGoal.subGoals.length === 0 ? (
                      <div className="text-center py-10">
                        <Compass className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                        <p className="text-xs text-gray-400 italic">No milestones declared for this track yet.</p>
                      </div>
                    ) : (
                      selectedGoal.subGoals.map(sg => {
                        const isCompleted = sg.completed;
                        return (
                          <div 
                            key={sg.id}
                            className={`flex items-center justify-between p-3.5 rounded-xl border transition-all text-xs ${
                              isCompleted 
                                ? 'bg-[#F5EFEB]/50 border-[#2F4156]/20 text-[#2F4156]' 
                                : 'bg-white border-gray-100 text-gray-700 hover:border-[#2F4156]/30'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <button 
                                onClick={() => handleToggleMilestone(sg.id)}
                                className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                                  isCompleted 
                                    ? 'bg-[#567C8D] border-transparent text-white' 
                                    : 'border-gray-300 hover:border-[#2F4156] text-transparent'
                                }`}
                              >
                                <Check className="w-3.5 h-3.5 stroke-[2.5px]" />
                              </button>

                              <div className="space-y-0.5">
                                <p className={`font-bold flex items-center gap-1.5 ${isCompleted ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                                  {sg.title} 
                                  {isCompleted && <span className="text-[10px] text-[#2F4156] animate-pulse">✨</span>}
                                </p>
                                
                                <div className="flex items-center gap-2">
                                  <span className="text-[9px] text-gray-400 font-semibold flex items-center gap-1">
                                    <Calendar className="w-3 h-3 text-gray-300" /> Due {sg.dueDate}
                                  </span>
                                  <span className="text-[8px] font-bold px-1.5 py-0.2 rounded-md bg-gray-100 text-gray-500 uppercase">
                                    {sg.category}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${
                                isCompleted 
                                  ? 'bg-[#F5EFEB] text-[#2F4156] border-[#C8D9E6]' 
                                  : 'bg-amber-50 text-amber-600 border-amber-200'
                              }`}>
                                {isCompleted ? 'Completed' : 'In Progress'}
                              </span>

                              <button 
                                onClick={() => {
                                  setGoals(prev => prev.map(g => {
                                    if (g.id === selectedGoalId) {
                                      return {
                                        ...g,
                                        subGoals: g.subGoals.filter(sub => sub.id !== sg.id)
                                      };
                                    }
                                    return g;
                                  }));
                                  triggerNotif(`Removed milestone: "${sg.title}"`);
                                }}
                                className="text-gray-300 hover:text-red-500 transition-colors p-1"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>

                  {/* Add Milestone Form */}
                  <form onSubmit={handleAddMilestoneSubmit} className="pt-3 border-t border-gray-100 space-y-3">
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Expand Checklist</p>
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                      <div className="md:col-span-5">
                        <input
                          type="text"
                          placeholder="e.g., Practice 20 dynamic programming sums"
                          value={newMilestoneTitle}
                          onChange={e => setNewMilestoneTitle(e.target.value)}
                          className="w-full py-2 px-3 border border-gray-200 focus:border-[#2F4156] rounded-xl text-xs outline-none font-medium"
                          required
                        />
                      </div>

                      <div className="md:col-span-3">
                        <select
                          value={newMilestoneCategory}
                          onChange={e => setNewMilestoneCategory(e.target.value as any)}
                          className="w-full py-2 px-2.5 border border-gray-200 focus:border-[#2F4156] rounded-xl text-xs outline-none font-bold text-gray-500 bg-white"
                        >
                          <option value="Practice">Practice 📝</option>
                          <option value="Interview">Interview 🤝</option>
                          <option value="System Design">System Design 🏛️</option>
                          <option value="Projects">Projects 🚀</option>
                          <option value="Revision">Revision 📖</option>
                          <option value="General">General 🌱</option>
                        </select>
                      </div>

                      <div className="md:col-span-2">
                        <input
                          type="date"
                          value={newMilestoneDueDate}
                          onChange={e => setNewMilestoneDueDate(e.target.value)}
                          className="w-full py-1.5 px-2 border border-gray-200 focus:border-[#2F4156] rounded-xl text-xs outline-none font-medium"
                          required
                        />
                      </div>

                      <div className="md:col-span-2">
                        <button
                          type="submit"
                          className="w-full py-2 bg-[#2F4156] hover:bg-[#1E293B] text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-4.5 h-4.5 stroke-[2.5px]" /> Add
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              )}

              {activeTab === 'Timeline' && (
                <div className="py-6 text-center space-y-4">
                  <Clock className="w-10 h-10 text-[#2F4156] mx-auto opacity-70" />
                  <div className="max-w-md mx-auto space-y-1">
                    <p className="text-sm font-bold text-gray-700">Milestone Time Stream</p>
                    <p className="text-xs text-gray-400">Review chronologically grouped milestones scheduled for this quarter.</p>
                  </div>
                </div>
              )}

              {activeTab === 'Analytics' && (
                <div className="py-6 text-center space-y-4">
                  <TrendingUp className="w-10 h-10 text-[#567C8D] mx-auto" />
                  <div className="max-w-md mx-auto space-y-1">
                    <p className="text-sm font-bold text-gray-700">Predictive Goal Completion Rates</p>
                    <p className="text-xs text-gray-400">Based on your dynamic checklist consistency, Taskaroa forecasts a 94% chance of completing this goal ahead of schedule!</p>
                  </div>
                </div>
              )}

              {activeTab === 'Notes' && (
                <div className="space-y-3">
                  <p className="text-xs font-bold text-[#2F4156] uppercase tracking-wider">Goal Notes & Reminders</p>
                  <textarea 
                    placeholder="Refined principles: practice dynamic program matrices, revise system designs weekly, practice Mock Interviews with senior engineers..."
                    rows={4}
                    className="w-full p-3 text-xs border border-gray-200 rounded-xl outline-none focus:border-[#2F4156] resize-none leading-relaxed font-medium"
                  />
                  <div className="flex justify-end">
                    <button 
                      onClick={() => triggerNotif("Notes saved successfully!")}
                      className="py-1.5 px-3 bg-[#2F4156] text-white text-xs font-bold rounded-lg hover:bg-[#1E293B]"
                    >
                      Save Notes
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'Attachments' && (
                <div className="py-8 text-center border-2 border-dashed border-gray-100 rounded-2xl">
                  <ExternalLink className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-xs text-gray-400">Drag & drop files here to attach to this goal track.</p>
                </div>
              )}
            </div>
          </div>

        </div>

      </div>

      <div className="flex items-center justify-center gap-2 py-4 text-center">
        <span className="text-xs text-gray-400 font-medium italic select-none">
          "Discipline is the bridge between goals and accomplishments."
        </span>
      </div>

      {/* ====================================================
          CREATIVE NEW GOAL MODAL
          ==================================================== */}
      <AnimatePresence>
        {showNewGoalModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-[24px] border border-[#2F4156]/10 p-6 max-w-md w-full shadow-2xl relative text-left"
            >
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <h3 className="text-sm font-extrabold text-[#2F4156] font-display uppercase flex items-center gap-1.5">
                  <Target className="w-4.5 h-4.5 text-[#567C8D]" /> Establish Goal Track
                </h3>
                <button 
                  onClick={() => setShowNewGoalModal(false)}
                  className="text-gray-400 hover:text-gray-600 font-black text-sm"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateGoalSubmit} className="space-y-4 pt-3 text-xs">
                <div>
                  <label className="block text-gray-500 font-semibold mb-1">Goal Track Title</label>
                  <input
                    type="text"
                    value={newGoalTitle}
                    onChange={e => setNewGoalTitle(e.target.value)}
                    placeholder="e.g., Master Advanced Algorithms"
                    className="w-full py-2 px-3 border border-gray-200 focus:border-[#2F4156] rounded-xl outline-none font-medium"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-gray-500 font-semibold mb-1">Category</label>
                    <select
                      value={newGoalCategory}
                      onChange={e => setNewGoalCategory(e.target.value as any)}
                      className="w-full py-2 px-2.5 border border-gray-200 focus:border-[#2F4156] rounded-xl outline-none font-bold text-gray-500 bg-white"
                    >
                      <option value="Career">Career 💻</option>
                      <option value="Academic">Academic 📚</option>
                      <option value="Personal">Personal 🌱</option>
                      <option value="Health">Health 🏃‍♂️</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-500 font-semibold mb-1">Launcher Icon</label>
                    <select
                      value={newGoalIcon}
                      onChange={e => setNewGoalIcon(e.target.value)}
                      className="w-full py-2 px-2.5 border border-gray-200 focus:border-[#2F4156] rounded-xl outline-none font-bold text-gray-500 bg-white"
                    >
                      <option value="🎯">🎯 Target</option>
                      <option value="💼">💼 Work Bag</option>
                      <option value="📚">📚 Books</option>
                      <option value="🧠">🧠 Neural Brain</option>
                      <option value="🏃‍♂️">🏃‍♂️ Athletics</option>
                      <option value="📖">📖 Notebook</option>
                      <option value="🎨">🎨 Creative Brush</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-gray-500 font-semibold mb-1">Priority</label>
                    <div className="flex gap-1.5">
                      {(['High', 'Medium', 'Low'] as const).map(p => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setNewGoalPriority(p)}
                          className={`flex-1 py-1.5 rounded-lg border font-bold text-center ${
                            newGoalPriority === p 
                              ? 'bg-[#F5EFEB] border-[#2F4156] text-[#2F4156]' 
                              : 'border-gray-100 hover:bg-gray-50 text-gray-400'
                          }`}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-500 font-semibold mb-1">Target Date</label>
                    <input
                      type="date"
                      value={newGoalTargetDate}
                      onChange={e => setNewGoalTargetDate(e.target.value)}
                      className="w-full py-1.5 px-2 border border-gray-200 focus:border-[#2F4156] rounded-xl outline-none font-medium"
                      required
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-100 flex justify-end gap-2">
                  <button 
                    type="button"
                    onClick={() => setShowNewGoalModal(false)}
                    className="py-2 px-4 bg-gray-50 hover:bg-gray-100 text-gray-500 font-bold rounded-xl transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="py-2 px-4 bg-[#2F4156] hover:bg-[#1E293B] text-white font-bold rounded-xl transition-all shadow-md cursor-pointer"
                  >
                    Establish Track
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
