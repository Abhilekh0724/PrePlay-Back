const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");
const { authGuard } = require("../middleware/authGuard");

// Create a review for a product
router.post("/", authGuard, reviewController.createReview);

// Get reviews for a specific product
router.get("/:productId", reviewController.getReviewsByProduct);

module.exports = router;
