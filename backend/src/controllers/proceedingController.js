// backend/src/controllers/proceedingController.js
import Proceeding from '../models/Proceeding.js';
import Case from '../models/Case.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// ✅ Get __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Define the uploads directory path
const UPLOADS_DIR = path.join(__dirname, '../uploads');
const PROCEEDINGS_DIR = path.join(UPLOADS_DIR, 'proceedings');

// ============================================
// ✅ GET ALL PROCEEDINGS - FIXED
// ============================================
export const getAllProceedings = async (req, res) => {
  try {
    console.log('📋 Fetching all proceedings...');
    
    const proceedings = await Proceeding.find()
      .sort({ createdAt: -1 });

    console.log(`✅ Found ${proceedings.length} proceedings`);

    const formattedData = proceedings.map(p => {
      const plain = p.toObject ? p.toObject() : p;
      return {
        ...plain,
        caseId: plain.caseId,
        caseDetails: plain.caseDetails || null
      };
    });

    res.status(200).json({
      success: true,
      data: formattedData
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
// ✅ GET PROCEEDINGS BY CASE - FIXED
// ============================================
export const getProceedingsByCase = async (req, res) => {
  try {
    const { caseId } = req.params;
    console.log(`📋 Fetching proceedings for case: ${caseId}`);

    const proceedings = await Proceeding.find({ caseId })
      .sort({ createdAt: -1 });

    const formattedData = proceedings.map(p => {
      const plain = p.toObject ? p.toObject() : p;
      return {
        ...plain,
        caseId: plain.caseId,
        caseDetails: plain.caseDetails || null
      };
    });

    console.log(`✅ Found ${formattedData.length} proceedings for case ${caseId}`);

    res.status(200).json({
      success: true,
      data: formattedData
    });
  } catch (error) {
    console.error('❌ Error fetching proceedings by case:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// ============================================
// ✅ GET SINGLE PROCEEDING
// ============================================
export const getProceeding = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`📋 Fetching proceeding: ${id}`);

    const proceeding = await Proceeding.findById(id);

    if (!proceeding) {
      return res.status(404).json({
        success: false,
        error: 'Proceeding not found'
      });
    }

    const plain = proceeding.toObject ? proceeding.toObject() : proceeding;

    res.status(200).json({
      success: true,
      data: {
        ...plain,
        caseId: plain.caseId
      }
    });
  } catch (error) {
    console.error('❌ Error fetching proceeding:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// ============================================
// ✅ CREATE PROCEEDING - FIXED
// ============================================
export const createProceeding = async (req, res) => {
  try {
    console.log('📝 Creating proceeding...');
    console.log('📝 Request body:', req.body);
    console.log('📝 User:', req.user?._id);

    const { 
      caseId, 
      createdBy, 
      progress, 
      nextHearingDate, 
      status, 
      attachment, 
      date 
    } = req.body;

    if (!caseId) {
      return res.status(400).json({
        success: false,
        error: 'Case ID is required'
      });
    }

    const caseExists = await Case.findById(caseId);
    if (!caseExists) {
      return res.status(404).json({
        success: false,
        error: 'Case not found'
      });
    }

    const proceedingData = {
      caseId: caseId,
      createdBy: createdBy || req.user?.name || 'Unknown User',
      progress: progress || '',
      nextHearingDate: nextHearingDate || null,
      status: status || 'Pending for arguments.',
      attachment: attachment || null,
      date: date || new Date(),
      title: caseExists.caseNumber || caseExists.title || `Proceeding ${new Date().toLocaleDateString()}`,
      description: progress || '',
      userId: req.user?._id || req.user?.id
    };

    console.log('📝 Proceeding data:', proceedingData);

    const proceeding = new Proceeding(proceedingData);
    await proceeding.save();

    const plainProceeding = proceeding.toObject ? proceeding.toObject() : proceeding;
    
    console.log('✅ Proceeding created:', plainProceeding);

    res.status(201).json({
      success: true,
      data: {
        ...plainProceeding,
        caseId: plainProceeding.caseId
      }
    });
  } catch (error) {
    console.error('❌ Error creating proceeding:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// ============================================
// ✅ UPDATE PROCEEDING - FIXED
// ============================================
export const updateProceeding = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`📝 Updating proceeding: ${id}`);
    console.log('📝 Update data:', req.body);

    const proceeding = await Proceeding.findById(id);
    if (!proceeding) {
      return res.status(404).json({
        success: false,
        error: 'Proceeding not found'
      });
    }

    const allowedFields = ['createdBy', 'progress', 'nextHearingDate', 'status', 'attachment', 'date', 'description'];
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        proceeding[field] = req.body[field];
      }
    });

    await proceeding.save();

    const plainProceeding = proceeding.toObject ? proceeding.toObject() : proceeding;

    console.log('✅ Proceeding updated:', plainProceeding);

    res.status(200).json({
      success: true,
      data: {
        ...plainProceeding,
        caseId: plainProceeding.caseId
      }
    });
  } catch (error) {
    console.error('❌ Error updating proceeding:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// ============================================
// ✅ DELETE PROCEEDING
// ============================================
export const deleteProceeding = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`🗑️ Deleting proceeding: ${id}`);

    const proceeding = await Proceeding.findById(id);
    if (!proceeding) {
      return res.status(404).json({
        success: false,
        error: 'Proceeding not found'
      });
    }

    await proceeding.deleteOne();

    console.log('✅ Proceeding deleted');

    res.status(200).json({
      success: true,
      message: 'Proceeding deleted successfully'
    });
  } catch (error) {
    console.error('❌ Error deleting proceeding:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// ============================================
// 📎 DOCUMENT HANDLERS - FIXED PATH
// ============================================
export const uploadDocument = async (req, res) => {
  try {
    const { id, type } = req.params;
    console.log(`📎 Uploading document for proceeding ${id}, type: ${type}`);

    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No file uploaded'
      });
    }

    const proceeding = await Proceeding.findById(id);
    if (!proceeding) {
      return res.status(404).json({
        success: false,
        error: 'Proceeding not found'
      });
    }

    if (!proceeding.documents) {
      proceeding.documents = { petitioner: [], research: [], defendant: [] };
    }
    
    if (!proceeding.documents[type]) {
      proceeding.documents[type] = [];
    }

    proceeding.documents[type].push(req.file.filename);
    await proceeding.save();

    const plain = proceeding.toObject ? proceeding.toObject() : proceeding;

    res.status(200).json({
      success: true,
      message: 'Document uploaded successfully',
      data: {
        ...plain,
        caseId: plain.caseId
      }
    });
  } catch (error) {
    console.error('❌ Error uploading document:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

export const deleteDocument = async (req, res) => {
  try {
    const { id, type, index } = req.params;
    console.log(`🗑️ Deleting document from proceeding ${id}, type: ${type}, index: ${index}`);

    const proceeding = await Proceeding.findById(id);
    if (!proceeding) {
      return res.status(404).json({
        success: false,
        error: 'Proceeding not found'
      });
    }

    if (!proceeding.documents || !proceeding.documents[type]) {
      return res.status(404).json({
        success: false,
        error: 'Document not found'
      });
    }

    const docIndex = parseInt(index);
    if (docIndex < 0 || docIndex >= proceeding.documents[type].length) {
      return res.status(404).json({
        success: false,
        error: 'Document not found'
      });
    }

    proceeding.documents[type].splice(docIndex, 1);
    await proceeding.save();

    const plain = proceeding.toObject ? proceeding.toObject() : proceeding;

    res.status(200).json({
      success: true,
      message: 'Document deleted successfully',
      data: {
        ...plain,
        caseId: plain.caseId
      }
    });
  } catch (error) {
    console.error('❌ Error deleting document:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// ============================================
// ✅ VIEW DOCUMENT - FIXED PATH
// ============================================
export const viewDocument = async (req, res) => {
  try {
    const { id, type, index } = req.params;
    console.log(`👁️ Viewing document from proceeding ${id}, type: ${type}, index: ${index}`);

    const proceeding = await Proceeding.findById(id);
    if (!proceeding) {
      return res.status(404).json({
        success: false,
        error: 'Proceeding not found'
      });
    }

    if (!proceeding.documents || !proceeding.documents[type]) {
      return res.status(404).json({
        success: false,
        error: 'Document not found'
      });
    }

    const docIndex = parseInt(index);
    if (docIndex < 0 || docIndex >= proceeding.documents[type].length) {
      return res.status(404).json({
        success: false,
        error: 'Document not found'
      });
    }

    const filename = proceeding.documents[type][docIndex];
    
    // ✅ FIXED: Use the correct path - same as in proceedingRoutes.js
    const filepath = path.join(PROCEEDINGS_DIR, filename);
    
    console.log(`📁 Looking for file at: ${filepath}`);

    if (!fs.existsSync(filepath)) {
      console.log(`❌ File not found: ${filepath}`);
      // ✅ Try alternative path as fallback
      const altPath = path.join(process.cwd(), 'uploads', 'proceedings', filename);
      console.log(`🔄 Trying alternative path: ${altPath}`);
      
      if (fs.existsSync(altPath)) {
        console.log(`✅ Found file at alternative path`);
        return res.sendFile(altPath);
      }
      
      return res.status(404).json({
        success: false,
        error: 'File not found on server'
      });
    }

    console.log(`✅ Sending file: ${filepath}`);
    res.sendFile(filepath);
  } catch (error) {
    console.error('❌ Error viewing document:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};