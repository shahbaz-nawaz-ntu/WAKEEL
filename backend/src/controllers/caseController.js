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
    
    // ✅ Format cases to ensure all fields are present
    const formattedCases = cases.map(c => {
      const obj = c.toJSON ? c.toJSON() : { ...c };
      return {
        ...obj,
        id: obj._id?.toString() || obj.id,
        // ✅ Fields from AddCaseModal
        nameOfCourt: obj.nameOfCourt || '',
        natureOfCase: obj.natureOfCase || '',
        nextDateOfHearing: obj.nextDateOfHearing || '',
        copyOfSummon: obj.copyOfSummon || '',
        copyOfPlaint: obj.copyOfPlaint || '',
        relevantDepartmentalRecord: obj.relevantDepartmentalRecord || '',
        lawOfficer: obj.lawOfficer || { type: 'Department Representative', name: '', designation: '', officeAddress: '', officialNumber: '', cellNumber: '' },
        alternateLawOfficer: obj.alternateLawOfficer || { type: 'Department Representative', name: '', designation: '', officeAddress: '', officialNumber: '', cellNumber: '' },
        writtenStatements: obj.writtenStatements || [],
        caseTitle: obj.caseTitle || obj.title || '',
        title: obj.title || obj.caseTitle || '',
        plaintiff: obj.plaintiff || '',
        defendant: obj.defendant || '',
        division: obj.division || '',
        district: obj.district || '',
        caseNumber: obj.caseNumber || '',
        status: obj.status || 'active',
        courtDetails: obj.courtDetails || {},
        caseNature: obj.caseNature || {},
        attachments: obj.attachments || {},
      };
    });
    
    res.json({ success: true, count: formattedCases.length, data: formattedCases });
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
    
    const obj = caseItem.toJSON ? caseItem.toJSON() : { ...caseItem };
    const formattedCase = {
      ...obj,
      id: obj._id?.toString() || obj.id,
      // ✅ Fields from AddCaseModal
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
    
    res.json({ success: true, data: formattedCase });
  } catch (error) {
    logger.error(`Get case error: ${error}`);
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Create a case - FIXED
// @route   POST /api/cases
// @access  Private
export const createCase = async (req, res) => {
  try {
    console.log('📥 ========== CREATE CASE ==========');
    console.log('📥 Received body:', JSON.stringify(req.body, null, 2));
    console.log('📥 User ID:', req.user.id);

    // ✅ Get all fields from request body
    const caseData = {
      // ✅ Required fields
      createdBy: req.user.id,
      
      // ✅ Case fields
      caseTitle: req.body.caseTitle || req.body.title || 'Untitled Case',
      title: req.body.title || req.body.caseTitle || 'Untitled Case',
      caseNumber: req.body.caseNumber || '',
      division: req.body.division || '',
      district: req.body.district || '',
      plaintiff: req.body.plaintiff || '',
      defendant: req.body.defendant || '',
      status: req.body.status || 'active',
      caseType: req.body.caseType || 'Civil',
      priority: req.body.priority || 'Medium',
      
      // ✅ Court fields
      nameOfCourt: req.body.nameOfCourt || '',
      courtName: req.body.courtName || req.body.nameOfCourt || '',
      courtDetails: req.body.courtDetails || {},
      
      // ✅ Case nature
      natureOfCase: req.body.natureOfCase || '',
      caseNature: req.body.caseNature || {},
      
      // ✅ Dates
      nextDateOfHearing: req.body.nextDateOfHearing || '',
      nextDate: req.body.nextDate || req.body.nextDateOfHearing || '',
      nexthearing: req.body.nexthearing || req.body.nextDateOfHearing || '',
      
      // ✅ Attachments
      copyOfSummon: req.body.copyOfSummon || '',
      copyOfPlaint: req.body.copyOfPlaint || '',
      relevantDepartmentalRecord: req.body.relevantDepartmentalRecord || '',
      attachments: req.body.attachments || {},
      
      // ✅ Law Officers
      lawOfficer: req.body.lawOfficer || { 
        type: 'Department Representative', 
        name: '', 
        designation: '', 
        officeAddress: '', 
        officialNumber: '', 
        cellNumber: '' 
      },
      alternateLawOfficer: req.body.alternateLawOfficer || { 
        type: 'Department Representative', 
        name: '', 
        designation: '', 
        officeAddress: '', 
        officialNumber: '', 
        cellNumber: '' 
      },
      
      // ✅ Written Statements
      writtenStatements: req.body.writtenStatements || [],
      
      // ✅ Other fields
      party: req.body.party || 'N/A',
      amount: req.body.amount || 'N/A',
      judge: req.body.judge || 'N/A',
      assignedTo: req.body.assignedTo || 'N/A',
      hearings: req.body.hearings || 0,
      date: req.body.date || new Date().toISOString().split('T')[0],
      description: req.body.description || '',
      remarks: req.body.remarks || '',
      courtNo: req.body.courtNo || '',
      cmsNo: req.body.cmsNo || '',
      officeNo: req.body.officeNo || '',
      instituteDate: req.body.instituteDate || '',
      instituteNo: req.body.instituteNo || '',
      documentsCount: req.body.documentsCount || 0,
      documents: req.body.documents || {},
    };

    console.log('📦 Final case data to save:', JSON.stringify(caseData, null, 2));

    const caseItem = await Case.create(caseData);
    
    console.log('✅ Case created successfully:', caseItem._id);
    logger.info(`Case created: ${caseItem.caseNumber} by ${req.user.email}`);
    
    // ✅ Return the created case with all fields
    const createdCase = await Case.findById(caseItem._id);
    const obj = createdCase.toJSON ? createdCase.toJSON() : { ...createdCase };
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
    
    res.status(201).json({ success: true, data: formattedCase });
  } catch (error) {
    console.error('❌ ========== ERROR ==========');
    console.error('❌ Error name:', error.name);
    console.error('❌ Error message:', error.message);
    console.error('❌ Error stack:', error.stack);
    
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

// @desc    Update a case - FIXED
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

    console.log('📝 Updating case:', req.params.id);
    console.log('📝 Update data:', req.body);

    // ✅ All fields that can be updated
    const updateFields = [
      'caseTitle', 'title', 'caseNumber', 'division', 'district',
      'plaintiff', 'defendant', 'status', 'caseType', 'priority',
      'nameOfCourt', 'courtName', 'courtDetails',
      'natureOfCase', 'caseNature',
      'nextDateOfHearing', 'nextDate', 'nexthearing',
      'copyOfSummon', 'copyOfPlaint', 'relevantDepartmentalRecord', 'attachments',
      'lawOfficer', 'alternateLawOfficer',
      'writtenStatements',
      'party', 'amount', 'judge', 'assignedTo', 'hearings', 'date',
      'description', 'remarks', 'courtNo', 'cmsNo', 'officeNo',
      'instituteDate', 'instituteNo', 'documentsCount', 'documents'
    ];
    
    updateFields.forEach(field => {
      if (req.body[field] !== undefined && req.body[field] !== null) {
        caseItem[field] = req.body[field];
      }
    });

    caseItem.updatedAt = Date.now();
    await caseItem.save();

    const obj = caseItem.toJSON ? caseItem.toJSON() : { ...caseItem };
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

    logger.info(`Case updated: ${caseItem.caseNumber}`);
    
    res.json({ success: true, data: formattedCase });
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
    
    const obj = caseItem.toJSON ? caseItem.toJSON() : { ...caseItem };
    const formattedCase = {
      ...obj,
      id: obj._id?.toString() || obj.id,
    };
    
    res.json({ success: true, data: formattedCase });
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