import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  Users, 
  GraduationCap, 
  Shield, 
  User, 
  Book, 
  IndianRupee, 
  FileText, 
  Settings, 
  Calendar, 
  CheckSquare, 
  TrendingUp, 
  Bell, 
  Award, 
  BookOpen, 
  LogOut,
  Menu,
  X,
  ChevronRight
} from 'lucide-react';
import { Role } from '../types';
import { useLanguage } from '../LanguageContext';

interface SidebarProps {
  activeRole: Role;
  userName: string;
  currentPath: string;
  onNavigate: (path: string) => void;
  onLogout: () => void;
}

interface MenuItem {
  name: string;
  path: string;
  icon: React.ReactNode;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeRole,
  userName,
  currentPath,
  onNavigate,
  onLogout
}) => {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  // Role details config
  const roleConfig = {
    admin: {
      themeColor: 'from-indigo-600 to-violet-600 bg-indigo-500/10 text-indigo-400 border-indigo-500/20 shadow-indigo-500/10',
      badge: 'Admin',
      icon: <Shield className="h-4 w-4 text-indigo-400" />
    },
    tutor: {
      themeColor: 'from-teal-600 to-cyan-600 bg-teal-500/10 text-teal-400 border-teal-500/20 shadow-teal-500/10',
      badge: 'Faculty',
      icon: <Users className="h-4 w-4 text-teal-400" />
    },
    parent: {
      themeColor: 'from-amber-600 to-orange-600 bg-amber-500/10 text-amber-400 border-amber-500/20 shadow-amber-500/10',
      badge: 'Guardian',
      icon: <User className="h-4 w-4 text-amber-400" />
    },
    student: {
      themeColor: 'from-emerald-600 to-teal-600 bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-emerald-500/10',
      badge: 'Student',
      icon: <GraduationCap className="h-4 w-4 text-emerald-400" />
    }
  };

  const getInitials = (name: string) => {
    if (!name) return 'U';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const currentRoleConfig = roleConfig[activeRole];

  // Define menu structure for each role
  const menuOptions: Record<Role, MenuItem[]> = {
    admin: [
      { name: t('Dashboard'), path: '/admin/dashboard', icon: <LayoutDashboard className="h-4.5 w-4.5" /> },
      { name: t('Student Management'), path: '/admin/students', icon: <GraduationCap className="h-4.5 w-4.5" /> },
      { name: t('Tutor Management'), path: '/admin/tutors', icon: <Shield className="h-4.5 w-4.5" /> },
      { name: t('Parent Management'), path: '/admin/parents', icon: <User className="h-4.5 w-4.5" /> },
      { name: t('Courses'), path: '/admin/courses', icon: <Book className="h-4.5 w-4.5" /> },
      { name: t('Fees'), path: '/admin/fees', icon: <IndianRupee className="h-4.5 w-4.5" /> },
      { name: t('Reports'), path: '/admin/reports', icon: <FileText className="h-4.5 w-4.5" /> },
      { name: t('Settings'), path: '/admin/settings', icon: <Settings className="h-4.5 w-4.5" /> }
    ],
    tutor: [
      { name: t('Dashboard'), path: '/tutor/dashboard', icon: <LayoutDashboard className="h-4.5 w-4.5" /> },
      { name: t('My Classes'), path: '/tutor/classes', icon: <Calendar className="h-4.5 w-4.5" /> },
      { name: t('Attendance'), path: '/tutor/attendance', icon: <CheckSquare className="h-4.5 w-4.5" /> },
      { name: t('Assignments'), path: '/tutor/assignments', icon: <FileText className="h-4.5 w-4.5" /> },
      { name: t('Student Performance'), path: '/tutor/performance', icon: <TrendingUp className="h-4.5 w-4.5" /> },
      { name: t('Profile'), path: '/tutor/profile', icon: <User className="h-4.5 w-4.5" /> }
    ],
    parent: [
      { name: t('Dashboard'), path: '/parent/dashboard', icon: <LayoutDashboard className="h-4.5 w-4.5" /> },
      { name: t('Child Progress'), path: '/parent/progress', icon: <TrendingUp className="h-4.5 w-4.5" /> },
      { name: t('Attendance'), path: '/parent/attendance', icon: <Calendar className="h-4.5 w-4.5" /> },
      { name: t('Courses & Tutors'), path: '/parent/courses', icon: <GraduationCap className="h-4.5 w-4.5" /> },
      { name: t('Fees'), path: '/parent/fees', icon: <IndianRupee className="h-4.5 w-4.5" /> },
      { name: t('Notifications'), path: '/parent/notifications', icon: <Bell className="h-4.5 w-4.5" /> },
      { name: t('Profile'), path: '/parent/profile', icon: <User className="h-4.5 w-4.5" /> }
    ],
    student: [
      { name: t('Dashboard'), path: '/student/dashboard', icon: <LayoutDashboard className="h-4.5 w-4.5" /> },
      { name: t('Courses'), path: '/student/courses', icon: <BookOpen className="h-4.5 w-4.5" /> },
      { name: t('Assignments'), path: '/student/assignments', icon: <FileText className="h-4.5 w-4.5" /> },
      { name: t('Attendance'), path: '/student/attendance', icon: <Calendar className="h-4.5 w-4.5" /> },
      { name: t('Results'), path: '/student/results', icon: <Award className="h-4.5 w-4.5" /> },
      { name: t('Profile'), path: '/student/profile', icon: <User className="h-4.5 w-4.5" /> }
    ]
  };

  const activeMenu = menuOptions[activeRole];

  const handleNavClick = (path: string) => {
    onNavigate(path);
    setIsOpen(false);
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-gradient-to-b from-[#0b122c] via-[#090e24] to-[#040716] border-r border-[#1E295D]/30 text-slate-300 backdrop-blur-xl w-64 md:w-72 relative">
      {/* Branding Header */}
      <div className="flex items-center gap-3 px-6 h-20 border-b border-[#1E295D]/30">
        <div className={`w-9 h-9 rounded-xl bg-gradient-to-r ${currentRoleConfig.themeColor.split(' ')[0]} ${currentRoleConfig.themeColor.split(' ')[1]} flex items-center justify-center shadow-lg`}>
          <GraduationCap className="h-5 w-5 text-white" />
        </div>
        <div>
          <span className="font-sans font-bold text-base text-white tracking-tight">EduManage CRM</span>
          <span className="text-[10px] block text-slate-500 font-semibold uppercase tracking-wider">{t('Secure Portal')}</span>
        </div>
      </div>

      {/* Profile summary card */}
      <div className="p-5 border-b border-[#1E295D]/30">
        <div className="bg-[#121B3D]/50 rounded-2xl p-4 border border-[#1E295D]/40 flex items-center gap-3.5">
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${currentRoleConfig.themeColor.split(' ')[0]} ${currentRoleConfig.themeColor.split(' ')[1]} flex items-center justify-center shrink-0`}>
            <span className="text-white text-xs font-black tracking-wider">{getInitials(userName)}</span>
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-xs font-bold text-white block truncate leading-tight">{userName}</span>
            <div className={`px-2 py-0.5 rounded-md text-[9px] font-bold text-white w-max mt-1 flex items-center gap-1.5 bg-gradient-to-r ${currentRoleConfig.themeColor.split(' ').slice(0,2).join(' ')}`}>
              {currentRoleConfig.icon}
              {t(currentRoleConfig.badge)}
            </div>
          </div>
        </div>
      </div>

      {/* Menu Options Scroll Container */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-1.5 custom-scrollbar">
        {activeMenu.map((item) => {
          const isActive = currentPath === item.path;
          return (
            <button
              key={item.path}
              onClick={() => handleNavClick(item.path)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer group ${
                isActive 
                  ? `bg-gradient-to-r from-[#1b254b] to-[#121b3d] text-white border-l-[3.5px] ${
                      activeRole === 'admin' ? 'border-indigo-500' :
                      activeRole === 'tutor' ? 'border-teal-500' :
                      activeRole === 'parent' ? 'border-amber-500' :
                      'border-emerald-500'
                    } shadow-md shadow-slate-950/20`
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#1E295D]/20 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={`transition-transform duration-200 ${
                  isActive 
                    ? `scale-110 ${
                        activeRole === 'admin' ? 'text-indigo-400' :
                        activeRole === 'tutor' ? 'text-teal-400' :
                        activeRole === 'parent' ? 'text-amber-400' :
                        'text-emerald-400'
                      }` 
                    : 'text-slate-500 group-hover:text-slate-300'
                }`}>
                  {item.icon}
                </span>
                <span>{item.name}</span>
              </div>
              <ChevronRight className={`h-3.5 w-3.5 transition-transform duration-200 ${isActive ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0'}`} />
            </button>
          );
        })}
      </div>

      {/* Footer Sign Out */}
      <div className="p-4 border-t border-[#1E295D]/30">
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#121B3D]/30 hover:bg-rose-500/10 border border-[#1E295D]/30 hover:border-rose-500/25 text-slate-400 hover:text-rose-400 text-xs font-bold transition-all duration-200 cursor-pointer"
        >
          <LogOut className="h-4.5 w-4.5" />
          <span>{t('Sign Out Session')}</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop fixed sidebar */}
      <div className="hidden lg:block shrink-0 w-64 md:w-72 h-screen relative">
        <div className="fixed top-0 left-0 bottom-0 w-64 md:w-72 z-30">
          {sidebarContent}
        </div>
      </div>

      {/* Mobile Sidebar overlay and drawer */}
      <div className="lg:hidden">
        {/* Mobile floating header with hamburger */}
        <div className="h-16 border-b border-[#1E295D]/35 bg-[#0B122C]/90 backdrop-blur sticky top-0 z-35 flex items-center justify-between px-4 w-full">
          <div className="flex items-center gap-2.5">
            <div className={`w-8.5 h-8.5 rounded-lg bg-gradient-to-r ${currentRoleConfig.themeColor.split(' ')[0]} ${currentRoleConfig.themeColor.split(' ')[1]} flex items-center justify-center`}>
              <GraduationCap className="h-4.5 w-4.5 text-white" />
            </div>
            <span className="font-sans font-bold text-sm text-white tracking-tight">EduManage CRM</span>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-1.5 bg-[#121B3D]/65 hover:bg-[#1E295D]/50 rounded-lg text-slate-400 hover:text-white border border-[#1E295D]/30 transition cursor-pointer"
            id="mobileMenuBtn"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Drawer slideout menu drawer */}
        <AnimatePresence>
          {isOpen && (
            <>
              {/* Backdrop blur overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsOpen(false)}
                className="fixed inset-0 bg-black z-40 backdrop-blur-sm"
              />

              {/* Drawer Panel */}
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 220 }}
                className="fixed top-0 bottom-0 left-0 z-50 h-screen"
              >
                <div className="h-full relative">
                  {sidebarContent}
                  {/* Close floating button */}
                  <button
                    onClick={() => setIsOpen(false)}
                    className="absolute top-5 right-[-50px] p-2 bg-[#0B122C] border border-[#1E295D]/30 rounded-full text-slate-400 hover:text-white shadow-xl lg:hidden"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};
