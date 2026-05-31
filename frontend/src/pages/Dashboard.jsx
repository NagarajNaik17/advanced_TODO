import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import AnalogClock from '../components/AnalogClock';
import DashboardCard from '../components/DashboardCard';
import { 
  Flame, 
  Quote as QuoteIcon, 
  RefreshCw, 
  CheckSquare, 
  Award,
  ChevronRight,
  Plus,
  Target
} from 'lucide-react';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

const Dashboard = () => {
  const { 
    stats, 
    quote, 
    fetchQuote, 
    achievements, 
    tasks, 
    goals, 
    updateTaskStatus, 
    createTask, 
    setActivePage,
    showToast 
  } = useApp();
  
  // Countdowns state (Week, Month, Year - Day countdown removed)
  const [timers, setTimers] = useState({
    week: '',
    month: '',
    year: ''
  });

  // Favorite quote state
  const [isFavorited, setIsFavorited] = useState(false);

  // Quick Add Form State
  const [quickTitle, setQuickTitle] = useState('');
  const [quickCategory, setQuickCategory] = useState('daily');
  const [quickType, setQuickType] = useState('non-repeatable');

  // Update countdown timers dynamically every second
  useEffect(() => {
    const update = () => {
      const now = dayjs();
      
      const formatDuration = (dur) => {
        const d = Math.floor(dur.asDays());
        const h = String(dur.hours()).padStart(2, '0');
        const m = String(dur.minutes()).padStart(2, '0');
        const s = String(dur.seconds()).padStart(2, '0');
        return d > 0 ? `${d}d ${h}h ${m}m` : `${h}h ${m}m ${s}s`;
      };

      // Week (ISO standard: Monday to Sunday)
      const endOfWeek = now.endOf('isoWeek');
      setTimers(prev => ({ ...prev, week: formatDuration(dayjs.duration(endOfWeek.diff(now))) }));

      // Month
      const endOfMonth = now.endOf('month');
      setTimers(prev => ({ ...prev, month: formatDuration(dayjs.duration(endOfMonth.diff(now))) }));

      // Year
      const endOfYear = now.endOf('year');
      setTimers(prev => ({ ...prev, year: formatDuration(dayjs.duration(endOfYear.diff(now))) }));
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  // Sync quote favorite status
  useEffect(() => {
    if (quote) {
      const favs = JSON.parse(localStorage.getItem('favQuotes') || '[]');
      const exists = favs.some(q => q.text === quote.text);
      setIsFavorited(exists);
    }
  }, [quote]);

  const handleToggleFavorite = () => {
    if (!quote) return;
    const favs = JSON.parse(localStorage.getItem('favQuotes') || '[]');
    const exists = favs.some(q => q.text === quote.text);
    
    let updated;
    if (exists) {
      updated = favs.filter(q => q.text !== quote.text);
      setIsFavorited(false);
      showToast('Quote removed from favorites', 'info');
    } else {
      updated = [...favs, { text: quote.text, author: quote.author }];
      setIsFavorited(true);
      showToast('Quote added to favorites!', 'success');
    }
    localStorage.setItem('favQuotes', JSON.stringify(updated));
  };

  const handleQuickAdd = async (e) => {
    e.preventDefault();
    if (!quickTitle.trim()) return;
    
    const isCustom = quickCategory === 'custom';
    await createTask({
      title: quickTitle,
      category: isCustom ? 'daily' : quickCategory,
      type: quickType,
      isCustomDuration: isCustom,
      startDate: isCustom ? new Date() : undefined,
      endDate: isCustom ? dayjs().add(7, 'day').toDate() : undefined
    });
    setQuickTitle('');
  };

  // Real-time calculated task statistics for instant UI reactivity
  const dailyTasks = tasks.filter(t => t.category === 'daily' && !t.isCustomDuration && !t.archived);
  const dailyCompleted = dailyTasks.filter(t => t.status === 'completed').length;
  const dailyPartial = dailyTasks.filter(t => t.status === 'partially_done').length;
  const dailyPending = dailyTasks.filter(t => t.status === 'not_started').length;
  const dailyTotal = dailyTasks.length;

  const weeklyTasks = tasks.filter(t => t.category === 'weekly' && !t.isCustomDuration && !t.archived);
  const weeklyCompleted = weeklyTasks.filter(t => t.status === 'completed').length;
  const weeklyPending = weeklyTasks.filter(t => t.status !== 'completed').length;
  const weeklyTotal = weeklyTasks.length;

  const monthlyTasks = tasks.filter(t => t.category === 'monthly' && !t.isCustomDuration && !t.archived);
  const monthlyCompleted = monthlyTasks.filter(t => t.status === 'completed').length;
  const monthlyPending = monthlyTasks.filter(t => t.status !== 'completed').length;
  const monthlyTotal = monthlyTasks.length;

  // Active Goals
  const activeGoals = goals.filter(g => !g.completed);
  const activeYearlyGoalsCount = activeGoals.length;

  // Streaks list (repeatable tasks)
  const streaksList = tasks.filter(t => t.type === 'repeatable' && !t.archived);

  // Unlocked achievements list
  const recentAchievements = achievements
    .filter(a => a.unlocked)
    .sort((a, b) => new Date(b.unlockedAt) - new Date(a.unlockedAt))
    .slice(0, 3);

  // Compute yearly goals progress
  const getGoalProgress = (g) => {
    if (!g.targetValue) return 0;
    return Math.min(100, Math.round((g.currentValue / g.targetValue) * 100));
  };
  const yearlyProgress = goals.length > 0 
    ? Math.round(goals.reduce((acc, g) => acc + getGoalProgress(g), 0) / goals.length)
    : 0;

  const formatValue = (val, unitStr) => {
    if (unitStr === '₹') return `₹${val.toLocaleString()}`;
    if (unitStr === '$') return `$${val.toLocaleString()}`;
    return `${val} ${unitStr}`;
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold bg-gradient-to-r from-slate-900 to-slate-605 dark:from-white dark:to-slate-400 bg-clip-text text-transparent">
            Personal Productivity Hub
          </h2>
          <p className="text-slate-450 dark:text-slate-405 text-sm mt-1">
            Welcome back. Monitor your schedules, tasks, and habits in real-time.
          </p>
        </div>
      </div>

      {/* ================= ROW 1: TOP ROW (Analog Clock & Daily Motivation) ================= */}
      <section className="grid grid-cols-1 md:grid-cols-5 gap-6">
        {/* Analog Clock widget (span 2) */}
        <div className="md:col-span-2">
          <AnalogClock />
        </div>

        {/* Daily Motivation Quote panel (span 3) */}
        <div className="md:col-span-3 glass-panel p-5 rounded-2xl flex flex-col justify-between min-h-[220px] hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-darkBorder/40 pb-2">
            <h3 className="text-xs font-extrabold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
              <QuoteIcon size={12} className="text-accent-purple" />
              💡 Today's Motivation
            </h3>
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleToggleFavorite}
                className="p-1.5 rounded-lg text-slate-450 hover:text-slate-600 dark:hover:text-slate-205 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title={isFavorited ? "Remove from Favorites" : "Add to Favorites"}
              >
                <span className={`text-sm ${isFavorited ? 'text-rose-500 font-bold' : ''}`}>
                  {isFavorited ? '❤️' : '🤍'}
                </span>
              </button>
              <button
                onClick={() => fetchQuote(true)}
                className="p-1.5 rounded-lg text-slate-450 hover:text-slate-600 dark:hover:text-slate-205 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Refresh Quote"
              >
                <RefreshCw size={12} />
              </button>
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-center py-4">
            <p className="text-xs md:text-sm italic font-extrabold text-slate-800 dark:text-slate-200 leading-relaxed">
              "{quote?.text || 'Loading motivational seeds...'}"
            </p>
            <p className="text-[10px] text-primary-500 font-bold mt-2 text-right">
              — {quote?.author || 'Unknown'}
            </p>
          </div>
        </div>
      </section>

      {/* ================= ROW 2: COUNTDOWNS ROW (Week End, Month End, Year End) ================= */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-5 rounded-2xl flex flex-col justify-between hover:shadow-md transition-all duration-300">
          <span className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Week End Countdown</span>
          <div className="mt-4">
            <span className="text-2xl font-black text-primary-650 dark:text-primary-400 font-mono">{timers.week}</span>
            <p className="text-[9px] text-slate-450 dark:text-slate-500 mt-1 uppercase font-semibold">Until Sunday 11:59 PM (ISO)</p>
          </div>
        </div>
        <div className="glass-panel p-5 rounded-2xl flex flex-col justify-between hover:shadow-md transition-all duration-300">
          <span className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Month End Countdown</span>
          <div className="mt-4">
            <span className="text-2xl font-black text-accent-purple font-mono">{timers.month}</span>
            <p className="text-[9px] text-slate-450 dark:text-slate-500 mt-1 uppercase font-semibold">Until calendar month end</p>
          </div>
        </div>
        <div className="glass-panel p-5 rounded-2xl flex flex-col justify-between hover:shadow-md transition-all duration-300">
          <span className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Year End Countdown</span>
          <div className="mt-4">
            <span className="text-2xl font-black text-accent-cyan font-mono">{timers.year}</span>
            <p className="text-[9px] text-slate-450 dark:text-slate-500 mt-1 uppercase font-semibold">Until calendar year end</p>
          </div>
        </div>
      </section>

      {/* ================= ROW 3: PROGRESS ROW (Daily, Weekly, Monthly, Yearly Progress) ================= */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard 
          title="Daily Progress" 
          percentage={dailyTotal > 0 ? Math.round((dailyCompleted / dailyTotal) * 100) : 0}
          completed={dailyCompleted}
          remaining={dailyTotal - dailyCompleted}
          color="emerald"
        />
        <DashboardCard 
          title="Weekly Progress" 
          percentage={weeklyTotal > 0 ? Math.round((weeklyCompleted / weeklyTotal) * 100) : 0}
          completed={weeklyCompleted}
          remaining={weeklyTotal - weeklyCompleted}
          color="blue"
        />
        <DashboardCard 
          title="Monthly Progress" 
          percentage={monthlyTotal > 0 ? Math.round((monthlyCompleted / monthlyTotal) * 100) : 0}
          completed={monthlyCompleted}
          remaining={monthlyTotal - monthlyCompleted}
          color="purple"
        />
        <DashboardCard 
          title="Yearly Goals Progress" 
          percentage={yearlyProgress}
          completed={goals.filter(g => g.completed).length}
          remaining={goals.filter(g => !g.completed).length}
          color="orange"
        />
      </section>

      {/* ================= ROW 4: BOTTOM ROW (Task Overview, Goals, Streaks/Achievements, Quick Add) ================= */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Column 1: Task Overview */}
        <div className="glass-panel p-5 rounded-2xl flex flex-col justify-between min-h-[300px] hover:shadow-md transition-all duration-300">
          <div>
            <h3 className="text-xs font-extrabold text-slate-550 uppercase tracking-widest flex items-center gap-1.5 pb-2 border-b border-slate-205 dark:border-darkBorder/40 mb-3">
              <CheckSquare size={12} className="text-primary-500" />
              Task Overview
            </h3>
            
            <div className="space-y-3.5">
              {/* Today's Tasks */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-darkBg/60 border border-slate-100 dark:border-darkBorder/30">
                <div className="flex justify-between items-center text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                  <span>📅 Today's Tasks</span>
                  <span className="text-[10px] text-slate-450">Total: {dailyTotal}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-450 p-1.5 rounded-lg font-bold">
                    <p className="text-base">{dailyCompleted}</p>
                    <p className="text-[8px] uppercase tracking-wider text-slate-450">Done</p>
                  </div>
                  <div className="bg-amber-500/10 text-amber-600 dark:text-amber-450 p-1.5 rounded-lg font-bold">
                    <p className="text-base">{dailyPartial}</p>
                    <p className="text-[8px] uppercase tracking-wider text-slate-450">Partial</p>
                  </div>
                  <div className="bg-slate-200/50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 p-1.5 rounded-lg font-bold">
                    <p className="text-base">{dailyPending}</p>
                    <p className="text-[8px] uppercase tracking-wider text-slate-450">Pending</p>
                  </div>
                </div>
              </div>

              {/* Weekly Tasks */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-darkBg/60 border border-slate-100 dark:border-darkBorder/30 flex justify-between items-center">
                <div>
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-305 block">🔵 Weekly Tasks</span>
                  <span className="text-[9px] text-slate-400">Routine macros</span>
                </div>
                <div className="flex gap-4 text-xs font-bold text-center">
                  <div>
                    <span className="text-blue-500 block text-sm">{weeklyCompleted}</span>
                    <span className="text-[8px] text-slate-450 uppercase tracking-widest">Done</span>
                  </div>
                  <div>
                    <span className="text-slate-400 dark:text-slate-500 block text-sm">{weeklyPending}</span>
                    <span className="text-[8px] text-slate-455 uppercase tracking-widest">Pending</span>
                  </div>
                </div>
              </div>

              {/* Monthly Tasks */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-darkBg/60 border border-slate-100 dark:border-darkBorder/30 flex justify-between items-center">
                <div>
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-305 block">🟣 Monthly Tasks</span>
                  <span className="text-[9px] text-slate-400">Key milestones</span>
                </div>
                <div className="flex gap-4 text-xs font-bold text-center">
                  <div>
                    <span className="text-purple-500 block text-sm">{monthlyCompleted}</span>
                    <span className="text-[8px] text-slate-450 uppercase tracking-widest">Done</span>
                  </div>
                  <div>
                    <span className="text-slate-400 dark:text-slate-500 block text-sm">{monthlyPending}</span>
                    <span className="text-[8px] text-slate-455 uppercase tracking-widest">Pending</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Column 2: Active Yearly Goals list */}
        <div className="glass-panel p-5 rounded-2xl flex flex-col justify-between min-h-[300px] hover:shadow-md transition-all duration-300">
          <div>
            <h3 className="text-xs font-extrabold text-slate-550 uppercase tracking-widest flex items-center gap-1.5 pb-2 border-b border-slate-205 dark:border-darkBorder/40 mb-3">
              <Target size={12} className="text-orange-500" />
              Active Goals
            </h3>
            
            <div className="space-y-3.5 max-h-[220px] overflow-y-auto pr-1">
              {activeGoals.length === 0 ? (
                <p className="text-xs text-slate-500 py-12 text-center">No active goals tracking.</p>
              ) : (
                activeGoals.map(goal => {
                  const progress = getGoalProgress(goal);
                  return (
                    <div key={goal._id} className="space-y-1.5 p-2.5 rounded-xl bg-slate-50 dark:bg-darkBg/60 border border-slate-100 dark:border-darkBorder/30">
                      <div className="flex justify-between items-start gap-1">
                        <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200 truncate">{goal.title}</span>
                        <span className="text-[10px] text-orange-655 dark:text-orange-400 font-black">{progress}%</span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-200 dark:border-darkBorder/45">
                        <div 
                          className="h-full bg-orange-500 rounded-full transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <div className="text-[9px] text-slate-450 flex justify-between font-bold">
                        <span>{formatValue(goal.currentValue, goal.unit)} / {formatValue(goal.targetValue, goal.unit)}</span>
                        {goal.endDate && <span>{dayjs(goal.endDate).format('MMM YY')}</span>}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
          <button 
            onClick={() => setActivePage('goals')}
            className="w-full mt-2 py-1 text-center text-[10px] font-bold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-650 dark:text-slate-300 border border-slate-200 dark:border-darkBorder hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center gap-1 transition-all"
          >
            All Yearly Goals <ChevronRight size={10} />
          </button>
        </div>

        {/* Column 3: Streaks & Achievements */}
        <div className="glass-panel p-5 rounded-2xl flex flex-col justify-between min-h-[300px] hover:shadow-md transition-all duration-300">
          <div className="space-y-4">
            {/* Current Streaks */}
            <div>
              <h4 className="text-[10px] font-black text-slate-450 dark:text-slate-500 uppercase tracking-widest flex items-center gap-1 mb-2">
                <Flame size={12} className="text-amber-500 animate-pulse" />
                Habit Streaks
              </h4>
              <div className="space-y-1.5 max-h-[100px] overflow-y-auto pr-1">
                {streaksList.length === 0 ? (
                  <p className="text-[10px] text-slate-550 text-center py-2">No active habits.</p>
                ) : (
                  streaksList.slice(0, 3).map(habit => (
                    <div key={habit._id} className="flex justify-between items-center p-1.5 rounded-lg bg-slate-50 dark:bg-darkBg/30 border border-slate-100/50 dark:border-darkBorder/20 text-[11px] font-bold">
                      <span className="truncate text-slate-750 dark:text-slate-300 max-w-[110px]">{habit.title}</span>
                      <span className="text-amber-600 dark:text-amber-500 flex items-center gap-0.5">{habit.streak}d 🔥</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Achievements */}
            <div className="border-t border-slate-200 dark:border-darkBorder/40 pt-3">
              <h4 className="text-[10px] font-black text-slate-450 dark:text-slate-500 uppercase tracking-widest flex items-center gap-1 mb-2">
                <Award size={12} className="text-amber-500" />
                Achievements
              </h4>
              <div className="space-y-1.5 max-h-[100px] overflow-y-auto pr-1">
                {recentAchievements.length === 0 ? (
                  <p className="text-[10px] text-slate-550 text-center py-2">No achievements unlocked.</p>
                ) : (
                  recentAchievements.map(ach => (
                    <div key={ach.key} className="flex items-center gap-1.5 text-[11px]">
                      <span>🏆</span>
                      <div className="min-w-0">
                        <span className="font-bold text-slate-800 dark:text-slate-200 block truncate">{ach.title}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
          
          <button 
            onClick={() => setActivePage('achievements')}
            className="w-full mt-2 py-1 text-center text-[10px] font-bold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-650 dark:text-slate-305 border border-slate-200 dark:border-darkBorder hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center gap-1 transition-all"
          >
            All Achievements <ChevronRight size={10} />
          </button>
        </div>

        {/* Column 4: Quick Add Task Widget */}
        <div className="glass-panel p-5 rounded-2xl flex flex-col justify-between min-h-[300px] hover:shadow-md transition-all duration-300">
          <div>
            <h3 className="text-xs font-extrabold text-slate-500 uppercase tracking-widest flex items-center gap-1.5 pb-2 border-b border-slate-200 dark:border-darkBorder/40">
              <Plus size={14} className="text-primary-500" />
              Quick Add Task
            </h3>
            <form onSubmit={handleQuickAdd} className="mt-3 space-y-2.5">
              <div>
                <input
                  type="text"
                  required
                  placeholder="Task title..."
                  value={quickTitle}
                  onChange={(e) => setQuickTitle(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-darkBg border border-lightBorder dark:border-darkBorder text-slate-800 dark:text-slate-200 focus:outline-none focus:border-primary-500 transition-colors"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[8px] font-bold text-slate-405 dark:text-slate-500 uppercase mb-0.5">Category</label>
                  <select
                    value={quickCategory}
                    onChange={(e) => setQuickCategory(e.target.value)}
                    className="w-full px-2 py-1 text-[10px] rounded-lg bg-slate-50 dark:bg-darkBg border border-lightBorder dark:border-darkBorder text-slate-650 dark:text-slate-350 focus:outline-none"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[8px] font-bold text-slate-405 dark:text-slate-500 uppercase mb-0.5">Type</label>
                  <select
                    value={quickType}
                    onChange={(e) => setQuickType(e.target.value)}
                    className="w-full px-2 py-1 text-[10px] rounded-lg bg-slate-50 dark:bg-darkBg border border-lightBorder dark:border-darkBorder text-slate-650 dark:text-slate-350 focus:outline-none"
                  >
                    <option value="non-repeatable">One-time</option>
                    <option value="repeatable">Repeatable</option>
                  </select>
                </div>
              </div>
              <button
                type="submit"
                className="w-full mt-5 py-2.5 rounded-xl bg-gradient-to-r from-primary-600 to-accent-purple hover:from-primary-500 hover:to-accent-purple/90 text-white font-bold text-xs shadow-sm active:scale-95 transition-all flex items-center justify-center gap-1"
              >
                <Plus size={12} />
                Add Task
              </button>
            </form>
          </div>
        </div>

      </section>
    </div>
  );
};

export default Dashboard;
