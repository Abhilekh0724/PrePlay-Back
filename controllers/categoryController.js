// controllers/categoryController.js
const Category = require('../models/categoryModels');

// Create Category
exports.createCategory = async (req, res) => {
  try {
    const newCategory = new Category(req.body);
    if (req.file) {
      newCategory.photo = `/uploads/${req.file.filename}`;
    }
    await newCategory.save();
    res.status(201).json({ success: true, category: newCategory });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get All Categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json({ success: true, categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update Category
exports.updateCategory = async (req, res) => {
  try {
    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      { ...req.body, photo: req.file ? `/uploads/${req.file.filename}` : undefined },
      { new: true }
    );
    if (!updatedCategory) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    res.status(200).json({ success: true, category: updatedCategory });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete Category
exports.deleteCategory = async (req, res) => {
  try {
    const deletedCategory = await Category.findByIdAndDelete(req.params.id);
    if (!deletedCategory) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    res.status(200).json({ success: true, message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// routes/categoryRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory
} = require('../controllers/categoryController');

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });
