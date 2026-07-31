import { useState, useEffect, useCallback, useRef } from 'react';
import { getVoiceSettings, VoiceSettings } from '../services/voiceSettings';

export interface UseSpeechReturn {
  isSpeaking: boolean;
  isPaused: boolean;
  isSupported: boolean;
  speak: (text: string, overrideSettings?: Partial<VoiceSettings>) => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  voices: SpeechSynthesisVoice[];
  settings: VoiceSettings;
  updateSettings: (newSettings: Partial<VoiceSettings>) => void;
}

export function useSpeech(): UseSpeechReturn {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [settings, setSettingsState] = useState<VoiceSettings>(getVoiceSettings());
  
  const synthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
      setIsSupported(true);

      const updateVoices = () => {
        if (synthRef.current) {
          const availableVoices = synthRef.current.getVoices();
          setVoices(availableVoices);
        }
      };

      updateVoices();
      if (synthRef.current.onvoiceschanged !== undefined) {
        synthRef.current.onvoiceschanged = updateVoices;
      }
    } else {
      setIsSupported(false);
    }
  }, []);

  const updateSettings = useCallback((newSettings: Partial<VoiceSettings>) => {
    setSettingsState((prev) => {
      const updated = { ...prev, ...newSettings };
      return updated;
    });
  }, []);

  // Find appropriate voice based on gender preference
  const selectVoice = useCallback((targetGender: 'male' | 'female' | 'other', availableVoices: SpeechSynthesisVoice[]) => {
    if (!availableVoices.length) return null;

    const lowerGender = targetGender.toLowerCase();

    // 1. Try finding voice explicitly containing gender name or common voice names
    const maleKeywords = ['male', 'david', 'mark', 'george', 'james', 'daniel', 'alex', 'fred'];
    const femaleKeywords = ['female', 'zira', 'samantha', 'victoria', 'karen', 'fiona', 'moira', 'google us english', 'google uk english female'];

    const targetKeywords = lowerGender === 'male' ? maleKeywords : femaleKeywords;

    const matchedVoice = availableVoices.find((v) => {
      const name = v.name.toLowerCase();
      return targetKeywords.some((kw) => name.includes(kw));
    });

    if (matchedVoice) return matchedVoice;

    // 2. English voice default
    const englishVoice = availableVoices.find((v) => v.lang.startsWith('en'));
    if (englishVoice) return englishVoice;

    // 3. Fallback
    return availableVoices[0];
  }, []);

  const stop = useCallback(() => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
      setIsPaused(false);
    }
  }, []);

  const pause = useCallback(() => {
    if (synthRef.current && isSpeaking && !isPaused) {
      synthRef.current.pause();
      setIsPaused(true);
    }
  }, [isSpeaking, isPaused]);

  const resume = useCallback(() => {
    if (synthRef.current && isPaused) {
      synthRef.current.resume();
      setIsPaused(false);
    }
  }, [isPaused]);

  const speak = useCallback((text: string, overrideSettings?: Partial<VoiceSettings>) => {
    if (!synthRef.current || !text) return;

    const activeSettings = { ...settings, ...overrideSettings };
    if (!activeSettings.enabled) return;

    // Cancel any previous utterance
    synthRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = activeSettings.speed || 1.0;
    utterance.pitch = activeSettings.pitch || 1.0;
    utterance.volume = activeSettings.volume !== undefined ? activeSettings.volume : 1.0;

    const currentVoices = synthRef.current.getVoices();
    const chosenVoice = selectVoice(activeSettings.gender, currentVoices);
    if (chosenVoice) {
      utterance.voice = chosenVoice;
    }

    utterance.onstart = () => {
      setIsSpeaking(true);
      setIsPaused(false);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };

    utterance.onerror = (e) => {
      console.warn('SpeechSynthesis error:', e);
      setIsSpeaking(false);
      setIsPaused(false);
    };

    synthRef.current.speak(utterance);
  }, [settings, selectVoice]);

  return {
    isSpeaking,
    isPaused,
    isSupported,
    speak,
    pause,
    resume,
    stop,
    voices,
    settings,
    updateSettings,
  };
}
