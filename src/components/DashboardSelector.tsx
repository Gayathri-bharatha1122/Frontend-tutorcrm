import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, 
  Users, 
  User, 
  Lock, 
  Unlock, 
  ArrowRight, 
  LogOut, 
  GraduationCap,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { Role, Screen, UserProfile } from '../types';
import { useLanguage } from '../LanguageContext';

interface DashboardSelectorProps {
  currentUser: UserProfile | null;
  onNavigate: (screen: Screen) => void;
  onLogout: () => void;
}

export const DashboardSelector: React.FC<DashboardSelectorProps> = ({ 
  currentUser, 
  onNavigate, 
  onLogout 
}) => {
  const { t } = useLanguage();
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const getInitials = (name: string) => {
    if (!name) return 'U';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const userRole = currentUser?.role || 'student';

  const modules = [
    {
      id: 'admin' as Screen,
      title: t('Administrative CRM'),
      desc: t('Access audit registries, student enrollment list databases, courses, attendance reviews, and fee collection summaries.'),
      role: 'admin' as Role,
      icon: <Shield className="h-7 w-7 text-indigo-400" />,
      color: 'from-indigo-600 to-violet-600',
      glow: 'shadow-indigo-500/20',
      borderColor: 'border-indigo-500/25',
      hoverBorder: 'hover:border-indigo-500/50',
      badgeColor: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/25'
    },
    {
      id: 'tutor' as Screen,
      title: t('Tutor Workspace'),
      desc: t('View assigned classes, rosters, daily attendance rolls, assignments, performance reports, and calendar coordinates.'),
      role: 'tutor' as Role,
      icon: <Users className="h-7 w-7 text-teal-400" />,
      color: 'from-teal-600 to-cyan-600',
      glow: 'shadow-teal-500/20',
      borderColor: 'border-teal-500/25',
      hoverBorder: 'hover:border-teal-500/50',
      badgeColor: 'bg-teal-500/10 text-teal-400 border-teal-500/25'
    },
    {
      id: 'parent' as Screen,
      title: t('Parent Portal'),
      desc: t('Track student grades, child information, attendance check-ins, fee invoices ledger status, and academic bulletins.'),
      role: 'parent' as Role,
      icon: <User className="h-7 w-7 text-amber-400" />,
      color: 'from-amber-600 to-orange-600',
      glow: 'shadow-amber-500/20',
      borderColor: 'border-amber-500/25',
      hoverBorder: 'hover:border-amber-500/50',
      badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/25'
    }
  ];

  const handleModuleClick = (targetScreen: Screen, allowedRole: Role) => {
    if (userRole === allowedRole) {
      onNavigate(targetScreen);
    } else {
      setToastMessage(`${t('Access Denied')}: ${t('Your role does not have authorization to view this module.')}`);
      setTimeout(() => setToastMessage(null), 4000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col justify-between relative overflow-hidden selection:bg-indigo-500 selection:text-white">
      {/* Decorative Blur Background elements */}
      <div className="absolute top-0 left-1/4 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-indigo-600/10 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 translate-y-1/2 w-[400px] h-[400px] rounded-full bg-emerald-500/5 blur-[130px] pointer-events-none" />

      {/* Top Console Command Header */}
      <nav className="border-b border-slate-900 bg-slate-950/80 backdrop-blur sticky top-0 z-40">
        <div className="w-full px-4 sm:px-8 lg:px-12 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/25">
              <GraduationCap className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="font-sans font-bold text-base text-white tracking-tight">EduManage CRM</span>
              <span className="text-[10px] block text-slate-500 font-semibold uppercase">{t('Portal Hub')}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {currentUser && (
              <div className="flex items-center gap-3 border-r border-slate-800 pr-4">
                <div className="text-right hidden sm:block">
                  <span className="text-xs font-bold text-slate-200 block">{currentUser.name}</span>
                  <span className="text-[10px] text-indigo-400 font-mono font-bold uppercase tracking-wider">{currentUser.role}</span>
                </div>
                {currentUser.profilePhoto ? (
                  <img 
                    src={currentUser.profilePhoto} 
                    alt={currentUser.name} 
                    className="w-9 h-9 rounded-full border border-slate-800 object-cover"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
                    <span className="text-white text-xs font-extrabold tracking-wide">{getInitials(currentUser.name)}</span>
                  </div>
                )}
              </div>
            )}
            
            <button 
              onClick={onLogout}
              className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-xs text-slate-350 hover:text-white font-semibold rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
            >
              <LogOut className="h-3.5 w-3.5" />
              {t('Sign Out')}
            </button>
          </div>
        </div>
      </nav>

      {/* Main Grid Workspace */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-8 lg:px-12 py-12 flex flex-col justify-center items-center z-10 relative">
        
        {/* Toast Warning */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-20 left-0 right-0 mx-auto w-max max-w-sm z-50 bg-red-600 border border-red-500/30 rounded-2xl p-4 text-white text-xs font-semibold flex items-center gap-2.5 shadow-xl"
            >
              <AlertCircle className="h-4.5 w-4.5 text-red-200 shrink-0" />
              <span>{toastMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-900 border border-slate-850 rounded-full text-xs text-slate-400 mb-4"
          >
            <Sparkles className="h-3 w-3 text-indigo-400 animate-pulse" />
            <span>{t('Authorized Sessions Active')}</span>
          </motion.div>
          
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-3">
            {t('Tutor CRM Module Selector')}
          </h2>
          <p className="text-slate-400 text-sm max-w-md mx-auto">
            {t('Welcome back! Select an active node workspace below to access features tailored for your system clearance.')}
          </p>
        </div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-4">
          {modules.map((mod) => {
            const isAuthorized = userRole === mod.role;
            
            return (
              <motion.div
                key={mod.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 100, delay: mod.id === 'admin' ? 0.05 : mod.id === 'tutor' ? 0.1 : 0.15 }}
                whileHover={isAuthorized ? { y: -6, scale: 1.02 } : {}}
                onClick={() => handleModuleClick(mod.id, mod.role)}
                className={`bg-slate-900/60 p-6 rounded-3xl border ${mod.borderColor} ${mod.hoverBorder} transition-all duration-300 flex flex-col justify-between relative overflow-hidden group cursor-pointer ${
                  isAuthorized 
                    ? `hover:shadow-2xl hover:${mod.glow}` 
                    : 'opacity-50 cursor-not-allowed border-slate-850/50'
                }`}
              >
                {/* Visual Glow Accent */}
                {isAuthorized && (
                  <div className={`absolute top-0 right-0 w-24 h-24 rounded-full blur-3xl opacity-10 pointer-events-none bg-gradient-to-br ${mod.color}`} />
                )}

                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 bg-slate-950 border border-slate-850/80 rounded-xl flex items-center justify-center">
                      {mod.icon}
                    </div>

                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border flex items-center gap-1 ${
                      isAuthorized 
                        ? mod.badgeColor
                        : 'bg-slate-950 text-slate-500 border-slate-900'
                    }`}>
                      {isAuthorized ? (
                        <>
                          <Unlock className="h-3 w-3" />
                          {t('Authorized')}
                        </>
                      ) : (
                        <>
                          <Lock className="h-3 w-3" />
                          {t('Locked')}
                        </>
                      )}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-indigo-300 transition-colors">
                    {mod.title}
                  </h3>
                  <p className="text-slate-400 text-xs leading-relaxed mb-8">
                    {mod.desc}
                  </p>
                </div>

                <div className={`w-full py-2.5 px-4 font-semibold text-xs rounded-xl border flex items-center justify-center gap-1.5 transition-all mt-auto ${
                  isAuthorized
                    ? `bg-gradient-to-r ${mod.color} hover:brightness-110 text-white border-transparent shadow-lg shadow-indigo-600/10`
                    : 'bg-slate-950 border-slate-900 text-slate-500 cursor-not-allowed'
                }`}>
                  {isAuthorized ? t('Enter Module') : t('Insufficient clearance')}
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </motion.div>
            );
          })}
        </div>

      </main>

      {/* Footer */}
      <footer className="bg-slate-950 py-8 border-t border-slate-900 z-10 relative">
        <div className="max-w-6xl mx-auto px-4 text-center text-xs text-slate-500">
          <span>&copy; {new Date().getFullYear()} EduManage CRM. All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
};
