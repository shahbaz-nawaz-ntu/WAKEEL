// backend/src/controllers/caseController.js
import Case from '../models/Case.js';
import logger from '../utils/logger.js';

// @desc    Get all cases
// @route   GET /api/cases
// @access  Private
export const getCases = async (req, res) => {
  try {
    const { status, priority, caseType, search } = req.query;
    
    let query = { createdBy: req.user.id };
    
    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (caseType) query.caseType = caseType;
    
    if (search) {
      query.$or = [
        { caseTitle: { $regex: search, $options: 'i' } },
        { caseNumber: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { party: { $regex: search, $options: 'i' } },
      ];
    }
    
    const cases = await Case.find(query)
      .populate('createdBy', 'name email')
      .populate('assignedToUser', 'name email')
      .populate('clientId', 'name email')
      .sort({ createdAt: -1 });
    
    res.json({ success: true, count: cases.length, data: cases });
  } catch (error) {
    logger.error(`Get cases error: ${error}`);
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get single case
// @route   GET /api/cases/:id
// @access  Private
export const getCase = async (req, res) => {
  try {
    const caseItem = await Case.findOne({ 
      _id: req.params.id, 
      createdBy: req.user.id 
    })
      .populate('createdBy', 'name email')
      .populate('assignedToUser', 'name email')
      .populate('clientId', 'name email');
    
    if (!caseItem) {
      return res.status(404).json({ success: false, error: 'Case not found' });
    }
    
    res.json({ success: true, data: caseItem });
  } catch (error) {
    logger.error(`Get case error: ${error}`);
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Create a case - DEBUG VERSION
// @route   POST /api/cases
// @access  Private
export const createCase = async (req, res) => {
  try {
    console.log('📥 ========== CREATE CASE ==========');
    console.log('📥 Received body:', JSON.stringify(req.body, null, 2));
    console.log('📥 User ID:', req.user.id);
    console.log('📥 User email:', req.user.email);

    // Simplified case data - only required fields
    const caseData = {
      caseTitle: req.body.caseTitle || req.body.title || 'Untitled Case',
      createdBy: req.user.id,
    };

    // Add optional fields if they exist
    if (req.body.caseNo) caseData.caseNumber = req.body.caseNo;
    if (req.body.description) caseData.description = req.body.description;
    if (req.body.caseType) caseData.caseType = req.body.caseType;
    if (req.body.priority) caseData.priority = req.body.priority;
    if (req.body.status) caseData.status = req.body.status;
    if (req.body.assignedTo) caseData.assignedTo = req.body.assignedTo;
    if (req.body.judge) caseData.judge = req.body.judge;
    if (req.body.attorneys) caseData.attorneys = req.body.attorneys;
    if (req.body.remarks) caseData.remarks = req.body.remarks;
    if (req.body.amount) caseData.amount = req.body.amount;
    if (req.body.hearings !== undefined) caseData.hearings = req.body.hearings;
    if (req.body.courtName) caseData.courtName = req.body.courtName;

    console.log('📦 Final case data to save:', JSON.stringify(caseData, null, 2));

    // Try to create the case
    const caseItem = await Case.create(caseData);
    
    console.log('✅ Case created successfully:', caseItem._id);
    logger.info(`Case created: ${caseItem.caseNumber} by ${req.user.email}`);
    
    res.status(201).json({ success: true, data: caseItem });
  } catch (error) {
    console.error('❌ ========== ERROR ==========');
    console.error('❌ Error name:', error.name);
    console.error('❌ Error message:', error.message);
    console.error('❌ Error stack:', error.stack);
    
    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const errors = {};
      for (const key in error.errors) {
        errors[key] = error.errors[key].message;
      }
      console.error('❌ Validation errors:', errors);
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        details: errors,
      });
    }
    
    // Handle duplicate key error
    if (error.code === 11000) {
      console.error('❌ Duplicate key error:', error.keyPattern);
      return res.status(400).json({
        success: false,
        error: 'Duplicate entry',
        details: error.keyPattern,
      });
    }
    
    logger.error(`Create case error: ${error}`);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Failed to create case',
    });
  }
};

