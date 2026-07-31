import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronDown, HelpCircle } from 'lucide-react';
import Logo from './Logo';

export default function FAQPage() {
  const navigate = useNavigate();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    { q: "What is Taskaroa?", a: "Taskaroa is an AI-powered productivity companion that helps you plan, prioritize, schedule, and track your tasks so you complete your work before deadlines instead of relying on passive reminders." },
    { q: "How does the AI scheduling feature work?", a: "Taskaroa analyzes your tasks, deadlines, and available time to automatically build an optimized daily schedule, adjusting in real time as new tasks or changes come in." },
    { q: "Is Taskaroa free to use?", a: "Taskaroa offers a free plan with core features like task management and calendar sync. Premium plans unlock advanced AI scheduling, deeper analytics, and additional focus/habit tools." },
    { q: "Can I sync Taskaroa with my existing calendar?", a: "Yes. Taskaroa integrates with your calendar so all your tasks, meetings, and deadlines stay aligned and conflict-free in one unified view." },
    { q: "How do focus sessions work?", a: "You can start a customizable focus timer for studying, working, or personal projects. Taskaroa tracks your session, logs your focus time, and builds your consistency streak." },
    { q: "Is my data secure with Taskaroa?", a: "Yes. Your data is protected with secure authentication and encrypted cloud storage, so your tasks and personal information stay safe and private." },
    { q: "Can I use Taskaroa on multiple devices?", a: "Yes. Your account and data sync automatically across web, desktop, and mobile so you can pick up right where you left off." },
    { q: "How do I track my habits and goals?", a: "Taskaroa's Goals & Habits section lets you set long-term goals, log daily habits, and view your progress and consistency over time through visual trackers." },
    { q: "Does Taskaroa send reminders automatically?", a: "Yes. Taskaroa sends context-aware reminders based on your deadlines and schedule, so you're notified at the right moment instead of getting repetitive alerts." },
    { q: "Who is Taskaroa designed for?", a: "Taskaroa is built for students, professionals, and entrepreneurs — anyone who wants to plan smarter, stay organized, and reduce last-minute stress." },
  ];

  return (
    <div className="min-h-screen bg-[#F3EAE0] text-[#223148] font-sans p-6">
      <header className="flex items-center justify-between mb-12">
        <button onClick={() => navigate('/')} className="px-6 py-2 border-2 border-[#223148] rounded-full font-bold text-[#223148] flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </button>
        <Logo size="sm" showText={true} />
      </header>

      <main className="max-w-3xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <span className="bg-[#D2C7B8]/30 px-4 py-1 rounded-full text-xs font-black uppercase tracking-wider text-[#2F486D]">❓ GOT QUESTIONS?</span>
          <h1 className="text-5xl font-black text-[#223148]">Frequently Asked Questions</h1>
          <p className="text-[#2F486D]">Everything you need to know about Taskaroa. Can't find what you're looking for? <button onClick={() => navigate('/contact')} className="font-bold underline">Contact our support team.</button></p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-white rounded-2xl border border-[#D2C7B8] overflow-hidden transition-all duration-300">
              <button 
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full text-left p-6 font-black text-[#223148] flex justify-between items-center"
              >
                {faq.q}
                <ChevronDown className={`w-6 h-6 text-[#2F486D] transition-transform duration-300 ${openIndex === i ? 'rotate-180' : ''}`} />
              </button>
              {openIndex === i && (
                <div className="p-6 pt-0 border-t border-[#D2C7B8] text-[#2F486D]">{faq.a}</div>
              )}
            </div>
          ))}
        </div>

        <div className="text-center pt-8 space-y-4">
          <p className="font-bold">Still have questions?</p>
          <button onClick={() => navigate('/contact')} className="bg-[#223148] text-white px-8 py-3 rounded-full font-bold">Contact Us</button>
        </div>
      </main>
    </div>
  );
}
