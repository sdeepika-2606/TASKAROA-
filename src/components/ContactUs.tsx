import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, ArrowRight } from 'lucide-react';
import Logo from './Logo';

export default function ContactUs() {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F3EAE0] to-[#E5DDD0] text-[#223148] font-sans p-6">
      <header className="flex items-center justify-between mb-12">
        <button onClick={() => navigate('/')} className="px-6 py-2 border-2 border-[#223148] rounded-full font-bold text-[#223148] flex items-center gap-2 hover:bg-[#223148] hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </button>
        <Logo size="sm" showText={true} />
      </header>

      <main className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-black text-[#223148] mb-8 text-center">Contact Us</h1>
        <div className="bg-white p-12 rounded-3xl shadow-xl border-t-4 border-[#2F486D] grid grid-cols-5 gap-12">
          {/* Left Column */}
          <div className="col-span-2 space-y-8">
            <h1 className="text-4xl font-bold text-[#223148]">
              Let's Talk Productivity.
            </h1>
            <p className="text-[#2F486D]">Have a question about Taskaroa, need support, or want to share feedback? Reach out — we'd love to hear from you.</p>
            
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[#2F486D] flex items-center justify-center text-white"><Mail className="w-5 h-5" /></div>
                <div>
                  <p className="text-xs font-bold uppercase">Email</p>
                  <p className="font-semibold">support@taskaroa.com</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[#2F486D] flex items-center justify-center text-white"><Phone className="w-5 h-5" /></div>
                <div>
                  <p className="text-xs font-bold uppercase">Phone Number</p>
                  <p className="font-semibold">+91 98765 43210</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="col-span-3 bg-[#D2C7B8]/5 p-8 rounded-2xl">
            {submitted ? (
              <div className="text-center py-20 space-y-4">
                <h3 className="text-2xl font-black">Thanks!</h3>
                <p>We'll get back to you within 24 hours.</p>
                <button onClick={() => navigate('/')} className="bg-[#223148] text-white px-8 py-3 rounded-full font-bold">Back to Home</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-black uppercase text-[#2F486D]">Full Name</label>
                  <input type="text" placeholder="Jane Smith" className="w-full p-4 border-2 border-[#D2C7B8] rounded-2xl focus:ring-2 focus:ring-[#2F486D] focus:border-[#2F486D] transition-all bg-white" required />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-black uppercase text-[#2F486D]">Email</label>
                  <input type="email" placeholder="jane@taskaroa.com" className="w-full p-4 border-2 border-[#D2C7B8] rounded-2xl focus:ring-2 focus:ring-[#2F486D] focus:border-[#2F486D] transition-all bg-white" required />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-black uppercase text-[#2F486D]">Subject</label>
                  <select className="w-full p-4 border-2 border-[#D2C7B8] rounded-2xl focus:ring-2 focus:ring-[#2F486D] focus:border-[#2F486D] transition-all bg-white text-[#2F486D]" required>
                    <option value="">Select...</option>
                    <option value="general">General Inquiry</option>
                    <option value="support">Support</option>
                    <option value="feedback">Feedback</option>
                    <option value="partnership">Partnership</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-black uppercase text-[#2F486D]">Message</label>
                  <textarea placeholder="Type your message..." className="w-full p-4 border-2 border-[#D2C7B8] rounded-2xl focus:ring-2 focus:ring-[#2F486D] focus:border-[#2F486D] transition-all bg-white h-32" required />
                </div>
                <button type="submit" className="bg-[#223148] hover:bg-[#2F486D] text-white px-8 py-4 rounded-full font-bold flex items-center gap-2 shadow-lg transition-all">
                  <ArrowRight className="w-4 h-4" /> Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
