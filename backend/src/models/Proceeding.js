// backend/src/models/Proceeding.js
import mongoose from 'mongoose';

const proceedingSchema = new mongoose.Schema({
  // ===== FRONTEND FIELDS =====
  createdBy: { 
    type: String, 
    required: [true, 'Please provide created by'],
    default: ''
  },
  progress: { 
    type: String, 
    required: [true, 'Please add progress details'],
    default: '' 
  },
  nextHearingDate: { 
    type: Date, 
    default: null 
  },
  attachment: { 
    type: String, 
    default: null 
  },
  
  // ===== BACKWARD COMPATIBILITY FIELDS =====
  title: { 
    type: String, 
    trim: true,
    default: ''
  },
  type: { 
    type: String, 
    enum: ['Hearing', 'Trial', 'Mediation', 'Arbitration', 'Conference', 'Filing', 'Order', 'Judgment', 'Other'],
    default: 'Hearing'
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
  
  // ===== STATUS =====
  status: {
    type: String,
    enum: [
      'Adjournment by the Court.',
      'Adjournment by the law officer',
      'Adjournment by the private counsel',
      'Arguments on maintainability of the case.',
      'Decision',
      'Dismissed for non-prosecution of law officer',
      'Dismissed for non-prosecution of private party.',
      'Dismissed in limine.',
      'Pending for arguments.',
      'Pending for case laws discussion',
      'Pending for decision on Misc. Application.',
      'Pending for evidence. (time limitation)',
      'Pending for final arguments',
      'Pending for framing of issues.',
      'Pending for written statement/reply. (time limitation)',
      'Preliminary stage/process of summons and notices etc.',
      'Right of evidence of department closed',
      'Withdraw by private party',
      'Others',
      // Old statuses for backward compatibility
      'Scheduled',
      'In Progress',
      'Completed',
      'Adjourned',
      'Cancelled',
      'Rescheduled'
    ],
    default: 'Pending for arguments.'
  },
  
  // ===== REFERENCES =====
  caseId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Case', 
    required: [true, 'Please provide a case ID'],
  },
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  
  // ===== TIMESTAMPS =====
  date: { 
    type: Date, 
    default: Date.now 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
}, { 
  timestamps: true 
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