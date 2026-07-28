// backend/src/routes/partyRoutes.js
import express from 'express';
import {
  createParty,
  getParties,
  getPartiesByCase,
  updateParty,
  deleteParty
} from '../controllers/partyController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// ✅ All routes are protected
router.route('/')
  .get(protect, getParties)
  .post(protect, createParty);

// ✅ Get parties by case
router.get('/case/:caseId', protect, getPartiesByCase);

router.route('/:id')
  .put(protect, updateParty)
  .delete(protect, deleteParty);

// ✅ YEH LINE IMPORTANT HAI - export default
export default router;