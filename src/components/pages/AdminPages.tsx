import React, { useState, useEffect } from 'react';
import { DashboardPage } from '../DashboardPage';
import { Users, GraduationCap, User, Book, IndianRupee, FileText, Settings, Shield, BookOpen, Clock, AlertCircle, CheckCircle, PlusCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { api } from '../../services/api';
import { ParentsPage } from './ParentManagementPage';
import { useLanguage } from '../../LanguageContext';

interface AdminPageProps {
  pageKey: string;
  onBack: () => void;
  adminDashboardElement?: React.ReactNode;
}

// ─── Courses Page ────────────────────────────────────────────────────────────
const CoursesPage: React.FC = () => {
  const { t } = useLanguage();
  const courses = [
    { id: 'C001', name: 'Advanced Physics', tutor: 'Prof. Alistair Miller', students: 12, schedule: 'Mon/Wed/Fri 09:00 AM', level: 'Grade 11-12', status: 'Active', color: 'teal' },
    { id: 'C002', name: 'Calculus BC', tutor: 'Prof. Sarah Jenkins', students: 8, schedule: 'Tue/Thu 11:00 AM', level: 'Grade 12', status: 'Active', color: 'indigo' },
    { id: 'C003', name: 'Chemistry Honors', tutor: 'Dr. Priya Sharma', students: 10, schedule: 'Mon/Thu 02:00 PM', level: 'Grade 11', status: 'Active', color: 'violet' },
    { id: 'C004', name: 'AP Literature', tutor: 'Ms. Hannah Brooks', students: 9, schedule: 'Wed/Fri 01:00 PM', level: 'Grade 12', status: 'Active', color: 'amber' },
    { id: 'C005', name: 'Organic Chemistry', tutor: 'Dr. Priya Sharma', students: 6, schedule: 'Tue 03:00 PM', level: 'Grade 12', status: 'Upcoming', color: 'emerald' },
    { id: 'C006', name: 'Quantum Dynamics', tutor: 'Prof. Alistair Miller', students: 0, schedule: 'TBD', level: 'Grade 12', status: 'Draft', color: 'slate' },
  ];

  const statusColor: Record<string, string> = {
    Active: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    Upcoming: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    Draft: 'bg-slate-700/50 text-slate-400 border-slate-700',
  };

  const accentBg: Record<string, string> = {
    teal: 'bg-teal-500/10 text-teal-400',
    indigo: 'bg-indigo-500/10 text-indigo-400',
    violet: 'bg-violet-500/10 text-violet-400',
    amber: 'bg-amber-500/10 text-amber-400',
    emerald: 'bg-emerald-500/10 text-emerald-400',
    slate: 'bg-slate-700/50 text-slate-400',
  };

  return (
    <div className="space-y-6">
      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Courses', value: courses.length, color: 'text-violet-400' },
          { label: 'Active', value: courses.filter(c => c.status === 'Active').length, color: 'text-emerald-400' },
          { label: 'Total Students', value: courses.reduce((s, c) => s + c.students, 0), color: 'text-indigo-400' },
          { label: 'Faculty', value: 4, color: 'text-amber-400' },
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-center">
            <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">{t(s.label)}</span>
            <span className={`text-2xl font-extrabold block ${s.color}`}>{s.value}</span>
          </motion.div>
        ))}
      </div>

      {/* Course Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white">{t("Course Catalogue")}</h3>
            <p className="text-[11px] text-slate-500 mt-0.5">{t("All academic courses and their assigned tutors")}</p>
          </div>
          <button className="flex items-center gap-1.5 px-3.5 py-2 bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold rounded-xl transition cursor-pointer">
            <PlusCircle className="h-3.5 w-3.5" /> {t("Add Course")}
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-4">{t("Course")}</th>
                <th className="p-4">{t("Tutor")}</th>
                <th className="p-4">{t("Students")}</th>
                <th className="p-4">{t("Schedule")}</th>
                <th className="p-4">{t("Level")}</th>
                <th className="p-4 text-right">{t("Status")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {courses.map((course, i) => (
                <motion.tr key={course.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                  className="hover:bg-slate-950/40 transition">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${accentBg[course.color]}`}>
                        <BookOpen className="h-4 w-4" />
                      </div>
                      <div>
                        <span className="font-bold text-white block">{t(course.name)}</span>
                        <span className="text-[10px] text-slate-500">ID: {course.id}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-teal-500/10 text-teal-400 flex items-center justify-center text-[10px] font-bold">{course.tutor[5]}</div>
                      <span className="text-slate-300">{course.tutor}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1.5">
                      <Users className="h-3.5 w-3.5 text-slate-500" />
                      <span className="font-semibold text-slate-200">{course.students}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-slate-500" />
                      <span className="text-slate-400">{t(course.schedule)}</span>
                    </div>
                  </td>
                  <td className="p-4 text-slate-400">{t(course.level)}</td>
                  <td className="p-4 text-right">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${statusColor[course.status]}`}>
                      {t(course.status)}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// ─── Fees Page ───────────────────────────────────────────────────────────────
const FeesPage: React.FC = () => {
  const { t } = useLanguage();
  const [bills, setBills] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getParentBills()
      .then(data => setBills(data || []))
      .catch(() => {
        // Fallback static data if API fails
        setBills([
          { id: 'B001', itemName: 'Q1 Tuition Fee – Marcus Thorne', amount: 820, status: 'Paid', paidDate: 'Jan 5, 2026', student: 'Marcus Thorne' },
          { id: 'B002', itemName: 'Library & Lab Fees – Marcus Thorne', amount: 180, status: 'Paid', paidDate: 'Feb 15, 2026', student: 'Marcus Thorne' },
          { id: 'B003', itemName: 'Q2 Tuition Fee – Marcus Thorne', amount: 820, status: 'Paid', paidDate: 'Apr 3, 2026', student: 'Marcus Thorne' },
          { id: 'B004', itemName: 'Q3 Tuition Fee – Marcus Thorne', amount: 320, status: 'Overdue', paidDate: null, student: 'Marcus Thorne' },
          { id: 'B005', itemName: 'Q1 Tuition Fee – Sarah Jenkins', amount: 820, status: 'Paid', paidDate: 'Jan 7, 2026', student: 'Sarah Jenkins' },
          { id: 'B006', itemName: 'Q2 Tuition Fee – Sarah Jenkins', amount: 820, status: 'Pending', paidDate: null, student: 'Sarah Jenkins' },
        ]);
      })
      .finally(() => setLoading(false));
  }, []);

  const totalPaid = bills.filter(b => b.status === 'Paid').reduce((s, b) => s + b.amount, 0);
  const totalPending = bills.filter(b => b.status === 'Pending' || b.status === 'Overdue').reduce((s, b) => s + b.amount, 0);
  const overdueCount = bills.filter(b => b.status === 'Overdue').length;

  const statusStyle: Record<string, string> = {
    Paid: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    Pending: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    Overdue: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Collected', value: `₹${totalPaid.toLocaleString()}`, color: 'text-emerald-400' },
          { label: 'Outstanding', value: `₹${totalPending.toLocaleString()}`, color: 'text-rose-400' },
          { label: 'Total Invoices', value: bills.length, color: 'text-indigo-400' },
          { label: 'Overdue', value: overdueCount, color: 'text-amber-400' },
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-center">
            <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">{t(s.label)}</span>
            <span className={`text-xl font-extrabold block ${s.color}`}>{s.value}</span>
          </motion.div>
        ))}
      </div>

      {/* Overdue Alert */}
      {overdueCount > 0 && (
        <div className="flex items-center gap-3 bg-rose-500/5 border border-rose-500/20 rounded-2xl p-4">
          <AlertCircle className="h-5 w-5 text-rose-400 shrink-0 animate-pulse" />
          <p className="text-xs font-semibold text-rose-300">
            <span className="font-bold">{t("{count} overdue invoice(s) require immediate attention. Total outstanding: ").replace("{count}", overdueCount.toString())}</span> <span className="font-bold">₹{totalPending}</span>
          </p>
        </div>
      )}

      {/* Bills Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="p-5 border-b border-slate-800">
          <h3 className="text-sm font-bold text-white">{t("Payment Ledger")}</h3>
          <p className="text-[11px] text-slate-500 mt-0.5">{t("All student tuition invoices and payment records")}</p>
        </div>
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <div className="relative flex items-center justify-center w-10 h-10">
              <div className="absolute inset-0 rounded-full border-2 border-indigo-500/20" />
              <div className="absolute inset-0 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
            </div>
            <span className="text-xs text-slate-400 font-medium animate-pulse">{t("Loading payment records...")}</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-4">{t("Invoice")}</th>
                  <th className="p-4">{t("Student")}</th>
                  <th className="p-4 text-right">{t("Amount")}</th>
                  <th className="p-4">{t("Status")}</th>
                  <th className="p-4 text-right">{t("Paid Date")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {bills.map((bill, i) => (
                  <motion.tr key={bill.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                    className="hover:bg-slate-950/40 transition">
                    <td className="p-4">
                      <span className="font-semibold text-white block">{t(bill.itemName)}</span>
                      <span className="text-[10px] text-slate-500">Ref: {bill.id}</span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-indigo-500/10 text-indigo-400 flex items-center justify-center text-[10px] font-bold">
                          {(bill.student || 'U')[0]}
                        </div>
                        <span className="text-slate-300">{bill.student || '—'}</span>
                      </div>
                    </td>
                    <td className="p-4 text-right font-extrabold text-white font-mono">₹{bill.amount}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${statusStyle[bill.status] || statusStyle['Pending']}`}>
                        {t(bill.status)}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      {bill.paidDate ? (
                        <div className="flex items-center justify-end gap-1 text-emerald-400">
                          <CheckCircle className="h-3.5 w-3.5" />
                          <span className="font-semibold">{bill.paidDate}</span>
                        </div>
                      ) : (
                        <span className="text-slate-600 italic text-[10px]">{t("Not paid")}</span>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Main AdminPage Router ────────────────────────────────────────────────────
export const AdminPage: React.FC<AdminPageProps> = ({ pageKey, onBack, adminDashboardElement }) => {
  const { t } = useLanguage();
  
  const pageConfig: Record<string, { title: string; subtitle: string; content: React.ReactNode; accent?: string }> = {
    'students': {
      title: 'Student Management',
      subtitle: 'View, add, edit and manage student enrollment records.',
      content: adminDashboardElement,
      accent: 'indigo',
    },
    'tutors': {
      title: 'Tutor Management',
      subtitle: 'Manage teaching faculty, subjects, and class assignments.',
      content: adminDashboardElement,
      accent: 'indigo',
    },
    'parents': {
      title: 'Parent Management',
      subtitle: 'View and manage guardian accounts linked to students.',
      accent: 'indigo',
      content: null, // handled specially below
    },
    'courses': {
      title: 'Course Management',
      subtitle: 'Create, assign, and manage academic courses and curricula.',
      accent: 'indigo',
      content: <CoursesPage />,
    },
    'fees': {
      title: 'Fees & Billing',
      subtitle: 'Track and manage tuition payments, invoices, and overdue dues.',
      accent: 'indigo',
      content: <FeesPage />,
    },
    'reports': {
      title: 'Analytics & Reports',
      subtitle: 'Generate performance, financial, and attendance reports.',
      accent: 'indigo',
      content: (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center">
          <FileText className="h-12 w-12 text-cyan-400 mx-auto mb-4 opacity-60" />
          <h3 className="text-lg font-bold text-white mb-2">{t("System Reports")}</h3>
          <p className="text-slate-400 text-sm">{t("Generate and export academic, financial and operational reports.")}</p>
        </div>
      ),
    },
    'settings': {
      title: 'Platform Settings',
      subtitle: 'Configure global options, security policies, and integrations.',
      accent: 'indigo',
      content: (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center">
          <Settings className="h-12 w-12 text-slate-400 mx-auto mb-4 opacity-60" />
          <h3 className="text-lg font-bold text-white mb-2">{t("System Configuration")}</h3>
          <p className="text-slate-400 text-sm">{t("Adjust portal-wide settings, access control, and integrations.")}</p>
        </div>
      ),
    },
  };

  const page = pageConfig[pageKey];
  if (!page) return null;

  // Parents has its own full-page component with DashboardPage wrapper
  if (pageKey === 'parents') {
    return <ParentsPage onBack={onBack} />;
  }

  return (
    <DashboardPage
      title={page.title}
      subtitle={page.subtitle}
      accentColor={(page.accent as any) || 'indigo'}
      onBack={onBack}
    >
      {page.content}
    </DashboardPage>
  );
};
