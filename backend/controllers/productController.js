import Product from '../models/Product.js';

// Normalize number safely
const toNumber = (v, fallback = null) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
};

// Get products with filters
export const getProducts = async (req, res, next) => {
  try {
    let {
      search = "",
      category,
      size,
      minPrice,
      maxPrice,
      page = 1,
      limit = 10,
      sort = "newest"
    } = req.query;

    // Pagination sanitization
    page = Math.max(1, toNumber(page, 1));
    limit = Math.max(1, toNumber(limit, 10));
    const skip = (page - 1) * limit;

    // Query object
    const q = {};

    if (category) q.category = category;

    // Allow multiple sizes: ?size=M&size=L
    if (size) {
      q.sizes = Array.isArray(size) ? { $in: size } : size;
    }

    // Price filter
    const price = {};
    if (minPrice !== undefined) price.$gte = toNumber(minPrice, 0);
    if (maxPrice !== undefined) price.$lte = toNumber(maxPrice, Infinity);
    if (Object.keys(price).length) q.price = price;

    // Sorting options
    const sortOptions = {
      newest: { createdAt: -1 },
      oldest: { createdAt: 1 },
      priceAsc: { price: 1 },
      priceDesc: { price: -1 },
    };
    const sortQuery = sortOptions[sort] || sortOptions.newest;

    // Search
    if (search.trim()) {
      // Use text search if text index exists
      q.$text = { $search: search };

      // Fallback if no text index (to avoid 500 errors)
      try {
        const test = await Product.find({ $text: { $search: search } }).limit(1);
      } catch {
        // Graceful fallback to case-insensitive regex search
        delete q.$text;
        q.name = { $regex: search, $options: "i" };
      }
    }

    const [items, total] = await Promise.all([
      Product.find(q).sort(sortQuery).skip(skip).limit(limit),
      Product.countDocuments(q),
    ]);

    res.json({
      items,
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    });
  } catch (e) {
    next(e);
  }
};

// Get single product
export const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Not found" });

    res.json(product);
  } catch (e) {
    next(e);
  }
};
