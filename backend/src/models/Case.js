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
  
  // ===== NEW FIELDS FROM ADD CASE MODAL =====
  division: { type: String, default: '' },
  district: { type: String, default: '' },
  plaintiff: { type: String, default: '' },
  defendant: { type: String, default: '' },
  nameOfCourt: { type: String, default: '' },
  natureOfCase: { type: String, default: '' },
  nextDateOfHearing: { type: String, default: '' },
  
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
  
  // ===== ATTACHMENTS - NEW =====
  copyOfSummon: { type: String, default: '' },
  copyOfPlaint: { type: String, default: '' },
  relevantDepartmentalRecord: { type: String, default: '' },
  attachments: {
    copyOfSummon: { type: String, default: '' },
    copyOfPlaint: { type: String, default: '' },
    relevantDepartmentalRecord: { type: String, default: '' },
  },
  
  // ===== WRITTEN STATEMENTS - NEW =====
  writtenStatements: { 
    type: [{
      title: { type: String, default: '' },
      content: { type: String, default: '' },
      fileName: { type: String, default: '' },
      fileSize: { type: Number, default: 0 },
      createdAt: { type: Date, default: Date.now },
    }], 
    default: [] 
  },
  
  // ===== LAW OFFICER - NEW =====
  lawOfficer: {
    type: { type: String, default: 'Department Representative' },
    name: { type: String, default: '' },
    designation: { type: String, default: '' },
    officeAddress: { type: String, default: '' },
    officialNumber: { type: String, default: '' },
    cellNumber: { type: String, default: '' },
  },
  
  // ===== ALTERNATE LAW OFFICER - NEW =====
  alternateLawOfficer: {
    type: { type: String, default: 'Department Representative' },
    name: { type: String, default: '' },
    designation: { type: String, default: '' },
    officeAddress: { type: String, default: '' },
    officialNumber: { type: String, default: '' },
    cellNumber: { type: String, default: '' },
  },
  
  // ===== USER ASSOCIATION =====
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client' },
  assignedToUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  
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
    // Ensure all fields are present
    ret.nameOfCourt = ret.nameOfCourt || '';
    ret.natureOfCase = ret.natureOfCase || '';
    ret.nextDateOfHearing = ret.nextDateOfHearing || '';
    ret.copyOfSummon = ret.copyOfSummon || '';
    ret.copyOfPlaint = ret.copyOfPlaint || '';
    ret.relevantDepartmentalRecord = ret.relevantDepartmentalRecord || '';
    ret.lawOfficer = ret.lawOfficer || { type: 'Department Representative', name: '', designation: '', officeAddress: '', officialNumber: '', cellNumber: '' };
    ret.alternateLawOfficer = ret.alternateLawOfficer || { type: 'Department Representative', name: '', designation: '', officeAddress: '', officialNumber: '', cellNumber: '' };
    ret.writtenStatements = ret.writtenStatements || [];
    ret.attachments = ret.attachments || {};
    ret.courtDetails = ret.courtDetails || {};
    ret.caseNature = ret.caseNature || {};
    return ret;
  }
});

const Case = mongoose.model('Case', caseSchema);
export default Case;