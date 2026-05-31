import React from 'react';
import { useApp } from '../context/AppContext';
import { Sun, Moon, Sparkles, Info } from 'lucide-react';

const Settings = () => {
  const { theme, toggleTheme } = useApp();

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-extrabold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-400 bg-clip-text text-transparent">
          System Settings
        </h2>
        <p className="text-slate-450 dark:text-slate-400 text-sm mt-1">
          Customize your dashboard preferences and theme configurations.
        </p>
      </div>

      <div className="max-w-2xl space-y-6">
        {/* Theme Configuration Panel */}
        <div className="glass-panel p-6 rounded-2xl space-y-4">
          <div>
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-200 flex items-center gap-2">
              <Sparkles size={18} className="text-primary-500 dark:text-primary-400" />
              Theme Mode Selection
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Toggle between Light and Dark mode. Preferences are saved automatically.</p>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2">
            {/* Dark Mode selection card */}
            <button
              onClick={() => { if (theme !== 'dark') toggleTheme(); }}
              className={`p-4 rounded-xl border flex flex-col items-center gap-3 transition-all duration-200
                ${theme === 'dark' 
                  ? 'border-primary-500 bg-primary-600/10 text-primary-400 shadow-glow' 
                  : 'border-slate-200 bg-slate-50/50 text-slate-500 hover:border-slate-400 dark:border-darkBorder dark:bg-darkBg/30 dark:text-slate-400 dark:hover:border-slate-700'}
              `}
            >
              <Moon size={24} className={theme === 'dark' ? 'animate-pulse text-primary-400' : ''} />
              <div className="text-center">
                <span className="block text-sm font-extrabold">Dark Mode</span>
                <span className="text-[10px] opacity-70">Aesthetic glow palette</span>
              </div>
            </button>

            {/* Light Mode selection card */}
            <button
              onClick={() => { if (theme !== 'light') toggleTheme(); }}
              className={`p-4 rounded-xl border flex flex-col items-center gap-3 transition-all duration-200
                ${theme === 'light' 
                  ? 'border-primary-500 bg-primary-600/10 text-primary-600 shadow-glow' 
                  : 'border-slate-200 bg-slate-50/50 text-slate-500 hover:border-slate-400 dark:border-darkBorder dark:bg-darkBg/30 dark:text-slate-450 dark:hover:border-slate-700'}
              `}
            >
              <Sun size={24} className={theme === 'light' ? 'animate-spin-slow text-primary-500' : ''} />
              <div className="text-center">
                <span className="block text-sm font-extrabold">Light Mode</span>
                <span className="text-[10px] opacity-70">Bright and readable</span>
              </div>
            </button>
          </div>
        </div>

        {/* Application Metadata Card */}
        <div className="glass-panel p-6 rounded-2xl flex items-start gap-4">
          <Info className="text-primary-550 dark:text-primary-400 mt-0.5 flex-shrink-0" size={18} />
          <div className="space-y-1">
            <h4 className="text-sm font-extrabold text-slate-900 dark:text-slate-200">About LifeOS</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              LifeOS is a self-contained productivity suite. Task calculations, habits trackers, and gamified achievements operate entirely locally and connect to MongoDB for permanent storage.
            </p>
            <p className="text-[10px] text-slate-500 font-bold pt-2">
              Version 1.1.0 | Offline Single-User Mode
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
