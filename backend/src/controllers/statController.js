import Task from '../models/Task.js';
import Goal from '../models/Goal.js';
import Statistics from '../models/Statistics.js';
import dayjs from 'dayjs';

export const getStats = async (req, res) => {
  try {
    const allTasks = await Task.find({});
    const totalGoals = await Goal.countDocuments({});
    const completedGoals = await Goal.countDocuments({ completed: true });

    // --- Overview Metrics ---
    // Total created includes active, archived, and goals
    const totalTasksCreated = allTasks.length + totalGoals;
    
    // Count tasks by status
    const completedTasksCount = allTasks.filter(t => t.status === 'completed').length;
    const partiallyCompletedCount = allTasks.filter(t => t.status === 'partially_done').length;
    const pendingCount = allTasks.filter(t => t.status === 'not_started').length;

    // Completions count: all completed tasks + completed goals
    const completedTasks = completedTasksCount + completedGoals;
    const partiallyCompletedTasks = partiallyCompletedCount;
    const pendingTasks = pendingCount + (totalGoals - completedGoals);

    const totalDenominator = totalTasksCreated || 1;
    const completionPercentage = Math.round((completedTasks / totalDenominator) * 100);

    // --- Habit Metrics ---
    const repeatableTasks = allTasks.filter(t => t.type === 'repeatable');
    let maxCurrentStreak = 0;
    let maxLongestStreak = 0;
    let habitSuccessRateSum = 0;

    repeatableTasks.forEach(t => {
      if (t.streak > maxCurrentStreak) maxCurrentStreak = t.streak;
      if (t.longestStreak > maxLongestStreak) maxLongestStreak = t.longestStreak;
      habitSuccessRateSum += t.completionRate || 0;
    });

    const habitSuccessRate = repeatableTasks.length > 0 ? Math.round(habitSuccessRateSum / repeatableTasks.length) : 0;

    // --- Productivity Metrics (Current cycle completion percentages) ---
    const dailyTasks = allTasks.filter(t => t.category === 'daily');
    const dailyCompleted = dailyTasks.filter(t => t.status === 'completed').length;
    const dailyProductivity = dailyTasks.length > 0 ? Math.round((dailyCompleted / dailyTasks.length) * 100) : 0;

    const weeklyTasks = allTasks.filter(t => t.category === 'weekly');
    const weeklyCompleted = weeklyTasks.filter(t => t.status === 'completed').length;
    const weeklyProductivity = weeklyTasks.length > 0 ? Math.round((weeklyCompleted / weeklyTasks.length) * 100) : 0;

    const monthlyTasks = allTasks.filter(t => t.category === 'monthly');
    const monthlyCompleted = monthlyTasks.filter(t => t.status === 'completed').length;
    const monthlyProductivity = monthlyTasks.length > 0 ? Math.round((monthlyCompleted / monthlyTasks.length) * 100) : 0;

    // --- Chart 1: Daily Completion Trend (Last 30 days) ---
    const statsList = await Statistics.find({}).sort({ date: 1 }).limit(30);
    
    const dailyTrend = [];
    for (let i = 29; i >= 0; i--) {
      const dateStr = dayjs().subtract(i, 'day').format('YYYY-MM-DD');
      const found = statsList.find(s => s.date === dateStr);
      dailyTrend.push({
        date: dayjs(dateStr).format('MMM DD'),
        completion: found ? found.completionPercentage : 0,
        habits: found ? found.habitSuccessRate : 0
      });
    }

    // --- Chart 2: Weekly Productivity Trend (Last 12 weeks) ---
    const weeklyTrend = [];
    for (let i = 11; i >= 0; i--) {
      const startOfWeek = dayjs().subtract(i, 'week').startOf('week');
      const endOfWeek = dayjs().subtract(i, 'week').endOf('week');
      
      const weeklyStats = await Statistics.find({
        date: {
          $gte: startOfWeek.format('YYYY-MM-DD'),
          $lte: endOfWeek.format('YYYY-MM-DD')
        }
      });

      let avgCompletion = 0;
      if (weeklyStats.length > 0) {
        avgCompletion = Math.round(weeklyStats.reduce((sum, s) => sum + s.completionPercentage, 0) / weeklyStats.length);
      }

      weeklyTrend.push({
        week: `Wk ${dayjs().subtract(i, 'week').format('w')}`,
        productivity: avgCompletion || 0
      });
    }

    // --- Chart 3: Monthly Productivity Trend (Last 12 months) ---
    const monthlyTrend = [];
    for (let i = 11; i >= 0; i--) {
      const startOfMonth = dayjs().subtract(i, 'month').startOf('month');
      const endOfMonth = dayjs().subtract(i, 'month').endOf('month');
      
      const monthlyStats = await Statistics.find({
        date: {
          $gte: startOfMonth.format('YYYY-MM-DD'),
          $lte: endOfMonth.format('YYYY-MM-DD')
        }
      });

      let avgCompletion = 0;
      if (monthlyStats.length > 0) {
        avgCompletion = Math.round(monthlyStats.reduce((sum, s) => sum + s.completionPercentage, 0) / monthlyStats.length);
      }

      monthlyTrend.push({
        month: dayjs().subtract(i, 'month').format('MMM YY'),
        productivity: avgCompletion || 0
      });
    }

    // --- Chart 4: Habit Consistency Chart (Repeatable tasks consistency) ---
    const habitConsistency = repeatableTasks.map(t => ({
      name: t.title,
      rate: t.completionRate || 0,
      streak: t.streak || 0
    }));

    // --- Chart 5: Category Distribution ---
    const categoryDistribution = [
      { name: 'Daily Tasks', value: allTasks.filter(t => t.category === 'daily' && !t.archived).length },
      { name: 'Weekly Tasks', value: allTasks.filter(t => t.category === 'weekly' && !t.archived).length },
      { name: 'Monthly Tasks', value: allTasks.filter(t => t.category === 'monthly' && !t.archived).length },
      { name: 'Yearly Goals', value: totalGoals }
    ];

    res.json({
      overview: {
        totalTasksCreated,
        completedTasks,
        pendingTasks,
        partiallyCompletedTasks,
        completionPercentage
      },
      habitMetrics: {
        currentStreak: maxCurrentStreak,
        longestStreak: maxLongestStreak,
        habitSuccessRate
      },
      productivityMetrics: {
        dailyProductivity,
        weeklyProductivity,
        monthlyProductivity
      },
      charts: {
        dailyTrend,
        weeklyTrend,
        monthlyTrend,
        habitConsistency,
        categoryDistribution
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
