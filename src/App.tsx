import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Ruler,
  Scale,
  RotateCcw,
  Bookmark,
  Lightbulb,
  Accessibility,
  Check,
  Share2
} from 'lucide-react';

import { BMIRecord, BMICategory, ActiveTab } from './types';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import BMIGauge from './components/BMIGauge';
import WeightSpectrum from './components/WeightSpectrum';
import HistoryTab from './components/HistoryTab';
import SettingsTab from './components/SettingsTab';
import CustomDialog from './components/CustomDialog';

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab ] = useState<ActiveTab>('home');

  // Configuration settings (synced to localStorage)
  const [unitSystem, setUnitSystem] = useState<'metric' | 'imperial'>(() => {
    const saved = localStorage.getItem('bmi_unit_system');
    return (saved as 'metric' | 'imperial') || 'metric';
  });

  const [targetBmi, setTargetBmi] = useState<number>(() => {
    const saved = localStorage.getItem('bmi_target_bmi');
    return saved ? parseFloat(saved) : 22.0;
  });

  const [remindersEnabled, setRemindersEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem('bmi_reminders_enabled');
    return saved ? saved === 'true' : true;
  });

  // History Records
  const [records, setRecords] = useState<BMIRecord[]>(() => {
    const saved = localStorage.getItem('bmi_records');
    return saved ? JSON.parse(saved) : [
      {
        id: 'mock-1',
        date: 'Oct 24, 2023',
        timestamp: 1698112380000,
        weight: 68.5,
        height: 170,
        bmi: 22.4,
        category: 'Normal',
      },
      {
        id: 'mock-2',
        date: 'Sep 12, 2023',
        timestamp: 1694483580000,
        weight: 74.2,
        height: 170,
        bmi: 26.1,
        category: 'Overweight',
      },
      {
        id: 'mock-3',
        date: 'Aug 05, 2023',
        timestamp: 1691197380000,
        weight: 71.0,
        height: 170,
        bmi: 23.8,
        category: 'Normal',
      },
      {
        id: 'mock-4',
        date: 'Jul 18, 2023',
        timestamp: 1689673380000,
        weight: 88.5,
        height: 170,
        bmi: 31.2,
        category: 'Obese',
      }
    ];
  });

  // Input states
  const [metricHeight, setMetricHeight] = useState<string>('');
  const [metricWeight, setMetricWeight] = useState<string>('');
  const [imperialFeet, setImperialFeet] = useState<string>('');
  const [imperialInches, setImperialInches] = useState<string>('');
  const [imperialWeight, setImperialWeight] = useState<string>('');

  // active computed result state
  const [currentResult, setCurrentResult] = useState<{
    bmi: number;
    category: BMICategory;
    text: string;
    proactiveTip: string;
    isSaved: boolean;
  } | null>(null);

  // Custom visual Dialog overlays states
  const [dialogConfig, setDialogConfig] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    variant: 'info' | 'confirm' | 'success';
    onConfirm?: () => void;
  }>({
    isOpen: false,
    title: '',
    description: '',
    variant: 'info',
  });

  // Sync settings states to localStorage
  useEffect(() => {
    localStorage.setItem('bmi_unit_system', unitSystem);
  }, [unitSystem]);

  useEffect(() => {
    localStorage.setItem('bmi_target_bmi', targetBmi.toString());
  }, [targetBmi]);

  useEffect(() => {
    localStorage.setItem('bmi_reminders_enabled', remindersEnabled.toString());
  }, [remindersEnabled]);

  useEffect(() => {
    localStorage.setItem('bmi_records', JSON.stringify(records));
  }, [records]);

  // Helper formatting helper
  const getBmiCategory = (bmi: number): BMICategory => {
    if (bmi < 18.5) return 'Underweight';
    if (bmi < 25.0) return 'Normal';
    if (bmi < 30.0) return 'Overweight';
    return 'Obese';
  };

  const getCategoryDetails = (bmi: number, cat: BMICategory) => {
    switch (cat) {
      case 'Underweight':
        return {
          text: `Your BMI is ${bmi}, which indicates that you are in the underweight range for your height. Adding nutrient-dense proteins can bolster safe lean weight adjustments.`,
          proactiveTip: "Incorporate healthy calories like nuts, olive oil, and high-density grains coupled with compound resistance workouts.",
        };
      case 'Normal':
        return {
          text: `Your BMI is ${bmi}, which indicates that you are within the healthy weight range for your height. Maintaining this range reduces health risks.`,
          proactiveTip: "Include 30 minutes of moderate activity 5 times a week to maintain your metabolic health.",
        };
      case 'Overweight':
        return {
          text: `Your BMI is ${bmi}, which indicates that you are slightly above the healthy weight range. Simple portion adaptations and active cardio routines bolster wellness.`,
          proactiveTip: "Prioritize lean proteins, dietary fibers, and schedule daily step totals of 8,000+ to assist metabolic wellness.",
        };
      case 'Obese':
        return {
          text: `Your BMI is ${bmi}, which indicates that you are in the obese category. Consistent daily lifestyle tweaks along with structured activities greatly mitigate joint stress.`,
          proactiveTip: "Select highly supportive low-impact activities like aquatic laps or stationery biking to protect knees and joints.",
        };
    }
  };

  // Perform computations
  const handleCalculate = () => {
    let heightCm = 0;
    let weightKg = 0;

    if (unitSystem === 'metric') {
      const hVal = parseFloat(metricHeight);
      const wVal = parseFloat(metricWeight);

      if (!hVal || !wVal || hVal <= 0 || wVal <= 0) {
        setDialogConfig({
          isOpen: true,
          title: 'Incorrect Inputs',
          description: 'Please input realistic positive values for weight and height to run diagnostics.',
          variant: 'info',
        });
        return;
      }

      if (hVal < 50 || hVal > 280 || wVal < 10 || wVal > 400) {
        setDialogConfig({
          isOpen: true,
          title: 'Realistic Boundaries Check',
          description: 'Please write standard boundaries: Height [50 - 280cm], Weight [10 - 400kg].',
          variant: 'info',
        });
        return;
      }

      heightCm = hVal;
      weightKg = wVal;
    } else {
      const feet = parseFloat(imperialFeet) || 0;
      const inches = parseFloat(imperialInches) || 0;
      const lbs = parseFloat(imperialWeight);

      const totalInches = (feet * 12) + inches;

      if (totalInches <= 0 || !lbs || lbs <= 0) {
        setDialogConfig({
          isOpen: true,
          title: 'Incorrect Inputs',
          description: 'Please specify positive measurements for feet, inches, and pounds weight.',
          variant: 'info',
        });
        return;
      }

      if (totalInches < 20 || totalInches > 110 || lbs < 20 || lbs > 880) {
        setDialogConfig({
          isOpen: true,
          title: 'Realistic Boundaries',
          description: 'Please write standard imperial borders: Height [20 - 110 in], Weight [20 - 880 lbs].',
          variant: 'info',
        });
        return;
      }

      // Convert to metric equivalents for standard record persistence
      heightCm = totalInches * 2.54;
      weightKg = lbs * 0.453592;
    }

    // Compute BMI
    const heightMeters = heightCm / 100;
    const rawBmi = weightKg / (heightMeters * heightMeters);
    const bmiVal = parseFloat(rawBmi.toFixed(1));

    const category = getBmiCategory(bmiVal);
    const details = getCategoryDetails(bmiVal, category);

    setCurrentResult({
      bmi: bmiVal,
      category,
      text: details.text,
      proactiveTip: details.proactiveTip,
      isSaved: false,
    });
  };

  const handleResetInputs = () => {
    setMetricHeight('');
    setMetricWeight('');
    setImperialFeet('');
    setImperialInches('');
    setImperialWeight('');
    setCurrentResult(null);
  };

  const handleSaveResult = () => {
    if (!currentResult) return;

    // Build unique ID
    const sampleRecordId = `record-${Date.now()}`;
    const dateOptions: Intl.DateTimeFormatOptions = { month: 'short', day: '2-digit', year: 'numeric' };
    const formattedDate = new Date().toLocaleDateString('en-US', dateOptions);

    let calculatedHeight = 170;
    let calculatedWeight = 70;

    if (unitSystem === 'metric') {
      calculatedHeight = parseFloat(metricHeight);
      calculatedWeight = parseFloat(metricWeight);
    } else {
      const feet = parseFloat(imperialFeet) || 0;
      const inches = parseFloat(imperialInches) || 0;
      calculatedHeight = ((feet * 12) + inches) * 2.54;
      calculatedWeight = (parseFloat(imperialWeight)) * 0.453592;
    }

    const newRecord: BMIRecord = {
      id: sampleRecordId,
      date: formattedDate,
      timestamp: Date.now(),
      weight: calculatedWeight,
      height: calculatedHeight,
      bmi: currentResult.bmi,
      category: currentResult.category,
    };

    setRecords((prev) => [newRecord, ...prev]);
    setCurrentResult((prev) => prev ? { ...prev, isSaved: true } : null);

    // Show beautiful success popup and jump view to history tab automatically
    setDialogConfig({
      isOpen: true,
      title: 'Result Logged',
      description: 'Your computed BMI indicators have been securely logged to history files.',
      variant: 'success',
      onConfirm: () => {
        setActiveTab('history');
      }
    });
  };

  const handleDeleteRecord = (id: string) => {
    setRecords((prev) => prev.filter((r) => r.id !== id));
  };

  const handleTriggerClearHistory = () => {
    setDialogConfig({
      isOpen: true,
      title: 'Clear History Logs?',
      description: 'Are you sure you want to completely erase all previous calculations? This operation is permanent.',
      variant: 'confirm',
      onConfirm: () => {
        setRecords([]);
      }
    });
  };

  const handleMockShare = () => {
    setDialogConfig({
      isOpen: true,
      title: 'Share Biometrics Report',
      description: 'Your secure BMI summary card link has been copied to your clipboard.',
      variant: 'success'
    });
  };

  return (
    <div className="bg-background text-on-surface min-h-screen pb-32 flex flex-col justify-between selection:bg-[#6cf8bb]">
      {/* Top Application Bar with Dynamic Handles */}
      <Header
        activeTab={activeTab}
        onClearHistory={handleTriggerClearHistory}
        onShare={handleMockShare}
        hasHistory={records.length > 0}
      />

      {/* Main viewport canvas */}
      <main className="flex-grow pt-24 px-5 max-w-md mx-auto w-full flex flex-col gap-6">
        <AnimatePresence mode="wait">
          {activeTab === 'home' && (
            <motion.div
              key="home-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col gap-6"
            >
              {!currentResult ? (
                /* INTAKE / INPUT CARD PANEL VIEW */
                <>
                  {/* Hero Intro */}
                  <header>
                    <h2 className="text-3xl font-black text-on-surface tracking-tight leading-tight">
                      Track Your Vitality
                    </h2>
                    <p className="text-sm text-on-surface-variant mt-2 leading-relaxed">
                      Enter your accurate physical ratios to classify your Bodily Mass Index and review wellness indicators.
                    </p>
                  </header>

                  <div className="flex flex-col gap-5">
                    {/* HEIGHT FORM ELEMENT */}
                    <div className="bg-white rounded-2xl border border-slate-100 p-4.5 elevation-1">
                      <label className="block text-[11px] font-bold text-outline tracking-wider uppercase mb-2.5">
                        Height {unitSystem === 'metric' ? '(CM)' : '(Feet & Inches)'}
                      </label>

                      {unitSystem === 'metric' ? (
                        <div className="flex items-center gap-3 bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 input-focus-ring transition-all">
                          <Ruler className="w-5 h-5 text-outline flex-shrink-0" />
                          <input
                            type="number"
                            id="metric-height"
                            value={metricHeight}
                            onChange={(e) => setMetricHeight(e.target.value)}
                            placeholder="170"
                            className="bg-transparent border-none outline-none ring-0 w-full font-bold text-lg text-on-surface placeholder:text-outline-variant pr-2"
                          />
                          <span className="text-xs font-bold text-primary bg-primary-fixed px-3 py-1.5 rounded-full flex-shrink-0 shadow-sm border border-blue-100">
                            cm
                          </span>
                        </div>
                      ) : (
                        <div className="flex gap-3">
                          {/* Feet element */}
                          <div className="flex-1 flex items-center gap-2 bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 input-focus-ring transition-all">
                            <input
                              type="number"
                              value={imperialFeet}
                              onChange={(e) => setImperialFeet(e.target.value)}
                              placeholder="5"
                              className="bg-transparent border-none outline-none ring-0 w-full font-bold text-lg text-on-surface placeholder:text-outline-variant"
                            />
                            <span className="text-xs font-bold text-slate-500">ft</span>
                          </div>

                          {/* Inches element */}
                          <div className="flex-1 flex items-center gap-2 bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 input-focus-ring transition-all">
                            <input
                              type="number"
                              value={imperialInches}
                              onChange={(e) => setImperialInches(e.target.value)}
                              placeholder="8"
                              className="bg-transparent border-none outline-none ring-0 w-full font-bold text-lg text-on-surface placeholder:text-outline-variant"
                            />
                            <span className="text-xs font-bold text-slate-500">in</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* WEIGHT FORM ELEMENT */}
                    <div className="bg-white rounded-2xl border border-slate-100 p-4.5 elevation-1">
                      <label className="block text-[11px] font-bold text-outline tracking-wider uppercase mb-2.5">
                        Weight {unitSystem === 'metric' ? '(KG)' : '(LBS)'}
                      </label>

                      <div className="flex items-center gap-3 bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 input-focus-ring transition-all">
                        <Scale className="w-5 h-5 text-outline flex-shrink-0" />
                        <input
                          type="number"
                          id="weight-input"
                          value={unitSystem === 'metric' ? metricWeight : imperialWeight}
                          onChange={(e) =>
                            unitSystem === 'metric'
                              ? setMetricWeight(e.target.value)
                              : setImperialWeight(e.target.value)
                          }
                          placeholder={unitSystem === 'metric' ? '70' : '150'}
                          className="bg-transparent border-none outline-none ring-0 w-full font-bold text-lg text-on-surface placeholder:text-outline-variant pr-2"
                        />
                        <span className="text-xs font-bold text-secondary bg-secondary-fixed px-3 py-1.5 rounded-full flex-shrink-0 shadow-sm border border-emerald-100">
                          {unitSystem === 'metric' ? 'kg' : 'lbs'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Core Interactive buttons */}
                  <div className="flex flex-col gap-3 mt-2">
                    <button
                      onClick={handleCalculate}
                      className="w-full h-14 bg-primary text-white font-bold text-sm tracking-wide uppercase rounded-xl flex items-center justify-center hover:bg-blue-700 active:scale-97 transition-all duration-200 shadow-md border border-blue-600 cursor-pointer"
                    >
                      Calculate BMI
                    </button>
                    <button
                      onClick={handleResetInputs}
                      className="w-full h-14 border border-outline text-outline font-bold text-sm tracking-wide uppercase rounded-xl flex items-center justify-center hover:bg-slate-50 active:scale-97 transition-all duration-200 cursor-pointer"
                    >
                      Reset
                    </button>
                  </div>

                  {/* Quick Tip Box */}
                  <section className="bg-[#996100]/10 border border-[#ffddb8]/30 rounded-2xl p-4.5 flex gap-3.5 items-start mt-1">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-[#784b00] flex-shrink-0">
                      <Lightbulb className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-[#784b00] uppercase tracking-wide">
                        Quick Health Tip
                      </h3>
                      <p className="text-xs text-on-surface-variant leading-relaxed mt-1">
                        BMI is standard screening parameter, not fully diagnostic. Ensure to consider muscle layout ratios, density, and physical workloads to attain whole biometrics evaluation clarity.
                      </p>
                    </div>
                  </section>

                  {/* Stay Informed Decor Cover */}
                  <div className="rounded-2xl overflow-hidden shadow-sm h-32 relative border border-slate-100 flex-shrink-0 mt-2">
                    <img
                      alt="Healthy physical layout backdrop"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover opacity-12 saturate-50"
                      src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=640&auto=format&fit=crop"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-50/40 via-white/80 to-blue-50/40 flex items-center justify-center">
                      <p className="text-[11px] font-bold text-outline tracking-widest uppercase text-center flex flex-col gap-1">
                        <span>Stay Informed • Stay Healthy</span>
                        <span className="text-[9px] font-medium text-slate-400 capitalize">Personal wellness metrics dashboard</span>
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                /* COMPUTED RESULTS SCREEN CARD VIEW */
                <>
                  <section className="bg-white rounded-2xl border border-slate-100 p-5 elevation-1 flex flex-col items-center text-center">
                    {/* Svg Radial circle Gauge */}
                    <BMIGauge bmi={currentResult.bmi} category={currentResult.category} />

                    {/* Status Badge capsule */}
                    <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-secondary-container/20 text-on-secondary-container mb-4.5 border border-emerald-100">
                      <span className="w-2.5 h-2.5 rounded-full bg-secondary" />
                      <span className="text-xs font-bold uppercase tracking-wider">
                        {currentResult.category === 'Normal' ? 'Normal Weight' : currentResult.category}
                      </span>
                    </div>

                    {/* Feedback summary dynamic text */}
                    <p className="text-sm text-on-surface-variant leading-relaxed max-w-sm">
                      Your BMI is <strong className="text-slate-900">{currentResult.bmi}</strong>, which indicates that you are in the{' '}
                      <strong className="text-slate-900 lowercase">{currentResult.category}</strong> range for your height. Keeping an optimal scale limits health risks.
                    </p>
                  </section>

                  {/* Linear spectrum layout pointer */}
                  <WeightSpectrum bmi={currentResult.bmi} />

                  {/* Dynamic context health advice proactive tip */}
                  <section className="bg-primary-container text-white rounded-2xl p-5 flex items-start gap-4 relative overflow-hidden shadow-md">
                    <div className="z-10 flex flex-col gap-1.5 flex-1 pr-4">
                      <h3 className="text-xs font-extrabold uppercase tracking-widest text-[#eeefff]/90">
                        Proactive Tip
                      </h3>
                      <p className="text-sm font-medium leading-relaxed mt-1 text-white">
                        {currentResult.proactiveTip}
                      </p>
                    </div>
                    <Accessibility className="w-10 h-10 text-white/20 flex-shrink-0 z-10" />

                    {/* Backdrop subtle ambient shapes */}
                    <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
                  </section>

                  {/* First view action buttons */}
                  <div className="flex flex-col gap-3.5 mb-6">
                    <button
                      onClick={() => setCurrentResult(null)}
                      className="w-full h-14 bg-primary text-white font-bold text-sm tracking-wide uppercase rounded-xl flex items-center justify-center gap-2 hover:bg-blue-700 active:scale-97 transition-all duration-200 shadow-md border border-blue-600"
                    >
                      <RotateCcw className="w-4 h-4" />
                      Calculate Again
                    </button>

                    <button
                      onClick={handleSaveResult}
                      disabled={currentResult.isSaved}
                      className={`w-full h-14 border rounded-xl font-bold text-sm tracking-wide uppercase flex items-center justify-center gap-2 active:scale-97 transition-all duration-200 ${
                        currentResult.isSaved
                          ? 'bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed'
                          : 'border-outline text-primary hover:bg-blue-50/30'
                      }`}
                    >
                      {currentResult.isSaved ? (
                        <>
                          <Check className="w-4 h-4 text-emerald-600" />
                          Result Saved
                        </>
                      ) : (
                        <>
                          <Bookmark className="w-4 h-4" />
                          Save Result
                        </>
                      )}
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          )}

          {activeTab === 'history' && (
            <motion.div
              key="history-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
            >
              <HistoryTab
                records={records}
                onDeleteRecord={handleDeleteRecord}
                unitSystem={unitSystem}
              />
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div
              key="settings-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
            >
              <SettingsTab
                unitSystem={unitSystem}
                onSetUnitSystem={setUnitSystem}
                targetBmi={targetBmi}
                onSetTargetBmi={setTargetBmi}
                remindersEnabled={remindersEnabled}
                onSetRemindersEnabled={setRemindersEnabled}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Bottom Global Navigation controller panel */}
      <BottomNav activeTab={activeTab} onChangeTab={setActiveTab} />

      {/* Custom Global interactive modal/confirm alerts */}
      <CustomDialog
        isOpen={dialogConfig.isOpen}
        onClose={() => setDialogConfig((prev) => ({ ...prev, isOpen: false }))}
        title={dialogConfig.title}
        description={dialogConfig.description}
        variant={dialogConfig.variant}
        confirmText="Confirm"
        cancelText="Cancel"
        onConfirm={dialogConfig.onConfirm}
      />
    </div>
  );
}
