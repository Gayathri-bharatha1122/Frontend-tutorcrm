import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

interface DashboardPageProps {
  title: string;
  subtitle?: string;
  accentColor?: string; // tailwind color class e.g. 'indigo' | 'teal' | 'amber' | 'emerald'
  onBack: () => void;
  children: React.ReactNode;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  title,
  subtitle,
  accentColor = 'indigo',
  onBack,
  children
}) => {
  const { t } = useLanguage();
  const colorMap: Record<string, string> = {
    indigo: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20 hover:bg-indigo-500/20',
    teal: 'text-teal-400 bg-teal-500/10 border-teal-500/20 hover:bg-teal-500/20',
    amber: 'text-amber-400 bg-amber-500/10 border-amber-500/20 hover:bg-amber-500/20',
    emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20 hover:bg-emerald-500/20',
  };
  const accent = colorMap[accentColor] || colorMap.indigo;
  const textColor = `text-${accentColor}-400`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25 }}
      className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-8"
    >
      {/* Back button + page header */}
      <div className="mb-8">
        <button
          onClick={onBack}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer mb-6 ${accent}`}
        >
          <ArrowLeft className="h-4 w-4" />
          {t('Back to Dashboard')}
        </button>

        <div className="space-y-1">
          <span className={`text-[10px] font-bold uppercase tracking-widest block ${textColor}`}>
            {t('Portal Navigation')}
          </span>
          <h1 className="text-2xl font-extrabold text-white">{t(title)}</h1>
          {subtitle && (
            <p className="text-slate-400 text-sm">{t(subtitle)}</p>
          )}
        </div>
      </div>

      {/* Page content */}
      <div>{children}</div>
    </motion.div>
  );
};