// @desc    Update a case
// @route   PUT /api/cases/:id
// @access  Private
export const updateCase = async (req, res) => {
  try {
    const caseItem = await Case.findOne({ 
      _id: req.params.id, 
      createdBy: req.user.id 
    });
    
    if (!caseItem) {
      return res.status(404).json({ success: false, error: 'Case not found' });
    }

    const updateData = {};
    
    const simpleFields = ['caseTitle', 'description', 'caseType', 'priority', 'status', 'assignedTo', 'courtName', 'courtNo', 'cmsNo', 'officeNo', 'judge', 'attorneys', 'remarks', 'instituteDate', 'instituteNo', 'amount', 'hearings', 'documentsCount'];
    
    simpleFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    if (req.body.title && !req.body.caseTitle) {
      updateData.caseTitle = req.body.title;
    }
    if (req.body.caseNo && !req.body.caseNumber) {
      updateData.caseNumber = req.body.caseNo;
    }

    updateData.updatedAt = Date.now();

    const updatedCase = await Case.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    logger.info(`Case updated: ${updatedCase.caseNumber}`);
    
    res.json({ success: true, data: updatedCase });
  } catch (error) {
    console.error('❌ Update case error:', error);
    logger.error(`Update case error: ${error}`);
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Delete a case
// @route   DELETE /api/cases/:id
// @access  Private
export const deleteCase = async (req, res) => {
  try {
    const caseItem = await Case.findOne({ 
      _id: req.params.id, 
      createdBy: req.user.id 
    });
    
    if (!caseItem) {
      return res.status(404).json({ success: false, error: 'Case not found' });
    }

    await caseItem.deleteOne();
    
    logger.info(`Case deleted: ${caseItem.caseNumber}`);
    
    res.json({ success: true, data: {} });
  } catch (error) {
    logger.error(`Delete case error: ${error}`);
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Update case status
// @route   PATCH /api/cases/:id/status
// @access  Private
export const updateCaseStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    const caseItem = await Case.findOne({ 
      _id: req.params.id, 
      createdBy: req.user.id 
    });
    
    if (!caseItem) {
      return res.status(404).json({ success: false, error: 'Case not found' });
    }

    caseItem.status = status;
    caseItem.updatedAt = Date.now();
    await caseItem.save();
    
    logger.info(`Case status updated: ${caseItem.caseNumber} -> ${status}`);
    
    res.json({ success: true, data: caseItem });
  } catch (error) {
    logger.error(`Update case status error: ${error}`);
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get case statistics
// @route   GET /api/cases/stats
// @access  Private
export const getCaseStats = async (req, res) => {
  try {
    const cases = await Case.find({ createdBy: req.user.id });
    
    const total = cases.length;
    const active = cases.filter(c => c.status === 'active').length;
    const pending = cases.filter(c => c.status === 'pending').length;
    const closed = cases.filter(c => c.status === 'closed').length;
    
    const priorityStats = {
      High: cases.filter(c => c.priority === 'High').length,
      Urgent: cases.filter(c => c.priority === 'Urgent').length,
      Medium: cases.filter(c => c.priority === 'Medium').length,
      Low: cases.filter(c => c.priority === 'Low').length,
    };
    
    const typeStats = {};
    cases.forEach(c => {
      if (c.caseType) {
        typeStats[c.caseType] = (typeStats[c.caseType] || 0) + 1;
      }
    });
    
    res.json({
      success: true,
      data: {
        total,
        active,
        pending,
        closed,
        priority: priorityStats,
        types: typeStats,
      },
    });
  } catch (error) {
    logger.error(`Get case stats error: ${error}`);
    res.status(500).json({ success: false, error: error.message });
  }
};