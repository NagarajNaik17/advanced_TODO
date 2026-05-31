import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Plus, Target, Trash2, Edit3, X, Check, Award, Hourglass, DollarSign } from 'lucide-react';
import dayjs from 'dayjs';

const Goals = () => {
  const { goals, createGoal, updateGoal, deleteGoal } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);

  // Form states
  const [title, setTitle] = useState('');
  const [type, setType] = useState('personal'); // purchase, savings, personal
  const [targetValue, setTargetValue] = useState(1);
  const [currentValue, setCurrentValue] = useState(0);
  const [unit, setUnit] = useState('goals');
  const [endDate, setEndDate] = useState(dayjs().endOf('year').format('YYYY-MM-DD'));

  // Edit / Add openers
  const handleOpenCreate = () => {
    setEditingGoal(null);
    setTitle('');
    setType('personal');
    setTargetValue(1);
    setCurrentValue(0);
    setUnit('goals');
    setEndDate(dayjs().endOf('year').format('YYYY-MM-DD'));
    setShowModal(true);
  };

  const handleOpenEdit = (goal) => {
    setEditingGoal(goal);
    setTitle(goal.title);
    setType(goal.type || 'personal');
    setTargetValue(goal.targetValue !== undefined ? goal.targetValue : 1);
    setCurrentValue(goal.currentValue !== undefined ? goal.currentValue : 0);
    setUnit(goal.unit || 'goals');
    if (goal.endDate) setEndDate(dayjs(goal.endDate).format('YYYY-MM-DD'));
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const goalData = {
      title,
      type,
      targetValue: Number(targetValue),
      currentValue: Number(currentValue),
      unit,
      endDate: new Date(endDate)
    };

    if (editingGoal) {
      updateGoal(editingGoal._id, goalData);
    } else {
      createGoal(goalData);
    }
    setShowModal(false);
  };

  const handleToggleCompleted = (goal) => {
    updateGoal(goal._id, { completed: !goal.completed });
  };

  // Helper to calculate progress percentage
  const getGoalProgress = (g) => {
    if (!g.targetValue) return 0;
    return Math.min(100, Math.round((g.currentValue / g.targetValue) * 100));
  };

  // Helper to format values (currency prefix vs unit suffix)
  const formatValue = (val, unitStr) => {
    if (unitStr === '₹') return `₹${val.toLocaleString()}`;
    if (unitStr === '$') return `$${val.toLocaleString()}`;
    return `${val} ${unitStr}`;
  };

  const getGoalTypeLabel = (goalType) => {
    switch (goalType) {
      case 'purchase': return '🛍️ Purchase Goal';
      case 'savings': return '💰 Savings Goal';
      case 'personal': return '🎯 Personal Goal';
      default: return '🎯 Goal';
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 bg-clip-text text-transparent">
            Yearly Goals
          </h2>
          <p className="text-slate-450 dark:text-slate-400 text-sm mt-1">
            Map out your long-term purchase, savings, and personal milestones.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary-600 to-accent-purple hover:from-primary-500 hover:to-accent-purple/90 text-white font-semibold shadow-glow active:scale-95 transition-all duration-200"
        >
          <Plus size={18} />
          Add Yearly Goal
        </button>
      </div>

      {/* Goal Listing */}
      {goals.length === 0 ? (
        <div className="glass-panel rounded-2xl p-12 text-center text-slate-400">
          <Target size={48} className="mx-auto text-slate-500 mb-4 animate-pulse" />
          <p className="font-semibold text-lg text-slate-800 dark:text-slate-350">No yearly goals set</p>
          <p className="text-xs text-slate-500 mt-1">Establish high-level goals and track your progress.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {goals.map((goal) => {
            const isCompleted = goal.completed;
            const progress = getGoalProgress(goal);
            const remainingDays = goal.endDate ? dayjs(goal.endDate).diff(dayjs(), 'day') : null;

            return (
              <div 
                key={goal._id} 
                className={`glass-panel p-6 rounded-2xl border-l-4 relative overflow-hidden transition-all duration-200
                  ${isCompleted ? 'border-l-accent-emerald bg-emerald-50/10 dark:bg-emerald-950/5 opacity-85' : 'border-l-orange-500 hover:border-orange-600'}
                `}
              >
                {/* Decorative background circle */}
                <div className="absolute -right-8 -top-8 w-20 h-20 rounded-full bg-orange-500/5 blur-xl pointer-events-none" />

                {/* Top Section */}
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[9px] uppercase font-black tracking-widest text-orange-600 dark:text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded-full border border-orange-500/10">
                        {getGoalTypeLabel(goal.type)}
                      </span>
                      {isCompleted && (
                        <span className="text-[9px] uppercase font-black tracking-widest text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/10">
                          🏆 Completed
                        </span>
                      )}
                    </div>
                    <h3 className={`text-lg font-bold mt-2 truncate ${isCompleted ? 'line-through text-slate-500' : 'text-slate-800 dark:text-slate-100'}`}>
                      {goal.title}
                    </h3>
                  </div>
                  
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button 
                      onClick={() => handleOpenEdit(goal)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      title="Edit Goal"
                    >
                      <Edit3 size={14} />
                    </button>
                    <button 
                      onClick={() => deleteGoal(goal._id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-accent-rose hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      title="Delete Goal"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {/* Numerical Progress Bar */}
                <div className="mt-4">
                  <div className="flex justify-between items-center text-xs font-semibold mb-1">
                    <span className="text-slate-650 dark:text-slate-350">
                      {formatValue(goal.currentValue, goal.unit)} / {formatValue(goal.targetValue, goal.unit)}
                    </span>
                    <span className="text-orange-600 dark:text-orange-400 font-extrabold">{progress}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-200 dark:border-darkBorder/40">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ease-out 
                        ${isCompleted ? 'bg-emerald-500' : 'bg-orange-500'}
                      `}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                {/* Days remaining and deadline */}
                {goal.endDate && (
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-500 dark:text-slate-400 mt-4 border-t border-slate-100 dark:border-darkBorder/25 pt-3">
                    <Hourglass size={10} className="text-orange-500" />
                    <span>
                      {remainingDays !== null ? (
                        remainingDays < 0 ? `Overdue by ${Math.abs(remainingDays)} days` : `${remainingDays} days remaining`
                      ) : ''}
                    </span>
                    <span className="ml-auto">Deadline: {dayjs(goal.endDate).format('MMM DD, YYYY')}</span>
                  </div>
                )}

                {/* Quick toggle completed */}
                <div className="mt-4 flex items-center justify-end">
                  <button
                    onClick={() => handleToggleCompleted(goal)}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all duration-200
                      ${isCompleted 
                        ? 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-darkBorder text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700' 
                        : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20'}
                    `}
                  >
                    <Check size={12} />
                    {isCompleted ? 'Mark Pending' : 'Mark Completed'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Goal creation/edit modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md glass-panel-glow p-6 rounded-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-lightBorder dark:border-darkBorder/40 pb-3">
              <h3 className="text-lg font-bold text-slate-850 dark:text-slate-100">
                {editingGoal ? 'Edit Yearly Goal' : 'Add Yearly Goal'}
              </h3>
              <button 
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 dark:text-slate-550 uppercase mb-1">Goal title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Buy Gaming Laptop"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-darkBg border border-lightBorder dark:border-darkBorder focus:outline-none focus:border-primary-500 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600"
                />
              </div>

              {/* Goal Type */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 dark:text-slate-550 uppercase mb-1">Goal Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full px-3 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-darkBg border border-lightBorder dark:border-darkBorder text-slate-805 dark:text-slate-200 focus:outline-none focus:border-primary-500"
                >
                  <option value="personal">🎯 Yearly Personal Goal</option>
                  <option value="purchase">🛍️ Purchase Goal</option>
                  <option value="savings">💰 Savings Goal</option>
                </select>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {/* Target Value */}
                <div className="col-span-1">
                  <label className="block text-xs font-semibold text-slate-400 dark:text-slate-555 uppercase mb-1">Target</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={targetValue}
                    onChange={(e) => setTargetValue(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl bg-slate-50 dark:bg-darkBg border border-lightBorder dark:border-darkBorder text-slate-800 dark:text-slate-100 focus:outline-none"
                  />
                </div>

                {/* Current Value */}
                <div className="col-span-1">
                  <label className="block text-xs font-semibold text-slate-400 dark:text-slate-555 uppercase mb-1">Current</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={currentValue}
                    onChange={(e) => setCurrentValue(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl bg-slate-50 dark:bg-darkBg border border-lightBorder dark:border-darkBorder text-slate-800 dark:text-slate-100 focus:outline-none"
                  />
                </div>

                {/* Unit of Measure */}
                <div className="col-span-1">
                  <label className="block text-xs font-semibold text-slate-400 dark:text-slate-555 uppercase mb-1">Unit</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. ₹, books, km"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl bg-slate-50 dark:bg-darkBg border border-lightBorder dark:border-darkBorder text-slate-800 dark:text-slate-100 focus:outline-none"
                  />
                </div>
              </div>

              {/* End Date */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 dark:text-slate-550 uppercase mb-1">Deadline Date</label>
                <input
                  type="date"
                  required
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-4 py-2 text-sm rounded-xl bg-slate-50 dark:bg-darkBg border border-lightBorder dark:border-darkBorder focus:outline-none focus:border-primary-500 text-slate-800 dark:text-slate-100"
                />
              </div>

              {/* Form Buttons */}
              <div className="flex justify-end gap-3 pt-3 border-t border-lightBorder dark:border-darkBorder/40">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-xs font-bold rounded-lg border border-lightBorder dark:border-darkBorder hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-550 dark:text-slate-400 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold rounded-lg bg-primary-600 hover:bg-primary-500 text-white transition-colors"
                >
                  {editingGoal ? 'Save Changes' : 'Create Goal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Goals;
