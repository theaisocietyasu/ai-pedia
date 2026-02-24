import mongoose from 'mongoose';

const animation2DSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    default: '',
  },
  config: {
    type: Object, // Fabric.js canvas JSON + any extra metadata
    required: true,
  },
  createdBy: {
    type: String,
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

animation2DSchema.index({ createdAt: -1 });

export const Animation2D =
  mongoose.models.Animation2D ||
  mongoose.model('Animation2D', animation2DSchema, 'animations_2d');

