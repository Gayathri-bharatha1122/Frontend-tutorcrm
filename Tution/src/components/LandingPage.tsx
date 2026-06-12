import { motion } from 'motion/react';
import { 
  Sparkles, 
  Play, 
  TrendingUp, 
  Search, 
  BarChart3, 
  CreditCard, 
  ArrowRight, 
  CheckCircle2, 
  Globe, 
  Share2, 
  Mail, 
  Phone, 
  MapPin, 
  GraduationCap 
} from 'lucide-react';

interface LandingPageProps {
  onLogin: () => void;
}

export default function LandingPage({ onLogin }: LandingPageProps) {
  // Smooth scroll helper for anchors
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-slate-50 text-gray-900 selection:bg-blue-100 min-h-screen overflow-x-hidden font-sans">
      
      {/* Outer Glows / Atmospheric decoration */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-150 rounded-full blur-[120px] opacity-20 pointer-events-none"></div>
      <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-indigo-150 rounded-full blur-[140px] opacity-25 pointer-events-none"></div>

      {/* Header / Top Navbar */}
      <header className="flex justify-between items-center h-20 px-8 w-full sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-150 shadow-sm">
        <div className="flex items-center gap-2">
          <GraduationCap className="h-8 w-8 text-blue-900" />
          <h1 className="font-sans font-black text-2xl text-gray-900 tracking-tight">
            EduManage <span className="text-blue-700">CRM</span>
          </h1>
        </div>
        
        <nav className="hidden md:flex items-center gap-8">
          <button 
            onClick={() => scrollToSection('features')}
            className="font-semibold text-sm text-gray-600 hover:text-blue-900 transition-colors"
          >
            Features
          </button>
          <button 
            onClick={() => scrollToSection('about')}
            className="font-semibold text-sm text-gray-600 hover:text-blue-900 transition-colors"
          >
            About Us
          </button>
          <button 
            onClick={() => scrollToSection('contact')}
            className="font-semibold text-sm text-gray-600 hover:text-blue-900 transition-colors"
          >
            Contact
          </button>
        </nav>

        <div className="flex items-center gap-4">
          <button 
            onClick={onLogin}
            className="font-bold text-sm text-blue-900 px-4 py-2 hover:bg-slate-100 rounded-lg transition-all active:scale-95"
          >
            Login
          </button>
          <button 
            onClick={onLogin}
            className="font-bold text-sm bg-blue-900 text-white px-6 py-2.5 rounded-lg shadow-md hover:bg-blue-800 transition-all active:scale-95"
          >
            Get Started
          </button>
        </div>
      </header>

      <main>
        
        {/* Hero Section */}
        <section className="relative min-h-[750px] flex items-center justify-center py-16 lg:py-0">
          <div className="max-w-7xl mx-auto px-8 grid lg:grid-cols-2 gap-16 items-center relative z-10 w-full">
            
            {/* Left Hero side */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 px-4 py-1.5 rounded-full shadow-sm">
                <Sparkles className="h-4 w-4 text-blue-800" />
                <span className="font-semibold text-xs text-blue-800 uppercase tracking-widest">Education Elevated</span>
              </div>
              
              <h2 className="font-sans font-black text-5xl lg:text-6xl leading-[1.1] text-gray-900 tracking-tight">
                Empowering Education through <span className="text-blue-800 relative inline-block">Intelligent Management</span>
              </h2>
              
              <p className="text-gray-500 font-sans text-lg lg:text-xl leading-relaxed max-w-xl">
                Streamline your tutoring business with a CRM built for administrators. Manage students, automate billing, and analyze performance in one unified platform.
              </p>
              
              <div className="flex flex-wrap gap-4 pt-4">
                <button 
                  onClick={onLogin}
                  className="px-8 py-4 bg-blue-900 text-white rounded-xl font-bold hover:shadow-lg hover:-translate-y-0.5 transition-all"
                >
                  Start Free Trial
                </button>
                <button 
                  onClick={onLogin}
                  className="px-8 py-4 flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-850 rounded-xl font-bold transition-all"
                >
                  <Play className="h-4 w-4 fill-current text-gray-800" />
                  <span>Watch Demo</span>
                </button>
              </div>
            </motion.div>

            {/* Right Hero Side featuring laptop image */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="relative hidden lg:block"
            >
              <div className="absolute -top-16 -right-16 w-80 h-80 bg-blue-100 rounded-full blur-3xl opacity-50 animate-pulse"></div>
              <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-indigo-100 rounded-full blur-3xl opacity-40 animate-pulse"></div>
              
              <img 
                alt="EduManage CRM Dashboard Preview" 
                className="rounded-2xl shadow-2xl border border-gray-200 relative z-10 w-full object-cover aspect-[4/3] transform hover:scale-[1.01] transition-transform duration-300"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuB2xi_i0OBKnqFvYaXwvjgzuQ0HK6C-rTC8_dkEoSuWiHLfJVvpuFNBOPEQ3wejRa0vgxfMRg13zWMgQNSfNpE2UN4WX9mI0yIc8DAJRUscbR7IzehtySzg_SmHtrdwyv3bwE50WqrpjTFwEDp0RE7CFInxpdJefTrC0jt0WJDM9BvLO5Bv1HqE-jT8xqQrdymU1gAjJulrJz2ZenALCMQz8qk_Oa7QCMT1mVNEb6IMUBPB9i4p59sQPyl7fWpGNgUXdFB0odxPuSXi"
              />
              
              {/* Floating Data Card */}
              <motion.div 
                animate={{ y: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="absolute bottom-12 -left-8 bg-white/95 backdrop-blur border border-gray-200/50 p-5 rounded-xl shadow-xl z-20"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                    <TrendingUp className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Growth Rate</p>
                    <p className="text-2xl font-black text-gray-900">+24.8%</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>

          </div>
        </section>

        {/* Features Bento Grid */}
        <section className="py-24 bg-gray-100 border-y border-gray-200" id="features">
          <div className="max-w-7xl mx-auto px-8">
            
            <div className="text-center mb-16 max-w-2xl mx-auto space-y-2">
              <h3 className="font-sans font-extrabold text-4xl text-gray-900 tracking-tight">
                Powerful Tools for Academic Success
              </h3>
              <p className="text-gray-500 font-sans text-md leading-relaxed">
                Everything you need to scale your learning center efficiently.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              
              {/* Large Feature: Student Tracking */}
              <motion.div 
                whileHover={{ y: -4 }}
                className="md:col-span-8 bg-white rounded-2xl p-8 shadow-sm border border-gray-150 flex flex-col justify-between overflow-hidden group hover:shadow-md transition-all duration-300"
              >
                <div className="max-w-md">
                  <div className="w-12 h-12 bg-blue-50 border border-blue-100 rounded-lg flex items-center justify-center text-blue-900 mb-4">
                    <Search className="h-6 w-6" />
                  </div>
                  <h4 className="font-sans font-bold text-xl text-gray-900 mb-2">Comprehensive Student Tracking</h4>
                  <p className="text-gray-500 font-sans text-sm leading-relaxed">
                    Monitor attendance, progress reports, and learning milestones with granular detail. Keep parents informed with automated updates.
                  </p>
                </div>
                <div className="mt-8 relative h-48 lg:h-52 rounded-xl overflow-hidden shadow-inner border border-gray-100">
                  <img 
                    alt="Students learning in library" 
                    className="object-cover w-full h-full lg:translate-y-4 group-hover:translate-y-2 transition-transform duration-500"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAqgTP7BCv_GG4zfvDrSYMofZwBdCfj2kHc_DBNZYbBS8PbQ-bkow4aucSqzg_E_JG3fAfZpKasuYVxdybAHndeDkGB7LtmVgX5d4KOC2_OYhZjKEZepAk5ByycV2B4rO4gRfjyd4rk0jb-HOMe2Urn7GouSo1BlHsrrIXDkfvmyuVzRZ-TLykMBpzr7vumwnHjB6PhLiyIZ_4iWbmJQAUx5hzZ2Fp6qB9hwTFJ8bK3_u2fvbGx7bPuNvYuGrSOUsge16OQHutCrUrR"
                  />
                </div>
              </motion.div>

              {/* Small Feature: Performance Analytics */}
              <motion.div 
                whileHover={{ y: -4 }}
                className="md:col-span-4 bg-blue-900 text-white rounded-2xl p-8 shadow-lg flex flex-col justify-between relative overflow-hidden transition-all duration-300"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-850 rounded-full blur-2xl opacity-50"></div>
                <div>
                  <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center text-white mb-6">
                    <BarChart3 className="h-6 w-6" />
                  </div>
                  <h4 className="font-sans font-bold text-xl mb-2">Performance Analytics</h4>
                  <p className="text-blue-100 font-sans text-xs leading-relaxed">
                    Leverage data to identify learning gaps and optimize tutor allocation for maximum student growth.
                  </p>
                </div>
                <div className="mt-8 border-t border-white/10 pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-blue-200">Efficiency Score</span>
                    <span className="text-xs font-bold text-white">92%</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div className="bg-white h-2 rounded-full transition-all duration-1000" style={{ width: '92%' }}></div>
                  </div>
                </div>
              </motion.div>

              {/* Small Feature: Fee Management */}
              <motion.div 
                whileHover={{ y: -4 }}
                className="md:col-span-4 bg-white rounded-2xl p-8 shadow-sm border border-gray-150 flex flex-col justify-between hover:border-blue-900 transition-all duration-300 cursor-pointer"
                onClick={onLogin}
              >
                <div>
                  <div className="w-12 h-12 bg-blue-50 border border-blue-100 rounded-lg flex items-center justify-center text-blue-700 mb-4">
                    <CreditCard className="h-6 w-6" />
                  </div>
                  <h4 className="font-sans font-bold text-xl text-gray-900 mb-2">Fee Management</h4>
                  <p className="text-gray-500 font-sans text-sm leading-relaxed">
                    Automated invoicing, payment tracking, and multi-currency support to simplify your financial operations.
                  </p>
                </div>
                <div className="mt-6 flex items-center gap-1.5 text-blue-900 text-xs font-bold group">
                  <span>Explore Billing</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>

              {/* Medium Feature: Smart Scheduling */}
              <motion.div 
                whileHover={{ y: -4 }}
                className="md:col-span-8 bg-gray-50 rounded-2xl p-8 border border-gray-200 overflow-hidden relative group transition-all duration-300"
              >
                <div className="grid lg:grid-cols-2 gap-8 items-center h-full">
                  <div className="space-y-4">
                    <h4 className="font-sans font-bold text-xl text-gray-900">Smart Scheduling</h4>
                    <p className="text-gray-500 font-sans text-sm leading-relaxed">
                      AI-powered calendar management that avoids conflicts and maximizes tutor utilization rates.
                    </p>
                    <button 
                      onClick={onLogin}
                      className="font-bold text-xs text-blue-900 inline-flex items-center gap-1 hover:gap-2 transition-all"
                    >
                      <span>Explore Calendar</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                  
                  {/* Miniature schedule panel */}
                  <div className="bg-white rounded-xl shadow-md p-5 space-y-3.5 border border-gray-100 relative z-10">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-900 flex items-center justify-center text-xs font-bold shadow-inner">JD</div>
                      <div className="flex-1">
                        <div className="h-1.5 w-24 bg-gray-200 rounded"></div>
                        <div className="h-1 w-12 bg-gray-150 rounded mt-1.5"></div>
                      </div>
                      <div className="px-2 py-1 bg-green-50 rounded font-semibold text-[10px] text-green-700">Completed</div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50/50 rounded-lg">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-900 flex items-center justify-center text-xs font-bold shadow-inner">MS</div>
                      <div className="flex-1">
                        <div className="h-1.5 w-20 bg-gray-200 rounded"></div>
                        <div className="h-1 w-16 bg-gray-150 rounded mt-1.5"></div>
                      </div>
                      <div className="px-2 py-1 bg-amber-50 rounded font-semibold text-[10px] text-amber-700">In Progress</div>
                    </div>
                  </div>
                </div>
              </motion.div>

            </div>
          </div>
        </section>

        {/* About Us Section */}
        <section className="py-24" id="about">
          <div className="max-w-7xl mx-auto px-8 grid lg:grid-cols-2 gap-16 items-center">
            
            {/* Left side: portrait + count badge */}
            <div className="relative">
              <img 
                alt="About EduManage admin specialist" 
                className="rounded-3xl shadow-xl aspect-square object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBJ_GENLje6d4de6vvndh0zOiA9tiCavJoub3uDo6rdvzo2D72zx6HEkbVcNq96dFAhUz7h0nawpnI6x9irN6tHXcxF-bO0nzpteaSRlVIXw3dDzToTAdNuYDrvJJ-6VAlYkAP-czWa1qAUTzM5WfjbluPm4Elwp-ClSjhXbjynttxvhaBY72ES44Dj1VAuv_Lw_QrU7W4iWcoGzN7khqiLrTtZV96RNbUqgjleJNB2J2J_l-qE0-NtkxacspSdfoy6he-Z8fp9d7KY"
              />
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                className="absolute -bottom-6 -right-6 bg-blue-900 text-white p-6 rounded-2xl shadow-xl max-w-xs"
              >
                <p className="font-sans font-black text-4xl mb-1">10+</p>
                <p className="text-xs text-blue-100 font-sans leading-relaxed">Years of expertise in educational technology and school administration.</p>
              </motion.div>
            </div>

            {/* Right side: content */}
            <div className="space-y-6">
              <h3 className="font-sans font-extrabold text-3xl text-gray-900 tracking-tight">
                Built by Educators, for Administrators
              </h3>
              
              <p className="text-gray-500 font-sans text-md leading-relaxed">
                EduManage CRM was born out of a simple observation: learning centers were drowning in spreadsheets while trying to focus on teaching.
              </p>
              
              <p className="text-gray-500 font-sans text-sm leading-relaxed">
                Our mission is to provide the infrastructure that lets educators focus on what they do best—inspiring students. We combine operational efficiency with human-centric design to create a CRM that feels like a natural extension of your team.
              </p>

              <ul className="space-y-4 pt-2">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-blue-900 mt-0.5 flex-shrink-0" />
                  <span className="font-medium text-sm text-gray-800">Data security compliant with international standards</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-blue-900 mt-0.5 flex-shrink-0" />
                  <span className="font-medium text-sm text-gray-800">24/7 Dedicated administrative and onboarding support</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-blue-900 mt-0.5 flex-shrink-0" />
                  <span className="font-medium text-sm text-gray-800">Continuous updates based directly on educator feedback</span>
                </li>
              </ul>
            </div>

          </div>
        </section>

        {/* Call to Action Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-8">
            <div className="bg-gradient-to-tr from-blue-900 to-indigo-900 text-white rounded-[2rem] py-16 px-8 text-center relative overflow-hidden shadow-2xl">
              
              {/* Glowing circles */}
              <div className="absolute -top-1/2 -left-1/4 w-full h-full bg-blue-800/25 rounded-full blur-[100px]"></div>
              <div className="absolute -bottom-1/2 -right-1/4 w-full h-full bg-purple-800/15 rounded-full blur-[100px]"></div>
              
              <div className="relative z-10 max-w-2xl mx-auto space-y-6">
                <h3 className="font-sans font-black text-4xl tracking-tight">Ready to Transform Your Center?</h3>
                <p className="text-blue-100 font-sans text-md leading-relaxed">
                  Join over 500+ tutoring centers globally that trust EduManage to power their daily student operations and tuition payments.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                  <button 
                    onClick={onLogin}
                    className="bg-white text-blue-900 px-8 py-3.5 rounded-xl font-bold font-sans hover:shadow-xl hover:-translate-y-0.5 transition-all text-sm"
                  >
                    Get Started Now
                  </button>
                  <button 
                    onClick={onLogin}
                    className="border-2 border-white/30 hover:border-white/50 text-white px-8 py-3.5 rounded-xl font-bold font-sans hover:bg-white/10 transition-all text-sm"
                  >
                    Book a Personalized Demo
                  </button>
                </div>
              </div>

            </div>
          </div>
        </section>

      </main>

      {/* Footer Navigation section */}
      <footer className="bg-slate-900 text-slate-300 pt-20 pb-10" id="contact">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            
            {/* Branding Column */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <GraduationCap className="h-7 w-7 text-blue-400" />
                <h5 className="font-sans font-black text-white text-lg tracking-tight">EduManage</h5>
              </div>
              <p className="text-slate-400 font-sans text-xs leading-relaxed max-w-xs">
                The definitive CRM solution for modern education centers, private tutor networks, and specialized academies.
              </p>
              <div className="flex gap-4 pt-2">
                <a className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center hover:bg-blue-900 transition-colors" href="#">
                  <Globe className="h-4 w-4 text-slate-300" />
                </a>
                <a className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center hover:bg-blue-900 transition-colors" href="#">
                  <Share2 className="h-4 w-4 text-slate-300" />
                </a>
              </div>
            </div>

            {/* Products Column */}
            <div>
              <h6 className="font-bold text-xs text-white uppercase tracking-wider mb-6">Product</h6>
              <ul className="space-y-3 text-slate-400 font-sans text-sm">
                <li><a className="hover:text-blue-400 transition-colors" href="#features">Features</a></li>
                <li><a className="hover:text-blue-400 transition-colors" href="#">Pricing Plans</a></li>
                <li><a className="hover:text-blue-400 transition-colors" href="#">Enterprise Specs</a></li>
                <li><a className="hover:text-blue-400 transition-colors" href="#">Data Security</a></li>
              </ul>
            </div>

            {/* Company Column */}
            <div>
              <h6 className="font-bold text-xs text-white uppercase tracking-wider mb-6">Company</h6>
              <ul className="space-y-3 text-slate-400 font-sans text-sm">
                <li><a className="hover:text-blue-400 transition-colors" href="#about">About Us</a></li>
                <li><a className="hover:text-blue-400 transition-colors" href="#">Case Studies</a></li>
                <li><a className="hover:text-blue-400 transition-colors" href="#">Help Desk</a></li>
                <li><a className="hover:text-blue-400 transition-colors" href="#">Terms of Service</a></li>
              </ul>
            </div>

            {/* Contacts Column */}
            <div>
              <h6 className="font-bold text-xs text-white uppercase tracking-wider mb-6">Contact Info</h6>
              <ul className="space-y-3.5 text-slate-400 font-sans text-sm">
                <li className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-blue-400 flex-shrink-0" />
                  <span>info@edumanage.com</span>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-blue-400 flex-shrink-0" />
                  <span>+1 (555) 0123-4567</span>
                </li>
                <li className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-blue-400 flex-shrink-0 mt-0.5" />
                  <span>123 Education Plaza, Tech Hub, CA 94043</span>
                </li>
              </ul>
            </div>

          </div>

          <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-slate-500">© 2026 EduManage CRM. All rights reserved.</p>
            <div className="flex gap-6 text-xs text-slate-500">
              <a className="hover:text-slate-350 transition-colors" href="#">Privacy Policy</a>
              <a className="hover:text-slate-350 transition-colors" href="#">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
