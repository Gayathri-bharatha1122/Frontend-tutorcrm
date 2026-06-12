import { useState } from 'react';
import { Search, Bell, HelpCircle, ChevronDown, Sparkles, UserCheck, AlertTriangle } from 'lucide-react';

interface HeaderProps {
  searchTerm: string;
  setSearchTerm: (s: string) => void;
  placeholder?: string;
  onAddStudent: () => void;
  currentTab: string;
}

export default function Header({ searchTerm, setSearchTerm, placeholder = "Search students, courses...", onAddStudent, currentTab }: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    { id: 1, type: 'critical', text: 'Payment failure for James Thompson (ID: ST-90235)', time: '2 mins ago' },
    { id: 2, type: 'success', text: 'Report Ready: Monthly attendance reports compiled.', time: '1 hour ago' },
    { id: 3, type: 'info', text: 'Weekly tutoring schedules sync complete', time: '1 day ago' },
  ];

  return (
    <header className="flex justify-between items-center h-16 px-6 sticky top-0 bg-white border-b border-gray-200 z-40">
      {/* Search Input Bar (Left side) */}
      <div className="flex items-center gap-4 flex-1">
        <div className="relative w-full max-w-md group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4 transition-colors group-focus-within:text-blue-900" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-full py-2 pl-10 pr-4 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-900/10 focus:border-blue-900 focus:bg-white transition-all"
            placeholder={placeholder}
          />
        </div>
      </div>

      {/* Global Actions Bar (Right side) */}
      <div className="flex items-center gap-4">
        {/* Notifications Button with active indicator */}
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="hover:bg-gray-100 text-gray-500 rounded-full p-2 relative group transition-transform active:scale-90"
          >
            <Bell className="h-5 w-5 text-gray-600" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-600 rounded-full border-2 border-white"></span>
          </button>

          {/* Dynamic Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-xl shadow-xl z-50 py-2">
              <div className="px-4 py-2 border-b border-gray-100 flex justify-between items-center">
                <span className="font-semibold text-xs text-gray-500 uppercase tracking-wider">Notifications</span>
                <span className="bg-red-50 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded-full">3 Alerts</span>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {notifications.map((notif) => (
                  <div key={notif.id} className="p-3 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className="flex gap-2.5 items-start">
                      {notif.type === 'critical' ? (
                        <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                      ) : notif.type === 'success' ? (
                        <UserCheck className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      ) : (
                        <Sparkles className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      )}
                      <div>
                        <p className="text-xs text-gray-700 font-medium leading-relaxed">{notif.text}</p>
                        <p className="text-[10px] text-gray-400 mt-1">{notif.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Help Center */}
        <button className="hover:bg-gray-100 text-gray-500 rounded-full p-2 transition-transform active:scale-90">
          <HelpCircle className="h-5 w-5 text-gray-600" />
        </button>

        <div className="h-6 w-[1px] bg-gray-200 mx-2"></div>

        {/* Unified Add Student Action Button */}
        <button
          onClick={onAddStudent}
          className="flex items-center gap-1.5 bg-blue-900 border-2 border-blue-900 text-on-primary px-4 py-2 rounded-lg font-bold text-xs shadow-sm hover:bg-blue-800 hover:border-blue-800 hover:shadow-md transition-all duration-200 active:scale-95"
        >
          <span>{currentTab === 'billing' ? 'Add Transaction' : 'Add Student'}</span>
        </button>

        {/* Admin profile user */}
        <div className="flex items-center gap-2 pl-2">
          <img
            alt="Corporate Admin avatar override"
            className="h-9 w-9 rounded-full border border-gray-200 object-cover hover:ring-2 hover:ring-blue-900/20 transition-all cursor-pointer"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBLxftUf_NvdJuzoBs_8jCzwcI__TPlQHsVoSZEkQH4LxGu_BENWitxKuB89wG8dhtfLN4Eo6L-64vvQ4_dmBsrdB_FeR2-3NqIYRwsRKx5HwTLFiKoG1W0JIRORWzL9BZfbgwhrgaIHaBxbd0O0RdHd-o0oPC2IeccL6wnv6VpYI4eNPB4ezDsFPOaUWerIwVu7K7Rvb3qRhoSe50Um8AbewkjgZVHnoL2xKV822lsBJzyFWE8wX3Ty8gl08QjRdybucQPNA_JlkUN"
          />
        </div>
      </div>
    </header>
  );
}
