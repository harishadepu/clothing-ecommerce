import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name: { type: String, required: true },
  size: { type: String, required: true },
  qty: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true, min: 0 },
}, { _id: false });

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [orderItemSchema],
  totalPrice: { type: Number, required: true, min: 0 },
  orderDate: { type: Date, default: () => new Date() },
  status: { type: String, enum: ['placed', 'processing', 'shipped', 'delivered'], default: 'placed' },
}, { timestamps: true });

export default mongoose.model('Order', orderSchema);