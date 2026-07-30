// backend/src/routes/caseRoutes.js
import express from 'express';
import Case from '../models/Case.js';
import { authenticateToken } from '../middleware/auth.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const router = express.Router();

// ✅ Get __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============================================
// FILE UPLOAD CONFIGURATION - FIXED
// ============================================

// ✅ Go up TWO levels to reach the backend root
// From: E:\Wakeel-app-main\backend\src\routes\
// To:   E:\Wakeel-app-main\backend\uploads\
const uploadDir = path.join(__dirname, '..', '..', 'uploads');

console.log(`📁 Uploads directory: ${uploadDir}`);

// Ensure uploads directory exists
if (!fs.existsSync(uploadDir)) {
  console.log(`📁 Creating uploads directory at: ${uploadDir}`);
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Also create proceedings subfolder
const proceedingsDir = path.join(uploadDir, 'proceedings');
if (!fs.existsSync(proceedingsDir)) {
  console.log(`📁 Creating proceedings directory at: ${proceedingsDir}`);
  fs.mkdirSync(proceedingsDir, { recursive: true });
}

console.log(`✅ Uploads directory configured: ${uploadDir}`);

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // ✅ Use original file name to match database
    // This ensures the file name in the database matches the actual file
    cb(null, file.originalname);
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'image/jpeg',
    'image/png',
    'image/gif',
    'text/plain'
  ];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF, Word, Excel, Images, and Text files are allowed.'), false);
  }
};

// Create multer upload instance
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  }
});

// Middleware for file upload
const uploadFiles = upload.fields([
  { name: 'summonFile', maxCount: 1 },
  { name: 'plaintFile', maxCount: 1 },
  { name: 'departmentalFile', maxCount: 1 },
  { name: 'statementFile_0', maxCount: 1 },
  { name: 'statementFile_1', maxCount: 1 },
  { name: 'statementFile_2', maxCount: 1 },
  { name: 'statementFile_3', maxCount: 1 },
  { name: 'statementFile_4', maxCount: 1 },
]);

// ============================================
// 🆔 GENERATE UNIQUE CASE NUMBER - FIXED
// ============================================
const generateCaseNumber = async () => {
  const year = new Date().getFullYear();
  const prefix = `${year}-CV-`;
  
  const lastCase = await Case.findOne({ 
    caseNumber: { $regex: `^${prefix}` } 
  }).sort({ caseNumber: -1 });
  
  let nextNumber = 1;
  if (lastCase && lastCase.caseNumber) {
    const match = lastCase.caseNumber.match(/\d+$/);
    if (match) {
      nextNumber = parseInt(match[0]) + 1;
    }
  }
  
  const paddedNumber = String(nextNumber).padStart(4, '0');
  const caseNumber = `${prefix}${paddedNumber}`;
  
  const existing = await Case.findOne({ caseNumber });
  if (existing) {
    console.log(`⚠️ Case number ${caseNumber} already exists, generating new one...`);
    return generateCaseNumber();
  }
  
  return caseNumber;
};

// ============================================
// ROUTES
// ============================================

