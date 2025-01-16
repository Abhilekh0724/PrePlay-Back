const mongoose = require('mongoose');

const validCategories = [
  "Action",
  "Horror",
  "Adventure",
  "Racing",
  "Sports",
  "Puzzle",
  "Role-Playing",
  "Strategy",
  "Simulation",
  "Casual",
];

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: { 
      type: [String], 
      required: true, 
      enum: validCategories, // Restrict values to predefined categories
    },
    type: { type: String, enum: ['PC', 'Mobile'], required: true },
    price: { type: Number, default: 0 },
    releaseDate: { type: Date },
    photo: { type: String },
    isGlobal: { type: Boolean, default: false },
    mode: { type: String, enum: ['download', 'buy', 'prebook'], required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Product || mongoose.model('Product', productSchema);
