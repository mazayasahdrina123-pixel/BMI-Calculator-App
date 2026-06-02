import { Scale, Share2, Trash2, User } from 'lucide-react';
import { ActiveTab } from '../types';

interface HeaderProps {
  activeTab: ActiveTab;
  onClearHistory?: () => void;
  onShare?: () => void;
  hasHistory: boolean;
}

export default function Header({ activeTab, onClearHistory, onShare, hasHistory }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-white border-b border-blue-50/80 h-16 flex items-center justify-between px-5 shadow-sm">
      {/* Brand Logo and Title */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center border border-blue-100 shadow-sm">
          <Scale className="w-6 h-6 text-primary" />
        </div>
        <h1 className="text-xl font-bold text-primary tracking-tight">
          BMI Check
        </h1>
      </div>

      {/* Situational Controls */}
      <div className="flex items-center gap-2">
        {activeTab === 'history' && hasHistory && onClearHistory && (
          <button
            onClick={onClearHistory}
            className="text-xs font-semibold text-error px-3 py-2 hover:bg-error-container/10 rounded-xl transition-all duration-200 flex items-center gap-1.5 active:scale-95 border border-red-100"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear All
          </button>
        )}

        {/* Home/Result visual tools */}
        {activeTab === 'home' && onShare && (
          <button
            onClick={onShare}
            aria-label="Share calculations"
            className="p-2.5 text-on-surface-variant hover:text-primary hover:bg-blue-50/50 rounded-full transition-all duration-200 active:scale-90"
          >
            <Share2 className="w-5 h-5" />
          </button>
        )}

        {/* Global profile display / aesthetic anchor */}
        <div className="p-2.5 text-on-surface-variant rounded-full">
          <User className="w-5 h-5 text-outline hover:text-primary transition-colors cursor-pointer" />
        </div>
      </div>
    </header>
  );
}
