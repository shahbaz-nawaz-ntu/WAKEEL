// backend/src/models/Party.js
import mongoose from 'mongoose';

const partySchema = new mongoose.Schema({
  caseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Case',
    required: false
  },
  type: {
    type: String,
    required: [true, 'Please provide party type'],
    enum: [
      'Appellant(s)',
      'Defendant(s)',
      'Petitioner(s)',
      'Plaintiff(s)',
      'Respondent(s)',
      'Applicant(s)',
      'Complainant(s)',
      'Accused'
    ]
  },
  name: {
    type: String,
    required: [true, 'Please provide party name']
  },
  phone: {
    type: String,
    default: '-'
  },
  email: {
    type: String,
    default: '-'
  },
  cnic: {
    type: String,
    default: '-'
  },
  address: {
    type: String,
    default: '-'
  },
  createdBy: {
    type: String,
    default: 'Current User'
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false  // ✅ CHANGE: required: true se false karein
  }
}, {
  timestamps: true
});

partySchema.set('toJSON', {
  transform: function(doc, ret) {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

const Party = mongoose.model('Party', partySchema);
export default Party;