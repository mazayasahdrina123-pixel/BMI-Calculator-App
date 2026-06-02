import { motion, AnimatePresence } from 'motion/react';
import { Trash2, History, Scale, Ruler, Calendar } from 'lucide-react';
import { BMIRecord } from '../types';

interface HistoryTabProps {
  records: BMIRecord[];
  onDeleteRecord: (id: string) => void;
  unitSystem: 'metric' | 'imperial';
}

export default function HistoryTab({ records, onDeleteRecord, unitSystem }: HistoryTabProps) {
  // Sort records by timestamp descending (newest first)
  const sortedRecords = [...records].sort((a, b) => b.timestamp - a.timestamp);

  // Helper to format height & weight into imperial equivalent if selected
  const formatMeasurements = (record: BMIRecord) => {
    if (unitSystem === 'imperial') {
      // Metric to imperial conversion for reference
      const lbs = Math.round(record.weight * 2.20462);
      const totalInches = record.height / 2.54;
      const feet = Math.floor(totalInches / 12);
      const inches = Math.round(totalInches % 12);
      return {
        heightStr: `${feet}′${inches}″`,
        weightStr: `${lbs} lbs`,
      };
    } else {
      return {
        heightStr: `${Math.round(record.height)} cm`,
        weightStr: `${record.weight.toFixed(1)} kg`,
      };
    }
  };

  const getBadgeClasses = (category: string) => {
    switch (category) {
      case 'Underweight':
        return 'bg-amber-50 text-amber-700 border-amber-200/50';
      case 'Normal':
        return 'bg-emerald-50 text-[#006c49] border-emerald-200/50';
      case 'Overweight':
        return 'bg-orange-50 text-orange-700 border-orange-200/50';
      case 'Obese':
        return 'bg-red-50 text-red-700 border-red-200/50';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200/50';
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto flex flex-col gap-6 animate-in fade-in duration-300">
      {/* Intro Context */}
      <div>
        <h2 className="text-2xl font-black text-on-surface tracking-tight">
          Your History
        </h2>
        <p className="text-sm text-on-surface-variant mt-1.5 leading-relaxed">
          Track and audit your health journey logs over time.
        </p>
      </div>

      <AnimatePresence mode="popLayout">
        {sortedRecords.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex flex-col items-center justify-center py-16 text-center bg-white rounded-2xl border border-dashed border-slate-200 p-8"
          >
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-primary mb-4 shadow-sm border border-blue-100">
              <History className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-base font-bold text-on-surface">No records yet</h3>
            <p className="text-xs text-on-surface-variant max-w-xs mt-2 leading-relaxed">
              Your BMI history will appear here once you start calculating and saving your measurements.
            </p>
          </motion.div>
        ) : (
          <div className="flex flex-col gap-4">
            {sortedRecords.map((record) => {
              const { heightStr, weightStr } = formatMeasurements(record);
              const badgeClass = getBadgeClasses(record.category);

              return (
                <motion.div
                  key={record.id}
                  layout
                  initial={{ opacity: 0, y: 12, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 25, scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  className="bg-white rounded-xl border border-slate-100 p-4.5 elevation-1 flex items-center justify-between group hover:border-blue-100/80 transition-all duration-200 active:scale-[0.99]"
                >
                  <div className="flex-1 min-w-0 pr-4">
                    {/* Timestamp and status header */}
                    <div className="flex items-center gap-2 flex-wrap mb-3.5">
                      <div className="flex items-center gap-1.5 text-xs text-outline font-medium">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{record.date}</span>
                      </div>
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide uppercase border ${badgeClass}`}>
                        {record.category}
                      </span>
                    </div>

                    {/* Numerical indices details */}
                    <div className="flex gap-6 items-center">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-outline uppercase tracking-wider">BMI</span>
                        <span className="text-xl font-extrabold text-on-surface tracking-tight mt-0.5">
                          {record.bmi}
                        </span>
                      </div>

                      <div className="flex items-center gap-4 border-l border-slate-100 pl-4.5">
                        <div className="flex flex-col">
                          <span className="text-[10px] font-bold text-outline uppercase tracking-wider flex items-center gap-1">
                            <Scale className="w-3 h-3 text-slate-400" />
                            Weight
                          </span>
                          <span className="text-sm font-semibold text-on-surface mt-0.5">
                            {weightStr}
                          </span>
                        </div>

                        <div className="flex flex-col">
                          <span className="text-[10px] font-bold text-outline uppercase tracking-wider flex items-center gap-1">
                            <Ruler className="w-3 h-3 text-slate-400" />
                            Height
                          </span>
                          <span className="text-sm font-semibold text-on-surface mt-0.5">
                            {heightStr}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Swipeable / Actionable delete trigger button */}
                  <button
                    onClick={() => onDeleteRecord(record.id)}
                    aria-label="Delete calculation entry"
                    className="p-3 text-on-surface-variant hover:text-error hover:bg-rose-50/50 rounded-xl transition-all duration-200 border border-transparent hover:border-red-100 active:scale-90 flex-shrink-0"
                  >
                    <Trash2 className="w-5 h-5 text-slate-400 group-hover:text-error transition-colors" />
                  </button>
                </motion.div>
              );
            })}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
