import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

// Get cart
export const getCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate('items.product', 'name price image sizes stock');
    res.json(cart || { items: [] });
  } catch (e) { next(e); }
};

// Add item
export const addToCart = async (req, res, next) => {
  try {
    const { productId, size, qty } = req.body;
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    if (!product.sizes.includes(size)) return res.status(400).json({ error: 'Invalid size' });

    let cart = await Cart.findOne({ user: req.user.id });
    // If no cart exists for the user, create one
    if (!cart) {
      cart = await Cart.create({ user: req.user.id, items: [] });
    }
    const idx = cart.items.findIndex(i => i.product.toString() === productId && i.size === size);
    if (idx >= 0) cart.items[idx].qty = (cart.items[idx].qty || 0) + Number(qty);
    else cart.items.push({ product: productId, size, qty });

    // Consolidate duplicates: merge any entries with same product+size into a single item
    const map = new Map();
    for (const it of cart.items) {
      const key = `${it.product.toString()}|${it.size}`;
      const cur = map.get(key) || { product: it.product, size: it.size, qty: 0 };
      cur.qty = Number(cur.qty || 0) + Number(it.qty || 0);
      map.set(key, cur);
    }
    cart.items = Array.from(map.values());

    await cart.save();

    // Return populated cart for frontend convenience
    const populated = await cart.populate('items.product', 'name price image sizes stock');
    res.json(populated);
  } catch (e) { next(e); }
};

// Update item
export const updateCartItem = async (req, res, next) => {
  try {
    const { productId, size, qty } = req.body;
    const cart = await Cart.findOne({ user: req.user.id });
    const item = cart.items.find(i => i.product.toString() === productId && i.size === size);
    if (!item) return res.status(404).json({ error: 'Item not found' });

    if (qty <= 0) {
      cart.items = cart.items.filter(i => !(i.product.toString() === productId && i.size === size));
    } else {
      item.qty = Number(qty);
      // After changing qty, deduplicate items to handle any pre-existing duplicates
      const map = new Map();
      for (const it of cart.items) {
        const key = `${it.product.toString()}|${it.size}`;
        const cur = map.get(key) || { product: it.product, size: it.size, qty: 0 };
        cur.qty = Number(cur.qty || 0) + Number(it.qty || 0);
        map.set(key, cur);
      }
      cart.items = Array.from(map.values());
    }
    await cart.save();

    const populated = await cart.populate('items.product', 'name price image sizes stock');
    res.json(populated);
  } catch (e) { next(e); }
};

// Remove item
export const removeCartItem = async (req, res, next) => {
  try {
    const { productId, size } = req.body;

    // Find cart
    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    // Filter out the matching item
    cart.items = cart.items.filter(
      (i) => !(i.product.toString() === productId && i.size === size)
    );

    await cart.save();

    // Populate product details before returning
    const populatedCart = await cart.populate(
      "items.product",
      "name price image sizes stock"
    );

    res.json(populatedCart);
  } catch (e) {
    next(e);
  }
};