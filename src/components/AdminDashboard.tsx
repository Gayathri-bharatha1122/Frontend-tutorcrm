import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { motion, AnimatePresence } from 'motion/react';
import {
  Users,
  GraduationCap,
  Activity,
  IndianRupee,
  Plus,
  Search,
  Download,
  Filter,
  Trash2,
  CheckCircle,
  PlusCircle,
  X,
  Bell,
  Sparkles,
  ArrowRight,
  Edit2,
  ArrowLeft,
  Mail,
  Phone,
  Briefcase,
  Calendar,
  Award,
  BookOpen,
  ChevronRight
} from 'lucide-react';
import { Student, Teacher, ActivityLog } from '../types';
import { useLanguage } from '../LanguageContext';
import { LanguageSelector } from './LanguageSelector';

const AVAILABLE_COURSES = [
  'Advanced Physics',
  'Calculus BC',
  'Chemistry Honors',
  'AP Literature',
  'Organic Chemistry',
  'Maths',
  'Computer',
  'English'
];

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

interface AdminDashboardProps {
  currentPath?: string;
  onLogout: () => void;
  onHome: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  currentPath,
  onLogout,
  onHome
}) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [metrics, setMetrics] = useState<any>(null);

  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'students' | 'tutors' | 'parents' | 'courses' | 'fees' | 'reports' | 'settings'>('overview');

  useEffect(() => {
    if (currentPath) {
      if (currentPath.includes('/students')) setActiveTab('students');
      else if (currentPath.includes('/tutors')) setActiveTab('tutors');
      else if (currentPath.includes('/users')) setActiveTab('users');
      else if (currentPath.includes('/parents')) setActiveTab('parents');
      else if (currentPath.includes('/courses')) setActiveTab('courses');
      else if (currentPath.includes('/fees')) setActiveTab('fees');
      else if (currentPath.includes('/reports')) setActiveTab('reports');
      else if (currentPath.includes('/settings')) setActiveTab('settings');
      else setActiveTab('overview');

      // Clear detail views when navigating
      setSelectedStudentDetail(null);
      setSelectedTutorDetail(null);
    }
  }, [currentPath]);

  // Detail Views
  const [selectedStudentDetail, setSelectedStudentDetail] = useState<any>(null);
  const [selectedTutorDetail, setSelectedTutorDetail] = useState<any>(null);

  // Modals state
  const [studentModalOpen, setStudentModalOpen] = useState(false);
  const [tutorModalOpen, setTutorModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<any>(null);
  const [editingTutor, setEditingTutor] = useState<any>(null);
  const [isNotificationDropdownOpen, setIsNotificationDropdownOpen] = useState(false);
  const [tutorFormSalaryStatus, setTutorFormSalaryStatus] = useState<'Credited' | 'Pending'>('Pending');
  const [tutorFormAttendance, setTutorFormAttendance] = useState('95%');

  // Modal form fields - Student
  const [studentFormFirstName, setStudentFormFirstName] = useState('');
  const [studentFormLastName, setStudentFormLastName] = useState('');
  const [studentFormEmail, setStudentFormEmail] = useState('');
  const [studentFormPhone, setStudentFormPhone] = useState('');
  const [studentFormParentPhone, setStudentFormParentPhone] = useState('');
  const [studentFormGrade, setStudentFormGrade] = useState('11th Grade');
  const [studentFormSubject, setStudentFormSubject] = useState('Advanced Physics');
  const [studentFormStatus, setStudentFormStatus] = useState<'Active' | 'Pending' | 'Inactive'>('Active');
  const [studentFormPassword, setStudentFormPassword] = useState('');

  // Modal form fields - Tutor
  const [tutorFormFirstName, setTutorFormFirstName] = useState('');
  const [tutorFormLastName, setTutorFormLastName] = useState('');
  const [tutorFormEmail, setTutorFormEmail] = useState('');
  const [tutorFormPhone, setTutorFormPhone] = useState('');
  const [tutorFormSubject, setTutorFormSubject] = useState('');
  const [tutorFormExperience, setTutorFormExperience] = useState('1 year');
  const [tutorFormCourses, setTutorFormCourses] = useState<string[]>([]);
  const [tutorFormStatus, setTutorFormStatus] = useState<'Active' | 'On Leave'>('Active');
  const [tutorFormPassword, setTutorFormPassword] = useState('');

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const metricsData = await api.getAdminMetrics();
        setMetrics(metricsData);
      } catch (err) {
        console.error("Failed to load admin metrics", err);
      }
    };
    fetchMetrics();

    const fetchData = async () => {
      try {
        const [studentsData, teachersData, logsData] = await Promise.all([
          api.getAdminStudents(),
          api.getTeachers(),
          api.getActivityLogs()
        ]);
        setStudents(studentsData);
        setTeachers(teachersData);
        setActivityLogs(logsData);
      } catch (err) {
        console.error("Failed to load admin data", err);
      }
    };
    fetchData();
  }, []);

  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Pending' | 'Inactive'>('All');
  const [adminNotification, setAdminNotification] = useState<string | null>(null);

  // Modal Open Handlers
  const openAddStudentModal = () => {
    setEditingStudent(null);
    setStudentFormFirstName('');
    setStudentFormLastName('');
    setStudentFormEmail('');
    setStudentFormPhone('');
    setStudentFormParentPhone('');
    setStudentFormGrade('11th Grade');
    setStudentFormSubject('Advanced Physics');
    setStudentFormStatus('Active');
    setStudentFormPassword('');
    setStudentModalOpen(true);
  };

  const openEditStudentModal = (student: any) => {
    setEditingStudent(student);
    const names = student.name.split(' ');
    setStudentFormFirstName(student.firstName || names[0] || '');
    setStudentFormLastName(student.lastName || names.slice(1).join(' ') || '');
    setStudentFormEmail(student.email || '');
    setStudentFormPhone(student.phone || '');
    setStudentFormParentPhone(student.parentPhone || '');
    setStudentFormGrade(student.grade || '11th Grade');
    setStudentFormSubject(student.subject || 'Advanced Physics');
    setStudentFormStatus(student.status || 'Active');
    setStudentFormPassword('');
    setStudentModalOpen(true);
  };

  const openAddTutorModal = () => {
    setEditingTutor(null);
    setTutorFormFirstName('');
    setTutorFormLastName('');
    setTutorFormEmail('');
    setTutorFormPhone('');
    setTutorFormSubject('');
    setTutorFormExperience('1 year');
    setTutorFormCourses([]);
    setTutorFormStatus('Active');
    setTutorFormPassword('');
    setTutorFormSalaryStatus('Pending');
    setTutorFormAttendance('95%');
    setTutorModalOpen(true);
  };

  const openEditTutorModal = (tutor: any) => {
    setEditingTutor(tutor);
    setTutorFormFirstName(tutor.firstName || '');
    setTutorFormLastName(tutor.lastName || '');
    setTutorFormEmail(tutor.email || '');
    setTutorFormPhone(tutor.phone || '');
    setTutorFormSubject(tutor.subject || '');
    setTutorFormExperience(tutor.experience || '1 year');
    setTutorFormCourses(tutor.courses || []);
    setTutorFormStatus(tutor.status || 'Active');
    setTutorFormPassword('');
    setTutorFormSalaryStatus(tutor.salaryStatus || 'Pending');
    setTutorFormAttendance(tutor.attendance || '95%');
    setTutorModalOpen(true);
  };

  // Form Submit Handlers
  const handleStudentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentFormFirstName || !studentFormLastName || !studentFormPhone) {
      alert(t('First name, last name, and student phone are required.'));
      return;
    }
    if (studentFormPhone.length !== 10) {
      alert(t('Student phone number must be exactly 10 digits.'));
      return;
    }
    if (studentFormParentPhone && studentFormParentPhone.length !== 10) {
      alert(t('Parent phone number must be exactly 10 digits.'));
      return;
    }
    if (!editingStudent && !studentFormPassword) {
      alert(t('Password is required.'));
      return;
    }

    const payload = {
      name: `${studentFormFirstName} ${studentFormLastName}`,
      firstName: studentFormFirstName,
      lastName: studentFormLastName,
      email: studentFormEmail,
      phone: studentFormPhone,
      parentPhone: studentFormParentPhone,
      grade: studentFormGrade,
      subject: studentFormSubject,
      status: studentFormStatus,
      password: studentFormPassword
    };

    try {
      if (editingStudent) {
        await api.editStudent(editingStudent.id, payload);
        setAdminNotification(t('Successfully updated student {name}').replace('{name}', payload.name));
      } else {
        await api.enrollStudent(payload);
        setAdminNotification(t('Successfully enrolled student {name}').replace('{name}', payload.name));
      }
      setTimeout(() => setAdminNotification(null), 4000);
      setStudentModalOpen(false);

      // Refresh lists
      api.getAdminMetrics().then(setMetrics).catch(console.error);
      const updatedStudents = await api.getAdminStudents();
      setStudents(updatedStudents);
      const updatedLogs = await api.getActivityLogs();
      setActivityLogs(updatedLogs);

      if (selectedStudentDetail && selectedStudentDetail.id === editingStudent?.id) {
        viewStudentDetails(editingStudent.id);
      }
    } catch (err: any) {
      alert(err.message || t('Operation failed.'));
    }
  };

  const handleTutorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tutorFormFirstName || !tutorFormLastName || !tutorFormEmail || !tutorFormPhone) {
      alert(t('First name, last name, email, and tutor phone are required.'));
      return;
    }
    if (tutorFormPhone.length !== 10) {
      alert(t('Tutor phone number must be exactly 10 digits.'));
      return;
    }
    if (!editingTutor && !tutorFormPassword) {
      alert(t('Password is required.'));
      return;
    }

    const payload = {
      firstName: tutorFormFirstName,
      lastName: tutorFormLastName,
      email: tutorFormEmail,
      phone: tutorFormPhone,
      subject: tutorFormSubject,
      experience: tutorFormExperience,
      courses: tutorFormCourses,
      status: tutorFormStatus,
      password: tutorFormPassword,
      salaryStatus: tutorFormSalaryStatus,
      attendance: tutorFormAttendance
    };

    try {
      if (editingTutor) {
        await api.editTutor(editingTutor.id, payload);
        setAdminNotification(t('Successfully updated tutor Prof. {first} {last}').replace('{first}', payload.firstName).replace('{last}', payload.lastName));
      } else {
        await api.addTutor(payload);
        setAdminNotification(t('Successfully added tutor Prof. {first} {last}').replace('{first}', payload.firstName).replace('{last}', payload.lastName));
      }
      setTimeout(() => setAdminNotification(null), 4000);
      setTutorModalOpen(false);

      // Refresh list
      api.getAdminMetrics().then(setMetrics).catch(console.error);
      const updatedTeachers = await api.getTeachers();
      setTeachers(updatedTeachers);

      if (selectedTutorDetail && selectedTutorDetail.id === editingTutor?.id) {
        viewTutorDetails(editingTutor.id);
      }
    } catch (err: any) {
      alert(err.message || t('Operation failed.'));
    }
  };

  // Delete Action Handlers
  const handleDeleteStudent = async (studentId: string, studentName: string) => {
    if (confirm(t("Are you sure you want to delete student {name}? This will permanently remove their profile and bills.").replace('{name}', studentName))) {
      try {
        await api.deleteStudent(studentId);
        setAdminNotification(t('Deleted student {name}').replace('{name}', studentName));
        setTimeout(() => setAdminNotification(null), 4000);

        api.getAdminMetrics().then(setMetrics).catch(console.error);
        const updatedStudents = await api.getAdminStudents();
        setStudents(updatedStudents);
        const updatedLogs = await api.getActivityLogs();
        setActivityLogs(updatedLogs);

        if (selectedStudentDetail?.id === studentId) {
          setSelectedStudentDetail(null);
        }
      } catch (err: any) {
        alert(err.message || t('Delete student failed.'));
      }
    }
  };

  const handleDeleteTutor = async (tutorId: string, tutorName: string) => {
    if (confirm(t("Are you sure you want to delete tutor {name}? This will permanently remove their profile.").replace('{name}', tutorName))) {
      try {
        await api.deleteTutor(tutorId);
        setAdminNotification(t('Deleted tutor {name}').replace('{name}', tutorName));
        setTimeout(() => setAdminNotification(null), 4000);

        api.getAdminMetrics().then(setMetrics).catch(console.error);
        const updatedTeachers = await api.getTeachers();
        setTeachers(updatedTeachers);

        if (selectedTutorDetail?.id === tutorId) {
          setSelectedTutorDetail(null);
        }
      } catch (err: any) {
        alert(err.message || t('Delete tutor failed.'));
      }
    }
  };

  // Detail View Fetchers
  const viewStudentDetails = async (studentId: string) => {
    try {
      const data = await api.getStudentById(studentId);
      setSelectedStudentDetail(data);
      setSelectedTutorDetail(null);
    } catch (err: any) {
      alert(err.message || t('Failed to fetch student details.'));
    }
  };

  const viewTutorDetails = async (tutorId: string) => {
    try {
      const data = await api.getTutorById(tutorId);
      setSelectedTutorDetail(data);
      setSelectedStudentDetail(null);
    } catch (err: any) {
      alert(err.message || t('Failed to fetch tutor details.'));
    }
  };

  const filteredStudents = students.filter(st => {
    const matchesSearch = st.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      st.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      st.phone.includes(searchQuery);
    const matchesStatus = statusFilter === 'All' ? true : st.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Simple statistics
  const activeStudentsCount = students.filter(s => s.status === 'Active').length;
  const pendingStudentsCount = students.filter(s => s.status === 'Pending').length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">

      {/* Top Console Command Header */}
      <nav className="border-b border-slate-900 bg-slate-950/80 backdrop-blur sticky top-0 z-40">
        <div className="w-full px-4 sm:px-8 lg:px-12 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center">
              <GraduationCap className="h-5 w-5 text-white animate-pulse" />
            </div>
            <div>
              <span className="font-sans font-bold text-base text-white tracking-tight">EduManage CRM</span>
              <span className="text-[10px] block text-slate-500 font-semibold uppercase">{t('Admin Command Node')}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <button
                onClick={() => setIsNotificationDropdownOpen(!isNotificationDropdownOpen)}
                className={`p-1.5 hover:bg-slate-900 rounded-lg transition relative cursor-pointer ${isNotificationDropdownOpen ? 'bg-slate-900 text-indigo-400' : 'text-slate-400 hover:text-indigo-400'}`}
              >
                <Bell className="h-4.5 w-4.5" />
                <span className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full bg-indigo-500" />
              </button>

              <AnimatePresence>
                {isNotificationDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsNotificationDropdownOpen(false)} />

                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-50 p-4 space-y-3 text-xs text-slate-200"
                    >
                      <div className="flex justify-between items-center border-b border-slate-850 pb-2">
                        <span className="font-bold text-white">{t('System Notifications')}</span>
                        <button
                          onClick={() => setIsNotificationDropdownOpen(false)}
                          className="text-[10px] text-slate-500 hover:text-white"
                        >
                          {t('Close')}
                        </button>
                      </div>

                      <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
                        {activityLogs.slice(0, 5).map((log) => (
                          <div key={log.id} className="p-2.5 bg-slate-950 border border-slate-850 rounded-xl space-y-1">
                            <div className="flex justify-between items-start gap-1">
                              <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold ${log.type === 'New Enrollment' ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/30' :
                                  log.type === 'Fee Payment' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' :
                                    'bg-slate-800 text-slate-400'
                                }`}>
                                {t(log.type)}
                              </span>
                              <span className="text-[8px] text-slate-500 font-mono">{log.dateTime}</span>
                            </div>
                            <p className="text-[10px] text-slate-300 leading-normal">{t(log.detail)}</p>
                          </div>
                        ))}
                        {activityLogs.length === 0 && (
                          <div className="text-center py-4 text-slate-550 italic">{t('No notifications logged.')}</div>
                        )}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
            <div className="flex items-center gap-3 border-l border-slate-800 pl-4">
              <div className="hidden sm:block text-right">
                <span className="text-xs font-semibold text-slate-200 block">{t('System Administrator')}</span>
                <span className="text-[10px] text-slate-500 font-medium font-mono">root_user_01</span>
              </div>
              <LanguageSelector />
              <button
                onClick={onHome}
                className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-xs text-slate-200 font-semibold rounded-lg transition-transform cursor-pointer"
              >
                {t('Home')}
              </button>
              {/* Sign Out option removed */}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Grid Workspace */}
      <main className="w-full px-4 sm:px-8 lg:px-12 py-8 space-y-8 relative z-10">

        {/* Real-time reactive notifications popup */}
        <AnimatePresence>
          {adminNotification && (
            <motion.div
              initial={{ height: 0, opacity: 0, y: -10 }}
              animate={{ height: 'auto', opacity: 1, y: 0 }}
              exit={{ height: 0, opacity: 0, y: -10 }}
              className="bg-indigo-600 border border-indigo-500/30 rounded-2xl p-4 text-white text-xs font-semibold flex items-center justify-between shadow-xl"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="h-4.5 w-4.5 text-indigo-200 animate-spin" />
                <span>{adminNotification}</span>
              </div>
              <button onClick={() => setAdminNotification(null)}>
                <X className="h-4 w-4 text-indigo-200 hover:text-white" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Global Pending Banner */}
        {!selectedStudentDetail && !selectedTutorDetail && pendingStudentsCount > 0 && activeTab !== 'overview' && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 text-amber-400 text-xs font-semibold flex items-center justify-between shadow-lg"
          >
            <div className="flex items-center gap-2">
              <Bell className="h-4.5 w-4.5 text-amber-400 animate-bounce" />
              <span>{t('{count} new student registration(s) pending administrative review. Switch to Console Overview to Accept or Decline.').replace('{count}', pendingStudentsCount.toString())}</span>
            </div>
          </motion.div>
        )}

        {/* Tabs Navigation (Hidden on Detail Screens) */}
        {!selectedStudentDetail && !selectedTutorDetail && (
          <div className="flex border-b border-slate-900 bg-slate-900/40 p-1 gap-2 rounded-xl border border-slate-900/60 max-w-md">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${activeTab === 'overview'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
            >
              {t('Console Overview')}
            </button>
            <button
              onClick={() => setActiveTab('students')}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${activeTab === 'students'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
            >
              {t('Manage Students')}
            </button>
            <button
              onClick={() => setActiveTab('tutors')}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${activeTab === 'tutors'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
            >
              {t('Manage Tutors')}
            </button>
          </div>
        )}

        {/* DETAILS SCREEN - STUDENT */}
        {selectedStudentDetail && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-905 pb-5 border-slate-900">
              <button
                onClick={() => setSelectedStudentDetail(null)}
                className="flex items-center gap-2 px-4 py-2 bg-slate-905 hover:bg-slate-900 border border-slate-800 rounded-xl text-xs font-semibold text-slate-300 hover:text-white transition cursor-pointer bg-slate-900"
              >
                <ArrowLeft className="h-4 w-4" /> {t('Back to Directory')}
              </button>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => openEditStudentModal(selectedStudentDetail)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-xs font-bold text-white transition cursor-pointer"
                >
                  <Edit2 className="h-4 w-4" /> {t('Edit Profile')}
                </button>
                <button
                  onClick={() => handleDeleteStudent(selectedStudentDetail.id, selectedStudentDetail.name)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-500 rounded-xl text-xs font-bold text-white transition cursor-pointer"
                >
                  <Trash2 className="h-4 w-4" /> {t('Delete Account')}
                </button>
              </div>
            </div>

            {/* Profile Overview Card */}
            <div className="bg-slate-905 border border-slate-800 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row gap-6 items-start bg-slate-900">
              <div className="w-20 h-20 rounded-full bg-indigo-900/45 text-indigo-400 border border-indigo-500/20 font-bold text-2xl flex items-center justify-center shrink-0">
                {selectedStudentDetail.initials || selectedStudentDetail.name[0]}
              </div>
              <div className="flex-1 space-y-4">
                <div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <h2 className="text-xl font-extrabold text-white">{selectedStudentDetail.name}</h2>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${selectedStudentDetail.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
                        selectedStudentDetail.status === 'Pending' ? 'bg-amber-500/10 text-amber-400 border border-emerald-500/30' :
                          'bg-slate-950 text-slate-500 border border-slate-800'
                      }`}>
                      {t(selectedStudentDetail.status)}
                    </span>
                  </div>
                  <span className="text-xs text-slate-400 mt-1 block">{t(selectedStudentDetail.grade)} {t('Standard')}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 border-t border-slate-850 pt-4">
                  <div className="flex items-center gap-2.5 text-xs">
                    <Mail className="h-4 w-4 text-indigo-400 shrink-0" />
                    <div>
                      <span className="text-slate-500 block font-semibold text-[10px] uppercase">{t('Email Address')}</span>
                      <span className="text-slate-200">{selectedStudentDetail.email}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs">
                    <Phone className="h-4 w-4 text-indigo-400 shrink-0" />
                    <div>
                      <span className="text-slate-500 block font-semibold text-[10px] uppercase">{t('Student Contact')}</span>
                      <span className="text-slate-200 font-mono">{selectedStudentDetail.phone}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs">
                    <Users className="h-4 w-4 text-indigo-400 shrink-0" />
                    <div>
                      <span className="text-slate-500 block font-semibold text-[10px] uppercase">{t('Parent Contact Link')}</span>
                      <span className="text-indigo-300 font-mono font-bold">{selectedStudentDetail.parentPhone || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Performance and Connected Ledger Lists */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              {/* Metrics & Goal */}
              <div className="bg-slate-905 border border-slate-800 rounded-3xl p-6 space-y-6 bg-slate-900">
                <div>
                  <h3 className="text-sm font-bold text-white mb-1">{t('Academic Metrics')}</h3>
                  <span className="text-[11px] text-slate-550">{t('Current progress and average scores')}</span>
                </div>

                <div className="space-y-4">
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-850">
                    <span className="text-[10px] text-slate-550 font-bold uppercase block mb-1 text-slate-500">{t('Assigned subject')}</span>
                    <span className="text-sm font-bold text-white flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-indigo-400" /> {t(selectedStudentDetail.subject)}
                    </span>
                  </div>

                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-550 font-bold uppercase block text-slate-500">{t('Average GPA')}</span>
                      <span className="text-lg font-black text-white">{selectedStudentDetail.avgGrade?.toFixed(2) || '3.50'}</span>
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
                      A
                    </div>
                  </div>

                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-850">
                    <div className="flex justify-between items-center mb-1 text-[11px]">
                      <span className="text-slate-550 font-bold uppercase text-slate-500">{t('Syllabus Progress')}</span>
                      <span className="text-indigo-400 font-bold">{selectedStudentDetail.progress}%</span>
                    </div>
                    <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
                      <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${selectedStudentDetail.progress}%` }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Bills list */}
              <div className="bg-slate-905 border border-slate-800 rounded-3xl p-6 lg:col-span-2 space-y-4 bg-slate-900">
                <div>
                  <h3 className="text-sm font-bold text-white mb-1">{t('Tuition Billing Ledger')}</h3>
                  <span className="text-[11px] text-slate-550 block font-semibold text-slate-400">{t('Bills issued to parent contact')}</span>
                </div>

                <div className="overflow-x-auto border border-slate-850 rounded-2xl bg-slate-950 shadow-inner">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-slate-950 border-b border-slate-850 text-slate-400 font-bold uppercase tracking-wider text-[9px]">
                      <tr>
                        <th className="p-3">{t('Item details')}</th>
                        <th className="p-3">{t('Paid Date')}</th>
                        <th className="p-3">{t('Amount')}</th>
                        <th className="p-3 text-right">{t('Status')}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-850">
                      {selectedStudentDetail.bills && selectedStudentDetail.bills.length > 0 ? (
                        selectedStudentDetail.bills.map((bill: any) => (
                          <tr key={bill._id || bill.id} className="hover:bg-slate-900/40">
                            <td className="p-3 font-semibold text-slate-205 text-slate-200">{t(bill.itemName)}</td>
                            <td className="p-3 text-slate-400 font-mono text-[10px]">{t(bill.paidDate)}</td>
                            <td className="p-3 text-slate-202 font-mono font-bold text-slate-200">₹{bill.amount}</td>
                            <td className="p-3 text-right">
                              <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${bill.status === 'Paid' ? 'bg-emerald-500/10 text-emerald-400' :
                                  bill.status === 'Overdue' ? 'bg-rose-500/10 text-rose-400' :
                                    'bg-amber-500/10 text-amber-400'
                                }`}>
                                {t(bill.status)}
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} className="text-center p-8 text-slate-550 font-medium">
                            {t('No tuition bills issued to this student yet.')}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>

            {/* Audit Logs list */}
            <div className="bg-slate-905 border border-slate-800 rounded-3xl p-6 bg-slate-900">
              <div className="mb-4">
                <h3 className="text-sm font-bold text-white">{t('Student Enrollment Activity Logs')}</h3>
                <span className="text-[11px] text-slate-550 block font-semibold text-slate-400">{t('Administrative actions and transaction logs regarding this student')}</span>
              </div>
              <div className="overflow-x-auto border border-slate-850 rounded-2xl bg-slate-950 shadow-inner">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-950 border-b border-slate-850 text-slate-400 font-bold uppercase tracking-wider text-[9px]">
                    <tr>
                      <th className="p-3">{t('Action Type')}</th>
                      <th className="p-3">{t('Log Details')}</th>
                      <th className="p-3">{t('Timestamp')}</th>
                      <th className="p-3 text-right">{t('Result')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-850">
                    {selectedStudentDetail.activityLogs && selectedStudentDetail.activityLogs.length > 0 ? (
                      selectedStudentDetail.activityLogs.map((log: any) => (
                        <tr key={log._id || log.id} className="hover:bg-slate-900/40">
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded-lg text-[9px] font-bold ${log.type === 'New Enrollment' ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/30' :
                                log.type === 'Fee Payment' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' :
                                  'bg-slate-800 text-slate-400'
                              }`}>
                              {t(log.type)}
                            </span>
                          </td>
                          <td className="p-3 text-slate-350">{t(log.detail)}</td>
                          <td className="p-3 text-slate-500 font-mono text-[10px]">{log.dateTime}</td>
                          <td className="p-3 text-right">
                            <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${log.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400' :
                                log.status === 'Failed' ? 'bg-rose-500/10 text-rose-400' :
                                  'bg-slate-800 text-slate-500'
                              }`}>
                              {t(log.status)}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="text-center p-8 text-slate-550 font-medium">
                          {t('No audit transcript events logged for this student.')}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}
        {/* DETAILS SCREEN - TUTOR */}
        {selectedTutorDetail && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-900 pb-5">
              <button
                onClick={() => setSelectedTutorDetail(null)}
                className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs font-semibold text-slate-300 hover:text-white transition cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4" /> {t('Back to Directory')}
              </button>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => openEditTutorModal(selectedTutorDetail)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-xs font-bold text-white transition cursor-pointer"
                >
                  <Edit2 className="h-4 w-4" /> {t('Edit Profile')}
                </button>
                <button
                  onClick={() => handleDeleteTutor(selectedTutorDetail.id, selectedTutorDetail.name)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-500 rounded-xl text-xs font-bold text-white transition cursor-pointer"
                >
                  <Trash2 className="h-4 w-4" /> {t('Delete Faculty Record')}
                </button>
              </div>
            </div>

            {/* Profile Overview Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row gap-6 items-start">
              <div className="w-20 h-20 rounded-full bg-teal-900/45 text-teal-400 border border-teal-500/20 font-bold text-2xl flex items-center justify-center shrink-0">
                {selectedTutorDetail.firstName?.[0] || selectedTutorDetail.name?.[6] || 'T'}
              </div>
              <div className="flex-1 space-y-4">
                <div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <h2 className="text-xl font-extrabold text-white">{selectedTutorDetail.name}</h2>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${selectedTutorDetail.status === 'Active' ? 'bg-teal-500/10 text-teal-400 border border-teal-500/30' :
                        'bg-slate-950 text-slate-500 border border-slate-800'
                      }`}>
                      {t(selectedTutorDetail.status)}
                    </span>
                  </div>
                  <span className="text-xs text-slate-400 mt-1 block">{selectedTutorDetail.experience} {t('Experience')}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-850 pt-4">
                  <div className="flex items-center gap-2.5 text-xs">
                    <Mail className="h-4 w-4 text-indigo-400 shrink-0" />
                    <div>
                      <span className="text-slate-500 block font-semibold text-[10px] uppercase">{t('Email Address')}</span>
                      <span className="text-slate-200">{selectedTutorDetail.email}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs">
                    <Phone className="h-4 w-4 text-indigo-400 shrink-0" />
                    <div>
                      <span className="text-slate-500 block font-semibold text-[10px] uppercase">{t('Faculty Contact Phone')}</span>
                      <span className="text-slate-200 font-mono">{selectedTutorDetail.phone}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Performance and Connected Ledger Lists */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

              {/* Primary Subject */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-white mb-1">{t('Academic Subject Area')}</h3>
                  <span className="text-[11px] text-slate-550">{t('Primary teaching specialty honors')}</span>
                </div>
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 flex items-center gap-3">
                  <Award className="h-5 w-5 text-indigo-400 animate-pulse" />
                  <div>
                    <span className="text-[9px] text-slate-550 font-bold uppercase block">{t('Subject Honors')}</span>
                    <span className="text-sm font-bold text-white truncate max-w-[120px]" title={t(selectedTutorDetail.subject)}>{t(selectedTutorDetail.subject)}</span>
                  </div>
                </div>
              </div>

              {/* Courses list */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-white mb-1">{t('Assigned Courses')}</h3>
                  <span className="text-[11px] text-slate-550">{t('Active sections listed')}</span>
                </div>

                <div className="flex flex-wrap gap-1.5 max-h-16 overflow-y-auto">
                  {selectedTutorDetail.courses && selectedTutorDetail.courses.length > 0 ? (
                    selectedTutorDetail.courses.map((course: string, idx: number) => (
                      <span key={idx} className="bg-slate-950 border border-slate-800 px-2.5 py-1 rounded-lg text-[10px] font-semibold text-slate-350 flex items-center gap-1">
                        <BookOpen className="h-3 w-3 text-indigo-400" /> {t(course)}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-500 italic">{t('No courses assigned.')}</span>
                  )}
                </div>
              </div>

              {/* Tutor Attendance */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-white mb-1">{t('Attendance Rate')}</h3>
                  <span className="text-[11px] text-slate-550">{t('Cumulative presence statistics')}</span>
                </div>
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 flex items-center gap-3">
                  <Activity className="h-5 w-5 text-teal-400 animate-pulse" />
                  <div>
                    <span className="text-[9px] text-slate-550 font-bold uppercase block">{t('Attendance')}</span>
                    <span className="text-base font-extrabold text-white font-mono">{selectedTutorDetail.attendance || '96%'}</span>
                  </div>
                </div>
              </div>

              {/* Salary Status */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-white mb-1">{t('Salary Status')}</h3>
                  <span className="text-[11px] text-slate-550">{t('Tutor payment ledger status')}</span>
                </div>
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 flex items-center gap-3">
                  <IndianRupee className="h-5 w-5 text-amber-400" />
                  <div>
                    <span className="text-[9px] text-slate-550 font-bold uppercase block">{t('Payment Status')}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${selectedTutorDetail.salaryStatus === 'Credited' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-amber-500/15 text-amber-450'
                      }`}>
                      {t(selectedTutorDetail.salaryStatus || 'Pending')}
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </motion.div>
        )}
        {/* VIEW 1 - CONSOLE OVERVIEW */}
        {!selectedStudentDetail && !selectedTutorDetail && activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            {/* Highlight Metrics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05, duration: 0.5 }}
                whileHover={{ y: -4, scale: 1.02 }}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 relative overflow-hidden transition-all hover:shadow-[0_10px_20px_-10px_rgba(99,102,241,0.15)]"
              >
                <div className="absolute right-3 top-3 w-8 h-8 rounded-lg bg-indigo-600/10 text-indigo-400 flex items-center justify-center">
                  <GraduationCap className="h-4.5 w-4.5" />
                </div>
                <span className="text-[11px] font-bold text-slate-500 uppercase">{t('Active Students')}</span>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-2xl font-extrabold text-white">
                    <AnimatedCounter value={metrics ? metrics.activeStudents : activeStudentsCount} /> / <AnimatedCounter value={metrics ? metrics.totalStudents : students.length} />
                  </span>
                  <span className="text-[10px] text-indigo-400 font-semibold">+{metrics ? metrics.pendingStudents : pendingStudentsCount} {t('pending')}</span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.5 }}
                whileHover={{ y: -4, scale: 1.02 }}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 relative overflow-hidden transition-all hover:shadow-[0_10px_20px_-10px_rgba(20,184,166,0.15)]"
              >
                <div className="absolute right-3 top-3 w-8 h-8 rounded-lg bg-teal-600/10 text-teal-400 flex items-center justify-center">
                  <Users className="h-4.5 w-4.5" />
                </div>
                <span className="text-[11px] font-bold text-slate-500 uppercase">{t('Educators')}</span>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-2xl font-extrabold text-white">
                    <AnimatedCounter value={metrics ? metrics.educatorsCount : teachers.length} />
                  </span>
                  <span className="text-[10px] text-teal-400 font-semibold">{t('100% On Duty')}</span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.5 }}
                whileHover={{ y: -4, scale: 1.02 }}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 relative overflow-hidden transition-all hover:shadow-[0_10px_20px_-10px_rgba(16,185,129,0.15)]"
              >
                <div className="absolute right-3 top-3 w-8 h-8 rounded-lg bg-emerald-600/10 text-emerald-400 flex items-center justify-center">
                  <IndianRupee className="h-4.5 w-4.5" />
                </div>
                <span className="text-[11px] font-bold text-slate-500 uppercase">{t('Fees Receivable')}</span>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-2xl font-extrabold text-white">
                    <AnimatedCounter value={metrics ? metrics.totalOutstanding : 2140} prefix="₹" />
                  </span>
                  <span className="text-[10px] text-emerald-400 font-semibold">{t('+12% vs last term')}</span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                whileHover={{ y: -4, scale: 1.02 }}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 relative overflow-hidden transition-all hover:shadow-[0_10px_20px_-10px_rgba(245,158,11,0.15)]"
              >
                <div className="absolute right-3 top-3 w-8 h-8 rounded-lg bg-amber-600/10 text-amber-400 flex items-center justify-center">
                  <Activity className="h-4.5 w-4.5" />
                </div>
                <span className="text-[11px] font-bold text-slate-500 uppercase">{t('Audit Records')}</span>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-2xl font-extrabold text-white">
                    <AnimatedCounter value={metrics ? metrics.activityLogsCount : activityLogs.length} /> {t('Logged')}
                  </span>
                  <span className="text-[10px] text-amber-450 font-semibold">{t('Real-Time Sync')}</span>
                </div>
              </motion.div>
            </div>

            {/* SVG Data Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Bar Chart representing seasonal registration stats */}
              <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-bold text-white">{t('Enrollment Growth Trend')}</h3>
                    <span className="text-[11px] block text-slate-400">{t('Student registration loads across standard academic periods')}</span>
                  </div>
                  <span className="text-xs font-bold text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-full">{t('Primary Cohorts')}</span>
                </div>

                {/* Custom Interactive SVG bar chart using framer motion */}
                <div className="h-56 flex items-end gap-5 sm:gap-7 border-b border-l border-slate-850 px-4 pb-1 pt-6 relative w-full">
                  {[
                    { period: 'Jan-Feb', count: 4, heightClass: 'h-[40%]', color: 'bg-slate-800' },
                    { period: 'Mar-Apr', count: 6, heightClass: 'h-[60%]', color: 'bg-slate-800' },
                    { period: 'May-Summer', count: 10, heightClass: 'h-[100%]', color: 'bg-gradient-to-t from-indigo-600 to-indigo-400 animate-pulse' },
                    { period: 'Fall Shift', count: 8, heightClass: 'h-[80%]', color: 'bg-slate-800' }
                  ].map((bar, i) => (
                    <div key={i} className="flex-1 h-full flex flex-col items-center group cursor-pointer relative">
                      {/* Tooltip on hover */}
                      <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition duration-200 bg-indigo-600 text-white font-extrabold text-[10px] px-2.5 py-1 rounded shadow-lg z-20 pointer-events-none">
                        {t('{count} Students').replace('{count}', bar.count.toString())}
                      </div>

                      {/* Bar container to allow percentage heights to resolve correctly */}
                      <div className="flex-1 w-full flex items-end">
                        {/* Visual column bar */}
                        <motion.div
                          initial={{ scaleY: 0 }}
                          whileInView={{ scaleY: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: i * 0.1, duration: 0.6 }}
                          className={`w-full rounded-t-lg origin-bottom transition-all duration-300 group-hover:brightness-110 ${bar.heightClass} ${bar.color}`}
                        />
                      </div>

                      {/* Label */}
                      <span className="text-[10px] text-slate-500 font-semibold mt-2">{t(bar.period)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Radial Donut chart represented via custom SVG element */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white mb-0.5">{t('Budget Ledger Share')}</h3>
                  <span className="text-[11px] text-slate-550 block mb-6">{t('Tuition fees balance status across directory profiles')}</span>
                </div>

                {/* Premium Custom SVG Donut Diagram */}
                <div className="flex justify-center items-center relative h-36">
                  <svg className="w-32 h-32 transform -rotate-90">
                    <circle cx="64" cy="64" r="50" fill="transparent" stroke="#1e293b" strokeWidth="12" />
                    <motion.circle cx="64" cy="64" r="50" fill="transparent" stroke="#6366f1" strokeWidth="12"
                      strokeDasharray="314"
                      initial={{ strokeDashoffset: 314 }}
                      animate={{ strokeDashoffset: 110 }}
                      transition={{ duration: 1.2, ease: "easeOut" }}
                      strokeLinecap="round" />
                    <motion.circle cx="64" cy="64" r="50" fill="transparent" stroke="#06b6d4" strokeWidth="12"
                      strokeDasharray="314"
                      initial={{ strokeDashoffset: 314 }}
                      animate={{ strokeDashoffset: 260 }}
                      transition={{ duration: 1.2, ease: "easeOut", delay: 0.25 }}
                      strokeLinecap="round" />
                  </svg>
                  <div className="absolute text-center">
                    <span className="text-lg font-extrabold text-white block">
                      <AnimatedCounter value={metrics ? metrics.totalOutstanding : 2140} prefix="₹" />
                    </span>
                    <span className="text-[10px] text-slate-550 font-bold uppercase block">{t('Total')}</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 mt-4 text-[10px] text-slate-400 font-semibold text-center border-t border-slate-850 pt-4">
                  <div>
                    <span className="inline-block w-2 h-2 rounded-full bg-indigo-500 mr-1.5" />
                    {t('Paid (65%)')}
                  </div>
                  <div>
                    <span className="inline-block w-2 h-2 rounded-full bg-cyan-500 mr-1.5" />
                    {t('Pending (20%)')}
                  </div>
                  <div>
                    <span className="inline-block w-2 h-2 rounded-full bg-slate-600 mr-1.5" />
                    {t('Overdue (15%)')}
                  </div>
                </div>
              </div>
            </div>

            {/* Pending Enrollment Messages Section */}
            {students.filter(s => s.status === 'Pending').length > 0 && (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
                <div className="flex items-center gap-2">
                  <Bell className="h-4.5 w-4.5 text-amber-400 animate-bounce" />
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">{t('New Enrollment Messages')}</h3>
                </div>
                <div className="overflow-x-auto bg-slate-950 border border-slate-850 rounded-2xl overflow-hidden shadow-inner">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-slate-950 border-b border-slate-850 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                      <tr>
                        <th className="p-4">{t('Student Profile')}</th>
                        <th className="p-4">{t('Applied Course / Subject')}</th>
                        <th className="p-4">{t('Student Phone')}</th>
                        <th className="p-4">{t('Parent Phone')}</th>
                        <th className="p-4 text-right">{t('Actions')}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-850 bg-slate-950">
                      {students.filter(s => s.status === 'Pending').map((student) => (
                        <tr key={student.id} className="hover:bg-slate-900/40 transition">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div
                                onClick={() => viewStudentDetails(student.id)}
                                className="w-8 h-8 rounded-full bg-indigo-900/45 text-indigo-400 border border-indigo-500/20 font-bold flex items-center justify-center cursor-pointer hover:bg-indigo-800 transition"
                              >
                                {student.initials || student.name[0]}
                              </div>
                              <div>
                                <div className="flex items-center gap-2 mb-0.5">
                                  <span
                                    onClick={() => viewStudentDetails(student.id)}
                                    className="font-bold text-white block hover:text-indigo-400 cursor-pointer hover:underline animate-pulse"
                                  >
                                    {student.name}
                                  </span>
                                  <span className="text-[9px] text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded font-bold uppercase whitespace-nowrap">{t('Awaiting Review')}</span>
                                </div>
                                <span className="text-[10px] text-slate-550 block text-slate-500">{t(student.grade)} • {student.email}</span>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 text-slate-350 font-medium">
                            {t(student.subject) || t('N/A')}
                          </td>
                          <td className="p-4 text-slate-400 font-mono text-[11px]">
                            {student.phone}
                          </td>
                          <td className="p-4 text-indigo-300 font-mono font-semibold text-[11px]">
                            {student.parentPhone || t('N/A')}
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={async () => {
                                  try {
                                    const res = await api.approveStudent(student.id, 'accept');
                                    setAdminNotification(res.msg || t('Accepted {name}').replace('{name}', student.name));
                                    setTimeout(() => setAdminNotification(null), 4000);

                                    // Refresh data
                                    const [updatedStudents, updatedLogs] = await Promise.all([
                                      api.getAdminStudents(),
                                      api.getActivityLogs()
                                    ]);
                                    setStudents(updatedStudents);
                                    setActivityLogs(updatedLogs);
                                  } catch (err: any) {
                                    alert(err.message || t('Approval failed.'));
                                  }
                                }}
                                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all cursor-pointer hover:scale-105 active:scale-95 shadow-md shadow-emerald-600/10"
                              >
                                {t('Accept')}
                              </button>
                              <button
                                onClick={async () => {
                                  if (confirm(t("Are you sure you want to decline and delete {name}'s registry?").replace('{name}', student.name))) {
                                    try {
                                      const res = await api.approveStudent(student.id, 'decline');
                                      setAdminNotification(res.msg || t('Declined {name}').replace('{name}', student.name));
                                      setTimeout(() => setAdminNotification(null), 4000);

                                      // Refresh data
                                      const [updatedStudents, updatedLogs] = await Promise.all([
                                        api.getAdminStudents(),
                                        api.getActivityLogs()
                                      ]);
                                      setStudents(updatedStudents);
                                      setActivityLogs(updatedLogs);
                                    } catch (err: any) {
                                      alert(err.message || t('Decline failed.'));
                                    }
                                  }
                                }}
                                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition-all cursor-pointer hover:scale-105 active:scale-95 shadow-md shadow-rose-600/10"
                              >
                                {t('Decline')}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Audit Logs panel & Team listings and details */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
              <div className="mb-4">
                <h3 className="text-sm font-bold text-white">{t('System Security Activity Audits')}</h3>
                <span className="text-[11px] text-slate-550 block font-semibold text-slate-400">{t('Live database enrollment and transaction transcripts')}</span>
              </div>

              <div className="overflow-x-auto max-h-80 overflow-y-auto pr-1">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-950 border-b border-slate-850 text-slate-400 font-bold uppercase tracking-wider text-[9px]">
                    <tr>
                      <th className="p-3">{t('Student Name')}</th>
                      <th className="p-3">{t('Action Type')}</th>
                      <th className="p-3">{t('Detail')}</th>
                      <th className="p-3">{t('Date & Time')}</th>
                      <th className="p-3 text-right">{t('Status')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-850">
                    {activityLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-950/40 transition">
                        <td className="p-3 font-semibold text-slate-200">
                          {log.studentName}
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded-lg text-[9px] font-bold ${log.type === 'New Enrollment' ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/30' :
                              log.type === 'Fee Payment' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' :
                                log.type === 'Payment Failed' ? 'bg-red-500/15 text-red-400 border border-red-500/30' :
                                  'bg-slate-800 text-slate-400'
                            }`}>
                            {t(log.type)}
                          </span>
                        </td>
                        <td className="p-3 text-slate-400 max-w-[200px] truncate" title={t(log.detail)}>
                          {t(log.detail)}
                          {log.amount && <span className="block mt-0.5 text-[10px] text-indigo-400 font-semibold">{t('Ledger balance:')} -₹{log.amount}</span>}
                        </td>
                        <td className="p-3 text-slate-550 font-mono text-[10px] text-slate-500">
                          {log.dateTime}
                        </td>
                        <td className="p-3 text-right">
                          <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${log.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400 font-semibold' :
                              log.status === 'Failed' ? 'bg-rose-500/10 text-rose-400 font-semibold' :
                                'bg-slate-800 text-slate-405'
                            }`}>
                            {t(log.status)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* VIEW 2 - STUDENT DIRECTORY & CRUD */}
        {!selectedStudentDetail && !selectedTutorDetail && activeTab === 'students' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl"
          >
            {/* Filters and Add Student Button */}
            <div className="p-6 border-b border-slate-850 flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-white">{t('Student Academic Enrollment Directory')}</h3>
                <p className="text-xs text-slate-550 text-slate-500">{t('Directly add new academic entries, edit status, or click student name to view detailed files.')}</p>
              </div>

              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                <div className="relative flex-1 md:w-64">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-550 text-slate-550" />
                  <input
                    type="text"
                    placeholder={t('Search name, course standard, phone...')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 text-xs pl-9 pr-4 py-2 rounded-xl focus:border-indigo-500 outline-none text-white"
                  />
                </div>

                <div className="flex bg-slate-950 p-1 border border-slate-800 rounded-xl text-xs font-semibold">
                  {(['All', 'Active', 'Pending', 'Inactive'] as const).map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setStatusFilter(filter)}
                      className={`px-3 py-1 rounded-lg transition capitalize cursor-pointer ${statusFilter === filter
                          ? 'bg-slate-900 text-white'
                          : 'text-slate-500 hover:text-slate-300'
                        }`}
                    >
                      {t(filter)}
                    </button>
                  ))}
                </div>

                <button
                  onClick={openAddStudentModal}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md hover:scale-[1.02] transition-all"
                >
                  <PlusCircle className="h-4.5 w-4.5" /> {t('Add Student')}
                </button>
              </div>
            </div>

            {/* Students table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-950 border-b border-slate-850 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-4">{t('Student Profile')}</th>
                    <th className="p-4">{t('Assigned Course / Subject')}</th>
                    <th className="p-4">{t('Contact Phone')}</th>
                    <th className="p-4">{t('Linked Parent Phone')}</th>
                    <th className="p-4">{t('Status')}</th>
                    <th className="p-4 text-right">{t('Actions')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850">
                  {filteredStudents.length > 0 ? (
                    filteredStudents.map((student, sIdx) => (
                      <motion.tr
                        key={student.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: Math.min(sIdx * 0.04, 0.4), duration: 0.3 }}
                        className="hover:bg-slate-950/40 transition"
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div
                              onClick={() => viewStudentDetails(student.id)}
                              className="w-8 h-8 rounded-full bg-indigo-900/45 text-indigo-400 border border-indigo-500/20 font-bold flex items-center justify-center cursor-pointer hover:bg-indigo-800 transition shrink-0"
                            >
                              {student.initials || student.name[0]}
                            </div>
                            <div>
                              <span
                                onClick={() => viewStudentDetails(student.id)}
                                className="font-bold text-white block hover:text-indigo-400 cursor-pointer hover:underline text-sm"
                              >
                                {student.name}
                              </span>
                              <span className="text-[10px] text-slate-500 block">{t(student.grade)} • {student.email}</span>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-slate-300 font-medium">{t(student.subject)}</td>
                        <td className="p-4 text-slate-400 font-mono text-[11px]">{student.phone}</td>
                        <td className="p-4 text-slate-500 font-mono text-[11px]">{student.parentPhone || t('Unlinked')}</td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${student.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
                              student.status === 'Pending' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' :
                                'bg-slate-950 text-slate-500 border border-slate-800'
                            }`}>
                            {t(student.status)}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-3">
                            <button
                              onClick={() => openEditStudentModal(student)}
                              className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition cursor-pointer"
                              title={t("Edit Student")}
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteStudent(student.id, student.name)}
                              className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-rose-450 transition cursor-pointer hover:text-rose-400"
                              title={t("Delete Student")}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="text-center p-8 text-slate-550 font-medium text-slate-500">
                        {t('No student records match search query parameters.')}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
        {/* VIEW 3 - TUTOR DIRECTORY & CRUD */}
        {!selectedStudentDetail && !selectedTutorDetail && activeTab === 'tutors' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl"
          >
            {/* Headers and Add Tutor Button */}
            <div className="p-6 border-b border-slate-850 flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-white">{t('Certified Academic Faculty Directory')}</h3>
                <p className="text-xs text-slate-550 text-slate-500">{t('Manage certified educators, courses assignations, or click tutor name to view detailed files.')}</p>
              </div>

              <button
                onClick={openAddTutorModal}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md hover:scale-[1.02] transition-all"
              >
                <PlusCircle className="h-4.5 w-4.5" /> {t('Add Faculty Tutor')}
              </button>
            </div>

            {/* Tutors table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-950 border-b border-slate-850 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-4">{t('Faculty Member')}</th>
                    <th className="p-4">{t('Primary Subject')}</th>
                    <th className="p-4">{t('Assigned Courses')}</th>
                    <th className="p-4 text-center">{t('Attendance Rate')}</th>
                    <th className="p-4 text-center">{t('Salary Status')}</th>
                    <th className="p-4 text-center">{t('Duty Status')}</th>
                    <th className="p-4 text-right">{t('Actions')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850">
                  {teachers.length > 0 ? (
                    teachers.map((teacher, tIdx) => (
                      <motion.tr
                        key={teacher.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: Math.min(tIdx * 0.04, 0.4), duration: 0.3 }}
                        className="hover:bg-slate-950/40 transition"
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div
                              onClick={() => viewTutorDetails(teacher.id)}
                              className="w-8 h-8 rounded-full bg-teal-900/45 text-teal-400 border border-teal-500/20 font-bold flex items-center justify-center cursor-pointer hover:bg-teal-800 transition shrink-0"
                            >
                              {teacher.firstName?.[0] || teacher.name?.[6] || 'T'}
                            </div>
                            <div>
                              <span
                                onClick={() => viewTutorDetails(teacher.id)}
                                className="font-bold text-white block hover:text-teal-400 cursor-pointer hover:underline text-sm"
                              >
                                {teacher.name}
                              </span>
                              <span className="text-[10px] text-slate-500 block">{teacher.phone} • {teacher.email}</span>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-slate-300 font-medium">{t(teacher.subject)}</td>
                        <td className="p-4">
                          <div className="flex flex-wrap gap-1 max-w-[200px]">
                            {teacher.courses && teacher.courses.map((course, idx) => (
                              <span key={idx} className="bg-slate-950 border border-slate-800 px-2 py-0.5 rounded text-[9px] font-semibold text-slate-400">
                                {t(course)}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="p-4 text-center font-mono font-bold text-slate-300">
                          {teacher.attendance || '96%'}
                        </td>
                        <td className="p-4 text-center">
                          <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${teacher.salaryStatus === 'Credited' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-amber-500/15 text-amber-450'
                            }`}>
                            {t(teacher.salaryStatus || 'Pending')}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${teacher.status === 'Active' ? 'bg-teal-500/10 text-teal-400 border border-teal-500/30' :
                              'bg-slate-950 border border-slate-800 text-slate-500'
                            }`}>
                            {t(teacher.status)}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-3">
                            <button
                              onClick={() => openEditTutorModal(teacher)}
                              className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition cursor-pointer"
                              title={t("Edit Tutor")}
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteTutor(teacher.id, teacher.name)}
                              className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-rose-455 transition cursor-pointer hover:text-rose-400"
                              title={t("Delete Tutor")}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="text-center p-8 text-slate-550 font-medium">
                        {t('No tutors currently registered in database.')}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* VIEW 4 - PARENTS */}
        {!selectedStudentDetail && !selectedTutorDetail && activeTab === 'parents' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center shadow-xl"
          >
            <Users className="h-12 w-12 text-slate-500 mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-bold text-white mb-2">{t('Parent Directory')}</h3>
            <p className="text-slate-400">{t('Manage parent accounts linked to enrolled students here. (Module under construction)')}</p>
          </motion.div>
        )}

        {/* VIEW 5 - USERS */}
        {!selectedStudentDetail && !selectedTutorDetail && activeTab === 'users' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center shadow-xl"
          >
            <Users className="h-12 w-12 text-slate-500 mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-bold text-white mb-2">{t('User Management')}</h3>
            <p className="text-slate-400">{t('Manage all registered users (Admin, Faculty, Parent, Student) across the platform. (Module under construction)')}</p>
          </motion.div>
        )}

        {/* VIEW 6 - COURSES */}
        {!selectedStudentDetail && !selectedTutorDetail && activeTab === 'courses' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center shadow-xl"
          >
            <BookOpen className="h-12 w-12 text-slate-500 mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-bold text-white mb-2">{t('Course Management')}</h3>
            <p className="text-slate-400">{t('Create, edit, and organize academic courses and syllabi. (Module under construction)')}</p>
          </motion.div>
        )}

        {/* VIEW 7 - FEES */}
        {!selectedStudentDetail && !selectedTutorDetail && activeTab === 'fees' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center shadow-xl"
          >
            <IndianRupee className="h-12 w-12 text-slate-500 mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-bold text-white mb-2">{t('Fees & Billing')}</h3>
            <p className="text-slate-400">{t('Track tuition payments, overdue invoices, and financial reports. (Module under construction)')}</p>
          </motion.div>
        )}

        {/* VIEW 8 - REPORTS */}
        {!selectedStudentDetail && !selectedTutorDetail && activeTab === 'reports' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center shadow-xl"
          >
            <Activity className="h-12 w-12 text-slate-500 mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-bold text-white mb-2">{t('Analytics & Reports')}</h3>
            <p className="text-slate-400">{t('Generate academic and financial performance reports for the current term. (Module under construction)')}</p>
          </motion.div>
        )}

        {/* VIEW 9 - SETTINGS */}
        {!selectedStudentDetail && !selectedTutorDetail && activeTab === 'settings' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center shadow-xl"
          >
            <h3 className="text-xl font-bold text-white mb-2">{t('Platform Settings')}</h3>
            <p className="text-slate-400">{t('Configure global platform options, security policies, and integrations. (Module under construction)')}</p>
          </motion.div>
        )}

      </main>

      {/* Student Add/Edit Modal */}
      <AnimatePresence>
        {studentModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
              onClick={() => setStudentModalOpen(false)}
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl z-50 overflow-y-auto max-h-[90vh]"
            >
              <div className="flex justify-between items-center mb-5">
                <div>
                  <h3 className="text-base font-bold text-white">
                    {editingStudent ? t('Edit Student Profile') : t('Enroll New Student')}
                  </h3>
                  <span className="text-xs text-slate-550">
                    {editingStudent ? t('Update registration database properties') : t('Register a new active student')}
                  </span>
                </div>
                <button
                  onClick={() => setStudentModalOpen(false)}
                  className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleStudentSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">{t('First Name *')}</label>
                    <input
                      type="text"
                      required
                      value={studentFormFirstName}
                      onChange={(e) => setStudentFormFirstName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 text-xs p-2.5 rounded-xl outline-none focus:border-indigo-500 text-white"
                      placeholder={t('Jane')}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">{t('Last Name *')}</label>
                    <input
                      type="text"
                      required
                      value={studentFormLastName}
                      onChange={(e) => setStudentFormLastName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 text-xs p-2.5 rounded-xl outline-none focus:border-indigo-500 text-white"
                      placeholder={t('Doe')}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">{t('Email Address *')}</label>
                  <input
                    type="email"
                    required
                    value={studentFormEmail}
                    onChange={(e) => setStudentFormEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 text-xs p-2.5 rounded-xl outline-none focus:border-indigo-500 text-white"
                    placeholder={t('jane.doe@email.com')}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">{t('Student Phone *')}</label>
                    <input
                      type="tel"
                      required
                      value={studentFormPhone}
                      onChange={(e) => setStudentFormPhone(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 text-xs p-2.5 rounded-xl outline-none focus:border-indigo-500 text-white font-mono"
                      placeholder={t('10 digit number')}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">{t('Parent Phone')}</label>
                    <input
                      type="tel"
                      value={studentFormParentPhone}
                      onChange={(e) => setStudentFormParentPhone(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 text-xs p-2.5 rounded-xl outline-none focus:border-indigo-500 text-white font-mono"
                      placeholder={t('10 digit number')}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">{t('Grade Standard *')}</label>
                    <select
                      value={studentFormGrade}
                      onChange={(e) => setStudentFormGrade(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 text-xs p-2.5 rounded-xl outline-none focus:border-indigo-500 text-slate-350 bg-slate-950"
                    >
                      <option value="9th Grade">{t('9th Grade')}</option>
                      <option value="10th Grade">{t('10th Grade')}</option>
                      <option value="11th Grade">{t('11th Grade')}</option>
                      <option value="12th Grade">{t('12th Grade')}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">{t('Course Subject *')}</label>
                    <select
                      value={studentFormSubject}
                      onChange={(e) => setStudentFormSubject(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 text-xs p-2.5 rounded-xl outline-none focus:border-indigo-500 text-slate-350 bg-slate-950"
                    >
                      <option value="Advanced Physics">{t('Advanced Physics')}</option>
                      <option value="Calculus BC">{t('Calculus BC')}</option>
                      <option value="Chemistry Honors">{t('Chemistry Honors')}</option>
                      <option value="AP Literature">{t('AP Literature')}</option>
                      <option value="Organic Chemistry">{t('Organic Chemistry')}</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">{t('Enrollment Status *')}</label>
                  <select
                    value={studentFormStatus}
                    onChange={(e) => setStudentFormStatus(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 text-xs p-2.5 rounded-xl outline-none focus:border-indigo-500 text-slate-350 bg-slate-950"
                  >
                    <option value="Active">{t('Active')}</option>
                    <option value="Pending">{t('Pending')}</option>
                    <option value="Inactive">{t('Inactive')}</option>
                  </select>
                </div>

                {!editingStudent && (
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">{t('Password *')}</label>
                    <input
                      type="password"
                      required
                      value={studentFormPassword}
                      onChange={(e) => setStudentFormPassword(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 text-xs p-2.5 rounded-xl outline-none focus:border-indigo-500 text-white"
                      placeholder={t('student123')}
                    />
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl transition cursor-pointer flex justify-center items-center gap-1.5 mt-2"
                >
                  {editingStudent ? t('Save Student Changes') : t('Enroll Student')} <ArrowRight className="h-4 w-4" />
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Tutor Add/Edit Modal */}
      <AnimatePresence>
        {tutorModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
              onClick={() => setTutorModalOpen(false)}
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl z-50 overflow-y-auto max-h-[90vh]"
            >
              <div className="flex justify-between items-center mb-5">
                <div>
                  <h3 className="text-base font-bold text-white">
                    {editingTutor ? t('Edit Tutor Profile') : t('Register New Tutor')}
                  </h3>
                  <span className="text-xs text-slate-500">
                    {editingTutor ? t('Update academic faculty database records') : t('Introduce a new certified educator')}
                  </span>
                </div>
                <button
                  onClick={() => setTutorModalOpen(false)}
                  className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleTutorSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">{t('First Name *')}</label>
                    <input
                      type="text"
                      required
                      value={tutorFormFirstName}
                      onChange={(e) => setTutorFormFirstName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 text-xs p-2.5 rounded-xl outline-none focus:border-indigo-500 text-white"
                      placeholder={t('Albert')}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">{t('Last Name *')}</label>
                    <input
                      type="text"
                      required
                      value={tutorFormLastName}
                      onChange={(e) => setTutorFormLastName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 text-xs p-2.5 rounded-xl outline-none focus:border-indigo-500 text-white"
                      placeholder={t('Einstein')}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">{t('Email Address *')}</label>
                  <input
                    type="email"
                    required
                    value={tutorFormEmail}
                    onChange={(e) => setTutorFormEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 text-xs p-2.5 rounded-xl outline-none focus:border-indigo-500 text-white"
                    placeholder={t('albert.einstein@physics.edu')}
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">{t('Tutor Phone *')}</label>
                  <input
                    type="tel"
                    required
                    value={tutorFormPhone}
                    onChange={(e) => setTutorFormPhone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 text-xs p-2.5 rounded-xl outline-none focus:border-indigo-500 text-white font-mono"
                    placeholder={t('10 digit number')}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">{t('Subject Specialty *')}</label>
                    <input
                      type="text"
                      required
                      value={tutorFormSubject}
                      onChange={(e) => setTutorFormSubject(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 text-xs p-2.5 rounded-xl outline-none focus:border-indigo-500 text-white"
                      placeholder={t('Relativity & Cosmology')}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">{t('Experience *')}</label>
                    <input
                      type="text"
                      required
                      value={tutorFormExperience}
                      onChange={(e) => setTutorFormExperience(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 text-xs p-2.5 rounded-xl outline-none focus:border-indigo-500 text-white"
                      placeholder={t('e.g. 12 years')}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">{t('Assigned Courses')}</label>
                  <div className="grid grid-cols-2 gap-2 bg-slate-950 border border-slate-800 p-3 rounded-xl">
                    {AVAILABLE_COURSES.map((course) => {
                      const isChecked = tutorFormCourses.includes(course);
                      return (
                        <label key={course} className="flex items-center gap-2 text-[11px] text-slate-350 cursor-pointer hover:text-white">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {
                              if (isChecked) {
                                setTutorFormCourses(tutorFormCourses.filter(c => c !== course));
                              } else {
                                setTutorFormCourses([...tutorFormCourses, course]);
                              }
                            }}
                            className="accent-indigo-500 rounded border-slate-800"
                          />
                          {t(course)}
                        </label>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">{t('Duty Status *')}</label>
                  <select
                    value={tutorFormStatus}
                    onChange={(e) => setTutorFormStatus(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 text-xs p-2.5 rounded-xl outline-none focus:border-indigo-500 text-slate-350 bg-slate-950"
                  >
                    <option value="Active">{t('Active')}</option>
                    <option value="On Leave">{t('On Leave')}</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">{t('Attendance Rate')}</label>
                    <input
                      type="text"
                      value={tutorFormAttendance}
                      onChange={(e) => setTutorFormAttendance(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 text-xs p-2.5 rounded-xl outline-none focus:border-indigo-500 text-white font-mono"
                      placeholder={t('e.g. 96%')}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">{t('Salary Status *')}</label>
                    <select
                      value={tutorFormSalaryStatus}
                      onChange={(e) => setTutorFormSalaryStatus(e.target.value as any)}
                      className="w-full bg-slate-950 border border-slate-800 text-xs p-2.5 rounded-xl outline-none focus:border-indigo-500 text-slate-350 bg-slate-950"
                    >
                      <option value="Credited">{t('Credited')}</option>
                      <option value="Pending">{t('Pending')}</option>
                    </select>
                  </div>
                </div>

                {!editingTutor && (
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">{t('Password *')}</label>
                    <input
                      type="password"
                      required
                      value={tutorFormPassword}
                      onChange={(e) => setTutorFormPassword(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 text-xs p-2.5 rounded-xl outline-none focus:border-indigo-500 text-white"
                      placeholder={t('tutor123')}
                    />
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl transition cursor-pointer flex justify-center items-center gap-1.5 mt-2"
                >
                  {editingTutor ? t('Save Tutor Changes') : t('Register Tutor')} <ArrowRight className="h-4 w-4" />
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
