const mongoose = require('mongoose');

const sizeStockSchema = new mongoose.Schema({
  size: { type: String, required: true, enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'ONE SIZE'] },
  stock: { type: Number, required: true, default: 0, min: 0 }
}, { _id: false });

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  compareAtPrice: { type: Number, default: 0, min: 0 },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  images: [{ type: String, required: true }],
  sizes: [sizeStockSchema],
  colorway: { type: String, default: 'Obsidian Black / Blood Crimson' },
  isLimitedEdition: { type: Boolean, default: false },
  dropDate: { type: Date, default: null },
  tags: [{ type: String, trim: true }],
  totalStock: { type: Number, default: 0 },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  numReviews: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

productSchema.index({ category: 1 });
productSchema.index({ name: 'text', description: 'text' });

productSchema.pre('save', function (next) {
  if (this.sizes && this.sizes.length > 0) {
    this.totalStock = this.sizes.reduce((acc, curr) => acc + (curr.stock || 0), 0);
  }
  next();
});

module.exports = mongoose.model('Product', productSchema);
