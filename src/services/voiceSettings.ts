export interface VoiceSettings {
  enabled: boolean;
  autoSpeak: boolean;
  gender: 'male' | 'female' | 'other';
  speed: number; // 0.75, 1.0, 1.25, 1.5
  pitch: number; // 0.5 to 1.5
  volume: number; // 0 to 1.0
}

export const defaultVoiceSettings: VoiceSettings = {
  enabled: true,
  autoSpeak: true,
  gender: 'female',
  speed: 1.0,
  pitch: 1.0,
  volume: 1.0,
};

const STORAGE_KEY = 'taskaroa_voice_settings';

export function getVoiceSettings(): VoiceSettings {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return { ...defaultVoiceSettings, ...JSON.parse(saved) };
    }
  } catch (e) {
    console.error('Error reading voice settings:', e);
  }
  return defaultVoiceSettings;
}

export function saveVoiceSettings(settings: VoiceSettings): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Error saving voice settings:', e);
  }
}
