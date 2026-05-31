import React from 'react';
import { useApp } from '../context/AppContext';
import { Award, Flame, Calendar, CheckCircle, Zap, Trophy, Lock } from 'lucide-react';
import dayjs from 'dayjs';

const Achievements = () => {
  const { achievements } = useApp();

  // Maps icon string to the actual component
  const getIcon = (iconName, unlocked) => {
    const props = {
      size: 32,
      className: unlocked ? 'text-white' : 'text-slate-600'
    };

    switch (iconName) {
      case 'CheckCircle':
        return <CheckCircle {...props} />;
      case 'Flame':
        return <Flame {...props} className={unlocked ? 'text-white fill-current' : 'text-slate-600'} />;
      case 'Calendar':
        return <Calendar {...props} />;
      case 'Award':
        return <Award {...props} />;
      case 'Zap':
        return <Zap {...props} className={unlocked ? 'text-white fill-current' : 'text-slate-600'} />;
      case 'Trophy':
        return <Trophy {...props} />;
      default:
        return <Award {...props} />;
    }
  };

  const unlockedCount = achievements.filter(a => a.unlocked).length;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-400 bg-clip-text text-transparent">
            System Achievements
          </h2>
          <p className="text-slate-450 dark:text-slate-400 text-sm mt-1">
            Earn badges by establishing streaks, completing cycles, and unlocking milestones.
          </p>
        </div>
        
        {/* Unlocked Summary Badge */}
        <div className="px-5 py-2.5 rounded-2xl bg-primary-600/10 border border-primary-500/20 text-primary-600 dark:text-primary-400 font-bold text-sm text-center">
          <span>Unlocked: {unlockedCount} / {achievements.length} Badges</span>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {achievements.map((ach) => {
          const isUnlocked = ach.unlocked;
          
          return (
            <div 
              key={ach.key}
              className={`glass-panel p-6 rounded-2xl flex items-center gap-5 border transition-all duration-300 relative overflow-hidden
                ${isUnlocked 
                  ? 'border-primary-500/30 bg-gradient-to-tr from-primary-50/50 to-white dark:from-primary-950/20 dark:to-darkCard shadow-glow' 
                  : 'border-slate-200 bg-white/40 dark:border-darkBorder dark:bg-darkCard/30 opacity-60'}
              `}
            >
              {/* Badge Icon bubble */}
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border flex-shrink-0 relative
                ${isUnlocked 
                  ? 'bg-gradient-to-tr from-primary-600 to-accent-purple border-primary-400 shadow-glow pulse-glow' 
                  : 'bg-slate-100 dark:bg-darkBg border-slate-205 dark:border-darkBorder'}
              `}>
                {isUnlocked ? (
                  getIcon(ach.icon, true)
                ) : (
                  <div className="relative">
                    {getIcon(ach.icon, false)}
                    <Lock size={12} className="absolute -bottom-1 -right-1 text-slate-500 bg-white dark:bg-darkCard border border-slate-200 dark:border-darkBorder rounded-full p-0.5" />
                  </div>
                )}
              </div>

              {/* Text content */}
              <div className="flex-1 min-w-0">
                <h3 className={`text-base font-bold truncate ${isUnlocked ? 'text-slate-900 dark:text-slate-100 font-extrabold' : 'text-slate-500'}`}>
                  {ach.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                  {ach.description}
                </p>
                {isUnlocked && ach.unlockedAt && (
                  <span className="block text-[10px] text-emerald-600 dark:text-emerald-450 font-bold mt-2">
                    Unlocked on {dayjs(ach.unlockedAt).format('MMM DD, YYYY')}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Achievements;
