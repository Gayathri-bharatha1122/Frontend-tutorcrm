import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, 
  GraduationCap, 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle, 
  Phone, 
  Mail, 
  Lock, 
  ChevronRight,
  Database,
  RefreshCw,
  Sparkles,
  Award
} from 'lucide-react';
import { Screen, Role, Student } from '../types';
import { useLanguage } from '../LanguageContext';
import { LanguageSelector } from './LanguageSelector';
import { initialStudents } from '../data';

interface RegisterStepperProps {
  onNavigate: (screen: Screen) => void;
  onRegisteredSuccess: (role: Role, customName: string) => void;
}

export const RegisterStepper: React.FC<RegisterStepperProps> = ({ onNavigate, onRegisteredSuccess }) => {
  const { t } = useLanguage();
  const [currentStep, setCurrentStep] = useState(1);
  const [roleType, setRoleType] = useState<'student' | 'parent'>('student');
  
  // General inputs
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Student specific inputs
  const [grade, setGrade] = useState('11th Grade');
  const [learningGoal, setLearningGoal] = useState('Excel in Physics mechanics and prepare for final SAT assessment');
  const [parentPhoneInput, setParentPhoneInput] = useState('');

  // Parent specific: Student Search Linkage
  const [studentLookupPhone, setStudentLookupPhone] = useState('14155550218'); // Defaults to Marcus' phone for testing ease
  const [linkedStudent, setLinkedStudent] = useState<Student | null>(null);
  const [lookupFeedback, setLookupFeedback] = useState<string | null>(null);

  const [parentLinkedStudents, setParentLinkedStudents] = useState<any[]>([]);
  const [loadingLinkage, setLoadingLinkage] = useState(false);

  useEffect(() => {
    if (currentStep === 3 && roleType === 'parent') {
      const fetchLinkedStudents = async () => {
        setLoadingLinkage(true);
        setLookupFeedback(null);
        try {
          const res = await api.verifyLinkage(phone);
          if (res.students && res.students.length > 0) {
            setParentLinkedStudents(res.students);
            setLookupFeedback(null);
          } else {
            setParentLinkedStudents([]);
            setLookupFeedback('No registered student found with this parent phone number. Please ensure the student registers first.');
          }
        } catch (err: any) {
          setParentLinkedStudents([]);
          setLookupFeedback(err.message || 'No registered student found with this parent phone number. Please ensure the student registers first.');
        } finally {
          setLoadingLinkage(false);
        }
      };
      fetchLinkedStudents();
    }
  }, [currentStep, roleType, phone]);

  const handleSearchStudent = () => {
    if (!studentLookupPhone) {
      setLookupFeedback('Please fill in a valid student phone query.');
      setLinkedStudent(null);
      return;
    }
    const sanitized = studentLookupPhone.replace(/\D/g, '');
    const found = initialStudents.find(st => st.phone.includes(sanitized) || sanitized.includes(st.phone));
    
    if (found) {
      setLinkedStudent(found);
      setLookupFeedback(null);
    } else {
      setLinkedStudent(null);
      setLookupFeedback('No active student found with that register phone ID in the campus database. Try "14155550218" for demonstration!');
    }
  };

  const executeCompleteRegistration = async () => {
    try {
      const response = await api.register({
        firstName,
        lastName,
        email,
        phone,
        password,
        role: roleType,
        grade: roleType === 'student' ? grade : undefined,
        learningGoal: roleType === 'student' ? learningGoal : undefined,
        parentPhone: roleType === 'student' ? parentPhoneInput : undefined
      });
      
      if (roleType === 'student') {
        alert('Registration submitted successfully! Your account is pending administrator approval. You will be redirected to the login page.');
        onNavigate('login');
      } else {
        localStorage.setItem('edumanage_token', response.token);
        onRegisteredSuccess(roleType, response.user.name);
      }
    } catch (err: any) {
      alert(err.message || 'Registration failed. Please check your details.');
    }
  };

  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);
  const passwordsMatch = password === confirmPassword && password.length > 0;

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-950 flex flex-col justify-center items-center py-12 px-4 relative overflow-hidden font-sans">
      
      {/* Background radial effects */}
      <div className="absolute top-0 right-1/4 w-[400px] h-[400px] rounded-full bg-slate-900/60 blur-[100px] pointer-events-none" />

      {/* Brand logo back to landing link */}
      <div 
        onClick={() => onNavigate('landing')} 
        className="flex items-center gap-2 mb-8 cursor-pointer hover:scale-105 transition-all relative z-10"
      >
        <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center">
          <GraduationCap className="h-5 w-5 text-white" />
        </div>
        <span className="font-sans font-bold text-lg text-white tracking-tight">EduManage System</span>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 relative z-10 shadow-2xl text-slate-100"
      >
        {/* Progress Bar Track */}
        <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden mb-6 border border-slate-850">
          <motion.div 
            className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full"
            initial={{ width: '33.33%' }}
            animate={{ width: currentStep === 1 ? '33.33%' : currentStep === 2 ? '66.66%' : '100%' }}
            transition={{ type: 'spring', stiffness: 80, damping: 15 }}
          />
        </div>

        {/* Step Indicator Header */}
        <div className="flex items-center justify-between mb-8 border-b border-slate-800/80 pb-5">
          <div className="flex gap-1 items-center text-xs text-indigo-400 font-bold uppercase tracking-wider">
            <Sparkles className="h-3.5 w-3.5" />
            <span>{currentStep === 1 ? t('Step 1 of 3 • Credential Type') : currentStep === 2 ? t('Step 2 of 3 • Profile Registry') : t('Step 3 of 3 • Validation Links')}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-850 px-3 py-1 rounded-full">
            <div className={`w-2 h-2 rounded-full ${currentStep >= 1 ? 'bg-indigo-500' : 'bg-slate-800'}`} />
            <div className={`w-2 h-2 rounded-full ${currentStep >= 2 ? 'bg-indigo-500' : 'bg-slate-800'}`} />
            <div className={`w-2 h-2 rounded-full ${currentStep >= 3 ? 'bg-indigo-500' : 'bg-slate-800'}`} />
          </div>
        </div>

        {/* Dynamic Content Stages */}
        <AnimatePresence mode="wait">
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <h3 className="text-xl font-bold text-white mb-1.5">{t('Select Your Account Type')}</h3>
                <p className="text-sm text-slate-400">{t('Choose between Student or Parent role. EduManage delivers tailored boards based on selection parameters.')}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Student Select Card */}
                <motion.div
                  whileHover={{ scale: 1.03, translateY: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setRoleType('student')}
                  className={`p-6 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between h-44 ${
                    roleType === 'student'
                      ? 'border-indigo-500 bg-indigo-500/10 shadow-lg shadow-indigo-500/10'
                      : 'border-slate-800 bg-slate-950/20 hover:border-indigo-500/30'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${roleType === 'student' ? 'bg-indigo-600/30 text-indigo-400' : 'bg-slate-900 text-slate-400'}`}>
                      <GraduationCap className="h-5 w-5" />
                    </div>
                    {roleType === 'student' && <CheckCircle className="h-5 w-5 text-indigo-400 shrink-0" />}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white mb-1">{t('Student Portal Profile')}</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">{t('Complete assignment lists, query support tools directly, and track exam updates.')}</p>
                  </div>
                </motion.div>

                {/* Parent Select Card */}
                <motion.div
                  whileHover={{ scale: 1.03, translateY: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setRoleType('parent')}
                  className={`p-6 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between h-44 ${
                    roleType === 'parent'
                      ? 'border-indigo-500 bg-indigo-500/10 shadow-lg shadow-indigo-500/10'
                      : 'border-slate-800 bg-slate-950/20 hover:border-indigo-500/30'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${roleType === 'parent' ? 'bg-indigo-600/30 text-indigo-400' : 'bg-slate-900 text-slate-400'}`}>
                      <User className="h-5 w-5" />
                    </div>
                    {roleType === 'parent' && <CheckCircle className="h-5 w-5 text-indigo-400 shrink-0" />}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white mb-1">{t('Parent Guardian Link')}</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">{t('Monitor learning attendance metrics, verify unpaid fee balances, and review reports.')}</p>
                  </div>
                </motion.div>
              </div>

              <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800/80 flex items-center gap-3">
                <Database className="h-5 w-5 text-indigo-400 shrink-0" />
                <span className="text-slate-400 text-xs leading-normal">
                  Our system verifies academic linkage via active cellular numbers registered by campus administrators. No administrative paperwork needed.
                </span>
              </div>

              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={() => onNavigate('landing')}
                  className="px-4 py-2.5 bg-slate-950 border border-slate-850 hover:bg-slate-850 rounded-xl text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98] btn-ripple"
                >
                  <ArrowLeft className="h-4 w-4" /> {t('Back to Home')}
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-xs font-semibold text-white cursor-pointer shadow-lg shadow-indigo-600/20 transition-all flex items-center gap-1.5 group hover:scale-[1.02] active:scale-[0.98] btn-shine-effect btn-ripple"
                >
                  {t('Continue Profile Creation')}
                  <ChevronRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div>
                <h3 className="text-lg font-bold text-white">{t('Registry Profile Details')}</h3>
                <p className="text-xs text-slate-500">{t('Provide legal identification and access keys for account verification checks.')}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">{t('First Name')}</label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full bg-slate-950/40 border border-slate-850 text-slate-200 text-sm px-4 py-2 rounded-xl focus:border-indigo-500 outline-none transition input-focus-glow"
                    placeholder="Helena"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">{t('Last Name')}</label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full bg-slate-950/40 border border-slate-850 text-slate-200 text-sm px-4 py-2 rounded-xl focus:border-indigo-500 outline-none transition input-focus-glow"
                    placeholder="Thorne"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">{t('Contact Email Address')}</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-500 pointer-events-none" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-slate-950/40 border border-slate-850 text-slate-200 text-xs pl-10 pr-4 py-2.5 rounded-xl focus:border-indigo-500 outline-none transition input-focus-glow"
                      placeholder="helena@example.com"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">{t('Primary Phone Number')}</label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-3 h-4 w-4 text-slate-500 pointer-events-none" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-slate-950/40 border border-slate-850 text-slate-200 text-xs pl-10 pr-4 py-2.5 rounded-xl focus:border-indigo-500 outline-none transition input-focus-glow"
                      placeholder="e.g., 9876543210 (10 digits)"
                    />
                  </div>
                </div>
              </div>

              {/* Conditional Inputs based on Role Selected */}
              {roleType === 'student' ? (
                <div className="space-y-4 pt-2 border-t border-slate-850">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-medium text-slate-400 mb-1">{t('Grade Standard')}</label>
                      <select 
                        value={grade}
                        onChange={(e) => setGrade(e.target.value)}
                        className="w-full bg-slate-950 text-slate-200 text-xs p-2.5 rounded-xl border border-slate-850 outline-none focus:border-indigo-500 transition input-focus-glow"
                      >
                        <option>9th Grade</option>
                        <option>10th Grade</option>
                        <option>11th Grade</option>
                        <option>12th Grade</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-indigo-400 mb-1 font-bold">{t('Parent Mobile Contact (Required) *')}</label>
                      <input
                        type="tel"
                        required
                        value={parentPhoneInput}
                        onChange={(e) => setParentPhoneInput(e.target.value)}
                        className="w-full bg-slate-950/40 border border-indigo-500/30 text-slate-200 text-xs p-2.5 rounded-xl focus:border-indigo-500 outline-none transition input-focus-glow"
                        placeholder="e.g., 9876543210 (10 digits)"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-400 mb-1">{t('Learning Motivation Target')}</label>
                    <textarea
                      value={learningGoal}
                      onChange={(e) => setLearningGoal(e.target.value)}
                      rows={2}
                      className="w-full bg-slate-950/40 border border-slate-850 text-slate-200 text-xs p-3 rounded-xl focus:border-indigo-500 outline-none transition resize-none input-focus-glow"
                    />
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-850 text-[11px] text-slate-500">
                  <span className="font-bold text-slate-400 block mb-1">🛡️ {t('Linkage Policy Acknowledgement')}</span>
                  As a registered Parent / Guardian, completing Step 3 will automatically scan the database to connect with any registered student accounts using your parent mobile number.
                </div>
              )}

              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">{t('Secure Control Key Password')}</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-500 pointer-events-none" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-950/40 border border-slate-850 text-slate-200 text-xs pl-10 pr-4 py-2.5 rounded-xl focus:border-indigo-500 outline-none transition input-focus-glow"
                    placeholder="Create dashboard key password"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">{t('Confirm Secure Control Key Password')}</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-500 pointer-events-none" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-slate-950/40 border border-slate-850 text-slate-200 text-xs pl-10 pr-4 py-2.5 rounded-xl focus:border-indigo-500 outline-none transition input-focus-glow"
                    placeholder="Confirm dashboard key password"
                  />
                </div>
              </div>

              {/* Password strength indicators */}
              {password && (
                <div className="bg-slate-950/50 p-3.5 rounded-xl border border-slate-850 text-[11px] space-y-1.5 animate-fadeIn">
                  <span className="font-bold text-slate-400 block mb-1">Password Requirements:</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1">
                    <div className="flex items-center gap-1.5">
                      <span className={hasUpper ? "text-emerald-400 font-semibold" : "text-slate-500"}>
                        {hasUpper ? "✓" : "○"} One uppercase letter
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className={hasLower ? "text-emerald-400 font-semibold" : "text-slate-500"}>
                        {hasLower ? "✓" : "○"} One lowercase letter
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className={hasNumber ? "text-emerald-400 font-semibold" : "text-slate-500"}>
                        {hasNumber ? "✓" : "○"} One number digit
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className={hasSpecial ? "text-emerald-400 font-semibold" : "text-slate-500"}>
                        {hasSpecial ? "✓" : "○"} One special character
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 sm:col-span-2 border-t border-slate-900 pt-1.5 mt-0.5">
                      <span className={passwordsMatch ? "text-emerald-400 font-semibold" : "text-slate-500"}>
                        {passwordsMatch ? "✓" : "○"} Passwords match
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="px-4 py-2.5 bg-slate-950 border border-slate-850 hover:bg-slate-850 rounded-xl text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98] btn-ripple"
                >
                  <ArrowLeft className="h-4 w-4" /> {t('Back')}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const cleanPhone = phone.replace(/\D/g, '');
                    if (cleanPhone.length !== 10) {
                      alert('Your phone number must be exactly 10 digits.');
                      return;
                    }
                    if (roleType === 'student') {
                      if (!parentPhoneInput) {
                        alert('Parent mobile contact is required.');
                        return;
                      }
                      const cleanParent = parentPhoneInput.replace(/\D/g, '');
                      if (cleanParent.length !== 10) {
                        alert('Parent phone number must be exactly 10 digits.');
                        return;
                      }
                    }
                    if (!hasUpper || !hasLower || !hasNumber || !hasSpecial) {
                      alert('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.');
                      return;
                    }
                    if (!passwordsMatch) {
                      alert('Passwords do not match.');
                      return;
                    }
                    setCurrentStep(3);
                  }}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98] btn-shine-effect btn-ripple"
                >
                  {t('Next: Validation Links')} <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          )}

          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {roleType === 'student' ? (
                <div className="space-y-4">
                  <div className="text-center py-4">
                    <motion.div 
                      initial={{ scale: 0, rotate: -45 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
                      className="w-16 h-16 bg-amber-500/10 text-amber-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-amber-500/20"
                    >
                      <GraduationCap className="h-8 w-8 text-amber-400 animate-pulse" />
                    </motion.div>
                    <h3 className="text-lg font-bold text-white">Student Registration Pending</h3>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto">Your account will be created in a pending state. An administrator will review your enrollment details to accept or decline your registry.</p>
                  </div>

                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-slate-950/80 p-5 rounded-2xl border border-slate-850 space-y-2"
                  >
                    <span className="text-[11px] font-bold text-slate-500 uppercase block">Registry Summary</span>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div><span className="text-slate-400">FullName:</span> <span className="text-slate-200 font-semibold">{firstName} {lastName}</span></div>
                      <div><span className="text-slate-400">Standard:</span> <span className="text-slate-200 font-semibold">{grade}</span></div>
                      <div><span className="text-slate-400">Phone:</span> <span className="text-slate-200 font-semibold">{phone}</span></div>
                      <div><span className="text-slate-400">Parent Phone:</span> <span className="text-slate-200 font-semibold">{parentPhoneInput}</span></div>
                      <div className="col-span-2 text-[11px] border-t border-slate-900 pt-2 text-slate-500">
                        <span className="font-bold text-slate-400">Learning Goal:</span> {learningGoal}
                      </div>
                    </div>
                  </motion.div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-white">Database Linkage Verification Lookup</h3>
                    <p className="text-xs text-slate-400">EduManage automatically binds student accounts matching your parent contact mobile key.</p>
                  </div>

                  {/* lookup interface */}
                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-850 space-y-3">
                    <div>
                      <span className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Your Parent Mobile Key</span>
                      <div className="text-sm font-semibold text-slate-200 bg-slate-900 border border-slate-800 p-2.5 rounded-xl">
                        {phone}
                      </div>
                    </div>

                    {loadingLinkage ? (
                      <div className="flex items-center gap-2 text-xs text-slate-400 py-3 justify-center">
                        <RefreshCw className="h-4 w-4 animate-spin text-indigo-400" />
                        <span>Scanning database for child records...</span>
                      </div>
                    ) : parentLinkedStudents.length > 0 ? (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="bg-emerald-950/20 border border-emerald-500/30 rounded-xl p-4 space-y-3 overflow-hidden"
                      >
                        <div className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-emerald-400 shrink-0" />
                          <div className="flex-1">
                            <span className="text-xs text-slate-400">Student Profile(s) Found in Database</span>
                            {parentLinkedStudents.map(student => (
                              <div key={student.id} className="mt-2 pt-2 border-t border-slate-900 first:border-0 first:mt-0 first:pt-0">
                                <span className="font-bold text-emerald-300 block text-sm">{student.name} ({student.grade})</span>
                                <span className="text-[11px] text-slate-500 block">Enrolled in: {student.subject}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="bg-indigo-500/10 border border-indigo-400/30 p-2.5 rounded-lg flex items-center gap-2 mt-3">
                          <Award className="h-4 w-4 text-indigo-400 shrink-0" />
                          <span className="text-[11px] text-indigo-200 font-semibold leading-normal">
                            Linkage established! Parent database linkage authorized for {parentLinkedStudents.length} student(s).
                          </span>
                        </div>
                      </motion.div>
                    ) : (
                      lookupFeedback && (
                        <p className="text-[11px] text-red-400 font-medium font-sans leading-relaxed text-center px-2 py-3 border border-red-500/20 bg-red-950/10 rounded-xl">{lookupFeedback}</p>
                      )
                    )}
                  </div>
                </div>
              )}

              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="px-4 py-2.5 bg-slate-950 border border-slate-850 hover:bg-slate-850 rounded-xl text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98] btn-ripple"
                >
                  <ArrowLeft className="h-4 w-4" /> {t('Back')}
                </button>
                <button
                  type="button"
                  disabled={roleType === 'parent' && parentLinkedStudents.length === 0}
                  onClick={executeCompleteRegistration}
                  className={`px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    roleType === 'parent' && parentLinkedStudents.length === 0
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/10 hover:scale-[1.02] active:scale-[0.98] btn-shine-effect btn-ripple'
                  }`}
                >
                  {roleType === 'student' ? t('Submit Registry Request') : t('Finalize Enrollment')} <CheckCircle className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dynamic Stepper switcher backer */}
        <div className="mt-6 pt-5 border-t border-slate-800 text-center text-xs text-slate-500 font-semibold">
          <span>{t('Remembered login details?')} </span>
          <button 
            type="button"
            onClick={() => onNavigate('login')}
            className="text-indigo-400 hover:underline hover:text-indigo-300 transition-colors font-bold cursor-pointer"
          >
            {t('Sign in as Demo User Instantly')}
          </button>
        </div>
      </motion.div>
    </div>
  );
};
