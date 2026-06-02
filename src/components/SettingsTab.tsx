import { motion } from 'motion/react';
import { Target, Bell, Info, ShieldAlert, BadgeInfo } from 'lucide-react';

interface SettingsTabProps {
  unitSystem: 'metric' | 'imperial';
  onSetUnitSystem: (system: 'metric' | 'imperial') => void;
  targetBmi: number;
  onSetTargetBmi: (val: number) => void;
  remindersEnabled: boolean;
  onSetRemindersEnabled: (val: boolean) => void;
}

export default function SettingsTab({
  unitSystem,
  onSetUnitSystem,
  targetBmi,
  onSetTargetBmi,
  remindersEnabled,
  onSetRemindersEnabled,
}: SettingsTabProps) {
  return (
    <div className="w-full max-w-lg mx-auto flex flex-col gap-6 animate-in fade-in duration-300">
      {/* Settings Header Title */}
      <div>
        <h2 className="text-2xl font-black text-on-surface tracking-tight">
          Settings
        </h2>
        <p className="text-sm text-on-surface-variant mt-1.5 leading-relaxed">
          Customize biometric units, guidelines parameters, and diagnostic options.
        </p>
      </div>

      {/* Unit Preferences Segmented Card */}
      <div className="bg-white rounded-2xl border border-slate-100 p-5 elevation-1 flex flex-col gap-4">
        <div>
          <label className="text-xs font-bold text-outline uppercase tracking-wider block">
            Measurement Standard
          </label>
          <span className="text-xs text-on-surface-variant block mt-1 leading-relaxed">
            Select standard guidelines for computing your Biometric Indices.
          </span>
        </div>

        {/* Custom Segmented Control Buttons */}
        <div className="flex bg-slate-100/80 p-1 rounded-xl relative justify-between">
          <button
            onClick={() => onSetUnitSystem('metric')}
            className={`flex-1 py-3 text-xs font-bold rounded-lg transition-all duration-300 relative z-10 ${
              unitSystem === 'metric'
                ? 'bg-white text-primary shadow-sm'
                : 'text-on-surface-variant hover:text-slate-900'
            }`}
          >
            Metric (cm / kg)
          </button>
          <button
            onClick={() => onSetUnitSystem('imperial')}
            className={`flex-1 py-3 text-xs font-bold rounded-lg transition-all duration-300 relative z-10 ${
              unitSystem === 'imperial'
                ? 'bg-white text-primary shadow-sm'
                : 'text-on-surface-variant hover:text-slate-900'
            }`}
          >
            Imperial (ft / lbs)
          </button>
        </div>
      </div>

      {/* Target goals card */}
      <div className="bg-white rounded-2xl border border-slate-100 p-5 elevation-1 flex flex-col gap-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-primary flex items-center justify-center flex-shrink-0">
            <Target className="w-4 h-4" />
          </div>
          <div>
            <label className="text-xs font-bold text-outline uppercase tracking-wider block">
              Optimal Target BMI
            </label>
            <span className="text-xs text-on-surface-variant block mt-1 leading-relaxed">
              Define your weight track index goal. Standard healthy index is 18.5 - 25.0.
            </span>
          </div>
        </div>

        {/* Slider control */}
        <div className="pt-2">
          <div className="flex justify-between items-center text-sm font-bold text-on-surface mb-2">
            <span>Target Index</span>
            <span className="text-primary bg-blue-50 px-3 py-1 rounded-full text-xs">
              {targetBmi.toFixed(1)}
            </span>
          </div>
          <input
            type="range"
            min="18.5"
            max="26.0"
            step="0.1"
            value={targetBmi}
            onChange={(e) => onSetTargetBmi(parseFloat(e.target.value))}
            className="w-full accent-primary h-2 bg-slate-100 rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[10px] uppercase font-bold text-outline tracking-wider mt-1 px-1">
            <span>18.5 (Lean normal)</span>
            <span>26.0 (Slightly Over)</span>
          </div>
        </div>
      </div>

      {/* Check/Reminder Alerts panel */}
      <div className="bg-white rounded-2xl border border-slate-100 p-5 elevation-1 flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <div className="flex gap-3 items-start">
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <label className="text-xs font-bold text-outline uppercase tracking-wider block">
                Daily Check-In Alerts
              </label>
              <span className="text-xs text-on-surface-variant block mt-1 leading-relaxed">
                Receive routine check reminders to keep active progress metrics updated.
              </span>
            </div>
          </div>

          {/* Toggle Switch */}
          <button
            onClick={() => onSetRemindersEnabled(!remindersEnabled)}
            className={`w-11 h-6 rounded-full transition-colors relative duration-300 flex items-center px-1 flex-shrink-0 ${
              remindersEnabled ? 'bg-primary' : 'bg-slate-200'
            }`}
          >
            <motion.div
              layout
              className="w-4 h-4 bg-white rounded-full shadow-md"
              animate={{ x: remindersEnabled ? 20 : 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
          </button>
        </div>
      </div>

      {/* Information Disclaimers panel */}
      <div className="bg-blue-50/50 rounded-2xl border border-blue-100/50 p-5 flex gap-3.5 items-start">
        <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h4 className="text-xs font-bold text-primary uppercase tracking-wider">
            Clinical Guideline Advisory
          </h4>
          <p className="text-xs text-on-primary-fixed-variant mt-1.5 leading-relaxed">
            BMI is a basic sizing screening factor and does not account for muscular anatomy, age, density, or metabolic profile details. Please treat statistics as advisory indicators and seek registered clinicians for primary physical health diagnostics.
          </p>
        </div>
      </div>
    </div>
  );
}
