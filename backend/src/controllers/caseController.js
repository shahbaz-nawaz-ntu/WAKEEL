// backend/src/controllers/caseController.js
import Case from '../models/Case.js';
import User from '../models/User.js';
import { createNotification } from './notificationController.js';

// ============================================
// 🆔 GENERATE UNIQUE CASE NUMBER
// ============================================
const generateCaseNumber = async () => {
  const year = new Date().getFullYear();
  const prefix = `${year}-CV-`;
  
  // Find the last case number with this prefix
  const lastCase = await Case.findOne({ 
    caseNumber: { $regex: `^${prefix}` } 
  }).sort({ caseNumber: -1 });
  
  let nextNumber = 1;
  if (lastCase) {
    const match = lastCase.caseNumber.match(/\d+$/);
    if (match) {
      nextNumber = parseInt(match[0]) + 1;
    }
  }
  
  // Pad with zeros to make 4 digits
  const paddedNumber = String(nextNumber).padStart(4, '0');
  const caseNumber = `${prefix}${paddedNumber}`;
  
  // Verify uniqueness
  const existing = await Case.findOne({ caseNumber });
  if (existing) {
    // If somehow a duplicate exists, recursively try again
    return generateCaseNumber();
  }
  
  return caseNumber;
};

// ============================================
// 🆔 CHECK IF CASE NUMBER EXISTS
// ============================================
export const checkCaseNumber = async (req, res) => {
  try {
    const { caseNumber } = req.params;
    const existingCase = await Case.findOne({ caseNumber });
    
    res.json({
      exists: !!existingCase,
      caseNumber
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ============================================
// 📋 GET ALL CASES
// ============================================
export const getCases = async (req, res) => {
  try {
    const cases = await Case.find({}).sort({ createdAt: -1 });
    
    const formattedCases = cases.map(c => ({
      ...c.toJSON(),
      id: c._id.toString()
    }));
    
    res.status(200).json({
      success: true,
      count: formattedCases.length,
      data: formattedCases
    });
  } catch (error) {
    console.error('Error fetching cases:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ============================================
// 📋 GET SINGLE CASE
// ============================================
export const getCase = async (req, res) => {
  try {
    const caseItem = await Case.findById(req.params.id);
    
    if (!caseItem) {
      return res.status(404).json({
        success: false,
        message: 'Case not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: caseItem
    });
  } catch (error) {
    console.error('Error fetching case:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ============================================
// 📝 CREATE A CASE
// ============================================
export const createCase = async (req, res) => {
  try {
    console.log('📝 Creating case with data:', req.body);
    console.log('📎 Files:', req.files);
    
    // Process uploaded files
    const attachments = {};
    if (req.files) {
      if (req.files.copyOfSummon) {
        attachments.copyOfSummon = req.files.copyOfSummon[0].filename;
        attachments.copyOfSummonUrl = `/uploads/${req.files.copyOfSummon[0].filename}`;
      }
      if (req.files.copyOfPlaint) {
        attachments.copyOfPlaint = req.files.copyOfPlaint[0].filename;
        attachments.copyOfPlaintUrl = `/uploads/${req.files.copyOfPlaint[0].filename}`;
      }
      if (req.files.relevantDepartmentalRecord) {
        attachments.relevantDepartmentalRecord = req.files.relevantDepartmentalRecord[0].filename;
        attachments.relevantDepartmentalRecordUrl = `/uploads/${req.files.relevantDepartmentalRecord[0].filename}`;
      }
    }
    
    // ✅ AUTO-GENERATE CASE NUMBER if not provided
    let caseNumber = req.body.caseNumber;
    if (!caseNumber || caseNumber === '' || caseNumber === 'auto') {
      caseNumber = await generateCaseNumber();
      console.log('🆔 Auto-generated case number:', caseNumber);
    } else {
      // Check if provided case number already exists
      const existing = await Case.findOne({ caseNumber });
      if (existing) {
        console.log('⚠️ Case number already exists, generating new one...');
        caseNumber = await generateCaseNumber();
        console.log('🆔 New case number:', caseNumber);
      }
    }
    
    // Merge attachments with request body
    const caseData = {
      ...req.body,
      caseNumber, // ✅ Use the (possibly new) case number
      ...attachments,
      createdBy: req.user._id
    };
    
    // Parse JSON fields if they are strings
    if (typeof caseData.caseNature === 'string') {
      try {
        caseData.caseNature = JSON.parse(caseData.caseNature);
      } catch (e) {
        caseData.caseNature = { trial: caseData.caseNature };
      }
    }
    
    if (typeof caseData.courtDetails === 'string') {
      try {
        caseData.courtDetails = JSON.parse(caseData.courtDetails);
      } catch (e) {
        caseData.courtDetails = { courtName: caseData.courtDetails };
      }
    }
    
    if (typeof caseData.associate === 'string') {
      try {
        caseData.associate = JSON.parse(caseData.associate);
      } catch (e) {
        caseData.associate = {};
      }
    }
    
    if (typeof caseData.documents === 'string') {
      try {
        caseData.documents = JSON.parse(caseData.documents);
      } catch (e) {
        caseData.documents = {};
      }
    }
    
    if (typeof caseData.attachments === 'string') {
      try {
        caseData.attachments = JSON.parse(caseData.attachments);
      } catch (e) {
        caseData.attachments = {};
      }
    }
    
    if (typeof caseData.lawOfficer === 'string') {
      try {
        caseData.lawOfficer = JSON.parse(caseData.lawOfficer);
      } catch (e) {
        caseData.lawOfficer = {};
      }
    }
    
    if (typeof caseData.alternateLawOfficer === 'string') {
      try {
        caseData.alternateLawOfficer = JSON.parse(caseData.alternateLawOfficer);
      } catch (e) {
        caseData.alternateLawOfficer = {};
      }
    }
    
    // ✅ Create the case
    const newCase = await Case.create(caseData);
    console.log('✅ Case created with number:', newCase.caseNumber);
    console.log('✅ Case ID:', newCase._id);
    
    // ============================================
    // 🔔 SEND NOTIFICATIONS
    // ============================================
    console.log('🔔 ===== NOTIFICATION DEBUG START =====');
    console.log('🔔 Case ID:', newCase._id);
    console.log('🔔 Case Number:', newCase.caseNumber);
    console.log('🔔 User ID:', req.user?._id);
    
    const io = req.app.get('io');
    console.log('🔔 IO available:', io ? '✅ YES' : '❌ NO');
    
    // 1. Notify the user who created the case
    if (req.user && req.user._id) {
      const caseTitle = newCase.caseTitle || newCase.title || 'Untitled Case';
      
      console.log('🔔 Creating notification for user:', req.user._id);
      console.log('🔔 Case title:', caseTitle);
      
      try {
        const result = await createNotification(
          req.user._id,
          'case_created',
          '📋 New Case Created',
          `Case "${caseTitle}" (${newCase.caseNumber}) has been created successfully`,
          {
            caseId: newCase._id,
            caseNumber: newCase.caseNumber,
            caseTitle: caseTitle,
            plaintiff: newCase.plaintiff,
            defendant: newCase.defendant
          },
          req
        );
        
        console.log('🔔 Notification created successfully! ✅');
      } catch (notifError) {
        console.error('❌ Error creating notification:', notifError);
      }
    } else {
      console.log('❌ No user found in request, skipping notification');
    }
    
    // 2. Notify all admin users (optional)
    try {
      const admins = await User.find({ role: 'admin' });
      const caseTitle = newCase.caseTitle || newCase.title || 'Untitled Case';
      const creatorName = req.user?.name || 'A user';
      
      console.log(`🔔 Found ${admins.length} admin(s)`);
      
      for (const admin of admins) {
        if (admin._id.toString() !== req.user._id.toString()) {
          console.log(`🔔 Sending admin notification to: ${admin._id}`);
          await createNotification(
            admin._id,
            'case_created',
            '📋 New Case Created',
            `Case "${caseTitle}" (${newCase.caseNumber}) was created by ${creatorName}`,
            {
              caseId: newCase._id,
              caseNumber: newCase.caseNumber,
              caseTitle: caseTitle,
              createdBy: creatorName,
              createdById: req.user._id
            },
            req
          );
        }
      }
      if (admins.length > 0) {
        console.log(`🔔 Notifications sent to ${admins.length} admin(s)`);
      }
    } catch (adminError) {
      console.error('Error sending admin notifications:', adminError);
    }
    
    console.log('🔔 ===== NOTIFICATION DEBUG END =====');
    
    res.status(201).json({
      success: true,
      data: newCase,
      message: 'Case created successfully'
    });
  } catch (error) {
    console.error('❌ Error creating case:', error);
    
    // ✅ Handle duplicate key error specifically
    if (error.code === 11000) {
      console.log('⚠️ Duplicate case number detected, retrying with new number...');
      try {
        const newCaseNumber = await generateCaseNumber();
        console.log('🆔 New case number for retry:', newCaseNumber);
        
        const retryData = {
          ...req.body,
          caseNumber: newCaseNumber,
          createdBy: req.user._id
        };
        
        const retryCase = await Case.create(retryData);
        console.log('✅ Case created on retry:', retryCase.caseNumber);
        
        return res.status(201).json({
          success: true,
          data: retryCase,
          message: 'Case created successfully (auto-generated number)'
        });
      } catch (retryError) {
        console.error('❌ Retry failed:', retryError);
        return res.status(500).json({
          success: false,
          message: 'Failed to create case after retry',
          error: retryError.message
        });
      }
    }
    
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ============================================
// 📝 UPDATE A CASE
// ============================================
export const updateCase = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('📝 Updating case:', id);
    
    const existingCase = await Case.findById(id);
    if (!existingCase) {
      return res.status(404).json({
        success: false,
        message: 'Case not found'
      });
    }
    
    // Track what changed for notification
    const changes = [];
    const updateData = { ...req.body };
    
    // Parse JSON fields if they are strings
    const jsonFields = ['caseNature', 'courtDetails', 'associate', 'documents', 'attachments', 'lawOfficer', 'alternateLawOfficer'];
    jsonFields.forEach(field => {
      if (typeof updateData[field] === 'string') {
        try {
          updateData[field] = JSON.parse(updateData[field]);
        } catch (e) {
          // Keep as string if not valid JSON
        }
      }
    });
    
    // Track changes for notification
    if (updateData.caseTitle && updateData.caseTitle !== existingCase.caseTitle) {
      changes.push(`title changed to "${updateData.caseTitle}"`);
    }
    if (updateData.status && updateData.status !== existingCase.status) {
      changes.push(`status changed to ${updateData.status}`);
    }
    if (updateData.plaintiff && updateData.plaintiff !== existingCase.plaintiff) {
      changes.push(`plaintiff changed to "${updateData.plaintiff}"`);
    }
    if (updateData.defendant && updateData.defendant !== existingCase.defendant) {
      changes.push(`defendant changed to "${updateData.defendant}"`);
    }
    
    const updatedCase = await Case.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!updatedCase) {
      return res.status(404).json({
        success: false,
        message: 'Case not found'
      });
    }
    
    // ============================================
    // 🔔 SEND NOTIFICATION FOR UPDATE
    // ============================================
    if (req.user && req.user._id && changes.length > 0) {
      const caseTitle = updatedCase.caseTitle || updatedCase.title || 'Untitled Case';
      const changeSummary = changes.join(', ');
      
      await createNotification(
        req.user._id,
        'case_updated',
        '✏️ Case Updated',
        `Case "${caseTitle}" has been updated: ${changeSummary}`,
        {
          caseId: updatedCase._id,
          caseNumber: updatedCase.caseNumber,
          caseTitle: caseTitle,
          changes: changes,
          updatedFields: Object.keys(updateData)
        },
        req
      );
      console.log('🔔 Update notification sent to:', req.user._id);
    }
    
    res.status(200).json({
      success: true,
      data: updatedCase,
      message: 'Case updated successfully'
    });
  } catch (error) {
    console.error('❌ Error updating case:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ============================================
// 🔄 UPDATE CASE STATUS
// ============================================
export const updateCaseStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required'
      });
    }
    
    const existingCase = await Case.findById(id);
    if (!existingCase) {
      return res.status(404).json({
        success: false,
        message: 'Case not found'
      });
    }
    
    const oldStatus = existingCase.status || 'unknown';
    const updatedCase = await Case.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );
    
    // ============================================
    // 🔔 SEND NOTIFICATION FOR STATUS CHANGE
    // ============================================
    if (req.user && req.user._id && oldStatus !== status) {
      const statusEmojis = {
        'active': '🟢',
        'pending': '🟡',
        'closed': '🔴'
      };
      const emoji = statusEmojis[status] || '🔄';
      const caseTitle = updatedCase.caseTitle || updatedCase.title || 'Untitled Case';
      
      await createNotification(
        req.user._id,
        'case_status_changed',
        `${emoji} Case Status Changed`,
        `Case "${caseTitle}" status changed from ${oldStatus} to ${status}`,
        {
          caseId: updatedCase._id,
          caseNumber: updatedCase.caseNumber,
          caseTitle: caseTitle,
          oldStatus: oldStatus,
          newStatus: status
        },
        req
      );
      
      // Also notify the user who originally created the case if different
      if (existingCase.createdBy && existingCase.createdBy.toString() !== req.user._id.toString()) {
        await createNotification(
          existingCase.createdBy,
          'case_status_changed',
          `${emoji} Case Status Changed`,
          `Case "${caseTitle}" status changed from ${oldStatus} to ${status} by ${req.user.name || 'a user'}`,
          {
            caseId: updatedCase._id,
            caseNumber: updatedCase.caseNumber,
            caseTitle: caseTitle,
            oldStatus: oldStatus,
            newStatus: status,
            changedBy: req.user.name
          },
          req
        );
      }
      
      console.log('🔔 Status change notification sent');
    }
    
    res.status(200).json({
      success: true,
      data: updatedCase,
      message: 'Status updated successfully'
    });
  } catch (error) {
    console.error('❌ Error updating status:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ============================================
// 🗑️ DELETE A CASE
// ============================================
export const deleteCase = async (req, res) => {
  try {
    const { id } = req.params;
    
    const deletedCase = await Case.findByIdAndDelete(id);
    
    if (!deletedCase) {
      return res.status(404).json({
        success: false,
        message: 'Case not found'
      });
    }
    
    // ============================================
    // 🔔 SEND NOTIFICATION FOR DELETION
    // ============================================
    if (req.user && req.user._id) {
      const caseTitle = deletedCase.caseTitle || deletedCase.title || 'Untitled Case';
      
      await createNotification(
        req.user._id,
        'case_closed',
        '🗑️ Case Deleted',
        `Case "${caseTitle}" has been deleted`,
        {
          caseId: deletedCase._id,
          caseNumber: deletedCase.caseNumber,
          caseTitle: caseTitle
        },
        req
      );
      console.log('🔔 Deletion notification sent to:', req.user._id);
    }
    
    res.status(200).json({
      success: true,
      message: 'Case deleted successfully'
    });
  } catch (error) {
    console.error('❌ Error deleting case:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ============================================
// 📊 GET CASE STATISTICS
// ============================================
export const getCaseStats = async (req, res) => {
  try {
    const total = await Case.countDocuments();
    const active = await Case.countDocuments({ status: 'active' });
    const pending = await Case.countDocuments({ status: 'pending' });
    const closed = await Case.countDocuments({ status: 'closed' });
    
    res.status(200).json({
      success: true,
      data: {
        total,
        active,
        pending,
        closed
      }
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ============================================
// 📎 UPLOAD FILES (MULTER MIDDLEWARE)
// ============================================
export const uploadFiles = (req, res, next) => {
  next();
};