import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Globe, Check } from 'lucide-react';
import { useLanguage, Language } from '../LanguageContext';

export const LanguageSelector: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const languages: Array<{ code: Language; name: string; localName: string }> = [
    { code: 'en', name: 'English', localName: 'English' },
    { code: 'te', name: 'Telugu', localName: 'తెలుగు' },
    { code: 'hi', name: 'Hindi', localName: 'हिन्दी' }
  ];

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentLang = languages.find((l) => l.code === language) || languages[0];

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Dropdown Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-slate-900/60 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-semibold cursor-pointer transition-all shadow-md active:scale-95"
        aria-label="Select language"
      >
        <Globe className="h-4.5 w-4.5 text-indigo-400" />
        <span className="uppercase text-[11px] font-mono tracking-wider">{currentLang.code}</span>
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-40 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-1.5 z-[999] backdrop-blur-xl bg-opacity-95"
          >
            <div className="space-y-1">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setLanguage(lang.code);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-left font-medium transition-all cursor-pointer ${
                    language === lang.code
                      ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/20'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850'
                  }`}
                >
                  <div className="flex flex-col">
                    <span className="text-[11px] font-semibold text-slate-100">{lang.localName}</span>
                    <span className="text-[9px] text-slate-500 font-mono capitalize">{lang.name}</span>
                  </div>
                  {language === lang.code && <Check className="h-3.5 w-3.5 text-indigo-400" />}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
