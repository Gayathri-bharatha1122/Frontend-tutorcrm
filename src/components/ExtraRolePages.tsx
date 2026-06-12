import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  BookOpen, 
  IndianRupee, 
  Settings, 
  FileText, 
  Check, 
  Edit2, 
  Trash2, 
  Plus, 
  Search, 
  Mail, 
  Phone, 
  ArrowUpRight, 
  Database, 
  Calendar, 
  TrendingUp, 
  Award, 
  Download, 
  UserPlus, 
  Power, 
  Bell, 
  User,
  ShieldAlert,
  Clock,
  MapPin,
  CheckCircle,
  FileDown
} from 'lucide-react';
import { useLanguage } from '../LanguageContext';

// Helper component for count-up metrics
const StaticCounter: React.FC<{ value: string | number; label: string; icon: React.ReactNode; colorClass: string }> = ({ value, label, icon, colorClass }) => {
  return (
    <div className="bg-slate-900 border border-slate-800/80 rounded-2xl p-5 relative overflow-hidden transition-all hover:border-slate-700/80 hover:shadow-lg">
      <div className={`absolute right-3 top-3 w-8 h-8 rounded-lg ${colorClass} flex items-center justify-center`}>
        {icon}
      </div>
      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">{label}</span>
      <span className="text-2xl font-extrabold text-white mt-1 block">{value}</span>
    </div>
  );
};

// ==================== ADMIN PAGES ====================

