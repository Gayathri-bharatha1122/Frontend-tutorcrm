import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { motion, AnimatePresence } from 'motion/react';
import {
  User,
  IndianRupee,
  QrCode,
  Smartphone,
  Calendar,
  Activity,
  AlertCircle,
  CheckCircle,
  X,
  CreditCard,
  Bell,
  ArrowRight,
  GraduationCap,
  Sparkles,
  Award,
  BookOpen,
  FlaskConical,
  Calculator,
  Atom,
  Mail,
  Phone,
  Clock,
  MapPin
} from 'lucide-react';
import { Bill, Announcement } from '../types';
import { useLanguage } from '../LanguageContext';
import { LanguageSelector } from './LanguageSelector';

const AnimatedCounter: React.FC<{ value: number; duration?: number; prefix?: string; suffix?: string; decimals?: number }> = ({ value, duration = 1000, prefix = '', suffix = '', decimals = 0 }) => {
  const [count, setCount] = useState(0);

  React.useEffect(() => {
    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const current = progress * value;
      setCount(decimals > 0 ? parseFloat(current.toFixed(decimals)) : Math.floor(current));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [value, duration, decimals]);

  const displayVal = decimals > 0 ? count.toFixed(decimals) : count.toLocaleString();
  return <>{prefix}{displayVal}{suffix}</>;
};

interface ParentDashboardProps {
  parentName: string;
  studentName: string;
  currentPath?: string;
  onLogout: () => void;
  onHome: () => void;
}

export const ParentDashboard: React.FC<ParentDashboardProps> = ({
  parentName,
  studentName,
  currentPath,
  onLogout,
  onHome
}) => {
  const { t } = useLanguage();
  const [bills, setBills] = useState<Bill[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [linkedStudentName, setLinkedStudentName] = useState<string>(studentName);
  const [courses, setCourses] = useState<any[]>([]);
  const [contactingTutor, setContactingTutor] = useState<string | null>(null);

  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackSubmissions, setFeedbackSubmissions] = useState<any[]>([]);
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [feedbackError, setFeedbackError] = useState('');
  const [feedbackSuccess, setFeedbackSuccess] = useState('');

  const loadFeedback = async () => {
    try {
      const data = await api.getParentFeedback();
      setFeedbackSubmissions(data || []);
    } catch (err) {
      console.error("Failed to load parent feedback", err);
    }
  };

  const isDashboard = !currentPath || currentPath.endsWith('/dashboard');
  const showOverview = isDashboard || currentPath?.includes('/progress');
  const showAttendance = isDashboard || currentPath?.includes('/attendance');
  const showBilling = isDashboard || currentPath?.includes('/fees') || currentPath?.includes('/notifications');
  const showCourses = isDashboard || currentPath?.includes('/courses');
  const showFeedback = isDashboard || currentPath?.includes('/profile');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dashboardData, billsData] = await Promise.all([
          api.getParentDashboard(),
          api.getParentBills()
        ]);
        setAnnouncements(dashboardData.announcements || []);
        setBills(billsData || []);
        setCourses(dashboardData.courses || []);
        if (dashboardData.student?.name) {
          setLinkedStudentName(dashboardData.student.name);
        }
      } catch (err) {
        console.error("Failed to load parent data", err);
      }
    };
    fetchData();
    loadFeedback();
  }, []);
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentSuccessMessage, setPaymentSuccessMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'announcements' | 'messages'>('announcements');

  useEffect(() => {
    if (currentPath) {
      if (currentPath.includes('/messages') || currentPath.includes('/teachers')) setActiveTab('messages');
      else setActiveTab('announcements');
    }
  }, [currentPath]);

  // UPI payment gateway states
  const [paymentMethod, setPaymentMethod] = useState<'qr' | 'upi_id'>('qr');
  const [upiId, setUpiId] = useState('helena@okaxis');
  const [paymentStep, setPaymentStep] = useState(0);

  const handlePayClick = (bill: Bill) => {
    setSelectedBill(bill);
    setPaymentSuccessMessage(null);
  };

  const handleConfirmMockPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBill) return;

    setIsProcessingPayment(true);
    setPaymentStep(1);

    // Simulated progress steps for real-time payments
    await new Promise((resolve) => setTimeout(resolve, 800));
    setPaymentStep(2);

    await new Promise((resolve) => setTimeout(resolve, 1000));
    setPaymentStep(3);

    await new Promise((resolve) => setTimeout(resolve, 800));
    setPaymentStep(4);

    try {
      await api.payBill(selectedBill.id);
      const updatedBills = await api.getParentBills();
      setBills(updatedBills);

      await new Promise((resolve) => setTimeout(resolve, 600));

      setIsProcessingPayment(false);
      setSelectedBill(null);
      setPaymentStep(0);
      
      setPaymentSuccessMessage(`UPI Payment of ₹${selectedBill.amount} for "${selectedBill.itemName}" settled instantly in real-time. Reference ID: TXN${Date.now().toString().slice(-8)}.`);
      setTimeout(() => setPaymentSuccessMessage(null), 4000);
    } catch (err: any) {
      setIsProcessingPayment(false);
      setPaymentStep(0);
      alert(`UPI Payment failed: ${err.message}`);
    }
  };

  // Compute Outstanding Dues Surcharge
  const totalOutstanding = bills
    .filter((b) => b.status === 'Pending' || b.status === 'Overdue')
    .reduce((sum, b) => sum + b.amount, 0);

  // Predefined attendance data for May 2026
  // Starts on a Friday (5 empty days padding)
  const getMay2026Attendance = () => {
    const days = [];
    // Padding
    for (let i = 0; i < 5; i++) {
      days.push({ dayNum: null, status: 'empty' });
    }
    const absentDays = [8, 20];
    for (let d = 1; d <= 31; d++) {
      const dayOfWeek = (5 + d - 1) % 7;
      let status: 'present' | 'absent' | 'weekend' = 'present';
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        status = 'weekend';
      } else if (absentDays.includes(d)) {
        status = 'absent';
      }
      days.push({ dayNum: d, status });
    }
    return days;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">

      {/* Upper Navigation bars */}
      <nav className="border-b border-slate-900 bg-slate-950/80 backdrop-blur sticky top-0 z-40">
        <div className="w-full px-4 sm:px-8 lg:px-12 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-600 flex items-center justify-center">
              <User className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="font-sans font-bold text-base text-white tracking-tight">{t('EduManage Parent')}</span>
              <span className="text-[10px] block text-slate-500 font-semibold uppercase">{t('Guardian Link Account')}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <span className="text-xs font-bold text-slate-200 block">{parentName}</span>
                <span className="text-[10px] text-amber-400 font-bold uppercase font-mono">{t('Linked Child • {name}').replace('{name}', linkedStudentName)}</span>
              </div>
              <LanguageSelector />
              <button
                onClick={onHome}
                className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-slate-200 font-semibold rounded-lg transition cursor-pointer"
              >
                {t('Home')}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="w-full px-4 sm:px-8 lg:px-12 py-8 space-y-8 relative z-10">

        <AnimatePresence>
          {paymentSuccessMessage && (
            <motion.div
              initial={{ height: 0, opacity: 0, y: -10 }}
              animate={{ height: 'auto', opacity: 1, y: 0 }}
              exit={{ height: 0, opacity: 0, y: -10 }}
              className="bg-emerald-600 border border-emerald-500/30 rounded-2xl p-4 text-white text-xs font-bold flex items-center justify-between shadow-xl"
            >
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4.5 w-4.5 text-emerald-200" />
                <span>{paymentSuccessMessage}</span>
              </div>
              <button onClick={() => setPaymentSuccessMessage(null)}>
                <X className="h-4 w-4 text-emerald-200 hover:text-white" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {showOverview && (
        <div id="overview" className="bg-slate-900 border border-slate-800 rounded-3xl p-6 scroll-mt-20">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-850 pb-6 mb-6 gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest block bg-amber-500/10 w-max px-2.5 py-0.5 rounded-md">
                {t('Active Student Linkage')}
              </span>
              <h2 className="text-xl font-bold text-white">{t('Student Progress Directory: {name}').replace('{name}', linkedStudentName)}</h2>
              <p className="text-slate-400 text-xs">{t("Educational metrics synchronized directly with Prof. Alistair Miller's study journals.")}</p>
            </div>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-850 flex items-center justify-between gap-6 w-full sm:min-w-xs shrink-0">
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase block mb-0.5">{t('Outstanding Balance Due')}</span>
                <span className="text-2xl font-extrabold text-white block">
                  <AnimatedCounter value={totalOutstanding} prefix="₹" />
                </span>
              </div>
              {totalOutstanding > 0 ? (
                <span className="px-3 py-1 bg-amber-500/10 text-amber-400 rounded-full text-[10px] font-bold border border-amber-500/20 flex items-center gap-1 animate-pulse">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" /> {t('Action Required')}
                </span>
              ) : (
                <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full text-[10px] font-bold border border-emerald-500/20">
                  <CheckCircle className="h-3.5 w-3.5 shrink-0" /> {t('Zero Dues')}
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              whileHover={{ y: -4, scale: 1.02 }}
              className="bg-slate-950/60 p-5 rounded-2xl border border-slate-850 flex items-center gap-4 transition-all hover:shadow-[0_10px_20px_-10px_rgba(99,102,241,0.1)] cursor-pointer"
            >
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
                <Calendar className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase block">{t('Attendance Rate')}</span>
                <span className="text-lg font-bold text-white block mt-0.5">
                  <AnimatedCounter value={98.2} decimals={1} suffix="%" />
                </span>
                <span className="text-[10px] text-emerald-400 font-bold block">{t('Excellent • Standard Class 11B')}</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              whileHover={{ y: -4, scale: 1.02 }}
              className="bg-slate-950/60 p-5 rounded-2xl border border-slate-850 flex items-center gap-4 transition-all hover:shadow-[0_10px_20px_-10px_rgba(20,184,166,0.1)] cursor-pointer"
            >
              <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400 flex items-center justify-center shrink-0">
                <Activity className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase block">{t('Homework Completion')}</span>
                <span className="text-lg font-bold text-white block mt-0.5">
                  <AnimatedCounter value={94.1} decimals={1} suffix="%" />
                </span>
                <span className="text-[10px] text-teal-400 font-bold block">{t('Highly Consistent • +3% vs. Avg')}</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              whileHover={{ y: -4, scale: 1.02 }}
              className="bg-slate-950/60 p-5 rounded-2xl border border-slate-850 flex items-center gap-4 transition-all hover:shadow-[0_10px_20px_-10px_rgba(16,185,129,0.1)] cursor-pointer"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <Award className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase block">{t('Average Course Grades')}</span>
                <span className="text-lg font-bold text-white block mt-0.5">
                  <AnimatedCounter value={91} suffix="% (Grade A-)" />
                </span>
                <span className="text-[10px] text-indigo-400 font-bold block">{t('Top 10% of Cohort tier')}</span>
              </div>
            </motion.div>

          </div>
        </div>
        )}

        {showAttendance && (
        <div id="attendance" className="bg-slate-900 border border-slate-800 rounded-3xl p-6 scroll-mt-20">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest block bg-emerald-500/10 w-max px-2.5 py-0.5 rounded-md">
                {t('Attendance Log')}
              </span>
              <h3 className="text-lg font-bold text-white flex items-center gap-1.5">
                <Calendar className="h-5 w-5 text-emerald-400" /> {t('Attendance Calendar')}
              </h3>
              <p className="text-slate-400 text-xs">{t("Verify your child's daily presence and session check-ins for the current month.")}</p>
            </div>
            <div className="flex flex-wrap gap-3 text-[10px] font-semibold text-slate-400">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500" /> {t('Present')}</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-rose-500" /> {t('Absent')}</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-slate-700" /> {t('Weekend')}</span>
            </div>
          </div>

          <div className="p-6 bg-slate-950 border border-slate-850 rounded-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">

              <div className="w-full max-w-xs mx-auto md:mx-0">
                <div className="text-center font-bold text-xs text-slate-350 mb-3">{t('May')} 2026</div>
                <div className="grid grid-cols-7 gap-1.5 text-center text-[9px] font-bold text-slate-500 mb-2">
                  <span>{t('Sun')}</span><span>{t('Mon')}</span><span>{t('Tue')}</span><span>{t('Wed')}</span><span>{t('Thu')}</span><span>{t('Fri')}</span><span>{t('Sat')}</span>
                </div>

                <div className="grid grid-cols-7 gap-1.5 text-center justify-items-center">
                  {getMay2026Attendance().map((day, idx) => {
                    if (day.status === 'empty') {
                      return <div key={`empty-${idx}`} className="w-8 h-8" />;
                    }

                    let cellStyle = "";
                    if (day.status === 'present') {
                      cellStyle = "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 rounded-full";
                    } else if (day.status === 'absent') {
                      cellStyle = "bg-rose-500/15 text-rose-400 border border-rose-500/30 rounded-full";
                    } else {
                      cellStyle = "bg-slate-900/30 text-slate-500 border border-slate-900/50 rounded-full";
                    }

                    return (
                      <div
                        key={`day-${day.dayNum}`}
                        title={day.status === 'present' ? `${t('Present on')} ${t('May')} ${day.dayNum}` : day.status === 'absent' ? `${t('Absent on')} ${t('May')} ${day.dayNum}` : t('Weekend')}
                        className={`w-8 h-8 flex items-center justify-center text-[10px] font-bold font-mono transition-all hover:scale-110 cursor-pointer ${cellStyle}`}
                      >
                        {day.dayNum}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-850 pb-2">{t('May Attendance Stats')}</h4>

                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-slate-900/55 p-3 rounded-xl border border-slate-850 text-center">
                    <span className="text-[9px] font-bold text-slate-500 uppercase block">{t('Conducted')}</span>
                    <span className="text-sm font-extrabold text-white block mt-1">
                      <AnimatedCounter value={21} />
                    </span>
                    <span className="text-[8px] text-slate-400 block font-semibold">{t('Sessions')}</span>
                  </div>

                  <div className="bg-emerald-950/20 p-3 rounded-xl border border-emerald-500/10 text-center">
                    <span className="text-[9px] font-bold text-emerald-550 uppercase block">{t('Attended')}</span>
                    <span className="text-sm font-extrabold text-emerald-400 block mt-1">
                      <AnimatedCounter value={19} />
                    </span>
                    <span className="text-[8px] text-emerald-500/70 block font-semibold">{t('Present')}</span>
                  </div>

                  <div className="bg-rose-950/20 p-3 rounded-xl border border-rose-500/10 text-center">
                    <span className="text-[9px] font-bold text-rose-550 uppercase block">{t('Absent')}</span>
                    <span className="text-sm font-extrabold text-rose-400 block mt-1">
                      <AnimatedCounter value={2} />
                    </span>
                    <span className="text-[8px] text-rose-500/70 block font-semibold">{t('Missed')}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 bg-slate-900/40 p-4 rounded-xl border border-slate-850/60">
                  <div className="relative w-14 h-14 shrink-0 flex items-center justify-center">
                    <svg className="w-14 h-14 transform -rotate-90">
                      <circle cx="28" cy="28" r="22" fill="transparent" stroke="#1e293b" strokeWidth="3.5" />
                      <motion.circle cx="28" cy="28" r="22" fill="transparent" strokeWidth="3.5"
                        className="stroke-emerald-400 transition-all duration-1000"
                        initial={{ strokeDashoffset: 138 }}
                        animate={{ strokeDashoffset: 138 - (138 * 90.5) / 100 }}
                        transition={{ duration: 1.2, ease: "easeOut" }}
                        strokeDasharray="138"
                        strokeLinecap="round" />
                    </svg>
                    <span className="absolute font-mono text-[9px] font-extrabold text-slate-350">
                      <AnimatedCounter value={90.5} decimals={1} suffix="%" />
                    </span>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-white block">{t('Attendance Percentage')}</span>
                    <p className="text-[10px] text-slate-400 leading-snug">{t("Attended 19 out of 21 sessions. {name}'s attendance is above the 90% threshold.").replace("{name}", linkedStudentName)}</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
        )}

        {showBilling && (
        <div id="billing" className="grid grid-cols-1 lg:grid-cols-5 gap-6 scroll-mt-20">

          <div className="lg:col-span-3 bg-slate-900 border border-slate-800 rounded-3xl p-6">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">{t('Itemized Tuition Billing & Fees Ledger')}</h3>
                <span className="text-xs text-slate-550 block">{t('Complete billing file with authorized gateway links')}</span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-950/80 border-b border-slate-850 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-4">{t('Item Name / Service Category')}</th>
                    <th className="p-4">{t('Paid Status')}</th>
                    <th className="p-4 text-center">{t('Amount Due')}</th>
                    <th className="p-4 text-right">{t('Actions Link')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850 text-xs">
                  {bills.map((bill, bIdx) => (
                    <motion.tr
                      key={bill.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: Math.min(bIdx * 0.05, 0.4), duration: 0.3 }}
                      className="hover:bg-slate-950/20 transition"
                    >
                      <td className="p-4">
                        <span className="font-bold text-white block">{t(bill.itemName)}</span>
                        <span className="text-[10px] text-slate-500 block">{t('Billing Code')}: {bill.id} • {t('Date compiled')}: {bill.status === 'Paid' ? t(bill.paidDate) : t('Overdue Period')}</span>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold block w-max ${bill.status === 'Paid' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
                            bill.status === 'Overdue' ? 'bg-red-500/10 text-red-500 border border-red-500/20 animate-pulse' :
                              'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                          }`}>
                          {t(bill.status)}
                        </span>
                      </td>
                      <td className="p-4 font-bold text-white text-center font-mono text-[13px]">₹{bill.amount}</td>
                      <td className="p-4 text-right">
                        {bill.status !== 'Paid' ? (
                          <button
                            type="button"
                            onClick={() => handlePayClick(bill)}
                            className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-[11px] px-3 py-1.5 rounded-lg transition hover:scale-[1.03] active:scale-[0.97] btn-shine-effect btn-ripple cursor-pointer"
                          >
                            {t('Pay Now')}
                          </button>
                        ) : (
                          <span className="text-[10px] font-bold text-slate-500 block mr-2">{t('Paid on')} {t(bill.paidDate)}</span>
                        )}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div>
                <div className="flex gap-2 mb-2">
                  <button
                    onClick={() => setActiveTab('announcements')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${activeTab === 'announcements' ? 'bg-amber-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                  >
                    {t('Campus Announcements')}
                  </button>
                  <button
                    onClick={() => setActiveTab('messages')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${activeTab === 'messages' ? 'bg-amber-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                  >
                    {t('Direct Messages')}
                  </button>
                </div>
                <h3 className="text-sm font-bold text-white mt-4">{activeTab === 'announcements' ? t('Advisory Board Bulletin') : t('Teacher Communications')}</h3>
              </div>

              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
                {activeTab === 'announcements' ? (
                  announcements.map((ann, aIdx) => (
                    <motion.div
                      key={ann.id}
                      initial={{ opacity: 0, x: 15 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: Math.min(aIdx * 0.05, 0.4), duration: 0.3 }}
                      whileHover={{ x: 2, scale: 1.01 }}
                      className="p-4 bg-slate-950 border border-slate-850 hover:border-slate-800 transition rounded-2xl relative"
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-bold text-slate-200 block truncate max-w-[180px]">{t(ann.title)}</span>
                        <span className="text-[9px] text-slate-500 font-mono italic">{t(ann.timeAgo)}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed font-sans">{t(ann.content)}</p>
                    </motion.div>
                  ))
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-4 bg-slate-950 border border-slate-850 rounded-2xl flex flex-col gap-2"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-slate-200 block">{t('Prof. Alistair Miller')}</span>
                      <span className="text-[9px] text-slate-500 font-mono italic">{t('Today, 10:30 AM')}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed font-sans">{t("Marcus has been doing exceptionally well in his rotational physics units. Let's touch base next week regarding the upcoming science fair.")}</p>
                    <button className="mt-2 text-[10px] bg-amber-600/10 text-amber-400 border border-amber-500/20 px-3 py-1.5 rounded-lg font-bold hover:bg-amber-600/20 hover:scale-[1.03] active:scale-[0.97] transition-all self-start cursor-pointer btn-ripple">{t('Reply to Message')}</button>
                  </motion.div>
                )}
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-850 text-center text-xs text-slate-500 font-semibold flex items-center justify-between">
              <span>{t('Parent Advisory Line')}</span>
              <span className="text-indigo-400 hover:underline cursor-pointer flex items-center gap-1 text-[10px]">
                {t('Link Secondary Contact ID')} <ArrowRight className="h-3 w-3" />
              </span>
            </div>
          </div>

        </div>
        )}

        <div id="messages" className="hidden scroll-mt-20" />

        {showCourses && (
        <div id="courses" className="bg-slate-900 border border-slate-800 rounded-3xl p-6 scroll-mt-20">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest block bg-indigo-500/10 w-max px-2.5 py-0.5 rounded-md">
                {t('Enrolled Courses')}
              </span>
              <h3 className="text-lg font-bold text-white flex items-center gap-1.5">
                <GraduationCap className="h-5 w-5 text-indigo-400" /> {t('Courses & Assigned Tutors')}
              </h3>
              <p className="text-slate-400 text-xs">{t("Your child's active courses with tutor details and direct contact availability.")}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {courses.length === 0 ? (
              <div className="col-span-3 text-center py-10 text-slate-500 text-xs font-semibold">{t('No courses enrolled yet.')}</div>
            ) : (
              courses.map((course, idx) => {
                const iconMap: Record<string, React.ReactNode> = {
                  physics: <Atom className="h-5 w-5" />,
                  math: <Calculator className="h-5 w-5" />,
                  chem: <FlaskConical className="h-5 w-5" />,
                  lit: <BookOpen className="h-5 w-5" />
                };
                const colorMap: Record<string, string> = {
                  physics: 'indigo',
                  math: 'teal',
                  chem: 'amber',
                  lit: 'rose'
                };
                const color = colorMap[course.iconType] || 'indigo';
                const colorClasses: Record<string, { bg: string; border: string; text: string; progBg: string }> = {
                  indigo: { bg: 'bg-indigo-500/10', border: 'border-indigo-500/20', text: 'text-indigo-400', progBg: 'bg-indigo-500' },
                  teal: { bg: 'bg-teal-500/10', border: 'border-teal-500/20', text: 'text-teal-400', progBg: 'bg-teal-500' },
                  amber: { bg: 'bg-amber-500/10', border: 'border-amber-500/20', text: 'text-amber-400', progBg: 'bg-amber-500' },
                  rose: { bg: 'bg-rose-500/10', border: 'border-rose-500/20', text: 'text-rose-400', progBg: 'bg-rose-500' }
                };
                const cc = colorClasses[color];

                return (
                  <motion.div
                    key={course.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.07, duration: 0.35 }}
                    whileHover={{ y: -3, scale: 1.01 }}
                    className="bg-slate-950 border border-slate-850 rounded-2xl p-5 flex flex-col gap-4 transition-all hover:border-slate-700 hover:shadow-[0_8px_24px_-8px_rgba(0,0,0,0.4)]"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-11 h-11 rounded-xl ${cc.bg} ${cc.border} border ${cc.text} flex items-center justify-center shrink-0`}>
                        {iconMap[course.iconType] || <BookOpen className="h-5 w-5" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-sm font-bold text-white block truncate">{t(course.name)}</span>
                      </div>
                    </div>

                    <div className="border-t border-slate-800 pt-3 flex items-center justify-between gap-2 mt-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
                          <User className="h-4 w-4 text-slate-400" />
                        </div>
                        <div className="min-w-0">
                          <span className="text-xs font-bold text-white block truncate">{course.tutorName}</span>
                          <span className="text-[10px] text-slate-500 font-semibold truncate">Tutor</span>
                        </div>
                      </div>

                      <button
                        onClick={() => setContactingTutor(contactingTutor === course.id ? null : course.id)}
                        className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 hover:bg-indigo-500/20 hover:scale-105`}
                        title={t(`Contact {tutor}`).replace('{tutor}', course.tutorName)}
                      >
                        <Mail className="h-3.5 w-3.5" />
                        {t('Contact')}
                      </button>
                    </div>

                    <AnimatePresence>
                      {contactingTutor === course.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25 }}
                          className="overflow-hidden"
                        >
                          <div className="bg-emerald-950/20 border border-emerald-500/15 rounded-xl p-3 flex flex-col gap-2">
                            <span className="text-[10px] font-bold text-emerald-400 uppercase">{t('Contact Options')}</span>
                            <a
                              href="mailto:alistair.miller@edumanage.com"
                              className="flex items-center gap-2 text-[10px] text-slate-300 hover:text-white font-semibold transition group"
                            >
                              <div className="w-6 h-6 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center group-hover:bg-indigo-500/20 transition">
                                <Mail className="h-3 w-3 text-indigo-400" />
                              </div>
                              {t('Send Email')}
                            </a>
                            <a
                              href="tel:+14155550001"
                              className="flex items-center gap-2 text-[10px] text-slate-300 hover:text-white font-semibold transition group"
                            >
                              <div className="w-6 h-6 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center group-hover:bg-teal-500/20 transition">
                                <Phone className="h-3 w-3 text-teal-400" />
                              </div>
                              {t('Call Tutor')}
                            </a>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })
            )}
          </div>
        </div>
        )}

        {showFeedback && (
        <div id="feedback" className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
          <div className="border-b border-slate-850 pb-4 mb-6">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="h-4.5 w-4.5 text-amber-400 animate-pulse" /> {t('Feedback & Ratings')}
            </h3>
            <span className="text-[11px] text-slate-550">{t('Provide feedback on school facilities, course curriculums, or tutor guidance')}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-slate-950 border border-slate-850 p-5 rounded-2xl">
              <h4 className="text-xs font-bold text-white uppercase tracking-widest border-b border-slate-850 pb-2 mb-4">{t('Submit Feedback & Rating')}</h4>

              {feedbackSuccess && <div className="p-3 mb-3 text-xs bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl">{feedbackSuccess}</div>}
              {feedbackError && <div className="p-3 mb-3 text-xs bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl">{feedbackError}</div>}

              <form onSubmit={async (e) => {
                e.preventDefault();
                if (!feedbackText.trim()) return;
                setFeedbackLoading(true);
                setFeedbackError('');
                setFeedbackSuccess('');
                try {
                  await api.submitParentFeedback(feedbackText, feedbackRating);
                  setFeedbackSuccess(t('Feedback submitted successfully!'));
                  setFeedbackText('');
                  setFeedbackRating(5);
                  await loadFeedback();
                } catch (err: any) {
                  setFeedbackError(err.message || t('Failed to submit feedback'));
                } finally {
                  setFeedbackLoading(false);
                }
              }} className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Rating</label>
                  <div className="flex gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setFeedbackRating(star)}
                        className="text-amber-400 hover:scale-110 transition cursor-pointer"
                      >
                        <Sparkles className={`h-6 w-6 ${star <= feedbackRating ? 'fill-amber-400' : 'text-slate-600'}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">{t('Comment')}</label>
                  <textarea
                    placeholder={t("Share your feedback on the teaching standards, system interface, or other ideas...")}
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    rows={3}
                    className="w-full bg-slate-900 border border-slate-850 text-xs p-3 rounded-xl outline-none focus:border-indigo-500 text-slate-200"
                  />
                </div>

                <button
                  type="submit"
                  disabled={feedbackLoading || !feedbackText.trim()}
                  className={`px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition cursor-pointer ${feedbackLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {feedbackLoading ? t('Submitting...') : t('Submit Feedback')}
                </button>
              </form>
            </div>

            <div className="bg-slate-950 border border-slate-850 p-5 rounded-2xl">
              <h4 className="text-xs font-bold text-white uppercase tracking-widest border-b border-slate-850 pb-2 mb-4">{t('Previous Feedback & Ratings')}</h4>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-850 text-slate-500">
                      <th className="pb-2 font-bold uppercase text-[9px] tracking-wider">{t('Date')}</th>
                      <th className="pb-2 font-bold uppercase text-[9px] tracking-wider">{t('Rating')}</th>
                      <th className="pb-2 font-bold uppercase text-[9px] tracking-wider">{t('Comment')}</th>
                      <th className="pb-2 font-bold uppercase text-[9px] tracking-wider">{t('Status')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {feedbackSubmissions.map((sub, i) => (
                      <tr key={sub.id || i} className="border-b border-slate-900/50 hover:bg-slate-900/10">
                        <td className="py-2.5 font-mono text-[10px] text-slate-400 whitespace-nowrap">{sub.submissionDate}</td>
                        <td className="py-2.5">
                          <div className="flex gap-0.5">
                            {Array.from({ length: 5 }).map((_, idx) => (
                              <Sparkles
                                key={idx}
                                className={`h-3 w-3 ${idx < sub.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-800'}`}
                              />
                            ))}
                          </div>
                        </td>
                        <td className="py-2.5 text-slate-300 max-w-xs truncate" title={sub.feedback}>{sub.feedback}</td>
                        <td className="py-2.5">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${sub.status === 'Reviewed' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-amber-500/15 text-amber-400'
                            }`}>
                            {t(sub.status)}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {feedbackSubmissions.length === 0 && (
                      <tr>
                        <td colSpan={4} className="py-4 text-center text-slate-550 italic">{t('No feedback submitted yet.')}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        )}

      </main>

      <AnimatePresence>
        {selectedBill && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40"
              onClick={() => {
                if (!isProcessingPayment) setSelectedBill(null);
              }}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="fixed inset-0 m-auto w-full max-w-md h-max bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl z-50 p-6 text-slate-100 overflow-hidden"
            >
              <style>{`
                @keyframes scan {
                  0%, 100% { top: 0%; opacity: 0.8; }
                  50% { top: 100%; opacity: 0.8; }
                }
                .scan-line {
                  animation: scan 2.5s infinite linear;
                }
              `}</style>

              <div className="flex justify-between items-center mb-6">
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                    <IndianRupee className="h-4.5 w-4.5 text-amber-400" /> {t('BHIM UPI Real-Time Gateway')}
                  </h4>
                  <span className="text-[11px] text-slate-400">{t('NPCI Unified Payments Interface Secure Node')}</span>
                </div>
                {!isProcessingPayment && (
                  <button
                    onClick={() => setSelectedBill(null)}
                    className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>

              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-850 mb-6 flex justify-between items-center">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block font-bold">{t('Item Description')}</span>
                  <span className="text-xs font-bold text-white block max-w-[200px] truncate">{t(selectedBill.itemName)}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-500 uppercase block font-bold">{t('Amount Due')}</span>
                  <span className="text-base font-extrabold text-amber-400 block font-mono">₹{selectedBill.amount}</span>
                </div>
              </div>

              {paymentStep > 0 ? (
                <div className="py-8 text-center space-y-5">
                  <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
                    {paymentStep === 4 ? (
                      <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center animate-bounce">
                        <CheckCircle className="h-8 w-8" />
                      </div>
                    ) : (
                      <>
                        <div className="absolute inset-0 border-4 border-indigo-500/20 rounded-full" />
                        <div className="absolute inset-0 border-4 border-t-indigo-400 rounded-full animate-spin" />
                        <span className="text-lg font-bold text-indigo-400">UPI</span>
                      </>
                    )}
                  </div>
                  <div className="space-y-1">
                    <h5 className="text-xs font-bold text-white uppercase tracking-wider">
                      {paymentStep === 1 && t("Initiating UPI Transaction")}
                      {paymentStep === 2 && t("Awaiting VPA Authorization")}
                      {paymentStep === 3 && t("Verifying NPCI Settlement")}
                      {paymentStep === 4 && t("Transaction Successful")}
                    </h5>
                    <p className="text-[11px] text-slate-400 max-w-xs mx-auto leading-relaxed">
                      {paymentStep === 1 && t("Setting up secure connection parameters with payment servers...")}
                      {paymentStep === 2 && t("Push notification sent to parent app. Please authorize the request in Google Pay or PhonePe.")}
                      {paymentStep === 3 && t("NPCI ledger confirmations in progress. Validating real-time bank settlement...")}
                      {paymentStep === 4 && t("Payment cleared successfully. Invoiced balance has been fully settled.")}
                    </p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleConfirmMockPayment} className="space-y-5">
                  <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-850">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('qr')}
                      className={`flex-1 py-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                        paymentMethod === 'qr'
                          ? 'bg-slate-900 text-white shadow-sm'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <QrCode className="h-4 w-4" /> {t('Scan QR Code')}
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('upi_id')}
                      className={`flex-1 py-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                        paymentMethod === 'upi_id'
                          ? 'bg-slate-900 text-white shadow-sm'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <Smartphone className="h-4 w-4" /> {t('UPI ID / VPA')}
                    </button>
                  </div>

                  {paymentMethod === 'qr' ? (
                    <div className="space-y-4 text-center">
                      <div className="relative w-36 h-36 bg-white p-2 rounded-2xl mx-auto flex items-center justify-center border-4 border-slate-800 overflow-hidden shadow-lg shadow-white/5">
                        <div className="absolute left-0 right-0 h-0.5 bg-[#d97706] shadow-[0_0_8px_rgba(217,119,6,0.8)] scan-line pointer-events-none" />
                        
                        <svg className="w-28 h-28 text-slate-900" viewBox="0 0 100 100" fill="currentColor">
                          <path d="M 0,0 H 30 V 10 H 10 V 30 H 0 Z M 10,10 H 20 V 20 H 10 Z" />
                          <path d="M 70,0 H 100 V 30 H 90 V 10 H 70 Z M 80,10 H 90 V 20 H 80 Z" />
                          <path d="M 0,70 H 10 V 90 H 30 V 100 H 0 Z M 10,80 H 20 V 90 H 10 Z" />
                          <rect x="40" y="0" width="10" height="10" />
                          <rect x="50" y="10" width="10" height="10" />
                          <rect x="40" y="20" width="20" height="10" />
                          <rect x="0" y="40" width="10" height="10" />
                          <rect x="10" y="50" width="10" height="10" />
                          <rect x="20" y="40" width="20" height="10" />
                          <rect x="50" y="40" width="10" height="10" />
                          <rect x="60" y="50" width="10" height="10" />
                          <rect x="80" y="40" width="20" height="10" />
                          <rect x="80" y="60" width="10" height="10" />
                          <rect x="90" y="70" width="10" height="10" />
                          <rect x="40" y="60" width="10" height="10" />
                          <rect x="50" y="70" width="10" height="10" />
                          <rect x="60" y="80" width="10" height="10" />
                          <rect x="40" y="90" width="20" height="10" />
                          <rect x="70" y="80" width="25" height="10" />
                          <rect x="80" y="90" width="10" height="10" />
                          <rect x="42" y="42" width="16" height="16" rx="2" fill="#d97706" />
                          <path d="M 47,46 H 53 V 54 H 47 Z" fill="white" />
                        </svg>
                      </div>
                      <p className="text-[11px] text-slate-400 max-w-xs mx-auto leading-relaxed">
                        {t("Scan the UPI QR code above using any UPI enabled app (GPay, PhonePe, Paytm, BHIM) to pay")} <span className="text-white font-bold">₹{selectedBill.amount}</span>.
                      </p>
                      
                      <button
                        type="submit"
                        className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition cursor-pointer flex justify-center items-center gap-1.5"
                      >
                        {t('Verify Settlement in Real-Time')} <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">{t('Enter Virtual Payment Address (VPA / UPI ID) *')}</label>
                        <input
                          type="text"
                          required
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          placeholder={t('username@bank')}
                          className="w-full bg-slate-950 border border-slate-850 text-xs px-3 py-2.5 rounded-xl outline-none focus:border-indigo-500 text-slate-300 font-mono tracking-wide placeholder:text-slate-700"
                        />
                      </div>

                      <div className="flex flex-wrap gap-1.5">
                        {['@upi', '@paytm', '@okaxis', '@okicici', '@okhdfcbank'].map((suffix) => (
                          <button
                            key={suffix}
                            type="button"
                            onClick={() => {
                              const username = upiId.split('@')[0] || 'parent';
                              setUpiId(username + suffix);
                            }}
                            className="text-[10px] bg-slate-950 hover:bg-slate-800 border border-slate-850 text-slate-400 hover:text-white px-2.5 py-1 rounded-lg font-mono transition cursor-pointer"
                          >
                            {suffix}
                          </button>
                        ))}
                      </div>

                      <p className="text-[10px] text-slate-500 leading-snug">
                        {t('A transaction notification request will be pushed instantly to your mobile app for confirmation.')}
                      </p>

                      <button
                        type="submit"
                        className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition cursor-pointer flex justify-center items-center gap-1.5"
                      >
                        {t('Send Real-Time UPI Request')} <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </form>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
};
