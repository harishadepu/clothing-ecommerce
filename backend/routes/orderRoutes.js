// backend/src/routes/order.routes.js
import { Router } from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  placeOrder,
  getOrderById,
  getUserOrders,
  getAllOrders,
  updateOrderStatus,
} from '../controllers/orderController.js';

const router = Router();

router.post('/', protect, placeOrder);
router.get('/:id', protect, getOrderById);
router.get('/', protect, getUserOrders);

// Admin-only
router.get('/admin/all', protect, getAllOrders);
router.put('/admin/:id/status', protect, updateOrderStatus);

export default router;