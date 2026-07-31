import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { useProfile } from '../context/ProfileContext';
import { 
  Send, 
  Sparkles, 
  MessageSquare, 
  Compass, 
  Zap, 
  Bot, 
  Search, 
  Plus, 
  User, 
  Pin, 
  Trash2, 
  Edit3, 
  MoreVertical, 
  Share2, 
  Download, 
  Settings, 
  Clock, 
  HelpCircle,
  TrendingUp, 
  CheckSquare, 
  Calendar,
  Layers,
  ChevronRight,
  Smile,
  Mic,
  Paperclip,
  CheckCircle,
  FileText,
  Wind
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useData } from '../context/DataContext';

function PremiumAIBackground() {
  return (
    <svg 
      viewBox="0 0 100 100" 
      className="w-full h-full object-cover opacity-[0.08] pointer-events-none select-none absolute inset-0" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <radialGradient id="grad1" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#C8D9E6" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="20" cy="20" r="30" fill="url(#grad1)" />
      <circle cx="80" cy="70" r="40" fill="url(#grad1)" />
      {/* Flowing tech waves */}
      <path d="M 0,40 Q 25,20 50,40 T 100,40" fill="none" stroke="#567C8D" strokeWidth="0.5" strokeDasharray="2 2" />
      <path d="M 0,60 Q 25,80 50,60 T 100,60" fill="none" stroke="#2F4156" strokeWidth="0.3" />
    </svg>
  );
}

interface AIAssistantViewProps {
  theme: 'light' | 'dark' | 'contrast';
  userName: string;
  userGender?: 'male' | 'female';
}

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  time: string;
  specialCardType?: 'study_plan' | 'tips' | 'general';
}

interface ChatHistoryItem {
  id: string;
  title: string;
  category: 'Today' | 'Yesterday';
  updatedAt: string;
  messages: Message[];
  pinned?: boolean;
}

