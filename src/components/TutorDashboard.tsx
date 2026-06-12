import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  Calendar, 
  BookOpen, 
  CheckCircle, 
  Award, 
  Clock, 
  Plus, 
  Sparkles, 
  Check, 
  MessageSquare,
  ChevronRight,
  ArrowRight,
  Info,
  X
} from 'lucide-react';
import { Student, Teacher } from '../types';
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

interface TutorDashboardProps {
  tutorName: string;
  currentPath?: string;
  onLogout: () => void;
  onHome: () => void;
}

interface TimetableSlot {
  id: string;
  title: string;
  schedule: string;
  room: string;
  isSpecial?: boolean;
  subject?: string;
}

const TIMETABLE_SLOTS: TimetableSlot[] = [
  { id: 'slot-1', title: 'Kinematic Vectors theory', schedule: 'Tuesdays at 3:00 PM', room: 'Room B1', subject: 'Physics' },
  { id: 'slot-2', title: 'Quantum mechanics fundamentals', schedule: 'Thursdays at 3:00 PM', room: 'Lab Hall 1', subject: 'Physics' },
  { id: 'slot-3', title: 'General electromagnetic finals prep', schedule: 'Fridays at 2:30 PM', room: 'Seminar Studio', isSpecial: true, subject: 'Physics' }
];

