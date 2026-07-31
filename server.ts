import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// 1. Verify GEMINI_API_KEY is loaded
const apiKey = process.env.GEMINI_API_KEY;
console.log("[AI Startup] GEMINI_API_KEY loaded:", apiKey ? `Yes (length: ${apiKey.length})` : "No (API key missing)");

// 2 & 3. Initialize GoogleGenAI client correctly
const ai = apiKey ? new GoogleGenAI({
  apiKey: apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'Taskaroa-AI-Assistant',
    }
  }
}) : null;

const staticQuotes = [
  { text: "Success is the sum of small efforts, repeated day in and day out.", author: "Robert Collier" },
  { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "It always seems impossible until it's done.", author: "Nelson Mandela" },
  { text: "You miss 100% of the shots you don't take.", author: "Wayne Gretzky" },
  { text: "Action is the foundational key to all success.", author: "Pablo Picasso" },
  { text: "Concentrate all your thoughts upon the work at hand.", author: "Alexander Graham Bell" },
  { text: "Procrastination is the thief of time.", author: "Edward Young" },
];

// API Routes
app.get("/api/quote", async (req, res) => {
  console.log("[API /quote] Request received");
  if (!ai) {
    console.log("[API /quote] AI client not initialized, using static quote pool.");
    return res.json(staticQuotes[Math.floor(Math.random() * staticQuotes.length)]);
  }

  try {
    console.log("[API /quote] Sending prompt to Gemini (gemini-3.6-flash)...");
    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: "Generate a short, powerful, single-sentence motivational productivity quote. Output ONLY in this exact format: Quote Text | Author Name. Do not include quotes inside the quote itself.",
    });
    
    console.log("[API /quote] Gemini response received successfully.");
    const text = response.text || "";
    const [quoteText, authorName] = text.split('|').map(s => s.trim());
    res.json({
      text: quoteText || "Make today worth remembering.",
      author: authorName || "Anonymous"
    });
  } catch (error: any) {
    console.log("[API /quote] Using local fallback quotes pool.");
    res.json(staticQuotes[Math.floor(Math.random() * staticQuotes.length)]);
  }
});

// Shared backend task store
let serverTasks = [
  { id: '1', title: 'Complete AI Project Report', priority: 'High', dueIn: 'Today', completed: false, dueDate: '2026-06-22', dueTime: '02:30 PM', category: 'Study', duration: '120 min' },
  { id: '2', title: 'Prepare for Data Structures Exam', priority: 'High', dueIn: 'Tomorrow', completed: false, dueDate: '2026-06-23', dueTime: '09:00 AM', category: 'Study', duration: '180 min' },
  { id: '3', title: 'Design Landing Page UI', priority: 'Medium', dueIn: 'In 2 Days', completed: true, dueDate: '2026-06-24', dueTime: '04:00 PM', category: 'Design', duration: '90 min' }
];

let calendarNotifications = [
  { id: 'notif_1', title: 'Complete AI Project Report', date: '2026-06-22', time: '09:00 AM', category: 'Study' },
  { id: 'notif_2', title: 'Data Structures Assignment', date: '2026-06-23', time: '10:00 AM', category: 'Exams' },
];

app.get(["/api/tasks", "/tasks"], (req, res) => {
  res.json({ success: true, tasks: serverTasks });
});

app.post(["/api/tasks", "/tasks"], (req, res) => {
  const newTask = {
    id: String(Date.now()),
    completed: false,
    ...req.body
  };
  serverTasks.unshift(newTask);
  res.json({ success: true, task: newTask });
});

app.get(["/api/dashboard/stats", "/dashboard/stats"], (req, res) => {
  const totalTasks = serverTasks.length;
  const completedTasks = serverTasks.filter(t => t.completed).length;
  const pendingTasks = totalTasks - completedTasks;
  const scorePercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  const totalFocusMinutes = focusSessions.reduce((acc, s) => acc + (s.duration_minutes || 25), 310); // fallback 310 min baseline
  const hours = Math.floor(totalFocusMinutes / 60);
  const mins = totalFocusMinutes % 60;
  const focusTimeFormatted = `${hours}h ${mins}m`;

  res.json({
    success: true,
    stats: {
      totalTasks,
      completedTasks,
      pendingTasks,
      scorePercent,
      focusTimeFormatted,
      streakDays: 7
    }
  });
});

