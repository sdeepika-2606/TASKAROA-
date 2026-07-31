import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, TreePine, Flame, Calendar, BarChart2 } from 'lucide-react';

interface ServicesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ServicesModal({ isOpen, onClose }: ServicesModalProps) {
  const services = [
    {
      icon: <Sparkles className="w-6 h-6 text-emerald-500" />,
      title: 'AI Task Orchestration',
      description: 'Automatically determines task priorities, schedules reminders, and auto-syncs with your calendar without manual priority entry.',
    },
    {
      icon: <TreePine className="w-6 h-6 text-[#52B788]" />,
      title: 'Forest Gamification',
      description: 'Grow your personal digital forest. Successfully complete focus timers to plant trees, or fail them and watch them perish. Unlock animated animals!',
    },
    {
      icon: <Flame className="w-6 h-6 text-orange-500" />,
      title: 'Calm Focus Mode',
      description: 'Engage with custom focus presets (Study, Work, Review) accompanied by soothing background playlists and contextual motivational quotes.',
    },
    {
      icon: <Calendar className="w-6 h-6 text-blue-500" />,
      title: 'Full Calendar Sync',
      description: 'An interactive, fully functional calendar that supports Year, Month, Day, Hour, and Minute views, keeping your tasks in perfect sync.',
    },
    {
      icon: <BarChart2 className="w-6 h-6 text-purple-500" />,
      title: 'Jargon-Free Analytics',
      description: 'Easily track trees grown, tasks completed, and deep work focus hours with gorgeous, clean, and simple interactive pie charts and data graphs.',
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-[#0B1512]/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="w-full max-w-3xl bg-white rounded-[32px] overflow-hidden border border-[#D8F3DC] p-6 md:p-10 shadow-2xl relative"
          >
            {/* Ambient Background Glows */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full filter blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/5 rounded-full filter blur-3xl" />

            {/* Header */}
            <div className="flex items-center justify-between mb-8 relative z-10">
              <div>
                <span className="text-xs font-black text-[#52B788] uppercase tracking-widest block mb-1">
                  Explore Ecosystem Services
                </span>
                <h3 className="text-3xl font-extrabold text-[#1A3C34] tracking-tight">
                  Our Key Productivity Core Features
                </h3>
              </div>
              <button
                onClick={onClose}
                className="p-2.5 bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-800 rounded-full transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Services Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 relative z-10 max-h-[60vh] overflow-y-auto pr-2">
              {services.map((svc, i) => (
                <div
                  key={i}
                  className="bg-[#F4F9F6] border border-[#B7E4C7]/20 rounded-2xl p-5 hover:translate-y-[-2px] hover:shadow-md transition-all duration-300"
                >
                  <div className="w-11 h-11 bg-white rounded-xl flex items-center justify-center shadow-sm mb-4 border border-[#B7E4C7]/10">
                    {svc.icon}
                  </div>
                  <h4 className="text-base font-extrabold text-[#1A3C34] mb-2">
                    {svc.title}
                  </h4>
                  <p className="text-xs text-[#40916C] leading-relaxed font-semibold">
                    {svc.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Footer Close Button */}
            <div className="mt-8 flex justify-end relative z-10">
              <button
                onClick={onClose}
                className="bg-[#1A3C34] hover:bg-[#122c26] text-white px-8 py-3.5 rounded-full font-extrabold text-sm shadow-lg transition-all"
              >
                Got It, Let's Go!
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
