const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { authGuard } = require("../middleware/authGuard");

// Route to create a review
router.post('/', authGuard, reviewController.createReview);

// Route to get reviews for a category
router.get('/:categoryId', reviewController.getReviewsByCategory);

module.exports = router;