// backend/src/routes/referenceRoutes.js
import express from 'express';
import {
  getReferences,
  getReference,
  createReference,
  updateReference,
  deleteReference,
  getReferenceStats,
} from '../controllers/referenceController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// Stats route
router.get('/stats', getReferenceStats);

// CRUD routes
router.route('/')
  .get(getReferences)
  .post(createReference);

router.route('/:id')
  .get(getReference)
  .put(updateReference)
  .delete(deleteReference);

export default router;