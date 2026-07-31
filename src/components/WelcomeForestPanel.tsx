import React, { useState, useEffect } from 'react';
import { useProfile } from '../context/ProfileContext';
import { motion } from 'motion/react';
import { Sparkles, CheckCircle2, Target, Clock, Flame } from 'lucide-react';
import { cn } from '../lib/utils';
import Logo from './Logo';

interface WelcomeForestPanelProps {
  userName?: string;
  isNewAccount?: boolean;
  theme?: 'light' | 'dark';
  className?: string;
  generalWelcome?: boolean;
}

const MOTIVATIONAL_QUOTES = [
  "Small daily actions create big transformations. — Keep going!",
  "Consistency is the key that unlocks your full potential. — Stay focused!",
  "Every minute of deep focus sparks a neuron of tomorrow. — Keep striving!",
  "Success is the sum of small efforts repeated day in and day out.",
  "Focus on being productive, not just busy.",
  "Discipline is choosing between what you want now and what you want most.",
  "Small daily victories lead to monumental growth. — Stay consistent!",
  "Turn your focus into action and watch your world bloom."
];

export default function WelcomeForestPanel({
  userName = 'Deepika',
  isNewAccount = false,
  theme = 'light',
  className = '',
  generalWelcome = false,
}: WelcomeForestPanelProps) {
  const { profile } = useProfile();
  const actualName = profile.name || userName || 'User';
  const firstName = actualName.trim().split(' ')[0] || 'User';
  
  const [quoteIndex, setQuoteIndex] = useState(0);

  useEffect(() => {
    const idx = Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length);
    setQuoteIndex(idx);
  }, []);

  const currentQuote = MOTIVATIONAL_QUOTES[quoteIndex];

  return (
    <div
      className={cn(
        "relative rounded-[28px] overflow-hidden flex flex-col justify-between p-8 md:p-12 text-[#2F4156] bg-white border border-[#C8D9E6]/40 shadow-md transition-colors duration-300 select-none",
        className
      )}
    >
      {/* Brand Header with Taskaroa Logo */}
      <div className="flex flex-col items-center justify-center text-center space-y-4 pt-4">
        <Logo size="lg" showText={true} className="!items-center justify-center" theme="light" />
        
        <div className="h-0.5 w-16 bg-[#567C8D]/20 rounded-full my-2" />

        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2 max-w-md text-center"
        >
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-widest text-[#567C8D] bg-[#F5EFEB] border border-[#C8D9E6]">
            <Sparkles className="w-3.5 h-3.5 text-[#567C8D]" />
            AI Productivity Suite
          </span>

          <h2 className="text-2xl md:text-3xl font-black text-[#2F4156] tracking-tight uppercase">
            {isNewAccount 
              ? (generalWelcome ? "WELCOME TO TASKAROA!" : `WELCOME, ${firstName.toUpperCase()}!`) 
              : `WELCOME BACK, ${firstName.toUpperCase()}!`}
          </h2>

          <p className="text-xs md:text-sm text-gray-600 font-semibold leading-relaxed">
            {isNewAccount
              ? "Your centralized hub to organize tasks, track focus, and master daily productivity."
              : "Stay focused, maintain your streak, and achieve your daily goals."}
          </p>
        </motion.div>
      </div>

      {/* Feature Highlights Grid */}
      <div className="my-8 grid grid-cols-2 gap-3 max-w-md mx-auto w-full">
        <div className="p-3.5 bg-white rounded-2xl border border-[#C8D9E6]/30 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#F5EFEB] text-[#567C8D] flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-extrabold text-[#2F4156]">Smart Tasks</p>
            <p className="text-[10px] font-semibold text-gray-500">Organize & Prioritize</p>
          </div>
        </div>

        <div className="p-3.5 bg-white rounded-2xl border border-[#C8D9E6]/30 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#F5EFEB] text-[#567C8D] flex items-center justify-center shrink-0">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-extrabold text-[#2F4156]">Focus Timer</p>
            <p className="text-[10px] font-semibold text-gray-500">Pomodoro & Sessions</p>
          </div>
        </div>

        <div className="p-3.5 bg-white rounded-2xl border border-[#C8D9E6]/30 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#F5EFEB] text-[#567C8D] flex items-center justify-center shrink-0">
            <Flame className="w-4 h-4 text-orange-500" />
          </div>
          <div>
            <p className="text-xs font-extrabold text-[#2F4156]">Streak Tracker</p>
            <p className="text-[10px] font-semibold text-gray-500">Habit Analytics</p>
          </div>
        </div>

        <div className="p-3.5 bg-white rounded-2xl border border-[#C8D9E6]/30 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#F5EFEB] text-[#567C8D] flex items-center justify-center shrink-0">
            <Target className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-extrabold text-[#2F4156]">AI Assistant</p>
            <p className="text-[10px] font-semibold text-gray-500">Voice & Briefings</p>
          </div>
        </div>
      </div>

      {/* Quote Banner */}
      <div className="bg-[#F5EFEB]/50 border border-[#C8D9E6]/40 rounded-2xl p-4 text-center max-w-md mx-auto w-full">
        <p className="text-xs font-bold italic text-[#2F4156] leading-relaxed">
          "{currentQuote}"
        </p>
      </div>
    </div>
  );
}
