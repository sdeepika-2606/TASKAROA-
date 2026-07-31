import { VoiceAssistantSettings } from '../context/ProfileContext';

let voices: SpeechSynthesisVoice[] = [];

function loadVoices(): SpeechSynthesisVoice[] {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    voices = window.speechSynthesis.getVoices();
  }
  return voices;
}

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  loadVoices();
  if (window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = () => {
      loadVoices();
    };
  }
}

export const getBestVoice = (gender: 'male' | 'female' | 'other'): SpeechSynthesisVoice | null => {
  const currentVoices = loadVoices();
  if (!currentVoices || currentVoices.length === 0) return null;

  const englishVoices = currentVoices.filter(v => v.lang.startsWith('en'));
  const candidatePool = englishVoices.length > 0 ? englishVoices : currentVoices;

  const maleNames = ['david', 'alex', 'daniel', 'fred', 'george', 'james', 'richard', 'male', 'guy', 'mark', 'tom', 'google us english'];
  const femaleNames = ['samantha', 'victoria', 'karen', 'zira', 'fiona', 'moira', 'siri', 'female', 'susan', 'lisa', 'google uk english female'];

  if (gender === 'male') {
    const maleVoice = candidatePool.find(v => 
      maleNames.some(name => v.name.toLowerCase().includes(name))
    );
    if (maleVoice) return maleVoice;
  } else {
    const femaleVoice = candidatePool.find(v => 
      femaleNames.some(name => v.name.toLowerCase().includes(name))
    );
    if (femaleVoice) return femaleVoice;
  }

  return candidatePool[0] || null;
};

export const stopSpeech = (): void => {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
};

export const speakText = (
  text: string,
  settings?: VoiceAssistantSettings,
  onEnd?: () => void
): void => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return;
  }

  if (settings && settings.enabled === false) {
    return;
  }

  const synth = window.speechSynthesis;
  try {
    synth.cancel();
    if (synth.paused) {
      synth.resume();
    }
  } catch (err) {
    console.warn('SpeechSynthesis reset failed:', err);
  }

  const executeSpeak = () => {
    try {
      const utterance = new SpeechSynthesisUtterance(text);

      const gender = settings?.gender || 'female';
      const voice = getBestVoice(gender);
      if (voice) {
        utterance.voice = voice;
      }

      // Speed
      const speed = settings?.speed || 'Normal';
      if (speed === 'Slow') utterance.rate = 0.82;
      else if (speed === 'Fast') utterance.rate = 1.25;
      else utterance.rate = 1.0;

      // Pitch
      utterance.pitch = gender === 'male' ? 0.95 : 1.05;

      // Volume
      const vol = settings?.volume !== undefined ? settings.volume : 80;
      utterance.volume = Math.max(0, Math.min(1, vol / 100));

      if (onEnd) {
        utterance.onend = () => onEnd();
        utterance.onerror = () => onEnd();
      }

      synth.speak(utterance);
    } catch (e) {
      console.warn('Failed to synthesize speech utterance:', e);
      if (onEnd) onEnd();
    }
  };

  const loaded = synth.getVoices();
  if (!loaded || loaded.length === 0) {
    let fired = false;
    const voiceHandler = () => {
      if (!fired) {
        fired = true;
        executeSpeak();
      }
    };
    synth.onvoiceschanged = voiceHandler;
    setTimeout(() => {
      if (!fired) {
        fired = true;
        executeSpeak();
      }
    }, 250);
  } else {
    executeSpeak();
  }
};

// Preset helper functions
export const speakWelcomeGreeting = (
  name: string,
  pendingCount: number,
  highPriorityCount: number,
  settings?: VoiceAssistantSettings
) => {
  const firstName = name.split(' ')[0] || name;
  let text = `Hi ${firstName}! Welcome back to Taskaroa. I'm your AI Productivity Companion. `;
  if (pendingCount > 0) {
    text += `Today you have ${pendingCount} pending task${pendingCount > 1 ? 's' : ''}. `;
    if (highPriorityCount > 0) {
      text += `${highPriorityCount} of them ${highPriorityCount > 1 ? 'are' : 'is'} high priority. `;
    }
    text += `Let's complete them together and grow your forest.`;
  } else {
    text += `You're all caught up on tasks! Great job keeping your forest thriving.`;
  }

  speakText(text, settings);
};

export const speakFocusStart = (
  taskName?: string,
  settings?: VoiceAssistantSettings
) => {
  if (settings && !settings.speakFocusUpdates) return;
  const target = taskName ? `on "${taskName}"` : 'on your work';
  const text = `Awesome. Let's stay focused ${target}. I'll help you finish this task. Your tree is now growing. Stay focused until the timer ends.`;
  speakText(text, settings);
};

export const speakFocusEncouragement = (
  settings?: VoiceAssistantSettings
) => {
  if (settings && !settings.speakFocusUpdates) return;
  const messages = [
    "You're doing great. Keep going. Your forest is growing.",
    "Stay focused. Every minute brings you closer to your goals.",
    "Great discipline! Keep your momentum alive.",
    "Your tree is thriving. Stay in the zone."
  ];
  const msg = messages[Math.floor(Math.random() * messages.length)];
  speakText(msg, settings);
};

export const speakTaskCompleted = (
  taskName?: string,
  streak?: number,
  settings?: VoiceAssistantSettings
) => {
  if (settings && !settings.speakTaskCompletion) return;
  let text = `Fantastic! You completed your task. `;
  if (streak && streak > 0) {
    text += `Your productivity streak has increased to ${streak} days. `;
  }
  text += `Your tree has grown. Keep the momentum going!`;
  speakText(text, settings);
};

export const speakHighPriorityReminder = (
  name: string,
  taskTitle: string,
  settings?: VoiceAssistantSettings
) => {
  if (settings && !settings.speakReminders) return;
  const firstName = name.split(' ')[0] || name;
  const text = `Attention ${firstName}. Your assignment "${taskTitle}" is marked High Priority. Completing it today will keep your streak alive. Would you like to start now?`;
  speakText(text, settings);
};

export const speakQuote = (
  quote: string,
  settings?: VoiceAssistantSettings
) => {
  if (settings && !settings.speakQuotes) return;
  speakText(quote, settings);
};
