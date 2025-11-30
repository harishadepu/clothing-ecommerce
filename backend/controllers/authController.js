// backend/src/controllers/auth.controller.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Cart from '../models/Cart.js';

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ error: 'Email already registered' });
    const hash = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email, password: hash });
    await Cart.create({ user: user._id, items: [] });
    res.status(201).json({ id: user._id, name: user.name, email: user.email });
  } catch (e) { next(e); }
};

export const login = async (req, res, next) => {
  try {
    const { email, password, guestItems } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

    // merge guest cart logic here...

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    // When app is deployed across different origins (frontend <> backend) we must
    // set SameSite=None and Secure=true so browsers will include the cookie in
    // cross-site XHR/fetch requests. In development (localhost) use 'lax'.
    const cookieOptions = {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      secure: process.env.NODE_ENV === 'production',
    };
    res.cookie('token', token, cookieOptions);
    res.json({ id: user._id, name: user.name, email: user.email });
  } catch (e) { next(e); }
};

export const logout = (req, res) => {
  // Clear cookie with same options so browsers remove it correctly in prod
  res.clearCookie('token', { sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', secure: process.env.NODE_ENV === 'production' });
  res.json({ ok: true });
};