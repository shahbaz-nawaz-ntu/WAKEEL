// backend/src/controllers/commentController.js
import Comment from '../models/Comment.js';
import Case from '../models/Case.js';

// ✅ GET ALL COMMENTS
export const getComments = async (req, res) => {
  try {
    console.log('📋 Fetching comments for user:', req.user?._id);
    
    const comments = await Comment.find({ userId: req.user._id })
      .sort({ createdAt: -1 });
    
    console.log(`✅ Found ${comments.length} comments`);
    
    res.status(200).json({
      success: true,
      data: comments
    });
  } catch (error) {
    console.error('❌ Error fetching comments:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// ✅ GET COMMENTS BY CASE
export const getCommentsByCase = async (req, res) => {
  try {
    const { caseId } = req.params;
    console.log(`📋 Fetching comments for case: ${caseId}`);
    
    const comments = await Comment.find({ 
      caseId, 
      userId: req.user._id 
    }).sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      data: comments
    });
  } catch (error) {
    console.error('❌ Error fetching comments by case:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// ✅ CREATE COMMENT - FIXED
export const createComment = async (req, res) => {
  try {
    console.log('📝 Creating comment with data:', req.body);
    console.log('👤 User:', req.user);
    
    const { 
      caseId, 
      commentedBy, 
      remarks, 
      requestToClientDepartment, 
      clientDepartments, 
      attachments, 
      status,
      date 
    } = req.body;
    
    if (!caseId) {
      return res.status(400).json({
        success: false,
        error: 'Case ID is required'
      });
    }
    
    // Check if case exists
    const caseExists = await Case.findById(caseId);
    if (!caseExists) {
      return res.status(404).json({
        success: false,
        error: 'Case not found'
      });
    }
    
    const comment = new Comment({
      caseId,
      commentedBy: commentedBy || 'Unknown User',
      remarks: remarks || '',
      requestToClientDepartment: requestToClientDepartment || '',
      clientDepartments: clientDepartments || '',
      attachments: attachments || [],
      status: status || 'Pending',
      userId: req.user?._id || null,  // ✅ FIX: req.user available hai toh use karein, nahi toh null
      date: date || new Date()
    });
    
    await comment.save();
    console.log('✅ Comment created:', comment);
    
    res.status(201).json({
      success: true,
      data: comment
    });
  } catch (error) {
    console.error('❌ Error creating comment:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// ✅ UPDATE COMMENT
export const updateComment = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`📝 Updating comment: ${id}`);
    
    const comment = await Comment.findOne({ _id: id, userId: req.user._id });
    
    if (!comment) {
      return res.status(404).json({
        success: false,
        error: 'Comment not found'
      });
    }
    
    const { 
      commentedBy, 
      remarks, 
      requestToClientDepartment, 
      clientDepartments, 
      attachments, 
      status,
      date 
    } = req.body;
    
    if (commentedBy) comment.commentedBy = commentedBy;
    if (remarks) comment.remarks = remarks;
    if (requestToClientDepartment) comment.requestToClientDepartment = requestToClientDepartment;
    if (clientDepartments) comment.clientDepartments = clientDepartments;
    if (attachments) comment.attachments = attachments;
    if (status) comment.status = status;
    if (date) comment.date = date;
    
    await comment.save();
    console.log('✅ Comment updated:', comment);
    
    res.status(200).json({
      success: true,
      data: comment
    });
  } catch (error) {
    console.error('❌ Error updating comment:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// ✅ DELETE COMMENT
export const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`🗑️ Deleting comment: ${id}`);
    
    const comment = await Comment.findOne({ _id: id, userId: req.user._id });
    
    if (!comment) {
      return res.status(404).json({
        success: false,
        error: 'Comment not found'
      });
    }
    
    await comment.deleteOne();
    console.log('✅ Comment deleted');
    
    res.status(200).json({
      success: true,
      message: 'Comment deleted successfully'
    });
  } catch (error) {
    console.error('❌ Error deleting comment:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};