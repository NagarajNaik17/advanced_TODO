import cron from 'node-cron';
import dayjs from 'dayjs';
import Task from '../models/Task.js';
import HabitHistory from '../models/HabitHistory.js';
import SystemConfig from '../models/SystemConfig.js';
import Statistics from '../models/Statistics.js';

// Helper function to reset repeatable tasks for a specific date string (YYYY-MM-DD)
export const performResetForDate = async (dateStr) => {
  console.log(`Running LifeOS reset logic for date: ${dateStr}`);
  const d = dayjs(dateStr);
  const isSunday = d.day() === 0; // Weekly reset (Sunday midnight)
  const isLastDayOfMonth = d.date() === d.endOf('month').date(); // Monthly reset (Last-of-month midnight)
  
  try {
    // 1. Reset Daily Repeatable Tasks (Every day)
    const dailyRepeatableTasks = await Task.find({
      type: 'repeatable',
      category: 'daily',
      archived: false
    });

    for (const task of dailyRepeatableTasks) {
      const currentStatus = task.status;
      
      // Save history record
      await HabitHistory.findOneAndUpdate(
        { taskId: task._id, date: dateStr },
        {
          taskId: task._id,
          date: dateStr,
          status: currentStatus
        },
        { upsert: true, new: true }
      );

      if (currentStatus === 'completed') {
        task.streak += 1;
        task.longestStreak = Math.max(task.longestStreak, task.streak);
        task.totalCompletions += 1;
        task.lastCompletedAt = new Date();
      } else {
        task.streak = 0;
        task.missedDays += 1;
      }

      const totalDays = task.totalCompletions + task.missedDays;
      task.completionRate = totalDays > 0 ? Math.round((task.totalCompletions / totalDays) * 100) : 0;
      task.status = 'not_started';

      await task.save();
    }

    // 2. Reset Weekly Repeatable Tasks (Only on Sunday midnight)
    if (isSunday) {
      console.log(`Sunday detected (${dateStr}). Resetting weekly repeatable habits...`);
      const weeklyRepeatableTasks = await Task.find({
        type: 'repeatable',
        category: 'weekly',
        archived: false
      });

      for (const task of weeklyRepeatableTasks) {
        const currentStatus = task.status;
        
        await HabitHistory.findOneAndUpdate(
          { taskId: task._id, date: dateStr },
          {
            taskId: task._id,
            date: dateStr,
            status: currentStatus
          },
          { upsert: true, new: true }
        );

        if (currentStatus === 'completed') {
          task.streak += 1;
          task.longestStreak = Math.max(task.longestStreak, task.streak);
          task.totalCompletions += 1;
          task.lastCompletedAt = new Date();
        } else {
          task.streak = 0;
          task.missedDays += 1;
        }

        const totalWeeks = task.totalCompletions + task.missedDays;
        task.completionRate = totalWeeks > 0 ? Math.round((task.totalCompletions / totalWeeks) * 100) : 0;
        task.status = 'not_started';

        await task.save();
      }
    }

    // 3. Reset Monthly Repeatable Tasks (Only on Last-of-month midnight)
    if (isLastDayOfMonth) {
      console.log(`Last day of month detected (${dateStr}). Resetting monthly repeatable habits...`);
      const monthlyRepeatableTasks = await Task.find({
        type: 'repeatable',
        category: 'monthly',
        archived: false
      });

      for (const task of monthlyRepeatableTasks) {
        const currentStatus = task.status;
        
        await HabitHistory.findOneAndUpdate(
          { taskId: task._id, date: dateStr },
          {
            taskId: task._id,
            date: dateStr,
            status: currentStatus
          },
          { upsert: true, new: true }
        );

        if (currentStatus === 'completed') {
          task.streak += 1;
          task.longestStreak = Math.max(task.longestStreak, task.streak);
          task.totalCompletions += 1;
          task.lastCompletedAt = new Date();
        } else {
          task.streak = 0;
          task.missedDays += 1;
        }

        const totalMonths = task.totalCompletions + task.missedDays;
        task.completionRate = totalMonths > 0 ? Math.round((task.totalCompletions / totalMonths) * 100) : 0;
        task.status = 'not_started';

        await task.save();
      }
    }

    // 4. Generate and save daily Statistics snapshot for the day that just ended
    const allTasks = await Task.find({ archived: false });
    const completedTasksCount = await Task.countDocuments({ status: 'completed', archived: false });
    const partiallyCompletedCount = await Task.countDocuments({ status: 'partially_done', archived: false });
    const pendingCount = await Task.countDocuments({ status: 'not_started', archived: false });

    const totalTasksCount = allTasks.length;
    const completionPercentage = totalTasksCount > 0 ? Math.round((completedTasksCount / totalTasksCount) * 100) : 0;

    // Habit success rate for this day
    const weeklyHabitsCount = isSunday ? (await Task.countDocuments({ type: 'repeatable', category: 'weekly', archived: false })) : 0;
    const monthlyHabitsCount = isLastDayOfMonth ? (await Task.countDocuments({ type: 'repeatable', category: 'monthly', archived: false })) : 0;
    const activeHabitsCount = dailyRepeatableTasks.length + weeklyHabitsCount + monthlyHabitsCount;
    
    const dayHabitCompletions = dailyRepeatableTasks.filter(t => t.lastCompletedAt && dayjs(t.lastCompletedAt).format('YYYY-MM-DD') === dateStr).length;
    const habitSuccessRate = activeHabitsCount > 0 ? Math.round((dayHabitCompletions / activeHabitsCount) * 100) : 0;

    // Save statistics for the day
    await Statistics.findOneAndUpdate(
      { date: dateStr },
      {
        date: dateStr,
        totalTasksCreated: totalTasksCount,
        completedTasks: completedTasksCount,
        pendingTasks: pendingCount,
        partiallyCompletedTasks: partiallyCompletedCount,
        completionPercentage: completionPercentage,
        habitSuccessRate: habitSuccessRate,
        dailyProductivityScore: Math.round((completionPercentage + habitSuccessRate) / 2)
      },
      { upsert: true, new: true }
    );

    console.log(`Reset logic completed successfully for ${dateStr}`);
  } catch (error) {
    console.error(`Error performing reset for date ${dateStr}:`, error);
  }
};

