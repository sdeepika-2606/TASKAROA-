import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mic, MicOff, Volume2, Pause, Play, Square, Settings2, Sparkles, AlertCircle } from 'lucide-react';
import { useSpeech } from '../hooks/useSpeech';
import { useData } from '../context/DataContext';
import { useProfile } from '../context/ProfileContext';
import { generateSpeechGreeting } from '../utils/generateSpeechGreeting';

interface VoiceAssistantProps {
  onOpenSettings?: () => void;
  className?: string;
}

export default function VoiceAssistant({ onOpenSettings, className = '' }: VoiceAssistantProps) {
  const { profile } = useProfile();
  const { tasks, reminders, schedule } = useData();
  const { isSpeaking, isPaused, isSupported, speak, pause, resume, stop, settings } = useSpeech();

  const [showControls, setShowControls] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const hasAutoSpokenRef = useRef(false);

  // Auto-speak greeting on login / dashboard open
  useEffect(() => {
    const voiceSet = profile.voiceSettings;
    if (isSupported && voiceSet?.enabled && voiceSet?.enableGreeting && !hasAutoSpokenRef.current) {
      hasAutoSpokenRef.current = true;
      const timer = setTimeout(() => {
        const greetingText = generateSpeechGreeting(profile.name, tasks, reminders, schedule);
        const speedVal = voiceSet.speed === 'Slow' ? 0.8 : voiceSet.speed === 'Fast' ? 1.2 : 1.0;
        speak(greetingText, { 
          gender: voiceSet.gender, 
          enabled: true, 
          speed: speedVal, 
          volume: (voiceSet.volume ?? 80) / 100 
        });
        setShowControls(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isSupported, profile.voiceSettings, profile.name, tasks, reminders, schedule, speak]);

  const handleManualSpeak = () => {
    const voiceSet = profile.voiceSettings;
    if (!isSupported) {
      setErrorMsg("Voice Assistant unavailable on this browser.");
      setTimeout(() => setErrorMsg(null), 3500);
      return;
    }

    if (!voiceSet?.enabled) {
      setErrorMsg("Voice Assistant is currently disabled in Settings.");
      setTimeout(() => setErrorMsg(null), 3500);
      return;
    }

    if (isSpeaking) {
      stop();
      setShowControls(false);
    } else {
      const greetingText = generateSpeechGreeting(profile.name, tasks, reminders, schedule);
      const speedVal = voiceSet.speed === 'Slow' ? 0.8 : voiceSet.speed === 'Fast' ? 1.2 : 1.0;
      speak(greetingText, { 
        gender: voiceSet.gender, 
        enabled: true, 
        speed: speedVal, 
        volume: (voiceSet.volume ?? 80) / 100 
      });
      setShowControls(true);
    }
  };

  return (
    <div className={`relative flex items-center ${className}`}>
      
      {/* Error Tooltip */}
      <AnimatePresence>
        {errorMsg && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.9 }}
            className="absolute top-12 right-0 z-50 bg-red-600 text-white text-[11px] font-bold px-3 py-2 rounded-xl shadow-xl flex items-center gap-2 whitespace-nowrap"
          >
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{errorMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Voice Assistant Trigger Button */}
      <button
        type="button"
        onClick={handleManualSpeak}
        title={isSpeaking ? "Stop AI Voice Companion" : "Listen to AI Voice Companion"}
        className={`relative p-2.5 rounded-full border shadow-sm transition-all cursor-pointer flex items-center justify-center ${
          isSpeaking
            ? "bg-[#0F7A5C] border-[#0F7A5C] text-white ring-4 ring-[#0F7A5C]/20"
            : "bg-white border-[#D8F3DC] text-[#1A3C34] hover:bg-[#F0F7F4] hover:text-[#0F7A5C]"
        }`}
      >
        {isSpeaking ? (
          <Volume2 className="w-5 h-5 animate-pulse" />
        ) : (
          <Mic className="w-5 h-5 text-[#0F7A5C]" />
        )}

        {/* Live Speaking Indicator Pulse */}
        {isSpeaking && (
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border border-white"></span>
          </span>
        )}
      </button>

      {/* Speech Control Bar (Shows up when speaking or manually triggered) */}
      <AnimatePresence>
        {(isSpeaking || isPaused || showControls) && (
          <motion.div
            initial={{ opacity: 0, x: 20, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.95 }}
            className="ml-3 flex items-center gap-2 bg-[#0E3D30] text-white px-3.5 py-1.5 rounded-full shadow-lg border border-emerald-500/30 text-xs font-semibold"
          >
            <div className="flex items-center gap-1.5 pr-2 border-r border-emerald-600/40">
              <Sparkles className="w-3.5 h-3.5 text-emerald-300 animate-spin-slow shrink-0" />
              <span className="text-[11px] font-bold text-emerald-100 hidden sm:inline">AI Voice</span>
            </div>

            {/* Sound wave visualizer animation when speaking */}
            {isSpeaking && !isPaused && (
              <div className="flex items-center gap-0.5 px-1">
                <span className="w-0.5 h-3 bg-emerald-300 rounded-full animate-bounce [animation-delay:-0.3s]" />
                <span className="w-0.5 h-4 bg-emerald-300 rounded-full animate-bounce [animation-delay:-0.15s]" />
                <span className="w-0.5 h-2 bg-emerald-300 rounded-full animate-bounce" />
              </div>
            )}

            {/* Pause / Resume Button */}
            {isSpeaking && !isPaused && (
              <button
                type="button"
                onClick={pause}
                title="Pause Speech"
                className="p-1 rounded-full hover:bg-emerald-700/60 transition-colors text-emerald-200 hover:text-white cursor-pointer"
              >
                <Pause className="w-3.5 h-3.5" />
              </button>
            )}

            {isPaused && (
              <button
                type="button"
                onClick={resume}
                title="Resume Speech"
                className="p-1 rounded-full hover:bg-emerald-700/60 transition-colors text-emerald-200 hover:text-white cursor-pointer"
              >
                <Play className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Stop Button */}
            <button
              type="button"
              onClick={() => {
                stop();
                setShowControls(false);
              }}
              title="Stop Speech"
              className="p-1 rounded-full hover:bg-red-500/30 transition-colors text-red-300 hover:text-white cursor-pointer"
            >
              <Square className="w-3.5 h-3.5 fill-current" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
