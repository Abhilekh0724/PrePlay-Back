const express = require('express');
const router = express.Router();
const {
  createProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const { authGuard, adminGuard } = require('../middleware/authGuard');

// Routes
router.post('/', authGuard, adminGuard, createProduct); // Create a product
router.get('/', getAllProducts); // Get all products
router.put('/:id', authGuard, adminGuard, updateProduct); // Update a product
router.delete('/:id', authGuard, adminGuard, deleteProduct); // Delete a product

module.exports = router;
