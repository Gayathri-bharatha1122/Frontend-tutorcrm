import React from 'react';
import { motion } from 'motion/react';
import {
  GraduationCap,
  Users,
  BookOpen,
  Activity,
  Shield,
  PlusSquare,
  Calendar,
  ChevronRight,
  Sparkles,
  CheckCircle,
  Menu,
  ArrowUpRight,
  Mail,
  Phone,
  Clock,
  Loader2
} from 'lucide-react';
import { Screen, Role } from '../types';
import { useLanguage } from '../LanguageContext';
import { LanguageSelector } from './LanguageSelector';
import heroImage from '../../assets/tutor_crm_hero.png';

interface LandingPageProps {
  onNavigate: (screen: Screen, initialRole?: Role) => void;
  isLoggedIn?: boolean;
  activeRole?: Role;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate, isLoggedIn, activeRole }) => {
  const { t } = useLanguage();

  React.useEffect(() => {
    const targetSection = sessionStorage.getItem('scrollTarget');
    if (targetSection) {
      sessionStorage.removeItem('scrollTarget');
      
      const scrollToElement = () => {
        const element = document.getElementById(targetSection);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        } else {
          let retries = 0;
          const interval = setInterval(() => {
            const el = document.getElementById(targetSection);
            if (el) {
              el.scrollIntoView({ behavior: 'smooth' });
              clearInterval(interval);
            }
            retries++;
            if (retries >= 15) {
              clearInterval(interval);
            }
          }, 100);
        }
      };
      scrollToElement();
    }
  }, []);

  // Scroll Parallax State
  const [scrollY, setScrollY] = React.useState(0);

  React.useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Contact Section State
  const [activeContactTab, setActiveContactTab] = React.useState<'message' | 'book'>('message');
  const [messageForm, setMessageForm] = React.useState({ name: '', email: '', message: '' });
  const [bookingForm, setBookingForm] = React.useState({ name: '', email: '', phoneCode: '+1', phoneNumber: '', date: '', time: '', topic: 'general' });
  const [isSubmittingContact, setIsSubmittingContact] = React.useState(false);
  const [contactSuccessMessage, setContactSuccessMessage] = React.useState<string | null>(null);

  const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setMessageForm(prev => ({ ...prev, [name]: value }));
  };

  const handleBookingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setBookingForm(prev => ({ ...prev, [name]: value }));
  };

  const handleMessageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageForm.name || !messageForm.email || !messageForm.message) return;
    setIsSubmittingContact(true);
    setContactSuccessMessage(null);
    setTimeout(() => {
      setIsSubmittingContact(false);
      setContactSuccessMessage(t('Your message has been sent successfully! Our team will contact you shortly.'));
      setMessageForm({ name: '', email: '', message: '' });
    }, 1500);
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingForm.name || !bookingForm.email || !bookingForm.phoneNumber || !bookingForm.date || !bookingForm.time) return;
    setIsSubmittingContact(true);
    setContactSuccessMessage(null);
    setTimeout(() => {
      setIsSubmittingContact(false);
      setContactSuccessMessage(t('Your call appointment is booked! Confirmation email has been sent.'));
      setBookingForm({ name: '', email: '', phoneCode: '+1', phoneNumber: '', date: '', time: '', topic: 'general' });
    }, 1500);
  };

  const handleMouseMove3D = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const xc = x / rect.width - 0.5;
    const yc = y / rect.height - 0.5;
    card.style.transform = `perspective(1000px) rotateY(${xc * 10}deg) rotateX(${yc * -10}deg) scale3d(1.02, 1.02, 1.02)`;
    card.style.boxShadow = `0 25px 45px -15px rgba(29, 78, 216, 0.35), 0 0 25px -5px rgba(0, 240, 255, 0.2)`;
  };

  const handleMouseLeave3D = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    card.style.transform = `perspective(1000px) rotateY(0deg) rotateX(0deg) scale3d(1, 1, 1)`;
    card.style.boxShadow = ``;
  };
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring' as const, stiffness: 100 }
    }
  };

  const coursesList = [
    {
      title: "Advanced Physics Honors",
      grade: "Grade 11-12",
      desc: "Delve into kinematic vector fields, rotational momentum mechanics, and quantum orbital dynamics models.",
      tutor: "Prof. Alistair Miller",
      theme: {
        bg: "bg-teal-500/10",
        text: "text-teal-400",
        border: "border-teal-500/20",
        hoverBorder: "hover:border-teal-500/50",
        btnBg: "bg-teal-600/10 hover:bg-teal-600 text-teal-300 hover:text-white",
        glow: "bg-teal-500",
        btnBorder: "border-teal-500/30"
      },
      icon: <Activity className="h-5.5 w-5.5" />
    },
    {
      title: "Calculus BC & Analysis",
      grade: "Grade 10-12",
      desc: "Master integration vectors, infinite series limits, polar coordinates, and advanced differential proofs.",
      tutor: "Dr. Sarah Jenkins",
      theme: {
        bg: "bg-indigo-500/10",
        text: "text-indigo-400",
        border: "border-indigo-500/20",
        hoverBorder: "hover:border-indigo-500/50",
        btnBg: "bg-indigo-600/10 hover:bg-indigo-600 text-indigo-300 hover:text-white",
        glow: "bg-indigo-500",
        btnBorder: "border-indigo-500/30"
      },
      icon: <ArrowUpRight className="h-5.5 w-5.5" />
    },
    {
      title: "Chemistry & Carbon Rings",
      grade: "Grade 11",
      desc: "Explore atomic orbitals theory, bond dynamic states, molecular synthesis, and basic carbon chains.",
      tutor: "Dr. Evelyn Sterling",
      theme: {
        bg: "bg-emerald-500/10",
        text: "text-emerald-400",
        border: "border-emerald-500/20",
        hoverBorder: "hover:border-emerald-500/50",
        btnBg: "bg-emerald-600/10 hover:bg-emerald-600 text-emerald-300 hover:text-white",
        glow: "bg-emerald-500",
        btnBorder: "border-emerald-500/30"
      },
      icon: <GraduationCap className="h-5.5 w-5.5" />
    },
    {
      title: "AP English Composition",
      grade: "Grade 12",
      desc: "Develop rhetorical argument formats, analyze historic prose works, and write structured academic papers.",
      tutor: "Sarah Jenkins",
      theme: {
        bg: "bg-amber-500/10",
        text: "text-amber-400",
        border: "border-amber-500/20",
        hoverBorder: "hover:border-amber-500/50",
        btnBg: "bg-amber-600/10 hover:bg-amber-600 text-amber-300 hover:text-white",
        glow: "bg-amber-500",
        btnBorder: "border-amber-500/30"
      },
      icon: <BookOpen className="h-5.5 w-5.5" />
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white">

      {/* Hero Section */}
      <section className="relative pt-20 pb-24 overflow-hidden">
        {/* Premium Animated Background Overlays */}
        <div 
          className="absolute inset-0 mesh-gradient-bg pointer-events-none z-0" 
          style={{ transform: `translateY(${scrollY * 0.12}px)` }}
        />
        
        {/* Light Beams */}
        <div 
          className="absolute top-[-10%] left-[-20%] w-[60%] h-[70%] bg-gradient-to-b from-royal-blue/10 to-transparent blur-[80px] light-beam-1 pointer-events-none z-0"
          style={{ transform: `translateY(${scrollY * 0.22}px) rotate(${-35 + scrollY * 0.01}deg)` }}
        />
        <div 
          className="absolute top-[20%] right-[-10%] w-[50%] h-[60%] bg-gradient-to-b from-electric-cyan/8 to-transparent blur-[70px] light-beam-2 pointer-events-none z-0"
          style={{ transform: `translateY(${scrollY * 0.18}px) rotate(${40 - scrollY * 0.008}deg)` }}
        />

        {/* Floating Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          {[...Array(12)].map((_, i) => {
            const size = (i % 3 + 1) * 8; // 8px, 16px, 24px
            const left = `${(i * 9) % 100}%`;
            const delay = `${(i * 1.5) % 10}s`;
            const duration = `${12 + (i * 3) % 15}s`;
            const color = i % 3 === 0 ? 'bg-indigo-400/20' : i % 3 === 1 ? 'bg-indigo-600/15' : 'bg-emerald-500/20';
            return (
              <div
                key={i}
                className={`absolute rounded-full blur-[2px] ${color}`}
                style={{
                  width: `${size}px`,
                  height: `${size}px`,
                  left: left,
                  bottom: '-50px',
                  animation: `particle-float ${duration} infinite linear`,
                  animationDelay: delay,
                  transform: `translateY(${scrollY * -0.08}px)`,
                }}
              />
            );
          })}
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Left Column: Premium Animated Tutor CRM Illustration */}
            <div className="lg:col-span-5 order-2 lg:order-1 flex justify-center w-full">
              <motion.div
                initial={{ opacity: 0, x: -30, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ delay: 0.4, duration: 0.8, type: 'spring', stiffness: 50 }}
                className="relative w-full max-w-md perspective-1000"
              >
                {/* Background Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-indigo-500/10 blur-[80px] rounded-full pointer-events-none animate-pulse-glow" />

                {/* Floating 3D Education Icons */}
                {/* Floating 3D Icon 1 (GraduationCap) */}
                <motion.div
                  animate={{ y: [-12, 12, -12], rotate: [0, 15, 0], scale: [0.95, 1.05, 0.95] }}
                  transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -top-12 -left-12 p-2.5 bg-gradient-to-br from-emerald-500/20 to-emerald-600/5 border border-emerald-500/35 rounded-2xl shadow-xl backdrop-blur-md hidden lg:flex items-center justify-center text-emerald-400 premium-card-3d"
                  style={{ transform: `translateY(${scrollY * -0.04}px)` }}
                >
                  <GraduationCap className="h-6 w-6 filter drop-shadow-[0_4px_6px_rgba(139,92,246,0.3)]" />
                </motion.div>

                {/* Floating 3D Icon 2 (BookOpen) */}
                <motion.div
                  animate={{ y: [10, -10, 10], rotate: [10, -10, 10], scale: [1.02, 0.98, 1.02] }}
                  transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -bottom-12 -right-12 p-2.5 bg-gradient-to-br from-indigo-500/20 to-indigo-600/5 border border-indigo-500/35 rounded-2xl shadow-xl backdrop-blur-md hidden lg:flex items-center justify-center text-indigo-400 premium-card-3d"
                  style={{ transform: `translateY(${scrollY * 0.06}px)` }}
                >
                  <BookOpen className="h-6 w-6 filter drop-shadow-[0_4px_6px_rgba(29,78,216,0.3)]" />
                </motion.div>

                {/* Floating 3D Icon 3 (Activity) */}
                <motion.div
                  animate={{ y: [-8, 8, -8], rotate: [-15, 15, -15] }}
                  transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute top-24 -right-16 p-2.5 bg-gradient-to-br from-teal-500/20 to-teal-600/5 border border-teal-500/35 rounded-2xl shadow-xl backdrop-blur-md hidden lg:flex items-center justify-center text-teal-400 premium-card-3d"
                  style={{ transform: `translateY(${scrollY * -0.02}px)` }}
                >
                  <Activity className="h-6 w-6 filter drop-shadow-[0_4px_6px_rgba(0,240,255,0.3)]" />
                </motion.div>

                {/* Floating 3D Icon 4 (Shield) */}
                <motion.div
                  animate={{ y: [6, -6, 6], rotate: [5, -5, 5] }}
                  transition={{ duration: 7.5, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute bottom-20 -left-16 p-2.5 bg-gradient-to-br from-indigo-950/40 to-indigo-800/10 border border-indigo-500/25 rounded-2xl shadow-xl backdrop-blur-md hidden lg:flex items-center justify-center text-indigo-300 premium-card-3d"
                  style={{ transform: `translateY(${scrollY * 0.03}px)` }}
                >
                  <Shield className="h-6 w-6 filter drop-shadow-[0_4px_6px_rgba(29,78,216,0.2)]" />
                </motion.div>

                {/* Main Interactive 3D Frame */}
                <motion.div 
                  className="relative w-full h-auto rounded-2xl border border-slate-800 bg-slate-950/40 p-4 backdrop-blur-sm shadow-2xl overflow-visible transform-style-3d group"
                  whileHover={{ rotateX: 2, rotateY: -2 }}
                  transition={{ type: "spring", stiffness: 150, damping: 15 }}
                >
                  {/* Laptop frame holding the CRM dashboard illustration */}
                  <div className="relative overflow-hidden rounded-xl border border-slate-800 bg-slate-900 shadow-inner">
                    <img
                      src={heroImage}
                      alt="Tutor CRM Dashboard Showcase"
                      className="w-full h-auto object-cover rounded-xl"
                    />

                    {/* Animated Live Feed badge overlay */}
                    <div className="absolute top-[8%] left-[45%] flex items-center gap-1 bg-slate-950/80 border border-slate-800 rounded-full px-2 py-0.5 backdrop-blur-sm shadow-lg scale-90">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-ping absolute" />
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                      <span className="text-[8px] font-bold text-slate-350 tracking-wider">LIVE DESK</span>
                    </div>

                    {/* Simulating active data calculation */}
                    <div className="absolute bottom-[15%] left-[8%] max-w-[50%] p-1.5 bg-slate-950/85 border border-slate-800 rounded-lg backdrop-blur-sm hidden md:block">
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" />
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.2s]" />
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.4s]" />
                        <span className="text-[7px] text-slate-400 font-medium">Syncing grades database...</span>
                      </div>
                    </div>
                  </div>

                  {/* Floating Widgets with Parallax offsets */}
                  {/* Widget 1: Student Card (Top-Left) */}
                  <motion.div
                    animate={{ y: [-6, 6, -6], rotate: [-1, 1, -1] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -top-4 -left-4 md:-left-8 p-2.5 bg-slate-900/90 border border-slate-800 rounded-xl shadow-xl backdrop-blur-md hidden sm:flex items-center gap-2.5 max-w-[170px]"
                    style={{ transform: `translateY(${scrollY * -0.03}px)` }}
                  >
                    <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center text-[10px] font-bold text-white">MT</div>
                    <div className="text-left">
                      <span className="text-[9px] text-slate-500 font-bold block">STUDENT</span>
                      <span className="text-[11px] font-bold text-white block">Marcus Thorne</span>
                      <span className="text-[8px] text-emerald-450 block font-semibold">Active • 98% Attend</span>
                    </div>
                  </motion.div>

                  {/* Widget 2: AI assistant bubble (Top-Right) */}
                  <motion.div
                    animate={{ y: [6, -6, 6], rotate: [1, -1, 1] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -top-6 -right-4 md:-right-8 p-2.5 bg-indigo-950/80 border border-indigo-500/30 rounded-xl shadow-xl backdrop-blur-md hidden sm:flex items-center gap-2 max-w-[150px]"
                    style={{ transform: `translateY(${scrollY * -0.04}px)` }}
                  >
                    <div className="w-5 h-5 rounded-full bg-indigo-600 flex items-center justify-center text-[9px] text-white">🤖</div>
                    <div className="text-left">
                      <span className="text-[8px] text-indigo-400 font-bold block">AI CRM TUTOR</span>
                      <span className="text-[9px] text-slate-200 block leading-tight font-medium">Drafting response...</span>
                    </div>
                  </motion.div>

                  {/* Widget 3: Fee status indicator (Bottom-Left) */}
                  <motion.div
                    animate={{ y: [4, -4, 4] }}
                    transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -bottom-6 -left-3 md:-left-6 p-2.5 bg-slate-900/95 border border-slate-800 rounded-xl shadow-xl backdrop-blur-md hidden sm:flex items-center gap-2.5"
                    style={{ transform: `translateY(${scrollY * 0.03}px)` }}
                  >
                    <div className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px] font-bold">₹</div>
                    <div className="text-left">
                      <span className="text-[8px] text-slate-500 font-bold block">FEE INVOICE</span>
                      <span className="text-[11px] font-extrabold text-white block">₹2,140 Paid</span>
                    </div>
                  </motion.div>

                  {/* Widget 4: Real-time notification (Bottom-Right) */}
                  <motion.div
                    animate={{ y: [-4, 4, -4] }}
                    transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -bottom-4 -right-3 md:-right-6 p-2.5 bg-slate-900/90 border border-slate-800 rounded-xl shadow-xl backdrop-blur-md hidden sm:flex items-center gap-2 max-w-[140px]"
                    style={{ transform: `translateY(${scrollY * 0.04}px)` }}
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                    <div className="text-left">
                      <span className="text-[8px] text-slate-500 font-bold block">PARENT INBOX</span>
                      <span className="text-[9px] text-slate-300 block font-medium leading-tight">Miller sent message</span>
                    </div>
                  </motion.div>
                </motion.div>
              </motion.div>
            </div>

            {/* Right Column: Tagline, Details, CTA Buttons */}
            <div className="lg:col-span-7 order-1 lg:order-2 text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2 px-3 py-1 bg-slate-900 border border-slate-800 rounded-full text-xs text-slate-400 mb-6"
              >
                <Sparkles className="h-3 w-3 text-indigo-400" />
                <span>{t('Unified Management Ecosystem v2.0 is Live')}</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.6 }}
                className="text-4xl sm:text-5xl md:text-6xl font-sans font-bold tracking-tight text-white mb-6 leading-tight"
              >
                {t('Where Learning')} <br />
                <span className="bg-gradient-to-r from-indigo-400 via-indigo-300 to-emerald-400 bg-clip-text text-transparent">
                  {t('Meets Success')}
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="text-lg text-slate-400 max-w-xl mx-auto lg:mx-0 mb-0 leading-relaxed font-sans"
              >
                {t('Connecting Administrators, Tutors, Parents, and Students into a cohesive learning workspace. View reports, compile grades, clear billing invoices, and message teachers in real-time.')}
              </motion.p>
            </div>
          </div>
        </div>

        {/* Animated Wave Separator */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0] z-10 pointer-events-none">
          <svg 
            className="relative block w-[200%] h-[40px] md:h-[65px] text-slate-950" 
            viewBox="0 0 1200 120" 
            preserveAspectRatio="none"
            style={{ transform: `translateX(${-scrollY * 0.04}px)` }}
          >
            {/* Layer 1 (Back wave) */}
            <path 
              d="M0,32L120,42.7C240,53,480,75,720,74.7C960,75,1200,53,1320,42.7L1440,32L1440,120L1320,120C1200,120,960,120,720,120C480,120,240,120,120,120L0,120Z" 
              fill="rgba(3, 7, 18, 0.45)"
              className="wave-animation-1"
            />
            {/* Layer 2 (Front wave) */}
            <path 
              d="M0,64L80,58.7C160,53,320,43,480,48C640,53,800,75,960,80C1120,85,1280,75,1360,69.3L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z" 
              fill="#030712"
              className="wave-animation-2"
            />
          </svg>
        </div>
      </section>

      {/* Showcase Workspace Grid */}
      <section className="bg-slate-950 pb-20 border-b border-slate-900" id="ecosystem">
        <div className="w-full px-4 sm:px-8 lg:px-12">
          <div className="text-center mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-4">
              {t('Explore Our Live Sub-Portals')}
            </h2>
            <p className="text-slate-400 max-w-lg mx-auto">
              {t('EduManage CRM dynamically routes layouts based on authorized account parameters. Select a client preview node to try immediately.')}
            </p>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {/* Admin Portal Info Card */}
            <motion.div
              variants={itemVariants}
              onMouseMove={handleMouseMove3D}
              onMouseLeave={handleMouseLeave3D}
              className="bg-slate-900/60 p-6 rounded-2xl border border-indigo-500/20 hover:border-indigo-500/40 transition-all flex flex-col justify-between transform-style-3d"
            >
              <div>
                <div className="w-12 h-12 bg-indigo-900/40 text-indigo-400 rounded-xl flex items-center justify-center mb-5 border border-indigo-500/30">
                  <Shield className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{t('Administrative CRM')}</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-6">
                  {t('Manage standard student directory databases, track fee metrics, monitor real-time security audits and logs, & enroll students securely.')}
                </p>
              </div>
              <button
                onClick={() => {
                  if (!isLoggedIn) onNavigate('login', 'admin');
                  else if (activeRole === 'admin') onNavigate('admin');
                }}
                className={`w-full py-2.5 px-4 bg-indigo-600/10 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/30 font-medium text-xs rounded-xl transition-all mt-auto flex items-center justify-center gap-1 cursor-pointer hover:scale-[1.02] active:scale-[0.98] btn-shine-effect btn-ripple ${isLoggedIn && activeRole !== 'admin' ? 'opacity-50 cursor-not-allowed hover:bg-indigo-600/10 hover:text-indigo-300' : ''}`}
                disabled={isLoggedIn && activeRole !== 'admin'}
              >
                {isLoggedIn && activeRole === 'admin' ? t('Go to Dashboard') : t('Quick Preview CRM Panel')} <ArrowUpRight className="h-3 w-3" />
              </button>
            </motion.div>

            {/* Tutor Dashboard Card */}
            <motion.div
              variants={itemVariants}
              onMouseMove={handleMouseMove3D}
              onMouseLeave={handleMouseLeave3D}
              className="bg-slate-900/60 p-6 rounded-2xl border border-teal-500/20 hover:border-teal-500/40 transition-all flex flex-col justify-between transform-style-3d"
            >
              <div>
                <div className="w-12 h-12 bg-teal-900/40 text-teal-400 rounded-xl flex items-center justify-center mb-5 border border-teal-500/30">
                  <Users className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{t('Tutor Workspace')}</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-6">
                  {t('Log class attendances quickly, record progress indicators, add grades to historic exams, & edit curriculum trackers with zero delay.')}
                </p>
              </div>
              <button
                onClick={() => {
                  if (!isLoggedIn) onNavigate('login', 'tutor');
                  else if (activeRole === 'tutor') onNavigate('tutor');
                }}
                className={`w-full py-2.5 px-4 bg-teal-600/10 hover:bg-teal-600 text-teal-350 hover:text-white border border-teal-500/30 font-medium text-xs rounded-xl transition-all mt-auto flex items-center justify-center gap-1 cursor-pointer hover:scale-[1.02] active:scale-[0.98] btn-shine-effect btn-ripple ${isLoggedIn && activeRole !== 'tutor' ? 'opacity-50 cursor-not-allowed hover:bg-teal-600/10 hover:text-teal-355' : ''}`}
                disabled={isLoggedIn && activeRole !== 'tutor'}
              >
                {isLoggedIn && activeRole === 'tutor' ? t('Go to Dashboard') : t('Launch Tutor Control')} <ArrowUpRight className="h-3 w-3" />
              </button>
            </motion.div>

            {/* Parent Linkage Portal */}
            <motion.div
              variants={itemVariants}
              onMouseMove={handleMouseMove3D}
              onMouseLeave={handleMouseLeave3D}
              className="bg-slate-900/60 p-6 rounded-2xl border border-amber-500/20 hover:border-amber-500/40 transition-all flex flex-col justify-between transform-style-3d"
            >
              <div>
                <div className="w-12 h-12 bg-amber-900/40 text-amber-400 rounded-xl flex items-center justify-center mb-5 border border-amber-500/30">
                  <Activity className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{t('Parent Portal')}</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-6">
                  {t('Track child metrics (attendance gauges, homework grades), review notifications transcripts, pay bills & invoices via payment gateways.')}
                </p>
              </div>
              <button
                onClick={() => {
                  if (!isLoggedIn) onNavigate('login', 'parent');
                  else if (activeRole === 'parent') onNavigate('parent');
                }}
                className={`w-full py-2.5 px-4 bg-amber-600/10 hover:bg-amber-600 text-amber-300 hover:text-white border border-amber-500/30 font-medium text-xs rounded-xl transition-all mt-auto flex items-center justify-center gap-1 cursor-pointer hover:scale-[1.02] active:scale-[0.98] btn-shine-effect btn-ripple ${isLoggedIn && activeRole !== 'parent' ? 'opacity-50 cursor-not-allowed hover:bg-amber-600/10 hover:text-amber-300' : ''}`}
                disabled={isLoggedIn && activeRole !== 'parent'}
              >
                {isLoggedIn && activeRole === 'parent' ? t('Go to Dashboard') : t('Configure Parent Linkage')} <ArrowUpRight className="h-3 w-3" />
              </button>
            </motion.div>

            {/* Student Learning Portal */}
            <motion.div
              variants={itemVariants}
              onMouseMove={handleMouseMove3D}
              onMouseLeave={handleMouseLeave3D}
              className="bg-slate-900/60 p-6 rounded-2xl border border-emerald-500/20 hover:border-emerald-500/40 transition-all flex flex-col justify-between transform-style-3d"
            >
              <div>
                <div className="w-12 h-12 bg-emerald-900/40 text-emerald-400 rounded-xl flex items-center justify-center mb-5 border border-emerald-500/30">
                  <BookOpen className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{t('Student Portal')}</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-6">
                  {t('View customized curricula, monitor active homework completions, check class schedules, and simulate communication using active support channels.')}
                </p>
              </div>
              <button
                onClick={() => {
                  if (!isLoggedIn) onNavigate('login', 'student');
                  else if (activeRole === 'student') onNavigate('student');
                }}
                className={`w-full py-2.5 px-4 bg-emerald-600/10 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/30 font-medium text-xs rounded-xl transition-all mt-auto flex items-center justify-center gap-1 cursor-pointer hover:scale-[1.02] active:scale-[0.98] btn-shine-effect btn-ripple ${isLoggedIn && activeRole !== 'student' ? 'opacity-50 cursor-not-allowed hover:bg-emerald-600/10 hover:text-emerald-300' : ''}`}
                disabled={isLoggedIn && activeRole !== 'student'}
              >
                {isLoggedIn && activeRole === 'student' ? t('Go to Dashboard') : t('Access Learning Board')} <ArrowUpRight className="h-3 w-3" />
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Courses Section with Animated Cards */}
      <section className="bg-slate-950/65 py-24 border-b border-slate-900" id="courses">
        <div className="w-full px-4 sm:px-8 lg:px-12">
          <div className="text-center mb-16">
            <span className="text-xs font-semibold text-indigo-400 uppercase tracking-widest block mb-2 animate-pulse">
              {t('Curated Syllabus Programs')}
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-4">
              {t('Academic Courses Provided')}
            </h2>
            <p className="text-slate-400 max-w-lg mx-auto text-sm">
              {t('Discover our advanced, tutor-led honors courses. Click to start learning or view course specifics instantly.')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {coursesList.map((course, idx) => (
              <motion.div
                key={idx}
                className={`bg-slate-900/60 rounded-3xl p-6 border ${course.theme.border} ${course.theme.hoverBorder} transition-all flex flex-col justify-between relative overflow-hidden group cursor-pointer transform-style-3d`}
                onMouseMove={handleMouseMove3D}
                onMouseLeave={handleMouseLeave3D}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 100, delay: idx * 0.1 }}
              >
                {/* Accent Background Glow */}
                <div className={`absolute top-0 right-0 w-24 h-24 rounded-full blur-3xl opacity-10 pointer-events-none ${course.theme.glow}`} />

                <div>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${course.theme.bg} ${course.theme.text} border ${course.theme.border}`}>
                    {course.icon}
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${course.theme.bg} ${course.theme.text} px-2 py-0.5 rounded-md inline-block mb-3`}>
                    {course.grade}
                  </span>
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-indigo-300 transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-slate-450 text-xs leading-relaxed mb-6">
                    {course.desc}
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center text-[10px] text-slate-500 font-semibold border-t border-slate-850 pt-4">
                    <span>{t('Instructed by:')}</span>
                    <span className="text-slate-300">{course.tutor}</span>
                  </div>
                  <button
                    onClick={() => onNavigate('login')}
                    className={`w-full py-2.5 px-4 ${course.theme.btnBg} border ${course.theme.btnBorder} font-semibold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer hover:scale-[1.02] active:scale-[0.98] btn-shine-effect btn-ripple`}
                  >
                    {t('Enroll Now')} <ArrowUpRight className="h-3 w-3" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Unified Features Bento Grid Section */}
      <section className="py-20 w-full px-4 sm:px-8 lg:px-12" id="features">
        <div className="mb-12 text-left md:text-center">
          <span className="text-xs font-semibold text-indigo-400 uppercase tracking-widest block mb-2">
            {t('CRM Core Capabilities')}
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            {t('Engineered for Academic Precision and Operations')}
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main feature highlight spanning 2 columns */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-8 rounded-3xl flex flex-col justify-between relative overflow-hidden">
            <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none">
              <PlusSquare className="h-64 w-64 text-indigo-400 translate-x-12 translate-y-12" />
            </div>
            <div>
              <span className="text-xs text-indigo-400 font-bold bg-indigo-500/10 px-2.5 py-1 rounded-md mb-6 inline-block">
                {t('Comprehensive Accounting')}
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">
                {t('Seamless Payment Linkages for Outstanding Dues')}
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed max-w-lg mb-6">
                {t('Say goodbye to complicated tuition billing. Administrators issue itemized billing ledgers while parents receive real-time notifications to complete secure payment gateways instantly inside the dashboard.')}
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <CheckCircle className="h-5 w-5 text-emerald-500 mb-2" />
                <span className="text-slate-200 text-sm font-semibold block">{t('Itemized Billing')}</span>
                <span className="text-xs text-slate-500">{t('Automated invoices')}</span>
              </div>
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <CheckCircle className="h-5 w-5 text-emerald-500 mb-2" />
                <span className="text-slate-200 text-sm font-semibold block">{t('Direct Remittance')}</span>
                <span className="text-xs text-slate-500 border-none">{t('Real-time status transitions')}</span>
              </div>
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <CheckCircle className="h-5 w-5 text-emerald-500 mb-2" />
                <span className="text-slate-200 text-sm font-semibold block">{t('Declined Card Logs')}</span>
                <span className="text-xs text-slate-500">{t('Admin audit trail')}</span>
              </div>
            </div>
          </div>

          {/* Feature 2: High fidelity charts */}
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl flex flex-col justify-between">
            <div>
              <span className="text-xs text-teal-400 font-bold bg-teal-500/10 px-2.5 py-1 rounded-md mb-6 inline-block">
                {t('Advanced Visualization')}
              </span>
              <h3 className="text-xl font-bold text-white mb-3">{t('Interactive Growth Metrics')}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                {t('Generate responsive enrollment visualizations dynamically. Admins can view seasonal registration statistics and budget statuses immediately under animated, vector SVG graphs.')}
              </p>
            </div>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 mt-6 flex items-center justify-center h-28">
              {/* Minimalist preview of custom SVG charts */}
              <div className="flex items-end gap-3 h-16 w-full px-4">
                <div className="w-full bg-slate-800 rounded-t h-1/3"></div>
                <div className="w-full bg-slate-800 rounded-t h-1/2"></div>
                <div className="w-full bg-indigo-500 rounded-t h-4/5 animate-pulse"></div>
                <div className="w-full bg-slate-800 rounded-t h-2/3"></div>
                <div className="w-full bg-teal-500 rounded-t h-full"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="bg-slate-900/40 border-y border-slate-900 py-16" id="stats">
        <div className="w-full px-4 sm:px-8 lg:px-12 text-center">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <span className="block text-4xl font-extrabold text-white tracking-tight">1,250+</span>
              <span className="mt-1.5 block text-sm text-slate-500">{t('Enrolled Students')}</span>
            </div>
            <div>
              <span className="block text-4xl font-extrabold text-white tracking-tight">99.4%</span>
              <span className="mt-1.5 block text-sm text-slate-500">{t('Attendance Rate')}</span>
            </div>
            <div>
              <span className="block text-4xl font-extrabold text-white tracking-tight">140+</span>
              <span className="mt-1.5 block text-sm text-slate-500">{t('Certified Educators')}</span>
            </div>
            <div>
              <span className="block text-4xl font-extrabold text-white tracking-tight">12 sec</span>
              <span className="mt-1.5 block text-sm text-slate-500">{t('Parent Link Verification')}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Contact & Appointment Section */}
      <section className="relative py-24 border-b border-slate-900 overflow-hidden" id="contact">
        {/* Decorative background glows */}
        <div className="absolute bottom-0 right-1/4 translate-y-1/2 w-[400px] h-[400px] rounded-full bg-indigo-600/5 blur-[120px] pointer-events-none" />
        <div className="absolute top-1/4 left-1/4 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-teal-500/5 blur-[120px] pointer-events-none" />

        <div className="w-full px-4 sm:px-8 lg:px-12 relative z-10">
          <div className="text-center mb-16">
            <span className="text-xs font-semibold text-indigo-400 uppercase tracking-widest block mb-2 animate-pulse">
              {t('Get in Touch')}
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-4">
              {t('Connect with Admissions & Support')}
            </h2>
            <p className="text-slate-400 max-w-lg mx-auto text-sm">
              {t('Have questions about enrollment, billing, or features? Book a call appointment or send us a message directly.')}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch max-w-6xl mx-auto">
            {/* Left Column: Direct Call Showcase & Info */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-8">
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-white tracking-tight">
                  {t('Admissions Office')}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {t('Our team is here to assist with multi-role configurations, school system integrations, and quick demonstration clearance.')}
                </p>
              </div>

              <div className="space-y-4">
                {/* Phone Card */}
                <a 
                  href="tel:+18005558886"
                  className="group block bg-slate-900/60 p-5 rounded-2xl border border-slate-800 hover:border-indigo-500/40 transition-all duration-305"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-600/10 text-indigo-400 rounded-xl flex items-center justify-center border border-indigo-500/20 group-hover:scale-[1.05] transition-transform">
                      <Phone className="h-5.5 w-5.5" />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">{t('Direct Phone Line')}</span>
                      <span className="text-sm font-bold text-white block mt-0.5 group-hover:text-indigo-300 transition-colors">+1 (800) 555-TUTOR</span>
                      <span className="text-[11px] text-emerald-400 block mt-0.5 font-medium">{t('Click to Call Now')}</span>
                    </div>
                  </div>
                </a>

                {/* Email Card */}
                <a 
                  href="mailto:admissions@edumanage.com"
                  className="group block bg-slate-900/60 p-5 rounded-2xl border border-slate-800 hover:border-teal-500/40 transition-all duration-305"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-teal-500/10 text-teal-400 rounded-xl flex items-center justify-center border border-teal-500/20 group-hover:scale-[1.05] transition-transform">
                      <Mail className="h-5.5 w-5.5" />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">{t('Admissions Email')}</span>
                      <span className="text-sm font-bold text-white block mt-0.5 group-hover:text-teal-300 transition-colors">admissions@edumanage.com</span>
                      <span className="text-[11px] text-teal-400 block mt-0.5 font-medium">{t('Send direct inquiry')}</span>
                    </div>
                  </div>
                </a>

                {/* Hours Card */}
                <div className="bg-slate-900/40 p-5 rounded-2xl border border-slate-850 flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-850 text-slate-400 rounded-xl flex items-center justify-center border border-slate-800">
                    <Clock className="h-5.5 w-5.5" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">{t('Office Hours')}</span>
                    <span className="text-xs text-slate-355 block mt-0.5 font-medium">Mon - Fri: 8:00 AM - 6:00 PM EST</span>
                    <span className="text-[10px] text-slate-500 block">Weekend appointment booking available online.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Tabbed Interactive Form Panel */}
            <div className="lg:col-span-7">
              <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 md:p-8 backdrop-blur-sm shadow-2xl flex flex-col h-full justify-between">
                <div>
                  {/* Tab Selector */}
                  <div className="flex bg-slate-950 p-1.5 rounded-xl border border-slate-850 mb-8">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveContactTab('message');
                        setContactSuccessMessage(null);
                      }}
                      className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                        activeContactTab === 'message'
                          ? 'bg-indigo-600 text-white shadow-md'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {t('Send a Message')}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveContactTab('book');
                        setContactSuccessMessage(null);
                      }}
                      className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                        activeContactTab === 'book'
                          ? 'bg-indigo-600 text-white shadow-md'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {t('Book Call Appointment')}
                    </button>
                  </div>

                  {/* Status Banner */}
                  {contactSuccessMessage && (
                    <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl text-xs flex items-center gap-2.5 animate-fade-in">
                      <CheckCircle className="h-5 w-5 shrink-0" />
                      <span>{contactSuccessMessage}</span>
                    </div>
                  )}

                  {/* Tab 1: Send Message Form */}
                  {activeContactTab === 'message' && (
                    <form onSubmit={handleMessageSubmit} className="space-y-5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">{t('Full Name')}</label>
                          <input
                            type="text"
                            name="name"
                            required
                            value={messageForm.name}
                            onChange={handleMessageChange}
                            placeholder={t('eg. Sarah Jenkins')}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/30 transition-all font-medium"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">{t('Email Address')}</label>
                          <input
                            type="email"
                            name="email"
                            required
                            value={messageForm.email}
                            onChange={handleMessageChange}
                            placeholder="sarah@example.com"
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/30 transition-all font-medium"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">{t('Message')}</label>
                        <textarea
                          name="message"
                          required
                          rows={4}
                          value={messageForm.message}
                          onChange={handleMessageChange}
                          placeholder={t('How can we help your learning systems?')}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/30 transition-all font-medium resize-none"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmittingContact}
                        className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-750 text-white font-bold text-xs rounded-xl shadow-lg hover:shadow-indigo-650/30 transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer btn-ripple disabled:cursor-not-allowed"
                      >
                        {isSubmittingContact ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            {t('Sending Message...')}
                          </>
                        ) : (
                          <>
                            <Mail className="h-4 w-4" />
                            {t('Send Message')}
                          </>
                        )}
                      </button>
                    </form>
                  )}

                  {/* Tab 2: Book Appointment Scheduler */}
                  {activeContactTab === 'book' && (
                    <form onSubmit={handleBookingSubmit} className="space-y-5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">{t('Full Name')}</label>
                          <input
                            type="text"
                            name="name"
                            required
                            value={bookingForm.name}
                            onChange={handleBookingChange}
                            placeholder={t('eg. Sarah Jenkins')}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/30 transition-all font-medium"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">{t('Email Address')}</label>
                          <input
                            type="email"
                            name="email"
                            required
                            value={bookingForm.email}
                            onChange={handleBookingChange}
                            placeholder="sarah@example.com"
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/30 transition-all font-medium"
                          />
                        </div>
                      </div>

                      {/* Phone Input with Country Code Selector */}
                      <div>
                        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                          {t('Phone Number')}
                        </label>
                        <div className="flex gap-3">
                          {/* Country Code Dropdown */}
                          <select
                            name="phoneCode"
                            required
                            value={bookingForm.phoneCode}
                            onChange={handleBookingChange}
                            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-3 text-xs text-white focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/30 transition-all font-medium w-28 [color-scheme:dark]"
                          >
                            <option value="+1">🇺🇸 +1</option>
                            <option value="+91">🇮🇳 +91</option>
                            <option value="+44">🇬🇧 +44</option>
                            <option value="+61">🇦🇺 +61</option>
                            <option value="+81">🇯🇵 +81</option>
                            <option value="+49">🇩🇪 +49</option>
                            <option value="+33">🇫🇷 +33</option>
                            <option value="+86">🇨🇳 +86</option>
                          </select>
                          {/* Phone Number Text Input */}
                          <input
                            type="tel"
                            name="phoneNumber"
                            required
                            value={bookingForm.phoneNumber}
                            onChange={handleBookingChange}
                            placeholder={t('Enter your mobile number')}
                            pattern="[0-9]{5,15}"
                            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/30 transition-all font-medium"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">{t('Select Date')}</label>
                          <input
                            type="date"
                            name="date"
                            required
                            value={bookingForm.date}
                            onChange={handleBookingChange}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/30 transition-all font-medium [color-scheme:dark]"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">{t('Select Time Window')}</label>
                          <select
                            name="time"
                            required
                            value={bookingForm.time}
                            onChange={handleBookingChange}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/30 transition-all font-medium [color-scheme:dark]"
                          >
                            <option value="">-- {t('Select Time')} --</option>
                            <option value="09:00">09:00 AM - 10:00 AM</option>
                            <option value="11:00">11:00 AM - 12:00 PM</option>
                            <option value="14:00">02:00 PM - 03:00 PM</option>
                            <option value="16:00">04:00 PM - 05:00 PM</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">{t('Inquiry Topic')}</label>
                        <select
                          name="topic"
                          value={bookingForm.topic}
                          onChange={handleBookingChange}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/30 transition-all font-medium [color-scheme:dark]"
                        >
                          <option value="general">{t('General School CRM Setup')}</option>
                          <option value="billing">{t('Billing & Payments Systems')}</option>
                          <option value="teachers">{t('Tutor Portal Training')}</option>
                          <option value="students">{t('Parent-Student Portal Linkage')}</option>
                        </select>
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmittingContact}
                        className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-750 text-white font-bold text-xs rounded-xl shadow-lg hover:shadow-indigo-650/30 transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer btn-ripple disabled:cursor-not-allowed"
                      >
                        {isSubmittingContact ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            {t('Booking Appointment...')}
                          </>
                        ) : (
                          <>
                            <Calendar className="h-4 w-4" />
                            {t('Book Appointment')}
                          </>
                        )}
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 py-12 border-t border-slate-900">
        <div className="w-full px-4 sm:px-8 lg:px-12 text-center md:flex md:items-center md:justify-between text-xs text-slate-500">
          <div className="flex items-center justify-center gap-2 mb-4 md:mb-0">
            <GraduationCap className="h-5 w-5 text-indigo-500" />
            <span className="text-slate-300 font-bold">{t('EduManage Academic Group LTD')}</span>
          </div>
          <div>
            <span>&copy; {new Date().getFullYear()} {t('EduManage CRM. Built for Next-Generation Learning Organizations. All rights reserved.')}</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
