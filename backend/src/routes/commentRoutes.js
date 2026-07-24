// backend/src/routes/commentRoutes.js
import express from 'express';
import {
  getComments,
  getCommentsByCase,
  createComment,
  updateComment,
  deleteComment
} from '../controllers/commentController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// ✅ All routes are protected
router.route('/')
  .get(protect, getComments)
  .post(protect, createComment);

router.get('/case/:caseId', protect, getCommentsByCase);

router.route('/:id')
  .put(protect, updateComment)
  .delete(protect, deleteComment);

export default router;