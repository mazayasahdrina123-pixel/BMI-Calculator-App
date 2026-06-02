import { motion } from 'motion/react';
import { BMICategory } from '../types';

interface BMIGaugeProps {
  bmi: number;
  category: BMICategory;
}

export default function BMIGauge({ bmi, category }: BMIGaugeProps) {
  // Let's map BMI to a visual progress scale of 10 to 40
  // e.g., 10 is 0%, 40 is 100%
  const minBmi = 10;
  const maxBmi = 40;
  const percentage = Math.min(100, Math.max(0, ((bmi - minBmi) / (maxBmi - minBmi)) * 100));

  // Circle properties
  const radius = 80;
  const circumference = 2 * Math.PI * radius; // Approx 502.65
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  // Let's get the active color based on the category
  const getCategoryColor = (cat: BMICategory) => {
    switch (cat) {
      case 'Underweight':
        return '#ffb95f'; // Amber-esque
      case 'Normal':
        return '#006c49'; // Mint Green theme secondary
      case 'Overweight':
        return '#f97316'; // Orange-400
      case 'Obese':
        return '#ba1a1a'; // Red
      default:
        return '#0053db';
    }
  };

  const currentColor = getCategoryColor(category);

  return (
    <div className="relative w-52 h-52 flex items-center justify-center mb-6">
      {/* Dynamic Animated Circular SVG */}
      <svg className="absolute inset-0 w-full h-full transform -rotate-90">
        {/* Background track */}
        <circle
          cx="104"
          cy="104"
          r={radius}
          fill="transparent"
          stroke="#eff4ff"
          strokeWidth="14"
        />

        {/* Foreground sweeping progress indicator */}
        <motion.circle
          cx="104"
          cy="104"
          r={radius}
          fill="transparent"
          stroke={currentColor}
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        />
      </svg>

      {/* Numerical Data Indicator Center */}
      <div className="z-10 text-center flex flex-col items-center">
        {/* Smooth number reveal */}
        <motion.span
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-5xl font-black text-on-surface tracking-tighter"
        >
          {bmi}
        </motion.span>
        <p className="font-medium text-xs text-on-surface-variant uppercase tracking-wider mt-1">
          BMI Index
        </p>
      </div>
    </div>
  );
}
