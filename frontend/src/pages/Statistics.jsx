import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { BarChart3, TrendingUp, Calendar, Percent, Flame } from 'lucide-react';

const Statistics = () => {
  const { stats } = useApp();

  if (!stats) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-80px)] text-slate-400">
        <div className="animate-spin mb-4 text-primary-500 rounded-full h-8 w-8 border-b-2 border-primary-500" />
        <p className="text-sm font-semibold">Compiling analytics dashboards...</p>
      </div>
    );
  }

  const { charts, overview, habitMetrics } = stats;

  const COLORS = ['#6366f1', '#a855f7', '#06b6d4', '#10b981'];

  // Custom tooltips for dark/light themes
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-darkCard border border-slate-200 dark:border-darkBorder p-3 rounded-xl shadow-xl text-xs">
          <p className="font-extrabold text-slate-800 dark:text-slate-200 mb-1">{label}</p>
          {payload.map((item, index) => (
            <p key={index} style={{ color: item.color }} className="font-bold">
              {item.name}: {item.value}%
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-extrabold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-400 bg-clip-text text-transparent">
          Productivity Statistics
        </h2>
        <p className="text-slate-450 dark:text-slate-400 text-sm mt-1">
          Deep-dive analysis of your habits, completion cycles, and consistency.
        </p>
      </div>

      {/* Numerical Quick Stats */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-panel p-5 rounded-2xl">
          <div className="flex justify-between items-start text-slate-405 dark:text-slate-500">
            <span className="text-[10px] uppercase font-bold tracking-wider">Overall Success</span>
            <Percent size={14} className="text-primary-500 dark:text-primary-400" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-2">{overview.completionPercentage}%</p>
          <p className="text-[10px] text-slate-500 dark:text-slate-500 mt-1">Task completions rate</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl">
          <div className="flex justify-between items-start text-slate-405 dark:text-slate-500">
            <span className="text-[10px] uppercase font-bold tracking-wider">Active Streak</span>
            <Flame size={14} className="text-amber-600 dark:text-amber-500" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-2">{habitMetrics.currentStreak} Days</p>
          <p className="text-[10px] text-slate-500 dark:text-slate-500 mt-1">Current repeatable streak</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl">
          <div className="flex justify-between items-start text-slate-405 dark:text-slate-500">
            <span className="text-[10px] uppercase font-bold tracking-wider">Habit Consistency</span>
            <TrendingUp size={14} className="text-emerald-600 dark:text-emerald-450" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-2">{habitMetrics.habitSuccessRate}%</p>
          <p className="text-[10px] text-slate-500 dark:text-slate-500 mt-1">Average habits completed</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl">
          <div className="flex justify-between items-start text-slate-405 dark:text-slate-500">
            <span className="text-[10px] uppercase font-bold tracking-wider">Total Tasks Created</span>
            <BarChart3 size={14} className="text-purple-600 dark:text-purple-400" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-2">{overview.totalTasksCreated}</p>
          <p className="text-[10px] text-slate-500 dark:text-slate-500 mt-1">Lifetime goals & tasks</p>
        </div>
      </section>

      {/* Chart Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* 1. Daily Completion Trend (Last 30 days) */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-200">Daily Completion Trend</h3>
            <p className="text-xs text-slate-500 mt-0.5">Track productivity & habit success over the last 30 days.</p>
          </div>
          <div className="h-64 mt-6">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={charts.dailyTrend}>
                <defs>
                  <linearGradient id="colorComp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorHab" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.08} vertical={false} />
                <XAxis dataKey="date" stroke="#64748b" fontSize={10} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={10} domain={[0, 100]} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend iconSize={10} iconType="circle" wrapperStyle={{ fontSize: 10, paddingTop: 10 }} />
                <Area name="Task Progress" type="monotone" dataKey="completion" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorComp)" />
                <Area name="Habits Consistency" type="monotone" dataKey="habits" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorHab)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 2. Habit Consistency Chart */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-200">Individual Habit Performance</h3>
            <p className="text-xs text-slate-500 mt-0.5">Success rates and active streaks across habits.</p>
          </div>
          <div className="h-64 mt-6">
            {charts.habitConsistency.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-slate-500">
                No repeatable habits defined.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={charts.habitConsistency}>
                  <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.08} vertical={false} />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={10} domain={[0, 100]} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend iconSize={10} wrapperStyle={{ fontSize: 10, paddingTop: 10 }} />
                  <Bar name="Completion Rate" dataKey="rate" fill="#a855f7" radius={[4, 4, 0, 0]} />
                  <Bar name="Active Streak (Days)" dataKey="streak" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* 3. Weekly Productivity Trends */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-200">Weekly Cycle Metrics</h3>
            <p className="text-xs text-slate-500 mt-0.5">Performance averages over the last 12 weeks.</p>
          </div>
          <div className="h-64 mt-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.weeklyTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.08} vertical={false} />
                <XAxis dataKey="week" stroke="#64748b" fontSize={10} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={10} domain={[0, 100]} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar name="Productivity Average" dataKey="productivity" fill="#06b6d4" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 4. Monthly Cycle Metrics */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-200">Monthly Cycle Metrics</h3>
            <p className="text-xs text-slate-500 mt-0.5">Performance averages over the last 12 months.</p>
          </div>
          <div className="h-64 mt-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.08} vertical={false} />
                <XAxis dataKey="month" stroke="#64748b" fontSize={10} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={10} domain={[0, 100]} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar name="Productivity Average" dataKey="productivity" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 5. Category Distribution */}
        <div className="glass-panel p-6 rounded-2xl lg:col-span-2 flex flex-col md:flex-row items-center gap-6">
          <div className="flex-1 space-y-2">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-200">Category Distribution</h3>
            <p className="text-xs text-slate-500">
              Proportional breakdown of your active Daily vs Weekly vs Monthly vs Yearly tasks.
            </p>
            <div className="pt-4 grid grid-cols-2 gap-3 text-xs">
              {charts.categoryDistribution.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                  <span className="text-slate-600 dark:text-slate-400 font-bold">{item.name}:</span>
                  <span className="text-slate-800 dark:text-slate-200 font-black">{item.value} active</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="w-48 h-48 flex-shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={charts.categoryDistribution.filter(d => d.value > 0)}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {charts.categoryDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </section>
    </div>
  );
};

export default Statistics;
