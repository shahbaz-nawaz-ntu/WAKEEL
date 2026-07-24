// backend/src/models/Comment.js
import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  caseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Case',
    required: [true, 'Please provide a case ID']
  },
  commentedBy: {
    type: String,
    required: [true, 'Please provide commenter name'],
    default: ''
  },
  remarks: {
    type: String,
    default: ''
  },
  requestToClientDepartment: {
    type: String,
    enum: [
      'Attendance of departmental representative required in court.',
      'Attendance of departmental representative for cross-examination of witnesses.',
      'Attendance of Departmental representatives for oral evidence.',
      'In case of transfer/leave/retirement etc. Alternate Departmental Representative.',
      'Provision of record and assistance from Departmental Representative for arguments.',
      'Provision of record for documentary evidence. (time limitation)',
      'Provision of record for preparation of written statement/ reply. (time limitation)'
    ],
    default: ''
  },
  clientDepartments: {
    type: String,
    default: ''
  },
  attachments: {
    type: [String],
    default: []
  },
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Completed', 'Closed'],
    default: 'Pending'
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Convert _id to id for frontend
commentSchema.set('toJSON', {
  transform: function(doc, ret) {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

const Comment = mongoose.model('Comment', commentSchema);
export default Comment;