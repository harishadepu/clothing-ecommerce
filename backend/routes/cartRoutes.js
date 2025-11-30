import { Router } from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
} from '../controllers/cardController.js';

const router = Router();

router.get('/', protect, getCart);
router.post('/add', protect, addToCart);
router.put('/update', protect, updateCartItem);
router.delete('/remove', protect, removeCartItem);

export default router;