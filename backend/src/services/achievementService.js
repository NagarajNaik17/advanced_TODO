import Achievement from '../models/Achievement.js';
import Task from '../models/Task.js';
import Goal from '../models/Goal.js';

export const checkAndUnlockAchievements = async () => {
  const unlockedNow = [];

  try {
    // 1. Check if first task is completed
    const completedTasksCount = await Task.countDocuments({ status: 'completed' });
    const repeatableTasks = await Task.find({ type: 'repeatable' });
    const totalHabitCompletions = repeatableTasks.reduce((sum, task) => sum + (task.totalCompletions || 0), 0);
    const totalCompletions = completedTasksCount + totalHabitCompletions;

    // Check "first_task"
    if (totalCompletions > 0) {
      const ach = await Achievement.findOne({ key: 'first_task', unlocked: false });
      if (ach) {
        ach.unlocked = true;
        ach.unlockedAt = new Date();
        await ach.save();
        unlockedNow.push(ach);
      }
    }

    // 2. Check task counts
    if (totalCompletions >= 100) {
      const ach = await Achievement.findOne({ key: 'tasks_100', unlocked: false });
      if (ach) {
        ach.unlocked = true;
        ach.unlockedAt = new Date();
        await ach.save();
        unlockedNow.push(ach);
      }
    }

    if (totalCompletions >= 500) {
      const ach = await Achievement.findOne({ key: 'tasks_500', unlocked: false });
      if (ach) {
        ach.unlocked = true;
        ach.unlockedAt = new Date();
        await ach.save();
        unlockedNow.push(ach);
      }
    }

    // 3. Check streaks
    let maxStreak = 0;
    repeatableTasks.forEach(task => {
      if (task.streak > maxStreak) {
        maxStreak = task.streak;
      }
    });

    if (maxStreak >= 7) {
      const ach = await Achievement.findOne({ key: 'streak_7', unlocked: false });
      if (ach) {
        ach.unlocked = true;
        ach.unlockedAt = new Date();
        await ach.save();
        unlockedNow.push(ach);
      }
    }

    if (maxStreak >= 30) {
      const ach = await Achievement.findOne({ key: 'streak_30', unlocked: false });
      if (ach) {
        ach.unlocked = true;
        ach.unlockedAt = new Date();
        await ach.save();
        unlockedNow.push(ach);
      }
    }

    // 4. Check goals
    const completedGoalsCount = await Goal.countDocuments({ completed: true });
    if (completedGoalsCount > 0) {
      const ach = await Achievement.findOne({ key: 'first_goal', unlocked: false });
      if (ach) {
        ach.unlocked = true;
        ach.unlockedAt = new Date();
        await ach.save();
        unlockedNow.push(ach);
      }
    }

  } catch (error) {
    console.error('Error checking achievements:', error);
  }

  return unlockedNow;
};
