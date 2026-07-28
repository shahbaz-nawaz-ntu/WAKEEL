// backend/src/routes/proceedingRoutes.js
import express from 'express';
import {
  getAllProceedings,
  getProceedingsByCase,
  getProceeding,
  createProceeding,
  updateProceeding,
  deleteProceeding,
  uploadDocument,
  deleteDocument,
  viewDocument,
} from '../controllers/proceedingController.js';
import { protect } from '../middleware/auth.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// ============================================
// FILE UPLOAD CONFIGURATION
// ============================================
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/proceedings';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    cb(null, name + '-' + uniqueSuffix + ext);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF, JPEG, PNG, DOC, DOCX allowed.'), false);
  }
};

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: fileFilter
});

// ============================================
// 🧪 TEST ROUTE - MUST BE BEFORE /:id
// ============================================
router.get('/test', (req, res) => {
  console.log('🧪 Test route hit!');
  res.json({
    success: true,
    message: 'Proceeding routes are working!',
    user: req.user ? req.user.email : 'No user'
  });
});

// ============================================
// 📋 GET ROUTES (Protected)
// ============================================
router.get('/', protect, getAllProceedings);
router.get('/case/:caseId', protect, getProceedingsByCase);

// ============================================
// ✅ DOCUMENT ROUTES - MUST COME BEFORE /:id
// ============================================

// ✅ Upload document (Protected)
router.post('/:id/documents/:type', protect, upload.single('file'), uploadDocument);

// ✅ Delete document (Protected)
router.delete('/:id/documents/:type/:index', protect, deleteDocument);

// ✅ View document (NO protect middleware - handles auth manually)
router.get('/:id/documents/:type/:index/file', viewDocument);

// ============================================
// 🚀 CRUD ROUTES (Protected)
// ============================================

// ✅ POST create proceeding
router.post('/', protect, createProceeding);

// ✅ GET, PUT, DELETE single proceeding
router.get('/:id', protect, getProceeding);
router.put('/:id', protect, updateProceeding);
router.delete('/:id', protect, deleteProceeding);

export default router;