import React, { useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Flame, CheckCircle, Percent, AlertCircle, Calendar } from 'lucide-react';
import dayjs from 'dayjs';

const Habits = ({ viewMode = 'daily' }) => {
  const { tasks, habitHistory, fetchHabitHistory } = useApp();

  // Filter repeatable tasks (habits) based on category
  const habits = tasks.filter(t => t.type === 'repeatable' && t.category === viewMode);

  // Fetch full habit history so we can render inline mini-heatmaps
  useEffect(() => {
    fetchHabitHistory();
  }, []);

  const getStatusLabel = (status) => {
    switch (status) {
      case 'completed':
        return 'Completed ✅';
      case 'partially_done':
        return 'Partially Done 🟡';
      default:
        return 'Not Started ⭕';
    }
  };

  const getStatusPercentage = (status) => {
    switch (status) {
      case 'completed':
        return 100;
      case 'partially_done':
        return 50;
      default:
        return 0;
    }
  };

  const getHeaderInfo = () => {
    switch (viewMode) {
      case 'weekly':
        return {
          title: 'Weekly Habits',
          desc: 'Track weekly audits, macro habits, and weekly achievements.'
        };
      case 'monthly':
        return {
          title: 'Monthly Habits',
          desc: 'Track long-term monthly routines, book reads, or financial budgeting.'
        };
      default:
        return {
          title: 'Daily Habits',
          desc: 'Track daily routines, streaks, and day-to-day completion history.'
        };
    }
  };

  const headerInfo = getHeaderInfo();

  // Render a mini inline heatmap for a specific habit
  const renderMiniHeatmap = (habit) => {
    const history = habitHistory.filter(h => h.taskId === habit._id);
    const cells = [];

    if (viewMode === 'daily') {
      // Last 21 days for compact display
      for (let i = 20; i >= 0; i--) {
        const dateStr = dayjs().subtract(i, 'day').format('YYYY-MM-DD');
        const entry = history.find(h => h.date === dateStr);
        const status = entry ? entry.status : (habit.status === 'completed' && i === 0 ? 'completed' : 'gray');
        
        cells.push({
          dateStr,
          status: status === 'completed' ? 'green' : status === 'partially_done' ? 'yellow' : 'gray',
          label: dayjs(dateStr).format('MMM DD')
        });
      }
    } else if (viewMode === 'weekly') {
      // Last 12 weeks for weekly habits
      for (let i = 11; i >= 0; i--) {
        const sundayStr = dayjs().subtract(i, 'week').endOf('week').format('YYYY-MM-DD');
        const entry = history.find(h => h.date === sundayStr);
        const status = entry ? entry.status : 'gray';

        cells.push({
          dateStr: sundayStr,
          status: status === 'completed' ? 'green' : status === 'partially_done' ? 'yellow' : 'gray',
          label: `Wk ${dayjs(sundayStr).format('w')}`
        });
      }
    } else {
      // Last 12 months for monthly habits
      for (let i = 11; i >= 0; i--) {
        const lastDayOfMonthStr = dayjs().subtract(i, 'month').endOf('month').format('YYYY-MM-DD');
        const entry = history.find(h => h.date === lastDayOfMonthStr);
        const status = entry ? entry.status : 'gray';

        cells.push({
          dateStr: lastDayOfMonthStr,
          status: status === 'completed' ? 'green' : status === 'partially_done' ? 'yellow' : 'gray',
          label: dayjs(lastDayOfMonthStr).format('MMM YY')
        });
      }
    }

    const durationLabel = 
      viewMode === 'daily' 
        ? 'Last 21 Days Consistency' 
        : viewMode === 'weekly' 
          ? 'Last 12 Weeks Consistency' 
          : 'Last 12 Months Consistency';

    return (
      <div className="space-y-1.5 pt-2">
        <span className="text-[9px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider block">
          {durationLabel}
        </span>
        <div className="flex gap-[4px] overflow-x-auto py-1">
          {cells.map((cell, idx) => {
            const bgColors = {
              green: 'bg-emerald-500 hover:bg-emerald-400 shadow-glowEmerald',
              yellow: 'bg-amber-400 hover:bg-amber-300',
              gray: 'bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700'
            };
            return (
              <div
                key={idx}
                className={`w-3.5 h-3.5 rounded-sm flex-shrink-0 transition-all duration-100 ${bgColors[cell.status]}`}
                title={`${cell.label}: ${cell.status === 'green' ? 'Completed' : cell.status === 'yellow' ? 'Partially Done' : 'Missed'}`}
              />
            );
          })}
        </div>
      </div>
    );
  };

  const getStreakUnit = () => {
    if (viewMode === 'daily') return 'days';
    if (viewMode === 'weekly') return 'weeks';
    return 'months';
  };

  const getStreakUnitAbbr = () => {
    if (viewMode === 'daily') return 'd';
    if (viewMode === 'weekly') return 'w';
    return 'm';
  };

  const getBadgeClass = () => {
    if (viewMode === 'daily') return 'badge-daily';
    if (viewMode === 'weekly') return 'badge-weekly';
    return 'badge-monthly';
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h2 className="text-3xl font-extrabold bg-gradient-to-r from-slate-900 to-slate-650 dark:from-white dark:to-slate-400 bg-clip-text text-transparent">
          {headerInfo.title}
        </h2>
        <p className="text-slate-450 dark:text-slate-400 text-sm mt-1">
          {headerInfo.desc}
        </p>
      </div>

      {habits.length === 0 ? (
        <div className="glass-panel rounded-2xl p-12 text-center text-slate-400">
          <Flame size={48} className="mx-auto text-slate-500 mb-4 animate-pulse" />
          <p className="font-semibold text-lg text-slate-800 dark:text-slate-350">No repeatable habits found</p>
          <p className="text-xs text-slate-500 mt-1">
            Create a task, set its category to **{viewMode}**, and choose **Repeatable (Habit)** to see it here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {habits.map((habit) => {
            const successRate = habit.completionRate || 0;
            const progressPercentage = getStatusPercentage(habit.status);
            
            return (
              <div 
                key={habit._id} 
                className="glass-panel p-6 rounded-2xl border-t-4 border-t-accent-purple relative overflow-hidden space-y-4 hover:-translate-y-1 transition-transform duration-200"
              >
                {/* Header */}
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <span className={`${getBadgeClass()} capitalize`}>
                      {viewMode} Habit
                    </span>
                    <h3 className="text-lg font-bold mt-2 text-slate-800 dark:text-slate-100">{habit.title}</h3>
                  </div>

                  <div className="flex items-center gap-1 bg-amber-500/10 text-amber-600 dark:text-amber-500 px-3 py-1 rounded-xl border border-amber-500/20 font-bold text-xs">
                    <Flame size={14} className="fill-current animate-pulse" />
                    <span>Streak: {habit.streak} {getStreakUnit()}</span>
                  </div>
                </div>

                {/* Grid stats */}
                <div className="grid grid-cols-3 gap-4 pt-1">
                  <div className="bg-slate-50 dark:bg-darkBg/60 border border-slate-205 dark:border-darkBorder/40 p-3 rounded-xl flex flex-col justify-between">
                    <span className="text-slate-400 text-[9px] uppercase font-bold">
                      Longest
                    </span>
                    <span className="text-slate-800 dark:text-slate-200 font-extrabold text-lg mt-1">
                      {habit.longestStreak}{getStreakUnitAbbr()}
                    </span>
                  </div>
                  
                  <div className="bg-slate-50 dark:bg-darkBg/60 border border-slate-205 dark:border-darkBorder/40 p-3 rounded-xl flex flex-col justify-between">
                    <span className="text-slate-400 text-[9px] uppercase font-bold">
                      Total Done
                    </span>
                    <span className="text-slate-800 dark:text-slate-200 font-extrabold text-lg mt-1">{habit.totalCompletions}</span>
                  </div>

                  <div className="bg-slate-50 dark:bg-darkBg/60 border border-slate-205 dark:border-darkBorder/40 p-3 rounded-xl flex flex-col justify-between">
                    <span className="text-slate-400 text-[9px] uppercase font-bold">
                      Success
                    </span>
                    <span className="text-slate-800 dark:text-slate-200 font-extrabold text-lg mt-1">{successRate}%</span>
                  </div>
                </div>

                {/* Status meter info */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 font-medium">
                    <span>Current Status: {getStatusLabel(habit.status)}</span>
                    <span className={`${habit.status === 'completed' ? 'text-emerald-500 font-bold' : 'text-slate-405'}`}>
                      {progressPercentage}%
                    </span>
                  </div>
                  
                  <div className="w-full h-2.5 bg-slate-100 dark:bg-darkBg rounded-full overflow-hidden border border-slate-200 dark:border-darkBorder/40">
                    <div 
                      className={`h-full rounded-full transition-all duration-300 ${habit.status === 'completed' ? 'bg-emerald-500' : habit.status === 'partially_done' ? 'bg-amber-400' : 'bg-slate-400 dark:bg-slate-700'}`}
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>
                </div>

                {/* Mini Heatmap Grid */}
                {renderMiniHeatmap(habit)}

                {/* Footer details */}
                <div className="flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500 pt-2 border-t border-slate-205 dark:border-darkBorder/20">
                  <div className="flex items-center gap-1">
                    <AlertCircle size={10} className="text-slate-400" />
                    <span>Missed Cycles: {habit.missedDays}</span>
                  </div>
                  <span>Last Logged: {habit.lastCompletedAt ? new Date(habit.lastCompletedAt).toLocaleDateString() : 'Never'}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Habits;
