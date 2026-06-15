import React, { useState, useEffect } from 'react';
import { DashboardPage } from '../DashboardPage';
import { motion } from 'motion/react';
import { Calendar, CheckSquare, FileText, TrendingUp, User, BookOpen, Clock, Users } from 'lucide-react';
import { useLanguage } from '../../LanguageContext';
import { api } from '../../services/api';

interface TutorPageProps {
  pageKey: string;
  tutorName: string;
  onBack: () => void;
}

interface TimetableSlot {
  id: string;
  title: string;
  schedule: string;
  room: string;
  isSpecial?: boolean;
  subject?: string;
}

const generateSlots = (courses: string[], subject: string): TimetableSlot[] => {
  const subjectLower = (subject || '').toLowerCase();
  if (subjectLower.includes('physics') && courses.includes('Physics Mechanics')) {
    return [
      { id: 'slot-1', title: 'Kinematic Vectors theory', schedule: 'Tuesdays at 3:00 PM', room: 'Room B1', subject: 'Physics' },
      { id: 'slot-2', title: 'Quantum mechanics fundamentals', schedule: 'Thursdays at 3:00 PM', room: 'Lab Hall 1', subject: 'Physics' },
      { id: 'slot-3', title: 'General electromagnetic finals prep', schedule: 'Fridays at 2:30 PM', room: 'Seminar Studio', isSpecial: true, subject: 'Physics' }
    ];
  }

  if (!courses || courses.length === 0) {
    const cleanSub = subject || 'General';
    return [
      { id: 'slot-1', title: cleanSub + ' Core Discussion', schedule: 'Tuesdays at 3:00 PM', room: 'Room B1', subject: cleanSub },
      { id: 'slot-2', title: cleanSub + ' Advanced Seminar', schedule: 'Thursdays at 3:00 PM', room: 'Lab Hall 1', subject: cleanSub },
      { id: 'slot-3', title: cleanSub + ' Comprehensive Review', schedule: 'Fridays at 2:30 PM', room: 'Seminar Studio', isSpecial: true, subject: cleanSub }
    ];
  }

  const slots: TimetableSlot[] = [];
  if (courses.length === 1) {
    const course = courses[0];
    slots.push({ id: 'slot-1', title: course + ' Analysis & Discussion', schedule: 'Tuesdays at 3:00 PM', room: 'Room B1', subject: course });
    slots.push({ id: 'slot-2', title: course + ' Core Concepts Study', schedule: 'Thursdays at 3:00 PM', room: 'Lab Hall 1', subject: course });
    slots.push({ id: 'slot-3', title: course + ' Revision & Exam Prep', schedule: 'Fridays at 2:30 PM', room: 'Seminar Studio', isSpecial: true, subject: course });
  } else if (courses.length === 2) {
    slots.push({ id: 'slot-1', title: courses[0] + ' Core Seminar', schedule: 'Tuesdays at 3:00 PM', room: 'Room B1', subject: courses[0] });
    slots.push({ id: 'slot-2', title: courses[1] + ' Practical Review', schedule: 'Thursdays at 3:00 PM', room: 'Lab Hall 1', subject: courses[1] });
    slots.push({ id: 'slot-3', title: courses[0] + ' Advanced Prep', schedule: 'Fridays at 2:30 PM', room: 'Seminar Studio', isSpecial: true, subject: courses[0] });
  } else {
    slots.push({ id: 'slot-1', title: courses[0] + ' Concept Theory', schedule: 'Tuesdays at 3:00 PM', room: 'Room B1', subject: courses[0] });
    slots.push({ id: 'slot-2', title: courses[1] + ' Advanced Workshop', schedule: 'Thursdays at 3:00 PM', room: 'Lab Hall 1', subject: courses[1] });
    slots.push({ id: 'slot-3', title: courses[2] + ' Final Prep Seminar', schedule: 'Fridays at 2:30 PM', room: 'Seminar Studio', isSpecial: true, subject: courses[2] });
  }
  return slots;
};

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

