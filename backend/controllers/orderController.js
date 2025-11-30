import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import { transporter, orderEmailHtml } from '../utils/sendEmail.js';

// Place order
export const placeOrder = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
    if (!cart || cart.items.length === 0) return res.status(400).json({ error: 'Cart empty' });

    // Stock validation
    for (const item of cart.items) {
      if (item.product.stock < item.qty) {
        return res.status(400).json({ error: `Insufficient stock for ${item.product.name}` });
      }
    }
    for (const item of cart.items) {
      await Product.updateOne({ _id: item.product._id }, { $inc: { stock: -item.qty } });
    }

    const items = cart.items.map(i => ({
      product: i.product._id,
      name: i.product.name,
      size: i.size,
      qty: i.qty,
      price: i.product.price,
    }));
    const totalPrice = items.reduce((sum, i) => sum + i.qty * i.price, 0);

    const order = await Order.create({ user: req.user.id, items, totalPrice });
    cart.items = [];
    await cart.save();

    // Email confirmation - don't let email failures block order placement
    try {
      const user = await User.findById(req.user.id);
      await transporter.sendMail({
        from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
        to: user.email,
        subject: `Your order ${order._id} is confirmed`,
        html: orderEmailHtml({ orderId: order._id, date: order.orderDate, items, total: totalPrice }),
      });
    } catch (mailErr) {
      console.error('Order placed but email failed:', mailErr?.message || mailErr);
      // continue — order has been created and cart cleared, email is best-effort
    }

    res.status(201).json(order);
  } catch (e) { next(e); }
};
// Get order by ID
export const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order || order.user.toString() !== req.user.id) {
      return res.status(404).json({ error: 'Not found' });
    }
    res.json(order);
  } catch (e) {
    next(e);
  }
};

// Get all orders for logged-in user
export const getUserOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (e) {
    next(e);
  }
};

// Admin: get all orders
export const getAllOrders = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
    const orders = await Order.find().populate('user', 'name email').sort({ createdAt: -1 });
    res.json(orders);
  } catch (e) {
    next(e);
  }
};

// Admin: update order status
export const updateOrderStatus = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Not found' });
    order.status = status;
    await order.save();
    res.json(order);
  } catch (e) {
    next(e);
  }
};