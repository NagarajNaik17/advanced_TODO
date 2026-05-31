import Goal from '../models/Goal.js';
import { checkAndUnlockAchievements } from '../services/achievementService.js';

export const getGoals = async (req, res) => {
  try {
    const goals = await Goal.find({}).sort({ createdAt: -1 });
    res.json(goals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createGoal = async (req, res) => {
  try {
    const { title, type, targetValue, currentValue, unit, endDate } = req.body;
    const goal = new Goal({
      title,
      type: type || 'personal',
      targetValue: targetValue !== undefined ? Number(targetValue) : 1,
      currentValue: currentValue !== undefined ? Number(currentValue) : 0,
      unit: unit || 'goals',
      endDate: endDate ? new Date(endDate) : undefined
    });
    
    // Set completed status automatically if target is reached
    if (goal.currentValue >= goal.targetValue) {
      goal.completed = true;
      goal.completedAt = new Date();
    }

    const savedGoal = await goal.save();
    res.status(201).json(savedGoal);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateGoal = async (req, res) => {
  try {
    const { title, type, targetValue, currentValue, unit, completed, endDate } = req.body;
    const goal = await Goal.findById(req.params.id);

    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    goal.title = title !== undefined ? title : goal.title;
    goal.type = type !== undefined ? type : goal.type;
    goal.targetValue = targetValue !== undefined ? Number(targetValue) : goal.targetValue;
    goal.unit = unit !== undefined ? unit : goal.unit;
    goal.endDate = endDate !== undefined ? endDate : goal.endDate;

    if (currentValue !== undefined) {
      goal.currentValue = Number(currentValue);
    }

    // Set completion status based on currentValue or explicit completion check
    const isCompleted = completed !== undefined 
      ? completed 
      : (goal.currentValue >= goal.targetValue);
    
    if (isCompleted) {
      if (!goal.completed) {
        goal.completed = true;
        goal.completedAt = new Date();
        goal.currentValue = goal.targetValue; // Max out progress on completion
      }
    } else {
      goal.completed = false;
      goal.completedAt = undefined;
    }

    const updatedGoal = await goal.save();

    // Check achievement unlock
    const newAchievements = await checkAndUnlockAchievements();

    res.json({ goal: updatedGoal, unlockedAchievements: newAchievements });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteGoal = async (req, res) => {
  try {
    const goal = await Goal.findByIdAndDelete(req.params.id);
    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }
    res.json({ message: 'Goal deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
