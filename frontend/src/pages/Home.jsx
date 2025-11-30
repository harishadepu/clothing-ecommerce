import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import ProductCard from "../components/ProductCard";

export default function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get("/products", { params: { limit: 4 } }); 
        setProducts(data.items || []);
      } catch (err) {
        console.error("Failed to load products", err);
      }
    };
    load();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-6">
      {products.length > 0 ? (
        <div>
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
            Featured Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
          <div className="flex justify-center mt-8">
            <Link
              to="/products"
              className="bg-blue-600 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700 transition-colors"
            >
              View All Products
            </Link>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center bg-white shadow-md rounded-lg p-10 max-w-lg">
            <h2 className="text-3xl font-bold mb-6 text-gray-800">
              Welcome to Clothing Ecommerce
            </h2>
            <p className="text-gray-600 mb-8">
              Discover the latest fashion trends and shop your favorite styles.
            </p>
            <Link
              to="/products"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700 transition-colors"
            >
              Browse Products
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}