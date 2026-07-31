import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Clock, 
  Sparkles, 
  Music, 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  Repeat, 
  Shuffle, 
  Zap, 
  CheckCircle2, 
  Activity, 
  Calendar, 
  Volume1, 
  ListMusic, 
  Cpu, 
  Sliders, 
  Check, 
  X,
  Volume,
  Clock3,
  Award,
  BookOpen
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useProfile } from '../context/ProfileContext';
import { speakFocusStart, speakTaskCompleted, speakFocusEncouragement, speakText } from '../services/speechService';
import confetti from 'canvas-confetti';

interface FocusModeViewProps {
  theme: 'light' | 'dark' | 'contrast';
  userName?: string;
  userGender?: 'male' | 'female' | 'other';
  initialTaskTitle?: string;
  autoStartTimer?: boolean;
}

interface Track {
  id: string;
  title: string;
  duration: string;
  durationSec: number;
  type: string;
  category: string;
}

const QUICK_CHIPS = [1, 2, 3, 5, 10, 15, 20, 25, 30, 45, 60, 90, 120];

const MUSIC_LIBRARY: Track[] = [
  // 🌿 Nature & Ambient
  { id: 'forest_breeze', title: 'Forest Breeze', duration: '20:00', durationSec: 1200, type: 'Nature & Ambient', category: 'nature' },
  // 🎧 Lo-Fi Study
  { id: 'late_night_library', title: 'Late Night Library', duration: '30:00', durationSec: 1800, type: 'Lo-Fi Study', category: 'lofi' },
  // 🧠 Binaural Focus
  { id: 'alpha_wave_focus', title: 'Alpha Wave Focus', duration: '30:00', durationSec: 1800, type: 'Binaural Focus', category: 'binaural' },
  // ⚪ White Noise
  { id: 'brown_noise_blanket', title: 'Brown Noise Blanket', duration: '60:00', durationSec: 3600, type: 'White Noise', category: 'white_noise' },
  // 🎹 Piano
  { id: 'soft_keys_for_study', title: 'Soft Keys for Study', duration: '20:00', durationSec: 1200, type: 'Piano', category: 'piano' },
];

const MUSIC_CATEGORIES = [
  { id: 'all', label: 'All Playlists', icon: '✨' },
  { id: 'nature', label: 'Nature & Ambient', icon: '🌿' },
  { id: 'lofi', label: 'Lo-Fi Study', icon: '🎧' },
  { id: 'binaural', label: 'Binaural Focus', icon: '🧠' },
  { id: 'white_noise', label: 'White Noise', icon: '⚪' },
  { id: 'piano', label: 'Instrumental Piano', icon: '🎹' },
];

// Predefined scheduled task durations mapping
const TASK_DURATIONS: Record<string, number> = {
  "Solve 5 Leetcode Problems": 120,
  "AI Project Work Block": 120,
  "AI Project Work": 120,
  "Placement Assessment Prep": 90,
  "Placement Preparation": 90,
  "Review Completed AI Code": 60,
  "Evening Jog & Aerobics": 60,
  "Data Structures Class": 45,
  "Complete AI Report": 90,
  "Workout": 60,
  "Complete the Landing Page UI": 25,
};

// -------------------------------------------------------------
// BROWSER-NATIVE AUDIO SYNTHESIZER ENGINE FOR PREMIUM PLAYBACK
// -------------------------------------------------------------
class SynthEngine {
  private ctx: AudioContext | null = null;
  private mainGain: GainNode | null = null;
  private activeNodes: any[] = [];
  private currentVolume: number = 0.5;
  private isLofiPlaying: boolean = false;
  private lofiIntervalId: any = null;
  private isPianoPlaying: boolean = false;
  private pianoIntervalId: any = null;

  constructor() {}

  public setVolume(volume: number) {
    this.currentVolume = volume;
    if (this.mainGain && this.ctx) {
      this.mainGain.gain.setValueAtTime(volume, this.ctx.currentTime);
    }
  }

