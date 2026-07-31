import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Volume2, 
  VolumeX, 
  Save, 
  X, 
  Trash2, 
  LogOut, 
  Flame, 
  Trophy, 
  Target, 
  TrendingUp, 
  Award, 
  Check, 
  AlertTriangle,
  Sparkles,
  HelpCircle,
  Globe
} from 'lucide-react';
import { useProfile } from '../context/ProfileContext';
import { useData } from '../context/DataContext';
import { getStreakData } from '../services/streakService';
import { getAchievements } from '../services/achievementService';
import { getForestProgress } from '../services/forestProgressService';
import { CHALLENGE_OPTIONS } from '../services/challengeService';
import { speakText } from '../services/speechService';
import GithubContributionCalendar from './GithubContributionCalendar';
import StreakCalendar from './StreakCalendar';

interface ProfileSettingsPageProps {
  onClose: () => void;
}

const PHONE_COUNTRY_CODES = [
  { code: '+1', country: 'US/CA 🇺🇸🇨🇦' },
  { code: '+44', country: 'UK 🇬🇧' },
  { code: '+91', country: 'IN 🇮🇳' },
  { code: '+61', country: 'AU 🇦🇺' },
  { code: '+49', country: 'DE 🇩🇪' },
  { code: '+33', country: 'FR 🇫🇷' },
  { code: '+81', country: 'JP 🇯🇵' },
  { code: '+65', country: 'SG 🇸🇬' },
  { code: '+971', country: 'UAE 🇦🇪' },
];

const PRIMARY_GOAL_OPTIONS = [
  'Build consistent study habits',
  'Maximize work productivity',
  'Manage daily tasks efficiently',
  'Track personal growth & focus',
  'Achieve academic excellence',
  'Maintain work-life balance',
  'Boost daily focus & mindfulness',
];

const IMPROVEMENT_OPTIONS = [
  'Time management & focus',
  'Consistency & streak tracking',
  'Task prioritization',
  'Exam preparation',
  'Reducing procrastination',
  'Habit formation & routine',
  'Stress management & well-being',
];

const LOCATION_OPTIONS = [
  'United States (New York / Los Angeles)',
  'United Kingdom (London)',
  'India (New Delhi / Bangalore)',
  'Canada (Toronto / Vancouver)',
  'Australia (Sydney / Melbourne)',
  'Germany (Berlin)',
  'France (Paris)',
  'Japan (Tokyo)',
  'Singapore',
  'United Arab Emirates (Dubai)'
];

