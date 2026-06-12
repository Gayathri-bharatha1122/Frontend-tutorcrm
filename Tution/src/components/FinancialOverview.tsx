import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  IndianRupee, 
  AlertTriangle, 
  CheckCircle, 
  Download, 
  Receipt, 
  Filter, 
  Calendar, 
  Mail, 
  ChevronLeft, 
  ChevronRight, 
  Settings, 
  RefreshCcw, 
  Clock, 
  ShieldAlert,
  ArrowRight,
  Database,
  Sliders,
  MoreVertical,
  TrendingUp
} from 'lucide-react';
import { Student } from '../types';

interface FinancialOverviewProps {
  students: Student[];
  onOpenQuickInvoice: () => void;
  onUpdatePaymentStatus: (id: string, status: 'Paid' | 'Pending' | 'Overdue') => void;
}

export default function FinancialOverview({ 
  students, 
  onOpenQuickInvoice,
  onUpdatePaymentStatus 
}: FinancialOverviewProps) {

  const [activeFilterOption, setActiveFilterOption] = useState('Overdue Payments');
  const [activeDateOption, setActiveDateOption] = useState('Current Month');
  const [currentPage, setCurrentPage] = useState(1);
  const [stripeSyncing, setStripeSyncing] = useState(false);
  const [stripeSyncLogs, setStripeSyncLogs] = useState('');
  
  const itemsPerPage = 4;

  // Let's filter the transaction list dynamically depending on selector value
  const filteredTransactions = useMemo(() => {
    return students.filter((student) => {
      if (activeFilterOption === 'Overdue Payments') {
        return student.paymentStatus === 'Overdue';
      }
      if (activeFilterOption === 'Paid Invoices') {
        return student.paymentStatus === 'Paid';
      }
      if (activeFilterOption === 'Pending Approval') {
        return student.paymentStatus === 'Pending';
      }
      return true; // All Transactions
    });
  }, [students, activeFilterOption]);

  const totalItems = filteredTransactions.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Dynamic values based on current students database
  const totalOutstanding = students.reduce((tot, s) => s.paymentStatus === 'Overdue' ? tot + s.outstandingDue : tot, 0);
  const totalPaidRevenue = students.reduce((tot, s) => tot + s.feesPaid, 0);
  const overdueStudentsCount = students.filter(s => s.paymentStatus === 'Overdue').length;

  const triggerStripeSync = () => {
    if (stripeSyncing) return;
    setStripeSyncing(true);
    setStripeSyncLogs('Initializing BHIM UPI Secure Gateway Handshake...');
    
    setTimeout(() => {
      setStripeSyncLogs('Validating merchant keys and token streams...');
    }, 1200);

    setTimeout(() => {
      setStripeSyncLogs('Fetching transaction records and invoice registers...');
    }, 2400);

    setTimeout(() => {
      setStripeSyncLogs('Reconciling localized accounts with cloud database...');
    }, 3600);

    setTimeout(() => {
      setStripeSyncing(false);
      setStripeSyncLogs('Cloud Synchronization Complete! All ledgers are fully aligned.');
      setTimeout(() => setStripeSyncLogs(''), 3000);
    }, 4800);
  };

  // Send Invoice Reminders
  const handleSendReminders = () => {
    alert(`Generating standard administrative late tuition notifications. Dispatching digital warnings to parent emails for ${overdueStudentsCount} accounts.`);
  };

  return (
    <div className="space-y-6">
      
      {/* Header section matches mockup 4 precisely */}
      <div className="flex flex-col xl:flex-row justify-between xl:items-end gap-4">
        <div>
          <h2 className="font-sans font-extrabold text-3xl text-gray-900 tracking-tight">Financial Overview</h2>
          <p className="text-gray-500 text-sm font-medium mt-1 font-sans">Manage tuition fees, track receivables, and issue receipts.</p>
        </div>
        
        <div className="flex gap-3">
          <button 
            onClick={() => alert("Downloading formatted billing statement spreadsheet as CSV...")}
            className="border border-gray-250 text-blue-900 hover:bg-gray-50 font-bold text-xs px-4 py-2.5 rounded-lg flex items-center gap-2 bg-white shadow-sm transition-all"
          >
            <Download className="h-4 w-4" />
            <span>Export Report</span>
          </button>
          <button 
            onClick={onOpenQuickInvoice}
            className="bg-blue-900 text-white font-bold text-xs px-4 py-2.5 rounded-lg flex items-center gap-2 shadow hover:brightness-110 active:scale-[0.98] transition-all"
          >
            <Receipt className="h-4 w-4" />
            <span>Generate Receipt</span>
          </button>
        </div>
      </div>

      {/* Bento Grid layout of summary statistics widgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Total revenue Card */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-400 font-bold text-[10px] uppercase tracking-wider font-sans">Total Revenue</p>
              <h3 className="text-3xl font-black text-blue-900 mt-1">₹{(142580 + totalPaidRevenue).toLocaleString()}</h3>
            </div>
            <div className="p-2.5 bg-blue-50 text-blue-900 border border-blue-105 rounded-lg">
              <IndianRupee className="h-5.5 w-5.5" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-green-700 bg-green-50 px-2 py-1 rounded w-fit border border-green-150">
            <TrendingUp className="h-4 w-4" />
            <span>+12.5% from last month</span>
          </div>
        </div>

        {/* Outstanding Dues Card */}
        <div className="bg-white p-6 rounded-xl border border-gray-250 shadow-xs flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-400 font-bold text-[10px] uppercase tracking-wider font-sans">Outstanding Dues</p>
              <h3 className="text-3xl font-black text-red-700 mt-1">₹{(12450 + totalOutstanding).toLocaleString()}</h3>
            </div>
            <div className="p-2.5 bg-red-50 text-red-900 border border-red-150 rounded-lg">
              <AlertTriangle className="h-5.5 w-5.5" />
            </div>
          </div>
          <p className="mt-4 text-xs text-gray-500 font-semibold">{42 + overdueStudentsCount} students with overdue balances</p>
        </div>

        {/* Payments this month Card */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-400 font-bold text-[10px] uppercase tracking-wider font-sans font-sans">Payments this Month</p>
              <h3 className="text-3xl font-black text-blue-950 mt-1">284</h3>
            </div>
            <div className="p-2.5 bg-indigo-50 text-indigo-900 border border-indigo-150 rounded-lg">
              <CheckCircle className="h-5.5 w-5.5" />
            </div>
          </div>
          <div>
            <div className="mt-4 w-full bg-gray-100 rounded-full h-2 border border-gray-50/50">
              <div className="bg-blue-900 h-2 rounded-full" style={{ width: '78%' }}></div>
            </div>
            <p className="mt-2 text-[10px] text-gray-450 font-bold font-sans">78% of expected volume collected</p>
          </div>
        </div>

      </div>

      {/* Primary transactions table block */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        
        {/* Table layout action filters matching mockup precisely */}
        <div className="p-4 border-b border-gray-200 flex flex-wrap gap-4 justify-between items-center bg-gray-50/50">
          <div className="flex items-center gap-4">
            
            {/* Filter transactions selection */}
            <div className="flex items-center border border-gray-250 bg-white rounded-lg px-2.5 py-1.5 shadow-sm text-xs text-gray-600 font-semibold cursor-pointer">
              <Filter className="h-4 w-4 text-gray-400 mr-1.5" />
              <select 
                value={activeFilterOption}
                onChange={(e) => { setActiveFilterOption(e.target.value); setCurrentPage(1); }}
                className="bg-transparent border-none p-0 outline-none select-caret cursor-pointer pr-1"
              >
                <option>All Transactions</option>
                <option>Overdue Payments</option>
                <option>Paid Invoices</option>
                <option>Pending Approval</option>
              </select>
            </div>

            {/* Date timeline filter selector */}
            <div className="flex items-center border border-gray-250 bg-white rounded-lg px-2.5 py-1.5 shadow-xs text-xs text-gray-600 font-semibold cursor-pointer">
              <Calendar className="h-4 w-4 text-gray-400 mr-1.5" />
              <select
                value={activeDateOption}
                onChange={(e) => setActiveDateOption(e.target.value)}
                className="bg-transparent border-none p-0 outline-none select-caret cursor-pointer pr-1"
              >
                <option>Current Month</option>
                <option>Last 30 Days</option>
                <option>Custom Range</option>
              </select>
            </div>

          </div>

          {/* Table quick button actions */}
          <div className="flex gap-2">
            <button 
              onClick={handleSendReminders}
              className="bg-white border border-gray-250 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg font-bold text-xs shadow-sm transition-colors"
            >
              Send Reminders
            </button>
            <button 
              onClick={() => alert("Preparing transaction spreadsheet log exports...")}
              className="bg-white border border-gray-250 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg font-bold text-xs shadow-xs transition-colors"
            >
              Bulk Export
            </button>
          </div>
        </div>

        {/* Responsive Invoices List data table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-400 font-semibold text-[10px] uppercase tracking-wider font-sans border-b border-gray-250">
                <th className="px-6 py-4">Student Name</th>
                <th className="px-6 py-4">Invoice #</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-150 text-sm">
              <AnimatePresence mode="popLayout">
                {paginatedTransactions.length > 0 ? (
                  paginatedTransactions.map((trx) => {
                    return (
                      <motion.tr 
                        key={trx.id}
                        initial={{ opacity: 0, y: 3 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -3 }}
                        className="hover:bg-gray-50/70 transition-colors group"
                      >
                        
                        {/* Student Name */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center font-extrabold text-blue-900 border border-blue-105">
                              {trx.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                              <p className="font-bold text-gray-900">{trx.name}</p>
                              <p className="text-xs text-gray-400 font-medium leading-normal">{trx.course}</p>
                            </div>
                          </div>
                        </td>

                        {/* Invoice reference sequence */}
                        <td className="px-6 py-4 text-xs font-semibold text-gray-500 font-mono leading-relaxed">
                          #INV-{trx.id.replace('ST-', '2023-')}
                        </td>

                        {/* Transaction outstanding cost */}
                        <td className="px-6 py-4 font-black text-gray-900">
                          ₹{(trx.outstandingDue || 210).toFixed(2)}
                        </td>

                        {/* Late Invoice status badges */}
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-bold ${
                            trx.paymentStatus === 'Paid' ? 'bg-green-150 text-green-700' :
                            trx.paymentStatus === 'Pending' ? 'bg-amber-100 text-amber-700' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {trx.paymentStatus}
                          </span>
                        </td>

                        {/* Invoice stamp date */}
                        <td className="px-6 py-4 text-xs font-semibold text-gray-500">
                          {new Date(trx.enrollmentDate).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </td>

                        {/* Right inline contextual action tools */}
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2.5 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={() => alert(`Dispatching late invoice notification template to parent email of candidate ${trx.name}.`)}
                              className="p-1.5 hover:bg-blue-50 hover:text-blue-900 text-gray-400 rounded-full transition-colors flex inline-flex shadow-sm bg-white" 
                              title="Send Reminder Email"
                            >
                              <Mail className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={() => onUpdatePaymentStatus(trx.id, 'Paid')}
                              className="p-1.5 hover:bg-green-50 hover:text-green-700 text-gray-400 rounded-full transition-colors flex inline-flex shadow-xs bg-white" 
                              title="Mark Invoice as Paid"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </button>
                            <button className="p-1.5 hover:bg-gray-100 text-gray-400 rounded-full transition-colors flex inline-flex bg-white shadow-xs">
                              <MoreVertical className="h-4 w-4" />
                            </button>
                          </div>
                        </td>

                      </motion.tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-400 text-sm">
                      <CheckCircle className="h-8 w-8 text-green-100 mx-auto mb-2" />
                      <span>No outstanding payments or receipts match this selected filter state. All ledgers validated clear!</span>
                    </td>
                  </tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Transaction entries pagination */}
        <div className="p-4 flex justify-between items-center border-t border-gray-200 bg-gray-50 text-xs text-gray-400 font-semibold">
          <p>Showing {Math.min(startIndex() + 1, totalItems)} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} entries</p>
          <div className="flex gap-2">
            <button 
              onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 border border-gray-250 bg-white rounded-lg hover:bg-gray-50 disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4 text-gray-500" />
            </button>
            <span className="px-3 py-1.5 bg-blue-900 text-white rounded-lg font-bold leading-normal self-center shadow-xs">{currentPage}</span>
            <button 
              onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2 border border-gray-250 bg-white rounded-lg hover:bg-gray-50 disabled:opacity-40"
            >
              <ChevronRight className="h-4 w-4 text-gray-500" />
            </button>
          </div>
        </div>

      </div>

      {/* Payment methods and syncing tools matches screen 4 precisely */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Payment Method distribution custom SVG diagram */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xs flex flex-col justify-between">
          <h4 className="font-sans font-bold text-lg text-gray-900 mb-6">Payment Method Distribution</h4>
          
          <div className="flex items-center gap-8 h-48">
            <div className="w-1/2 flex justify-center">
              
              {/* Pie diagram circular paths representation in SVG */}
              <svg className="w-36 h-36 transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="38" fill="transparent" stroke="#F1F5F9" strokeWidth="18" />
                {/* UPI Payments: 64% */}
                <circle 
                  cx="50" 
                  cy="50" 
                  r="38" 
                  fill="transparent" 
                  stroke="#1E40AF" 
                  strokeWidth="18" 
                  strokeDasharray="238.76" 
                  strokeDashoffset={238.76 - (238.76 * 64) / 100} 
                />
                {/* Bank Transfer: 24% */}
                <circle 
                  cx="50" 
                  cy="50" 
                  r="38" 
                  fill="transparent" 
                  stroke="#3B82F6" 
                  strokeWidth="18" 
                  strokeDasharray="238.76" 
                  strokeDashoffset={238.76 - (238.76 * 24) / 100} 
                  transform="rotate(230 50 50)"
                />
              </svg>

            </div>

            {/* Side percentage values list matches mock UI layout */}
            <div className="w-1/2 space-y-3 font-sans">
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 bg-blue-900 rounded-full flex-shrink-0 animate-pulse"></span>
                <span className="text-xs font-bold text-gray-700">UPI Payments (64%)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 bg-blue-500 rounded-full flex-shrink-0"></span>
                <span className="text-xs font-bold text-gray-700">Bank Transfer (24%)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 bg-slate-200 rounded-full flex-shrink-0"></span>
                <span className="text-xs font-bold text-gray-700">Cash (12%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Simulated Syncing interface - Extremely High Craftsmanship */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
          <div>
            <h4 className="font-sans font-bold text-lg text-gray-900 mb-2">Administrative Tools</h4>
            <p className="text-xs text-gray-400 font-medium">Configure fee matrix values and sync databases</p>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
            
            <button className="flex flex-col items-center gap-2.5 p-4 rounded-xl bg-gray-50 border border-gray-200/50 hover:bg-blue-900 hover:text-white transition-all duration-200 group relative">
              <Sliders className="h-6 w-6 text-blue-900 group-hover:text-white transition-colors" />
              <span className="text-xs font-bold text-gray-800 group-hover:text-white transition-colors">Fee Structure</span>
            </button>

            <button className="flex flex-col items-center gap-2.5 p-4 rounded-xl bg-gray-50 border border-gray-200/50 hover:bg-blue-900 hover:text-white transition-all duration-200 group relative">
              <Database className="h-6 w-6 text-blue-900 group-hover:text-white transition-colors" />
              <span className="text-xs font-bold text-gray-800 group-hover:text-white transition-colors">Reconciliation</span>
            </button>

            <button className="flex flex-col items-center gap-2.5 p-4 rounded-xl bg-gray-50 border border-gray-200/50 hover:bg-blue-900 hover:text-white transition-all duration-200 group relative">
              <ShieldAlert className="h-6 w-6 text-blue-900 group-hover:text-white transition-colors" />
              <span className="text-xs font-bold text-gray-800 group-hover:text-white transition-colors">Late Fee Rules</span>
            </button>

            <button 
              onClick={triggerStripeSync}
              className={`flex flex-col items-center justify-center gap-2.5 p-4 rounded-xl border transition-all duration-200 ${
                stripeSyncing 
                  ? 'bg-emerald-55 bg-emerald-500/10 border-emerald-300 text-emerald-800' 
                  : 'bg-gray-50 border-gray-200/50 hover:bg-emerald-900 hover:text-white text-gray-800 hover:border-emerald-900 group'
              }`}
            >
              <RefreshCcw className={`h-6 w-6 text-emerald-600 group-hover:text-white ${stripeSyncing ? 'animate-spin text-emerald-700' : ''}`} />
              <span className="text-xs font-bold group-hover:text-white transition-colors">Gateway Sync</span>
            </button>

          </div>

          {/* Stripe Sync progress reporting log line overlay */}
          <AnimatePresence>
            {stripeSyncLogs && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 p-3 bg-gray-850 bg-slate-900 rounded-lg text-slate-300 font-mono text-[10px] items-center border border-slate-800 flex gap-2"
              >
                <RefreshCcw className={`h-4 w-4 ${stripeSyncing ? 'animate-spin text-blue-400' : 'text-green-400'}`} />
                <span>{stripeSyncLogs}</span>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

      </div>

    </div>
  );

  function startIndex() {
    return (currentPage - 1) * itemsPerPage;
  }
}
