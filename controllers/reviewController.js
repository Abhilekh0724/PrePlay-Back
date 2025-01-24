const mongoose = require("mongoose");
const Review = require("../models/reviewModels");
const User = require("../models/userModels");
const Product = require("../models/productModels"); // Changed from Category to Product

// Create a new review
exports.createReview = async (req, res) => {
  try {
    console.log("Received review data:", req.body);
    console.log("User from token:", req.user);

    const { productId, comment, rating } = req.body; // Changed categoryId to productId
    const userId = req.user.id;

    // Validate inputs
    if (!productId || !comment || !rating) {
      console.log("Missing required fields:", { productId, comment, rating });
      return res.status(400).json({
        success: false,
        message: "All fields are required",
        received: { productId, comment, rating },
      });
    }

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      console.log("Invalid productId:", productId);
      return res.status(400).json({ success: false, message: "Invalid productId" });
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      console.log("User not found:", userId);
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Check if product exists
    const product = await Product.findById(productId); // Check against Product model
    if (!product) {
      console.log("Product not found:", productId);
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    // Create review object
    const review = new Review({
      productId, // Changed from categoryId to productId
      userId,
      comment,
      rating,
    });

    console.log("Created review object:", review);

    // Save the review
    const savedReview = await review.save();
    console.log("Saved review:", savedReview);

    // Update product's average rating (if needed)
    const reviews = await Review.find({ productId }); // Fetch reviews for the product
    const averageRating =
      reviews.reduce((acc, rev) => acc + rev.rating, 0) / reviews.length;

    product.averageRating = averageRating; // Update product's averageRating
    await product.save();

    res.status(201).json({ success: true, review: savedReview });
  } catch (error) {
    console.error("Error in createReview:", error);
    console.error("Error stack:", error.stack);
    res.status(500).json({
      success: false,
      message: "Failed to create review",
      error: error.message,
      stack: error.stack,
    });
  }
};

// Get reviews for a product
exports.getReviewsByProduct = async (req, res) => {
  try {
    console.log("Getting reviews for product:", req.params.productId);

    const { productId } = req.params; // Changed categoryId to productId

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      console.log("Invalid productId:", productId);
      return res.status(400).json({ success: false, message: "Invalid productId" });
    }

    const reviews = await Review.find({ productId }) // Fetch reviews for the product
      .populate("userId", "firstName lastName") // Populate user details
      .sort({ createdAt: -1 });

    console.log("Found reviews:", reviews);
    res.status(200).json({ success: true, reviews });
  } catch (error) {
    console.error("Error in getReviewsByProduct:", error);
    console.error("Error stack:", error.stack);
    res.status(500).json({
      success: false,
      message: "Failed to fetch reviews",
      error: error.message,
      stack: error.stack,
    });
  }
};