export default function AIAssistantView({ theme, userName, userGender = 'female' }: AIAssistantViewProps) {
  const { tasks, habits, reminders, addTask, addReminder, addScheduleItem } = useData();
  const { profile } = useProfile();
  const actualName = profile.name || userName || 'User';
  const femaleAvatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(actualName)}&hair=longButNotTooLong&eyes=happy`;
  const maleAvatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(actualName)}&hair=shortWaved&eyes=default`;
  const companionAvatar = profile.gender === 'female' || userGender === 'female' ? femaleAvatarUrl : maleAvatarUrl;

  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchHistoryTerm, setSearchHistoryTerm] = useState('');
  const [toast, setToast] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [selectedModel, setSelectedModel] = useState<'Gemini' | 'ChatGPT' | 'Claude' | 'Copilot'>('Gemini');
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  // Preset Mock Conversations according to user instructions
  const [historyChats, setHistoryChats] = useState<ChatHistoryItem[]>([
    {
      id: 'chat-1',
      title: 'Study Plan for Final Exams',
      category: 'Today',
      updatedAt: '10 min ago',
      pinned: true,
      messages: [
        {
          id: 'm1',
          sender: 'assistant',
          text: "Hello! I'm your AI Productivity Assistant. I can help you organize tasks, build study plans, optimize schedules, improve habits, create goals, and stay focused. What would you like to work on today?",
          time: '09:00 AM'
        },
        {
          id: 'm2',
          sender: 'user',
          text: "Plan a daily study schedule for my final exams.",
          time: '09:01 AM'
        },
        {
          id: 'm3',
          sender: 'assistant',
          text: "Here is your custom, high-focus structured day to guarantee maximum learning retention. Would you like me to customize this schedule based on your subjects and deadlines?",
          time: '09:02 AM',
          specialCardType: 'study_plan'
        }
      ]
    },
    {
      id: 'chat-2',
      title: 'How to Stay Focused',
      category: 'Today',
      updatedAt: '2 hrs ago',
      messages: [
        {
          id: 'c2-1',
          sender: 'assistant',
          text: "Hi there! Overcoming distractions is the secret to high cognitive throughput. Let's design a custom Pomodoro system or blocks strategy.",
          time: 'Yesterday'
        },
        {
          id: 'c2-2',
          sender: 'user',
          text: "Suggest methods to stay focused without constant digital notifications.",
          time: 'Yesterday'
        },
        {
          id: 'c2-3',
          sender: 'assistant',
          text: "I recommend: \n1. Notification blackouts (Focus Mode active)\n2. Staggered 50-minute Deep Work blocks paired with 10-minute breath breaks\n3. Clear desktop visual cues (placing a plant or a simple water glass in sight).",
          time: 'Yesterday',
          specialCardType: 'tips'
        }
      ]
    },
    {
      id: 'chat-3',
      title: 'Prioritization Checklist',
      category: 'Today',
      updatedAt: '5 hrs ago',
      messages: [
        {
          id: 'c3-1',
          sender: 'assistant',
          text: "Hello! Managing energy rather than just time is key. Let's prioritize your High/Medium/Low tasks using the Eisenhower Matrix.",
          time: '12:05 PM'
        }
      ]
    },
    {
      id: 'chat-4',
      title: 'Motivation for Productivity',
      category: 'Today',
      updatedAt: '6 hrs ago',
      messages: [
        {
          id: 'c4-1',
          sender: 'assistant',
          text: "Remember, progress over perfection. Let's find your core motivational anchor today!",
          time: '11:20 AM'
        }
      ]
    },
    {
      id: 'chat-5',
      title: 'Breakdown AI Project',
      category: 'Yesterday',
      updatedAt: '1 day ago',
      messages: [
        {
          id: 'c5-1',
          sender: 'assistant',
          text: "Let's decompose your complex AI milestone into distinct 45-minute sprints with tangible deliverables.",
          time: '2 days ago'
        }
      ]
    },
    {
      id: 'chat-6',
      title: 'Best Study Techniques',
      category: 'Yesterday',
      updatedAt: '1 day ago',
      messages: [
        {
          id: 'c6-1',
          sender: 'assistant',
          text: "We can compare Active Recall, Spaced Repetition, and the Feynman Technique to accelerate your Computer Science exams.",
          time: '2 days ago'
        }
      ]
    },
    {
      id: 'chat-7',
      title: 'Weekly Schedule Help',
      category: 'Yesterday',
      updatedAt: '2 days ago',
      messages: [
        {
          id: 'c7-1',
          sender: 'assistant',
          text: "Let's review your overall schedule flow to build proper margin for breaks, social, and sleep.",
          time: '3 days ago'
        }
      ]
    }
  ]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const chatIdParam = params.get('chat');
    if (chatIdParam) {
      const found = historyChats.find(c => c.id === chatIdParam);
      if (found) {
        setActiveChatId(found.id);
        // Clear parameters from URL without reloading
        const cleanUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
        window.history.pushState({ path: cleanUrl }, '', cleanUrl);
        setTimeout(() => showToast(`Loaded Shared Conversation: "${found.title}"`), 500);
      }
    }
  }, [historyChats]);

  const [activeChatId, setActiveChatId] = useState('chat-1');

  // Selected Active Chat Computations
  const activeChat = useMemo(() => {
    return historyChats.find(c => c.id === activeChatId) || historyChats[0];
  }, [historyChats, activeChatId]);

  // Handle Send Message (linked to Gemini server API /api/ai-chat)
  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userMsg: Message = {
      id: 'user-' + Date.now(),
      sender: 'user',
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedMessages = [...activeChat.messages, userMsg];

    // Update state to include user message immediately
    setHistoryChats(prev => prev.map(chat => {
      if (chat.id === activeChatId) {
        return {
          ...chat,
          updatedAt: 'Just now',
          messages: updatedMessages
        };
      }
      return chat;
    }));

    setInputText('');
    setIsLoading(true);

    try {
      // API request to server-side Gemini endpoint
      const res = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: textToSend,
          chatbot: selectedModel,
          messages: updatedMessages
        }),
      });

      const data = await res.json();
      let responseText = data.response || "I'm temporarily unable to reach the AI service. Please try again in a few moments.";
      
      // Attempt to parse AI actions (tasks, reminders, etc.)
      try {
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const actionData = JSON.parse(jsonMatch[0]);
          if (actionData.action === 'create_task') {
            addTask({
              title: actionData.data.title,
              priority: actionData.data.priority || 'Medium',
              dueIn: actionData.data.dueIn || 'Added by AI',
            });
            showToast("AI created a new task for you!");
          } else if (actionData.action === 'create_reminder') {
            addReminder({
              text: actionData.data.text,
              time: actionData.data.time || 'Upcoming',
              type: 'ai'
            });
            showToast("AI set a new reminder!");
          } else if (actionData.action === 'create_schedule') {
            addScheduleItem({
              title: actionData.data.title,
              startTime: actionData.data.startTime,
              endTime: actionData.data.endTime,
              type: 'task'
            });
            showToast("AI updated your schedule!");
          }
          // Clean up response text to remove JSON block for cleaner UI
          responseText = responseText.replace(/\{[\s\S]*\}/, '').trim();
        }
      } catch (e) {
        console.error("Action parsing failed", e);
      }

      const assistantMsg: Message = {
        id: 'bot-' + (Date.now() + 1),
        sender: 'assistant',
        text: responseText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        specialCardType: 'general'
      };

      speak(responseText);

      setHistoryChats(prev => prev.map(chat => {
        if (chat.id === activeChatId) {
          return {
            ...chat,
            messages: [...chat.messages, assistantMsg]
          };
        }
        return chat;
      }));

    } catch (err) {
      const assistantMsg: Message = {
        id: 'bot-fallback-' + (Date.now() + 1),
        sender: 'assistant',
        text: "I'm temporarily unable to reach the AI service. Please try again in a few moments.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        specialCardType: 'general'
      };

      setHistoryChats(prev => prev.map(chat => {
        if (chat.id === activeChatId) {
          return {
            ...chat,
            messages: [...chat.messages, assistantMsg]
          };
        }
        return chat;
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const speak = (text: string) => {
    if (!voiceEnabled) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  };

  const handleVoiceToggle = () => {
    if (!isRecording) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) {
        showToast("Speech recognition not supported in this browser.");
        return;
      }
      const recognition = new SpeechRecognition();
      recognition.onstart = () => setIsRecording(true);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        handleSendMessage(transcript);
      };
      recognition.onend = () => setIsRecording(false);
      recognition.start();
    } else {
      setIsRecording(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 20 * 1024 * 1024) {
        showToast("File size exceeds 20MB limit.");
        return;
      }
      showToast(`Attached: ${file.name}`);
      // In a real app, you'd upload and send the text/summary to the AI
    }
  };

  // Quick Action Buttons
  const triggerNewConversation = () => {
    const newId = 'chat-' + Date.now();
    const newChat: ChatHistoryItem = {
      id: newId,
      title: `Coaching Session ${historyChats.length + 1}`,
      category: 'Today',
      updatedAt: 'Just now',
      messages: [
        {
          id: 'welcome-' + Date.now(),
          sender: 'assistant',
          text: `Welcome! Let's start a new coaching session. I can draft calendars, structure dynamic goals or optimize study times. What's on your mind?`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]
    };
    setHistoryChats(prev => [newChat, ...prev]);
    setActiveChatId(newId);
    showToast("Started a premium coaching session!");
  };

  // Pin / Delete / Rename helper simulation
  const handleChatAction = (id: string, action: 'pin' | 'delete' | 'rename') => {
    if (action === 'delete') {
      if (historyChats.length <= 1) {
        showToast("Cannot delete the last active conversation!");
        return;
      }
      setHistoryChats(prev => prev.filter(c => c.id !== id));
      setActiveChatId(historyChats.find(c => c.id !== id)?.id || '');
      showToast("Deleted conversation successfully");
    } else if (action === 'pin') {
      setHistoryChats(prev => prev.map(c => c.id === id ? { ...c, pinned: !c.pinned } : c));
      const targetChat = historyChats.find(c => c.id === id);
      const isPinnedNow = !targetChat?.pinned;
      showToast(isPinnedNow ? "Pinned conversation to top!" : "Unpinned conversation!");
    } else if (action === 'rename') {
      const newTitle = prompt("Enter new title:");
      if (newTitle?.trim()) {
        setHistoryChats(prev => prev.map(c => c.id === id ? { ...c, title: newTitle } : c));
        showToast("Renamed conversation!");
      }
    }
  };

  const handleShareConversation = () => {
    const shareUrl = `${window.location.origin}/?chat=${activeChat.id}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      showToast("Copied shared conversation link to clipboard! 🔗");
    }).catch(() => {
      showToast("Could not copy link to clipboard.");
    });
  };

  // Suggested Prompts
  const suggestionChips = [
    "Create Study Schedule",
    "Organize My Tasks",
    "Build Weekly Plan",
    "Optimize Calendar",
    "Improve My Habits",
    "Break Down This Goal",
    "Suggest Focus Session",
    "Create Revision Plan"
  ];

  // Filtering Conversation History by search query
  const filteredHistory = useMemo(() => {
    return historyChats.filter(c => 
      c.title.toLowerCase().includes(searchHistoryTerm.toLowerCase())
    );
  }, [historyChats, searchHistoryTerm]);

  return (
    <div className="space-y-6 animate-fade-in pb-12 relative">
      
      {/* Toast banner */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed bottom-6 right-6 z-50 bg-[#2F4156] text-white py-3.5 px-6 rounded-2xl shadow-2xl border border-[#C8D9E6]/20 text-xs font-black uppercase tracking-wider flex items-center gap-2.5"
          >
            <div className="w-5 h-5 bg-[#567C8D] rounded-full flex items-center justify-center font-black">✓</div>
            <span>{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Header Row with toolbar */}
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4 border-b border-[#C8D9E6]/40 pb-5">
        <div>
          <h2 className="text-[36px] font-black text-[#2F4156] tracking-tight leading-none">
            AI Companion
          </h2>
          <p className="text-[#567C8D] text-sm font-semibold mt-1.5">
            Your intelligent assistant for planning, organizing, and achieving more every day.
          </p>
        </div>

        {/* Top-Right Premium Toolbar */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button 
            onClick={triggerNewConversation}
            className="p-2 bg-[#C8D9E6]/30 text-[#2F4156] rounded-xl hover:bg-[#C8D9E6]/50 transition-colors border border-[#C8D9E6]/50 cursor-pointer flex items-center gap-1.5 text-xs font-bold"
          >
            <Plus className="w-3.5 h-3.5" />
            New Chat
          </button>

          <button 
            onClick={() => setShowSettingsModal(true)}
            className="p-2 bg-white border border-[#C8D9E6] text-gray-700 hover:text-[#2F4156] rounded-xl hover:bg-gray-50 transition-all cursor-pointer flex items-center justify-center gap-1.5 text-xs font-bold shadow-xs"
          >
            <Settings className="w-3.5 h-3.5 text-[#567C8D]" />
            AI Persona: <span className="text-[#2F4156] font-black">{selectedModel}</span>
          </button>

          <button 
            onClick={() => {
              const el = document.getElementById('chat-history-sidebar');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
              showToast("Showing chat history sidebar");
            }}
            className="p-2 bg-white border border-[#C8D9E6] text-gray-500 hover:text-[#2F4156] rounded-xl hover:bg-gray-50 transition-all cursor-pointer flex items-center justify-center gap-1.5 text-xs font-bold"
          >
            <Clock className="w-3.5 h-3.5" />
            Chat History
          </button>

          <button 
            onClick={handleShareConversation}
            className="p-2 bg-[#2F4156] hover:bg-[#1F2C3B] text-white rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 text-xs font-extrabold shadow-sm"
          >
            <Share2 className="w-3.5 h-3.5" />
            Share Link
          </button>
        </div>
      </div>

      {/* AI Settings Modal */}
      <AnimatePresence>
        {showSettingsModal && (
          <div className="fixed inset-0 bg-[#0B1512]/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white rounded-[32px] border border-emerald-100 shadow-2xl w-full max-w-lg p-6 md:p-8 space-y-6 relative overflow-hidden"
            >
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <div>
                  <h3 className="text-xl font-black text-[#1A3C34]">AI Persona & Model Settings</h3>
                  <p className="text-xs text-gray-500 mt-0.5">Select your preferred AI response engine and behavioral style.</p>
                </div>
                <button 
                  onClick={() => setShowSettingsModal(false)}
                  className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 font-bold transition-colors cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3">
                {[
                  {
                    id: 'Gemini',
                    name: 'Google Gemini',
                    desc: 'Structured, multi-modal, fast productivity intelligence with precise step-by-step guidance.',
                    badge: 'Recommended'
                  },
                  {
                    id: 'ChatGPT',
                    name: 'OpenAI ChatGPT',
                    desc: 'Conversational, empathetic, creative coaching style focused on habit building and motivation.',
                    badge: 'Conversational'
                  },
                  {
                    id: 'Claude',
                    name: 'Anthropic Claude',
                    desc: 'Deep analytical reasoning, academic precision, and detailed strategic planning.',
                    badge: 'Analytical'
                  },
                  {
                    id: 'Copilot',
                    name: 'Microsoft Copilot',
                    desc: 'Code-optimized, concise executive summaries and technical problem-solving companion.',
                    badge: 'Technical'
                  }
                ].map((model) => {
                  const isSelected = selectedModel === model.id;
                  return (
                    <div
                      key={model.id}
                      onClick={() => {
                        setSelectedModel(model.id as any);
                        showToast(`Switched AI Persona to ${model.name}!`);
                      }}
                      className={cn(
                        "p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-start justify-between gap-4",
                        isSelected 
                          ? "bg-[#EAF5F0] border-[#0F766E] shadow-sm" 
                          : "bg-white border-gray-100 hover:border-emerald-200 hover:bg-gray-50/50"
                      )}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-black text-[#1A3C34]">{model.name}</h4>
                          <span className="text-[9px] font-black uppercase tracking-wider bg-emerald-100/70 text-emerald-800 px-2 py-0.5 rounded-full">
                            {model.badge}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 leading-relaxed">{model.desc}</p>
                      </div>
                      <div className={cn(
                        "w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-1",
                        isSelected ? "border-[#0F766E] bg-[#0F766E] text-white" : "border-gray-300"
                      )}>
                        {isSelected && <span className="text-[10px] font-black">✓</span>}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-4 border-t border-gray-100 flex justify-end">
                <button
                  onClick={() => setShowSettingsModal(false)}
                  className="bg-[#1A3C34] hover:bg-[#2D6A4F] text-white font-black py-3 px-6 rounded-2xl text-xs uppercase tracking-wider shadow-md transition-all cursor-pointer"
                >
                  Save & Apply Settings
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Main Layout (Left: History, Right: Workspace) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Column Sidebar: Conversation History (Span 3) */}
        <div id="chat-history-sidebar" className="lg:col-span-3 flex flex-col gap-4 scroll-mt-6">
          <div className={cn(
            "p-5 rounded-[30px] border flex-1 flex flex-col justify-between min-h-[500px]",
            theme === 'dark' ? 'bg-[#18222F] border-[#2F4156]' :
            theme === 'contrast' ? 'bg-black border-4 border-white text-white' :
            'bg-white border-[#C8D9E6] shadow-sm'
          )}>
            <div className="space-y-4">
              {/* Sidebar Action Button */}
              <button
                onClick={triggerNewConversation}
                className="w-full py-3 bg-gradient-to-r from-[#2F4156] to-[#567C8D] hover:from-[#1F2C3B] hover:to-[#456473] text-white text-xs font-black uppercase tracking-widest rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                New Chat
              </button>
 
              {/* History Search input */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#567C8D]" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchHistoryTerm}
                  onChange={(e) => setSearchHistoryTerm(e.target.value)}
                  className="w-full py-2 pl-9 pr-3 rounded-xl border border-[#C8D9E6] text-[11px] font-bold bg-[#F5EFEB]/30 focus:outline-none focus:ring-1 focus:ring-[#567C8D]"
                />
              </div>

              {/* Pinned Chats Category */}
              {filteredHistory.some(c => c.pinned) && (
                <div className="space-y-2 pb-2 border-b border-[#C8D9E6]/40">
                  <span className="text-[10px] font-black text-[#2F4156] uppercase tracking-widest block px-1 flex items-center gap-1">
                    <Pin className="w-3 h-3 text-[#567C8D] fill-[#567C8D]" /> Pinned Chats
                  </span>
                  <div className="space-y-1.5 max-h-[160px] overflow-y-auto custom-scrollbar pr-1">
                    {filteredHistory.filter(c => c.pinned).map((chat) => {
                      const isSelected = activeChatId === chat.id;
                      return (
                        <div
                          key={chat.id}
                          onClick={() => setActiveChatId(chat.id)}
                          className={cn(
                            "p-3 rounded-xl flex items-center justify-between cursor-pointer group transition-all duration-200",
                            isSelected 
                              ? "bg-[#C8D9E6]/35 border-l-4 border-[#2F4156] text-[#2F4156] font-extrabold" 
                              : "hover:bg-[#F5EFEB]/50 text-gray-500 hover:text-gray-900"
                          )}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <MessageSquare className="w-3.5 h-3.5 text-[#567C8D] shrink-0" />
                            <div className="truncate text-xs font-bold leading-tight">
                              {chat.title}
                            </div>
                          </div>

                          <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={(e) => { e.stopPropagation(); handleChatAction(chat.id, 'pin'); }}
                              title="Unpin"
                              className="p-1 text-[#567C8D] hover:text-[#2F4156] transition-colors"
                            >
                              <Pin className="w-3 h-3 fill-current" />
                            </button>
                            <button 
                              onClick={(e) => { e.stopPropagation(); handleChatAction(chat.id, 'delete'); }}
                              title="Delete"
                              className="p-1 hover:text-red-600 transition-colors"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
 
              {/* Recent/New Chats category */}
              <div className="space-y-2">
                <span className="text-[10px] font-black text-[#567C8D] uppercase tracking-widest block px-1">Recent Chats</span>
                <div className="space-y-1.5 max-h-[220px] overflow-y-auto custom-scrollbar pr-1">
                  {filteredHistory.filter(c => !c.pinned).map((chat) => {
                    const isSelected = activeChatId === chat.id;
                    return (
                      <div
                        key={chat.id}
                        onClick={() => setActiveChatId(chat.id)}
                        className={cn(
                          "p-3 rounded-xl flex items-center justify-between cursor-pointer group transition-all duration-200",
                          isSelected 
                            ? "bg-[#C8D9E6]/35 border-l-4 border-[#2F4156] text-[#2F4156] font-extrabold" 
                            : "hover:bg-[#F5EFEB]/50 text-gray-500 hover:text-gray-900"
                        )}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <MessageSquare className="w-3.5 h-3.5 text-[#567C8D]/70 shrink-0" />
                          <div className="truncate text-xs font-bold leading-tight">
                            {chat.title}
                          </div>
                        </div>
 
                        <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleChatAction(chat.id, 'pin'); }}
                            title="Pin"
                            className="p-1 hover:text-[#567C8D] transition-colors"
                          >
                            <Pin className="w-3 h-3" />
                          </button>
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleChatAction(chat.id, 'rename'); }}
                            title="Rename"
                            className="p-1 hover:text-[#2F4156] transition-colors"
                          >
                            <Edit3 className="w-3 h-3" />
                          </button>
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleChatAction(chat.id, 'delete'); }}
                            title="Delete"
                            className="p-1 hover:text-red-600 transition-colors"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
 
            {/* Load More Button */}
            <button
              onClick={() => showToast("All historic conversations loaded!")}
              className="w-full mt-4 py-2.5 bg-gray-50 hover:bg-[#F5EFEB]/55 border border-[#C8D9E6] text-gray-500 hover:text-[#2F4156] text-[10px] font-black uppercase tracking-wider rounded-xl transition-colors cursor-pointer"
            >
              Load More Conversations
            </button>
          </div>
        </div>
 
        {/* Central Column: Main Chat Workspace (Expanded to Span 9) */}
        <div className="lg:col-span-9 flex flex-col gap-4">
          <div className={cn(
            "p-6 rounded-[32px] border flex-1 flex flex-col h-[580px] justify-between relative overflow-hidden",
            theme === 'dark' ? 'bg-[#18222F] border-[#2F4156]' :
            theme === 'contrast' ? 'bg-black border-4 border-white text-white' :
            'bg-white border-[#C8D9E6] shadow-sm'
          )}>
            {/* Premium AI abstract background pattern instead of forest background */}
            <PremiumAIBackground />

            {/* Conversation Active Header */}
            <div className="flex items-center justify-between border-b border-[#C8D9E6]/30 pb-4 relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl border border-[#C8D9E6] bg-gradient-to-br from-[#FAFDFB] to-[#C8D9E6] text-[#2F4156] flex items-center justify-center relative shadow-sm shrink-0">
                  <Sparkles className="w-5 h-5 text-[#2F4156]" />
                  {/* Active glowing indicator */}
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-[#567C8D] border-2 border-white rounded-full animate-pulse" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-[#2F4156] uppercase tracking-wide">
                    {activeChat.title}
                  </h4>
                  <p className="text-[10px] text-gray-400 font-extrabold flex items-center gap-1 uppercase">
                    <Sparkles className="w-3 h-3 text-[#567C8D]" />
                    AI
                  </p>
                </div>
              </div>

              {/* Central Workspace Actions */}
              <div className="flex items-center gap-1.5 text-gray-400">
                <button onClick={() => showToast("Pinned chat to history section")} className="p-1.5 hover:text-[#2F4156] hover:bg-[#F5EFEB]/60 rounded-lg transition-colors cursor-pointer">
                  <Pin className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => showToast("Chat export processed!")} className="p-1.5 hover:text-[#2F4156] hover:bg-[#F5EFEB]/60 rounded-lg transition-colors cursor-pointer">
                  <Download className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => handleChatAction(activeChatId, 'delete')} className="p-1.5 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Conversation Chat Bubbles Render area */}
            <div className="flex-1 overflow-y-auto space-y-5 my-4 pr-1.5 custom-scrollbar relative z-10">
              {activeChat.messages.map((m) => {
                const isUser = m.sender === 'user';
                return (
                  <div key={m.id} className={cn("flex gap-3 max-w-[90%] md:max-w-[85%]", isUser ? "ml-auto flex-row-reverse" : "mr-auto")}>
                    {/* Avatar Bubble */}
                    {isUser && (
                      <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm border text-xs font-bold overflow-hidden bg-[#1A3C34] text-white border-[#1A3C34]">
                        {userName[0].toUpperCase()}
                      </div>
                    )}

                    {/* Chat Bubble Body */}
                    <div className="space-y-1">
                      {/* Standard text bubble */}
                      <div className={cn(
                        "p-3.5 rounded-2xl text-[13px] leading-relaxed font-semibold shadow-xs",
                        isUser 
                          ? "bg-[#223148] text-white rounded-tr-none" 
                          : "bg-white border border-[#D2C7B8] text-[#223148] rounded-tl-none"
                      )}>
                        {isUser ? (
                          <p className="whitespace-pre-line">{m.text}</p>
                        ) : (
                          <div className="markdown-body text-[#223148]">
                            <ReactMarkdown>{m.text}</ReactMarkdown>
                          </div>
                        )}
                      </div>

                      {/* Optional High-Fidelity Pre-formatted Study Plan (Requested in the prompt!) */}
                      {m.specialCardType === 'study_plan' && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-3.5 p-4 rounded-3xl bg-gradient-to-b from-[#FAFDFB] to-white border border-[#D8F3DC] shadow-sm space-y-3.5 max-w-md"
                        >
                          <div className="flex items-center justify-between border-b border-[#F0F7F4] pb-2">
                            <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5" />
                              Personalized Daily Study Plan
                            </span>
                            <span className="text-[9px] bg-emerald-100/50 text-[#0F766E] font-black px-2 py-0.5 rounded-full">EXAM FOCUS</span>
                          </div>

                          {/* Time Blocks list requested in prompt */}
                          <div className="space-y-2 max-h-[180px] overflow-y-auto custom-scrollbar pr-1">
                            {[
                              { t: '06:00 – 07:00 AM', d: 'Morning Revision' },
                              { t: '07:00 – 08:00 AM', d: 'Breakfast' },
                              { t: '08:00 – 11:00 AM', d: 'Deep Study Session' },
                              { t: '11:00 – 11:30 AM', d: 'Short Break' },
                              { t: '11:30 – 01:30 PM', d: 'Practice Questions' },
                              { t: '01:30 – 02:30 PM', d: 'Lunch' },
                              { t: '02:30 – 04:30 PM', d: 'Concept Review' },
                              { t: '04:30 – 05:00 PM', d: 'Break' },
                              { t: '05:00 – 07:00 PM', d: 'Subject Two' },
                              { t: '07:00 – 08:00 PM', d: 'Dinner' },
                              { t: '08:00 – 10:00 PM', d: 'Flashcards' },
                              { t: '10:00 – 10:30 PM', d: 'Plan Tomorrow' }
                            ].map((row, i) => (
                              <div key={i} className="flex justify-between items-center text-[11px] py-1 border-b border-gray-50 last:border-0">
                                <span className="font-bold text-gray-400">{row.t}</span>
                                <span className="font-extrabold text-[#2F4156]">{row.d}</span>
                              </div>
                            ))}
                          </div>

                          <div className="p-2 bg-[#F5EFEB]/50 border border-[#C8D9E6]/60 rounded-xl text-[10px] text-[#2F4156] font-bold leading-relaxed">
                            💡 <em>"Would you like me to customize this schedule based on your subjects and deadlines?"</em>
                          </div>
                        </motion.div>
                      )}

                      {/* Optional Interactive Tips helper Card */}
                      {m.specialCardType === 'tips' && (
                        <div className="mt-3 p-3 rounded-2xl bg-[#F5EFEB]/50 border border-[#C8D9E6]/60 text-[11px] text-[#567C8D] font-bold space-y-1">
                          <p className="text-[#2F4156] uppercase tracking-wider text-[9px] font-black">AI Recommendations</p>
                          <p>✓ Complete high priority task lists during 9:00 AM peak zones.</p>
                          <p>✓ Limit phone notifications to scheduled break checkpoints.</p>
                        </div>
                      )}

                      <span className="text-[9px] text-gray-400 font-bold block pt-0.5 px-1">{m.time}</span>
                    </div>
                  </div>
                );
              })}

              {/* Simulated typing animation */}
              {isLoading && (
                <div className="flex gap-3 max-w-[80%] mr-auto">
                  <div className="p-3.5 rounded-2xl bg-white border border-gray-100 text-xs font-bold text-gray-400 flex items-center gap-2">
                    <span className="flex gap-1">
                      <span className="w-1.5 h-1.5 bg-[#567C8D] rounded-full animate-bounce delay-75" />
                      <span className="w-1.5 h-1.5 bg-[#567C8D] rounded-full animate-bounce delay-150" />
                      <span className="w-1.5 h-1.5 bg-[#567C8D] rounded-full animate-bounce delay-225" />
                    </span>
                    <span>AI is composing response...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Clickable Suggestion Chips list under conversation workspace */}
            <div className="space-y-2 relative z-10">
              <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block px-1">Suggested Prompts</span>
              <div className="flex flex-wrap gap-1.5 items-center max-h-[85px] overflow-y-auto custom-scrollbar pb-1">
                {suggestionChips.map((chip, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setInputText(chip);
                      handleSendMessage(chip);
                    }}
                    className="px-3 py-1.5 bg-gray-50 hover:bg-[#C8D9E6]/30 border border-[#C8D9E6] text-[#567C8D] hover:text-[#2F4156] text-[10px] font-bold rounded-lg transition-all cursor-pointer"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>

              {/* Bottom Input Area */}
              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-[#C8D9E6]/30 relative z-10">
                {/* Accessory controls */}
                <div className="flex items-center gap-1 text-gray-400">
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileChange} 
                    className="hidden" 
                    accept=".pdf,.docx,.txt,.png,.jpg,.jpeg,.csv,.xlsx,.pptx,.zip"
                  />
                  <button onClick={() => fileInputRef.current?.click()} title="Attach File" className="p-2 hover:text-[#2F4156] hover:bg-gray-50 rounded-xl transition-colors cursor-pointer">
                    <Paperclip className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={handleVoiceToggle} 
                    title="Voice Input" 
                    className={cn(
                      "p-2 rounded-xl transition-colors cursor-pointer",
                      isRecording ? "text-red-500 bg-red-50 animate-pulse" : "hover:text-[#2F4156] hover:bg-gray-50"
                    )}
                  >
                    <Mic className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => {
                      setVoiceEnabled(!voiceEnabled);
                      showToast(`AI Voice ${!voiceEnabled ? 'Enabled' : 'Disabled'}`);
                    }} 
                    title="Toggle Voice Response" 
                    className={cn(
                      "p-2 rounded-xl transition-colors cursor-pointer",
                      voiceEnabled ? "text-[#567C8D] bg-[#C8D9E6]/30" : "hover:text-[#2F4156] hover:bg-gray-50"
                    )}
                  >
                    <Wind className="w-4 h-4" />
                  </button>
                </div>

              {/* Chat Text Input field */}
              <input
                type="text"
                placeholder="Ask AI anything about productivity, planning, goals, habits, or schedules..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSendMessage(inputText);
                }}
                className="flex-1 py-3 px-4 bg-gray-50 hover:bg-white rounded-2xl border border-gray-100 focus:border-[#C8D9E6] text-[12px] font-bold text-[#2F4156] focus:outline-none focus:ring-1 focus:ring-[#567C8D] shadow-inner"
              />

              {/* Send Button */}
              <button
                onClick={() => handleSendMessage(inputText)}
                disabled={!inputText.trim() || isLoading}
                className="p-3 bg-[#2F4156] hover:bg-[#567C8D] disabled:bg-gray-100 disabled:text-gray-300 text-white rounded-2xl transition-all shadow-md shadow-[#2F4156]/10 cursor-pointer shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
