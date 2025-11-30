import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Cart from '../models/Cart.js';

const signToken = (user) =>
  jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ error: "Email already registered" });

    const hash = await bcrypt.hash(password, 12);

    let user = await User.create({ name, email, password: hash });
    await Cart.create({ user: user._id, items: [] });

    const token = signToken(user);

    user = user.toObject();
    delete user.password;

    // ✅ return token in JSON instead of cookie
    res.status(201).json({ success: true, user, token });
  } catch (e) {
    next(e);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ error: "Invalid credentials" });

    const token = signToken(user);

    const safeUser = user.toObject();
    delete safeUser.password;

    // ✅ return token in JSON instead of cookie
    res.json({ success: true, user: safeUser, token });
  } catch (e) {
    next(e);
  }
};

export const logout = (req, res) => {
  // ✅ nothing to clear, just respond
  res.json({ ok: true });
};

export const getProfile = async (req, res, next) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({ success: true, user });
  } catch (e) {
    next(e);
  }
};