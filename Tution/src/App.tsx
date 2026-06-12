import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Mail, 
  GraduationCap, 
  CheckCircle, 
  AlertTriangle, 
  Calendar, 
  Sliders,
  Briefcase,
  Layers,
  ChevronRight,
  BookOpen,
  Trash2,
  FileText,
  UserCheck
} from 'lucide-react';

import { Student, ActivityLog, Tutor, Course } from './types';
import { 
  INITIAL_STUDENTS, 
  INITIAL_ACTIVITY_LOGS, 
  INITIAL_TUTORS, 
  INITIAL_COURSES,
  loadFromStorage, 
  saveToStorage 
} from './data';

import Sidebar from './components/Sidebar';
import Header from './components/Header';
import LandingPage from './components/LandingPage';
import AdminDashboard from './components/AdminDashboard';
import StudentManagement from './components/StudentManagement';
import FinancialOverview from './components/FinancialOverview';

export default function App() {
  // Navigation View State
  const [currentTab, setCurrentTab] = useState<'landing' | 'dashboard' | 'students' | 'billing'>('landing');

  // Core Datasets
  const [students, setStudents] = useState<Student[]>(() => loadFromStorage('edu_students', INITIAL_STUDENTS));
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(() => loadFromStorage('edu_activity', INITIAL_ACTIVITY_LOGS));
  const [tutors] = useState<Tutor[]>(INITIAL_TUTORS);
  const [courses] = useState<Course[]>(INITIAL_COURSES);

  // Search filter references
  const [searchTerm, setSearchTerm] = useState('');

  // Modals & Slideovers
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  // Quick enroll form states
  const [enrollForm, setEnrollForm] = useState({
    name: '',
    email: '',
    grade: 'Grade 10',
    course: 'Advanced Calculus',
    paymentStatus: 'Paid' as Student['paymentStatus'],
    outstandingDue: 0,
    feesPaid: 1500,
    attendance: 100
  });

  // Invoice creation form states
  const [invoiceForm, setInvoiceForm] = useState({
    studentId: '',
    amount: 150,
    type: 'General' as ActivityLog['type'],
    description: 'Supplemental Tutoring Session'
  });

  // Persist modifications to Local Storage on updates
  useEffect(() => {
    saveToStorage('edu_students', students);
  }, [students]);

  useEffect(() => {
    saveToStorage('edu_activity', activityLogs);
  }, [activityLogs]);

  // Handle addition of a new student (Quick Enroll)
  const handleAddStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!enrollForm.name || !enrollForm.email) {
      alert('Please fill out all critical student details.');
      return;
    }

    const uniqueId = `ST-${Math.floor(10000 + Math.random() * 90000)}`;
    const newStudent: Student = {
      id: uniqueId,
      name: enrollForm.name,
      avatar: '', // Custom avatar initials generated dynamic
      email: enrollForm.email,
      grade: enrollForm.grade,
      course: enrollForm.course,
      enrollmentDate: new Date().toISOString().split('T')[0],
      attendance: enrollForm.attendance,
      paymentStatus: enrollForm.paymentStatus,
      outstandingDue: Number(enrollForm.outstandingDue),
      feesPaid: Number(enrollForm.feesPaid)
    };

    const newLog: ActivityLog = {
      id: `ACT-${Math.floor(100 + Math.random() * 900)}`,
      studentId: uniqueId,
      studentName: enrollForm.name,
      avatar: '',
      course: enrollForm.course,
      type: 'New Enrollment',
      dateTime: 'Just now',
      status: 'Active'
    };

    setStudents([newStudent, ...students]);
    setActivityLogs([newLog, ...activityLogs]);
    setShowEnrollModal(false);

    // Initializer resets
    setEnrollForm({
      name: '',
      email: '',
      grade: 'Grade 10',
      course: 'Advanced Calculus',
      paymentStatus: 'Paid',
      outstandingDue: 0,
      feesPaid: 1500,
      attendance: 100
    });
  };

  // Handle Edit submission of existing student
  const handleEditStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;

    setStudents(students.map(s => s.id === editingStudent.id ? editingStudent : s));
    
    // Log change
    const newLog: ActivityLog = {
      id: `ACT-${Math.floor(100 + Math.random() * 900)}`,
      studentId: editingStudent.id,
      studentName: editingStudent.name,
      avatar: editingStudent.avatar,
      course: editingStudent.course,
      type: 'General',
      dateTime: 'Just now',
      status: 'Updated Profile'
    };
    
    setActivityLogs([newLog, ...activityLogs]);
    setEditingStudent(null);
  };

  // Handle student erasure
  const handleDeleteStudent = (id: string) => {
    const candidate = students.find(s => s.id === id);
    if (!candidate) return;

    if (confirm(`Are you certain you wish to remove student ${candidate.name} (ID: ${id})? This is irreversible.`)) {
      setStudents(students.filter(s => s.id !== id));
      
      const newLog: ActivityLog = {
        id: `ACT-${Math.floor(100 + Math.random() * 900)}`,
        studentName: candidate.name,
        avatar: '',
        type: 'General',
        dateTime: 'Just now',
        status: 'Deleted Profile'
      };
      setActivityLogs([newLog, ...activityLogs]);
    }
  };

  // Quick Action invoice creation
  const handleAddInvoiceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const matched = students.find(s => s.id === invoiceForm.studentId);
    if (!matched) {
      alert('Please select a valid registered student.');
      return;
    }

    // Modify payment status matching transaction
    const updatedStudents = students.map(s => {
      if (s.id === matched.id) {
        return {
          ...s,
          outstandingDue: s.outstandingDue + Number(invoiceForm.amount),
          paymentStatus: 'Pending' as Student['paymentStatus']
        };
      }
      return s;
    });

    const newLog: ActivityLog = {
      id: `ACT-${Math.floor(100 + Math.random() * 900)}`,
      studentId: matched.id,
      studentName: matched.name,
      avatar: matched.avatar,
      course: matched.course,
      type: invoiceForm.type,
      dateTime: 'Just now',
      amount: Number(invoiceForm.amount)
    };

    setStudents(updatedStudents);
    setActivityLogs([newLog, ...activityLogs]);
    setShowInvoiceModal(false);
    setInvoiceForm({
      studentId: '',
      amount: 150,
      type: 'General',
      description: 'Supplemental Tutoring'
    });
  };

  // Status updates
  const handleUpdatePaymentStatus = (id: string, status: 'Paid' | 'Pending' | 'Overdue') => {
    setStudents(students.map(s => {
      if (s.id === id) {
        return {
          ...s,
          paymentStatus: status,
          outstandingDue: status === 'Paid' ? 0 : s.outstandingDue,
          feesPaid: status === 'Paid' ? s.feesPaid + s.outstandingDue : s.feesPaid
        };
      }
      return s;
    }));

    const matched = students.find(s => s.id === id);
    if (matched) {
      const newLog: ActivityLog = {
        id: `ACT-${Math.floor(100 + Math.random() * 900)}`,
        studentId: id,
        studentName: matched.name,
        avatar: matched.avatar,
        course: matched.course,
        type: 'Fee Payment',
        dateTime: 'Just now',
        amount: matched.outstandingDue
      };
      setActivityLogs([newLog, ...activityLogs]);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-gray-900 font-sans antialiased">
      
      {/* Dynamic Render: If on public Landing, show clean landing portal */}
      {currentTab === 'landing' ? (
        <LandingPage onLogin={() => setCurrentTab('dashboard')} />
      ) : (
        
        /* Unified CRM Administration Panel Layout */
        <div className="flex pl-64 min-h-screen relative">
          
          {/* Static Left Navigation rail drawer */}
          <Sidebar 
            currentTab={currentTab} 
            setCurrentTab={setCurrentTab} 
            onQuickEnroll={() => setShowEnrollModal(true)}
          />

          {/* Core Content canvas */}
          <div className="flex-1 flex flex-col relative w-full overflow-x-hidden min-h-screen">
            
            {/* Navigational Contextual Header */}
            <Header 
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              onAddStudent={() => currentTab === 'billing' ? setShowInvoiceModal(true) : setShowEnrollModal(true)}
              currentTab={currentTab}
            />

            {/* Inner Route Wrapper */}
            <main className="p-8 pb-20 max-w-7xl mx-auto w-full flex-1">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentTab}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.25 }}
                >
                  {currentTab === 'dashboard' && (
                    <AdminDashboard 
                      students={students}
                      activityLogs={activityLogs}
                      tutors={tutors}
                      onNavigateToTab={setCurrentTab}
                      onSelectStudent={setSelectedStudent}
                      onQuickEnroll={() => setShowEnrollModal(true)}
                    />
                  )}

                  {currentTab === 'students' && (
                    <StudentManagement 
                      students={students}
                      onAddStudent={() => setShowEnrollModal(true)}
                      onEditStudent={setEditingStudent}
                      onDeleteStudent={handleDeleteStudent}
                      onSelectStudent={setSelectedStudent}
                      onUpdatePaymentStatus={handleUpdatePaymentStatus}
                    />
                  )}

                  {currentTab === 'billing' && (
                    <FinancialOverview 
                      students={students}
                      onOpenQuickInvoice={() => setShowInvoiceModal(true)}
                      onUpdatePaymentStatus={handleUpdatePaymentStatus}
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </main>

          </div>

        </div>
      )}

      {/* --- POPUP DIALOGS & OVERLAY SLIDEOVERS --- */}

      {/* 1. Slideover Draver: Detailed Student Profile Specs */}
      <AnimatePresence>
        {selectedStudent && (
          <div className="fixed inset-0 z-50 overflow-hidden" aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
            <div className="absolute inset-0 overflow-hidden">
              {/* Back backdrop shade */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedStudent(null)}
                className="absolute inset-0 bg-slate-900/60 transition-opacity"
              ></motion.div>

              <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                <motion.div 
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '100%' }}
                  transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                  className="pointer-events-auto w-screen max-w-md bg-white shadow-2xl flex flex-col h-full border-l border-slate-205"
                >
                  <div className="flex-1 overflow-y-auto py-6 px-4 sm:px-6">
                    <div className="flex items-start justify-between">
                      <h2 className="text-lg font-black text-gray-900" id="slide-over-title">Student Profile Specs</h2>
                      <button 
                        onClick={() => setSelectedStudent(null)}
                        className="rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-105 p-1 transition-colors"
                      >
                        <X className="h-6 w-6" />
                      </button>
                    </div>

                    <div className="mt-8 text-center flex flex-col items-center">
                      <div className="w-24 h-24 rounded-full border-4 border-blue-900/10 shadow-inner flex items-center justify-center bg-blue-50 text-blue-900 text-3xl font-black mb-4 overflow-hidden">
                        {selectedStudent.avatar ? (
                          <img className="w-full h-full object-cover" src={selectedStudent.avatar} alt="Student Profile Avatar" />
                        ) : (
                          <span>{selectedStudent.name.split(' ').map(n => n[0]).join('')}</span>
                        )}
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">{selectedStudent.name}</h3>
                      <p className="text-xs text-gray-450 font-semibold uppercase">{selectedStudent.id}</p>
                    </div>

                    {/* Detailed characteristics stats Grid */}
                    <div className="mt-8 border-t border-gray-150 pt-6 space-y-6">
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-150 text-left">
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Attendance Rate</p>
                          <p className="text-xl font-black text-blue-900 mt-1">{selectedStudent.attendance}%</p>
                        </div>
                        <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-150 text-left">
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Payment Status</p>
                          <span className={`inline-block px-2.5 py-0.5 rounded text-xs font-bold mt-1 ${
                            selectedStudent.paymentStatus === 'Paid' ? 'bg-green-100 text-green-700' :
                            selectedStudent.paymentStatus === 'Pending' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                          }`}>
                            {selectedStudent.paymentStatus}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-lg transition-colors text-left">
                          <Mail className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase">Contact Email</p>
                            <p className="text-sm font-semibold text-gray-800">{selectedStudent.email}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-lg transition-colors text-left">
                          <GraduationCap className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase">Academic Class</p>
                            <p className="text-sm font-semibold text-gray-800">{selectedStudent.grade}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-lg transition-colors text-left">
                          <BookOpen className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase">Enrolled Course</p>
                            <p className="text-sm font-semibold text-gray-800">{selectedStudent.course}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-lg transition-colors text-left">
                          <Calendar className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase">Registration Date</p>
                            <p className="text-sm font-semibold text-gray-800">{selectedStudent.enrollmentDate}</p>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Actions footer block */}
                  <div className="border-t border-gray-200 p-4 sm:p-6 bg-slate-50 flex gap-4">
                    {selectedStudent.paymentStatus !== 'Paid' && (
                      <button 
                        onClick={() => {
                          handleUpdatePaymentStatus(selectedStudent.id, 'Paid');
                          setSelectedStudent(null);
                        }}
                        className="flex-1 bg-green-700 hover:bg-green-800 text-white font-bold text-sm py-3 rounded-lg shadow transition-colors block text-center"
                      >
                        Mark Invoice as Paid
                      </button>
                    )}
                    <button 
                      onClick={() => {
                        handleDeleteStudent(selectedStudent.id);
                        setSelectedStudent(null);
                      }}
                      className="bg-red-50 hover:bg-red-100 hover:text-red-900 border border-red-200 text-red-600 font-bold px-4 py-3 rounded-lg transition-colors"
                      title="Erase Student Records"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                    <button 
                      onClick={() => setSelectedStudent(null)}
                      className="bg-white border border-gray-250 text-gray-600 px-4 py-3 rounded-lg hover:bg-gray-100 text-sm font-bold"
                    >
                      Close Details
                    </button>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* 2. Dialog Popup Modal: Enroll New Student Form */}
      <AnimatePresence>
        {showEnrollModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowEnrollModal(false)}
              className="absolute inset-0 bg-slate-900/60"
            ></motion.div>

            {/* Modal Body */}
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 15 }}
              className="bg-white rounded-2xl shadow-2xl relative w-full max-w-lg z-10 overflow-hidden border border-gray-200"
            >
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                <h3 className="font-sans font-black text-gray-900 text-lg">Quick Student Enrollment</h3>
                <button 
                  onClick={() => setShowEnrollModal(false)}
                  className="rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 p-1"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleAddStudentSubmit} className="p-6 space-y-4">
                
                {/* Full name input */}
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Full Student Name</label>
                  <input 
                    type="text" 
                    required
                    value={enrollForm.name}
                    onChange={(e) => setEnrollForm({ ...enrollForm, name: e.target.value })}
                    placeholder="e.g. Liam Hudson"
                    className="w-full bg-slate-50 border border-gray-250 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900/15"
                  />
                </div>

                {/* Contact email */}
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Parent / Tutee Email</label>
                  <input 
                    type="email" 
                    required
                    value={enrollForm.email}
                    onChange={(e) => setEnrollForm({ ...enrollForm, email: e.target.value })}
                    placeholder="email@domain.com"
                    className="w-full bg-slate-50 border border-gray-250 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900/15"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Select Grade level */}
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Grade Level</label>
                    <select 
                      value={enrollForm.grade}
                      onChange={(e) => setEnrollForm({ ...enrollForm, grade: e.target.value })}
                      className="w-full bg-slate-50 border border-gray-250 rounded-lg p-2.5 text-sm cursor-pointer"
                    >
                      <option>Grade 9</option>
                      <option>Grade 10</option>
                      <option>Grade 11</option>
                      <option>Grade 12</option>
                    </select>
                  </div>

                  {/* Select Enrolling Course */}
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Target Course</label>
                    <select 
                      value={enrollForm.course}
                      onChange={(e) => setEnrollForm({ ...enrollForm, course: e.target.value })}
                      className="w-full bg-slate-50 border border-gray-250 rounded-lg p-2.5 text-sm cursor-pointer"
                    >
                      {courses.map(c => (
                        <option key={c.id} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-4">
                  {/* Initial Fees Paid */}
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Initial Fees Paid (₹)</label>
                    <input 
                      type="number" 
                      min="0"
                      value={enrollForm.feesPaid}
                      onChange={(e) => setEnrollForm({ ...enrollForm, feesPaid: Number(e.target.value) })}
                      className="w-full bg-slate-50 border border-gray-250 rounded-lg p-2.5 text-sm"
                    />
                  </div>

                  {/* Outstanding balance */}
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Outstanding Due (₹)</label>
                    <input 
                      type="number" 
                      min="0"
                      value={enrollForm.outstandingDue}
                      onChange={(e) => setEnrollForm({ ...enrollForm, outstandingDue: Number(e.target.value) })}
                      className="w-full bg-slate-50 border border-gray-250 rounded-lg p-2.5 text-sm"
                    />
                  </div>
                </div>

                {/* Payment status Select */}
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Payment Status Tag</label>
                  <select 
                    value={enrollForm.paymentStatus}
                    onChange={(e) => setEnrollForm({ ...enrollForm, paymentStatus: e.target.value as Student['paymentStatus'] })}
                    className="w-full bg-slate-50 border border-gray-250 rounded-lg p-2.5 text-sm cursor-pointer font-semibold"
                  >
                    <option value="Paid">Paid</option>
                    <option value="Pending">Pending</option>
                    <option value="Overdue">Overdue</option>
                  </select>
                </div>

                <div className="pt-4 border-t border-gray-150 flex gap-3 justify-end">
                  <button 
                    type="button"
                    onClick={() => setShowEnrollModal(false)}
                    className="border border-gray-250 text-gray-600 hover:bg-gray-100 font-bold text-xs py-2.5 px-4 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="bg-blue-900 text-white hover:bg-blue-800 font-bold text-xs py-2.5 px-6 rounded-lg shadow"
                  >
                    Enroll Student
                  </button>
                </div>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 3. Dialog Popup Modal: Transaction / Invoice Receipt Generator */}
      <AnimatePresence>
        {showInvoiceModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowInvoiceModal(false)}
              className="absolute inset-0 bg-slate-900/60"
            ></motion.div>

            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 15 }}
              className="bg-white rounded-2xl shadow-2xl relative w-full max-w-md z-10 overflow-hidden border border-gray-200"
            >
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                <h3 className="font-sans font-black text-gray-900 text-lg">Generate Quick Invoice</h3>
                <button 
                  onClick={() => setShowInvoiceModal(false)}
                  className="rounded-md text-gray-400 p-1"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleAddInvoiceSubmit} className="p-6 space-y-4">
                
                {/* Select student recipient */}
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Target Student</label>
                  <select 
                    required
                    value={invoiceForm.studentId}
                    onChange={(e) => setInvoiceForm({ ...invoiceForm, studentId: e.target.value })}
                    className="w-full bg-slate-50 border border-gray-250 p-2.5 rounded-lg text-sm cursor-pointer"
                  >
                    <option value="">Select recipient...</option>
                    {students.map(s => (
                      <option key={s.id} value={s.id}>{s.name} ({s.id})</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Amount charge */}
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Charge Amount (₹)</label>
                    <input 
                      type="number" 
                      required
                      min="1"
                      value={invoiceForm.amount}
                      onChange={(e) => setInvoiceForm({ ...invoiceForm, amount: Number(e.target.value) })}
                      className="w-full bg-slate-50 border border-gray-250 p-2.5 rounded-lg text-sm"
                    />
                  </div>

                  {/* Transaction status categorizations */}
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Invoice Categorization</label>
                    <select 
                      value={invoiceForm.type}
                      onChange={(e) => setInvoiceForm({ ...invoiceForm, type: e.target.value as ActivityLog['type'] })}
                      className="w-full bg-slate-50 border border-gray-250 p-2.5 rounded-lg text-sm cursor-pointer"
                    >
                      <option value="Fee Payment">Fee Payment Invoice</option>
                      <option value="New Enrollment">Enrollment Charge</option>
                      <option value="Session Scheduled">Session Fee</option>
                      <option value="General">General Administrative</option>
                    </select>
                  </div>
                </div>

                {/* Brief description text */}
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Custom Receipt Memo</label>
                  <textarea 
                    value={invoiceForm.description}
                    onChange={(e) => setInvoiceForm({ ...invoiceForm, description: e.target.value })}
                    rows={2}
                    className="w-full bg-slate-50 border border-gray-250 p-2.5 rounded-lg text-sm focus:outline-none"
                    placeholder="e.g. Supplemental materials fee for Math AP"
                  ></textarea>
                </div>

                <div className="pt-4 border-t border-gray-150 flex gap-3 justify-end">
                  <button 
                    type="button"
                    onClick={() => setShowInvoiceModal(false)}
                    className="border border-gray-250 text-gray-600 hover:bg-gray-100 font-bold text-xs py-2.5 px-4 rounded-lg"
                  >
                    Discard
                  </button>
                  <button 
                    type="submit"
                    className="bg-blue-900 text-white hover:bg-blue-800 font-bold text-xs py-2.5 px-6 rounded-lg shadow"
                  >
                    Confirm Invoice
                  </button>
                </div>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 4. Edit Student Modal Dialog */}
      <AnimatePresence>
        {editingStudent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingStudent(null)}
              className="absolute inset-0 bg-slate-900/60"
            ></motion.div>

            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 15 }}
              className="bg-white rounded-2xl shadow-2xl relative w-full max-w-md z-10 overflow-hidden border border-gray-200"
            >
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                <h3 className="font-sans font-black text-gray-900 text-lg">Update Student Credentials</h3>
                <button 
                  onClick={() => setEditingStudent(null)}
                  className="rounded-md text-gray-400 p-1"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleEditStudentSubmit} className="p-6 space-y-4">
                
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Full Student Name</label>
                  <input 
                    type="text" 
                    required
                    value={editingStudent.name}
                    onChange={(e) => setEditingStudent({ ...editingStudent, name: e.target.value })}
                    className="w-full bg-slate-50 border border-gray-250 p-2.5 rounded-lg text-sm"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Email</label>
                  <input 
                    type="email" 
                    required
                    value={editingStudent.email}
                    onChange={(e) => setEditingStudent({ ...editingStudent, email: e.target.value })}
                    className="w-full bg-slate-50 border border-gray-250 p-2.5 rounded-lg text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Course</label>
                    <select 
                      value={editingStudent.course}
                      onChange={(e) => setEditingStudent({...editingStudent, course: e.target.value})}
                      className="w-full bg-slate-50 border border-gray-250 p-2.5 rounded-lg text-sm cursor-pointer"
                    >
                      {courses.map(c => (
                        <option key={c.id} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Grade</label>
                    <select 
                      value={editingStudent.grade}
                      onChange={(e) => setEditingStudent({...editingStudent, grade: e.target.value})}
                      className="w-full bg-slate-50 border border-gray-250 p-2.5 rounded-lg text-sm cursor-pointer"
                    >
                      <option>Grade 9</option>
                      <option>Grade 10</option>
                      <option>Grade 11</option>
                      <option>Grade 12</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Outstanding Balance</label>
                    <input 
                      type="number" 
                      value={editingStudent.outstandingDue}
                      onChange={(e) => setEditingStudent({...editingStudent, outstandingDue: Number(e.target.value)})}
                      className="w-full bg-slate-50 border border-gray-250 p-2.5 rounded-lg text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Attendance Rate (%)</label>
                    <input 
                      type="number" 
                      min="0"
                      max="100"
                      value={editingStudent.attendance}
                      onChange={(e) => setEditingStudent({...editingStudent, attendance: Number(e.target.value)})}
                      className="w-full bg-slate-50 border border-gray-250 p-2.5 rounded-lg text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Invoice Status Tag</label>
                  <select 
                    value={editingStudent.paymentStatus}
                    onChange={(e) => setEditingStudent({...editingStudent, paymentStatus: e.target.value as Student['paymentStatus']})}
                    className="w-full bg-slate-50 border border-gray-250 p-2.5 rounded-lg text-sm cursor-pointer font-bold"
                  >
                    <option value="Paid">Paid</option>
                    <option value="Pending">Pending</option>
                    <option value="Overdue">Overdue</option>
                  </select>
                </div>

                <div className="pt-4 border-t border-gray-150 flex gap-3 justify-end">
                  <button 
                    type="button"
                    onClick={() => setEditingStudent(null)}
                    className="border border-gray-250 text-gray-600 hover:bg-gray-100 font-bold text-xs py-2.5 px-4 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="bg-blue-900 text-white hover:bg-blue-800 font-bold text-xs py-2.5 px-6 rounded-lg shadow"
                  >
                    Confirm Changes
                  </button>
                </div>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
