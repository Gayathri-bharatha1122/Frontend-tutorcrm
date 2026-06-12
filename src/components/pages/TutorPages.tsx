import React from 'react';
import { DashboardPage } from '../DashboardPage';
import { motion } from 'motion/react';
import { Calendar, CheckSquare, FileText, TrendingUp, User, BookOpen, Clock, Users } from 'lucide-react';
import { useLanguage } from '../../LanguageContext';

interface TutorPageProps {
  pageKey: string;
  tutorName: string;
  onBack: () => void;
  // Pass through the full TutorDashboard element for 'dashboard' case
  dashboardElement?: React.ReactNode;
}

const InfoCard: React.FC<{ label: string; value: string; sub?: string; color: string }> = ({ label, value, sub, color }) => {
  const { t } = useLanguage();
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-900 border border-slate-800 rounded-2xl p-5"
    >
      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">{t(label)}</span>
      <span className={`text-xl font-extrabold block ${color}`}>{t(value)}</span>
      {sub && <span className="text-xs text-slate-500 mt-1 block">{t(sub)}</span>}
    </motion.div>
  );
};

export const TutorPage: React.FC<TutorPageProps> = ({ pageKey, tutorName, onBack, dashboardElement }) => {
  const { t } = useLanguage();
  
  const pageContent: Record<string, React.ReactNode> = {
    'classes': (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <InfoCard label="Active Classes" value="3" sub="Physics, Mechanics, Dynamics" color="text-teal-400" />
          <InfoCard label="Total Students" value="28" sub="Across all sections" color="text-white" />
          <InfoCard label="Next Class" value="10:00 AM" sub="Physics – Studio Hall 2" color="text-indigo-400" />
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
            <Calendar className="h-4 w-4 text-teal-400" /> {t("Weekly Timetable")}
          </h3>
          {[
            { day: 'Monday', subject: 'Advanced Physics', time: '09:00 – 10:30 AM', room: 'Studio Hall 2', students: 12 },
            { day: 'Tuesday', subject: 'Quantum Mechanics', time: '11:00 AM – 12:30 PM', room: 'Lab Block 3', students: 8 },
            { day: 'Thursday', subject: 'Rotational Dynamics', time: '02:00 – 03:30 PM', room: 'Studio Hall 1', students: 8 },
          ].map((cls, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
              className="flex items-center justify-between py-3 border-b border-slate-800 last:border-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-500/10 flex items-center justify-center text-teal-400"><Clock className="h-4 w-4" /></div>
                <div>
                  <span className="text-xs font-bold text-white block">{t(cls.subject)}</span>
                  <span className="text-[10px] text-slate-500">{t(cls.day)} • {cls.time} • {t(cls.room)}</span>
                </div>
              </div>
              <span className="text-[10px] font-bold bg-teal-500/10 text-teal-400 px-2.5 py-1 rounded-full">{t("{count} Students").replace("{count}", cls.students.toString())}</span>
            </motion.div>
          ))}
        </div>
      </div>
    ),

    'attendance': (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <InfoCard label="Today's Sessions" value="2" sub="Sessions scheduled today" color="text-teal-400" />
          <InfoCard label="Avg Attendance" value="91.4%" sub="Last 30 days" color="text-emerald-400" />
          <InfoCard label="Absent Today" value="2" sub="Out of 20 students" color="text-rose-400" />
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
            <CheckSquare className="h-4 w-4 text-teal-400" /> {t("Mark Attendance")}
          </h3>
          {[
            { name: 'Marcus Thorne', grade: '11th', status: 'Present' },
            { name: 'Sarah Jenkins', grade: '11th', status: 'Present' },
            { name: 'Ethan Brooks', grade: '11th', status: 'Absent' },
            { name: 'Priya Sharma', grade: '11th', status: 'Present' },
          ].map((s, i) => (
            <div key={i} className="flex items-center justify-between py-3 border-b border-slate-800 last:border-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-teal-500/10 flex items-center justify-center text-teal-400 font-bold text-xs">{s.name[0]}</div>
                <div>
                  <span className="text-xs font-bold text-white block">{s.name}</span>
                  <span className="text-[10px] text-slate-500">{t(s.grade)} • {t("Advanced Physics")}</span>
                </div>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${s.status === 'Present' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                {t(s.status)}
              </span>
            </div>
          ))}
        </div>
      </div>
    ),

    'assignments': (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <InfoCard label="Active Assignments" value="5" sub="Currently assigned" color="text-indigo-400" />
          <InfoCard label="Pending Reviews" value="12" sub="Submissions to grade" color="text-amber-400" />
          <InfoCard label="Graded This Week" value="34" sub="Completed evaluations" color="text-emerald-400" />
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
            <FileText className="h-4 w-4 text-indigo-400" /> {t("Assignments Overview")}
          </h3>
          {[
            { title: 'Rotational Force Vector Essays', subject: 'Physics Mechanics', due: 'Jun 10', submissions: 8, total: 12 },
            { title: 'Quantum State Functions', subject: 'Quantum Dynamics', due: 'Jun 14', submissions: 3, total: 8 },
            { title: 'Electromagnetic Induction Report', subject: 'Advanced Physics', due: 'Jun 18', submissions: 10, total: 12 },
          ].map((a, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
              className="flex items-center justify-between py-3 border-b border-slate-800 last:border-0">
              <div>
                <span className="text-xs font-bold text-white block">{t(a.title)}</span>
                <span className="text-[10px] text-slate-500">{t(a.subject)} • {t("Due")} {t(a.due)}</span>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-indigo-400">{a.submissions}/{a.total}</span>
                <span className="text-[10px] text-slate-500 block">{t("Submitted")}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    ),

    'performance': (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <InfoCard label="Top Performer" value="Marcus T." sub="Average 94.5%" color="text-emerald-400" />
          <InfoCard label="Class Average" value="81.2%" sub="All subjects" color="text-indigo-400" />
          <InfoCard label="Needs Attention" value="3 Students" sub="Below 65% threshold" color="text-rose-400" />
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-teal-400" /> {t("Student Performance")}
          </h3>
          {[
            { name: 'Marcus Thorne', avg: 94.5, grade: 'A+', trend: '+2%' },
            { name: 'Sarah Jenkins', avg: 88.0, grade: 'A', trend: '+1%' },
            { name: 'Ethan Brooks', avg: 71.2, grade: 'B', trend: '-3%' },
            { name: 'Priya Sharma', avg: 82.4, grade: 'B+', trend: '+5%' },
          ].map((s, i) => (
            <div key={i} className="flex items-center justify-between py-3 border-b border-slate-800 last:border-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-teal-500/10 flex items-center justify-center text-teal-400 font-bold text-xs">{s.name[0]}</div>
                <span className="text-xs font-bold text-white">{s.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-white font-mono">{s.avg}%</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/10 text-indigo-400">{t(s.grade)}</span>
                <span className={`text-[10px] font-bold ${s.trend.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'}`}>{s.trend}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    ),

    'profile': (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 max-w-lg">
        <div className="flex items-center gap-5 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-2xl font-black text-teal-400">
            {tutorName.split(' ').map(n => n[0]).join('').slice(0, 2)}
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white">{tutorName}</h2>
            <span className="text-xs text-teal-400 font-bold uppercase">{t("Senior Faculty • Physics")}</span>
          </div>
        </div>
        <div className="space-y-3">
          {[
            { label: t('Subject'), value: t('Advanced Physics') },
            { label: t('Experience'), value: t('8 Years') },
            { label: t('Email'), value: 'tutor@edumanage.com' },
            { label: t('Students'), value: t('28 Active') },
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
    classes: { title: 'My Classes', subtitle: t('View your scheduled sessions and timetable.') },
    attendance: { title: 'Attendance', subtitle: t('Mark and track student attendance for your classes.') },
    assignments: { title: 'Assignments', subtitle: t('Manage assignment submissions and evaluations.') },
    performance: { title: 'Student Performance', subtitle: t('Track academic progress across your students.') },
    profile: { title: 'My Profile', subtitle: t('View and update your faculty profile details.') },
  };

  const config = pageTitles[pageKey];
  if (!config || !pageContent[pageKey]) return null;

  return (
    <DashboardPage
      title={config.title}
      subtitle={config.subtitle}
      accentColor="teal"
      onBack={onBack}
    >
      {pageContent[pageKey]}
    </DashboardPage>
  );
};