  public init() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioContextClass();
      this.mainGain = this.ctx.createGain();
      this.mainGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    this.mainGain!.gain.setValueAtTime(this.currentVolume, this.ctx.currentTime);
  }

  public stop() {
    this.isLofiPlaying = false;
    if (this.lofiIntervalId) {
      clearInterval(this.lofiIntervalId);
      this.lofiIntervalId = null;
    }
    this.isPianoPlaying = false;
    if (this.pianoIntervalId) {
      clearInterval(this.pianoIntervalId);
      this.pianoIntervalId = null;
    }

    this.activeNodes.forEach(node => {
      try {
        node.stop();
        node.disconnect();
      } catch (e) {}
    });
    this.activeNodes = [];
  }

  private addNode(node: any) {
    this.activeNodes.push(node);
  }

  public playTrack(trackId: string, category: string) {
    this.stop();
    this.init();
    const ctx = this.ctx!;
    const mainGain = this.mainGain!;

    // Create warmth lowpass filter
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1200, ctx.currentTime);
    filter.connect(mainGain);

    if (category === 'white_noise') {
      const bufferSize = ctx.sampleRate * 2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const noiseNode = ctx.createBufferSource();
      noiseNode.buffer = noiseBuffer;
      noiseNode.loop = true;

      if (trackId === 'brown_noise_blanket') {
        filter.frequency.setValueAtTime(220, ctx.currentTime);
        noiseNode.connect(filter);
      } else if (trackId === 'static_focus') {
        filter.frequency.setValueAtTime(900, ctx.currentTime);
        noiseNode.connect(filter);
      } else if (trackId === 'fan_hum_steady') {
        filter.frequency.setValueAtTime(350, ctx.currentTime);
        noiseNode.connect(filter);

        const hum = ctx.createOscillator();
        hum.type = 'sine';
        hum.frequency.setValueAtTime(60, ctx.currentTime);
        const humGain = ctx.createGain();
        humGain.gain.setValueAtTime(0.35, ctx.currentTime);
        hum.connect(humGain);
        humGain.connect(mainGain);
        hum.start();
        this.addNode(hum);
      }

      noiseNode.start();
      this.addNode(noiseNode);
    } 
    else if (category === 'binaural') {
      const splitter = ctx.createChannelMerger(2);
      
      const leftOsc = ctx.createOscillator();
      leftOsc.type = 'sine';
      leftOsc.frequency.setValueAtTime(200, ctx.currentTime);
      
      const rightOsc = ctx.createOscillator();
      rightOsc.type = 'sine';
      rightOsc.frequency.setValueAtTime(210, ctx.currentTime); // 10Hz Alpha beat offset

      const leftGain = ctx.createGain();
      leftGain.gain.setValueAtTime(0.4, ctx.currentTime);

      const rightGain = ctx.createGain();
      rightGain.gain.setValueAtTime(0.4, ctx.currentTime);

      leftOsc.connect(leftGain);
      rightOsc.connect(rightGain);

      leftGain.connect(splitter, 0, 0);
      rightGain.connect(splitter, 0, 1);

      splitter.connect(mainGain);

      leftOsc.start();
      rightOsc.start();

      this.addNode(leftOsc);
      this.addNode(rightOsc);

      const drone = ctx.createOscillator();
      drone.type = 'triangle';
      drone.frequency.setValueAtTime(70, ctx.currentTime);
      const droneGain = ctx.createGain();
      droneGain.gain.setValueAtTime(0.12, ctx.currentTime);
      drone.connect(droneGain);
      droneGain.connect(mainGain);
      drone.start();
      this.addNode(drone);
    }
    else if (category === 'nature') {
      const bufferSize = ctx.sampleRate * 2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
      const noiseNode = ctx.createBufferSource();
      noiseNode.buffer = noiseBuffer;
      noiseNode.loop = true;

      const windFilter = ctx.createBiquadFilter();
      windFilter.type = 'lowpass';
      windFilter.frequency.setValueAtTime(350, ctx.currentTime);
      noiseNode.connect(windFilter);
      windFilter.connect(mainGain);

      noiseNode.start();
      this.addNode(noiseNode);

      if (trackId === 'rain_drops' || trackId === 'campfire_crackle') {
        const intervalTime = trackId === 'rain_drops' ? 140 : 250;
        const clicker = setInterval(() => {
          if (!this.ctx || this.ctx.state === 'suspended') return;
          try {
            const clickOsc = ctx.createOscillator();
            const clickGain = ctx.createGain();
            clickOsc.type = trackId === 'rain_drops' ? 'sine' : 'triangle';
            clickOsc.frequency.setValueAtTime(trackId === 'rain_drops' ? 1300 + Math.random() * 500 : 180 + Math.random() * 300, ctx.currentTime);
            
            clickGain.gain.setValueAtTime(0.018 * (Math.random() * 0.8 + 0.2), ctx.currentTime);
            clickGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + (trackId === 'rain_drops' ? 0.012 : 0.025));
            
            clickOsc.connect(clickGain);
            clickGain.connect(mainGain);
            clickOsc.start();
            clickOsc.stop(ctx.currentTime + 0.04);
          } catch (e) {}
        }, intervalTime);
        this.lofiIntervalId = clicker;
      } 
      else if (trackId === 'forest_breeze' || trackId === 'mountain_wind' || trackId === 'river_flow' || trackId === 'morning_birdsong') {
        const lfo = ctx.createOscillator();
        lfo.type = 'sine';
        lfo.frequency.setValueAtTime(0.08, ctx.currentTime);
        const lfoGain = ctx.createGain();
        lfoGain.gain.setValueAtTime(120, ctx.currentTime);
        lfo.connect(lfoGain);
        lfoGain.connect(windFilter.frequency);
        lfo.start();
        this.addNode(lfo);

        if (trackId === 'morning_birdsong') {
          const birder = setInterval(() => {
            if (!this.ctx || this.ctx.state === 'suspended') return;
            try {
              const startTime = ctx.currentTime;
              const baseFreq = 1900 + Math.random() * 400;
              for (let i = 0; i < 3; i++) {
                const chirpOsc = ctx.createOscillator();
                const chirpGain = ctx.createGain();
                chirpOsc.type = 'sine';
                chirpOsc.frequency.setValueAtTime(baseFreq, startTime + i * 0.16);
                chirpOsc.frequency.exponentialRampToValueAtTime(baseFreq + 350, startTime + i * 0.16 + 0.07);
                
                chirpGain.gain.setValueAtTime(0.0, startTime + i * 0.16);
                chirpGain.gain.linearRampToValueAtTime(0.015, startTime + i * 0.16 + 0.02);
                chirpGain.gain.exponentialRampToValueAtTime(0.0001, startTime + i * 0.16 + 0.11);
                
                chirpOsc.connect(chirpGain);
                chirpGain.connect(mainGain);
                chirpOsc.start(startTime + i * 0.16);
                chirpOsc.stop(startTime + i * 0.16 + 0.13);
              }
            } catch (e) {}
          }, 4000);
          this.pianoIntervalId = birder;
        }
      }
      else if (trackId === 'ocean_tide') {
        const swellLfo = ctx.createOscillator();
        swellLfo.type = 'sine';
        swellLfo.frequency.setValueAtTime(0.07, ctx.currentTime);
        const swellGain = ctx.createGain();
        swellGain.gain.setValueAtTime(0.07, ctx.currentTime);
        swellLfo.connect(swellGain);
        
        const windVolumeGain = ctx.createGain();
        windVolumeGain.gain.setValueAtTime(0.015, ctx.currentTime);
        swellGain.connect(windVolumeGain.gain);
        
        noiseNode.disconnect();
        noiseNode.connect(windFilter);
        windFilter.disconnect();
        windFilter.connect(windVolumeGain);
        windVolumeGain.connect(mainGain);

        swellLfo.start();
        this.addNode(swellLfo);
      }
    }
    else if (category === 'lofi') {
      this.isLofiPlaying = true;
      let step = 0;
      const chords = [
        [220.00, 261.63, 329.63, 392.00], // Am7
        [146.83, 261.63, 349.23, 440.00], // Dm7
        [196.00, 246.94, 349.23, 392.00], // G7
        [130.81, 246.94, 329.63, 392.00], // Cmaj7
      ];

      const bufferSize = ctx.sampleRate * 2;
      const crackleBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = crackleBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        const r = Math.random() * 2 - 1;
        output[i] = Math.pow(r, 9) * 0.05 + Math.random() * 0.004;
      }
      const crackleNode = ctx.createBufferSource();
      crackleNode.buffer = crackleBuffer;
      crackleNode.loop = true;
      const crackleGain = ctx.createGain();
      crackleGain.gain.setValueAtTime(0.03, ctx.currentTime);
      crackleNode.connect(crackleGain);
      crackleGain.connect(mainGain);
      crackleNode.start();
      this.addNode(crackleNode);

      const lofiTicker = () => {
        if (!this.isLofiPlaying || !this.ctx || this.ctx.state === 'suspended') return;
        const chord = chords[step % chords.length];
        step++;

        chord.forEach((freq, idx) => {
          try {
            const osc = ctx.createOscillator();
            const noteGain = ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.12);
            
            noteGain.gain.setValueAtTime(0, ctx.currentTime);
            noteGain.gain.linearRampToValueAtTime(0.03, ctx.currentTime + idx * 0.12 + 0.1);
            noteGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + idx * 0.12 + 2.4);
            
            osc.connect(noteGain);
            noteGain.connect(mainGain);
            osc.start(ctx.currentTime + idx * 0.12);
            osc.stop(ctx.currentTime + idx * 0.12 + 2.8);
          } catch (e) {}
        });

        // Soft kick
        try {
          const kickOsc = ctx.createOscillator();
          const kickGain = ctx.createGain();
          kickOsc.frequency.setValueAtTime(100, ctx.currentTime);
          kickOsc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.12);
          kickGain.gain.setValueAtTime(0.06, ctx.currentTime);
          kickGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
          kickOsc.connect(kickGain);
          kickGain.connect(mainGain);
          kickOsc.start();
          kickOsc.stop(ctx.currentTime + 0.25);
        } catch (e) {}
      };

      lofiTicker();
      this.lofiIntervalId = setInterval(lofiTicker, 3000);
    }
    else if (category === 'piano') {
      this.isPianoPlaying = true;
      let step = 0;
      const pianoProgressions = [
        [130.81, 196.00, 329.63, 493.88, 587.33], // Cmaj9
        [110.00, 164.81, 261.63, 392.00, 440.00], // Am7
        [138.59, 207.65, 349.23, 523.25, 622.25], // Dbmaj9
        [116.54, 174.61, 293.66, 440.00, 466.16], // Bbm7
      ];

      const pianoTicker = () => {
        if (!this.isPianoPlaying || !this.ctx || this.ctx.state === 'suspended') return;
        const notes = pianoProgressions[step % pianoProgressions.length];
        step++;

        notes.forEach((freq, idx) => {
          try {
            const osc = ctx.createOscillator();
            const noteGain = ctx.createGain();
            const delayTime = idx * 0.18 + (Math.random() * 0.04);
            
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, ctx.currentTime + delayTime);
            
            noteGain.gain.setValueAtTime(0.0, ctx.currentTime + delayTime);
            noteGain.gain.linearRampToValueAtTime(0.03, ctx.currentTime + delayTime + 0.02);
            noteGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + delayTime + 3.2);
            
            osc.connect(noteGain);
            noteGain.connect(mainGain);
            osc.start(ctx.currentTime + delayTime);
            osc.stop(ctx.currentTime + delayTime + 3.8);
          } catch (e) {}
        });
      };

      pianoTicker();
      this.pianoIntervalId = setInterval(pianoTicker, 3500);
    }
  }

  public fadeOut(durSec: number, onComplete: () => void) {
    if (this.mainGain && this.ctx) {
      const time = this.ctx.currentTime;
      this.mainGain.gain.setValueAtTime(this.currentVolume, time);
      this.mainGain.gain.exponentialRampToValueAtTime(0.0001, time + durSec);
      setTimeout(() => {
        this.stop();
        onComplete();
      }, durSec * 1000);
    } else {
      this.stop();
      onComplete();
    }
  }
}

