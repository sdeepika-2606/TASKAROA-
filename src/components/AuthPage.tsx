import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Lock, User, Eye, EyeOff, Apple, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Logo from './Logo';
import WelcomeForestPanel from './WelcomeForestPanel';
import { useProfile } from '../context/ProfileContext';

// Official SVG Icon for Microsoft
const MicrosoftIcon = () => (
  <svg className="w-5 h-5 shrink-0" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M0 0H11V11H0V0Z" fill="#F25022"/>
    <path d="M12 0H23V11H12V0Z" fill="#7FBA00"/>
    <path d="M0 12H11V23H0V12Z" fill="#00A4EF"/>
    <path d="M12 12H23V23H12V12Z" fill="#FFB900"/>
  </svg>
);

// Official SVG Icon for Google
const GoogleIcon = () => (
  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22c-.87-2.6-2.87-4.53-5.84-4.53z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
  </svg>
);

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { profile, setProfile } = useProfile();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLogin) {
      const fullName = `${firstName.trim()} ${lastName.trim()}`.trim() || 'Taskaroa User';
      setProfile({
        ...profile,
        name: fullName,
        email: email || profile.email,
        password: password || profile.password,
        role: 'professional',
        accountType: 'Professional',
        isNewAccount: true,
        hasSeenWelcomeTour: false,
        neverShowTour: false,
        voiceSettings: {
          ...profile.voiceSettings,
        }
      });
    } else {
      setProfile({
        ...profile,
        email: email || profile.email,
        isNewAccount: false,
      });
    }
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#F5EFEB] flex items-center justify-center p-0 font-sans select-none">
      <div className="max-w-[1440px] w-full min-h-screen bg-[#2F4156] overflow-hidden flex flex-col md:flex-row relative shadow-2xl">
        
        {/* LEFT COLUMN: Premium Blue Form Panel */}
        <div className="w-full md:w-[50%] p-8 md:p-16 flex flex-col justify-center relative z-10 text-white">
          
          {/* Logo & Brand */}
          <div onClick={() => navigate('/')} className="mb-10 cursor-pointer select-none">
            <Logo size="md" showText={true} className="!items-start" theme="dark" />
          </div>

          {/* Form Header */}
          <div className="mb-8">
            <h2 className="text-4xl font-black text-white tracking-tight mb-2">
              {isLogin ? 'Login' : 'Create Your Account'}
            </h2>
            <p className="text-[#C8D9E6] text-sm font-semibold">
              Start your productivity journey with Taskaroa and elevate your daily workflows.
            </p>
          </div>

          {/* Selector Tabs (Sign Up & Login) */}
          <div className="flex gap-8 border-b border-white/10 pb-2 mb-8 w-full justify-center">
            <button 
              type="button"
              onClick={() => setIsLogin(false)}
              className={`text-sm font-extrabold pb-2 relative transition-colors ${!isLogin ? 'text-white' : 'text-gray-400 hover:text-gray-200'}`}
            >
              Sign Up
              {!isLogin && (
                <motion.div layoutId="authTabUnderline" className="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-[#567C8D]" />
              )}
            </button>
            <button 
              type="button"
              onClick={() => setIsLogin(true)}
              className={`text-sm font-extrabold pb-2 relative transition-colors ${isLogin ? 'text-white' : 'text-gray-400 hover:text-gray-200'}`}
            >
              Login
              {isLogin && (
                <motion.div layoutId="authTabUnderline" className="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-[#567C8D]" />
              )}
            </button>
          </div>

          {/* Auth Form */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div 
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#C8D9E6]" />
                      <input 
                        type="text" 
                        placeholder="First Name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full bg-[#2F4156]/40 border border-white/10 focus:border-[#567C8D] focus:ring-1 focus:ring-[#567C8D] rounded-2xl h-[56px] pl-14 pr-4 text-sm focus:outline-none transition-all placeholder:text-gray-400 font-semibold text-white"
                        required
                      />
                    </div>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#C8D9E6]" />
                      <input 
                        type="text" 
                        placeholder="Last Name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full bg-[#2F4156]/40 border border-white/10 focus:border-[#567C8D] focus:ring-1 focus:ring-[#567C8D] rounded-2xl h-[56px] pl-14 pr-4 text-sm focus:outline-none transition-all placeholder:text-gray-400 font-semibold text-white"
                        required
                      />
                    </div>
                  </div>

                </motion.div>
              )}
            </AnimatePresence>

            {/* Email Address */}
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#C8D9E6]" />
              <input 
                type="email" 
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#2F4156]/40 border border-white/10 focus:border-[#567C8D] focus:ring-1 focus:ring-[#567C8D] rounded-2xl h-[56px] pl-14 pr-4 text-sm focus:outline-none transition-all placeholder:text-gray-400 font-semibold text-white"
                required
              />
            </div>

            {/* Password */}
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#C8D9E6]" />
              <input 
                type={showPassword ? 'text' : 'password'} 
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#2F4156]/40 border border-white/10 focus:border-[#567C8D] focus:ring-1 focus:ring-[#567C8D] rounded-2xl h-[56px] pl-14 pr-14 text-sm focus:outline-none transition-all placeholder:text-gray-400 font-semibold text-white"
                required
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {/* Confirm Password (only for Sign Up) */}
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="relative overflow-hidden"
                >
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#C8D9E6]" />
                  <input 
                    type={showConfirmPassword ? 'text' : 'password'} 
                    placeholder="Confirm Password"
                    className="w-full bg-[#2F4156]/40 border border-white/10 focus:border-[#567C8D] focus:ring-1 focus:ring-[#567C8D] rounded-2xl h-[56px] pl-14 pr-14 text-sm focus:outline-none transition-all placeholder:text-gray-400 font-semibold text-white"
                    required
                  />
                  <button 
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Terms and Conditions (only for Sign Up) */}
            {!isLogin && (
              <div className="flex items-center gap-3 px-1 py-1">
                <input 
                  type="checkbox" 
                  id="terms" 
                  className="w-5 h-5 rounded border-white/10 bg-[#2F4156]/40 text-[#567C8D] focus:ring-[#567C8D]" 
                  required 
                />
                <label htmlFor="terms" className="text-xs text-[#C8D9E6] font-semibold select-none cursor-pointer">
                  I agree to the <span className="text-white underline">Terms of Service</span> and <span className="text-white underline">Privacy Policy</span>
                </label>
              </div>
            )}

            {/* Submit Button */}
            <button 
              type="submit"
              className="w-full bg-gradient-to-r from-[#C8D9E6] to-[#567C8D] hover:shadow-lg hover:shadow-[#567C8D]/20 text-[#2F4156] h-[56px] rounded-2xl font-black text-sm transition-all mt-4"
            >
              {isLogin ? 'Login' : 'Create Account'}
            </button>
          </form>

          {/* Social Divider */}
          <div className="mt-8">
            <div className="relative flex items-center justify-center mb-6">
              <div className="absolute w-full h-px bg-white/10" />
              <span className="relative bg-[#2F4156] px-4 text-xs text-gray-400 font-bold uppercase tracking-widest">or continue with</span>
            </div>

            {/* Social Logins */}
            <div className="grid grid-cols-3 gap-4">
              <button type="button" onClick={() => navigate('/dashboard')} className="flex items-center justify-center gap-2 border border-white/10 h-[56px] rounded-2xl bg-white/5 hover:bg-white/10 transition-all shadow-sm">
                <GoogleIcon />
                <span className="font-extrabold text-xs text-white">Google</span>
              </button>
              <button type="button" onClick={() => navigate('/dashboard')} className="flex items-center justify-center gap-2 border border-white/10 h-[56px] rounded-2xl bg-white/5 hover:bg-white/10 transition-all shadow-sm">
                <MicrosoftIcon />
                <span className="font-extrabold text-xs text-white">Microsoft</span>
              </button>
              <button type="button" onClick={() => navigate('/dashboard')} className="flex items-center justify-center gap-2 border border-white/10 h-[56px] rounded-2xl bg-white/5 hover:bg-white/10 transition-all shadow-sm">
                <Apple className="w-5 h-5 text-white shrink-0" fill="currentColor" />
                <span className="font-extrabold text-xs text-white">Apple</span>
              </button>
            </div>
          </div>

          {/* Form Switch Footer */}
          <p className="mt-8 text-center text-sm font-semibold text-gray-400">
            Already have an account?
            <button 
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-[#C8D9E6] underline hover:text-white transition-colors font-black ml-2"
            >
              {isLogin ? 'Sign Up' : 'Login'}
            </button>
          </p>
        </div>

        {/* RIGHT COLUMN: Premium Illustration Panel */}
        <div className="hidden md:flex md:w-[50%] p-6 bg-[#FAFDFB]">
          <WelcomeForestPanel 
            userName="Friend" 
            isNewAccount={!isLogin} 
            theme="light"
            className="w-full h-full"
            generalWelcome={true}
          />
        </div>
      </div>
    </div>
  );
}
