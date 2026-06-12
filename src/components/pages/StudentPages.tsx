import React from 'react';
import { DashboardPage } from '../DashboardPage';
import { motion } from 'motion/react';
import { BookOpen, Calendar, FileText, TrendingUp, Award, User, CheckCircle, Clock } from 'lucide-react';
import { useLanguage } from '../../LanguageContext';

interface StudentPageProps {
  pageKey: string;
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

export const StudentPage: React.FC<StudentPageProps> = ({ pageKey, studentName, onBack }) => {
  const { t } = useLanguage();
  
  const pageContent: Record<string, React.ReactNode> = {
    'courses': (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard label="Enrolled Courses" value="4" sub="Current semester" color="text-emerald-400" />
          <StatCard label="Avg Progress" value="78%" sub="Across all courses" color="text-indigo-400" />
          <StatCard label="Completed" value="1" sub="Course completed" color="text-teal-400" />
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2"><BookOpen className="h-4 w-4 text-emerald-400" /> {t("Enrolled Courses")}</h3>
          {[
            { name: 'Advanced Physics', tutor: 'Prof. A. Miller', progress: 82, color: 'bg-emerald-500' },
            { name: 'Calculus BC', tutor: 'Prof. S. Jenkins', progress: 68, color: 'bg-indigo-500' },
            { name: 'Chemistry Honors', tutor: 'Dr. P. Sharma', progress: 91, color: 'bg-teal-500' },
            { name: 'AP Literature', tutor: 'Ms. H. Brooks', progress: 75, color: 'bg-amber-500' },
          ].map((c, i) => (
            <div key={i} className="py-3 border-b border-slate-800 last:border-0">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <span className="text-xs font-bold text-white block">{t(c.name)}</span>
                  <span className="text-[10px] text-slate-500">{t(c.tutor)}</span>
                </div>
                <span className="text-xs font-bold text-slate-300">{c.progress}%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5">
                <motion.div initial={{ width: 0 }} animate={{ width: `${c.progress}%` }} transition={{ duration: 0.8, delay: i * 0.1 }}
                  className={`h-1.5 rounded-full ${c.color}`} />
              </div>
            </div>
          ))}
        </div>
      </div>
    ),

    'assignments': (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard label="Pending" value="3" sub="Due this week" color="text-amber-400" />
          <StatCard label="Submitted" value="8" sub="Awaiting grades" color="text-indigo-400" />
          <StatCard label="Graded" value="12" sub="This semester" color="text-emerald-400" />
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2"><FileText className="h-4 w-4 text-indigo-400" /> {t("My Assignments")}</h3>
          {[
            { title: 'Rotational Kinematics Essay', subject: 'Physics', due: 'Jun 10', status: 'Pending', grade: null },
            { title: 'Integral Calculus Problem Set', subject: 'Calculus BC', due: 'Jun 12', status: 'Submitted', grade: null },
            { title: 'Titration Lab Report', subject: 'Chemistry', due: 'Jun 6', status: 'Graded', grade: '92%' },
          ].map((a, i) => (
            <div key={i} className="flex items-center justify-between py-3 border-b border-slate-800 last:border-0">
              <div>
                <span className="text-xs font-bold text-white block">{t(a.title)}</span>
                <span className="text-[10px] text-slate-500">{t(a.subject)} • {t("Due")} {t(a.due)}</span>
              </div>
              <div className="text-right">
                {a.grade && <span className="text-xs font-bold text-emerald-400 block">{t(a.grade)}</span>}
                <span className={`text-[10px] font-bold ${
                  a.status === 'Pending' ? 'text-amber-400' :
                  a.status === 'Submitted' ? 'text-indigo-400' : 'text-emerald-400'
                }`}>{t(a.status)}</span>
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
          <StatCard label="Present Days" value="19" sub="Out of 21 sessions" color="text-teal-400" />
          <StatCard label="Absent Days" value="2" sub="May 8 & May 20" color="text-rose-400" />
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2"><Calendar className="h-4 w-4 text-emerald-400" /> {t("Monthly Attendance Log")}</h3>
          {[
            { subject: 'Advanced Physics', sessions: 8, present: 8, percent: '100%' },
            { subject: 'Calculus BC', sessions: 6, present: 5, percent: '83%' },
            { subject: 'Chemistry Honors', sessions: 4, present: 4, percent: '100%' },
            { subject: 'AP Literature', sessions: 3, present: 2, percent: '67%' },
          ].map((a, i) => (
            <div key={i} className="flex items-center justify-between py-3 border-b border-slate-800 last:border-0">
              <div>
                <span className="text-xs font-bold text-white block">{t(a.subject)}</span>
                <span className="text-[10px] text-slate-500">{a.present}/{a.sessions} {t("sessions attended")}</span>
              </div>
              <span className={`text-sm font-extrabold ${parseInt(a.percent) >= 90 ? 'text-emerald-400' : parseInt(a.percent) >= 75 ? 'text-amber-400' : 'text-rose-400'}`}>
                {a.percent}
              </span>
            </div>
          ))}
        </div>
      </div>
    ),

    'results': (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard label="Overall GPA" value="3.8" sub="Out of 4.0" color="text-emerald-400" />
          <StatCard label="Best Subject" value="Chemistry" sub="91% average" color="text-teal-400" />
          <StatCard label="Class Rank" value="#4" sub="Out of 32 students" color="text-indigo-400" />
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2"><Award className="h-4 w-4 text-indigo-400" /> {t("Exam Results")}</h3>
          {[
            { exam: 'Physics Mid-Term', score: 88, grade: 'A', date: 'May 15' },
            { exam: 'Calculus Unit Test 3', score: 74, grade: 'B+', date: 'May 20' },
            { exam: 'Chemistry Lab Practical', score: 94, grade: 'A+', date: 'May 25' },
            { exam: 'Literature Essay Exam', score: 81, grade: 'A-', date: 'May 28' },
          ].map((r, i) => (
            <div key={i} className="flex items-center justify-between py-3 border-b border-slate-800 last:border-0">
              <div>
                <span className="text-xs font-bold text-white block">{t(r.exam)}</span>
                <span className="text-[10px] text-slate-500">{t(r.date)}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-extrabold text-white font-mono">{r.score}%</span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">{t(r.grade)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    ),

    'profile': (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 max-w-lg">
        <div className="flex items-center gap-5 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-2xl font-black text-emerald-400">
            {studentName.split(' ').map(n => n[0]).join('').slice(0, 2)}
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white">{studentName}</h2>
            <span className="text-xs text-emerald-400 font-bold uppercase">{t("Student")} • {t("11th Grade")}</span>
          </div>
        </div>
        <div className="space-y-3">
          {[
            { label: t('Grade'), value: t('11th Grade') },
            { label: t('Enrolled Courses'), value: t('4 Subjects') },
            { label: t('Email'), value: 'student@edumanage.com' },
            { label: t('GPA'), value: '3.8 / 4.0' },
            { label: t('Class Rank'), value: t('#4 of 32') },
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
    courses: { title: 'My Courses', subtitle: 'Track your enrolled subjects and progress.' },
    assignments: { title: 'Assignments', subtitle: 'View pending, submitted, and graded assignments.' },
    attendance: { title: 'Attendance', subtitle: 'View your attendance record across all subjects.' },
    results: { title: 'Results & Grades', subtitle: 'View exam results and academic performance.' },
    profile: { title: 'My Profile', subtitle: 'View and update your student profile.' },
  };

  const config = pageTitles[pageKey];
  if (!config || !pageContent[pageKey]) return null;

  return (
    <DashboardPage
      title={config.title}
      subtitle={config.subtitle}
      accentColor="emerald"
      onBack={onBack}
    >
      {pageContent[pageKey]}
    </DashboardPage>
  );
};