// 1. User Management
export const AdminUserManagement: React.FC = () => {
  const { t } = useLanguage();
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<'All' | 'Admin' | 'Tutor' | 'Parent' | 'Student'>('All');
  const [users, setUsers] = useState([
    { id: 'U001', name: 'System Administrator', email: 'admin@edumanage.com', role: 'Admin', status: 'Active', phone: '1234567890' },
    { id: 'U002', name: 'Prof. Alistair Miller', email: 'alistair.miller@edumanage.com', role: 'Tutor', status: 'Active', phone: '9876543210' },
    { id: 'U003', name: 'Helena Thorne', email: 'helena.thorne@edumanage.com', role: 'Parent', status: 'Active', phone: '5551234567' },
    { id: 'U004', name: 'Marcus Thorne', email: 'marcus.thorne@edumail.com', role: 'Student', status: 'Active', phone: '5557654321' },
    { id: 'U005', name: 'Sarah Jenkins', email: 'sarah.jenkins@edumanage.com', role: 'Tutor', status: 'Active', phone: '9998887777' },
    { id: 'U006', name: 'Evelyn Sterling', email: 'evelyn.sterling@edumanage.com', role: 'Tutor', status: 'Pending', phone: '4445556666' }
  ]);
  const [notif, setNotif] = useState<string | null>(null);

  const toggleStatus = (id: string) => {
    setUsers(prev => prev.map(u => {
      if (u.id === id) {
        const nextStatus = u.status === 'Active' ? 'Suspended' : 'Active';
        setNotif(`User ${u.name} status updated to ${nextStatus}.`);
        setTimeout(() => setNotif(null), 3000);
        return { ...u, status: nextStatus };
      }
      return u;
    }));
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === 'All' ? true : u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white">{t('System User Registry')}</h2>
          <p className="text-xs text-slate-400">{t('Manage authorization credentials and roles for campus occupants.')}</p>
        </div>
        <button 
          onClick={() => {
            setNotif('Adding new user forms requires database credentials.');
            setTimeout(() => setNotif(null), 3500);
          }}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-xs font-bold text-white transition flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <UserPlus className="h-4 w-4" /> {t('Create User Clearance')}
        </button>
      </div>

      <AnimatePresence>
        {notif && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0 }}
            className="bg-indigo-600/90 border border-indigo-500/25 p-3 rounded-xl text-xs text-white flex items-center justify-between"
          >
            <span>{notif}</span>
            <button onClick={() => setNotif(null)} className="font-bold">X</button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StaticCounter value={users.length} label="Total Registered" icon={<Users className="h-4.5 w-4.5" />} colorClass="bg-indigo-600/10 text-indigo-400" />
        <StaticCounter value={users.filter(u => u.status === 'Active').length} label="Active Clearances" icon={<Check className="h-4.5 w-4.5" />} colorClass="bg-emerald-600/10 text-emerald-400" />
        <StaticCounter value={users.filter(u => u.status === 'Pending').length} label="Pending Review" icon={<Clock className="h-4.5 w-4.5" />} colorClass="bg-amber-600/10 text-amber-400" />
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <input 
              type="text" 
              placeholder={t('Search users by name or email...')} 
              value={search} 
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800/80 rounded-xl text-xs pl-10 pr-4 py-2.5 outline-none focus:border-indigo-500 text-slate-350"
            />
          </div>
          <div className="flex p-1 bg-slate-950 rounded-xl border border-slate-805 max-w-max text-[11px] font-bold">
            {(['All', 'Admin', 'Tutor', 'Parent', 'Student'] as const).map(role => (
              <button
                key={role}
                onClick={() => setRoleFilter(role)}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${roleFilter === role ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
              >
                {role}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto border border-slate-850 rounded-2xl bg-slate-950 shadow-inner">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-950 border-b border-slate-850 text-slate-450 font-bold uppercase tracking-wider text-[9px] text-slate-400">
              <tr>
                <th className="p-3">UID</th>
                <th className="p-3">User Identity</th>
                <th className="p-3">Account Level</th>
                <th className="p-3">Contact info</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850">
              {filteredUsers.map(u => (
                <tr key={u.id} className="hover:bg-slate-900/40 transition">
                  <td className="p-3 font-mono text-[10px] text-slate-500">{u.id}</td>
                  <td className="p-3">
                    <span className="font-bold text-white block">{u.name}</span>
                    <span className="text-[10px] text-slate-500 font-mono">{u.email}</span>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                      u.role === 'Admin' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' :
                      u.role === 'Tutor' ? 'bg-teal-500/10 text-teal-400 border border-teal-500/20' :
                      u.role === 'Parent' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                      'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="p-3 font-mono text-slate-400 text-[10px]">{u.phone}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                      u.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
                      u.status === 'Pending' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30 animate-pulse' :
                      'bg-rose-500/10 text-rose-450 border border-rose-500/20 text-rose-400'
                    }`}>
                      {u.status}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => toggleStatus(u.id)}
                        className={`p-1.5 rounded-lg border text-slate-400 transition hover:text-white cursor-pointer ${
                          u.status === 'Active' ? 'border-rose-500/20 hover:bg-rose-500/10' : 'border-emerald-500/20 hover:bg-emerald-500/10'
                        }`}
                        title={u.status === 'Active' ? 'Suspend Account' : 'Activate Account'}
                      >
                        <Power className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// 2. Parent Management
export const AdminParentManagement: React.FC = () => {
  const { t } = useLanguage();
  const [search, setSearch] = useState('');
  const parents = [
    { id: 'PR001', name: 'Helena Thorne', email: 'helena.thorne@edumanage.com', linkedChild: 'Marcus Thorne', phone: '5551234567', dues: 250, status: 'Active' },
    { id: 'PR002', name: 'Jonathan Sterling', email: 'jonathan.sterling@gmail.com', linkedChild: 'Clarissa Sterling', phone: '5558889999', dues: 0, status: 'Active' },
    { id: 'PR003', name: 'Robert Jenkins', email: 'r.jenkins@yahoo.com', linkedChild: 'Daniel Jenkins', phone: '5552223333', dues: 500, status: 'Active' },
    { id: 'PR004', name: 'Alice Watson', email: 'awatson@outlook.com', linkedChild: 'Billy Watson', phone: '5554445555', dues: 0, status: 'Inactive' }
  ];

  const filteredParents = parents.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.linkedChild.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-extrabold text-white">{t('Guardian Directory')}</h2>
        <p className="text-xs text-slate-400">{t('Manage family billing links, pupil relationships, and parent emergency contacts.')}</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <input 
            type="text" 
            placeholder={t('Search by parent name or linked pupil...')} 
            value={search} 
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800/80 rounded-xl text-xs pl-10 pr-4 py-2.5 outline-none focus:border-indigo-500 text-slate-350"
          />
        </div>

        <div className="overflow-x-auto border border-slate-850 rounded-2xl bg-slate-950 shadow-inner">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-950 border-b border-slate-850 text-slate-400 font-bold uppercase tracking-wider text-[9px]">
              <tr>
                <th className="p-3">Parent Name</th>
                <th className="p-3">Linked Child</th>
                <th className="p-3">Emergency Contact</th>
                <th className="p-3 text-center">Outstanding Dues</th>
                <th className="p-3 text-right">Clearance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850">
              {filteredParents.map(p => (
                <tr key={p.id} className="hover:bg-slate-900/40 transition">
                  <td className="p-3">
                    <span className="font-bold text-white block">{p.name}</span>
                    <span className="text-[10px] text-slate-500 font-mono">{p.email}</span>
                  </td>
                  <td className="p-3 font-semibold text-indigo-400 flex items-center gap-1">
                    <User className="h-3.5 w-3.5 text-slate-500" /> {p.linkedChild}
                  </td>
                  <td className="p-3 font-mono text-[10px] text-slate-400">{p.phone}</td>
                  <td className="p-3 text-center font-bold font-mono text-white text-[13px]">
                    {p.dues > 0 ? (
                      <span className="text-amber-450 text-amber-500">₹{p.dues}</span>
                    ) : (
                      <span className="text-emerald-450 text-emerald-400">₹0</span>
                    )}
                  </td>
                  <td className="p-3 text-right">
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                      p.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-500'
                    }`}>
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// 3. Admin Courses Page
export const AdminCoursesPage: React.FC = () => {
  const { t } = useLanguage();
  const [courses] = useState([
    { id: 'C001', name: 'Advanced Honors Physics', tutor: 'Prof. Alistair Miller', schedule: 'Tues/Thurs @ 3:00 PM', room: 'Seminar Space B1', students: 18, color: 'border-teal-500/20 bg-teal-500/5' },
    { id: 'C002', name: 'Honors Calculus BC', tutor: 'Sarah Jenkins', schedule: 'Mondays @ 4:30 PM', room: 'Lab Room 4', students: 24, color: 'border-indigo-500/20 bg-indigo-500/5' },
    { id: 'C003', name: 'Introduction to Organic Chemistry', tutor: 'Dr. Evelyn Sterling', schedule: 'Wednesdays @ 2:00 PM', room: 'Chemical Lab 2', students: 12, color: 'border-amber-500/20 bg-amber-500/5' },
    { id: 'C004', name: 'AP English Literature', tutor: 'Sarah Jenkins', schedule: 'Fridays @ 10:00 AM', room: 'Syllabus Room 1', students: 15, color: 'border-emerald-500/20 bg-emerald-500/5' }
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-extrabold text-white">{t('Academic Course Syllabus Directory')}</h2>
        <p className="text-xs text-slate-400">{t('Monitor scheduled classroom locations and student enrollment distribution.')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {courses.map(c => (
          <div key={c.id} className={`border rounded-2xl p-5 space-y-4 ${c.color} relative overflow-hidden transition-all hover:scale-[1.01]`}>
            <div className="flex justify-between items-start gap-4">
              <div>
                <span className="text-[9px] font-mono font-bold text-slate-500 uppercase block tracking-wider">Course ID: {c.id}</span>
                <h3 className="text-sm font-bold text-white mt-0.5">{c.name}</h3>
              </div>
              <span className="text-[10px] font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded">Active</span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs border-t border-slate-800/40 pt-4">
              <div className="space-y-1">
                <span className="text-[9px] text-slate-500 font-bold uppercase block">Instructor Faculty</span>
                <span className="text-slate-200 font-semibold">{c.tutor}</span>
              </div>
              <div className="space-y-1">
                <span className="text-[9px] text-slate-500 font-bold uppercase block">Classroom location</span>
                <span className="text-slate-350 flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-indigo-400 shrink-0" /> {c.room}
                </span>
              </div>
              <div className="space-y-1">
                <span className="text-[9px] text-slate-500 font-bold uppercase block">Scheduled Coordinates</span>
                <span className="text-slate-350 flex items-center gap-1 font-mono text-[10px]">
                  <Clock className="h-3.5 w-3.5 text-indigo-400 shrink-0" /> {c.schedule}
                </span>
              </div>
              <div className="space-y-1">
                <span className="text-[9px] text-slate-500 font-bold uppercase block">Enrolled Students</span>
                <span className="text-slate-205 font-bold text-slate-200">{c.students} Pupil profiles</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// 4. Admin Fees/Financial Page
export const AdminFeesPage: React.FC = () => {
  const { t } = useLanguage();
  const invoices = [
    { code: 'INV-1029', parent: 'Helena Thorne', amount: 250, status: 'Overdue', date: 'May 01, 2026' },
    { code: 'INV-1028', parent: 'Robert Jenkins', amount: 500, status: 'Overdue', date: 'May 10, 2026' },
    { code: 'INV-1027', parent: 'Jonathan Sterling', amount: 350, status: 'Paid', date: 'May 15, 2026' },
    { code: 'INV-1026', parent: 'Helena Thorne', amount: 250, status: 'Paid', date: 'Apr 28, 2026' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-extrabold text-white">{t('Revenue Control Ledger')}</h2>
        <p className="text-xs text-slate-400">{t('Track paid receipts, pending invoices, and outstanding surcharges.')}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StaticCounter value="₹1,350" label="Total Revenue Collected" icon={<TrendingUp className="h-4.5 w-4.5" />} colorClass="bg-emerald-600/10 text-emerald-400" />
        <StaticCounter value="₹750" label="Outstanding Receivables" icon={<IndianRupee className="h-4.5 w-4.5" />} colorClass="bg-amber-600/10 text-amber-400" />
        <StaticCounter value="50%" label="Invoice Paid Ratio" icon={<Award className="h-4.5 w-4.5" />} colorClass="bg-indigo-600/10 text-indigo-400" />
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4">
        <h3 className="text-sm font-bold text-white">{t('Billing Invoice Log')}</h3>
        <div className="overflow-x-auto border border-slate-850 rounded-2xl bg-slate-950 shadow-inner">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-950 border-b border-slate-850 text-slate-400 font-bold uppercase tracking-wider text-[9px]">
              <tr>
                <th className="p-3">Invoice Code</th>
                <th className="p-3">Recipient parent</th>
                <th className="p-3">Compiled Date</th>
                <th className="p-3 text-center">Invoiced Amount</th>
                <th className="p-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850">
              {invoices.map(inv => (
                <tr key={inv.code} className="hover:bg-slate-900/40 transition">
                  <td className="p-3 font-mono text-[10px] text-slate-450 font-bold">{inv.code}</td>
                  <td className="p-3 font-semibold text-white">{inv.parent}</td>
                  <td className="p-3 text-slate-405 text-[10px] font-mono text-slate-400">{inv.date}</td>
                  <td className="p-3 text-center font-bold font-mono text-white text-[13px]">₹{inv.amount}</td>
                  <td className="p-3 text-right">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                      inv.status === 'Paid' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400 animate-pulse'
                    }`}>
                      {inv.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// 5. Admin Reports Page
export const AdminReportsPage: React.FC = () => {
  const { t } = useLanguage();
  const [downloading, setDownloading] = useState<string | null>(null);

  const triggerDownload = (report: string) => {
    setDownloading(report);
    setTimeout(() => setDownloading(null), 2000);
  };

  const reportsList = [
    { title: 'Academic Term Grade Distribution', desc: 'GPA averages, course completions, and grade indices across cohorts.', file: 'gpa_cohort_q2_2026.pdf' },
    { title: 'Tuition Fee Collections & Revenue Audit', desc: 'Detailed receivables, transaction logs, and cleared balances files.', file: 'revenue_audit_q2_2026.pdf' },
    { title: 'Classroom Daily Attendance Summary Report', desc: 'Compilations of absences, excuses, and tutor attendance submissions.', file: 'attendance_summary_may_2026.pdf' },
    { title: 'System Security Log Registry Transcript', desc: 'Clearance tokens, session durations, and user activity registers.', file: 'security_registry_audit_2026.pdf' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-extrabold text-white">{t('Reports & Analytics')}</h2>
        <p className="text-xs text-slate-400">{t('Compile and download system-wide audit registries and analytics sheets.')}</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4">
        <h3 className="text-sm font-bold text-white mb-2">{t('Audit Report Downloads')}</h3>

        <div className="space-y-3">
          {reportsList.map(rep => (
            <div key={rep.file} className="bg-slate-950 p-4 rounded-2xl border border-slate-850 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-white">{rep.title}</h4>
                <p className="text-[10px] text-slate-500 max-w-xl">{rep.desc}</p>
              </div>

              {downloading === rep.file ? (
                <div className="px-4 py-2 bg-indigo-950/40 border border-indigo-500/20 text-indigo-400 text-[10px] font-bold rounded-xl flex items-center gap-1.5 shrink-0 self-start sm:self-auto">
                  <div className="w-3.5 h-3.5 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
                  <span>Compiling PDF...</span>
                </div>
              ) : (
                <button
                  onClick={() => triggerDownload(rep.file)}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 text-indigo-400 hover:text-indigo-300 text-[10px] font-bold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer shrink-0 self-start sm:self-auto"
                >
                  <FileDown className="h-4 w-4" /> Download PDF
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// 6. Admin Settings Page
export const AdminSettingsPage: React.FC = () => {
  const { t } = useLanguage();
  const [backupState, setBackupState] = useState<'idle' | 'running' | 'success'>('idle');
  const [campusName, setCampusName] = useState('EduManage Honors Academy');
  const [academicYear, setAcademicYear] = useState('2025-2026 Fall Term');
  const [isBackupDone, setIsBackupDone] = useState(false);

  const runBackup = () => {
    setBackupState('running');
    setTimeout(() => {
      setBackupState('success');
      setIsBackupDone(true);
      setTimeout(() => setBackupState('idle'), 3000);
    }, 2500);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-extrabold text-white">{t('System Node Configuration')}</h2>
        <p className="text-xs text-slate-400">{t('Configure default variables, campus parameters, and system backups.')}</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-6">
        {/* Core parameters */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-2">{t('Academy Identity')}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">Campus Name Identification</label>
              <input 
                type="text" 
                value={campusName}
                onChange={e => setCampusName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-850 text-xs px-3 py-2 rounded-xl outline-none focus:border-indigo-500 text-slate-200"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">Active Academic semester</label>
              <input 
                type="text" 
                value={academicYear}
                onChange={e => setAcademicYear(e.target.value)}
                className="w-full bg-slate-950 border border-slate-850 text-xs px-3 py-2 rounded-xl outline-none focus:border-indigo-500 text-slate-200"
              />
            </div>
          </div>
        </div>

        {/* Database Audit */}
        <div className="space-y-4 border-t border-slate-850 pt-6">
          <div className="flex items-center gap-2">
            <Database className="h-5 w-5 text-indigo-400" />
            <h3 className="text-sm font-bold text-white">{t('Registry Database Maintenance')}</h3>
          </div>
          <p className="text-xs text-slate-400 max-w-xl">
            Create an encrypted backup snapshot of the student registries, financial billing ledger, and messaging station index records instantly.
          </p>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            {backupState === 'running' ? (
              <div className="px-5 py-2.5 bg-indigo-950/40 border border-indigo-500/20 text-indigo-400 text-xs font-bold rounded-xl flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
                <span>Creating snapshot registry...</span>
              </div>
            ) : backupState === 'success' ? (
              <div className="px-5 py-2.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold rounded-xl flex items-center gap-1.5">
                <CheckCircle className="h-4 w-4" />
                <span>Backup Archive success!</span>
              </div>
            ) : (
              <button
                onClick={runBackup}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer shadow-lg shadow-indigo-600/15"
              >
                Trigger System Backup
              </button>
            )}

            {isBackupDone && (
              <span className="text-[10px] text-slate-500 font-mono">Last backup snapshot compiled: Just now</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};


// ==================== TUTOR PAGES ====================

// 1. Tutor Classes Page
export const TutorClassesPage: React.FC = () => {
  const { t } = useLanguage();
  const classes = [
    { title: 'Kinematic Vectors Honors', time: 'Tuesdays @ 3:00 PM', room: 'Seminar Studio B1', count: 18, details: 'Review rotational forces and moments of inertia variables.' },
    { title: 'Quantum Dynamics Core Vectors', time: 'Thursdays @ 3:00 PM', room: 'Laboratory Hall 1', count: 15, details: 'Analyze probability wave amplitudes and potential wells.' },
    { title: 'General Electromagnetism Final Review', time: 'Fridays @ 2:30 PM', room: 'Main Lecture Hall', count: 24, details: 'Final review on Faraday inductors, Gauss spheres, and Maxwell formulas.' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-extrabold text-white">{t('My Faculty Sections')}</h2>
        <p className="text-xs text-slate-400">{t('Review your scheduled teaching sessions, lecture halls, and pupil rosters.')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {classes.map((cls, idx) => (
          <div key={idx} className="bg-slate-900 border border-slate-800/80 rounded-2xl p-5 space-y-4 hover:border-teal-500/25 transition">
            <span className="text-[9px] font-bold text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded w-max block">
              Active Lecture Section
            </span>
            <div>
              <h3 className="text-sm font-bold text-white mb-1.5">{cls.title}</h3>
              <p className="text-[11px] text-slate-400 leading-normal">{cls.details}</p>
            </div>

            <div className="space-y-2 border-t border-slate-850 pt-4 text-xs">
              <div className="flex items-center justify-between text-slate-400">
                <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5 text-slate-500" /> {cls.time}</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5 text-slate-500" /> {cls.room}</span>
                <span className="font-bold text-white">{cls.count} Enrolled</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// 2. Student Performance List (Faculty view)
export const TutorPerformancePage: React.FC = () => {
  const { t } = useLanguage();
  const pupilPerformances = [
    { id: 'ST001', name: 'Marcus Thorne', grade: '11th Grade', avg: 91.5, status: 'Excellent', progress: 95 },
    { id: 'ST002', name: 'Clarissa Sterling', grade: '11th Grade', avg: 88.0, status: 'Good Progress', progress: 90 },
    { id: 'ST003', name: 'Daniel Jenkins', grade: '11th Grade', avg: 72.4, status: 'Warning Alert', progress: 75 },
    { id: 'ST004', name: 'Billy Watson', grade: '11th Grade', avg: 94.0, status: 'Excellent', progress: 98 }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-extrabold text-white">{t('Student Progress Auditing')}</h2>
        <p className="text-xs text-slate-400">{t('Evaluate student curriculum progress rates, GPA indexes, and syllabus coverage.')}</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4">
        <h3 className="text-sm font-bold text-white">{t('Pupil Performance Registry')}</h3>
        <div className="overflow-x-auto border border-slate-850 rounded-2xl bg-slate-950 shadow-inner">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-950 border-b border-slate-850 text-slate-400 font-bold uppercase tracking-wider text-[9px]">
              <tr>
                <th className="p-3">Student Name</th>
                <th className="p-3">Syllabus Progress</th>
                <th className="p-3 text-center">Average GPA Index</th>
                <th className="p-3 text-right">Academic Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850">
              {pupilPerformances.map(student => (
                <tr key={student.id} className="hover:bg-slate-900/40 transition">
                  <td className="p-3">
                    <span className="font-bold text-white block">{student.name}</span>
                    <span className="text-[10px] text-slate-500">{student.grade} Standard</span>
                  </td>
                  <td className="p-3 w-1/3">
                    <div className="flex justify-between items-center mb-1 text-[10px]">
                      <span className="text-slate-400 font-bold">{student.progress}%</span>
                    </div>
                    <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden border border-slate-800">
                      <div className="bg-teal-500 h-full rounded-full" style={{ width: `${student.progress}%` }} />
                    </div>
                  </td>
                  <td className="p-3 text-center font-bold font-mono text-white text-[13px]">
                    {student.avg}%
                  </td>
                  <td className="p-3 text-right">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                      student.status === 'Excellent' ? 'bg-emerald-500/10 text-emerald-450 text-emerald-400' :
                      student.status === 'Good Progress' ? 'bg-indigo-500/10 text-indigo-400' :
                      'bg-rose-500/10 text-rose-400 animate-pulse'
                    }`}>
                      {student.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// 3. Faculty Profile Page
export const TutorProfilePage: React.FC<{ tutorName: string }> = ({ tutorName }) => {
  const { t } = useLanguage();
  const [phone, setPhone] = useState('987-654-3210');
  const [email, setEmail] = useState('alistair.miller@edumanage.com');
  const [office, setOffice] = useState('Faculty Suite 404');
  const [notif, setNotif] = useState<string | null>(null);

  const saveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setNotif('Faculty directory coordinates updated successfully.');
    setTimeout(() => setNotif(null), 3000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-extrabold text-white">{t('Faculty Personal Card')}</h2>
        <p className="text-xs text-slate-400">{t('Update your campus index details, specialized fields, and contact hours.')}</p>
      </div>

      <AnimatePresence>
        {notif && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0 }}
            className="bg-teal-600/90 border border-teal-500/20 p-3 rounded-xl text-xs text-white"
          >
            {notif}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-20 h-20 rounded-full bg-teal-900/40 text-teal-400 border border-teal-500/25 flex items-center justify-center text-3xl font-extrabold">
            {tutorName[6] || 'T'}
          </div>
          <div>
            <h3 className="text-base font-bold text-white">{tutorName}</h3>
            <span className="text-[10px] text-teal-400 font-bold uppercase tracking-wider block mt-1">Senior Instructor Faculty</span>
          </div>
          <p className="text-xs text-slate-400">Specialist in Relativistic Physics, Quantum Dynamics vectors, and syllabus curriculum compilation.</p>
        </div>

        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6">
          <form onSubmit={saveProfile} className="space-y-4">
            <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-2">Personal Coordinates</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-450 uppercase mb-1">Email address</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850 text-xs px-3 py-2.5 rounded-xl outline-none focus:border-teal-500 text-slate-200"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-450 uppercase mb-1">Office coordinates</label>
                <input 
                  type="text" 
                  value={office}
                  onChange={e => setOffice(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850 text-xs px-3 py-2.5 rounded-xl outline-none focus:border-teal-500 text-slate-200"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-450 uppercase mb-1">Contact number</label>
                <input 
                  type="text" 
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850 text-xs px-3 py-2.5 rounded-xl outline-none focus:border-teal-500 text-slate-200 font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer shadow-lg shadow-teal-600/15 flex items-center gap-1.5"
            >
              Update Faculty Profile
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};


// ==================== PARENT PAGES ====================

// 1. Parent Profile Page
export const ParentProfilePage: React.FC<{ parentName: string; childName: string }> = ({ parentName, childName }) => {
  const { t } = useLanguage();
  const [phone, setPhone] = useState('555-123-4567');
  const [email, setEmail] = useState('helena.thorne@edumanage.com');
  const [emergency, setEmergency] = useState('555-987-6543 (Guardian Father)');
  const [notif, setNotif] = useState<string | null>(null);

  const saveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setNotif('Emergency coordinates and linkage files updated.');
    setTimeout(() => setNotif(null), 3000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-extrabold text-white">{t('Guardian Profile Card')}</h2>
        <p className="text-xs text-slate-400">{t('Update your emergency numbers, linkage profile, and email preferences.')}</p>
      </div>

      <AnimatePresence>
        {notif && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0 }}
            className="bg-amber-600/90 border border-amber-500/20 p-3 rounded-xl text-xs text-white"
          >
            {notif}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-20 h-20 rounded-full bg-amber-900/40 text-amber-400 border border-amber-500/25 flex items-center justify-center text-3xl font-extrabold">
            {parentName[0] || 'P'}
          </div>
          <div>
            <h3 className="text-base font-bold text-white">{parentName}</h3>
            <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider block mt-1">Authorized Guardian parent</span>
          </div>
          <div className="bg-slate-950/80 px-3 py-1.5 rounded-xl border border-slate-850 text-xs text-slate-400">
            Linked pupil: <strong className="text-indigo-400">{childName}</strong>
          </div>
        </div>

        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6">
          <form onSubmit={saveProfile} className="space-y-4">
            <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-2">Emergency Contacts</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-450 uppercase mb-1.5">Email address</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850 text-xs px-3 py-2.5 rounded-xl outline-none focus:border-amber-500 text-slate-200"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-450 uppercase mb-1.5">Contact phone</label>
                <input 
                  type="text" 
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850 text-xs px-3 py-2.5 rounded-xl outline-none focus:border-amber-500 text-slate-200 font-mono"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-[10px] font-bold text-slate-455 uppercase mb-1.5">Secondary Emergency contact link</label>
                <input 
                  type="text" 
                  value={emergency}
                  onChange={e => setEmergency(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850 text-xs px-3 py-2.5 rounded-xl outline-none focus:border-amber-500 text-slate-205 text-slate-200"
                />
              </div>
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 bg-amber-600 hover:bg-amber-550 text-white font-bold text-xs rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer shadow-lg shadow-amber-600/15 flex items-center gap-1.5"
            >
              Update Emergency File
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};


// ==================== STUDENT PAGES ====================

// 1. Student Profile Page
export const StudentProfilePage: React.FC<{ studentName: string }> = ({ studentName }) => {
  const { t } = useLanguage();
  const [phone, setPhone] = useState('555-765-4321');
  const [email, setEmail] = useState('marcus.thorne@edumail.com');
  const [theme, setTheme] = useState('Dark Mesh');
  const [notif, setNotif] = useState<string | null>(null);

  const saveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setNotif('Student profile coordinates and dashboard settings logged.');
    setTimeout(() => setNotif(null), 3000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-extrabold text-white">{t('Student Learning Profile')}</h2>
        <p className="text-xs text-slate-400">{t('Configure your avatar, dashboard style, and academic notification alerts.')}</p>
      </div>

      <AnimatePresence>
        {notif && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0 }}
            className="bg-emerald-600/90 border border-emerald-500/20 p-3 rounded-xl text-xs text-white"
          >
            {notif}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-20 h-20 rounded-full bg-emerald-900/40 text-emerald-400 border border-emerald-500/25 flex items-center justify-center text-3xl font-extrabold">
            {studentName[0] || 'S'}
          </div>
          <div>
            <h3 className="text-base font-bold text-white">{studentName}</h3>
            <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider block mt-1">Enrolled Pupil • Grade 11</span>
          </div>
          <div className="font-mono text-[10px] text-slate-500 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-850">
            Student ID: ST-00291-C
          </div>
        </div>

        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6">
          <form onSubmit={saveProfile} className="space-y-4">
            <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-2">Student Preferences</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-450 uppercase mb-1.5">Email address</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850 text-xs px-3 py-2.5 rounded-xl outline-none focus:border-emerald-500 text-slate-200"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-450 uppercase mb-1.5">Contact number</label>
                <input 
                  type="text" 
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850 text-xs px-3 py-2.5 rounded-xl outline-none focus:border-emerald-500 text-slate-200 font-mono"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-450 uppercase mb-1.5">Active mesh Theme</label>
                <select 
                  value={theme} 
                  onChange={e => setTheme(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850 text-xs p-2.5 rounded-xl outline-none focus:border-emerald-500 text-slate-350"
                >
                  <option>Dark Mesh</option>
                  <option>Vibrant Indigo</option>
                  <option>Glassmorphism Light</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 bg-emerald-650 bg-emerald-600 hover:bg-emerald-550 text-white font-bold text-xs rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer shadow-lg shadow-emerald-600/15 flex items-center gap-1.5"
            >
              Update My Profile
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
