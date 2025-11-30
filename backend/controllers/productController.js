import Product from '../models/Product.js';

// Get products with filters
export const getProducts = async (req, res, next) => {
  try {
    const { search = '', category, size, minPrice, maxPrice, page = 1, limit = 10 } = req.query;

    const q = {};
    if (category) q.category = category;
    if (size) q.sizes = size;
    const price = {};
    if (minPrice !== undefined) price.$gte = Number(minPrice);
    if (maxPrice !== undefined) price.$lte = Number(maxPrice);
    if (Object.keys(price).length) q.price = price;
    if (search) q.$text = { $search: search };

    const skip = (Number(page) - 1) * Number(limit);

    const [items, total] = await Promise.all([
      Product.find(q).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Product.countDocuments(q),
    ]);

    res.json({ items, page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / Number(limit)) });
  } catch (e) { next(e); }
};

// Get single product
export const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Not found' });
    res.json(product);
  } catch (e) { next(e); }
};