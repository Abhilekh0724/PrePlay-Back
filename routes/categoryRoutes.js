const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { authGuard } = require('../middleware/authGuard');
const {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory
} = require('../controllers/categoryController');

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb('Error: Images only!');
    }
  }
});

// Routes
router.post('/', authGuard, upload.single('photo'), createCategory);
router.get('/', getCategories);
router.put('/:id', authGuard, upload.single('photo'), updateCategory);
router.delete('/:id', authGuard, deleteCategory);

module.exports = router;
