import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  ArrowRight, 
  ArrowLeft,
  X, 
  LayoutDashboard, 
  CheckSquare, 
  TreePine, 
  MessageSquare, 
  Volume2, 
  UserRound,
  Play,
  EyeOff
} from 'lucide-react';
import { LandingForestIllustration } from './ForestDeerIllustration';
import { useSpeech } from '../hooks/useSpeech';

interface WelcomeTourModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  gender: 'male' | 'female' | 'other';
  onGenderChange: (gender: 'male' | 'female') => void;
  onNeverShowAgain?: () => void;
}

const TOUR_STEPS = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    icon: LayoutDashboard,
    badge: '1. Dashboard',
    description: 'This is your Dashboard. Here you can manage your daily productivity.',
    speechPrompt: 'This is your Dashboard. Here you can manage your daily productivity.',
    previewCard: {
      title: 'Dashboard Overview',
      accent: 'from-emerald-600 to-[#0E3D30]',
      details: ['Daily Productivity Metrics', 'Focus Time Counters', 'Quick Workflow Stats']
    }
  },
  {
    id: 'ai-assistant',
    title: 'AI Assistant',
    icon: MessageSquare,
    badge: '2. AI Assistant',
    description: 'This is your AI Assistant. It helps you organize your work.',
    speechPrompt: 'This is your AI Assistant. It helps you organize your work.',
    previewCard: {
      title: 'AI Voice & Chat Companion',
      accent: 'from-[#1A3C34] to-emerald-800',
      details: ['Smart Task Generation', 'Voice Commands & Summaries', 'Schedule Recommendations']
    }
  },
  {
    id: 'important-tasks',
    title: "Today's Important Tasks",
    icon: CheckSquare,
    badge: '3. Important Tasks',
    description: "This section shows today's important tasks.",
    speechPrompt: "This section shows today's important tasks.",
    previewCard: {
      title: 'High Priority Deadlines',
      accent: 'from-amber-600 to-orange-700',
      details: ['Priority Flags & Time Tags', 'Streak Multiplier Rewards', 'One-Click Focus Mode']
    }
  },
  {
    id: 'forest-growth',
    title: 'Forest Growth',
    icon: TreePine,
    badge: '4. Forest Growth',
    description: 'This is your Forest Growth. The more productive you are, the bigger your forest becomes.',
    speechPrompt: 'This is your Forest Growth. The more productive you are, the bigger your forest becomes.',
    previewCard: {
      title: 'Taskaroa Sanctuary',
      accent: 'from-[#0E8F6A] to-teal-900',
      details: ['365-Day Productivity Heatmap', 'Unlockable Trees & Wildlife', 'Visual Consistency Streaks']
    }
  }
];

