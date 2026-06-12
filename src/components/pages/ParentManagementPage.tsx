import React, { useState, useEffect, useCallback } from 'react';
import { DashboardPage } from '../DashboardPage';
import { motion, AnimatePresence } from 'motion/react';
import {
  User, Users, GraduationCap, IndianRupee, Phone, Mail,
  ChevronRight, AlertCircle, CheckCircle, Plus, Pencil,
  Trash2, X, Loader2, Eye, EyeOff, Shield
} from 'lucide-react';
import { api } from '../../services/api';
import { useLanguage } from '../../LanguageContext';

// ─── Types ────────────────────────────────────────────────────────────────────
interface LinkedStudent {
  studentId: string;
  name: string;
  email: string;
  grade: string;
  status: string;
  progress: number;
  avgGrade: number;
  outstandingDues: number;
}

interface ParentRecord {
  id: string | null;
  name: string;
  email: string | null;
  phone: string;
  createdAt: string | null;
  linkedStudents: LinkedStudent[];
  totalStudents: number;
  totalOutstanding: number;
  unregistered?: boolean;
}

// ─── Status / colors ──────────────────────────────────────────────────────────
const statusColor: Record<string, string> = {
  Active: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  Pending: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  Inactive: 'text-slate-400 bg-slate-700/50 border-slate-700',
};
const parentAccents = [
  'bg-indigo-500/20 text-indigo-400',
  'bg-teal-500/20 text-teal-400',
  'bg-amber-500/20 text-amber-400',
  'bg-violet-500/20 text-violet-400',
  'bg-emerald-500/20 text-emerald-400',
];

// ─── Toast ────────────────────────────────────────────────────────────────────
const Toast: React.FC<{ msg: string; type: 'success' | 'error'; onClose: () => void }> = ({ msg, type, onClose }) => (
  <motion.div
    initial={{ opacity: 0, y: -20, scale: 0.95 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: -10 }}
    className={`fixed top-6 right-6 z-[100] flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl text-sm font-bold border ${
      type === 'success'
        ? 'bg-emerald-950 border-emerald-500/30 text-emerald-300'
        : 'bg-rose-950 border-rose-500/30 text-rose-300'
    }`}
  >
    {type === 'success' ? <CheckCircle className="h-4 w-4 shrink-0" /> : <AlertCircle className="h-4 w-4 shrink-0" />}
    <span>{msg}</span>
    <button onClick={onClose} className="ml-2 opacity-60 hover:opacity-100">
      <X className="h-3.5 w-3.5" />
    </button>
  </motion.div>
);

// ─── Modal: Add / Edit Parent ─────────────────────────────────────────────────
interface ParentFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
}

