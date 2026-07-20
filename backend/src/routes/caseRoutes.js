// backend/src/routes/caseRoutes.js
import express from 'express';
import Case from '../models/Case.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// GET all cases
router.get('/', authenticateToken, async (req, res) => {
  try {
    console.log('📥 Fetching all cases...');
    const cases = await Case.find({}).sort({ createdAt: -1 });
    console.log(`📊 Found ${cases.length} cases`);
    
    const formattedCases = cases.map(c => {
      const obj = c.toJSON();
      return {
        ...obj,
        id: obj._id.toString()
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
    const obj = caseItem.toJSON();
    res.json({ 
      success: true, 
      data: {
        ...obj,
        id: obj._id.toString()
      }
    });
  } catch (error) {
    console.error('❌ Error fetching case:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ✅ FIXED: POST new case - Now saves ALL fields
router.post('/', authenticateToken, async (req, res) => {
  try {
    console.log('📝 Creating new case with data:', req.body);
    
    // Get the last case number to generate next number
    const lastCase = await Case.findOne().sort({ caseNumber: -1 });
    let nextNumber = 1;
    if (lastCase && lastCase.caseNumber) {
      const match = lastCase.caseNumber.match(/\d+$/);
      if (match) {
        nextNumber = parseInt(match[0]) + 1;
      }
    }
    
    // ✅ COMPLETE CASE DATA - ALL FIELDS
    const caseData = {
      // Case Identification
      caseNumber: req.body.caseNumber || `2024-CV-${String(nextNumber).padStart(4, '0')}`,
      courtNo: req.body.courtNo || '',
      cmsNo: req.body.cmsNo || '',
      officeNo: req.body.officeNo || '',
      
      // Basic Information
      caseTitle: req.body.caseTitle || req.body.title || 'Untitled Case',
      title: req.body.title || req.body.caseTitle || 'Untitled Case',
      description: req.body.description || '',
      party: req.body.party || 'N/A',
      
      // Status & Priority
      status: req.body.status || 'active',
      priority: req.body.priority || 'Medium',
      caseType: req.body.caseType || 'Civil',
      
      // Case Nature
      caseNature: {
        trial: req.body.trial || req.body.caseNature?.trial || '',
        appeal: req.body.appeal || req.body.caseNature?.appeal || '',
      },
      
      // Court Details
      courtDetails: {
        courtName: req.body.courtName || req.body.courtDetails?.courtName || '',
        district: req.body.district || req.body.courtDetails?.district || '',
        courtPreviousDate: req.body.courtPreviousDate || req.body.courtDetails?.courtPreviousDate || '',
        nextDate: req.body.nextDate || req.body.courtDetails?.nextDate || '',
      },
      
      // Remarks
      remarks: req.body.remarks || '',
      
      // Institute
      instituteDate: req.body.instituteDate || '',
      instituteNo: req.body.instituteNo || '',
      
      // Associate
      associate: {
        name: req.body.associateName || req.body.associate?.name || '',
        district: req.body.associateDistrict || req.body.associate?.district || '',
      },
      
      // Additional fields
      amount: req.body.amount || 'N/A',
      judge: req.body.judge || 'N/A',
      attorneys: req.body.attorneys || 'N/A',
      assignedTo: req.body.assignedTo || 'N/A',
      location: req.body.location || 'N/A',
      court: req.body.court || 'N/A',
      nexthearing: req.body.nexthearing || 'N/A',
      hearings: parseInt(req.body.hearings) || 0,
      documentsCount: parseInt(req.body.documentsCount) || 0,
      date: req.body.date || new Date().toISOString().split('T')[0],
      
      // User
      userId: req.user.id,
    };
    
    console.log('📝 Final case data:', JSON.stringify(caseData, null, 2));
    
    const newCase = new Case(caseData);
    const savedCase = await newCase.save();
    console.log('✅ Case created:', savedCase._id);
    
    const obj = savedCase.toJSON();
    const formattedCase = {
      ...obj,
      id: obj._id.toString()
    };
    
    res.status(201).json({ 
      success: true, 
      data: formattedCase 
    });
  } catch (error) {
    console.error('❌ Error creating case:', error);
    res.status(400).json({ success: false, error: error.message });
  }
});

// ✅ FIXED: PUT update case - Now updates ALL fields
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const caseId = req.params.id;
    console.log(`📝 Updating case: ${caseId}`);
    console.log('📝 Update data:', JSON.stringify(req.body, null, 2));
    
    const existingCase = await Case.findById(caseId);
    if (!existingCase) {
      return res.status(404).json({ 
        success: false, 
        error: 'Case not found' 
      });
    }
    
    // ✅ BUILD COMPLETE UPDATE OBJECT - ALL FIELDS
    const updateData = {
      // Case Identification
      caseNumber: req.body.caseNumber || existingCase.caseNumber,
      courtNo: req.body.courtNo || existingCase.courtNo || '',
      cmsNo: req.body.cmsNo || existingCase.cmsNo || '',
      officeNo: req.body.officeNo || existingCase.officeNo || '',
      
      // Basic Information
      caseTitle: req.body.caseTitle || req.body.title || existingCase.caseTitle,
      title: req.body.title || req.body.caseTitle || existingCase.title || existingCase.caseTitle,
      description: req.body.description !== undefined ? req.body.description : existingCase.description,
      party: req.body.party || existingCase.party || 'N/A',
      
      // Status & Priority
      status: req.body.status || existingCase.status,
      priority: req.body.priority || existingCase.priority,
      caseType: req.body.caseType || existingCase.caseType,
      
      // Case Nature
      caseNature: {
        trial: req.body.trial || req.body.caseNature?.trial || existingCase.caseNature?.trial || '',
        appeal: req.body.appeal || req.body.caseNature?.appeal || existingCase.caseNature?.appeal || '',
      },
      
      // Court Details
      courtDetails: {
        courtName: req.body.courtName || req.body.courtDetails?.courtName || existingCase.courtDetails?.courtName || '',
        district: req.body.district || req.body.courtDetails?.district || existingCase.courtDetails?.district || '',
        courtPreviousDate: req.body.courtPreviousDate || req.body.courtDetails?.courtPreviousDate || existingCase.courtDetails?.courtPreviousDate || '',
        nextDate: req.body.nextDate || req.body.courtDetails?.nextDate || existingCase.courtDetails?.nextDate || '',
      },
      
      // Remarks
      remarks: req.body.remarks !== undefined ? req.body.remarks : existingCase.remarks,
      
      // Institute
      instituteDate: req.body.instituteDate || existingCase.instituteDate || '',
      instituteNo: req.body.instituteNo || existingCase.instituteNo || '',
      
      // Associate
      associate: {
        name: req.body.associateName || req.body.associate?.name || existingCase.associate?.name || '',
        district: req.body.associateDistrict || req.body.associate?.district || existingCase.associate?.district || '',
      },
      
      // Additional fields
      amount: req.body.amount || existingCase.amount || 'N/A',
      judge: req.body.judge || existingCase.judge || 'N/A',
      attorneys: req.body.attorneys || existingCase.attorneys || 'N/A',
      assignedTo: req.body.assignedTo || existingCase.assignedTo || 'N/A',
      location: req.body.location || existingCase.location || 'N/A',
      court: req.body.court || existingCase.court || 'N/A',
      nexthearing: req.body.nexthearing || existingCase.nexthearing || 'N/A',
      hearings: req.body.hearings !== undefined ? parseInt(req.body.hearings) : existingCase.hearings,
      documentsCount: req.body.documentsCount !== undefined ? parseInt(req.body.documentsCount) : existingCase.documentsCount,
      date: req.body.date || existingCase.date,
      
      // Update timestamp
      updatedAt: new Date()
    };
    
    console.log('📝 Update data prepared:', JSON.stringify(updateData, null, 2));
    
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
    
    const obj = updatedCase.toJSON();
    const formattedCase = {
      ...obj,
      id: obj._id.toString()
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
    
    const obj = updatedCase.toJSON();
    const formattedCase = {
      ...obj,
      id: obj._id.toString()
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