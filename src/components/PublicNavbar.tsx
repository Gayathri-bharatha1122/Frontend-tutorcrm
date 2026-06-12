import React, { useState } from 'react';
import { GraduationCap, Menu, X } from 'lucide-react';
import { Screen, Role } from '../types';
import { useLanguage } from '../LanguageContext';
import { LanguageSelector } from './LanguageSelector';

interface PublicNavbarProps {
  screen: Screen;
  onNavigate: (screen: Screen) => void;
  isLoggedIn?: boolean;
  activeRole?: Role;
}

export const PublicNavbar: React.FC<PublicNavbarProps> = ({ screen, onNavigate, isLoggedIn, activeRole }) => {
  const { t } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, anchorId: string) => {
    e.preventDefault();
    if (screen !== 'landing') {
      sessionStorage.setItem('scrollTarget', anchorId);
      onNavigate('landing');
    } else {
      const element = document.getElementById(anchorId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setIsMobileMenuOpen(false);
  };

  const handleHomeClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (screen !== 'landing') {
      onNavigate('landing');
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <header className={`transition-all duration-300 sticky top-0 z-50 border-b ${
      isScrolled 
        ? 'bg-slate-950/70 border-indigo-500/10 backdrop-blur-md shadow-[0_10px_30px_-15px_rgba(99,102,241,0.15)] py-1' 
        : 'bg-slate-950/90 border-slate-900 backdrop-blur-sm py-0'
    }`}>
      <div className="w-full px-4 sm:px-8 lg:px-12 h-16 flex items-center justify-between">
        {/* Logo and Brand */}
        <div 
          onClick={() => onNavigate('landing')}
          className="flex items-center gap-2.5 cursor-pointer hover:scale-[1.03] hover:opacity-100 active:scale-[0.97] transition-all duration-200"
        >
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 animate-pulse">
            <GraduationCap className="h-6 w-6 text-white" />
          </div>
          <div>
            <span className="font-sans font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-indigo-400 bg-clip-text text-transparent block leading-none mb-1">
              EduManage
            </span>
            <span className="text-xs block text-slate-500 font-medium leading-none">{t('Academic CRM')}</span>
          </div>
        </div>
        
        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
          <a 
            href="#" 
            onClick={(e) => handleHomeClick(e)}
            className="hover:text-slate-100 nav-link-hover py-1 transition-colors"
          >
            {t('Home')}
          </a>
          <a 
            href="#features" 
            onClick={(e) => handleNavLinkClick(e, 'features')}
            className="hover:text-slate-100 nav-link-hover py-1 transition-colors"
          >
            {t('Features')}
          </a>
          <a 
            href="#courses" 
            onClick={(e) => handleNavLinkClick(e, 'courses')}
            className="hover:text-slate-100 nav-link-hover py-1 transition-colors"
          >
            {t('Courses')}
          </a>
          <a 
            href="#ecosystem" 
            onClick={(e) => handleNavLinkClick(e, 'ecosystem')}
            className="hover:text-slate-100 nav-link-hover py-1 transition-colors"
          >
            {t('Portals')}
          </a>
          <a 
            href="#stats" 
            onClick={(e) => handleNavLinkClick(e, 'stats')}
            className="hover:text-slate-100 nav-link-hover py-1 transition-colors"
          >
            {t('Metrics')}
          </a>
          <a 
            href="#contact" 
            onClick={(e) => handleNavLinkClick(e, 'contact')}
            className="hover:text-slate-100 nav-link-hover py-1 transition-colors"
          >
            {t('Contact')}
          </a>
        </nav>

        {/* Language & Auth Actions & Mobile Menu Toggle */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:block">
            <LanguageSelector />
          </div>
          <div className="hidden sm:flex items-center gap-3">
          {!isLoggedIn ? (
            <>
              <button 
                onClick={() => onNavigate('login')}
                className={`px-4 py-2 text-sm font-medium transition-all hover:scale-[1.05] active:scale-[0.95] cursor-pointer ${
                  screen === 'login' 
                    ? 'text-indigo-400' 
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                {t('Sign In')}
              </button>
              <button 
                onClick={() => onNavigate('register')}
                className={`px-4 py-2 text-sm font-medium rounded-lg shadow-lg hover:shadow-indigo-600/30 transition-all hover:scale-[1.02] active:scale-[0.98] btn-shine-effect btn-ripple cursor-pointer ${
                  screen === 'register'
                    ? 'bg-indigo-700 text-white'
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                }`}
              >
                {t('Get Started')}
              </button>
            </>
          ) : (
            <button 
              onClick={() => {
                if (activeRole) {
                  onNavigate(activeRole);
                }
              }}
              className="px-4 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg shadow-lg hover:shadow-indigo-600/30 transition-all hover:scale-[1.02] active:scale-[0.98] btn-shine-effect btn-ripple cursor-pointer"
            >
              {t('Go to Dashboard')}
            </button>
          )}
          </div>
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 text-slate-400 hover:text-white transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-slate-950/95 border-b border-indigo-500/10 backdrop-blur-xl shadow-2xl z-40 py-4 px-4 flex flex-col gap-4">
          <nav className="flex flex-col gap-4 text-sm font-medium text-slate-300">
            <a href="#" onClick={(e) => handleHomeClick(e)} className="hover:text-white transition-colors">{t('Home')}</a>
            <a href="#features" onClick={(e) => handleNavLinkClick(e, 'features')} className="hover:text-white transition-colors">{t('Features')}</a>
            <a href="#courses" onClick={(e) => handleNavLinkClick(e, 'courses')} className="hover:text-white transition-colors">{t('Courses')}</a>
            <a href="#ecosystem" onClick={(e) => handleNavLinkClick(e, 'ecosystem')} className="hover:text-white transition-colors">{t('Portals')}</a>
            <a href="#stats" onClick={(e) => handleNavLinkClick(e, 'stats')} className="hover:text-white transition-colors">{t('Metrics')}</a>
            <a href="#contact" onClick={(e) => handleNavLinkClick(e, 'contact')} className="hover:text-white transition-colors">{t('Contact')}</a>
          </nav>
          
          <div className="h-px bg-slate-800 w-full my-2"></div>
          
          <div className="flex items-center justify-between">
            <LanguageSelector />
          </div>
          
          <div className="flex flex-col gap-3 mt-2 sm:hidden">
            {!isLoggedIn ? (
              <>
                <button 
                  onClick={() => { onNavigate('login'); setIsMobileMenuOpen(false); }}
                  className="w-full py-2.5 border border-slate-700 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  {t('Sign In')}
                </button>
                <button 
                  onClick={() => { onNavigate('register'); setIsMobileMenuOpen(false); }}
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors"
                >
                  {t('Get Started')}
                </button>
              </>
            ) : (
              <button 
                onClick={() => {
                  if (activeRole) onNavigate(activeRole);
                  setIsMobileMenuOpen(false);
                }}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors"
              >
                {t('Go to Dashboard')}
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