// GET all cases
router.get('/', authenticateToken, async (req, res) => {
  try {
    console.log('📥 Fetching all cases...');
    const cases = await Case.find({}).sort({ createdAt: -1 });
    console.log(`📊 Found ${cases.length} cases`);
    
    const formattedCases = cases.map(c => {
      const obj = c.toJSON ? c.toJSON() : { ...c };
      return {
        ...obj,
        id: obj._id?.toString() || obj.id,
        nameOfCourt: obj.nameOfCourt || '',
        natureOfCase: obj.natureOfCase || '',
        nextDateOfHearing: obj.nextDateOfHearing || '',
        copyOfSummon: obj.copyOfSummon || '',
        copyOfPlaint: obj.copyOfPlaint || '',
        relevantDepartmentalRecord: obj.relevantDepartmentalRecord || '',
        lawOfficer: obj.lawOfficer || { type: 'Department Representative', name: '', designation: '', officeAddress: '', officialNumber: '', cellNumber: '' },
        alternateLawOfficer: obj.alternateLawOfficer || { type: 'Department Representative', name: '', designation: '', officeAddress: '', officialNumber: '', cellNumber: '' },
        writtenStatements: obj.writtenStatements || [],
        attachments: obj.attachments || {},
        courtDetails: obj.courtDetails || {},
        caseNature: obj.caseNature || {},
        division: obj.division || '',
        district: obj.district || '',
        plaintiff: obj.plaintiff || '',
        defendant: obj.defendant || '',
      };
    });
    
    res.json({
      success: true,
      count: formattedCases.length,
      data: formattedCases
    });
  } catch (error) {
    console.error('❌ Error fetching cases:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// GET single case
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const caseItem = await Case.findById(req.params.id);
    if (!caseItem) {
      return res.status(404).json({ success: false, error: 'Case not found' });
    }
    const obj = caseItem.toJSON ? caseItem.toJSON() : { ...caseItem };
    res.json({ 
      success: true, 
      data: {
        ...obj,
        id: obj._id?.toString() || obj.id,
        nameOfCourt: obj.nameOfCourt || '',
        natureOfCase: obj.natureOfCase || '',
        nextDateOfHearing: obj.nextDateOfHearing || '',
        copyOfSummon: obj.copyOfSummon || '',
        copyOfPlaint: obj.copyOfPlaint || '',
        relevantDepartmentalRecord: obj.relevantDepartmentalRecord || '',
        lawOfficer: obj.lawOfficer || { type: 'Department Representative', name: '', designation: '', officeAddress: '', officialNumber: '', cellNumber: '' },
        alternateLawOfficer: obj.alternateLawOfficer || { type: 'Department Representative', name: '', designation: '', officeAddress: '', officialNumber: '', cellNumber: '' },
        writtenStatements: obj.writtenStatements || [],
      }
    });
  } catch (error) {
    console.error('❌ Error fetching case:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ============================================
// ✅ POST new case - WITH UNIQUE CASE NUMBER
// ============================================
router.post('/', authenticateToken, uploadFiles, async (req, res) => {
  try {
    console.log('📥 ========== CREATE CASE WITH FILES ==========');
    console.log('📥 Body keys:', Object.keys(req.body));
    console.log('📥 Files:', req.files ? Object.keys(req.files) : 'No files');
    
    // ✅ Get file paths from uploaded files
    const summonFile = req.files?.summonFile?.[0];
    const plaintFile = req.files?.plaintFile?.[0];
    const departmentalFile = req.files?.departmentalFile?.[0];
    
    // ✅ GENERATE UNIQUE CASE NUMBER
    let caseNumber = req.body.caseNumber;
    
    if (!caseNumber || caseNumber === '' || caseNumber === 'auto' || caseNumber === '2024-CV-0000') {
      caseNumber = await generateCaseNumber();
      console.log(`🆔 Auto-generated case number: ${caseNumber}`);
    } else {
      const existing = await Case.findOne({ caseNumber });
      if (existing) {
        console.log(`⚠️ Case number ${caseNumber} already exists, generating new one...`);
        caseNumber = await generateCaseNumber();
        console.log(`🆔 New case number: ${caseNumber}`);
      }
    }
    
    // ✅ Parse JSON fields if they came as strings
    let lawOfficer = req.body.lawOfficer;
    let alternateLawOfficer = req.body.alternateLawOfficer;
    let writtenStatements = req.body.writtenStatements;
    let attachments = req.body.attachments;
    
    try {
      if (typeof lawOfficer === 'string') lawOfficer = JSON.parse(lawOfficer);
      if (typeof alternateLawOfficer === 'string') alternateLawOfficer = JSON.parse(alternateLawOfficer);
      if (typeof writtenStatements === 'string') writtenStatements = JSON.parse(writtenStatements);
      if (typeof attachments === 'string') attachments = JSON.parse(attachments);
    } catch (e) {
      console.log('⚠️ Some fields were not JSON strings, using as-is');
    }
    
    // ✅ COMPLETE CASE DATA
    const caseData = {
      caseNumber: caseNumber,
      courtNo: req.body.courtNo || '',
      cmsNo: req.body.cmsNo || '',
      officeNo: req.body.officeNo || '',
      caseTitle: req.body.caseTitle || req.body.title || 'Untitled Case',
      title: req.body.title || req.body.caseTitle || 'Untitled Case',
      description: req.body.description || '',
      party: req.body.party || 'N/A',
      division: req.body.division || '',
      district: req.body.district || '',
      plaintiff: req.body.plaintiff || '',
      defendant: req.body.defendant || '',
      nameOfCourt: req.body.nameOfCourt || '',
      natureOfCase: req.body.natureOfCase || '',
      nextDateOfHearing: req.body.nextDateOfHearing || '',
      copyOfSummon: req.body.copyOfSummon || '',
      copyOfPlaint: req.body.copyOfPlaint || '',
      relevantDepartmentalRecord: req.body.relevantDepartmentalRecord || '',
      attachments: {
        copyOfSummon: req.body.copyOfSummon || '',
        copyOfPlaint: req.body.copyOfPlaint || '',
        relevantDepartmentalRecord: req.body.relevantDepartmentalRecord || '',
        summonFilePath: summonFile ? `/uploads/${summonFile.filename}` : '',
        plaintFilePath: plaintFile ? `/uploads/${plaintFile.filename}` : '',
        departmentalFilePath: departmentalFile ? `/uploads/${departmentalFile.filename}` : '',
      },
      lawOfficer: lawOfficer || { 
        type: 'Department Representative', 
        name: '', 
        designation: '', 
        officeAddress: '', 
        officialNumber: '', 
        cellNumber: '' 
      },
      alternateLawOfficer: alternateLawOfficer || { 
        type: 'Department Representative', 
        name: '', 
        designation: '', 
        officeAddress: '', 
        officialNumber: '', 
        cellNumber: '' 
      },
      writtenStatements: writtenStatements || [],
      status: req.body.status || 'active',
      priority: req.body.priority || 'Medium',
      caseType: req.body.caseType || 'Civil',
      caseNature: {
        trial: req.body.natureOfCase || '',
        appeal: req.body.caseNature?.appeal || '',
      },
      courtDetails: {
        courtName: req.body.nameOfCourt || '',
        district: req.body.district || '',
        courtPreviousDate: req.body.courtDetails?.courtPreviousDate || '',
        nextDate: req.body.nextDateOfHearing || '',
      },
      remarks: req.body.remarks || '',
      instituteDate: req.body.instituteDate || '',
      instituteNo: req.body.instituteNo || '',
      associate: {
        name: req.body.associate?.name || '',
        district: req.body.associate?.district || '',
      },
      amount: req.body.amount || 'N/A',
      judge: req.body.judge || 'N/A',
      attorneys: req.body.attorneys || 'N/A',
      assignedTo: req.body.assignedTo || 'N/A',
      location: req.body.location || 'N/A',
      court: req.body.court || 'N/A',
      nexthearing: req.body.nexthearing || req.body.nextDateOfHearing || 'N/A',
      hearings: parseInt(req.body.hearings) || 0,
      documentsCount: parseInt(req.body.documentsCount) || 0,
      date: req.body.date || new Date().toISOString().split('T')[0],
      userId: req.user.id,
      createdBy: req.user.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    console.log('📦 Final case data:', {
      caseNumber: caseData.caseNumber,
      copyOfSummon: caseData.copyOfSummon,
      copyOfPlaint: caseData.copyOfPlaint,
      relevantDepartmentalRecord: caseData.relevantDepartmentalRecord,
      attachments: caseData.attachments,
    });
    
    // ✅ Create case with unique number
    let savedCase;
    try {
      const newCase = new Case(caseData);
      savedCase = await newCase.save();
    } catch (error) {
      if (error.code === 11000) {
        console.log(`⚠️ Duplicate case number detected, retrying with new number...`);
        const newCaseNumber = await generateCaseNumber();
        console.log(`🆔 New case number for retry: ${newCaseNumber}`);
        caseData.caseNumber = newCaseNumber;
        const newCase = new Case(caseData);
        savedCase = await newCase.save();
      } else {
        throw error;
      }
    }
    
    console.log('✅ Case created:', savedCase._id);
    console.log('✅ Case number:', savedCase.caseNumber);
    
    const obj = savedCase.toJSON ? savedCase.toJSON() : { ...savedCase };
    const formattedCase = {
      ...obj,
      id: obj._id?.toString() || obj.id,
      nameOfCourt: obj.nameOfCourt || '',
      natureOfCase: obj.natureOfCase || '',
      nextDateOfHearing: obj.nextDateOfHearing || '',
      copyOfSummon: obj.copyOfSummon || '',
      copyOfPlaint: obj.copyOfPlaint || '',
      relevantDepartmentalRecord: obj.relevantDepartmentalRecord || '',
      lawOfficer: obj.lawOfficer || { type: 'Department Representative', name: '', designation: '', officeAddress: '', officialNumber: '', cellNumber: '' },
      alternateLawOfficer: obj.alternateLawOfficer || { type: 'Department Representative', name: '', designation: '', officeAddress: '', officialNumber: '', cellNumber: '' },
      writtenStatements: obj.writtenStatements || [],
    };
    
    res.status(201).json({ 
      success: true, 
      data: formattedCase,
      message: 'Case created successfully'
    });
  } catch (error) {
    console.error('❌ Error creating case:', error);
    res.status(400).json({ 
      success: false, 
      error: error.message,
      stack: error.stack 
    });
  }
});

// ============================================
// ✅ PUT update case - WITH FILE UPLOAD
// ============================================
router.put('/:id', authenticateToken, uploadFiles, async (req, res) => {
  try {
    const caseId = req.params.id;
    console.log(`📝 Updating case: ${caseId}`);
    console.log('📝 Update data:', JSON.stringify(req.body, null, 2));
    console.log('📝 Files:', req.files ? Object.keys(req.files) : 'No files');
    
    const existingCase = await Case.findById(caseId);
    if (!existingCase) {
      return res.status(404).json({ 
        success: false, 
        error: 'Case not found' 
      });
    }
    
    // ✅ Get file paths from uploaded files
    const summonFile = req.files?.summonFile?.[0];
    const plaintFile = req.files?.plaintFile?.[0];
    const departmentalFile = req.files?.departmentalFile?.[0];
    
    // ✅ Parse JSON fields if they came as strings
    let lawOfficer = req.body.lawOfficer;
    let alternateLawOfficer = req.body.alternateLawOfficer;
    let writtenStatements = req.body.writtenStatements;
    let attachments = req.body.attachments;
    
    try {
      if (typeof lawOfficer === 'string') lawOfficer = JSON.parse(lawOfficer);
      if (typeof alternateLawOfficer === 'string') alternateLawOfficer = JSON.parse(alternateLawOfficer);
      if (typeof writtenStatements === 'string') writtenStatements = JSON.parse(writtenStatements);
      if (typeof attachments === 'string') attachments = JSON.parse(attachments);
    } catch (e) {
      console.log('⚠️ Some fields were not JSON strings, using as-is');
    }
    
    // ✅ Prepare attachments with file paths
    const attachmentsData = {
      copyOfSummon: req.body.copyOfSummon || existingCase.attachments?.copyOfSummon || '',
      copyOfPlaint: req.body.copyOfPlaint || existingCase.attachments?.copyOfPlaint || '',
      relevantDepartmentalRecord: req.body.relevantDepartmentalRecord || existingCase.attachments?.relevantDepartmentalRecord || '',
      summonFilePath: summonFile ? `/uploads/${summonFile.filename}` : existingCase.attachments?.summonFilePath || '',
      plaintFilePath: plaintFile ? `/uploads/${plaintFile.filename}` : existingCase.attachments?.plaintFilePath || '',
      departmentalFilePath: departmentalFile ? `/uploads/${departmentalFile.filename}` : existingCase.attachments?.departmentalFilePath || '',
    };
    
    // ✅ BUILD COMPLETE UPDATE OBJECT
    const updateData = {
      caseNumber: req.body.caseNumber || existingCase.caseNumber,
      courtNo: req.body.courtNo || existingCase.courtNo || '',
      cmsNo: req.body.cmsNo || existingCase.cmsNo || '',
      officeNo: req.body.officeNo || existingCase.officeNo || '',
      caseTitle: req.body.caseTitle || req.body.title || existingCase.caseTitle,
      title: req.body.title || req.body.caseTitle || existingCase.title || existingCase.caseTitle,
      description: req.body.description !== undefined ? req.body.description : existingCase.description,
      party: req.body.party || existingCase.party || 'N/A',
      division: req.body.division || existingCase.division || '',
      district: req.body.district || existingCase.district || '',
      plaintiff: req.body.plaintiff || existingCase.plaintiff || '',
      defendant: req.body.defendant || existingCase.defendant || '',
      nameOfCourt: req.body.nameOfCourt || existingCase.nameOfCourt || '',
      natureOfCase: req.body.natureOfCase || existingCase.natureOfCase || '',
      nextDateOfHearing: req.body.nextDateOfHearing || existingCase.nextDateOfHearing || '',
      copyOfSummon: req.body.copyOfSummon || existingCase.copyOfSummon || '',
      copyOfPlaint: req.body.copyOfPlaint || existingCase.copyOfPlaint || '',
      relevantDepartmentalRecord: req.body.relevantDepartmentalRecord || existingCase.relevantDepartmentalRecord || '',
      attachments: attachmentsData,
      lawOfficer: lawOfficer || existingCase.lawOfficer || { 
        type: 'Department Representative', 
        name: '', 
        designation: '', 
        officeAddress: '', 
        officialNumber: '', 
        cellNumber: '' 
      },
      alternateLawOfficer: alternateLawOfficer || existingCase.alternateLawOfficer || { 
        type: 'Department Representative', 
        name: '', 
        designation: '', 
        officeAddress: '', 
        officialNumber: '', 
        cellNumber: '' 
      },
      writtenStatements: writtenStatements || existingCase.writtenStatements || [],
      status: req.body.status || existingCase.status,
      priority: req.body.priority || existingCase.priority,
      caseType: req.body.caseType || existingCase.caseType,
      caseNature: {
        trial: req.body.natureOfCase || existingCase.caseNature?.trial || '',
        appeal: req.body.caseNature?.appeal || existingCase.caseNature?.appeal || '',
      },
      courtDetails: {
        courtName: req.body.nameOfCourt || existingCase.courtDetails?.courtName || '',
        district: req.body.district || existingCase.courtDetails?.district || '',
        courtPreviousDate: req.body.courtDetails?.courtPreviousDate || existingCase.courtDetails?.courtPreviousDate || '',
        nextDate: req.body.nextDateOfHearing || existingCase.courtDetails?.nextDate || '',
      },
      remarks: req.body.remarks !== undefined ? req.body.remarks : existingCase.remarks,
      instituteDate: req.body.instituteDate || existingCase.instituteDate || '',
      instituteNo: req.body.instituteNo || existingCase.instituteNo || '',
      associate: {
        name: req.body.associate?.name || existingCase.associate?.name || '',
        district: req.body.associate?.district || existingCase.associate?.district || '',
      },
      amount: req.body.amount || existingCase.amount || 'N/A',
      judge: req.body.judge || existingCase.judge || 'N/A',
      attorneys: req.body.attorneys || existingCase.attorneys || 'N/A',
      assignedTo: req.body.assignedTo || existingCase.assignedTo || 'N/A',
      location: req.body.location || existingCase.location || 'N/A',
      court: req.body.court || existingCase.court || 'N/A',
      nexthearing: req.body.nexthearing || req.body.nextDateOfHearing || existingCase.nexthearing || 'N/A',
      hearings: req.body.hearings !== undefined ? parseInt(req.body.hearings) : existingCase.hearings,
      documentsCount: req.body.documentsCount !== undefined ? parseInt(req.body.documentsCount) : existingCase.documentsCount,
      date: req.body.date || existingCase.date,
      updatedAt: new Date()
    };
    
    console.log('📝 Update data prepared');
    
    const updatedCase = await Case.findByIdAndUpdate(
      caseId,
      updateData,
      { 
        new: true,
        runValidators: true,
        context: 'query'
      }
    );
    
    if (!updatedCase) {
      return res.status(404).json({ 
        success: false, 
        error: 'Case not found after update' 
      });
    }
    
    console.log('✅ Case updated successfully:', updatedCase._id);
    
    const obj = updatedCase.toJSON ? updatedCase.toJSON() : { ...updatedCase };
    const formattedCase = {
      ...obj,
      id: obj._id?.toString() || obj.id,
      nameOfCourt: obj.nameOfCourt || '',
      natureOfCase: obj.natureOfCase || '',
      nextDateOfHearing: obj.nextDateOfHearing || '',
      copyOfSummon: obj.copyOfSummon || '',
      copyOfPlaint: obj.copyOfPlaint || '',
      relevantDepartmentalRecord: obj.relevantDepartmentalRecord || '',
      lawOfficer: obj.lawOfficer || { type: 'Department Representative', name: '', designation: '', officeAddress: '', officialNumber: '', cellNumber: '' },
      alternateLawOfficer: obj.alternateLawOfficer || { type: 'Department Representative', name: '', designation: '', officeAddress: '', officialNumber: '', cellNumber: '' },
      writtenStatements: obj.writtenStatements || [],
    };
    
    res.json({ 
      success: true, 
      data: formattedCase,
      message: 'Case updated successfully'
    });
  } catch (error) {
    console.error('❌ Error updating case:', error);
    res.status(400).json({ 
      success: false, 
      error: error.message,
      stack: error.stack 
    });
  }
});

// ============================================
// ✅ PATCH update case - Generic (for partial updates)
// ============================================
router.patch('/:id', authenticateToken, async (req, res) => {
  try {
    const caseId = req.params.id;
    console.log(`📝 PATCH updating case: ${caseId}`);
    console.log('📝 PATCH data:', JSON.stringify(req.body, null, 2));
    
    // Validate case ID
    if (!caseId || caseId === 'undefined' || caseId === 'null') {
      return res.status(400).json({
        success: false,
        error: 'Invalid case ID'
      });
    }
    
    const existingCase = await Case.findById(caseId);
    if (!existingCase) {
      return res.status(404).json({
        success: false,
        error: 'Case not found'
      });
    }
    
    // ✅ Clean up the update data - remove undefined values
    const updateData = { ...req.body };
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined || updateData[key] === null) {
        delete updateData[key];
      }
    });
    
    // ✅ Handle attachments specially if they're being updated
    if (updateData.attachments) {
      // Merge with existing attachments
      updateData.attachments = {
        ...existingCase.attachments,
        ...updateData.attachments
      };
    }
    
    // ✅ Handle direct attachment fields
    const attachmentFields = ['copyOfSummon', 'copyOfPlaint', 'relevantDepartmentalRecord'];
    attachmentFields.forEach(field => {
      if (updateData[field] !== undefined) {
        // Also update in attachments object
        if (!updateData.attachments) {
          updateData.attachments = { ...existingCase.attachments };
        }
        updateData.attachments[field] = updateData[field];
      }
    });
    
    // ✅ Handle URL fields
    const urlFields = ['copyOfSummonUrl', 'copyOfPlaintUrl', 'relevantDepartmentalRecordUrl'];
    urlFields.forEach(field => {
      if (updateData[field] !== undefined) {
        // Store URL fields directly on the document
        updateData[field] = updateData[field];
      }
    });
    
    // ✅ Set updated timestamp
    updateData.updatedAt = new Date();
    
    console.log('📝 Cleaned PATCH data:', JSON.stringify(updateData, null, 2));
    
    // ✅ Update the case with PATCH
    const updatedCase = await Case.findByIdAndUpdate(
      caseId,
      { $set: updateData },
      {
        new: true,
        runValidators: true,
        context: 'query'
      }
    );
    
    if (!updatedCase) {
      return res.status(404).json({
        success: false,
        error: 'Case not found after update'
      });
    }
    
    console.log('✅ Case PATCH updated successfully:', updatedCase._id);
    
    const obj = updatedCase.toJSON ? updatedCase.toJSON() : { ...updatedCase };
    const formattedCase = {
      ...obj,
      id: obj._id?.toString() || obj.id,
      nameOfCourt: obj.nameOfCourt || '',
      natureOfCase: obj.natureOfCase || '',
      nextDateOfHearing: obj.nextDateOfHearing || '',
      copyOfSummon: obj.copyOfSummon || '',
      copyOfPlaint: obj.copyOfPlaint || '',
      relevantDepartmentalRecord: obj.relevantDepartmentalRecord || '',
      lawOfficer: obj.lawOfficer || { type: 'Department Representative', name: '', designation: '', officeAddress: '', officialNumber: '', cellNumber: '' },
      alternateLawOfficer: obj.alternateLawOfficer || { type: 'Department Representative', name: '', designation: '', officeAddress: '', officialNumber: '', cellNumber: '' },
      writtenStatements: obj.writtenStatements || [],
    };
    
    res.json({
      success: true,
      data: formattedCase,
      message: 'Case updated successfully'
    });
  } catch (error) {
    console.error('❌ Error PATCH updating case:', error);
    res.status(400).json({
      success: false,
      error: error.message,
      stack: error.stack
    });
  }
});

// PATCH update case status
router.patch('/:id/status', authenticateToken, async (req, res) => {
  try {
    const { status } = req.body;
    console.log(`📝 Updating status for case: ${req.params.id} → ${status}`);
    
    if (!status || !['active', 'pending', 'closed'].includes(status)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid status. Must be: active, pending, or closed' 
      });
    }
    
    const updatedCase = await Case.findByIdAndUpdate(
      req.params.id,
      { 
        status: status,
        updatedAt: new Date()
      },
      { new: true }
    );
    
    if (!updatedCase) {
      return res.status(404).json({ success: false, error: 'Case not found' });
    }
    
    console.log('✅ Case status updated:', updatedCase._id, '→', status);
    
    const obj = updatedCase.toJSON ? updatedCase.toJSON() : { ...updatedCase };
    const formattedCase = {
      ...obj,
      id: obj._id?.toString() || obj.id,
    };
    
    res.json({ 
      success: true, 
      data: formattedCase,
      message: `Status updated to ${status}`
    });
  } catch (error) {
    console.error('❌ Error updating status:', error);
    res.status(400).json({ success: false, error: error.message });
  }
});

// DELETE case
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    console.log('🗑️ Deleting case:', req.params.id);
    const deletedCase = await Case.findByIdAndDelete(req.params.id);
    if (!deletedCase) {
      return res.status(404).json({ success: false, error: 'Case not found' });
    }
    console.log('✅ Case deleted:', deletedCase._id);
    res.json({ success: true, data: { id: req.params.id } });
  } catch (error) {
    console.error('❌ Error deleting case:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;