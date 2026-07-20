// backend/src/controllers/referenceController.js
import Reference from '../models/Reference.js';
import logger from '../utils/logger.js';

// ============================================
// GET ALL REFERENCES
// ============================================
export const getReferences = async (req, res) => {
  try {
    const { search, status, practiceArea, court } = req.query;
    
    let query = { userId: req.user.id };
    
    // Search filter
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { caseNumber: { $regex: search, $options: 'i' } },
        { citation: { $regex: search, $options: 'i' } },
        { summary: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
      ];
    }
    
    if (status) query.status = status;
    if (practiceArea) query.practiceArea = practiceArea;
    if (court) query.court = court;
    
    const references = await Reference.find(query)
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: references.length,
      data: references,
    });
  } catch (error) {
    logger.error(`Get references error: ${error}`);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ============================================
// GET SINGLE REFERENCE
// ============================================
export const getReference = async (req, res) => {
  try {
    const reference = await Reference.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });
    
    if (!reference) {
      return res.status(404).json({ success: false, error: 'Reference not found' });
    }
    
    res.json({ success: true, data: reference });
  } catch (error) {
    logger.error(`Get reference error: ${error}`);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ============================================
// CREATE REFERENCE
// ============================================
export const createReference = async (req, res) => {
  try {
    console.log('📥 Creating reference with data:', req.body);
    
    const {
      title,
      caseNumber,
      description,
      citation,
      court,
      judge,
      verdict,
      dateDecided,
      practiceArea,
      summary,
      keyIssues,
      outcomes,
      tags,
      url,
      documents,
      status,
      priority,
    } = req.body;
    
    // Process keyIssues if it's a string
    let processedKeyIssues = keyIssues || [];
    if (typeof keyIssues === 'string') {
      processedKeyIssues = keyIssues.split(',').map(item => item.trim()).filter(item => item);
    }
    
    // Process tags if it's a string
    let processedTags = tags || [];
    if (typeof tags === 'string') {
      processedTags = tags.split(',').map(item => item.trim()).filter(item => item);
    }
    
    const referenceData = {
      title,
      caseNumber: caseNumber || `REF-${Date.now().toString().slice(-8)}`,
      description: description || '',
      citation,
      court,
      judge: judge || '',
      verdict: verdict || 'Pending',
      dateDecided: dateDecided || null,
      practiceArea: practiceArea || '',
      summary: summary || '',
      keyIssues: processedKeyIssues,
      outcomes: outcomes || '',
      tags: processedTags,
      url: url || '',
      documents: documents || { petitioner: [], research: [], defendant: [] },
      status: status || 'active',
      priority: priority || 'Medium',
      userId: req.user.id,
    };
    
    const reference = await Reference.create(referenceData);
    
    logger.info(`Reference created: ${reference.title} by ${req.user.email}`);
    
    res.status(201).json({
      success: true,
      data: reference,
    });
  } catch (error) {
    console.error('❌ Create reference error:', error);
    logger.error(`Create reference error: ${error}`);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ============================================
// UPDATE REFERENCE
// ============================================
export const updateReference = async (req, res) => {
  try {
    let reference = await Reference.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });
    
    if (!reference) {
      return res.status(404).json({ success: false, error: 'Reference not found' });
    }
    
    const {
      title,
      description,
      citation,
      court,
      judge,
      verdict,
      dateDecided,
      practiceArea,
      summary,
      keyIssues,
      outcomes,
      tags,
      url,
      documents,
      status,
      priority,
    } = req.body;
    
    // Process keyIssues
    let processedKeyIssues = keyIssues || reference.keyIssues || [];
    if (typeof keyIssues === 'string') {
      processedKeyIssues = keyIssues.split(',').map(item => item.trim()).filter(item => item);
    }
    
    // Process tags
    let processedTags = tags || reference.tags || [];
    if (typeof tags === 'string') {
      processedTags = tags.split(',').map(item => item.trim()).filter(item => item);
    }
    
    const updateData = {
      title: title || reference.title,
      description: description || reference.description,
      citation: citation || reference.citation,
      court: court || reference.court,
      judge: judge || reference.judge,
      verdict: verdict || reference.verdict,
      dateDecided: dateDecided || reference.dateDecided,
      practiceArea: practiceArea || reference.practiceArea,
      summary: summary || reference.summary,
      keyIssues: processedKeyIssues,
      outcomes: outcomes || reference.outcomes,
      tags: processedTags,
      url: url || reference.url,
      documents: documents || reference.documents,
      status: status || reference.status,
      priority: priority || reference.priority,
      updatedAt: Date.now(),
    };
    
    const updated = await Reference.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    logger.info(`Reference updated: ${updated.title}`);
    
    res.json({
      success: true,
      data: updated,
    });
  } catch (error) {
    console.error('❌ Update reference error:', error);
    logger.error(`Update reference error: ${error}`);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ============================================
// DELETE REFERENCE
// ============================================
export const deleteReference = async (req, res) => {
  try {
    const reference = await Reference.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });
    
    if (!reference) {
      return res.status(404).json({ success: false, error: 'Reference not found' });
    }
    
    await reference.deleteOne();
    
    logger.info(`Reference deleted: ${reference.title}`);
    
    res.json({
      success: true,
      message: 'Reference deleted successfully',
    });
  } catch (error) {
    logger.error(`Delete reference error: ${error}`);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ============================================
// GET REFERENCE STATS
// ============================================
export const getReferenceStats = async (req, res) => {
  try {
    const references = await Reference.find({ userId: req.user.id });
    
    const total = references.length;
    const active = references.filter(r => r.status === 'active').length;
    const pending = references.filter(r => r.status === 'pending').length;
    const archived = references.filter(r => r.status === 'archived').length;
    
    const verdictStats = {
      Upheld: references.filter(r => r.verdict === 'Upheld').length,
      Reversed: references.filter(r => r.verdict === 'Reversed').length,
      Modified: references.filter(r => r.verdict === 'Modified').length,
      Remanded: references.filter(r => r.verdict === 'Remanded').length,
      Dismissed: references.filter(r => r.verdict === 'Dismissed').length,
      Pending: references.filter(r => r.verdict === 'Pending').length,
    };
    
    const practiceAreaStats = {};
    references.forEach(r => {
      if (r.practiceArea) {
        practiceAreaStats[r.practiceArea] = (practiceAreaStats[r.practiceArea] || 0) + 1;
      }
    });
    
    res.json({
      success: true,
      data: {
        total,
        active,
        pending,
        archived,
        verdictStats,
        practiceAreaStats,
      },
    });
  } catch (error) {
    logger.error(`Get reference stats error: ${error}`);
    res.status(500).json({ success: false, error: error.message });
  }
};