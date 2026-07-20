import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add an event title'],
    trim: true,
  },
  date: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['hearing', 'meeting', 'deposition', 'conference'],
    default: 'hearing',
  },
  location: {
    type: String,
    default: '',
  },
  description: {
    type: String,
    default: '',
  },
  caseId: {
    type: String,
    default: '',
  },
  caseRef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Case',
  },
  clientRef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
  },
  attendees: [{
    type: String,
  }],
  isCompleted: {
    type: Boolean,
    default: false,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
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

eventSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

const Event = mongoose.model('Event', eventSchema);
export default Event;