// backend/src/models/Reference.js
import mongoose from 'mongoose';

const referenceSchema = new mongoose.Schema({
  // Basic Information
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
  },
  caseNumber: {
    type: String,
    required: [true, 'Please add a case number'],
    unique: true,
    trim: true,
  },
  description: {
    type: String,
    default: '',
  },
  
  // Reference Specific Fields
  citation: {
    type: String,
    required: [true, 'Please add a citation'],
    trim: true,
  },
  court: {
    type: String,
    required: [true, 'Please add a court name'],
    trim: true,
  },
  judge: {
    type: String,
    default: '',
  },
  verdict: {
    type: String,
    enum: ['Upheld', 'Reversed', 'Modified', 'Remanded', 'Dismissed', 'Pending'],
    default: 'Pending',
  },
  dateDecided: {
    type: Date,
  },
  practiceArea: {
    type: String,
    default: '',
  },
  
  // Additional Fields
  summary: {
    type: String,
    default: '',
  },
  keyIssues: {
    type: [String],
    default: [],
  },
  outcomes: {
    type: String,
    default: '',
  },
  tags: {
    type: [String],
    default: [],
  },
  url: {
    type: String,
    default: '',
  },
  
  // Documents
  documents: {
    petitioner: { type: [String], default: [] },
    research: { type: [String], default: [] },
    defendant: { type: [String], default: [] },
  },
  
  // Status
  status: {
    type: String,
    enum: ['active', 'pending', 'archived'],
    default: 'active',
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium',
  },
  
  // User association
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Auto-generate case number if not provided
referenceSchema.pre('save', function (next) {
  if (!this.caseNumber) {
    const prefix = 'REF';
    const year = new Date().getFullYear();
    const random = Math.floor(1000 + Math.random() * 9000);
    this.caseNumber = `${prefix}-${year}-${random}`;
  }
  this.updatedAt = Date.now();
  next();
});

// Convert _id to id for frontend
referenceSchema.set('toJSON', {
  transform: function (doc, ret) {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

const Reference = mongoose.model('Reference', referenceSchema);
export default Reference;