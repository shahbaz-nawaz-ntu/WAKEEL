// backend/src/models/Party.js
import mongoose from 'mongoose';

const partySchema = new mongoose.Schema({
  type: {
    type: String,
    enum: [
      'Appellant(s)',
      'Defendant(s)',
      'Petitioner(s)',
      'Plaintiff(s)',
      'Respondent(s)',
      'Applicant(s)',
      'Complainant(s)',
      'Accused'
    ],
    required: [true, 'Please provide party type']
  },
  name: {
    type: String,
    required: [true, 'Please provide party name'],
    trim: true
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
    required: [true, 'User ID is required']  // ✅ Make sure this is required
  }
}, {
  timestamps: true
});

// Convert _id to id for frontend
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