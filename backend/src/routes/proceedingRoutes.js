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
import { fileURLToPath } from 'url';

const router = express.Router();

// ✅ Get __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============================================
// FILE UPLOAD CONFIGURATION - FIXED PATH
// ============================================
console.log('📁 Configuring proceeding uploads...');

// ✅ Use absolute path instead of relative
const uploadsDir = path.join(__dirname, '../uploads');
const proceedingsDir = path.join(uploadsDir, 'proceedings');

console.log(`📁 Uploads directory: ${uploadsDir}`);
console.log(`📁 Proceedings directory: ${proceedingsDir}`);

// ✅ Ensure directories exist
if (!fs.existsSync(uploadsDir)) {
  console.log('📁 Creating uploads directory...');
  fs.mkdirSync(uploadsDir, { recursive: true });
}

if (!fs.existsSync(proceedingsDir)) {
  console.log('📁 Creating proceedings directory...');
  fs.mkdirSync(proceedingsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // ✅ Use absolute path
    cb(null, proceedingsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    cb(null, name + '-' + uniqueSuffix + ext);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'application/pdf', 
    'image/jpeg', 
    'image/png', 
    'application/msword', 
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];
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

console.log('✅ Proceeding uploads configured');

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