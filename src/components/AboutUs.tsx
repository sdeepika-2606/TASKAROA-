import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import Logo from './Logo';

export default function AboutUs() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F3EAE0] text-[#223148] font-sans p-6">
      {/* Header */}
      <header className="flex items-center justify-between mb-12">
        <button onClick={() => navigate('/')} className="px-6 py-2 border-2 border-[#223148] rounded-full font-bold text-[#223148] flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </button>
        <Logo size="sm" showText={true} />
      </header>

      {/* Hero Section */}
      <main className="max-w-4xl mx-auto space-y-12">
        <div className="text-center space-y-6">
          <span className="bg-[#D2C7B8]/30 px-4 py-1 rounded-full text-xs font-black uppercase tracking-wider text-[#2F486D]">MEET YOUR AI COMPANION</span>
          <h1 className="text-5xl font-black text-[#223148]">About Us – Taskaroa</h1>
          <p className="max-w-[700px] mx-auto text-lg text-[#2F486D]">Taskaroa is an AI-powered productivity companion designed to help users organize their work, manage time effectively, and complete tasks before deadlines. Our mission is to simplify productivity by combining intelligent planning, automated scheduling, and personalized AI guidance into one unified platform.</p>
          <p className="max-w-[700px] mx-auto text-lg text-[#2F486D]">Whether you're a student managing assignments, a professional handling projects, or an individual organizing daily responsibilities, Taskaroa helps you stay focused, prioritize what matters, and achieve your goals with confidence.</p>
        </div>

        {/* Features */}
        <section className="space-y-6">
          <h2 className="text-3xl font-black text-[#223148] text-center">Key Features Explained</h2>
          <div className="w-20 h-1 bg-[#2F486D] mx-auto rounded-full" />
          
          <div className="grid grid-cols-2 gap-6">
            {[
              { icon: '📋', title: 'Smart Task Management', desc: 'Create, organize, update, and track tasks with intelligent prioritization based on urgency, importance, deadlines, and workload.' },
              { icon: '🕐', title: 'AI Scheduling & Reminders', desc: 'Taskaroa goes beyond simple alerts by using AI to suggest optimal schedules based on deadlines, trigger context-aware reminders at the right moment, and help users break large tasks into actionable steps.', list: ['Smart schedule suggestions', 'Context-aware reminders', 'Actionable task breakdown'] },
              { icon: '📅', title: 'Calendar Integration', desc: 'Seamless calendar integration ensures that tasks, meetings, and commitments stay aligned. Taskaroa intelligently syncs with calendars to avoid conflicts and recommend realistic task timelines.' },
              { icon: '🎯', title: 'Goal & Habit Tracking', desc: 'Users can define long-term goals and daily habits. Taskaroa tracks progress, identifies consistency gaps, and provides personalized recommendations to stay on track—turning intention into habit.' },
            ].map((feature, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-[#D2C7B8] shadow-sm space-y-3">
                <div className="w-12 h-12 flex items-center justify-center bg-[#D2C7B8]/30 rounded-full text-2xl mb-4">{feature.icon}</div>
                <h3 className="font-black text-[#223148] text-xl">{feature.title}</h3>
                <p className="text-[#2F486D]">{feature.desc}</p>
                {feature.list && (
                  <ul className="space-y-1">
                    {feature.list.map((item, j) => (
                      <li key={j} className="flex items-center gap-2 text-sm text-[#2F486D]"><CheckCircle2 className="w-4 h-4 text-[#2F486D]" /> {item}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#D2C7B8] shadow-sm space-y-3">
            <div className="w-12 h-12 flex items-center justify-center bg-[#D2C7B8]/30 rounded-full text-2xl mb-4">🤖</div>
            <h3 className="font-black text-[#223148] text-xl">AI Productivity Assistant</h3>
            <p className="text-[#2F486D]">The built-in AI assistant acts as a proactive guide by prioritizing tasks dynamically, helping users recover when they fall behind, suggesting next best actions, and offering productivity insights.</p>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {['Prioritizing tasks dynamically', 'Suggesting next best actions', 'Recovering when behind', 'Offering productivity insights'].map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-[#2F486D]"><CheckCircle2 className="w-4 h-4 text-[#2F486D]" /> {item}</div>
              ))}
            </div>
          </div>
        </section>

        {/* Vision Section */}
        <section className="bg-[#223148] text-white p-12 rounded-3xl text-center space-y-4">
          <h3 className="text-2xl font-black">Our Vision</h3>
          <p className="max-w-3xl mx-auto">Taskaroa aims to reduce stress, last-minute rush, and missed opportunities by empowering users to act early, stay focused, and finish strong.</p>
          <p className="max-w-3xl mx-auto">By combining AI intelligence with human-centric design, Taskaroa helps users not just remember tasks—but complete them effectively.</p>
        </section>
      </main>
    </div>
  );
}
