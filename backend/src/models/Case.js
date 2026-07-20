// backend/src/models/Case.js
import mongoose from 'mongoose';

const caseSchema = new mongoose.Schema({
  // ===== CASE IDENTIFICATION =====
  caseNumber: { type: String, required: true, unique: true },
  courtNo: { type: String, default: '' },
  cmsNo: { type: String, default: '' },
  officeNo: { type: String, default: '' },
  
  // ===== BASIC INFORMATION =====
  caseTitle: { type: String, required: true },
  title: { type: String, default: '' },
  description: { type: String, default: '' },
  party: { type: String, default: 'N/A' },
  
  // ===== STATUS & PRIORITY =====
  status: { 
    type: String, 
    enum: ['active', 'pending', 'closed'],
    default: 'active' 
  },
  priority: { 
    type: String, 
    enum: ['Low', 'Medium', 'High', 'Urgent'],
    default: 'Medium' 
  },
  caseType: { type: String, default: 'Civil' },
  
  // ===== CASE NATURE =====
  caseNature: {
    trial: { type: String, default: '' },
    appeal: { type: String, default: '' },
  },
  
  // ===== COURT DETAILS =====
  courtDetails: {
    courtName: { type: String, default: '' },
    district: { type: String, default: '' },
    courtPreviousDate: { type: String, default: '' },
    nextDate: { type: String, default: '' },
  },
  
  // ===== REMARKS =====
  remarks: { type: String, default: '' },
  
  // ===== INSTITUTE =====
  instituteDate: { type: String, default: '' },
  instituteNo: { type: String, default: '' },
  
  // ===== ASSOCIATE =====
  associate: {
    name: { type: String, default: '' },
    district: { type: String, default: '' },
  },
  
  // ===== ADDITIONAL FIELDS =====
  amount: { type: String, default: 'N/A' },
  judge: { type: String, default: 'N/A' },
  attorneys: { type: String, default: 'N/A' },
  assignedTo: { type: String, default: 'N/A' },
  location: { type: String, default: 'N/A' },
  court: { type: String, default: 'N/A' },
  nexthearing: { type: String, default: 'N/A' },
  hearings: { type: Number, default: 0 },
  documentsCount: { type: Number, default: 0 },
  date: { type: String, default: '' },
  
  // ===== DOCUMENTS =====
  documents: { 
    petitioner: { type: [String], default: [] },
    research: { type: [String], default: [] },
    defendant: { type: [String], default: [] },
  },
  
  // ===== USER ASSOCIATION =====
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  
  // ===== TIMESTAMPS =====
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { 
  collection: 'cases',
  timestamps: true 
});

// ✅ Add method to convert MongoDB _id to id for frontend compatibility
caseSchema.set('toJSON', {
  transform: function(doc, ret) {
    ret.id = ret._id.toString();
    return ret;
  }
});

const Case = mongoose.model('Case', caseSchema);
export default Case;