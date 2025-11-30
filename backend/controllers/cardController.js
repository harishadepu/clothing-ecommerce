import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

// Utility: merge duplicate entries (product + size)
const mergeDuplicates = (items) => {
  const map = new Map();
  for (const it of items) {
    const key = `${it.product.toString()}|${it.size}`;
    const cur = map.get(key) || { product: it.product, size: it.size, qty: 0 };
    cur.qty += Number(it.qty) || 0;
    map.set(key, cur);
  }
  return Array.from(map.values());
};

// Get cart
export const getCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id })
      .populate('items.product', 'name price image sizes stock');

    if (!cart) {
      cart = await Cart.create({ user: req.user.id, items: [] });
    }

    res.json(cart);
  } catch (e) {
    next(e);
  }
};

// Add item
export const addToCart = async (req, res, next) => {
  try {
    const { productId, size, qty } = req.body;

    if (!qty || qty < 1) {
      return res.status(400).json({ error: "Quantity must be at least 1" });
    }

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    if (!product.sizes.includes(size)) {
      return res.status(400).json({ error: 'Invalid size' });
    }

    // Find or create cart
    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) cart = await Cart.create({ user: req.user.id, items: [] });

    // Add or increment
    const idx = cart.items.findIndex(
      (i) => i.product.toString() === productId && i.size === size
    );

    if (idx >= 0) {
      cart.items[idx].qty += Number(qty);
    } else {
      cart.items.push({ product: productId, size, qty });
    }

    // Deduplicate
    cart.items = mergeDuplicates(cart.items);
    await cart.save();

    const populated = await cart.populate(
      "items.product",
      "name price image sizes stock"
    );
    res.json(populated);
  } catch (e) {
    next(e);
  }
};

// Update item
export const updateCartItem = async (req, res, next) => {
  try {
    const { productId, size, qty } = req.body;

    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) return res.status(404).json({ error: "Cart not found" });

    const item = cart.items.find(
      (i) => i.product.toString() === productId && i.size === size
    );
    if (!item) return res.status(404).json({ error: "Item not found" });

    // Remove if qty <= 0
    if (qty <= 0) {
      cart.items = cart.items.filter(
        (i) => !(i.product.toString() === productId && i.size === size)
      );
    } else {
      item.qty = Number(qty);
      cart.items = mergeDuplicates(cart.items);
    }

    await cart.save();

    const populated = await cart.populate(
      "items.product",
      "name price image sizes stock"
    );
    res.json(populated);
  } catch (e) {
    next(e);
  }
};

// Remove item
export const removeCartItem = async (req, res, next) => {
  try {
    const { productId, size } = req.body;

    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) return res.status(404).json({ error: "Cart not found" });

    cart.items = cart.items.filter(
      (i) => !(i.product.toString() === productId && i.size === size)
    );

    // Deduplicate remaining items just in case
    cart.items = mergeDuplicates(cart.items);

    await cart.save();

    const populated = await cart.populate(
      "items.product",
      "name price image sizes stock"
    );
    res.json(populated);
  } catch (e) {
    next(e);
  }
};
