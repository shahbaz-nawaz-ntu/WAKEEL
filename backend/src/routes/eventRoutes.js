import express from 'express';
import {
  getEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
  completeEvent,
} from '../controllers/eventController.js';
import { protect } from '../middleware/auth.js';
import { validateEvent, validate } from '../middleware/validation.js';

const router = express.Router();

router.route('/')
  .get(protect, getEvents)
  .post(protect, validateEvent, validate, createEvent);

router.route('/:id')
  .get(protect, getEvent)
  .put(protect, validateEvent, validate, updateEvent)
  .delete(protect, deleteEvent);

router.patch('/:id/complete', protect, completeEvent);

export default router;