export default function ProfileSettingsPage({ onClose }: ProfileSettingsPageProps) {
  const { profile, setProfile } = useProfile();
  const { streak, completedDates, streakTarget, setStreakTarget, tasks } = useData();

  // Local Form States initialized from ProfileContext
  const [name, setName] = useState(profile.name || 'Deepika S');
  const [email, setEmail] = useState(profile.email || 'sdeepika2606@gmail.com');
  const [countryCode, setCountryCode] = useState('+1');
  const [phone, setPhone] = useState('555-0199');
  const [location, setLocation] = useState(profile.location || 'United States (New York / Los Angeles)');
  
  // Voice Assistant Settings States
  const [voiceEnabled, setVoiceEnabled] = useState(profile.voiceSettings?.enabled ?? true);
  const [voiceGender, setVoiceGender] = useState<'male' | 'female' | 'other'>(profile.voiceSettings?.gender || (profile.gender === 'male' ? 'male' : 'female'));
  const [voiceSpeed, setVoiceSpeed] = useState<'Slow' | 'Normal' | 'Fast'>(profile.voiceSettings?.speed || 'Normal');
  const [voiceVolume, setVoiceVolume] = useState<number>(profile.voiceSettings?.volume ?? 80);
  const [speakQuotes, setSpeakQuotes] = useState<boolean>(profile.voiceSettings?.speakQuotes ?? true);
  const [speakReminders, setSpeakReminders] = useState<boolean>(profile.voiceSettings?.speakReminders ?? true);
  const [speakFocusUpdates, setSpeakFocusUpdates] = useState<boolean>(profile.voiceSettings?.speakFocusUpdates ?? true);
  const [speakTaskCompletion, setSpeakTaskCompletion] = useState<boolean>(profile.voiceSettings?.speakTaskCompletion ?? true);

  // Questionnaire States
  const [primaryGoal, setPrimaryGoal] = useState(profile.primaryGoal || PRIMARY_GOAL_OPTIONS[0]);
  const [lookingToImprove, setLookingToImprove] = useState(profile.lookingToImprove || IMPROVEMENT_OPTIONS[0]);

  // UI Modals / Toasts / Audio Testing
  const [showSavedToast, setShowSavedToast] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isTestingVoice, setIsTestingVoice] = useState(false);

  // Derived Statistics for Focus Streak Section
  const streakData = getStreakData();
  const completedTasksCount = tasks.filter(t => t.completed).length;
  const achievements = getAchievements(streak, completedTasksCount, 340);
  const forestProg = getForestProgress(streak, completedDates, completedTasksCount);

  const handleTestVoice = () => {
    setIsTestingVoice(true);
    const firstName = name.split(' ')[0] || 'User';
    speakText(
      `Hi ${firstName}! I am your Taskaroa AI Voice Companion. Let's complete your goals and build great habits together!`,
      {
        enabled: true,
        gender: voiceGender,
        speed: voiceSpeed,
        volume: voiceVolume,
        speakQuotes,
        speakReminders,
        speakFocusUpdates,
        speakTaskCompletion,
        enableGreeting: true,
        speakNotifications: true
      },
      () => {
        setIsTestingVoice(false);
      }
    );
    // Timeout safety fallback
    setTimeout(() => {
      setIsTestingVoice(false);
    }, 6000);
  };

  const handleSaveChanges = () => {
    setProfile(prev => ({
      ...prev,
      name,
      email,
      gender: voiceGender,
      location,
      primaryGoal,
      lookingToImprove,
      voiceSettings: {
        ...prev.voiceSettings,
        enabled: voiceEnabled,
        gender: voiceGender,
        speed: voiceSpeed,
        volume: voiceVolume,
        speakQuotes,
        speakReminders,
        speakFocusUpdates,
        speakTaskCompletion,
        enableGreeting: true
      }
    }));

    setShowSavedToast(true);
    setTimeout(() => setShowSavedToast(false), 3000);
  };

  const handleDeleteAccount = () => {
    localStorage.clear();
    window.location.reload();
  };

  const handleLogout = () => {
    onClose();
    window.location.reload();
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 md:p-8 space-y-8 font-sans pb-24">
      
      {/* 2. HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-[#2F4156] to-[#567C8D] text-white p-6 md:p-8 rounded-[32px] border border-[#C8D9E6]/30 shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-3xl font-black text-white tracking-tight">
            Profile Settings
          </h2>
          <p className="text-xs md:text-sm text-[#C8D9E6] font-medium mt-1">
            Manage your account preferences and personalize your experience.
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="self-start md:self-auto bg-white/10 hover:bg-white/20 text-white p-2.5 rounded-full backdrop-blur-md transition-colors cursor-pointer border border-white/10"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* 3. AI VOICE COMPANION SECTION */}
      <div className="bg-white rounded-[28px] p-6 md:p-8 border border-gray-100 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#567C8D]" />
              <h3 className="text-xl font-black text-[#2F4156]">
                AI Voice Companion
              </h3>
            </div>
            <p className="text-xs text-gray-500 font-medium mt-1">
              Configure your intelligent voice coach for daily briefings, focus mode updates, and completion celebrations.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleTestVoice}
              disabled={isTestingVoice || !voiceEnabled}
              className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 border cursor-pointer ${
                isTestingVoice
                  ? 'bg-amber-500 text-white border-amber-600 animate-pulse'
                  : voiceEnabled
                  ? 'bg-[#2F4156] text-white hover:bg-[#567C8D] border-[#2F4156] shadow-sm'
                  : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
              }`}
            >
              <Volume2 className="w-4 h-4" />
              <span>{isTestingVoice ? 'Speaking...' : 'Test Voice Button'}</span>
            </button>

            <button
              type="button"
              onClick={() => setVoiceEnabled(!voiceEnabled)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                voiceEnabled
                  ? 'bg-[#F5EFEB] text-[#2F4156] border-[#C8D9E6]'
                  : 'bg-red-50 text-red-600 border-red-200'
              }`}
            >
              {voiceEnabled ? (
                <>
                  <Volume2 className="w-4 h-4" /> Enable Voice Assistant
                </>
              ) : (
                <>
                  <VolumeX className="w-4 h-4" /> Disable Voice Assistant
                </>
              )}
            </button>
          </div>
        </div>

        {/* Voice Gender & Speed Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Gender */}
          <div>
            <label className="text-xs font-black text-gray-700 block mb-2 uppercase tracking-wider">Voice Gender</label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setVoiceGender('female')}
                className={`flex-1 py-3.5 rounded-2xl text-xs font-black transition-all border cursor-pointer flex items-center justify-center gap-2 ${
                  voiceGender === 'female'
                    ? 'bg-[#2F4156] text-white border-[#2F4156] shadow-md'
                    : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                }`}
              >
                👩 Female
              </button>
              <button
                type="button"
                onClick={() => setVoiceGender('male')}
                className={`flex-1 py-3.5 rounded-2xl text-xs font-black transition-all border cursor-pointer flex items-center justify-center gap-2 ${
                  voiceGender === 'male'
                    ? 'bg-[#2F4156] text-white border-[#2F4156] shadow-md'
                    : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                }`}
              >
                👨 Male
              </button>
            </div>
          </div>

          {/* Speed */}
          <div>
            <label className="text-xs font-black text-gray-700 block mb-2 uppercase tracking-wider">Voice Speed</label>
            <div className="flex gap-2">
              {(['Slow', 'Normal', 'Fast'] as const).map((spd) => (
                <button
                  key={spd}
                  type="button"
                  onClick={() => setVoiceSpeed(spd)}
                  className={`flex-1 py-3.5 rounded-2xl text-xs font-black transition-all border cursor-pointer ${
                    voiceSpeed === spd
                      ? 'bg-[#2F4156] text-white border-[#2F4156] shadow-md'
                      : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  {spd}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Voice Volume Slider */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-black text-gray-700 uppercase tracking-wider">Voice Volume</label>
            <span className="text-xs font-bold text-[#567C8D]">{voiceVolume}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={voiceVolume}
            onChange={(e) => setVoiceVolume(parseInt(e.target.value, 10))}
            className="w-full accent-[#567C8D] cursor-pointer"
          />
        </div>

        {/* Behavior Toggles */}
        <div className="pt-2 border-t border-gray-100 space-y-3">
          <span className="text-xs font-black text-gray-800 uppercase tracking-wider block">Voice Behavior Triggers</span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="flex items-center justify-between p-3.5 bg-gray-50 rounded-2xl border border-gray-200 cursor-pointer hover:bg-gray-100/80 transition-colors">
              <span className="text-xs font-bold text-gray-800">Speak Motivational Quotes</span>
              <input
                type="checkbox"
                checked={speakQuotes}
                onChange={(e) => setSpeakQuotes(e.target.checked)}
                className="w-4 h-4 accent-[#0F7A5C] rounded cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 bg-gray-50 rounded-2xl border border-gray-200 cursor-pointer hover:bg-gray-100/80 transition-colors">
              <span className="text-xs font-bold text-gray-800">Speak Reminders</span>
              <input
                type="checkbox"
                checked={speakReminders}
                onChange={(e) => setSpeakReminders(e.target.checked)}
                className="w-4 h-4 accent-[#0F7A5C] rounded cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 bg-gray-50 rounded-2xl border border-gray-200 cursor-pointer hover:bg-gray-100/80 transition-colors">
              <span className="text-xs font-bold text-gray-800">Speak Focus Timer Updates</span>
              <input
                type="checkbox"
                checked={speakFocusUpdates}
                onChange={(e) => setSpeakFocusUpdates(e.target.checked)}
                className="w-4 h-4 accent-[#0F7A5C] rounded cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 bg-gray-50 rounded-2xl border border-gray-200 cursor-pointer hover:bg-gray-100/80 transition-colors">
              <span className="text-xs font-bold text-gray-800">Speak Task Completion</span>
              <input
                type="checkbox"
                checked={speakTaskCompletion}
                onChange={(e) => setSpeakTaskCompletion(e.target.checked)}
                className="w-4 h-4 accent-[#0F7A5C] rounded cursor-pointer"
              />
            </label>
          </div>
        </div>

      </div>

      {/* 4. PERSONAL INFORMATION SECTION */}
      <div className="bg-white rounded-[28px] p-6 md:p-8 border border-gray-100 shadow-sm space-y-6">
        <div>
          <h3 className="text-lg font-black text-[#1A3C34]">Personal Information</h3>
          <p className="text-xs text-gray-500 font-medium mt-0.5">
            Update your profile identity and location.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          
          {/* Full Name */}
          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1.5">Full Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-semibold text-gray-900 focus:outline-none focus:border-[#0F7A5C]"
                placeholder="Enter your full name"
              />
            </div>
          </div>

          {/* Email Address */}
          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-semibold text-gray-900 focus:outline-none focus:border-[#0F7A5C]"
                placeholder="Enter your email"
              />
            </div>
          </div>

          {/* Worldwide Phone Number */}
          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1.5">Worldwide Phone Number</label>
            <div className="flex gap-2">
              <select
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                className="bg-gray-50 border border-gray-200 rounded-2xl px-3 py-3 text-xs font-bold text-gray-800 focus:outline-none focus:border-[#0F7A5C]"
              >
                {PHONE_COUNTRY_CODES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.code} ({c.country})
                  </option>
                ))}
              </select>
              <div className="relative flex-1">
                <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-semibold text-gray-900 focus:outline-none focus:border-[#0F7A5C]"
                  placeholder="Phone number"
                />
              </div>
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1.5">Location</label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-semibold text-gray-900 focus:outline-none focus:border-[#0F7A5C]"
              >
                {LOCATION_OPTIONS.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>
          </div>

        </div>
      </div>

      {/* 5. PERSONALIZATION QUESTIONNAIRE SECTION */}
      <div className="bg-white rounded-[28px] p-6 md:p-8 border border-gray-100 shadow-sm space-y-6">
        <div>
          <h3 className="text-lg font-black text-[#1A3C34] flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-[#0F7A5C]" />
            Help us personalize your experience
          </h3>
          <p className="text-xs text-gray-500 font-medium mt-0.5">
            Please answer a few questions to get the most out of Taskaroa.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1.5">What is your primary goal?</label>
            <select
              value={primaryGoal}
              onChange={(e) => setPrimaryGoal(e.target.value)}
              className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-semibold text-gray-900 focus:outline-none focus:border-[#0F7A5C]"
            >
              {PRIMARY_GOAL_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1.5">What are you looking to improve the most?</label>
            <select
              value={lookingToImprove}
              onChange={(e) => setLookingToImprove(e.target.value)}
              className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-semibold text-gray-900 focus:outline-none focus:border-[#0F7A5C]"
            >
              {IMPROVEMENT_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 7. PROFILE SETTINGS - STREAK DASHBOARD SECTION */}
      <div className="bg-white text-gray-900 rounded-[32px] p-6 md:p-8 border border-gray-100 shadow-sm space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-gray-100 pb-4">
          <div>
            <h3 className="text-2xl font-black text-gray-900 flex items-center gap-2.5">
              <Flame className="w-6 h-6 text-amber-500 fill-amber-500" />
              Streak & Activity Analytics
            </h3>
            <p className="text-xs text-gray-500 font-medium mt-0.5">
              Comprehensive streak analytics, habit history, and 365-day contribution heatmaps.
            </p>
          </div>

          {/* Challenge Selector */}
          <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-2xl border border-gray-200">
            <Target className="w-4 h-4 text-amber-500" />
            <span className="text-xs font-bold text-gray-600">Challenge:</span>
            <select
              value={streakTarget}
              onChange={(e) => setStreakTarget(parseInt(e.target.value, 10))}
              className="bg-white text-gray-900 text-xs font-black rounded-xl px-2.5 py-1 border border-gray-200 focus:outline-none cursor-pointer"
            >
              {CHALLENGE_OPTIONS.map((c) => (
                <option key={c.days} value={c.days}>
                  {c.days} Days ({c.label})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Top 3 Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 text-center">
            <span className="text-[10px] font-black uppercase text-gray-400">🔥 Current Streak</span>
            <div className="text-3xl font-black text-gray-900 mt-1">{streak} Days</div>
            <p className="text-[10px] text-gray-500 font-medium mt-0.5">Active Daily Progress</p>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 text-center">
            <span className="text-[10px] font-black uppercase text-gray-400">🏆 Longest Streak</span>
            <div className="text-3xl font-black text-gray-900 mt-1">{streakData.longestStreak} Days</div>
            <p className="text-[10px] text-gray-500 font-medium mt-0.5">Personal All-Time Record</p>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 text-center">
            <span className="text-[10px] font-black uppercase text-gray-400">📈 Productivity Score</span>
            <div className="text-3xl font-black text-gray-900 mt-1">{forestProg.productivityScore}</div>
            <p className="text-[10px] text-gray-500 font-medium mt-0.5">Out of 100 XP</p>
          </div>
        </div>

        {/* 8. GitHub Contribution Style Calendar */}
        <GithubContributionCalendar completedDates={completedDates} />

        {/* Monthly Calendar View */}
        <div>
          <StreakCalendar
            streak={streak}
            completedDates={completedDates}
            streakTarget={streakTarget}
            onSetStreakTarget={setStreakTarget}
          />
        </div>

      </div>

      {/* 9. PROFILE PAGE FOOTER & ACCOUNT SECTION */}
      <div className="bg-white rounded-[28px] p-6 md:p-8 border border-gray-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Action Buttons: Save & Cancel */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            type="button"
            onClick={handleSaveChanges}
            className="flex-1 md:flex-initial bg-[#0F7A5C] hover:bg-[#0A5C45] text-white font-black py-3.5 px-8 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 text-xs cursor-pointer"
          >
            <Save className="w-4 h-4" /> Save Changes
          </button>

          <button
            type="button"
            onClick={onClose}
            className="flex-1 md:flex-initial bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3.5 px-6 rounded-2xl text-xs transition-all cursor-pointer"
          >
            Cancel
          </button>
        </div>

        {/* Secondary Account Actions: Logout & Delete Account */}
        <div className="flex items-center gap-3 w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0 border-gray-100">
          <button
            type="button"
            onClick={handleLogout}
            className="flex-1 md:flex-initial bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold py-3 px-5 rounded-2xl text-xs transition-all border border-amber-200 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>

          <button
            type="button"
            onClick={() => setShowDeleteModal(true)}
            className="flex-1 md:flex-initial bg-red-50 hover:bg-red-100 text-red-600 font-bold py-3 px-5 rounded-2xl text-xs transition-all border border-red-200 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Trash2 className="w-4 h-4" /> Delete Account
          </button>
        </div>

      </div>

      {/* Saved Changes Toast Notification */}
      <AnimatePresence>
        {showSavedToast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 right-6 z-50 bg-[#0F7A5C] text-white px-6 py-3.5 rounded-2xl shadow-2xl border border-[#52B788] flex items-center gap-2 text-xs font-black"
          >
            <Check className="w-4 h-4" /> Profile Settings Saved Successfully!
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Account Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full border border-gray-100 shadow-2xl text-center space-y-4"
            >
              <div className="w-14 h-14 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mx-auto">
                <AlertTriangle className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-xl font-black text-gray-900">Are you sure?</h3>
                <p className="text-xs text-gray-500 font-medium mt-1">
                  This will permanently clear your local data, streak history, and preferences. This action cannot be undone.
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 rounded-2xl text-xs transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDeleteAccount}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-black py-3 rounded-2xl text-xs transition-all shadow-md cursor-pointer"
                >
                  Delete permanently
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
