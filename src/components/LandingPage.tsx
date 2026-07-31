import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, ListChecks, CheckCircle2, ArrowRight } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F3EAE0] text-[#223148] font-sans">
      <header className="flex items-center justify-between p-6">
        <div className="flex items-center gap-3">
          <div className="text-[#223148]"><Clock className="w-8 h-8" /></div>
          <div>
            <h1 className="text-xl font-black tracking-tighter">TASKAROA</h1>
            <p className="text-xs font-bold text-[#2F486D]">AI-Powered Productivity Companion</p>
          </div>
        </div>
        <nav className="flex gap-6 font-bold text-sm">
          <button onClick={() => navigate('/')} className="underline decoration-2 underline-offset-4">HOME</button>
          <button onClick={() => navigate('/about')} className="hover:text-[#2F486D]">ABOUT US</button>
          <button onClick={() => navigate('/services')} className="hover:text-[#2F486D]">SERVICES</button>
          <button onClick={() => navigate('/contact')} className="hover:text-[#2F486D]">CONTACT US</button>
          <button onClick={() => navigate('/faq')} className="hover:text-[#2F486D]">FAQ</button>
        </nav>
      </header>

      <main className="flex flex-col items-center justify-center pt-16 space-y-8 text-center px-6">
        <div className="flex gap-1 text-[#223148]">
          <Clock className="w-12 h-12" />
          <ListChecks className="w-12 h-12" />
          <CheckCircle2 className="w-12 h-12" />
        </div>

        <span className="bg-[#D2C7B8]/30 px-4 py-1 rounded-full text-xs font-black uppercase tracking-wider">PLAN SMART. ACT EARLY. STAY AHEAD.</span>

        <h1 className="text-6xl font-black">
          <div className="text-[#223148]">Plan Smarter.</div>
          <div className="text-[#2F486D]">Achieve More.</div>
        </h1>

        <p className="max-w-[600px] text-lg text-[#2F486D]">
          Your AI-powered productivity companion for planning, scheduling, and tracking tasks. Stay organized, stay consistent, and achieve more with less stress.
        </p>

        <div className="flex gap-4">
          <button onClick={() => navigate('/auth')} className="bg-[#223148] text-white px-8 py-3 rounded-full font-bold flex items-center gap-2">
            GET STARTED <ArrowRight className="w-4 h-4" />
          </button>
          <button onClick={() => navigate('/services')} className="border-2 border-[#223148] text-[#223148] px-8 py-3 rounded-full font-bold">
            SEE HOW IT WORKS
          </button>
        </div>
      </main>
    </div>
  );
}