export const TutorPage: React.FC<TutorPageProps> = ({ pageKey, tutorName, onBack }) => {
  const { t } = useLanguage();
  
  const [students, setStudents] = useState<any[]>([]);
  const [tutorProfile, setTutorProfile] = useState<any>(null);
  const [tutorCourses, setTutorCourses] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profile, studentsData] = await Promise.all([
          api.getTutorProfile(),
          api.getTutorStudents()
        ]);
        setTutorProfile(profile);
        setTutorCourses(profile.courses || []);
        setStudents(studentsData);
      } catch (err) {
        console.error("Failed to load tutor page data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <DashboardPage title="..." subtitle="..." accentColor="teal" onBack={onBack}>
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </DashboardPage>
    );
  }

  const generatedSlots = generateSlots(tutorCourses, tutorProfile?.subject || '');
  
  // Dynamic metrics computations
  const activeClassesCount = tutorCourses.length.toString();
  const activeClassesSub = tutorCourses.join(', ') || t('None assigned');
  const nextClassTime = generatedSlots[0]?.schedule.split(' at ')[1] || '10:00 AM';
  const nextClassSub = generatedSlots[0] ? (generatedSlots[0].title + ' – ' + generatedSlots[0].room) : 'No classes';

  const timetableItems = generatedSlots.map(slot => {
    const parts = slot.schedule.split(' at ');
    return {
      day: parts[0] || 'Tuesday',
      subject: slot.title,
      time: parts[1] || '3:00 PM',
      room: slot.room,
      students: students.length
    };
  });

  const avgAttendanceRate = students.length > 0
    ? (students.reduce((acc, s) => acc + (s.attendanceRate || 95), 0) / students.length).toFixed(1) + '%'
    : '95%';
  const absentCount = students.filter(s => (s.attendanceRate || 95) < 80).length.toString();

  const getDynamicAssignments = (subject: string, studentsCount: number) => {
    const subLower = (subject || '').toLowerCase();
    if (subLower.includes('english') || subLower.includes('literature') || subLower.includes('ap literature') || subLower.includes('ap english')) {
      return [
        { title: 'Shakespearean Tragedy Essay Analysis', subject: 'AP Literature', due: 'Jun 10', submissions: Math.round(studentsCount * 0.8), total: studentsCount },
        { title: 'Victorian Prose Reading Log', subject: 'AP Literature', due: 'Jun 14', submissions: Math.round(studentsCount * 0.5), total: studentsCount },
        { title: 'Modern Poetry Critique Paper', subject: 'AP Literature', due: 'Jun 18', submissions: Math.round(studentsCount * 0.9), total: studentsCount },
      ];
    }
    if (subLower.includes('math') || subLower.includes('calculus') || subLower.includes('algebra')) {
      return [
        { title: 'Calculus Integration Techniques Homework', subject: 'Calculus BC', due: 'Jun 10', submissions: Math.round(studentsCount * 0.85), total: studentsCount },
        { title: 'Limits & Continuity Practice Quiz', subject: 'Calculus BC', due: 'Jun 14', submissions: Math.round(studentsCount * 0.6), total: studentsCount },
        { title: 'Derivatives Real-world Application', subject: 'Calculus BC', due: 'Jun 18', submissions: Math.round(studentsCount * 0.95), total: studentsCount },
      ];
    }
    if (subLower.includes('chem') || subLower.includes('chemistry')) {
      return [
        { title: 'Organic Reactions & Synthesis Report', subject: 'AP Chemistry', due: 'Jun 10', submissions: Math.round(studentsCount * 0.8), total: studentsCount },
        { title: 'Acid-Base Equilibria Theory Quiz', subject: 'AP Chemistry', due: 'Jun 14', submissions: Math.round(studentsCount * 0.5), total: studentsCount },
        { title: 'Stoichiometry Lab Experiment', subject: 'AP Chemistry', due: 'Jun 18', submissions: Math.round(studentsCount * 0.9), total: studentsCount },
      ];
    }
    return [
      { title: 'Rotational Force Vector Essays', subject: 'Physics Mechanics', due: 'Jun 10', submissions: Math.round(studentsCount * 0.8), total: studentsCount },
      { title: 'Quantum State Functions', subject: 'Quantum Dynamics', due: 'Jun 14', submissions: Math.round(studentsCount * 0.5), total: studentsCount },
      { title: 'Electromagnetic Induction Report', subject: 'Advanced Physics', due: 'Jun 18', submissions: Math.round(studentsCount * 0.9), total: studentsCount },
    ];
  };

  const assignmentsList = getDynamicAssignments(tutorProfile?.subject || '', students.length);

  const performanceItems = students.map((s, idx) => {
    const avgScore = Math.min(100, Math.max(60, s.attendanceRate - 2 + (s.name.length % 10)));
    let letterGrade = 'B';
    if (avgScore >= 93) letterGrade = 'A+';
    else if (avgScore >= 87) letterGrade = 'A';
    else if (avgScore >= 80) letterGrade = 'B+';
    else if (avgScore >= 70) letterGrade = 'B';
    else letterGrade = 'C';

    const trendVal = (s.name.length % 4) - 1;
    const trend = trendVal >= 0 ? `+${trendVal + 1}%` : `${trendVal}%`;

    return {
      name: s.name,
      avg: avgScore,
      grade: letterGrade,
      trend: trend,
      gradeLevel: s.grade,
      subject: s.subject
    };
  });

  const sortedPerformance = [...performanceItems].sort((a, b) => b.avg - a.avg);
  const topPerformerName = sortedPerformance[0]?.name || 'N/A';
  const topPerformerAvg = sortedPerformance[0] ? `Average ${sortedPerformance[0].avg}%` : 'N/A';
  
  const classAvgScore = students.length > 0
    ? (performanceItems.reduce((acc, item) => acc + item.avg, 0) / students.length).toFixed(1) + '%'
    : '85.0%';
  const needsAttentionCount = performanceItems.filter(item => item.avg < 75).length.toString();

  const pageContent: Record<string, React.ReactNode> = {
    'classes': (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <InfoCard label="Active Classes" value={activeClassesCount} sub={activeClassesSub} color="text-teal-400" />
          <InfoCard label="Total Students" value={students.length.toString()} sub="Across all sections" color="text-white" />
          <InfoCard label="Next Class" value={nextClassTime} sub={nextClassSub} color="text-indigo-400" />
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
            <Calendar className="h-4 w-4 text-teal-400" /> {t("Weekly Timetable")}
          </h3>
          {timetableItems.map((cls, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
              className="flex items-center justify-between py-3 border-b border-slate-800 last:border-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-500/10 flex items-center justify-center text-teal-400"><Clock className="h-4 w-4" /></div>
                <div>
                  <span className="text-xs font-bold text-white block">{t(cls.subject)}</span>
                  <span className="text-[10px] text-slate-550">{t(cls.day)} • {cls.time} • {t(cls.room)}</span>
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
          <InfoCard label="Today's Sessions" value={generatedSlots.length.toString()} sub="Sessions scheduled today" color="text-teal-400" />
          <InfoCard label="Avg Attendance" value={avgAttendanceRate} sub="Last 30 days" color="text-emerald-400" />
          <InfoCard label="Absent Today" value={absentCount} sub="Below standard attendance" color="text-rose-400" />
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
            <CheckSquare className="h-4 w-4 text-teal-400" /> {t("Mark Attendance")}
          </h3>
          {students.map((s, i) => (
            <div key={i} className="flex items-center justify-between py-3 border-b border-slate-800 last:border-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-teal-500/10 flex items-center justify-center text-teal-400 font-bold text-xs">{s.name[0]}</div>
                <div>
                  <span className="text-xs font-bold text-white block">{s.name}</span>
                  <span className="text-[10px] text-slate-550">{t(s.grade)} • {t(s.subject)}</span>
                </div>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${s.attendanceRate >= 80 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                {t(s.attendanceRate >= 80 ? 'Present' : 'Absent')}
              </span>
            </div>
          ))}
        </div>
      </div>
    ),

    'assignments': (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <InfoCard label="Active Assignments" value={assignmentsList.length.toString()} sub="Currently assigned" color="text-indigo-400" />
          <InfoCard label="Pending Reviews" value={(students.length * 2).toString()} sub="Submissions to grade" color="text-amber-400" />
          <InfoCard label="Graded This Week" value={(students.length * 3).toString()} sub="Completed evaluations" color="text-emerald-400" />
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
            <FileText className="h-4 w-4 text-indigo-400" /> {t("Assignments Overview")}
          </h3>
          {assignmentsList.map((a, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
              className="flex items-center justify-between py-3 border-b border-slate-800 last:border-0">
              <div>
                <span className="text-xs font-bold text-white block">{t(a.title)}</span>
                <span className="text-[10px] text-slate-550">{t(a.subject)} • {t("Due")} {t(a.due)}</span>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-indigo-400">{a.submissions}/{a.total}</span>
                <span className="text-[10px] text-slate-550 block">{t("Submitted")}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    ),

    'performance': (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <InfoCard label="Top Performer" value={topPerformerName} sub={topPerformerAvg} color="text-emerald-400" />
          <InfoCard label="Class Average" value={classAvgScore} sub="All active courses" color="text-indigo-400" />
          <InfoCard label="Needs Attention" value={needsAttentionCount + (needsAttentionCount === '1' ? ' Student' : ' Students')} sub="Below 75% standard" color="text-rose-400" />
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-teal-400" /> {t("Student Performance")}
          </h3>
          {performanceItems.map((s, i) => (
            <div key={i} className="flex items-center justify-between py-3 border-b border-slate-800 last:border-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-teal-500/10 flex items-center justify-center text-teal-400 font-bold text-xs">{s.name[0]}</div>
                <div>
                  <span className="text-xs font-bold text-white block">{s.name}</span>
                  <span className="text-[10px] text-slate-550">{t(s.gradeLevel)} • {t(s.subject)}</span>
                </div>
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
            <span className="text-xs text-teal-400 font-bold uppercase">{t("Senior Faculty • " + (tutorProfile?.subject?.split('&')[0]?.trim() || 'Physics'))}</span>
          </div>
        </div>
        <div className="space-y-3">
          {[
            { label: t('Subject'), value: tutorProfile?.subject || t('Advanced Physics') },
            { label: t('Experience'), value: tutorProfile?.experience || '8 Years' },
            { label: t('Email'), value: tutorName.toLowerCase().replace(/\s+/g, '.') + '@edumanage.com' },
            { label: t('Students'), value: students.length.toString() + ' Active' },
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