const ParentModal: React.FC<{
  mode: 'add' | 'edit';
  parent?: ParentRecord;
  onClose: () => void;
  onSuccess: (msg: string) => void;
}> = ({ mode, parent, onClose, onSuccess }) => {
  const { t } = useLanguage();
  const [form, setForm] = useState<ParentFormData>({
    firstName: parent ? parent.name.split(' ')[0] : '',
    lastName: parent ? parent.name.split(' ').slice(1).join(' ') : '',
    email: parent?.email || '',
    phone: parent?.phone || '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = (key: keyof ParentFormData) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (mode === 'add') {
        await api.addParent({
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email || undefined,
          phone: form.phone,
          password: form.password,
        });
        onSuccess(t('Parent account created successfully.'));
      } else if (parent?.id) {
        await api.updateParent(parent.id, {
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email || undefined,
          phone: form.phone,
        });
        onSuccess(t('Parent account updated successfully.'));
      }
      onClose();
    } catch (err: any) {
      setError(err.message || t('Something went wrong. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  const inputCls = 'w-full bg-slate-950 border border-slate-800 text-xs text-slate-200 px-3.5 py-2.5 rounded-xl outline-none focus:border-indigo-500 transition placeholder:text-slate-600';
  const labelCls = 'block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="relative bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl w-full max-w-md p-6 z-10"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
              {mode === 'add' ? <Plus className="h-5 w-5 text-indigo-400" /> : <Pencil className="h-4 w-4 text-indigo-400" />}
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-white">
                {mode === 'add' ? t('Add New Parent') : t('Edit Parent')}
              </h3>
              <p className="text-[10px] text-slate-500">
                {mode === 'add' ? t('Create a guardian portal account') : t('Update guardian details')}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-500 hover:text-white transition">
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>{t('First Name *')}</label>
              <input className={inputCls} value={form.firstName} onChange={set('firstName')} placeholder="Helena" required />
            </div>
            <div>
              <label className={labelCls}>{t('Last Name *')}</label>
              <input className={inputCls} value={form.lastName} onChange={set('lastName')} placeholder="Thorne" required />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className={labelCls}>{t('Email Address')}</label>
            <input type="email" className={inputCls} value={form.email} onChange={set('email')} placeholder="parent@email.com" />
            <p className="text-[9px] text-slate-600 mt-1">{t('Auto-generated if left empty')}</p>
          </div>

          {/* Phone */}
          <div>
            <label className={labelCls}>{t('Phone Number * ')}<span className="text-slate-600 normal-case font-normal">({t('used to link students')})</span></label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
              <input className={`${inputCls} pl-9`} value={form.phone} onChange={set('phone')} placeholder="14155554921" required />
            </div>
          </div>

          {/* Password (add only) */}
          {mode === 'add' && (
            <div>
              <label className={labelCls}>{t('Password *')}</label>
              <div className="relative">
                <Shield className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  className={`${inputCls} pl-9 pr-9`}
                  value={form.password}
                  onChange={set('password')}
                  placeholder={t('Min. 6 characters')}
                  required
                  minLength={6}
                />
                <button type="button" onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                  {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                </button>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 bg-rose-500/5 border border-rose-500/20 rounded-xl px-3.5 py-2.5">
              <AlertCircle className="h-3.5 w-3.5 text-rose-400 shrink-0" />
              <span className="text-xs text-rose-300">{error}</span>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> {t('Processing...')}</> :
              mode === 'add' ? <><Plus className="h-4 w-4" /> {t('Create Parent Account')}</> :
              <><CheckCircle className="h-4 w-4" /> {t('Save Changes')}</>}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
};

// ─── Delete Confirm Modal ─────────────────────────────────────────────────────
const DeleteModal: React.FC<{
  parent: ParentRecord;
  onClose: () => void;
  onSuccess: (msg: string) => void;
}> = ({ parent, onClose, onSuccess }) => {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!parent.id) return;
    setLoading(true);
    try {
      await api.deleteParent(parent.id);
      onSuccess(t('Parent account deleted successfully.'));
      onClose();
    } catch (err: any) {
      setError(err.message || t('Failed to delete parent.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="relative bg-slate-900 border border-rose-500/30 rounded-3xl shadow-2xl w-full max-w-sm p-6 z-10"
      >
        <div className="text-center mb-5">
          <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mx-auto mb-4">
            <Trash2 className="h-6 w-6 text-rose-400" />
          </div>
          <h3 className="text-sm font-extrabold text-white mb-1">{t('Delete Parent Account')}</h3>
          <p className="text-xs text-slate-400">
            {t('Are you sure you want to delete')} <span className="text-white font-bold">{parent.name}</span>?
            {t('This action cannot be undone.')}
          </p>
          {parent.totalStudents > 0 && (
            <p className="text-[10px] text-amber-400 mt-2 bg-amber-500/5 border border-amber-500/10 rounded-lg px-3 py-1.5">
              ⚠️ {t('{count} linked student(s) will lose their guardian link.').replace('{count}', parent.totalStudents.toString())}
            </p>
          )}
        </div>
        {error && (
          <div className="flex items-center gap-2 bg-rose-500/5 border border-rose-500/20 rounded-xl px-3 py-2 mb-4">
            <AlertCircle className="h-3.5 w-3.5 text-rose-400 shrink-0" />
            <span className="text-xs text-rose-300">{error}</span>
          </div>
        )}
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition cursor-pointer">
            {t('Cancel')}
          </button>
          <button onClick={handleDelete} disabled={loading}
            className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-2 cursor-pointer">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
            {loading ? t('Deleting...') : t('Delete')}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ─── Student mini-card ────────────────────────────────────────────────────────
const StudentCard: React.FC<{ student: LinkedStudent }> = ({ student }) => {
  const { t } = useLanguage();
  return (
    <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3 space-y-2">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center text-[10px] font-black shrink-0">
          {student.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
        </div>
        <div className="min-w-0">
          <span className="text-xs font-bold text-white block truncate">{student.name}</span>
          <span className="text-[9px] text-slate-500 truncate block">{t(student.grade)}</span>
        </div>
        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border shrink-0 ml-auto ${statusColor[student.status] || statusColor.Inactive}`}>
          {t(student.status)}
        </span>
      </div>
      <div className="grid grid-cols-3 gap-1.5 text-center">
        <div className="bg-slate-900/60 rounded-lg p-1.5">
          <span className="text-[8px] text-slate-500 uppercase block">{t("GPA")}</span>
          <span className="text-[10px] font-bold text-indigo-400">{student.avgGrade?.toFixed(1)}</span>
        </div>
        <div className="bg-slate-900/60 rounded-lg p-1.5">
          <span className="text-[8px] text-slate-500 uppercase block">{t("Progress")}</span>
          <span className="text-[10px] font-bold text-teal-400">{student.progress}%</span>
        </div>
        <div className="bg-slate-900/60 rounded-lg p-1.5">
          <span className="text-[8px] text-slate-500 uppercase block">{t("Dues")}</span>
          <span className={`text-[10px] font-bold ${student.outstandingDues > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
            ₹{student.outstandingDues}
          </span>
        </div>
      </div>
      <div className="w-full bg-slate-800 rounded-full h-1">
        <div
          className={`h-1 rounded-full ${student.progress >= 80 ? 'bg-emerald-500' : student.progress >= 60 ? 'bg-indigo-500' : 'bg-amber-500'}`}
          style={{ width: `${student.progress}%` }}
        />
      </div>
    </div>
  );
};

// ─── Parent Row ───────────────────────────────────────────────────────────────
const ParentRow: React.FC<{
  parent: ParentRecord;
  index: number;
  onEdit: (p: ParentRecord) => void;
  onDelete: (p: ParentRecord) => void;
}> = ({ parent, index, onEdit, onDelete }) => {
  const { t } = useLanguage();
  const [expanded, setExpanded] = useState(false);
  const accent = parentAccents[index % parentAccents.length];
  const initials = parent.name !== 'Unregistered Parent'
    ? parent.name.split(' ').map(n => n[0]).join('').slice(0, 2)
    : '?';

  return (
    <div className={`bg-slate-900 border rounded-2xl overflow-hidden transition-all duration-200 ${parent.unregistered ? 'border-amber-500/20' : 'border-slate-800 hover:border-slate-700'}`}>
      <div className="flex items-center gap-4 p-4">
        {/* Expand toggle */}
        <button onClick={() => setExpanded(v => !v)} className="flex items-center gap-3 flex-1 text-left min-w-0">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black shrink-0 ${accent}`}>{initials}</div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-bold text-white truncate">{parent.name}</span>
              {parent.unregistered ? (
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">{t("Unregistered")}</span>
              ) : (
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">{t("Registered")}</span>
              )}
            </div>
            <div className="flex items-center gap-3 mt-0.5 flex-wrap">
              {parent.email && (
                <span className="text-[10px] text-slate-500 flex items-center gap-1"><Mail className="h-2.5 w-2.5" />{parent.email}</span>
              )}
              <span className="text-[10px] text-slate-500 flex items-center gap-1"><Phone className="h-2.5 w-2.5" />{parent.phone}</span>
            </div>
          </div>
        </button>

        {/* Stats */}
        <div className="text-right shrink-0 hidden sm:block">
          <span className="text-[10px] font-bold text-indigo-400 flex items-center gap-1 justify-end">
            <GraduationCap className="h-3 w-3" /> {t('{count} student(s)').replace('{count}', parent.totalStudents.toString())}
          </span>
          {parent.totalOutstanding > 0 && (
            <span className="text-[10px] font-bold text-rose-400 flex items-center gap-1 justify-end">
              <IndianRupee className="h-3 w-3" /> {t('{count} due').replace('{count}', parent.totalOutstanding.toString())}
            </span>
          )}
        </div>

        {/* Action buttons — only for registered parents */}
        <div className="flex items-center gap-1.5 shrink-0">
          {!parent.unregistered && (
            <>
              <button
                onClick={() => onEdit(parent)}
                title={t("Edit")}
                className="p-2 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/20 hover:border-indigo-500/40 transition cursor-pointer"
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => onDelete(parent)}
                title={t("Delete")}
                className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 hover:border-rose-500/40 transition cursor-pointer"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </>
          )}
          <button onClick={() => setExpanded(v => !v)} className="p-2 text-slate-500">
            <motion.div animate={{ rotate: expanded ? 90 : 0 }} transition={{ duration: 0.2 }}>
              <ChevronRight className="h-4 w-4" />
            </motion.div>
          </button>
        </div>
      </div>

      {/* Expanded students */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 border-t border-slate-800/60">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider py-3 flex items-center gap-1.5">
                <GraduationCap className="h-3.5 w-3.5" /> {t('Linked Students ({count})').replace('{count}', parent.linkedStudents.length.toString())}
              </p>
              {parent.linkedStudents.length === 0 ? (
                <p className="text-xs text-slate-600 italic py-3">{t('No students currently linked to this phone number.')}</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {parent.linkedStudents.map((s, i) => <StudentCard key={`${s.studentId}-${i}`} student={s} />)}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────
export const ParentsPage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { t } = useLanguage();
  const [parents, setParents] = useState<ParentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal state
  const [addModal, setAddModal] = useState(false);
  const [editTarget, setEditTarget] = useState<ParentRecord | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ParentRecord | null>(null);

  // Toast
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  const loadParents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getAdminParents();
      setParents(data || []);
    } catch (err: any) {
      setError(err.message || t('Failed to load parents'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => { loadParents(); }, [loadParents]);

  const handleSuccess = (msg: string) => {
    showToast(msg, 'success');
    loadParents();
  };

  const registered = parents.filter(p => !p.unregistered);
  const unregistered = parents.filter(p => p.unregistered);
  const totalStudents = parents.reduce((s, p) => s + p.totalStudents, 0);
  const totalOutstanding = parents.reduce((s, p) => s + p.totalOutstanding, 0);

  return (
    <>
      {/* Modals */}
      <AnimatePresence>
        {addModal && (
          <ParentModal mode="add" onClose={() => setAddModal(false)} onSuccess={handleSuccess} />
        )}
        {editTarget && (
          <ParentModal mode="edit" parent={editTarget} onClose={() => setEditTarget(null)} onSuccess={handleSuccess} />
        )}
        {deleteTarget && (
          <DeleteModal parent={deleteTarget} onClose={() => setDeleteTarget(null)} onSuccess={handleSuccess} />
        )}
        {toast && (
          <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />
        )}
      </AnimatePresence>

      <DashboardPage
        title="Parent Management"
        subtitle="View, add, edit, and delete guardian accounts linked to students."
        accentColor="indigo"
        onBack={onBack}
      >
        <div className="space-y-6">
          {/* Stats row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Total Parents', value: parents.length, color: 'text-indigo-400', icon: <User className="h-4 w-4" /> },
              { label: 'Registered', value: registered.length, color: 'text-emerald-400', icon: <CheckCircle className="h-4 w-4" /> },
              { label: 'Linked Students', value: totalStudents, color: 'text-teal-400', icon: <GraduationCap className="h-4 w-4" /> },
              { label: 'Outstanding Dues', value: `₹${totalOutstanding}`, color: 'text-rose-400', icon: <IndianRupee className="h-4 w-4" /> },
            ].map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-2"><span className={s.color}>{s.icon}</span>
                  <span className="text-[10px] font-bold text-slate-500 uppercase">{t(s.label)}</span></div>
                <span className={`text-2xl font-extrabold block ${s.color}`}>{s.value}</span>
              </motion.div>
            ))}
          </div>

          {/* Unregistered alert */}
          {unregistered.length > 0 && (
            <div className="flex items-start gap-3 bg-amber-500/5 border border-amber-500/20 rounded-2xl p-4">
              <AlertCircle className="h-5 w-5 text-amber-400 shrink-0 mt-0.5 animate-pulse" />
              <div>
                <p className="text-xs font-bold text-amber-300 mb-0.5">{t("Unregistered Parents Detected")}</p>
                <p className="text-[11px] text-slate-400">
                  {t("{count} parent phone(s) in the database have no portal account yet. Use \"Add Parent\" and enter the linked phone number to register them.").replace("{count}", unregistered.length.toString())}
                </p>
              </div>
            </div>
          )}

          {/* List header + Add button */}
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              {t("{count} parent record(s) — click a row to view linked students").replace("{count}", parents.length.toString())}
            </p>
            <button
              onClick={() => setAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition cursor-pointer shadow-lg shadow-indigo-500/15"
            >
              <Plus className="h-4 w-4" /> {t("Add Parent")}
            </button>
          </div>

          {/* List */}
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-6 w-6 text-indigo-400 animate-spin mr-3" />
              <span className="text-sm text-slate-400">{t("Loading from database...")}</span>
            </div>
          ) : error ? (
            <div className="bg-rose-500/5 border border-rose-500/20 rounded-2xl p-8 text-center">
              <AlertCircle className="h-8 w-8 text-rose-400 mx-auto mb-3" />
              <p className="text-sm font-bold text-rose-300 mb-1">{t("Failed to load data")}</p>
              <p className="text-xs text-slate-500">{error}</p>
              <button onClick={loadParents} className="mt-4 px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl transition cursor-pointer">
                {t("Retry")}
              </button>
            </div>
          ) : parents.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center">
              <User className="h-12 w-12 text-slate-600 mx-auto mb-4" />
              <p className="text-sm font-bold text-slate-400 mb-1">{t("No parent records found")}</p>
              <p className="text-xs text-slate-500 mb-4">{t("Add your first parent account to get started.")}</p>
              <button onClick={() => setAddModal(true)} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition cursor-pointer">
                <Plus className="h-4 w-4 inline mr-1.5" /> {t("Add First Parent")}
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {parents.map((parent, i) => (
                <ParentRow
                  key={parent.id || parent.phone}
                  parent={parent}
                  index={i}
                  onEdit={setEditTarget}
                  onDelete={setDeleteTarget}
                />
              ))}
            </div>
          )}
        </div>
      </DashboardPage>
    </>
  );
};
