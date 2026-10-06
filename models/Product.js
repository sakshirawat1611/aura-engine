const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  //product details
  productName: { type: String, required: true },
  sku: { type: String, unique: true, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  cost: { type: Number, required: true, min: 0 },
  stockQuantity: { type: Number, required: true, min: 0 },
  reorderLevel: { type: Number, required: true, min: 0 },
  lastUpdated: { type: Date, default: Date.now }
});

productSchema.index({ category: 1 });
productSchema.index({ productName: 1 });

module.exports = mongoose.model('Product', productSchema);