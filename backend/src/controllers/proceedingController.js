// backend/src/controllers/proceedingController.js
import Proceeding from '../models/Proceeding.js';
import Case from '../models/Case.js';
import logger from '../utils/logger.js';
import fs from 'fs';
import path from 'path';
import jwt from 'jsonwebtoken';

// ============================================
// GET ALL PROCEEDINGS
// ============================================
export const getAllProceedings = async (req, res) => {
  try {
    console.log('📋 Fetching all proceedings for user:', req.user.id);
    const proceedings = await Proceeding.find({ userId: req.user.id })
      .sort({ date: -1 });
    console.log(`📋 Found ${proceedings.length} proceedings`);
    res.json({
      success: true,
      count: proceedings.length,
      data: proceedings,
    });
  } catch (error) {
    console.error('❌ Error fetching proceedings:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// ============================================
// GET PROCEEDINGS BY CASE
// ============================================
export const getProceedingsByCase = async (req, res) => {
  try {
    const { caseId } = req.params;
    
    const proceedings = await Proceeding.find({ 
      caseId: caseId,
      userId: req.user.id
    }).sort({ date: -1 });
    
    res.json({
      success: true,
      count: proceedings.length,
      data: proceedings,
    });
  } catch (error) {
    logger.error(`Get proceedings error: ${error}`);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ============================================
// GET SINGLE PROCEEDING
// ============================================
export const getProceeding = async (req, res) => {
  try {
    const proceeding = await Proceeding.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });
    
    if (!proceeding) {
      return res.status(404).json({ success: false, error: 'Proceeding not found' });
    }
    
    res.json({ success: true, data: proceeding });
  } catch (error) {
    logger.error(`Get proceeding error: ${error}`);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ============================================
// CREATE PROCEEDING
// ============================================
export const createProceeding = async (req, res) => {
  try {
    console.log('📥 Creating proceeding with data:', req.body);

    const caseExists = await Case.findOne({ _id: req.body.caseId, userId: req.user.id });
    if (!caseExists) {
      return res.status(404).json({ 
        success: false, 
        error: 'Case not found or you do not have access' 
      });
    }

    let attendees = [];
    if (req.body.attendees) {
      if (Array.isArray(req.body.attendees)) {
        attendees = req.body.attendees;
      } else if (typeof req.body.attendees === 'string') {
        attendees = req.body.attendees.split(',').map(a => a.trim()).filter(a => a);
      }
    }

    const proceedingData = {
      title: req.body.title || 'Proceeding',
      caseId: req.body.caseId,
      type: req.body.type || 'Hearing',
      status: req.body.status || 'Scheduled',
      date: req.body.date || new Date(),
      time: req.body.time || '',
      location: req.body.location || '',
      judge: req.body.judge || '',
      description: req.body.description || '',
      attendees: attendees,
      documents: {
        petitioner: req.body.documents?.petitioner || [],
        research: req.body.documents?.research || [],
        defendant: req.body.documents?.defendant || [],
      },
      userId: req.user.id,
    };

    const proceeding = await Proceeding.create(proceedingData);
    
    logger.info(`Proceeding created: ${proceeding.title} by ${req.user.email}`);
    
    res.status(201).json({
      success: true,
      data: proceeding,
    });
  } catch (error) {
    console.error('❌ Create proceeding error:', error);
    logger.error(`Create proceeding error: ${error}`);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ============================================
// UPDATE PROCEEDING
// ============================================
export const updateProceeding = async (req, res) => {
  try {
    let proceeding = await Proceeding.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });
    
    if (!proceeding) {
      return res.status(404).json({ success: false, error: 'Proceeding not found' });
    }

    let attendees = proceeding.attendees || [];
    if (req.body.attendees) {
      if (Array.isArray(req.body.attendees)) {
        attendees = req.body.attendees;
      } else if (typeof req.body.attendees === 'string') {
        attendees = req.body.attendees.split(',').map(a => a.trim()).filter(a => a);
      }
    }

    const updateData = {
      title: req.body.title || proceeding.title,
      type: req.body.type || proceeding.type,
      status: req.body.status || proceeding.status,
      date: req.body.date || proceeding.date,
      time: req.body.time || proceeding.time,
      location: req.body.location || proceeding.location,
      judge: req.body.judge || proceeding.judge,
      description: req.body.description || proceeding.description,
      attendees: attendees,
      documents: {
        petitioner: req.body.documents?.petitioner || proceeding.documents?.petitioner || [],
        research: req.body.documents?.research || proceeding.documents?.research || [],
        defendant: req.body.documents?.defendant || proceeding.documents?.defendant || [],
      },
      updatedAt: new Date(),
    };

    const updated = await Proceeding.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    logger.info(`Proceeding updated: ${updated.title}`);
    
    res.json({
      success: true,
      data: updated,
    });
  } catch (error) {
    console.error('❌ Update proceeding error:', error);
    logger.error(`Update proceeding error: ${error}`);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ============================================
// DELETE PROCEEDING
// ============================================
export const deleteProceeding = async (req, res) => {
  try {
    const proceeding = await Proceeding.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });
    
    if (!proceeding) {
      return res.status(404).json({ success: false, error: 'Proceeding not found' });
    }

    await proceeding.deleteOne();
    
    logger.info(`Proceeding deleted: ${proceeding.title}`);
    
    res.json({
      success: true,
      message: 'Proceeding deleted successfully',
    });
  } catch (error) {
    logger.error(`Delete proceeding error: ${error}`);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ============================================
// UPLOAD DOCUMENT
// ============================================
export const uploadDocument = async (req, res) => {
  try {
    const proceedingId = req.params.id;
    const docType = req.params.type;
    const file = req.file;
    
    console.log(`📤 Uploading ${docType} document to proceeding: ${proceedingId}`);
    console.log('📄 File:', file);
    
    if (!['petitioner', 'research', 'defendant'].includes(docType)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid document type. Must be: petitioner, research, or defendant'
      });
    }
    
    if (!file) {
      return res.status(400).json({
        success: false,
        error: 'No file uploaded'
      });
    }

    const proceeding = await Proceeding.findOne({
      _id: proceedingId,
      userId: req.user.id,
    });
    
    if (!proceeding) {
      return res.status(404).json({
        success: false,
        error: 'Proceeding not found'
      });
    }

    if (!proceeding.documents) {
      proceeding.documents = { petitioner: [], research: [], defendant: [] };
    }
    
    if (!proceeding.documents[docType]) {
      proceeding.documents[docType] = [];
    }
    
    const docName = file.originalname;
    proceeding.documents[docType].push(docName);
    proceeding.updatedAt = Date.now();
    
    await proceeding.save();
    
    console.log(`✅ Document uploaded: ${docName} to ${docType}`);
    
    res.json({
      success: true,
      data: proceeding,
      document: {
        name: docName,
        type: docType,
        size: file.size,
        path: file.path
      },
      message: 'Document uploaded successfully'
    });
  } catch (error) {
    console.error('❌ Upload document error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// ============================================
// DELETE DOCUMENT
// ============================================
export const deleteDocument = async (req, res) => {
  try {
    const proceedingId = req.params.id;
    const docType = req.params.type;
    const docIndex = parseInt(req.params.index);
    
    console.log(`🗑️ Deleting document from ${docType} index ${docIndex}`);
    
    if (!['petitioner', 'research', 'defendant'].includes(docType)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid document type'
      });
    }

    const proceeding = await Proceeding.findOne({
      _id: proceedingId,
      userId: req.user.id,
    });
    
    if (!proceeding) {
      return res.status(404).json({
        success: false,
        error: 'Proceeding not found'
      });
    }

    if (!proceeding.documents || !proceeding.documents[docType]) {
      return res.status(404).json({
        success: false,
        error: 'Document not found'
      });
    }

    if (docIndex >= proceeding.documents[docType].length) {
      return res.status(404).json({
        success: false,
        error: 'Document index out of range'
      });
    }

    const docName = proceeding.documents[docType][docIndex];
    proceeding.documents[docType].splice(docIndex, 1);
    proceeding.updatedAt = Date.now();
    
    await proceeding.save();
    
    console.log(`✅ Document deleted: ${docName}`);
    
    res.json({
      success: true,
      data: proceeding,
      message: 'Document deleted successfully'
    });
  } catch (error) {
    console.error('❌ Delete document error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// ============================================
// ✅ VIEW DOCUMENT - FIXED (Handles both header and query param)
// ============================================
export const viewDocument = async (req, res) => {
  try {
    const proceedingId = req.params.id;
    const docType = req.params.type;
    const docIndex = parseInt(req.params.index);
    
    console.log(`📄 Viewing document: ${docType} ${docIndex} from proceeding: ${proceedingId}`);
    
    // ✅ Get user ID from token (either in header or query param)
    let userId = null;
    let token = null;
    
    // Check Authorization header first
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
      console.log('🔑 Token from Authorization header');
    } 
    // Check query parameter
    else if (req.query.token) {
      token = req.query.token;
      console.log('🔑 Token from query parameter');
    }
    
    if (!token) {
      console.log('❌ No token provided');
      return res.status(401).json({
        success: false,
        error: 'Authentication required. Please login.'
      });
    }
    
    // ✅ Verify the token
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'jurisflow_super_secret_key_2024_secure');
      userId = decoded.id;
      console.log('✅ Token verified for user:', userId);
    } catch (err) {
      console.log('❌ Token verification failed:', err.message);
      return res.status(401).json({
        success: false,
        error: 'Invalid or expired token'
      });
    }
    
    if (!['petitioner', 'research', 'defendant'].includes(docType)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid document type'
      });
    }

    const proceeding = await Proceeding.findOne({
      _id: proceedingId,
      userId: userId,
    });
    
    if (!proceeding) {
      return res.status(404).json({
        success: false,
        error: 'Proceeding not found'
      });
    }

    if (!proceeding.documents || !proceeding.documents[docType]) {
      return res.status(404).json({
        success: false,
        error: 'Document section not found'
      });
    }

    if (docIndex >= proceeding.documents[docType].length) {
      return res.status(404).json({
        success: false,
        error: 'Document index out of range'
      });
    }

    const docName = proceeding.documents[docType][docIndex];
    console.log('📄 Document name:', docName);
    
    // Get the file path
    const uploadDir = 'uploads/proceedings';
    
    // Check if directory exists
    if (!fs.existsSync(uploadDir)) {
      console.log('❌ Upload directory does not exist');
      return res.json({
        success: true,
        data: {
          name: docName,
          type: docType,
          index: docIndex,
          proceedingId: proceedingId,
          message: 'Document found in database. File directory not available.'
        }
      });
    }
    
    // Get all files in the directory
    const files = fs.readdirSync(uploadDir);
    console.log('📂 Files in uploads folder:', files);
    
    // Find the file that matches the name
    const file = files.find(f => {
      const baseName = path.basename(f, path.extname(f));
      const searchName = docName.replace(/\s/g, '_');
      const searchName2 = path.basename(docName, path.extname(docName)).replace(/\s/g, '_');
      return baseName.includes(searchName) || baseName.includes(searchName2);
    });
    
    if (!file) {
      console.log('❌ File not found for:', docName);
      return res.json({
        success: true,
        data: {
          name: docName,
          type: docType,
          index: docIndex,
          proceedingId: proceedingId,
          message: 'Document found in database but file not yet uploaded to server.'
        }
      });
    }
    
    const filePath = path.join(uploadDir, file);
    console.log('✅ File found at:', filePath);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.json({
        success: true,
        data: {
          name: docName,
          type: docType,
          index: docIndex,
          proceedingId: proceedingId,
          message: 'Document found but file is missing from server.'
        }
      });
    }
    
    // Send the file for download
    res.download(filePath, docName);
  } catch (error) {
    console.error('❌ View document error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};