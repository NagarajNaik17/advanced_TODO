import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ChevronLeft, ChevronRight, Plus, X, CheckSquare, Target, Flame, Award, Hourglass } from 'lucide-react';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';

dayjs.extend(isoWeek);

const CalendarPage = () => {
  const { tasks, goals, createTask, updateTaskStatus } = useApp();
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [selectedDate, setSelectedDate] = useState(dayjs());
  
  // Quick task creation inside calendar
  const [quickTitle, setQuickTitle] = useState('');
  const [quickCategory, setQuickCategory] = useState('daily');
  const [quickType, setQuickType] = useState('non-repeatable');
  const [isCustomDuration, setIsCustomDuration] = useState(false);

  // Generate calendar grid (7 columns starting on Monday)
  const startOfMonth = currentDate.startOf('month');
  const endOfMonth = currentDate.endOf('month');
  const startOfWeek = startOfMonth.startOf('isoWeek'); // Monday
  const endOfWeek = endOfMonth.endOf('isoWeek'); // Sunday

  const days = [];
  let day = startOfWeek;
  while (day.isBefore(endOfWeek) || day.isSame(endOfWeek, 'day')) {
    days.push(day);
    day = day.add(1, 'day');
  }

  // Get active items on a specific date (YYYY-MM-DD)
  const getItemsForDate = (dateStr) => {
    const d = dayjs(dateStr);
    
    // 1. Get daily, weekly, monthly, and custom tasks active on this day
    const activeTasks = tasks.filter(task => {
      if (task.archived) return false;
      
      if (task.type === 'repeatable') {
        return true;
      }
      
      const createdDate = dayjs(task.createdAt).startOf('day');
      
      // If task has custom duration dates
      if (task.isCustomDuration && task.startDate && task.endDate) {
        const start = dayjs(task.startDate).startOf('day');
        const end = dayjs(task.endDate).endOf('day');
        return d.isAfter(start.subtract(1, 'day')) && d.isBefore(end.add(1, 'day'));
      }
      
      return createdDate.isSame(d, 'day');
    });

    // 2. Get goals due on this date
    const activeGoals = goals.filter(goal => {
      if (!goal.endDate) return false;
      return dayjs(goal.endDate).isSame(d, 'day');
    });

    return { activeTasks, activeGoals };
  };

  const handlePrevMonth = () => setCurrentDate(currentDate.subtract(1, 'month'));
  const handleNextMonth = () => setCurrentDate(currentDate.add(1, 'month'));

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!quickTitle.trim()) return;

    const formattedDate = selectedDate.format('YYYY-MM-DD');
    await createTask({
      title: quickTitle,
      type: quickType,
      category: isCustomDuration ? 'daily' : quickCategory,
      isCustomDuration,
      startDate: isCustomDuration ? new Date(formattedDate) : undefined,
      endDate: isCustomDuration ? dayjs(formattedDate).add(7, 'day').toDate() : undefined
    });

    setQuickTitle('');
  };

  const getDotColorsForDate = (dateStr) => {
    const { activeTasks, activeGoals } = getItemsForDate(dateStr);
    const categories = new Set();
    activeTasks.forEach(t => {
      if (t.isCustomDuration) categories.add('custom');
      else categories.add(t.category);
    });
    if (activeGoals.length > 0) categories.add('yearly');

    const dots = [];
    if (categories.has('daily')) dots.push('bg-emerald-500');
    if (categories.has('weekly')) dots.push('bg-blue-500');
    if (categories.has('monthly')) dots.push('bg-purple-500');
    if (categories.has('custom')) dots.push('bg-pink-500');
    if (categories.has('yearly')) dots.push('bg-orange-500');
    return dots;
  };

  // Resolve selected date items
  const selectedDateStr = selectedDate.format('YYYY-MM-DD');
  const { activeTasks: selectedTasks, activeGoals: selectedGoals } = getItemsForDate(selectedDateStr);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header & Legend */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-400 bg-clip-text text-transparent">
            Task Calendar
          </h2>
          <p className="text-slate-450 dark:text-slate-400 text-sm mt-1">
            Display routines, goals, and projects in a compact layout.
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 text-[10px] font-bold bg-lightCard dark:bg-darkCard/40 border border-lightBorder dark:border-darkBorder/30 px-3 py-1.5 rounded-xl">
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-slate-450">Daily</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            <span className="text-slate-455">Weekly</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-purple-500" />
            <span className="text-slate-455">Monthly</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-pink-500" />
            <span className="text-slate-455">Custom</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-orange-500" />
            <span className="text-slate-455">Yearly Goal</span>
          </div>
        </div>
      </div>

      {/* Main Splits Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        
        {/* Left Side: Compact Calendar Grid */}
        <div className="lg:col-span-3 glass-panel p-6 rounded-2xl space-y-4">
          {/* Calendar Toolbar */}
          <div className="flex items-center justify-between">
            <h3 className="text-md font-extrabold text-slate-800 dark:text-slate-100 uppercase tracking-wider">
              {currentDate.format('MMMM YYYY')}
            </h3>

            <div className="flex items-center gap-1.5">
              <button 
                onClick={handlePrevMonth}
                className="p-1.5 rounded-xl bg-slate-50 dark:bg-darkBg border border-lightBorder dark:border-darkBorder text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              >
                <ChevronLeft size={14} />
              </button>
              <button 
                onClick={() => {
                  setCurrentDate(dayjs());
                  setSelectedDate(dayjs());
                }}
                className="px-3 py-1 text-[10px] font-bold rounded-xl bg-slate-50 dark:bg-darkBg border border-lightBorder dark:border-darkBorder text-slate-500 dark:text-slate-350 hover:text-slate-600 dark:hover:text-slate-200"
              >
                Today
              </button>
              <button 
                onClick={handleNextMonth}
                className="p-1.5 rounded-xl bg-slate-50 dark:bg-darkBg border border-lightBorder dark:border-darkBorder text-slate-400 hover:text-slate-600 dark:hover:text-slate-205 transition-colors"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>

          {/* Calendar Day Header */}
          <div className="grid grid-cols-7 gap-2 text-center text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider border-b border-lightBorder dark:border-darkBorder/40 pb-2">
            <span>Mo</span>
            <span>Tu</span>
            <span>We</span>
            <span>Th</span>
            <span>Fr</span>
            <span>Sa</span>
            <span>Su</span>
          </div>

          {/* Calendar Month Cells */}
          <div className="grid grid-cols-7 gap-y-3.5 gap-x-2">
            {days.map((d, index) => {
              const isToday = d.isSame(dayjs(), 'day');
              const isSelected = d.isSame(selectedDate, 'day');
              const isCurrentMonth = d.month() === currentDate.month();
              const dateStr = d.format('YYYY-MM-DD');
              const cellDots = getDotColorsForDate(dateStr);

              return (
                <div key={index} className="flex flex-col items-center">
                  <button
                    onClick={() => setSelectedDate(d)}
                    className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex flex-col items-center justify-center relative transition-all duration-150
                      ${isSelected 
                        ? 'bg-primary-600 text-white font-extrabold shadow-sm' 
                        : isToday 
                          ? 'border-2 border-primary-500 text-primary-650 dark:text-primary-400 font-bold' 
                          : isCurrentMonth 
                            ? 'text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60' 
                            : 'text-slate-300 dark:text-slate-700 opacity-25 cursor-default'}
                    `}
                    disabled={!isCurrentMonth}
                  >
                    <span className="text-xs">{d.date()}</span>
                  </button>
                  
                  {/* Category dots below cell */}
                  <div className="flex gap-[3px] mt-1 justify-center h-1.5">
                    {isCurrentMonth && cellDots.map((color, i) => (
                      <span key={i} className={`w-1 h-1 rounded-full ${color}`} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: selected Date Agenda Checklist */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl flex flex-col justify-between min-h-[360px]">
          <div>
            <div className="pb-3 border-b border-lightBorder dark:border-darkBorder/40">
              <h3 className="text-sm font-extrabold text-slate-800 dark:text-slate-200">
                📅 Agenda: {selectedDate.format('D MMMM YYYY')}
              </h3>
              <p className="text-[10px] text-slate-450 mt-0.5">Tasks and goals due on this day</p>
            </div>

            {/* Agenda Items list */}
            <div className="mt-4 space-y-3 max-h-[220px] overflow-y-auto pr-1">
              {selectedTasks.length === 0 && selectedGoals.length === 0 ? (
                <p className="text-xs text-slate-500 py-10 text-center font-semibold">No schedules active on this date.</p>
              ) : (
                <>
                  {/* Tasks */}
                  {selectedTasks.map(task => {
                    const statusEmoji = task.status === 'completed' ? '✅' : task.status === 'partially_done' ? '🟡' : '⭕';
                    const categoryColors = {
                      daily: 'text-emerald-500',
                      weekly: 'text-blue-500',
                      monthly: 'text-purple-500'
                    };
                    const badgeClass = task.isCustomDuration 
                      ? 'bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20' 
                      : `${categoryColors[task.category] || 'text-slate-400'} bg-slate-100 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800/80`;

                    return (
                      <div 
                        key={task._id}
                        className={`p-3 rounded-xl border flex items-center justify-between gap-3 text-xs font-bold
                          ${task.status === 'completed' ? 'opacity-70 bg-slate-50/50 dark:bg-darkBg/20 border-slate-150 dark:border-darkBorder/30' : 'bg-slate-50 dark:bg-darkBg/50 border-slate-200 dark:border-darkBorder/40'}
                        `}
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <span className={`text-[8px] uppercase tracking-wider border px-1.5 py-0.5 rounded-full ${badgeClass}`}>
                              {task.isCustomDuration ? 'custom' : task.category}
                            </span>
                            {task.type === 'repeatable' && (
                              <span className="text-[8px] uppercase tracking-wider text-amber-500 bg-amber-500/5 px-1 py-0.5 rounded">streak: {task.streak}d</span>
                            )}
                          </div>
                          <span className={`block mt-1.5 truncate text-slate-800 dark:text-slate-200 ${task.status === 'completed' ? 'line-through text-slate-400 dark:text-slate-500' : ''}`}>
                            {task.title}
                          </span>
                        </div>

                        {/* Status update switcher */}
                        <div className="flex gap-1.5 flex-shrink-0">
                          <button
                            onClick={() => updateTaskStatus(task._id, 'not_started')}
                            className={`w-6 h-6 rounded flex items-center justify-center text-xs border ${task.status === 'not_started' ? 'bg-slate-200 dark:bg-slate-800 border-slate-400 dark:border-slate-600' : 'border-slate-200 dark:border-darkBorder/40'}`}
                            title="Not Started"
                          >
                            ⭕
                          </button>
                          <button
                            onClick={() => updateTaskStatus(task._id, 'partially_done')}
                            className={`w-6 h-6 rounded flex items-center justify-center text-xs border ${task.status === 'partially_done' ? 'bg-amber-100 dark:bg-amber-550/20 border-amber-400' : 'border-slate-200 dark:border-darkBorder/40'}`}
                            title="Partially Done"
                          >
                            🟡
                          </button>
                          <button
                            onClick={() => updateTaskStatus(task._id, 'completed')}
                            className={`w-6 h-6 rounded flex items-center justify-center text-xs border ${task.status === 'completed' ? 'bg-emerald-100 dark:bg-emerald-550/20 border-emerald-400' : 'border-slate-200 dark:border-darkBorder/40'}`}
                            title="Completed"
                          >
                            ✅
                          </button>
                        </div>
                      </div>
                    );
                  })}

                  {/* Goals */}
                  {selectedGoals.map(goal => (
                    <div 
                      key={goal._id}
                      className="p-3 bg-orange-500/5 dark:bg-orange-950/10 border border-orange-500/10 rounded-xl flex items-center justify-between gap-3 text-xs font-bold"
                    >
                      <div className="min-w-0">
                        <span className="text-[8px] uppercase tracking-wider text-orange-600 dark:text-orange-400 bg-orange-500/15 border border-orange-500/10 px-1.5 py-0.5 rounded-full">
                          yearly goal
                        </span>
                        <span className="block mt-1.5 truncate text-slate-800 dark:text-slate-200">
                          🏆 {goal.title}
                        </span>
                      </div>
                      <span className="text-[10px] text-orange-600 dark:text-orange-450">
                        {goal.completed ? '🏆 Done' : 'Pending'}
                      </span>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>

          {/* Quick Create Task widget inside calendar */}
          <div className="mt-4 pt-3 border-t border-lightBorder dark:border-darkBorder/40">
            <form onSubmit={handleCreateTask} className="space-y-2.5">
              <input
                type="text"
                required
                placeholder="Quick add task for this day..."
                value={quickTitle}
                onChange={(e) => setQuickTitle(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-darkBg border border-lightBorder dark:border-darkBorder text-slate-800 dark:text-slate-200 focus:outline-none focus:border-primary-500 transition-colors"
              />
              <div className="flex gap-2 justify-between items-center">
                <div className="flex gap-1.5">
                  <select
                    value={quickCategory}
                    onChange={(e) => setQuickCategory(e.target.value)}
                    className="px-2 py-1 text-[9px] font-bold rounded-lg bg-slate-50 dark:bg-darkBg border border-lightBorder dark:border-darkBorder text-slate-650 dark:text-slate-350 focus:outline-none"
                    disabled={isCustomDuration}
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                  <select
                    value={quickType}
                    onChange={(e) => setQuickType(e.target.value)}
                    className="px-2 py-1 text-[9px] font-bold rounded-lg bg-slate-50 dark:bg-darkBg border border-lightBorder dark:border-darkBorder text-slate-650 dark:text-slate-350 focus:outline-none"
                  >
                    <option value="non-repeatable">One-time</option>
                    <option value="repeatable">Repeatable</option>
                  </select>
                </div>

                <div className="flex items-center gap-1.5">
                  <input
                    type="checkbox"
                    id="isCustomDuration"
                    checked={isCustomDuration}
                    onChange={(e) => setIsCustomDuration(e.target.checked)}
                    className="rounded bg-slate-50 dark:bg-darkBg border-lightBorder dark:border-darkBorder text-primary-600 focus:ring-primary-500 h-3.5 w-3.5"
                  />
                  <label htmlFor="isCustomDuration" className="text-[9px] font-bold text-slate-500 uppercase cursor-pointer select-none">
                    Custom
                  </label>
                </div>

                <button
                  type="submit"
                  className="px-3.5 py-1 rounded-lg bg-primary-600 hover:bg-primary-500 text-white font-bold text-[10px] transition-colors flex items-center gap-0.5"
                >
                  <Plus size={10} /> Add
                </button>
              </div>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CalendarPage;
