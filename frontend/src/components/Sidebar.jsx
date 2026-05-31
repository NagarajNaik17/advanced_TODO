import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  LayoutDashboard, 
  CheckSquare, 
  Flame, 
  Target, 
  Clock, 
  BarChart2, 
  Award,
  Calendar,
  Settings,
  Menu,
  X,
  Zap,
  ChevronDown,
  ChevronRight
} from 'lucide-react';

const Sidebar = () => {
  const { activePage, setActivePage } = useApp();
  const [isOpen, setIsOpen] = useState(false);

  // Accordion open states
  const [tasksExpanded, setTasksExpanded] = useState(true);
  const [habitsExpanded, setHabitsExpanded] = useState(true);

  // Navigation callbacks
  const navigate = (id) => {
    setActivePage(id);
    setIsOpen(false);
  };

  const isTaskActive = (id) => activePage === id;

  return (
    <>
      {/* Mobile Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-lightCard dark:bg-darkCard border border-lightBorder dark:border-darkBorder text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar Container */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 glass-panel border-r flex flex-col justify-between transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:h-screen lg:flex-shrink-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Top Logo & Title */}
        <div className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-primary-600 to-accent-purple text-white shadow-glow pulse-glow">
              <Zap size={22} className="fill-current" />
            </div>
            <div>
              <h1 className="font-bold text-xl tracking-tight bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 bg-clip-text text-transparent">
                LifeOS
              </h1>
              <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">Productivity Control</p>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-4 py-2 space-y-1.5 overflow-y-auto">
          {/* 1. Dashboard Link */}
          <button
            onClick={() => navigate('dashboard')}
            className={`w-full flex items-center gap-3.5 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200
              ${activePage === 'dashboard' 
                ? 'bg-primary-600/10 text-primary-600 dark:text-primary-400 border border-primary-500/20' 
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/40 border border-transparent'}
            `}
          >
            <LayoutDashboard size={16} />
            Dashboard
          </button>

          {/* 2. Task Management Accordion */}
          <div className="space-y-1">
            <button
              onClick={() => setTasksExpanded(!tasksExpanded)}
              className="w-full flex items-center justify-between px-4 py-2 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest hover:text-slate-600 dark:hover:text-slate-300"
            >
              <span className="flex items-center gap-2">
                <CheckSquare size={13} />
                Task Management
              </span>
              {tasksExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </button>
            
            {tasksExpanded && (
              <div className="pl-4 space-y-0.5 border-l border-lightBorder dark:border-darkBorder/40 ml-4">
                {[
                  { id: 'tasks-all', name: 'All Tasks', color: 'text-slate-400 dark:text-slate-500' },
                  { id: 'tasks-daily', name: 'Daily Tasks', color: 'text-emerald-500' },
                  { id: 'tasks-weekly', name: 'Weekly Tasks', color: 'text-blue-500' },
                  { id: 'tasks-monthly', name: 'Monthly Tasks', color: 'text-purple-500' },
                  { id: 'tasks-custom', name: 'Custom Tasks', color: 'text-pink-500' }
                ].map(sub => (
                  <button
                    key={sub.id}
                    onClick={() => navigate(sub.id)}
                    className={`w-full flex items-center gap-2.5 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-150
                      ${isTaskActive(sub.id)
                        ? 'bg-slate-200/50 dark:bg-slate-800 text-primary-600 dark:text-primary-400 font-bold border border-slate-300/30 dark:border-darkBorder/30'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/20'}
                    `}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${sub.color}`} />
                    {sub.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 3. Habit Management Accordion */}
          <div className="space-y-1 pt-1.5">
            <button
              onClick={() => setHabitsExpanded(!habitsExpanded)}
              className="w-full flex items-center justify-between px-4 py-2 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest hover:text-slate-600 dark:hover:text-slate-300"
            >
              <span className="flex items-center gap-2">
                <Flame size={13} />
                Habit Management
              </span>
              {habitsExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </button>
            
            {habitsExpanded && (
              <div className="pl-4 space-y-0.5 border-l border-lightBorder dark:border-darkBorder/40 ml-4">
                {[
                  { id: 'habits-daily', name: 'Daily Habits', color: 'text-emerald-500' },
                  { id: 'habits-weekly', name: 'Weekly Habits', color: 'text-blue-500' },
                  { id: 'habits-monthly', name: 'Monthly Habits', color: 'text-purple-500' }
                ].map(sub => (
                  <button
                    key={sub.id}
                    onClick={() => navigate(sub.id)}
                    className={`w-full flex items-center gap-2.5 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-150
                      ${isTaskActive(sub.id)
                        ? 'bg-slate-200/50 dark:bg-slate-800 text-primary-600 dark:text-primary-400 font-bold border border-slate-300/30 dark:border-darkBorder/30'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/20'}
                    `}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${sub.color}`} />
                    {sub.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 4. Core views separators */}
          <div className="h-px bg-lightBorder dark:bg-darkBorder/40 my-2" />

          {/* 5. Yearly Goals Link */}
          <button
            onClick={() => navigate('goals')}
            className={`w-full flex items-center gap-3.5 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200
              ${activePage === 'goals' 
                ? 'bg-primary-600/10 text-primary-600 dark:text-primary-400 border border-primary-500/20' 
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/40 border border-transparent'}
            `}
          >
            <Target size={16} />
            Yearly Goals
          </button>

          {/* 6. Calendar Link */}
          <button
            onClick={() => navigate('calendar')}
            className={`w-full flex items-center gap-3.5 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200
              ${activePage === 'calendar' 
                ? 'bg-primary-600/10 text-primary-600 dark:text-primary-400 border border-primary-500/20' 
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/40 border border-transparent'}
            `}
          >
            <Calendar size={16} />
            Calendar
          </button>



          {/* 8. Statistics Link */}
          <button
            onClick={() => navigate('statistics')}
            className={`w-full flex items-center gap-3.5 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200
              ${activePage === 'statistics' 
                ? 'bg-primary-600/10 text-primary-600 dark:text-primary-400 border border-primary-500/20' 
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/40 border border-transparent'}
            `}
          >
            <BarChart2 size={16} />
            Statistics
          </button>

          {/* 9. Achievements Link */}
          <button
            onClick={() => navigate('achievements')}
            className={`w-full flex items-center gap-3.5 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200
              ${activePage === 'achievements' 
                ? 'bg-primary-600/10 text-primary-600 dark:text-primary-400 border border-primary-500/20' 
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/40 border border-transparent'}
            `}
          >
            <Award size={16} />
            Achievements
          </button>

          {/* 10. Settings Link */}
          <button
            onClick={() => navigate('settings')}
            className={`w-full flex items-center gap-3.5 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200
              ${activePage === 'settings' 
                ? 'bg-primary-600/10 text-primary-600 dark:text-primary-400 border border-primary-500/20' 
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/40 border border-transparent'}
            `}
          >
            <Settings size={16} />
            Settings
          </button>
        </nav>

        {/* Footer info */}
        <div className="p-4 border-t border-lightBorder dark:border-darkBorder/40">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-100 dark:bg-darkBg/60 border border-lightBorder dark:border-darkBorder/50">
            <div className="w-8 h-8 rounded-full bg-primary-600/20 flex items-center justify-center font-bold text-primary-600 dark:text-primary-400 border border-primary-500/20">
              U
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Single User</p>
              <p className="text-[10px] text-slate-400 dark:text-slate-500">System Active</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
