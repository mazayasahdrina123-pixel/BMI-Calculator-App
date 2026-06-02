import { Home, History, Settings } from 'lucide-react';
import { ActiveTab } from '../types';

interface BottomNavProps {
  activeTab: ActiveTab;
  onChangeTab: (tab: ActiveTab) => void;
}

export default function BottomNav({ activeTab, onChangeTab }: BottomNavProps) {
  const tabs = [
    { id: 'home' as ActiveTab, label: 'Home', icon: Home },
    { id: 'history' as ActiveTab, label: 'History', icon: History },
    { id: 'settings' as ActiveTab, label: 'Settings', icon: Settings },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 border-t border-slate-100 flex justify-around items-center py-3.5 px-6 shadow-2xl backdrop-blur-md rounded-t-2xl">
      <div className="flex w-full max-w-md justify-between items-center">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onChangeTab(tab.id)}
              className={`flex flex-col items-center justify-center transition-all duration-300 relative ${
                isActive ? 'scale-105' : 'hover:scale-102 active:scale-95'
              }`}
            >
              <div
                className={`flex flex-col items-center gap-1.5 transition-all duration-300 ${
                  isActive
                    ? 'bg-[#6cf8bb] text-[#00714d] px-6 py-1.5 rounded-full shadow-sm'
                    : 'text-[#434655] px-4 py-1.5'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-[2px]'}`} />
                <span className="text-[12px] font-semibold tracking-wide uppercase">
                  {tab.label}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
