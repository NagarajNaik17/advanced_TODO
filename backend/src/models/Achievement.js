import mongoose from 'mongoose';

const achievementSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  unlocked: {
    type: Boolean,
    default: false
  },
  unlockedAt: {
    type: Date
  },
  icon: {
    type: String,
    default: 'Award'
  }
}, {
  timestamps: true
});

const Achievement = mongoose.model('Achievement', achievementSchema);
export default Achievement;
