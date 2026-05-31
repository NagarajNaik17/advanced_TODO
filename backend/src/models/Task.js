import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['repeatable', 'non-repeatable'],
    default: 'non-repeatable'
  },
  category: {
    type: String,
    enum: ['daily', 'weekly', 'monthly'],
    default: 'daily'
  },
  status: {
    type: String,
    enum: ['not_started', 'partially_done', 'completed'],
    default: 'not_started'
  },
  isCustomDuration: {
    type: Boolean,
    default: false
  },
  startDate: {
    type: Date
  },
  endDate: {
    type: Date
  },
  durationDays: {
    type: Number
  },
  streak: {
    type: Number,
    default: 0
  },
  longestStreak: {
    type: Number,
    default: 0
  },
  totalCompletions: {
    type: Number,
    default: 0
  },
  completionRate: {
    type: Number,
    default: 0 // percentage
  },
  missedDays: {
    type: Number,
    default: 0
  },
  lastCompletedAt: {
    type: Date
  },
  archived: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

const Task = mongoose.model('Task', taskSchema);
export default Task;
