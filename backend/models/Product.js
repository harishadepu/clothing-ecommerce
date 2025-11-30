import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  price: { type: Number, required: true, min: 0 },
  image: { type: String, default: '' },
  category: { type: String, required: true },
  sizes: [{ type: String }], // e.g. ['S','M','L','XL']
  stock: { type: Number, default: 0, min: 0 },
}, { timestamps: true });

// Enable text search on name + description
productSchema.index({ name: 'text', description: 'text' });

export default mongoose.model('Product', productSchema);