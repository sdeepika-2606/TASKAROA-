import React, { useState, useEffect, useRef } from 'react';
import { useProfile } from '../context/ProfileContext';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Book, 
  BookOpen,
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  Feather, 
  Image as ImageIcon, 
  Lock, 
  Plus, 
  Sparkles, 
  Trash2, 
  Upload, 
  Compass, 
  Leaf, 
  Clock, 
  X,
  Trophy,
  Heart,
  Zap,
  Camera,
  Tag,
  PenTool,
  Bookmark
} from 'lucide-react';
import { cn } from '../lib/utils';

export interface PlacedSticker {
  id: string;
  emoji: string;
  x: number; // percentage or px
  y: number;
  rotation: number;
}

export interface JournalEntry {
  id: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM AM/PM
  year: number;
  month: number; // 0..11
  day: number;
  title: string;
  content: string;
  mood: string; // emoji character or mood key
  moodLabel: string;
  type: 'daily' | 'travel' | 'sports' | 'celebration' | 'overcoming' | 'reflection';
  fontFamily: string;
  photoUrl?: string;
  photoCaption?: string;
  photoAngle?: number; // -15 to 15 degrees rotation
  quote?: string;
  placedStickers?: PlacedSticker[];
  createdAt: string;
}

// Sticker Component for realistic "stuck-on" appearance
const Sticker = ({ 
  emoji, 
  size = 'md', 
  rotation = 0, 
  className,
  onClick 
}: { 
  emoji: string; 
  size?: 'sm' | 'md' | 'lg' | 'xl'; 
  rotation?: number; 
  className?: string;
  onClick?: () => void;
}) => {
  const sizeClasses = {
    sm: 'text-base w-7 h-7',
    md: 'text-xl w-9 h-9',
    lg: 'text-2xl w-11 h-11',
    xl: 'text-3xl w-14 h-14'
  };

  return (
    <div
      onClick={onClick}
      style={{ transform: `rotate(${rotation}deg)` }}
      className={cn(
        "inline-flex items-center justify-center rounded-full bg-white/95 shadow-[0_3px_8px_rgba(0,0,0,0.15)] border-2 border-white/90 select-none transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer backdrop-blur-xs",
        sizeClasses[size],
        className
      )}
    >
      <span className="drop-shadow-xs leading-none">{emoji}</span>
    </div>
  );
};