// -------------------------------------------------------------
// MAIN COMPONENT
// -------------------------------------------------------------
export default function FocusModeView({ 
  theme, 
  userName = "Deepika S", 
  userGender = "female",
  initialTaskTitle,
  autoStartTimer
}: FocusModeViewProps) {
  const { profile } = useProfile();
  const actualName = profile?.name || userName || 'User';

  // Navigation sub-tab inside Focus Mode
  const [focusTab, setFocusTab] = useState<'arena' | 'synapses'>('arena');

  // Core Timer State
  const [targetMinutes, setTargetMinutes] = useState<number>(25);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(25 * 60);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  // Time logging details
  const [startTime, setStartTime] = useState<string>('');
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);

  // Music state
  const [musicCategory, setMusicCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTrack, setSelectedTrack] = useState<Track>(MUSIC_LIBRARY[0]);
  const [isPlayingMusic, setIsPlayingMusic] = useState<boolean>(false);
  const [musicVolume, setMusicVolume] = useState<number>(50);
  const [trackElapsedTime, setTrackElapsedTime] = useState<number>(0);
  const [isShuffle, setIsShuffle] = useState<boolean>(false);
  const [isRepeat, setIsRepeat] = useState<boolean>(false);

  // Synapses / Focus History log
  const [completedSessions, setCompletedSessions] = useState<any[]>(() => {
    const saved = localStorage.getItem('taskaroa_focus_history_redesign');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'hist_1',
        taskTitle: 'Data Structures Practice',
        durationMinutes: 45,
        startTime: '09:00 AM',
        endTime: '09:45 AM',
        score: 100,
        status: 'Completed',
        musicTrack: 'Quiet Study Hall',
        dateStr: '2026-07-29'
      },
      {
        id: 'hist_2',
        taskTitle: 'AI Project Architecture Draft',
        durationMinutes: 90,
        startTime: '02:00 PM',
        endTime: '03:30 PM',
        score: 100,
        status: 'Completed',
        musicTrack: 'Alpha Wave Focus',
        dateStr: '2026-07-28'
      }
    ];
  });

  // Current Focus Task title from context / user entry
  const [currentTask, setCurrentTask] = useState<string>(initialTaskTitle || "Complete the Landing Page UI");

  // Synthetic engine reference
  const synthEngineRef = useRef<SynthEngine | null>(null);
  const musicTimerRef = useRef<any>(null);

  // Initialize synth engine on mount
  useEffect(() => {
    synthEngineRef.current = new SynthEngine();
    return () => {
      if (synthEngineRef.current) {
        synthEngineRef.current.stop();
      }
      if (musicTimerRef.current) {
        clearInterval(musicTimerRef.current);
      }
    };
  }, []);

  // Update volume
  useEffect(() => {
    if (synthEngineRef.current) {
      synthEngineRef.current.setVolume((musicVolume / 100) * 0.15); // limit output peak safely
    }
  }, [musicVolume]);

  // Load predefined scheduled task durations on mount/change
  useEffect(() => {
    if (initialTaskTitle) {
      setCurrentTask(initialTaskTitle);
      
      // Look up task duration or parse
      const matchMin = initialTaskTitle.match(/(\d+)\s*(min|m|minute)/i);
      const matchHour = initialTaskTitle.match(/(\d+)\s*(hour|h|hr)/i);
      let parsedDuration = 25;

      if (TASK_DURATIONS[initialTaskTitle]) {
        parsedDuration = TASK_DURATIONS[initialTaskTitle];
      } else if (matchMin) {
        parsedDuration = parseInt(matchMin[1], 10);
      } else if (matchHour) {
        parsedDuration = parseInt(matchHour[1], 10) * 60;
      }

      const validated = Math.max(1, Math.min(120, parsedDuration));
      setTargetMinutes(validated);
      setSecondsRemaining(validated * 60);
    }
  }, [initialTaskTitle]);

  // Trigger auto-start if dashboard requested it
  useEffect(() => {
    if (autoStartTimer && !isActive && !isCompleted) {
      handleStartFocus();
    }
  }, [autoStartTimer]);

  // Track progress simulator for the Music Player
  useEffect(() => {
    if (isPlayingMusic && !isPaused) {
      musicTimerRef.current = setInterval(() => {
        setTrackElapsedTime(prev => {
          if (prev >= selectedTrack.durationSec - 1) {
            // Track completed
            if (isRepeat) {
              return 0; // loop
            } else {
              handleNextTrack();
              return 0;
            }
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      if (musicTimerRef.current) {
        clearInterval(musicTimerRef.current);
      }
    }
    return () => {
      if (musicTimerRef.current) {
        clearInterval(musicTimerRef.current);
      }
    };
  }, [isPlayingMusic, selectedTrack, isRepeat, isPaused]);

  // Handle countdown Timer ticking
  useEffect(() => {
    let interval: any = null;
    if (isActive && !isPaused && secondsRemaining > 0) {
      interval = setInterval(() => {
        setSecondsRemaining(prev => {
          setElapsedSeconds(e => e + 1);
          if (prev <= 1) {
            // Focus timer completed fully!
            clearInterval(interval);
            handleCompletedSession();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (interval) clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, isPaused, secondsRemaining]);

  // Web Speech encouragement scheduled every 10 min
  useEffect(() => {
    let interval: any = null;
    if (isActive && !isPaused) {
      interval = setInterval(() => {
        speakFocusEncouragement(profile?.voiceSettings);
      }, 600000);
    }
    return () => clearInterval(interval);
  }, [isActive, isPaused, profile?.voiceSettings]);

  // Trigger speech on focus start
  const speakTimerStart = (taskName: string) => {
    speakFocusStart(taskName, profile?.voiceSettings);
  };

  // Start Focus Mode
  const handleStartFocus = () => {
    const formattedStartTime = new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
    setStartTime(formattedStartTime);
    setElapsedSeconds(0);
    setIsActive(true);
    setIsPaused(false);
    setIsCompleted(false);

    // Automation: Music automatically starts if selected
    if (selectedTrack) {
      playSynthMusic(selectedTrack);
    }

    // Call server to notify focus session start
    fetch('/api/focus-sessions/start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        category: 'Intelligent Focus', 
        tree_type: 'Focus Block', 
        duration_minutes: targetMinutes 
      })
    })
    .then(res => res.json())
    .then(data => {
      if (data.session) {
        setActiveSessionId(data.session.id);
      }
    })
    .catch(() => {});

    speakTimerStart(currentTask);
  };

  // Pause Focus
  const handlePauseFocus = () => {
    setIsPaused(true);
    // Pause synth engine
    if (synthEngineRef.current) {
      synthEngineRef.current.stop();
    }
    setIsPlayingMusic(false);
  };

  // Resume Focus
  const handleResumeFocus = () => {
    setIsPaused(false);
    // Resume music playing
    if (selectedTrack) {
      playSynthMusic(selectedTrack);
    }
  };

  // Restart Focus
  const handleRestartFocus = () => {
    setSecondsRemaining(targetMinutes * 60);
    setElapsedSeconds(0);
    setIsPaused(false);
    if (selectedTrack) {
      setTrackElapsedTime(0);
      playSynthMusic(selectedTrack);
    }
  };

  // End Session early (Stop button)
  const handleEndSession = () => {
    if (isActive && activeSessionId) {
      fetch(`/api/focus-sessions/${activeSessionId}/cancel`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ elapsed_seconds: elapsedSeconds })
      }).catch(() => {});
      setActiveSessionId(null);
    }

    if (synthEngineRef.current) {
      synthEngineRef.current.stop();
    }
    setIsPlayingMusic(false);
    setIsActive(false);
    setIsPaused(false);
    setSecondsRemaining(targetMinutes * 60);
  };

  // Complete Session Successfully
  const handleCompletedSession = () => {
    setIsActive(false);
    setIsPaused(false);
    setIsCompleted(true);

    const formattedEndTime = new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });

    // Fade out music cleanly over 2.5 seconds
    if (synthEngineRef.current && isPlayingMusic) {
      synthEngineRef.current.fadeOut(2.5, () => {
        setIsPlayingMusic(false);
      });
    }

    // Play visual celebration
    try {
      confetti({
        particleCount: 160,
        spread: 100,
        origin: { y: 0.6 },
        colors: ['#0E8F6A', '#34D399', '#6EE7B7', '#0F766E', '#10B981']
      });
    } catch (e) {}

    // Complete focus session in backend API
    if (activeSessionId) {
      fetch(`/api/focus-sessions/${activeSessionId}/complete`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ elapsed_seconds: targetMinutes * 60 })
      }).catch(() => {});
      setActiveSessionId(null);
    }

    // Voice announcement
    speakTaskCompleted(currentTask, undefined, profile?.voiceSettings);

    // Save session logs locally
    const newSessionLog = {
      id: `hist_${Date.now()}`,
      taskTitle: currentTask,
      durationMinutes: targetMinutes,
      startTime: startTime || '08:00 AM',
      endTime: formattedEndTime,
      score: 100,
      status: 'Completed',
      musicTrack: selectedTrack ? selectedTrack.title : 'Silent Reflection',
      dateStr: new Date().toISOString().split('T')[0]
    };

    setCompletedSessions(prev => {
      const updated = [newSessionLog, ...prev];
      localStorage.setItem('taskaroa_focus_history_redesign', JSON.stringify(updated));
      return updated;
    });
  };

  // Play synthetic track helper
  const playSynthMusic = (track: Track) => {
    setSelectedTrack(track);
    setIsPlayingMusic(true);
    if (synthEngineRef.current) {
      synthEngineRef.current.playTrack(track.id, track.category);
    }
  };

  // Toggle Playback controls inside music panel
  const handleToggleMusicPlay = () => {
    if (isPlayingMusic) {
      if (synthEngineRef.current) {
        synthEngineRef.current.stop();
      }
      setIsPlayingMusic(false);
    } else {
      if (selectedTrack) {
        playSynthMusic(selectedTrack);
      }
    }
  };

  // Next Track
  const handleNextTrack = () => {
    const filteredTracks = getFilteredTracks();
    const currentIndex = filteredTracks.findIndex(t => t.id === selectedTrack.id);
    let nextIndex = 0;

    if (isShuffle) {
      nextIndex = Math.floor(Math.random() * filteredTracks.length);
    } else if (currentIndex !== -1 && currentIndex < filteredTracks.length - 1) {
      nextIndex = currentIndex + 1;
    }

    const nextTrack = filteredTracks[nextIndex] || filteredTracks[0];
    setTrackElapsedTime(0);
    playSynthMusic(nextTrack);
  };

  // Previous Track
  const handlePrevTrack = () => {
    const filteredTracks = getFilteredTracks();
    const currentIndex = filteredTracks.findIndex(t => t.id === selectedTrack.id);
    let prevIndex = filteredTracks.length - 1;

    if (currentIndex > 0) {
      prevIndex = currentIndex - 1;
    }

    const prevTrack = filteredTracks[prevIndex];
    setTrackElapsedTime(0);
    playSynthMusic(prevTrack);
  };

  // Slide duration change
  const handleTimeChange = (mins: number) => {
    if (isActive) return;
    const validated = Math.max(1, Math.min(120, mins));
    setTargetMinutes(validated);
    setSecondsRemaining(validated * 60);
  };

  // Get active subset of tracks depending on category and search query
  const getFilteredTracks = () => {
    return MUSIC_LIBRARY.filter(track => {
      const matchesCategory = track.category === musicCategory;
      const matchesSearch = track.title.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  };

  // Format digital timers
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // Calculates completion percentage of the progress ring
  const getPercentageElapsed = () => {
    const totalSeconds = targetMinutes * 60;
    const elapsed = totalSeconds - secondsRemaining;
    return Math.min(100, Math.round((elapsed / totalSeconds) * 100));
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12 max-w-7xl mx-auto px-4 sm:px-6">
      
      {/* Immersive Header Block with custom styling */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E2E8F0] pb-5">
        <div>
          <h2 className="text-3xl font-extrabold font-display text-[#1F2937] tracking-tight flex items-center gap-3">
            <Zap className="w-8 h-8 text-[#2F486D] fill-[#2F486D]/10 animate-pulse" />
            Focus Mode
            <span className="text-xs bg-[#D2C7B8]/20 text-[#223148] font-black px-2.5 py-1 rounded-full border border-[#D2C7B8] uppercase tracking-wider">
              Intelligent Workspace
            </span>
          </h2>
          <p className="text-gray-500 text-sm font-medium mt-1">
            Stay distraction-free and complete your work with an intelligent focus timer.
          </p>
        </div>

        {/* Workspace Navigation Tabs */}
        <div className="flex bg-[#F1F5F9] p-1 rounded-xl border border-gray-200 self-start md:self-auto shadow-sm">
          <button
            onClick={() => setFocusTab('arena')}
            className={cn(
              "px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer",
              focusTab === 'arena' ? "bg-white text-[#223148] shadow-xs border border-gray-200/50 font-extrabold" : "text-gray-600 hover:text-gray-900"
            )}
          >
            <Clock3 className="w-4 h-4" /> Timer Block
          </button>
          <button
            onClick={() => setFocusTab('synapses')}
            className={cn(
              "px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer",
              focusTab === 'synapses' ? "bg-white text-[#223148] shadow-xs border border-gray-200/50 font-extrabold" : "text-gray-600 hover:text-gray-900"
            )}
          >
            <Calendar className="w-4 h-4" /> Focus History
          </button>
        </div>
      </div>

      {focusTab === 'arena' ? (
        <div className="grid grid-cols-1 gap-8 items-center justify-center">
          
          {/* ================= MAIN FOCUS TIMER ================= */}
          <div className="flex flex-col items-center justify-center w-full max-w-2xl mx-auto">
            
            {/* Elegant glassmorphism workspace card */}
            <div className="w-full bg-white border border-[#E2E8F0] rounded-[32px] p-8 md:p-10 shadow-sm flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-b from-white via-white to-[#F8FAFC]/40 min-h-[580px]">
              
              {/* Abstract decorative ambient background bubbles */}
              <div className="absolute inset-0 pointer-events-none z-0">
                <div className="absolute top-10 left-10 w-24 h-24 rounded-full bg-[#2F486D]/5 blur-3xl" />
                <div className="absolute bottom-12 right-12 w-32 h-32 rounded-full bg-[#2F486D]/5 blur-3xl" />
              </div>

              {/* Task Title Indicator at top */}
              <div className="w-full max-w-md bg-slate-50 border border-slate-100 rounded-2xl p-4 mb-8 z-10 text-center shadow-xs">
                <span className="text-[10px] font-black uppercase text-[#2F486D] tracking-widest block mb-1">
                  Active Focus Task
                </span>
                <input
                  type="text"
                  value={currentTask}
                  onChange={(e) => setCurrentTask(e.target.value)}
                  disabled={isActive}
                  className="w-full bg-transparent text-center font-extrabold text-[#223148] text-sm focus:outline-none placeholder-gray-400 border-b border-transparent hover:border-slate-200 focus:border-[#2F486D] pb-0.5"
                  placeholder="No task selected — choose a task to focus on"
                />
              </div>

              {/* Giant countdown timer displaying Progress Ring and formatted time */}
              <div className="relative w-[280px] h-[280px] sm:w-[320px] sm:h-[320px] flex items-center justify-center z-10 select-none">
                
                <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 200 200">
                  {/* Background Track circle */}
                  <circle
                    cx="100"
                    cy="100"
                    r="86"
                    className="stroke-[#F1F5F9]"
                    strokeWidth="4"
                    fill="transparent"
                  />
                  {/* Main animated progress ring */}
                  <circle
                    cx="100"
                    cy="100"
                    r="86"
                    stroke="#2F486D"
                    strokeWidth="5"
                    fill="transparent"
                    strokeDasharray={2 * Math.PI * 86}
                    strokeDashoffset={(2 * Math.PI * 86) * (1 - (secondsRemaining / (targetMinutes * 60 || 1)))}
                    strokeLinecap="round"
                    style={{ transition: 'stroke-dashoffset 0.8s linear' }}
                  />
                </svg>

                {/* Digital readout inside progress ring */}
                <div className="text-center space-y-1.5 flex flex-col justify-center items-center">
                  <span className="text-[10px] font-black uppercase text-[#0F766E] tracking-[0.25em]">
                    Current Session
                  </span>
                  
                  <div className="text-5xl sm:text-6xl font-mono font-black text-[#1F2937] tracking-tight tabular-nums">
                    {formatTime(secondsRemaining)}
                  </div>

                  <span className="text-xs bg-[#E6F4EA] text-[#0F766E] font-bold px-3 py-1 rounded-full border border-[#D1E7DD] block w-max shadow-xs mt-1">
                    Focus
                  </span>
                </div>

              </div>

              {/* Dynamic stats tracker (Only shown when running) */}
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="w-full max-w-sm mt-8 grid grid-cols-3 gap-3 text-center border-t border-b border-gray-100 py-3.5 z-10"
                  >
                    <div>
                      <span className="block text-[9px] font-black text-gray-400 uppercase tracking-wider">Elapsed Time</span>
                      <span className="text-sm font-extrabold text-[#1F2937] font-mono mt-0.5 block">{formatTime(elapsedSeconds)}</span>
                    </div>
                    <div>
                      <span className="block text-[9px] font-black text-gray-400 uppercase tracking-wider">Remaining</span>
                      <span className="text-sm font-extrabold text-[#1F2937] font-mono mt-0.5 block">{formatTime(secondsRemaining)}</span>
                    </div>
                    <div>
                      <span className="block text-[9px] font-black text-gray-400 uppercase tracking-wider">Completion</span>
                      <span className="text-sm font-extrabold text-[#0F766E] mt-0.5 block">{getPercentageElapsed()}%</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Quick duration picker chips & slider (Only editable when stopped) */}
              <AnimatePresence>
                {!isActive && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="w-full max-w-md mt-8 space-y-5 z-10 px-4"
                  >
                    {/* Time sliders */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs font-black text-gray-600">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4 text-[#2F486D]" /> Select Duration
                        </span>
                        <span className="text-sm text-[#223148] font-black">{targetMinutes} Minutes</span>
                      </div>

                      <div className="flex items-center gap-3.5">
                        <input
                          type="range"
                          min="1"
                          max="120"
                          step="1"
                          value={targetMinutes}
                          onChange={(e) => handleTimeChange(Number(e.target.value))}
                          className="flex-1 accent-[#0F766E] h-1.5 bg-[#E2E8F0] rounded-lg appearance-none cursor-pointer"
                        />
                      </div>
                    </div>

                    {/* Quick chips selector */}
                    <div className="flex flex-wrap gap-1.5 justify-center max-h-[72px] overflow-y-auto pr-1">
                      {QUICK_CHIPS.map((chipMinutes) => (
                        <button
                          key={chipMinutes}
                          onClick={() => handleTimeChange(chipMinutes)}
                          className={cn(
                            "px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition-all border shrink-0 cursor-pointer",
                            targetMinutes === chipMinutes 
                              ? "bg-[#0F766E] border-[#0F766E] text-white shadow-xs font-black" 
                              : "bg-white border-gray-200 text-gray-600 hover:border-gray-300 hover:text-gray-900"
                          )}
                        >
                          {chipMinutes}m
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Control Buttons row (Start, Pause, Resume, Restart, Stop) */}
              <div className="flex flex-wrap items-center justify-center gap-3.5 mt-8 z-10">
                {!isActive ? (
                  <button
                    onClick={handleStartFocus}
                    className="px-8 py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider text-white shadow-md bg-[#223148] hover:bg-[#1A2536] active:scale-98 transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <Play className="w-4 h-4 fill-white" /> Start Focus
                  </button>
                ) : (
                  <>
                    {/* Running controls row */}
                    {!isPaused ? (
                      <button
                        onClick={handlePauseFocus}
                        className="px-6 py-3.5 rounded-xl text-xs font-black uppercase tracking-wider text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 active:scale-98 transition-all flex items-center gap-2 cursor-pointer shadow-xs"
                      >
                        <Pause className="w-4 h-4 fill-gray-700" /> Pause
                      </button>
                    ) : (
                      <button
                        onClick={handleResumeFocus}
                        className="px-6 py-3.5 rounded-xl text-xs font-black uppercase tracking-wider text-white bg-[#0F766E] hover:bg-[#0D635C] active:scale-98 transition-all flex items-center gap-2 cursor-pointer shadow-xs"
                      >
                        <Play className="w-4 h-4 fill-white" /> Resume
                      </button>
                    )}

                    <button
                      onClick={handleRestartFocus}
                      className="px-4 py-3.5 rounded-xl text-xs font-black uppercase tracking-wider text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 active:scale-98 transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                      title="Restart Timer"
                    >
                      <RotateCcw className="w-4 h-4" /> Restart
                    </button>

                    <button
                      onClick={handleEndSession}
                      className="px-6 py-3.5 rounded-xl text-xs font-black uppercase tracking-wider text-white bg-red-500 hover:bg-red-600 active:scale-98 transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      End Session
                    </button>
                  </>
                )}
              </div>

            </div>
          </div>


          {/* ================= RIGHT SECTION: FOCUS MUSIC SIDEBAR (Span 5) ================= */}
          <div className="lg:col-span-5 space-y-5">
            


          </div>

        </div>
      ) : (
        /* ================= FOCUS HISTORY VIEW LOG ================= */
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-[28px] p-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
              <div>
                <h3 className="text-lg font-extrabold text-[#1F2937]">Focus Session Logs</h3>
                <p className="text-xs text-gray-500 font-semibold mt-0.5">Historical overview of completed concentration blocks.</p>
              </div>
              <span className="text-xs font-black text-[#0F766E] bg-[#E6F4EA] px-3.5 py-1.5 rounded-full border border-[#D1E7DD]">
                {completedSessions.length} total sessions
              </span>
            </div>

            {/* List log items */}
            <div className="space-y-3.5">
              {completedSessions.map((session, i) => (
                <div 
                  key={session.id || i}
                  className="p-4 border border-gray-100 rounded-2xl bg-slate-50/50 hover:bg-white hover:shadow-xs transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-teal-100 text-[#0F766E] flex items-center justify-center font-black shrink-0 text-sm">
                      ✓
                    </div>
                    <div>
                      <h4 className="text-sm font-extrabold text-gray-900">{session.taskTitle}</h4>
                      <p className="text-xs text-gray-400 font-bold flex items-center gap-1.5 mt-1">
                        <span>📅 {session.dateStr}</span>
                        <span>•</span>
                        <span>⏱️ {session.startTime} - {session.endTime}</span>
                        <span>•</span>
                        <span>🎵 {session.musicTrack}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0 self-end sm:self-auto">
                    <div className="text-right">
                      <span className="text-xs text-gray-400 font-bold block">Duration</span>
                      <span className="text-sm font-black text-gray-900">{session.durationMinutes} min</span>
                    </div>
                    <div className="px-3 py-1 bg-emerald-100 rounded-full border border-emerald-200 text-emerald-800 text-[10px] font-black uppercase tracking-wider">
                      Score: {session.score}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= SESSION SUMMARY COMPLETION MODAL ================= */}
      <AnimatePresence>
        {isCompleted && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md overflow-hidden"
          >
            {/* Ambient celebration particles */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
              {[...Array(12)].map((_, idx) => (
                <motion.div
                  key={idx}
                  initial={{ y: -20, x: Math.random() * 800 - 400, opacity: 0, rotate: 0 }}
                  animate={{ 
                    y: [0, 600], 
                    x: [0, Math.sin(idx) * 80],
                    opacity: [0, 1, 0], 
                    rotate: [0, 360] 
                  }}
                  transition={{ 
                    duration: 4 + Math.random() * 3, 
                    repeat: Infinity, 
                    delay: idx * 0.3 
                  }}
                  className="absolute top-0 left-1/2 text-2xl text-emerald-400"
                >
                  ✨
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ scale: 0.85, y: 25 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.85, y: 25 }}
              className="bg-white rounded-[32px] p-8 max-w-md w-full text-center border-4 border-[#0F766E] shadow-2xl relative overflow-hidden z-10"
            >
              {/* Confetti border topper */}
              <div className="absolute top-0 inset-x-0 h-3 bg-gradient-to-r from-emerald-400 via-[#0F766E] to-teal-700" />
              
              <div className="relative my-4 flex justify-center items-center">
                <motion.div
                  initial={{ scale: 0.2, rotate: -10 }}
                  animate={{ scale: [0.2, 1.25, 1], rotate: [0, 5, 0] }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className="w-20 h-20 rounded-full bg-[#E6F4EA] border-4 border-[#0F766E] flex items-center justify-center text-4xl shadow-md"
                >
                  🎉
                </motion.div>
              </div>

              <h3 className="text-2xl font-black text-gray-900 font-display">Focus Session Completed!</h3>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mt-1">Excellent concentration block</p>

              {/* Complete details panel */}
              <div className="my-6 p-4 rounded-2xl bg-[#F8FAFC] border border-gray-100 space-y-3.5 text-left text-xs font-bold text-gray-700 shadow-inner">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 uppercase tracking-wider flex items-center gap-1.5 font-bold">
                    ⏱️ Session Duration
                  </span>
                  <span className="text-gray-900 font-black">{targetMinutes} Minutes</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 uppercase tracking-wider flex items-center gap-1.5 font-bold">
                    🌅 Start Time
                  </span>
                  <span className="text-gray-900 font-black">{startTime || '08:00 AM'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 uppercase tracking-wider flex items-center gap-1.5 font-bold">
                    🌇 End Time
                  </span>
                  <span className="text-gray-900 font-black">
                    {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 uppercase tracking-wider flex items-center gap-1.5 font-bold">
                    🎵 Music Played
                  </span>
                  <span className="text-gray-900 font-black truncate max-w-[180px]">
                    {selectedTrack ? selectedTrack.title : 'Silent Reflection'}
                  </span>
                </div>
                <div className="flex justify-between items-center border-t border-gray-200/60 pt-2.5 mt-1">
                  <span className="text-gray-400 uppercase tracking-wider flex items-center gap-1.5 font-bold">
                    🏆 Focus Score
                  </span>
                  <span className="text-[#0F766E] font-black text-sm">100 / 100</span>
                </div>
              </div>

              <p className="text-xs text-gray-500 font-semibold italic mb-6 leading-relaxed">
                "Fantastic job Deepika! You've maintained complete focus on '{currentTask}'. Your focus pathways are locked in."
              </p>

              <button
                type="button"
                onClick={() => {
                  setIsCompleted(false);
                  setFocusTab('synapses');
                }}
                className="w-full py-3.5 bg-[#223148] hover:bg-[#1A2536] text-white font-black rounded-2xl text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer"
              >
                Close Summary
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
