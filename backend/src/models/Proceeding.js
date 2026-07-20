// backend/src/models/Proceeding.js
import mongoose from 'mongoose';

const proceedingSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: [true, 'Please add a title'],
    trim: true,
  },
  caseId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Case', 
    required: [true, 'Please provide a case ID'],
  },
  type: { 
    type: String, 
    enum: ['Hearing', 'Trial', 'Mediation', 'Arbitration', 'Conference', 'Filing', 'Order', 'Judgment', 'Other'],
    default: 'Hearing'
  },
  status: {
    type: String,
    enum: ['Scheduled', 'In Progress', 'Completed', 'Adjourned', 'Cancelled', 'Rescheduled'],
    default: 'Scheduled'
  },
  date: { 
    type: Date, 
    required: [true, 'Please add a date'],
  },
  time: { 
    type: String, 
    default: '' 
  },
  location: { 
    type: String, 
    default: '' 
  },
  judge: { 
    type: String, 
    default: '' 
  },
  description: { 
    type: String, 
    default: '' 
  },
  attendees: { 
    type: [String], 
    default: [] 
  },
  documents: {
    petitioner: { type: [String], default: [] },
    research: { type: [String], default: [] },
    defendant: { type: [String], default: [] },
  },
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Convert _id to id for frontend
proceedingSchema.set('toJSON', {
  transform: function(doc, ret) {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

// Auto-update timestamps
proceedingSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Proceeding = mongoose.model('Proceeding', proceedingSchema);
export default Proceeding;