app.post(["/api/ai-chat", "/api/ai/chat"], async (req, res) => {
  const { message, chatbot = "Gemini", messages = [] } = req.body;
  console.log(`[API /ai-chat] Request received for chatbot '${chatbot}' with message:`, message);

  if (!ai) {
    console.log("[API /ai-chat] AI client missing. Returning configuration notice.");
    return res.json({ 
      response: `Hello! I am answering as ${chatbot}. Please configure your GEMINI_API_KEY in the environment or secrets panel to enable full generative AI responses.` 
    });
  }

  const systemInstruction = `You are an advanced general-purpose AI chatbot powering Taskaroa, responding as the "${chatbot}" AI model.
You must answer all user questions accurately, thoroughly, and contextually.
- If the user asks for programming, cybersecurity, mathematics, science, AI & machine learning, history, geography, general knowledge, coding, interview questions, resume writing, email writing, research, productivity, study planning, summarization, translation, grammar correction, brainstorming, creative writing, business ideas, daily questions, or personal assistance, provide a clear, accurate, high-quality, and helpful explanation.
- Speak in a natural, conversational, intelligent tone matching the ${chatbot} persona.
- Support comprehensive answers without truncation.

When the user explicitly asks to create a task, reminder, or schedule in their productivity app, you may optionally append a JSON action block at the very end of your response:
1. Task:
{
  "action": "create_task",
  "data": {
    "title": "Task Title",
    "description": "Task description",
    "priority": "High",
    "category": "Study"
  }
}
2. Reminder:
{
  "action": "create_reminder",
  "data": {
    "text": "Reminder text",
    "time": "2026-08-01T09:00"
  }
}
3. Schedule:
{
  "action": "create_schedule",
  "data": {
    "title": "Study Session",
    "time": "09:00 AM",
    "duration": "2 hours",
    "type": "study"
  }
}`;

  try {
    const formattedHistory = messages.slice(0, -1).map((m: any) => ({
      role: m.sender === 'user' ? 'user' : 'model',
      parts: [{ text: m.text }]
    }));

    const chat = ai.chats.create({
      model: "gemini-3.6-flash",
      config: {
        systemInstruction,
      },
      history: formattedHistory
    });

    let response;
    let attempts = 0;
    while (attempts < 2) {
      try {
        response = await chat.sendMessage({ message });
        break;
      } catch (err) {
        attempts++;
        if (attempts >= 2) throw err;
        await new Promise(r => setTimeout(r, 1000));
      }
    }

    const replyText = response?.text || "I processed your request, but received an empty response from the model.";
    res.json({ response: replyText, chatbot });
  } catch (error: any) {
    console.error("[API /ai-chat Error details]", error?.message || error);
    res.json({
      response: "I'm temporarily unable to reach the AI service. Please try again in a few moments."
    });
  }
});

// User Profile API Endpoint
const userProfileData = {
  full_name: "Deepika S",
  user_id: "user_default",
  email: "sdeepika2606@gmail.com",
  gender: "female",
  role: "professional",
  timeZone: "EST (UTC-5)"
};

app.get(["/api/user/profile", "/user/profile"], (req, res) => {
  res.json(userProfileData);
});

// Calendar Events API Endpoint
let calendarEvents = [
  { id: '1', title: 'Complete AI Project Report', category: 'Study', dueDate: '2026-06-22', dueTime: '09:00 AM', timeRange: '09:00 AM - 11:00 AM', completed: true },
  { id: '2', title: 'Prepare for Placement Interview', category: 'Work', dueDate: '2026-06-22', dueTime: '02:00 PM', timeRange: '02:00 PM - 03:30 PM', completed: false },
  { id: '3', title: 'Data Structures Assignment', category: 'Exams', dueDate: '2026-06-23', dueTime: '10:00 AM', timeRange: '10:00 AM - 12:00 PM', completed: false },
  { id: '4', title: 'Weekly Forest Sync & Retrospective', category: 'Work', dueDate: '2026-06-24', dueTime: '04:00 PM', timeRange: '04:00 PM - 05:00 PM', completed: true },
  { id: '5', title: 'Mindfulness & Meditation Break', category: 'Break', dueDate: '2026-06-25', dueTime: '01:00 PM', timeRange: '01:00 PM - 01:30 PM', completed: true },
];