export const TutorDashboard: React.FC<TutorDashboardProps> = ({
  tutorName,
  currentPath,
  onLogout,
  onHome
}) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [publishedQuizzes, setPublishedQuizzes] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const studentsData = await api.getTutorStudents();
        setStudents(studentsData);
      } catch (err) {
        console.error("Failed to load tutor data", err);
      }
    };
    fetchData();
  }, []);
  const { t } = useLanguage();
  
  // Date and Time Slot selectors state
  const [selectedDate, setSelectedDate] = useState<string>('2026-06-03');
  const [selectedSlotId, setSelectedSlotId] = useState<string>('');
  const [tutorCourses, setTutorCourses] = useState<string[]>([]);
  const [filteredSlots, setFilteredSlots] = useState<TimetableSlot[]>([]);
  const [allSameSubject, setAllSameSubject] = useState<boolean>(false);

  const [tutorProfile, setTutorProfile] = useState<any>(null);

  // Fetch tutor profile to determine courses
  useEffect(() => {
    const fetchTutorProfile = async () => {
      try {
        const profile = await api.getTutorProfile();
        setTutorProfile(profile);
        setTutorCourses(profile.courses || []);
      } catch (err) {
        console.error('Failed to load tutor profile', err);
      }
    };
    fetchTutorProfile();
  }, []);

  // Update filtered slots when courses or slots list change
  useEffect(() => {
    let slotsToUse = TIMETABLE_SLOTS;
    
    if (tutorCourses.length > 0) {
      const baseSubject = tutorCourses[0].split(' ')[0].toLowerCase();
      const matched = TIMETABLE_SLOTS.filter(slot =>
        slot.subject && slot.subject.toLowerCase() === baseSubject
      );
      if (matched.length > 0) {
        slotsToUse = matched;
      }
    }

    setFilteredSlots(slotsToUse);
    setSelectedSlotId(slotsToUse[0]?.id || '');
    
    const subjects = new Set(slotsToUse.map(s => s.subject?.toLowerCase()).filter(Boolean));
    setAllSameSubject(subjects.size === 1);
  }, [tutorCourses]);

  // Structured attendance: Record<date, Record<slotId, Record<studentId, status>>>
  const [attendanceRecords, setAttendanceRecords] = useState<Record<string, Record<string, Record<string, 'Present' | 'Absent' | 'Excused'>>>>({
    '2026-06-03': {
      'slot-1': { ST001: 'Present', ST002: 'Present', ST003: 'Present', ST004: 'Present' },
      'slot-2': { ST001: 'Present', ST002: 'Absent', ST003: 'Present', ST004: 'Present' },
      'slot-3': { ST001: 'Present', ST002: 'Present', ST003: 'Excused', ST004: 'Present' }
    }
  });

  const getStudentStatus = (studentId: string): 'Present' | 'Absent' | 'Excused' => {
    return attendanceRecords[selectedDate]?.[selectedSlotId]?.[studentId] || 'Present';
  };

  const handleAttendanceChange = (studentId: string, status: 'Present' | 'Absent' | 'Excused') => {
    setAttendanceRecords(prev => {
      const dateRecords = prev[selectedDate] || {};
      const slotRecords = dateRecords[selectedSlotId] || {};
      return {
        ...prev,
        [selectedDate]: {
          ...dateRecords,
          [selectedSlotId]: {
            ...slotRecords,
            [studentId]: status
          }
        }
      };
    });
  };

  const handleSubmitAttendance = () => {
    const slot = filteredSlots.find(s => s.id === selectedSlotId);
    if (!slot) return;
    setAssignedSuccessMsg(
      t('Attendance roll for "{title}" on {date} submitted successfully. Parent notifications dispatched.')
        .replace('{title}', t(slot.title))
        .replace('{date}', selectedDate)
    );
    setTimeout(() => setAssignedSuccessMsg(null), 5000);
  };
  
  // Custom grading states
  const [selectedStudentId, setSelectedStudentId] = useState('ST001');
  const [assignmentName, setAssignmentName] = useState('Rotational Force Vector Essays');
  const [gradeScore, setGradeScore] = useState(90);
  const [gradeFeedback, setGradeFeedback] = useState('Fabulous conceptual formulation of inertia variables! Continue high fidelity research.');
  const [isGradingCompiled, setIsGradingCompiled] = useState(false);
  const [assignedSuccessMsg, setAssignedSuccessMsg] = useState<string | null>(null);

  // Scheduling states
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [lectureTitle, setLectureTitle] = useState('Quantum Dynamics Core vectors');
  const [lectureDate, setLectureDate] = useState('June 10, 2026');
  const [lectureTime, setLectureTime] = useState('03:00 PM');
  const [lectureLocation, setLectureLocation] = useState('Studio Hall 3');

  const handleGradeAssignmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const student = students.find(s => s.id === selectedStudentId);
    if (!student) return;

    setIsGradingCompiled(true);
    setTimeout(() => {
      setIsGradingCompiled(false);
      setAssignedSuccessMsg(
        t('Successfully logged assignment score of {score}% for "{name}". Progress metrics updated.')
          .replace('{score}', gradeScore.toString())
          .replace('{name}', student.name)
      );
      setTimeout(() => setAssignedSuccessMsg(null), 4000);
    }, 1500);
  };

  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowScheduleModal(false);
    setAssignedSuccessMsg(
      t('Scheduled lectures on "{title}" hosted on {date} at {time} successfully.')
        .replace('{title}', lectureTitle)
        .replace('{date}', lectureDate)
        .replace('{time}', lectureTime)
    );
    setTimeout(() => setAssignedSuccessMsg(null), 4000);
  };

  // Quiz Builder states
  const [quizSubject, setQuizSubject] = useState('Physics Mechanics');
  const [quizTitle, setQuizTitle] = useState('Rotational Motion Basics');
  const [quizQuestions, setQuizQuestions] = useState<Array<{
    id: number;
    text: string;
    options: string[];
    correctAnswer: string;
  }>>([
    {
      id: 1,
      text: 'What is the unit of angular momentum?',
      options: ['kg m²/s', 'kg m/s', 'N m', 'J s²'],
      correctAnswer: 'A'
    }
  ]);
  
  // Current question inputs
  const [newQuestionText, setNewQuestionText] = useState('');
  const [optionA, setOptionA] = useState('');
  const [optionB, setOptionB] = useState('');
  const [optionC, setOptionC] = useState('');
  const [optionD, setOptionD] = useState('');
  const [correctOption, setCorrectOption] = useState('A');

  const handleAddQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionText.trim() || !optionA.trim() || !optionB.trim() || !optionC.trim() || !optionD.trim()) return;

    const newQuestion = {
      id: Date.now(),
      text: newQuestionText,
      options: [optionA, optionB, optionC, optionD],
      correctAnswer: correctOption
    };

    setQuizQuestions(prev => [...prev, newQuestion]);
    
    // Clear question inputs
    setNewQuestionText('');
    setOptionA('');
    setOptionB('');
    setOptionC('');
    setOptionD('');
    setCorrectOption('A');
  };

  const handleSaveQuiz = async () => {
    if (!quizTitle.trim() || quizQuestions.length === 0) return;

    try {
      await api.publishQuiz({
        title: quizTitle,
        subject: quizSubject,
        questions: quizQuestions
      });

      setPublishedQuizzes(prev => [
        { id: `q-${Date.now()}`, title: quizTitle, subject: quizSubject, questionsCount: quizQuestions.length, questions: quizQuestions },
        ...prev
      ]);
      setAssignedSuccessMsg(
        t('Successfully published "{title}" for {subject} with {count} questions.')
          .replace('{title}', quizTitle)
          .replace('{subject}', t(quizSubject))
          .replace('{count}', quizQuestions.length.toString())
      );
      
      // Reset quiz inputs
      setQuizTitle('');
      setQuizQuestions([]);
    } catch (err: any) {
      alert(`Error publishing quiz: ${err.message}`);
    }
  };

  const handleRemoveQuestion = (id: number) => {
    setQuizQuestions(prev => prev.filter(q => q.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      
      {/* Navigation Headers */}
      <nav className="border-b border-slate-900 bg-slate-950/80 backdrop-blur sticky top-0 z-40">
        <div className="w-full px-4 sm:px-8 lg:px-12 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-600 flex items-center justify-center animate-spin [animation-duration:10s]">
              <Users className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="font-sans font-bold text-base text-white tracking-tight">{t('EduManage Tutor')}</span>
              <span className="text-[10px] block text-slate-500 font-semibold uppercase">{t('Academic Command')}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <span className="text-xs font-bold text-slate-200 block">{tutorName}</span>
                <span className="text-[10px] text-teal-400 font-bold uppercase font-mono">{t('Senior Instructor Faculty')}</span>
              </div>
              <LanguageSelector />
              <button 
                onClick={onHome}
                className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-slate-200 font-semibold rounded-lg transition overflow-hidden cursor-pointer"
              >
                {t('Home')}
              </button>
              {/* Sign Out option removed */}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Containers */}
      <main className="w-full px-4 sm:px-8 lg:px-12 py-8 space-y-8 relative z-10">
        
        {/* Dynamic Success alerts */}
        <AnimatePresence>
          {assignedSuccessMsg && (
            <motion.div 
              initial={{ height: 0, opacity: 0, y: -10 }}
              animate={{ height: 'auto', opacity: 1, y: 0 }}
              exit={{ height: 0, opacity: 0, y: -10 }}
              className="bg-teal-600 border border-teal-500/30 rounded-2xl p-4 text-white text-xs font-bold flex items-center justify-between shadow-xl"
            >
              <div className="flex items-center gap-2">
                <CheckCircle className="h-3.5 w-3.5" />
                <span>{assignedSuccessMsg}</span>
              </div>
              <button onClick={() => setAssignedSuccessMsg(null)}>
                <X className="h-4 w-4 text-teal-200 hover:text-white" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Highlight Stats summaries and classroom scheduling hooks */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1">
            <span className="text-xs font-bold text-teal-400 uppercase tracking-widest block">{t('Senior Instructor Control')}</span>
            <h2 className="text-2xl font-bold text-white">{t('Daily Command Space')} – {tutorName}</h2>
            <p className="text-slate-400 text-xs">{t('Manage active pupil attendances, input assignment metrics, and dispatch calendar coordinates.')}</p>
            {tutorProfile && (
              <div className="flex items-center gap-3 mt-2 text-xs">
                <span className="flex items-center gap-1.5 bg-slate-950 border border-slate-850 px-2.5 py-1 rounded-lg">
                  <span className="text-[10px] text-slate-500 font-bold uppercase">{t('Tutor Attendance:')}</span>
                  <span className="font-mono font-bold text-teal-400">{tutorProfile.attendance || '96%'}</span>
                </span>
                <span className="flex items-center gap-1.5 bg-slate-950 border border-slate-850 px-2.5 py-1 rounded-lg">
                  <span className="text-[10px] text-slate-500 font-bold uppercase">{t('Salary Status:')}</span>
                  <span className={`font-mono font-bold px-1.5 py-0.5 rounded text-[10px] ${
                    tutorProfile.salaryStatus === 'Credited' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-450'
                  }`}>
                    {t(tutorProfile.salaryStatus || 'Pending')}
                  </span>
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto shrink-0">
            <button
              onClick={() => setShowScheduleModal(true)}
              className="px-4 py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all hover:scale-[1.02] active:scale-[0.98] btn-shine-effect btn-ripple shadow-lg shadow-teal-600/15 cursor-pointer"
            >
              <Plus className="h-4 w-4" /> {t('Schedule seminar session')}
            </button>
          </div>
        </div>

        {/* Interactive Attendance checklist and Assigment grading tools splitting */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                  {/* Daily classroom checklist - Left */}
          <div className="lg:col-span-3 bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="border-b border-slate-850 pb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">{t('Mark Classroom Attendance Roll')}</h3>
                  <span className="text-[10px] text-slate-500">{t('Record classroom absences instantly for automatic parent sync')}</span>
                </div>
                <span className="text-[10px] font-bold text-teal-400 bg-teal-500/10 px-2.5 py-1 rounded">{t('Daily Standard Journal')}</span>
              </div>

              {/* Date and Time Slot selectors with premium styling */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-950/60 p-4 border border-slate-850/60 rounded-2xl">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    {t('Select Date')}
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 text-xs px-3 py-2 rounded-xl outline-none focus:border-teal-500 text-slate-200 transition-all font-medium"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    {t('Lecture Slot')}
                  </label>
                  {allSameSubject ? (
                      <div className="py-2 text-slate-200 font-medium">{t('{subject} Attendance').replace('{subject}', t(filteredSlots[0].subject ?? 'Course'))}</div>
                    ) : (
                      filteredSlots.length === 1 ? (
                        <div className="py-2 text-slate-200 font-medium">{t(filteredSlots[0].title)} ({t(filteredSlots[0].schedule).replace(' at ', ' @ ')})</div>
                      ) : (
                        <select
                          value={selectedSlotId}
                          onChange={(e) => setSelectedSlotId(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 text-xs px-3 py-2 rounded-xl outline-none focus:border-teal-500 text-slate-300 transition-all font-medium"
                        >
                          {filteredSlots.map(slot => (
                            <option key={slot.id} value={slot.id}>
                              {t(slot.title)} ({t(slot.schedule).replace(' at ', ' @ ')})
                            </option>
                          ))}
                        </select>
                      )
                    )}
                </div>
              </div>

              <div className="divide-y divide-slate-850">
                {students.slice(0, 4).map((student, sIdx) => (
                  <motion.div 
                    key={student.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(sIdx * 0.05, 0.4), duration: 0.3 }}
                    className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-950/20 px-2.5 transition rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-950 border border-slate-850 flex items-center justify-center font-bold text-teal-400">
                        {student.name[0]}
                      </div>
                      <div>
                        <span className="text-xs font-bold text-white block">{student.name}</span>
                        <span className="text-[10px] text-slate-500 block">{t(student.grade)} • {t('Registered in Advanced physics')}</span>
                      </div>
                    </div>

                    {/* Attendance status togglers */}
                    <div className="flex bg-slate-950 p-1 border border-slate-850 rounded-lg text-[10px] font-bold">
                      {(['Present', 'Absent', 'Excused'] as const).map((status) => (
                        <button
                          key={status}
                          onClick={() => handleAttendanceChange(student.id, status)}
                          className={`px-2.5 py-1 rounded-md cursor-pointer transition ${
                            getStudentStatus(student.id) === status 
                              ? 'bg-teal-600 text-white' 
                              : 'text-slate-500 hover:text-slate-300'
                          }`}
                        >
                          {t(status)}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-slate-850 space-y-4">
              <div className="flex justify-end">
                <button
                  onClick={handleSubmitAttendance}
                  className="px-4 py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-teal-600/15 hover:scale-[1.02] active:scale-[0.98] transition cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="h-4 w-4" /> {t('Submit Attendance Roll')}
                </button>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-500">
                <span>{t('Automatic notification dispatched to parents upon attendance submissions.')}</span>
                <span className="text-teal-400 hover:underline cursor-pointer font-bold flex items-center gap-0.5">
                  {t('Review Historical Attendance Ledger')} <ChevronRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </div>
          </div>

          {/* Assignment grader panel - Right */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6">
            <div className="mb-4">
              <h3 className="text-xs font-bold text-white uppercase tracking-widest text-teal-400 mb-1">{t('Evaluate Assignment Draft')}</h3>
              <h4 className="text-sm font-bold text-white">{t('Record Curricular Grades and Feedback')}</h4>
            </div>

            <form onSubmit={handleGradeAssignmentSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">{t('Select Student Profile *')}</label>
                <select
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  className="w-full bg-slate-955 border border-slate-855 text-xs p-2.5 rounded-xl outline-none focus:border-teal-500 text-slate-350"
                >
                  {students.slice(0, 4).map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({t(s.grade)})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">{t('Assignment Description *')}</label>
                <input
                  type="text"
                  required
                  value={assignmentName}
                  onChange={(e) => setAssignmentName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850 text-xs p-2.5 rounded-xl outline-none focus:border-teal-500 text-slate-200"
                  placeholder={t("Rotational Force kinematic Essays")}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase">{t('Assessment Score *')}</label>
                  <span className="text-xs font-bold text-teal-400 font-mono">{gradeScore}% ({t('Grade A')})</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={gradeScore}
                  onChange={(e) => setGradeScore(Number(e.target.value))}
                  className="w-full accent-teal-500 h-1 bg-slate-950 rounded-lg outline-none cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">{t('Feedback Notation / Teacher Comments')}</label>
                <textarea
                  value={gradeFeedback}
                  onChange={(e) => setGradeFeedback(e.target.value)}
                  rows={2}
                  className="w-full bg-slate-955 border border-slate-855 text-slate-200 text-xs p-3 rounded-xl focus:border-teal-500 outline-none transition resize-none"
                  placeholder={t("Record pedagogical instructions...")}
                />
              </div>

              {isGradingCompiled ? (
                <div className="p-3 bg-teal-950/20 border border-teal-500/20 text-teal-400 text-xs font-semibold rounded-xl flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
                  <span>{t('Logging score metrics to campus registry...')}</span>
                </div>
              ) : (
                <button
                  type="submit"
                  className="w-full py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs rounded-xl cursor-pointer shadow-lg shadow-teal-600/10 transition flex items-center justify-center gap-1.5"
                >
                  {t('Compile & Log Evaluation')} <ArrowRight className="h-4 w-4" />
                </button>
              )}
            </form>
          </div>

        </div>

        {/* Student Attendance Overview Section */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
          <div className="border-b border-slate-850 pb-4 mb-6">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Users className="h-5 w-5 text-teal-400 animate-pulse" /> {t('Student Attendance Overview')}
            </h3>
            <span className="text-[11px] text-slate-550">{t('Overview of student details, enrolled course tracks, and cumulative attendance rates')}</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-850 text-slate-500">
                  <th className="pb-3 font-bold uppercase text-[9px] tracking-wider">{t('Student Name')}</th>
                  <th className="pb-3 font-bold uppercase text-[9px] tracking-wider">{t('Grade Level')}</th>
                  <th className="pb-3 font-bold uppercase text-[9px] tracking-wider">{t('Course Track')}</th>
                  <th className="pb-3 font-bold uppercase text-[9px] tracking-wider text-right">{t('Attendance Rate')}</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student: any, idx) => (
                  <tr key={student.id || idx} className="border-b border-slate-900/50 hover:bg-slate-900/10 transition-colors">
                    <td className="py-3.5 flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-slate-950 border border-slate-850 flex items-center justify-center font-bold text-teal-400">
                        {student.name[0]}
                      </div>
                      <span className="font-bold text-white">{student.name}</span>
                    </td>
                    <td className="py-3.5 text-slate-300">{t(student.grade)}</td>
                    <td className="py-3.5 text-slate-400 max-w-xs truncate" title={t(student.subject)}>{t(student.subject)}</td>
                    <td className="py-3.5 text-right font-mono font-bold">
                      <span className={`px-2 py-0.5 rounded text-[10px] ${
                        student.attendanceRate >= 85 ? 'bg-emerald-500/15 text-emerald-400' :
                        student.attendanceRate >= 70 ? 'bg-indigo-500/15 text-indigo-400' :
                        'bg-amber-500/15 text-amber-450'
                      }`}>
                        {student.attendanceRate}%
                      </span>
                    </td>
                  </tr>
                ))}
                {students.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-4 text-center text-slate-550 italic">{t('No assigned students found.')}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Interactive Quiz Builder & Composer */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
          <div className="border-b border-slate-850 pb-4 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-teal-400 uppercase tracking-widest block bg-teal-500/10 w-max px-2.5 py-0.5 rounded-md">
                {t('Quiz Workshop')}
              </span>
              <h3 className="text-lg font-bold text-white flex items-center gap-1.5">
                <BookOpen className="h-5 w-5 text-teal-400" /> {t('Prepare Subject Quiz')}
              </h3>
              <p className="text-slate-400 text-xs">{t('Create multi-choice questionnaires to dispatch directly to active student portals.')}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Question Composer Form */}
            <div className="space-y-4 bg-slate-950/60 p-5 rounded-2xl border border-slate-850/60">
              <h4 className="text-xs font-bold text-teal-400 uppercase tracking-widest">{t('Composer Settings')}</h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">{t('Subject Category *')}</label>
                  <select
                    value={quizSubject}
                    onChange={(e) => setQuizSubject(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-850 text-xs p-2.5 rounded-xl outline-none focus:border-teal-500 text-slate-350"
                  >
                    <option value="Physics Mechanics">{t('Physics Mechanics')}</option>
                    <option value="Quantum Dynamics">{t('Quantum Dynamics')}</option>
                    <option value="Calculus BC">{t('Calculus BC')}</option>
                    <option value="Electromagnetism">{t('Electromagnetism')}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">{t('Quiz Title *')}</label>
                  <input
                    type="text"
                    required
                    value={quizTitle}
                    onChange={(e) => setQuizTitle(e.target.value)}
                    placeholder={t("e.g. Rotational Kinematics Quiz")}
                    className="w-full bg-slate-955 border border-slate-855 text-xs p-2.5 rounded-xl outline-none focus:border-teal-500 text-slate-200"
                  />
                </div>
              </div>

              <div className="border-t border-slate-850/60 pt-4 space-y-4">
                <h5 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{t('Add a Question')}</h5>
                
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">{t('Question Text *')}</label>
                  <input
                    type="text"
                    value={newQuestionText}
                    onChange={(e) => setNewQuestionText(e.target.value)}
                    placeholder={t("Enter question description...")}
                    className="w-full bg-slate-955 border border-slate-855 text-xs p-2.5 rounded-xl outline-none focus:border-teal-500 text-slate-200"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-550 uppercase mb-1">{t('Option A *')}</label>
                    <input
                      type="text"
                      value={optionA}
                      onChange={(e) => setOptionA(e.target.value)}
                      placeholder={t("Choice A")}
                      className="w-full bg-slate-950 border border-slate-850 text-xs p-2 rounded-xl outline-none focus:border-teal-500 text-slate-300"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-550 uppercase mb-1">{t('Option B *')}</label>
                    <input
                      type="text"
                      value={optionB}
                      onChange={(e) => setOptionB(e.target.value)}
                      placeholder={t("Choice B")}
                      className="w-full bg-slate-950 border border-slate-850 text-xs p-2 rounded-xl outline-none focus:border-teal-500 text-slate-300"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-550 uppercase mb-1">{t('Option C *')}</label>
                    <input
                      type="text"
                      value={optionC}
                      onChange={(e) => setOptionC(e.target.value)}
                      placeholder={t("Choice C")}
                      className="w-full bg-slate-950 border border-slate-850 text-xs p-2 rounded-xl outline-none focus:border-teal-500 text-slate-300"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-550 uppercase mb-1">{t('Option D *')}</label>
                    <input
                      type="text"
                      value={optionD}
                      onChange={(e) => setOptionD(e.target.value)}
                      placeholder={t("Choice D")}
                      className="w-full bg-slate-950 border border-slate-850 text-xs p-2 rounded-xl outline-none focus:border-teal-500 text-slate-300"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase">{t('Correct Option:')}</label>
                    <select
                      value={correctOption}
                      onChange={(e) => setCorrectOption(e.target.value)}
                      className="bg-slate-950 border border-slate-850 text-xs p-1.5 rounded-lg outline-none focus:border-teal-500 text-slate-300 font-bold"
                    >
                      <option>A</option>
                      <option>B</option>
                      <option>C</option>
                      <option>D</option>
                    </select>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddQuestion}
                    className="px-3.5 py-2 bg-slate-900 hover:bg-slate-855 border border-slate-800 text-teal-400 hover:text-teal-300 text-xs font-bold rounded-xl transition cursor-pointer flex items-center gap-1"
                  >
                    <Plus className="h-4 w-4" /> {t('Add Question')}
                  </button>
                </div>
              </div>
            </div>

            {/* Live Preview Panel */}
            <div className="space-y-4 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-850 pb-2">
                  <h4 className="text-xs font-bold text-teal-400 uppercase tracking-widest">{t('Live Quiz Preview')}</h4>
                  <span className="text-[9px] font-bold bg-teal-500/10 text-teal-400 px-2 py-0.5 rounded">
                    {t(quizQuestions.length === 1 ? '{count} Question Staged' : '{count} Questions Staged').replace('{count}', quizQuestions.length.toString())}
                  </span>
                </div>

                {quizTitle ? (
                  <div className="p-4 bg-slate-950 border border-slate-850 rounded-2xl space-y-3 max-h-60 overflow-y-auto">
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <span className="text-[9px] font-bold text-teal-500 uppercase tracking-wider block">{t(quizSubject)}</span>
                        <h5 className="text-sm font-bold text-white">{quizTitle}</h5>
                      </div>
                    </div>

                    <div className="space-y-3.5 pt-2">
                      {quizQuestions.map((q, index) => (
                        <div key={q.id} className="p-3 bg-slate-900/60 border border-slate-850/80 rounded-xl relative group">
                          <button
                            type="button"
                            onClick={() => handleRemoveQuestion(q.id)}
                            className="absolute top-2 right-2 text-slate-500 hover:text-rose-400 transition opacity-0 group-hover:opacity-100 cursor-pointer"
                          >
                            <X className="h-4 w-4" />
                          </button>
                          <p className="text-xs font-semibold text-slate-200 pr-4">
                            {index + 1}. {q.text}
                          </p>
                          <div className="grid grid-cols-2 gap-1.5 mt-2 text-[10px] text-slate-400 font-medium">
                            <span className={q.correctAnswer === 'A' ? 'text-teal-400 font-bold' : ''}>A: {q.options[0]}</span>
                            <span className={q.correctAnswer === 'B' ? 'text-teal-400 font-bold' : ''}>B: {q.options[1]}</span>
                            <span className={q.correctAnswer === 'C' ? 'text-teal-400 font-bold' : ''}>C: {q.options[2]}</span>
                            <span className={q.correctAnswer === 'D' ? 'text-teal-400 font-bold' : ''}>D: {q.options[3]}</span>
                          </div>
                        </div>
                      ))}
                      {quizQuestions.length === 0 && (
                        <div className="text-center py-6 text-xs text-slate-550 italic">
                          {t('No questions added yet. Compile questions using the composer on the left.')}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="p-6 bg-slate-950/40 border border-slate-850/40 rounded-2xl text-center text-xs text-slate-500 italic">
                    {t('Enter a Quiz Title and Subject to activate the live preview board.')}
                  </div>
                )}
              </div>

              <div className="space-y-4 pt-4 border-t border-slate-850/60">
                <button
                  type="button"
                  onClick={handleSaveQuiz}
                  disabled={!quizTitle.trim() || quizQuestions.length === 0}
                  className={`w-full py-2.5 rounded-xl font-bold text-xs transition cursor-pointer flex items-center justify-center gap-1.5 ${
                    quizTitle.trim() && quizQuestions.length > 0
                      ? 'bg-teal-600 hover:bg-teal-500 text-white shadow-lg shadow-teal-600/15'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  <Check className="h-4 w-4" /> {t('Publish & Dispatch Quiz')}
                </button>

                {/* Published Quizzes log */}
                <div>
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block mb-2">{t('Active Published Quizzes')}</span>
                  <div className="space-y-2">
                    {publishedQuizzes.map((quiz, i) => (
                      <div key={i} className="p-3 bg-slate-950 border border-slate-850/60 rounded-xl flex items-center justify-between text-xs">
                        <div>
                          <span className="font-semibold text-slate-200 block">{quiz.title}</span>
                          <span className="text-[10px] text-slate-550">{t(quiz.subject)}</span>
                        </div>
                        <span className="text-[10px] font-mono font-bold text-teal-400 bg-teal-500/5 border border-teal-500/10 px-2 py-0.5 rounded">
                          {t('{count} Qs').replace('{count}', quiz.questionsCount)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Timetables lectures preview */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-white">{t('Lecture Timetable')}</h3>
            <span className="text-[11px] text-slate-550 block">{t('Assigned academic slots for active physics curricula')}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {TIMETABLE_SLOTS.map((slot, index) => {
              const isSpecial = slot.isSpecial;
              return (
                <motion.div 
                  key={slot.id}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.05 * (index + 1) }}
                  whileHover={{ y: -4, scale: 1.02 }}
                  className={`p-4 bg-slate-950 border ${
                    isSpecial 
                      ? 'border-teal-500/30 bg-teal-500/5 hover:shadow-[0_10px_20px_-10px_rgba(20,184,166,0.15)]' 
                      : 'border-slate-850 hover:border-slate-800 hover:shadow-[0_10px_20px_-10px_rgba(20,184,166,0.1)]'
                  } transition rounded-2xl flex items-center gap-4 cursor-pointer`}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                    isSpecial 
                      ? 'bg-teal-500/15 text-teal-400 animate-pulse' 
                      : 'bg-teal-500/10 border border-teal-500/20 text-teal-400'
                  }`}>
                    {isSpecial ? (
                      <Sparkles className="h-5 w-5 animate-spin [animation-duration:8s]" />
                    ) : (
                      <Clock className="h-5 w-5" />
                    )}
                  </div>
                  <div>
                    <span className={`text-xs font-bold block ${isSpecial ? 'text-teal-400' : 'text-white'}`}>
                      {t(slot.title)}
                    </span>
                    <span className={`text-[10px] ${isSpecial ? 'text-slate-400' : 'text-slate-500'}`}>
                      {t(slot.schedule)} • {t(slot.room)}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

      </main>

      {/* Classroom scheduling modal */}
      <AnimatePresence>
        {showScheduleModal && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-40"
              onClick={() => setShowScheduleModal(false)}
            />

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 m-auto w-full max-w-sm h-max bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl z-50 p-6 text-slate-100"
            >
              <div className="flex justify-between items-center mb-5">
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                    <Calendar className="h-4.5 w-4.5 text-teal-400 animate-pulse" /> {t('Schedule Lecture Slot')}
                  </h4>
                  <span className="text-[11px] text-slate-550">{t('Insert academic calendar slots')}</span>
                </div>
                <button 
                  onClick={() => setShowScheduleModal(false)}
                  className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleScheduleSubmit} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">{t('Lecture Topic / Title *')}</label>
                  <input
                    type="text"
                    required
                    value={lectureTitle}
                    onChange={(e) => setLectureTitle(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-850 text-xs p-2.5 rounded-xl outline-none focus:border-teal-500 text-slate-200"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">{t('Lecture Held Date *')}</label>
                  <input
                    type="text"
                    required
                    value={lectureDate}
                    onChange={(e) => setLectureDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-850 text-xs p-2.5 rounded-xl outline-none focus:border-teal-500 text-slate-200"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">{t('Start Time *')}</label>
                    <input
                      type="text"
                      required
                      value={lectureTime}
                      onChange={(e) => setLectureTime(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-850 text-xs p-2.5 rounded-xl outline-none focus:border-teal-500 text-slate-200 text-center"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">{t('Seminar Hall *')}</label>
                    <input
                      type="text"
                      required
                      value={lectureLocation}
                      onChange={(e) => setLectureLocation(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-850 text-xs p-2.5 rounded-xl outline-none focus:border-teal-500 text-slate-200 text-center"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs rounded-xl transition cursor-pointer flex justify-center items-center gap-1.5"
                >
                  {t('Confirm Scheduling')} <ArrowRight className="h-4 w-4" />
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
};
