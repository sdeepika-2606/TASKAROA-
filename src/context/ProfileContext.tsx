import React, { createContext, useContext, useState, useEffect } from 'react';

export interface VoiceAssistantSettings {
  enabled: boolean;
  gender: 'male' | 'female' | 'other';
  enableGreeting: boolean;
  speakNotifications: boolean;
  speakReminders: boolean;
  speakQuotes?: boolean;
  speakFocusUpdates?: boolean;
  speakTaskCompletion?: boolean;
  volume: number; // 0 to 100
  speed: 'Slow' | 'Normal' | 'Fast';
}

export interface QuoteSettings {
  enabled: boolean;
  showOnLogin: boolean;
  showOnDashboard: boolean;
  neverShowAgain: boolean;
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  location: string;
  country: string;
  timeZone: string;
  password?: string;
  gender: 'male' | 'female' | 'other';
  role: string;
  accountType: string;
  theme: 'light' | 'dark';
  primaryGoal?: string;
  improvementGoal?: string;
  lookingToImprove?: string;
  isNewAccount?: boolean;
  hasSeenWelcomeTour?: boolean;
  neverShowTour?: boolean;
  address?: string;
  website?: string;
  social?: string;
  avatarUrl?: string;
  photoFileName?: string;
  voiceSettings: VoiceAssistantSettings;
  quoteSettings: QuoteSettings;
}

const defaultVoiceSettings: VoiceAssistantSettings = {
  enabled: true,
  gender: 'female',
  enableGreeting: true,
  speakNotifications: true,
  speakReminders: true,
  speakQuotes: true,
  speakFocusUpdates: true,
  speakTaskCompletion: true,
  volume: 80,
  speed: 'Normal',
};

const defaultQuoteSettings: QuoteSettings = {
  enabled: true,
  showOnLogin: true,
  showOnDashboard: true,
  neverShowAgain: false,
};

const defaultProfile: UserProfile = {
  name: 'Deepika S',
  email: 'sdeepika2606@gmail.com',
  phone: '+1 555-0199',
  location: 'New York, United States',
  country: 'United States',
  timeZone: 'EST (UTC-5)',
  password: '••••••••••••',
  gender: 'female',
  role: 'professional',
  accountType: 'Professional',
  theme: 'light',
  primaryGoal: 'Build consistent study habits',
  improvementGoal: 'Time management & Focus',
  isNewAccount: false,
  hasSeenWelcomeTour: false,
  neverShowTour: false,
  voiceSettings: defaultVoiceSettings,
  quoteSettings: defaultQuoteSettings,
};

interface ProfileContextType {
  profile: UserProfile;
  setProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('taskaroa_profile');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return { 
          ...defaultProfile, 
          ...parsed, 
          voiceSettings: { ...defaultVoiceSettings, ...(parsed.voiceSettings || {}) },
          quoteSettings: { ...defaultQuoteSettings, ...(parsed.quoteSettings || {}) },
          theme: 'light' 
        };
      } catch (e) {
        return defaultProfile;
      }
    }
    return defaultProfile;
  });

  useEffect(() => {
    const updated = { ...profile, theme: 'light' as const };
    localStorage.setItem('taskaroa_profile', JSON.stringify(updated));
    document.documentElement.classList.remove('dark');
  }, [profile]);

  return (
    <ProfileContext.Provider value={{ profile, setProfile }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) throw new Error('useProfile must be used within ProfileProvider');
  return context;
};
