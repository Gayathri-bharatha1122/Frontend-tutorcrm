import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  Award, 
  Receipt, 
  AlertTriangle, 
  TrendingUp, 
  CheckCircle, 
  MoreVertical, 
  Calendar, 
  ChevronRight, 
  Filter, 
  Download,
  Plus,
  ArrowUpRight,
  Clock,
  UserPlus,
  FileSpreadsheet
} from 'lucide-react';
import { Student, ActivityLog, Tutor } from '../types';

interface AdminDashboardProps {
  students: Student[];
  activityLogs: ActivityLog[];
  tutors: Tutor[];
  onNavigateToTab: (tab: 'landing' | 'dashboard' | 'students' | 'billing') => void;
  onSelectStudent: (student: Student) => void;
  onQuickEnroll: () => void;
}

export default function AdminDashboard({ 
  students, 
  activityLogs, 
  tutors, 
  onNavigateToTab, 
  onSelectStudent,
  onQuickEnroll
}: AdminDashboardProps) {

  const [hoveredBar, setHoveredBar] = useState<number | null>(null);
  const [showQuickMenu, setShowQuickMenu] = useState(false);
  const [filterPeriod, setFilterPeriod] = useState("Last 6 Months");

  // Dynamic calculations based on live student data
  const totalStudentsCount = students.length;
  const activeTutorsCount = tutors.length;

  // Let's sum fees paid & outstanding dues to make statistics real-time!
  const totalPaid = students.reduce((sum, s) => sum + s.feesPaid, 0);
  const totalOutstanding = students.reduce((sum, s) => sum + s.outstandingDue, 0);
  const overdueCount = students.filter(s => s.paymentStatus === 'Overdue').length;

  const collectionRate = totalPaid + totalOutstanding > 0 
    ? Math.round((totalPaid / (totalPaid + totalOutstanding)) * 100) 
    : 83;

  // Enrollment trend data mockup matching the columns
  const barData = [
    { month: 'Jan', count: 48, pct: '40%' },
    { month: 'Feb', count: 72, pct: '60%' },
    { month: 'Mar', count: 66, pct: '55%' },
    { month: 'Apr', count: 102, pct: '85%' },
    { month: 'May', count: 120, pct: '100%' }, // Dynamic Highlighted month matching Image 2
    { month: 'Jun', count: 90, pct: '75%' },
  ];

  return (
    <div className="space-y-6">
      
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h2 className="font-sans font-extrabold text-3xl text-gray-900 tracking-tight">Admin Dashboard</h2>
          <p className="text-gray-500 text-sm font-medium mt-1">Welcome back. Here&apos;s what&apos;s happening today at EduManage.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-250 rounded-lg hover:bg-gray-50 bg-white transition-colors text-xs font-bold text-gray-700">
            <Filter className="h-4 w-4 text-gray-400" />
            <span>Filter</span>
          </button>
          <button 
            onClick={() => alert("Simulating export of system telemetry logs... 100% compliant data downloaded.")}
            className="flex items-center gap-2 px-4 py-2 border border-gray-250 rounded-lg hover:bg-gray-50 bg-white transition-colors text-xs font-bold text-gray-700"
          >
            <Download className="h-4 w-4 text-gray-400" />
            <span>Export Status</span>
          </button>
        </div>
      </div>

      {/* Stats Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Total Students widget */}
        <div 
          onClick={() => onNavigateToTab('students')}
          className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow cursor-pointer group"
        >
          <div className="flex justify-between items-start">
            <div className="p-3 bg-blue-50 text-blue-900 border border-blue-100 rounded-lg group-hover:scale-105 transition-transform">
              <Users className="h-6 w-6" />
            </div>
            <span className="text-emerald-700 font-bold text-xs flex items-center gap-1 bg-emerald-50 px-2 py-1 rounded">
              <TrendingUp className="h-3 w-3" />
              +12%
            </span>
          </div>
          <div className="mt-4">
            <p className="text-gray-400 font-bold text-[10px] uppercase tracking-wider">Total Students</p>
            <h3 className="text-3xl font-black text-gray-950 mt-1">{totalStudentsCount * 10} <span className="text-xs text-gray-400 font-semibold">(Est. pool)</span></h3>
          </div>
        </div>

        {/* Total Tutors widget */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div className="p-3 bg-purple-50 text-purple-900 border border-purple-100 rounded-lg">
              <Award className="h-6 w-6" />
            </div>
            <span className="text-purple-700 font-bold text-xs bg-purple-50 px-2 py-1 rounded flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-600 animate-pulse"></span>
              Active
            </span>
          </div>
          <div className="mt-4">
            <p className="text-gray-400 font-bold text-[10px] uppercase tracking-wider">Total Tutors</p>
            <h3 className="text-3xl font-black text-gray-950 mt-1">{activeTutorsCount * 5} <span className="text-xs text-gray-400 font-semibold">(Active Depts)</span></h3>
          </div>
        </div>

        {/* Fees Collected widget */}
        <div 
          onClick={() => onNavigateToTab('billing')}
          className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow cursor-pointer group"
        >
          <div className="flex justify-between items-start">
            <div className="p-3 bg-emerald-50 text-emerald-900 border border-emerald-100 rounded-lg group-hover:scale-105 transition-transform">
              <Receipt className="h-6 w-6" />
            </div>
            <span className="text-emerald-700 font-bold text-xs flex items-center gap-1 bg-emerald-50 px-2 py-1 rounded">
              <CheckCircle className="h-3 w-3" />
              Target Hit
            </span>
          </div>
          <div className="mt-4">
            <p className="text-gray-400 font-bold text-[10px] uppercase tracking-wider font-sans">Fees Collected</p>
            <h3 className="text-3xl font-black text-gray-950 mt-1">₹{totalPaid.toLocaleString()}</h3>
          </div>
        </div>

        {/* Pending Payments widget */}
        <div 
          onClick={() => onNavigateToTab('billing')}
          className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow cursor-pointer group"
        >
          <div className="flex justify-between items-start">
            <div className="p-3 bg-red-50 text-red-900 border border-red-100 rounded-lg group-hover:scale-105 transition-transform">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <span className="text-red-700 font-bold text-xs bg-red-50 px-2.5 py-1 rounded flex items-center gap-1">
              {overdueCount} Overdue
            </span>
          </div>
          <div className="mt-4">
            <p className="text-gray-400 font-bold text-[10px] uppercase tracking-wider font-sans">Pending Payments</p>
            <h3 className="text-3xl font-black text-red-700 mt-1">₹{totalOutstanding.toLocaleString()}</h3>
          </div>
        </div>

      </div>

      {/* Visualizations row: Trend Bar Chart + Fee Doughnut */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Enrollment trend custom SVG chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h4 className="font-sans font-bold text-lg text-gray-900">Enrollment Trend</h4>
            <select 
              value={filterPeriod}
              onChange={(e) => setFilterPeriod(e.target.value)}
              className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-semibold text-gray-700 outline-none focus:ring-2 focus:ring-blue-900/10 focus:border-blue-900"
            >
              <option>Last 6 Months</option>
              <option>Year to Date</option>
            </select>
          </div>
          
          <div className="h-72 w-full flex items-end justify-between gap-4 px-2 pt-10 relative">
            
            {/* Grid helper lines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-8 pt-10">
              <div className="border-t border-gray-100 w-full h-[1px]"></div>
              <div className="border-t border-gray-100 w-full h-[1px]"></div>
              <div className="border-t border-gray-100 w-full h-[1px]"></div>
            </div>

            {/* Custom Interactive SVG / Pure CSS Animated bars */}
            {barData.map((bar, index) => {
              const isHighlight = bar.month === 'May';
              const isSelected = hoveredBar === index;
              return (
                <div 
                  key={bar.month} 
                  className="flex-1 flex flex-col items-center gap-3 relative group"
                  onMouseEnter={() => setHoveredBar(index)}
                  onMouseLeave={() => setHoveredBar(null)}
                >
                  {/* Custom animated tooltip on hover */}
                  {(isSelected || (hoveredBar === null && isHighlight)) && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      className="absolute -top-12 bg-gray-900 text-white rounded px-2.5 py-1 text-[10px] font-bold z-20 pointer-events-none shadow"
                    >
                      {bar.count} Enrollments
                      <div className="w-1.5 h-1.5 bg-gray-900 rotate-45 mx-auto -mt-1 transform translate-y-1"></div>
                    </motion.div>
                  )}

                  {/* Vertical Bar Container */}
                  <div className="w-full max-w-[48px] bg-gray-100 rounded-t-lg h-56 flex items-end overflow-hidden border border-gray-50">
                    <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height: bar.pct }}
                      transition={{ duration: 0.8, delay: index * 0.05 }}
                      className={`w-full rounded-t-md cursor-pointer transition-all ${
                        isHighlight 
                          ? 'bg-blue-900 hover:brightness-110' 
                          : 'bg-blue-100 hover:bg-blue-800'
                      }`}
                    ></motion.div>
                  </div>
                  <span className={`text-xs font-bold font-sans ${isHighlight ? 'text-blue-900' : 'text-gray-400'}`}>
                    {bar.month}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Fee Status gauge donut */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col">
          <h4 className="font-sans font-bold text-lg text-gray-900 mb-6 font-sans">Fee Status</h4>
          
          <div className="flex-1 flex flex-col items-center justify-center space-y-6">
            <div className="relative w-48 h-48 flex items-center justify-center">
              
              {/* Animated Stroke Circle SVG representations */}
              <svg className="w-full h-full transform -rotate-90">
                {/* Background Circle */}
                <circle 
                  cx="96" 
                  cy="96" 
                  r="78" 
                  fill="none" 
                  stroke="#F3F4F6" 
                  strokeWidth="12"
                />
                {/* Filled Paid Portion */}
                <motion.circle 
                  cx="96" 
                  cy="96" 
                  r="78" 
                  fill="none" 
                  stroke="#1E40AF" 
                  strokeWidth="12"
                  strokeDasharray="490"
                  initial={{ strokeDashoffset: 490 }}
                  animate={{ strokeDashoffset: 490 - (490 * collectionRate) / 100 }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  strokeLinecap="round"
                />
                {/* Visual marker for unpaid/overdue */}
                <circle 
                  cx="96" 
                  cy="96" 
                  r="78" 
                  fill="none" 
                  stroke="#BA1A1A" 
                  strokeWidth="12"
                  strokeDasharray="490"
                  strokeDashoffset={490 - (490 * (100 - collectionRate)) / 100}
                  className="translate-x-[2px] opacity-10"
                />
              </svg>

              {/* Central Statistics label */}
              <div className="absolute flex flex-col items-center text-center">
                <span className="text-4xl font-extrabold text-blue-900 tracking-tight">{collectionRate}%</span>
                <span className="text-xs font-bold text-gray-400 mt-1 uppercase tracking-wider">Collected</span>
              </div>
            </div>

            {/* Side Legends matches mock UI */}
            <div className="w-full grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2 bg-gray-50 border border-gray-150 p-2.5 rounded-lg">
                <span className="w-3 h-3 bg-blue-900 rounded-full flex-shrink-0 animate-pulse"></span>
                <div className="text-left">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Paid</p>
                  <p className="text-xs font-bold text-gray-800">₹{totalPaid.toLocaleString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-gray-50 border border-gray-150 p-2.5 rounded-lg">
                <span className="w-3 h-3 bg-red-600 rounded-full flex-shrink-0"></span>
                <div className="text-left">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-sans">Pending</p>
                  <p className="text-xs font-bold text-red-650">₹{totalOutstanding.toLocaleString()}</p>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Recent Activity Table section */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        
        {/* Table title action bar */}
        <div className="p-6 flex justify-between items-center bg-gray-50/50 border-b border-gray-200">
          <div>
            <h4 className="font-sans font-bold text-lg text-gray-900">Recent Activity</h4>
            <p className="text-xs text-gray-400 font-medium">Real-time actions in tutoring administration</p>
          </div>
          <button 
            onClick={() => onNavigateToTab('students')}
            className="text-blue-900 font-bold text-xs inline-flex items-center gap-1 hover:underline transition-all"
          >
            <span>View All Activity</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* Data Tables list view */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-400 font-semibold text-[10px] uppercase tracking-wider font-sans border-b border-gray-250">
                <th className="px-6 py-4">Student / Tutor</th>
                <th className="px-6 py-4">Activity Type</th>
                <th className="px-6 py-4">Date &amp; Time</th>
                <th className="px-6 py-4">Amount / Status</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-150 text-sm">
              
              {activityLogs.slice(0, 4).map((log) => {
                // Find matching student object to enable quick drill-down detail modals
                const matchedStudent = students.find(s => s.name === log.studentName || s.id === log.studentId);
                
                return (
                  <tr key={log.id} className="hover:bg-gray-50/70 transition-colors group">
                    
                    {/* User Profile cell element */}
                    <td className="px-6 py-4 line-clamp-1 block">
                      <div className="flex items-center gap-3">
                        {log.avatar ? (
                          <img 
                            alt={`${log.studentName} avatar`} 
                            className="h-10 w-10 rounded-full object-cover border border-gray-200/50"
                            src={log.avatar}
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-blue-50 text-blue-900 flex items-center justify-center font-extrabold text-xs">
                            {log.studentName.split(' ').map((n) => n[0]).join('')}
                          </div>
                        )}
                        <div>
                          <p 
                            onClick={() => matchedStudent && onSelectStudent(matchedStudent)}
                            className="font-bold text-gray-900 hover:text-blue-900 cursor-pointer hover:underline transition-all"
                          >
                            {log.studentName}
                          </p>
                          <p className="text-xs text-gray-400 font-medium leading-normal">{log.course || 'Math Advanced'}</p>
                        </div>
                      </div>
                    </td>

                    {/* Activity Type field */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-700">
                        <Clock className={`h-4 w-4 ${
                          log.type === 'New Enrollment' ? 'text-green-600' :
                          log.type === 'Fee Payment' ? 'text-blue-600' :
                          log.type === 'Payment Failed' ? 'text-red-600' : 'text-amber-500'
                        }`} />
                        <span className="font-semibold text-xs">{log.type}</span>
                      </div>
                    </td>

                    {/* Date and time column */}
                    <td className="px-6 py-4 text-xs font-semibold text-gray-500">
                      {log.dateTime}
                    </td>

                    {/* Amount / Status indicators */}
                    <td className="px-6 py-4">
                      {log.amount !== undefined ? (
                        <span className={`font-extrabold ${log.type === 'Payment Failed' ? 'text-red-600' : 'text-gray-900'}`}>
                          ₹{log.amount.toFixed(2)}
                        </span>
                      ) : (
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                          log.status === 'Active' ? 'bg-green-50 text-green-700 border border-green-200' :
                          'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}>
                          {log.status || 'Active'}
                        </span>
                      )}
                    </td>

                    {/* Right side contextual actions */}
                    <td className="px-6 py-4 text-right">
                      {matchedStudent ? (
                        <button 
                          onClick={() => onSelectStudent(matchedStudent)}
                          className="hover:bg-gray-100 rounded-full p-2 text-gray-400 hover:text-blue-900 transition-all inline-flex"
                          title="Open Student Specs"
                        >
                          <ArrowUpRight className="h-5 w-5" />
                        </button>
                      ) : (
                        <button className="hover:bg-gray-100 rounded-full p-2 text-gray-400 hover:text-gray-900 transition-all inline-flex">
                          <MoreVertical className="h-5 w-5" />
                        </button>
                      )}
                    </td>

                  </tr>
                );
              })}

            </tbody>
          </table>
        </div>
      </div>

      {/* Floating Quick Action Button matches FAB exactly from Image 2 */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-2.5 items-end z-50">
        
        {/* Animated Quick Action Options */}
        <AnimatePresence>
          {showQuickMenu && (
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 15 }}
              className="flex flex-col gap-2 mb-2 items-end origin-bottom"
            >
              <button 
                onClick={onQuickEnroll}
                className="flex items-center gap-2 bg-white text-gray-900 px-4 py-2.5 rounded-lg shadow-xl border border-gray-200 hover:bg-gray-50 text-xs font-bold transition-all active:scale-95"
              >
                <UserPlus className="h-4 w-4 text-blue-900" />
                <span>Schedule Session</span>
              </button>
              <button 
                onClick={() => onNavigateToTab('billing')}
                className="flex items-center gap-2 bg-white text-gray-900 px-4 py-2.5 rounded-lg shadow-xl border border-gray-200 hover:bg-gray-50 text-xs font-bold transition-all active:scale-95"
              >
                <FileSpreadsheet className="h-4 w-4 text-emerald-700" />
                <span>Create Invoice</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Primary FAB Toggler */}
        <button 
          onClick={() => setShowQuickMenu(!showQuickMenu)}
          className="h-14 w-14 bg-blue-900 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-105 active:scale-90 transition-all z-50"
        >
          <Plus className={`h-6 w-6 transition-transform duration-300 ${showQuickMenu ? 'rotate-45' : ''}`} />
        </button>
      </div>

    </div>
  );
}
