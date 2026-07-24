// backend/src/routes/partyRoutes.js
import express from 'express';
import {
  getParties,
  createParty,
  updateParty,
  deleteParty
} from '../controllers/partyController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// ✅ All routes are protected - This ensures req.user is set
router.route('/')
  .get(protect, getParties)
  .post(protect, createParty);

router.route('/:id')
  .put(protect, updateParty)
  .delete(protect, deleteParty);

export default router;