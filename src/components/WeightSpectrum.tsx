import { motion } from 'motion/react';
import { BMICategory } from '../types';

interface WeightSpectrumProps {
  bmi: number;
}

export default function WeightSpectrum({ bmi }: WeightSpectrumProps) {
  // We want to map the pointer to a linear scale of 15.0 to 35.0
  const minLimit = 15.0;
  const maxLimit = 35.0;
  const rawPercent = ((bmi - minLimit) / (maxLimit - minLimit)) * 100;
  // Clamp between 2% and 98% representing safe boundaries
  const pointerPercent = Math.min(98, Math.max(2, rawPercent));

  const categories = [
    { name: 'Underweight', color: 'bg-tertiary-fixed-dim', weight: 'w-[30%]' },
    { name: 'Normal', color: 'bg-secondary', weight: 'w-[30%]' },
    { name: 'Overweight', color: 'bg-orange-400', weight: 'w-[20%]' },
    { name: 'Obese', color: 'bg-[#ba1a1a]', weight: 'w-[20%]' },
  ];

  return (
    <section className="bg-white rounded-2xl border border-slate-100 p-5 elevation-1 flex flex-col gap-5">
      <h2 className="text-xs font-bold text-outline uppercase tracking-widest">
        Weight Spectrum
      </h2>

      <div className="relative pt-6 pb-2">
        {/* Bounds Labels */}
        <div className="flex justify-between w-full mb-3 text-xs font-semibold text-outline px-1">
          <span>18.5</span>
          <span>25.0</span>
          <span>30.0</span>
        </div>

        {/* Multi-color Spectrum Solid Track */}
        <div className="w-full h-3 rounded-full overflow-hidden flex shadow-inner">
          {categories.map((cat, idx) => (
            <div
              key={idx}
              className={`h-full ${cat.weight} ${cat.color}`}
              title={cat.name}
            />
          ))}
        </div>

        {/* Dynamic Pointer Indicator with sliding motion animation */}
        <motion.div
          initial={{ left: '0%' }}
          animate={{ left: `${pointerPercent}%` }}
          transition={{ type: 'spring', stiffness: 80, damping: 15, delay: 0.2 }}
          className="absolute top-4 -translate-x-1/2 flex flex-col items-center z-10"
        >
          {/* Circular Indicator Anchor */}
          <div className="w-4 h-4 bg-slate-900 rounded-full border-2 border-white shadow-md" />
          {/* Fine connector line */}
          <div className="w-0.5 h-6 bg-slate-900/20" />
        </motion.div>
      </div>

      {/* Grid Legend Elements */}
      <div className="grid grid-cols-2 gap-y-3 gap-x-4 pt-1 border-t border-slate-50 mt-1">
        <div className="flex items-center gap-2.5">
          <div className="w-3.5 h-3.5 rounded-md bg-tertiary-fixed-dim" />
          <span className="text-xs font-medium text-on-surface-variant">Underweight</span>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="w-3.5 h-3.5 rounded-md bg-secondary" />
          <span className="text-xs font-medium text-on-surface-variant">Normal</span>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="w-3.5 h-3.5 rounded-md bg-orange-400" />
          <span className="text-xs font-medium text-on-surface-variant">Overweight</span>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="w-3.5 h-3.5 rounded-md bg-error" />
          <span className="text-xs font-medium text-on-surface-variant">Obese</span>
        </div>
      </div>
    </section>
  );
}
