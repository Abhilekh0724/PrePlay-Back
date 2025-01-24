const Product = require('../models/productModels');
const fs = require('fs');
const path = require('path');

// Create a new product
const createProduct = async (req, res) => {
  try {
    const { price, name, description, category, type, releaseDate, isGlobal, mode } = req.body;

    if (!req.files || !req.files.photo) {
      return res.status(400).json({
        success: false,
        message: "Photo not found!",
      });
    }

    // Validate required fields
    if (!name || !description || !category || !type || !mode) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields!",
      });
    }

    // Conditional validation for mode
    if (mode === "buy" && !price) {
      return res.status(400).json({
        success: false,
        message: "Price is required for 'buy' mode!",
      });
    }

    if (mode === "prebook" && !releaseDate) {
      return res.status(400).json({
        success: false,
        message: "Release date is required for 'prebook' mode!",
      });
    }

    const { photo } = req.files;
    const photoName = `${Date.now()}-${photo.name}`;
    const photoUploadPath = path.join(__dirname, '../public/uploads', photoName);

    // Save the file to the uploads folder
    fs.writeFileSync(photoUploadPath, photo.data);

    // Safely parse the category field
    let parsedCategory;
    try {
      parsedCategory = Array.isArray(category) ? category : JSON.parse(category);
    } catch (err) {
      return res.status(400).json({
        success: false,
        message: "Invalid category format. Must be a JSON array.",
      });
    }

    // Create new product
    const newProduct = new Product({
      price: mode === "download" ? 0 : price, // Default price to 0 for 'download'
      name,
      description,
      category: parsedCategory,
      type,
      releaseDate: mode === "download" ? null : releaseDate, // Default release date to null for 'download'
      isGlobal,
      mode,
      photo: `/uploads/${photoName}`,
    });

    const product = await newProduct.save();

    res.status(201).json({
      success: true,
      message: "Product created successfully!",
      data: product,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Get all products
const getAllProducts = async (req, res) => {
  try {
    console.log('Fetching all products'); // Debug log
    const products = await Product.find({});
    console.log('Products fetched:', products); // Debug log

    res.status(200).json({
      success: true,
      message: "Products fetched successfully!",
      data: products,
    });
  } catch (error) {
    console.error('Error fetching products:', error); // Debug log
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Search products
const searchProducts = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: "Search query is required!",
      });
    }

    const products = await Product.find({
      name: { $regex: query, $options: 'i' }, // Case-insensitive search
    });

    res.status(200).json({
      success: true,
      message: "Products searched successfully!",
      data: products,
    });
  } catch (error) {
    console.error('Error searching products:', error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Get a product by ID
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product fetched successfully!",
      data: product,
    });
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Update a product
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { price, name, description, category, type, releaseDate, isGlobal, mode } = req.body;
    let photoPath;

    if (!name || !description || !category || !type || !mode) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields!",
      });
    }

    // Conditional validation for mode
    if (mode === "buy" && !price) {
      return res.status(400).json({
        success: false,
        message: "Price is required for 'buy' mode!",
      });
    }

    if (mode === "prebook" && !releaseDate) {
      return res.status(400).json({
        success: false,
        message: "Release date is required for 'prebook' mode!",
      });
    }

    if (req.files && req.files.photo) {
      const { photo } = req.files;
      const photoName = `${Date.now()}-${photo.name}`;
      const photoUploadPath = path.join(__dirname, '../public/uploads', photoName);

      // Save the file to the uploads folder
      fs.writeFileSync(photoUploadPath, photo.data);
      photoPath = `/uploads/${photoName}`;
    }

    // Safely parse the category field
    let parsedCategory;
    try {
      parsedCategory = category ? (Array.isArray(category) ? category : JSON.parse(category)) : undefined;
    } catch (err) {
      return res.status(400).json({
        success: false,
        message: "Invalid category format. Must be a JSON array.",
      });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        price: mode === "download" ? 0 : price, // Default price to 0 for 'download'
        name,
        description,
        category: parsedCategory,
        type,
        releaseDate: mode === "download" ? null : releaseDate, // Default release date to null for 'download'
        isGlobal,
        mode,
        ...(photoPath && { photo: photoPath }),
      },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product updated successfully!",
      data: updatedProduct,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Delete a product
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully!",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  searchProducts, // Added searchProducts
  getProductById, // Added getProductById
  updateProduct,
  deleteProduct,
};