app.get(["/api/calendar/events", "/calendar/events"], (req, res) => {
  const { view = 'month', date = '2026-06-22', start_date, end_date, user_id } = req.query;
  
  let filtered = [...calendarEvents];
  
  if (start_date && end_date) {
    filtered = filtered.filter(e => e.dueDate >= String(start_date) && e.dueDate <= String(end_date));
  } else if (date) {
    const targetDateStr = String(date);
    if (view === 'day') {
      filtered = filtered.filter(e => e.dueDate === targetDateStr);
    } else if (view === 'week') {
      // Calculate week start and end
      const d = new Date(targetDateStr);
      const dayOfWeek = d.getDay();
      const start = new Date(d);
      start.setDate(d.getDate() - dayOfWeek);
      const end = new Date(start);
      end.setDate(start.getDate() + 6);
      
      const sStr = start.toISOString().split('T')[0];
      const eStr = end.toISOString().split('T')[0];
      filtered = filtered.filter(e => e.dueDate >= sStr && e.dueDate <= eStr);
    } else {
      // month view
      const monthPrefix = targetDateStr.substring(0, 7); // YYYY-MM
      filtered = filtered.filter(e => e.dueDate.startsWith(monthPrefix));
    }
  }

  res.json({
    status: 'success',
    view,
    date,
    user_id: user_id || 'user_default',
    count: filtered.length,
    events: filtered
  });
});

app.post(["/api/calendar/events", "/calendar/events"], (req, res) => {
  const { title, date, dueDate, dueTime, timeRange, startTime, endTime, category, user_id = 'user_default' } = req.body;
  const targetDate = date || dueDate || new Date().toISOString().split('T')[0];
  const targetRange = timeRange || `${startTime || '09:00 AM'} - ${endTime || '10:00 AM'}`;
  
  const newEvent = {
    id: `event_${Date.now()}`,
    title: title || 'Scheduled Session',
    category: category || 'General',
    dueDate: targetDate,
    date: targetDate,
    dueTime: startTime || dueTime || '09:00 AM',
    timeRange: targetRange,
    startTime: startTime || '09:00 AM',
    endTime: endTime || '10:00 AM',
    completed: false,
    user_id
  };

  calendarEvents.unshift(newEvent);

  // Also add to calendarNotifications so it appears in the bottom notification bar
  calendarNotifications.unshift({
    id: `notif_${Date.now()}`,
    title: newEvent.title,
    date: newEvent.dueDate,
    time: newEvent.timeRange,
    category: newEvent.category
  });

  res.json({ success: true, event: newEvent, message: "Calendar event scheduled successfully!" });
});

app.get(["/api/calendar/notifications", "/calendar/notifications"], (req, res) => {
  res.json({ success: true, notifications: calendarNotifications });
});

