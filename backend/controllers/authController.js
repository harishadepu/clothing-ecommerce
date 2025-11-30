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
    res.cookie('token', token, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production' });
    res.json({ id: user._id, name: user.name, email: user.email });
  } catch (e) { next(e); }
};

export const logout = (req, res) => {
  res.clearCookie('token');
  res.json({ ok: true });
};