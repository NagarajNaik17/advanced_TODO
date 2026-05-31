import mongoose from 'mongoose';

const systemConfigSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true,
    default: 'system_settings'
  },
  lastResetDate: {
    type: String, // format: YYYY-MM-DD
    required: true
  }
}, {
  timestamps: true
});

const SystemConfig = mongoose.model('SystemConfig', systemConfigSchema);
export default SystemConfig;
