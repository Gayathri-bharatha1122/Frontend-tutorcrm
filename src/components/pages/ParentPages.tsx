import React, { useState, useEffect } from 'react';
import { DashboardPage } from '../DashboardPage';
import { motion } from 'motion/react';
import { TrendingUp, Calendar, IndianRupee, Bell, User, CheckCircle, AlertCircle } from 'lucide-react';
import { useLanguage } from '../../LanguageContext';
import RazorpayCheckout from '../RazorpayCheckout';
import { api } from '../../services/api';
import { Bill } from '../../types';

interface ParentPageProps {
  pageKey: string;
  parentName: string;
  studentName: string;
  onBack: () => void;
}

const StatCard: React.FC<{ label: string; value: string; sub?: string; color: string }> = ({ label, value, sub, color }) => {
  const { t } = useLanguage();
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">{t(label)}</span>
      <span className={`text-xl font-extrabold block ${color}`}>{t(value)}</span>
      {sub && <span className="text-xs text-slate-500 mt-1 block">{t(sub)}</span>}
    </motion.div>
  );
};

export const ParentPage: React.FC<ParentPageProps> = ({ pageKey, parentName, studentName, onBack }) => {
  const { t } = useLanguage();
  const [paymentMsg, setPaymentMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (pageKey === 'fees') {
      setLoading(true);
      api.getParentBills()
        .then(data => setBills(data || []))
        .catch(err => console.error("Error loading bills:", err))
        .finally(() => setLoading(false));
    }
  }, [pageKey]);

  // Compute Outstanding Dues & Total Paid dynamically
  const outstandingDues = bills
    .filter((b) => b.status === 'Pending' || b.status === 'Overdue')
    .reduce((sum, b) => sum + b.amount, 0);

  const totalPaid = bills
    .filter((b) => b.status === 'Paid')
    .reduce((sum, b) => sum + b.amount, 0);
  
  const pageContent: Record<string, React.ReactNode> = {
    'progress': (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard label="Overall Average" value="87.5%" sub="Current semester" color="text-emerald-400" />
          <StatCard label="Best Subject" value="Chemistry" sub="94% average" color="text-teal-400" />
          <StatCard label="Class Rank" value="#4" sub="Out of 32 students" color="text-indigo-400" />
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-amber-400" /> {studentName}'s {t("Academic Progress")}
          </h3>
          <p className="text-xs text-slate-500 mb-5">{t("Subject-wise performance for the current academic year.")}</p>
          {[
            { subject: 'Advanced Physics', score: 88, grade: 'A' },
            { subject: 'Calculus BC', score: 74, grade: 'B+' },
            { subject: 'Chemistry Honors', score: 94, grade: 'A+' },
            { subject: 'AP Literature', score: 81, grade: 'A-' },
          ].map((s, i) => (
            <div key={i} className="py-3 border-b border-slate-800 last:border-0">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-white">{t(s.subject)}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white font-mono">{s.score}%</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/10 text-indigo-400">{t(s.grade)}</span>
                </div>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5">
                <motion.div initial={{ width: 0 }} animate={{ width: `${s.score}%` }} transition={{ duration: 0.8, delay: i * 0.1 }}
                  className={`h-1.5 rounded-full ${s.score >= 90 ? 'bg-emerald-500' : s.score >= 75 ? 'bg-indigo-500' : 'bg-amber-500'}`} />
              </div>
            </div>
          ))}
        </div>
      </div>
    ),

    'attendance': (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard label="Attendance Rate" value="94.2%" sub="This month" color="text-emerald-400" />
          <StatCard label="Days Present" value="19" sub="Out of 21 school days" color="text-teal-400" />
          <StatCard label="Days Absent" value="2" sub="May 8 & May 20" color="text-rose-400" />
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
            <Calendar className="h-4 w-4 text-amber-400" /> {studentName}'s {t("Attendance History")}
          </h3>
          {[
            { subject: 'Advanced Physics', sessions: 8, present: 8 },
            { subject: 'Calculus BC', sessions: 6, present: 5 },
            { subject: 'Chemistry Honors', sessions: 4, present: 4 },
            { subject: 'AP Literature', sessions: 3, present: 2 },
          ].map((a, i) => (
            <div key={i} className="flex items-center justify-between py-3 border-b border-slate-800 last:border-0">
              <div>
                <span className="text-xs font-bold text-white block">{t(a.subject)}</span>
                <span className="text-[10px] text-slate-500">{a.present}/{a.sessions} {t("sessions")}</span>
              </div>
              <span className={`text-sm font-extrabold ${a.present === a.sessions ? 'text-emerald-400' : a.present / a.sessions >= 0.75 ? 'text-amber-400' : 'text-rose-400'}`}>
                {Math.round((a.present / a.sessions) * 100)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    ),

    'fees': (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard label="Outstanding Dues" value={`₹${outstandingDues}`} sub="Due by Jun 30" color="text-rose-400" />
          <StatCard label="Total Paid" value={`₹${totalPaid}`} sub="This academic year" color="text-emerald-400" />
          <StatCard label="Next Due" value="Jul 1" sub="Quarterly tuition" color="text-amber-400" />
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
            <IndianRupee className="h-4 w-4 text-amber-400" /> {t("Fee Ledger")}
          </h3>
          {loading ? (
            <div className="text-center py-6 text-xs text-slate-500 font-semibold">{t('Loading billing records...')}</div>
          ) : bills.length === 0 ? (
            <div className="text-center py-6 text-xs text-slate-500 font-semibold">{t('No bills found.')}</div>
          ) : (
            bills.map((f, i) => (
              <div key={i} className="flex items-center justify-between py-3 border-b border-slate-800 last:border-0">
                <div>
                  <span className="text-xs font-bold text-white block">{t(f.itemName)}</span>
                  <span className="text-[10px] text-slate-500">{t("Due")}: {f.status === 'Paid' ? t(f.paidDate) : t('Jun 30')}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-extrabold text-white font-mono">₹{f.amount}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    f.status === 'Paid' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400 animate-pulse'
                  }`}>{t(f.status)}</span>
                </div>
              </div>
            ))
          )}
          <div className="mt-5">
            {outstandingDues > 0 ? (
              <RazorpayCheckout
                amountInRupees={outstandingDues}
                label={t('Pay Outstanding Balance (₹{amount})').replace('{amount}', outstandingDues.toString())}
                receipt={`fees-dues-${Date.now()}`}
                prefill={{ name: parentName }}
                onResult={async (ok, msg) => {
                  setPaymentMsg({ ok, text: msg });
                  if (ok) {
                    try {
                      const unpaidBills = bills.filter(b => b.status === 'Pending' || b.status === 'Overdue');
                      for (const ub of unpaidBills) {
                        await api.payBill(ub.id || (ub as any)._id);
                      }
                      const freshBills = await api.getParentBills();
                      setBills(freshBills);
                    } catch (err) {
                      console.error("Failed to settle paid bills on backend:", err);
                    }
                  }
                }}
              />
            ) : (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold text-center rounded-xl">
                {t('All dues are fully settled. Thank you!')}
              </div>
            )}
            {paymentMsg && (
              <p className={`text-[11px] text-center font-medium mt-2 ${
                paymentMsg.ok ? 'text-emerald-400' : 'text-rose-400'
              }`}>
                {paymentMsg.text}
              </p>
            )}
          </div>
        </div>
      </div>
    ),

    'notifications': (
      <div className="space-y-4">
        {[
          { title: t('Attendance Alert'), msg: t("{student} was marked absent on May 20 in Calculus BC.").replace("{student}", studentName), time: t('2 days ago'), type: 'warning' },
          { title: t('Assignment Graded'), msg: t("{student} received 94% on the Chemistry Lab report.").replace("{student}", studentName), time: t('3 days ago'), type: 'success' },
          { title: t('Fee Reminder'), msg: t("Q3 tuition fee of ₹320 is due by June 30."), time: t('5 days ago'), type: 'warning' },
          { title: t('Teacher Message'), msg: t('Prof. Miller: "{student} has been doing exceptionally well in physics!"').replace("{student}", studentName), time: t('1 week ago'), type: 'info' },
        ].map((n, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
            className={`bg-slate-900 border rounded-2xl p-4 flex items-start gap-3 ${
              n.type === 'warning' ? 'border-amber-500/20' :
              n.type === 'success' ? 'border-emerald-500/20' : 'border-slate-800'
            }`}>
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
              n.type === 'warning' ? 'bg-amber-500/10' :
              n.type === 'success' ? 'bg-emerald-500/10' : 'bg-indigo-500/10'
            }`}>
              {n.type === 'warning' ? <AlertCircle className="h-4 w-4 text-amber-400" /> :
               n.type === 'success' ? <CheckCircle className="h-4 w-4 text-emerald-400" /> :
               <Bell className="h-4 w-4 text-indigo-400" />}
            </div>
            <div className="flex-1">
              <span className="text-xs font-bold text-white block">{n.title}</span>
              <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">{n.msg}</p>
              <span className="text-[9px] text-slate-600 mt-1 block">{n.time}</span>
            </div>
          </motion.div>
        ))}
      </div>
    ),

    'profile': (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 max-w-lg">
        <div className="flex items-center gap-5 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-2xl font-black text-amber-400">
            {parentName.split(' ').map(n => n[0]).join('').slice(0, 2)}
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white">{parentName}</h2>
            <span className="text-xs text-amber-400 font-bold uppercase">{t("Parent / Guardian")}</span>
          </div>
        </div>
        <div className="space-y-3">
          {[
            { label: t('Linked Student'), value: studentName },
            { label: t('Student Grade'), value: t('11th Grade') },
            { label: t('Email'), value: 'parent@edumanage.com' },
            { label: t('Phone'), value: '+1 (555) 234-5678' },
          ].map((f, i) => (
            <div key={i} className="flex justify-between py-2.5 border-b border-slate-800">
              <span className="text-[10px] font-bold text-slate-500 uppercase">{f.label}</span>
              <span className="text-xs font-semibold text-slate-200">{f.value}</span>
            </div>
          ))}
        </div>
      </div>
    ),
  };

  const pageTitles: Record<string, { title: string; subtitle: string }> = {
    progress: { title: "Child's Academic Progress", subtitle: t("Track {student}'s performance across subjects.").replace("{student}", studentName) },
    attendance: { title: 'Attendance Overview', subtitle: t("Monitor {student}'s daily attendance records.").replace("{student}", studentName) },
    fees: { title: 'Fees & Payments', subtitle: 'Track tuition invoices and outstanding dues.' },
    notifications: { title: 'Notifications', subtitle: 'Stay updated on important alerts and messages.' },
    profile: { title: 'My Profile', subtitle: 'View and update your guardian profile details.' },
  };

  const config = pageTitles[pageKey];
  if (!config || !pageContent[pageKey]) return null;

  return (
    <DashboardPage
      title={config.title}
      subtitle={config.subtitle}
      accentColor="amber"
      onBack={onBack}
    >
      {pageContent[pageKey]}
    </DashboardPage>
  );
};
