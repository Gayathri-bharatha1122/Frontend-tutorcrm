import { 
  LayoutDashboard, 
  GraduationCap, 
  Award, 
  Calendar, 
  Receipt, 
  BookOpen, 
  Settings, 
  LogOut,
  UserPlus,
  Home
} from 'lucide-react';

interface SidebarProps {
  currentTab: 'landing' | 'dashboard' | 'students' | 'billing';
  setCurrentTab: (tab: 'landing' | 'dashboard' | 'students' | 'billing') => void;
  onQuickEnroll: () => void;
}

export default function Sidebar({ currentTab, setCurrentTab, onQuickEnroll }: SidebarProps) {
  // If we are on landing page, we don't render standard CRM sidebar overlay
  if (currentTab === 'landing') return null;

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 flex flex-col z-50">
      {/* Brand Profile Logo */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setCurrentTab('landing')}>
          <GraduationCap className="h-7 w-7 text-blue-900" />
          <h1 className="font-sans font-extrabold text-xl text-gray-900 tracking-tight">
            EduManage <span className="text-blue-700">CRM</span>
          </h1>
        </div>
        <p className="text-xs font-semibold text-gray-500 tracking-wider uppercase mt-1">Admin Portal</p>
      </div>

      {/* Persistent Navigation Options */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {/* Dashboard Tab */}
        <button
          onClick={() => setCurrentTab('dashboard')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-sm transition-all duration-200 ${
            currentTab === 'dashboard'
              ? 'bg-blue-50/70 text-blue-900 border-l-4 border-blue-900 font-semibold'
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
          }`}
        >
          <LayoutDashboard className={`h-5 w-5 ${currentTab === 'dashboard' ? 'text-blue-900' : 'text-gray-400'}`} />
          <span>Dashboard</span>
        </button>

        {/* Students Tab */}
        <button
          onClick={() => setCurrentTab('students')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-sm transition-all duration-200 ${
            currentTab === 'students'
              ? 'bg-blue-50/70 text-blue-900 border-l-4 border-blue-900 font-semibold'
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
          }`}
        >
          <GraduationCap className={`h-5 w-5 ${currentTab === 'students' ? 'text-blue-900' : 'text-gray-400'}`} />
          <span>Students</span>
        </button>

        {/* Tutors Tab (Launches dynamic list in modal/alerts if clicked) */}
        <button
          onClick={() => setCurrentTab('dashboard')} // Fallback or notification trigger
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all"
        >
          <Award className="h-5 w-5 text-gray-400" />
          <span>Tutors</span>
        </button>

        {/* Schedule Tab */}
        <button
          onClick={() => setCurrentTab('dashboard')}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all"
        >
          <Calendar className="h-5 w-5 text-gray-400" />
          <span>Schedule</span>
        </button>

        {/* Billing Tab */}
        <button
          onClick={() => setCurrentTab('billing')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-sm transition-all duration-200 ${
            currentTab === 'billing'
              ? 'bg-blue-50/70 text-blue-900 border-l-4 border-blue-900 font-semibold'
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
          }`}
        >
          <Receipt className={`h-5 w-5 ${currentTab === 'billing' ? 'text-blue-900' : 'text-gray-400'}`} />
          <span>Billing</span>
        </button>

        {/* Courses Tab */}
        <button
          onClick={() => setCurrentTab('students')}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all"
        >
          <BookOpen className="h-5 w-5 text-gray-400" />
          <span>Courses</span>
        </button>
      </nav>

      {/* Actions and Configurations Block */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={onQuickEnroll}
          className="w-full bg-blue-900 text-white py-2.5 rounded-lg font-semibold text-sm shadow-md hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          <UserPlus className="h-4 w-4" />
          <span>Quick Enroll</span>
        </button>
      </div>

      {/* Under Footer Quick Links */}
      <div className="px-3 pb-6 space-y-1">
        <button
          onClick={() => setCurrentTab('landing')}
          className="w-full flex items-center gap-3 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors"
        >
          <Home className="h-4 w-4 text-gray-400" />
          <span>Public Site</span>
        </button>
        <button
          onClick={() => setCurrentTab('landing')}
          className="w-full flex items-center gap-3 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-950 rounded-lg transition-colors"
        >
          <LogOut className="h-4 w-4 text-gray-400" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
