import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Logo from './Logo';

export default function ServicesPage() {
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
          <span className="bg-[#D2C7B8]/30 px-4 py-1 rounded-full text-xs font-black uppercase tracking-wider text-[#2F486D]">⚙️ EXPLORE OUR SOLUTIONS</span>
          <h1 className="text-5xl font-black text-[#223148]">Our Services</h1>
          <h2 className="text-2xl font-bold text-[#2F486D]">Empowering Productivity with Intelligent AI Solutions</h2>
          <p className="max-w-[700px] mx-auto text-lg text-[#2F486D]">Taskaroa provides a complete suite of AI-powered productivity services designed to help users plan efficiently, stay organized, and accomplish their goals with confidence. From intelligent task management to personalized scheduling, our platform transforms the way you manage your daily work.</p>
        </div>

        {/* What We Provide */}
        <section className="space-y-6">
          <h2 className="text-3xl font-black text-[#223148] text-center">What We Provide</h2>
          <div className="w-20 h-1 bg-[#2F486D] mx-auto rounded-full" />
          
          <div className="grid grid-cols-2 gap-6">
            {[
              { icon: '🤖', title: 'AI Productivity Assistant', desc: 'Get real-time guidance from an intelligent AI assistant that helps you organize tasks, prioritize workloads, create schedules, and improve your productivity with personalized recommendations.' },
              { icon: '📋', title: 'Smart Task Management', desc: 'Create, manage, edit, and organize your daily tasks effortlessly. Taskaroa intelligently categorizes and prioritizes your work based on deadlines, urgency, and workload to keep you focused on what matters most.' },
              { icon: '📅', title: 'Intelligent Scheduling', desc: 'Automatically generate optimized daily schedules based on your availability, deadlines, and priorities. Let AI build a balanced plan that maximizes productivity while reducing unnecessary stress.' },
              { icon: '🔔', title: 'Smart Reminders & Notifications', desc: 'Receive timely, context-aware reminders for assignments, meetings, projects, bills, and personal goals. Stay informed with intelligent notifications that help you never miss an important deadline.' },
              { icon: '📆', title: 'Calendar & Timeline Management', desc: 'View all your tasks, deadlines, events, and schedules in a unified calendar. Easily track upcoming commitments and manage your time with an organized timeline.' },
              { icon: '🎯', title: 'Goal & Habit Tracking', desc: 'Set meaningful goals, monitor daily habits, and measure your progress through actionable insights. Build consistent routines that support both personal and professional success.' },
              { icon: '⏱️', title: 'Focus Sessions', desc: 'Improve concentration with customizable focus sessions tailored for studying, working, reviewing, or personal projects. Stay productive with structured work intervals and distraction-free sessions.' },
              { icon: '📊', title: 'Productivity Analytics', desc: 'Gain valuable insights into your performance with detailed analytics. Monitor task completion rates, focus time, productivity trends, and overall progress through interactive dashboards and reports.' },
            ].map((service, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-[#D2C7B8] shadow-sm space-y-3">
                <div className="w-12 h-12 flex items-center justify-center bg-[#D2C7B8]/30 rounded-full text-2xl mb-4">{service.icon}</div>
                <h3 className="font-black text-[#223148] text-xl">{service.title}</h3>
                <p className="text-[#2F486D]">{service.desc}</p>
              </div>
            ))}
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#D2C7B8] shadow-sm space-y-3">
            <div className="w-12 h-12 flex items-center justify-center bg-[#D2C7B8]/30 rounded-full text-2xl mb-4">⚙️</div>
            <h3 className="font-black text-[#223148] text-xl">Personalized & Secure Experience</h3>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <p className="text-[#2F486D] text-sm">Customize your dashboard, notification preferences, scheduling settings, and productivity experience according to your workflow.</p>
              <p className="text-[#2F486D] text-sm">Your data is protected with secure authentication and reliable cloud-based infrastructure, ensuring your productivity information remains safe, accessible, and synchronized across your devices.</p>
            </div>
          </div>
        </section>

        {/* Bottom Banner */}
        <section className="bg-[#223148] text-white p-12 rounded-3xl text-center">
          <p className="text-xl font-bold italic">Helping You Plan Better, Work Smarter, and Achieve More with AI.</p>
        </section>
      </main>
    </div>
  );
}