// Catch up missed resets (e.g. if server was shut down over midnight)
export const catchUpResets = async () => {
  try {
    let config = await SystemConfig.findOne({ key: 'system_settings' });
    if (!config) {
      config = await SystemConfig.create({
        key: 'system_settings',
        lastResetDate: dayjs().format('YYYY-MM-DD')
      });
      return;
    }

    const todayStr = dayjs().format('YYYY-MM-DD');
    let lastResetStr = config.lastResetDate;

    // Run reset for each missed day
    while (lastResetStr !== todayStr) {
      await performResetForDate(lastResetStr);
      lastResetStr = dayjs(lastResetStr).add(1, 'day').format('YYYY-MM-DD');
      config.lastResetDate = lastResetStr;
      await config.save();
    }
  } catch (error) {
    console.error('Error during catchUpResets:', error);
  }
};

// Initialize Cron Job to run at 12:00 AM every day
export const initCronJobs = () => {
  // 0 0 * * * runs every day at 12:00 AM (midnight)
  cron.schedule('0 0 * * *', async () => {
    console.log('Cron Job triggered: Midnight Reset');
    const yesterdayStr = dayjs().subtract(1, 'day').format('YYYY-MM-DD');
    
    // Perform reset for the day that just ended
    await performResetForDate(yesterdayStr);
    
    // Update the config with today's date
    const config = await SystemConfig.findOne({ key: 'system_settings' });
    if (config) {
      config.lastResetDate = dayjs().format('YYYY-MM-DD');
      await config.save();
    }
  });
  
  console.log('Cron jobs scheduled successfully.');
};
