import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import authRoutes from "./routes/authRoutes.js";
import productRoutes from './routes/productRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import orderRoutes from './routes/orderRoutes.js';

dotenv.config();
await connectDB();

const app = express();
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());

const allowedOrigins = [
  'http://localhost:5173']

app.use(cors({ origin: allowedOrigins,
  credentials: true,
}));


app.get("/",(req,res)=>{
  res.send("welcome to ecommers")
})

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);

// Centralized error handler
app.use((err, req, res, next) => {
  console.error(err);
  const status = err.statusCode || 500;
  res.status(status).json({ error: err.message || 'Server error' });
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on ${port}`));