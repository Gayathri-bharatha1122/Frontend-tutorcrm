import React, { useState } from 'react';
import { api } from '../services/api';
import { motion, AnimatePresence } from 'motion/react';
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  GraduationCap,
  Shield,
  Users,
  User,
  ArrowRight,
  Info,
  Sparkles,
  ArrowLeft
} from 'lucide-react';
import { Role, Screen } from '../types';
import { useLanguage } from '../LanguageContext';
import { LanguageSelector } from './LanguageSelector';

interface LoginScreenProps {
  onLoginSuccess: (role: Role, name?: string) => void;
  onNavigate: (screen: Screen) => void;
  initialRole?: Role;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess, onNavigate, initialRole = 'student' }) => {
  const { t } = useLanguage();
  const [selectedRole, setSelectedRole] = useState<Role>(initialRole);

  // Dynamic customization variables based on chosen role
  const roleConfig = {
    admin: {
      accent: 'border-indigo-500 text-indigo-400 bg-indigo-500/10',
      tagColor: 'bg-indigo-600',
      icon: <Shield className="h-4 w-4" />,
      title: 'Administrative Control Panel',
      desc: 'Access audit registries, students list databases, and revenue trends.'
    },
    tutor: {
      accent: 'border-teal-500 text-teal-400 bg-teal-500/10',
      tagColor: 'bg-teal-600',
      icon: <Users className="h-4 w-4" />,
      title: 'Tutor Workspace Portal',
      desc: 'Mark attendances, review course timetables, and compile homework grades.'
    },
    parent: {
      accent: 'border-amber-500 text-amber-400 bg-amber-500/10',
      tagColor: 'bg-amber-600',
      icon: <User className="h-4 w-4" />,
      title: 'Parent Linkage Portal',
      desc: 'Review Helena Thorne linking Marcus, check unpaid fees, and monitor announcements.'
    },
    student: {
      accent: 'border-emerald-500 text-emerald-400 bg-emerald-500/10',
      tagColor: 'bg-emerald-600',
      icon: <GraduationCap className="h-4 w-4" />,
      title: 'Student Learning CRM',
      desc: 'Track Marcus Thorne active learning curves, complete assignments, and query tools.'
    }
  };

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);
  const [typedMessage, setTypedMessage] = useState<string | null>(null);

  // Automatically update the prefilled credentials when changing roles
  React.useEffect(() => {
    setEmail('');
    setPassword('');
    setErrorStatus(null);
  }, [selectedRole]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorStatus(t('Please provide both administrative username/email and access key.'));
      return;
    }

    try {
      const response = await api.login({ email, password, role: selectedRole });
      localStorage.setItem('edumanage_token', response.token);
      setErrorStatus(null);
      onLoginSuccess(selectedRole, response.user?.name || response.user?.firstName || undefined);
    } catch (err: any) {
      setErrorStatus(err.message || 'Invalid key token or database credential mismatch.');
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-950 flex flex-col items-center justify-center px-4 relative overflow-hidden font-sans">

      {/* Decorative Glow elements */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-slate-900/40 opacity-70 blur-[100px] pointer-events-none" />

      {/* Brand logo back to landing link */}
      <div
        onClick={() => onNavigate('landing')}
        className="flex items-center gap-2.5 mb-10 cursor-pointer hover:scale-105 transition-all relative z-10"
      >
        <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center">
          <GraduationCap className="h-5 w-5 text-white" />
        </div>
        <span className="font-sans font-bold text-lg text-white tracking-tight">EduManage CRM</span>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 relative z-10 shadow-2xl"
      >
        {/* Dynamic header colored based on current selected role */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-indigo-400 tracking-wider uppercase">{t('Secure Portal Authorization')}</span>
            <div className={`px-2 py-0.5 rounded-md text-[10px] font-bold text-white ${roleConfig[selectedRole].tagColor} flex items-center gap-1`}>
              {roleConfig[selectedRole].icon}
              {selectedRole.toUpperCase()}
            </div>
          </div>
          <h2 className="text-xl font-bold text-white mb-1">{t(roleConfig[selectedRole].title)}</h2>
          <p className="text-slate-400 text-xs leading-relaxed">{t(roleConfig[selectedRole].desc)}</p>
        </div>

        {/* Role Select Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6 p-1 bg-slate-950/60 rounded-xl border border-slate-800">
          {(['student', 'parent', 'tutor', 'admin'] as Role[]).map((role) => (
            <button
              key={role}
              type="button"
              onClick={() => {
                setSelectedRole(role);
              }}
              className={`py-2 text-[11px] font-semibold rounded-lg transition-all capitalize cursor-pointer ${selectedRole === role
                  ? 'bg-slate-900 text-white shadow-md border-b-2 border-indigo-500'
                  : 'text-slate-500 hover:text-slate-300'
                }`}
            >
              {role}
            </button>
          ))}
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <div className="mb-1.5">
              <label className="block text-[11px] font-medium text-slate-400 uppercase">{t('Login Identifier')}</label>
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500 pointer-events-none">
                <Mail className="h-4 w-4" />
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrorStatus(null);
                }}
                className="w-full bg-slate-950/40 border border-slate-800 text-slate-200 text-sm pl-10 pr-4 py-2.5 rounded-xl focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all font-mono input-focus-glow"
                placeholder=""
              />
            </div>
          </div>

          <div>
            <div className="mb-1.5">
              <label className="block text-[11px] font-medium text-slate-400 uppercase">{t('Access Token Key')}</label>
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500 pointer-events-none">
                <Lock className="h-4 w-4" />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrorStatus(null);
                }}
                className="w-full bg-slate-950/40 border border-slate-800 text-slate-200 text-sm pl-10 pr-10 py-2.5 rounded-xl focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all font-mono input-focus-glow"
                placeholder=""
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-500 hover:text-slate-300 transition-colors"
                id="viewPasswordBtn"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Feedback logs */}
          <AnimatePresence mode="wait">
            {errorStatus && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 flex gap-2"
              >
                <Info className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                <span className="text-[11px] text-red-300 leading-relaxed font-semibold">{errorStatus}</span>
              </motion.div>
            )}

            {typedMessage && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 flex gap-2"
              >
                <Sparkles className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-[11px] text-emerald-300 leading-relaxed font-semibold">{typedMessage}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => onNavigate('landing')}
              className="flex-1 py-3 bg-slate-950 border border-slate-800 hover:bg-slate-850 text-slate-300 font-semibold text-sm rounded-xl cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98] btn-shine-effect btn-ripple flex items-center justify-center gap-1.5"
            >
              <ArrowLeft className="h-4 w-4" /> {t('Back')}
            </button>
            <button
              type="submit"
              className="flex-[2] py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm rounded-xl cursor-pointer shadow-lg shadow-indigo-600/20 transition-all hover:scale-[1.02] active:scale-[0.98] btn-shine-effect btn-ripple flex items-center justify-center gap-2 group"
              id="loginSubmitBtn"
            >
              {t('Access Portal')}
              <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </form>

        {/* Dynamic Stepper switch backer */}
        <div className="mt-6 pt-5 border-t border-slate-800 text-center text-xs text-slate-500 font-medium">
          <span>{t('New to our campus?')} </span>
          <button
            type="button"
            onClick={() => onNavigate('register')}
            className="text-indigo-400 hover:underline hover:text-indigo-300 transition-colors font-bold cursor-pointer"
          >
            {t('Run Registration Stepper')}
          </button>
        </div>
      </motion.div>
    </div>
  );
};
