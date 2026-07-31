import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import AboutUs from './components/AboutUs';
import ServicesPage from './components/ServicesPage';
import ContactUs from './components/ContactUs';
import FAQPage from './components/FAQPage';
import AuthPage from './components/AuthPage';
import Dashboard from './components/Dashboard';
import { useProfile } from './context/ProfileContext';

export default function App() {
  return (
    <div className="min-h-screen bg-[#FAFAF9] text-[#1C1917] transition-colors duration-300">
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Router>
    </div>
  );
}
