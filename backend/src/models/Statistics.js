import mongoose from 'mongoose';

const statisticsSchema = new mongoose.Schema({
  date: {
    type: String, // format: YYYY-MM-DD
    required: true,
    unique: true
  },
  totalTasksCreated: {
    type: Number,
    default: 0
  },
  completedTasks: {
    type: Number,
    default: 0
  },
  pendingTasks: {
    type: Number,
    default: 0
  },
  partiallyCompletedTasks: {
    type: Number,
    default: 0
  },
  completionPercentage: {
    type: Number,
    default: 0
  },
  habitSuccessRate: {
    type: Number,
    default: 0
  },
  dailyProductivityScore: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

const Statistics = mongoose.model('Statistics', statisticsSchema);
export default Statistics;
