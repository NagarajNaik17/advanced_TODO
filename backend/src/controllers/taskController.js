import Task from '../models/Task.js';
import TaskHistory from '../models/TaskHistory.js';
import HabitHistory from '../models/HabitHistory.js';
import { checkAndUnlockAchievements } from '../services/achievementService.js';
import dayjs from 'dayjs';

// Get all tasks (support search, filtering, and sorting)
export const getTasks = async (req, res) => {
  try {
    const { search, category, type, status, sort } = req.query;
    let query = { archived: false };

    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }
    if (category) {
      query.category = category;
    }
    if (type) {
      query.type = type;
    }
    if (status) {
      query.status = status;
    }

    let sortObj = { createdAt: -1 };
    if (sort) {
      if (sort === 'dueDate') {
        sortObj = { endDate: 1 };
      } else if (sort === 'title') {
        sortObj = { title: 1 };
      }
    }

    const tasks = await Task.find(query).sort(sortObj);
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a task
export const createTask = async (req, res) => {
  try {
    const { title, type, category, isCustomDuration, startDate, endDate } = req.body;
    
    let durationDays = undefined;
    if (isCustomDuration && startDate && endDate) {
      const start = dayjs(startDate);
      const end = dayjs(endDate);
      durationDays = end.diff(start, 'day') + 1;
    }

    const task = new Task({
      title,
      type,
      category,
      status: 'not_started',
      isCustomDuration: isCustomDuration || false,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      durationDays
    });

    const savedTask = await task.save();
    res.status(201).json(savedTask);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a task
export const updateTask = async (req, res) => {
  try {
    const { title, category, type, status, isCustomDuration, startDate, endDate } = req.body;
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    task.title = title !== undefined ? title : task.title;
    task.category = category !== undefined ? category : task.category;
    task.type = type !== undefined ? type : task.type;
    task.isCustomDuration = isCustomDuration !== undefined ? isCustomDuration : task.isCustomDuration;
    
    if (task.isCustomDuration && startDate && endDate) {
      task.startDate = new Date(startDate);
      task.endDate = new Date(endDate);
      task.durationDays = dayjs(endDate).diff(dayjs(startDate), 'day') + 1;
    }

    if (status !== undefined) {
      task.status = status;
      if (status === 'completed') {
        task.lastCompletedAt = new Date();
        if (task.type === 'non-repeatable') {
          task.archived = true;
          // Record final history entry
          const todayStr = dayjs().format('YYYY-MM-DD');
          await TaskHistory.findOneAndUpdate(
            { taskId: task._id, date: todayStr },
            { taskId: task._id, date: todayStr, status: 'completed' },
            { upsert: true }
          );
        }
      }
    }

    const updatedTask = await task.save();
    
    // Check achievements
    const newAchievements = await checkAndUnlockAchievements();
    
    res.json({ task: updatedTask, unlockedAchievements: newAchievements });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a task
export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    // Delete history associated
    await TaskHistory.deleteMany({ taskId: req.params.id });
    await HabitHistory.deleteMany({ taskId: req.params.id });

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Patch status (one-click action)
export const patchStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const oldStatus = task.status;
    task.status = status;

    if (status === 'completed') {
      task.lastCompletedAt = new Date();
      
      // For non-repeatable, archive and record history
      if (task.type === 'non-repeatable') {
        task.archived = true;
        const todayStr = dayjs().format('YYYY-MM-DD');
        await TaskHistory.findOneAndUpdate(
          { taskId: task._id, date: todayStr },
          { taskId: task._id, date: todayStr, status: 'completed' },
          { upsert: true }
        );
      }
    } else {
      // For non-repeatable moving through statuses, update history as well if needed
      if (task.type === 'non-repeatable') {
        const todayStr = dayjs().format('YYYY-MM-DD');
        await TaskHistory.findOneAndUpdate(
          { taskId: task._id, date: todayStr },
          { taskId: task._id, date: todayStr, status: status },
          { upsert: true }
        );
      }
    }

    const updatedTask = await task.save();

    // Check achievements
    const newAchievements = await checkAndUnlockAchievements();

    res.json({ task: updatedTask, unlockedAchievements: newAchievements });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get habit history for GitHub heatmap page
export const getHabitHistory = async (req, res) => {
  try {
    const { taskId } = req.query;
    let query = {};
    if (taskId) {
      query.taskId = taskId;
    }
    const history = await HabitHistory.find(query).sort({ date: 1 });
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
