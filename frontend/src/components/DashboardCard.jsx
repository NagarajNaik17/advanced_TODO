import React from 'react';

const DashboardCard = ({ title, percentage, completed, remaining, color = 'indigo' }) => {
  // Determine color theme classes
  const colorMap = {
    indigo: {
      text: 'text-primary-400',
      bar: 'bg-primary-500',
      glow: 'shadow-glow',
      bgGlow: 'bg-primary-500/10'
    },
    purple: {
      text: 'text-accent-purple',
      bar: 'bg-accent-purple',
      glow: 'shadow-glow',
      bgGlow: 'bg-accent-purple/10'
    },
    emerald: {
      text: 'text-accent-emerald',
      bar: 'bg-accent-emerald',
      glow: 'shadow-glowEmerald',
      bgGlow: 'bg-accent-emerald/10'
    },
    cyan: {
      text: 'text-accent-cyan',
      bar: 'bg-accent-cyan',
      glow: 'shadow-glow',
      bgGlow: 'bg-accent-cyan/10'
    },
    blue: {
      text: 'text-blue-500 dark:text-blue-400',
      bar: 'bg-blue-500',
      glow: 'shadow-glow',
      bgGlow: 'bg-blue-500/10'
    },
    orange: {
      text: 'text-orange-500 dark:text-orange-400',
      bar: 'bg-orange-500',
      glow: 'shadow-glow',
      bgGlow: 'bg-orange-500/10'
    }
  };

  const theme = colorMap[color] || colorMap.indigo;

  return (
    <div className="glass-panel p-6 rounded-2xl relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-slate-700/60">
      {/* Decorative Background Accent */}
      <div className={`absolute -right-8 -top-8 w-24 h-24 rounded-full blur-2xl ${theme.bgGlow}`} />

      <h3 className="text-slate-400 text-sm font-semibold uppercase tracking-wider">{title}</h3>
      
      <div className="mt-4 flex items-baseline justify-between">
        <span className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
          {percentage}%
        </span>
        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          {completed} / {completed + remaining} Done
        </span>
      </div>

      {/* Progress Bar Container */}
      <div className="mt-4 w-full h-2.5 bg-darkBg/80 rounded-full overflow-hidden border border-darkBorder/40">
        <div 
          className={`h-full ${theme.bar} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${Math.min(100, Math.max(0, percentage))}%` }}
        />
      </div>

      <div className="mt-4 flex items-center justify-between text-xs font-medium text-slate-400">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span>{completed} Completed</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
          <span>{remaining} Remaining</span>
        </div>
      </div>
    </div>
  );
};

export default DashboardCard;
