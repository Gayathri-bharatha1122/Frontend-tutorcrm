import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  BookOpen, 
  AlertTriangle, 
  CheckSquare, 
  ChevronRight, 
  Search, 
  Filter, 
  Trash2, 
  Edit3, 
  Eye, 
  ArrowUpDown, 
  X,
  Mail,
  UserPlus,
  ArrowRight,
  TrendingUp,
  Download,
  CheckCircle2,
  AlertOctagon,
  ChevronLeft
} from 'lucide-react';
import { Student } from '../types';

interface StudentManagementProps {
  students: Student[];
  onAddStudent: () => void;
  onEditStudent: (student: Student) => void;
  onDeleteStudent: (id: string) => void;
  onSelectStudent: (student: Student) => void;
  onUpdatePaymentStatus: (id: string, status: 'Paid' | 'Pending' | 'Overdue') => void;
}

export default function StudentManagement({ 
  students, 
  onAddStudent, 
  onEditStudent, 
  onDeleteStudent, 
  onSelectStudent,
  onUpdatePaymentStatus
}: StudentManagementProps) {

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('All Courses');
  const [selectedPayment, setSelectedPayment] = useState('Any Status');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  // Clear filters
  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCourse('All Courses');
    setSelectedPayment('Any Status');
    setCurrentPage(1);
  };

  // Memoized search & filter logic
  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const matchQuery = 
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.id.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchCourse = 
        selectedCourse === 'All Courses' || 
        student.course.toLowerCase().includes(selectedCourse.toLowerCase()) ||
        (selectedCourse === 'Advanced Calculus' && student.course === 'Mathematics Advanced') ||
        (selectedCourse === 'English Lit' && student.course === 'English Literature');

      const matchPayment = 
        selectedPayment === 'Any Status' || 
        student.paymentStatus.toLowerCase() === selectedPayment.toLowerCase();

      return matchQuery && matchCourse && matchPayment;
    });
  }, [students, searchQuery, selectedCourse, selectedPayment]);

  // Paginated students list
  const totalItems = filteredStudents.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedStudents = filteredStudents.slice(startIndex, startIndex + itemsPerPage);

  // Bento numbers count matching requested mock cards exactly OR reflecting live pool
  const bentoTotalCount = 1284 + (students.length - 8); // Scale seed base beautifully
  const bentoActiveEnrollments = 942;
  const bentoOverdueCount = students.filter(s => s.paymentStatus === 'Overdue').length + 46;

  // Trigger alert updates
  const handleFixNowAlert = (studentId: string) => {
    const matched = students.find(s => s.id === studentId);
    if (matched) {
      onSelectStudent(matched);
    } else {
      alert(`Activating payment mitigation gateway for candidate ${studentId}.`);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Page Breadcrumb and Header Banner details matches Image 3 */}
      <div className="flex flex-col xl:flex-row justify-between xl:items-end gap-4">
        <div>
          <nav className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 mb-2">
            <span className="cursor-pointer hover:text-blue-900">Dashboard</span>
            <ChevronRight className="h-3.5 w-3.5 text-gray-300" />
            <span className="text-blue-900 font-extrabold">Student Directory</span>
          </nav>
          <h2 className="font-sans font-black text-3xl text-gray-900 tracking-tight">Student Management</h2>
          <p className="text-gray-500 text-sm font-medium mt-1">Manage enrollments, track attendance, and monitor payment status.</p>
        </div>
        
        <button 
          onClick={onAddStudent}
          className="bg-blue-900 text-white px-5 py-3 rounded-lg font-bold text-sm shadow-md hover:brightness-110 hover:-translate-y-0.5 transition-all w-fit"
        >
          + Add New Student
        </button>
      </div>

      {/* Bento Insights Overview Block */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Bento 1: Total Students */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div className="p-2.5 bg-blue-50 text-blue-900 rounded-lg">
              <Users className="h-5 w-5" />
            </div>
            <span className="text-green-600 font-bold text-[10px] flex items-center gap-0.5">
              +12% <TrendingUp className="h-3 w-3" />
            </span>
          </div>
          <div className="mt-4">
            <p className="text-gray-400 font-bold text-[10px] uppercase tracking-wider font-sans">Total Students</p>
            <h3 className="text-2xl font-black text-gray-950 mt-1">{bentoTotalCount.toLocaleString()}</h3>
          </div>
        </div>

        {/* Bento 2: Active Enrollments */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div className="p-2.5 bg-orange-55 bg-indigo-50 text-indigo-950 rounded-lg">
              <BookOpen className="h-5 w-5 text-indigo-900" />
            </div>
            <span className="text-gray-400 font-bold text-[10px] bg-slate-50 border border-slate-150 px-2 py-0.5 rounded">
              8 Courses
            </span>
          </div>
          <div className="mt-4">
            <p className="text-gray-400 font-bold text-[10px] uppercase tracking-wider">Active Enrollments</p>
            <h3 className="text-2xl font-black text-gray-950 mt-1">{bentoActiveEnrollments}</h3>
          </div>
        </div>

        {/* Bento 3: Overdue Payments */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div className="p-2.5 bg-red-50 text-red-900 rounded-lg">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <span className="text-red-600 font-bold text-[10px] flex items-center gap-0.5">
              4.2% <TrendingUp className="h-3 w-3 rotate-45" />
            </span>
          </div>
          <div className="mt-4">
            <p className="text-gray-400 font-bold text-[10px] uppercase tracking-wider">Overdue Payments</p>
            <h3 className="text-2xl font-black text-red-700 mt-1">{bentoOverdueCount}</h3>
          </div>
        </div>

        {/* Bento 4: Attendance average */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div className="p-2.5 bg-emerald-50 text-emerald-900 rounded-lg">
              <CheckSquare className="h-5 w-5" />
            </div>
            <span className="text-emerald-700 font-bold text-[10px] tracking-wider uppercase bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded">
              Target: 90%
            </span>
          </div>
          <div className="mt-4">
            <p className="text-gray-400 font-bold text-[10px] uppercase tracking-wider font-sans">Avg. Attendance</p>
            <h3 className="text-2xl font-black text-gray-950 mt-1">87.5%</h3>
          </div>
        </div>

      </div>

      {/* Filters and Inputs section matches custom styles with layout inputs */}
      <div className="bg-slate-100/80 border border-gray-200 p-4 rounded-xl flex flex-wrap items-end gap-4">
        
        {/* Live Search input directory */}
        <div className="flex-1 min-w-[240px]">
          <label className="block text-gray-500 font-bold text-[10px] uppercase tracking-wider mb-1.5 ml-1">Search Directory</label>
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 h-4.5 w-4.5" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              placeholder="Student name or ID..."
              className="w-full bg-white border border-gray-250 rounded-lg py-2.5 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-900/15 focus:border-blue-900 text-sm placeholder-gray-450"
            />
          </div>
        </div>

        {/* Course dropdown selection list */}
        <div className="w-56">
          <label className="block text-gray-500 font-bold text-[10px] uppercase tracking-wider mb-1.5 ml-1">Course</label>
          <select 
            value={selectedCourse}
            onChange={(e) => { setSelectedCourse(e.target.value); setCurrentPage(1); }}
            className="w-full bg-white border border-gray-250 rounded-lg py-2.5 px-3.5 focus:outline-none focus:ring-2 focus:ring-blue-900/15 focus:border-blue-900 text-sm font-medium text-gray-700 select-caret cursor-pointer"
          >
            <option>All Courses</option>
            <option>Advanced Calculus</option>
            <option>World History</option>
            <option>English Lit</option>
            <option>Data Science 101</option>
            <option>Physics 101</option>
            <option>History of Art</option>
          </select>
        </div>

        {/* Payment Status filter */}
        <div className="w-56">
          <label className="block text-gray-500 font-bold text-[10px] uppercase tracking-wider mb-1.5 ml-1">Payment Status</label>
          <select 
            value={selectedPayment}
            onChange={(e) => { setSelectedPayment(e.target.value); setCurrentPage(1); }}
            className="w-full bg-white border border-gray-250 rounded-lg py-2.5 px-3.5 focus:outline-none focus:ring-2 focus:ring-blue-900/15 focus:border-blue-900 text-sm font-medium text-gray-700 select-caret cursor-pointer"
          >
            <option>Any Status</option>
            <option>Paid</option>
            <option>Pending</option>
            <option>Overdue</option>
          </select>
        </div>

        {/* Direct Action triggers: Quick filter configuration */}
        <button className="bg-white border border-gray-250 p-2.5 rounded-lg text-gray-500 hover:bg-gray-50 transition-colors" title="More Analytics Filters">
          <Filter className="h-5 w-5" />
        </button>

        {/* Clear All reset link trigger */}
        <button 
          onClick={handleClearFilters}
          className="text-blue-900 font-extrabold text-sm px-4 py-2.5 hover:underline decoration-2 underline-offset-4 transition-all whitespace-nowrap"
        >
          Clear All
        </button>

      </div>

      {/* Primary Students Data Table matches screen 3 precisely */}
      <div className="bg-white border border-gray-200 shadow-sm rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-400 font-semibold text-[10px] uppercase tracking-wider font-sans border-b border-gray-200">
                <th className="px-6 py-4 cursor-pointer hover:text-blue-900 transition-colors">
                  <div className="flex items-center gap-1.5">
                    <span>Student Name</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th className="px-6 py-4">Course</th>
                <th className="px-6 py-4">Enrollment Date</th>
                <th className="px-6 py-4">Payment Status</th>
                <th className="px-6 py-4">Attendance %</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-150 text-sm">
              <AnimatePresence mode="popLayout">
                {paginatedStudents.length > 0 ? (
                  paginatedStudents.map((student) => {
                    return (
                      <motion.tr 
                        key={student.id} 
                        initial={{ opacity: 0, y: 3 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -3 }}
                        className="hover:bg-gray-50/70 transition-colors group"
                      >
                        {/* Student avatar and Name block */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full border border-gray-200 overflow-hidden flex-shrink-0 bg-blue-50 flex items-center justify-center">
                              {student.avatar ? (
                                <img 
                                  className="w-full h-full object-cover" 
                                  src={student.avatar} 
                                  alt="Portrait profile" 
                                />
                              ) : (
                                <span className="text-xs font-black text-blue-900 uppercase">
                                  {student.name.split(' ').map((n) => n[0]).join('')}
                                </span>
                              )}
                            </div>
                            <div>
                              <p className="font-bold text-gray-900 group-hover:text-blue-900 transition-colors">{student.name}</p>
                              <p className="text-xs text-gray-400 font-semibold uppercase font-sans tracking-wide">ID: {student.id}</p>
                            </div>
                          </div>
                        </td>

                        {/* Course Name */}
                        <td className="px-6 py-4 font-bold text-gray-700">
                          {student.course}
                        </td>

                        {/* Enrollment date */}
                        <td className="px-6 py-4 font-semibold text-gray-500 text-xs">
                          {new Date(student.enrollmentDate).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </td>

                        {/* Payment Status indicator matching Image 3 status points */}
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                            student.paymentStatus === 'Paid' 
                              ? 'bg-green-150 text-green-800' 
                              : student.paymentStatus === 'Pending' 
                              ? 'bg-amber-100 text-amber-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            <span className={`w-2 h-2 rounded-full ${
                              student.paymentStatus === 'Paid' ? 'bg-green-600' :
                              student.paymentStatus === 'Pending' ? 'bg-amber-600' : 'bg-red-600'
                            }`}></span>
                            <span>{student.paymentStatus}</span>
                          </span>
                        </td>

                        {/* Attendance visual circular meter */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden max-w-[80px] border border-gray-50">
                              <div 
                                className={`h-full rounded-full ${
                                  student.attendance >= 90 ? 'bg-blue-900' :
                                  student.attendance >= 80 ? 'bg-indigo-700' : 'bg-rose-600'
                                }`} 
                                style={{ width: `${student.attendance}%` }}
                              ></div>
                            </div>
                            <span className="font-extrabold text-xs text-gray-700">{student.attendance}%</span>
                          </div>
                        </td>

                        {/* Actions block row */}
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button 
                              onClick={() => onSelectStudent(student)}
                              className="p-1.5 hover:bg-gray-100 rounded-lg text-blue-900 transition-colors" 
                              title="View Details Profile"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={() => onEditStudent(student)}
                              className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-gray-900 transition-colors" 
                              title="Update Entry"
                            >
                              <Edit3 className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={() => onDeleteStudent(student.id)}
                              className="p-1.5 hover:bg-red-50 rounded-lg text-red-600 transition-colors" 
                              title="Remove Entry"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-400 font-sans text-sm">
                      <AlertOctagon className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                      <span>No matching students found. Modify search parameters or add a new candidate.</span>
                    </td>
                  </tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Pagination bar matches screen pagination perfectly */}
        <div className="bg-gray-50 p-6 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs font-semibold text-gray-400">
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, totalItems)} of {totalItems} students
          </p>
          <div className="flex items-center gap-1.5">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="w-8 h-8 flex items-center justify-center rounded border border-gray-250 bg-white hover:bg-gray-50 disabled:opacity-40 text-gray-500 transition-all font-bold"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button 
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-8 h-8 flex items-center justify-center rounded text-xs font-extrabold transition-all ${
                  currentPage === i + 1 
                    ? 'bg-blue-900 text-white shadow' 
                    : 'bg-white border border-gray-250 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="w-8 h-8 flex items-center justify-center rounded border border-gray-250 bg-white hover:bg-gray-50 disabled:opacity-40 text-gray-500 transition-all font-bold"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

      </div>

      {/* Mini details helper grid at bottom of Directory matches Image 3 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Recent Enrollments card */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h4 className="font-sans font-bold text-lg text-gray-900">Recent Enrollments</h4>
              <p className="text-xs text-gray-400 font-medium">New registrations over standard timeline</p>
            </div>
            <button className="text-blue-900 font-extrabold text-xs hover:underline">View All</button>
          </div>

          <div className="space-y-3.5">
            <div className="flex items-center gap-4 p-3 bg-gray-50 border border-gray-200/40 rounded-xl relative overflow-hidden group hover:shadow transition-all">
              <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-900 flex-shrink-0 font-bold">LW</div>
              <div className="flex-1">
                <p className="text-sm font-bold text-gray-950">Liam Wilson</p>
                <p className="text-xs text-gray-400 font-medium leading-relaxed">Enrolled in: Physical Science</p>
              </div>
              <span className="text-[10px] text-gray-400 font-bold self-start mt-0.5 whitespace-nowrap">2 mins ago</span>
            </div>
            
            <div className="flex items-center gap-4 p-3 bg-gray-50 border border-gray-200/40 rounded-xl relative overflow-hidden group hover:shadow transition-all">
              <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-900 flex-shrink-0 font-bold">SG</div>
              <div className="flex-1">
                <p className="text-sm font-bold text-gray-950">Sophia Garcia</p>
                <p className="text-xs text-gray-400 font-medium leading-relaxed">Enrolled in: Advanced Calculus</p>
              </div>
              <span className="text-[10px] text-gray-400 font-bold self-start mt-0.5 whitespace-nowrap font-sans">1 hour ago</span>
            </div>
          </div>
        </div>

        {/* System Alerts card */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h4 className="font-sans font-bold text-lg text-gray-900">System Alerts</h4>
              <p className="text-xs text-gray-400 font-medium">Mitigation requests for billing failures</p>
            </div>
            <span className="bg-red-100 text-red-700 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider">
              2 Critical
            </span>
          </div>

          <div className="space-y-3.5">
            {/* Payment Failure alert row */}
            <div className="flex items-start gap-4 p-3.5 bg-red-50 border border-red-100 rounded-xl">
              <div className="w-10 h-10 rounded-lg bg-red-100 text-red-700 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-bold text-red-950">Payment Failure</p>
                <p className="text-xs text-red-700 leading-normal font-medium mt-0.5">UPI transaction declined for student: Elena Rodriguez (ID: ST-90234)</p>
              </div>
              <button 
                onClick={() => handleFixNowAlert('ST-90234')}
                className="text-red-700 hover:text-red-900 font-black text-xs hover:underline flex-shrink-0 self-center"
              >
                Fix Now
              </button>
            </div>

            {/* Attendance Report ready */}
            <div className="flex items-center gap-4 p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 text-blue-900 flex items-center justify-center flex-shrink-0">
                <Mail className="h-5 w-5" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-bold text-gray-900">Report Ready</p>
                <p className="text-xs text-gray-400 font-medium mt-0.5">Monthly academic attendance log compiles are downloadable.</p>
              </div>
              <button 
                onClick={() => alert("Attendance summary spreadsheet generation complete... Downloading file.")}
                className="text-gray-500 hover:text-blue-900 p-1 rounded hover:bg-white transition-colors flex-shrink-0"
              >
                <Download className="h-4.5 w-4.5" />
              </button>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
