import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Trash2, 
  Edit3, 
  RefreshCw, 
  Flame, 
  Hourglass,
  Calendar
} from 'lucide-react';
import dayjs from 'dayjs';

const TaskCard = ({ task, onEdit }) => {
  const { updateTaskStatus, deleteTask } = useApp();

  const handleStatusChange = (newStatus) => {
    updateTaskStatus(task._id, newStatus);
  };

  // Custom Duration remaining days & overdue calculation
  const getDurationText = () => {
    if (!task.isCustomDuration || !task.endDate) return null;
    
    const end = dayjs(task.endDate);
    const today = dayjs();
    const diff = end.diff(today, 'day');

    if (diff < 0) {
      return { text: `Overdue by ${Math.abs(diff)} days`, overdue: true, days: diff };
    } else if (diff === 0) {
      return { text: 'Ends today', overdue: false, days: 0 };
    } else {
      return { text: `${diff} days remaining`, overdue: false, days: diff };
    }
  };

  const durationStatus = getDurationText();

  // Color Coding helper for categorizations
  const getBadgeClass = (category, isCustom) => {
    if (isCustom) return 'badge-custom';
    switch (category) {
      case 'daily': return 'badge-daily';
      case 'weekly': return 'badge-weekly';
      case 'monthly': return 'badge-monthly';
      case 'yearly': return 'badge-yearly';
      default: return 'badge-daily';
    }
  };

  const getBadgeLabel = (category, isCustom) => {
    if (isCustom) return 'CUSTOM';
    return category.toUpperCase();
  };

  const getCardClass = (category, isCustom) => {
    if (isCustom) return 'card-custom';
    switch (category) {
      case 'daily': return 'card-daily';
      case 'weekly': return 'card-weekly';
      case 'monthly': return 'card-monthly';
      case 'yearly': return 'card-yearly';
      default: return 'card-custom';
    }
  };

  return (
    <div className={`p-5 rounded-2xl relative overflow-hidden transition-all duration-200 border shadow-sm dark:shadow-xl
      ${getCardClass(task.category, task.isCustomDuration)}
      ${task.status === 'completed' ? 'opacity-80' : ''}
      ${(durationStatus && durationStatus.overdue) ? 'border-l-4 border-l-accent-rose' : ''}
    `}>
      {/* Top Section: Title & Actions */}
      <div className="flex justify-between items-start gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            {/* Category Badges */}
            <span className={getBadgeClass(task.category, task.isCustomDuration)}>
              {getBadgeLabel(task.category, task.isCustomDuration)}
            </span>
            {task.type === 'repeatable' && (
              <span className="text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-accent-purple/15 text-accent-purple dark:text-primary-300 flex items-center gap-0.5 border border-primary-500/20">
                <RefreshCw size={9} className="animate-spin-slow" />
                Repeatable
              </span>
            )}
          </div>
          <h4 className={`text-base font-extrabold mt-2 truncate text-current ${task.status === 'completed' ? 'line-through opacity-50' : ''}`}>
            {task.title}
          </h4>
        </div>

        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button 
            onClick={() => onEdit(task)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Edit Task"
          >
            <Edit3 size={13} />
          </button>
          <button 
            onClick={() => deleteTask(task._id)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-accent-rose hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Delete Task"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      {/* Middle Section: Custom Duration Timelines & Streaks */}
      <div className="mt-3 space-y-3">
        {/* Custom duration fields */}
        {task.isCustomDuration && task.startDate && task.endDate && (
          <div className="space-y-1.5 p-2.5 rounded-xl bg-slate-100/50 dark:bg-slate-800/30 border border-slate-200/50 dark:border-darkBorder/30">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-semibold">
              <Hourglass size={12} className={durationStatus?.overdue ? 'text-accent-rose' : 'text-primary-500'} />
              <span className={durationStatus?.overdue ? 'text-accent-rose font-bold animate-pulse' : 'text-slate-700 dark:text-slate-300'}>
                {durationStatus?.text}
              </span>
            </div>
            <div className="flex items-center justify-between text-[9px] text-slate-400 dark:text-slate-500 font-bold border-t border-slate-200/40 dark:border-darkBorder/10 pt-1.5">
              <span>Start: {dayjs(task.startDate).format('YYYY-MM-DD')}</span>
              <span>End: {dayjs(task.endDate).format('YYYY-MM-DD')}</span>
            </div>
          </div>
        )}

        {/* Streaks logic for repeatable tasks */}
        {task.type === 'repeatable' && (
          <div className="flex items-center gap-4 text-xs font-semibold py-1 border-t border-slate-200 dark:border-darkBorder/20">
            <div className="flex items-center gap-1 text-amber-600 dark:text-amber-500">
              <Flame size={14} className="fill-current animate-pulse" />
              <span>Streak: {task.streak}</span>
            </div>
            <div className="text-slate-500 dark:text-slate-400">
              <span>Best: {task.longestStreak}</span>
            </div>
            <div className="text-slate-400 dark:text-slate-500 text-[10px] ml-auto">
              Rate: {task.completionRate || 0}%
            </div>
          </div>
        )}
      </div>

      {/* Bottom Section: One-Click Status Updates */}
      <div className="mt-4 pt-3 border-t border-slate-200 dark:border-darkBorder/20 flex flex-col gap-2">
        <span className="text-[9px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider">Status Actions</span>
        <div className="grid grid-cols-3 gap-1.5">
          <button
            onClick={() => handleStatusChange('not_started')}
            className={`flex items-center justify-center gap-1.5 py-1.5 text-[10px] font-bold rounded-lg border transition-all duration-200
              ${task.status === 'not_started' 
                ? 'bg-slate-300/40 dark:bg-slate-700/40 border-slate-400 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-extrabold shadow-sm' 
                : 'bg-slate-100/30 dark:bg-darkBg/30 border-lightBorder dark:border-darkBorder text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/40 hover:text-slate-600 dark:hover:text-slate-300'}
            `}
          >
            <span>⭕</span>
            <span>Started</span>
          </button>
          
          <button
            onClick={() => handleStatusChange('partially_done')}
            className={`flex items-center justify-center gap-1.5 py-1.5 text-[10px] font-bold rounded-lg border transition-all duration-200
              ${task.status === 'partially_done' 
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-600 dark:text-amber-400 font-extrabold shadow-sm' 
                : 'bg-slate-100/30 dark:bg-darkBg/30 border-lightBorder dark:border-darkBorder text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/40 hover:text-amber-600 dark:hover:text-amber-500/70'}
            `}
          >
            <span>🟡</span>
            <span>Partial</span>
          </button>

          <button
            onClick={() => handleStatusChange('completed')}
            className={`flex items-center justify-center gap-1.5 py-1.5 text-[10px] font-bold rounded-lg border transition-all duration-200
              ${task.status === 'completed' 
                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-600 dark:text-emerald-400 font-extrabold shadow-sm' 
                : 'bg-slate-100/30 dark:bg-darkBg/30 border-lightBorder dark:border-darkBorder text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/40 hover:text-emerald-600 dark:hover:text-emerald-500/70'}
            `}
          >
            <span>✅</span>
            <span>Done</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
