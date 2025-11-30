import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Product from './models/Product.js';

dotenv.config();

const products = [
  {
    name: "Men Denim Jacket",
    description: "Classic fit",
    price: 79.99,
    image: "https://picsum.photos/seed/jacket/600/400",
    category: "Men",
    sizes: ["M", "L", "XL"],
    stock: 25,
  },
  {
    name: "Women Summer Dress",
    description: "Lightweight floral design",
    price: 49.99,
    image: "https://picsum.photos/seed/dress/600/400",
    category: "Women",
    sizes: ["S", "M", "L"],
    stock: 30,
  },
  {
    name: "Kids Hoodie",
    description: "Warm and cozy",
    price: 29.99,
    image: "https://picsum.photos/seed/hoodie/600/400",
    category: "Kids",
    sizes: ["XS", "S", "M"],
    stock: 40,
  },
  {
    name: "Men Formal Shirt",
    description: "Slim fit cotton shirt",
    price: 39.99,
    image: "https://picsum.photos/seed/shirt/600/400",
    category: "Men",
    sizes: ["M", "L", "XL"],
    stock: 50,
  },
  {
    name: "Women Jeans",
    description: "Skinny fit denim",
    price: 59.99,
    image: "https://picsum.photos/seed/jeans/600/400",
    category: "Women",
    sizes: ["S", "M", "L", "XL"],
    stock: 35,
  },
  {
    name: "Kids Sneakers",
    description: "Comfortable everyday shoes",
    price: 34.99,
    image: "https://picsum.photos/seed/sneakers/600/400",
    category: "Kids",
    sizes: ["28", "30", "32"],
    stock: 20,
  },
  {
    name: "Men Leather Belt",
    description: "Durable genuine leather",
    price: 24.99,
    image: "https://picsum.photos/seed/belt/600/400",
    category: "Men",
    sizes: ["M", "L"],
    stock: 60,
  },
  {
    name: "Women Blazer",
    description: "Elegant office wear",
    price: 89.99,
    image: "https://picsum.photos/seed/blazer/600/400",
    category: "Women",
    sizes: ["S", "M", "L"],
    stock: 15,
  },
  {
    name: "Kids T-Shirt",
    description: "Colorful cotton tee",
    price: 19.99,
    image: "https://picsum.photos/seed/kidstshirt/600/400",
    category: "Kids",
    sizes: ["XS", "S", "M"],
    stock: 45,
  },
  {
    name: "Men Sneakers",
    description: "Sporty running shoes",
    price: 69.99,
    image: "https://picsum.photos/seed/mensneakers/600/400",
    category: "Men",
    sizes: ["M", "L", "XL"],
    stock: 25,
  },
  {
    name: "Women Handbag",
    description: "Stylish leather bag",
    price: 99.99,
    image: "https://picsum.photos/seed/handbag/600/400",
    category: "Women",
    sizes: [],
    stock: 20,
  },
  {
    name: "Kids Shorts",
    description: "Light cotton shorts",
    price: 24.99,
    image: "https://picsum.photos/seed/shorts/600/400",
    category: "Kids",
    sizes: ["XS", "S", "M"],
    stock: 30,
  },
  {
    name: "Men Hoodie",
    description: "Casual fleece hoodie",
    price: 54.99,
    image: "https://picsum.photos/seed/menhoodie/600/400",
    category: "Men",
    sizes: ["M", "L", "XL"],
    stock: 40,
  },
  {
    name: "Women Skirt",
    description: "Pleated midi skirt",
    price: 44.99,
    image: "https://picsum.photos/seed/skirt/600/400",
    category: "Women",
    sizes: ["S", "M", "L"],
    stock: 25,
  },
  {
    name: "Kids Jacket",
    description: "Winter warm jacket",
    price: 59.99,
    image: "https://picsum.photos/seed/kidsjacket/600/400",
    category: "Kids",
    sizes: ["XS", "S", "M"],
    stock: 20,
  },
  {
    name: "Men Polo Shirt",
    description: "Casual polo",
    price: 34.99,
    image: "https://picsum.photos/seed/polo/600/400",
    category: "Men",
    sizes: ["M", "L", "XL"],
    stock: 50,
  },
  {
    name: "Women Heels",
    description: "Elegant high heels",
    price: 79.99,
    image: "https://picsum.photos/seed/heels/600/400",
    category: "Women",
    sizes: ["36", "37", "38", "39"],
    stock: 15,
  },
  {
    name: "Kids Cap",
    description: "Adjustable cotton cap",
    price: 14.99,
    image: "https://picsum.photos/seed/cap/600/400",
    category: "Kids",
    sizes: [],
    stock: 60,
  },
  {
    name: "Men Suit",
    description: "Formal two-piece suit",
    price: 199.99,
    image: "https://picsum.photos/seed/suit/600/400",
    category: "Men",
    sizes: ["M", "L", "XL"],
    stock: 10,
  },
  {
    name: "Women Scarf",
    description: "Silk patterned scarf",
    price: 29.99,
    image: "https://picsum.photos/seed/scarf/600/400",
    category: "Women",
    sizes: [],
    stock: 35,
  }
];

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await Product.insertMany(products);
    console.log('Seeded products:', products.length);
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();