export default function WelcomeTourModal({
  isOpen,
  onClose,
  userName,
  gender,
  onGenderChange,
  onNeverShowAgain
}: WelcomeTourModalProps) {
  const [inWalkthrough, setInWalkthrough] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const { speak, stop, isSpeaking } = useSpeech();

  const currentStep = TOUR_STEPS[currentStepIndex];

  // Auto-greeting when modal opens in choice mode
  useEffect(() => {
    if (isOpen && !inWalkthrough) {
      const selectedGender = gender === 'male' ? 'male' : 'female';
      const greetingText = "Welcome to Taskaroa! Would you like a quick guided tour?";
      speak(greetingText, { gender: selectedGender, enabled: true });
    } else if (!isOpen) {
      stop();
    }
  }, [isOpen, inWalkthrough, gender, speak, stop]);

  // Speak exact step prompt when walkthrough step changes
  useEffect(() => {
    if (inWalkthrough && currentStep) {
      const selectedGender = gender === 'male' ? 'male' : 'female';
      speak(currentStep.speechPrompt, { gender: selectedGender, enabled: true });
    }
  }, [inWalkthrough, currentStepIndex, gender, speak]);

  const handleStartTour = () => {
    setInWalkthrough(true);
    setCurrentStepIndex(0);
  };

  const handleCloseModal = () => {
    stop();
    onClose();
  };

  const handleNeverShow = () => {
    stop();
    if (onNeverShowAgain) onNeverShowAgain();
    onClose();
  };

  if (!isOpen) return null;

  const StepIcon = currentStep.icon;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-[#0B1512]/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 160 }}
          className="w-full max-w-4xl bg-[#F4F9F6] rounded-[32px] overflow-hidden border border-[#D8F3DC] shadow-2xl flex flex-col md:flex-row relative min-h-[540px]"
        >
          {/* Close Button */}
          <button
            type="button"
            onClick={handleCloseModal}
            className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-black/20 hover:bg-black/50 text-white flex items-center justify-center transition-all cursor-pointer shadow-md"
          >
            <X className="w-6 h-6" />
          </button>

          {/* LEFT PANEL: Forest Watermark & Feature Spotlight */}
          <div className="w-full md:w-[45%] p-8 flex flex-col justify-between items-center relative overflow-hidden bg-[#F4F9F6]">
            <div className="w-full flex items-center justify-between text-[#1A3C34] relative z-10">
              <div className="font-mono text-xl font-black tracking-[0.3em] uppercase">
                TASKAROA
              </div>
              {isSpeaking && (
                <div className="flex items-center gap-1.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-1 rounded-full border border-emerald-300 animate-pulse">
                  <Volume2 className="w-3.5 h-3.5 text-emerald-600 animate-bounce" />
                  AI Speaking
                </div>
              )}
            </div>

            {/* Dynamic Spotlight Card during Walkthrough */}
            {inWalkthrough ? (
              <motion.div
                key={currentStep.id}
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className={`w-full my-auto p-5 rounded-2xl bg-gradient-to-br ${currentStep.previewCard.accent} text-white shadow-xl relative overflow-hidden border-2 border-white/20`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center font-bold">
                    <StepIcon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider bg-white/20 px-2.5 py-1 rounded-full text-white">
                    Feature Highlight
                  </span>
                </div>
                <h4 className="text-lg font-black text-white">{currentStep.previewCard.title}</h4>
                <div className="mt-3 space-y-1.5">
                  {currentStep.previewCard.details.map((detail, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-emerald-100 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-300 shrink-0" />
                      {detail}
                    </div>
                  ))}
                </div>
              </motion.div>
            ) : (
              <div className="w-full h-[180px] z-10 pointer-events-none opacity-90 relative my-auto">
                <LandingForestIllustration />
              </div>
            )}

            <div className="text-[11px] font-semibold text-emerald-800/60 text-center relative z-10">
              Voice Guided Orientation • Powered by Web Speech API
            </div>
          </div>

          {/* RIGHT PANEL: Dark Green Interactive Guide Column */}
          <div className="w-full md:w-[55%] bg-[#0E3D30] text-white p-8 md:p-10 flex flex-col justify-between relative overflow-hidden">
            
            {/* Header / Guide Indicator */}
            <div className="flex items-center justify-between mb-4 relative z-30">
              <div className="flex items-center gap-1.5 bg-white/10 text-[#B7E4C7] px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" /> Taskaroa AI Tour
              </div>

              {inWalkthrough && (
                <span className="text-xs font-black text-[#95D5B2]">
                  Step {currentStepIndex + 1} of {TOUR_STEPS.length}
                </span>
              )}
            </div>

            {/* Main Content Area */}
            <div className="relative z-30 flex-1 flex flex-col justify-center my-4">
              <AnimatePresence mode="wait">
                {!inWalkthrough ? (
                  /* INITIAL CHOICE POPUP */
                  <motion.div
                    key="initialChoice"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6 text-center"
                  >
                    <div>
                      <h3 className="text-2xl md:text-3xl font-black text-white leading-tight font-display">
                        Welcome to Taskaroa!
                      </h3>
                      <p className="text-[#95D5B2] text-sm font-semibold mt-2">
                        Would you like a quick guided tour?
                      </p>
                    </div>

                    {/* AI Guide Voice Selector */}
                    <div className="bg-[#05221B]/80 border border-white/10 rounded-2xl p-4 space-y-2.5 text-left">
                      <p className="text-[11px] font-bold text-gray-300">
                        Select AI Voice Character:
                      </p>
                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={() => onGenderChange('female')}
                          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                            gender === 'female'
                              ? 'bg-[#B7E4C7] text-[#1A3C34] border-transparent shadow-md font-extrabold'
                              : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                          }`}
                        >
                          <UserRound className="w-3.5 h-3.5 shrink-0" />
                          Female Voice
                        </button>
                        <button
                          type="button"
                          onClick={() => onGenderChange('male')}
                          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                            gender === 'male'
                              ? 'bg-[#B7E4C7] text-[#1A3C34] border-transparent shadow-md font-extrabold'
                              : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                          }`}
                        >
                          <UserRound className="w-3.5 h-3.5 shrink-0" />
                          Male Voice
                        </button>
                      </div>
                    </div>

                    {/* Options Buttons */}
                    <div className="space-y-3 pt-2">
                      <button
                        type="button"
                        onClick={handleStartTour}
                        className="w-full bg-[#B7E4C7] hover:bg-[#95D5B2] text-[#1A3C34] font-black py-3.5 px-6 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-wider cursor-pointer"
                      >
                        <Play className="w-4 h-4 fill-current" />
                        Start Tour
                      </button>

                      <div className="grid grid-cols-2 gap-2.5">
                        <button
                          type="button"
                          onClick={handleCloseModal}
                          className="bg-white/10 hover:bg-white/15 text-white font-bold py-3 rounded-xl text-xs transition-all border border-white/10 cursor-pointer"
                        >
                          Skip for Now
                        </button>
                        <button
                          type="button"
                          onClick={handleNeverShow}
                          className="bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white font-bold py-3 rounded-xl text-xs transition-all border border-white/5 flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <EyeOff className="w-3.5 h-3.5" />
                          Never Show Again
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  /* WALKTHROUGH STEP */
                  <motion.div
                    key={`step-${currentStepIndex}`}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-5"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-12 h-12 rounded-2xl bg-[#B7E4C7]/20 text-[#B7E4C7] flex items-center justify-center shrink-0 border border-[#B7E4C7]/30 shadow-md">
                        <StepIcon className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="text-[10px] font-black text-[#95D5B2] uppercase tracking-wider">
                          {currentStep.badge}
                        </span>
                        <h3 className="text-xl md:text-2xl font-black text-white leading-tight font-display">
                          {currentStep.title}
                        </h3>
                      </div>
                    </div>

                    <div className="bg-[#05221B]/90 border border-white/15 p-5 rounded-2xl shadow-inner space-y-2">
                      <p className="text-sm text-gray-100 font-bold leading-relaxed">
                        "{currentStep.description}"
                      </p>
                    </div>

                    {/* Walkthrough Controls */}
                    <div className="pt-4 flex gap-3">
                      {currentStepIndex > 0 ? (
                        <button
                          type="button"
                          onClick={() => setCurrentStepIndex(prev => prev - 1)}
                          className="flex-1 bg-white/10 hover:bg-white/15 text-white font-bold py-3.5 rounded-xl text-xs transition-all border border-white/10 flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <ArrowLeft className="w-3.5 h-3.5" /> Back
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setInWalkthrough(false)}
                          className="flex-1 bg-white/10 hover:bg-white/15 text-white font-bold py-3.5 rounded-xl text-xs transition-all border border-white/10 cursor-pointer"
                        >
                          Overview
                        </button>
                      )}

                      {currentStepIndex < TOUR_STEPS.length - 1 ? (
                        <button
                          type="button"
                          onClick={() => setCurrentStepIndex(prev => prev + 1)}
                          className="flex-1 bg-[#B7E4C7] hover:bg-[#95D5B2] text-[#1A3C34] font-black py-3.5 rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 shadow-md uppercase tracking-wider cursor-pointer"
                        >
                          Next <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={handleCloseModal}
                          className="flex-1 bg-[#B7E4C7] hover:bg-[#95D5B2] text-[#1A3C34] font-black py-3.5 rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 shadow-md uppercase tracking-wider cursor-pointer"
                        >
                          Finish Guide 🎉
                        </button>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}

