import mongoose from 'mongoose';

const animationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  config: {
    type: Object, // Theatre.js project state
    required: true
  },
  thumbnail: {
    type: String,
    default: null
  },
  createdBy: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  tags: [{
    type: String
  }]
});

animationSchema.index({ createdBy: 1, createdAt: -1 });

export const Animation = mongoose.models.Animation || 
  mongoose.model('Animation', animationSchema, 'animations');