const CATEGORY_CONFIG: Record<JournalEntry['type'], { label: string; color: string }> = {
  daily: { label: 'Daily Story', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
  travel: { label: 'Travel Log', color: 'bg-sky-100 text-sky-800 border-sky-300' },
  sports: { label: 'Sports & Fitness', color: 'bg-amber-100 text-amber-900 border-amber-300' },
  celebration: { label: 'Celebration', color: 'bg-purple-100 text-purple-800 border-purple-300' },
  overcoming: { label: 'Overcoming Hardship', color: 'bg-rose-100 text-rose-800 border-rose-300' },
  reflection: { label: 'Quiet Reflection', color: 'bg-teal-100 text-teal-800 border-teal-300' },
};

const DEFAULT_MOODS = [
  { emoji: '😄', label: 'Joyful' },
  { emoji: '😊', label: 'Happy' },
  { emoji: '😐', label: 'Neutral' },
  { emoji: '😢', label: 'Hard Day' },
  { emoji: '😡', label: 'Frustrated' },
  { emoji: '🥰', label: 'Loved' },
  { emoji: '😴', label: 'Sleepy' },
  { emoji: '🏆', label: 'Proud' },
  { emoji: '🧘', label: 'Reflective' },
  { emoji: '⚡', label: 'Energetic' },
];

const STICKER_TRAY = [
  '❤️', '⭐', '🌸', '☕', '✈️', '💕', '🐾', '🎵', '🦋', '🌼', '🍀', '💌', '🧸', '🌈', '🍦', '📖', '📸', '✨', '🌙', '🎨'
];

export interface FontOption {
  id: string;
  name: string;
  category: 'Handwriting' | 'Script' | 'Serif' | 'Sans-Serif';
  style: React.CSSProperties;
}

const FONTS: FontOption[] = [
  // Handwriting
  { id: 'Caveat', name: 'Caveat (Natural Handwriting)', category: 'Handwriting', style: { fontFamily: "'Caveat', cursive", fontSize: '1.25rem', lineHeight: '1.6' } },
  { id: 'Kalam', name: 'Kalam (Warm Pen)', category: 'Handwriting', style: { fontFamily: "'Kalam', cursive", fontSize: '1.15rem', lineHeight: '1.7' } },
  { id: 'Patrick Hand', name: 'Patrick Hand', category: 'Handwriting', style: { fontFamily: "'Patrick Hand', cursive", fontSize: '1.15rem', lineHeight: '1.6' } },
  { id: 'Indie Flower', name: 'Indie Flower (Bubbly)', category: 'Handwriting', style: { fontFamily: "'Indie Flower', cursive", fontSize: '1.15rem', lineHeight: '1.6' } },
  { id: 'Shadows Into Light', name: 'Shadows Into Light', category: 'Handwriting', style: { fontFamily: "'Shadows Into Light', cursive", fontSize: '1.2rem', lineHeight: '1.6' } },
  { id: 'Homemade Apple', name: 'Homemade Apple (Pen Look)', category: 'Handwriting', style: { fontFamily: "'Homemade Apple', cursive", fontSize: '1.05rem', lineHeight: '1.8' } },
  { id: 'Reenie Beanie', name: 'Reenie Beanie (Casual)', category: 'Handwriting', style: { fontFamily: "'Reenie Beanie', cursive", fontSize: '1.35rem', lineHeight: '1.6' } },
  { id: 'Nanum Pen Script', name: 'Nanum Pen Script', category: 'Handwriting', style: { fontFamily: "'Nanum Pen Script', cursive", fontSize: '1.25rem', lineHeight: '1.6' } },
  { id: 'Gochi Hand', name: 'Gochi Hand', category: 'Handwriting', style: { fontFamily: "'Gochi Hand', cursive", fontSize: '1.15rem', lineHeight: '1.6' } },
  { id: 'Architects Daughter', name: 'Architects Daughter (Sketch)', category: 'Handwriting', style: { fontFamily: "'Architects Daughter', cursive", fontSize: '1.1rem', lineHeight: '1.7' } },

  // Elegant Script
  { id: 'Dancing Script', name: 'Dancing Script (Flowing)', category: 'Script', style: { fontFamily: "'Dancing Script', cursive", fontSize: '1.25rem', lineHeight: '1.6' } },
  { id: 'Great Vibes', name: 'Great Vibes (Calligraphy)', category: 'Script', style: { fontFamily: "'Great Vibes', cursive", fontSize: '1.4rem', lineHeight: '1.6' } },
  { id: 'Sacramento', name: 'Sacramento (Romantic)', category: 'Script', style: { fontFamily: "'Sacramento', cursive", fontSize: '1.35rem', lineHeight: '1.6' } },
  { id: 'Alex Brush', name: 'Alex Brush (Brush Style)', category: 'Script', style: { fontFamily: "'Alex Brush', cursive", fontSize: '1.3rem', lineHeight: '1.6' } },
  { id: 'Pacifico', name: 'Pacifico (Retro Script)', category: 'Script', style: { fontFamily: "'Pacifico', cursive", fontSize: '1.1rem', lineHeight: '1.7' } },
  { id: 'Allura', name: 'Allura (Fine Script)', category: 'Script', style: { fontFamily: "'Allura', cursive", fontSize: '1.35rem', lineHeight: '1.6' } },

  // Serif
  { id: 'Playfair Display', name: 'Playfair Display (Serif)', category: 'Serif', style: { fontFamily: "'Playfair Display', serif", fontSize: '1.1rem', lineHeight: '1.7' } },
  { id: 'Cormorant Garamond', name: 'Cormorant Garamond', category: 'Serif', style: { fontFamily: "'Cormorant Garamond', serif", fontSize: '1.2rem', lineHeight: '1.7' } },
  { id: 'Libre Baskerville', name: 'Libre Baskerville', category: 'Serif', style: { fontFamily: "'Libre Baskerville', serif", fontSize: '1.05rem', lineHeight: '1.7' } },
  { id: 'EB Garamond', name: 'EB Garamond (Old Book)', category: 'Serif', style: { fontFamily: "'EB Garamond', serif", fontSize: '1.15rem', lineHeight: '1.7' } },
  { id: 'Crimson Text', name: 'Crimson Text', category: 'Serif', style: { fontFamily: "'Crimson Text', serif", fontSize: '1.1rem', lineHeight: '1.7' } },
  { id: 'Times New Roman', name: 'Times New Roman', category: 'Serif', style: { fontFamily: "'Times New Roman', Times, serif", fontSize: '1.1rem', lineHeight: '1.7' } },

  // Clean Sans-Serif
  { id: 'Inter', name: 'Inter (Clean UI)', category: 'Sans-Serif', style: { fontFamily: "'Inter', sans-serif", fontSize: '1.0rem', lineHeight: '1.7' } },
  { id: 'Poppins', name: 'Poppins (Modern Rounded)', category: 'Sans-Serif', style: { fontFamily: "'Poppins', sans-serif", fontSize: '1.0rem', lineHeight: '1.7' } },
  { id: 'Nunito', name: 'Nunito (Friendly)', category: 'Sans-Serif', style: { fontFamily: "'Nunito', sans-serif", fontSize: '1.05rem', lineHeight: '1.7' } },
  { id: 'Quicksand', name: 'Quicksand (Minimal)', category: 'Sans-Serif', style: { fontFamily: "'Quicksand', sans-serif", fontSize: '1.05rem', lineHeight: '1.7' } },
  { id: 'Canvas Sans', name: 'Canvas Sans', category: 'Sans-Serif', style: { fontFamily: "system-ui, sans-serif", fontSize: '1.0rem', lineHeight: '1.7' } },
];

const ROTATING_COVER_QUOTES = [
  "A page a day keeps thoughts clear and heart aligned.",
  "Words hold the key to our inner growth and peace.",
  "Reflect today, flourish tomorrow.",
  "Writing is the painter of the soul.",
  "Each entry is a quiet step towards self-discovery.",
  "Preserve your story, one thought at a time.",
  "Every memory recorded becomes a lifelong treasure."
];

const PRESET_TEMPLATES = [
  { label: 'Temple Visit', url: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80', caption: 'Peaceful temple grounds' },
  { label: 'Ocean Beach', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80', caption: 'Golden sunset at the beach' },
  { label: 'Park / Playground', url: 'https://images.unsplash.com/photo-1519331379826-f10be5486c6f?auto=format&fit=crop&w=800&q=80', caption: 'Sunny afternoon in the green park' },
  { label: 'Mountain Hike', url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80', caption: 'High mountain summit views' },
  { label: 'Cafe & Books', url: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80', caption: 'Cozy coffee and journal reading' },
  { label: 'Sports Victory', url: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=800&q=80', caption: 'Crossing the finish line with joy' },
];

// Rich default diary entries
const INITIAL_SCRAPBOOK_ENTRIES: JournalEntry[] = [
  {
    id: 'entry-2026-06-25',
    date: '2026-06-25',
    time: '08:30 PM',
    year: 2026,
    month: 5, // June
    day: 25,
    title: 'Project Launch Party & Massive Milestone',
    content: 'Today was an unforgettable milestone! Our team officially deployed the flagship platform. Everyone cheered as the deployment status turned green. We celebrated with cake, champagne toasts, and heartfelt speeches. Months of relentless work paid off in full.',
    mood: '🎉',
    moodLabel: 'Celebration',
    type: 'celebration',
    fontFamily: 'Caveat',
    photoUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80',
    photoCaption: 'Celebratory evening with the whole team',
    photoAngle: 3,
    quote: 'Celebrate every step towards your dreams.',
    placedStickers: [],
    createdAt: '2026-06-25T20:30:00Z'
  },
  {
    id: 'entry-2026-06-18',
    date: '2026-06-18',
    time: '04:30 PM',
    year: 2026,
    month: 5, // June
    day: 18,
    title: 'Monsoon Rain & Quiet Cafe Reading',
    content: 'A soft monsoon rain started falling this afternoon. I tucked into my favorite corner cafe near the window, listened to rain drops drumming against the glass, and spent three blissful hours reading my favorite book while sipping hot cardamom tea.',
    mood: '🧘',
    moodLabel: 'Reflective',
    type: 'daily',
    fontFamily: 'Dancing Script',
    photoUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80',
    photoCaption: 'Rainy afternoon reading at the corner cafe',
    photoAngle: -4,
    quote: 'Collect moments, not things.',
    placedStickers: [],
    createdAt: '2026-06-18T16:30:00Z'
  },
  {
    id: 'entry-2026-05-22',
    date: '2026-05-22',
    time: '09:00 AM',
    year: 2026,
    month: 4, // May
    day: 22,
    title: 'First 10K City Marathon Victory!',
    content: 'Crossed the finish line of my very first 10K marathon today! At kilometer 7 my legs felt exhausted and my mind urged me to stop, but I pushed through with deep breaths and focus. Crossing that line in 52 minutes was pure euphoria!',
    mood: '🏆',
    moodLabel: 'Proud',
    type: 'sports',
    fontFamily: 'Poppins',
    photoUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=800&q=80',
    photoCaption: 'Finish line medal moment!',
    photoAngle: 5,
    quote: 'Strength comes from overcoming things you once thought you could not.',
    placedStickers: [],
    createdAt: '2026-05-22T09:00:00Z'
  },
  {
    id: 'entry-2026-03-20',
    date: '2026-03-20',
    time: '06:15 PM',
    year: 2026,
    month: 2, // March
    day: 20,
    title: 'Sunset Walk Along the Ocean Shore',
    content: 'Spent late afternoon walking along the sandy beach. The waves were gentle, and the sky turned incredible shades of violet and amber. Took my sandals off and walked along the water line. Pure peace.',
    mood: '🥰',
    moodLabel: 'Loved',
    type: 'travel',
    fontFamily: 'Pacifico',
    photoUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    photoCaption: 'Waves reflecting sunset colors',
    photoAngle: 6,
    quote: 'Wherever you go, go with all your heart.',
    placedStickers: [],
    createdAt: '2026-03-20T18:15:00Z'
  },
  {
    id: 'entry-2025-12-25',
    date: '2025-12-25',
    time: '08:00 PM',
    year: 2025,
    month: 11, // Dec
    day: 25,
    title: 'Cozy Winter Holidays with Family',
    content: 'Gathered around the fireplace with family. Baked cinnamon cookies, listened to old music records, and exchanged thoughtful gifts. Filled with warm gratitude for the people who make life truly beautiful.',
    mood: '🥰',
    moodLabel: 'Loved',
    type: 'celebration',
    fontFamily: 'Sacramento',
    photoUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    photoCaption: 'Winter evening lights',
    photoAngle: -3,
    quote: 'Happiness is home and family.',
    placedStickers: [],
    createdAt: '2025-12-25T20:00:00Z'
  },
  {
    id: 'entry-2025-08-10',
    date: '2025-08-10',
    time: '05:20 PM',
    year: 2025,
    month: 7, // Aug
    day: 10,
    title: 'Summer Coastline Beach Trip',
    content: 'Took a weekend road trip down the coastline with close friends. Swam in the crystal blue ocean water, collected seashells along the shore, and ate fresh tropical fruit on the beach.',
    mood: '😄',
    moodLabel: 'Joyful',
    type: 'travel',
    fontFamily: 'Caveat',
    photoUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    photoCaption: 'Crystal clear beach waters',
    photoAngle: -6,
    quote: 'We do not remember days, we remember moments.',
    placedStickers: [],
    createdAt: '2025-08-10T17:20:00Z'
  }
];

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

interface JournalViewProps {
  theme?: 'light' | 'dark' | 'contrast';
  userName?: string;
}

export default function JournalView({ theme = 'light', userName = 'Deepika' }: JournalViewProps) {
  const { profile } = useProfile();
  const actualName = profile.name || userName || 'User';
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Stored Journal Entries State
  const [entries, setEntries] = useState<JournalEntry[]>(() => {
    try {
      const saved = localStorage.getItem('taskaroa_journal_entries_v5');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 2) return parsed;
      }
    } catch (e) {
      console.error('Error loading journal entries:', e);
    }
    return INITIAL_SCRAPBOOK_ENTRIES;
  });

  // Stored Bookshelf Years State (Default to 2026 and 2025)
  const [availableYears, setAvailableYears] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('taskaroa_journal_years_v5');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading journal years:', e);
    }
    return [2026, 2025];
  });

  // Rotating quote index for title page
  const [quoteIdx, setQuoteIdx] = useState(0);

  // Navigation State
  const [viewMode, setViewMode] = useState<'bookshelf' | 'months' | 'dayList' | 'entry'>('bookshelf');
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [selectedMonth, setSelectedMonth] = useState<number>(5); // June = 5
  const [activeEntry, setActiveEntry] = useState<JournalEntry | null>(null);

  // Form State for Adding / Editing Entry
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [formDate, setFormDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [formTime, setFormTime] = useState<string>('09:30 AM');
  const [formTitle, setFormTitle] = useState<string>('');
  const [formContent, setFormContent] = useState<string>('');
  const [formMoodEmoji, setFormMoodEmoji] = useState<string>('😊');
  const [formMoodLabel, setFormMoodLabel] = useState<string>('Happy');
  const [formType, setFormType] = useState<JournalEntry['type']>('daily');
  const [formFont, setFormFont] = useState<string>('Caveat');
  const [formPhotoUrl, setFormPhotoUrl] = useState<string>('');
  const [formPhotoCaption, setFormPhotoCaption] = useState<string>('');
  const [formPhotoAngle, setFormPhotoAngle] = useState<number>(-3); // degrees rotation
  const [formQuote, setFormQuote] = useState<string>('');
  const [formPlacedStickers, setFormPlacedStickers] = useState<PlacedSticker[]>([]);

  // Persist entries
  useEffect(() => {
    try {
      localStorage.setItem('taskaroa_journal_entries_v5', JSON.stringify(entries));
    } catch (e) {
      console.error('Error saving journal entries:', e);
    }
  }, [entries]);

  // Persist years
  useEffect(() => {
    try {
      localStorage.setItem('taskaroa_journal_years_v5', JSON.stringify(availableYears));
    } catch (e) {
      console.error('Error saving journal years:', e);
    }
  }, [availableYears]);

  // Rotate quotes
  useEffect(() => {
    const timer = setInterval(() => {
      setQuoteIdx((prev) => (prev + 1) % ROTATING_COVER_QUOTES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  // Handler to Create Next Year Diary
  const handleCreateNextYearDiary = () => {
    const maxYear = availableYears.length > 0 ? Math.max(...availableYears) : 2026;
    const nextYear = maxYear + 1;
    if (!availableYears.includes(nextYear)) {
      const updatedYears = [nextYear, ...availableYears].sort((a, b) => b - a);
      setAvailableYears(updatedYears);
      setSelectedYear(nextYear);
      setViewMode('months');
    }
  };

  // Open year diary
  const handleOpenYear = (year: number) => {
    setSelectedYear(year);
    setViewMode('months');
  };

  // Open month
  const handleOpenMonth = (monthIdx: number) => {
    setSelectedMonth(monthIdx);
    setViewMode('dayList');
  };

  // Create new entry
  const handleStartNewEntry = () => {
    const todayStr = new Date().toISOString().split('T')[0];
    const nowTimeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const randomQuote = ROTATING_COVER_QUOTES[Math.floor(Math.random() * ROTATING_COVER_QUOTES.length)];

    setFormDate(todayStr);
    setFormTime(nowTimeStr);
    setFormTitle('');
    setFormContent('');
    setFormMoodEmoji('😊');
    setFormMoodLabel('Happy');
    setFormType('daily');
    setFormFont('Caveat');
    setFormPhotoUrl('');
    setFormPhotoCaption('');
    setFormPhotoAngle(-2);
    setFormQuote(randomQuote);
    setFormPlacedStickers([]);
    setActiveEntry(null);
    setIsEditing(true);
    setViewMode('entry');
  };

  // View existing entry
  const handleViewEntry = (entry: JournalEntry) => {
    setActiveEntry(entry);
    setFormDate(entry.date);
    setFormTime(entry.time || '10:00 AM');
    setFormTitle(entry.title);
    setFormContent(entry.content);
    setFormMoodEmoji(entry.mood || '😊');
    setFormMoodLabel(entry.moodLabel || 'Happy');
    setFormType(entry.type || 'daily');
    setFormFont(entry.fontFamily || 'Caveat');
    setFormPhotoUrl(entry.photoUrl || '');
    setFormPhotoCaption(entry.photoCaption || '');
    setFormPhotoAngle(entry.photoAngle !== undefined ? entry.photoAngle : -3);
    setFormQuote(entry.quote || ROTATING_COVER_QUOTES[0]);
    setFormPlacedStickers(entry.placedStickers || []);
    setIsEditing(false);
    setViewMode('entry');
  };

  // Upload Photo File Handler
  const handlePhotoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setFormPhotoUrl(reader.result);
          if (!formPhotoCaption) {
            setFormPhotoCaption(file.name.split('.')[0] || 'My Photo');
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Save Entry Handler
  const handleSaveEntry = () => {
    if (!formTitle.trim() && !formContent.trim()) return;

    const dateObj = new Date(formDate);
    const year = dateObj.getFullYear() || selectedYear;
    const month = dateObj.getMonth();
    const day = dateObj.getDate() || 1;

    const assignedQuote = formQuote || ROTATING_COVER_QUOTES[Math.floor(Math.random() * ROTATING_COVER_QUOTES.length)];

    if (activeEntry && !isEditing) {
      setIsEditing(true);
      return;
    }

    if (activeEntry && isEditing) {
      const updated = entries.map((e) => {
        if (e.id === activeEntry.id) {
          return {
            ...e,
            date: formDate,
            time: formTime,
            year,
            month,
            day,
            title: formTitle,
            content: formContent,
            mood: formMoodEmoji,
            moodLabel: formMoodLabel,
            type: formType,
            fontFamily: formFont,
            photoUrl: formPhotoUrl,
            photoCaption: formPhotoCaption,
            photoAngle: formPhotoAngle,
            quote: assignedQuote,
            placedStickers: formPlacedStickers,
          };
        }
        return e;
      });
      setEntries(updated);
      const updatedEntry = updated.find((e) => e.id === activeEntry.id) || null;
      setActiveEntry(updatedEntry);
      setIsEditing(false);
    } else {
      const newEntryObj: JournalEntry = {
        id: 'entry-' + Date.now(),
        date: formDate,
        time: formTime,
        year,
        month,
        day,
        title: formTitle || 'Memories of ' + formDate,
        content: formContent,
        mood: formMoodEmoji,
        moodLabel: formMoodLabel,
        type: formType,
        fontFamily: formFont,
        photoUrl: formPhotoUrl,
        photoCaption: formPhotoCaption,
        photoAngle: formPhotoAngle,
        quote: assignedQuote,
        placedStickers: formPlacedStickers,
        createdAt: new Date().toISOString(),
      };
      setEntries([newEntryObj, ...entries]);
      setActiveEntry(newEntryObj);
      setIsEditing(false);
    }
  };

  // Delete entry
  const handleDeleteEntry = (id: string) => {
    if (confirm('Are you sure you want to delete this diary page?')) {
      setEntries(entries.filter((e) => e.id !== id));
      setActiveEntry(null);
      setViewMode('dayList');
    }
  };

  // Add decorative sticker from tray to page
  const handleAddStickerToPage = (emoji: string) => {
    const newSticker: PlacedSticker = {
      id: 'stk-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
      emoji,
      x: Math.floor(Math.random() * 70) + 15, // 15% to 85%
      y: Math.floor(Math.random() * 60) + 20, // 20% to 80%
      rotation: Math.floor(Math.random() * 30) - 15, // -15 to 15 deg
    };
    setFormPlacedStickers((prev) => [...prev, newSticker]);
  };

  // Remove sticker from page
  const handleRemoveStickerFromPage = (id: string) => {
    setFormPlacedStickers((prev) => prev.filter((s) => s.id !== id));
  };

  // Chronologically Sorted Entries for Page Flipping
  const sortedAllEntries = [...entries].sort((a, b) => a.date.localeCompare(b.date));
  const currentEntryIdx = activeEntry ? sortedAllEntries.findIndex((e) => e.id === activeEntry.id) : -1;
  const hasPrevEntry = currentEntryIdx > 0;
  const hasNextEntry = currentEntryIdx >= 0 && currentEntryIdx < sortedAllEntries.length - 1;

  // Page Turn Action
  const handleNavigateEntry = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && hasPrevEntry) {
      const prevEntry = sortedAllEntries[currentEntryIdx - 1];
      setSelectedYear(prevEntry.year);
      setSelectedMonth(prevEntry.month);
      handleViewEntry(prevEntry);
    } else if (direction === 'next' && hasNextEntry) {
      const nextEntry = sortedAllEntries[currentEntryIdx + 1];
      setSelectedYear(nextEntry.year);
      setSelectedMonth(nextEntry.month);
      handleViewEntry(nextEntry);
    }
  };

  // Filter entries
  const yearEntries = entries.filter((e) => e.year === selectedYear);
  const monthEntries = yearEntries.filter((e) => e.month === selectedMonth);

  // Active font object
  const activeFontObj = FONTS.find((f) => f.id === formFont) || FONTS[0];

  return (
    <div className="relative min-h-[88vh] rounded-[28px] overflow-hidden shadow-2xl font-sans border border-amber-200/60 bg-[#F2EDE4] text-slate-800">
      
      {/* Scrapbook Kraft-Paper Background texture overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(#d4c5b2_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#E8E1D3] rounded-full filter blur-3xl opacity-60 pointer-events-none" />

      {/* MAIN CONTAINER LAYER */}
      <div className="relative z-10 p-4 sm:p-6 md:p-8 flex flex-col min-h-[88vh]">
        
        {/* Top Scrapbook Header Navigation Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 mb-6 border-b-2 border-amber-300/60 bg-[#FFFDF7]/90 p-4 rounded-2xl shadow-sm backdrop-blur-md">
          
          <div className="flex items-center gap-3">
            {viewMode !== 'bookshelf' && (
              <button
                type="button"
                onClick={() => {
                  if (viewMode === 'entry') setViewMode('dayList');
                  else if (viewMode === 'dayList') setViewMode('months');
                  else if (viewMode === 'months') setViewMode('bookshelf');
                }}
                className="p-2.5 rounded-xl bg-amber-100 hover:bg-amber-200 border border-amber-300 text-amber-900 transition-all cursor-pointer flex items-center justify-center shadow-xs"
                title="Back"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}

            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-amber-100/80 border border-amber-300 text-[#3D2C1E] shadow-xs">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-serif text-[#3D2C1E] flex items-center gap-2">
                  My Journal
                </h1>
                <p className="text-xs text-amber-800/80 font-medium">
                  {userName}'s Scrapbook & Reflection Journal
                </p>
              </div>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2.5">
            {viewMode !== 'bookshelf' && (
              <button
                type="button"
                onClick={() => setViewMode('bookshelf')}
                className="px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-300 text-xs font-bold text-amber-900 transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
              >
                <Book className="w-4 h-4 text-amber-900" />
                Bookshelf
              </button>
            )}

            <button
              type="button"
              onClick={handleStartNewEntry}
              className="px-4 py-2 rounded-xl bg-[#3D2C1E] hover:bg-[#2A1E14] text-amber-100 font-bold text-xs shadow-md transition-all transform hover:scale-[1.02] active:scale-95 cursor-pointer flex items-center gap-2 border border-amber-500/30"
            >
              <Plus className="w-4 h-4 text-amber-100" />
              <span>New Entry</span>
            </button>
          </div>
        </div>

        {/* ====================================================
            LEVEL 1: BOOKSHELF & COVER TITLE PAGE
            ==================================================== */}
        {viewMode === 'bookshelf' && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 flex flex-col items-center justify-center py-6 space-y-6 max-w-4xl mx-auto w-full"
          >
            {/* Scrapbook Title Header Card */}
            <div className="relative bg-[#FFFDF7] border-2 border-amber-300/80 rounded-[28px] p-6 sm:p-8 text-center space-y-3 shadow-xl w-full max-w-2xl overflow-hidden">
              
              {/* Title Section */}
              <div className="flex items-center justify-center gap-2">
                <h2 className="text-3xl sm:text-4xl font-serif font-black text-[#2D1F17] tracking-tight">
                  Personal Diary Collection
                </h2>
              </div>

              <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-amber-900/80">
                <span className="font-serif italic text-sm">{userName}'s Handcrafted Memories</span>
              </div>

              {/* Rotating Quote Banner */}
              <div className="bg-amber-100/60 border border-amber-300/70 rounded-2xl p-3 my-2 flex items-center justify-center gap-2 max-w-lg mx-auto shadow-xs">
                <p className="text-xs sm:text-sm font-serif italic text-amber-950 font-medium transition-all">
                  "{ROTATING_COVER_QUOTES[quoteIdx]}"
                </p>
              </div>

              {/* Create Next Year Diary Button */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={handleCreateNextYearDiary}
                  className="px-5 py-2.5 rounded-2xl bg-amber-800 hover:bg-amber-900 text-amber-100 font-bold text-xs shadow-md border border-amber-600 transition-all transform hover:scale-[1.03] active:scale-95 cursor-pointer inline-flex items-center gap-2"
                >
                  <Plus className="w-4 h-4 text-amber-100" />
                  <span>Create {Math.max(...availableYears) + 1} Diary</span>
                </button>
              </div>
            </div>

            {/* Books Covers Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-4xl pt-2">
              {availableYears.map((yr, idx) => {
                const yrCount = entries.filter((e) => e.year === yr).length;
                const isCurrent = yr === 2026;

                return (
                  <motion.div
                    key={yr}
                    whileHover={{ scale: 1.04, y: -6 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleOpenYear(yr)}
                    className={cn(
                      "relative rounded-[26px] p-6 cursor-pointer shadow-2xl transition-all border-2 flex flex-col justify-between h-[310px] group overflow-hidden select-none",
                      isCurrent
                        ? "bg-gradient-to-br from-[#1C3A27] via-[#0E2619] to-[#07170E] border-emerald-500/70 text-white"
                        : idx % 2 === 0
                        ? "bg-gradient-to-br from-[#3D2817] via-[#2A1A0E] to-[#170E07] border-amber-600/70 text-amber-100"
                        : "bg-gradient-to-br from-[#2E1C38] via-[#1F1028] to-[#120718] border-purple-500/70 text-purple-100"
                    )}
                  >
                    {/* Washi ribbon bookmark */}
                    <div className="absolute top-0 right-6 w-5 h-20 bg-gradient-to-b from-amber-300 via-amber-400 to-amber-600 shadow-md rounded-b-md border-x border-amber-200/40" />

                    {/* Book Cover Header */}
                    <div className="space-y-1 pt-4">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] font-bold uppercase tracking-widest text-amber-200">
                          {yr} Diary Volume
                        </span>
                      </div>
                      <h3 className="text-4xl font-serif font-black tracking-tight text-white group-hover:text-amber-200 transition-colors drop-shadow-md">
                        {yr}
                      </h3>
                      <p className="text-xs font-serif italic text-amber-200/80">
                        {userName}'s Memories
                      </p>
                    </div>

                    {/* Center Embossed Emblem */}
                    <div className="my-auto py-2 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full border-2 border-amber-300/40 flex items-center justify-center bg-white/5 shadow-inner group-hover:scale-110 transition-transform duration-500">
                        <BookOpen className="w-8 h-8 text-amber-200/80" />
                      </div>
                    </div>

                    {/* Cover Footer */}
                    <div className="pt-3 border-t border-white/15 flex items-center justify-between text-xs font-medium">
                      <span className="text-amber-100 font-bold flex items-center gap-1.5">
                        <Bookmark className="w-3.5 h-3.5 text-amber-200" />
                        {yrCount} {yrCount === 1 ? 'Entry' : 'Entries'}
                      </span>
                      <span className="group-hover:translate-x-1 transition-transform text-amber-300 font-bold flex items-center gap-1">
                        Open <ChevronRight className="w-4 h-4" />
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* ====================================================
            LEVEL 2: MONTH SELECTOR (12 Planner Tabs Grid with Emojis)
            ==================================================== */}
        {viewMode === 'months' && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 flex flex-col py-6 space-y-6 max-w-5xl mx-auto w-full"
          >
            {/* Diary Title Page / Index Header */}
            <div className="bg-[#FFFDF7] border-2 border-amber-300/80 rounded-[28px] p-6 text-center space-y-2 shadow-md relative overflow-hidden">
              <div className="flex items-center justify-center gap-2">
                <Sticker emoji="📅" size="md" rotation={-6} />
                <span className="text-xs font-bold uppercase tracking-widest text-amber-900">
                  {selectedYear} Scrapbook Index
                </span>
                <Sticker emoji="✨" size="md" rotation={6} />
              </div>

              <h2 className="text-3xl font-serif font-black text-[#2D1F17]">
                {userName}'s {selectedYear} Journal Months
              </h2>
              <p className="text-xs font-serif italic text-amber-900/70 max-w-md mx-auto">
                Select a month to browse your daily entries, photo polaroids, and stickers.
              </p>
            </div>

            {/* 12 Months Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {MONTH_NAMES.map((monthName, mIdx) => {
                const count = yearEntries.filter((e) => e.month === mIdx).length;
                const hasEntries = count > 0;

                return (
                  <motion.button
                    key={monthName}
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleOpenMonth(mIdx)}
                    className={cn(
                      "p-4 rounded-2xl border-2 text-left flex flex-col justify-between h-34 transition-all cursor-pointer relative overflow-hidden shadow-xs group",
                      hasEntries
                        ? "bg-[#FFFDF7] border-amber-400 text-slate-800 shadow-amber-900/5 ring-2 ring-amber-400/30"
                        : "bg-amber-50/50 border-amber-200 text-amber-700 hover:bg-[#FFFDF7] hover:border-amber-300"
                    )}
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-amber-800" />
                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800">
                          Month {mIdx + 1}
                        </span>
                      </div>

                      <h4 className="text-lg font-serif font-bold text-slate-900 group-hover:text-amber-900 transition-colors">
                        {monthName}
                      </h4>
                    </div>

                    <div className="flex items-center justify-between text-xs font-medium pt-2 border-t border-amber-200/60">
                      <span className={cn("text-[11px] font-bold", hasEntries ? "text-amber-900" : "text-amber-600/70")}>
                        {count > 0 ? `${count} ${count === 1 ? 'entry' : 'entries'}` : 'No entries'}
                      </span>

                      {hasEntries && (
                        <BookOpen className="w-3.5 h-3.5 text-amber-800" />
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* ====================================================
            LEVEL 3: DAY / DATE LIST VIEW (Scrapbook Cards)
            ==================================================== */}
        {viewMode === 'dayList' && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 flex flex-col py-6 space-y-6 max-w-5xl mx-auto w-full"
          >
            {/* Header banner */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-[#FFFDF7] border-2 border-amber-300/80 rounded-2xl p-5 shadow-xs">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-amber-900" />
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-amber-900">
                    {selectedYear} • {MONTH_NAMES[selectedMonth]}
                  </span>
                  <h2 className="text-2xl font-serif font-bold text-[#2D1F17]">
                    Entries for {MONTH_NAMES[selectedMonth]} {selectedYear}
                  </h2>
                </div>
              </div>

              <button
                type="button"
                onClick={handleStartNewEntry}
                className="px-4 py-2 rounded-xl bg-amber-800 hover:bg-amber-900 text-amber-100 font-bold text-xs flex items-center gap-2 transition-all shadow-xs cursor-pointer border border-amber-600"
              >
                <Plus className="w-4 h-4 text-amber-100" />
                Add Entry
              </button>
            </div>

            {/* Entries List or Empty State */}
            {monthEntries.length === 0 ? (
              <div className="bg-[#FFFDF7] border-2 border-dashed border-amber-300 rounded-3xl p-12 text-center space-y-4 my-auto shadow-xs">
                <div className="w-16 h-16 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center mx-auto text-amber-900">
                  <BookOpen className="w-8 h-8 text-amber-900" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-serif font-bold text-slate-800">No Entries in {MONTH_NAMES[selectedMonth]}</h3>
                  <p className="text-xs text-amber-800/80 max-w-md mx-auto">
                    Your scrapbooking diary page for this month is fresh and blank. Start recording your memories!
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleStartNewEntry}
                  className="px-6 py-2.5 rounded-xl bg-amber-800 text-amber-100 font-bold text-xs shadow-md hover:bg-amber-900 transition-all cursor-pointer inline-flex items-center gap-2"
                >
                  <Plus className="w-4 h-4 text-amber-100" />
                  Write First Entry
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {monthEntries.map((entry) => {
                  const catInfo = CATEGORY_CONFIG[entry.type] || CATEGORY_CONFIG['daily'];
                  return (
                    <motion.div
                      key={entry.id}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => handleViewEntry(entry)}
                      className="bg-[#FFFDF7] text-slate-900 rounded-2xl p-5 border-2 border-amber-300/80 shadow-md cursor-pointer hover:border-amber-500 transition-all space-y-3 relative overflow-hidden group select-none"
                    >
                      {/* Top Date, Time & Badges */}
                      <div className="flex items-center justify-between text-xs border-b border-amber-200/80 pb-2">
                        <div className="flex items-center gap-2 font-serif font-black text-amber-950">
                          <Calendar className="w-3.5 h-3.5 text-amber-800" />
                          <span>{entry.date}</span>
                          <span className="text-amber-400">•</span>
                          <span className="text-amber-800 font-sans text-[11px] font-bold">
                            {entry.time || '09:00 AM'}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className={cn("px-2.5 py-0.5 rounded-full border text-[10px] font-bold flex items-center gap-1", catInfo.color)}>
                            <span>{catInfo.label}</span>
                          </span>

                          {entry.mood && (
                            <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-[11px] font-bold flex items-center gap-1">
                              <span>{entry.mood}</span>
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Title & Preview Content */}
                      <div>
                        <h4 className="text-lg font-serif font-black text-slate-900 group-hover:text-amber-900 transition-colors">
                          {entry.title}
                        </h4>
                        <p className="text-xs text-slate-600 font-serif line-clamp-2 mt-1 italic">
                          "{entry.content}"
                        </p>
                      </div>

                      {/* Photo Badge if present */}
                      {entry.photoUrl && (
                        <div className="pt-1 flex items-center gap-2 text-[11px] font-bold text-amber-900">
                          <Camera className="w-3.5 h-3.5 text-amber-800" />
                          <span>Includes Polaroid Memory Photo</span>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}

        {/* ====================================================
            LEVEL 4: CORE DIARY ENTRY PAGE (Cream Parchment Scrapbook)
            ==================================================== */}
        {viewMode === 'entry' && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 flex flex-col py-4 max-w-4xl mx-auto w-full"
          >
            {/* CREAM PARCHMENT SCRAPBOOK PAGE CONTAINER */}
            <div className="bg-[#FFFDF7] text-slate-900 rounded-[28px] p-6 sm:p-8 md:p-10 shadow-2xl border-2 border-amber-300/80 relative overflow-hidden flex flex-col justify-between min-h-[650px]">
              
              {/* Paper Ruled Lines Pattern Background */}
              <div className="absolute inset-0 bg-[linear-gradient(to_bottom,#0000000a_1px,transparent_1px)] bg-[size:100%_28px] pointer-events-none" />

              {/* Red Notebook Left Margin Line */}
              <div className="absolute top-0 bottom-0 left-10 sm:left-14 w-0.5 bg-red-300/40 pointer-events-none" />

              {/* TRAVEL ENTRY TAG CLUSTER (Top Right Corner) */}
              {formType === 'travel' && (
                <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 bg-amber-100/90 border border-amber-300 px-2.5 py-1 rounded-2xl shadow-sm">
                  <Tag className="w-3.5 h-3.5 text-amber-900" />
                  <span className="text-[10px] font-extrabold uppercase text-amber-900">Travel Log</span>
                </div>
              )}

              {/* MAIN CONTENT AREA */}
              <div className="relative z-10 pl-8 sm:pl-10 space-y-5">
                
                {/* Header Row: Date + Time */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-amber-300/80 pb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-amber-800" />
                    {isEditing ? (
                      <input
                        type="date"
                        value={formDate}
                        onChange={(e) => setFormDate(e.target.value)}
                        className="bg-amber-50 border border-amber-300 rounded-lg px-2.5 py-1 text-xs font-bold font-serif text-amber-950 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    ) : (
                      <span className="font-serif font-black text-amber-950 text-xl sm:text-2xl tracking-wide">
                        {formDate}
                      </span>
                    )}

                    <span className="text-amber-400 font-bold">•</span>

                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-amber-800" />
                      {isEditing ? (
                        <input
                          type="text"
                          value={formTime}
                          placeholder="09:30 AM"
                          onChange={(e) => setFormTime(e.target.value)}
                          className="bg-amber-50 border border-amber-300 rounded-lg px-2 py-1 text-xs font-bold text-amber-950 w-24 focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                      ) : (
                        <span className="text-xs font-bold font-sans text-amber-900 bg-amber-100/80 px-2.5 py-1 rounded-md border border-amber-200">
                          {formTime}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Category & Font Selectors */}
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Category Selector */}
                    {isEditing ? (
                      <select
                        value={formType}
                        onChange={(e) => setFormType(e.target.value as JournalEntry['type'])}
                        className="bg-amber-50 border border-amber-300 text-amber-950 text-xs font-bold rounded-lg px-2.5 py-1 focus:outline-none cursor-pointer"
                      >
                        {Object.entries(CATEGORY_CONFIG).map(([key, cfg]) => (
                          <option key={key} value={key}>{cfg.label}</option>
                        ))}
                      </select>
                    ) : (
                      <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold flex items-center gap-1">
                        <span>{CATEGORY_CONFIG[formType]?.label || 'Daily Story'}</span>
                      </span>
                    )}

                    {/* Font Selector dropdown */}
                    {isEditing && (
                      <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-300 rounded-lg px-2 py-1">
                        <PenTool className="w-3.5 h-3.5 text-amber-800" />
                        <select
                          value={formFont}
                          onChange={(e) => setFormFont(e.target.value)}
                          className="bg-transparent text-amber-950 text-xs font-bold focus:outline-none cursor-pointer"
                        >
                          {FONTS.map((f) => (
                            <option key={f.id} value={f.id}>{f.name}</option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                </div>

                {/* MOOD SELECTOR ROW (In-diary mood selector for writing) */}
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                    <Sparkles className="w-3.5 h-3.5 text-amber-800" />
                    <span>How are you feeling today?</span>
                  </div>

                  {isEditing ? (
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      {DEFAULT_MOODS.map((m) => {
                        const isSelected = formMoodEmoji === m.emoji;
                        return (
                          <button
                            key={m.emoji}
                            type="button"
                            onClick={() => {
                              setFormMoodEmoji(m.emoji);
                              setFormMoodLabel(m.label);
                            }}
                            title={m.label}
                            className={cn(
                              "p-1.5 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-1.5 text-xs font-bold select-none",
                              isSelected
                                ? "bg-amber-300 border-amber-600 ring-4 ring-amber-400/40 scale-110 shadow-md text-amber-950"
                                : "bg-white border-amber-200 text-slate-700 hover:bg-amber-100"
                            )}
                          >
                            <span className="text-xl">{m.emoji}</span>
                            <span>{m.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-amber-100 border-2 border-amber-300 shadow-xs">
                      <span className="text-2xl">{formMoodEmoji}</span>
                      <span className="text-xs font-bold text-amber-950">{formMoodLabel}</span>
                    </div>
                  )}
                </div>

                {/* QUOTE BANNER */}
                <div className="bg-amber-100/70 border-2 border-amber-300 rounded-2xl p-3 flex items-center justify-center gap-2 shadow-xs text-center">
                  <p className="text-xs sm:text-sm font-serif italic text-amber-950 font-semibold">
                    "{formQuote || ROTATING_COVER_QUOTES[0]}"
                  </p>
                </div>

                {/* TITLE INPUT / DISPLAY */}
                <div>
                  {isEditing ? (
                    <input
                      type="text"
                      placeholder="Title of your entry..."
                      value={formTitle}
                      onChange={(e) => setFormTitle(e.target.value)}
                      className="w-full text-xl sm:text-2xl font-serif font-black text-amber-950 bg-amber-50/80 border-b-2 border-amber-400 p-2 focus:outline-none focus:border-amber-600 rounded-t-lg"
                    />
                  ) : (
                    <h2 className="text-2xl sm:text-3xl font-serif font-black text-[#2D1F17]">
                      {formTitle}
                    </h2>
                  )}
                </div>

                {/* MAIN CONTENT AREA WITH CUSTOM FONT */}
                <div className="pt-2 min-h-[160px]">
                  {isEditing ? (
                    <textarea
                      rows={6}
                      placeholder="Write your thoughts, stories, or memories here..."
                      value={formContent}
                      onChange={(e) => setFormContent(e.target.value)}
                      style={activeFontObj.style}
                      className="w-full bg-amber-50/60 border-2 border-amber-300 rounded-2xl p-4 text-amber-950 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-inner"
                    />
                  ) : (
                    <div style={activeFontObj.style} className="text-amber-950 whitespace-pre-wrap leading-relaxed">
                      {formContent}
                    </div>
                  )}
                </div>

                {/* POLAROID PHOTO CONTAINER */}
                {(formPhotoUrl || isEditing) && (
                  <div className="pt-3">
                    <div className="flex items-center justify-between pb-2">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                        <Camera className="w-3.5 h-3.5 text-amber-800" />
                        <span>Polaroid Photo Memory:</span>
                      </div>

                      {/* Add Photo Button */}
                      {isEditing && (
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="px-3 py-1.5 rounded-xl bg-amber-800 hover:bg-amber-900 text-amber-100 font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
                          >
                            <Upload className="w-3.5 h-3.5 text-amber-100" />
                            <span>Upload Picture</span>
                          </button>
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handlePhotoFileUpload}
                            className="hidden"
                          />
                        </div>
                      )}
                    </div>

                    {/* Preset photo templates if editing */}
                    {isEditing && !formPhotoUrl && (
                      <div className="flex flex-wrap gap-2 pb-3">
                        <span className="text-[11px] font-bold text-amber-800 block w-full">Or choose a memory template photo:</span>
                        {PRESET_TEMPLATES.map((tmpl) => (
                          <button
                            key={tmpl.label}
                            type="button"
                            onClick={() => {
                              setFormPhotoUrl(tmpl.url);
                              setFormPhotoCaption(tmpl.caption);
                            }}
                            className="px-2.5 py-1 rounded-xl bg-amber-100 hover:bg-amber-200 border border-amber-300 text-xs font-bold text-amber-900 cursor-pointer"
                          >
                            {tmpl.label}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Polaroid Frame */}
                    {formPhotoUrl && (
                      <div className="relative max-w-sm mx-auto my-4 p-4 bg-white border-2 border-slate-200 rounded-xl shadow-xl transform transition-transform hover:rotate-0" style={{ transform: `rotate(${formPhotoAngle}deg)` }}>
                        {/* Tape accent */}
                        <div className="absolute -top-2.5 left-1/2 transform -translate-x-1/2 z-20 w-12 h-4 bg-amber-200/80 border border-amber-300/60 shadow-xs" />

                        {/* Image inside polaroid */}
                        <div className="aspect-4/3 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 relative">
                          <img
                            src={formPhotoUrl}
                            alt="Polaroid Memory"
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Polaroid Caption */}
                        <div className="pt-3 text-center font-serif italic text-xs font-bold text-slate-800">
                          {isEditing ? (
                            <input
                              type="text"
                              value={formPhotoCaption}
                              placeholder="Photo caption..."
                              onChange={(e) => setFormPhotoCaption(e.target.value)}
                              className="w-full text-center border-b border-gray-300 bg-transparent focus:outline-none"
                            />
                          ) : (
                            <span>{formPhotoCaption || 'Polaroid Memory'}</span>
                          )}
                        </div>

                        {/* Remove Photo if editing */}
                        {isEditing && (
                          <button
                            type="button"
                            onClick={() => setFormPhotoUrl('')}
                            className="absolute top-2 right-2 p-1.5 rounded-full bg-red-100 text-red-700 hover:bg-red-200 border border-red-300 cursor-pointer shadow-xs"
                            title="Remove photo"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* USER-PLACED STICKERS OVERLAY ON PAGE */}
                {formPlacedStickers.map((stk) => (
                  <div
                    key={stk.id}
                    style={{ left: `${stk.x}%`, top: `${stk.y}%` }}
                    className="absolute z-20 group"
                  >
                    <Sticker emoji={stk.emoji} size="md" rotation={stk.rotation} />
                    {isEditing && (
                      <button
                        type="button"
                        onClick={() => handleRemoveStickerFromPage(stk.id)}
                        className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-red-600 text-white text-[10px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-xs"
                        title="Remove sticker"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}

                {/* INTERACTIVE STICKER TRAY / TOOLBAR AT BOTTOM OF ENTRY PAGE (For user writing) */}
                {isEditing && (
                  <div className="mt-6 p-4 bg-amber-100/80 border-2 border-amber-300 rounded-2xl space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-amber-950">
                      <Sparkles className="w-3.5 h-3.5 text-amber-900" />
                      <span>Emoji Sticker Tray (Tap to add to page while writing):</span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {STICKER_TRAY.map((stkEmoji) => (
                        <button
                          key={stkEmoji}
                          type="button"
                          onClick={() => handleAddStickerToPage(stkEmoji)}
                          className="p-2 rounded-xl bg-white border border-amber-300 hover:bg-amber-200 hover:scale-110 transition-all cursor-pointer shadow-xs text-xl"
                          title={`Add ${stkEmoji} sticker`}
                        >
                          {stkEmoji}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* FOOTER ACTIONS & PAGE-TURN INTERACTION BUTTONS */}
              <div className="relative z-10 pt-6 mt-6 border-t-2 border-amber-300/80 flex flex-wrap items-center justify-between gap-4">
                
                {/* Left Action: Delete / Edit controls */}
                <div className="flex items-center gap-2">
                  {activeEntry && !isEditing && (
                    <>
                      <button
                        type="button"
                        onClick={() => setIsEditing(true)}
                        className="px-4 py-2 rounded-xl bg-amber-100 hover:bg-amber-200 border border-amber-300 text-xs font-bold text-amber-900 transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
                      >
                        <PenTool className="w-3.5 h-3.5 text-amber-900" />
                        Edit Page
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteEntry(activeEntry.id)}
                        className="px-3 py-2 rounded-xl bg-red-50 hover:bg-red-100 border border-red-200 text-xs font-bold text-red-700 transition-all cursor-pointer flex items-center gap-1 shadow-xs"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete Page
                      </button>
                    </>
                  )}
                </div>

                {/* Save Entry Button */}
                {isEditing && (
                  <button
                    type="button"
                    onClick={handleSaveEntry}
                    className="px-6 py-2.5 rounded-2xl bg-[#3D2C1E] hover:bg-[#2A1E14] text-amber-100 font-bold text-xs shadow-lg transition-all transform hover:scale-[1.03] active:scale-95 cursor-pointer flex items-center gap-2 border-2 border-amber-500/50"
                  >
                    <Bookmark className="w-4 h-4 text-amber-100" />
                    <span>Save Entry</span>
                  </button>
                )}

                {/* PAGE-TURN INTERACTION BUTTONS */}
                {!isEditing && (
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      disabled={!hasPrevEntry}
                      onClick={() => handleNavigateEntry('prev')}
                      className={cn(
                        "px-3.5 py-2 rounded-2xl border-2 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm select-none",
                        hasPrevEntry
                          ? "bg-amber-100 hover:bg-amber-200 border-amber-400 text-amber-950 hover:scale-105"
                          : "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed opacity-50"
                      )}
                      title="Previous Page"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>Prev Page</span>
                    </button>

                    <button
                      type="button"
                      disabled={!hasNextEntry}
                      onClick={() => handleNavigateEntry('next')}
                      className={cn(
                        "px-3.5 py-2 rounded-2xl border-2 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm select-none",
                        hasNextEntry
                          ? "bg-amber-100 hover:bg-amber-200 border-amber-400 text-amber-950 hover:scale-105"
                          : "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed opacity-50"
                      )}
                      title="Next Page"
                    >
                      <span>Next Page</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
