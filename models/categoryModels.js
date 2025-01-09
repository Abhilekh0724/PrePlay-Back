// models/Category.js
const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: [String], required: true },
  type: { type: String, enum: ['PC', 'Mobile'], required: true },
  price: { type: Number, default: 0 },
  releaseDate: { type: Date },
  photo: { type: String, required: true },
  isGlobal: { type: Boolean, default: false },
  mode: { type: String, enum: ['download', 'buy', 'prebook'], required: true }
}, { timestamps: true });

const Category = mongoose.model('Category', categorySchema);
module.exports = Category;
