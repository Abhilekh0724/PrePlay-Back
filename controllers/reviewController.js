const mongoose = require('mongoose');
const Review = require('../models/reviewModels');
const User = require('../models/userModels');
const Category = require('../models/adminModels');

// Create a new review
exports.createReview = async (req, res) => {
  try {
    console.log('Received review data:', req.body);
    console.log('User from token:', req.user);

    const { categoryId, comment, rating } = req.body;
    const userId = req.user.id;

    // Validate inputs
    if (!categoryId || !comment || !rating) {
      console.log('Missing required fields:', { categoryId, comment, rating });
      return res.status(400).json({ 
        success: false, 
        message: 'All fields are required',
        received: { categoryId, comment, rating }
      });
    }

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      console.log('Invalid categoryId:', categoryId);
      return res.status(400).json({ success: false, message: 'Invalid categoryId' });
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      console.log('User not found:', userId);
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Check if category exists
    const category = await Category.findById(categoryId);
    if (!category) {
      console.log('Category not found:', categoryId);
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    // Create review object
    const review = new Review({
      categoryId,
      userId,
      comment,
      rating,
    });

    console.log('Created review object:', review);

    // Save the review
    const savedReview = await review.save();
    console.log('Saved review:', savedReview);

    // Update category's average rating
    const reviews = await Review.find({ categoryId });
    const averageRating = reviews.reduce((acc, rev) => acc + rev.rating, 0) / reviews.length;
    
    category.averageRating = averageRating;
    await category.save();

    res.status(201).json({ success: true, review: savedReview });
  } catch (error) {
    console.error('Error in createReview:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to create review', 
      error: error.message,
      stack: error.stack 
    });
  }
};

// Get reviews for a category
exports.getReviewsByCategory = async (req, res) => {
  try {
    console.log('Getting reviews for category:', req.params.categoryId);
    
    const { categoryId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      console.log('Invalid categoryId:', categoryId);
      return res.status(400).json({ success: false, message: 'Invalid categoryId' });
    }

    const reviews = await Review.find({ categoryId })
      .populate('userId', 'firstName lastName')
      .sort({ createdAt: -1 });

    console.log('Found reviews:', reviews);
    res.status(200).json({ success: true, reviews });
  } catch (error) {
    console.error('Error in getReviewsByCategory:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch reviews', 
      error: error.message,
      stack: error.stack 
    });
  }
};
