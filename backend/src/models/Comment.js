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
    default: 'Pending'
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false  // ✅ CHANGE: required: true se false karein
  },
  date: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

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