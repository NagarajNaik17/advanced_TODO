import mongoose from 'mongoose';

const taskHistorySchema = new mongoose.Schema({
  taskId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
    required: true
  },
  date: {
    type: String, // format: YYYY-MM-DD
    required: true
  },
  status: {
    type: String,
    enum: ['not_started', 'partially_done', 'completed'],
    default: 'not_started',
    required: true
  }
}, {
  timestamps: true
});

taskHistorySchema.index({ taskId: 1, date: 1 }, { unique: true });

const TaskHistory = mongoose.model('TaskHistory', taskHistorySchema);
export default TaskHistory;
