import { motion, AnimatePresence } from 'motion/react';
import { Lightbulb, CheckCircle2 } from 'lucide-react';

interface CustomDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  variant?: 'info' | 'confirm' | 'success';
}

export default function CustomDialog({
  isOpen,
  onClose,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  variant = 'info',
}: CustomDialogProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
          />

          {/* Dialog Card */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 15 }}
            transition={{ type: 'spring', duration: 0.3 }}
            className="relative z-10 w-full max-w-sm bg-white rounded-2xl p-6 shadow-2xl border border-slate-100 flex flex-col items-center text-center"
          >
            {/* Visual Header Icon depending on variant */}
            <div className="mb-4">
              {variant === 'info' && (
                <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-primary">
                  <Lightbulb className="w-6 h-6" />
                </div>
              )}
              {variant === 'success' && (
                <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-secondary">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                </div>
              )}
              {variant === 'confirm' && (
                <div className="w-12 h-12 rounded-full bg-rose-50 flex items-center justify-center text-error">
                  <div className="w-3 h-3 rounded-full bg-red-600 animate-ping absolute" />
                  <div className="w-3 h-3 rounded-full bg-red-600 relative" />
                </div>
              )}
            </div>

            <h3 className="text-lg font-bold text-on-surface mb-2 tracking-tight">
              {title}
            </h3>
            <p className="text-sm text-on-surface-variant mb-6 leading-relaxed">
              {description}
            </p>

            <div className="flex gap-3 w-full justify-center">
              {variant === 'confirm' ? (
                <>
                  <button
                    onClick={onClose}
                    className="flex-1 py-3 text-sm font-semibold rounded-xl text-outline border border-outline-variant hover:bg-slate-50 transition-colors"
                  >
                    {cancelText}
                  </button>
                  <button
                    onClick={() => {
                      if (onConfirm) onConfirm();
                      onClose();
                    }}
                    className="flex-1 py-3 text-sm font-semibold rounded-xl bg-error text-white hover:bg-red-700 transition-colors elevation-1 active:scale-95 duration-150"
                  >
                    {confirmText}
                  </button>
                </>
              ) : (
                <button
                  onClick={onClose}
                  className="w-full py-3 text-sm font-semibold rounded-xl bg-primary text-white hover:bg-blue-700 transition-colors elevation-1 active:scale-95 duration-1150"
                >
                  Okay
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
