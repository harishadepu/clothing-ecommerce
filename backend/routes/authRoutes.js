// backend/src/routes/auth.routes.js
import { Router } from 'express';
import { register, login, logout, getProfile } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();
router.post('/register', register);
router.get("/user",protect,getProfile)
router.post('/login', login);
router.post('/logout', logout);

export default router;