// Ambient Tracks API with reliable CORS-enabled audio URLs
const ambientTracks = [
  { id: 'forest', title: 'Forest Breeze', duration: '20:00', category_tag: 'nature', file_url: 'https://upload.wikimedia.org/wikipedia/commons/e/e0/Forest_birds.ogg', icon: '🌲', cover: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=200&auto=format&fit=crop' },
  { id: 'rain', title: 'Rain Drops', duration: '15:00', category_tag: 'rain', file_url: 'https://upload.wikimedia.org/wikipedia/commons/b/b5/Rain_sound.ogg', icon: '🌧️', cover: 'https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?q=80&w=200&auto=format&fit=crop' },
  { id: 'ocean', title: 'Ocean Tide', duration: '25:00', category_tag: 'ocean', file_url: 'https://upload.wikimedia.org/wikipedia/commons/2/23/Ocean_waves.ogg', icon: '🌊', cover: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?q=80&w=200&auto=format&fit=crop' },
  { id: 'fire', title: 'Campfire Crackle', duration: '18:00', category_tag: 'fire', file_url: 'https://upload.wikimedia.org/wikipedia/commons/7/75/Campfire_sound.ogg', icon: '🔥', cover: 'https://images.unsplash.com/photo-1524247076162-8e6d63428e20?q=80&w=200&auto=format&fit=crop' },
  { id: 'lofi', title: 'Lofi Chill Study', duration: '30:00', category_tag: 'music', file_url: 'https://upload.wikimedia.org/wikipedia/commons/c/c8/Example.ogg', icon: '🎵', cover: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?q=80&w=200&auto=format&fit=crop' },
];

let focusSessions: any[] = [];
let breathingSessions: any[] = [];
let activityLogs: any[] = [];
let userPreferences = { lastTrack: 'forest', volume: 50, loopWithSession: true };

app.get("/api/ambient-tracks", (req, res) => {
  res.json({ tracks: ambientTracks, preferences: userPreferences });
});

app.patch("/api/user-preferences/music", (req, res) => {
  const { lastTrack, volume, loopWithSession } = req.body;
  if (lastTrack !== undefined) userPreferences.lastTrack = lastTrack;
  if (volume !== undefined) userPreferences.volume = volume;
  if (loopWithSession !== undefined) userPreferences.loopWithSession = loopWithSession;
  res.json({ success: true, preferences: userPreferences });
});

app.post("/api/focus-sessions/start", (req, res) => {
  const { user_id = 'user_default', category, tree_type, duration_minutes } = req.body;
  const session = {
    id: `focus_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
    user_id,
    category: category || 'deep-work',
    tree_type: tree_type || 'Pine Tree',
    duration_minutes: duration_minutes || 25,
    start_timestamp: new Date().toISOString(),
    status: 'in_progress',
  };
  focusSessions.push(session);
  res.json({ success: true, session });
});

app.patch("/api/focus-sessions/:id/complete", (req, res) => {
  const { id } = req.params;
  const { elapsed_seconds } = req.body;
  const session = focusSessions.find(s => s.id === id);
  if (!session) {
    return res.status(404).json({ error: "Session not found" });
  }
  session.status = 'completed';
  session.end_timestamp = new Date().toISOString();
  session.elapsed_seconds = elapsed_seconds || session.duration_minutes * 60;

  // Log to activity_log
  const logEntry = {
    id: `log_${Date.now()}`,
    type: 'focus_session',
    title: `Completed ${session.duration_minutes}m ${session.tree_type} session`,
    timestamp: new Date().toISOString(),
    dateStr: new Date().toISOString().split('T')[0],
  };
  activityLogs.push(logEntry);

  res.json({ success: true, session, message: "Focus session completed successfully and tree added to forest!" });
});

app.patch("/api/focus-sessions/:id/cancel", (req, res) => {
  const { id } = req.params;
  const { elapsed_seconds } = req.body;
  const session = focusSessions.find(s => s.id === id);
  if (!session) {
    return res.status(404).json({ error: "Session not found" });
  }
  session.status = 'incomplete';
  session.end_timestamp = new Date().toISOString();
  session.elapsed_seconds = elapsed_seconds || 0;
  res.json({ success: true, session, message: "Focus session cancelled early." });
});

app.post("/api/breathing-sessions/start", (req, res) => {
  const { user_id = 'user_default', pattern = '4-4-4-4', planned_duration } = req.body;
  const session = {
    id: `breath_${Date.now()}`,
    user_id,
    pattern,
    planned_duration: planned_duration || 60,
    start_timestamp: new Date().toISOString(),
    status: 'in_progress',
  };
  breathingSessions.push(session);
  res.json({ success: true, session });
});

app.patch("/api/breathing-sessions/:id/complete", (req, res) => {
  const { id } = req.params;
  const session = breathingSessions.find(s => s.id === id);
  if (!session) {
    return res.status(404).json({ error: "Session not found" });
  }
  session.status = 'completed';
  session.end_timestamp = new Date().toISOString();

  const logEntry = {
    id: `log_${Date.now()}`,
    type: 'breathing_session',
    title: `Completed ${Math.round((session.planned_duration || 60) / 60)}m Mindfulness Box Breathing`,
    timestamp: new Date().toISOString(),
    dateStr: new Date().toISOString().split('T')[0],
  };
  activityLogs.push(logEntry);

  res.json({ success: true, session, message: "Mindfulness session recorded successfully!" });
});

app.get("/api/activity-logs", (req, res) => {
  res.json({ activityLogs });
});

// ==========================================
// TASKAROA DIGITAL NOTEBOOKS SERVER API
// ==========================================
interface NotebookPage {
  id: string;
  pageNumber: number;
  template: string; // 'Plain' | 'Cornell' | 'Mindmapping' | 'Outline' | 'Boxing' | 'Charting' | 'Sentence' | 'Slides' | 'Brain Dump' | 'Bullet'
  content: string;
  backgroundStyle: 'plain' | 'ruled' | 'grid';
  fontFamily: string;
  fontSize: string;
  fontColor: string;
}

interface NotebookItem {
  id: string;
  title: string;
  createdAt: string;
  author: string;
  pages: NotebookPage[];
}

let notebooks: NotebookItem[] = [
  {
    id: 'nb_1',
    title: 'Anatomy 150 – Ch. 10',
    createdAt: new Date(Date.now() - 86400000 * 3).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    author: 'Deepika S',
    pages: [
      {
        id: 'page_1',
        pageNumber: 1,
        template: 'Cornell',
        content: `<h3>Chapter 10: Respiratory & Cardiopulmonary Anatomy</h3><p><strong>Key Objectives:</strong> Understand gas exchange across pulmonary alveolar membranes and systemic circulation.</p><p>1. Primary functional unit: Alveolus.<br/>2. Surfactant reduces surface tension to prevent collapse.<br/>3. Partial pressure gradients govern O2 and CO2 transport.</p>`,
        backgroundStyle: 'ruled',
        fontFamily: 'font-sans',
        fontSize: '16px',
        fontColor: '#1A3C34'
      },
      {
        id: 'page_2',
        pageNumber: 2,
        template: 'Outline',
        content: `<h4>I. Respiratory System Hierarchy</h4><p>&nbsp;&nbsp;&nbsp;&nbsp;A. Upper Respiratory Tract</p><p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1. Nasal cavity & pharynx</p><p>&nbsp;&nbsp;&nbsp;&nbsp;B. Lower Respiratory Tract</p><p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1. Larynx, trachea, bronchial tree, alveoli</p>`,
        backgroundStyle: 'plain',
        fontFamily: 'font-serif',
        fontSize: '16px',
        fontColor: '#1A3C34'
      }
    ]
  },
  {
    id: 'nb_2',
    title: 'Cognitive Science & AI Systems',
    createdAt: new Date(Date.now() - 86400000 * 7).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    author: 'Deepika S',
    pages: [
      {
        id: 'page_101',
        pageNumber: 1,
        template: 'Boxing',
        content: `<h4>Neural Network Architectures vs. Human Cognition</h4><p>Comparing attention mechanisms in Transformers with biological working memory limitations.</p>`,
        backgroundStyle: 'grid',
        fontFamily: 'font-sans',
        fontSize: '16px',
        fontColor: '#1A3C34'
      }
    ]
  },
  {
    id: 'nb_3',
    title: 'Project Roadmap & Product Strategies',
    createdAt: new Date(Date.now() - 86400000 * 14).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    author: 'Deepika S',
    pages: [
      {
        id: 'page_201',
        pageNumber: 1,
        template: 'Bullet',
        content: `<ul><li><strong>Q3 Deliverables:</strong> Launch offline persistence and digital notebook method templates.</li><li><strong>User Experience:</strong> Realistic spiral binding and page-turn animations.</li><li><strong>Performance:</strong> Zero lag while writing across multiple template formats.</li></ul>`,
        backgroundStyle: 'ruled',
        fontFamily: 'font-sans',
        fontSize: '16px',
        fontColor: '#1A3C34'
      }
    ]
  }
];

app.get("/api/notebooks", (req, res) => {
  res.json({ success: true, notebooks });
});

app.post("/api/notebooks", (req, res) => {
  const { id, title, createdAt, author, pages } = req.body;
  const newNotebook: NotebookItem = {
    id: id || `nb_${Date.now()}`,
    title: title || 'Untitled Notebook',
    createdAt: createdAt || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    author: author || 'Deepika S',
    pages: pages || [
      {
        id: `page_${Date.now()}_1`,
        pageNumber: 1,
        template: 'Plain',
        content: '',
        backgroundStyle: 'plain',
        fontFamily: 'font-sans',
        fontSize: '16px',
        fontColor: '#1A3C34'
      }
    ]
  };

  notebooks.unshift(newNotebook);
  res.json({ success: true, notebook: newNotebook });
});

app.put("/api/notebooks/:id", (req, res) => {
  const { id } = req.params;
  const index = notebooks.findIndex(n => n.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Notebook not found" });
  }

  notebooks[index] = {
    ...notebooks[index],
    ...req.body
  };

  res.json({ success: true, notebook: notebooks[index] });
});

app.delete("/api/notebooks/:id", (req, res) => {
  const { id } = req.params;
  notebooks = notebooks.filter(n => n.id !== id);
  res.json({ success: true, message: "Notebook deleted successfully" });
});

// Vite middleware for development
async function setupServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

setupServer();

